import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

moon_search = """        keyframes: [
          { id: 'kf-moon-1', frameIndex: 0, timeSec: 0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-2', frameIndex: 1, timeSec: 4.9, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-3', frameIndex: 2, timeSec: 5.0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-4', frameIndex: 3, timeSec: 7.0, x: 50, y: 50, scale: 7.5, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-5', frameIndex: 4, timeSec: 12.0, x: 50, y: 50, scale: 7.5, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-6', frameIndex: 5, timeSec: 17.0, x: 50, y: 150, scale: 7.5, rotation: 0, opacity: 1, intensity: 50 },
        ]"""
moon_replace = """        keyframes: [
          { id: 'kf-moon-1', frameIndex: 0, timeSec: 0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-2', frameIndex: 1, timeSec: 4.9, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-3', frameIndex: 2, timeSec: 5.0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-4', frameIndex: 3, timeSec: 7.0, x: 50, y: 50, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-5', frameIndex: 4, timeSec: 12.0, x: 50, y: 50, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-6', frameIndex: 5, timeSec: 17.0, x: 50, y: 150, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
        ]"""

content = content.replace(moon_search, moon_replace)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
