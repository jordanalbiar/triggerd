with open("src/components/InitialPermissionGate.tsx", "r") as f:
    content = f.read()

search = """      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 bg-[#020b18] text-white font-mono select-none overflow-y-auto"
    >
      {/* Ambient background grid & glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.12)_0%,#020b18_80%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#00f0ff_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />"""

replace = """      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-white font-mono select-none overflow-y-auto"
    >"""

content = content.replace(search, replace)
with open("src/components/InitialPermissionGate.tsx", "w") as f:
    f.write(content)
