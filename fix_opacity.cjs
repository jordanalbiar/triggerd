const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

code = code.replace(/border-\[var\(--theme-border,#27272a\)\}\/80/g, 'border-[var(--theme-border,#27272a)]');
code = code.replace(/border-\[var\(--theme-border,#27272a\)\]\/80/g, 'border-[var(--theme-border,#27272a)]');
code = code.replace(/border-\[var\(--theme-border,#003865\)\]\/60/g, 'border-[var(--theme-border,#003865)]');

fs.writeFileSync('src/components/DashboardContextMenus.tsx', code);
console.log('Fixed opacity modifiers on vars.');
