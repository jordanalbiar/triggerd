with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

handlers = """
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLayerId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverLayerId !== id) {
      setDragOverLayerId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedLayerId || draggedLayerId === targetId) {
      setDragOverLayerId(null);
      return;
    }
    
    setLayers(prev => {
      const updated = [...prev];
      const sourceIdx = updated.findIndex(l => l.id === draggedLayerId);
      const targetIdx = updated.findIndex(l => l.id === targetId);
      if (sourceIdx < 0 || targetIdx < 0) return prev;
      
      const [moved] = updated.splice(sourceIdx, 1);
      updated.splice(targetIdx, 0, moved);
      return updated;
    });
    
    setDraggedLayerId(null);
    setDragOverLayerId(null);
  };

  if (!isOpen) return null;"""

content = content.replace("  if (!isOpen) return null;", handlers)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
