const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

// It's already hidden for gifs: `{staticSourceTarget.type !== 'gif' && (`
// Wait, the prompt says: "have the aspect ratio to scale be set to free and dont show it on the right click menu"
// Let's check how the new gif is added in GifPortalSearch.tsx

let gifContent = fs.readFileSync('src/components/GifPortalSearch.tsx', 'utf8');

// The new source should have keepAspectRatio = false or something
gifContent = gifContent.replace(
  /type: 'gif',\n\s*visible: true,\n\s*locked: false,\n\s*x: 50,\n\s*y: 50,\n\s*width: 30,\n\s*height: 30,\n\s*zIndex: Date\.now\(\) % 10000,\n\s*opacity: 100,\n\s*rotation: 0,\n\s*scale: 1,\n\s*gifUrl: selectedUrl/g,
  `type: 'gif',\n      visible: true,\n      locked: false,\n      x: 50,\n      y: 50,\n      width: 30,\n      height: 30,\n      zIndex: Date.now() % 10000,\n      opacity: 100,\n      rotation: 0,\n      scale: 1,\n      keepAspectRatio: false,\n      gifUrl: selectedUrl`
);
fs.writeFileSync('src/components/GifPortalSearch.tsx', gifContent);

// Wait, the prompt says: "When themes in light mode on the right click menu have the bring front and send back buttons be dark text on a light purple background."
// Right now it checks `themeShade >= 80`. Is it light mode? We should check if we can pass isDarkMode or just check themeShade.

// Let's check how DashboardContextMenus.tsx handles themeShade.
// `themeShade >= 80` was used.
const btnFrontSearch = `className={\`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer \${
                          themeShade >= 80
                            ? 'bg-purple-200 hover:bg-purple-300 border-purple-400 text-black'
                            : 'bg-[var(--theme-card-alt,#0a2540)] hover:bg-purple-950/60 border-[var(--theme-border,#003865)] text-purple-300 hover:text-[var(--theme-text-main,#ffffff)]'
                        }\`}`;
const btnBackSearch = `className={\`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer \${
                          themeShade >= 80
                            ? 'bg-purple-200 hover:bg-purple-300 border-purple-400 text-black'
                            : 'bg-[var(--theme-card-alt,#0a2540)] hover:bg-purple-950/60 border-[var(--theme-border,#003865)] text-purple-300 hover:text-[var(--theme-text-main,#ffffff)]'
                        }\`}`;

content = content.replace(btnFrontSearch, `className={\`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer \${
                          isDarkMode === false || themeShade >= 80
                            ? 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-black'
                            : 'bg-[var(--theme-card-alt,#0a2540)] hover:bg-purple-950/60 border-[var(--theme-border,#003865)] text-purple-300 hover:text-[var(--theme-text-main,#ffffff)]'
                        }\`}`);

content = content.replace(btnBackSearch, `className={\`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer \${
                          isDarkMode === false || themeShade >= 80
                            ? 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-black'
                            : 'bg-[var(--theme-card-alt,#0a2540)] hover:bg-purple-950/60 border-[var(--theme-border,#003865)] text-purple-300 hover:text-[var(--theme-text-main,#ffffff)]'
                        }\`}`);
                        
fs.writeFileSync('src/components/DashboardContextMenus.tsx', content);
console.log("Context menu buttons updated");
