import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# Replace the "+ Keyframe" and duration inputs
search_str = """                  {/* Add Keyframe & Total Duration Settings */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddKeyframeAtCurrentTime()}
                      disabled={!selectedLayer || isStaticOverlay}
                      className="px-2.5 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-black text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
                      title="Add Keyframe for Selected Layer at Current Playhead"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Keyframe</span>
                    </button>

                    {selectedKeyframeId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyframe(selectedKeyframeId)}
                        className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition cursor-pointer"
                        title="Delete Selected Keyframe"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 ml-2">
                      <span>Total Time:</span>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        step="0.5"
                        value={totalTimelineDuration}
                        onChange={(e) => {
                          const val = Math.max(1, parseFloat(e.target.value) || 5);
                          setTotalTimelineDuration(val);
                          setDuration(val);
                        }}
                        className="w-12 px-1 py-0.5 rounded bg-black/60 border border-zinc-700 text-white font-mono text-center"
                      />
                      <span>s</span>
                    </div>
                  </div>"""

replacement_str = """                  {/* Add Keyframe & Total Duration Settings */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0 bg-black/40 border border-zinc-700 rounded-lg overflow-hidden">
                      <select 
                         className="px-2.5 py-1.5 bg-cyan-500/10 text-cyan-300 font-bold text-[10px] outline-none cursor-pointer hover:bg-cyan-500/20"
                         title="Select Transition Type"
                         value={selectedKeyframe?.transitionType || 'move'}
                         onChange={(e) => {
                           if (selectedKeyframeId) {
                             updateSelectedKeyframe({ transitionType: e.target.value as any });
                           }
                         }}
                      >
                         <option value="move">Move</option>
                         <option value="fade">Fade</option>
                         <option value="cut">Cut</option>
                         <option value="html">HTML Cut</option>
                         <option value="media">Media Cut</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddKeyframeAtCurrentTime()}
                        disabled={!selectedLayer || isStaticOverlay}
                        className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-black text-xs flex items-center gap-1 transition cursor-pointer shadow-sm border-l border-zinc-700"
                        title="Add Keyframe for Selected Layer at Current Playhead"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Keyframe</span>
                      </button>
                    </div>

                    {selectedKeyframeId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyframe(selectedKeyframeId)}
                        className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition cursor-pointer"
                        title="Delete Selected Keyframe"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 ml-2">
                      <span>Total Time:</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const val = Math.max(1, totalTimelineDuration - 0.5);
                          setTotalTimelineDuration(val);
                          setDuration(val);
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                      >-</button>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        step="0.5"
                        value={totalTimelineDuration}
                        onChange={(e) => {
                          const val = Math.max(1, parseFloat(e.target.value) || 5);
                          setTotalTimelineDuration(val);
                          setDuration(val);
                        }}
                        className="w-12 px-1 py-0.5 rounded bg-black/60 border border-zinc-700 text-white font-mono text-center"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const val = Math.max(1, totalTimelineDuration + 0.5);
                          setTotalTimelineDuration(val);
                          setDuration(val);
                        }}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                      >+</button>
                      <span>s</span>
                    </div>
                  </div>"""

if search_str in content:
    new_content = content.replace(search_str, replacement_str)
    with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
        f.write(new_content)
    print("Replaced timeline controls successfully.")
else:
    print("Could not find the timeline controls string.")
