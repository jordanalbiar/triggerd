import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

content = content.replace("              {activeInspectorTab === 'keyframes' && (\n              {!isStaticOverlay && (",
                          "              {activeInspectorTab === 'keyframes' && !isStaticOverlay && (")

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
