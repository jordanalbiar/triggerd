const fs = require('fs');
let content = fs.readFileSync('src/components/LivePerformanceStats.tsx', 'utf8');

// Replace standard titles with nice tooltips

content = content.replace(
  /title="Click to view detailed FPS statistics & rendering health"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-[var(--theme-accent,#00f0ff)]/60 text-[var(--theme-accent,#00f0ff)] font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_var(--theme-accent-glow,rgba(0,240,255,0.3))] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-[var(--theme-accent,#00f0ff)]/60 rotate-45" />
              <span>Click to view detailed FPS statistics & rendering health</span>
            </div>`
);

content = content.replace(
  /title="Click to view CPU thread load & processing breakdown"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-emerald-400/60 text-emerald-400 font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(52,211,153,0.3)] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-emerald-400/60 rotate-45" />
              <span>Click to view CPU thread load & processing breakdown</span>
            </div>`
);

content = content.replace(
  /title="Click to view V8 JavaScript Heap Memory usage"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-[var(--theme-accent,#00f0ff)]/60 text-[var(--theme-accent,#00f0ff)] font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_var(--theme-accent-glow,rgba(0,240,255,0.3))] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-[var(--theme-accent,#00f0ff)]/60 rotate-45" />
              <span>Click to view V8 JavaScript Heap Memory usage</span>
            </div>`
);

content = content.replace(
  /title="Click to view render frame delta time latency"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-amber-400/60 text-amber-400 font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(251,191,36,0.3)] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-amber-400/60 rotate-45" />
              <span>Click to view render frame delta time latency</span>
            </div>`
);

content = content.replace(
  /title="Click to view application session uptime"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-[var(--theme-accent,#00f0ff)]/60 text-[var(--theme-accent,#00f0ff)] font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_var(--theme-accent-glow,rgba(0,240,255,0.3))] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-[var(--theme-accent,#00f0ff)]/60 rotate-45" />
              <span>Click to view application session uptime</span>
            </div>`
);

content = content.replace(
  /title="Click to view active stage overlays"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-purple-400/60 text-purple-400 font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-purple-400/60 rotate-45" />
              <span>Click to view active stage overlays</span>
            </div>`
);

content = content.replace(
  /title="Click to toggle active target sites & view established connections"/g,
  `{/* Animated Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-[var(--theme-accent,#00f0ff)]/60 text-[var(--theme-accent,#00f0ff)] font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_var(--theme-accent-glow,rgba(0,240,255,0.3))] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-[var(--theme-accent,#00f0ff)]/60 rotate-45" />
              <span>Click to toggle active target sites & view established connections</span>
            </div>`
);


// Replace the ones that are not in 'relative shrink-0' directly by wrapping or adjusting 
content = content.replace(
  /className="ml-1 text-\[var\(--theme-accent,#00f0ff\)\] hover:text-\[var\(--theme-text-main,#ffffff\)\] transition cursor-pointer p-1 rounded-md hover:bg-\[var\(--theme-accent,#00f0ff\)\]\/20 shrink-0"\s*title="Trigger Immediate Checkup Ping"/g,
  `className="relative group ml-1 text-[var(--theme-accent,#00f0ff)] hover:text-[var(--theme-text-main,#ffffff)] transition cursor-pointer p-1 rounded-md hover:bg-[var(--theme-accent,#00f0ff)]/20 shrink-0"
            >
              {/* Animated Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-xl bg-[var(--theme-bg,#020b18)]/98 border border-[var(--theme-accent,#00f0ff)]/60 text-[var(--theme-accent,#00f0ff)] font-mono text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_15px_var(--theme-accent-glow,rgba(0,240,255,0.3))] backdrop-blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none transition-all duration-200 ease-out z-[250] flex items-center gap-1.5">
                <span className="absolute -bottom-1 right-2 w-2 h-2 bg-[var(--theme-bg,#020b18)] border-b border-r border-[var(--theme-accent,#00f0ff)]/60 rotate-45" />
                <span>Trigger Immediate Checkup Ping</span>
              </div>`
);


fs.writeFileSync('src/components/LivePerformanceStats.tsx', content);

console.log("Live performance tooltips updated");
