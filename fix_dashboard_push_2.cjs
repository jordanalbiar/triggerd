const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "setPreviewAlert(alert);\n      setConcurrentPreviewSpriteAlerts(prev => {",
  "activePreviewStackRef.current.push('sprite:' + alert.id);\n      setPreviewAlert(alert);\n      setConcurrentPreviewSpriteAlerts(prev => {"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed sprite push');
