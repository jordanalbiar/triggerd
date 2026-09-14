const fs = require('fs');

const starsContent = fs.readFileSync('stars.txt', 'utf8').trim();
let file = fs.readFileSync('src/components/VisualCanvasTriggerBuilder.tsx', 'utf8');

const oldContentRegex = /content: '<div style="position:absolute;top:30%;left:62%;font-size:25px;">⭐<\/div>.*?'/g;
file = file.replace(oldContentRegex, `content: '${starsContent}'`);

file = file.replace(
  /{ id: 'kf-stars-1', frameIndex: 0, timeSec: 0, x: 150, y: 50, scale: 1\.0, rotation: 0, opacity: 1, intensity: 50 },/g,
  `{ id: 'kf-stars-1', frameIndex: 0, timeSec: 0, x: 250, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },`
);

file = file.replace(
  /{ id: 'kf-stars-2', frameIndex: 1, timeSec: 5\.0, x: -150, y: 50, scale: 1\.0, rotation: 0, opacity: 1, intensity: 50 },/g,
  `{ id: 'kf-stars-2', frameIndex: 1, timeSec: 5.0, x: -350, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },`
);

file = file.replace(
  /{ id: 'kf-stars-3', frameIndex: 2, timeSec: 5\.1, x: -150, y: 50, scale: 1\.0, rotation: 0, opacity: 0, intensity: 50 },/g,
  `{ id: 'kf-stars-3', frameIndex: 2, timeSec: 5.1, x: -350, y: 50, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 },`
);

fs.writeFileSync('src/components/VisualCanvasTriggerBuilder.tsx', file);
