import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# 1. Update initial totalTimelineDuration
content = content.replace("const [totalTimelineDuration, setTotalTimelineDuration] = useState<number>(15.0);",
                          "const [totalTimelineDuration, setTotalTimelineDuration] = useState<number>(27.0);")

# 2. Update default layers
search_layers = """    // Default initial layers with rich keyframe support
    return [
      {
        id: 'layer-stars',"""

# We'll just replace the whole default state down to `] as CanvasLayer[];` or similar.
# Wait, let's look for the end of the layers array.
