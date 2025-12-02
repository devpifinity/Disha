"""Lightweight smoke tests for scraping-service modules."""

from src.playwright_scraper import PlaywrightScraper


def test_playwright_scraper_exposes_scrape_method():
    scraper = PlaywrightScraper()
    assert hasattr(scraper, "scrape")
    assert callable(scraper.scrape)
