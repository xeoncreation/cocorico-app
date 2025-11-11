# Developer Control & Observability

This document summarizes tools and patterns added to help you manage all aspects of the project (users, themes, assets, env health).

## Tables

1. `user_profiles`: Stores `plan`, `role`, `metadata`. Auto-created via trigger on new auth user.
2. `page_assets`: Maps `page` -> `asset_free` / `asset_premium` for dynamic visual theming.

## Admin API

`GET /api/admin/users?secret=YOUR_ADMIN_SECRET`

Returns JSON array of users from `user_profiles` (requires `ADMIN_SECRET` env var).

## Theme System

CSS variables in `styles/globals.css`:

- `data-theme="free" | "premium"` select palette and motion curve.
- Dark mode overrides via `prefers-color-scheme: dark`.

Set programmatically using `useTheme(userId)` from `src/lib/useTheme.tsx` or a future session hook.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/audit-env.ts` | Audit required env vars. Exit code 1 if missing. |
| `scripts/export-users.ts` | Dump auth + profile info to `dev-output/`. Requires service role key. |

Run (examples):

```bash
npx ts-node scripts/audit-env.ts
SUPABASE_SERVICE_ROLE=... npx ts-node scripts/export-users.ts
```

## Logger

`src/lib/logger.ts` provides `logger.debug/info/warn/error`. Control volume with `LOG_LEVEL=debug|info|warn|error`.

## Recommended ENV Variables

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE=...        # required for export-users script
OPENAI_API_KEY=...
REPLICATE_API_TOKEN=...
SITE_PASSWORD=...
ADMIN_SECRET=...                 # for /api/admin/users
LOG_LEVEL=debug
```

## Operational Checklist

- Audit env: `npx ts-node scripts/audit-env.ts`
- Export users: `SUPABASE_SERVICE_ROLE=... npx ts-node scripts/export-users.ts`
- Check health: `curl http://127.0.0.1:3000/health`
- Theme verification: set `document.documentElement.dataset.theme = 'premium'` in dev tools.

## Future Enhancements

- Metrics endpoint (`/api/admin/metrics`) with counts and last activity.
- In-app admin dashboard consuming these admin routes.
- Role-based route guards (middleware reading `user_profiles.role`).
- Central feature flags table.

## Security Notes

- Keep `SUPABASE_SERVICE_ROLE` server-side only; never expose in client bundles.
- `ADMIN_SECRET` should be long & randomly generated.
- Consider rate limiting admin endpoints.

Enjoy full control 👨‍💻
