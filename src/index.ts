// index.ts — AFO Browser v0.1
// Cloudflare Worker entry point

import { handleApi } from './api';
import { renderDashboard } from './ui';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // ── API routes ──
    if (url.pathname.startsWith('/api/')) {
      const apiResponse = await handleApi(request);
      if (apiResponse) return apiResponse;
    }

    // ── Health check ──
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        ok: true,
        worker: 'afo-browser',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── UI ──
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(renderDashboard(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
