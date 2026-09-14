const fs = require('fs');
let code = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

if (!code.includes('nsfwUnlocked')) {
  code = code.replace(/const \[selectedCategory, setSelectedCategory\] = useState<'all' \| 'streamer' \| 'gaming' \| 'memes' \| 'utility' \| 'static'>\('all'\);/, `const [selectedCategory, setSelectedCategory] = useState<'all' | 'streamer' | 'gaming' | 'memes' | 'utility' | 'static' | 'nsfw'>('all');
  
  const [nsfwUnlocked, setNsfwUnlocked] = useState(() => localStorage.getItem('triggerd_nsfw_unlocked') === 'true');
  useEffect(() => {
    const handleNsfw = () => setNsfwUnlocked(true);
    window.addEventListener('nsfw_unlocked', handleNsfw);
    return () => window.removeEventListener('nsfw_unlocked', handleNsfw);
  }, []);`);

  // Add the category button
  const staticBtnRegex = /<button\s+onClick=\{\(\) => setSelectedCategory\('static'\)\}[\s\S]*?<\/button>/;
  const match = code.match(staticBtnRegex);
  if (match) {
    const nsfwBtn = `
        {nsfwUnlocked && (
          <button
            onClick={() => setSelectedCategory('nsfw')}
            className={\`px-3 py-1.5 rounded-lg border font-mono font-bold text-[10px] sm:text-xs transition \${
              selectedCategory === 'nsfw'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-black text-zinc-400 border-brand-border/40 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] hover:border-[#00f0ff]/50'
            }\`}
          >
            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1.5" />
            NSFW
          </button>
        )}`;
    code = code.replace(staticBtnRegex, match[0] + "\n" + nsfwBtn);
  }

  // Add filter logic to first `commands.filter`
  code = code.replace(/if \(selectedCategory === 'utility'\) return style.includes\('gif'\) \|\| style.includes\('yt'\) \|\| style.includes\('time'\) \|\| style.includes\('rain'\) \|\| style.includes\('matrix'\) \|\| style.includes\('clear'\) \|\| style.includes\('test'\);/, `if (selectedCategory === 'utility') return style.includes('gif') || style.includes('yt') || style.includes('time') || style.includes('rain') || style.includes('matrix') || style.includes('clear') || style.includes('test');
    if (selectedCategory === 'nsfw') return style.includes('pornhub') || style.includes('redgif') || style.includes('18');
    if (!nsfwUnlocked && (style.includes('pornhub') || style.includes('redgif') || style.includes('18'))) return false;`);
  
  // Add filter logic to second `commands.filter` (lower down)
  code = code.replace(/if \(selectedCategory === 'utility'\) return style.includes\('gif'\) \|\| style.includes\('yt'\) \|\| style.includes\('time'\) \|\| style.includes\('rain'\) \|\| style.includes\('matrix'\) \|\| style.includes\('clear'\) \|\| style.includes\('test'\);/g, `if (selectedCategory === 'utility') return style.includes('gif') || style.includes('yt') || style.includes('time') || style.includes('rain') || style.includes('matrix') || style.includes('clear') || style.includes('test');
            if (selectedCategory === 'nsfw') return style.includes('pornhub') || style.includes('redgif') || style.includes('18');
            if (!nsfwUnlocked && (style.includes('pornhub') || style.includes('redgif') || style.includes('18'))) return false;`);

  fs.writeFileSync('src/components/CommandManager.tsx', code);
  console.log("Updated CommandManager with NSFW!");
} else {
  console.log("Already updated CommandManager NSFW");
}
