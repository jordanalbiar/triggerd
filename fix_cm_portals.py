import re

with open('src/components/CommandManager.tsx', 'r') as f:
    content = f.read()

# Add a state to trigger a re-render when mounted.
# I'll add `const [portalReady, setPortalReady] = useState(false); useEffect(() => { setPortalReady(true); }, []);`

# Let's search for `const [showPrefixAccordion, setShowPrefixAccordion] = useState<boolean>(false);`
state_line = "const [showPrefixAccordion, setShowPrefixAccordion] = useState<boolean>(false);"
if state_line in content:
    content = content.replace(state_line, state_line + "\n  const [portalReady, setPortalReady] = useState<boolean>(false);\n  useEffect(() => {\n    setPortalReady(true);\n  }, []);")
else:
    print("Could not find showPrefixAccordion state.")

# Replace the conditional checks to also use `portalReady`.
# Actually, since it's just `document.getElementById` and we re-render after mount, `portalReady` is just to trigger the second render.
# So if we change `document.getElementById` to `(portalReady && document.getElementById)`
content = content.replace("document.getElementById('cmd-prefix-indicator-portal')", "(portalReady && document.getElementById('cmd-prefix-indicator-portal'))")
content = content.replace("document.getElementById('cmd-prefix-accordion-portal')", "(portalReady && document.getElementById('cmd-prefix-accordion-portal'))")

with open('src/components/CommandManager.tsx', 'w') as f:
    f.write(content)
