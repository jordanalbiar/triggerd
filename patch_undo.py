import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# 1. Add imports if needed. We need `useRef` (already imported from react).
# Wait, let's verify `useRef` is in the imports.
if "useRef" not in content:
    content = content.replace("import { useState", "import { useState, useRef")

# 2. Add history state after layers state
layers_state_end = "const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);"

history_code = """
  // Undo/Redo History State
  const [history, setHistory] = useState<CanvasLayer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isHistoryUpdate = useRef(false);

  useEffect(() => {
    if (history.length === 0 && layers.length > 0) {
      setHistory([layers]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    if (isHistoryUpdate.current) {
      isHistoryUpdate.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      setHistory(prev => {
        const currState = prev[historyIndex];
        if (JSON.stringify(currState) !== JSON.stringify(layers)) {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(layers);
          if (newHistory.length > 50) newHistory.shift();
          const nextIndex = newHistory.length - 1;
          setHistoryIndex(nextIndex);
          return newHistory;
        }
        return prev;
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [layers, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryUpdate.current = true;
      const prevIndex = historyIndex - 1;
      setLayers(history[prevIndex]);
      setHistoryIndex(prevIndex);
      setSelectedLayerId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryUpdate.current = true;
      const nextIndex = historyIndex + 1;
      setLayers(history[nextIndex]);
      setHistoryIndex(nextIndex);
      setSelectedLayerId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

"""

if "const [history," not in content:
    content = content.replace(layers_state_end, layers_state_end + "\n" + history_code)

# 3. Add Undo/Redo buttons to toolbar and remove Test Alert button
toolbar_search = """            {/* Test Alert Simulation */}
            {!isStaticOverlay && (
              <button
                type="button"
                onClick={() => onTestTrigger(buildCommandConfigObject())}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Test Alert</span>
              </button>
            )}"""

toolbar_replace = """            {/* Undo / Redo */}
            <div className="flex items-center gap-1 mr-2 border-r pr-3" style={{ borderColor: 'var(--theme-border, #003865)' }}>
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg border text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer bg-black/40"
                style={{ borderColor: 'var(--theme-border, #003865)' }}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg border text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer bg-black/40"
                style={{ borderColor: 'var(--theme-border, #003865)' }}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>"""

if toolbar_search in content:
    content = content.replace(toolbar_search, toolbar_replace)
else:
    print("Could not find toolbar_search string")

# Fix missing lucide icons import for Undo2 and Redo2
import_lucide = "import { Play, Pause, FastForward, Rewind, Maximize2, Move, Type, Image, Video, MonitorUp, Focus, Sparkles, Sliders, Settings2, Trash2, Zap, ArrowLeft, ArrowRight, MousePointer2, Info, Share2, MousePointerClick, Smartphone, Copy, X, Plus, Layers, Grid, FileCode2, ChevronRight, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';"
import_lucide_new = "import { Play, Pause, FastForward, Rewind, Maximize2, Move, Type, Image, Video, MonitorUp, Focus, Sparkles, Sliders, Settings2, Trash2, Zap, ArrowLeft, ArrowRight, MousePointer2, Info, Share2, MousePointerClick, Smartphone, Copy, X, Plus, Layers, Grid, FileCode2, ChevronRight, PlayCircle, StopCircle, RefreshCw, Undo2, Redo2 } from 'lucide-react';"
content = content.replace(import_lucide, import_lucide_new)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
