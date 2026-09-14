const fs = require('fs');
const content = fs.readFileSync('src/components/StaticSourcesContent.tsx', 'utf8');

const replacement = `  const handleSelectTab = (type: StaticSourceType) => {
    setActiveTab(type);
    if (type === 'gif') {
      setInputSourceMode('portal');
    }
    if (currentMode === 'add') {
      resetToDefaultForm(type);
      setMode('create');
    }
  };`;

const newContent = content.replace(
/  const handleSelectTab = \(type: StaticSourceType\) => \{[\s\S]*?  \};\n/m, 
replacement + '\n');
fs.writeFileSync('src/components/StaticSourcesContent.tsx', newContent);
