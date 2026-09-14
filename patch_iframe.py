import re

with open("src/components/StaticOverlayRenderer.tsx", "r") as f:
    content = f.read()

# Let's just find the start of the iframe srcDoc style and insert the variables
search_pattern = r"(<style>\s*body, html \{)"

replace_str = r"""<style>
    :root {
      --theme-bg: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-bg') || '#020b18' : '#020b18'};
      --theme-card: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-card') || '#04182e' : '#04182e'};
      --theme-border: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-border') || '#003865' : '#003865'};
      --theme-accent: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-accent') || '#00f0ff' : '#00f0ff'};
      --theme-accent-glow: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-accent-glow') || 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.5)'};
      --theme-text-main: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-text-main') || '#ffffff' : '#ffffff'};
      --theme-text-muted: ${typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--theme-text-muted') || '#94a3b8' : '#94a3b8'};
    }
    body, html {"""

content = re.sub(search_pattern, replace_str, content)

with open("src/components/StaticOverlayRenderer.tsx", "w") as f:
    f.write(content)

