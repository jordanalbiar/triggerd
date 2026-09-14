const fs = require('fs');
let code = fs.readFileSync('src/components/CssAnimatedWallpaper.tsx', 'utf8');

// replace \`${accentColor}XX\` with color-mix

// 40 hex = 64/255 = 25%
code = code.replace(/\`\$\{accentColor\}40\`/g, "\`color-mix(in srgb, \$\{accentColor\} 25%, transparent)\`");

// 99 hex = 153/255 = 60%
code = code.replace(/\`\$\{accentColor\}99\`/g, "\`color-mix(in srgb, \$\{accentColor\} 60%, transparent)\`");

// 44 hex = 68/255 = 27%
code = code.replace(/\`\$\{accentColor\}44\`/g, "\`color-mix(in srgb, \$\{accentColor\} 27%, transparent)\`");

// 66 hex = 102/255 = 40%
code = code.replace(/\`\$\{accentColor\}66\`/g, "\`color-mix(in srgb, \$\{accentColor\} 40%, transparent)\`");

// 25 hex = 37/255 = 15%
code = code.replace(/\`\$\{accentColor\}25\`/g, "\`color-mix(in srgb, \$\{accentColor\} 15%, transparent)\`");

// 30 hex = 48/255 = 19%
code = code.replace(/\`\$\{accentColor\}30\`/g, "\`color-mix(in srgb, \$\{accentColor\} 19%, transparent)\`");

// bb hex = 187/255 = 73%
code = code.replace(/\`\$\{accentColor\}bb\`/g, "\`color-mix(in srgb, \$\{accentColor\} 73%, transparent)\`");

fs.writeFileSync('src/components/CssAnimatedWallpaper.tsx', code);
