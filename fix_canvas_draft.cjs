const fs = require('fs');
let code = fs.readFileSync('src/components/VisualCanvasTriggerBuilder.tsx', 'utf8');

// handleSave: clear draft
code = code.replace(
  /onSaveTrigger\(finalCmd\);\n\s*\/\/ Keep Visual Canvas Studio open/,
  `onSaveTrigger(finalCmd);
    try { localStorage.removeItem('triggerd_visual_canvas_draft'); } catch(e){}
    // Keep Visual Canvas Studio open`
);

// handleCloseStudio: save draft
code = code.replace(
  /const handleCloseStudio = \(\) => \{/,
  `const handleCloseStudio = () => {
    try {
      if (layers && layers.length > 0) {
        localStorage.setItem('triggerd_visual_canvas_draft', JSON.stringify({
          layers,
          triggerCommand,
          displayName,
          commandId,
          timestamp: Date.now()
        }));
      }
    } catch(e) {}
`
);

// We need state for hasDraft in the bootloader
code = code.replace(
  /const \[isBooting, setIsBooting\] = useState<boolean>\(true\);/,
  `const [isBooting, setIsBooting] = useState<boolean>(true);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  useEffect(() => {
    if (isOpen) {
      try {
        setHasDraft(!!localStorage.getItem('triggerd_visual_canvas_draft'));
      } catch(e) {}
    }
  }, [isOpen]);`
);

// Add option 4 in bootloader
code = code.replace(
  /\{\/\* 3\. Open Saved Creation \*\/\}/,
  `{/* 4. Restore Unsaved Draft */}
                    {hasDraft && (
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const draft = JSON.parse(localStorage.getItem('triggerd_visual_canvas_draft') || '{}');
                            if (draft && draft.layers) {
                              setLayers(draft.layers);
                              setTriggerCommand(draft.triggerCommand || '');
                              setDisplayName(draft.displayName || '');
                              setCommandId(draft.commandId || '');
                              setHistory([draft.layers]);
                              setHistoryIndex(0);
                              setActiveTab('layers');
                              setIsBooting(false);
                            }
                          } catch(e) {}
                        }}
                        className="w-full p-4 rounded-xl border text-left transition duration-200 cursor-pointer flex items-center justify-between group hover:scale-[1.01]"
                        style={{
                          backgroundColor: themeColors.card,
                          borderColor: themeColors.border,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors shadow-inner"
                            style={{
                              backgroundColor: 'rgba(234, 179, 8, 0.1)',
                              borderColor: 'rgba(234, 179, 8, 0.2)',
                              color: '#eab308'
                            }}
                          >
                            <Save className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black uppercase tracking-wide flex items-center gap-2" style={{ color: themeColors.textMain }}>
                              <span>Restore Unsaved Draft</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-normal">Draft</span>
                            </h4>
                            <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: themeColors.textMuted }}>
                              Recover your previous unsaved session
                            </p>
                          </div>
                        </div>
                        <Check className="w-4 h-4 shrink-0 text-yellow-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </button>
                    )}

                    {/* 3. Open Saved Creation */}`
);

fs.writeFileSync('src/components/VisualCanvasTriggerBuilder.tsx', code);
