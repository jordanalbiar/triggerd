const fs = require('fs');
let content = fs.readFileSync('src/components/sprites/SpriteOverlayRenderer.tsx', 'utf8');

content = content.replace(/if \(cleanCmd === 'boobies'[\s\S]*?<\/div>\n    \);\n  \}\n/g, "");
fs.writeFileSync('src/components/sprites/SpriteOverlayRenderer.tsx', content);
