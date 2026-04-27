# RelationshipOS

RelationshipOS is a mobile-first portfolio intelligence app for Citizens Bank business banking relationship managers.

The app converts meeting and call notes into structured relationship records: tasks, opportunities, risk flags, referrals, and product mentions. This implementation is optimized for Codex as a working web app rather than a Lovable prompt sequence.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Main Routes

- `/login`
- `/signup`
- `/dashboard`
- `/clients`
- `/logs`
- `/tasks`
- `/pipeline`
- `/referrals`
- `/settings`
- `/new-log`

## Notes

The current implementation uses realistic local demo data and local UI state so the core workflow is demo-ready without requiring Supabase credentials. The schema and AI parser contract from the source prompt are preserved in `supabase/schema.sql` and `src/domain.js` for a later backend connection.
