const fs = require('fs');
let code = fs.readFileSync('src/components/StaticOverlayRenderer.tsx', 'utf8');

const resizeStartRegex = /const startX = e\.clientX;[\s\S]*?corner\s*\}\);/g;
const replacementStart = `const startX = e.clientX;
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
    });`;

code = code.replace(resizeStartRegex, replacementStart);

const resizeMoveRegex = /const deltaW = \(\(moveEvent\.clientX - startX\) \/ rect\.width\) \* 100;[\s\S]*?onUpdateSource\?\.\(source\.id, \{ width: newW, height: newH, x: newX, y: newY \}\);/g;

const replacementMove = `const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
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

      // Keep aspect ratio constraint
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

      newW = Math.round(newW * 10) / 10;
      newH = Math.round(newH * 10) / 10;
      newX = Math.round(newX * 10) / 10;
      newY = Math.round(newY * 10) / 10;

      onUpdateSource?.(source.id, { width: newW, height: newH, x: newX, y: newY });`;

code = code.replace(resizeMoveRegex, replacementMove);

fs.writeFileSync('src/components/StaticOverlayRenderer.tsx', code);
console.log('Fixed resize math.');
