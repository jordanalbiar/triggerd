const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

// The file has 3 time commands:
// 1. id: 'cmd-time', command: 'what time is it'
// 2. id: 'cmd-time-comical', command: 'time'
// 3. id: 'cmd-time-ascii', command: 'whats the time'

// Let's just remove the objects for 'cmd-time-comical' and 'cmd-time-ascii'.
// They start at "id: 'cmd-time-comical'" and end before the next "{".
// We can use a regex to match the object.
types = types.replace(/\s*\{\s*id:\s*'cmd-time-comical'[\s\S]*?(?=\s*\{\s*id:|\s*\]\s*;)/g, '');
types = types.replace(/\s*\{\s*id:\s*'cmd-time-ascii'[\s\S]*?(?=\s*\{\s*id:|\s*\]\s*;)/g, '');

fs.writeFileSync('src/types.ts', types);
