const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const oldCode = `<div className="rounded-xl overflow-hidden border border-brand-border/50">
                  <AdvanceCodeTriggerEditor
                    formState={formState}
                    setFormState={setFormState}
                    isEditing={!!editingCommandId}
                    onTestCommand={(cmd) => {
                      if (onTestCommand) {
                        onTestCommand(cmd);
                      }
                    }}
                  />
                </div>`;

const newCode = `<div className="rounded-xl overflow-hidden border border-[#003865] flex flex-col md:flex-row h-[500px]">
                  <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[#003865] bg-[#020b18]">
                    <div className="flex items-center gap-1 p-2 border-b border-[#003865] bg-[#04182e]">
                      {['HTML', 'CSS', 'JS'].map(tab => (
                        <button
                          key={tab}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            // Need to implement activeCodeTab state, or just use a local DOM toggle or let's use a standard wrapper component
                            // Wait, we can't define useState hooks here easily. Let's just create a SimpleCodeEditor component!
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>`;
