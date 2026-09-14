const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Replace standard setStagePresets with handleSetStagePresetsWithHistory for deletions and additions.
// For deletions:
code = code.replace(
  /const filtered = stagePresets\.filter\(p => p\.id !== presetId\);\n\s*setStagePresets\(filtered\);\n\s*try \{\n\s*localStorage\.setItem\('triggerd_stage_presets', JSON\.stringify\(filtered\)\);\n\s*\} catch \(err\) \{\}/g,
  `const filtered = stagePresets.filter(p => p.id !== presetId);
    handleSetStagePresetsWithHistory(filtered);`
);

// For duplication:
code = code.replace(
  /const updated = \[\.\.\.stagePresets\];\n\s*updated\.splice\(presetIdx \+ 1, 0, newPreset\);\n\s*setStagePresets\(updated\);\n\s*try \{\n\s*localStorage\.setItem\('triggerd_stage_presets', JSON\.stringify\(updated\)\);\n\s*\} catch \(err\) \{\}/g,
  `const updated = [...stagePresets];
    updated.splice(presetIdx + 1, 0, newPreset);
    handleSetStagePresetsWithHistory(updated);`
);

// For blank preset addition:
code = code.replace(
  /const updated = \[\.\.\.stagePresets, blankPreset\];\n\s*setStagePresets\(updated\);\n\s*try \{\n\s*localStorage\.setItem\('triggerd_stage_presets', JSON\.stringify\(updated\)\);\n\s*\} catch \(err\) \{\}/g,
  `const updated = [...stagePresets, blankPreset];
    handleSetStagePresetsWithHistory(updated);`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
