const fs = require('fs');
const file = 'src/components/StaticOverlayRenderer.tsx';
let code = fs.readFileSync(file, 'utf8');

const replacement = `
  const handlePointerDownDrag = (e: React.PointerEvent, source: StaticOverlaySource) => {
    if (!isInteractive || source.locked) return;
    // Prevent interfering with secondary clicks or middle clicks (unless it's a touch event)
    if (e.button !== 0 && e.pointerType !== 'touch') return; 
    e.stopPropagation();
    // Don't prevent default on touch so scroll doesn't break, wait, we might want to prevent default for dragging
    // e.preventDefault(); // Commenting out to allow some touch behaviors if needed, but for drag we might want it.
    if (e.pointerType !== 'touch') {
       e.preventDefault();
    }
    
    onSelectSource?.(source.id);

    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = source.x || 0;
    const initialY = source.y || 0;
    setDraggingId(source.id);
    setDragStartPos({ x: startX, y: startY, srcX: initialX, srcY: initialY });

    const handleDragMove = (moveEvent: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
      const dy = ((moveEvent.clientY - startY) / rect.height) * 100;

      let newX = initialX + dx;
      let newY = initialY + dy;
      
      // Allow moving slightly outside
      // newX = Math.max(0, Math.min(100, Math.round(newX * 10) / 10));
      // newY = Math.max(0, Math.min(100, Math.round(newY * 10) / 10));
      
      newX = Math.round(newX * 10) / 10;
      newY = Math.round(newY * 10) / 10;

      onUpdateSource?.(source.id, { x: newX, y: newY });
    };

    const handleDragUp = () => {
      setDraggingId(null);
      setDragStartPos(null);
      window.removeEventListener('pointermove', handleDragMove);
      window.removeEventListener('pointerup', handleDragUp);
      window.removeEventListener('pointercancel', handleDragUp);
    };

    window.addEventListener('pointermove', handleDragMove, { passive: true });
    window.addEventListener('pointerup', handleDragUp);
    window.addEventListener('pointercancel', handleDragUp);
  };

  const handleStartResize = (e: React.PointerEvent, source: StaticOverlaySource, corner: string) => {
    if (!isInteractive || source.locked) return;
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.stopPropagation();
    if (e.pointerType !== 'touch') {
       e.preventDefault();
    }
    onSelectSource?.(source.id);

    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = source.width || 30;
    const initialH = source.height || 20;
    const initialX = source.x || 0;
    const initialY = source.y || 0;
    
    setResizingId(source.id);
    setResizeStart({
      x: startX,
      y: startY,
      width: initialW,
      height: initialH,
      posX: initialX,
      posY: initialY,
      corner
    });

    const handleResizeMove = (moveEvent: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
      const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      let dW_raw = dx;
      let dH_raw = dy;

      if (corner === 'tl') {
        dW_raw = -dx; dH_raw = -dy;
      } else if (corner === 'tr') {
        dW_raw = dx; dH_raw = -dy;
      } else if (corner === 'bl') {
        dW_raw = -dx; dH_raw = dy;
      }

      let newW = initialW + dW_raw;
      let newH = initialH + dH_raw;

      newW = Math.max(0.1, newW);
      newH = Math.max(0.1, newH);

      if (source.keepAspectRatio !== false) {
        let aspectNum = initialW / (initialH || 1);
        if (source.aspectRatio) {
          if (typeof source.aspectRatio === 'number') {
            aspectNum = source.aspectRatio;
          } else if (typeof source.aspectRatio === 'string' && source.aspectRatio.includes(':')) {
            const [w, h] = source.aspectRatio.split(':').map(Number);
            if (!isNaN(w) && !isNaN(h) && h > 0) {
              aspectNum = w / h;
            }
          }
        }
        
        if (Math.abs(dW_raw) > Math.abs(dH_raw)) {
            newH = newW / aspectNum;
        } else {
            newW = newH * aspectNum;
        }
      }

      const dW_actual = newW - initialW;
      const dH_actual = newH - initialH;

      let newX = initialX;
      let newY = initialY;

      if (corner === 'tl') {
        newX = initialX - dW_actual / 2;
        newY = initialY - dH_actual / 2;
      } else if (corner === 'tr') {
        newX = initialX + dW_actual / 2;
        newY = initialY - dH_actual / 2;
      } else if (corner === 'bl') {
        newX = initialX - dW_actual / 2;
        newY = initialY + dH_actual / 2;
      } else if (corner === 'br') {
        newX = initialX + dW_actual / 2;
        newY = initialY + dH_actual / 2;
      }

      newW = Math.max(0.1, Math.round(newW * 10) / 10);
      newH = Math.max(0.1, Math.round(newH * 10) / 10);
      newX = Math.round(newX * 10) / 10;
      newY = Math.round(newY * 10) / 10;

      onUpdateSource?.(source.id, { width: newW, height: newH, x: newX, y: newY });
    };

    const handleResizeUp = () => {
      setResizingId(null);
      setResizeStart(null);
      window.removeEventListener('pointermove', handleResizeMove);
      window.removeEventListener('pointerup', handleResizeUp);
      window.removeEventListener('pointercancel', handleResizeUp);
    };

    window.addEventListener('pointermove', handleResizeMove, { passive: true });
    window.addEventListener('pointerup', handleResizeUp);
    window.addEventListener('pointercancel', handleResizeUp);
  };
`;

const regex = /const handlePointerDownDrag = \(\w+: React\.PointerEvent, \w+: StaticOverlaySource\) => \{[\s\S]*?(?=\n  return \(\n)/;
code = code.replace(regex, replacement.trim() + '\n\n');

fs.writeFileSync(file, code);
