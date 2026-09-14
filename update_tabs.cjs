const fs = require('fs');
const content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const replacement = `            ].map(step => {
              const isLight = (themeShade ?? 15) >= 50;
              const isActive = triggerFormStep === step.id;
              return (
              <button
                key={step.id}
                type="button"
                onClick={() => setTriggerFormStep(step.id)}
                className={\`p-2 rounded-lg border text-left flex flex-col transition cursor-pointer \${
                  isActive
                    ? (isLight ? 'bg-white/90 border-cyan-500 ring-1 ring-cyan-500 shadow-sm' : 'bg-[#00f0ff]/20 border-[#00f0ff] ring-1 ring-[#00f0ff]')
                    : (isLight ? 'bg-zinc-100 border-zinc-300 hover:border-cyan-500/50' : 'bg-black/40 border-[#003865] hover:border-[#00f0ff]/50')
                }\`}
              >
                <div className="flex items-center gap-1">
                  <span className={\`text-[10px] font-black \${
                    isActive 
                      ? (isLight ? 'text-cyan-700' : 'text-[#00f0ff]') 
                      : (isLight ? 'text-zinc-500' : 'text-zinc-400')
                  }\`}>STEP {step.id}</span>
                  {step.optional && <span className={\`text-[8px] px-1 rounded \${isLight ? 'bg-zinc-300 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}\`}>OPT</span>}
                </div>
                <span className={\`text-xs font-bold \${
                  isActive 
                    ? (isLight ? 'text-zinc-900' : 'text-white') 
                    : (isLight ? 'text-zinc-700' : 'text-zinc-500')
                }\`}>{step.label}</span>
              </button>
            )})}
`;

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('].map(step => ('));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</button>')) + 1; // including the )})}

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = [
    ...lines.slice(0, startIdx),
    replacement.trimEnd(),
    ...lines.slice(endIdx + 1)
  ];
  fs.writeFileSync('src/components/CommandManager.tsx', newLines.join('\n'));
  console.log("Updated step tabs styling");
} else {
  console.log("Could not find step tabs to replace");
}
