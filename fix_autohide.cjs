const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /const \[autoHideExpandedToolbar, setAutoHideExpandedToolbar\] = useState<boolean>\(\(\) => \{[\s\S]*?return false;\n  \}\);/,
  `const [autoHideExpandedToolbar, setAutoHideExpandedToolbar] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('triggerd_stage_auto_hide');
      if (saved !== null) {
        try {
          return JSON.parse(saved);
        } catch {
          return false;
        }
      }
    }
    return false;
  });`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
