const fs = require('fs');
let code = fs.readFileSync('src/utils/gridStyles.ts', 'utf8');

code = code.replace(/const c = color \|\| '#00f0ff';/, "const c = color || '#00f0ff'; const mix = (pct) => c.startsWith('var') ? `color-mix(in srgb, ${c} ${pct}%, transparent)` : `${c}${pct}`;");

code = code.replace(/\$\{c\}40/g, "${mix(40)}");
code = code.replace(/\$\{c\}45/g, "${mix(45)}");
code = code.replace(/\$\{c\}25/g, "${mix(25)}");
code = code.replace(/\$\{c\}60/g, "${mix(60)}");
code = code.replace(/\$\{c\}30/g, "${mix(30)}");
code = code.replace(/\$\{c\}20/g, "${mix(20)}");
code = code.replace(/\$\{c\}35/g, "${mix(35)}");

fs.writeFileSync('src/utils/gridStyles.ts', code);
