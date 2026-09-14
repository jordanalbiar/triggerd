import re

with open("src/components/VisualCanvasTriggerBuilder.tsx", "r") as f:
    content = f.read()

search_str = """                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Keyframe</span>
                      </button>
                    </div>"""

replace_str = """                        <Plus className="w-3.5 h-3.5" />
                        <span>{selectedKeyframe?.transitionType && selectedKeyframe.transitionType !== 'move' ? '+ Transition' : '+ Keyframe'}</span>
                      </button>
                    </div>"""

if search_str in content:
    content = content.replace(search_str, replace_str)
    with open("src/components/VisualCanvasTriggerBuilder.tsx", "w") as f:
        f.write(content)
    print("Patched transition button label")
else:
    print("Could not find transition button label")
