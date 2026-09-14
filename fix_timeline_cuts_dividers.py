import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

search_str = """                            return (
                              <div
                                key={kf.id}
                                onPointerDown={(e) => handleKeyframePointerDown(e, layer.id, kf.id)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLayerId(layer.id);
                                  setSelectedKeyframeId(kf.id);
                                  setCurrentTime(kf.timeSec);
                                }}
                                style={{ left: `${leftPercent}%` }}
                                className={`absolute -translate-x-1/2 w-3.5 h-3.5 rotate-45 rounded-[2px] transition cursor-ew-resize z-20 ${
                                  isKfSelected
                                    ? 'bg-amber-400 border-2 border-white shadow-[0_0_12px_#fbbf24] scale-125'
                                    : 'bg-cyan-400 hover:bg-white border border-cyan-200 shadow'
                                }`}
                                title={`Keyframe @${kf.timeSec}s (Intensity: ${kf.intensity ?? 100}%) - Drag to move`}
                              />
                            );"""

replacement_str = """                            return (
                              <React.Fragment key={kf.id}>
                                {kf.transitionType && kf.transitionType !== 'move' && (
                                  <div
                                    className="absolute w-[2px] h-[300%] bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-10 pointer-events-none -translate-x-1/2 -top-[100%]"
                                    style={{ left: `${leftPercent}%` }}
                                  />
                                )}
                                <div
                                  onPointerDown={(e) => handleKeyframePointerDown(e, layer.id, kf.id)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLayerId(layer.id);
                                    setSelectedKeyframeId(kf.id);
                                    setCurrentTime(kf.timeSec);
                                  }}
                                  style={{ left: `${leftPercent}%` }}
                                  className={`absolute -translate-x-1/2 w-3.5 h-3.5 rotate-45 rounded-[2px] transition cursor-ew-resize z-20 ${
                                    isKfSelected
                                      ? 'bg-amber-400 border-2 border-white shadow-[0_0_12px_#fbbf24] scale-125'
                                      : 'bg-cyan-400 hover:bg-white border border-cyan-200 shadow'
                                  }`}
                                  title={`Keyframe @${kf.timeSec}s (Intensity: ${kf.intensity ?? 100}%) - Drag to move${kf.transitionType ? ` | Cut: ${kf.transitionType}` : ''}`}
                                />
                              </React.Fragment>
                            );"""

if search_str in content:
    new_content = content.replace(search_str, replacement_str)
    with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
        f.write(new_content)
    print("Replaced timeline dividers successfully.")
else:
    print("Could not find the timeline dividers string.")
