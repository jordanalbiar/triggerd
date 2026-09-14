const fs = require('fs');
const content = fs.readFileSync('src/components/StaticSourcesContent.tsx', 'utf8');

const replacement = `      <div className="flex items-center justify-between bg-[var(--theme-bg,#020b18)] p-1 rounded-xl border border-purple-500/40 mb-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => {
              setMode('add');
              onSelectSource(null);
            }}
            className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer whitespace-nowrap \${
              currentMode === 'add'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)] font-extrabold'
                : 'text-[var(--theme-muted,#80c8ff)] hover:text-purple-300 hover:bg-purple-950/40'
            }\`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Source</span>
          </button>

          {currentMode === 'create' && (
            <button
              type="button"
              onClick={() => setMode('create')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer whitespace-nowrap bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)] font-extrabold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Source</span>
            </button>
          )}

          <button
            type="button"
            disabled={!selectedSourceId}
            onClick={() => {
              if (selectedSourceId) {
                setMode('edit');
              }
            }}
            className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition whitespace-nowrap \${
              !selectedSourceId
                ? 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-500 cursor-not-allowed opacity-60 select-none'
                : currentMode === 'edit'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)] font-extrabold cursor-pointer'
                : 'text-[var(--theme-muted,#80c8ff)] hover:text-purple-300 hover:bg-purple-950/40 cursor-pointer'
            }\`}
            title={!selectedSourceId ? 'Select a source on the stage overlay to edit' : 'Edit selected source'}
          >`;

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('<div className="flex items-center justify-between bg-[var(--theme-bg,#020b18)]'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('title={!selectedSourceId'));

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = [
    ...lines.slice(0, startIdx),
    replacement.trimEnd(),
    ...lines.slice(endIdx + 1)
  ];
  fs.writeFileSync('src/components/StaticSourcesContent.tsx', newLines.join('\n'));
  console.log("Updated mode switcher");
} else {
  console.log("Could not find mode switcher");
}
