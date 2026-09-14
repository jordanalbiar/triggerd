import re

with open('src/components/DashboardContextMenus.tsx', 'r') as f:
    content = f.read()

# Remove duplicate getClampedPos
# We can find the old getClampedPos and remove it. It was around line 307.
#   const getClampedPos = (pos: ContextMenuPosition, width = 340, height = 520) => {
# ...
#   };
old_get_clamped = re.search(r'const getClampedPos = \(pos: ContextMenuPosition.*?return \{ left:.*?top:.*?px` \};\s*\}', content, re.DOTALL)
if old_get_clamped:
    content = content[:old_get_clamped.start()] + content[old_get_clamped.end():]

# In the injected tabs, remove the rogue `)}` inside the content blocks.
# Those were caused by my extraction including the end of the `showBgMenu && (` block.
# We'll just look for `)}` right before `</div>\n                {activeTab === 'panel'` etc.
content = re.sub(r'\}\)\s*</div>\s*\{activeTab ===', r'</div>\n                {activeTab ===', content)

# But they were at the end of the inner blocks. Let's just fix the specific ones manually using regex based on the error output:
# Line 533: )}
# Line 579: )}
# Line 637: )}
content = re.sub(r'</AnimatePresence>\s*\}\)\s*</div>', r'</div>', content, flags=re.DOTALL)
# It's actually probably `)}` inside the replaced __TOOLBAR__ etc.

# Let's just restore the file and do it cleaner using React editing.
