const fs = require('fs');
const file = 'src/components/DashboardContextMenus.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/className="fixed z-\[1201\]([^"]*) overflow-hidden"/g, 'className="fixed z-[1201]$1 max-h-[90vh] overflow-y-auto"');
code = code.replace(/className="fixed z-\[100100\]([^"]*) overflow-hidden([^"]*)"/g, 'className="fixed z-[100100]$1 max-h-[90vh] overflow-y-auto$2"');

fs.writeFileSync(file, code);
