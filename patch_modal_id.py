with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

content = content.replace(
    """    <div className="fixed inset-0 z-[120] flex items-center justify-center p-1 sm:p-3 bg-black/85 backdrop-blur-md overflow-hidden font-mono text-xs text-white select-none">""",
    """    <div id="visual-canvas-modal" className="fixed inset-0 z-[120] flex items-center justify-center p-1 sm:p-3 bg-black/85 backdrop-blur-md overflow-hidden font-mono text-xs text-white select-none">"""
)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
