# College and Course Data Scraping Service

<div align="center">

![Python](https://img.shields.io/badge/Python-3.7%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white)

**Enterprise-grade web scraping service featuring dual engines (Playwright/Selenium), progressive saving, and crash recovery.**
</div>

---

## Features

<table>
<tr>
<td width="50%">

### Core Capabilities
- **Dual Engines** - Switch between `playwright` (Turbo Mode) and `selenium` (Legacy)
- **Flexible Filtering** - Filter by course category, specialization, city, and university
- **Batch Processing** - Execute multiple scraping tasks sequentially
- **Multiple Output Formats** - Export as CSV, JSON, and JSONL (Progressive)
<br/>
</td>
<td width="50%">

### Enterprise Features
- **Resumability** - Automatically skips already-scraped colleges on restart
- **Crash Recovery** - JSONL format ensures zero data loss on power failure
- **Automatic Login** - Handles complex iframe-based authentication
- **Deduplication** - Smart duplicate detection and removal
<br/>
</td>
</tr>
</table>

---

## Project Structure

```
backend/scraping-service/
│
├── src/
│   ├── __init__.py
│   ├── auth.py              # Authentication logic
│   ├── config.py            # Configuration settings
│   ├── downloader.py        # Selenium scraping logic
│   ├── playwright_scraper.py# Playwright scraping logic (Turbo Mode)
│   └── utils.py             # Utilities (JSONL saving, deduplication)
│
├── data/                    # Output directory
│   ├── *.csv               # CSV exports
│   ├── *.json              # Final JSON exports
│   ├── *.jsonl             # Progressive crash-safe logs
│   └── batch_summary_*.txt # Execution reports
│
├── main.py                  # Single-task CLI
├── batch_runner.py          # Batch execution CLI
├── batch_config.py          # Batch task configuration
├── requirements.txt         # Dependencies
└── README.md               # This file
```

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd backend/scraping-service
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
playwright install chromium  # Required for Playwright engine
```

---

## Environment Configuration

Create a `.env` file in the project root (`backend/.env`) to configure the service:

```env
# Authentication (CareerZoom)
LOGIN_EMAIL=your-email@example.com
LOGIN_PASSWORD=your-password

# Database (Supabase) - Optional, for staging push
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
```

---

## Usage

### 1. Single Task Mode (Debug)

Execute a specific scrape immediately.

```bash
# Syntax
python main.py <Category> <Specialization> <City> <University> --engine playwright [options]

# Examples
# Scrape Engineering colleges in Bangalore using Playwright (Recommended)
python main.py Engineering null Bangalore null --engine playwright --format both --save

# Scrape everything in Headless mode (no Supabase write)
python main.py null null null null --engine playwright --headless
```


### 2. Saving to Supabase (Single Task)

To save scraped data to the Supabase `search_criteria` table:
1. Configure `SUPABASE_URL` and `SUPABASE_KEY` in `.env`.
2. Append the `--save` flag to your command. Works with both engines; only the JSON output is pushed.
3. Ensure the City filter resolves to a single location (either explicitly via CLI or implicitly via the scraped JSON); the Supabase table requires a non-null city.

If you omit a filter value, the CLI/UI will try to infer it from the scrape results and will surface Supabase's response message (e.g., `Inserted new record...`) back to you. When inference fails (multiple cities detected), the push is blocked so you can rerun with precise filters.

```bash
# Scrape and save to Supabase
python main.py Engineering null Dhanbad null --engine playwright --format json --headless --save
```

### 3. Batch Runner (Production)

Execute multiple tasks defined in `batch_config.py`.

```bash
# Run all tasks using Playwright
python batch_runner.py --engine playwright

# Run in headless mode (Server/CI)
python batch_runner.py --engine playwright --headless
```

#### CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `--engine` | `playwright` (Fast) or `selenium` (Legacy) | `selenium` |
| `--format` | Output format: `csv`, `json`, `both` | `csv` |
| `--headless` | Run without browser UI | `False` |
| `--manual-login` | Pause for manual login (Selenium only) | `False` |
| `--save` | Push the generated JSON to Supabase (requires resolvable city) | `False` |

**Manual login vs. save**
- `--manual-login` keeps the Selenium browser open so you can complete CAPTCHAs/MFA when automatic login fails. Playwright ignores it.
- `--save` writes the transformed JSON output to Supabase after files are written. Use it whenever you want your run persisted.
- Supabase pushes (via CLI `--save` or the Streamlit UI) now infer the metadata from the JSON payload and display the exact Supabase result message. If no unique city can be determined, the push is prevented to avoid violating the database schema.

---

## Architecture & Recovery

### Playwright Engine ("Turbo Mode")
*   **Speed**: Uses WebSocket-based communication (CDP) instead of HTTP polling.
*   **Stability**: Auto-waiting selectors reduce "element not found" errors.
*   **Login**: Automatically handles the "Student Dashboard" iframe and popup windows.

### Failure Recovery
*   **Progressive Saving**: Data is written to `.jsonl` files immediately after each college is processed.
*   **Atomic-ish Writes**: JSONL append operations are crash-safe.
*   **Resumability**: On startup, the system reads existing `.jsonl` and `.csv` files to build a "processed set". It then skips any college found in this set, ensuring no redundant work.

---

## Output Formats

### JSONL (Progressive)
One JSON object per line. Best for crash recovery.
```json
{"College Name": "IIT Bombay", "Location": "Mumbai", ...}
{"College Name": "IIT Delhi", "Location": "Delhi", ...}
```

### JSON (Final)
Standard JSON array. Best for API consumption.
```json
[
  {
    "College Name": "IIT Bombay",
    "Courses": [...]
  }
]
```

### CSV
Flattened table. Best for Excel/Analysis.
