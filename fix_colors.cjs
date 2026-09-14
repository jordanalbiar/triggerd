const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const contrastFn = `
// Helper to determine text color based on background brightness
const getContrastYIQ = (hexcolor: string) => {
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(c => c + c).join('');
  }
  const r = parseInt(hexcolor.substr(0, 2), 16) || 0;
  const g = parseInt(hexcolor.substr(2, 2), 16) || 0;
  const b = parseInt(hexcolor.substr(4, 2), 16) || 0;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};
`;

if (!code.includes('getContrastYIQ')) {
  // Insert after imports
  code = code.replace(/import \{ AdvanceCodeTriggerEditor \} from '.\/AdvanceCodeTriggerEditor';/, "import { AdvanceCodeTriggerEditor } from './AdvanceCodeTriggerEditor';\n" + contrastFn);
}

// Replace occurrences
// In the list view:
code = code.replace(/className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase text-black shrink-0 shadow cursor-pointer hover:scale-105 transition-transform"/, `className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase shrink-0 shadow cursor-pointer hover:scale-105 transition-transform"`);

code = code.replace(/style=\{\{\s*backgroundColor: cmdColor\s*\}\}/g, `style={{ backgroundColor: cmdColor, color: getContrastYIQ(cmdColor) }}`);

// In Tab 5 (Trigger Card view)
code = code.replace(/style=\{\{\s*backgroundColor: formState.color \|\| '#00f0ff', color: '#000'\s*\}\}/, `style={{ backgroundColor: formState.color || '#00f0ff', color: getContrastYIQ(formState.color || '#00f0ff') }}`);

fs.writeFileSync('src/components/CommandManager.tsx', code);
console.log("Updated colors");
