# OpenProject v16 to v17 Upgrade

**Date:** 2026-02-07 12:00
**Status:** Accepted

## Context

OpenProject v17 adds collaborative editing via a new `hocuspocus` WebSocket service. The app definition needed updating to match the official v17 docker-compose.

## Changes Made

1. **Image tags**: `openproject/openproject:16-slim` to `17-slim` on all 4 app services (web, worker, cron, seeder)
2. **New env vars**: Added `OPENPROJECT_COLLABORATIVE__EDITING__HOCUSPOCUS__URL`, `OPENPROJECT_COLLABORATIVE__EDITING__HOCUSPOCUS__SECRET`, and `SECRET_KEY_BASE` to all 4 app services
3. **Hostname**: Added `hostname: ${APP_DOMAIN}` to web service for proper WebSocket proxying
4. **New service**: `openproject-hocuspocus` with image `openproject/hocuspocus:17.0.3`
5. **New secrets**: `OPENPROJECT_SECRET_KEY_BASE` (random, 64 chars) and `OPENPROJECT_HOCUSPOCUS_SECRET` (random, 32 chars) as form fields
6. **Version**: `16.6.9` to `17.0.3`

## Decisions

### tipi_version not bumped

`tipi_version` represents the minimum Runtipi platform version required to run the app, not an app definition revision counter. Since no new Runtipi features are required, it stays at `4`.

### Hocuspocus has no dependsOn

The hocuspocus container is standalone with no database or cache dependencies. It only needs the shared secret to authenticate WebSocket connections from the web service.

### No ports exposed for hocuspocus

The web container proxies `/hocuspocus` WebSocket connections internally. The hocuspocus service is only reachable on the app network, not exposed to the host.

## Consequences

**Positive:**
- Collaborative document editing available in OpenProject
- Secrets auto-generated via `random` form fields

**Negative:**
- One additional container increases resource usage
- Existing installations need the new secrets generated on upgrade
