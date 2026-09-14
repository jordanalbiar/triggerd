const fs = require('fs');
const path = require('path');

// --- Edit Dashboard.tsx ---
let dashPath = path.join(__dirname, 'src/components/Dashboard.tsx');
let dashContent = fs.readFileSync(dashPath, 'utf8');

const titleBarCodeOld = `<h2 className="text-base font-bold text-white uppercase tracking-wider">
                      Preset Commands & Overlay Trigger Lines
                    </h2>`;
const titleBarCodeNew = `<h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Preset Commands & Overlay Trigger Lines
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold uppercase shrink-0">
                        {commands.length} Active Triggers
                      </span>
                    </h2>`;
dashContent = dashContent.replace(titleBarCodeOld, titleBarCodeNew);
fs.writeFileSync(dashPath, dashContent, 'utf8');


// --- Edit CommandManager.tsx ---
let cmPath = path.join(__dirname, 'src/components/CommandManager.tsx');
let cmContent = fs.readFileSync(cmPath, 'utf8');

// 1. Remove the title block
const titleBlockStart = cmContent.indexOf('{/* Stream Chat Trigger Title & Description Below Toolbar */}');
const titleBlockEnd = cmContent.indexOf('</div>\n      </div>\n\n      {/* Edit Trigger Code & Settings Modal Window (90% Size) */}') + '</div>'.length;

cmContent = cmContent.substring(0, titleBlockStart) + cmContent.substring(titleBlockEnd);

// 2. Adjust Toolbar Layout
// We need to change:
// <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-[#020b18] border border-[#003865] rounded-2xl shadow-inner">
//   <div className="flex flex-wrap items-center gap-2">
//      [buttons]
//   </div>
//   <div className="flex items-center gap-2">
//      [Visual canvas / Add custom trigger]
//   </div>
// </div>

const toolbarOldStart = cmContent.indexOf('{/* Toolbar Above: Copy AI Prompt, Import, Export, Reset, Add Custom Trigger */}');
const toolbarOldEnd = cmContent.indexOf('{/* Hidden File Input for Single Trigger Card Re-import */}');

const newToolbar = `
        {/* Toolbar Above: Copy AI Prompt, Import, Export, Reset, Add Custom Trigger */}
        <div className="flex flex-col gap-4 p-3 bg-[#020b18] border border-[#003865] rounded-2xl shadow-inner">
          {/* Top Row: Tools */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Copy AI Prime Prompt Button */}
            <button
              onClick={handleCopyAiPrompt}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-950/80 via-indigo-900/80 to-blue-950/80 hover:from-purple-900 hover:to-blue-900 text-purple-200 border border-purple-500/60 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95"
              title="Copy prompt to prime AI (Gemini, ChatGPT, Claude) to create importable trigger overlays"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Copy AI Prime Prompt</span>
            </button>
            {/* Import Triggers Button */}
            <button
              onClick={() => { setShowImportModal(true); setImportError(null); setImportSuccess(null); }}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-500/60 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
              title="Import AI-generated JSON trigger snippets or trigger backup files"
            >
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Import Triggers</span>
            </button>
            {/* Export Triggers Button */}
            <button
              onClick={handleExportAllTriggers}
              className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border border-amber-500/60 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
              title="Export all active triggers to JSON file & clipboard"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Triggers</span>
            </button>
            {/* Reset Triggers Button */}
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Reset to default preset triggers"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
              <span>Reset Triggers</span>
            </button>
          </div>
          
          {/* Bottom Row: Main Creation Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-[#003865] pt-4 mt-2">
            {/* Simplified Drag & Drop Visual Canvas Custom Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setCanvasBuilderCommand(null);
                setShowCanvasBuilder(true);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] via-sky-400 to-cyan-300 hover:from-white hover:to-cyan-200 text-black text-sm font-mono font-black uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#00f0ff]/30 hover:scale-105 active:scale-95 cursor-pointer border border-white/40"
              title="Open the simplified drag-and-drop visual canvas overlay builder with layered sources"
            >
              <Layers className="w-5 h-5 text-black stroke-[2.5]" />
              <span>Visual Canvas Studio</span>
            </button>
            {/* Standard Code / Form Add Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setEditingCommandId(null);
                setFormState(BLANK_FORM_STATE);
                setPreviewPos({ x: 50, y: 50 });
                setShowAddForm(true);
              }}
              className="px-6 py-3 rounded-xl bg-[#0a2540] hover:bg-[#00f0ff]/20 text-[#80c8ff] hover:text-white text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition border border-[#003865] hover:border-[#00f0ff]/60 cursor-pointer"
              title="Open advanced trigger code and settings form editor"
            >
              <Plus className="w-4 h-4 text-[#00f0ff]" />
              <span>Overlay Creation</span>
            </button>
          </div>
        </div>
        
        `;

cmContent = cmContent.substring(0, toolbarOldStart) + newToolbar + cmContent.substring(toolbarOldEnd);

fs.writeFileSync(cmPath, cmContent, 'utf8');
console.log('Fixed UI successfully');
