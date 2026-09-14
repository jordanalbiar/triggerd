const fs = require('fs');

let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
let cmdMgr = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// Dashboard modifications
// We need to add state for customPrefix, customSuffix, showPrefixAccordion in Dashboard.
const dashboardStateInsert = `
  const [customPrefix, setCustomPrefix] = useState<string>('');
  const [customSuffix, setCustomSuffix] = useState<string>('');
  const [showPrefixAccordion, setShowPrefixAccordion] = useState<boolean>(false);
`;
dashboard = dashboard.replace(/const \[showTriggersGuide, setShowTriggersGuide\] = useState\(false\);/, "const [showTriggersGuide, setShowTriggersGuide] = useState(false);" + dashboardStateInsert);

// Now in Dashboard where the Title bar is:
const titleBarRightInsert = `
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base font-bold text-white uppercase tracking-wider">
                      Preset Commands & Overlay Trigger Lines
                    </h2>
                  </div>
`;
const titleBarReplacement = `
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base font-bold text-white uppercase tracking-wider">
                      Preset Commands & Overlay Trigger Lines
                    </h2>
                  </div>
`;
// Let's find the exact title bar right side to insert the indicator:
dashboard = dashboard.replace(
  /<span className="text-xs font-mono px-2 py-0.5 rounded-full bg-\[#00f0ff\]\/20 text-\[#00f0ff\] border border-\[#00f0ff\]\/30 font-bold uppercase shrink-0">\s*\{commands.length\} Active Triggers\s*<\/span>/,
  `<button onClick={() => setShowPrefixAccordion(!showPrefixAccordion)} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a2540] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition cursor-pointer text-xs font-mono font-bold">
    Prefix: {customPrefix || 'None'} {showPrefixAccordion ? '▲' : '▼'}
  </button>
  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
    {commands.length} Active Triggers
  </span>`
);

// We will also insert the accordion below the title bar but inside the modal content
dashboard = dashboard.replace(
  /<div className="p-6 overflow-y-auto">/,
  `<div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div>
   <div className="p-6 overflow-y-auto">
      {showPrefixAccordion && (
        <div className="mb-5 p-4 bg-[#0a2540] border border-[#00f0ff]/50 rounded-xl font-mono text-xs space-y-3.5 shadow-xl">
          <div className="space-y-1 border-b border-[#003865]/80 pb-2.5">
            <div className="flex items-center gap-2 text-[#00f0ff] font-black text-sm uppercase tracking-wider">
              <span>Command Trigger Prefix & Suffix Presets</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-3 space-y-1">
              <label className="text-[11px] text-[#00f0ff] font-bold block">Prefix (Before Command):</label>
              <input
                type="text"
                value={customPrefix}
                onChange={(e) => {
                  setCustomPrefix(e.target.value);
                  // We let the CommandManager handle the actual update logic or do it here.
                }}
                placeholder="e.g. . or ! or /"
                className="w-full bg-[#04182e] border border-[#003865] focus:border-[#00f0ff] rounded-xl px-3 py-1.5 text-[#00f0ff] font-bold text-xs outline-none"
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[11px] text-emerald-300 font-bold block">Suffix (After Command):</label>
              <input
                type="text"
                value={customSuffix}
                onChange={(e) => {
                  setCustomSuffix(e.target.value);
                }}
                placeholder="e.g. . or ! or _"
                className="w-full bg-[#04182e] border border-[#003865] focus:border-emerald-400 rounded-xl px-3 py-1.5 text-emerald-300 font-bold text-xs outline-none"
              />
            </div>
          </div>
        </div>
      )}`
);

fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
