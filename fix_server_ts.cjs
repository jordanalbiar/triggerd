const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The DEFAULT_COMMANDS in server.ts has a copy of all commands.
// Let's replace the redgif, pornhub, boobies, chatur objects entirely or remove them.
content = content.replace(/\{[^}]*id: 'cmd-redgif'[^}]*\},\n?/g, "");
content = content.replace(/\{[^}]*id: 'cmd-pornhub'[^}]*\},\n?/g, "");
content = content.replace(/\{[^}]*id: 'cmd-boobies'[^}]*\},\n?/g, "");
content = content.replace(/\{[^}]*id: 'cmd-chatur'[^}]*\},\n?/g, "");

content = content.replace(/\["redgif", "pornhub", "boobies", "chatur"\]/g, "[]");
content = content.replace(/!\["redgif", "pornhub", "boobies", "chatur"\]/g, "!");

fs.writeFileSync('server.ts', content);
