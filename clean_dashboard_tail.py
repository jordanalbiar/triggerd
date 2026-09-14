with open('src/components/Dashboard.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

pos = text.find('{/* Modal: Established Connections Window */}')
if pos == -1:
    pos = text.find('showConnectionsModal &&')

clean_tail = '''{/* Modal: Established Connections Window */}
      <AnimatePresence>
        {showConnectionsModal && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 pointer-events-none overflow-hidden font-mono text-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="pointer-events-auto w-[90vw] max-w-2xl max-h-[85vh] bg-[var(--theme-card,#04182e)] border-2 border-[var(--theme-accent,#00f0ff)] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-[var(--theme-bg,#020b18)] border-b border-[var(--theme-border,#003865)] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--theme-accent-glow,rgba(0,240,255,0.2))] border border-[var(--theme-accent,#00f0ff)] text-[var(--theme-accent,#00f0ff)]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white uppercase tracking-wider">
                      Target Site Connections & Bridge Status
                    </h2>
                    <p className="text-[11px] text-[var(--theme-muted,#80c8ff)]">
                      Live Stream Event Bridges, SSE Subscriptions & Platform Listeners
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConnectionsModal(false)}
                  className="p-1.5 rounded-lg bg-[var(--theme-card-alt,#0a2540)] hover:bg-white/10 text-[var(--theme-muted,#80c8ff)] hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* Active Platform Targets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Twitch', icon: '🟣', status: 'Active Relay', desc: 'Chat events listener' },
                    { name: 'Kick', icon: '🟢', status: 'Connected', desc: 'Emote & subs feed' },
                    { name: 'YouTube', icon: '🔴', status: 'Live Sync', desc: 'SuperChat & commands' },
                    { name: 'OurHangoutSpace', icon: '🌐', status: 'Websocket Ready', desc: 'Direct browser relay' }
                  ].map((plat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[var(--theme-bg,#020b18)] border border-[var(--theme-border,#003865)] flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{plat.icon}</span>
                        <span className="font-bold text-white text-xs">{plat.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">{plat.status}</span>
                      <span className="text-[9px] text-[var(--theme-muted,#80c8ff)]/70">{plat.desc}</span>
                    </div>
                  ))}
                </div>

                {/* SSE & Latency Telemetry */}
                <div className="p-4 rounded-xl bg-[var(--theme-bg,#020b18)] border border-[var(--theme-border,#003865)] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--theme-muted,#80c8ff)]">Local Bridge SSE Stream:</span>
                    <span className="font-bold text-emerald-400">CONNECTING_ACTIVE (0-ms Latency)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--theme-muted,#80c8ff)]">Heartbeat Diagnostics Check:</span>
                    <span className="font-mono text-cyan-300">Every 30m ({nextPingTimeSeconds}s remaining)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--theme-muted,#80c8ff)]">Auto-Reconnect Protocol:</span>
                    <span className="text-white">Exponential Backoff (Active)</span>
                  </div>
                </div>

                {/* Live Activity Stream Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[var(--theme-muted,#80c8ff)] uppercase">
                    <span>Recent Connection Transmissions</span>
                    <span className="text-emerald-400">{logs.length} logged packets</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-[var(--theme-border,#003865)] max-h-48 overflow-y-auto space-y-1 font-mono text-[11px]">
                    {logs.length > 0 ? (
                      logs.slice(0, 8).map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[var(--theme-muted,#80c8ff)]">
                          <span className="text-emerald-400 shrink-0">[{log.time}]</span>
                          <span className="text-cyan-300 font-bold shrink-0">{log.site}:</span>
                          <span className="text-white truncate">{log.command} by {log.user}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-500 text-center py-4">
                        Bridge standing by. Ready to receive chat triggers & overlay events.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-[var(--theme-bg,#020b18)] border-t border-[var(--theme-border,#003865)] flex items-center justify-between">
                <span className="text-[10px] text-[var(--theme-muted,#80c8ff)]">
                  TRIGGER\\'D v0.135 Bridge Core
                </span>
                <button
                  type="button"
                  onClick={() => setShowConnectionsModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-[var(--theme-accent,#00f0ff)] text-black font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feature Guided Tour */}
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};
'''

new_text = text[:pos] + clean_tail
with open('src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated Dashboard.tsx successfully. New length:', len(new_text))
