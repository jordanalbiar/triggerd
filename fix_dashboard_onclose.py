import re

with open('src/components/Dashboard.tsx', 'r') as f:
    code = f.read()

def replacer(match):
    var_name = match.group(1)
    # Determine cmd from var_name
    cmd = 'all'
    if 'Fire' in var_name: cmd = 'fire'
    elif 'Wallpaper' in var_name: cmd = 'wallpaper'
    elif 'Balls' in var_name: cmd = 'balls'
    elif 'Smoke' in var_name: cmd = 'smoke'
    elif 'Rain' in var_name: cmd = 'rain'
    elif 'Weather' in var_name: cmd = 'weather'
    elif 'Time' in var_name: cmd = 'time'
    elif 'Frame' in var_name: cmd = 'frame'
    elif var_name == 'previewAlert': cmd = 'alert'
    elif var_name == 'spriteAlert': cmd = 'sprite'
    
    if cmd == 'all':
        return match.group(0) # fallback
        
    return f"<SpriteOverlayRenderer alert={{{var_name}}} isStagePreview={{true}} onClose={{() => handleForceStopOverlay({var_name}.id, '{cmd}')}} />"

# Find all <SpriteOverlayRenderer alert={VarName} /> or <SpriteOverlayRenderer alert={VarName} isStagePreview={true} /> without onClose
code = re.sub(r'<SpriteOverlayRenderer\s+alert=\{([a-zA-Z0-9_]+)\}\s*(?:isStagePreview=\{true\}\s*)?/>', replacer, code)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(code)
