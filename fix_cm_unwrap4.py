import re
with open('src/components/CommandManager.tsx', 'r') as f:
    content = f.read()

# I want to find the exact line 1418 which has </div>\n</div>\n</div> and replace it with </div>\n</div>\n)}
# To be safe, I'll search for the context around it:
target = """                style={{
                  backgroundColor: 'var(--theme-card-alt, #0a2540)',
                  borderColor: 'var(--theme-border, #003865)',
                  color: 'var(--theme-text-main, #ffffff)'
                }}
              />
            </div>
          </div>
</div>
</div>
</div>"""

replacement = """                style={{
                  backgroundColor: 'var(--theme-card-alt, #0a2540)',
                  borderColor: 'var(--theme-border, #003865)',
                  color: 'var(--theme-text-main, #ffffff)'
                }}
              />
            </div>
          </div>
          </div>
        )}"""

# Since spacing might be different, let's use regex:
content = re.sub(r'color: \'var\(--theme-text-main, #ffffff\)\'\s*\}\}\s*\/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>',
                 r"color: 'var(--theme-text-main, #ffffff)'\n                }}\n              />\n            </div>\n          </div>\n        </div>\n      )}",
                 content)

with open('src/components/CommandManager.tsx', 'w') as f:
    f.write(content)
