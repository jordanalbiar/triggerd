const fs = require('fs');
let code = fs.readFileSync('src/components/VisualCanvasTriggerBuilder.tsx', 'utf8');

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'layers' | 'behaviors' | 'timeline' | 'transitions' | 'spec'>('edit');",
  `const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'layers' | 'behaviors' | 'timeline' | 'transitions' | 'spec'>('edit');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);`
);

fs.writeFileSync('src/components/VisualCanvasTriggerBuilder.tsx', code);
