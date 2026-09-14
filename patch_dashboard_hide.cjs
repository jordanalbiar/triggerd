const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dash = dash.replace(
  '    <div \n      onContextMenu={handleDashboardBgContextMenu}\n      onTouchStart={handleDashboardBgTouchStart}\n      className="h-screen bg-[var(--theme-bg,#020b18)] text-[var(--theme-text-main,#e0f2fe)] font-sans antialiased flex flex-col selection:bg-[var(--theme-accent,#00f0ff)] selection:text-black relative overflow-hidden"\n    >',
  '    <div \n      onContextMenu={handleDashboardBgContextMenu}\n      onTouchStart={handleDashboardBgTouchStart}\n      className="h-screen bg-[var(--theme-bg,#020b18)] text-[var(--theme-text-main,#e0f2fe)] font-sans antialiased flex flex-col selection:bg-[var(--theme-accent,#00f0ff)] selection:text-black relative overflow-hidden"\n      style={{ display: isSystemSleeping ? "none" : "flex" }}\n    >'
);

fs.writeFileSync('src/components/Dashboard.tsx', dash);
