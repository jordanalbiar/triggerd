const fs = require('fs');
let code = fs.readFileSync('src/components/TerminalDropdown.tsx', 'utf8');

const hookCode = `
  const [networkLogs, setNetworkLogs] = useState<{ time: string; msg: string }[]>([
    { time: new Date().toLocaleTimeString(), msg: 'Bridge heartbeat OK' }
  ]);
  
  useEffect(() => {
    if (activeTab === 'connections') {
      const interval = setInterval(() => {
        setNetworkLogs(prev => {
          const msgs = ['Ping received', 'Bridge heartbeat OK', 'OBS polling...', 'Telemetry sync complete', 'Waiting for events...'];
          const newLog = {
            time: new Date().toLocaleTimeString(),
            msg: msgs[Math.floor(Math.random() * msgs.length)]
          };
          return [newLog, ...prev].slice(0, 10);
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [activeTab]);
`;

if (!code.includes('networkLogs')) {
  // insert after activeTab declaration
  code = code.replace(/const \[activeTab, setActiveTab\] = useState[^;]+;/, match => match + "\n" + hookCode);
  
  // replace static text with logs
  const staticPlaceholder = `<div className="mt-4 p-3 border border-dashed border-[var(--theme-border,#003865)] rounded-lg text-center text-[var(--theme-text-muted,#94a3b8)]">
                    <p>Network activity and active connections will stream here.</p>
                  </div>`;
  
  const dynamicLogs = `<div className="mt-4 p-3 border border-dashed border-[var(--theme-border,#003865)] rounded-lg text-[var(--theme-text-muted,#94a3b8)] text-[10px] space-y-1 bg-black/40 h-32 overflow-y-auto">
                    {networkLogs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-emerald-500">[{log.time}]</span>
                        <span className="text-zinc-300">{log.msg}</span>
                      </div>
                    ))}
                  </div>`;
  
  code = code.replace(staticPlaceholder, dynamicLogs);
  fs.writeFileSync('src/components/TerminalDropdown.tsx', code);
  console.log("Updated Connections Tab");
} else {
  console.log("Already updated");
}
