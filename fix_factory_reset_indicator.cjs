const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Inside Dashboard.tsx useEffect for mount, check localStorage
code = code.replace(
  'const params = new URLSearchParams(window.location.search);',
  `const params = new URLSearchParams(window.location.search);
    try {
      if (localStorage.getItem('triggerd_reset_success') === '1') {
        localStorage.removeItem('triggerd_reset_success');
        setPreviewSystemNotification({
          id: \`sys-\${Date.now()}\`,
          timestamp: new Date().toLocaleTimeString(),
          username: 'System',
          message: 'Factory Reset Complete. All settings restored to defaults.',
          command: 'reset_success',
          type: 'system',
          duration: 4,
          platform: 'Dashboard'
        });
      }
    } catch(e) {}
`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);

let settings = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');
settings = settings.replace(
  /document\.cookie = name \+ "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=\/";\n\s*\}\n\s*\} catch \(e\) \{\}\n\s*window\.location\.href = window\.location\.origin \+ window\.location\.pathname;\n\s*\}/g,
  `document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                       }
                     } catch (e) {}
                     localStorage.setItem('triggerd_reset_success', '1');
                     window.location.href = window.location.origin + window.location.pathname;
                   }`
);
fs.writeFileSync('src/components/SettingsModal.tsx', settings);

