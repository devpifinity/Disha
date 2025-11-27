"""Reusable Playwright dummy objects and fixtures for scraping tests."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List

import pytest

from src import playwright_scraper as scraper_mod
from src.playwright_scraper import PlaywrightScraper


class DummyTextElement:
    def __init__(self, text: str):
        self._text = text

    def inner_text(self) -> str:
        return self._text

    def text_content(self) -> str:
        return self._text


class DummyLocator:
    def __init__(self, items: Iterable[DummyTextElement]):
        self._items = list(items)

    def count(self) -> int:
        return len(self._items)

    @property
    def first(self):
        return self._items[0]

    def nth(self, idx: int):
        return self._items[idx]

    def all(self):
        return list(self._items)


@dataclass
class DummyCard:
    name: str
    location: str
    college_id: str
    course_category: str
    total_courses: int
    college_type_label: str
    match_percentage: str
    match_level: str
    has_website: bool = False

    def locator(self, selector: str):
        if selector == "h2":
            return DummyLocator([DummyTextElement(self.name)])
        if selector == "h4.location":
            return DummyLocator([DummyTextElement(self.location)])
        if selector == "a.get-university-website":
            return DummyLocator([DummyTextElement("link")]) if self.has_website else DummyLocator([])
        if selector == "div.scholarship-div span":
            return DummyLocator([DummyTextElement(self.course_category)]) if self.course_category else DummyLocator([])
        if selector == "p.courses-trending":
            text = f"{self.total_courses} Courses"
            return DummyLocator([DummyTextElement(text)])
        if selector == "li":
            return DummyLocator([DummyTextElement(self.college_type_label)])
        if selector == "text.percentage":
            return DummyLocator([DummyTextElement(self.match_percentage)]) if self.match_percentage else DummyLocator([])
        if selector == "div.predictor-box-and-logo h4":
            return DummyLocator([DummyTextElement(self.match_level)]) if self.match_level else DummyLocator([])
        return DummyLocator([])

    def get_attribute(self, name: str):
        if name == "data-id":
            return self.college_id
        return None


class DummyCardLocator:
    def __init__(self, cards: List[DummyCard]):
        self._cards = cards

    def count(self) -> int:
        return len(self._cards)

    def nth(self, idx: int):
        return self._cards[idx]


class DummyPage:
    def __init__(self, cards: List[DummyCard]):
        self.cards = cards
        self.url = ""

    def goto(self, url, timeout=60000):
        self.url = url

    def wait_for_load_state(self, *_args, **_kwargs):
        return None

    def locator(self, selector: str):
        if selector == "div.college-box":
            return DummyCardLocator(self.cards)
        return DummyLocator([])


class DummyContext:
    def new_page(self):
        return object()


class DummyBrowser:
    def new_context(self, **_kwargs):
        return DummyContext()

    def close(self):
        return None


class DummyChromium:
    def launch(self, **_kwargs):
        return DummyBrowser()


class DummyPlaywright:
    def __init__(self):
        self.chromium = DummyChromium()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


def _apply_common_patches(monkeypatch, page: DummyPage):
    monkeypatch.setattr(scraper_mod, "sync_playwright", lambda: DummyPlaywright())
    monkeypatch.setattr(PlaywrightScraper, "login", lambda self, page_obj, ctx: (True, page))
    monkeypatch.setattr(PlaywrightScraper, "_validate_search_page", lambda self, pg, label: True)
    monkeypatch.setattr(PlaywrightScraper, "_ensure_cards_visible", lambda self, pg, pn: True)
    monkeypatch.setattr(PlaywrightScraper, "_scroll_to_load_all", lambda self, pg: None)
    monkeypatch.setattr(PlaywrightScraper, "_go_to_next_page", lambda self, pg, pn: False)
    monkeypatch.setattr(
        PlaywrightScraper, "_extract_courses_via_dom", lambda self, card, pg: [{"Course Name": "Mock Course"}]
    )


@pytest.fixture
def dummy_page_factory():
    def _build(cards: List[DummyCard]) -> DummyPage:
        return DummyPage(cards)

    return _build


@pytest.fixture
def patch_scraper_playwright(monkeypatch):
    def _patch(page: DummyPage):
        _apply_common_patches(monkeypatch, page)
        return page

    return _patch