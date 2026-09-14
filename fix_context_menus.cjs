const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

// The main containers
code = code.replace(/bg-\[#04182e\]/g, 'bg-[var(--theme-card,#04182e)]');
code = code.replace(/bg-\[#020b18\]\/95/g, 'bg-[var(--theme-card-alt,#020b18)]');
code = code.replace(/bg-\[#020b18\]/g, 'bg-[var(--theme-bg,#020b18)]');
code = code.replace(/bg-\[#003865\]/g, 'bg-[var(--theme-border,#003865)]');
code = code.replace(/border-\[#003865\]/g, 'border-[var(--theme-border,#003865)]');

// Also update text colors if necessary, they have "text-white"
// Let's replace "text-white" with "text-[var(--theme-text-main,#fff)]" on the main container panels
code = code.replace(/text-white/g, 'text-[var(--theme-text-main,#ffffff)]');

fs.writeFileSync('src/components/DashboardContextMenus.tsx', code);
console.log('Fixed DashboardContextMenus colors.');
