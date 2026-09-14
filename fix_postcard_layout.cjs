const fs = require('fs');

let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

// The Postcard container currently has:
// className={`min-h-[320px] h-auto rounded-2xl border-2 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden ${
content = content.replace(
  /className={\`min-h-\[320px\] h-auto rounded-2xl border-2 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden \${/g,
  `className={\`min-h-[320px] h-auto rounded-2xl border-2 transition-all flex flex-col sm:flex-row group shadow-xl relative overflow-hidden \${`
);

// Wait, changing it to sm:flex-row requires changing the internal containers too. Let's not do that unless we restructure the whole card.
// Let's just restore it to a flex-col but centered nicely in max-w-lg or max-w-xl so it doesn't look bad.
