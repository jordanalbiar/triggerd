const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

code = code.replace(/className="fixed inset-0 z-\[1200\] bg-\[var\(--theme-bg,#000000\)\] backdrop-blur-\[2px\]"/g, 'className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-[2px]"');
code = code.replace(/className="fixed inset-0 z-\[100090\] bg-\[var\(--theme-bg,#000000\)\]"/g, 'className="fixed inset-0 z-[100090] bg-black/10"');

fs.writeFileSync('src/components/DashboardContextMenus.tsx', code);
console.log('Fixed backdrops.');
