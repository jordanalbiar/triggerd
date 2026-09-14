const fs = require('fs');
let content = fs.readFileSync('src/components/sprites/SpriteOverlayRenderer.tsx', 'utf8');

// Remove imports
content = content.replace(/import \{ PornhubGifSprite \} from '.\/PornhubGifSprite';\n/, "");
content = content.replace(/import \{ RedGifOverlaySprite \} from '.\/RedGifOverlaySprite';\n/, "");

// Remove redgif logic
content = content.replace(/const isRedGifTrigger.*?\n/g, "");
content = content.replace(/const isGifTrigger = !isRedGifTrigger &&/g, "const isGifTrigger =");
content = content.replace(/\|\| isRedGifTrigger/g, "");
content = content.replace(/if \(isRedGifTrigger\) \{\n    return <RedGifOverlaySprite[^>]*\/>;\n  \}\n/g, "");

// Remove pornhub logic
content = content.replace(/if \(cleanCmd === 'pornhub'[^}]*\}\n/g, "");
content = content.replace(/case 'pornhub':\n      return <PornhubGifSprite[^>]*\/>;\n/g, "");

content = content.replace(/, 'pornhub'/g, "");

fs.writeFileSync('src/components/sprites/SpriteOverlayRenderer.tsx', content);
