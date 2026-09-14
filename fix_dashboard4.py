import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace any other occurrences of `<div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">` 
# that are NOT in the CommandManager modal with `<div className="p-6 overflow-y-auto">`

# Actually, I can just replace them all to `<div className="p-6 overflow-y-auto">`
content = content.replace('<div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">', '<div className="p-6 overflow-y-auto">')

# Then inject it ONLY after the CommandManager modal title
# Let's find:
# <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
#                       Preset Commands & Overlay Trigger Lines
#                       ...
# </div>

# Oh wait, we already added `cmd-prefix-indicator-portal` into the title bar right side earlier. We can just add the nav bar portal and prefix accordion portal above the `<div className="p-6 overflow-y-auto">` for this specific modal.
# Where is this modal body?
# Let's find it.
m = re.search(r'Preset Commands & Overlay Trigger Lines[\s\S]*?<div className="p-6 overflow-y-auto">', content)
if m:
    matched = m.group(0)
    replaced = matched.replace('<div className="p-6 overflow-y-auto">', '<div id="cmd-nav-bar-portal"></div><div id="cmd-prefix-accordion-portal"></div><div className="p-6 overflow-y-auto">')
    content = content.replace(matched, replaced)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

