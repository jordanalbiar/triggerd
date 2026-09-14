const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// The best way to push to the stack is right before we set the preview state.
// System Notification
content = content.replace(
  "setPreviewSystemNotification(alert);",
  "activePreviewStackRef.current.push('system');\n      setPreviewSystemNotification(alert);"
);

// Wallpaper
content = content.replace(
  "setPreviewWallpaper(alert);",
  "activePreviewStackRef.current.push('wallpaper');\n      setPreviewWallpaper(alert);"
);

// Iframe
content = content.replace(
  "setPreviewIframeOverlay(alertToRender);",
  "activePreviewStackRef.current.push('iframe');\n        setPreviewIframeOverlay(alertToRender);"
);

// Rain
content = content.replace(
  "setPreviewRainOverlay({",
  "activePreviewStackRef.current.push('rain');\n      setPreviewRainOverlay({"
);

// Weather
content = content.replace(
  "setPreviewWeatherOverlay({",
  "activePreviewStackRef.current.push('weather');\n      setPreviewWeatherOverlay({"
);

// Smoke
content = content.replace(
  "setPreviewSmokeOverlay({",
  "activePreviewStackRef.current.push('smoke');\n      setPreviewSmokeOverlay({"
);

// Frame
content = content.replace(
  "setPreviewFrameOverlay({",
  "activePreviewStackRef.current.push('frame');\n      setPreviewFrameOverlay({"
);

// Fire
content = content.replace(
  "setPreviewFireOverlay({",
  "activePreviewStackRef.current.push('fire');\n      setPreviewFireOverlay({"
);

// Balls
content = content.replace(
  "setPreviewBallsOverlay({",
  "activePreviewStackRef.current.push('balls');\n      setPreviewBallsOverlay({"
);

// Time
content = content.replace(
  "setPreviewTimeOverlay(alert);",
  "activePreviewStackRef.current.push('time');\n      setPreviewTimeOverlay(alert);"
);

// VDO
content = content.replace(
  "setPreviewVdoOverlay({",
  "activePreviewStackRef.current.push('vdo');\n      setPreviewVdoOverlay({"
);

// Sticky / YouTube
content = content.replace(
  "setPreviewStickyAlert(alert);",
  "activePreviewStackRef.current.push('youtube');\n      setPreviewStickyAlert(alert);"
);

// Media (gif, etc)
content = content.replace(
  "setPreviewMediaAlert(alertToPlay);",
  "activePreviewStackRef.current.push('media');\n      setPreviewMediaAlert(alertToPlay);"
);

// Static (general)
content = content.replace(
  "setPreviewStaticAlert({",
  "activePreviewStackRef.current.push('static');\n      setPreviewStaticAlert({"
);

// Alert (general non-static)
content = content.replace(
  "setPreviewAlert({",
  "activePreviewStackRef.current.push('alert');\n      setPreviewAlert({"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Added pushes to Dashboard');
