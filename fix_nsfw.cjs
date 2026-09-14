const fs = require('fs');

// TerminalDropdown.tsx
let td = fs.readFileSync('src/components/TerminalDropdown.tsx', 'utf8');
if (!td.includes('triggerd_nsfw_unlocked')) {
  td = td.replace(/if \(mainCmd === 'clear' && arg === 'terminal'\)/, `
    if (mainCmd === 'nsfw') {
      localStorage.setItem('triggerd_nsfw_unlocked', 'true');
      window.dispatchEvent(new Event('nsfw_unlocked'));
      addLog('success', '🔓 NSFW Overlays unlocked.');
      return;
    }
    if (mainCmd === 'clear' && arg === 'terminal')`);
  fs.writeFileSync('src/components/TerminalDropdown.tsx', td);
}

// CommandManager.tsx
let cm = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');
if (!cm.includes('nsfwUnlocked')) {
  cm = cm.replace(/const \[activeCategory, setActiveCategory\] = useState<string>\('all'\);/, `const [activeCategory, setActiveCategory] = useState<string>('all');\n  const [nsfwUnlocked, setNsfwUnlocked] = useState(() => localStorage.getItem('triggerd_nsfw_unlocked') === 'true');\n  useEffect(() => {\n    const handleNsfw = () => setNsfwUnlocked(true);\n    window.addEventListener('nsfw_unlocked', handleNsfw);\n    return () => window.removeEventListener('nsfw_unlocked', handleNsfw);\n  }, []);`);
  
  cm = cm.replace(/\{ id: 'utility', label: 'Utility', icon: Zap \}/, `{ id: 'utility', label: 'Utility', icon: Zap },\n                    ...(nsfwUnlocked ? [{ id: 'nsfw', label: 'NSFW 18+', icon: EyeOff }] : [])`);
  
  fs.writeFileSync('src/components/CommandManager.tsx', cm);
}

// Dashboard.tsx
let db = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
if (!db.includes('nsfwUnlocked')) {
  db = db.replace(/const \[testPanelCategory, setTestPanelCategory\]/, `const [nsfwUnlocked, setNsfwUnlocked] = useState(() => localStorage.getItem('triggerd_nsfw_unlocked') === 'true');\n  useEffect(() => {\n    const handleNsfw = () => setNsfwUnlocked(true);\n    window.addEventListener('nsfw_unlocked', handleNsfw);\n    return () => window.removeEventListener('nsfw_unlocked', handleNsfw);\n  }, []);\n  const [testPanelCategory, setTestPanelCategory]`);
  
  db = db.replace(/\{ id: 'nsfw', label: 'NSFW \/ 18\+', icon: EyeOff \},/, `{...(nsfwUnlocked ? [{ id: 'nsfw', label: 'NSFW / 18+', icon: EyeOff }] : [])},`);
  fs.writeFileSync('src/components/Dashboard.tsx', db);
}
