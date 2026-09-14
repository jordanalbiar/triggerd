import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

bad_block = """<div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div>   <div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">
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
      )}"""

# Replace all occurrences with just the original div, except maybe the one for commands which should be handled differently if it exists.
# Wait, let's just find the exact block and replace it with <div className="p-6 overflow-y-auto">
content = content.replace(bad_block, '<div className="p-6 overflow-y-auto">')

# also there's a `<div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">` that we might have injected in other places.
# Let's fix that. We only want it in the CommandManager modal!
# The CommandManager modal title is "Preset Commands & Overlay Trigger Lines"

# Let's use python script to clean it up properly.
with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

