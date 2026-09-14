const fs = require('fs');

const tagsOutput = `AccessDeniedNotification
Activity
AdminPromptModal
AnimatePresence
Camera
Check
ChevronDown
ChevronLeft
ChevronRight
ChevronUp
Code2
CommandManager
ConfigurationWizard
Copy
Crop
CustomCodeBgWindow
DashboardContextMenus
DevicePermissionsManager
Download
ExternalLink
Eye
EyeOff
FileText
Globe
Grid3X3
GuidedTour
HelpCircle
History
Layers
LayoutGrid
LightningBoltInspectorLogo
List
LivePerformanceStats
Maximize2
Minimize2
Minus
Move
Palette
Play
Plus
Power
PowerOff
Radio
RefreshCw
RotateCcw
ScreensharePermissionModal
Search
Settings
SettingsModal
Shield
ShieldCheck
SideOverlayToggleTrays
Sliders
SlidersHorizontal
Sparkles
SpriteOverlayRenderer
StageGuideOverlay
StaticLayersPanel
StaticOverlayRenderer
StaticSourcesPanel
SystemNotificationSprite
TampermonkeyScriptGenerator
Terminal
TerminalDropdown
Trash2
TriggerBehaviorModal
TriggerdLogoSprite
TriggeredOverlayWallpaper
Tv
UiCrtOverlay
Volume2
VolumeX
Wand2
Wifi
X
Zap
ZoomIn
ZoomOut`;

const tags = new Set(tagsOutput.split('\n'));
const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// check imports
const ts = require('typescript');
const sourceFile = ts.createSourceFile('Dashboard.tsx', code, ts.ScriptTarget.Latest, true);

const importedIdentifiers = new Set();
ts.forEachChild(sourceFile, node => {
    if (ts.isImportDeclaration(node)) {
        if (node.importClause && node.importClause.namedBindings) {
            if (ts.isNamedImports(node.importClause.namedBindings)) {
                node.importClause.namedBindings.elements.forEach(el => {
                    importedIdentifiers.add(el.name.text);
                });
            }
        }
    }
});

for (const tag of tags) {
    if (!importedIdentifiers.has(tag)) {
        console.log(`Tag used but not imported: ${tag}`);
    }
}
