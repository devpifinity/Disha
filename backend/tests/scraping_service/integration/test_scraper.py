"""Mocked integration tests for `PlaywrightScraper.scrape`."""

from __future__ import annotations

import logging

from src import playwright_scraper as scraper_mod
from src.playwright_scraper import PlaywrightScraper
from tests.scraping_service.fixtures.playwright_mocks import DummyCard


def test_scrape_skips_preprocessed_colleges_and_updates_set(
    monkeypatch, tmp_path, dummy_page_factory, patch_scraper_playwright
):
    cards = [
        DummyCard(
            name="Alpha College",
            location="Delhi",
            college_id="101",
            course_category="Engineering",
            total_courses=10,
            college_type_label="Private",
            match_percentage="80%",
            match_level="High",
            has_website=True,
        ),
        DummyCard(
            name="Beta Institute",
            location="Mumbai",
            college_id="102",
            course_category="Management",
            total_courses=8,
            college_type_label="Government",
            match_percentage="70%",
            match_level="Medium",
        ),
    ]

    dummy_page = dummy_page_factory(cards)
    patch_scraper_playwright(dummy_page)

    saved = []

    def fake_append(data, output_dir, filename):
        saved.append((filename, data["College Name"]))
        return True

    monkeypatch.setattr(scraper_mod, "append_to_csv", fake_append)
    monkeypatch.setattr(scraper_mod, "append_to_jsonl", fake_append)

    processed = {
        "csv": {"alpha college"},
        "json": {"alpha college"},
    }
    scraper = PlaywrightScraper()
    results = scraper.scrape(
        course_category="Engineering",
        specialization=None,
        city="Delhi",
        university=None,
        output_dir=str(tmp_path),
        base_filename="test",
        headless=True,
        formats=["csv", "json"],
        processed_colleges=processed,
    )

    assert [entry["College Name"] for entry in results] == ["Beta Institute"]
    assert processed["csv"] == {"alpha college", "beta institute"}
    assert processed["json"] == {"alpha college", "beta institute"}
    assert saved == [
        ("test.csv", "Beta Institute"),
        ("test.jsonl", "Beta Institute"),
    ]


def test_scrape_returns_empty_when_no_cards(monkeypatch, tmp_path, dummy_page_factory, patch_scraper_playwright):
    dummy_page = dummy_page_factory(cards=[])
    patch_scraper_playwright(dummy_page)

    monkeypatch.setattr(scraper_mod, "append_to_csv", lambda *args, **kwargs: True)
    monkeypatch.setattr(scraper_mod, "append_to_jsonl", lambda *args, **kwargs: True)

    scraper = PlaywrightScraper()
    results = scraper.scrape(
        course_category=None,
        specialization=None,
        city=None,
        university=None,
        output_dir=str(tmp_path),
        base_filename="empty",
        headless=True,
        formats=["csv"],
        processed_colleges={"csv": set()},
    )

    assert results == []


def test_scrape_logs_warning_when_no_cards(
    monkeypatch, tmp_path, dummy_page_factory, patch_scraper_playwright, caplog
):
    caplog.set_level(logging.INFO, logger="scraping_service")
    dummy_page = dummy_page_factory(cards=[])
    patch_scraper_playwright(dummy_page)

    monkeypatch.setattr(scraper_mod, "append_to_csv", lambda *args, **kwargs: True)
    monkeypatch.setattr(scraper_mod, "append_to_jsonl", lambda *args, **kwargs: True)

    scraper = PlaywrightScraper()
    scraper.scrape(
        course_category=None,
        specialization=None,
        city=None,
        university=None,
        output_dir=str(tmp_path),
        base_filename="empty",
        headless=True,
        formats=["csv"],
        processed_colleges={"csv": set()},
    )

    assert any("Found 0 college cards" in record.message for record in caplog.records)
