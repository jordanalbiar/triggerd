const fs = require('fs');
const file = 'src/components/DashboardContextMenus.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the return statement
const returnMatch = content.match(/return \(\s*<>\s*\{\/\* 1\. TOP TOOLBAR/s);
if (returnMatch) {
    const startIndex = returnMatch.index;
    
    // We will extract the contents of the individual menus so we can embed them in the new tabbed layout
    
    const newContent = content.substring(0, startIndex) + `
  const [activeTab, setActiveTab] = React.useState('panel');
  const [menuPos, setMenuPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (showQuickActionsMenu) { setActiveTab('panel'); setMenuPos(quickActionsPos); }
  }, [showQuickActionsMenu, quickActionsPos]);

  React.useEffect(() => {
    if (showBgMenu) { setActiveTab('background'); setMenuPos(bgMenuPos); }
  }, [showBgMenu, bgMenuPos]);

  React.useEffect(() => {
    if (showToolbarMenu) { setActiveTab('toolbar'); setMenuPos(toolbarMenuPos); }
  }, [showToolbarMenu, toolbarMenuPos]);

  React.useEffect(() => {
    if (showStaticSourceMenu) { setActiveTab('edit_source'); setMenuPos(staticSourceMenuPos || { x: 0, y: 0 }); }
  }, [showStaticSourceMenu, staticSourceMenuPos]);

  const anyOpen = showToolbarMenu || showBgMenu || showQuickActionsMenu || showStaticSourceMenu;

  const handleClose = () => {
    onCloseToolbarMenu();
    onCloseBgMenu();
    onCloseQuickActionsMenu();
    if (onCloseStaticSourceMenu) onCloseStaticSourceMenu();
  };

  const getClampedPos = (pos, width = 420, height = 520) => {
    if (typeof window === 'undefined') return { left: pos.x, top: pos.y };
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const x = Math.max(10, Math.min(pos.x, winW - width - 15));
    const y = Math.max(10, Math.min(pos.y, winH - height - 15));
    return { left: \`\${x}px\`, top: \`\${y}px\` };
  };

  const tabs = [
    { id: 'panel', icon: '🎛️', label: 'Stage Panel' },
    { id: 'background', icon: '🖼️', label: 'Stage Background' },
    { id: 'toolbar', icon: '🛠️', label: 'Stage Toolbar' },
    { id: 'permissions', icon: '🛡️', label: 'User Permissions' },
    { id: 'add_sources', icon: '➕', label: 'Add Sources' },
  ];
  if (staticSourceTarget) {
    tabs.push({ id: 'edit_source', icon: '✏️', label: 'Edit Source' });
  }

  return (
    <AnimatePresence>
      {anyOpen && (
        <>
          <div 
            className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-[2px]" 
            onClick={handleClose} 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            style={getClampedPos(menuPos, 420, 520)}
            className="fixed z-[1201] w-[420px] bg-[var(--theme-card,#04182e)] border-2 border-cyan-500/80 rounded-2xl flex shadow-[0_0_40px_rgba(0,240,255,0.35)] font-mono text-xs text-[var(--theme-text-main,#ffffff)] select-none max-h-[90vh] overflow-hidden"
          >
            {/* Sidebar Tabs */}
            <div className="w-14 bg-black/40 border-r border-[var(--theme-border,#003865)] flex flex-col items-center py-2 gap-2">
              {tabs.map(tab => (
                <div key={tab.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={\`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition \${activeTab === tab.id ? 'bg-cyan-500/30 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'hover:bg-white/10 opacity-70 hover:opacity-100 border border-transparent'}\`}
                  >
                    {tab.icon}
                  </button>
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black border border-cyan-500/50 text-cyan-200 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {tab.label}
                  </div>
                </div>
              ))}
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleClose}
                className="w-10 h-10 rounded-xl hover:bg-red-500/20 text-red-400 flex items-center justify-center transition border border-transparent hover:border-red-500/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-3 overflow-y-auto pr-1 scrollbar-thin">
              {activeTab === 'toolbar' && <ToolbarTabContent {...props} />}
              {activeTab === 'background' && <BackgroundTabContent {...props} />}
              {activeTab === 'panel' && <QuickActionsTabContent {...props} />}
              {activeTab === 'permissions' && <PermissionsTabContent {...props} />}
              {activeTab === 'add_sources' && <AddSourcesTabContent {...props} />}
              {activeTab === 'edit_source' && <EditSourceTabContent {...props} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
`
    // Wait, the props need to be passed down or accessed. I can just inline the content instead of passing props!
    // Since everything is already in scope.
}
