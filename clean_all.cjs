const fs = require('fs');

function cleanFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  // Arrays modifications
  content = content.replace(/, 'chatur', 'youtube', 'yt', 'pornhub', 'redgif'/g, ", 'youtube', 'yt'");
  content = content.replace(/, 'youtube', 'yt', 'pornhub', 'redgif'/g, ", 'youtube', 'yt'");
  content = content.replace(/, 'gif', 'redgif', 'pornhub', 'boobies'/g, ", 'gif'");
  content = content.replace(/, 'redgif', 'pornhub', 'boobies'/g, "");
  content = content.replace(/, 'pornhub', 'redgif'/g, "");
  content = content.replace(/, 'pornhub', 'redgif', 'chatur'/g, "");
  content = content.replace(/, 'gif', 'media', 'boobies'/g, ", 'gif', 'media'");
  content = content.replace(/\|\| cmd\.includes\('chatur'\) /g, "");

  // Types
  content = content.replace(/\n\s*\| 'redgif'/g, "");
  content = content.replace(/\n\s*\| 'pornhub'/g, "");
  content = content.replace(/\n\s*\| 'boobies'/g, "");
  content = content.replace(/\n\s*\| 'chatur'/g, "");

  // Variables
  content = content.replace(/const isRedGif = [^;]+;/g, "const isRedGif = false;");
  content = content.replace(/const isPornhub = [^;]+;/g, "const isPornhub = false;");
  content = content.replace(/const isBoobies = [^;]+;/g, "const isBoobies = false;");
  content = content.replace(/const isChatur = [^;]+;/g, "const isChatur = false;");

  fs.writeFileSync(path, content);
}

cleanFile('src/components/AlertOverlay.tsx');
cleanFile('src/components/Dashboard.tsx');
cleanFile('src/components/TriggerBehaviorModal.tsx');
cleanFile('src/components/SideOverlayToggleTrays.tsx');
cleanFile('src/types.ts');
