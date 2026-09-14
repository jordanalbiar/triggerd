const fs = require('fs');

const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regex = /import \{([^}]+)\} from '\.\/([^']+)'/g;
let match;
const comps = [];
while ((match = regex.exec(code)) !== null) {
    const names = match[1].split(',').map(s => s.trim()).filter(s => s[0] === s[0].toUpperCase() && !s.includes('Props') && !s.includes('Payload') && !s.includes('Status') && !s.includes('Config') && !s.includes('Log') && !s.includes('Settings'));
    comps.push(...names);
}
console.log(comps);
