const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// We need to inject target divs in the title bar of Dashboard:
// 1. A place for the Prefix Indicator: id="cmd-prefix-indicator-portal"
// 2. A place for the Nav bar: id="cmd-nav-bar-portal"

// Let's replace the modal title bar:
const titleBarRightInsert = `<div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
                    {commands.length} Active Triggers
                  </span>`;

const titleBarRightReplacement = `<div className="flex items-center gap-3">
                  <div id="cmd-prefix-indicator-portal"></div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
                    {commands.length} Active Triggers
                  </span>`;

content = content.replace(titleBarRightInsert, titleBarRightReplacement);

const modalContentInsert = `<div className="p-6 overflow-y-auto">`;
const modalContentReplacement = `<div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">`;

content = content.replace(modalContentInsert, modalContentReplacement);

fs.writeFileSync('src/components/Dashboard.tsx', content);
