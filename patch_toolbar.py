import re

with open('src/components/Dashboard.tsx', 'r') as f:
    text = f.read()

text = re.sub(
    r'(const newSource = \{ \.\.\.target.*?\}\n\s*)(handleSetStaticSourcesWithHistory\(prev => \[.*?\]\);)',
    r'\1handleSetStaticSourcesWithHistory(prev => prev.some(s => s.id === newSource.id) ? prev : [...prev, newSource]);',
    text,
    flags=re.DOTALL
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(text)

