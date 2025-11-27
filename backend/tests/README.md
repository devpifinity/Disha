# Backend Testing Suite

This directory contains the unified testing infrastructure for the Disha backend. It uses `pytest` as the runner and follows a modular structure corresponding to the microservices.

## 📂 Structure

```
backend/tests/
├── conftest.py          # Global fixtures & path configuration
├── common/              # Shared test utilities
├── scraping_service/    # Tests for Scraping Service
│   ├── unit/            # Fast, isolated tests (no I/O)
│   ├── integration/     # Mocked component tests
│   └── fixtures/        # Service-specific mocks (e.g., Playwright)
└── llm_service/         # Tests for LLM Service
```

## 🚀 Running Tests

Make sure you have installed the dev dependencies:
```bash
pip install -r requirements-dev.txt
```

### Run All Tests
```bash
pytest
```

### Run Specific Service
```bash
pytest tests/scraping_service
pytest tests/llm_service
```

### Run by Type
```bash
# Run only unit tests (fast)
pytest -m "not integration"

# Run only integration tests
pytest -m integration
```

## 🛠️ Configuration

Configuration is managed in `backend/pytest.ini`:
- **Markers**:
    - `@pytest.mark.integration`: Tests that involve component interaction or mocked I/O.
    - `@pytest.mark.slow`: Tests that take >1s to run.
- **Path**: `sys.path` is automatically patched in `conftest.py` to allow importing from `src` modules without installation.

## 🧩 Writing Tests

### 1. Unit Tests
*   Place in `tests/<service>/unit/`.
*   Test pure functions and logic.
*   **Do not** mock heavy external dependencies here; use integration tests for that.

### 2. Integration Tests
*   Place in `tests/<service>/integration/`.
*   Use `pytest-mock` to mock external calls (e.g., Playwright, OpenAI).
*   Use fixtures from `tests/<service>/fixtures/` to keep tests clean.

### 3. Fixtures
*   **Global**: Define in `tests/conftest.py` (e.g., `project_root`).
*   **Service-Specific**: Define in `tests/<service>/fixtures/` and import in `tests/conftest.py` or the test file.
