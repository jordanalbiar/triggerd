import subprocess
import os

with open('src/components/Dashboard_temp.tsx', 'r', encoding='utf-8') as f:
    base = f.read()

button_content = """className="px-3 py-1.5 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff] hover:text-black transition cursor-pointer text-xs font-bold border border-[#00f0ff]/30">
  Settings
</button>
</div>
</div>
"""
panel_closing = """
            </motion.div>
          </div>
        )}
      </AnimatePresence>
"""
missing_components = """
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
        onSettingsSaved={() => {}} 
        availableTriggers={triggers} 
        stageBgType={stageBgType} 
        stageBgColor={stageBgColor} 
        stageBgImage={stageBgImage} 
        stageBgIframe={stageBgIframe} 
      />
      <SystemPowerDialog 
        isOpen={showSystemPowerDialog} 
        onClose={() => setShowSystemPowerDialog(false)} 
        onSleep={() => {
          setIsSystemSleeping(true);
          setShowSystemPowerDialog(false);
        }} 
      />
      <SystemSleepOverlay 
        isSleeping={isSystemSleeping} 
        onWake={() => setIsSystemSleeping(false)} 
      />
      <ConfigurationWizard 
        isOpen={showConfigWizard} 
        onClose={() => setShowConfigWizard(false)} 
        onComplete={() => setShowConfigWizard(false)} 
      />
"""

for i in range(15):
    attempt = base + button_content + panel_closing + missing_components + '\n'.join(['</div>'] * i) + '\n    </div>\n  );\n};\n'
    
    with open('src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(attempt)
    
    res = subprocess.run(['npx', 'esbuild', 'src/components/Dashboard.tsx', '--outfile=/dev/null'], capture_output=True, text=True)
    if res.returncode == 0:
        print(f"Success with {i} divs!")
        break
    else:
        print(f"Failed with {i} divs:")
