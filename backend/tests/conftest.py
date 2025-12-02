"""Shared pytest fixtures for backend services.

Add reusable fixtures here (e.g., tmp directories, mock loggers,
Playwright stubs) so individual test modules can stay lean.
"""

pytest_plugins = [
    "tests.scraping_service.fixtures.playwright_mocks",
]

import pathlib
import sys

import pytest


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRAPING_SERVICE_PATH = PROJECT_ROOT / "scraping-service"

scraping_path_str = str(SCRAPING_SERVICE_PATH)
if scraping_path_str not in sys.path:
    sys.path.insert(0, scraping_path_str)


@pytest.fixture
def project_root() -> pathlib.Path:
    """Absolute path to backend root for loading fixtures/data."""
    return PROJECT_ROOT
