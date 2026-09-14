const fs = require('fs');
let code = fs.readFileSync('src/components/AdvanceCodeTriggerEditor.tsx', 'utf8');

const replacement = `const hasCustomCode = formState.customHtml || formState.customCss || formState.customJs;

  return (
    <div className="flex flex-col md:flex-row h-[600px] bg-[#020b18] text-white font-mono text-xs overflow-hidden">`;

code = code.replace(/return \(\s*<div className="flex flex-col md:flex-row h-\[600px\] bg-\[#020b18\] text-white font-mono text-xs overflow-hidden">/, replacement);

const previewSection = `<div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
          <div 
            className="relative bg-transparent border border-zinc-800/50 overflow-hidden shadow-2xl"
            style={{ 
              width: '100%', 
              aspectRatio: '16/9',
              maxHeight: '100%',
              backgroundColor: '#000000',
              backgroundImage: 'radial-gradient(#111 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}
          >
            {hasCustomCode ? (
              <SpriteOverlayRenderer
                alert={{
                  id: 'preview-live-1',
                  command: formState.command || 'test',
                  username: 'TestUser',
                  message: 'This is a test message!',
                  customMessage: formState.customMessage,
                  mediaUrl: formState.mediaUrl,
                  mediaType: formState.mediaType || 'none',
                  color: formState.color || '#00f0ff',
                  sound: false,
                  duration: formState.duration || 5,
                  scale: formState.scale || 1.0,
                  animationStyle: formState.animationStyle || 'breath',
                  animationSpeed: formState.animationSpeed || 1.5,
                  customHtml: formState.customHtml,
                  customCss: formState.customCss,
                  customJs: formState.customJs
                }}
                isStagePreview={true}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                  <Monitor className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-500 font-bold max-w-xs">Input custom HTML, CSS, or JS code before preview can be displayed.</p>
              </div>
            )}
          </div>
        </div>`;

code = code.replace(/<div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, previewSection + "\n      </div>\n    </div>");

fs.writeFileSync('src/components/AdvanceCodeTriggerEditor.tsx', code);
