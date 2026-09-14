const fs = require('fs');
let content = fs.readFileSync('src/components/StaticSourcesContent.tsx', 'utf8');

const regex1 = /\{\/\* MULTI-ROW SOURCE TYPE SELECTOR TABS[\s\S]*?\{\/\* DEDICATED GIF PORTAL SEARCH VIEW IN ADD MODE \*\/\}/m;

const replacement1 = `{currentMode === 'add' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <h3 className="text-xs font-bold text-[var(--theme-muted,#80c8ff)] mb-3 mt-2 flex items-center gap-2 uppercase tracking-wider"><Sparkles className="w-4 h-4 text-[#00f0ff]" /> Select Source Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4 p-1">
            {SOURCE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => handleSelectTab(tab.type)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl text-[11px] font-bold transition cursor-pointer bg-black/40 border border-[#003865] hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-zinc-300 hover:text-white group text-center gap-2 shadow-md"
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
      {/* DEDICATED GIF PORTAL SEARCH VIEW IN ADD MODE */}`;

content = content.replace(regex1, replacement1);

// Then replace the GIF activeTab check
content = content.replace(
  "{activeTab === 'gif' && currentMode === 'add' && inputSourceMode === 'portal' ? (",
  "{activeTab === 'gif' && currentMode === 'create' && inputSourceMode === 'portal' ? ("
);

// We need to close the `{(currentMode === 'create' || currentMode === 'edit') && ( <>` block at the very end of the return statement.
// The return statement ends with:
//         </>
//       )}
//     </div>
//   );
// };
const lastDivIndex = content.lastIndexOf("</div>\n  );\n};");
if (lastDivIndex !== -1) {
  content = content.substring(0, lastDivIndex) + "        </>\n      )}\n" + content.substring(lastDivIndex);
}

fs.writeFileSync('src/components/StaticSourcesContent.tsx', content);
