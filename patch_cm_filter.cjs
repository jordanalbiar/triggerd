const fs = require('fs');
let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const filteringInsert2 = "if (selectedCategory === 'utility') return style.includes('gif') || style.includes('yt') || style.includes('time') || style.includes('rain') || style.includes('matrix') || style.includes('clear') || style.includes('test');";
// We might have multiple of these because we just inserted it. Let's do a global replace or find the exact ones.
// We already inserted 'custom' in the first one, let's fix the second one at ~3097.

content = content.replace(/if \(selectedCategory === 'utility'\) return style\.includes\('gif'\) \|\| style\.includes\('yt'\) \|\| style\.includes\('time'\) \|\| style\.includes\('rain'\) \|\| style\.includes\('matrix'\) \|\| style\.includes\('clear'\) \|\| style\.includes\('test'\);\s*return true;/g, "if (selectedCategory === 'utility') return style.includes('gif') || style.includes('yt') || style.includes('time') || style.includes('rain') || style.includes('matrix') || style.includes('clear') || style.includes('test');\n            if (selectedCategory === 'custom') return cmd.spriteStyle === 'custom' || !!cmd.customHtml || !!cmd.mediaUrl;\n            return true;");

// Wait, the one we inserted before had 'custom' already but let's make sure both are correct.

fs.writeFileSync('src/components/CommandManager.tsx', content);
