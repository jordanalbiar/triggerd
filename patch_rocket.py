import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

def replace_stars(match):
    return """        keyframes: [
          { id: 'kf-stars-1', frameIndex: 0, timeSec: 0, x: 150, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-stars-2', frameIndex: 1, timeSec: 27.0, x: -100, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
        ]"""

def replace_moon(match):
    return """        keyframes: [
          { id: 'kf-moon-1', frameIndex: 0, timeSec: 0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-2', frameIndex: 1, timeSec: 2.0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-3', frameIndex: 2, timeSec: 4.0, x: 50, y: 50, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-4', frameIndex: 3, timeSec: 27.0, x: 50, y: 50, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
        ]"""

def replace_rocket(match):
    return """        keyframes: [
          { id: 'kf-rocket-1', frameIndex: 0, timeSec: 0, x: 120, y: 50, scale: 1.5, rotation: -135, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-2', frameIndex: 1, timeSec: 15.0, x: -20, y: 50, scale: 1.5, rotation: -135, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-3', frameIndex: 2, timeSec: 27.0, x: -20, y: 50, scale: 1.5, rotation: -135, opacity: 0, intensity: 0 },
        ]"""

# Replace in both instances (initial state and default layers)
content = re.sub(r"keyframes: \[\s*\{\s*id:\s*'kf-stars-1'[\s\S]*?\]", replace_stars, content)
content = re.sub(r"keyframes: \[\s*\{\s*id:\s*'kf-moon-1'[\s\S]*?\]", replace_moon, content)
content = re.sub(r"keyframes: \[\s*\{\s*id:\s*'kf-rocket-1'[\s\S]*?\]", replace_rocket, content)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
