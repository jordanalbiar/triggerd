import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

content = content.replace("                  )}\n                </div>\n              )}\n              )}",
                          "                  )}\n                </div>\n              )}")

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
