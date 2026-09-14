const fs = require('fs');
let code = fs.readFileSync('src/utils/stageTransitionManager.ts', 'utf8');

const helpSourceCode = `export const HELP_TIP_WINDOW_SOURCE: StaticOverlaySource = {
  id: 'static-source-help-tip-window',
  name: 'Help Tip Window',
  type: 'html',
  visible: true,
  locked: false,
  x: 50,
  y: 50,
  width: 80,
  height: 80,
  zIndex: 10,
  opacity: 100,
  rotation: 0,
  scale: 1,
  borderRadius: 14,
  keepAspectRatio: false,
  htmlContent: \`<div class="help-window">
  <h2>Welcome to the Stage Canvas!</h2>
  <p>Here you can visually place, resize, and arrange your static overlays (webcams, iframes, HTML modules, etc.).</p>
  <ul>
    <li>Click any item to select it and drag it around.</li>
    <li>Use the corner handles to resize.</li>
    <li>Press <b>Ctrl+Z</b> to undo actions (including scene deletion).</li>
  </ul>
</div>\`,
  htmlCss: \`* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; font-family: sans-serif; background: transparent; }
.help-window {
  width: 100%; height: 100%; padding: 20px;
  background: rgba(2, 10, 22, 0.95);
  border: 2px solid #00f0ff;
  border-radius: 14px;
  color: #e0f2fe;
  box-shadow: 0 0 20px rgba(0,240,255,0.4);
  overflow: auto;
}
.help-window h2 { color: #00f0ff; margin-top: 0; }
.help-window ul { padding-left: 20px; line-height: 1.6; }\`
};`;

code = code.replace(/export const HELP_GUIDE_CENTER_TIP_SOURCE: StaticOverlaySource = \{[\s\S]*?};/, helpSourceCode);

code = code.replace(/export const getInitialDefaultStagePresets = \(\): StagePreset\[\] => \{[\s\S]*?return \[[\s\S]*?\];\n\};/, `export const getInitialDefaultStagePresets = (): StagePreset[] => {
  return [
    {
      id: 'preset-help-guide',
      name: 'Help Stage Scene',
      icon: '📖',
      hotkey: 'Alt+1',
      stageBgType: 'empty',
      stageBgColor: '#01050b',
      gridStyle: 'mesh',
      gridLightAnim: false,
      gridBackdropType: 'color',
      staticSources: [
        HELP_TIP_WINDOW_SOURCE
      ],
    }
  ];
};`);

fs.writeFileSync('src/utils/stageTransitionManager.ts', code);
