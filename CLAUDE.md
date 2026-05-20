# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Development with hot reload (tsx watch)
npm run build        # Build to ESM dist/ (tsup)
npm run start        # Run production build
npm run lint         # Biome check
npm run lint:fix     # Biome auto-fix
npm run typecheck    # tsc --noEmit
npm run format       # Biome format
npm run test         # Vitest run (single pass)
npm run test:watch   # Vitest watch mode
npm run coverage     # Vitest coverage report
npx prisma migrate dev   # Apply DB migrations
npx prisma studio        # Open DB GUI
```

## Architecture

A Slack-based leave management bot using **Slack Bolt** (Socket Mode) + **Prisma** + **PostgreSQL**. Employees request vacation/sick leave via Slack DMs; HR approves/rejects through an HR channel.

### Request lifecycle

```
Employee DM → handleEmployeeSelectLeaveType (type selection)
           → handleEmployeeLeaveSend (preview + confirm)
           → HR Channel: HRPreviewBlocks with approve/reject buttons
           → handleHRLeaveApprove / handleHRLeaveReject
           → Employee DM: approval/rejection notification
```

### Key modules

- **`src/slack/client.ts`** — App entry: registers all handlers against Slack Bolt using action IDs from `src/constants/eventKeys.ts`. All handler and action wiring lives here.
- **`src/slack/handlers/`** — One file per Slack action/event. Handlers follow the pattern: extract payload → call feature/db logic → post Slack response via `api.*`.
- **`src/slack/blocks/`** — Block Kit UI definitions (no logic). Consumed by handlers.
- **`src/slack/api.ts`** — Thin wrapper over Slack client: `postToHrChannel()`, `postDM()`, `updateMessage()`.
- **`src/features/leave/`** — Business logic: overlap checking, leave balance calculation (`getBookedLeaveDaysForYear`), saving requests (`saveLeaveRequest`).
- **`src/db/prisma.ts`** — Singleton PrismaClient.
- **`src/config/env.ts`** — Zod-validated env: `SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN`, `HR_CHANNEL_ID`, `TZ`, `NODE_ENV`, `LOG_LEVEL`.
- **`src/config/leavePolicy.ts`** — Leave limits: `VACATION = 21`, `SICK_LEAVE = 10` days/year.
- **`src/constants/eventKeys.ts`** — All Slack action IDs and event names. Add new interactions here first.

### Database schema

Two models in PostgreSQL via Prisma:
- **`UserProfile`** — `userId` (PK), `fullName`, cached from Slack API
- **`LeaveRequest`** — `id`, `userId`, `startDate`, `endDate`, `days`, `year`, `type (VACATION|SICK_LEAVE)`, `status (APPROVED|PENDING|REJECTED)`

### Toolchain notes

- **Biome** handles both linting and formatting (no ESLint/Prettier). Config in `biome.json`.
- **tsup** bundles to ESM; output goes to `dist/`.
- **tsx** is used for development (no compile step needed).
- Module system is ESM throughout (`"type": "module"` in package.json).

### Adding a new Slack interaction

1. Add the action ID constant to `src/constants/eventKeys.ts`
2. Create handler in `src/slack/handlers/handle<Name>.ts` (use `ActionMiddleware` or `CommandMiddleware` types from `src/types/handler.ts`)
3. Register it in `src/slack/client.ts` with `app.action(EVENT_KEYS.MY_KEY, handler)`
4. Add any needed Block Kit UI to `src/slack/blocks/`
