const fs = require('fs');
let code = fs.readFileSync('src/components/CssAnimatedWallpaper.tsx', 'utf8');

// The original buggy hex concatenation:
// ctx.strokeStyle = \`\${accentColor}\${Math.floor(intensity * 180).toString(16).padStart(2, '0')}\`;
// ctx.fillStyle = \`\${accentColor}25\`;

// We replace it with CSS color-mix or just fallback to hex if it's var(). But canvas doesn't support color-mix easily in all browsers? Actually canvas supports color-mix!
// But easier: we can just use ctx.globalAlpha instead!

const replaceStr = `
            ctx.globalAlpha = intensity * 0.7; // 180/255 = ~0.7
            ctx.strokeStyle = accentColor;
            ctx.stroke();
            if (intensity > 0.82) {
              ctx.globalAlpha = 0.15; // 25/255 = ~0.1
              ctx.fillStyle = accentColor;
              ctx.fill();
            }
            ctx.globalAlpha = 1.0;
`;

code = code.replace(
  /\s*ctx\.strokeStyle = `\$\{accentColor\}\$\{Math\.floor\(intensity \* 180\)\.toString\(16\)\.padStart\(2, '0'\)\}`;[\s\S]*?ctx\.fill\(\);\n\s*\}/,
  replaceStr
);

fs.writeFileSync('src/components/CssAnimatedWallpaper.tsx', code);
