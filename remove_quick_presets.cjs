const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// Replace the Tab 1 quick presets
const tab1QuickPresetsRegex = /\{\/\*\s*Quick\s*Presets\s*\*\/\}\s*<div\s*className="flex\s*flex-wrap[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div>\s*<label\s*className="block\s*mb-1/g;

// Also remove from Prefix & Suffix control panel
const mainQuickPresetsRegex = /\{\/\*\s*Quick\s*Preset\s*Buttons[\s\S]*?Clear\s*Prefixes\/Suffixes[\s\S]*?<\/button>\s*<\/div>/g;

code = code.replace(mainQuickPresetsRegex, '');

fs.writeFileSync('src/components/CommandManager.tsx', code);
