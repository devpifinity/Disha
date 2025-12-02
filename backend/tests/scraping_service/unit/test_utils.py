"""Unit tests for `scraping-service` utility helpers."""

import json
import pathlib
import csv

import pytest

from src import utils


@pytest.fixture(autouse=True)
def reset_csv_cache():
    """Guarantee cache state isolation between tests."""
    utils._CSV_NAME_CACHE.clear()
    yield
    utils._CSV_NAME_CACHE.clear()


@pytest.mark.parametrize(
    "raw,expected",
    [
        (None, ""),
        ("   ", ""),
        ("Line 1\nLine   2", "Line 1 Line 2"),
        ("Multiple\tspaces", "Multiple spaces"),
    ],
)
def test_clean_text_normalizes_whitespace(raw, expected):
    assert utils.clean_text(raw) == expected


def test_deduplicate_colleges_prefers_richer_record():
    records = [
        {"College Name": "Acme", "Location": "City"},
        {
            "College Name": "acme",  # case-insensitive duplicate
            "Location": "City",
            "Course Category": "Engineering",
        },
    ]

    deduped = utils.deduplicate_colleges(records)
    assert len(deduped) == 1
    only_entry = deduped[0]
    assert only_entry["Course Category"] == "Engineering"


def test_get_csv_name_cache_reads_once_and_caches(tmp_path: pathlib.Path):
    csv_path = tmp_path / "sample.csv"
    csv_path.write_text("College Name\nAlpha\nBeta\n", encoding="utf-8")

    first = utils._get_csv_name_cache(str(csv_path))
    assert first == {"alpha", "beta"}

    # Modify file after cache warm-up; repeated call should not see new entry
    csv_path.write_text("College Name\nAlpha\nBeta\nGamma\n", encoding="utf-8")
    cached = utils._get_csv_name_cache(str(csv_path))
    assert cached == {"alpha", "beta"}

    # Non-existent file returns empty set
    missing = utils._get_csv_name_cache(str(tmp_path / "missing.csv"))
    assert missing == set()


def test_append_to_csv_creates_file_with_header(tmp_path: pathlib.Path):
    output_dir = tmp_path
    filename = "colleges.csv"
    record = {"College Name": "Gamma", "Location": "City"}

    assert utils.append_to_csv(record, str(output_dir), filename)

    csv_path = output_dir / filename
    assert csv_path.exists()

    with csv_path.open("r", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        rows = list(reader)
        header = reader.fieldnames

    assert header == ["College Name", "Location"]
    assert rows == [record]

    # Duplicate append should be ignored but file stays single-row
    assert utils.append_to_csv(record, str(output_dir), filename)
    with csv_path.open("r", encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))
    assert rows == [record]


def test_append_to_jsonl_handles_special_characters(tmp_path: pathlib.Path):
    output_dir = tmp_path
    filename = "colleges.jsonl"
    record = {"College Name": 'Quote " ,', "Location": "Line\nBreak"}

    assert utils.append_to_jsonl(record, str(output_dir), filename)

    jsonl_path = output_dir / filename
    contents = jsonl_path.read_text(encoding="utf-8").strip().splitlines()
    assert len(contents) == 1
    assert json.loads(contents[0]) == record
def test_load_existing_colleges_handles_corrupt_rows(tmp_path: pathlib.Path):
    output_dir = tmp_path
    base_filename = "Engineering_Test"

    csv_path = output_dir / f"{base_filename}.csv"
    csv_path.write_text(
        "College Name,City\nAlpha,Delhi\nBROKEN_ROW\n", encoding="utf-8"
    )

    jsonl_path = output_dir / f"{base_filename}.jsonl"
    jsonl_path.write_text(
        json.dumps({"College Name": "Beta"}) + "\n" + "{bad json}\n", encoding="utf-8"
    )

    existing = utils.load_existing_colleges(str(output_dir), base_filename)
    assert "alpha" in existing["csv"]
    assert "beta" in existing["json"]
    assert "broken_row" not in existing["csv"]


def test_load_existing_colleges_respects_requested_formats(tmp_path: pathlib.Path):
    output_dir = tmp_path
    base_filename = "Engineering_Test"

    csv_path = output_dir / f"{base_filename}.csv"
    csv_path.write_text("College Name,City\nAlpha,Delhi\n", encoding="utf-8")

    jsonl_path = output_dir / f"{base_filename}.jsonl"
    jsonl_path.write_text(json.dumps({"College Name": "Beta"}) + "\n", encoding="utf-8")

    csv_only = utils.load_existing_colleges(str(output_dir), base_filename, formats=["csv"])
    assert "csv" in csv_only and "json" not in csv_only
    assert csv_only["csv"] == {"alpha"}

    json_only = utils.load_existing_colleges(str(output_dir), base_filename, formats=["json"])
    assert "csv" not in json_only and json_only["json"] == {"beta"}
