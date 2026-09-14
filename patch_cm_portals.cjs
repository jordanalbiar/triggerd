const fs = require('fs');
let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// Add import
content = content.replace("import React, { useState, useRef, useEffect } from 'react';", "import React, { useState, useRef, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");

// Add showPrefixAccordion state
content = content.replace("const [customPrefix, setCustomPrefix] = useState<string>('');", "const [customPrefix, setCustomPrefix] = useState<string>('');\n  const [showPrefixAccordion, setShowPrefixAccordion] = useState<boolean>(false);");

// Extract the header controls bar
const headerControlsRegex = /\{\/\* Header Controls Bar \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>/s;
const headerMatch = content.match(headerControlsRegex);

if (headerMatch) {
  let headerControls = headerMatch[0];
  // Modify the header controls bar to look like a nav bar under the title bar
  headerControls = headerControls.replace('className="flex flex-col gap-4 mb-6 pb-4 border-b border-brand-border/20 font-mono"', 'className="flex items-center justify-between w-full p-2 bg-[#020b18] border-b border-[#003865] font-mono shadow-inner"');
  headerControls = headerControls.replace('<div className="flex flex-col gap-4 p-3 bg-[#020b18] border border-[#003865] rounded-2xl shadow-inner">', '<div className="flex w-full items-center justify-between gap-4 px-2">');
  // Top Row: Tools
  headerControls = headerControls.replace('<div className="flex flex-wrap items-center justify-center gap-2">', '<div className="flex items-center gap-2">');
  // Bottom Row: Main Creation Actions
  headerControls = headerControls.replace('<div className="flex flex-wrap items-center justify-center gap-4 border-t border-[#003865] pt-4 mt-2">', '<div className="flex items-center gap-2">');

  // Also replace some button classes to make them fit in a nav bar better
  headerControls = headerControls.replace(/px-6 py-3 rounded-xl/g, 'px-3 py-1.5 rounded-lg');
  headerControls = headerControls.replace(/text-sm/g, 'text-xs');
  
  const portalCode = `
      {/* Portaled Navigation Bar */}
      {document.getElementById('cmd-nav-bar-portal') && createPortal(
        ${headerControls},
        document.getElementById('cmd-nav-bar-portal')!
      )}
  `;
  content = content.replace(headerControlsRegex, portalCode);
} else {
  console.log("Could not find header controls");
}

// Extract the Prefix & Suffix Presets panel
const prefixRegex = /\{\/\* Command Trigger Prefix & Suffix Presets Control Panel \*\/\}.*?(?=\{\/\* Commands Table \*\/\})/s;
const prefixMatch = content.match(prefixRegex);

if (prefixMatch) {
  let prefixPanel = prefixMatch[0];
  // Replace the mb-5 ... classes to look like an accordion attached to the top
  prefixPanel = prefixPanel.replace('className="mb-5 p-4 bg-[#020b18] border border-[#003865] rounded-2xl font-mono text-xs space-y-3.5 shadow-xl"', 'className="p-4 bg-[#04182e] border-b border-[#00f0ff]/30 font-mono text-xs space-y-3.5 shadow-xl"');

  const prefixIndicatorPortalCode = `
      {/* Portaled Prefix Indicator */}
      {document.getElementById('cmd-prefix-indicator-portal') && createPortal(
        <button onClick={() => setShowPrefixAccordion(!showPrefixAccordion)} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a2540] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition cursor-pointer text-xs font-mono font-bold" title="Toggle Prefix Options">
          Prefix: {customPrefix || 'None'} {showPrefixAccordion ? '▲' : '▼'}
        </button>,
        document.getElementById('cmd-prefix-indicator-portal')!
      )}
  `;

  const prefixAccordionPortalCode = `
      {/* Portaled Prefix Accordion */}
      {document.getElementById('cmd-prefix-accordion-portal') && showPrefixAccordion && createPortal(
        ${prefixPanel},
        document.getElementById('cmd-prefix-accordion-portal')!
      )}
  `;
  content = content.replace(prefixRegex, prefixIndicatorPortalCode + prefixAccordionPortalCode);
} else {
  console.log("Could not find prefix panel");
}

fs.writeFileSync('src/components/CommandManager.tsx', content);
