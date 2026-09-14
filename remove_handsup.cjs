const fs = require('fs');
const path = require('path');

// 1. SpriteOverlayRenderer
let file1 = path.join(__dirname, 'src/components/sprites/SpriteOverlayRenderer.tsx');
let content1 = fs.readFileSync(file1, 'utf8');

content1 = content1.replace(/import \{ HandsUpOverlaySprite \} from '\.\/HandsUpOverlaySprite';\n?/g, '');
content1 = content1.replace(/  if \(cleanCmd === 'hands up!' \|\| cleanCmd === 'hands up' \|\| cleanCmd === 'handsup' \|\| alert\.command\?\.toLowerCase\(\)\.includes\('hands up'\)\) \{\n    return <HandsUpOverlaySprite scale=\{scale\} alert=\{alert\} \/>;\n  \}\n/g, '');
content1 = content1.replace(/    case 'handsup':\n    case 'hands up':\n    case 'hands up!':\n      return <HandsUpOverlaySprite scale=\{scale\} alert=\{alert\} \/>;\n/g, '');

fs.writeFileSync(file1, content1);

// 2. presetTemplates.ts
let file2 = path.join(__dirname, 'src/utils/presetTemplates.ts');
let content2 = fs.readFileSync(file2, 'utf8');

// Use a regex to match the 'handsup' key and its content
// Since it's at the beginning of the PRESET_TEMPLATES object, we can just replace it.
content2 = content2.replace(/  handsup: \{[\s\S]*?console\.log\("🙌 Hands up preset overlay triggered"\);`\n  \},\n/g, '');

fs.writeFileSync(file2, content2);
console.log('Removed HandsUp overlay from both files.');
