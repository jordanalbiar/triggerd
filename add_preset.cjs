const fs = require('fs');

const infernoCmd = `  {
    id: 'cmd-inferno',
    command: 'fire',
    spriteStyle: 'custom',
    displayName: 'Inferno Metal Frame',
    description: 'A 20% height bottom frame that looks like glowing red-hot metal. Includes animated CSS flames inside the frame and a dynamic HTML5 canvas ember particle effect flying up across the screen.',
    category: 'gaming',
    color: '#ff4500',
    soundEnabled: true,
    duration: 10,
    scale: 1.0,
    cooldown: 5,
    isStatic: false,
    animationStyle: 'none',
    animationSpeed: 1,
    permission: 'everyone',
    permissionMode: 'all',
    whitelistUsers: '',
    blacklistUsers: '',
    customHtml: \`<div class="inferno-wrapper">\\n  <canvas class="ember-canvas"></canvas>\\n  <div class="metal-frame">\\n    <div class="css-fire-pit">\\n      <div class="flame f1"></div>\\n      <div class="flame f2"></div>\\n      <div class="flame f3"></div>\\n      <div class="flame f4"></div>\\n      <div class="flame f5"></div>\\n      <div class="flame f6"></div>\\n      <div class="flame f7"></div>\\n      <div class="flame f8"></div>\\n    </div>\\n    <div class="inferno-text">\\n      <div class="inferno-title">{user} SPARKED THE FLAME</div>\\n      <div class="inferno-msg">"{message}"</div>\\n    </div>\\n  </div>\\n</div>\`,
    customCss: \`.inferno-wrapper { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 1000; } .ember-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1002; } .metal-frame { position: absolute; bottom: 0; left: 0; width: 100%; height: 20vh; background: linear-gradient(to top, rgba(30, 5, 0, 0.95), rgba(60, 10, 0, 0.7)); border-top: 6px solid #ff2a00; box-shadow: 0 -10px 40px rgba(255, 42, 0, 0.8), inset 0 10px 40px rgba(255, 42, 0, 0.6); animation: metalGlow 2s infinite alternate ease-in-out; overflow: hidden; z-index: 1001; display: flex; flex-direction: column; justify-content: center; align-items: center; } @keyframes metalGlow { 0% { border-top-color: #ff2a00; box-shadow: 0 -10px 30px rgba(255, 42, 0, 0.7), inset 0 10px 30px rgba(255, 42, 0, 0.6); background: linear-gradient(to top, rgba(30, 5, 0, 0.95), rgba(60, 10, 0, 0.7)); } 100% { border-top-color: #ffaa00; box-shadow: 0 -20px 60px rgba(255, 170, 0, 1), inset 0 20px 60px rgba(255, 170, 0, 0.9); background: linear-gradient(to top, rgba(50, 10, 0, 0.95), rgba(100, 20, 0, 0.8)); } } .css-fire-pit { position: absolute; bottom: -30px; left: -5%; width: 110%; height: 180%; display: flex; justify-content: space-around; align-items: flex-end; z-index: 1; opacity: 0.85; pointer-events: none; filter: blur(6px) contrast(1.2); } .flame { width: 15vw; height: 15vw; background: #ff4500; border-radius: 50% 0 50% 50%; transform: rotate(-45deg); animation: flameBurn 0.8s infinite alternate ease-in-out; mix-blend-mode: screen; } .flame:nth-child(even) { background: #ff8c00; width: 18vw; height: 18vw; animation-duration: 1.1s; animation-delay: 0.2s; } .flame:nth-child(3n) { background: #ff0000; width: 12vw; height: 12vw; animation-duration: 0.9s; animation-delay: 0.5s; } .flame:nth-child(4n) { background: #ffd700; width: 20vw; height: 20vw; animation-duration: 1.3s; animation-delay: 0.1s; } @keyframes flameBurn { 0% { transform: rotate(-45deg) scale(0.9) translateY(15%); opacity: 0.7; } 100% { transform: rotate(-45deg) scale(1.15) translateY(-5%); opacity: 1; } } .inferno-text { position: relative; z-index: 2; text-align: center; color: #ffffff; font-family: 'Arial Black', Impact, sans-serif; text-transform: uppercase; text-shadow: 0 4px 15px rgba(0,0,0,0.9), 0 0 20px #ff0000, 0 0 40px #ff8c00; animation: textPulse 2s infinite alternate; } .inferno-title { font-size: 38px; letter-spacing: 3px; margin-bottom: 5px; color: #ffebcc; } .inferno-msg { font-size: 24px; color: #ffb380; } @keyframes textPulse { 0% { transform: scale(1); } 100% { transform: scale(1.03); } }\`,
    customJs: \`const cvs = container.querySelector('.ember-canvas');\\nif (cvs) {\\n  const ctx = cvs.getContext('2d');\\n  let w = cvs.width = window.innerWidth;\\n  let h = cvs.height = window.innerHeight;\\n  const embers = [];\\n  \\n  class Ember {\\n    constructor() {\\n      this.x = Math.random() * w;\\n      // Spawn in the bottom 20vh area\\n      this.y = h - (Math.random() * (h * 0.2));\\n      this.size = Math.random() * 4 + 1.5;\\n      this.speedY = Math.random() * -4 - 1.5;\\n      this.speedX = (Math.random() - 0.5) * 3;\\n      this.life = 1;\\n      this.decay = Math.random() * 0.015 + 0.005;\\n      const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ff2a00'];\\n      this.color = colors[Math.floor(Math.random() * colors.length)];\\n    }\\n    update() {\\n      this.y += this.speedY;\\n      // Add a slight wavering effect as it rises\\n      this.x += this.speedX + Math.sin(this.y * 0.03) * 1.5;\\n      this.life -= this.decay;\\n    }\\n    draw() {\\n      ctx.beginPath();\\n      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\\n      ctx.fillStyle = this.color;\\n      ctx.globalAlpha = Math.max(0, this.life);\\n      ctx.shadowBlur = 12;\\n      ctx.shadowColor = this.color;\\n      ctx.fill();\\n      ctx.globalAlpha = 1;\\n      ctx.shadowBlur = 0;\\n    }\\n  }\\n  \\n  function animate() {\\n    ctx.clearRect(0, 0, w, h);\\n    \\n    // Constantly spark new embers\\n    if (Math.random() < 0.6) embers.push(new Ember());\\n    \\n    for (let i = embers.length - 1; i >= 0; i--) {\\n      embers[i].update();\\n      embers[i].draw();\\n      if (embers[i].life <= 0 || embers[i].y < 0) {\\n        embers.splice(i, 1);\\n      }\\n    }\\n    \\n    if (container.isConnected) {\\n      requestAnimationFrame(animate);\\n    }\\n  }\\n  animate();\\n  \\n  // Handle window resizing seamlessly\\n  window.addEventListener('resize', () => {\\n    w = cvs.width = window.innerWidth;\\n    h = cvs.height = window.innerHeight;\\n  });\\n}\`
  },`;

function addPreset(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/export const DEFAULT_COMMANDS: CommandConfig\[\] = \[/, `export const DEFAULT_COMMANDS: CommandConfig[] = [\n${infernoCmd}`);
  fs.writeFileSync(file, content);
}

function addPresetServer(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const DEFAULT_COMMANDS = \[/, `const DEFAULT_COMMANDS = [\n${infernoCmd}`);
  fs.writeFileSync(file, content);
}

addPreset('src/types.ts');
addPresetServer('server.ts');
