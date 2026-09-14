const lucide = require('lucide-react');
const icons = ['Sliders', 'Wifi', 'ExternalLink', 'Copy', 'Check', 'Tv', 'Sparkles', 'Volume2', 'VolumeX', 'Code2', 'Maximize2', 'Minimize2', 'Palette', 'X', 'ShieldCheck', 'Activity', 'Gauge', 'Cpu', 'Clock', 'HardDrive', 'Wand2', 'ChevronDown', 'ChevronUp', 'Move', 'Settings', 'ChevronRight', 'ChevronLeft', 'Globe', 'Zap', 'RefreshCw', 'Play', 'Search', 'Trash2', 'ZoomIn', 'ZoomOut', 'Minus', 'Plus', 'RotateCcw', 'Eye', 'EyeOff', 'Terminal', 'Info', 'List', 'Server', 'Radio', 'FileText', 'Camera', 'Layers', 'Grid3X3', 'Crop', 'Shield', 'ShieldAlert', 'LayoutGrid', 'Lock', 'UserCheck', 'UserX', 'Power', 'PowerOff', 'Download', 'Upload', 'ClipboardPaste', 'Video', 'HelpCircle', 'PictureInPicture2', 'History', 'Monitor', 'CheckCircle2', 'SlidersHorizontal'];

for (const icon of icons) {
  if (!lucide[icon]) {
    console.log(`Icon missing in lucide-react: ${icon}`);
  }
}
