import re

with open("src/components/Dashboard.tsx", "r") as f:
    content = f.read()

search = """                    .map((cmd) => {
                      const isPlaying = activeTriggerId === cmd.id;
                      const triggerEmoji = getTriggerEmoji(cmd.command, cmd.spriteStyle);

                      return ("""

replace = """                    .map((cmd) => {
                      const isPlaying = activeTriggerId === cmd.id;
                      const triggerEmoji = getTriggerEmoji(cmd.command, cmd.spriteStyle);
                      
                      if (testPanelViewMode === 'grid') {
                        return (
                          <div
                            key={cmd.id}
                            className={`p-2 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer text-center relative overflow-hidden group ${
                              isPlaying
                                ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                : 'bg-[#020b18] hover:bg-[#0a2540] border-amber-400/40 hover:border-amber-300'
                            }`}
                            onClick={() => handleTriggerMessageWithFeedback(adminUsername || 'Admin', cmd.command, 'Test Panel', cmd.isStatic, cmd.id)}
                            title={`Play ${cmd.displayName}`}
                          >
                            <span className="text-2xl sm:text-3xl leading-none select-none p-2 rounded-full bg-amber-400/10 border border-amber-400/30 group-hover:scale-110 transition-transform mt-1">
                              {triggerEmoji}
                            </span>
                            <div className="flex flex-col min-w-0 w-full px-1 pb-1">
                              <span className="truncate font-mono text-[10px] sm:text-xs font-bold text-white w-full">
                                {cmd.displayName}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-[#00f0ff] font-mono font-semibold truncate w-full opacity-80">
                                !{cmd.command}
                              </span>
                            </div>
                            {isPlaying && (
                              <div className="absolute inset-0 bg-emerald-400/10 animate-pulse pointer-events-none" />
                            )}
                          </div>
                        );
                      }

                      return ("""

content = content.replace(search, replace)

# Wait, let's use regex in case of slight whitespace diff
content = re.sub(
    r"\.map\(\(cmd\) => \{\s*const isPlaying = activeTriggerId === cmd\.id;\s*const triggerEmoji = getTriggerEmoji\(cmd\.command, cmd\.spriteStyle\);\s*return \(",
    replace,
    content
)

with open("src/components/Dashboard.tsx", "w") as f:
    f.write(content)

