# App Definition Guide

How to define a Runtipi app in this app store.

## Overview

Each app lives in `apps/<app-id>/` and requires four files: `config.json`, `docker-compose.json`, `metadata/logo.jpg`, and `metadata/description.md`. Both JSON files are validated against schemas from `@runtipi/common`.

## config.json

App metadata and user-facing configuration.

- **`id`**: Must match the directory name
- **`version`**: Upstream app version string (e.g. `"17.0.3"`)
- **`tipi_version`**: Minimum Runtipi platform version required (integer, not an app revision counter)
- **`dynamic_config: true`**: Required when using `docker-compose.json` format
- **`form_fields`**: Array of fields shown to the user at install time
  - `type: "random"` — auto-generated secret with `min` character length
  - `type: "text"`, `"password"`, `"email"`, `"number"`, `"boolean"` — user input
  - `env_variable` — injected into compose as `${VAR_NAME}`

## docker-compose.json

Runtipi dynamic compose format (`schemaVersion: 2`), **not** standard Docker Compose YAML.

- **`services[]`**: Array of service objects (not a map)
- **`name`**: Container name
- **`image`**: Docker image with tag
- **`isMain: true`**: Exactly one service must be marked as main (gets the exposed port)
- **`internalPort`**: Port the main service listens on
- **`hostname`**: Optional, sets the container hostname
- **`environment`**: Array of `{ "key": "...", "value": "..." }` objects
- **`volumes`**: Array of `{ "hostPath": "...", "containerPath": "..." }` objects
- **`dependsOn`**: Map of service names to `{ "condition": "service_healthy" | "service_started" }`
- **`healthCheck`**: Object with `test`, `interval`, `timeout`, `retries`, `startPeriod`
- **`command`**: Override entrypoint command
- **`restart`**: Restart policy (e.g. `"on-failure"`)

## Environment Variable Interpolation

Variables from `form_fields` are available as `${VAR_NAME}` in compose values. Built-in variables:
- `${APP_DOMAIN}` — the domain/hostname configured for the app
- `${APP_DATA_DIR}` — persistent data directory on the host

## Testing

Run `bun test` from the repo root. Tests validate:
1. All required files exist for each app
2. `config.json` parses against `appInfoSchema`
3. `docker-compose.json` parses against `parseComposeJson`
