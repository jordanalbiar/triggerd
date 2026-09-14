const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/CommandManager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const promptStartStr = 'const AI_TRIGGER_PRIME_PROMPT = `';
const startIndex = content.indexOf(promptStartStr);
const endIndex = content.indexOf('`;', startIndex);

const rawPrompt = fs.readFileSync('raw_prompt.txt', 'utf8');
// Escape backticks and standard substitutions so it acts as a literal when output inside \` \` in TS
const escapedPrompt = rawPrompt.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

content = content.substring(0, startIndex) + promptStartStr + escapedPrompt + content.substring(endIndex);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed TS file.');
