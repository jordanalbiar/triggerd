import re

with open('src/utils/staticOverlayStore.ts', 'r') as f:
    text = f.read()

# Change saveStaticSources signature
text = re.sub(
    r'export const saveStaticSources = \(sources: StaticOverlaySource\[\], immediateServerSync: boolean = false\): void => \{',
    r'export const saveStaticSources = (sources: StaticOverlaySource[], immediateServerSync: boolean = false, skipCustomEvent: boolean = false): void => {',
    text
)

# Change dispatch custom event
text = re.sub(
    r'(\s*// 2\. Dispatch custom event for current window\s*try \{)(\s*window\.dispatchEvent\(new CustomEvent\(STATIC_SOURCES_CHANGED_EVENT, \{ detail: sources \}\)\);)(\s*\} catch \(eventErr\) \{)',
    r'\1\n    if (!skipCustomEvent) {\n      window.dispatchEvent(new CustomEvent(STATIC_SOURCES_CHANGED_EVENT, { detail: sources }));\n    }\n\3',
    text
)

with open('src/utils/staticOverlayStore.ts', 'w') as f:
    f.write(text)

