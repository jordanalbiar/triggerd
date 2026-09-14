const fs = require('fs');
let file = fs.readFileSync('src/components/StaticOverlayRenderer.tsx', 'utf8');

file = file.replace(
  'onContextMenuSource?: (e: React.MouseEvent, source: StaticOverlaySource) => void;',
  'onContextMenuSource?: (e: React.MouseEvent, source: StaticOverlaySource) => void;\n  onDeleteSource?: (id: string) => void;'
);

file = file.replace(
  'onUpdateSource,\n  onContextMenuSource\n})',
  'onUpdateSource,\n  onContextMenuSource,\n  onDeleteSource\n})'
);

const deleteButtonStr = `                {/* Delete Button */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    if (onDeleteSource) onDeleteSource(source.id);
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 border border-black text-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(255,0,0,0.8)] hover:scale-110 hover:bg-red-500 transition-all z-[1002]"
                  title="Delete Source"
                >
                  <span className="text-xs font-bold leading-none select-none">✕</span>
                </button>
`;

file = file.replace(
  '                {/* Top Right */}',
  deleteButtonStr + '                {/* Top Right */}'
);

fs.writeFileSync('src/components/StaticOverlayRenderer.tsx', file);
