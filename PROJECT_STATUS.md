# Project Status: BAC Serial
**Last Updated:** January 5, 2026

## 🚀 Recent Accomplishments
### 1. Custom Subscription Schedule (Level 2)
We successfully implemented the "Level 2" features allowing users to customize when they receive emails.

- **Database**: 
  - Updated `Subscription` model in `prisma/schema.prisma`.
  - Added new columns: `preferredDays` (JSON string, e.g., `[1,3,5]`) and `preferredHour` (Int, `8` or `20`).
  - Added `CUSTOM` frequency type.
  - **Migration**: Applied changes to Turso DB.

- **Backend (`/api/subscribe`)**:
  - Rewrote logic to use Relational Tables (`User`, `Book`, `Subscription`).
  - Now checks for existing users or creates them before linking the subscription.
  - Saves user preferences for days and time.

- **Cron Job (`/api/cron/send-daily`)**:
  - Updated SQL query to `JOIN` tables and fetch all necessary data.
  - Added logic to filter users based on:
    - Current Day of Week vs. User's `preferredDays`.
    - Current Hour vs. User's `preferredHour`.

- **Frontend (`/lectura/[slug]`)**:
  - Added UI for selecting days (Mon-Sun).
  - Added UI for selecting time (Morning/Evening).
  - Wired up to the new API.

### 2. Content: "Ion"
- **Status**: Complete.
- **Fragments**: Split into 105 markdown files (`fragment-001.md` to `fragment-105.md`).
- **Metadata**: Updated `metadata.json` with correct word counts and titles.

## 📋 Next Steps
1. **Simulation Verification**: Run `/api/simulate-sequence` to review the flow of "Ion" emails (visual check).
2. **User Feedback**: Update UI to show the calculated date of the *first* email after subscribing.
3. **More Content**: Begin processing the next book (e.g., "Moara cu noroc").

## 🛠 Technical Notes
- **Git**: All changes pushed to `origin/main`.
- **DB**: Turso database is in sync with the Prisma schema.
