import re

with open('src/components/StaticSourcesContent.tsx', 'r') as f:
    text = f.read()

replacement = """  const handleUpdateFormField = (updates: Partial<StaticOverlaySource>) => {
    setFormValues(prev => ({ ...prev, ...updates }));
    if (currentMode === 'edit' && selectedSourceId && instantUpdate) {
      onUpdateSource(selectedSourceId, updates);
    }
  };"""

text = re.sub(
    r'const handleUpdateFormField = \(updates: Partial<StaticOverlaySource>\) => \{.*?return next;\s*\}\);\s*\};',
    replacement,
    text,
    flags=re.DOTALL
)

with open('src/components/StaticSourcesContent.tsx', 'w') as f:
    f.write(text)

print("StaticSourcesContent patched.")
