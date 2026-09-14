const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/AlertOverlay.tsx');
let content = fs.readFileSync(file, 'utf8');

const oldClearBlock = `    // 3. "clear" without "!" and without target -> Clears ONLY the LAST triggered overlay!
    if (!isExclamationClear && (!target || target === 'last' || target === 'latest')) {
      const stack = activeOverlayStackRef.current;
      while (stack.length > 0) {
        const lastKey = stack.pop();
        if (!lastKey) continue;
        if (lastKey === 'alert' && activeAlert) { setActiveAlert(null); return; }
        if (lastKey === 'media' && activeMediaAlert) { setActiveMediaAlert(null); return; }
        if (lastKey.startsWith('sprite:') && concurrentSpriteAlerts.length > 0) {
          const spriteId = lastKey.replace('sprite:', '');
          setConcurrentSpriteAlerts(prev => prev.filter(s => s.id !== spriteId));
          return;
        }
        if (lastKey === 'sprites' && concurrentSpriteAlerts.length > 0) {
          setConcurrentSpriteAlerts(prev => prev.slice(0, -1));
          return;
        }
        if (lastKey === 'rain' && activeRainOverlay) { setActiveRainOverlay(null); return; }
        if (lastKey === 'smoke' && activeSmokeOverlay) { setActiveSmokeOverlay(null); return; }
        if (lastKey === 'fire' && activeFireOverlay) { setActiveFireOverlay(null); return; }
        if (lastKey === 'frame' && activeFrameOverlay) { setActiveFrameOverlay(null); return; }
        if (lastKey === 'balls' && activeBallsOverlay) { setActiveBallsOverlay(null); return; }
        if (lastKey === 'ants' && activeAntsOverlay) { setActiveAntsOverlay(null); return; }`;

const newClearBlock = `    // 3. "clear" without "!" and without target -> Clears ONLY the LAST triggered overlay!
    if (!isExclamationClear && (!target || target === 'last' || target === 'latest')) {
      const stack = activeOverlayStackRef.current;
      let popped = false;
      while (stack.length > 0 && !popped) {
        const lastKey = stack.pop();
        if (!lastKey) continue;
        
        if (lastKey === 'alert') { setActiveAlert(null); popped = true; }
        else if (lastKey === 'media') { setActiveMediaAlert(null); popped = true; }
        else if (lastKey.startsWith('sprite:')) {
          const spriteId = lastKey.replace('sprite:', '');
          setConcurrentSpriteAlerts(prev => {
            const next = prev.filter(s => s.id !== spriteId);
            if (next.length !== prev.length) popped = true;
            return next;
          });
          if (!popped) continue; 
        }
        else if (lastKey === 'sprites') {
           setConcurrentSpriteAlerts(prev => {
              if (prev.length > 0) popped = true;
              return prev.slice(0, -1);
           });
           if (!popped) continue;
        }
        else if (lastKey === 'static') { setActiveStaticAlert(null); popped = true; }
        else if (lastKey === 'rain') { setActiveRainOverlay(null); popped = true; }
        else if (lastKey === 'smoke') { setActiveSmokeOverlay(null); popped = true; }
        else if (lastKey === 'frame') { setActiveFrameOverlay(null); popped = true; }
        else if (lastKey === 'fire') { setActiveFireOverlay(null); popped = true; }
        else if (lastKey === 'iframe') { setActiveIframeOverlay(null); popped = true; }
        else if (lastKey === 'balls') { setActiveBallsOverlay(null); popped = true; }
        else if (lastKey === 'ants') { setActiveAntsOverlay(null); popped = true; }
        else if (lastKey === 'youtube') { setStickyAlert(null); popped = true; }
        else if (lastKey === 'time') { setTimeOverlay(null); popped = true; }
        else if (lastKey === 'vdo') { setActiveVdoOverlay(null); popped = true; }
        else if (lastKey === 'system') { setActiveSystemNotification(null); popped = true; }
        else if (lastKey === 'wallpaper') { setActiveWallpaper(null); popped = true; }
      }
      return;
    }`;

content = content.replace(oldClearBlock, newClearBlock);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed handleClearAlert loops');
