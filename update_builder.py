import re

code = """import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CanvasLayer, 
  CanvasLayerSourceType, 
  CommandConfig 
} from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Move, 
  Image as ImageIcon,
  Search,
  Film,
  Heart,
  Loader2,
  ExternalLink, 
  Video as VideoIcon, 
  Code, 
  Camera, 
  Monitor, 
  Globe, 
  Smile, 
  Type, 
  Play, 
  Pause,
  RotateCcw, 
  Sparkles, 
  Save, 
  X as XIcon, 
  Maximize2, 
  Minimize2,
  Copy, 
  Palette, 
  Activity,
  Check,
  Download,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Clock,
  Settings,
  FolderOpen,
  Compass,
  AlignCenter
} from 'lucide-react';
import { 
  CANVAS_BG_OPTIONS, 
  CanvasBgType, 
  MOTION_EFFECT_PRESETS, 
  DEFAULT_EMOJI_LIST,
  DEFAULT_MOON_LAYERS,
  DEFAULT_MOON_COMMAND
} from './canvas/CanvasDefaults';
import { CanvasContextMenu } from './canvas/CanvasContextMenu';
import { SavedCanvasesModal } from './canvas/SavedCanvasesModal';

interface VisualCanvasTriggerBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrigger: (command: CommandConfig) => void;
  onTestTrigger?: (command: CommandConfig) => void;
  onDeleteTrigger?: (commandId: string) => void;
  existingCommand?: CommandConfig | null;
  commands?: CommandConfig[];
}

export const VisualCanvasTriggerBuilder: React.FC<VisualCanvasTriggerBuilderProps> = ({
  isOpen,
  onClose,
  onSaveTrigger,
  onTestTrigger,
  onDeleteTrigger,
  existingCommand,
  commands = []
}) => {
  // Command metadata state
  const [commandId, setCommandId] = useState<string>('');
  const [triggerCommand, setTriggerCommand] = useState<string>('moon');
  const [displayName, setDisplayName] = useState<string>('Moon Horizon & Rocket');
  const [description, setDescription] = useState<string>('Half-view moon horizon with wobbling rocket descent and Buzz Aldrin quote');
  const [category, setCategory] = useState<string>('custom');
  const [duration, setDuration] = useState<number>(7.0);
  const [cooldown, setCooldown] = useState<number>(5);
  const [isStatic, setIsStatic] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [canvasBg, setCanvasBg] = useState<CanvasBgType>('black');

  // Layers state & undo/redo history
  const [layers, setLayers] = useState<CanvasLayer[]>(DEFAULT_MOON_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('layer-rocket-wobble');
  const [history, setHistory] = useState<CanvasLayer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Active editor tab ('add' | 'edit' | 'behaviors' | 'transitions' | 'spec')
  const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'behaviors' | 'transitions' | 'spec'>('edit');

  // Modals & Menus
  const [showSavedLibraryModal, setShowSavedLibraryModal] = useState<boolean>(false);
  const [showBgDropdown, setShowBgDropdown] = useState<boolean>(false);
  const [showGifModal, setShowGifModal] = useState<boolean>(false);
  const [gifSearchQuery, setGifSearchQuery] = useState<string>('space rocket');
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [isSearchingGifs, setIsSearchingGifs] = useState<boolean>(false);
  const [gifTargetLayerId, setGifTargetLayerId] = useState<string | null>(null);

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    layer: CanvasLayer | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    layer: null
  });

  // Playback & Timing Simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playAnimRef = useRef<number | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  // Canvas Viewport references & dragging state
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const [isDraggingLayer, setIsDraggingLayer] = useState<boolean>(false);
  const dragStartPosRef = useRef<{ x: number; y: number; layerX: number; layerY: number }>({ x: 0, y: 0, layerX: 50, layerY: 50 });

  // Initialize or reset state when modal opens or existingCommand changes
  useEffect(() => {
    if (!isOpen) return;

    if (existingCommand) {
      setCommandId(existingCommand.id || `cmd-${Date.now()}`);
      setTriggerCommand(existingCommand.command || 'custom_overlay');
      setDisplayName(existingCommand.displayName || 'Custom Canvas Overlay');
      setDescription(existingCommand.description || '');
      setCategory(existingCommand.category || 'custom');
      setDuration(existingCommand.duration || 7.0);
      setCooldown(existingCommand.cooldown || 5);
      setIsStatic(!!existingCommand.isStatic);
      setSoundEnabled(existingCommand.soundEnabled !== false);
      setCanvasBg((existingCommand.canvasBg || (existingCommand as any).canvasBackground || 'checker') as CanvasBgType);

      if (existingCommand.layers && existingCommand.layers.length > 0) {
        setLayers(existingCommand.layers);
        setSelectedLayerId(existingCommand.layers[0]?.id || null);
        setHistory([existingCommand.layers]);
        setHistoryIndex(0);
      } else {
        setLayers(DEFAULT_MOON_LAYERS);
        setSelectedLayerId('layer-rocket-wobble');
        setHistory([DEFAULT_MOON_LAYERS]);
        setHistoryIndex(0);
      }
    } else {
      // Default Moon & Rocket Setup
      setCommandId(`cmd-moon-${Date.now()}`);
      setTriggerCommand('moon');
      setDisplayName('Moon Horizon & Rocket');
      setDescription('Half-view moon horizon with wobbling rocket descent and Buzz Aldrin quote');
      setCategory('custom');
      setDuration(7.0);
      setCooldown(5);
      setIsStatic(false);
      setSoundEnabled(true);
      setCanvasBg('black');
      setLayers(DEFAULT_MOON_LAYERS);
      setSelectedLayerId('layer-rocket-wobble');
      setHistory([DEFAULT_MOON_LAYERS]);
      setHistoryIndex(0);
    }
  }, [isOpen, existingCommand]);

  // Push state to undo/redo history
  const pushHistory = useCallback((newLayers: CanvasLayer[]) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newLayers];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setLayers(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setLayers(history[nextIdx]);
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (playAnimRef.current) cancelAnimationFrame(playAnimRef.current);
      return;
    }

    lastPlayTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastPlayTimeRef.current) / 1000;
      lastPlayTimeRef.current = now;

      setCurrentTime(prev => {
        const next = prev + delta;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });

      playAnimRef.current = requestAnimationFrame(loop);
    };

    playAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (playAnimRef.current) cancelAnimationFrame(playAnimRef.current);
    };
  }, [isPlaying, duration]);

  // Selected layer reference
  const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;

  // Helper to update properties on selected layer
  const updateSelectedLayer = (updates: Partial<CanvasLayer>) => {
    if (!selectedLayerId) return;
    setLayers(prev => {
      const updated = prev.map(l => l.id === selectedLayerId ? { ...l, ...updates } : l);
      pushHistory(updated);
      return updated;
    });
  };

  // Helper to update specific layer by id
  const updateLayerById = (id: string, updates: Partial<CanvasLayer>) => {
    setLayers(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, ...updates } : l);
      pushHistory(updated);
      return updated;
    });
  };

  // Layer manipulation actions
  const handleAddLayer = (type: CanvasLayerSourceType, initialContent?: string) => {
    const nextZ = layers.length > 0 ? Math.max(...layers.map(l => l.zIndex || 1)) + 1 : 1;
    const newId = `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    let newLayer: CanvasLayer;

    switch (type) {
      case 'text':
        newLayer = {
          id: newId,
          name: 'Text Overlay',
          type: 'text',
          content: initialContent || 'LIVE STREAM MESSAGE',
          x: 50,
          y: 50,
          fontSize: 32,
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          textColor: '#ffffff',
          shadowColor: '#00f0ff',
          shadowBlur: 10,
          zIndex: nextZ,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          animEffect: 'none',
          enterAnimation: 'fade',
          enterDuration: 0.5,
          enterTime: 0,
          exitAnimation: 'fade',
          exitDuration: 0.5,
          exitTime: Math.max(0.5, duration - 0.5),
          locked: false,
          visible: true
        };
        break;

      case 'image':
        newLayer = {
          id: newId,
          name: 'Image / GIF Asset',
          type: 'image',
          content: initialContent || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
          x: 50,
          y: 50,
          width: 320,
          height: 320,
          zIndex: nextZ,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          animEffect: 'none',
          enterAnimation: 'scale-up',
          enterDuration: 0.5,
          enterTime: 0,
          exitAnimation: 'fade',
          exitDuration: 0.5,
          exitTime: Math.max(0.5, duration - 0.5),
          locked: false,
          visible: true
        };
        break;

      case 'emoji':
        newLayer = {
          id: newId,
          name: `Emoji ${initialContent || '🚀'}`,
          type: 'emoji',
          content: initialContent || '🚀',
          x: 50,
          y: 50,
          fontSize: 84,
          zIndex: nextZ,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          animEffect: 'wobble',
          animSpeed: 1.5,
          animIntensity: 100,
          enterAnimation: 'slide-down',
          enterDuration: 0.6,
          enterTime: 0,
          exitAnimation: 'slide-up',
          exitDuration: 0.5,
          exitTime: Math.max(0.5, duration - 0.5),
          locked: false,
          visible: true
        };
        break;

      case 'video':
        newLayer = {
          id: newId,
          name: 'Video Clip',
          type: 'video',
          content: initialContent || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          x: 50,
          y: 50,
          width: 420,
          height: 240,
          zIndex: nextZ,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          animEffect: 'none',
          enterAnimation: 'fade',
          enterDuration: 0.5,
          enterTime: 0,
          exitAnimation: 'fade',
          exitDuration: 0.5,
          exitTime: Math.max(0.5, duration - 0.5),
          locked: false,
          visible: true
        };
        break;

      case 'html':
        newLayer = {
          id: newId,
          name: 'Custom HTML Widget',
          type: 'html',
          content: initialContent || '<div style="color: #00f0ff; font-weight: bold; text-shadow: 0 0 10px #00f0ff;">✨ STREAM HIGHLIGHT ✨</div>',
          x: 50,
          y: 50,
          zIndex: nextZ,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          animEffect: 'none',
          enterAnimation: 'fade',
          enterDuration: 0.5,
          enterTime: 0,
          exitAnimation: 'fade',
          exitDuration: 0.5,
          exitTime: Math.max(0.5, duration - 0.5),
          locked: false,
          visible: true
        };
        break;

      default:
        newLayer = {
          id: newId,
          name: 'Canvas Element',
          type: 'text',
          content: 'NEW ELEMENT',
          x: 50,
          y: 50,
          zIndex: nextZ,
          scale: 1.0,
          opacity: 1.0,
          locked: false,
          visible: true
        };
    }

    setLayers(prev => {
      const next = [...prev, newLayer];
      pushHistory(next);
      return next;
    });
    setSelectedLayerId(newId);
    setActiveTab('edit');
  };

  const handleDuplicateLayer = (id: string) => {
    const target = layers.find(l => l.id === id);
    if (!target) return;
    const newId = `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const cloned: CanvasLayer = {
      ...target,
      id: newId,
      name: `${target.name || 'Source'} (Copy)`,
      x: Math.min(90, (target.x ?? 50) + 4),
      y: Math.min(90, (target.y ?? 50) + 4),
      zIndex: (target.zIndex || 1) + 1
    };
    setLayers(prev => {
      const next = [...prev, cloned];
      pushHistory(next);
      return next;
    });
    setSelectedLayerId(newId);
    setActiveTab('edit');
  };

  const handleDeleteLayer = (id: string) => {
    setLayers(prev => {
      const next = prev.filter(l => l.id !== id);
      pushHistory(next);
      return next;
    });
    if (selectedLayerId === id) {
      setSelectedLayerId(layers.find(l => l.id !== id)?.id || null);
    }
  };

  const handleBringToFront = (id: string) => {
    const maxZ = Math.max(...layers.map(l => l.zIndex || 1), 0);
    updateLayerById(id, { zIndex: maxZ + 1 });
  };

  const handleBringForward = (id: string) => {
    const target = layers.find(l => l.id === id);
    if (!target) return;
    updateLayerById(id, { zIndex: (target.zIndex || 1) + 1 });
  };

  const handleSendBackward = (id: string) => {
    const target = layers.find(l => l.id === id);
    if (!target) return;
    updateLayerById(id, { zIndex: Math.max(1, (target.zIndex || 1) - 1) });
  };

  const handleSendToBack = (id: string) => {
    updateLayerById(id, { zIndex: 0 });
  };

  const handleToggleLock = (id: string) => {
    const target = layers.find(l => l.id === id);
    if (target) updateLayerById(id, { locked: !target.locked });
  };

  const handleToggleVisibility = (id: string) => {
    const target = layers.find(l => l.id === id);
    if (target) updateLayerById(id, { visible: target.visible === false ? true : false });
  };

  // Dragging logic on the canvas
  const handleCanvasLayerPointerDown = (e: React.PointerEvent, layer: CanvasLayer) => {
    // Always select the layer on pointer down!
    setSelectedLayerId(layer.id);
    setActiveTab('edit');

    if (layer.locked) return; // Don't drag if locked

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    setIsDraggingLayer(true);
    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      layerX: layer.x ?? 50,
      layerY: layer.y ?? 50
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingLayer || !selectedLayerId || !canvasViewportRef.current) return;

    const layer = layers.find(l => l.id === selectedLayerId);
    if (!layer || layer.locked) return;

    const rect = canvasViewportRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = e.clientX - dragStartPosRef.current.x;
    const deltaY = e.clientY - dragStartPosRef.current.y;

    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    const newX = Math.round(Math.max(0, Math.min(100, dragStartPosRef.current.layerX + deltaXPercent)) * 10) / 10;
    const newY = Math.round(Math.max(0, Math.min(100, dragStartPosRef.current.layerY + deltaYPercent)) * 10) / 10;

    setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, x: newX, y: newY } : l));
  };

  const handleCanvasPointerUp = () => {
    if (isDraggingLayer) {
      setIsDraggingLayer(false);
      pushHistory(layers);
    }
  };

  // GIF Search API handler
  const handleSearchGifs = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingGifs(true);
    try {
      const res = await fetch(`/api/search-gifs?q=${encodeURIComponent(query)}&limit=24`);
      if (res.ok) {
        const data = await res.json();
        setGifResults(data.results || data.gifs || []);
      } else {
        // Fallback placeholder GIFs
        setGifResults([
          { id: '1', title: 'Rocket Blast Off', media_formats: { gif: { url: 'https://media.giphy.com/media/mi6t83UrR5MI8/giphy.gif' } } },
          { id: '2', title: 'Moon Orbit', media_formats: { gif: { url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif' } } },
          { id: '3', title: 'Space Astronaut', media_formats: { gif: { url: 'https://media.giphy.com/media/3o7btXkbsV26U95Uly/giphy.gif' } } }
        ]);
      }
    } catch (e) {
      setGifResults([]);
    } finally {
      setIsSearchingGifs(false);
    }
  };

  const handleSelectGif = (gifUrl: string) => {
    if (gifTargetLayerId) {
      updateLayerById(gifTargetLayerId, { content: gifUrl, type: 'image' });
      setGifTargetLayerId(null);
    } else {
      handleAddLayer('image', gifUrl);
    }
    setShowGifModal(false);
  };

  // Save & Test Trigger
  const handleSave = () => {
    const finalCmd: CommandConfig = {
      id: commandId || `cmd-canvas-${Date.now()}`,
      command: triggerCommand.trim().replace(/^!/, '') || 'overlay',
      displayName: displayName.trim() || 'Visual Canvas Trigger',
      description: description.trim() || 'Created with Visual Canvas Studio',
      category: category || 'custom',
      color: '#00f0ff',
      soundEnabled,
      duration: Number(duration) || 7.0,
      scale: 1.0,
      cooldown: Number(cooldown) || 5,
      isStatic,
      isCustom: true,
      spriteStyle: 'canvas_layers',
      layers,
      canvasBg
    };

    onSaveTrigger(finalCmd);
  };

  const handleTestTrigger = () => {
    const testCmd: CommandConfig = {
      id: commandId || `cmd-test-${Date.now()}`,
      command: triggerCommand.trim().replace(/^!/, '') || 'moon',
      displayName: displayName.trim() || 'Visual Canvas Trigger',
      description: description.trim(),
      category: 'custom',
      color: '#00f0ff',
      soundEnabled,
      duration: Number(duration) || 7.0,
      scale: 1.0,
      cooldown: 5,
      isStatic,
      isCustom: true,
      spriteStyle: 'canvas_layers',
      layers,
      canvasBg
    };

    if (onTestTrigger) onTestTrigger(testCmd);
  };

  if (!isOpen) return null;

  const currentBgOption = CANVAS_BG_OPTIONS.find(b => b.id === canvasBg) || CANVAS_BG_OPTIONS[0];

  const TAB_DEFS = [
    { id: 'add', label: 'Add Sources', icon: Plus },
    { id: 'edit', label: 'Edit Sources', icon: SlidersHorizontal },
    { id: 'behaviors', label: 'Behaviors', icon: Activity },
    { id: 'transitions', label: 'Transitions', icon: Clock },
    { id: 'spec', label: 'Trigger Spec', icon: Settings },
  ] as const;

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full h-full max-w-[1600px] max-h-[96vh] bg-[#0c121e] border border-cyan-500/40 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-gray-200"
      >
        {/* STUDIO TOP HEADER BAR */}
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0f172a] via-[#111c2e] to-[#0f172a] border-b border-cyan-500/30 flex items-center justify-between gap-4 shrink-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-white truncate">Visual Canvas Studio</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold">
                  !{triggerCommand.replace(/^!/, '') || 'moon'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[10px] font-bold border border-gray-700">
                  {layers.length} {layers.length === 1 ? 'Source' : 'Sources'}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{displayName || 'Moon Horizon & Rocket'}</p>
            </div>
          </div>

          {/* TOP ACTION CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* UNDO / REDO */}
            <div className="hidden sm:flex items-center bg-gray-900/80 border border-gray-800 rounded-xl p-0.5">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
                title="Undo (Ctrl+Z)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition"
                title="Redo (Ctrl+Y)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* TEST TRIGGER ON STAGE */}
            <button
              onClick={handleTestTrigger}
              className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Test Fire Trigger on Live Stream Stage"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Test Stage</span>
            </button>

            {/* SAVED OVERLAY TRIGGERS LIBRARY BUTTON (REQUESTED REQUIREMENT) */}
            <button
              onClick={() => setShowSavedLibraryModal(true)}
              className="px-3 sm:px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Open Saved Canvas Overlays Library"
            >
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <span>Saved Canvases</span>
            </button>

            {/* SAVE OVERLAY TRIGGER BUTTON */}
            <button
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-black text-xs transition shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Overlay Trigger</span>
            </button>

            {/* CLOSE STUDIO */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition ml-1"
              title="Close Visual Canvas Studio"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: LEFT CANVAS STAGE + RIGHT DYNAMIC TABBED PANEL */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
          
          {/* LEFT: 16:9 STAGE CANVAS VIEWPORT COLUMN */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#070b12] border-b lg:border-b-0 lg:border-r border-gray-800/80 relative overflow-hidden">
            
            {/* CANVAS TOOLBAR (CONTAINED CLEANLY INSIDE STAGE VIEWPORT) */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#0e1420] border-b border-gray-800 text-xs text-gray-300 select-none shrink-0 z-20">
              {/* PLAYBACK CONTROLS & SCRUBBER */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => {
                    if (isPlaying) {
                      setIsPlaying(false);
                    } else {
                      if (currentTime >= duration) setCurrentTime(0);
                      setIsPlaying(true);
                    }
                  }}
                  className={`p-2 rounded-xl transition flex items-center gap-1.5 font-bold ${
                    isPlaying ? 'bg-amber-500 text-black' : 'bg-cyan-500 text-black hover:bg-cyan-400'
                  }`}
                  title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-[11px] hidden sm:inline">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                  title="Reset Playhead"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                  <span className="text-cyan-300 font-bold">{currentTime.toFixed(1)}s</span>
                  <span>/</span>
                  <span>{duration.toFixed(1)}s</span>
                </div>
              </div>

              {/* STAGE BACKDROP PICKER & INFO */}
              <div className="flex items-center gap-2 shrink-0">
                {/* BACKGROUND PICKER POPOVER */}
                <div className="relative">
                  <button
                    onClick={() => setShowBgDropdown(prev => !prev)}
                    className="px-3 py-1.5 rounded-xl bg-gray-800/90 hover:bg-gray-700/90 border border-gray-700 text-gray-200 text-xs font-bold transition flex items-center gap-2"
                  >
                    <currentBgOption.icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">{currentBgOption.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {showBgDropdown && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-72 bg-[#0c121e] border border-cyan-500/40 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] p-2 z-50 max-h-80 overflow-y-auto custom-scrollbar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Canvas Background</div>
                      <div className="space-y-1">
                        {CANVAS_BG_OPTIONS.map((bg) => {
                          const Icon = bg.icon;
                          const isSel = bg.id === canvasBg;
                          return (
                            <button
                              key={bg.id}
                              onClick={() => {
                                setCanvasBg(bg.id);
                                setShowBgDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition ${
                                isSel ? 'bg-cyan-500/20 text-white border border-cyan-400/40' : 'hover:bg-gray-800/80 text-gray-300'
                              }`}
                            >
                              <div className="p-1.5 rounded-lg bg-black/50 border border-gray-700 shrink-0">
                                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold truncate">{bg.name}</div>
                                <div className="text-[10px] text-gray-400 truncate">{bg.desc}</div>
                              </div>
                              {isSel && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* QUICK DESELECT / SELECTION BADGE */}
                {selectedLayer && (
                  <button
                    onClick={() => setSelectedLayerId(null)}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold hover:bg-cyan-900/60 transition flex items-center gap-1.5"
                    title="Deselect Active Source"
                  >
                    <span>Selected:</span>
                    <span className="text-white max-w-[100px] truncate">{selectedLayer.name}</span>
                    <XIcon className="w-3 h-3 text-cyan-400" />
                  </button>
                )}
              </div>
            </div>

            {/* 16:9 INTERACTIVE STAGE VIEWPORT CONTAINER */}
            <div 
              className="flex-1 p-3 sm:p-6 flex items-center justify-center overflow-hidden relative cursor-crosshair select-none"
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onClick={() => {
                if (showBgDropdown) setShowBgDropdown(false);
              }}
            >
              {/* 16:9 ASPECT RATIO BOX */}
              <div 
                ref={canvasViewportRef}
                className={`w-full max-w-[1100px] aspect-video rounded-2xl shadow-2xl relative overflow-hidden border-2 transition-all ${
                  currentBgOption.class
                } ${canvasBg === 'checker' ? 'bg-[#0a0f18] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]' : ''} border-cyan-500/30`}
                style={currentBgOption.style}
                onContextMenu={(e) => {
                  e.preventDefault();
                  // If right-clicked directly on stage background with no layer selected
                  if (e.target === canvasViewportRef.current) {
                    setSelectedLayerId(null);
                  }
                }}
                onPointerDown={(e) => {
                  if (e.target === canvasViewportRef.current) {
                    setSelectedLayerId(null);
                  }
                }}
              >
                {/* STAGE GRID OVERLAY HELPER */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="w-full h-full grid grid-cols-6 grid-rows-6 border border-cyan-500/20" />
                </div>

                {/* ACTIVE LAYERS ON STAGE */}
                {layers.filter(l => l.visible !== false).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((layer) => {
                  const isSel = layer.id === selectedLayerId;
                  const posX = layer.x ?? 50;
                  const posY = layer.y ?? 50;

                  // Animation / Behavior class
                  let animClass = '';
                  if (layer.animEffect === 'wobble') animClass = 'anim-layer-wobble';
                  else if (layer.animEffect === 'breath') animClass = 'anim-layer-breath';
                  else if (layer.animEffect === 'bounce') animClass = 'anim-layer-bounce';
                  else if (layer.animEffect === 'float') animClass = 'anim-layer-float';
                  else if (layer.animEffect === 'pulse') animClass = 'anim-layer-pulse';
                  else if (layer.animEffect === 'sway') animClass = 'anim-layer-sway';
                  else if (layer.animEffect === 'spin') animClass = 'anim-layer-spin';
                  else if (layer.animEffect === 'glitch') animClass = 'anim-layer-glitch';
                  else if (layer.animEffect === 'fade') animClass = 'anim-layer-fade';

                  return (
                    <div
                      key={layer.id}
                      id={`canvas-layer-${layer.id}`}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        handleCanvasLayerPointerDown(e, layer);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLayerId(layer.id);
                        setActiveTab('edit');
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedLayerId(layer.id);
                        setContextMenu({
                          isOpen: true,
                          x: e.clientX,
                          y: e.clientY,
                          layer
                        });
                      }}
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: isSel ? 999 : (layer.zIndex || 1),
                        cursor: layer.locked ? 'pointer' : 'grab'
                      }}
                      className={`absolute select-none transition-shadow group ${
                        isSel 
                          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black/50 shadow-[0_0_25px_rgba(0,240,255,0.6)]' 
                          : 'hover:ring-1 hover:ring-cyan-400/60'
                      }`}
                    >
                      {/* RENDER LAYER CONTENT ACCORDING TO TYPE */}
                      <div 
                        className={`pointer-events-none ${animClass}`}
                        style={{
                          transform: `scale(${layer.scale ?? 1.0}) rotate(${layer.rotation ?? 0}deg)`,
                          opacity: layer.opacity ?? 1.0
                        }}
                      >
                        {layer.type === 'emoji' && (
                          <div 
                            style={{ 
                              fontSize: `${layer.fontSize || 64}px`,
                              filter: layer.shadowColor ? `drop-shadow(0 0 ${layer.shadowBlur || 15}px ${layer.shadowColor})` : undefined,
                              lineHeight: 1
                            }}
                            className="select-none text-center"
                          >
                            {layer.content || '🌕'}
                          </div>
                        )}

                        {layer.type === 'text' && (
                          <div 
                            style={{ 
                              fontSize: `${layer.fontSize || 28}px`,
                              fontWeight: layer.fontWeight || '800',
                              fontFamily: layer.fontFamily || 'Inter, sans-serif',
                              color: layer.textColor || '#ffffff',
                              textShadow: layer.shadowColor ? `0 0 ${layer.shadowBlur || 15}px ${layer.shadowColor}` : undefined,
                              lineHeight: 1.2
                            }}
                            className="whitespace-pre-wrap text-center px-2"
                          >
                            {layer.content || 'Text Element'}
                          </div>
                        )}

                        {layer.type === 'image' && (
                          <img 
                            src={layer.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'}
                            alt={layer.name || 'Source image'}
                            referrerPolicy="no-referrer"
                            style={{
                              width: layer.width ? `${layer.width}px` : 'auto',
                              height: layer.height ? `${layer.height}px` : 'auto',
                              maxWidth: '500px',
                              maxHeight: '400px',
                              objectFit: 'contain',
                              filter: layer.shadowColor ? `drop-shadow(0 0 ${layer.shadowBlur || 15}px ${layer.shadowColor})` : undefined
                            }}
                            className="rounded-xl"
                          />
                        )}

                        {layer.type === 'video' && (
                          <video 
                            src={layer.content}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                              width: layer.width ? `${layer.width}px` : '320px',
                              height: layer.height ? `${layer.height}px` : 'auto'
                            }}
                            className="rounded-xl"
                          />
                        )}

                        {layer.type === 'html' && (
                          <div 
                            dangerouslySetInnerHTML={{ __html: layer.content || '' }}
                          />
                        )}
                      </div>

                      {/* SELECTION OVERLAY TAG WITH COORDINATES & LOCK INDICATOR */}
                      {isSel && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-cyan-400 text-[10px] text-cyan-300 font-mono font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5 pointer-events-none z-50">
                          {layer.locked && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                          <span>{layer.name}</span>
                          <span className="text-gray-400">({posX}%, {posY}%)</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: DYNAMIC TABBED CONTROLS PANEL */}
          <div className="w-full lg:w-[460px] xl:w-[490px] flex flex-col bg-[#0e1420] shrink-0 border-l border-gray-800 overflow-hidden z-10">
            
            {/* TAB BUTTONS BAR (FIXED CONTRAST & NO OVERLAP WITH TOOLBAR) */}
            <div className="px-3 py-2 bg-[#090d16] border-b border-gray-800 grid grid-cols-5 gap-1 shrink-0">
              {TAB_DEFS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-cyan-200'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/80 border border-transparent font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-gray-400'}`} />
                    <span className="truncate w-full text-center tracking-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS CONTAINER */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar">
              
              {/* TAB 1: ADD SOURCES */}
              {activeTab === 'add' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add Sources to Canvas</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Click any source type to spawn it onto your overlay stage.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAddLayer('text', 'STREAM OVERLAY')}
                      className="p-3.5 rounded-2xl bg-[#131b2c] hover:bg-[#18233a] border border-cyan-500/30 text-left transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Type className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-cyan-400 font-bold font-mono">+ADD</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Text Message</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Custom font, color & glow</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleAddLayer('emoji', '🌕')}
                      className="p-3.5 rounded-2xl bg-[#131b2c] hover:bg-[#18233a] border border-amber-500/30 text-left transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Smile className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-amber-400 font-bold font-mono">+ADD</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Emoji / Sticker</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Scaleable emojis & icons</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setGifTargetLayerId(null);
                        setShowGifModal(true);
                        handleSearchGifs('space rocket');
                      }}
                      className="p-3.5 rounded-2xl bg-[#131b2c] hover:bg-[#18233a] border border-purple-500/30 text-left transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Search className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-purple-400 font-bold font-mono">+GIF</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Search GIFs</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Browse animated GIFs</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleAddLayer('image')}
                      className="p-3.5 rounded-2xl bg-[#131b2c] hover:bg-[#18233a] border border-emerald-500/30 text-left transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ImageIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-bold font-mono">+IMAGE</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Image URL / File</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WebP transparent</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleAddLayer('video')}
                      className="p-3.5 rounded-2xl bg-[#131b2c] hover:bg-[#18233a] border border-sky-500/30 text-left transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <VideoIcon className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-sky-400 font-bold font-mono">+VIDEO</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Video Clip</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">MP4, WebM looped video</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleAddLayer('html')}
                      className="p-3.5 rounded-2xl bg-[#131b2c] hover:bg-[#18233a] border border-rose-500/30 text-left transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Code className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-rose-400 font-bold font-mono">+HTML</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Custom HTML / CSS</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Custom HTML code snippet</div>
                      </div>
                    </button>
                  </div>

                  {/* QUICK EMOJI SPAWN PALETTE */}
                  <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800">
                    <div className="text-xs font-bold text-white mb-2">Quick Spawn Emojis</div>
                    <div className="grid grid-cols-8 gap-2">
                      {DEFAULT_EMOJI_LIST.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddLayer('emoji', emoji)}
                          className="w-8 h-8 rounded-xl bg-gray-800/80 hover:bg-cyan-500/20 hover:scale-110 text-lg flex items-center justify-center transition"
                          title={`Add ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EDIT SOURCES */}
              {activeTab === 'edit' && (
                <div className="space-y-5">
                  {/* LAYERS LIST OVERVIEW */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                        <span>Sources List ({layers.length})</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('add')}
                        className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Source</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {layers.map((l) => {
                        const isSel = l.id === selectedLayerId;
                        return (
                          <div
                            key={l.id}
                            onClick={() => setSelectedLayerId(l.id)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setSelectedLayerId(l.id);
                              setContextMenu({
                                isOpen: true,
                                x: e.clientX,
                                y: e.clientY,
                                layer: l
                              });
                            }}
                            className={`px-3 py-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              isSel 
                                ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm' 
                                : 'bg-[#131b2c] border-gray-800 text-gray-300 hover:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xs font-mono font-bold text-cyan-400">Z{l.zIndex || 1}</span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">{l.name || l.type}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">{l.type}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleVisibility(l.id);
                                }}
                                className="p-1 text-gray-400 hover:text-white"
                                title={l.visible === false ? 'Show' : 'Hide'}
                              >
                                {l.visible === false ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLock(l.id);
                                }}
                                className="p-1 text-gray-400 hover:text-white"
                                title={l.locked ? 'Unlock' : 'Lock'}
                              >
                                {l.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLayer(l.id);
                                }}
                                className="p-1 text-red-400 hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE LAYER PROPERTY CONTROLS */}
                  {selectedLayer ? (
                    <div className="p-4 rounded-2xl bg-[#111827] border border-cyan-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                        <div className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                          Edit: {selectedLayer.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDuplicateLayer(selectedLayer.id)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLayer(selectedLayer.id)}
                            className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* NAME INPUT */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">Source Name</label>
                        <input
                          type="text"
                          value={selectedLayer.name || ''}
                          onChange={(e) => updateSelectedLayer({ name: e.target.value })}
                          className="w-full bg-[#0c121e] border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      {/* CONTENT INPUT */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">
                          {selectedLayer.type === 'emoji' ? 'Emoji' : selectedLayer.type === 'text' ? 'Text String' : 'Content / URL'}
                        </label>
                        {selectedLayer.type === 'emoji' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={selectedLayer.content || ''}
                              onChange={(e) => updateSelectedLayer({ content: e.target.value })}
                              className="flex-1 bg-[#0c121e] border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-lg text-center text-white"
                            />
                            <div className="flex gap-1">
                              {['🌕', '🚀', '⭐', '🔥', '👑'].map(em => (
                                <button
                                  key={em}
                                  onClick={() => updateSelectedLayer({ content: em })}
                                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm flex items-center justify-center"
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : selectedLayer.type === 'text' ? (
                          <textarea
                            value={selectedLayer.content || ''}
                            onChange={(e) => updateSelectedLayer({ content: e.target.value })}
                            rows={2}
                            className="w-full bg-[#0c121e] border border-gray-700 focus:border-cyan-400 rounded-xl p-2.5 text-xs text-white font-sans"
                          />
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={selectedLayer.content || ''}
                              onChange={(e) => updateSelectedLayer({ content: e.target.value })}
                              className="w-full bg-[#0c121e] border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                            />
                            {selectedLayer.type === 'image' && (
                              <button
                                onClick={() => {
                                  setGifTargetLayerId(selectedLayer.id);
                                  setShowGifModal(true);
                                  handleSearchGifs('space');
                                }}
                                className="w-full py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
                              >
                                <Search className="w-3.5 h-3.5" />
                                <span>Search & Replace GIF</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* POSITION (X, Y) */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Position X (%)</span>
                            <span className="text-cyan-400">{selectedLayer.x ?? 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={selectedLayer.x ?? 50}
                            onChange={(e) => updateSelectedLayer({ x: parseFloat(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Position Y (%)</span>
                            <span className="text-cyan-400">{selectedLayer.y ?? 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={selectedLayer.y ?? 50}
                            onChange={(e) => updateSelectedLayer({ y: parseFloat(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>

                      {/* SCALE & ROTATION */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Scale</span>
                            <span className="text-cyan-400">{(selectedLayer.scale ?? 1.0).toFixed(2)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="3.0"
                            step="0.05"
                            value={selectedLayer.scale ?? 1.0}
                            onChange={(e) => updateSelectedLayer({ scale: parseFloat(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Rotation</span>
                            <span className="text-cyan-400">{selectedLayer.rotation ?? 0}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={selectedLayer.rotation ?? 0}
                            onChange={(e) => updateSelectedLayer({ rotation: parseInt(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>

                      {/* FONT SIZE (FOR TEXT / EMOJI) */}
                      {(selectedLayer.type === 'emoji' || selectedLayer.type === 'text') && (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Size (px)</span>
                            <span className="text-cyan-400">{selectedLayer.fontSize || 32}px</span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="450"
                            step="2"
                            value={selectedLayer.fontSize || 32}
                            onChange={(e) => updateSelectedLayer({ fontSize: parseInt(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      )}

                      {/* GLOW / SHADOW */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-400 block mb-1">Glow Color</label>
                          <input
                            type="color"
                            value={selectedLayer.shadowColor || '#00f0ff'}
                            onChange={(e) => updateSelectedLayer({ shadowColor: e.target.value })}
                            className="w-full h-8 bg-transparent cursor-pointer rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Glow Radius</span>
                            <span className="text-cyan-400">{selectedLayer.shadowBlur ?? 15}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            step="1"
                            value={selectedLayer.shadowBlur ?? 15}
                            onChange={(e) => updateSelectedLayer({ shadowBlur: parseInt(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                      <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <div className="text-xs font-bold">No Source Selected</div>
                      <p className="text-[11px] text-gray-500 mt-1">Left-click any layer on the stage canvas or list above to edit.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BEHAVIORS */}
              {activeTab === 'behaviors' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span>Loop Motion Behaviors</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Apply continuous animated behaviors to your active source.</p>
                  </div>

                  {selectedLayer ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2.5">
                        {MOTION_EFFECT_PRESETS.map((preset) => {
                          const Icon = preset.icon;
                          const isSel = (selectedLayer.animEffect || 'none') === preset.id;
                          return (
                            <button
                              key={preset.id}
                              onClick={() => updateSelectedLayer({ animEffect: preset.id as any })}
                              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                                isSel 
                                  ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                  : 'bg-[#131b2c] border-gray-800 text-gray-300 hover:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Icon className={`w-4 h-4 ${isSel ? 'text-emerald-400 animate-spin' : 'text-gray-400'}`} />
                                {isSel && <span className="text-[10px] text-emerald-400 font-bold font-mono">ACTIVE</span>}
                              </div>
                              <div>
                                <div className="text-xs font-bold">{preset.label}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{preset.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {selectedLayer.animEffect && selectedLayer.animEffect !== 'none' && (
                        <div className="p-4 rounded-2xl bg-[#111827] border border-emerald-500/30 space-y-3">
                          <div className="text-xs font-bold text-emerald-300">Behavior Motion Tuning</div>
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                              <span>Animation Speed</span>
                              <span className="text-emerald-400">{selectedLayer.animSpeed ?? 1.5}s</span>
                            </div>
                            <input
                              type="range"
                              min="0.3"
                              max="5.0"
                              step="0.1"
                              value={selectedLayer.animSpeed ?? 1.5}
                              onChange={(e) => updateSelectedLayer({ animSpeed: parseFloat(e.target.value) })}
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <div className="text-xs font-bold">Select a Source to Tune Behaviors</div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: TRANSITIONS */}
              {activeTab === 'transitions' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Timing & Transitions</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Control entrance & exit timing for every layer.</p>
                  </div>

                  {selectedLayer ? (
                    <div className="p-4 rounded-2xl bg-[#111827] border border-amber-500/30 space-y-4">
                      <div className="text-xs font-bold text-amber-300">{selectedLayer.name} Transitions</div>

                      {/* ENTRANCE ANIMATION */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">Entrance Transition</label>
                        <select
                          value={selectedLayer.enterAnimation || 'fade'}
                          onChange={(e) => updateSelectedLayer({ enterAnimation: e.target.value as any })}
                          className="w-full bg-[#0c121e] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="fade">Fade In</option>
                          <option value="slide-down">Slide Down (From Top)</option>
                          <option value="slide-up">Slide Up (From Bottom)</option>
                          <option value="slide-left">Slide In Left</option>
                          <option value="slide-right">Slide In Right</option>
                          <option value="scale-up">Pop / Scale Up</option>
                          <option value="none">Instant (No Transition)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Start Time</span>
                            <span className="text-amber-400">{(selectedLayer.enterTime ?? 0).toFixed(1)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            step="0.1"
                            value={selectedLayer.enterTime ?? 0}
                            onChange={(e) => updateSelectedLayer({ enterTime: parseFloat(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                            <span>Enter Duration</span>
                            <span className="text-amber-400">{(selectedLayer.enterDuration ?? 0.5).toFixed(1)}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={selectedLayer.enterDuration ?? 0.5}
                            onChange={(e) => updateSelectedLayer({ enterDuration: parseFloat(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                      </div>

                      <div className="h-[1px] bg-gray-800" />

                      {/* EXIT ANIMATION */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">Exit Transition</label>
                        <select
                          value={selectedLayer.exitAnimation || 'fade'}
                          onChange={(e) => updateSelectedLayer({ exitAnimation: e.target.value as any })}
                          className="w-full bg-[#0c121e] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="fade">Fade Out</option>
                          <option value="slide-up">Slide Out Top</option>
                          <option value="slide-down">Slide Out Bottom</option>
                          <option value="none">Instant</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <div className="text-xs font-bold">Select a Source to Tune Transitions</div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TRIGGER SPEC */}
              {activeTab === 'spec' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <span>Trigger Metadata & OBS Settings</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Configure command name, duration, and persistence.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 block mb-1">Chat Trigger Command</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-cyan-400">!</span>
                        <input
                          type="text"
                          value={triggerCommand.replace(/^!/, '')}
                          onChange={(e) => setTriggerCommand(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                          placeholder="moon"
                          className="w-full bg-[#0c121e] border border-gray-700 focus:border-cyan-400 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-400 block mb-1">Display Title</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Moon Horizon & Rocket"
                        className="w-full bg-[#0c121e] border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                          <span>Duration</span>
                          <span className="text-cyan-400">{duration}s</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="30"
                          step="0.5"
                          value={duration}
                          onChange={(e) => setDuration(parseFloat(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
                          <span>Cooldown</span>
                          <span className="text-cyan-400">{cooldown}s</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          step="1"
                          value={cooldown}
                          onChange={(e) => setCooldown(parseInt(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Static Overlay (Stays on screen)</span>
                      <input
                        type="checkbox"
                        checked={isStatic}
                        onChange={(e) => setIsStatic(e.target.checked)}
                        className="w-4 h-4 accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT-CLICK CONTEXT MENU WINDOW (REQUESTED REQUIREMENT) */}
      <CanvasContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        layer={contextMenu.layer}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (contextMenu.layer) setSelectedLayerId(contextMenu.layer.id);
        }}
        onDuplicate={handleDuplicateLayer}
        onBringToFront={handleBringToFront}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onSendToBack={handleSendToBack}
        onToggleLock={handleToggleLock}
        onToggleVisibility={handleToggleVisibility}
        onCenterHorizontal={(id) => updateLayerById(id, { x: 50 })}
        onCenterVertical={(id) => updateLayerById(id, { y: 50 })}
        onOpenGifSearch={(id) => {
          setGifTargetLayerId(id);
          setShowGifModal(true);
          handleSearchGifs('space');
        }}
        onDelete={handleDeleteLayer}
      />

      {/* SAVED CANVASES LIBRARY MODAL (REQUESTED REQUIREMENT) */}
      <SavedCanvasesModal
        isOpen={showSavedLibraryModal}
        onClose={() => setShowSavedLibraryModal(false)}
        commands={commands}
        currentCommandId={commandId}
        onLoadCanvas={(cmd) => {
          setCommandId(cmd.id || `cmd-${Date.now()}`);
          setTriggerCommand(cmd.command || 'custom_overlay');
          setDisplayName(cmd.displayName || 'Custom Canvas Overlay');
          setDescription(cmd.description || '');
          setDuration(cmd.duration || 7.0);
          setCooldown(cmd.cooldown || 5);
          setIsStatic(!!cmd.isStatic);
          setCanvasBg((cmd.canvasBg || (cmd as any).canvasBackground || 'checker') as CanvasBgType);
          if (cmd.layers && cmd.layers.length > 0) {
            setLayers(cmd.layers);
            setSelectedLayerId(cmd.layers[0]?.id || null);
            setHistory([cmd.layers]);
            setHistoryIndex(0);
          }
        }}
        onTestCanvas={onTestTrigger}
        onDuplicateCanvas={(cmd) => {
          const cloned: CommandConfig = {
            ...cmd,
            id: `cmd-canvas-${Date.now()}`,
            command: `${cmd.command}_copy`,
            displayName: `${cmd.displayName} (Copy)`,
            isCustom: true
          };
          onSaveTrigger(cloned);
        }}
        onDeleteCanvas={onDeleteTrigger}
        onNewBlankCanvas={() => {
          setCommandId(`cmd-blank-${Date.now()}`);
          setTriggerCommand('new_canvas');
          setDisplayName('New Blank Canvas Overlay');
          setDescription('');
          setDuration(5.0);
          setCanvasBg('dark');
          setLayers([]);
          setSelectedLayerId(null);
          setHistory([[]]);
          setHistoryIndex(0);
          setActiveTab('add');
        }}
      />

      {/* GIF SEARCH POPUP MODAL */}
      {showGifModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#0c121e] border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
            <div className="p-4 bg-[#111827] border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Search Animated GIFs</h3>
              </div>
              <button 
                onClick={() => setShowGifModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#090d16] border-b border-gray-800 flex gap-2">
              <input
                type="text"
                value={gifSearchQuery}
                onChange={(e) => setGifSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchGifs(gifSearchQuery)}
                placeholder="Search GIFs (e.g. space, meme, reaction)..."
                className="flex-1 bg-[#111827] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                onClick={() => handleSearchGifs(gifSearchQuery)}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold"
              >
                Search
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {isSearchingGifs ? (
                <div className="py-12 flex justify-center items-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : gifResults.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {gifResults.map((gif, idx) => {
                    const url = gif.media_formats?.gif?.url || gif.url || gif.images?.fixed_height?.url;
                    if (!url) return null;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectGif(url)}
                        className="group relative rounded-xl overflow-hidden aspect-square border border-gray-800 hover:border-purple-400 transition"
                      >
                        <img 
                          src={url} 
                          alt={gif.title || 'GIF'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500 text-xs">
                  Search for animated GIFs to add to your stage.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
"""

with open('src/components/VisualCanvasTriggerBuilder.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("VisualCanvasTriggerBuilder.tsx updated successfully!")
