const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

code = code.replace(/bg-\[var\(--theme-bg,#000000\)\]/g, 'bg-[var(--theme-card-alt,#0a2540)]');

// Check hover styles too. hover:bg-white/10 doesn't look good on light themes.
// Let's replace hover:bg-white/10 with hover:opacity-80 or similar? No, hover:brightness-110 is better
code = code.replace(/hover:bg-white\/10/g, 'hover:brightness-110');

fs.writeFileSync('src/components/DashboardContextMenus.tsx', code);
console.log('Fixed buttons context menus.');
