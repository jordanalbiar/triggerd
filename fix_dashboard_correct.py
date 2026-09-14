import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix the Tampermonkey modal.
# The broken block in the backup looks exactly like this:
broken_tm_block = """              <div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div>   <div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">
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
      )}
                <TampermonkeyScriptGenerator isDarkMode={true} />
              </div>"""

content = content.replace(broken_tm_block, """              <div className="p-6 overflow-y-auto">
                <TampermonkeyScriptGenerator isDarkMode={true} />
              </div>""")

# Find where the CommandManager modal is and add the portals above its <div className="p-6 overflow-y-auto">
# We want to insert:
# <div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div>
# <div className="w-full" id="cmd-prefix-accordion-portal"></div>
#
# But only in the "Preset Commands & Overlay Trigger Lines" modal!

# Let's search for:
#                   <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
#                     {commands.length} Active Triggers
#                   </span>
#                   <button
#                     onClick={() => setShowCommandsModal(false)}
# ...
#               </div>
#
#               <div className="p-6 overflow-y-auto">

pattern2 = re.compile(r'(<span className="text-xs font-mono px-2 py-0\.5 rounded-full bg-\[#00f0ff\]\/20 text-\[#00f0ff\] border border-\[#00f0ff\]\/30 font-bold uppercase shrink-0">\s*\{commands\.length\} Active Triggers\s*<\/span>\s*<button\s*onClick=\{[^}]*setShowCommandsModal\(false\)\}[\s\S]*?<\/div>\s*<\/div>\s*)<div className="p-6 overflow-y-auto">')

content = pattern2.sub(r'\1<div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div>\n              <div className="w-full" id="cmd-prefix-accordion-portal"></div>\n              <div className="p-6 overflow-y-auto">', content)

# I also need to put the prefix toggle button indicator next to the active triggers count
pattern_indicator = re.compile(r'<div className="flex items-center gap-3">\s*<span className="text-xs font-mono px-2 py-0\.5 rounded-full bg-\[#00f0ff\]\/20 text-\[#00f0ff\] border border-\[#00f0ff\]\/30 font-bold uppercase shrink-0">')
content = pattern_indicator.sub(r'<div className="flex items-center gap-3">\n                  <div id="cmd-prefix-indicator-portal"></div>\n                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">', content)


with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

