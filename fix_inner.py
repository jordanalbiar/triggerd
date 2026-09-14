import re

with open('src/components/DashboardContextMenus.tsx', 'r') as f:
    content = f.read()

# I will find all instances of `\n                )}\n              </div>\n              {activeTab ===`
# and remove the `\n                )}` part.

content = re.sub(r'\}\)\s*</div>\s*\{activeTab ===', r'</div>\n                {activeTab ===', content)

# I can also just find `)}` that shouldn't be there. Let's write a targeted replace.
# The `__TOOLBAR__` ended up containing `</AnimatePresence>` or something? No, it extracted `inner = raw[start:end]`
# The end of the block in original was:
#               </div>
#             </motion.div>
#           </>
#         )}
#       </AnimatePresence>
# So if `raw.rfind('</motion.div>')` was found, `inner` ends right before it.
# Wait, `raw` was the whole section.
# `start` was the `<div className="space-y...` inside the motion div.
# `end` was `raw.rfind('</motion.div>')`
# So `inner` includes everything up to `</motion.div>`.
# This is correct for JSX, there's no `)}` inside `inner`!
# Let's inspect line 530 to 540.
