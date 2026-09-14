const fs = require('fs');
let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const instantDeleteStr = `  const handleInstantDeleteStaticSource = useCallback((id: string) => {
    setStaticSources(prev => prev.filter(s => s.id !== id));
    setSelectedStaticSourceId(prev => (prev === id ? null : prev));
  }, []);

  const handleDeleteStaticSource = useCallback((id: string) => {`;

file = file.replace('  const handleDeleteStaticSource = useCallback((id: string) => {', instantDeleteStr);

const rendererCallStr = `<StaticOverlayRenderer
                  sources={staticSources}
                  isInteractive={true}
                  selectedSourceId={selectedStaticSourceId}
                  onSelectSource={handleSelectStaticSource}
                  onUpdateSource={handleUpdateStaticSource}
                  onContextMenuSource={handleStaticSourceContextMenu}
                  onDeleteSource={handleInstantDeleteStaticSource}
                />`;

file = file.replace(/<StaticOverlayRenderer[\s\S]*?onContextMenuSource={handleStaticSourceContextMenu}\s*\/>/, rendererCallStr);

fs.writeFileSync('src/components/Dashboard.tsx', file);
