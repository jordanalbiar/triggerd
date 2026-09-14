const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dash = dash.replace(
  '    <div \n      onContextMenu={handleDashboardBgContextMenu}\n      onTouchStart={handleDashboardBgTouchStart}\n      className="h-screen bg-[var(--theme-bg,#020b18)] text-[var(--theme-text-main,#e0f2fe)] font-sans antialiased flex flex-col selection:bg-[var(--theme-accent,#00f0ff)] selection:text-black relative overflow-hidden"\n      style={{ display: isSystemSleeping ? "none" : "flex" }}\n    >',
  '    <>\n    <SystemSleepOverlay isSleeping={isSystemSleeping} onWake={handleSystemWake} />\n    <div \n      onContextMenu={handleDashboardBgContextMenu}\n      onTouchStart={handleDashboardBgTouchStart}\n      className="h-screen bg-[var(--theme-bg,#020b18)] text-[var(--theme-text-main,#e0f2fe)] font-sans antialiased flex flex-col selection:bg-[var(--theme-accent,#00f0ff)] selection:text-black relative overflow-hidden"\n      style={{ display: isSystemSleeping ? "none" : "flex" }}\n    >'
);

// Remove the old SystemSleepOverlay rendering at the end of Dashboard
dash = dash.replace(
  /\s*\{\/\* System Sleep Mode Fullscreen Overlay \*\/\}\s*<SystemSleepOverlay\s*isSleeping=\{isSystemSleeping\}\s*onWake=\{handleSystemWake\}\s*\/>/g,
  ''
);

// Close the React fragment at the very end
dash = dash.replace(
  /      \{\/\* Access Denied Notification Banner \*\/\}\n      <AccessDeniedNotification \/>\n    <\/div>\n  \);\n\}/,
  '      {/* Access Denied Notification Banner */}\n      <AccessDeniedNotification />\n    </div>\n    </>\n  );\n}'
);

fs.writeFileSync('src/components/Dashboard.tsx', dash);
