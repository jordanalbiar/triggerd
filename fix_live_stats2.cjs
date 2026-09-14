const fs = require('fs');
let content = fs.readFileSync('src/components/LivePerformanceStats.tsx', 'utf8');

// The faulty pattern is something like:
// className="..."
//            {/* Animated Tooltip */}
//            <div ...>
//            ...
//            </div>
//          >
// We need to move the `>` from the end to right before `{/* Animated Tooltip */}`.

let lines = content.split('\n');
let newLines = [];
let i = 0;

while (i < lines.length) {
    if (lines[i].includes('{/* Animated Tooltip */}')) {
        // Check if previous line doesn't end with '>'
        if (!newLines[newLines.length - 1].trim().endsWith('>')) {
            newLines[newLines.length - 1] = newLines[newLines.length - 1] + ' >';
            
            // Now we need to find the stray `>` that was left at the end of the opening tag.
            // It will be a line containing just `          >`
            let j = i + 1;
            let foundStray = false;
            while (j < i + 20 && j < lines.length) {
                if (lines[j].trim() === '>') {
                    lines[j] = ''; // remove it
                    foundStray = true;
                    break;
                }
                j++;
            }
        }
    }
    if (lines[i].trim() !== '' || i === lines.length - 1) { // keep empty lines but don't add the removed stray > as empty line
        newLines.push(lines[i]);
    } else if (lines[i] === '') {
        newLines.push('');
    }
    i++;
}

// Clean up any double empty lines that might have been created
content = newLines.join('\n');
// Clean up empty lines where stray > was
content = content.replace(/\n\s*\n\s*<div/g, '\n            <div');

fs.writeFileSync('src/components/LivePerformanceStats.tsx', content);

console.log("Fixed button syntax!");
