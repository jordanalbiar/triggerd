const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

const oldClearBlock = `    if (alert.type === 'clear' || alert.command?.toLowerCase().includes('clear') || (alert.message && alert.message.toLowerCase().startsWith('clear')) || (alert.message && alert.message.toLowerCase().startsWith('!clear'))) {
      const rawTarget = alert.targetOverlay || 
        (alert.message ? alert.message.replace(/^(?:clear!|!clear|clear)\\s*/i, '') : '') ||
        (alert.customMessage ? alert.customMessage.replace(/^🧹\\s*cleared\\s*overlay:\\s*/i, '') : '');
      
      const target = rawTarget.toLowerCase().replace(/!/g, '').trim();

      if (!target || target === 'all' || target === 'overlays') {
        setPreviewAlert(null);
        setPreviewMediaAlert(null);
        setConcurrentPreviewSpriteAlerts([]);
        setPreviewStaticAlert(null);
        setPreviewWallpaper(null);
        setPreviewRainOverlay(null);
        setPreviewSmokeOverlay(null);
        setPreviewFrameOverlay(null);
        setPreviewFireOverlay(null);
        setPreviewIframeOverlay(null);
        setPreviewBallsOverlay(null);
        setPreviewStickyAlert(null);
        setPreviewTimeOverlay(null);
        setPreviewVdoOverlay(null);
        setPreviewSystemNotification(null);
      } else {
        if (['vdo', 'ninja'].some(t => target.includes(t) || t.includes(target))) setPreviewVdoOverlay(null);
        if (['system', 'notification', 'alert'].some(t => target.includes(t) || t.includes(target))) setPreviewSystemNotification(null);
        if (['time', 'clock'].some(t => target.includes(t) || t.includes(target))) setPreviewTimeOverlay(null);
        if (['iframe', 'web', 'site', 'local'].some(t => target.includes(t) || t.includes(target))) setPreviewIframeOverlay(null);
        if (['youtube', 'yt', 'media', 'video'].some(t => target.includes(t) || t.includes(target))) setPreviewStickyAlert(null);
        if (['gif', 'redgif', 'pornhub', 'boobies'].some(t => target.includes(t) || t.includes(target))) setPreviewMediaAlert(null);
        if (['smoke'].some(t => target.includes(t) || t.includes(target))) setPreviewSmokeOverlay(null);
        if (['frame'].some(t => target.includes(t) || t.includes(target))) setPreviewFrameOverlay(null);
        if (['fire'].some(t => target.includes(t) || t.includes(target))) setPreviewFireOverlay(null);
        if (['balls', 'ball'].some(t => target.includes(t) || t.includes(target))) setPreviewBallsOverlay(null);
        if (['rain', 'snow', 'weather', 'raindrop'].some(t => target.includes(t) || t.includes(target))) setPreviewRainOverlay(null);
        if (['wallpaper', 'screensaver', 'matrix', 'halo', 'greenscreen'].some(t => target.includes(t) || t.includes(target))) setPreviewWallpaper(null);
        if (['lol', 'ugh', 'cheers', 'sprites'].some(t => target.includes(t) || t.includes(target))) setConcurrentPreviewSpriteAlerts([]);
        setPreviewStaticAlert(prev => {
          if (!prev) return null;
          const prevCmd = (prev.spriteStyle || prev.type || prev.command || prev.message || '').toLowerCase();
          if (prevCmd.includes(target) || target.includes(prevCmd)) return null;
          return prev;
        });
        setPreviewAlert(prev => {
          if (!prev) return null;
          const prevCmd = (prev.spriteStyle || prev.type || prev.command || prev.message || '').toLowerCase();
          if (prevCmd.includes(target) || target.includes(prevCmd)) return null;
          return prev;
        });
      }
      return;
    }`;

const newClearBlock = `    if (alert.type === 'clear' || alert.command?.toLowerCase().includes('clear') || (alert.message && alert.message.toLowerCase().startsWith('clear')) || (alert.message && alert.message.toLowerCase().startsWith('!clear'))) {
      const fullCmd = (alert.command || alert.message || alert.type || '').toLowerCase();
      const rawTarget = alert.targetOverlay || 
        (alert.message ? alert.message.replace(/^(?:clear!|!clear|clear)\\s*/i, '') : '') ||
        (alert.customMessage ? alert.customMessage.replace(/^🧹\\s*cleared\\s*overlay:\\s*/i, '') : '');
      
      const target = rawTarget.toLowerCase().replace(/!/g, '').trim();
      const isExclamationClear = fullCmd.includes('clear!') || fullCmd.includes('!clear');
      const isClearAll = target === 'all' || target === 'overlays' || isExclamationClear;

      if (isClearAll) {
        setPreviewAlert(null);
        setPreviewMediaAlert(null);
        setConcurrentPreviewSpriteAlerts([]);
        setPreviewStaticAlert(null);
        setPreviewWallpaper(null);
        setPreviewRainOverlay(null);
        setPreviewSmokeOverlay(null);
        setPreviewFrameOverlay(null);
        setPreviewFireOverlay(null);
        setPreviewIframeOverlay(null);
        setPreviewBallsOverlay(null);
        setPreviewStickyAlert(null);
        setPreviewTimeOverlay(null);
        setPreviewVdoOverlay(null);
        setPreviewSystemNotification(null);
        activePreviewStackRef.current = [];
      } else if (!target || target === 'last' || target === 'latest') {
        const stack = activePreviewStackRef.current;
        let popped = false;
        while (stack.length > 0 && !popped) {
          const lastKey = stack.pop();
          if (!lastKey) continue;
          
          if (lastKey === 'alert') { setPreviewAlert(null); popped = true; }
          else if (lastKey === 'media') { setPreviewMediaAlert(null); popped = true; }
          else if (lastKey.startsWith('sprite:')) {
            const spriteId = lastKey.replace('sprite:', '');
            setConcurrentPreviewSpriteAlerts(prev => {
              const next = prev.filter(s => s.id !== spriteId);
              if (next.length !== prev.length) popped = true;
              return next;
            });
            if (!popped) continue; // if it wasn't there, keep going
          }
          else if (lastKey === 'static') { setPreviewStaticAlert(null); popped = true; }
          else if (lastKey === 'rain') { setPreviewRainOverlay(null); popped = true; }
          else if (lastKey === 'smoke') { setPreviewSmokeOverlay(null); popped = true; }
          else if (lastKey === 'frame') { setPreviewFrameOverlay(null); popped = true; }
          else if (lastKey === 'fire') { setPreviewFireOverlay(null); popped = true; }
          else if (lastKey === 'iframe') { setPreviewIframeOverlay(null); popped = true; }
          else if (lastKey === 'balls') { setPreviewBallsOverlay(null); popped = true; }
          else if (lastKey === 'youtube') { setPreviewStickyAlert(null); popped = true; }
          else if (lastKey === 'time') { setPreviewTimeOverlay(null); popped = true; }
          else if (lastKey === 'vdo') { setPreviewVdoOverlay(null); popped = true; }
          else if (lastKey === 'system') { setPreviewSystemNotification(null); popped = true; }
          else if (lastKey === 'wallpaper') { setPreviewWallpaper(null); popped = true; }
        }
      } else {
        if (['vdo', 'ninja'].some(t => target.includes(t) || t.includes(target))) setPreviewVdoOverlay(null);
        if (['system', 'notification', 'alert'].some(t => target.includes(t) || t.includes(target))) setPreviewSystemNotification(null);
        if (['time', 'clock'].some(t => target.includes(t) || t.includes(target))) setPreviewTimeOverlay(null);
        if (['iframe', 'web', 'site', 'local'].some(t => target.includes(t) || t.includes(target))) setPreviewIframeOverlay(null);
        if (['youtube', 'yt', 'media', 'video'].some(t => target.includes(t) || t.includes(target))) setPreviewStickyAlert(null);
        if (['gif', 'redgif', 'pornhub', 'boobies'].some(t => target.includes(t) || t.includes(target))) setPreviewMediaAlert(null);
        if (['smoke'].some(t => target.includes(t) || t.includes(target))) setPreviewSmokeOverlay(null);
        if (['frame'].some(t => target.includes(t) || t.includes(target))) setPreviewFrameOverlay(null);
        if (['fire'].some(t => target.includes(t) || t.includes(target))) setPreviewFireOverlay(null);
        if (['balls', 'ball'].some(t => target.includes(t) || t.includes(target))) setPreviewBallsOverlay(null);
        if (['rain', 'snow', 'weather', 'raindrop'].some(t => target.includes(t) || t.includes(target))) setPreviewRainOverlay(null);
        if (['wallpaper', 'screensaver', 'matrix', 'halo', 'greenscreen'].some(t => target.includes(t) || t.includes(target))) setPreviewWallpaper(null);
        if (['lol', 'ugh', 'cheers', 'sprites'].some(t => target.includes(t) || t.includes(target))) setConcurrentPreviewSpriteAlerts([]);
        setPreviewStaticAlert(prev => {
          if (!prev) return null;
          const prevCmd = (prev.spriteStyle || prev.type || prev.command || prev.message || '').toLowerCase();
          if (prevCmd.includes(target) || target.includes(prevCmd)) return null;
          return prev;
        });
        setPreviewAlert(prev => {
          if (!prev) return null;
          const prevCmd = (prev.spriteStyle || prev.type || prev.command || prev.message || '').toLowerCase();
          if (prevCmd.includes(target) || target.includes(prevCmd)) return null;
          return prev;
        });
      }
      return;
    }`;

content = content.replace(oldClearBlock, newClearBlock);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Dashboard clear logic');
