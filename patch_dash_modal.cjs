const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

file = file.replace(
  "import { StaticOverlayRenderer } from './StaticOverlayRenderer';",
  "import { StaticOverlayRenderer } from './StaticOverlayRenderer';\nimport { StaticSourceDeleteModal } from './StaticSourceDeleteModal';"
);

const modalRegex = /\{\/\* Static Overlay Source Delete Confirmation Modal \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/;

if (modalRegex.test(file)) {
  file = file.replace(
    modalRegex,
    `{/* Static Overlay Source Delete Confirmation Modal */}
      <StaticSourceDeleteModal
        source={staticSourceToDelete}
        onCancel={() => setStaticSourceToDelete(null)}
        onConfirm={executeDeleteStaticSource}
      />`
  );
  fs.writeFileSync('src/components/Dashboard.tsx', file);
  console.log("Patched successfully");
} else {
  console.log("Could not find modal to replace");
}
