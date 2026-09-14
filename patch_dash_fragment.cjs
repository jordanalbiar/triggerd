const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dash = dash.replace(
  '        onToggleAnimatedBehaviors={toggleAnimatedBehaviors}\n        onExitEditMode={() => setIsDashboardEditMode(false)}\n      />\n    </div>\n  );\n};',
  '        onToggleAnimatedBehaviors={toggleAnimatedBehaviors}\n        onExitEditMode={() => setIsDashboardEditMode(false)}\n      />\n    </div>\n    </>\n  );\n};'
);

fs.writeFileSync('src/components/Dashboard.tsx', dash);
