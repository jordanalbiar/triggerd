import re

with open("src/components/DashboardContextMenus.tsx", "r") as f:
    content = f.read()

# Add autoHideTopBar to DashboardContextMenusProps
prop_search = """  onToggleFullscreen: () => void;
  isFullscreen: boolean;"""

prop_replace = """  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  autoHideTopBar?: boolean;
  onToggleAutoHideTopBar?: () => void;"""
content = content.replace(prop_search, prop_replace)

# Modify right click stage to open 'add_sources' tab
# useEffect(() => {
#    if (props.showQuickActionsMenu) { setActiveTab('panel'); setMenuPos(props.quickActionsPos); }
#  }, [props.showQuickActionsMenu, props.quickActionsPos]);

effect_search = "if (props.showQuickActionsMenu) { setActiveTab('panel'); setMenuPos(props.quickActionsPos); }"
effect_replace = "if (props.showQuickActionsMenu) { setActiveTab('add_sources'); setMenuPos(props.quickActionsPos); }"
content = content.replace(effect_search, effect_replace)

# Modify Toolbar tab
toolbar_search = """                      <button type="button" onClick={() => { handleClose(); props.onOpenSettingsTab('stage'); }} className="p-2 rounded-xl bg-[var(--theme-card-alt,#0a2540)] hover:bg-cyan-500/20 border border-[var(--theme-border,#27272a)] text-cyan-200 text-xs flex flex-col items-center gap-1 cursor-pointer">
                        <Settings className="w-4 h-4" /> <span>Settings</span>
                      </button>
                    </div>"""

toolbar_replace = """                      <button type="button" onClick={() => { handleClose(); props.onOpenSettingsTab('stage'); }} className="p-2 rounded-xl bg-[var(--theme-card-alt,#0a2540)] hover:bg-cyan-500/20 border border-[var(--theme-border,#27272a)] text-cyan-200 text-xs flex flex-col items-center gap-1 cursor-pointer">
                        <Settings className="w-4 h-4" /> <span>Settings</span>
                      </button>
                      <button type="button" onClick={() => { handleClose(); props.onOpenTour(); }} className="p-2 rounded-xl bg-[var(--theme-card-alt,#0a2540)] hover:bg-cyan-500/20 border border-[var(--theme-border,#27272a)] text-cyan-200 text-xs flex flex-col items-center gap-1 cursor-pointer">
                        <Map className="w-4 h-4" /> <span>Help Tour</span>
                      </button>
                      <button type="button" onClick={() => { handleClose(); props.onOpenSettingsTab('theme'); }} className="p-2 rounded-xl bg-[var(--theme-card-alt,#0a2540)] hover:bg-cyan-500/20 border border-[var(--theme-border,#27272a)] text-cyan-200 text-xs flex flex-col items-center gap-1 cursor-pointer">
                        <Palette className="w-4 h-4" /> <span>Theme</span>
                      </button>
                      <button type="button" onClick={() => { props.onToggleAutoHideTopBar?.(); }} className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer ${props.autoHideTopBar ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-[var(--theme-card-alt,#0a2540)] hover:bg-cyan-500/20 border-[var(--theme-border,#27272a)] text-zinc-400'}`}>
                        <EyeOff className="w-4 h-4" /> <span>Auto Hide</span>
                      </button>
                    </div>"""
content = content.replace(toolbar_search, toolbar_replace)

# Import Map icon
import_search = "import { Zap, MonitorPlay, Palette, Terminal, Settings, Wand2, X, Maximize2, Minimize2, Grid3X3, Layers, Edit3, Image as ImageIcon, RotateCw, FlipHorizontal, Square, Sun, Activity, Search, Target, Link2, LogOut, Code, Smartphone, Info, Shield, Unlock, Lock, Share2, Eye, EyeOff } from 'lucide-react';"
import_replace = "import { Zap, MonitorPlay, Palette, Terminal, Settings, Wand2, X, Maximize2, Minimize2, Grid3X3, Layers, Edit3, Image as ImageIcon, RotateCw, FlipHorizontal, Square, Sun, Activity, Search, Target, Link2, LogOut, Code, Smartphone, Info, Shield, Unlock, Lock, Share2, Eye, EyeOff, Map } from 'lucide-react';"
content = content.replace(import_search, import_replace)


with open("src/components/DashboardContextMenus.tsx", "w") as f:
    f.write(content)

