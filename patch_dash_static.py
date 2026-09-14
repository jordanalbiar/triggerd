import re

with open("src/components/Dashboard.tsx", "r") as f:
    content = f.read()

# Replace setStaticSources with handleSetStaticSourcesWithHistory in a few places
content = content.replace("setStaticSources(prev => {\\n      const target = prev.find(s => s.id === id);", "handleSetStaticSourcesWithHistory(prev => {\\n      const target = prev.find(s => s.id === id);")
content = content.replace("setStaticSources(prev => {\\n      const updated = prev.filter(s => s.id !== id);", "handleSetStaticSourcesWithHistory(prev => {\\n      const updated = prev.filter(s => s.id !== id);")
content = content.replace("setStaticSources(prev => prev.filter(s => s.id !== id));", "handleSetStaticSourcesWithHistory(prev => prev.filter(s => s.id !== id));")
content = content.replace("setStaticSources(prev => {\\n      const updated = prev.map(s => {", "handleSetStaticSourcesWithHistory(prev => {\\n      const updated = prev.map(s => {")
content = content.replace("setStaticSources(prev => {\\n      const updated = prev.map(s =>", "handleSetStaticSourcesWithHistory(prev => {\\n      const updated = prev.map(s =>")

with open("src/components/Dashboard.tsx", "w") as f:
    f.write(content)
