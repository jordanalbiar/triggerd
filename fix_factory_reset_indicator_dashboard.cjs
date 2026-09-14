const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  'const [previewSystemNotification, setPreviewSystemNotification] = useState<AlertPayload | null>(null);',
  `const [previewSystemNotification, setPreviewSystemNotification] = useState<AlertPayload | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem('triggerd_reset_success') === '1') {
        localStorage.removeItem('triggerd_reset_success');
        setTimeout(() => {
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
        }, 1500); // Slight delay for it to pop up cleanly after load
      }
    } catch(e) {}
  }, []);`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
