const fs = require('fs');
let code = fs.readFileSync('src/components/CssAnimatedWallpaper.tsx', 'utf8');

code = code.replace(/\`\$\{accentColor\}33\`/g, "\`color-mix(in srgb, \$\{accentColor\} 20%, transparent)\`");

fs.writeFileSync('src/components/CssAnimatedWallpaper.tsx', code);
