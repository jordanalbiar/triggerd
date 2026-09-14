import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

search_str = """                    {selectedKeyframeId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyframe(selectedKeyframeId)}
                        className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition cursor-pointer"
                        title="Delete Selected Keyframe"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}"""

replace_str = """                    {selectedKeyframeId && selectedKeyframe && (
                      <div className="flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded-lg">
                        <span className="text-[10px] text-amber-300/80 font-bold uppercase">Time</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max={totalTimelineDuration}
                          value={selectedKeyframe.timeSec}
                          onChange={(e) => {
                             const newTime = Math.max(0, Math.min(totalTimelineDuration, parseFloat(e.target.value) || 0));
                             updateSelectedKeyframe({ timeSec: newTime, frameIndex: Math.round(newTime * 10) });
                             setCurrentTime(newTime);
                          }}
                          className="w-12 bg-black/60 text-amber-400 font-mono text-xs outline-none text-center rounded border border-amber-500/50"
                        />
                        <span className="text-[10px] text-amber-300/80 font-bold uppercase mr-1">s</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteKeyframe(selectedKeyframeId)}
                          className="px-2 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition cursor-pointer"
                          title="Delete Selected Keyframe"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}"""

if search_str in content:
    content = content.replace(search_str, replace_str)
    with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
        f.write(content)
    print("Patched time edit successfully.")
else:
    print("Could not find search_str")
