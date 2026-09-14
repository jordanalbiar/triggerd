const fs = require('fs');

let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// Update viewMode type
content = content.replace(
  /const \[viewMode, setViewMode\] = useState<'list' \| 'grid'>\('grid'\);/g,
  "const [viewMode, setViewMode] = useState<'list' | 'grid' | 'grid-list'>('grid');"
);

// Update view mode toggles
const oldToggles = `<div className="flex items-center gap-1 bg-[#020b18] p-1 rounded-xl border border-[#003865]">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={\`px-3 py-1 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer \${
              viewMode === 'grid'
                ? 'bg-[var(--theme-accent,#00f0ff)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }\`}
            title="Square Postcard Grid Format"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Postcard Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={\`px-3 py-1 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer \${
              viewMode === 'list'
                ? 'bg-[var(--theme-accent,#00f0ff)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }\`}
            title="Compact List View Format"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Compact List</span>
          </button>
        </div>`;
        
const newToggles = `<div className="flex items-center gap-1 bg-[#020b18] p-1 rounded-xl border border-[#003865]">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={\`px-3 py-1 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer \${
              viewMode === 'grid'
                ? 'bg-[var(--theme-accent,#00f0ff)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }\`}
            title="Postcard Format (1 per row)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Postcard</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={\`px-3 py-1 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer \${
              viewMode === 'list'
                ? 'bg-[var(--theme-accent,#00f0ff)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }\`}
            title="Compact List View Format"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid-list')}
            className={\`px-3 py-1 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer \${
              viewMode === 'grid-list'
                ? 'bg-[var(--theme-accent,#00f0ff)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }\`}
            title="Grid List (Compact format in grid)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid List</span>
          </button>
        </div>`;

content = content.replace(oldToggles, newToggles);

// Update grid container class
const oldContainer = `<div className={viewMode === 'list' ? 'flex flex-col gap-2.5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'}>`;
const newContainer = `<div className={
        viewMode === 'list' ? 'flex flex-col gap-2.5' :
        viewMode === 'grid-list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' :
        'grid grid-cols-1 gap-6 w-full max-w-5xl mx-auto'
      }>`;
content = content.replace(oldContainer, newContainer);

// Update render condition
const oldRenderCondition = `if (viewMode === 'list') {`;
const newRenderCondition = `if (viewMode === 'list' || viewMode === 'grid-list') {`;
content = content.replace(oldRenderCondition, newRenderCondition);

fs.writeFileSync('src/components/CommandManager.tsx', content);

console.log("CommandManager view modes updated");
