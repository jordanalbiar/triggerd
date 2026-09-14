const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const tab5Regex = /\{triggerFormStep === 5 && \(\s*<div className="space-y-4">[\s\S]*?(?=\}\s*<\/div>\s*<\/form>)/;
const match = code.match(tab5Regex);

if (match) {
  const newContent = `{triggerFormStep === 5 && (
  <div className="space-y-4">
    <div className="p-4 rounded-xl border border-[var(--theme-border,#003865)] space-y-3" style={{ backgroundColor: 'var(--theme-bg,#020b18)' }}>
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--theme-accent,#00f0ff)] border-b border-[var(--theme-border,#003865)] pb-2">
        <CheckCircle2 className="w-4 h-4" />
        <span>5. Overview & Confirmation</span>
      </div>
      
      <div className="p-4 bg-black/60 rounded-lg border border-zinc-800 flex flex-col items-center justify-center gap-4">
        
        {/* Trigger Card Preview */}
        <div 
          className="relative rounded-xl border shadow-lg overflow-hidden flex flex-col transition-all hover:border-[var(--theme-accent,#00f0ff)] w-full max-w-sm"
          style={{
            backgroundColor: 'var(--theme-card, #04182e)',
            borderColor: 'var(--theme-border, #003865)'
          }}
        >
          {/* Card Header */}
          <div className="p-2 border-b flex items-center justify-between shadow-sm shrink-0"
               style={{
                 backgroundColor: 'var(--theme-card-alt, #0a2540)',
                 borderColor: 'var(--theme-border, #003865)'
               }}>
            <div className="flex items-center gap-2 font-mono font-black text-xs sm:text-sm truncate">
              <span className="text-[10px] w-5 h-5 rounded flex items-center justify-center shrink-0" 
                    style={{ backgroundColor: formState.color || '#00f0ff', color: '#000' }}>
                🚀
              </span>
              <span className="truncate" style={{ color: formState.color || '#00f0ff' }}>
                !{formState.command || 'trigger'}
              </span>
            </div>
            {formState.isStatic ? (
              <span className="text-[10px] bg-yellow-950/80 text-yellow-300 px-1.5 py-0.5 rounded font-bold shrink-0 border border-yellow-500/50">📌 Static</span>
            ) : (
              <span className="text-[10px] bg-[#0a2540] text-[#80c8ff] px-1.5 py-0.5 rounded font-bold shrink-0 border border-[#003865]">⏱️ {formState.duration || 5}s</span>
            )}
          </div>
          
          {/* Card Body */}
          <div className="p-3 flex-1 flex flex-col gap-2 shrink-0 overflow-y-auto">
            <h3 className="font-bold text-xs" style={{ color: 'var(--theme-text-main, #ffffff)' }}>
              {formState.displayName || 'Custom Trigger'}
            </h3>
            
            {formState.customMessage && (
              <div className="p-1.5 rounded-lg border font-mono text-[10px] text-center truncate shrink-0"
                   style={{
                     backgroundColor: (formState.color || '#00f0ff') + '18',
                     borderColor: (formState.color || '#00f0ff') + '40',
                     color: 'var(--theme-text-main, #ffffff)'
                   }}>
                {formState.customMessage}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-zinc-500 font-mono text-center">
          Review your trigger settings before confirming. This command will add the overlay to your live stage when triggered in chat.
        </p>

      </div>
    </div>
  </div>
)}`;
  code = code.replace(tab5Regex, newContent);
  fs.writeFileSync('src/components/CommandManager.tsx', code);
  console.log("Replaced Tab 5");
} else {
  console.log("Could not find Tab 5 block.");
}
