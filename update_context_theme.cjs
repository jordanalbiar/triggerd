const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

// Replace standard dark mode zinc colors with theme variables for text
code = code.replace(/text-zinc-200/g, 'text-[var(--theme-text-main,#ffffff)]');
code = code.replace(/text-zinc-300/g, 'text-[var(--theme-text-muted,#d4d4d8)]');
code = code.replace(/text-zinc-400/g, 'text-[var(--theme-text-muted,#a1a1aa)]');
code = code.replace(/text-zinc-500/g, 'text-[var(--theme-text-muted,#71717a)]');

// Replace dark backgrounds used in buttons
code = code.replace(/bg-black\/40/g, 'bg-[var(--theme-bg,#000000)]');
code = code.replace(/bg-black\/20/g, 'bg-[var(--theme-bg,#000000)]');
code = code.replace(/bg-black\/50/g, 'bg-[var(--theme-bg,#000000)]');
code = code.replace(/bg-zinc-800/g, 'bg-[var(--theme-card-alt,#27272a)]');
code = code.replace(/bg-zinc-900/g, 'bg-[var(--theme-card,#18181b)]');

// Replace borders
code = code.replace(/border-zinc-700/g, 'border-[var(--theme-border,#3f3f46)]');
code = code.replace(/border-zinc-800/g, 'border-[var(--theme-border,#27272a)]');
code = code.replace(/border-zinc-800\/80/g, 'border-[var(--theme-border,#27272a)]');

fs.writeFileSync('src/components/DashboardContextMenus.tsx', code);
console.log('Updated Context Menus Themes.');
