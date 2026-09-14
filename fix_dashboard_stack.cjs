const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

const stackRefCode = `  const processedDashboardAlertIdsRef = useRef<Set<string>>(new Set());
  const activePreviewStackRef = useRef<string[]>([]);`;

content = content.replace(`  const processedDashboardAlertIdsRef = useRef<Set<string>>(new Set());`, stackRefCode);

fs.writeFileSync(file, content, 'utf8');
console.log('Added stack ref');
