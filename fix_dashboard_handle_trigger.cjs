const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

const oldHandleBlock = `    if (rawMsg === 'clear!' || rawMsg === '!clear' || rawMsg.startsWith('clear!') || rawMsg.startsWith('!clear!') || rawMsg.startsWith('clear ') || rawMsg.startsWith('!clear ') || rawMsg === 'clear' || rawMsg === '!clear') {
      const clearMatch = rawMsg.match(/^(?:clear!|!clear|clear)\\s*(.*)$/i);
      const target = clearMatch && clearMatch[1] ? clearMatch[1].trim().replace(/!/g, '') : '';
      if (target === 'all' || target === 'overlays' || rawMsg === 'clear all') {
        setPreviewAlert(null);
        setPreviewMediaAlert(null);
        setConcurrentPreviewSpriteAlerts([]);
        setPreviewStaticAlert(null);
        setPreviewWallpaper(null);
        setPreviewSmokeOverlay(null);
        setPreviewStickyAlert(null);
        setPreviewTimeOverlay(null);
      } else if (!target || target === 'last' || target === 'latest') {
        // clear without target -> clears last preview overlay
        if (previewAlert) { setPreviewAlert(null); }
        else if (previewMediaAlert) { setPreviewMediaAlert(null); }
        else if (concurrentPreviewSpriteAlerts.length > 0) { setConcurrentPreviewSpriteAlerts(prev => prev.slice(0, -1)); }
        else if (previewStickyAlert) { setPreviewStickyAlert(null); }
        else if (previewStaticAlert) { setPreviewStaticAlert(null); }
        else if (previewSmokeOverlay) { setPreviewSmokeOverlay(null); }
        else if (previewWallpaper) { setPreviewWallpaper(null); }
        else if (previewTimeOverlay) { setPreviewTimeOverlay(null); }
      } else {
        if (['time', 'clock'].some(t => target.includes(t) || t.includes(target))) setPreviewTimeOverlay(null);
        if (['youtube', 'yt', 'media', 'video'].some(t => target.includes(t) || t.includes(target))) setPreviewStickyAlert(null);
        if (['gif', 'redgif', 'pornhub', 'boobies'].some(t => target.includes(t) || t.includes(target))) setPreviewMediaAlert(null);
        if (['smoke'].some(t => target.includes(t) || t.includes(target))) setPreviewSmokeOverlay(null);
        if (['wallpaper', 'screensaver', 'matrix', 'snow', 'rain', 'halo', 'greenscreen'].some(t => target.includes(t) || t.includes(target))) setPreviewWallpaper(null);
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
    }`;

const newHandleBlock = `    if (rawMsg === 'clear!' || rawMsg === '!clear' || rawMsg.startsWith('clear!') || rawMsg.startsWith('!clear!') || rawMsg.startsWith('clear ') || rawMsg.startsWith('!clear ') || rawMsg === 'clear' || rawMsg === '!clear') {
      const clearMatch = rawMsg.match(/^(?:clear!|!clear|clear)\\s*(.*)$/i);
      const target = clearMatch && clearMatch[1] ? clearMatch[1].trim().replace(/!/g, '') : '';
      const isExclamationClear = rawMsg.includes('clear!') || rawMsg.includes('!clear');
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
    }`;

content = content.replace(oldHandleBlock, newHandleBlock);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed handleTriggerMessage clear');
