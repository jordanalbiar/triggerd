const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/CommandManager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Shift the `{triggerFormStep === N && (` checks
// Replace 5 -> 6, 4 -> 5, 3 -> 4, 2 -> 3
content = content.replace(/{triggerFormStep === 5 && \(/g, '{triggerFormStep === 6 && (');
content = content.replace(/{triggerFormStep === 4 && \(/g, '{triggerFormStep === 5 && (');
content = content.replace(/{triggerFormStep === 3 && \(/g, '{triggerFormStep === 4 && (');
content = content.replace(/{triggerFormStep === 2 && \(/g, '{triggerFormStep === 3 && (');

// 2. Insert the new Step 2 right after the end of the second Step 1 block (which is around line 2230)
// Actually, it's safer to just inject it before the first `{triggerFormStep === 3 && (` block.
const step3Index = content.indexOf('{triggerFormStep === 3 && (');

const step2Block = `
          {triggerFormStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[var(--theme-border,#003865)] bg-black/40 space-y-3">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <span className="text-[var(--theme-accent,#00f0ff)]">⚙️</span>
                  Select a Premade Overlay Base (Functions & Blueprints)
                </h3>
                <p className="text-xs text-zinc-400">
                  Pick and choose from our library of premade overlay functions to auto-populate your custom HTML, CSS, and Javascript.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.keys(PRESET_TEMPLATES).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        const preset = PRESET_TEMPLATES[key];
                        setFormState(prev => ({
                          ...prev,
                          customHtml: preset.customHtml,
                          customCss: preset.customCss,
                          customJs: preset.customJs,
                          spriteStyle: 'custom'
                        }));
                        setTriggerFormStep(4); // auto advance to custom code
                      }}
                      className="p-3 rounded-lg border border-[var(--theme-border,#003865)]/60 hover:border-[var(--theme-accent,#00f0ff)]/80 bg-[var(--theme-card-alt,#0a2540)] text-white flex flex-col items-center justify-center transition-all shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] text-center h-24"
                    >
                      <span className="font-bold capitalize mb-1">{key.replace('-', ' ')}</span>
                      <span className="text-[10px] text-[var(--theme-muted,#80c8ff)] uppercase mt-1">Load Preset</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
`;

content = content.substring(0, step3Index) + step2Block + content.substring(step3Index);

// 3. Update the step definition array
const oldSteps = `[
              { id: 1, label: 'Basic Info', desc: 'Commands & Variants', optional: false },
              { id: 2, label: 'Behavior Traits', desc: 'Types & Examples', optional: false },
              { id: 3, label: 'Custom Code', desc: 'HTML/CSS/JS + Preview', optional: false },
              { id: 4, label: 'Test Display', desc: 'Preview + Logs', optional: true },
              { id: 5, label: 'Overview', desc: 'Trigger Card', optional: false }
            ]`;

const newSteps = `[
              { id: 1, label: 'Basic Info', desc: 'Commands & Variants', optional: false },
              { id: 2, label: 'Templates', desc: 'Premade Bases', optional: true },
              { id: 3, label: 'Behavior Traits', desc: 'Types & Examples', optional: false },
              { id: 4, label: 'Custom Code', desc: 'HTML/CSS/JS + Preview', optional: false },
              { id: 5, label: 'Test Display', desc: 'Preview + Logs', optional: true },
              { id: 6, label: 'Overview', desc: 'Trigger Card', optional: false }
            ]`;

content = content.replace(oldSteps, newSteps);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched CommandManager.tsx');
