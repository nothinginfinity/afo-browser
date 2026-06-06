// inventory.ts — AFO Browser v0.1
// Types and Control Center fetch helpers

export const CONTROL_CENTER = 'https://control.agentfeedoptimization.com';
export const BROWSER_VERSION = '0.1.0';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Worker {
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
  repo_url?: string;
  version?: string;
}

export interface Tool {
  id: string;
  name: string;
  description?: string;
  worker_id: string;
  worker_name?: string;
  widget_enabled: boolean;
  input_schema?: Record<string, unknown>;
}

export interface D1Database {
  id: string;
  name: string;
  bound_to_worker?: string;
  known_tables?: string[];
}

export interface Endpoint {
  worker_id: string;
  worker_name?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description?: string;
  last_status?: number;
}

export interface InventoryExport {
  generated_at: string;
  version: string;
  workers: Worker[];
  mcp_apps: Worker[];
  tools: Tool[];
  d1_databases: D1Database[];
  endpoints: Endpoint[];
}

// ─── Control Center Helpers ───────────────────────────────────────────────────

export async function fetchWorkers(): Promise<Worker[]> {
  try {
    const res = await fetch(`${CONTROL_CENTER}/audit/workers`);
    if (!res.ok) return [];
    const data = await res.json() as { issues?: unknown[]; [k: string]: unknown };
    // Control Center returns {ok, issues_count, issues, ...}
    // We also pull the worker list from the full registry if available
    const workersRes = await fetch(`${CONTROL_CENTER}/registration/queue?status=all&limit=200`);
    if (!workersRes.ok) return buildFromAudit(data);
    const queueData = await workersRes.json() as { items?: RawQueueItem[] };
    return buildFromQueue(queueData.items || []);
  } catch {
    return [];
  }
}

interface RawQueueItem {
  target_id?: string;
  item_type?: string;
  issue?: string;
  severity?: string;
  status?: string;
  metadata?: string;
}

function buildFromQueue(items: RawQueueItem[]): Worker[] {
  const seen = new Map<string, Worker>();
  for (const item of items) {
    const id = item.target_id || 'unknown';
    if (!seen.has(id)) {
      const meta = tryParseMeta(item.metadata);
      seen.set(id, {
        id,
        name: id,
        domain: meta?.custom_domain,
        health_url: meta?.health_url,
        mcp_url: meta?.mcp_url,
        cluster: inferCluster(id),
        d1_binding: meta?.d1_binding,
        has_mcp: !!meta?.mcp_url,
        has_widget: meta?.has_widget === true,
        health_status: inferHealthStatus(items, id),
        repo_url: meta?.repo_url,
        version: meta?.version,
      });
    }
  }
  return Array.from(seen.values());
}

function buildFromAudit(data: Record<string, unknown>): Worker[] {
  const issues = (data.issues as RawQueueItem[] | undefined) || [];
  return buildFromQueue(issues);
}

function tryParseMeta(meta?: string): Record<string, unknown> {
  if (!meta) return {};
  try { return JSON.parse(meta); } catch { return {}; }
}

function inferCluster(id: string): string {
  if (id.startsWith('message-os')) return 'message-os';
  if (id.startsWith('toolsmith') || id.includes('toolsmith')) return 'toolsmith';
  if (id.includes('docparse')) return 'docparse';
  if (id.includes('control-center') || id.includes('afo-control')) return 'afo-control';
  if (id.includes('afo-ui') || id.includes('afo-layout') || id.includes('afo-buttons') ||
      id.includes('afo-forms') || id.includes('afo-tables') || id.includes('afo-browser')) return 'afo-ui';
  if (id.includes('cloudflare') || id.includes('domain') || id.includes('gateway')) return 'infra';
  return 'other';
}

function inferHealthStatus(items: RawQueueItem[], targetId: string): 'ok' | 'fail' | 'unknown' {
  const workerIssues = items.filter(i => i.target_id === targetId && i.status === 'open');
  if (workerIssues.length === 0) return 'ok';
  const hasHealthFail = workerIssues.some(i => i.issue === 'smoke_status_fail');
  if (hasHealthFail) return 'fail';
  return 'unknown';
}

export async function fetchStatus(): Promise<{
  ok: boolean; version: string; worker_count: number; mcp_count: number; last_audit?: string;
}> {
  try {
    const res = await fetch(`${CONTROL_CENTER}/health`);
    const data = await res.json() as Record<string, unknown>;
    return {
      ok: res.ok,
      version: BROWSER_VERSION,
      worker_count: 0,
      mcp_count: 0,
      last_audit: typeof data.timestamp === 'string' ? data.timestamp : undefined,
    };
  } catch {
    return { ok: false, version: BROWSER_VERSION, worker_count: 0, mcp_count: 0 };
  }
}

export function filterWorkers(
  workers: Worker[],
  opts: { cluster?: string; search?: string; limit?: number; offset?: number }
): Worker[] {
  let out = workers;
  if (opts.cluster && opts.cluster !== 'all') {
    out = out.filter(w => w.cluster === opts.cluster);
  }
  if (opts.search) {
    const q = opts.search.toLowerCase();
    out = out.filter(w =>
      w.name.toLowerCase().includes(q) ||
      (w.domain || '').toLowerCase().includes(q) ||
      (w.cluster || '').toLowerCase().includes(q)
    );
  }
  const offset = opts.offset || 0;
  const limit = opts.limit || 100;
  return out.slice(offset, offset + limit);
}
