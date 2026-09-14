const fs = require('fs');
let content = fs.readFileSync('src/components/StaticSourcesContent.tsx', 'utf8');

// Insert state and effect
const stateToAdd = `  const [instantUpdate, setInstantUpdate] = useState<boolean>(true);

  // Auto-save effect for Instant Update
  useEffect(() => {
    if (currentMode === 'edit' && selectedSourceId && instantUpdate) {
      if (formValues.id === selectedSourceId) {
        onUpdateSource(selectedSourceId, formValues);
      }
    }
  }, [formValues, currentMode, selectedSourceId, instantUpdate, onUpdateSource]);

`;

content = content.replace("  const fileInputRef = useRef<HTMLInputElement>(null);\n", "  const fileInputRef = useRef<HTMLInputElement>(null);\n\n" + stateToAdd);

// Find the footer div
const footerRegex = /      \{saveSuccessMsg && \(\n        <div className="flex-1 text-\[10px\] text-emerald-400 font-bold bg-emerald-900\/30 px-2 py-1 rounded animate-pulse text-center">\n          \{saveSuccessMsg\}\n        <\/div>\n      \)\}/m;

const footerReplacement = `      {/* Instant Update Toggle */}
      {currentMode === 'edit' && (
        <div className="flex-1 flex items-center gap-2 px-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={instantUpdate}
              onChange={(e) => setInstantUpdate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
          <span className="text-[10px] text-zinc-400 font-bold leading-tight">Instant<br/>Update</span>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="flex-1 text-[10px] text-emerald-400 font-bold bg-emerald-900/30 px-2 py-1 rounded animate-pulse text-center">
          {saveSuccessMsg}
        </div>
      )}`;

content = content.replace(footerRegex, footerReplacement);

fs.writeFileSync('src/components/StaticSourcesContent.tsx', content);
