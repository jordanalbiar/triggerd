import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# Add states for drag and drop
search_state = "  const [contextMenuPos, setContextMenuPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });"
replace_state = """  const [contextMenuPos, setContextMenuPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOverLayerId, setDragOverLayerId] = useState<string | null>(null);"""
content = content.replace(search_state, replace_state)

# Add handler functions
search_handlers = "  const handleLayerPointerDown = (e: React.PointerEvent, layerId: string) => {"
replace_handlers = """  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    e.dataTransfer.setData('text/plain', layerId);
    setDraggedLayerId(layerId);
  };
  const handleDragOver = (e: React.DragEvent, layerId: string) => {
    e.preventDefault();
    setDragOverLayerId(layerId);
  };
  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    const sourceLayerId = e.dataTransfer.getData('text/plain');
    setDraggedLayerId(null);
    setDragOverLayerId(null);
    if (sourceLayerId === targetLayerId) return;
    
    setLayers(prev => {
      const sourceIdx = prev.findIndex(l => l.id === sourceLayerId);
      const targetIdx = prev.findIndex(l => l.id === targetLayerId);
      if (sourceIdx === -1 || targetIdx === -1) return prev;
      
      const newLayers = [...prev];
      const [removed] = newLayers.splice(sourceIdx, 1);
      newLayers.splice(targetIdx, 0, removed);
      
      return newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
    });
  };

  const handleLayerPointerDown = (e: React.PointerEvent, layerId: string) => {"""
content = content.replace(search_handlers, replace_handlers)


# Add drag handlers to the layer div
search_layer_item = """                      return (
                        <div
                          key={layer.id}
                          onClick={() => setSelectedLayerId(layer.id)}
                          className={`p-1.5 rounded-lg border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white'
                              : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span className="text-[10px] font-bold truncate">{layer.name}</span>
                          </div>"""
replace_layer_item = """                      return (
                        <div
                          key={layer.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, layer.id)}
                          onDragOver={(e) => handleDragOver(e, layer.id)}
                          onDrop={(e) => handleDrop(e, layer.id)}
                          onDragEnd={() => { setDraggedLayerId(null); setDragOverLayerId(null); }}
                          onClick={() => setSelectedLayerId(layer.id)}
                          className={`p-1.5 rounded-lg border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                            dragOverLayerId === layer.id ? 'border-t-2 border-t-cyan-400 opacity-50' : ''
                          } ${
                            draggedLayerId === layer.id ? 'opacity-30' : ''
                          } ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white'
                              : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span className="text-[10px] font-bold truncate">{layer.name}</span>
                          </div>"""
content = content.replace(search_layer_item, replace_layer_item)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)

