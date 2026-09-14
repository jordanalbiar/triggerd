const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');
code = code.replace("  </div>\n)}}", "  </div>\n)}");
fs.writeFileSync('src/components/CommandManager.tsx', code);
