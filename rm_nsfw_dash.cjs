const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Remove nsfwUnlocked state and effect
content = content.replace(
  /const \[nsfwUnlocked, setNsfwUnlocked\] = useState\(\(\) => localStorage\.getItem\('triggerd_nsfw_unlocked'\) === 'true'\);\n  useEffect\(\(\) => \{\n    const handleNsfw = \(\) => setNsfwUnlocked\(true\);\n    window\.addEventListener\('nsfw_unlocked', handleNsfw\);\n    return \(\) => window\.removeEventListener\('nsfw_unlocked', handleNsfw\);\n  \}, \[\]\);\n/g,
  ""
);

// Remove the category from the menu map
content = content.replace(
  /\.\.\.\(nsfwUnlocked \? \[\{ id: 'nsfw', label: 'NSFW \/ 18\+', icon: EyeOff \}\] : \[\]\),\n/g,
  ""
);

// Remove filter logic
content = content.replace(
  /if \(testPanelCategory === 'nsfw'\) return style\.includes\('pornhub'\) \|\| style\.includes\('redgif'\) \|\| style\.includes\('18'\);\n/g,
  ""
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
