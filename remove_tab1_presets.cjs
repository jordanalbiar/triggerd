const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const regex = /<div className="flex items-center gap-1\.5 mt-2 text-\[10px\] font-mono flex-wrap"[\s\S]*?<\/div>\s*<\/div>\s*<div>\s*<label className="block mb-1 font-bold"/;

if (regex.test(code)) {
    code = code.replace(regex, '</div>\n              <div>\n                <label className="block mb-1 font-bold"');
    fs.writeFileSync('src/components/CommandManager.tsx', code);
    console.log('Removed Tab 1 quick presets successfully.');
} else {
    console.log('Regex did not match.');
}
