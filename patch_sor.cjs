const fs = require('fs');
let code = fs.readFileSync('src/components/StaticOverlayRenderer.tsx', 'utf8');

// Update handleStartResize to accept a corner parameter
const handleStartResizeOrig = `const handleStartResize = (e: React.PointerEvent, source: StaticOverlaySource) => {`;
const handleStartResizeNew = `const handleStartResize = (e: React.PointerEvent, source: StaticOverlaySource, corner: 'tl'|'tr'|'bl'|'br' = 'br') => {`;

code = code.replace(handleStartResizeOrig, handleStartResizeNew);

// In handleStartResize, we need to save the initial X, Y, W, H and position
const resizeStartRegex = /setResizeStart\(\{[\s\S]*?height: initialH\s*\}\);/;
const resizeStartNew = `setResizeStart({
      x: startX,
      y: startY,
      width: initialW,
      height: initialH,
      posX: source.x || 0,
      posY: source.y || 0,
      corner
    });`;

code = code.replace(resizeStartRegex, resizeStartNew);

// Add posX, posY, corner to the state type
const stateTypeRegex = /const \[resizeStart, setResizeStart\] = useState<\{ x: number; y: number; width: number; height: number \} \| null>\(null\);/;
const stateTypeNew = `const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number; posX?: number; posY?: number; corner?: string } | null>(null);`;
code = code.replace(stateTypeRegex, stateTypeNew);

// In handleResizeMove:
const moveLogicOrig = `const deltaX = (moveEvent.clientX - startX) / (containerRect.width / 100);
      const deltaY = (moveEvent.clientY - startY) / (containerRect.height / 100);
      
      const newW = Math.max(2, Math.min(100, initialW + deltaX));
      const newH = Math.max(2, Math.min(100, initialH + deltaY));
      
      onUpdateSource(source.id, { width: newW, height: newH });`;

const moveLogicNew = `const deltaX = (moveEvent.clientX - startX) / (containerRect.width / 100);
      const deltaY = (moveEvent.clientY - startY) / (containerRect.height / 100);
      
      let newW = initialW;
      let newH = initialH;
      let newX = source.x || 0;
      let newY = source.y || 0;

      if (corner === 'br') {
        newW = Math.max(2, Math.min(100, initialW + deltaX));
        newH = Math.max(2, Math.min(100, initialH + deltaY));
      } else if (corner === 'bl') {
        newW = Math.max(2, Math.min(100, initialW - deltaX));
        newH = Math.max(2, Math.min(100, initialH + deltaY));
        newX = (source.x || 0) + deltaX;
      } else if (corner === 'tr') {
        newW = Math.max(2, Math.min(100, initialW + deltaX));
        newH = Math.max(2, Math.min(100, initialH - deltaY));
        newY = (source.y || 0) + deltaY;
      } else if (corner === 'tl') {
        newW = Math.max(2, Math.min(100, initialW - deltaX));
        newH = Math.max(2, Math.min(100, initialH - deltaY));
        newX = (source.x || 0) + deltaX;
        newY = (source.y || 0) + deltaY;
      }
      
      onUpdateSource(source.id, { width: newW, height: newH, x: newX, y: newY });`;

code = code.replace(moveLogicOrig, moveLogicNew);

// Replace the single grip handle with 4 handles
const gripOrig = /\{\/\* Resize Grip Handle on bottom-right corner when selected and unlocked \*\/\}[\s\S]*?<\/div>\s*\)\}/;

const gripNew = `{/* Resize Grip Handles on all corners when selected and unlocked */}
            {isInteractive && isSelected && !source.locked && (
              <>
                {/* Top Left */}
                <div
                  onPointerDown={(e) => handleStartResize(e, source, 'tl')}
                  className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#00f0ff] border border-black rounded-full cursor-nwse-resize shadow-lg hover:scale-150 transition-transform z-[1001]"
                  title="Resize from top-left"
                />
                {/* Top Right */}
                <div
                  onPointerDown={(e) => handleStartResize(e, source, 'tr')}
                  className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00f0ff] border border-black rounded-full cursor-nesw-resize shadow-lg hover:scale-150 transition-transform z-[1001]"
                  title="Resize from top-right"
                />
                {/* Bottom Left */}
                <div
                  onPointerDown={(e) => handleStartResize(e, source, 'bl')}
                  className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00f0ff] border border-black rounded-full cursor-nesw-resize shadow-lg hover:scale-150 transition-transform z-[1001]"
                  title="Resize from bottom-left"
                />
                {/* Bottom Right */}
                <div
                  onPointerDown={(e) => handleStartResize(e, source, 'br')}
                  className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#00f0ff] border border-black rounded-full cursor-nwse-resize shadow-lg hover:scale-150 transition-transform z-[1001]"
                  title="Resize from bottom-right"
                />
              </>
            )}`;

code = code.replace(gripOrig, gripNew);

fs.writeFileSync('src/components/StaticOverlayRenderer.tsx', code);
console.log("Updated StaticOverlayRenderer.");
