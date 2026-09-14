import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

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

pattern = r"\s*\{\/\* Test Trigger Preview \*\/}\s*\{onTestTrigger && \(\s*<button[^>]*>.*?<span className=\"hidden sm:inline\">Test Alert</span>\s*</button>\s*\)\}"
content = re.sub(pattern, "\n" + toolbar_replace, content, flags=re.DOTALL)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
