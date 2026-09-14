import re

with open('src/components/CommandManager.tsx', 'r') as f:
    content = f.read()

content = content.replace('</div>, document.getElementById("cmd-nav-bar-portal")!)}', '</div>')
content = content.replace('      )}\n    \n            )}\n  \n            ', '      </div>\n      </div>')

with open('src/components/CommandManager.tsx', 'w') as f:
    f.write(content)
