import re

with open('src/components/CommandManager.tsx', 'r') as f:
    content = f.read()

# Remove the portal start
portal_start = """      {/* Portaled Navigation Bar */}
      {document.getElementById('cmd-nav-bar-portal') && createPortal(
"""
content = content.replace(portal_start, "")

# The header bar we changed to:
header_new = """              <div className="flex items-center justify-between w-full p-2 bg-[#020b18] border-b border-[#003865] font-mono shadow-inner">
                
        <div className="flex w-full items-center justify-between gap-4 px-2">"""
header_old = """      {/* Header Controls Bar */}
      <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-brand-border/20 font-mono">
        
        {/* Toolbar Above: Copy AI Prompt, Import, Export, Reset, Add Custom Trigger */}
        <div className="flex flex-col gap-4 p-3 bg-[#020b18] border border-[#003865] rounded-2xl shadow-inner">"""
content = content.replace(header_new, header_old)

# We also changed "flex items-center gap-2" back to "flex flex-wrap items-center justify-center gap-2" and gap-4 etc.
# Actually, I don't need to revert the exact UI, I just need to remove the closing portal at line 1420!

# Let's find:
closing_portal = """          </div>,
        document.getElementById('cmd-nav-bar-portal')!
      )}
            )}"""

closing_fixed = """          </div>
        </div>
      </div>"""
content = content.replace(closing_portal, closing_fixed)

with open('src/components/CommandManager.tsx', 'w') as f:
    f.write(content)
