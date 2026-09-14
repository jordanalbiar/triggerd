const fs = require('fs');
let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const prefixRegex = /\{\/\* Command Trigger Prefix & Suffix Presets Control Panel \*\/\}.*?(?=\{\/\* Category Filter Tabs Bar \*\/\})/s;
const prefixMatch = content.match(prefixRegex);

if (prefixMatch) {
  let prefixPanel = prefixMatch[0];
  // Replace the mb-5 ... classes to look like an accordion attached to the top
  prefixPanel = prefixPanel.replace('className="mb-5 p-4 bg-[#020b18] border border-[#003865] rounded-2xl font-mono text-xs space-y-3.5 shadow-xl"', 'className="p-4 bg-[#04182e] border-b border-[#00f0ff]/30 font-mono text-xs space-y-3.5 shadow-xl"');

  // We have to wrap it inside a <div className="something"> if we want, but it already has a div.
  // Wait, React createPortal needs exactly one child or fragment.
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

// Now let's add the Custom category to the Category Filter Tabs Bar
const categoryTabsInsert = `        <button
          onClick={() => setSelectedCategory('utility')}
          className={\`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 \${selectedCategory === 'utility' ? 'bg-[#00f0ff] text-black font-black shadow-lg shadow-[#00f0ff]/30' : 'bg-[#0a2540] text-[#00f0ff] hover:bg-[#00f0ff]/20'}\`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>FX & Utility</span>
        </button>`;

const customTabReplacement = categoryTabsInsert + `
        <button
          onClick={() => setSelectedCategory('custom')}
          className={\`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 \${selectedCategory === 'custom' ? 'bg-orange-400 text-black font-black shadow-lg shadow-orange-400/30' : 'bg-[#0a2540] text-orange-300 hover:bg-orange-500/20'}\`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Custom</span>
        </button>`;

content = content.replace(categoryTabsInsert, customTabReplacement);

// We need to add 'custom' to the filtering logic at the top of CommandManager.tsx:
const filteringInsert = "if (selectedCategory === 'utility') return style.includes('gif') || style.includes('yt') || style.includes('time') || style.includes('rain') || style.includes('matrix') || style.includes('clear') || style.includes('test');";
const filteringReplacement = filteringInsert + "\n    if (selectedCategory === 'custom') return cmd.spriteStyle === 'custom' || !!cmd.customHtml || !!cmd.mediaUrl;";

content = content.replace(filteringInsert, filteringReplacement);

fs.writeFileSync('src/components/CommandManager.tsx', content);
