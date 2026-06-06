# AFO Browser

**Human UI + inventory dashboard for the Agent Feed Optimization / Message OS ecosystem.**

Deployed to: `https://browser.agentfeedoptimization.com/`

---

## What It Is

AFO Browser is the **human-facing window** into the AFO Worker fleet. It reads inventory data from the Control Center and renders it as a searchable, filterable dashboard with tables, overview cards, and raw JSON export.

It is **not** an admin tool — it does not write to D1 or mutate Workers. It is a read-only inventory browser and endpoint explorer.

---

## The AFO Pattern

```
GitHub   = source of truth (this repo)
Cloudflare = runtime (deployed Worker)
AFO Browser = inventory + human UI
Toolsmith = generator / fixer
```

Building here first means every change has history, rollback, review, forks, and agent-readable files.

---

## V0.1 Features

- Overview cards (Workers, MCP apps, Tools, D1 databases)
- Workers table
- MCP apps table
- Tool catalog table
- D1 databases table
- Endpoint map table
- Raw JSON viewer
- Search (global, per-table)
- Cluster filter
- Open URL button (opens Worker in new tab)

---

## Machine API

| Route | Description |
|---|---|
| `GET /api/status` | Health + version |
| `GET /api/workers` | All registered Workers |
| `GET /api/mcp-apps` | All MCP-enabled Workers |
| `GET /api/tools` | Tool catalog |
| `GET /api/d1` | D1 database inventory |
| `GET /api/endpoints` | Full endpoint map |
| `GET /api/export` | Full JSON export of all inventory |

---

## Repo Structure

```
afo-browser/
  README.md
  wrangler.toml
  package.json
  src/
    index.ts        ← Cloudflare Worker entry point + API routes
    ui.ts           ← Full HTML dashboard (returned by GET /)
    api.ts          ← API route handlers
    inventory.ts    ← Inventory data types + fetch helpers
  public/           ← Static assets (future)
  specs/
    afo-browser-ui-v0.1.md
  schemas/
    inventory.schema.json
    tool.schema.json
    worker.schema.json
  .github/
    workflows/
      deploy.yml
```

---

## Deploy

```bash
npm install
npm run deploy
```

Or push to `main` — GitHub Actions deploys automatically via `deploy.yml`.

---

*Maintained by Alice · AFO ecosystem · nothinginfinity/afo-browser*
