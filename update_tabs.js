const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// 1. Move the Live Preview window inside Step 4.
// Find the Live Preview window (line 2446 to 2730ish).
// It starts with `{/* Live Overlay Looping Preview Window with Test Command Input & Edit Mode */}`
const livePreviewStartStr = `{/* Live Overlay Looping Preview Window with Test Command Input & Edit Mode */}`;
// We know it ends right before `</div>` and then `{/* Modal Footer */}`
const livePreviewEndRegex = /(?=<\/div>\s*\{\/\* Modal Footer \*\/})/s;

const livePreviewMatch = code.match(new RegExp(livePreviewStartStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + livePreviewEndRegex.source));
if (livePreviewMatch) {
    let livePreviewCode = livePreviewMatch[0];
    
    // Remove it from its current position
    code = code.replace(livePreviewCode, '');
    
    // Replace Step 4 with it
    const step4Regex = /\{\/\* Step 4: Position \*\/\}[\s\S]*?(?=\{\/\* Step 5: Advanced \*\/\}|triggerFormStep === 5)/;
    code = code.replace(step4Regex, `
          {triggerFormStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/50 space-y-3 bg-[#020b18]">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-cyan-400 border-b border-[#003865] pb-2">
                  <Play className="w-4 h-4" />
                  <span>4. Test Display</span>
                </div>
                ` + livePreviewCode + `
              </div>
            </div>
          )}
          {triggerFormStep === 5`);
}

// Write it back
fs.writeFileSync('src/components/CommandManager.tsx', code);
