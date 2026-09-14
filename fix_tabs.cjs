const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

code = code.replace("{triggerFormStep === 1 && (\n {/* Moved from Step 3 -> 1 */}", "{triggerFormStep === 1 && (");
code = code.replace("{triggerFormStep === 2 && (\n {/* Moved from Step 4 -> 2 */}", "{triggerFormStep === 2 && (");
code = code.replace("{triggerFormStep === 3 && (\n {/* Moved from Step 5 -> 3 */}", "{triggerFormStep === 3 && (");

fs.writeFileSync('src/components/CommandManager.tsx', code);
