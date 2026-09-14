const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const hookStr = `
  const [isSystemSleeping, setIsSystemSleeping] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('triggerd_sleep_state', String(isSystemSleeping));
      const ch = new BroadcastChannel('triggerd_sleep_channel');
      ch.postMessage({ type: 'sleep_state', isSleeping });
      setTimeout(() => ch.close(), 100);
    } catch(e) {}
  }, [isSystemSleeping]);
`;

dash = dash.replace('const [isSystemSleeping, setIsSystemSleeping] = useState<boolean>(false);', hookStr);
fs.writeFileSync('src/components/Dashboard.tsx', dash);
