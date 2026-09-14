import re

with open("src/components/Dashboard.tsx", "r") as f:
    content = f.read()

# Make sure Dashboard handles hotkeys cleanly
search = """      // Ctrl+Z / Cmd+Z (Undo)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoStaticSources();
      }
      // Ctrl+Y or Ctrl+Shift+Z (Redo)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redoStaticSources();
      }"""

replace = """      // Ctrl+Z / Cmd+Z (Undo)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        // Only prevent default if we're not inside the visual canvas builder modal
        if (!document.getElementById('visual-canvas-modal')) {
          e.preventDefault();
          undoStaticSources();
        }
      }
      // Ctrl+Y or Ctrl+Shift+Z (Redo)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        if (!document.getElementById('visual-canvas-modal')) {
          e.preventDefault();
          redoStaticSources();
        }
      }"""

content = content.replace(search, replace)
with open("src/components/Dashboard.tsx", "w") as f:
    f.write(content)
