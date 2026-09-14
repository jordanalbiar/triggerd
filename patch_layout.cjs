const fs = require('fs');
const content = fs.readFileSync('src/components/StaticSourcesContent.tsx', 'utf8');

const oldGridStart = content.indexOf("{/* MULTI-ROW SOURCE TYPE SELECTOR TABS");
const oldGridEnd = content.indexOf("{/* DEDICATED GIF PORTAL SEARCH VIEW IN ADD MODE */}");

if (oldGridStart !== -1 && oldGridEnd !== -1) {
  let newContent = content.substring(0, oldGridStart);
  
  newContent += `{currentMode === 'add' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <h3 className="text-xs font-bold text-[var(--theme-muted,#80c8ff)] mb-3 flex items-center gap-2 uppercase tracking-wider"><Sparkles className="w-4 h-4 text-[#00f0ff]" /> Select Source Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-1">
            {SOURCE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => handleSelectTab(tab.type)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl text-[11px] font-bold transition cursor-pointer bg-[#0a2540] border border-[#003865] hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-zinc-300 hover:text-white group text-center gap-2 shadow-md"
                >
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform text-[#00f0ff]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(currentMode === 'create' || currentMode === 'edit') && (
        <>
      {/* DEDICATED GIF PORTAL SEARCH VIEW IN ADD MODE */}
      {activeTab === 'gif' && currentMode === 'create' && inputSourceMode === 'portal' ? (
`;

  const remainder = content.substring(oldGridEnd + 52 + 86).replace("activeTab === 'gif' && currentMode === 'add' && inputSourceMode === 'portal' ? (", "");
  // Wait, I should just match the activeTab === 'gif' line exactly and replace it.

}
