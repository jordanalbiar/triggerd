const fs = require('fs');
let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// Replace the category state
content = content.replace(
  /useState<'all' \| 'streamer' \| 'gaming' \| 'memes' \| 'utility' \| 'static' \| 'nsfw'>\('all'\);/g,
  "useState<'all' | 'streamer' | 'gaming' | 'memes' | 'utility' | 'static'>('all');"
);

// Remove nsfwUnlocked state and effect
content = content.replace(
  /const \[nsfwUnlocked, setNsfwUnlocked\] = useState\(\(\) => localStorage\.getItem\('triggerd_nsfw_unlocked'\) === 'true'\);\n  useEffect\(\(\) => \{\n    const handleNsfw = \(\) => setNsfwUnlocked\(true\);\n    window\.addEventListener\('nsfw_unlocked', handleNsfw\);\n    return \(\) => window\.removeEventListener\('nsfw_unlocked', handleNsfw\);\n  \}, \[\]\);\n/g,
  ""
);

// Remove filter logic for nsfw
content = content.replace(/if \(selectedCategory === 'nsfw'\).*?\n/g, "");
content = content.replace(/if \(!nsfwUnlocked.*?\n/g, "");

// Remove the button
content = content.replace(/\{nsfwUnlocked && \(\s*<button[\s\S]*?<\/button>\s*\)\}/g, "");

fs.writeFileSync('src/components/CommandManager.tsx', content);
