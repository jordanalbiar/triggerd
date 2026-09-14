import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# Add activeInspectorTab state
if "const [activeInspectorTab," not in content:
    content = content.replace("const [showTimeline, setShowTimeline] = useState<boolean>(true);", 
                              "const [showTimeline, setShowTimeline] = useState<boolean>(true);\n  const [activeInspectorTab, setActiveInspectorTab] = useState<'motion' | 'keyframes' | 'master'>('motion');")

# Find the start of RIGHT PANEL
search_panel = """          {/* RIGHT PANEL: Layer & Keyframe Attributes & Behavior Traits Inspector */}
          {showRightDrawer && selectedLayer && (
            <div 
              data-canvas-tour="inspector-panel"
              className="w-full md:w-72 border-l flex flex-col overflow-y-auto shrink-0 p-3 space-y-3"
              style={{
                backgroundColor: 'var(--theme-card, #04182e)',
                borderColor: 'var(--theme-border, #003865)'
              }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--theme-border, #003865)' }}>
                <span className="font-bold text-xs uppercase text-cyan-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Source Behavior & Traits</span>
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-mono">{selectedLayer.type}</span>
              </div>"""

replace_panel = """          {/* RIGHT PANEL: Layer & Keyframe Attributes & Behavior Traits Inspector */}
          {showRightDrawer && selectedLayer && (
            <div 
              data-canvas-tour="inspector-panel"
              className="w-full md:w-72 border-l flex flex-col shrink-0 p-0"
              style={{
                backgroundColor: 'var(--theme-card, #04182e)',
                borderColor: 'var(--theme-border, #003865)'
              }}
            >
              <div className="flex items-center justify-between border-b p-3 pb-2" style={{ borderColor: 'var(--theme-border, #003865)' }}>
                <span className="font-bold text-xs uppercase text-cyan-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Source Properties</span>
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-mono">{selectedLayer.type}</span>
              </div>
              
              <div className="flex bg-black/40 border-b" style={{ borderColor: 'var(--theme-border, #003865)' }}>
                <button 
                  onClick={() => setActiveInspectorTab('motion')} 
                  className={`flex-1 py-2 text-[10px] font-bold uppercase transition ${activeInspectorTab === 'motion' ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Motion
                </button>
                <button 
                  onClick={() => setActiveInspectorTab('keyframes')} 
                  className={`flex-1 py-2 text-[10px] font-bold uppercase transition ${activeInspectorTab === 'keyframes' ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Keyframes
                </button>
                <button 
                  onClick={() => setActiveInspectorTab('master')} 
                  className={`flex-1 py-2 text-[10px] font-bold uppercase transition ${activeInspectorTab === 'master' ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Master
                </button>
              </div>

              <div className="p-3 space-y-3 overflow-y-auto flex-1">
"""

if search_panel in content:
    content = content.replace(search_panel, replace_panel)
    print("Replaced Right Panel header")

content = content.replace("              {/* BEHAVIOR & ANIMATION STYLE SECTION */}",
                          "              {/* BEHAVIOR & ANIMATION STYLE SECTION */}\n              {activeInspectorTab === 'motion' && (")

# The motion section ends with:
pattern1 = r"(<input\s*type=\"range\"[\s\S]*?onChange=\{\(e\) => updateSelectedLayer\(\{ animSpeed: parseFloat\(e.target.value\) \}\)\}[\s\S]*?className=\"w-full accent-cyan-400 cursor-pointer\"\s*/>\s*</div>\s*</div>)"
content = re.sub(pattern1, r"\1\n              )}", content, count=1)

content = content.replace("              {/* KEYFRAME ATTRIBUTES & TRANSITIONS */}",
                          "              {/* KEYFRAME ATTRIBUTES & TRANSITIONS */}\n              {activeInspectorTab === 'keyframes' && (")

pattern2 = r"(<div className=\"text-\[10px\] text-zinc-400 italic text-center py-2\">\s*Click a diamond on the timeline track to inspect keyframe attributes or click \"\+ Keyframe\"\.\s*</div>\s*\)\}\s*</div>\s*\)\})"
content = re.sub(pattern2, r"\1\n              )}", content, count=1)

content = content.replace("              {/* MASTER LAYER SETTINGS */}",
                          "              {/* MASTER LAYER SETTINGS */}\n              {activeInspectorTab === 'master' && (")

pattern3 = r"(<input\s*type=\"text\"\s*value=\{selectedLayer.content \|\| ''\}\s*onChange=\{\(e\) => updateSelectedLayer\(\{ content: e.target.value \}\)\}\s*className=\"w-full px-2 py-1 rounded bg-black/60 border border-zinc-700 text-white text-xs font-mono\"\s*/>\s*</div>\s*\)\}\s*</div>)"
content = re.sub(pattern3, r"\1\n              )}\n            </div>", content, count=1)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
