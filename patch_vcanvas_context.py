import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# Add states for context menu
search_state = "  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(!isLandscapeMobile);"
replace_state = """  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(!isLandscapeMobile);
  const [contextMenuLayerId, setContextMenuLayerId] = useState<string | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });"""
content = content.replace(search_state, replace_state)

# Add onContextMenu to the layer div
search_layer_div = """                      <div
                        onPointerDown={(e) => handleLayerPointerDown(e, layer.id)}
                        style={{
                          position: 'absolute',"""
replace_layer_div = """                      <div
                        onPointerDown={(e) => handleLayerPointerDown(e, layer.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedLayerId(layer.id);
                          setContextMenuLayerId(layer.id);
                          setContextMenuPos({ x: e.clientX, y: e.clientY });
                        }}
                        style={{
                          position: 'absolute',"""
content = content.replace(search_layer_div, replace_layer_div)

# Add Context menu rendering before the Guided Spotlight
search_guided = "{/* GUIDED SPOTLIGHT & ANCHORED TOOLTIP TOUR */}"
replace_guided = """      {/* SOURCE CONTEXT MENU */}
      <AnimatePresence>
        {contextMenuLayerId && (
          <>
            <div 
              className="fixed inset-0 z-[99998]" 
              onClick={() => setContextMenuLayerId(null)}
              onContextMenu={(e) => { e.preventDefault(); setContextMenuLayerId(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[99999] bg-[#020e1d] border border-cyan-500/50 rounded-xl shadow-2xl overflow-hidden w-48"
              style={{ left: Math.min(contextMenuPos.x, window.innerWidth - 200), top: Math.min(contextMenuPos.y, window.innerHeight - 300) }}
            >
              <div className="p-2 border-b border-cyan-500/30 font-bold text-xs text-cyan-300 flex items-center justify-between">
                <span>Quick Settings</span>
                <Settings className="w-3.5 h-3.5" />
              </div>
              <div className="p-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                     setContextMenuLayerId(null);
                     setShowRightDrawer(true);
                     setActiveInspectorTab('motion');
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-cyan-500/20 rounded transition flex items-center gap-2"
                >
                  <Activity className="w-3 h-3" /> <span>Motion Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                     setContextMenuLayerId(null);
                     setShowRightDrawer(true);
                     setActiveInspectorTab('keyframes');
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-cyan-500/20 rounded transition flex items-center gap-2"
                >
                  <Flame className="w-3 h-3" /> <span>Keyframe Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                     const layer = layers.find(l => l.id === contextMenuLayerId);
                     if (layer) {
                       const kfs = layer.keyframes || [];
                       const curKf = selectedKeyframeId ? kfs.find(k => k.id === selectedKeyframeId) : (kfs.length > 0 ? kfs[0] : null);
                       if (curKf) {
                         const currentRot = curKf.rotation || 0;
                         if (selectedKeyframeId) updateSelectedKeyframe({ rotation: currentRot + 90 });
                         else handleAddKeyframeAtCurrentTime();
                       }
                     }
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-cyan-500/20 rounded transition flex items-center gap-2"
                >
                  <RotateCw className="w-3 h-3" /> <span>Rotate +90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                     const layer = layers.find(l => l.id === contextMenuLayerId);
                     if (layer) {
                       updateSelectedLayer({ visible: layer.visible === false ? true : false });
                     }
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-cyan-500/20 rounded transition flex items-center gap-2"
                >
                  <Eye className="w-3 h-3" /> <span>Toggle Visibility</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                     setContextMenuLayerId(null);
                     const layer = layers.find(l => l.id === contextMenuLayerId);
                     if (layer) handleDuplicateLayer(layer);
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-cyan-500/20 rounded transition flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" /> <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                     setContextMenuLayerId(null);
                     handleDeleteLayer(contextMenuLayerId!);
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded transition flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" /> <span>Delete Source</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* GUIDED SPOTLIGHT & ANCHORED TOOLTIP TOUR */}"""
content = content.replace(search_guided, replace_guided)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)

