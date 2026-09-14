import re

with open('src/utils/gridStyles.ts', 'r') as f:
    code = f.read()

code = code.replace("const c = color || '#00f0ff';", "const c = color || '#00f0ff';\n  const mix = (pct: number) => c.startsWith('var') ? `color-mix(in srgb, ${c} ${pct}%, transparent)` : `${c}${pct}`;")

code = code.replace("${c}40", "${mix(40)}")
code = code.replace("${c}45", "${mix(45)}")
code = code.replace("${c}25", "${mix(25)}")
code = code.replace("${c}60", "${mix(60)}")
code = code.replace("${c}30", "${mix(30)}")
code = code.replace("${c}20", "${mix(20)}")
code = code.replace("${c}35", "${mix(35)}")

with open('src/utils/gridStyles.ts', 'w') as f:
    f.write(code)
