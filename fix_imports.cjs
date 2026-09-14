const fs = require('fs');

let ao = fs.readFileSync('src/components/AlertOverlay.tsx', 'utf8');
if (!ao.includes('import { SystemSleepOverlay }')) {
  ao = "import { SystemSleepOverlay } from './SystemSleepOverlay';\n" + ao;
}
fs.writeFileSync('src/components/AlertOverlay.tsx', ao);

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace(
  'ch.postMessage({ type: \'sleep_state\', isSleeping });',
  'ch.postMessage({ type: \'sleep_state\', isSleeping: isSystemSleeping });'
);
fs.writeFileSync('src/components/Dashboard.tsx', dash);
