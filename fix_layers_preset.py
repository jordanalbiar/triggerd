import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

# 1. Update initial totalTimelineDuration
content = content.replace("const [totalTimelineDuration, setTotalTimelineDuration] = useState<number>(15.0);",
                          "const [totalTimelineDuration, setTotalTimelineDuration] = useState<number>(27.0);")

new_layers = """    return [
      {
        id: 'layer-stars',
        type: 'custom',
        name: 'Flying Stars',
        content: '<div style="position:absolute;top:10%;left:20%;font-size:24px;">⭐</div><div style="position:absolute;top:70%;left:80%;font-size:18px;">⭐</div><div style="position:absolute;top:20%;left:50%;font-size:28px;">⭐</div><div style="position:absolute;top:80%;left:10%;font-size:20px;">⭐</div><div style="position:absolute;top:30%;left:90%;font-size:26px;">⭐</div><div style="position:absolute;top:50%;left:30%;font-size:16px;">⭐</div><div style="position:absolute;top:90%;left:60%;font-size:30px;">⭐</div><div style="position:absolute;top:40%;left:10%;font-size:22px;">⭐</div><div style="position:absolute;top:15%;left:75%;font-size:14px;">⭐</div><div style="position:absolute;top:60%;left:45%;font-size:25px;">⭐</div><div style="position:absolute;top:85%;left:35%;font-size:19px;">⭐</div><div style="position:absolute;top:5%;left:95%;font-size:27px;">⭐</div><div style="position:absolute;top:55%;left:5%;font-size:21px;">⭐</div>',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fullScale: true,
        zIndex: 1,
        scale: 1.0,
        visible: true,
        locked: false,
        keyframes: [
          { id: 'kf-stars-1', frameIndex: 0, timeSec: 0, x: 150, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-stars-2', frameIndex: 1, timeSec: 5.0, x: -50, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-stars-3', frameIndex: 2, timeSec: 5.1, x: -50, y: 50, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 },
        ]
      },
      {
        id: 'layer-moon',
        type: 'emoji',
        name: 'Moon Emoji',
        content: '🌕',
        x: 50,
        y: 50,
        width: 25,
        height: 25,
        zIndex: 2,
        scale: 1.0,
        fontSize: 64,
        shadowColor: '#fef08a',
        shadowBlur: 20,
        visible: true,
        locked: false,
        keyframes: [
          { id: 'kf-moon-1', frameIndex: 0, timeSec: 0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-2', frameIndex: 1, timeSec: 4.9, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-moon-3', frameIndex: 2, timeSec: 5.0, x: 50, y: 50, scale: 0.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-4', frameIndex: 3, timeSec: 7.0, x: 50, y: 50, scale: 7.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-5', frameIndex: 4, timeSec: 12.0, x: 50, y: 50, scale: 7.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-6', frameIndex: 5, timeSec: 17.0, x: 50, y: 150, scale: 7.0, rotation: 0, opacity: 1, intensity: 50 },
        ]
      },
      {
        id: 'layer-rocket',
        type: 'emoji',
        name: 'Rocket Emoji',
        content: '🚀',
        x: 50,
        y: 50,
        width: 25,
        height: 25,
        zIndex: 3,
        scale: 1.2,
        fontSize: 64,
        shadowColor: '#00f0ff',
        shadowBlur: 25,
        animEffect: 'wobble',
        animIntensity: 100,
        visible: true,
        locked: false,
        keyframes: [
          { id: 'kf-rocket-1', frameIndex: 0, timeSec: 0, x: 50, y: 50, scale: 1.2, rotation: 0, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-2', frameIndex: 1, timeSec: 5.0, x: 50, y: 50, scale: 1.2, rotation: 0, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-3', frameIndex: 2, timeSec: 7.0, x: 44, y: 38, scale: 1.2, rotation: -45, opacity: 1, intensity: 0 },
          { id: 'kf-rocket-4', frameIndex: 3, timeSec: 12.0, x: 44, y: 38, scale: 1.2, rotation: -45, opacity: 1, intensity: 0 },
          { id: 'kf-rocket-5', frameIndex: 4, timeSec: 17.0, x: 44, y: 138, scale: 1.2, rotation: -45, opacity: 1, intensity: 0 },
        ]
      },
      {
        id: 'layer-quote',
        type: 'text',
        name: 'Quote Text',
        content: '"Help others go beyond where you have gone." - Buzz Aldrin',
        x: 50,
        y: 50,
        width: 90,
        height: 30,
        zIndex: 4,
        scale: 1.0,
        fontSize: 32,
        fontFamily: 'Inter, sans-serif',
        textColor: '#ffffff',
        shadowColor: '#00f0ff',
        shadowBlur: 15,
        visible: true,
        locked: false,
        keyframes: [
          { id: 'kf-quote-1', frameIndex: 0, timeSec: 0, x: 50, y: -20, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-quote-2', frameIndex: 1, timeSec: 16.9, x: 50, y: -20, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 },
          { id: 'kf-quote-3', frameIndex: 2, timeSec: 17.0, x: 50, y: -20, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-quote-4', frameIndex: 3, timeSec: 18.0, x: 50, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-quote-5', frameIndex: 4, timeSec: 27.0, x: 50, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
        ]
      }
    ];"""

pattern = r"    return \[\n      \{\n        id: 'layer-stars',.*?\n    \];"
content = re.sub(pattern, new_layers, content, flags=re.DOTALL)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
