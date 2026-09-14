const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/AlertOverlay.tsx');
let content = fs.readFileSync(file, 'utf8');

// We want `clear!` to mean `clear all`.
const regex = /const isClearAll = target === 'all' \|\| target === 'overlays' \|\| fullCmd.includes\('clear! all'\) \|\| fullCmd.includes\('clear all'\) \|\| target === 'clear all';/g;

const replacement = `const isClearAll = target === 'all' || target === 'overlays' || fullCmd.includes('clear! all') || fullCmd.includes('clear all') || target === 'clear all' || isExclamationClear;`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed AlertOverlay');
