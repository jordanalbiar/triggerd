const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardContextMenus.tsx', 'utf8');

content = content.replace(
  /export interface DashboardContextMenusProps \{/g,
  `export interface DashboardContextMenusProps {\n  isDarkMode?: boolean;`
);

content = content.replace(
  /export const DashboardContextMenus: React\.FC<DashboardContextMenusProps> = \(\{/g,
  `export const DashboardContextMenus: React.FC<DashboardContextMenusProps> = ({\n  isDarkMode = true,`
);

fs.writeFileSync('src/components/DashboardContextMenus.tsx', content);
console.log("Added isDarkMode to DashboardContextMenus");
