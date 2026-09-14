import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# Add states for drafts modal
state_search = "  const [showImportModal, setShowImportModal] = useState<boolean>(false);"
state_replace = """  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showDraftsModal, setShowDraftsModal] = useState<boolean>(false);
  const [drafts, setDrafts] = useState<{ id: string, name: string, data: any, date: string }[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('canvas_drafts');
      if (saved) {
        setDrafts(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSaveDraft = () => {
    const data = {
      command: triggerCommand,
      displayName,
      customMessage,
      duration: isStaticOverlay ? 0 : (duration > 0 ? duration : totalTimelineDuration),
      color: accentColor,
      isStatic: isStaticOverlay,
      layers
    };
    const newDraft = {
      id: `draft-${Date.now()}`,
      name: displayName || 'Untitled Draft',
      data,
      date: new Date().toLocaleString()
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem('canvas_drafts', JSON.stringify(updated));
    setSaveSuccessMsg("Draft saved!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLoadDraft = (draft: any) => {
    if (draft.data.layers) setLayers(draft.data.layers);
    if (draft.data.command) setTriggerCommand(draft.data.command);
    if (draft.data.displayName) setDisplayName(draft.data.displayName);
    if (draft.data.duration) {
      setDuration(draft.data.duration);
      setTotalTimelineDuration(draft.data.duration);
    }
    setShowDraftsModal(false);
  };
  
  const handleClearCanvas = () => {
    if (confirm("Are you sure you want to clear the canvas? This will remove all layers.")) {
      setLayers([]);
      setTriggerCommand('myalert');
      setDisplayName('Empty Canvas');
      setCurrentTime(0);
      setSelectedLayerId(null);
      setSelectedKeyframeId(null);
    }
  };
"""
content = content.replace(state_search, state_replace)

# Add top bar buttons
top_bar_search = """            {/* Live Preview Button */}
            <button
              type="button"
              onClick={handleLivePreview}
              className="px-3 py-1.5 rounded-xl border bg-cyan-900/40 text-cyan-300 hover:text-white hover:bg-cyan-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer"
              style={{ borderColor: 'var(--theme-border, #003865)' }}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>"""
top_bar_replace = """            {/* Drafts Button */}
            <button
              type="button"
              onClick={() => setShowDraftsModal(true)}
              className="px-3 py-1.5 rounded-xl border bg-indigo-900/40 text-indigo-300 hover:text-white hover:bg-indigo-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer"
              style={{ borderColor: 'var(--theme-border, #003865)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Drafts</span>
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-xl border bg-emerald-900/40 text-emerald-300 hover:text-white hover:bg-emerald-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer"
              style={{ borderColor: 'var(--theme-border, #003865)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={handleClearCanvas}
              className="px-3 py-1.5 rounded-xl border bg-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer"
              style={{ borderColor: 'var(--theme-border, #003865)' }}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>New Empty Canvas</span>
            </button>
            {/* Live Preview Button */}
            <button
              type="button"
              onClick={handleLivePreview}
              className="px-3 py-1.5 rounded-xl border bg-cyan-900/40 text-cyan-300 hover:text-white hover:bg-cyan-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer"
              style={{ borderColor: 'var(--theme-border, #003865)' }}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>"""
content = content.replace(top_bar_search, top_bar_replace)


# Add Drafts modal
modal_search = """      {/* IMPORT JSON MODAL */}"""
modal_replace = """      {/* DRAFTS MODAL */}
      <AnimatePresence>
        {showDraftsModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden font-mono text-xs text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#04182e] border-2 border-indigo-500 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.3)] flex flex-col overflow-hidden max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-3.5 bg-[#020b18] border-b border-[#003865]">
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-sm uppercase text-indigo-300">Saved Drafts</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDraftsModal(false)}
                  className="p-1 rounded-lg bg-black/40 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                {drafts.length === 0 ? (
                  <div className="text-center p-8 text-zinc-400 italic">No saved drafts yet.</div>
                ) : (
                  <div className="space-y-2">
                    {/* Add default preset to drafts list visually */}
                    <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-900/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-indigo-300">Moon Landing (Default Preset)</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5">Built-in preset</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // This is basically reloading the component or clearing and importing the default
                          if (confirm("Load default preset? Current canvas will be overwritten.")) {
                             window.location.reload(); // Simple way to reset state to default
                          }
                        }}
                        className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
                      >
                        Load
                      </button>
                    </div>

                    {drafts.map(draft => (
                      <div key={draft.id} className="p-3 rounded-xl border border-zinc-800 bg-black/40 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{draft.name}</div>
                          <div className="text-[9px] text-zinc-500 mt-0.5">{draft.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLoadDraft(draft)}
                            className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40"
                          >
                            Load
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                               const updated = drafts.filter(d => d.id !== draft.id);
                               setDrafts(updated);
                               localStorage.setItem('canvas_drafts', JSON.stringify(updated));
                            }}
                            className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMPORT JSON MODAL */}"""
content = content.replace(modal_search, modal_replace)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)

