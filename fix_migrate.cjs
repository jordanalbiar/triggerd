const fs = require('fs');
let code = fs.readFileSync('src/utils/stageTransitionManager.ts', 'utf8');

const newMigrate = `export const migrateStagePresetsList = (list: any[]): StagePreset[] => {
  const defaults = getInitialDefaultStagePresets();
  if (!Array.isArray(list) || list.length === 0) return defaults;

  let modified = false;
  let updated = [...list];

  // Remove legacy default presets
  const legacyIds = ['preset-triggered', 'preset-streaming', 'preset-brb'];
  if (updated.some(p => legacyIds.includes(p?.id))) {
    updated = updated.filter(p => !legacyIds.includes(p?.id));
    modified = true;
  }

  // Ensure Help Stage Scene exists
  const guideIdx = updated.findIndex(p => p?.id === 'preset-help-guide');
  if (guideIdx === -1) {
    updated.unshift(defaults[0]);
    modified = true;
  } else {
    // maybe force update it if it has old sources?
    const current = updated[guideIdx];
    if (current.name !== 'Help Stage Scene' || !current.staticSources?.some(s => s.id === 'static-source-help-tip-window')) {
      updated[guideIdx] = {
        ...current,
        name: 'Help Stage Scene',
        staticSources: defaults[0].staticSources
      };
      modified = true;
    }
  }

  // Ensure all presets have hotkey bindings and no animated hue or crt overlay
  updated = updated.map((p: any, idx: number) => {
    let changed = false;
    let nextP = { ...p };
    if (!p.hotkey) {
      nextP.hotkey = \`Alt+\${idx + 1}\`;
      changed = true;
    }
    if (nextP.gridLightAnim) {
      nextP.gridLightAnim = false;
      changed = true;
    }
    if (nextP.crtEnabled) {
      nextP.crtEnabled = false;
      changed = true;
    }
    if (changed) {
      modified = true;
    }
    return nextP;
  });

  // Ensure unique IDs
  const seenIds = new Set<string>();
  updated = updated.map((p: any, idx: number) => {
    let id = p.id || \`preset-\${idx}\`;
    if (seenIds.has(id)) {
      id = \`\${id}-\${idx}-\${Date.now()}\`;
      modified = true;
    }
    seenIds.add(id);
    return { ...p, id };
  });

  if (modified && typeof window !== 'undefined') {
    try {
      localStorage.setItem('triggerd_stage_presets', JSON.stringify(updated));
    } catch (e) {}
  }
  return updated;
};`;

code = code.replace(/export const migrateStagePresetsList = \(\w+: any\[\]\): StagePreset\[\] => \{[\s\S]*?return updated;\n\};/, newMigrate);

fs.writeFileSync('src/utils/stageTransitionManager.ts', code);
