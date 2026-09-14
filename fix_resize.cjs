const fs = require('fs');
let code = fs.readFileSync('src/components/StaticOverlayRenderer.tsx', 'utf8');

const regex = /const deltaW = \(\(moveEvent\.clientX - startX\) \/ rect\.width\) \* 100;[\s\S]*?onUpdateSource\?\.\(source\.id, \{ width: newW, height: newH \}\);/g;

const match = code.match(regex);
if (match) {
  const replacement = `const deltaW = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaH = ((moveEvent.clientY - startY) / rect.height) * 100;
      
      let newW = initialW;
      let newH = initialH;
      let newX = source.x || 0;
      let newY = source.y || 0;

      let tempDeltaW = deltaW;
      let tempDeltaH = deltaH;

      if (corner === 'tl') {
        tempDeltaW = -deltaW;
        tempDeltaH = -deltaH;
      } else if (corner === 'tr') {
        tempDeltaW = deltaW;
        tempDeltaH = -deltaH;
      } else if (corner === 'bl') {
        tempDeltaW = -deltaW;
        tempDeltaH = deltaH;
      }

      newW = Math.max(0.1, Math.round((initialW + tempDeltaW) * 10) / 10);
      newH = Math.max(0.1, Math.round((initialH + tempDeltaH) * 10) / 10);

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
        
        // If we move mostly horizontally, adjust height, else adjust width
        if (Math.abs(tempDeltaW) > Math.abs(tempDeltaH)) {
            newH = Math.round((newW / aspectNum) * 10) / 10;
        } else {
            newW = Math.round((newH * aspectNum) * 10) / 10;
        }
      }

      // Update positions based on corner
      if (corner === 'tl') {
        newX = (source.x || 0) + (initialW - newW);
        newY = (source.y || 0) + (initialH - newH);
      } else if (corner === 'tr') {
        newY = (source.y || 0) + (initialH - newH);
      } else if (corner === 'bl') {
        newX = (source.x || 0) + (initialW - newW);
      }

      onUpdateSource?.(source.id, { width: newW, height: newH, x: newX, y: newY });`;
      
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/StaticOverlayRenderer.tsx', code);
  console.log('Fixed resize logic.');
} else {
  console.log('Failed to find resize logic.');
}
