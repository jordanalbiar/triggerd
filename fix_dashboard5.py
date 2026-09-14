import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# We need to remove:
# <div className="flex-col bg-[#020b18] border-b border-[#003865] w-full" id="cmd-nav-bar-portal"></div>   <div className="p-6 overflow-y-auto">
#       {showPrefixAccordion && (
#         <div className="mb-5 p-4 bg-[#0a2540] border border-[#00f0ff]/50 rounded-xl font-mono text-xs space-y-3.5 shadow-xl">
#           ...
#         </div>
#       )}

pattern = re.compile(r'<div className="flex-col bg-\[#020b18\] border-b border-\[#003865\] w-full" id="cmd-nav-bar-portal"><\/div>\s*<div className="p-6 overflow-y-auto">\s*\{showPrefixAccordion && \([\s\S]*?\}\)', re.MULTILINE)

# wait, there's a `<div className="p-6 overflow-y-auto">` that needs to stay!
# Let's replace the whole match with `<div className="p-6 overflow-y-auto">`
content = pattern.sub('<div className="p-6 overflow-y-auto">', content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

