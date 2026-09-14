const fs = require('fs');
let code = fs.readFileSync('src/utils/introSettings.ts', 'utf8');

code = code.replace(
  "dashboardIntroStyle: 'animated' | 'generic'; // 'animated' = cinematic theme logo & steps, 'generic' = no animation mode / minimal sequence",
  `dashboardIntroStyle: 'animated' | 'generic'; // 'animated' = cinematic theme logo & steps, 'generic' = no animation mode / minimal sequence
  
  // Stage Overlay Intro Sequence
  stageIntroEnabled: boolean;
  stageIntroDurationMs: number;
  stageIntroStyle: 'animated' | 'generic'; // 'animated' = full animation, 'generic' = minimal`
);

code = code.replace(
  "dashboardIntroStyle: 'animated',",
  `dashboardIntroStyle: 'animated',
  stageIntroEnabled: true,
  stageIntroDurationMs: 2000,
  stageIntroStyle: 'animated',`
);

code = code.replace(
  "dashboardIntroStyle: parsed.dashboardIntroStyle === 'generic' ? 'generic' : 'animated',",
  `dashboardIntroStyle: parsed.dashboardIntroStyle === 'generic' ? 'generic' : 'animated',
        stageIntroEnabled: parsed.stageIntroEnabled ?? DEFAULT_INTRO_SETTINGS.stageIntroEnabled,
        stageIntroDurationMs: typeof parsed.stageIntroDurationMs === 'number' ? parsed.stageIntroDurationMs : DEFAULT_INTRO_SETTINGS.stageIntroDurationMs,
        stageIntroStyle: parsed.stageIntroStyle === 'generic' ? 'generic' : 'animated',`
);

fs.writeFileSync('src/utils/introSettings.ts', code);
