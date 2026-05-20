# Vacation Bot

A Slack bot for managing employee leave requests. Employees submit vacation or sick leave requests via Slack DMs; HR reviews and approves/rejects them through a dedicated HR channel. Approved requests are saved to PostgreSQL and logged to a Google Sheet automatically.

---

## Features

- Employees request vacation or sick leave via Slack DM
- HR receives a structured preview with approve/reject buttons
- Leave balance tracking per employee per year (21 vacation days, 10 sick days)
- Overlap detection to prevent conflicting leave requests
- Approved requests saved to PostgreSQL and appended to Google Sheets
- HR commands: pending requests, upcoming requests, general report, per-employee report

---

## Prerequisites

- Node.js 20+
- PostgreSQL database
- A Slack app with Socket Mode enabled
- A Google Cloud service account with Sheets API access

---

## Installation

```bash
git clone <repo-url>
cd vacation-bot
npm install
```

---

## Environment variables

Copy the example file and fill in all values:

```bash
cp .env.example .env
```

| Variable                  | Description                                              | Example                        |
|---------------------------|----------------------------------------------------------|--------------------------------|
| `SLACK_APP_TOKEN`         | Slack app-level token (starts with `xapp-`)             | `xapp-1-...`                   |
| `SLACK_BOT_TOKEN`         | Slack bot OAuth token (starts with `xoxb-`)             | `xoxb-...`                     |
| `HR_CHANNEL_ID`           | Slack channel ID where HR reviews requests              | `C09XXXXXXX`                   |
| `TZ`                      | Timezone for date calculations                          | `Europe/Kyiv`                  |
| `DATABASE_URL`            | PostgreSQL connection string                            | `postgresql://user:pass@host/db` |
| `GOOGLE_SHEET_ID`         | ID of the target Google Sheet                           | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms` |
| `GOOGLE_CREDENTIALS_PATH` | Path to the service account JSON key file              | `./credentials.json`           |

---

## Database setup (PostgreSQL + Prisma)

### 1. Create a PostgreSQL database

You can use any PostgreSQL instance — local, Docker, or a cloud provider (e.g. Supabase, Railway, Neon).

**Local with Docker:**
```bash
docker run --name vacation-bot-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vacation_bot \
  -p 5432:5432 \
  -d postgres:16
```

Set `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vacation_bot"
```

### 2. Run migrations

```bash
npx prisma migrate dev
```

This creates the `UserProfile` and `LeaveRequest` tables.

### 3. (Optional) Open Prisma Studio

```bash
npx prisma studio
```

A browser GUI will open at `http://localhost:5555` for inspecting data.

---

## Google Sheets setup

Approved leave requests are automatically appended to a Google Sheet. The sheet must have two tabs named **Vacation** and **Sick leave** (matching the leave types).

### 1. Create a Google Cloud project and enable the Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Library**
4. Search for **Google Sheets API** and click **Enable**

### 2. Create a service account

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → Service account**
3. Give it a name (e.g. `vacation-bot`) and click **Done**

### 3. Download the JSON key

1. Open the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key → Create new key → JSON**
4. Save the downloaded file as `credentials.json` in the project root

### 4. Share the Google Sheet with the service account

1. Open your Google Sheet
2. Click **Share**
3. Paste the service account email (found in the JSON file under `"client_email"`) and grant **Editor** access

### 5. Configure environment variables

```
GOOGLE_SHEET_ID=<the ID from the sheet URL>
GOOGLE_CREDENTIALS_PATH=./credentials.json
```

The sheet ID is the long string in the URL:
```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
```

### Sheet structure

Each tab must exist and will receive rows in this column order:

| A (Slack User ID) | B (Full Name) | C (Date Range)          | D (Year) | E (Days) |
|-------------------|---------------|-------------------------|----------|----------|
| U01234567         | Jane Doe      | 2026-07-01 - 2026-07-05 | 2026     | 5        |

---

## Slack app setup

### 1. Create a Slack app

Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App → From scratch**.

### 2. Enable Socket Mode

1. Go to **Settings → Socket Mode**
2. Toggle **Enable Socket Mode** on
3. Generate an app-level token with the `connections:write` scope — this is your `SLACK_APP_TOKEN`

### 3. Configure Bot Token Scopes

Under **OAuth & Permissions → Scopes → Bot Token Scopes**, add:

- `app_mentions:read`
- `channels:history`
- `chat:write`
- `commands`
- `im:history`
- `im:read`
- `im:write`
- `users:read`
- `users:read.email`

### 4. Enable Events

Under **Event Subscriptions**, enable events and subscribe to:
- `message.im` (direct messages)

### 5. Install the app to your workspace

Go to **OAuth & Permissions** and click **Install to Workspace**. Copy the **Bot User OAuth Token** — this is your `SLACK_BOT_TOKEN`.

### 6. Get the HR channel ID

Right-click the HR channel in Slack → **View channel details** → copy the Channel ID at the bottom. Set it as `HR_CHANNEL_ID`.

---

## Running the bot

**Development (hot reload):**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run start
```

---

## Other commands

```bash
npm run lint         # Check code with Biome
npm run lint:fix     # Auto-fix lint issues
npm run typecheck    # TypeScript type check
npm run test         # Run tests
npm run coverage     # Test coverage report
```
