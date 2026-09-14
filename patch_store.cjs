const fs = require('fs');
let file = fs.readFileSync('src/utils/staticOverlayStore.ts', 'utf8');

const newSources = `,
  {
    id: 'static-source-default-info',
    name: "Live Overlay Info",
    type: 'html',
    visible: true,
    locked: false,
    x: 22,
    y: 50,
    width: 25,
    height: 35,
    zIndex: 6,
    opacity: 100,
    rotation: 0,
    scale: 1,
    keepAspectRatio: false,
    htmlContent: \`<div class="info-panel">
  <div class="header">
    <span class="dot"></span>
    OVERLAY SOURCES INFO
  </div>
  <div class="stats">
    <div class="stat-row"><span>ENGINE:</span> <span class="val">TRIGGER'D v0.135</span></div>
    <div class="stat-row"><span>STATUS:</span> <span class="val active">LIVE</span></div>
    <div class="stat-row"><span>FPS:</span> <span class="val">60</span></div>
    <div class="stat-row"><span>LATENCY:</span> <span class="val">ZERO</span></div>
    <div class="stat-row"><span>RENDER:</span> <span class="val">HARDWARE</span></div>
  </div>
  <div class="desc">
    Drag & Drop to move sources.<br/>
    Resize using corner handles.<br/>
    Right-click for properties.
  </div>
</div>\`,
    htmlCss: \`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; font-family: 'JetBrains Mono', monospace; background: transparent; }
.info-panel {
  width: 100%; height: 100%;
  background: rgba(2, 11, 24, 0.85);
  border: 1px solid rgba(0, 240, 255, 0.4);
  border-radius: 12px;
  padding: 16px;
  color: #80c8ff;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 20px rgba(0,240,255,0.1), 0 0 15px rgba(0,240,255,0.2);
  backdrop-filter: blur(4px);
}
.header {
  font-size: 14px;
  font-weight: 800;
  color: #00f0ff;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
  padding-bottom: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1px;
}
.dot {
  width: 8px; height: 8px; background: #00f0ff; border-radius: 50%;
  box-shadow: 0 0 8px #00f0ff; animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
.stats {
  display: flex; flex-direction: column; gap: 8px; font-size: 12px; flex-grow: 1;
}
.stat-row {
  display: flex; justify-content: space-between; align-items: center;
}
.val { color: #fff; font-weight: bold; }
.val.active { color: #00ff88; text-shadow: 0 0 8px #00ff88; }
.desc {
  font-size: 10px; color: rgba(128, 200, 255, 0.6); margin-top: auto; border-top: 1px dashed rgba(0,240,255,0.2); padding-top: 8px; line-height: 1.4;
}\`
  },
  {
    id: 'static-source-default-matrix-glitch',
    name: "Matrix Glitch Logo",
    type: 'html',
    visible: true,
    locked: false,
    x: 78,
    y: 50,
    width: 25,
    height: 35,
    zIndex: 6,
    opacity: 100,
    rotation: 0,
    scale: 1,
    keepAspectRatio: false,
    htmlContent: \`<div class="container">
  <canvas id="matrix-canvas"></canvas>
  <div class="crt-scanlines"></div>
  <div class="static-noise"></div>
  <div class="logo-wrapper glitch" data-text="⚡">
    <svg viewBox="0 0 100 100" class="bolt">
      <defs>
        <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" />
          <stop offset="100%" stop-color="#0055aa" />
        </linearGradient>
      </defs>
      <path d="M56 4 L22 52 H46 L34 96 L78 48 H54 L66 4 Z" fill="url(#bolt-grad)" stroke="#00f0ff" stroke-width="2" />
    </svg>
  </div>
</div>\`,
    htmlCss: \`* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: transparent; }
.container {
  position: relative; width: 100%; height: 100%;
  background: #000;
  border: 2px solid #00f0ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,240,255,0.5);
  animation: pulse-bloom 2s infinite alternate;
}
@keyframes pulse-bloom {
  0% { box-shadow: 0 0 10px rgba(0,240,255,0.4); }
  100% { box-shadow: 0 0 30px rgba(0,240,255,0.8), inset 0 0 15px rgba(0,240,255,0.5); }
}
canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; opacity: 0.7; }
.crt-scanlines {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 4px, 3px 100%;
}
.static-noise {
  position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
.logo-wrapper {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 4;
  width: 60%; height: 60%;
  animation: heartbeat 1.5s ease-in-out infinite;
}
.bolt { width: 100%; height: 100%; filter: drop-shadow(0 0 10px #00f0ff); }

.glitch { position: relative; }
.glitch::before, .glitch::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M56 4 L22 52 H46 L34 96 L78 48 H54 L66 4 Z" fill="%2300f0ff" /></svg>');
  background-size: contain; background-repeat: no-repeat; background-position: center;
  opacity: 0.5; z-index: -1;
}
.glitch::before {
  left: 2px; text-shadow: -2px 0 red;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}
.glitch::after {
  left: -2px; text-shadow: -2px 0 blue;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}
@keyframes heartbeat {
  0%, 100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
  15% { transform: translate(-50%, -50%) scale(1.1); filter: brightness(1.3); }
  30% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
  45% { transform: translate(-50%, -50%) scale(1.1); filter: brightness(1.3); }
}
@keyframes glitch-anim {
  0% { clip: rect(31px, 9999px, 96px, 0); transform: translate(0); }
  5% { clip: rect(70px, 9999px, 11px, 0); transform: translate(-2px, 2px); }
  10% { clip: rect(29px, 9999px, 83px, 0); transform: translate(2px, -2px); }
  15% { clip: rect(10px, 9999px, 40px, 0); transform: translate(-2px, 2px); }
  20% { clip: rect(80px, 9999px, 20px, 0); transform: translate(0); }
  100% { clip: rect(80px, 9999px, 20px, 0); transform: translate(0); }
}
@keyframes glitch-anim2 {
  0% { clip: rect(20px, 9999px, 90px, 0); transform: translate(0); }
  5% { clip: rect(10px, 9999px, 30px, 0); transform: translate(2px, -2px); }
  10% { clip: rect(50px, 9999px, 100px, 0); transform: translate(-2px, 2px); }
  15% { clip: rect(90px, 9999px, 20px, 0); transform: translate(2px, -2px); }
  20% { clip: rect(40px, 9999px, 60px, 0); transform: translate(0); }
  100% { clip: rect(40px, 9999px, 60px, 0); transform: translate(0); }
}\`,
    htmlJs: \`const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resize);
resize();
const chars = '0123456789ABCDEF⚡アイウエオカキクケコ';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = [];
for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00f0ff';
  ctx.font = fontSize + 'px monospace';
  
  const currentCols = Math.floor(canvas.width / fontSize);
  if (currentCols !== columns) {
    columns = currentCols;
    drops = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;
  }

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(draw, 33);\`
  }`;

file = file.replace(
  `    htmlCss: \\\`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@800;900&display=swap');\\\`
  }`,
  `    htmlCss: \\\`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@800;900&display=swap');\\\`
  }${newSources}`
);

// We should also make sure they are appended if user already has data in localStorage.
// Let's modify the getStoredStaticSources logic so they are pushed to localStorage if missing.
file = file.replace(
  `        const hasFrame = parsed.some((s: StaticOverlaySource) => s.id === 'static-source-default-blue-electrical-frame' || s.name?.includes('Electrical Pulse Frame'));
        if (!hasFrame) {
          const merged = [defaultStaticOverlaySources[0], ...parsed];
          localStorage.setItem(STATIC_SOURCES_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }`,
  `        const hasInfo = parsed.some((s: StaticOverlaySource) => s.id === 'static-source-default-info');
        const hasMatrix = parsed.some((s: StaticOverlaySource) => s.id === 'static-source-default-matrix-glitch');
        let needsUpdate = false;
        const toAdd = [];
        const hasFrame = parsed.some((s: StaticOverlaySource) => s.id === 'static-source-default-blue-electrical-frame' || s.name?.includes('Electrical Pulse Frame'));
        if (!hasFrame) toAdd.push(defaultStaticOverlaySources[0]);
        if (!hasInfo) {
           const info = defaultStaticOverlaySources.find(s => s.id === 'static-source-default-info');
           if (info) toAdd.push(info);
        }
        if (!hasMatrix) {
           const matrix = defaultStaticOverlaySources.find(s => s.id === 'static-source-default-matrix-glitch');
           if (matrix) toAdd.push(matrix);
        }
        
        if (toAdd.length > 0) {
          const merged = [...toAdd, ...parsed];
          localStorage.setItem(STATIC_SOURCES_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }`
);

fs.writeFileSync('src/utils/staticOverlayStore.ts', file);
