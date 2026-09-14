const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const stageIntroHtml = `              {/* CARD 3: STAGE OVERLAY INTRO */}
              <div className="bg-[#04182e] border border-[#003865] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#003865] pb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white uppercase">3. Stage Overlay Sequence</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateIntroSettings({ stageIntroEnabled: !introSettings.stageIntroEnabled })}
                    className={\`px-3 py-1 rounded-lg text-xs font-bold transition border cursor-pointer \${
                      introSettings.stageIntroEnabled
                        ? 'bg-purple-400 text-black border-purple-400 font-extrabold'
                        : 'bg-[#020d1a] text-zinc-400 border-zinc-700'
                    }\`}
                  >
                    {introSettings.stageIntroEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Style Mode Picker */}
                  <div className="space-y-2">
                    <span className="block text-[11px] text-[#80c8ff] font-bold uppercase">
                      Animation Style Mode
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateIntroSettings({ stageIntroStyle: 'animated' })}
                        className={\`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer \${
                          introSettings.stageIntroStyle === 'animated'
                            ? 'bg-purple-500/20 border-purple-400 text-white shadow-md shadow-purple-500/20'
                            : 'bg-[#020d1a] border-[#003865] text-zinc-400 hover:text-white'
                        }\`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-bold text-xs text-purple-300">Animated Mode</span>
                          {introSettings.stageIntroStyle === 'animated' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                        <span className="text-[10px] text-zinc-300 leading-tight">
                          Full animated boot sequence for the stage preview overlay.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateIntroSettings({ stageIntroStyle: 'generic' })}
                        className={\`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer \${
                          introSettings.stageIntroStyle === 'generic'
                            ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-md shadow-[#00f0ff]/20'
                            : 'bg-[#020d1a] border-[#003865] text-zinc-400 hover:text-white'
                        }\`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-bold text-xs text-[#00f0ff]">Generic (No Animation)</span>
                          {introSettings.stageIntroStyle === 'generic' && <Check className="w-3.5 h-3.5 text-[#00f0ff]" />}
                        </div>
                        <span className="text-[10px] text-zinc-300 leading-tight">
                          No animations. Clean minimal progress indicator and simple status line.
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Timing Duration Slider & Quick Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#80c8ff] font-bold uppercase flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-amber-300" />
                        <span>Sequence Duration Timing</span>
                      </span>
                      <span className="text-white font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#020d1a] border border-[#003865]">
                        {(introSettings.stageIntroDurationMs / 1000).toFixed(1)}s ({introSettings.stageIntroDurationMs}ms)
                      </span>
                    </div>

                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="100"
                      value={introSettings.stageIntroDurationMs}
                      onChange={(e) => handleUpdateIntroSettings({ stageIntroDurationMs: Number(e.target.value) })}
                      className="w-full accent-purple-400 cursor-pointer"
                    />

                    {/* Presets */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-[#80c8ff] uppercase font-bold">Presets:</span>
                      <div className="flex items-center gap-1.5">
                        {[
                          { label: 'Fast (1s)', val: 1000 },
                          { label: 'Normal (2s)', val: 2000 },
                          { label: 'Cinematic (4s)', val: 4000 },
                          { label: 'Epic (6s)', val: 6000 }
                        ].map(preset => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => handleUpdateIntroSettings({ stageIntroDurationMs: preset.val })}
                            className={\`px-2 py-1 rounded text-[9px] font-bold border transition cursor-pointer \${
                              introSettings.stageIntroDurationMs === preset.val
                                ? 'bg-purple-500 text-black border-purple-400 font-extrabold'
                                : 'bg-[#020d1a] text-zinc-400 border-[#003865] hover:text-white'
                            }\`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Action Bar */}
                <div className="pt-2 border-t border-[#003865] flex items-center justify-between">
                  <span className="text-[10px] text-[#80c8ff]">
                    Status: {introSettings.stageIntroEnabled ? \`Active (\${introSettings.stageIntroStyle.toUpperCase()}, \${(introSettings.stageIntroDurationMs / 1000).toFixed(1)}s)\` : 'Bypassed / Skipped'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewIntroMode('stage')}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-black font-extrabold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Preview Sequence
                  </button>
                </div>
              </div>
`;

code = code.replace(
  '{/* Real-time Interactive Test Runner Overlay Modal */}',
  stageIntroHtml + '\n\n              {/* Real-time Interactive Test Runner Overlay Modal */}'
);

code = code.replace(
  /type PreviewIntroMode = 'none' \| 'dashboard' \| 'overlay';/,
  "type PreviewIntroMode = 'none' | 'dashboard' | 'overlay' | 'stage';"
);

code = code.replace(
  "{previewIntroMode === 'overlay' && (",
  `{previewIntroMode === 'stage' && (
                <div className="fixed inset-0 z-[999999999] bg-black/90 flex items-center justify-center p-4">
                  <div className="relative w-full h-full">
                    <OverlayLoadingSequence
                      introSettings={introSettings}
                      durationMs={introSettings.stageIntroDurationMs}
                      styleMode={introSettings.stageIntroStyle}
                      onComplete={() => setPreviewIntroMode('none')}
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewIntroMode('none')}
                      className="absolute top-4 right-4 z-[9999] px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl shadow-lg border border-red-400/50 flex items-center gap-2 transition"
                    >
                      <X className="w-4 h-4" /> Stop Preview
                    </button>
                  </div>
                </div>
              )}
              {previewIntroMode === 'overlay' && (`
);

fs.writeFileSync('src/components/SettingsModal.tsx', code);
