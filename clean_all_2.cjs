const fs = require('fs');

function cleanFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  content = content.replace(/\|\| isRedGif/g, "");
  content = content.replace(/\|\| isPornhub/g, "");
  content = content.replace(/\|\| isBoobies/g, "");
  content = content.replace(/\|\| isChatur/g, "");
  
  content = content.replace(/!isRedGif && /g, "");

  content = content.replace(/['"]pornhub['"],?\s*/g, "");
  content = content.replace(/['"]redgif['"],?\s*/g, "");
  content = content.replace(/['"]chatur['"],?\s*/g, "");
  content = content.replace(/['"]boobies['"],?\s*/g, "");

  fs.writeFileSync(path, content);
}

cleanFile('src/components/AlertOverlay.tsx');
cleanFile('src/components/Dashboard.tsx');
cleanFile('src/components/TriggerBehaviorModal.tsx');
cleanFile('src/components/SideOverlayToggleTrays.tsx');
