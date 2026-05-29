export default function Page() {
  return (
    <>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Meridian - Overview</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: "\n        /* Custom scrollbar for webkit */\n        ::-webkit-scrollbar { width: 8px; height: 8px; }\n        ::-webkit-scrollbar-track { background: transparent; }\n        ::-webkit-scrollbar-thumb { background: #33353a; border-radius: 4px; }\n        ::-webkit-scrollbar-thumb:hover { background: #44464e; }\n        \n        /* Sunken effect for inputs/cards */\n        .sunken { background-color: #1e1f22; }\n        \n        /* Specific card background per prompt */\n        .card-bg { background-color: #313338; }\n        \n        /* Page background override per prompt */\n        body { background-color: #2b2d31; }\n    " }} />
        {/* TopAppBar */}
        <header className="h-topbar-height w-full fixed top-0 z-50 border-b border-outline-variant bg-surface-container flex items-center justify-between px-margin-desktop h-[48px] flat no shadows">
          <div className="flex items-center gap-4">
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary tracking-tight cursor-pointer active:opacity-80">Meridian</span>
            {/* Command Bar (Sunken) */}
            <div className="hidden md:flex items-center bg-[#1e1f22] rounded-md px-3 py-1.5 w-96 border border-transparent focus-within:border-primary-container/50 focus-within:ring-2 focus-within:ring-primary-container/30 transition-all ml-4">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
              <input className="bg-transparent border-none outline-none text-body-sm font-body-sm text-on-surface w-full placeholder:text-on-surface-variant/70 focus:ring-0 p-0 h-5" placeholder="Search prompts, evals, or logs... (⌘K)" type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-surface-variant rounded px-2 py-1 mr-4">
              <span className="font-code-sm text-code-sm text-on-surface-variant">Production</span>
            </div>
            <button aria-label="Notifications" className="p-1.5 rounded text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button aria-label="Settings Suggest" className="p-1.5 rounded text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
            </button>
          </div>
        </header>
        {/* SideNavBar */}
        <nav className="w-sidebar-width fixed left-0 top-0 h-full flex flex-col bg-surface-container-low border-r border-outline-variant flat no shadows flex flex-col w-[240px] h-screen pt-[48px] pb-0 z-40">
          {/* Workspace Header */}
          <div className="px-4 py-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-bold font-headline-md text-headline-md">M</div>
              <div>
                <h2 className="font-body-md text-body-md font-bold text-on-surface leading-tight">Workspace</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Enterprise Tier</p>
              </div>
            </div>
          </div>
          {/* Main Tabs */}
          <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {/* Active Tab: Overview */}
            <a className="flex items-center gap-3 px-3 py-2 bg-primary-container text-on-primary-container rounded-lg font-bold transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span className="font-body-sm text-body-sm">Overview</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span className="font-body-sm text-body-sm">Observability</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span className="font-body-sm text-body-sm">Prompts</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span className="font-body-sm text-body-sm">Evals</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">vpn_key</span>
              <span className="font-body-sm text-body-sm">API Keys</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">groups</span>
              <span className="font-body-sm text-body-sm">Team</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span className="font-body-sm text-body-sm">Settings</span>
            </a>
          </div>
          {/* User Bar Footer */}
          <div className="h-[52px] border-t border-white/5 px-3 py-2 flex items-center justify-between text-on-surface-variant hover:text-on-surface cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">data_usage</span>
              <span className="font-body-sm text-body-sm">Usage: 84%</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
          </div>
        </nav>
        {/* Main Content Canvas */}
        <main className="ml-sidebar-width pt-topbar-height h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {/* Page Header */}
            <div className="flex items-end justify-between mb-2">
              <div>
                <h1 className="font-headline-md text-[20px] font-bold text-white mb-1">Overview</h1>
                <p className="font-code-sm text-[13px] text-[#80848e]">Last updated 12s ago</p>
              </div>
              <div className="flex gap-3">
                <button className="px-3 py-1.5 bg-[#404249] hover:bg-[#4e5058] text-white font-body-sm text-body-sm rounded-md transition-colors border border-white/10">
                  Last 7 days <span className="text-[10px] ml-1">▼</span>
                </button>
                <button className="px-4 py-1.5 bg-primary-container hover:bg-[#4752c4] text-white font-body-sm text-body-sm font-medium rounded-md transition-colors shadow-sm">
                  + New Prompt
                </button>
              </div>
            </div>
            {/* Section 1: System Status Bar */}
            <div className="w-full h-[44px] card-bg rounded-[16px] flex items-center px-4 justify-between border border-white/5">
              <div className="flex items-center gap-6 text-[13px] font-body-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-on-surface">All systems operational</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-on-surface-variant">API</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-on-surface-variant">Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-on-surface-variant">Evals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-on-surface-variant">Webhooks</span>
                </div>
              </div>
              <a className="text-[13px] font-body-sm text-on-surface-variant hover:text-white transition-colors" href="#">
                Status page →
              </a>
            </div>
            {/* Section 2: Quick Action Rail */}
            <div className="flex gap-3 w-full">
              <button className="flex-1 flex items-center justify-center gap-2 sunken hover:bg-[#282a2f] border border-white/5 text-on-surface rounded-lg py-2.5 transition-colors group">
                <span className="material-symbols-outlined text-[16px] text-primary-container group-hover:text-primary transition-colors">add</span>
                <span className="font-body-sm text-body-sm font-medium">New Prompt</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 sunken hover:bg-[#282a2f] border border-white/5 text-on-surface rounded-lg py-2.5 transition-colors group">
                <span className="material-symbols-outlined text-[16px] text-[#ffb689] group-hover:text-[#ffdbc8] transition-colors" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
                <span className="font-body-sm text-body-sm font-medium">Run Eval</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 sunken hover:bg-[#282a2f] border border-white/5 text-on-surface rounded-lg py-2.5 transition-colors">
                <span className="text-[16px] opacity-70">⌘</span>
                <span className="font-body-sm text-body-sm font-medium">Playground</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 sunken hover:bg-[#282a2f] border border-white/5 text-on-surface rounded-lg py-2.5 transition-colors">
                <span className="text-[16px] opacity-70">≡</span>
                <span className="font-body-sm text-body-sm font-medium">View Logs</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 sunken hover:bg-[#282a2f] border border-white/5 text-on-surface rounded-lg py-2.5 transition-colors">
                <span className="text-[16px] opacity-70">⌘K</span>
                <span className="font-body-sm text-body-sm font-medium">Quick Command</span>
              </button>
            </div>
            {/* Section 3: Two-column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
              {/* Left Column (64%) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Metrics Strip */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Metric 1 */}
                  <div className="card-bg rounded-[16px] p-4 border border-white/5">
                    <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Total Requests (24h)</h3>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="font-code-md text-[28px] font-bold leading-none">1.24M</span>
                      <span className="font-body-sm text-[12px] text-green-400 mb-1">+12.4%</span>
                    </div>
                    <div className="w-full h-10 sunken rounded flex items-end px-1 pb-1 gap-1">
                      {/* Sparkline bars */}
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors h-[40%]" />
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors h-[60%]" />
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors h-[45%]" />
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors h-[80%]" />
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors h-[75%]" />
                      <div className="w-full bg-primary/40 hover:bg-primary/60 rounded-t transition-colors h-[95%] border-t border-primary" />
                    </div>
                  </div>
                  {/* Metric 2 */}
                  <div className="card-bg rounded-[16px] p-4 border border-white/5">
                    <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Avg Latency</h3>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="font-code-md text-[28px] font-bold leading-none">245<span className="text-[16px] text-on-surface-variant">ms</span></span>
                      <span className="font-body-sm text-[12px] text-yellow-400 mb-1">-2.1%</span>
                    </div>
                    <div className="w-full h-10 sunken rounded flex items-end px-1 pb-1 gap-1">
                      <div className="w-full bg-yellow-500/20 rounded-t h-[80%]" />
                      <div className="w-full bg-yellow-500/20 rounded-t h-[75%]" />
                      <div className="w-full bg-yellow-500/20 rounded-t h-[85%]" />
                      <div className="w-full bg-yellow-500/20 rounded-t h-[90%]" />
                      <div className="w-full bg-yellow-500/20 rounded-t h-[60%]" />
                      <div className="w-full bg-yellow-500/40 rounded-t h-[55%] border-t border-yellow-500" />
                    </div>
                  </div>
                  {/* Metric 3 */}
                  <div className="card-bg rounded-[16px] p-4 border border-white/5">
                    <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Eval Pass Rate</h3>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="font-code-md text-[28px] font-bold leading-none">94.2%</span>
                      <span className="font-body-sm text-[12px] text-green-400 mb-1">+0.8%</span>
                    </div>
                    <div className="w-full h-10 sunken rounded flex items-end px-1 pb-1 gap-1">
                      <div className="w-full bg-green-500/20 rounded-t h-[90%]" />
                      <div className="w-full bg-green-500/20 rounded-t h-[92%]" />
                      <div className="w-full bg-green-500/20 rounded-t h-[91%]" />
                      <div className="w-full bg-green-500/20 rounded-t h-[94%]" />
                      <div className="w-full bg-green-500/20 rounded-t h-[93%]" />
                      <div className="w-full bg-green-500/40 rounded-t h-[95%] border-t border-green-500" />
                    </div>
                  </div>
                </div>
                {/* Activity Feed */}
                <div className="card-bg rounded-[16px] border border-white/5 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <h2 className="font-headline-md text-[16px] font-bold">Activity</h2>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-label-caps text-[10px] border border-red-500/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                      </span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    {/* Event 1 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer group">
                      <div className="w-1 h-10 rounded-full bg-green-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">Eval run #47 completed</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Dataset 'customer-support-v2' processed 10,000 rows. Pass rate: 96%.</p>
                      </div>
                      <span className="font-code-sm text-[11px] text-on-surface-variant/60 whitespace-nowrap">2m ago</span>
                    </div>
                    {/* Event 2 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer group">
                      <div className="w-1 h-10 rounded-full bg-primary-container shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">Prompt deployed</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5"><span className="font-code-sm text-primary">sys_classifier_v3</span> was promoted to Production by Sarah J.</p>
                      </div>
                      <span className="font-code-sm text-[11px] text-on-surface-variant/60 whitespace-nowrap">15m ago</span>
                    </div>
                    {/* Event 3 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer group">
                      <div className="w-1 h-10 rounded-full bg-yellow-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">Rate limit warning</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">OpenAI GPT-4 usage approaching 90% of allocated TPM limit for project 'Marketing'.</p>
                      </div>
                      <span className="font-code-sm text-[11px] text-on-surface-variant/60 whitespace-nowrap">1h ago</span>
                    </div>
                    {/* Event 4 */}
                    <div className="flex items-start gap-4 p-3 hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer group">
                      <div className="w-1 h-10 rounded-full bg-gray-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">API Key Rotated</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Key ending in <code className="font-code-sm px-1 bg-surface rounded">...8f9a</code> was rotated automatically.</p>
                      </div>
                      <span className="font-code-sm text-[11px] text-on-surface-variant/60 whitespace-nowrap">3h ago</span>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01]">
                    <a className="text-[13px] font-body-sm text-primary hover:text-primary-container transition-colors font-medium" href="#">View full activity log →</a>
                  </div>
                </div>
              </div>
              {/* Right Column (36%) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Usage Overview */}
                <div className="card-bg rounded-[16px] border border-white/5 p-5">
                  <h2 className="font-headline-md text-[16px] font-bold mb-4">Usage Overview</h2>
                  <div className="space-y-4">
                    {/* Progress 1 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="font-body-sm text-[13px] text-on-surface-variant">API Requests</span>
                        <span className="font-code-sm text-[12px] text-on-surface">1.24M / 2M</span>
                      </div>
                      <div className="w-full h-1.5 sunken rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container w-[62%] rounded-full" />
                      </div>
                    </div>
                    {/* Progress 2 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="font-body-sm text-[13px] text-on-surface-variant">Tokens Generated</span>
                        <span className="font-code-sm text-[12px] text-on-surface">8.4B / 10B</span>
                      </div>
                      <div className="w-full h-1.5 sunken rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[84%] rounded-full" />
                      </div>
                    </div>
                    {/* Progress 3 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="font-body-sm text-[13px] text-on-surface-variant">Eval Runs</span>
                        <span className="font-code-sm text-[12px] text-on-surface">47 / 100</span>
                      </div>
                      <div className="w-full h-1.5 sunken rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[47%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Smart Alerts */}
                <div className="space-y-3">
                  <h2 className="font-headline-md text-[14px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Smart Alerts</h2>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3 border-l-4 border-l-yellow-500">
                    <span className="material-symbols-outlined text-yellow-500 text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>warning</span>
                    <div>
                      <h4 className="font-body-sm font-bold text-yellow-500 mb-0.5">Token Usage High</h4>
                      <p className="font-body-sm text-[12px] text-yellow-500/80 leading-snug">Project 'Marketing' is at 87% of its monthly token budget.</p>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 border-l-4 border-l-blue-500">
                    <span className="material-symbols-outlined text-blue-400 text-[20px]">info</span>
                    <div>
                      <h4 className="font-body-sm font-bold text-blue-400 mb-0.5">New Model Available</h4>
                      <p className="font-body-sm text-[12px] text-blue-400/80 leading-snug">Claude 3.5 Sonnet is now available in your region.</p>
                    </div>
                  </div>
                </div>
                {/* Scheduled Runs */}
                <div className="card-bg rounded-[16px] border border-white/5 p-5">
                  <h2 className="font-headline-md text-[16px] font-bold mb-4">Scheduled Evals</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-white/[0.03] transition-colors -mx-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">schedule</span>
                        <div>
                          <p className="font-body-sm text-[13px] font-medium">Nightly Regression</p>
                          <p className="font-code-sm text-[11px] text-on-surface-variant">00:00 UTC</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-label-caps text-[10px] border border-green-500/20">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-white/[0.03] transition-colors -mx-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">schedule</span>
                        <div>
                          <p className="font-body-sm text-[13px] font-medium">Weekly Safety Check</p>
                          <p className="font-code-sm text-[11px] text-on-surface-variant">Sun, 02:00 UTC</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-label-caps text-[10px] border border-green-500/20">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </>
  );
}