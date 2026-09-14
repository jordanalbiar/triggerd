const fs = require('fs');

let ao = fs.readFileSync('src/components/AlertOverlay.tsx', 'utf8');

// Remove the early return block
const earlyReturnRegex = /if \(isSystemSleeping\) \{\s*return \(\s*<div className="w-full h-full min-h-screen relative overflow-hidden bg-transparent">\s*<SystemSleepOverlay isSleeping=\{true\} onWake=\{\(\) => \{\}\} \/>\s*<\/div>\s*\);\s*\}/;
ao = ao.replace(earlyReturnRegex, '');

// Now wrap the main return in a conditional, or just return it if sleeping
const mainReturnRegex = /return \(\s*<div\s+className="w-full h-full min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-500 p-0"/;

ao = ao.replace(mainReturnRegex, `
  if (isSystemSleeping) {
    return (
      <div className="w-full h-full min-h-screen relative overflow-hidden bg-transparent">
        <SystemSleepOverlay isSleeping={true} onWake={() => {}} />
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-500 p-0"
`);

fs.writeFileSync('src/components/AlertOverlay.tsx', ao);
