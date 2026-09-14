import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

stars_html = '<div style="position:absolute;top:30%;left:62%;font-size:25px;">⭐</div><div style="position:absolute;top:45%;left:7%;font-size:21px;">⭐</div><div style="position:absolute;top:18%;left:20%;font-size:8px;">⭐</div><div style="position:absolute;top:65%;left:13%;font-size:19px;">⭐</div><div style="position:absolute;top:48%;left:59%;font-size:9px;">⭐</div><div style="position:absolute;top:74%;left:53%;font-size:26px;">⭐</div><div style="position:absolute;top:99%;left:92%;font-size:25px;">⭐</div><div style="position:absolute;top:96%;left:79%;font-size:19px;">⭐</div><div style="position:absolute;top:80%;left:31%;font-size:8px;">⭐</div><div style="position:absolute;top:48%;left:12%;font-size:9px;">⭐</div><div style="position:absolute;top:90%;left:77%;font-size:26px;">⭐</div><div style="position:absolute;top:97%;left:72%;font-size:25px;">⭐</div><div style="position:absolute;top:61%;left:57%;font-size:18px;">⭐</div><div style="position:absolute;top:72%;left:30%;font-size:17px;">⭐</div><div style="position:absolute;top:73%;left:85%;font-size:11px;">⭐</div><div style="position:absolute;top:3%;left:96%;font-size:14px;">⭐</div><div style="position:absolute;top:8%;left:90%;font-size:17px;">⭐</div><div style="position:absolute;top:20%;left:14%;font-size:13px;">⭐</div><div style="position:absolute;top:1%;left:52%;font-size:27px;">⭐</div><div style="position:absolute;top:73%;left:44%;font-size:8px;">⭐</div><div style="position:absolute;top:2%;left:49%;font-size:26px;">⭐</div><div style="position:absolute;top:80%;left:84%;font-size:13px;">⭐</div><div style="position:absolute;top:25%;left:36%;font-size:9px;">⭐</div><div style="position:absolute;top:57%;left:68%;font-size:22px;">⭐</div><div style="position:absolute;top:82%;left:96%;font-size:16px;">⭐</div><div style="position:absolute;top:5%;left:37%;font-size:23px;">⭐</div><div style="position:absolute;top:13%;left:29%;font-size:11px;">⭐</div><div style="position:absolute;top:87%;left:33%;font-size:20px;">⭐</div><div style="position:absolute;top:19%;left:19%;font-size:25px;">⭐</div><div style="position:absolute;top:85%;left:41%;font-size:13px;">⭐</div><div style="position:absolute;top:8%;left:22%;font-size:26px;">⭐</div><div style="position:absolute;top:75%;left:83%;font-size:21px;">⭐</div><div style="position:absolute;top:72%;left:48%;font-size:22px;">⭐</div><div style="position:absolute;top:58%;left:63%;font-size:29px;">⭐</div><div style="position:absolute;top:15%;left:24%;font-size:13px;">⭐</div><div style="position:absolute;top:59%;left:59%;font-size:26px;">⭐</div><div style="position:absolute;top:64%;left:56%;font-size:10px;">⭐</div><div style="position:absolute;top:91%;left:11%;font-size:22px;">⭐</div><div style="position:absolute;top:12%;left:100%;font-size:13px;">⭐</div><div style="position:absolute;top:52%;left:86%;font-size:15px;">⭐</div><div style="position:absolute;top:60%;left:16%;font-size:24px;">⭐</div><div style="position:absolute;top:44%;left:63%;font-size:25px;">⭐</div><div style="position:absolute;top:35%;left:90%;font-size:27px;">⭐</div><div style="position:absolute;top:37%;left:9%;font-size:19px;">⭐</div><div style="position:absolute;top:98%;left:80%;font-size:14px;">⭐</div><div style="position:absolute;top:74%;left:38%;font-size:11px;">⭐</div><div style="position:absolute;top:70%;left:68%;font-size:19px;">⭐</div><div style="position:absolute;top:1%;left:91%;font-size:28px;">⭐</div><div style="position:absolute;top:57%;left:35%;font-size:16px;">⭐</div><div style="position:absolute;top:10%;left:46%;font-size:18px;">⭐</div>'

# Pattern to replace everything in the default array definition:
# We look for "return [" ... "];" in the useState of setLayers.
pattern = re.compile(r"return \[\n\s+\{\n\s+id: 'layer-stars'[\s\S]*?\n\s+\}\n\s+\];", re.MULTILINE)

replacement = f"""return [
      {{
        id: 'layer-stars',
        type: 'custom',
        name: 'Flying Stars',
        content: '{stars_html}',
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
          {{ id: 'kf-stars-1', frameIndex: 0, timeSec: 0, x: 150, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-stars-2', frameIndex: 1, timeSec: 8.0, x: -150, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-stars-3', frameIndex: 2, timeSec: 8.1, x: -150, y: 50, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 }},
        ]
      }},
      {{
        id: 'layer-rocket',
        type: 'emoji',
        name: 'Rocket Emoji',
        content: '🚀',
        x: 50,
        y: 50,
        width: 25,
        height: 25,
        zIndex: 3,
        scale: 1.5,
        fontSize: 64,
        shadowColor: '#00f0ff',
        shadowBlur: 25,
        animEffect: 'wobble',
        animIntensity: 100,
        visible: true,
        locked: false,
        keyframes: [
          {{ id: 'kf-rocket-1', frameIndex: 0, timeSec: 0, x: -20, y: 50, scale: 1.5, rotation: 45, opacity: 1, intensity: 100 }},
          {{ id: 'kf-rocket-2', frameIndex: 1, timeSec: 3.0, x: 50, y: 50, scale: 1.5, rotation: 45, opacity: 1, intensity: 100 }},
          {{ id: 'kf-rocket-3', frameIndex: 2, timeSec: 8.0, x: 50, y: 50, scale: 1.5, rotation: 45, opacity: 1, intensity: 100 }},
          {{ id: 'kf-rocket-4', frameIndex: 3, timeSec: 8.1, x: 50, y: 50, scale: 1.5, rotation: 45, opacity: 1, intensity: 0 }},
          {{ id: 'kf-rocket-5', frameIndex: 4, timeSec: 10.0, x: 20, y: 50, scale: 1.5, rotation: 45, opacity: 1, intensity: 0 }},
          {{ id: 'kf-rocket-6', frameIndex: 5, timeSec: 13.0, x: 20, y: 50, scale: 1.5, rotation: 45, opacity: 1, intensity: 0 }},
          {{ id: 'kf-rocket-7', frameIndex: 6, timeSec: 16.0, x: 50, y: 50, scale: 1.0, rotation: -45, opacity: 1, intensity: 0 }},
          {{ id: 'kf-rocket-8', frameIndex: 7, timeSec: 19.0, x: 50, y: 150, scale: 1.0, rotation: -45, opacity: 1, intensity: 0 }},
        ]
      }},
      {{
        id: 'layer-moon',
        type: 'emoji',
        name: 'Moon Emoji',
        content: '🌕',
        x: 50,
        y: 50,
        width: 25,
        height: 25,
        zIndex: 2,
        scale: 3.0,
        fontSize: 64,
        shadowColor: '#fef08a',
        shadowBlur: 20,
        visible: true,
        locked: false,
        keyframes: [
          {{ id: 'kf-moon-1', frameIndex: 0, timeSec: 0, x: 150, y: 50, scale: 3.0, rotation: 0, opacity: 0, intensity: 50 }},
          {{ id: 'kf-moon-2', frameIndex: 1, timeSec: 9.9, x: 150, y: 50, scale: 3.0, rotation: 0, opacity: 0, intensity: 50 }},
          {{ id: 'kf-moon-3', frameIndex: 2, timeSec: 10.0, x: 150, y: 50, scale: 3.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-moon-4', frameIndex: 3, timeSec: 13.0, x: 50, y: 50, scale: 3.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-moon-5', frameIndex: 4, timeSec: 16.0, x: 50, y: 50, scale: 3.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-moon-6', frameIndex: 5, timeSec: 19.0, x: 50, y: 150, scale: 3.0, rotation: 0, opacity: 1, intensity: 50 }},
        ]
      }},
      {{
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
          {{ id: 'kf-quote-1', frameIndex: 0, timeSec: 0, x: 50, y: -20, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 }},
          {{ id: 'kf-quote-2', frameIndex: 1, timeSec: 15.9, x: 50, y: -20, scale: 1.0, rotation: 0, opacity: 0, intensity: 50 }},
          {{ id: 'kf-quote-3', frameIndex: 2, timeSec: 16.0, x: 50, y: -20, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-quote-4', frameIndex: 3, timeSec: 19.0, x: 50, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 }},
          {{ id: 'kf-quote-5', frameIndex: 4, timeSec: 29.0, x: 50, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 }},
        ]
      }}
    ];"""

content = pattern.sub(replacement, content)

content = content.replace("useState<number>(existingCommand?.duration || 27.0);", "useState<number>(existingCommand?.duration || 29.0);")

# Update export placeholder if there's any duration
content = content.replace("duration: 27.0,", "duration: 29.0,")

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)
