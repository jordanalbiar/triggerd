const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Strip out the customPrefix states
content = content.replace(/const \[customPrefix.*?;/, "");
content = content.replace(/const \[customSuffix.*?;/, "");
content = content.replace(/const \[showPrefixAccordion.*?;/, "");

// Replace the messed up title bar right side with the portal target
const titleBarMessedUp = `<button onClick={() => setShowPrefixAccordion(!showPrefixAccordion)} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a2540] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition cursor-pointer text-xs font-mono font-bold">
    Prefix: {customPrefix || 'None'} {showPrefixAccordion ? '▲' : '▼'}
  </button>
  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
    {commands.length} Active Triggers
  </span>`;
content = content.replace(titleBarMessedUp, `<div id="cmd-prefix-indicator-portal"></div>
  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
    {commands.length} Active Triggers
  </span>`);

// Replace the accordion portal we inserted
const accordionMessedUp = /<div className="flex-col bg-\[#020b18\] border-b border-\[#003865\] w-full" id="cmd-nav-bar-portal"><\/div>\s*<div className="p-6 overflow-y-auto">\s*\{showPrefixAccordion && \([\s\S]*?\}\)/;
content = content.replace(accordionMessedUp, `<div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">`);

fs.writeFileSync('src/components/Dashboard.tsx', content);
