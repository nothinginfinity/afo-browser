# AFO Browser UI — v0.1 Spec

from: alice  
to: all  
project: afo-browser  
type: spec  
date: 2026-06-06T19:49:00Z  
status: draft  
priority: high  

---

## Purpose

AFO Browser is the human-readable inventory window for the AFO / Message OS ecosystem. It surfaces data that lives in the AFO Control Center and Worker registry into a clean, searchable dashboard accessible at `https://browser.agentfeedoptimization.com/`.

**Read-only.** Does not write to D1 or mutate Workers.

---

## Data Sources

All data flows from the AFO Control Center API:

| Source | URL |
|---|---|
| Worker registry | `https://control.agentfeedoptimization.com/audit/workers` |
| Registration queue | `https://control.agentfeedoptimization.com/registration/queue` |
| Health status | `https://control.agentfeedoptimization.com/health` |

Local fallback: static JSON fixtures in `public/fixtures/` for offline/dev mode.

---

## V0.1 UI Sections

### 1. Header
- AFO Browser wordmark + inline SVG logo
- Version badge (`v0.1`)
- Last refreshed timestamp
- Refresh button
- Theme toggle (light/dark)
- Search input (global, filters all active table)

### 2. Overview Cards
Four stat cards at the top:
- **Workers** — total registered Worker count
- **MCP Apps** — Workers with `/mcp` endpoint live
- **Tools** — total tools across all MCP Workers
- **D1 Databases** — total bound D1 databases

Each card shows: icon, label, count, delta (if available).

### 3. Cluster Filter Bar
Horizontal pill filters:
- All
- message-os
- toolsmith
- docparse
- afo-control
- afo-ui
- infra

Filtering a cluster narrows all tables simultaneously.

### 4. Workers Table

| Column | Notes |
|---|---|
| Name | Worker slug |
| Domain | Custom domain (linked) |
| Health | ✅ / ❌ / ⚠️ from `/health` |
| MCP | ✅ if `/mcp` responds |
| D1 | bound database name or `—` |
| Cluster | pill tag |
| Open | button → opens domain in new tab |

Sortable by any column. Searchable. Paginated (25/page).

### 5. MCP Apps Table

| Column | Notes |
|---|---|
| Name | Worker slug |
| MCP URL | linked |
| Tools | tool count |
| Widget | ✅ if widget_support: true |
| Status | live / degraded / down |
| Open | button |

### 6. Tool Catalog Table

| Column | Notes |
|---|---|
| Tool Name | |
| MCP Worker | parent Worker |
| Description | first 80 chars |
| Widget-enabled | ✅ / — |
| Open MCP | button |

Searchable by tool name or description.

### 7. D1 Databases Table

| Column | Notes |
|---|---|
| DB Name | |
| Bound to Worker | |
| UUID | truncated, copy button |
| Tables | known schema tables |

### 8. Endpoint Map Table

Flat list of every known endpoint across all Workers:

| Column | Notes |
|---|---|
| Worker | |
| Method | GET / POST |
| Path | |
| Description | |
| Status | last known response code |

### 9. Raw JSON Viewer
Tab or drawer at bottom. Shows current filtered dataset as pretty-printed JSON. Copy button. Export button (triggers download).

---

## Machine API Routes

Every route returns `application/json`. CORS headers set for `browser.agentfeedoptimization.com`.

| Route | Response |
|---|---|
| `GET /api/status` | `{ok, version, worker_count, mcp_count, last_audit}` |
| `GET /api/workers` | `Worker[]` |
| `GET /api/mcp-apps` | `MCPApp[]` |
| `GET /api/tools` | `Tool[]` |
| `GET /api/d1` | `D1Database[]` |
| `GET /api/endpoints` | `Endpoint[]` |
| `GET /api/export` | full dump of all above |

All list routes support `?cluster=`, `?search=`, `?limit=`, `?offset=` query params.

---

## Data Types

See `schemas/` directory for full JSON Schema definitions.

### Worker
```typescript
interface Worker {
  id: string;
  name: string;
  domain?: string;
  health_url?: string;
  mcp_url?: string;
  cluster?: string;
  d1_binding?: string;
  has_mcp: boolean;
  has_widget: boolean;
  health_status: 'ok' | 'fail' | 'unknown';
  last_checked?: string;
}
```

### Tool
```typescript
interface Tool {
  id: string;
  name: string;
  description?: string;
  worker_id: string;
  widget_enabled: boolean;
}
```

---

## Design Tokens

- Dark-first: `#0f0f0f` base, `#1a1a1a` surface, `#242424` card
- Accent: AFO Teal `#01696f` (light) / `#4f98a3` (dark)
- Font: `Geist Mono` for IDs/URLs, `Geist` for UI text
- Nexus design system tokens where unspecified

---

## Deploy Target

- Worker name: `afo-browser`
- Custom domain: `browser.agentfeedoptimization.com`
- No D1 required (reads from Control Center API)
- No KV required
- No secrets required (all data is from public API routes)

---

## Build Order

1. `src/inventory.ts` — types + Control Center fetch helpers  
2. `src/api.ts` — `/api/*` route handlers  
3. `src/ui.ts` — full HTML dashboard string  
4. `src/index.ts` — Worker entry point, routes `GET /` → ui, `/api/*` → api  
5. `wrangler.toml` — Worker config  
6. `.github/workflows/deploy.yml` — CI/CD  

---

*Drafted by Alice · 2026-06-06*
