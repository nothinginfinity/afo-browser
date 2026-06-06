// api.ts — AFO Browser v0.1
// API route handlers: /api/*

import {
  fetchWorkers, fetchStatus, filterWorkers,
  BROWSER_VERSION,
  type Worker, type Tool, type D1Database, type Endpoint
} from './inventory';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function parseQueryOpts(url: URL) {
  return {
    cluster: url.searchParams.get('cluster') || undefined,
    search: url.searchParams.get('search') || undefined,
    limit: parseInt(url.searchParams.get('limit') || '100'),
    offset: parseInt(url.searchParams.get('offset') || '0'),
  };
}

export async function handleApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (path === '/api/status') {
    const status = await fetchStatus();
    const workers = await fetchWorkers();
    return json({
      ...status,
      worker_count: workers.length,
      mcp_count: workers.filter(w => w.has_mcp).length,
    });
  }

  if (path === '/api/workers') {
    const workers = await fetchWorkers();
    const opts = parseQueryOpts(url);
    return json(filterWorkers(workers, opts));
  }

  if (path === '/api/mcp-apps') {
    const workers = await fetchWorkers();
    const opts = parseQueryOpts(url);
    const mcpApps = filterWorkers(workers.filter(w => w.has_mcp), opts);
    return json(mcpApps);
  }

  if (path === '/api/tools') {
    // Tools are derived from MCP Workers — in v0.1 we return stub data
    // until afo-ui-auditor-mcp or toolsmith-tool-inventory is wired
    const workers = await fetchWorkers();
    const tools: Tool[] = workers
      .filter(w => w.has_mcp)
      .map(w => ({
        id: `${w.id}:mcp`,
        name: `${w.name} MCP`,
        description: `MCP endpoint for ${w.name}`,
        worker_id: w.id,
        worker_name: w.name,
        widget_enabled: w.has_widget,
      }));
    return json(tools);
  }

  if (path === '/api/d1') {
    // D1 databases — derived from worker d1_binding fields in v0.1
    const workers = await fetchWorkers();
    const dbMap = new Map<string, D1Database>();
    for (const w of workers) {
      if (w.d1_binding) {
        const key = w.d1_binding;
        if (!dbMap.has(key)) {
          dbMap.set(key, {
            id: key,
            name: key,
            bound_to_worker: w.name,
          });
        }
      }
    }
    return json(Array.from(dbMap.values()));
  }

  if (path === '/api/endpoints') {
    const workers = await fetchWorkers();
    const endpoints: Endpoint[] = [];
    for (const w of workers) {
      if (w.health_url) {
        endpoints.push({ worker_id: w.id, worker_name: w.name, method: 'GET', path: '/health', description: 'Health check' });
      }
      if (w.mcp_url) {
        endpoints.push({ worker_id: w.id, worker_name: w.name, method: 'GET', path: '/mcp', description: 'MCP endpoint' });
        endpoints.push({ worker_id: w.id, worker_name: w.name, method: 'POST', path: '/mcp', description: 'MCP tool call' });
      }
    }
    return json(endpoints);
  }

  if (path === '/api/export') {
    const workers = await fetchWorkers();
    const mcpApps = workers.filter(w => w.has_mcp);
    const tools: Tool[] = mcpApps.map(w => ({
      id: `${w.id}:mcp`,
      name: `${w.name} MCP`,
      description: `MCP endpoint for ${w.name}`,
      worker_id: w.id,
      worker_name: w.name,
      widget_enabled: w.has_widget,
    }));
    const dbMap = new Map<string, D1Database>();
    for (const w of workers) {
      if (w.d1_binding) {
        dbMap.set(w.d1_binding, { id: w.d1_binding, name: w.d1_binding, bound_to_worker: w.name });
      }
    }
    return json({
      generated_at: new Date().toISOString(),
      version: BROWSER_VERSION,
      workers,
      mcp_apps: mcpApps,
      tools,
      d1_databases: Array.from(dbMap.values()),
      endpoints: [],
    });
  }

  return null; // not an /api route
}
