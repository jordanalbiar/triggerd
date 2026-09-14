import re
with open('src/components/CommandManager.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'<\/div>,\s*document\.getElementById\(\'cmd-nav-bar-portal\'\)!\s*\)\}\s*\)\}', r'</div>\n</div>\n</div>', content)

with open('src/components/CommandManager.tsx', 'w') as f:
    f.write(content)
