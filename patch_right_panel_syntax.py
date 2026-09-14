import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

content = content.replace("              {activeInspectorTab === 'keyframes' && (\n              {!isStaticOverlay && (",
                          "              {activeInspectorTab === 'keyframes' && !isStaticOverlay && (")

# And let's check the end of the keyframes section.
