import re

with open("src/utils/staticOverlayStore.ts", "r") as f:
    content = f.read()

# I want to replace #00f0ff with var(--theme-accent, #00f0ff)
# and rgba(0, 240, 255, 0.85) with color-mix(in srgb, var(--theme-accent, #00f0ff) 85%, transparent)
# Let's do a smart regex replacement for rgba(0, 240, 255, <opacity>)

def rgba_replacer(match):
    opacity_str = match.group(1)
    try:
        opacity_val = float(opacity_str) * 100
    except:
        return match.group(0)
    return f"color-mix(in srgb, var(--theme-accent, #00f0ff) {opacity_val:g}%, transparent)"

# Only apply to electrical frame. I will split the content and only replace in the electrical frame section.
start_str = "id: 'static-source-default-blue-electrical-frame',"
end_str = "id: 'static-source-default-triggerd-logo',"

if start_str in content and end_str in content:
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    frame_content = content[start_idx:end_idx]
    
    frame_content = frame_content.replace("#00f0ff", "var(--theme-accent, #00f0ff)")
    frame_content = frame_content.replace("rgba(0, 140, 255,", "rgba(0, 240, 255,")
    frame_content = frame_content.replace("rgba(0, 80, 255,", "rgba(0, 240, 255,")
    frame_content = frame_content.replace("rgba(0, 180, 255,", "rgba(0, 240, 255,")
    frame_content = frame_content.replace("rgba(0, 120, 255,", "rgba(0, 240, 255,")
    frame_content = frame_content.replace("rgba(0, 160, 255,", "rgba(0, 240, 255,")
    frame_content = frame_content.replace("rgba(0, 60, 180,", "rgba(0, 240, 255,")
    frame_content = frame_content.replace("rgba(0, 56, 101,", "rgba(0, 240, 255,")

    frame_content = re.sub(r"rgba\(0,\s*240,\s*255,\s*([0-9.]+)\)", rgba_replacer, frame_content)
    
    new_content = content[:start_idx] + frame_content + content[end_idx:]
    with open("src/utils/staticOverlayStore.ts", "w") as f:
        f.write(new_content)

