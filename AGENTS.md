# Runtipi App Store

Custom Runtipi app store containing self-hosted application definitions.

## Structure

```
apps/<app-id>/
  config.json              # App metadata, form fields, version
  docker-compose.json      # Dynamic compose (schemaVersion 2)
  metadata/
    logo.jpg               # App icon
    description.md         # Long description
```

## Key Files

- `config.json` — validated against `appInfoSchema` from `@runtipi/common`
- `docker-compose.json` — validated against `parseComposeJson` from `@runtipi/common`; uses Runtipi's dynamic compose format (not standard Docker Compose)
- `config.js` — Runtipi config, defines allowed commands
- `__tests__/apps.test.ts` — validates all apps have required files and valid schemas

## Config Fields

| Field | Meaning |
|---|---|
| `tipi_version` | **Minimum Runtipi version** required to run the app (not an app revision counter) |
| `version` | Upstream application version |
| `dynamic_config` | Must be `true` for `docker-compose.json` format |
| `form_fields[].type: "random"` | Auto-generated secret, `min` sets character length |

## Commands

- `bun test` — validate all app configs and compose files
- `bun ./scripts/update-config.ts` — update config utility

## Detailed Docs

- [App Definition Guide](.project/knowledge/app-definition.md)
- [OpenProject Setup](.project/knowledge/openproject.md)

## Decisions

- [2026-02-07 — OpenProject v16 to v17 upgrade](.project/decisions/2026-02-07-1200-openproject-v17-upgrade.md)
