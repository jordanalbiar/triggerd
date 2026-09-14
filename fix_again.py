import re

with open('/tmp/menu.tsx', 'r') as f:
    text = f.read()

# I need to add `)}` right before:
# {activeTab === 'background'
# {activeTab === 'panel'
# {activeTab === 'edit_source'
# {activeTab === 'permissions'
# {activeTab === 'add_sources'

for tab in ['background', 'panel', 'edit_source', 'permissions', 'add_sources']:
    # Replace `</div>\n                {activeTab === 'xyz'` 
    # With `</div>\n              )}\n              {activeTab === 'xyz'`
    text = re.sub(r'(</div>\s*)\{activeTab === \'' + tab + '\'', r'\1)}\n              {activeTab === \'' + tab + '\'', text)

with open('src/components/DashboardContextMenus.tsx', 'w') as f:
    f.write(text)

