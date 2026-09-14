const fs = require('fs');
let code = fs.readFileSync('src/components/VisualCanvasTriggerBuilder.tsx', 'utf8');

// Add state for isPanelCollapsed
code = code.replace(
  'const [activeTab, setActiveTab] = useState<\'layers\' | \'presets\' | \'anim\' | \'properties\' | \'physics\' | \'settings\'>(\'layers\');',
  `const [activeTab, setActiveTab] = useState<'layers' | 'presets' | 'anim' | 'properties' | 'physics' | 'settings'>('layers');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);`
);

// We should probably add the collapse toggle button. A good place would be near the tabs or in the header of the panel. Or maybe floating above the panel on mobile.
// Wait, we can add a toggle button inside the canvas toolbar (left side).
// Or we can add it to the TAB_DEFS area. Let's add it in the canvas toolbar.

code = code.replace(
  /\{isPlaying \? 'PAUSE' : 'PLAY'\}<\/span>\n\s*<\/button>\n\s*<button\n\s*onClick=\{\(\) => \{\n\s*setIsPlaying\(false\);\n\s*setCurrentTime\(0\);\n\s*\}\}/,
  `{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <button
                  onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  className="lg:hidden p-2 rounded-xl bg-[var(--theme-card-alt,#1f2937)] hover:bg-[var(--theme-card,#374151)] text-[var(--theme-text-main,#ffffff)] border border-[var(--theme-border,#374151)] transition cursor-pointer flex items-center gap-1.5"
                  title={isPanelCollapsed ? 'Expand Control Panel' : 'Collapse Control Panel'}
                >
                  {isPanelCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  <span className="text-[11px] font-bold hidden sm:inline">{isPanelCollapsed ? 'SHOW PANEL' : 'HIDE PANEL'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}`
);

// Then, hide the panel if isPanelCollapsed is true, but ONLY on mobile (so add a class condition).
code = code.replace(
  /\{\/\* RIGHT: DYNAMIC TABBED CONTROLS PANEL \(RESPONSIVE SIZING\) \*\/\}\n\s*<div className="w-full lg:w-\[440px\] xl:w-\[480px\] 2xl:w-\[520px\] max-w-full flex flex-col bg-\[var\(--theme-card,#0e1420\)\] shrink-0 border-t lg:border-t-0 lg:border-l border-\[var\(--theme-border,#1f2937\)\] overflow-visible z-30 text-\[var\(--theme-text-main,#ffffff\)\] relative min-h-0">/,
  `{/* RIGHT: DYNAMIC TABBED CONTROLS PANEL (RESPONSIVE SIZING) */}
          <div className={\`\${isPanelCollapsed ? 'hidden lg:flex' : 'flex'} w-full lg:w-[440px] xl:w-[480px] 2xl:w-[520px] max-w-full flex-col bg-[var(--theme-card,#0e1420)] shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--theme-border,#1f2937)] overflow-visible z-30 text-[var(--theme-text-main,#ffffff)] relative min-h-0\`}>`
);

fs.writeFileSync('src/components/VisualCanvasTriggerBuilder.tsx', code);
