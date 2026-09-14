import re

with open('src/components/DashboardContextMenus.tsx', 'r') as f:
    text = f.read()

# Fix getClampedPos duplicate
# Find the first one and remove it
first_clamp = re.search(r'const getClampedPos = \(pos.*?return \{ left:.*?top:.*?\};\s*\}', text, re.DOTALL)
if first_clamp:
    text = text[:first_clamp.start()] + text[first_clamp.end():]

# In the injected tabs, find the extra `</div>\n                )}`
# And replace with `</div>`
# I will use a regex to fix the unmatched closing tags.
text = re.sub(r'</button>\s*</div>\s*</div>\s*</div>\s*\}\)', r'</button>\n              </div>', text, flags=re.DOTALL)

# Let's just fix the exact lines by running a formatting pass.
# Wait, let's just find the `)}` that are orphaned before `{activeTab ===`
text = re.sub(r'\)\}\s*(\{activeTab ===)', r'\n              \1', text)

# And fix the end of the file:
# Currently it ends with:
#                 </div>
#               )}
#             </div>
#           </motion.div>
#         </>
#       )}
#     </AnimatePresence>
#   );
# };
# But if there's an extra `)}` before `</div>\n            </motion.div>`, let's remove it.
text = re.sub(r'\)\}\s*</div>\s*</motion\.div>', r'</div>\n            </motion.div>', text)

# Just to be safe, I'll print the result of the regexes
with open('src/components/DashboardContextMenus.tsx', 'w') as f:
    f.write(text)

