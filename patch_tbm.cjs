const fs = require('fs');
let content = fs.readFileSync('src/components/TriggerBehaviorModal.tsx', 'utf8');

// Add 'custom' to BehaviorFilterCategory
content = content.replace(/\| 'permission';/, "| 'permission'\n  | 'custom';");

// Insert Custom filter button
const buttonInsertionPoint = "<span>🖼️ Media ({mediaCommands.length})</span>\n              </button>";
const newButton = `<span>🖼️ Media ({mediaCommands.length})</span>
              </button>
              <button
                onClick={() => setActiveCategory('custom')}
                className={\`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 \${
                  activeCategory === 'custom'
                    ? 'bg-orange-400 text-black shadow-md'
                    : 'bg-[#0a2540] text-orange-300 hover:bg-orange-500/20'
                }\`}
              >
                <span>📁 Custom</span>
              </button>`;
content = content.replace(buttonInsertionPoint, newButton);

// Insert filter logic
const filterInsertionPoint = "if (activeCategory === 'subcommands') return cmd.secondaryOptions && cmd.secondaryOptions.length > 0;";
const newFilter = `if (activeCategory === 'subcommands') return cmd.secondaryOptions && cmd.secondaryOptions.length > 0;
                  if (activeCategory === 'custom') return cmd.spriteStyle === 'custom' || !!cmd.customHtml || !!cmd.mediaUrl;`;
content = content.replace(filterInsertionPoint, newFilter);

// Replace the select element with toggle buttons
const selectRegex = /\{\/\* Add Trait Dropdown \/ Preset Selector \*\/\}.*?<\/select>/s;
const replacementUI = `
{/* Available Traits Toggle Buttons */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 w-full">
  {[
    { id: '✨ Glow Effect', desc: 'Adds a radiant outer glow to the overlay' },
    { id: '🟢 Chroma Key Removal', desc: 'Removes green background automatically' },
    { id: '📺 Canvas Fill (100%)', desc: 'Forces the overlay to stretch full screen' },
    { id: '💨 Breathing Motion', desc: 'Applies a slow pulsating animation' },
    { id: '📌 Sticky Persistent', desc: 'Keeps the overlay visible until manually removed' },
    { id: '📹 Over Webcam Source', desc: 'Positions directly over the camera feed' },
    { id: '🔒 Broadcaster Exclusive', desc: 'Only the streamer can trigger this' },
    { id: '📚 Stackable Canvas', desc: 'Allows multiple instances to stack' },
    { id: '🎈 Floating Message', desc: 'Drifts upward like a balloon' },
    { id: '⚡ Rapid Trigger', desc: 'Ignores cooldowns for quick firing' },
    { id: '🌈 Rainbow Shadow', desc: 'Applies a multi-color animated drop shadow' },
    { id: '🔊 Audio Sync', desc: 'Syncs animation scale with audio levels' }
  ].map(trait => {
    const isActive = cmdTraits.includes(trait.id);
    return (
      <button
        key={trait.id}
        type="button"
        onClick={() => {
          if (isActive) {
            handleRemoveTrait(cmd, trait.id);
          } else {
            handleAddTrait(cmd, trait.id);
          }
        }}
        className={\`text-left px-2 py-1.5 rounded-lg border flex flex-col gap-0.5 transition cursor-pointer \${
          isActive
            ? 'bg-amber-400 border-amber-400 text-black shadow-[0_0_8px_rgba(251,191,36,0.5)]'
            : 'bg-[#020b18] border-amber-400/30 text-amber-300 hover:bg-amber-400/10'
        }\`}
      >
        <span className="font-bold text-[10px] leading-tight">{trait.id}</span>
        <span className={\`text-[8.5px] leading-tight \${isActive ? 'text-black/80' : 'text-amber-200/60'}\`}>
          {trait.desc}
        </span>
      </button>
    );
  })}
</div>
`;
content = content.replace(selectRegex, replacementUI);

fs.writeFileSync('src/components/TriggerBehaviorModal.tsx', content);
