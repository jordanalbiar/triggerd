import re
import json

with open("src/types.ts", "r") as f:
    content = f.read()

new_commands = """  {
    id: 'cmd-flutterbyes',
    command: 'flutterbyes',
    displayName: 'Interactive Butterflies Effect',
    description: '3D interactive butterflies swarm animated via Three.js with full background transparency for seamless scene overlay.',
    category: 'utility',
    color: '#a855f7',
    soundEnabled: true,
    duration: 30,
    scale: 1,
    cooldown: 5,
    isStatic: false,
    animationStyle: 'none',
    animationSpeed: 1,
    spriteStyle: 'custom',
    permission: 'everyone',
    permissionMode: 'all',
    whitelistUsers: '',
    blacklistUsers: '',
    customHtml: `<div class="butterfly-container"></div>`,
    customCss: `.butterfly-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  background: transparent !important;
}
.butterfly-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
}`,
    customJs: `(async () => {
  try {
    const module = await import('https://unpkg.com/threejs-toys@0.0.7/build/threejs-toys.module.cdn.min.js');
    const targetEl = container.querySelector('.butterfly-container');
    if (targetEl && module.butterfliesBackground) {
      const instance = module.butterfliesBackground({
        el: targetEl,
        eventsEl: document.body,
        gpgpuSize: 96,
        material: 'basic',
        materialParams: { transparent: true, alphaTest: 0.5 },
        texture: 'https://assets.codepen.io/33787/butterflies.png',
        textureCount: 4,
        wingsScale: [1, 1, 1],
        wingsWidthSegments: 8,
        wingsHeightSegments: 8,
        wingsSpeed: 0.75,
        wingsDisplacementScale: 1.25,
        noiseCoordScale: 0.01,
        noiseTimeCoef: 0.0005,
        noiseIntensity: 0.0025,
        attractionRadius1: 100,
        attractionRadius2: 150,
        maxVelocity: 0.1
      });
      if (instance && instance.three && instance.three.renderer) {
        instance.three.renderer.setClearAlpha(0);
        instance.three.renderer.setClearColor(0x000000, 0);
        if (instance.three.scene) {
          instance.three.scene.background = null;
        }
      }
    }
  } catch (err) {
    console.error('Failed to load butterfly effect:', err);
  }
})();`
  },
  {
    id: 'cmd-omg',
    command: 'omg',
    displayName: 'Comic OMG! Speech Bubble',
    description: "Pop-art comic book perspective speech bubble overlay displaying 'OMG!' with transparent background, using Luckiest Guy font and angled comic styling.",
    category: 'memes',
    color: '#FF4A4A',
    soundEnabled: true,
    duration: 5,
    scale: 1,
    cooldown: 2,
    isStatic: false,
    animationStyle: 'bounce',
    animationSpeed: 0.8,
    spriteStyle: 'custom',
    permission: 'everyone',
    permissionMode: 'all',
    whitelistUsers: '',
    blacklistUsers: '',
    customHtml: `<div class="comic-omg-wrapper">
  <div class="bubble-omg">
    <div class="text-omg">{message}</div>
  </div>
</div>`,
    customCss: `@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

:root {
  --font-luckiest: 'Luckiest Guy', cursive, sans-serif;
  --black: #222222;
}

.comic-omg-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: transparent;
  perspective: 800px;
}

.bubble-omg {
  background: #ffffff;
  width: 360px;
  height: 180px;
  border-radius: 4px;
  border: 4px solid var(--black);
  border-left-width: 8px;
  transform: rotateY(-35deg) skewY(-5deg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
}

.bubble-omg::after {
  content: '';
  position: absolute;
  right: 50px;
  bottom: -48px;
  width: 50px;
  height: 50px;
  border-radius: 0;
  border-bottom: 0;
  border-right: 0;
  background: linear-gradient(125deg, #ffffff 0 25px, var(--black) calc(25px + 1px) 28px, rgba(255,255,255,0) calc(28px + 1px) 100%);
}

.text-omg {
  width: 100%;
  height: 100%;
  font-family: var(--font-luckiest);
  font-size: 100px;
  color: #ff4a4a;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-shadow: 
    10px 10px 1px rgba(34, 34, 34, 0.2), 
    0 0 3px var(--black), 
    3px 3px 0 var(--black), 
    -3px 3px 0 var(--black), 
    -3px -3px 0 var(--black), 
    3px -3px 0 var(--black);
  user-select: none;
}`,
    customJs: `const textElement = container.querySelector('.text-omg');
if (textElement) {
  const msg = message && message.trim() ? message.trim() : 'OMG!';
  textElement.textContent = msg;
}`
  },
  {
    id: 'cmd-pow',
    command: 'pow',
    displayName: 'Comic POW! Burst Overlay',
    description: "Pop-art comic book starburst splash overlay displaying 'POW!' with transparent background, using Bangers font and comic styling.",
    category: 'memes',
    color: '#FFC274',
    soundEnabled: true,
    duration: 5,
    scale: 1,
    cooldown: 2,
    isStatic: false,
    animationStyle: 'bounce',
    animationSpeed: 0.6,
    spriteStyle: 'custom',
    permission: 'everyone',
    permissionMode: 'all',
    whitelistUsers: '',
    blacklistUsers: '',
    customHtml: `<div class="comic-pow-wrapper">
  <div class="splash-pow">
    <div class="text-pow">{message}</div>
  </div>
</div>`,
    customCss: `@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

:root {
  --font-bangers: 'Bangers', cursive, sans-serif;
  --black: #222222;
}

.comic-pow-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: transparent;
}

.splash-pow {
  width: 320px;
  height: 250px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 2px var(--black)) drop-shadow(0 0 2px var(--black)) drop-shadow(0 10px 20px rgba(0,0,0,0.3));
}

.splash-pow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  clip-path: polygon(0% 0%, 27% 24%, 28% 0%, 46% 24%, 60% 0%, 71% 28%, 99% 1%, 83% 30%, 99% 28%, 84% 40%, 100% 51%, 82% 60%, 100% 69%, 78% 73%, 100% 100%, 66% 79%, 61% 100%, 45% 78%, 33% 100%, 28% 81%, 0% 100%, 21% 65%, 0% 61%, 24% 47%, 0% 32%, 15% 28%);
}

.splash-pow::after {
  content: '';
  position: absolute;
  right: -100px;
  top: 20px;
  width: 80%;
  height: 70%;
  transform: rotate(-14deg);
  background: #ffffff;
  clip-path: polygon(0% 35%, 53% 33%, 44% 51%, 100% 32%, 23% 73%, 33% 45%, 0% 50%);
}

.text-pow {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  font-family: var(--font-bangers);
  font-size: 110px;
  color: #ffc274;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 
    3px 3px 0 var(--black), 
    -3px 3px 0 var(--black), 
    -3px -3px 0 var(--black), 
    3px -3px 0 var(--black),
    0 0 6px var(--black);
  user-select: none;
}`,
    customJs: `const textElement = container.querySelector('.text-pow');
if (textElement) {
  const msg = message && message.trim() ? message.trim() : 'POW!';
  textElement.textContent = msg;
}`
  },
  {
    id: 'cmd-ok',
    command: 'ok',
    displayName: 'Comic OK! Speech Bubble',
    description: "Pop-art comic book speech bubble overlay displaying 'OK!' with a transparent background, featuring only the bubble and text element.",
    category: 'memes',
    color: '#8BC34A',
    soundEnabled: true,
    duration: 5,
    scale: 1,
    cooldown: 2,
    isStatic: false,
    animationStyle: 'bounce',
    animationSpeed: 0.8,
    spriteStyle: 'custom',
    permission: 'everyone',
    permissionMode: 'all',
    whitelistUsers: '',
    blacklistUsers: '',
    customHtml: `<div class="comic-bubble-wrapper">
  <div class="bubble-ok">
    <div class="text-ok">{message}</div>
  </div>
</div>`,
    customCss: `@import url('https://fonts.googleapis.com/css2?family=Bowlby+One+SC&display=swap');

:root {
  --font-bowlby: 'Bowlby One SC', cursive, sans-serif;
  --black: #222222;
}

.comic-bubble-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: transparent;
}

.bubble-ok {
  background: #ffffff;
  width: 280px;
  height: 220px;
  border-radius: 100%;
  border: 5px solid var(--black);
  transform: rotate(2deg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
}

.bubble-ok::after {
  content: '';
  position: absolute;
  transform: rotateY(0deg) rotate(37deg);
  left: 10px;
  bottom: -28px;
  width: 55px;
  height: 55px;
  border-radius: 0;
  border-bottom: 0;
  border-right: 0;
  background: linear-gradient(125deg, #ffffff 0 28px, var(--black) calc(28px + 1px) 32px, rgba(255,255,255,0) calc(32px + 1px) 100%);
}

.text-ok {
  width: 100%;
  height: 100%;
  font-family: var(--font-bowlby);
  font-size: 85px;
  color: #8bc34a;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-shadow: 
    0 0 5px var(--black), 
    3px 3px 0 var(--black), 
    -3px 3px 0 var(--black), 
    -3px -3px 0 var(--black), 
    3px -3px 0 var(--black),
    5px 3px 2px var(--black);
  user-select: none;
}`,
    customJs: `const textElement = container.querySelector('.text-ok');
if (textElement) {
  const msg = message && message.trim() ? message.trim() : 'OK!';
  textElement.textContent = msg;
}`
  },
"""

content = content.replace("export const DEFAULT_COMMANDS: CommandConfig[] = [\n", "export const DEFAULT_COMMANDS: CommandConfig[] = [\n" + new_commands)

with open("src/types.ts", "w") as f:
    f.write(content)

