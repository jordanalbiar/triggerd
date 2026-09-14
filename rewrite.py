import re

with open('src/components/DashboardContextMenus.tsx', 'r') as f:
    content = f.read()

# Find the start of the return statement
m = re.search(r'return \(\s*<>\s*\{\/\* 1\. TOP TOOLBAR', content)
if not m:
    print("Could not find return statement")
    exit(1)

start_idx = m.start()

# We need to extract the JSX content for each of the 4 sections.
# I will use regex or simple string manipulation.

def extract_section(text, header_str):
    m = re.search(header_str, text)
    if not m:
        return ""
    s = text[m.end():]
    # find the next header or end
    m2 = re.search(r'\{\/\* \d\.', s)
    if m2:
        s = s[:m2.start()]
    else:
        m2 = re.search(r'</>\s*\);\s*};', s)
        if m2:
            s = s[:m2.start()]
    # extract inner content of <AnimatePresence> ... <motion.div ... > ... </motion.div>
    # actually just extracting the inside of the menu 
    return s

toolbar_raw = extract_section(content, r'\{\/\* 1\. TOP TOOLBAR CONTEXT MENU[^\}]+\}')
bg_raw = extract_section(content, r'\{\/\* 2\. DASHBOARD BACKGROUND CONTEXT MENU[^\}]+\}')
quick_raw = extract_section(content, r'\{\/\* 3\. STAGE OVERLAY QUICK ACTIONS CONTEXT MENU[^\}]+\}')
static_raw = extract_section(content, r'\{\/\* 4\. STATIC OVERLAY SOURCE CONTEXT MENU[^\}]+\}')

def extract_inner(raw):
    # find <div className="space-y...
    m = re.search(r'<div className="space-y-[^>]+>', raw)
    if not m:
        m = re.search(r'<div className="space-y-[^>]+>', raw)
    if not m:
        return raw # fallback
    
    start = m.start()
    # find last </div></motion.div>
    end = raw.rfind('</motion.div>')
    if end != -1:
        inner = raw[start:end]
        # remove closing </div> for the motion div if it's there
        return inner.strip()
    return raw

toolbar_inner = extract_inner(toolbar_raw)
bg_inner = extract_inner(bg_raw)
quick_inner = extract_inner(quick_raw)
static_inner = extract_inner(static_raw)

# Now assemble the new return statement

new_return = """
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

  const getClampedPos = (pos, width = 440, height = 560) => {
    if (typeof window === 'undefined') return { left: pos.x, top: pos.y };
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const x = Math.max(10, Math.min(pos.x, winW - width - 15));
    const y = Math.max(10, Math.min(pos.y, winH - height - 15));
    return { left: `${x}px`, top: `${y}px` };
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
            style={getClampedPos(menuPos, 440, 560)}
            className="fixed z-[1201] w-[440px] bg-[var(--theme-card,#04182e)] border-2 border-cyan-500/80 rounded-2xl flex shadow-[0_0_40px_rgba(0,240,255,0.35)] font-mono text-xs text-[var(--theme-text-main,#ffffff)] select-none h-[560px] max-h-[90vh] overflow-hidden"
          >
            {/* Sidebar Tabs */}
            <div className="w-14 bg-black/40 border-r border-[var(--theme-border,#003865)] flex flex-col items-center py-2 gap-2">
              {tabs.map(tab => (
                <div key={tab.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition ${activeTab === tab.id ? 'bg-cyan-500/30 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'hover:bg-white/10 opacity-70 hover:opacity-100 border border-transparent'}`}
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
            <div className="flex-1 p-3 overflow-y-auto scrollbar-thin">
              {activeTab === 'toolbar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border,#003865)] pb-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <span className="font-black uppercase tracking-wider text-sm text-cyan-300">Stage Toolbar</span>
                  </div>
                  __TOOLBAR__
                </div>
              )}
              {activeTab === 'background' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border,#003865)] pb-2">
                    <Palette className="w-5 h-5 text-emerald-400" />
                    <span className="font-black uppercase tracking-wider text-sm text-emerald-300">Stage Background</span>
                  </div>
                  __BACKGROUND__
                </div>
              )}
              {activeTab === 'panel' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border,#003865)] pb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-black uppercase tracking-wider text-sm text-yellow-300">Stage Panel</span>
                  </div>
                  __QUICK__
                </div>
              )}
              {activeTab === 'edit_source' && staticSourceTarget && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border,#003865)] pb-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span className="font-black uppercase tracking-wider text-sm text-purple-300">Edit Source</span>
                  </div>
                  __STATIC__
                </div>
              )}
              {activeTab === 'permissions' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border,#003865)] pb-2">
                    <Shield className="w-5 h-5 text-rose-400" />
                    <span className="font-black uppercase tracking-wider text-sm text-rose-300">User Permissions</span>
                  </div>
                  
                  <div className="bg-[#020e1d] p-3 rounded-xl border border-[var(--theme-border,#003865)] space-y-3">
                    <p className="text-[11px] text-zinc-400">Control who can trigger overlays and execute commands.</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onChangePermissionMode?.('all')}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          permissionMode === 'all'
                            ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-[var(--theme-card-alt,#0a2540)] border-[var(--theme-border,#27272a)] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs">Everyone</span>
                        <Unlock className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onChangePermissionMode?.('admin')}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          permissionMode === 'admin'
                            ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-[var(--theme-card-alt,#0a2540)] border-[var(--theme-border,#27272a)] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs">Admin Only</span>
                        <Lock className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => onChangePermissionMode?.('whitelist')}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          permissionMode === 'whitelist'
                            ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-[var(--theme-card-alt,#0a2540)] border-[var(--theme-border,#27272a)] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs">Whitelist</span>
                        <UserCheck className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => onChangePermissionMode?.('blacklist')}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          permissionMode === 'blacklist'
                            ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-[var(--theme-card-alt,#0a2540)] border-[var(--theme-border,#27272a)] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs">Blacklist</span>
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => { handleClose(); onOpenPermissionsModal?.(); }}
                      className="w-full mt-2 py-2 rounded-xl bg-[var(--theme-card-alt,#0a2540)] hover:bg-rose-500/20 border border-[var(--theme-border,#27272a)] hover:border-rose-400/60 text-center text-xs font-bold transition cursor-pointer flex justify-center items-center gap-2 text-rose-300"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Manage Permission Lists
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { handleClose(); onOpenAdminPrompt?.(); }}
                      className="w-full mt-1 py-2 rounded-xl bg-[var(--theme-card-alt,#0a2540)] hover:bg-rose-500/20 border border-[var(--theme-border,#27272a)] hover:border-rose-400/60 text-center text-xs font-bold transition cursor-pointer flex justify-center items-center gap-2 text-rose-300"
                    >
                      <User className="w-4 h-4" />
                      Change Admin Username ({adminUsername})
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'add_sources' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--theme-border,#003865)] pb-2">
                    <Grid3X3 className="w-5 h-5 text-indigo-400" />
                    <span className="font-black uppercase tracking-wider text-sm text-indigo-300">Add Sources</span>
                  </div>
                  
                  <div className="bg-[#020e1d] p-3 rounded-xl border border-[var(--theme-border,#003865)] space-y-3">
                    <p className="text-[11px] text-zinc-400">Quickly toggle panels to add new static sources to the stage.</p>
                    
                    <button
                      type="button"
                      onClick={() => { handleClose(); onToggleStaticSourcesPanel?.(); }}
                      className="w-full p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-400 text-left transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-bold text-indigo-200">Open Media Gallery</span>
                        <span className="block text-xs text-indigo-300/70">Add images, GIFs, and videos</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { handleClose(); onToggleIframeSettings?.(); }}
                      className="w-full p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400 text-left transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Tv className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-bold text-blue-200">Open Web Embed</span>
                        <span className="block text-xs text-blue-300/70">Add YouTube, Twitch, or websites</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { handleClose(); onToggleCameraQuickSettings?.(); }}
                      className="w-full p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400 text-left transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-200">Open Camera PiP</span>
                        <span className="block text-xs text-emerald-300/70">Add a webcam overlay</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
"""

new_return = new_return.replace('__TOOLBAR__', toolbar_inner)
new_return = new_return.replace('__BACKGROUND__', bg_inner)
new_return = new_return.replace('__QUICK__', quick_inner)
new_return = new_return.replace('__STATIC__', static_inner)

new_content = content[:start_idx] + new_return
with open('src/components/DashboardContextMenus.tsx', 'w') as f:
    f.write(new_content)
print("done")
