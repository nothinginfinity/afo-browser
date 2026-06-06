// ui.ts — AFO Browser v0.1
// Full HTML dashboard string

import { BROWSER_VERSION } from './inventory';

export function renderDashboard(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AFO Browser</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    /* ── Design Tokens ── */
    :root, [data-theme="dark"] {
      --color-bg:             #0c0c0c;
      --color-surface:        #141414;
      --color-surface-2:      #1a1a1a;
      --color-surface-3:      #212121;
      --color-border:         #2a2a2a;
      --color-divider:        #222;
      --color-text:           #e8e8e8;
      --color-text-muted:     #888;
      --color-text-faint:     #555;
      --color-primary:        #4f98a3;
      --color-primary-hover:  #5faaB6;
      --color-primary-dim:    rgba(79,152,163,0.12);
      --color-success:        #6daa45;
      --color-error:          #c04a5a;
      --color-warning:        #d19900;
      --color-tag-bg:         #1e2a2b;
      --font-body:            'Geist', 'Helvetica Neue', sans-serif;
      --font-mono:            'Geist Mono', 'Courier New', monospace;
      --radius-sm: 4px; --radius-md: 6px; --radius-lg: 10px; --radius-full: 9999px;
      --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
      --space-6: 24px; --space-8: 32px; --space-12: 48px;
      --transition: 150ms cubic-bezier(0.16, 1, 0.3, 1);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
    }
    [data-theme="light"] {
      --color-bg:             #f5f4f1;
      --color-surface:        #fafaf8;
      --color-surface-2:      #ffffff;
      --color-surface-3:      #f0eeeb;
      --color-border:         #d8d6d2;
      --color-divider:        #e2e0dc;
      --color-text:           #1a1917;
      --color-text-muted:     #6b6a68;
      --color-text-faint:     #aaa;
      --color-primary:        #01696f;
      --color-primary-hover:  #0c4e54;
      --color-primary-dim:    rgba(1,105,111,0.08);
      --color-success:        #437a22;
      --color-error:          #a12c3a;
      --color-warning:        #a07800;
      --color-tag-bg:         #e0ecec;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
    body { font-family: var(--font-body); font-size: 14px; color: var(--color-text); background: var(--color-bg); min-height: 100dvh; line-height: 1.5; }
    img, svg { display: block; }
    button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
    a { color: var(--color-primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    :focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: var(--radius-sm); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

    /* ── Layout ── */
    .app { display: grid; grid-template-rows: 56px 1fr; height: 100dvh; overflow: hidden; }
    .header { display: flex; align-items: center; gap: var(--space-4); padding: 0 var(--space-6); background: var(--color-surface); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 10; }
    .main { overflow-y: auto; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-6); }

    /* ── Header ── */
    .logo { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
    .logo-text { font-size: 15px; font-weight: 600; letter-spacing: -0.02em; color: var(--color-text); }
    .logo-text span { color: var(--color-primary); }
    .version-badge { font-size: 11px; font-family: var(--font-mono); background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-muted); padding: 2px 7px; border-radius: var(--radius-full); }
    .header-sep { flex: 1; }
    .search-wrap { position: relative; }
    .search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--color-text-faint); pointer-events: none; }
    #globalSearch { background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text); padding: 6px 12px 6px 32px; border-radius: var(--radius-md); font-size: 13px; width: 220px; outline: none; transition: border-color var(--transition); }
    #globalSearch:focus { border-color: var(--color-primary); }
    #globalSearch::placeholder { color: var(--color-text-faint); }
    .last-refresh { font-size: 12px; color: var(--color-text-faint); font-family: var(--font-mono); white-space: nowrap; }
    .btn { display: inline-flex; align-items: center; gap: var(--space-1); padding: 6px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; transition: background var(--transition), color var(--transition), border-color var(--transition); border: 1px solid transparent; cursor: pointer; }
    .btn-ghost { border-color: var(--color-border); color: var(--color-text-muted); }
    .btn-ghost:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-dim); }
    .btn-primary { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
    .btn-primary:hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }
    .icon-btn { padding: 6px; border-radius: var(--radius-md); color: var(--color-text-muted); border: 1px solid var(--color-border); }
    .icon-btn:hover { color: var(--color-text); border-color: var(--color-primary); background: var(--color-primary-dim); }

    /* ── Overview Cards ── */
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--space-4); }
    .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4) var(--space-4) var(--space-3); display: flex; flex-direction: column; gap: var(--space-2); transition: border-color var(--transition); }
    .card:hover { border-color: var(--color-primary); }
    .card-label { font-size: 12px; color: var(--color-text-muted); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; }
    .card-value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; font-family: var(--font-mono); }
    .card-sub { font-size: 12px; color: var(--color-text-faint); }

    /* ── Cluster Filter ── */
    .cluster-bar { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    .cluster-pill { padding: 4px 12px; border-radius: var(--radius-full); font-size: 12px; font-weight: 500; border: 1px solid var(--color-border); color: var(--color-text-muted); transition: all var(--transition); background: var(--color-surface); }
    .cluster-pill:hover, .cluster-pill.active { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-dim); }

    /* ── Section / Table ── */
    .section { display: flex; flex-direction: column; gap: var(--space-3); }
    .section-header { display: flex; align-items: center; gap: var(--space-3); }
    .section-title { font-size: 13px; font-weight: 600; color: var(--color-text); letter-spacing: 0.01em; }
    .section-count { font-size: 12px; font-family: var(--font-mono); color: var(--color-text-faint); background: var(--color-surface-3); padding: 2px 7px; border-radius: var(--radius-full); border: 1px solid var(--color-border); }
    .table-wrap { border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: var(--color-surface-3); }
    th { padding: 9px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); white-space: nowrap; border-bottom: 1px solid var(--color-border); cursor: pointer; user-select: none; }
    th:hover { color: var(--color-text); }
    td { padding: 9px 12px; border-bottom: 1px solid var(--color-divider); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: var(--color-surface-2); }
    .mono { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-muted); }
    .tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; font-weight: 500; background: var(--color-tag-bg); color: var(--color-primary); border: 1px solid rgba(79,152,163,0.2); }
    .status-ok::before { content: ''; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--color-success); margin-right: 6px; }
    .status-fail::before { content: ''; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--color-error); margin-right: 6px; }
    .status-unknown::before { content: ''; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--color-warning); margin-right: 6px; }
    .btn-open { padding: 3px 10px; font-size: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); color: var(--color-text-muted); transition: all var(--transition); }
    .btn-open:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-dim); }
    .empty-state { padding: var(--space-12) var(--space-8); text-align: center; color: var(--color-text-faint); font-size: 13px; }

    /* ── Raw JSON Viewer ── */
    .json-drawer { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
    .json-drawer-header { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border); background: var(--color-surface-3); }
    .json-body { padding: var(--space-4); overflow: auto; max-height: 320px; }
    pre { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-muted); white-space: pre; line-height: 1.6; }

    /* ── Loading / Skeleton ── */
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    .skeleton { background: linear-gradient(90deg, var(--color-surface-3) 25%, var(--color-surface-2) 50%, var(--color-surface-3) 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: var(--radius-sm); }
    .skel-row td div { height: 14px; border-radius: var(--radius-sm); }

    /* ── Tabs ── */
    .tabs { display: flex; border-bottom: 1px solid var(--color-border); gap: 0; }
    .tab { padding: 10px 16px; font-size: 13px; font-weight: 500; color: var(--color-text-muted); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color var(--transition), border-color var(--transition); }
    .tab:hover { color: var(--color-text); }
    .tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      .main { padding: var(--space-4); }
      .header { padding: 0 var(--space-4); gap: var(--space-2); }
      #globalSearch { width: 140px; }
      .last-refresh { display: none; }
      th:nth-child(n+4), td:nth-child(n+4) { display: none; }
    }
  </style>
</head>
<body>
<div class="app">
  <!-- ── Header ── -->
  <header class="header">
    <div class="logo">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-label="AFO Browser" xmlns="http://www.w3.org/2000/svg">
        <rect width="22" height="22" rx="5" fill="currentColor" opacity="0.08"/>
        <path d="M4 16 L8 6 L11 12 L14 8 L18 16" stroke="#4f98a3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="11" cy="11" r="2" fill="#4f98a3" opacity="0.4"/>
      </svg>
      <span class="logo-text">AFO <span>Browser</span></span>
    </div>
    <span class="version-badge">v${BROWSER_VERSION}</span>
    <div class="header-sep"></div>
    <span class="last-refresh" id="lastRefresh">—</span>
    <div class="search-wrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input id="globalSearch" type="search" placeholder="Search workers, tools…" autocomplete="off">
    </div>
    <button class="btn btn-ghost" id="refreshBtn" title="Refresh inventory">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-9 9"/><path d="M3 12a9 9 0 0 1 9-9"/><polyline points="21 3 21 9 15 9"/><polyline points="3 21 3 15 9 15"/></svg>
      Refresh
    </button>
    <button class="icon-btn" id="themeToggle" data-theme-toggle aria-label="Toggle theme" title="Toggle theme">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </header>

  <!-- ── Main ── -->
  <main class="main" id="main">

    <!-- Overview Cards -->
    <div class="cards" id="overviewCards">
      <div class="card"><div class="card-label">Workers</div><div class="card-value" id="statWorkers">—</div><div class="card-sub">registered</div></div>
      <div class="card"><div class="card-label">MCP Apps</div><div class="card-value" id="statMcp">—</div><div class="card-sub">with /mcp endpoint</div></div>
      <div class="card"><div class="card-label">Tools</div><div class="card-value" id="statTools">—</div><div class="card-sub">across MCP workers</div></div>
      <div class="card"><div class="card-label">D1 Databases</div><div class="card-value" id="statD1">—</div><div class="card-sub">bound</div></div>
    </div>

    <!-- Cluster Filter -->
    <div class="cluster-bar" id="clusterBar">
      <button class="cluster-pill active" data-cluster="all">All</button>
      <button class="cluster-pill" data-cluster="message-os">message-os</button>
      <button class="cluster-pill" data-cluster="toolsmith">toolsmith</button>
      <button class="cluster-pill" data-cluster="docparse">docparse</button>
      <button class="cluster-pill" data-cluster="afo-control">afo-control</button>
      <button class="cluster-pill" data-cluster="afo-ui">afo-ui</button>
      <button class="cluster-pill" data-cluster="infra">infra</button>
    </div>

    <!-- Tabs -->
    <div class="tabs" id="mainTabs">
      <button class="tab active" data-tab="workers">Workers</button>
      <button class="tab" data-tab="mcp">MCP Apps</button>
      <button class="tab" data-tab="tools">Tools</button>
      <button class="tab" data-tab="d1">D1 Databases</button>
      <button class="tab" data-tab="endpoints">Endpoints</button>
    </div>

    <!-- Workers Table -->
    <div class="section" id="tab-workers">
      <div class="section-header">
        <span class="section-title">Workers</span>
        <span class="section-count" id="workersCount">0</span>
        <div style="flex:1"></div>
        <button class="btn btn-ghost" id="exportBtn" style="font-size:12px;padding:4px 10px;">Export JSON</button>
      </div>
      <div class="table-wrap">
        <table id="workersTable">
          <thead><tr>
            <th data-col="name">Name</th>
            <th data-col="domain">Domain</th>
            <th data-col="health_status">Health</th>
            <th data-col="has_mcp">MCP</th>
            <th data-col="cluster">Cluster</th>
            <th data-col="d1_binding">D1</th>
            <th></th>
          </tr></thead>
          <tbody id="workersBody"><tr class="skel-row"><td><div class="skeleton" style="width:120px"></div></td><td><div class="skeleton" style="width:180px"></div></td><td><div class="skeleton" style="width:50px"></div></td><td><div class="skeleton" style="width:30px"></div></td><td><div class="skeleton" style="width:80px"></div></td><td><div class="skeleton" style="width:100px"></div></td><td></td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- MCP Apps Table -->
    <div class="section" id="tab-mcp" style="display:none">
      <div class="section-header"><span class="section-title">MCP Apps</span><span class="section-count" id="mcpCount">0</span></div>
      <div class="table-wrap"><table id="mcpTable">
        <thead><tr><th>Name</th><th>MCP URL</th><th>Widget</th><th>Status</th><th></th></tr></thead>
        <tbody id="mcpBody"></tbody>
      </table></div>
    </div>

    <!-- Tools Table -->
    <div class="section" id="tab-tools" style="display:none">
      <div class="section-header"><span class="section-title">Tool Catalog</span><span class="section-count" id="toolsCount">0</span></div>
      <div class="table-wrap"><table id="toolsTable">
        <thead><tr><th>Tool Name</th><th>MCP Worker</th><th>Description</th><th>Widget</th></tr></thead>
        <tbody id="toolsBody"></tbody>
      </table></div>
    </div>

    <!-- D1 Table -->
    <div class="section" id="tab-d1" style="display:none">
      <div class="section-header"><span class="section-title">D1 Databases</span><span class="section-count" id="d1Count">0</span></div>
      <div class="table-wrap"><table id="d1Table">
        <thead><tr><th>Name</th><th>Bound to Worker</th><th>Known Tables</th></tr></thead>
        <tbody id="d1Body"></tbody>
      </table></div>
    </div>

    <!-- Endpoints Table -->
    <div class="section" id="tab-endpoints" style="display:none">
      <div class="section-header"><span class="section-title">Endpoint Map</span><span class="section-count" id="endpointsCount">0</span></div>
      <div class="table-wrap"><table id="endpointsTable">
        <thead><tr><th>Worker</th><th>Method</th><th>Path</th><th>Description</th></tr></thead>
        <tbody id="endpointsBody"></tbody>
      </table></div>
    </div>

    <!-- Raw JSON Drawer -->
    <div class="json-drawer" id="jsonDrawer" style="display:none">
      <div class="json-drawer-header">
        <span class="section-title">Raw JSON</span>
        <div style="flex:1"></div>
        <button class="btn btn-ghost" id="copyJsonBtn" style="font-size:12px;padding:4px 10px;">Copy</button>
        <button class="icon-btn" id="closeJsonBtn" aria-label="Close" style="margin-left:4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="json-body"><pre id="jsonContent"></pre></div>
    </div>

  </main>
</div>

<script>
(function() {
  // ── Theme toggle ──
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  let theme = 'dark';
  themeBtn && themeBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    themeBtn.innerHTML = theme === 'dark'
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  });

  // ── State ──
  let allWorkers = [], allMcp = [], allTools = [], allD1 = [], allEndpoints = [];
  let activeCluster = 'all', activeSearch = '', activeTab = 'workers';

  // ── Tab navigation ──
  document.getElementById('mainTabs').addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    ['workers','mcp','tools','d1','endpoints'].forEach(t => {
      document.getElementById('tab-' + t).style.display = t === activeTab ? '' : 'none';
    });
    renderActiveTab();
  });

  // ── Cluster filter ──
  document.getElementById('clusterBar').addEventListener('click', e => {
    const pill = e.target.closest('[data-cluster]');
    if (!pill) return;
    document.querySelectorAll('.cluster-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCluster = pill.dataset.cluster;
    renderActiveTab();
  });

  // ── Search ──
  document.getElementById('globalSearch').addEventListener('input', e => {
    activeSearch = e.target.value.toLowerCase();
    renderActiveTab();
  });

  // ── Helpers ──
  function matchWorker(w) {
    if (activeCluster !== 'all' && w.cluster !== activeCluster) return false;
    if (!activeSearch) return true;
    return (w.name||'').includes(activeSearch) || (w.domain||'').includes(activeSearch) || (w.cluster||'').includes(activeSearch);
  }
  function matchTool(t) {
    if (!activeSearch) return true;
    return (t.name||'').includes(activeSearch) || (t.description||'').includes(activeSearch) || (t.worker_name||'').includes(activeSearch);
  }
  function statusDot(s) {
    return '<span class="status-' + (s||'unknown') + '">' + (s === 'ok' ? 'ok' : s === 'fail' ? 'fail' : '?') + '</span>';
  }
  function check(v) { return v ? '✅' : '—'; }
  function tag(v) { return v ? '<span class="tag">' + v + '</span>' : '<span style="color:var(--color-text-faint)">—</span>'; }
  function openBtn(url) {
    if (!url) return '—';
    return '<button class="btn-open" onclick="window.open(\'' + url + '\',\'_blank\')" title="Open in new tab">↗ Open</button>';
  }
  function domainLink(d) {
    if (!d) return '<span style="color:var(--color-text-faint)">—</span>';
    const url = 'https://' + d;
    return '<a href="' + url + '" target="_blank" rel="noopener" class="mono">' + d + '</a>';
  }
  function setCount(id, n) { const el = document.getElementById(id); if (el) el.textContent = n; }

  // ── Render ──
  function renderActiveTab() {
    if (activeTab === 'workers') renderWorkers();
    else if (activeTab === 'mcp') renderMcp();
    else if (activeTab === 'tools') renderTools();
    else if (activeTab === 'd1') renderD1();
    else if (activeTab === 'endpoints') renderEndpoints();
  }

  function renderWorkers() {
    const rows = allWorkers.filter(matchWorker);
    setCount('workersCount', rows.length);
    const tbody = document.getElementById('workersBody');
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No workers found.</td></tr>'; return; }
    tbody.innerHTML = rows.map(w => `<tr>
      <td><strong style="font-size:13px">${w.name}</strong></td>
      <td>${domainLink(w.domain)}</td>
      <td>${statusDot(w.health_status)}</td>
      <td>${check(w.has_mcp)}</td>
      <td>${tag(w.cluster)}</td>
      <td><span class="mono">${w.d1_binding || '—'}</span></td>
      <td>${openBtn(w.domain ? 'https://' + w.domain : null)}</td>
    </tr>`).join('');
  }

  function renderMcp() {
    const rows = allMcp.filter(matchWorker);
    setCount('mcpCount', rows.length);
    const tbody = document.getElementById('mcpBody');
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No MCP apps found.</td></tr>'; return; }
    tbody.innerHTML = rows.map(w => `<tr>
      <td><strong>${w.name}</strong></td>
      <td>${w.mcp_url ? '<a href="' + w.mcp_url + '" target="_blank" class="mono" rel="noopener">' + w.mcp_url + '</a>' : '—'}</td>
      <td>${check(w.has_widget)}</td>
      <td>${statusDot(w.health_status)}</td>
      <td>${openBtn(w.mcp_url)}</td>
    </tr>`).join('');
  }

  function renderTools() {
    const rows = allTools.filter(matchTool);
    setCount('toolsCount', rows.length);
    const tbody = document.getElementById('toolsBody');
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No tools found.</td></tr>'; return; }
    tbody.innerHTML = rows.map(t => `<tr>
      <td><strong class="mono">${t.name}</strong></td>
      <td>${t.worker_name || '—'}</td>
      <td style="color:var(--color-text-muted);max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(t.description||'').substring(0,80)}</td>
      <td>${check(t.widget_enabled)}</td>
    </tr>`).join('');
  }

  function renderD1() {
    setCount('d1Count', allD1.length);
    const tbody = document.getElementById('d1Body');
    if (!allD1.length) { tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No D1 databases found.</td></tr>'; return; }
    tbody.innerHTML = allD1.map(db => `<tr>
      <td><strong>${db.name}</strong></td>
      <td>${db.bound_to_worker || '—'}</td>
      <td>${(db.known_tables||[]).join(', ') || '—'}</td>
    </tr>`).join('');
  }

  function renderEndpoints() {
    const rows = allEndpoints.filter(e => {
      if (activeCluster !== 'all') {
        const w = allWorkers.find(w => w.id === e.worker_id);
        if (!w || w.cluster !== activeCluster) return false;
      }
      if (activeSearch) return (e.worker_name||'').includes(activeSearch) || e.path.includes(activeSearch);
      return true;
    });
    setCount('endpointsCount', rows.length);
    const tbody = document.getElementById('endpointsBody');
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No endpoints found.</td></tr>'; return; }
    tbody.innerHTML = rows.map(e => `<tr>
      <td>${e.worker_name || e.worker_id}</td>
      <td><span class="tag">${e.method}</span></td>
      <td class="mono">${e.path}</td>
      <td style="color:var(--color-text-muted)">${e.description||'—'}</td>
    </tr>`).join('');
  }

  // ── Load data ──
  async function loadAll() {
    document.getElementById('lastRefresh').textContent = 'Loading…';
    try {
      const [ws, ms, ts, ds, es] = await Promise.all([
        fetch('/api/workers').then(r => r.json()),
        fetch('/api/mcp-apps').then(r => r.json()),
        fetch('/api/tools').then(r => r.json()),
        fetch('/api/d1').then(r => r.json()),
        fetch('/api/endpoints').then(r => r.json()),
      ]);
      allWorkers = Array.isArray(ws) ? ws : [];
      allMcp = Array.isArray(ms) ? ms : [];
      allTools = Array.isArray(ts) ? ts : [];
      allD1 = Array.isArray(ds) ? ds : [];
      allEndpoints = Array.isArray(es) ? es : [];

      setCount('statWorkers', allWorkers.length);
      setCount('statMcp', allMcp.length);
      setCount('statTools', allTools.length);
      setCount('statD1', allD1.length);
      document.getElementById('lastRefresh').textContent = 'Refreshed ' + new Date().toLocaleTimeString();
      renderActiveTab();
    } catch(err) {
      document.getElementById('lastRefresh').textContent = 'Error loading data';
      console.error(err);
    }
  }

  document.getElementById('refreshBtn').addEventListener('click', loadAll);

  // ── Export ──
  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = { workers: allWorkers, mcp_apps: allMcp, tools: allTools, d1_databases: allD1, endpoints: allEndpoints };
    const json = JSON.stringify(data, null, 2);
    document.getElementById('jsonContent').textContent = json;
    document.getElementById('jsonDrawer').style.display = '';
  });
  document.getElementById('closeJsonBtn').addEventListener('click', () => {
    document.getElementById('jsonDrawer').style.display = 'none';
  });
  document.getElementById('copyJsonBtn').addEventListener('click', () => {
    const text = document.getElementById('jsonContent').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyJsonBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    });
  });

  loadAll();
})();
</script>
</body></html>`;
}
