# OpenProject

Self-hosted project management app with agile and classic workflow support.

## Overview

OpenProject runs as a multi-container setup with separate web, worker, cron, and seeder processes sharing the same image, plus PostgreSQL, Memcached, and (since v17) a Hocuspocus collaborative editing sidecar.

## Architecture (v17)

```
openproject-db         PostgreSQL 17
openproject-cache      Memcached
openproject-seeder     Runs DB migrations, then idles
openproject-web        Rails app (port 8080, isMain)
openproject-worker     Background job processor
openproject-cron       Scheduled tasks
openproject-hocuspocus Collaborative editing WebSocket server
```

### Service Dependencies

- `seeder` depends on `db` (healthy) + `cache` (healthy)
- `web`, `worker`, `cron` depend on `db` (healthy) + `cache` (healthy) + `seeder` (started)
- `hocuspocus` has no dependencies (standalone)

### Collaborative Editing (v17+)

The `hocuspocus` service provides real-time collaborative document editing via WebSocket. The web container proxies `/hocuspocus` WebSocket connections to it.

Required env vars on all 4 app services:
- `OPENPROJECT_COLLABORATIVE__EDITING__HOCUSPOCUS__URL` — `wss://${APP_DOMAIN}/hocuspocus`
- `OPENPROJECT_COLLABORATIVE__EDITING__HOCUSPOCUS__SECRET` — shared secret with hocuspocus
- `SECRET_KEY_BASE` — Rails secret key

The hocuspocus container only needs `SECRET` (same value as `OPENPROJECT_HOCUSPOCUS_SECRET`).

## Secrets

| env_variable | type | min length |
|---|---|---|
| `OPENPROJECT_DB_PASSWORD` | random | 32 |
| `OPENPROJECT_SECRET_KEY_BASE` | random | 64 |
| `OPENPROJECT_HOCUSPOCUS_SECRET` | random | 32 |

## Hostname

The web service has `hostname: ${APP_DOMAIN}` set so Rails correctly identifies its own hostname for URL generation and WebSocket proxying.

## Volumes

All app services mount `${APP_DATA_DIR}/data/assets` to `/var/openproject/assets` for shared file storage. PostgreSQL data is at `${APP_DATA_DIR}/data/postgres`.
