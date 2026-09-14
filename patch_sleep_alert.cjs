const fs = require('fs');

let ao = fs.readFileSync('src/components/AlertOverlay.tsx', 'utf8');

const importStr = `
import { SystemSleepOverlay } from './SystemSleepOverlay';
`;

ao = ao.replace("import { AlertPayload, StreamType } from '../types';", "import { AlertPayload, StreamType } from '../types';\n" + importStr);

const hookStr = `
  const [isSystemSleeping, setIsSystemSleeping] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('triggerd_sleep_state') === 'true';
    }
    return false;
  });

  useEffect(() => {
    let ch;
    try {
      ch = new BroadcastChannel('triggerd_sleep_channel');
      ch.onmessage = (e) => {
        if (e.data && e.data.type === 'sleep_state') {
          setIsSystemSleeping(e.data.isSleeping);
        }
      };
    } catch(e) {}
    return () => {
      if (ch) ch.close();
    };
  }, []);

  if (isSystemSleeping) {
    return (
      <div className="w-full h-full min-h-screen relative overflow-hidden bg-transparent">
        <SystemSleepOverlay isSleeping={true} onWake={() => {}} />
      </div>
    );
  }
`;

// Insert the hook inside the component, right after const activeOverlayStackRef = useRef<string[]>([]); or similar early on.
ao = ao.replace("const processedIdsRef = useRef<Set<string>>(new Set());", hookStr + "\n  const processedIdsRef = useRef<Set<string>>(new Set());");

fs.writeFileSync('src/components/AlertOverlay.tsx', ao);
