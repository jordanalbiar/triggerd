const fs = require('fs');

function updateTooltips(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Make Dashboard tooltips slightly bigger
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  content = content.replace(/px-2\.5 py-1(\.5)?/g, 'px-3 py-1.5');
  
  // Same for SideOverlayToggleTrays
  
  fs.writeFileSync(filePath, content);
}

updateTooltips('src/components/Dashboard.tsx');
updateTooltips('src/components/SideOverlayToggleTrays.tsx');

console.log("Tooltips updated");
