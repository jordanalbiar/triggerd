import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

default_layers = """[
      {
        id: 'layer-stars',
        type: 'emoji',
        name: 'Space Stars',
        content: '✨',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        zIndex: 1,
        scale: 1.0,
        fontSize: 300,
        shadowColor: '#ffffff',
        shadowBlur: 10,
        animEffect: 'breathe',
        animIntensity: 20,
        animSpeed: 3.0,
        visible: true,
        locked: true,
        fullScale: true,
        keyframes: [
          { id: 'kf-stars-1', frameIndex: 0, timeSec: 0, x: -50, y: 50, scale: 1.0, rotation: 0, opacity: 1, intensity: 50 },
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
          { id: 'kf-moon-4', frameIndex: 3, timeSec: 7.0, x: 50, y: 50, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-5', frameIndex: 4, timeSec: 12.0, x: 50, y: 50, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
          { id: 'kf-moon-6', frameIndex: 5, timeSec: 17.0, x: 50, y: 150, scale: 4.0, rotation: 0, opacity: 1, intensity: 50 },
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
          { id: 'kf-rocket-1', frameIndex: 0, timeSec: 0, x: 50, y: 120, scale: 1.2, rotation: 0, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-1b', frameIndex: 1, timeSec: 2.0, x: 50, y: 50, scale: 1.2, rotation: 0, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-2', frameIndex: 2, timeSec: 5.0, x: 50, y: 50, scale: 1.2, rotation: 0, opacity: 1, intensity: 100 },
          { id: 'kf-rocket-3', frameIndex: 3, timeSec: 7.0, x: 50, y: 50, scale: 0.6, rotation: -45, opacity: 1, intensity: 0 },
          { id: 'kf-rocket-4', frameIndex: 4, timeSec: 12.0, x: 50, y: 50, scale: 0.6, rotation: -45, opacity: 1, intensity: 0 },
          { id: 'kf-rocket-5', frameIndex: 5, timeSec: 17.0, x: 50, y: 150, scale: 0.6, rotation: -45, opacity: 1, intensity: 0 },
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
    ]"""

reload_search = """                        onClick={() => {
                          // This is basically reloading the component or clearing and importing the default
                          if (confirm("Load default preset? Current canvas will be overwritten.")) {
                             window.location.reload(); // Simple way to reset state to default
                          }
                        }}"""

reload_replace = f"""                        onClick={{() => {{
                          if (confirm("Load default preset? Current canvas will be overwritten.")) {{
                             setLayers({default_layers});
                             setTriggerCommand('myalert');
                             setDisplayName('Visual Alert');
                             setDuration(27);
                             setTotalTimelineDuration(27);
                             setCurrentTime(0);
                             setSelectedLayerId(null);
                             setSelectedKeyframeId(null);
                             setShowDraftsModal(false);
                          }}
                        }}}}"""

content = content.replace(reload_search, reload_replace)

with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
    f.write(content)

