const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

content = content.replace(
  /<DashboardContextMenus/g,
  `<DashboardContextMenus\n        isDarkMode={(wizardSettings.themeShade ?? 15) < 80}`
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
console.log("Added isDarkMode to DashboardContextMenus in Dashboard.tsx");
