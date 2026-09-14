import re

with open("src/components/Dashboard.tsx", "r") as f:
    content = f.read()

# Add autoHideTopBar to context menu
search = """        onCloseBgMenu={() => setShowBgContextMenu(false)}
        stageBgType={stageBgType}"""

replace = """        onCloseBgMenu={() => setShowBgContextMenu(false)}
        autoHideTopBar={autoHideTopBar}
        onToggleAutoHideTopBar={() => setAutoHideTopBar(prev => !prev)}
        stageBgType={stageBgType}"""

if search in content:
    content = content.replace(search, replace)
    print("Patched Dashboard.tsx props")

with open("src/components/Dashboard.tsx", "w") as f:
    f.write(content)

