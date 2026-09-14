import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# We need to insert the DraggableWindow for source editing just before the closing AnimatePresence (around line 2900).
# Let's find: `      </AnimatePresence>\n    </div>\n  );\n};`
search_str = "      </AnimatePresence>\n    </div>\n  );\n};"

modal_code = """
      <DraggableWindow
        id="source-edit-window"
        title="Edit Layer Source"
        icon={<FileCode2 className="w-4 h-4" />}
        isOpen={!!editingSourceLayerId}
        onClose={() => setEditingSourceLayerId(null)}
        widthClass="w-96"
        zIndex={999995}
      >
        {editingSourceLayerId && (() => {
          const layerToEdit = layers.find(l => l.id === editingSourceLayerId);
          if (!layerToEdit) return null;
          
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Layer Label</label>
                <input
                  type="text"
                  value={layerToEdit.name || ''}
                  onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, name: e.target.value } : l))}
                  className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs"
                />
              </div>
              
              {layerToEdit.type === 'text' && (
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Text Content</label>
                  <textarea
                    rows={3}
                    value={layerToEdit.content || ''}
                    onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, content: e.target.value } : l))}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono"
                  />
                </div>
              )}

              {layerToEdit.type === 'emoji' && (
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Select Emoji</label>
                  <div className="flex flex-wrap gap-1">
                    {DEFAULT_EMOJI_LIST.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, content: em } : l))}
                        className="p-1.5 rounded bg-black/60 hover:bg-cyan-500/20 text-lg border border-zinc-800"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {layerToEdit.type === 'image' && (
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={layerToEdit.content || ''}
                    onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, content: e.target.value } : l))}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono"
                  />
                </div>
              )}

              {layerToEdit.type === 'video' && (
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Video URL (MP4 / WebM)</label>
                  <input
                    type="text"
                    value={layerToEdit.content || ''}
                    onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, content: e.target.value } : l))}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono"
                  />
                </div>
              )}

              {layerToEdit.type === 'iframe' && (
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Website URL (HTTPS)</label>
                  <input
                    type="text"
                    value={layerToEdit.content || ''}
                    onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, content: e.target.value } : l))}
                    className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono"
                  />
                </div>
              )}

              {layerToEdit.type === 'custom' && (
                <>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Custom HTML</label>
                    <textarea
                      rows={5}
                      value={layerToEdit.content || ''}
                      onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, content: e.target.value } : l))}
                      className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-cyan-300 text-[10px] font-mono whitespace-pre"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1 mt-2">Custom CSS</label>
                    <textarea
                      rows={5}
                      value={layerToEdit.customCss || ''}
                      onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, customCss: e.target.value } : l))}
                      className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-sky-300 text-[10px] font-mono whitespace-pre"
                    />
                  </div>
                </>
              )}

              {layerToEdit.type === 'inspector' && (
                <>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Target CSS Selector</label>
                    <input
                      type="text"
                      value={layerToEdit.targetSelector || ''}
                      onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, targetSelector: e.target.value } : l))}
                      className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Target Domain</label>
                    <input
                      type="text"
                      value={layerToEdit.siteDomain || ''}
                      onChange={(e) => setLayers(prev => prev.map(l => l.id === layerToEdit.id ? { ...l, siteDomain: e.target.value } : l))}
                      className="w-full px-2 py-1.5 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono"
                    />
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </DraggableWindow>
"""

new_content = content.replace(search_str, modal_code + search_str)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(new_content)

