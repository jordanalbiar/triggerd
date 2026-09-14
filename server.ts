import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { AlertPayload, CommandConfig, DEFAULT_COMMANDS, SpriteType } from "./src/types";

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const app = express();
const PORT = 3000;

// Enable CORS for Tampermonkey cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Enable JSON body parsing with large payload limit for high-res stream assets
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// In-memory media upload cache for uploaded local overlay images and media
const uploadedMediaMap = new Map<string, { mime: string; buffer: Buffer }>();

app.post("/api/upload-media", (req, res) => {
  try {
    const { name, data, type } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: "Missing data" });
    }
    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    if (typeof data === 'string' && data.startsWith('data:')) {
      const commaIdx = data.indexOf(',');
      if (commaIdx !== -1) {
        const header = data.substring(0, commaIdx);
        const base64Data = data.substring(commaIdx + 1).replace(/\s/g, '');
        const mimeMatch = header.match(/data:([^;]+)/);
        const mime = mimeMatch ? mimeMatch[1] : (type === 'video' ? 'video/mp4' : type === 'gif' ? 'image/gif' : 'image/png');
        const buffer = Buffer.from(base64Data, 'base64');
        uploadedMediaMap.set(mediaId, { mime, buffer });
        return res.json({ success: true, url: `/api/media/${mediaId}`, mediaId, mime });
      }
    }
    return res.json({ success: true, url: data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/media/:id", (req, res) => {
  const media = uploadedMediaMap.get(req.params.id);
  if (!media) {
    return res.status(404).send("Media not found");
  }
  res.setHeader("Content-Type", media.mime);
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(media.buffer);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// In-memory registered commands
let activeCommands: CommandConfig[] = [...DEFAULT_COMMANDS];

// In-memory alert logs (starts clean with no default alerts on launch)
let alertsHistory: AlertPayload[] = [];

// Active SSE client connections for Stream Overlay Browser Source
let clients: { id: number; res: express.Response }[] = [];
let clientIdCounter = 0;

// In-memory Static Overlay Sources for stream overlays and Dashboard
let currentStaticSources: any[] = [
  {
    id: 'static-source-default-blue-electrical-frame',
    name: "TRIGGER'D Electrical Pulse Frame",
    type: 'html',
    visible: true,
    locked: false,
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    zIndex: 5,
    opacity: 100,
    rotation: 0,
    scale: 1,
    keepAspectRatio: false,
    htmlContent: `<div class="electrical-frame-container">
  <div class="corner corner-tl">
    <svg viewBox="0 0 40 40" class="corner-svg"><path d="M0 0 L40 0 L40 6 L6 6 L6 40 L0 40 Z" fill="#00f0ff" /><polygon points="10,10 18,10 10,18" fill="#ffffff" /></svg>
    <div class="corner-spark"></div>
  </div>
  <div class="corner corner-tr">
    <svg viewBox="0 0 40 40" class="corner-svg"><path d="M40 0 L0 0 L0 6 L34 6 L34 40 L40 40 Z" fill="#00f0ff" /><polygon points="30,10 22,10 30,18" fill="#ffffff" /></svg>
    <div class="corner-spark"></div>
  </div>
  <div class="corner corner-bl">
    <svg viewBox="0 0 40 40" class="corner-svg"><path d="M0 40 L40 40 L40 34 L6 34 L6 0 L0 0 Z" fill="#00f0ff" /><polygon points="10,30 18,30 10,22" fill="#ffffff" /></svg>
    <div class="corner-spark"></div>
  </div>
  <div class="corner corner-br">
    <svg viewBox="0 0 40 40" class="corner-svg"><path d="M40 40 L0 40 L0 34 L34 34 L34 0 L40 0 Z" fill="#00f0ff" /><polygon points="30,30 22,30 30,22" fill="#ffffff" /></svg>
    <div class="corner-spark"></div>
  </div>
  <div class="electric-beam beam-top"></div>
  <div class="electric-beam beam-bottom"></div>
  <div class="electric-beam beam-left"></div>
  <div class="electric-beam beam-right"></div>
</div>`,
    htmlCss: `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
.electrical-frame-container {
  position: absolute; inset: 6px; border-radius: 14px; border: 2px solid rgba(0, 240, 255, 0.85);
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.6), 0 0 14px rgba(0, 140, 255, 0.35), 0 0 24px rgba(0, 80, 255, 0.15),
    inset 0 0 8px rgba(0, 240, 255, 0.5), inset 0 0 18px rgba(0, 140, 255, 0.3), inset 0 0 35px rgba(0, 56, 101, 0.2);
  animation: slowHeartbeatGlow 3.5s ease-in-out infinite; pointer-events: none; overflow: hidden;
}
@keyframes slowHeartbeatGlow {
  0%, 100% { transform: scale(1); border-color: rgba(0, 240, 255, 0.7); box-shadow: 0 0 5px rgba(0, 240, 255, 0.5), 0 0 10px rgba(0, 140, 255, 0.3), 0 0 18px rgba(0, 80, 255, 0.12), inset 0 0 6px rgba(0, 240, 255, 0.45), inset 0 0 14px rgba(0, 140, 255, 0.25), inset 0 0 30px rgba(0, 56, 101, 0.15); filter: drop-shadow(0 0 2px rgba(0, 240, 255, 0.3)); }
  14% { transform: scale(1.002); border-color: rgba(255, 255, 255, 0.95); box-shadow: 0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 180, 255, 0.5), 0 0 32px rgba(0, 120, 255, 0.25), inset 0 0 12px rgba(0, 240, 255, 0.75), inset 0 0 24px rgba(0, 160, 255, 0.45), inset 0 0 45px rgba(0, 60, 180, 0.3); filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.6)) brightness(1.15); }
  26% { transform: scale(1); border-color: rgba(0, 240, 255, 0.75); box-shadow: 0 0 6px rgba(0, 240, 255, 0.55), 0 0 12px rgba(0, 140, 255, 0.35), 0 0 20px rgba(0, 80, 255, 0.15), inset 0 0 8px rgba(0, 240, 255, 0.5), inset 0 0 16px rgba(0, 140, 255, 0.28), inset 0 0 32px rgba(0, 56, 101, 0.18); filter: drop-shadow(0 0 3px rgba(0, 240, 255, 0.35)); }
  40% { transform: scale(1.004); border-color: rgba(255, 255, 255, 1); box-shadow: 0 0 14px rgba(0, 240, 255, 0.9), 0 0 26px rgba(0, 180, 255, 0.6), 0 0 42px rgba(0, 100, 255, 0.3), inset 0 0 16px rgba(0, 240, 255, 0.85), inset 0 0 30px rgba(0, 160, 255, 0.5), inset 0 0 55px rgba(0, 60, 180, 0.35); filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.75)) brightness(1.2); }
  58% { transform: scale(1); border-color: rgba(0, 240, 255, 0.75); box-shadow: 0 0 5px rgba(0, 240, 255, 0.5), 0 0 10px rgba(0, 140, 255, 0.3), 0 0 18px rgba(0, 80, 255, 0.12), inset 0 0 6px rgba(0, 240, 255, 0.45), inset 0 0 14px rgba(0, 140, 255, 0.25), inset 0 0 30px rgba(0, 56, 101, 0.15); filter: drop-shadow(0 0 2px rgba(0, 240, 255, 0.3)); }
}
.corner { position: absolute; width: 32px; height: 32px; z-index: 10; }
.corner-tl { top: -2px; left: -2px; } .corner-tr { top: -2px; right: -2px; } .corner-bl { bottom: -2px; left: -2px; } .corner-br { bottom: -2px; right: -2px; }
.corner-svg { width: 100%; height: 100%; filter: drop-shadow(0 0 8px #00f0ff); }
.corner-spark { position: absolute; width: 4px; height: 4px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 10px #00f0ff, 0 0 20px #ffffff; animation: sparkFlicker 2s infinite ease-in-out alternate; }
.corner-tl .corner-spark { top: 4px; left: 4px; } .corner-tr .corner-spark { top: 4px; right: 4px; } .corner-bl .corner-spark { bottom: 4px; left: 4px; } .corner-br .corner-spark { bottom: 4px; right: 4px; }
@keyframes sparkFlicker { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.6); } }
.electric-beam { position: absolute; background: linear-gradient(90deg, transparent, #00f0ff, #ffffff, #00f0ff, transparent); filter: drop-shadow(0 0 6px #00f0ff); }
.beam-top { top: 0; left: 10%; right: 10%; height: 2px; animation: beamSlideH 4s linear infinite; }
.beam-bottom { bottom: 0; left: 10%; right: 10%; height: 2px; animation: beamSlideH 4s linear infinite reverse; }
.beam-left { top: 10%; bottom: 10%; left: 0; width: 2px; background: linear-gradient(180deg, transparent, #00f0ff, #ffffff, #00f0ff, transparent); animation: beamSlideV 4s linear infinite; }
.beam-right { top: 10%; bottom: 10%; right: 0; width: 2px; background: linear-gradient(180deg, transparent, #00f0ff, #ffffff, #00f0ff, transparent); animation: beamSlideV 4s linear infinite reverse; }
@keyframes beamSlideH { 0% { transform: scaleX(0.4) translateX(-50%); opacity: 0.2; } 50% { transform: scaleX(1) translateX(0%); opacity: 1; } 100% { transform: scaleX(0.4) translateX(50%); opacity: 0.2; } }
@keyframes beamSlideV { 0% { transform: scaleY(0.4) translateY(-50%); opacity: 0.2; } 50% { transform: scaleY(1) translateY(0%); opacity: 1; } 100% { transform: scaleY(0.4) translateY(50%); opacity: 0.2; } }`,
  },
  {
    id: 'static-source-default-triggerd-logo',
    name: "TRIGGER'D Logo & Icon",
    type: 'html',
    visible: true,
    locked: false,
    x: 50,
    y: 50,
    width: 36,
    height: 26,
    zIndex: 10,
    opacity: 100,
    rotation: 0,
    scale: 1,
    keepAspectRatio: true,
    htmlContent: `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none;text-align:center;font-family:'Orbitron',sans-serif;">
  <svg viewBox="0 0 100 100" style="width:72px;height:72px;filter:drop-shadow(0 0 16px rgba(0,240,255,0.7));margin-bottom:8px;">
    <defs>
      <clipPath id="logo-bolt-clip">
        <path d="M56 4 L22 52 H46 L34 96 L78 48 H54 L66 4 Z" />
      </clipPath>
      <linearGradient id="logo-bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00f0ff" />
        <stop offset="100%" stop-color="#0055aa" />
      </linearGradient>
    </defs>
    <path d="M56 4 L22 52 H46 L34 96 L78 48 H54 L66 4 Z" fill="#04182e" stroke="#00f0ff" stroke-width="3.5" stroke-linejoin="round" />
    <g clip-path="url(#logo-bolt-clip)">
      <rect x="0" y="0" width="100" height="100" fill="url(#logo-bolt-grad)" opacity="0.9" />
      <text x="50" y="52" font-size="46" text-anchor="middle" dominant-baseline="central">🕵️</text>
    </g>
    <path d="M56 4 L22 52 H46 L34 96 L78 48 H54 L66 4 Z" fill="none" stroke="#00f0ff" stroke-width="2.5" stroke-linejoin="round" />
  </svg>
  <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;color:#00f0ff;text-shadow:0 0 20px rgba(0,240,255,0.6);">TRIGGER'D</h1>
</div>`,
    htmlCss: `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@800;900&display=swap');`
  }
];

// Active Tampermonkey userscript bridge status
let detectedSitesSet = new Set<string>();
let selectedSiteFilter = "all";
let activeTargetSitesSet = new Set<string>(["all"]);
let siteMonitorEnabled = true;
let recentTriggersList: { user: string; msg: string; cmd?: string; ts: number }[] = [];

interface OpenSiteRecord {
  id: string;
  tabId?: string;
  site: string;
  room?: string;
  url?: string;
  tabTitle?: string;
  lastSeen: number;
  version?: string;
  enabled: boolean;
}

let openSitesMap = new Map<string, OpenSiteRecord>();

function isSiteEnabledByTargetList(site: string): boolean {
  if (activeTargetSitesSet.has("all")) return true;
  if (!site) return true;
  if (activeTargetSitesSet.has("none")) return false;
  if (activeTargetSitesSet.size === 0) return true;
  const cleanSite = String(site || "").toLowerCase().trim().replace(/^www\./, '');
  for (const target of activeTargetSitesSet) {
    const cleanT = target.toLowerCase().trim().replace(/^www\./, '');
    if (cleanT === 'all') return true;
    if (cleanT === cleanSite || cleanSite.includes(cleanT) || cleanT.includes(cleanSite)) {
      return true;
    }
  }
  return true;
}

let rateLimitConfigServer = {
  enabled: true,
  maxTriggersPerMinute: 30,
  cooldownSeconds: 2
};
let lastTriggerTimeServer = 0;
let recentTriggerTimestampsServer: number[] = [];

let activeBridge: {
  active: boolean;
  site: string;
  room?: string;
  url: string;
  lastSeen: number;
  version: string;
} | null = null;

let activeInspector: {
  active: boolean;
  site: string;
  url: string;
  capturedCount: number;
  capturedModules?: any[];
  lastSeen: number;
} | null = null;

const siteCapturedModulesMap = new Map<string, any[]>();

// API: Sync captured target modules from Userscript
app.post("/api/bridge/captured-modules", (req, res) => {
  const { site, capturedModules } = req.body;
  const siteName = String(site || "targetsite.com").toLowerCase().trim();
  const modulesList = Array.isArray(capturedModules) ? capturedModules : [];
  
  siteCapturedModulesMap.set(siteName, modulesList);
  if (activeInspector && activeInspector.site === siteName) {
    activeInspector.capturedModules = modulesList;
    activeInspector.capturedCount = modulesList.length;
  }
  
  res.json({
    success: true,
    site: siteName,
    count: modulesList.length,
    capturedModules: modulesList
  });
});

app.get("/api/bridge/captured-modules", (req, res) => {
  const site = String(req.query.site || "").toLowerCase().trim();
  if (site && siteCapturedModulesMap.has(site)) {
    return res.json({ success: true, site, capturedModules: siteCapturedModulesMap.get(site) || [] });
  }
  
  const allModules: Record<string, any[]> = {};
  siteCapturedModulesMap.forEach((mods, s) => {
    allModules[s] = mods;
  });
  
  res.json({
    success: true,
    capturedModulesBySite: allModules,
    activeInspectorModules: activeInspector?.capturedModules || []
  });
});

// API: Heartbeat ping from Target Platform Module Selector Script (Inspector)
app.post("/api/bridge/inspector-heartbeat", (req, res) => {
  const { site, url, capturedCount, capturedModules, tabId, tabTitle } = req.body;
  const rawSite = String(site || url || "customsite.com").toLowerCase().trim();
  const siteName = rawSite.replace(/^https?:\/\//, '').replace(/:[0-9]+$/, '').replace(/^www\./, '').split('/')[0] || "customsite.com";
  const tabIdStr = String(tabId || req.body.connectionId || '');
  const connKey = tabIdStr ? `${siteName}::${tabIdStr}` : (url ? `${siteName}::${url}` : siteName);

  detectedSitesSet.add(siteName);
  const existingRec = openSitesMap.get(connKey) || openSitesMap.get(siteName);
  const isTargeted = isSiteEnabledByTargetList(siteName);

  const modulesList = Array.isArray(capturedModules) ? capturedModules : (siteCapturedModulesMap.get(siteName) || []);
  if (Array.isArray(capturedModules) && capturedModules.length > 0) {
    siteCapturedModulesMap.set(siteName, capturedModules);
  }

  openSitesMap.set(connKey, {
    id: connKey,
    tabId: tabIdStr,
    site: siteName,
    room: existingRec?.room || "",
    url: String(url || existingRec?.url || ""),
    tabTitle: String(tabTitle || existingRec?.tabTitle || siteName),
    lastSeen: Date.now(),
    version: existingRec?.version || "4.0",
    enabled: existingRec ? existingRec.enabled : isTargeted
  });

  activeInspector = {
    active: true,
    site: siteName,
    url: String(url || ""),
    capturedCount: Number(capturedCount || modulesList.length || 0),
    capturedModules: modulesList,
    lastSeen: Date.now()
  };

  const now = Date.now();
  const primaryActive = activeBridge ? (now - activeBridge.lastSeen < 12000) : false;

  res.json({
    success: true,
    inspector: activeInspector,
    capturedModules: modulesList,
    primaryActive: primaryActive,
    activeBridge: primaryActive ? activeBridge : null
  });
});

interface ConnectionHistoryEntry {
  id: string;
  site: string;
  room?: string;
  url?: string;
  version?: string;
  connectedAt: number;
  disconnectedAt: number;
}

let connectionHistoryLog: ConnectionHistoryEntry[] = [];

// Helper function to prune disconnected sites and add them to history
function pruneInactiveConnectionsAndLogHistory() {
  const now = Date.now();
  for (const [siteKey, rec] of openSitesMap.entries()) {
    const isLive = (now - rec.lastSeen) < 12000;
    if (!isLive) {
      openSitesMap.delete(siteKey);
      connectionHistoryLog.unshift({
        id: `conn-hist-${now}-${Math.random().toString(36).substring(2, 6)}`,
        site: rec.site,
        room: rec.room,
        url: rec.url || `https://${rec.site}`,
        version: rec.version,
        connectedAt: rec.lastSeen - 12000,
        disconnectedAt: now
      });
      if (connectionHistoryLog.length > 100) connectionHistoryLog.pop();
    }
  }
}

// API: Get Connection History
app.get("/api/bridge/connection-history", (req, res) => {
  pruneInactiveConnectionsAndLogHistory();
  res.json({ success: true, history: connectionHistoryLog });
});

// API: Clear Connection History
app.post("/api/bridge/connection-history/clear", (req, res) => {
  connectionHistoryLog = [];
  res.json({ success: true, history: [] });
});

// API: Manually Close/Disconnect a site connection or tab
app.post("/api/bridge/close-connection", (req, res) => {
  const { connectionId, site, tabId } = req.body;
  const targetSite = String(site || "").toLowerCase().trim();
  const now = Date.now();

  let closedCount = 0;
  if (connectionId && openSitesMap.has(connectionId)) {
    const rec = openSitesMap.get(connectionId)!;
    openSitesMap.delete(connectionId);
    connectionHistoryLog.unshift({
      id: `conn-hist-${now}-${Math.random().toString(36).substring(2, 6)}`,
      site: rec.site,
      room: rec.room,
      url: rec.url || `https://${rec.site}`,
      version: rec.version,
      connectedAt: rec.lastSeen - 12000,
      disconnectedAt: now
    });
    closedCount++;
  } else if (targetSite) {
    for (const [siteKey, rec] of openSitesMap.entries()) {
      if (
        (siteKey === targetSite || rec.site.toLowerCase() === targetSite) &&
        (tabId ? rec.tabId === tabId : true)
      ) {
        openSitesMap.delete(siteKey);
        connectionHistoryLog.unshift({
          id: `conn-hist-${now}-${Math.random().toString(36).substring(2, 6)}`,
          site: rec.site,
          room: rec.room,
          url: rec.url || `https://${rec.site}`,
          version: rec.version,
          connectedAt: rec.lastSeen - 12000,
          disconnectedAt: now
        });
        closedCount++;
      }
    }
  }

  const openSitesList = Array.from(openSitesMap.values()).map(s => ({
    ...s,
    isLive: (now - s.lastSeen) < 12000
  }));

  res.json({ success: true, closedCount, history: connectionHistoryLog, openSites: openSitesList });
});


app.post("/api/bridge/heartbeat", (req, res) => {
  const { site, room, url, version, tabId, tabTitle } = req.body;
  const rawSite = String(site || url || "stumblechat.com").toLowerCase().trim();
  const siteName = rawSite.replace(/^https?:\/\//, '').replace(/:[0-9]+$/, '').replace(/^www\./, '').split('/')[0] || "stumblechat.com";
  const tabIdStr = String(tabId || req.body.connectionId || '');
  const connKey = tabIdStr ? `${siteName}::${tabIdStr}` : (url ? `${siteName}::${url}` : siteName);
  
  if (siteName) {
    detectedSitesSet.add(siteName);
    
    const isTargeted = isSiteEnabledByTargetList(siteName);
    const existingRec = openSitesMap.get(connKey) || openSitesMap.get(siteName);

    openSitesMap.set(connKey, {
      id: connKey,
      tabId: tabIdStr,
      site: siteName,
      room: String(room || ""),
      url: String(url || ""),
      tabTitle: String(tabTitle || existingRec?.tabTitle || siteName),
      lastSeen: Date.now(),
      version: String(version || "4.0"),
      enabled: existingRec ? existingRec.enabled : isTargeted
    });
  }

  activeBridge = {
    active: true,
    site: siteName,
    room: String(room || ""),
    url: String(url || ""),
    lastSeen: Date.now(),
    version: String(version || "4.0")
  };

  const now = Date.now();
  const openSitesList = Array.from(openSitesMap.values()).map(s => ({
    ...s,
    id: s.id || `${s.site}::${s.tabId || 'default'}`,
    tabId: s.tabId || '',
    isLive: (now - s.lastSeen) < 12000,
    enabled: isSiteEnabledByTargetList(s.site) && s.enabled !== false
  }));

  res.json({ 
    success: true, 
    activeBridge, 
    openSites: openSitesList,
    detectedSites: Array.from(detectedSitesSet), 
    activeTargetSites: Array.from(activeTargetSitesSet),
    selectedSite: selectedSiteFilter, 
    enabled: siteMonitorEnabled 
  });
});

// API: Toggle a single tab connection ON or OFF
app.post("/api/bridge/toggle-connection", (req, res) => {
  const { connectionId, site, tabId, enabled } = req.body;
  if (connectionId && openSitesMap.has(connectionId)) {
    const rec = openSitesMap.get(connectionId)!;
    rec.enabled = Boolean(enabled);
    openSitesMap.set(connectionId, rec);
  } else if (site) {
    for (const [key, rec] of openSitesMap.entries()) {
      if (rec.site.toLowerCase() === String(site).toLowerCase() && (!tabId || rec.tabId === tabId || key.includes(tabId))) {
        rec.enabled = Boolean(enabled);
      }
    }
  }
  const now = Date.now();
  const openSitesList = Array.from(openSitesMap.values()).map(s => ({
    ...s,
    isLive: (now - s.lastSeen) < 12000
  }));
  res.json({ success: true, openSites: openSitesList });
});

// API: Toggle all tab connections for a target platform site
app.post("/api/bridge/toggle-site", (req, res) => {
  const { site, enabled } = req.body;
  const targetSite = String(site || '').toLowerCase();
  for (const [key, rec] of openSitesMap.entries()) {
    if (rec.site.toLowerCase() === targetSite || targetSite === 'all') {
      rec.enabled = Boolean(enabled);
    }
  }
  const now = Date.now();
  const openSitesList = Array.from(openSitesMap.values()).map(s => ({
    ...s,
    isLive: (now - s.lastSeen) < 12000
  }));
  res.json({ success: true, openSites: openSitesList });
});

// API: Toggle Site Monitor Connection
app.post("/api/bridge/toggle", (req, res) => {
  if (typeof req.body.enabled === "boolean") {
    siteMonitorEnabled = req.body.enabled;
  } else {
    siteMonitorEnabled = !siteMonitorEnabled;
  }
  res.json({ success: true, enabled: siteMonitorEnabled });
});

// API: Ping target platform bridge
app.post("/api/bridge/ping", (req, res) => {
  const { site } = req.body;
  const siteDomain = String(site || "all").toLowerCase().trim();
  const now = Date.now();
  const rec = openSitesMap.get(siteDomain);
  const isConnected = rec ? (now - rec.lastSeen < 12000) : false;
  res.json({
    success: true,
    site: siteDomain,
    connected: isConnected,
    timestamp: now,
    latencyMs: Math.floor(10 + Math.random() * 15)
  });
});

// API: Select target site filter to pull triggers from
app.post("/api/bridge/selected-site", (req, res) => {
  const { site } = req.body;
  if (site) {
    selectedSiteFilter = String(site).toLowerCase().trim();
    if (selectedSiteFilter === "all") {
      activeTargetSitesSet = new Set(["all"]);
    }
  }
  res.json({ success: true, selectedSite: selectedSiteFilter, activeTargetSites: Array.from(activeTargetSitesSet) });
});

// API: Toggle or batch update active target sites
app.post("/api/bridge/target-sites", (req, res) => {
  const { sites, site, enabled, mode } = req.body;

  const defaultSites: string[] = [];

  if (mode === "all" || (Array.isArray(sites) && sites.includes("all"))) {
    activeTargetSitesSet = new Set(["all"]);
    openSitesMap.forEach(rec => { rec.enabled = true; });
    selectedSiteFilter = "all";
  } else if (mode === "none" || (Array.isArray(sites) && sites.length === 0)) {
    activeTargetSitesSet = new Set(["none"]);
    openSitesMap.forEach(rec => { rec.enabled = false; });
    selectedSiteFilter = "none";
  } else if (Array.isArray(sites)) {
    activeTargetSitesSet = new Set(sites.map((s: string) => String(s).toLowerCase().trim()));
    openSitesMap.forEach((rec, key) => {
      rec.enabled = activeTargetSitesSet.has("all") || activeTargetSitesSet.has(key);
    });
    selectedSiteFilter = Array.from(activeTargetSitesSet).join(",");
  } else if (site && typeof enabled === "boolean") {
    const normSite = String(site).toLowerCase().trim();
    if (activeTargetSitesSet.has("all")) {
      activeTargetSitesSet.delete("all");
      // Populate with default sites and existing open sites
      defaultSites.forEach(s => activeTargetSitesSet.add(s));
      openSitesMap.forEach((_, key) => activeTargetSitesSet.add(key));
    }
    if (activeTargetSitesSet.has("none")) {
      activeTargetSitesSet.delete("none");
    }

    if (enabled) {
      activeTargetSitesSet.add(normSite);
    } else {
      activeTargetSitesSet.delete(normSite);
    }
    const rec = openSitesMap.get(normSite);
    if (rec) rec.enabled = enabled;
    
    if (activeTargetSitesSet.size === 0) {
      activeTargetSitesSet = new Set(["none"]);
      selectedSiteFilter = "none";
    } else {
      selectedSiteFilter = Array.from(activeTargetSitesSet).join(",");
    }
  }

  const now = Date.now();
  const openSitesList = Array.from(openSitesMap.values()).map(s => ({
    ...s,
    isLive: (now - s.lastSeen) < 12000,
    enabled: isSiteEnabledByTargetList(s.site) || s.enabled
  }));

  res.json({
    success: true,
    activeTargetSites: Array.from(activeTargetSitesSet),
    openSites: openSitesList,
    selectedSite: selectedSiteFilter
  });
});

// API: YouTube Search endpoint to find #1 video result for search query
app.get("/api/youtube-search", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) {
    return res.status(400).json({ error: "Missing search query parameter 'q'" });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch YouTube search page" });
    }

    const html = await response.text();
    // Look for videoId match in ytInitialData JSON
    const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];
      let title = query;
      const titleMatch = html.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
      }
      return res.json({ success: true, videoId, title, query });
    }

    // Fallback watch?v= match
    const watchMatch = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return res.json({ success: true, videoId: watchMatch[1], title: query, query });
    }

    return res.status(404).json({ error: "No video results found for query", query });
  } catch (err: any) {
    console.error("YouTube search API error:", err);
    return res.status(500).json({ error: err.message || "Failed to search YouTube" });
  }
});

// API: Get bridge connection status & auto-detected open sites
app.get("/api/bridge/status", (req, res) => {
  pruneInactiveConnectionsAndLogHistory();
  const now = Date.now();
  const openSitesList = Array.from(openSitesMap.values()).map(s => {
    const isLive = (now - s.lastSeen) < 12000;
    return {
      site: s.site,
      room: s.room,
      url: s.url,
      lastSeen: s.lastSeen,
      version: s.version,
      isLive,
      enabled: activeTargetSitesSet.has("all") || activeTargetSitesSet.has(s.site) || s.enabled
    };
  });

  const hasLiveBridge = openSitesList.some(s => s.isLive) || (activeBridge ? (now - activeBridge.lastSeen < 12000) : false);
  const liveBridge = openSitesList.find(s => s.isLive) || activeBridge;
  const isInspectorActive = activeInspector ? (now - activeInspector.lastSeen < 12000) : false;
  const isUserscriptActive = hasLiveBridge || isInspectorActive;

  res.json({
    success: true,
    active: isUserscriptActive,
    enabled: siteMonitorEnabled,
    site: liveBridge?.site || activeInspector?.site || null,
    room: liveBridge?.room || null,
    url: liveBridge?.url || activeInspector?.url || null,
    lastSeen: liveBridge?.lastSeen || activeInspector?.lastSeen || null,
    version: liveBridge?.version || null,
    inspectorStatus: {
      active: isInspectorActive,
      site: isInspectorActive ? activeInspector?.site : null,
      url: isInspectorActive ? activeInspector?.url : null,
      capturedCount: isInspectorActive ? (activeInspector?.capturedCount || 0) : 0,
      capturedModules: isInspectorActive ? (activeInspector?.capturedModules || []) : [],
      lastSeen: activeInspector?.lastSeen || null
    },
    userscriptStatus: {
      active: isUserscriptActive,
      site: liveBridge?.site || activeInspector?.site || null,
      room: liveBridge?.room || null,
      url: liveBridge?.url || activeInspector?.url || null,
      lastSeen: liveBridge?.lastSeen || activeInspector?.lastSeen || null
    },
    capturedModulesBySite: Object.fromEntries(siteCapturedModulesMap.entries()),
    activeBridge,
    openSites: openSitesList,
    detectedSites: Array.from(detectedSitesSet),
    activeTargetSites: Array.from(activeTargetSitesSet),
    selectedSite: selectedSiteFilter,
    history: connectionHistoryLog
  });
});

// API: SSE stream for OBS Browser Source real-time overlay notifications
app.get("/api/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
    "Access-Control-Allow-Origin": "*",
  });

  const clientId = ++clientIdCounter;
  clients.push({ id: clientId, res });

  try {
    res.write(`data: ${JSON.stringify({ status: "connected", clientId })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "static-sources", sources: currentStaticSources })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "stage-settings", stageSettings: currentStageSettings })}\n\n`);
  } catch (err) {
    console.error(`Error sending initial heartbeat to SSE client ${clientId}:`, err);
  }

  const keepAliveInterval = setInterval(() => {
    try {
      res.write(": keepalive\n\n");
    } catch (err) {
      clearInterval(keepAliveInterval);
    }
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAliveInterval);
    clients = clients.filter(client => client.id !== clientId);
  });
});

// GIF Provider Settings State
let gifSettings = {
  provider: 'tenor',
  tenorApiKey: 'LIVDSRZULELA', // Default public Tenor key
  giphyApiKey: '',
  imgurClientId: ''
};

// Helper: Fetch GIF from Tenor, Giphy, or Imgur
async function fetchGifUrl(query: string): Promise<string> {
  const searchTerm = query.trim() || 'test';
  try {
    if (gifSettings.provider === 'giphy' && gifSettings.giphyApiKey) {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(gifSettings.giphyApiKey)}&q=${encodeURIComponent(searchTerm)}&limit=1`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          return json.data[0].images?.original?.url || json.data[0].images?.downsized?.url || 'https://media.tenor.com/26tP393TLyR3XUaI0/giphy.gif';
        }
      }
    } else if (gifSettings.provider === 'imgur' && gifSettings.imgurClientId) {
      const url = `https://api.imgur.com/3/gallery/search/time/1?q=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url, { headers: { Authorization: `Client-ID ${gifSettings.imgurClientId}` } });
      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          const item = json.data[0];
          if (item.images && item.images.length > 0) return item.images[0].link;
          if (item.link && item.link.endsWith('.gif')) return item.link;
        }
      }
    }

    // Custom Tenor API key if configured
    if (gifSettings.tenorApiKey && gifSettings.tenorApiKey !== 'LIVDSRZULELA') {
      const tenorUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${encodeURIComponent(gifSettings.tenorApiKey)}&limit=1`;
      const response = await fetch(tenorUrl);
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const media = json.results[0].media_formats;
          if (media) {
            return media.gif?.url || media.mediumgif?.url || media.tinygif?.url || 'https://media.tenor.com/26tP393TLyR3XUaI0/giphy.gif';
          }
        }
      }
    }

    // Default Tenor Search: Query tenor.com directly for first GIF result
    const tenorSearchUrl = `https://tenor.com/search/${encodeURIComponent(searchTerm)}-gifs`;
    const response = await fetch(tenorSearchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (response.ok) {
      const html = await response.text();
      const matches = html.match(/https:\/\/(media|media1|c)\.tenor\.com\/[^\s\"'\>]+?\.(gif|png|webp)/gi);
      if (matches && matches.length > 0) {
        const gifMatches = matches.filter(m => m.includes('.gif') || m.includes('/m/'));
        if (gifMatches.length > 0) {
          return gifMatches[0];
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch GIF from provider:", err);
  }

  return 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3U0OWJveXp4MXd6OWFicXBjMGVqM3Y0MXZzbWVrY3oxeThxMGxpdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l2JHRh60UM5RE89ms/giphy.gif';
}

// API Route to fetch GIF URL by search query/context
app.get("/api/gif", async (req, res) => {
  const query = String(req.query.q || req.query.query || "funny").trim();
  const gifUrl = await fetchGifUrl(query);
  res.json({ url: gifUrl, query });
});

// API Route: Multi-item GIF Portal Search (Tenor, Giphy, Imgur)
app.get("/api/gif-portal/search", async (req, res) => {
  const query = String(req.query.q || req.query.query || "").trim();
  const provider = String(req.query.provider || "tenor").toLowerCase();
  const limit = Math.min(48, Math.max(1, parseInt(String(req.query.limit || "24"), 10) || 24));
  const cleanQuery = query.toLowerCase();

  try {
    if (provider === 'tenor') {
      const tenorKey = 'LIVDSRZULELA';
      const clientKey = 'triggerd_overlay';
      const endpoint = cleanQuery
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(cleanQuery)}&key=${tenorKey}&client_key=${clientKey}&limit=${limit}&contentfilter=medium`
        : `https://tenor.googleapis.com/v2/featured?key=${tenorKey}&client_key=${clientKey}&limit=${limit}&contentfilter=medium`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.results && Array.isArray(data.results) && data.results.length > 0) {
            const items = data.results.map((item: any, idx: number) => {
              const gifMedia = item.media_formats?.gif || item.media_formats?.mediumgif || item.media_formats?.tinygif;
              const previewMedia = item.media_formats?.nanogif || item.media_formats?.tinygif || gifMedia;
              return {
                id: item.id || `tenor-${idx}-${Date.now()}`,
                title: item.content_description || item.title || `${query || 'Tenor'} GIF ${idx + 1}`,
                url: gifMedia?.url || previewMedia?.url || '',
                previewUrl: previewMedia?.url || gifMedia?.url || '',
                provider: 'tenor',
                width: gifMedia?.dims?.[0] || 250,
                height: gifMedia?.dims?.[1] || 250
              };
            }).filter((g: any) => Boolean(g.url));

            if (items.length > 0) {
              return res.json({ success: true, results: items, count: items.length });
            }
          }
        }
      } catch (err) {
        console.warn("Tenor v2 API error in server:", err);
      }

      // Fallback: Scrape tenor.com search page (matches what alert trigger does)
      const scrapeUrl = cleanQuery
        ? `https://tenor.com/search/${encodeURIComponent(cleanQuery)}-gifs`
        : `https://tenor.com/trending-gifs`;

      const scrapeRes = await fetch(scrapeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (scrapeRes.ok) {
        const html = await scrapeRes.text();
        const rawMatches = html.match(/https:\/\/(?:media|media1|c)\.tenor\.com\/[^\s"'<>]+?\.(?:gif|webp)/gi) || [];
        const uniqueUrls = Array.from(new Set(rawMatches)).filter(m => m.includes('.gif') || m.includes('/m/'));
        if (uniqueUrls.length > 0) {
          const items = uniqueUrls.slice(0, limit).map((url, idx) => ({
            id: `tenor-scrape-${idx}-${Date.now()}`,
            title: `${query || 'Tenor'} GIF ${idx + 1}`,
            url,
            previewUrl: url,
            provider: 'tenor',
            width: 250,
            height: 250
          }));
          return res.json({ success: true, results: items, count: items.length });
        }
      }

      // Automatic fallback to Giphy if Tenor had 0 results
      try {
        const giphyApiKey = String(req.query.apiKey || gifSettings.giphyApiKey || 'dc6zaTOxFJmzC').trim();
        const gEndpoint = cleanQuery
          ? `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(giphyApiKey)}&q=${encodeURIComponent(cleanQuery)}&limit=${limit}&rating=g`
          : `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(giphyApiKey)}&limit=${limit}&rating=g`;
        const gRes = await fetch(gEndpoint);
        if (gRes.ok) {
          const gJson = await gRes.json();
          if (gJson.data && Array.isArray(gJson.data) && gJson.data.length > 0) {
            const gItems = gJson.data.map((item: any) => ({
              id: item.id || `giphy-${Date.now()}`,
              title: item.title || 'Giphy Animated GIF',
              url: item.images?.original?.url || item.images?.downsized_medium?.url || item.images?.fixed_height?.url,
              previewUrl: item.images?.fixed_height_small?.url || item.images?.fixed_height?.url || item.images?.original?.url,
              provider: 'giphy',
              width: Number(item.images?.original?.width) || 250,
              height: Number(item.images?.original?.height) || 250
            })).filter((g: any) => Boolean(g.url));
            if (gItems.length > 0) {
              return res.json({ success: true, results: gItems, count: gItems.length });
            }
          }
        }
      } catch (gErr) {}
    } else if (provider === 'giphy') {
      const apiKey = String(req.query.apiKey || gifSettings.giphyApiKey || 'dc6zaTOxFJmzC').trim();
      const endpoint = cleanQuery
        ? `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(cleanQuery)}&limit=${limit}&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(apiKey)}&limit=${limit}&rating=g`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const items = json.data.map((item: any) => ({
            id: item.id || `giphy-${Date.now()}`,
            title: item.title || 'Giphy Animated GIF',
            url: item.images?.original?.url || item.images?.downsized_medium?.url || item.images?.fixed_height?.url,
            previewUrl: item.images?.fixed_height_small?.url || item.images?.fixed_height?.url || item.images?.original?.url,
            provider: 'giphy',
            width: Number(item.images?.original?.width) || 250,
            height: Number(item.images?.original?.height) || 250
          })).filter((g: any) => Boolean(g.url));

          if (items.length > 0) {
            return res.json({ success: true, results: items, count: items.length });
          }
        }
      }
    }
  } catch (err: any) {
    console.error("Error in /api/gif-portal/search:", err);
  }

  return res.json({ success: false, results: [], count: 0 });
});

// Helper: Fetch first public image search result URL using open public search APIs (DuckDuckGo, Wikimedia, Wikipedia, LoremFlickr)
async function fetchPublicImageUrl(query: string): Promise<string> {
  const searchTerm = query.trim() || 'turtles';

  // 1. DuckDuckGo Open Public Image Search
  try {
    const pageRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(searchTerm)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const vqdMatch = html.match(/vqd=([\d-]+)/i) || html.match(/vqd=['"]([^'"]+)['"]/i);
      if (vqdMatch && vqdMatch[1]) {
        const vqd = vqdMatch[1];
        const apiRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(searchTerm)}&vqd=${vqd}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://duckduckgo.com/'
          }
        });
        if (apiRes.ok) {
          const data = await apiRes.json();
          if (data.results && data.results.length > 0) {
            for (const item of data.results) {
              if (item.image && !item.image.includes('logo') && !item.image.includes('favicon')) {
                console.log(`[Public Image Search] DDG found image for "${searchTerm}":`, item.image);
                return item.image;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in DuckDuckGo public image search:", err);
  }

  // 2. Wikimedia Commons API
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=10&prop=imageinfo&iiprop=url&format=json`;
    const commRes = await fetch(commonsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0' }
    });
    if (commRes.ok) {
      const commData = await commRes.json();
      const pages = commData.query?.pages;
      if (pages) {
        for (const pageId of Object.keys(pages)) {
          const imgInfo = pages[pageId]?.imageinfo?.[0];
          if (imgInfo?.url && (imgInfo.url.endsWith('.jpg') || imgInfo.url.endsWith('.png') || imgInfo.url.endsWith('.jpeg') || imgInfo.url.endsWith('.webp'))) {
            console.log(`[Public Image Search] Wikimedia found image for "${searchTerm}":`, imgInfo.url);
            return imgInfo.url;
          }
        }
      }
    }
  } catch (e) {}

  // 3. Wikipedia Summary API
  try {
    const wikiSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm.replace(/\s+/g, '_'))}`;
    const wikiRes = await fetch(wikiSummaryUrl);
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      const mainImg = wikiData.originalimage?.source || wikiData.thumbnail?.source;
      if (mainImg) {
        console.log(`[Public Image Search] Wikipedia found image for "${searchTerm}":`, mainImg);
        return mainImg;
      }
    }
  } catch (e) {}

  // 4. LoremFlickr Tagged Free Image Service
  return `https://loremflickr.com/1200/800/${encodeURIComponent(searchTerm.replace(/\s+/g, ','))}`;
}

interface WebSearchResultItem {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

interface ImageSearchResultItem {
  url: string;
  caption: string;
  domain: string;
}

interface AIOverviewData {
  title: string;
  category: string;
  summary: string;
  bulletPoints: string[];
}

// Helper: Generate AI Overview using Gemini or smart fallback
async function generateAIOverview(query: string, webSnippets: string[]): Promise<AIOverviewData> {
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);

  if (genAI) {
    try {
      const prompt = `You are Google's AI Overview search assistant.
Generate a concise, factual Google AI Overview summary for the user search query: "${query}".
Web search context snippets:
${webSnippets.join("\n")}

Respond ONLY with valid JSON in this exact structure without markdown backticks or code blocks:
{
  "title": "${formattedQuery}",
  "category": "Google AI Answer Summary",
  "summary": "Clear, comprehensive 2-3 sentence overview covering key facts, definitions, and essentials for ${query}.",
  "bulletPoints": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ]
}`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });

      const text = response.text || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && parsed.summary && Array.isArray(parsed.bulletPoints) && parsed.bulletPoints.length > 0) {
        return {
          title: parsed.title || formattedQuery,
          category: parsed.category || "Google AI Answer Summary",
          summary: parsed.summary,
          bulletPoints: parsed.bulletPoints.slice(0, 3)
        };
      }
    } catch (err) {
      console.error("Gemini AI Overview error:", err);
    }
  }

  // Fallback intelligent summary synthesis
  const snippetContext = webSnippets.filter(Boolean).join(" ");
  let summary = `Google AI Overview for "${formattedQuery}": Key details include essential definitions, historical context, core characteristics, and contemporary applications across verified reference archives.`;

  if (snippetContext.length > 40) {
    const cleanSnip = snippetContext.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (cleanSnip.length > 80) {
      summary = `AI Overview for "${formattedQuery}": ${cleanSnip.slice(0, 260).replace(/\s+[^\s]*$/, '')}...`;
    }
  }

  return {
    title: `${formattedQuery} Overview`,
    category: "Google AI Answer Summary",
    summary,
    bulletPoints: [
      `Primary factual findings and verified documentation regarding ${formattedQuery}.`,
      `Multi-source synthesis gathered from authoritative reference indexes.`,
      `Key specifications, background details, and updates for ${formattedQuery}.`
    ]
  };
}

// Helper: Fetch real query-matched images using open public image search APIs (DuckDuckGo, Wikimedia, Wikipedia, LoremFlickr)
async function fetchImagesForQuery(query: string): Promise<ImageSearchResultItem[]> {
  const images: ImageSearchResultItem[] = [];
  const cleanQuery = query.trim().toLowerCase();
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);

  // 1. DuckDuckGo Open Public Image Search
  try {
    const pageRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const vqdMatch = html.match(/vqd=([\d-]+)/i) || html.match(/vqd=['"]([^'"]+)['"]/i);
      if (vqdMatch && vqdMatch[1]) {
        const vqd = vqdMatch[1];
        const apiRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://duckduckgo.com/'
          }
        });
        if (apiRes.ok) {
          const data = await apiRes.json();
          if (data.results && Array.isArray(data.results)) {
            for (const item of data.results) {
              if (images.length >= 4) break;
              if (item.image && !item.image.includes('logo') && !item.image.includes('favicon')) {
                let domain = 'duckduckgo.com';
                try { domain = new URL(item.image).hostname.replace(/^www\./, ''); } catch (e) {}
                if (!images.some(i => i.url === item.image)) {
                  images.push({
                    url: item.image,
                    caption: item.title || `${formattedQuery} Image #${images.length + 1}`,
                    domain
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in DuckDuckGo image search:", err);
  }

  // 2. Wikipedia Page Images API (Returns direct topic thumbnails for exact search terms)
  if (images.length < 4) {
    try {
      const wikiImgUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|pageterms&generator=search&gpssearch=${encodeURIComponent(query)}&gpslimit=12&pithumbsize=800`;
      const wikiRes = await fetch(wikiImgUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const pages = wikiData.query?.pages;
        if (pages) {
          for (const pageId of Object.keys(pages)) {
            if (images.length >= 4) break;
            const page = pages[pageId];
            if (page.thumbnail?.source) {
              const imgUrl = page.thumbnail.source;
              if (!images.some(i => i.url === imgUrl)) {
                images.push({
                  url: imgUrl,
                  caption: page.title || `${formattedQuery} Reference Image`,
                  domain: 'wikipedia.org'
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Wikipedia Image search error:", e);
    }
  }

  // 3. Wikimedia Commons API search
  if (images.length < 4) {
    try {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=12&prop=imageinfo&iiprop=url&format=json`;
      const commRes = await fetch(commonsUrl);
      if (commRes.ok) {
        const commData = await commRes.json();
        const pages = commData.query?.pages;
        if (pages) {
          for (const pageId of Object.keys(pages)) {
            if (images.length >= 4) break;
            const page = pages[pageId];
            const imgInfo = page.imageinfo?.[0];
            if (imgInfo?.url && (imgInfo.url.endsWith('.jpg') || imgInfo.url.endsWith('.png') || imgInfo.url.endsWith('.jpeg') || imgInfo.url.endsWith('.webp'))) {
              const rawTitle = (page.title || '').replace(/^File:/i, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
              if (!images.some(i => i.url === imgInfo.url)) {
                images.push({
                  url: imgInfo.url,
                  caption: rawTitle || `${formattedQuery} Image`,
                  domain: 'wikimedia.org'
                });
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  // 3. Unsplash curated topic image maps for common topics
  const topicKeywordsMap: Record<string, string[]> = {
    cat: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=600&q=80'
    ],
    dog: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80'
    ],
    apple: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80'
    ],
    moon: [
      'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80'
    ],
    javascript: [
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    ]
  };

  for (const [key, urls] of Object.entries(topicKeywordsMap)) {
    if (cleanQuery.includes(key)) {
      for (const url of urls) {
        if (images.length >= 4) break;
        if (!images.some(i => i.url === url)) {
          images.push({
            url,
            caption: `${formattedQuery} (${key})`,
            domain: 'unsplash.com'
          });
        }
      }
    }
  }

  // 4. LoremFlickr search term fallbacks for dynamic images matching topic
  if (images.length < 4) {
    const encodedTopic = encodeURIComponent(query.replace(/\s+/g, ','));
    const dynamicFallbacks = [
      `https://loremflickr.com/600/400/${encodedTopic}?lock=10`,
      `https://loremflickr.com/600/400/${encodedTopic}?lock=20`,
      `https://loremflickr.com/600/400/${encodedTopic}?lock=30`,
      `https://loremflickr.com/600/400/${encodedTopic}?lock=40`
    ];

    for (let i = 0; i < dynamicFallbacks.length; i++) {
      if (images.length >= 4) break;
      images.push({
        url: dynamicFallbacks[i],
        caption: `${formattedQuery} Image #${images.length + 1}`,
        domain: 'google.com'
      });
    }
  }

  return images.slice(0, 4);
}

// Helper: Fetch real Google Web & Image Search results
async function fetchGoogleSearchData(rawQuery: string): Promise<{
  query: string;
  aiOverview: AIOverviewData;
  webResults: WebSearchResultItem[];
  imageResults: ImageSearchResultItem[];
}> {
  const query = rawQuery.trim() || 'what is an apple';
  const webResults: WebSearchResultItem[] = [];

  // 1. Google Web Search Scraping
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (res.ok) {
      const html = await res.text();
      const blockMatches = Array.from(html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi));
      for (const m of blockMatches) {
        if (webResults.length >= 4) break;
        const titleRaw = m[1].replace(/<[^>]+>/g, '').trim();
        if (titleRaw && titleRaw.length > 2 && !titleRaw.toLowerCase().includes('google') && !titleRaw.toLowerCase().includes('search')) {
          const pos = m.index || 0;
          const snippetSub = html.substring(pos, pos + 800);
          const hrefMatch = snippetSub.match(/href="(?:(?:\/url\?q=)|(?:https?:\/\/))?([^"&]+)/i) || html.substring(Math.max(0, pos - 500), pos + 300).match(/href="(?:(?:\/url\?q=)|(?:https?:\/\/))?([^"&]+)/i);
          const linkUrl = hrefMatch ? decodeURIComponent(hrefMatch[1]) : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

          let domain = 'google.com';
          try {
            domain = new URL(linkUrl).hostname.replace(/^www\./, '');
          } catch (e) {}

          let snippet = `${titleRaw} - detailed search findings and authoritative references for ${query}.`;
          const textMatch = snippetSub.match(/<div[^>]*class="[^"]*(?:VwiC3b|yXM1be|s3rec|MUxGfe)[^"]*"[^>]*>(.*?)<\/div>/i) || snippetSub.match(/<span[^>]*>(.{30,180})<\/span>/i);
          if (textMatch && textMatch[1]) {
            const cleanSnip = textMatch[1].replace(/<[^>]+>/g, '').trim();
            if (cleanSnip.length > 20) snippet = cleanSnip;
          }

          if (!webResults.some(w => w.title === titleRaw)) {
            webResults.push({ title: titleRaw, url: linkUrl, domain, snippet });
          }
        }
      }
    }
  } catch (err) {
    console.error("Google Web Search scrape error:", err);
  }

  // Supplement with Wikipedia Search API if fewer than 4 web results
  if (webResults.length < 4) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=8`;
      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const searchList = wikiData.query?.search || [];
        for (const item of searchList) {
          if (webResults.length >= 4) break;
          const title = item.title;
          const snippet = item.snippet ? item.snippet.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : `Detailed encyclopedia reference and guide for ${title}.`;
          const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
          if (!webResults.some(w => w.title.toLowerCase() === title.toLowerCase())) {
            webResults.push({
              title: `${title} - Wikipedia`,
              url,
              domain: 'wikipedia.org',
              snippet: snippet.length > 180 ? snippet.slice(0, 180) + '...' : snippet
            });
          }
        }
      }
    } catch (e) {
      console.error("Wikipedia search fallback error:", e);
    }
  }

  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  const fallbacksWeb = [
    {
      title: `${formattedQuery}: Overview & Factual Guide`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      domain: 'wikipedia.org',
      snippet: `Comprehensive overview, historical background, core concepts, and key references regarding ${formattedQuery}.`
    },
    {
      title: `${formattedQuery} - Britannica Knowledge Base`,
      url: `https://www.britannica.com/search?query=${encodeURIComponent(query)}`,
      domain: 'britannica.com',
      snippet: `In-depth articles, scientific definitions, and verified research about ${formattedQuery} from Encyclopedia Britannica.`
    },
    {
      title: `Latest Updates & News on ${formattedQuery}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      domain: 'news.google.com',
      snippet: `Real-time news stories, analysis, breaking announcements, and media updates covering ${formattedQuery}.`
    },
    {
      title: `${formattedQuery} Research & Scientific Publications`,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
      domain: 'scholar.google.com',
      snippet: `Peer-reviewed papers, academic research journals, and expert studies examining ${formattedQuery}.`
    }
  ];

  for (const fb of fallbacksWeb) {
    if (webResults.length >= 4) break;
    if (!webResults.some(w => w.domain === fb.domain)) {
      webResults.push(fb);
    }
  }

  // Extract snippet strings for AI summary generation
  const snippets = webResults.map(w => w.snippet);

  // Parallelize AI Overview generation and Image Search
  const [aiOverview, imageResults] = await Promise.all([
    generateAIOverview(query, snippets),
    fetchImagesForQuery(query)
  ]);

  return {
    query: formattedQuery,
    aiOverview,
    webResults: webResults.slice(0, 4),
    imageResults: imageResults.slice(0, 4)
  };
}

// API Route for Google Search (Web Results + Image Results)
app.get("/api/google-search", async (req, res) => {
  const query = String(req.query.q || req.query.query || "what is an apple").trim();
  try {
    const data = await fetchGoogleSearchData(query);
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to execute search" });
  }
});

// API Route for DuckDuckGo Search ("duck it") - Uses DuckDuckGo Lite endpoint with HTML parsing
app.get("/api/duckduckgo-search", async (req, res) => {
  const query = String(req.query.q || req.query.query || "duckduckgo privacy search").trim();
  const region = String(req.query.region || req.query.kl || "us-en").trim();
  const timespan = String(req.query.timespan || req.query.df || "any").trim().toLowerCase();
  const safeSearch = String(req.query.safe_search || req.query.kp || "-1").trim(); // -1 = Moderate, 1 = Strict, -2 = Off
  
  const TIMESPAN_MAP: Record<string, string> = {
    any: "",
    day: "d",
    week: "w",
    month: "m",
    year: "y"
  };
  const dfKey = TIMESPAN_MAP[timespan] ?? timespan;

  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  const embedUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  try {
    // 1. Query DuckDuckGo Lite endpoint via POST x-www-form-urlencoded
    const formData = new URLSearchParams({
      q: query,
      kl: region,
      df: dfKey,
      kp: safeSearch
    });

    const liteRes = await fetch("https://lite.duckduckgo.com/lite/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      body: formData.toString()
    });

    let searchResults: Array<{ title: string; link: string; snippet: string; position: number }> = [];

    if (liteRes.ok) {
      const html = await liteRes.text();

      const cleanText = (str: string) => {
        return str
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const isAdLink = (href: string) => {
        const h = href.toLowerCase();
        return (
          h.includes('duckduckgo.com/y.js') ||
          h.includes('ads-by-microsoft') ||
          h.includes('duckduckgo-help-pages/company/ads')
        );
      };

      // Match result-link <a> and result-snippet <td> in document order
      const tokenRegex = /<a\s+[^>]*class=["'][^"']*result-link[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>|<td\s+[^>]*class=["'][^"']*result-snippet[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi;

      let pendingResult: { title: string; link: string; snippet: string; position: number } | null = null;
      let match: RegExpExecArray | null;

      while ((match = tokenRegex.exec(html)) !== null) {
        const [, link, titleHtml, snippetHtml] = match;

        if (link) {
          if (!link || isAdLink(link)) {
            pendingResult = null;
            continue;
          }
          const rawTitle = cleanText(titleHtml || '');
          pendingResult = {
            title: rawTitle || link,
            link: link,
            snippet: '',
            position: searchResults.length + 1
          };
          searchResults.push(pendingResult);
          if (searchResults.length >= 10) break;
        } else if (snippetHtml && pendingResult) {
          pendingResult.snippet = cleanText(snippetHtml);
          pendingResult = null;
        }
      }
    }

    // Map searchResults to relatedTopics
    let relatedTopics = searchResults.map(r => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet
    }));

    // Abstract text summary from top result or fallback
    let abstract = searchResults[0]?.snippet || "";
    let heading = searchResults[0]?.title || formattedQuery;
    let source = searchResults[0] ? "DuckDuckGo Lite Web Search" : "DuckDuckGo Instant Answer";
    let abstractUrl = searchResults[0]?.link || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;

    // 2. Fallback to DDG Instant Answer API or Wikipedia if Lite returned no results
    if (relatedTopics.length === 0) {
      try {
        const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0' }
        });
        if (ddgRes.ok) {
          const ddgData = await ddgRes.json();
          abstract = ddgData.AbstractText || ddgData.Definition || abstract;
          heading = ddgData.Heading || heading;
          abstractUrl = ddgData.AbstractURL || abstractUrl;

          if (Array.isArray(ddgData.RelatedTopics)) {
            for (const item of ddgData.RelatedTopics) {
              if (relatedTopics.length >= 5) break;
              if (item.Text && item.FirstURL) {
                relatedTopics.push({
                  title: item.Text.split(' - ')[0] || item.Text,
                  url: item.FirstURL,
                  snippet: item.Text
                });
              }
            }
          }
        }
      } catch (e) {
        console.error("DDG API fallback error:", e);
      }
    }

    // Final fallback if abstract is still empty
    if (!abstract) {
      abstract = `DuckDuckGo Search Results for "${formattedQuery}". Privately compiled web results with zero tracking.`;
    }

    // Default topics if empty
    if (relatedTopics.length === 0) {
      relatedTopics = [
        {
          title: `${formattedQuery} Overview & Reference`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: `Instant DuckDuckGo reference guide and information about ${formattedQuery}.`
        },
        {
          title: `${formattedQuery} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          snippet: `Detailed article and encyclopedic definitions for ${formattedQuery}.`
        }
      ];
    }

    res.json({
      success: true,
      query: formattedQuery,
      embedUrl,
      abstract,
      heading,
      source,
      abstractUrl,
      imageUrl: "",
      searchResults,
      relatedTopics
    });
  } catch (err: any) {
    res.json({
      success: true,
      query: formattedQuery,
      embedUrl,
      abstract: `DuckDuckGo Lite search for "${formattedQuery}". Privately compiled web results.`,
      heading: formattedQuery,
      source: "DuckDuckGo Lite Search",
      abstractUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      imageUrl: "",
      searchResults: [],
      relatedTopics: [
        {
          title: `${formattedQuery} Privacy Search`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: `Private web search results for ${formattedQuery}.`
        }
      ]
    });
  }
});

// API Route for Free Image Search ("image:<query>")
app.get("/api/image-search", async (req, res) => {
  const rawQuery = String(req.query.q || req.query.query || "turtles").trim();
  const cleanQuery = rawQuery.replace(/^!?(image:?|img:?)\s*/i, '').trim() || 'turtles';
  const formattedQuery = cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1);

  const images: Array<{ url: string; caption: string; domain: string }> = [];

  // 1. Wikimedia Commons API Search (Free, open, no registration or key required)
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrlimit=15&prop=imageinfo&iiprop=url|size&format=json`;
    const commRes = await fetch(commonsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0' }
    });
    if (commRes.ok) {
      const commData = await commRes.json();
      const pages = commData.query?.pages;
      if (pages) {
        for (const pageId of Object.keys(pages)) {
          if (images.length >= 8) break;
          const page = pages[pageId];
          const imgInfo = page.imageinfo?.[0];
          if (imgInfo?.url && (imgInfo.url.endsWith('.jpg') || imgInfo.url.endsWith('.png') || imgInfo.url.endsWith('.jpeg') || imgInfo.url.endsWith('.webp'))) {
            const rawTitle = (page.title || '').replace(/^File:/i, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
            if (!images.some(i => i.url === imgInfo.url)) {
              images.push({
                url: imgInfo.url,
                caption: rawTitle || `${formattedQuery} Photo`,
                domain: 'wikimedia.org'
              });
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Wikimedia Commons image search error:", e);
  }

  // 2. Wikipedia Summary API for topic main image
  if (images.length < 4) {
    try {
      const wikiSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery.replace(/\s+/g, '_'))}`;
      const wikiRes = await fetch(wikiSummaryUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const mainImg = wikiData.originalimage?.source || wikiData.thumbnail?.source;
        if (mainImg && !images.some(i => i.url === mainImg)) {
          images.unshift({
            url: mainImg,
            caption: wikiData.title || formattedQuery,
            domain: 'wikipedia.org'
          });
        }
      }
    } catch (e) {}
  }

  // 3. LoremFlickr Tagged Free Image Service
  if (images.length < 8) {
    const encodedTag = encodeURIComponent(cleanQuery.replace(/\s+/g, ','));
    const flickrUrls = [
      `https://loremflickr.com/1200/800/${encodedTag}?lock=101`,
      `https://loremflickr.com/1200/800/${encodedTag}?lock=202`,
      `https://loremflickr.com/1200/800/${encodedTag}?lock=303`
    ];
    for (let i = 0; i < flickrUrls.length; i++) {
      images.push({
        url: flickrUrls[i],
        caption: `${formattedQuery} Image #${images.length + 1}`,
        domain: 'flickr.com'
      });
    }
  }

  res.json({
    success: true,
    query: formattedQuery,
    images,
    primaryImage: images[0]?.url || `https://loremflickr.com/1200/800/${encodeURIComponent(cleanQuery)}`
  });
});

app.get("/api/redgif-search", async (req, res) => {
  const rawQuery = String(req.query.q || req.query.query || "test").trim();
  const cleanQuery = rawQuery.replace(/^!?redgif\s*/i, '').trim() || 'test';
  const embedUrl = await fetchRedGifEmbedUrl(cleanQuery);
  res.json({
    success: true,
    query: cleanQuery,
    embedUrl
  });
});

// Helper: Fetch RedGIFs embed URL using official API v2 auth and search
async function fetchRedGifEmbedUrl(query: string): Promise<string> {
  const searchTerm = query.replace(/^!?redgif\s*/i, '').trim() || 'test';
  try {
    // 1. Get temporary bearer token
    const authRes = await fetch('https://api.redgifs.com/v2/auth/temporary', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (authRes.ok) {
      const authData = await authRes.json();
      const token = authData.token || authData.bearer || authData.addr;
      if (token) {
        // Query search endpoint: search_text or tags
        const searchTextUrl = `https://api.redgifs.com/v2/gifs/search?search_text=${encodeURIComponent(searchTerm)}&count=5`;
        const searchRes = await fetch(searchTextUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json'
          }
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData && searchData.gifs && searchData.gifs.length > 0) {
            const firstGif = searchData.gifs[0];
            const embedUrl = firstGif.urls?.html || firstGif.embedUrl || (firstGif.id ? `https://www.redgifs.com/ifr/${firstGif.id}` : null);
            if (embedUrl) {
              return embedUrl;
            }
          }
        }

        // Secondary try with tags
        const searchTagsUrl = `https://api.redgifs.com/v2/gifs/search?tags=${encodeURIComponent(searchTerm)}&count=5`;
        const tagsRes = await fetch(searchTagsUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json'
          }
        });
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          if (tagsData && tagsData.gifs && tagsData.gifs.length > 0) {
            const firstGif = tagsData.gifs[0];
            const embedUrl = firstGif.urls?.html || firstGif.embedUrl || (firstGif.id ? `https://www.redgifs.com/ifr/${firstGif.id}` : null);
            if (embedUrl) {
              return embedUrl;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in fetchRedGifEmbedUrl:', err);
  }

  return `https://www.redgifs.com/ifr/${encodeURIComponent(searchTerm)}`;
}

// Helper: Fetch YouTube Video Duration in seconds via HTML scraping
async function fetchYouTubeDuration(videoId: string): Promise<number> {
  if (!videoId) return 15;
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
      if (match && match[1]) {
        const secs = parseInt(match[1], 10);
        if (!isNaN(secs) && secs > 0) {
          console.log(`[YouTube Duration] Video ID ${videoId} length: ${secs} seconds`);
          return secs;
        }
      }
    }
  } catch (err) {
    console.error('Error fetching YouTube duration:', err);
  }
  return 15;
}

// Live OBS Stage Background Settings State
let currentStageSettings = {
  theme: 'blue', // Active UI theme color (blue, green, red)
  bgType: 'grid', // Stage overlay grid background enabled by default
  showGrid: true, // Stage grid layer enabled by default
  gridStyle: 'mesh', // 'mesh', 'dots', 'iso', 'hex'
  gridSize: 32, // Grid tile size in px
  gridLightAnim: false, // Traveling light pulse animation across grid lines
  gridBackdropType: 'transparent', // 'transparent' or 'color'
  gridBgColor: 'transparent',
  bgColor: 'transparent',
  bgImage: '',
  bgIframe: '',
  iframePos: { x: 50, y: 50 },
  iframeScale: 1.0,
  cameraPos: { x: 50, y: 50 },
  cameraScale: 1.0,
  chromaKeyEnabled: false,
  chromaKeyTarget: 'green',
  chromaCustomColor: '#00FF00',
  chromaSimilarity: 0.35,
  chromaSmoothness: 0.10,
  crtEnabled: false,
  crtAnimated: true,
  crtSize: 4,
  crtIntensity: 0.3,
  crtColor: '#000000',
  cooldownTimer: 5, // Default chill timer: 5 seconds before more overlays can be triggered
  showPlacementGuides: false, // Placement guides & FPS counter hidden by default on live overlay
  isStageDisabled: false,
  themeShade: 15,
  stageColorOverlay: {
    enabled: false,
    color: '#00F0FF',
    blendMode: 'normal',
    opacity: 60
  },
  emptyColorOverlay: {
    enabled: false,
    color: '#00F0FF',
    blendMode: 'normal',
    opacity: 60
  },
  iframeColorOverlay: {
    enabled: false,
    color: '#00F0FF',
    blendMode: 'normal',
    opacity: 60
  },
  cameraColorOverlay: {
    enabled: false,
    color: '#00F0FF',
    blendMode: 'normal',
    opacity: 60
  }
};

// API: Get/Set Static Overlay Sources
app.get("/api/static-sources", (req, res) => {
  res.json({ success: true, sources: currentStaticSources });
});

app.post("/api/static-sources", (req, res) => {
  if (req.body && Array.isArray(req.body.sources)) {
    currentStaticSources = req.body.sources;
    // Broadcast static sources update to all connected SSE clients (OBS, Live Overlays)
    clients.forEach(client => {
      try {
        client.res.write(`data: ${JSON.stringify({ type: 'static-sources', sources: currentStaticSources })}\n\n`);
      } catch (err) {}
    });
  }
  res.json({ success: true, sources: currentStaticSources });
});

// API: Get/Set Stage Background Settings
app.get("/api/stage-settings", (req, res) => {
  res.json(currentStageSettings);
});

app.post("/api/stage-settings", (req, res) => {
  if (req.body) {
    currentStageSettings = {
      ...currentStageSettings,
      ...req.body
    };
    // Broadcast stage settings update to SSE clients
    clients.forEach(client => {
      try {
        client.res.write(`data: ${JSON.stringify({ type: 'stage-settings', stageSettings: currentStageSettings })}\n\n`);
      } catch (err) {}
    });
  }
  res.json({ success: true, settings: currentStageSettings });
});

// API: Get/Set GIF overlay settings
app.get("/api/gif-settings", (req, res) => {
  res.json(gifSettings);
});

app.post("/api/gif-settings", (req, res) => {
  if (req.body) {
    gifSettings = { ...gifSettings, ...req.body };
  }
  res.json({ success: true, settings: gifSettings });
});

// API: Factory Reset - Reset all server state, commands, static sources, settings and alerts
app.post("/api/factory-reset", (req, res) => {
  activeCommands = [...DEFAULT_COMMANDS];
  alertsHistory = [];
  currentStaticSources = [
    {
      id: 'static-source-default-blue-electrical-frame',
      name: "TRIGGER'D Electrical Pulse Frame",
      type: 'html',
      visible: true,
      locked: false,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      zIndex: 5,
      opacity: 100,
      rotation: 0,
      scale: 1,
      keepAspectRatio: false,
      htmlContent: `<div class="electrical-frame-container">\n  <!-- Corner Cyber Brackets -->\n  <div class="corner corner-tl">\n    <svg viewBox="0 0 40 40" class="corner-svg">\n      <path d="M0 0 L40 0 L40 6 L6 6 L6 40 L0 40 Z" fill="var(--theme-accent, #00f0ff)" />\n      <polygon points="10,10 18,10 10,18" fill="#ffffff" />\n    </svg>\n    <div class="corner-spark"></div>\n  </div>\n  <div class="corner corner-tr">\n    <svg viewBox="0 0 40 40" class="corner-svg">\n      <path d="M40 0 L0 0 L0 6 L34 6 L34 40 L40 40 Z" fill="var(--theme-accent, #00f0ff)" />\n      <polygon points="30,10 22,10 30,18" fill="#ffffff" />\n    </svg>\n    <div class="corner-spark"></div>\n  </div>\n  <div class="corner corner-bl">\n    <svg viewBox="0 0 40 40" class="corner-svg">\n      <path d="M0 40 L40 40 L40 34 L6 34 L6 0 L0 0 Z" fill="var(--theme-accent, #00f0ff)" />\n      <polygon points="10,30 18,30 10,22" fill="#ffffff" />\n    </svg>\n    <div class="corner-spark"></div>\n  </div>\n  <div class="corner corner-br">\n    <svg viewBox="0 0 40 40" class="corner-svg">\n      <path d="M40 40 L0 40 L0 34 L34 34 L34 0 L40 0 Z" fill="var(--theme-accent, #00f0ff)" />\n      <polygon points="30,30 22,30 30,22" fill="#ffffff" />\n    </svg>\n    <div class="corner-spark"></div>\n  </div>\n\n  <!-- Perimeter Electric Glow Beams -->\n  <div class="electric-beam beam-top"></div>\n  <div class="electric-beam beam-bottom"></div>\n  <div class="electric-beam beam-left"></div>\n  <div class="electric-beam beam-right"></div>\n</div>`,
      cssContent: `.electrical-frame-container { width: 100%; height: 100%; position: absolute; inset: 0; pointer-events: none; }`,
      jsContent: ''
    }
  ];
  currentStageSettings = {
    theme: 'blue',
    bgType: 'grid',
    showGrid: true,
    gridStyle: 'mesh',
    gridSize: 32,
    gridLightAnim: false,
    gridBackdropType: 'transparent',
    gridBgColor: 'transparent',
    bgColor: 'transparent',
    bgImage: '',
    bgIframe: '',
    iframePos: { x: 50, y: 50 },
    iframeScale: 1.0,
    cameraPos: { x: 50, y: 50 },
    cameraScale: 1.0,
    chromaKeyEnabled: false,
    chromaKeyTarget: 'green',
    chromaCustomColor: '#00FF00',
    chromaSimilarity: 0.35,
    chromaSmoothness: 0.10,
    crtEnabled: false,
    crtAnimated: true,
    crtSize: 4,
    crtIntensity: 0.3,
    crtColor: '#000000',
    cooldownTimer: 5,
    showPlacementGuides: false,
    isStageDisabled: false,
    themeShade: 15,
    stageColorOverlay: {
      enabled: false,
      color: '#00F0FF',
      blendMode: 'normal',
      opacity: 60
    },
    emptyColorOverlay: {
      enabled: false,
      color: '#00F0FF',
      blendMode: 'normal',
      opacity: 60
    },
    iframeColorOverlay: {
      enabled: false,
      color: '#00F0FF',
      blendMode: 'normal',
      opacity: 60
    },
    cameraColorOverlay: {
      enabled: false,
      color: '#00F0FF',
      blendMode: 'normal',
      opacity: 60
    }
  };
  
  gifSettings = {
    provider: 'tenor',
    tenorApiKey: 'LIVDSRZULELA',
    giphyApiKey: '',
    imgurClientId: ''
  };
  detectedSitesSet = new Set<string>();
  selectedSiteFilter = "all";
  activeTargetSitesSet = new Set<string>(["all"]);
  siteMonitorEnabled = true;
  recentTriggersList = [];
  openSitesMap = new Map();
  connectionHistoryLog = [];

  // Broadcast reset events to all clients
  const clearAlert: AlertPayload = {
    id: `clear-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    username: "System",
    message: "clear! all",
    command: "clear!",
    type: "clear",
    targetOverlay: "all",
    customMessage: "🧹 FACTORY RESET COMPLETED",
    duration: 1
  };

  clients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify({ type: 'stage-settings', stageSettings: currentStageSettings })}\n\n`);
      client.res.write(`data: ${JSON.stringify({ type: 'static-sources', sources: currentStaticSources })}\n\n`);
      client.res.write(`data: ${JSON.stringify(clearAlert)}\n\n`);
    } catch (err) {}
  });

  res.json({ success: true, message: "Factory reset complete" });
});

// API: Clear all active overlays on all connected stream clients
app.post("/api/clear-alerts", (req, res) => {
  const target = String(req.body?.target || req.body?.targetOverlay || req.body?.message || "").trim();
  const cleanTarget = target.replace(/^(?:clear!|!clear|clear)\s*/i, '').replace(/!/g, '').trim().toLowerCase();
  
  if (!cleanTarget || cleanTarget === "all" || cleanTarget === "overlays") {
    alertsHistory = [];
  } else {
    alertsHistory = alertsHistory.filter(a => {
      const aType = (a.type || '').toLowerCase();
      const aCmd = (a.command || '').toLowerCase();
      const aSprite = (a.spriteStyle || '').toLowerCase();
      const aMsg = (a.message || '').toLowerCase();
      return !aType.includes(cleanTarget) && !aCmd.includes(cleanTarget) && !aSprite.includes(cleanTarget) && !aMsg.includes(cleanTarget);
    });
  }

  const clearAlert: AlertPayload = {
    id: `clear-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    username: String(req.body?.username || "System"),
    message: cleanTarget ? `clear! ${cleanTarget}` : "clear!",
    command: "clear!",
    type: "clear",
    targetOverlay: cleanTarget || undefined,
    customMessage: cleanTarget ? `🧹 CLEARED OVERLAY: ${cleanTarget.toUpperCase()}` : "🧹 ALL OVERLAYS CLEARED!",
    duration: 1
  };

  clients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(clearAlert)}\n\n`);
    } catch (err) {}
  });

  res.json({ success: true, message: cleanTarget ? `Cleared ${cleanTarget} overlay` : "Cleared all overlays" });
});

// API: Get history of triggered alerts
app.get("/api/alerts-history", (req, res) => {
  res.json(alertsHistory);
});

// API: Clear alert history
app.post("/api/alerts-history/clear", (req, res) => {
  alertsHistory = [];
  res.json({ success: true, message: "History cleared successfully" });
});

// API: Get or update active commands
app.get("/api/commands", (req, res) => {
  res.json(activeCommands);
});

app.post("/api/commands", (req, res) => {
  if (Array.isArray(req.body)) {
    activeCommands = req.body;
    res.json({ success: true, commands: activeCommands });
  } else {
    res.status(400).json({ error: "Expected an array of CommandConfig objects" });
  }
});

// API: Main command trigger endpoint called by Tampermonkey or Dashboard
app.post("/api/trigger-command", async (req, res) => {
  const {
    username = "Stream Chatter",
    message = "!hype",
    platform = "Tampermonkey",
    commandOverride = "",
    spriteStyleOverride = ""
  } = req.body;

  const cleanUser = String(username || '').toLowerCase().trim();
  const cleanMsg = String(message || '').toLowerCase().trim();
  const cleanCmd = String(commandOverride || '').toLowerCase().trim();
  const rawText = String(message).toLowerCase().trim();

  // Special Check: Clear overlays command (e.g. clear, clear smoke, clear! or !clear or clear! weather)
  // MUST execute FIRST so clear! is NEVER blocked by site monitoring or rate limits!
  if (rawText.startsWith("clear!") || rawText.startsWith("!clear") || rawText.startsWith("clear ") || rawText === "clear" || commandOverride === "clear!" || commandOverride === "clear" || spriteStyleOverride === "clear") {
    let targetOverlay = "";
    const isExclamation = rawText.includes("clear!") || rawText.includes("!clear") || commandOverride === "clear!";
    const clearMatch = rawText.match(/^(?:clear!|!clear|clear)\s*(.*)$/i);
    if (clearMatch && clearMatch[1]) {
      targetOverlay = clearMatch[1].trim().replace(/!/g, '').toLowerCase();
    }
    const isClearAll = isExclamation && (!targetOverlay || targetOverlay === "all" || targetOverlay === "overlays");
    
    if (isClearAll || targetOverlay === "all" || targetOverlay === "overlays") {
      alertsHistory = [];
      targetOverlay = targetOverlay === "overlays" ? "all" : targetOverlay;
    } else if (targetOverlay) {
      // Filter out specifically targeted overlay from alertsHistory
      alertsHistory = alertsHistory.filter(a => {
        const aType = (a.type || '').toLowerCase();
        const aCmd = (a.command || '').toLowerCase();
        const aSprite = (a.spriteStyle || '').toLowerCase();
        const aMsg = (a.message || '').toLowerCase();
        return !aType.includes(targetOverlay) && !aCmd.includes(targetOverlay) && !aSprite.includes(targetOverlay) && !aMsg.includes(targetOverlay);
      });
    } else {
      // Clear on its own -> Pop only the previously triggered overlay
      if (alertsHistory.length > 0) {
        alertsHistory.pop();
      }
    }

    const actualCommand = isExclamation ? "clear!" : "clear";

    const clearAlert: AlertPayload = {
      id: `clear-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      username: String(username),
      message: String(message),
      command: actualCommand,
      type: "clear",
      targetOverlay: targetOverlay || undefined,
      customMessage: targetOverlay ? `🧹 CLEARED OVERLAY: ${targetOverlay.toUpperCase()}!` : (isClearAll ? "🧹 ALL OVERLAYS CLEARED!" : "🧹 CLEARED PREVIOUS OVERLAY!"),
      duration: 1,
      platform: String(platform)
    };

    clients.forEach(client => {
      try {
        client.res.write(`data: ${JSON.stringify(clearAlert)}\n\n`);
      } catch (err) {}
    });

    return res.status(200).json({
      success: true,
      matchedCommand: actualCommand,
      spriteStyle: "clear",
      alert: clearAlert
    });
  }

  // Update active bridge connection tracking on incoming message
  const incomingPlatform = String(platform || "target-platform").toLowerCase().trim();
  
  if (incomingPlatform && !incomingPlatform.includes("dashboard") && !incomingPlatform.includes("chat console")) {
    detectedSitesSet.add(incomingPlatform);
    if (!activeTargetSitesSet.has("none")) {
      activeTargetSitesSet.add("all");
      activeTargetSitesSet.add(incomingPlatform);
    }
    openSitesMap.set(incomingPlatform, {
      id: `conn_${incomingPlatform}`,
      site: incomingPlatform,
      room: activeBridge?.room || "",
      url: activeBridge?.url || "",
      lastSeen: Date.now(),
      version: activeBridge?.version || "3.3",
      enabled: true
    });
  }

  activeBridge = {
    active: true,
    site: incomingPlatform,
    room: activeBridge?.room || "",
    url: activeBridge?.url || "",
    lastSeen: Date.now(),
    version: activeBridge?.version || "3.3"
  };

  // Reject internal log loops immediately
  const rawTextLower = rawText.toLowerCase();
  if (rawTextLower.includes("broadcasted system message trigger") || 
      rawTextLower.includes("system notification") || 
      rawTextLower.includes("trigger'd bridge") ||
      rawTextLower.includes("[dedupe]") ||
      rawTextLower.includes("inspector initialized")) {
    return res.json({ status: "ignored", info: "Ignored internal log string loop" });
  }

  // Internal requests (Dashboard, Chat Console, Inspector HUD, Overlay Tester, Stage Test Dock) bypass site filters
  const isInternal = incomingPlatform.includes("dashboard") || 
                     incomingPlatform.includes("chat console") || 
                     incomingPlatform.includes("console") || 
                     incomingPlatform.includes("stage") || 
                     incomingPlatform.includes("terminal") || 
                     incomingPlatform.includes("test") || 
                     incomingPlatform.includes("dock") || 
                     incomingPlatform.includes("inspector") || 
                     incomingPlatform.includes("tester") || 
                     cleanUser.includes("inspector") || 
                     cleanUser.includes("tester") || 
                     cleanUser.includes("admin") || 
                     cleanUser.includes("overlay tester") || 
                     Boolean(commandOverride);

  // Check if site monitor is disabled
  if (!siteMonitorEnabled && !isInternal) {
    return res.json({
      status: "disabled",
      info: "Site monitor bridge is toggled off by user."
    });
  }

  // Check if target site is enabled
  const isSiteTargeted = isSiteEnabledByTargetList(incomingPlatform);

  if (!isSiteTargeted && !isInternal) {
    console.log(`[BRIDGE FILTERED] Ignored trigger from '${incomingPlatform}' (active target sites: ${Array.from(activeTargetSitesSet).join(", ")})`);
    return res.json({
      status: "filtered",
      info: `Ignored message from ${incomingPlatform} because it is not in active targeted sites list (${Array.from(activeTargetSitesSet).join(", ")})`
    });
  }

  const nowTs = Date.now();
  if (rateLimitConfigServer.enabled && !isInternal) {
    const elapsedSec = (nowTs - lastTriggerTimeServer) / 1000;
    if (elapsedSec < rateLimitConfigServer.cooldownSeconds) {
      return res.json({
        status: "rate-limited",
        info: `Rate Limiting Protection Protocol active: Global cooldown of ${rateLimitConfigServer.cooldownSeconds}s`
      });
    }
    recentTriggerTimestampsServer = recentTriggerTimestampsServer.filter(ts => nowTs - ts < 60000);
    if (recentTriggerTimestampsServer.length >= rateLimitConfigServer.maxTriggersPerMinute) {
      return res.json({
        status: "rate-limited",
        info: `Rate Limiting Protection Protocol active: Max ${rateLimitConfigServer.maxTriggersPerMinute} triggers/minute exceeded`
      });
    }
    lastTriggerTimeServer = nowTs;
    recentTriggerTimestampsServer.push(nowTs);
  }

  // Special Check: System Message Detection (e.g. div.message.system, system message, bot added track, etc.)
  const isSystemMsg = req.body.isSystemMessage || 
                      req.body.type === "system" || 
                      commandOverride === "system" || 
                      spriteStyleOverride === "system" ||
                      (req.body.selector && String(req.body.selector).includes("system")) ||
                      (rawText.includes("has added") && (rawText.includes("youtube") || rawText.includes("twitch") || rawText.includes("soundcloud") || rawText.includes("dailymotion")));

  if (isSystemMsg) {
    let cleanMsgText = String(message || "").trim();
    // Recursively strip any prefix artifacts
    let prev = "";
    while (cleanMsgText !== prev) {
      prev = cleanMsgText;
      cleanMsgText = cleanMsgText
        .replace(/^\[SYSTEM NOTIFICATION\]\s*(?:Broadcasted system message trigger:\s*)?"?/i, '')
        .replace(/^Broadcasted system message trigger:\s*"?/i, '')
        .replace(/^system message\s*:?\s*/i, '')
        .replace(/^\[\s*\d{1,2}:\d{2}:\d{2}\s*(?:AM|PM)?\s*\]/i, '')
        .replace(/"\s*from platform\s*".*?"$/i, '')
        .trim();
    }

    if (!cleanMsgText || cleanMsgText.includes("SYSTEM NOTIFICATION") || cleanMsgText.includes("Broadcasted system message")) {
      return res.json({ status: "ignored", info: "Ignored internal system notification recursive loop" });
    }

    const systemAlert: AlertPayload = {
      id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      username: String(username || "System"),
      message: cleanMsgText,
      command: "system",
      type: "system",
      spriteStyle: "system" as any,
      customMessage: cleanMsgText,
      duration: 8,
      platform: String(platform || "Target Platform"),
      color: "#00F0FF"
    };

    alertsHistory.unshift(systemAlert);
    if (alertsHistory.length > 50) alertsHistory.pop();

    clients.forEach(client => {
      try {
        client.res.write(`data: ${JSON.stringify(systemAlert)}\n\n`);
      } catch (err) {}
    });

    console.log(`[SYSTEM NOTIFICATION] Broadcasted system message trigger: "${cleanMsgText}" from platform "${platform}"`);

    return res.status(200).json({
      success: true,
      matchedCommand: "system",
      spriteStyle: "system",
      alert: systemAlert
    });
  }

  // Purge triggers older than 15s
  recentTriggersList = recentTriggersList.filter(t => (nowTs - t.ts) < 15000);

  // Rapid trigger deduplication: filter duplicate network hits (<2000ms) for exact same user and message (external bridges only, bypass for internal manual testing)
  const isDuplicate = !isInternal && recentTriggersList.some(t => {
    const timeDiff = nowTs - t.ts;
    const sameUser = t.user === cleanUser && cleanUser.length > 0;
    const sameMsg = cleanMsg.length > 0 && t.msg === cleanMsg;
    return timeDiff < 2000 && sameUser && sameMsg;
  });

  if (isDuplicate) {
    console.log(`[DEDUPE] Ignored rapid duplicate trigger for '${username}: ${message}'`);
    return res.json({
      status: "duplicate",
      info: `Ignored rapid duplicate trigger for '${username}: ${message}'`,
      alert: null
    });
  }

  recentTriggersList.push({ user: cleanUser, msg: cleanMsg, cmd: cleanCmd, ts: nowTs });

  // Match against registered command triggers (sorted by length descending for best phrase match)
  let matchedCmd: CommandConfig | undefined = undefined;

  if (commandOverride || spriteStyleOverride) {
    const cleanCmdOv = (commandOverride || spriteStyleOverride || '').toLowerCase().trim().replace(/^!/, '').replace(/^cmd-/, '');
    matchedCmd = activeCommands.find(c => {
      const cCmd = c.command.toLowerCase().trim().replace(/^!/, '');
      const cStyle = (c.spriteStyle || '').toLowerCase().trim();
      const cId = c.id.toLowerCase().trim().replace(/^cmd-/, '');
      return cCmd === cleanCmdOv || cStyle === cleanCmdOv || cId === cleanCmdOv;
    });
  }

  if (!matchedCmd) {
    // Auto-detect RedGIFs search command - checked before gif
    if (rawText.startsWith("redgif") || rawText.startsWith("!redgif")) {
      matchedCmd = activeCommands.find(c => c.spriteStyle === 'gif' || c.command.toLowerCase() === 'gif') || {
        id: 'cmd-redgif-auto',
        command: 'redgif',
        spriteStyle: 'gif',
        displayName: 'RedGIFs Search Overlay',
        description: 'Searches RedGIFs and displays embed iframe overlay filling 100% of canvas for 10 seconds',
        color: '#DA334D',
        soundEnabled: true,
        duration: 10,
        scale: 1.0,
        cooldown: 1
      };
    }
    // Check if message starts with gif, !gif, or .gif (excluding redgif)
    else if ((rawText.startsWith("gif") || rawText.startsWith("!gif") || rawText.startsWith(".gif")) && !rawText.startsWith("redgif") && !rawText.startsWith("!redgif")) {
      matchedCmd = activeCommands.find(c => c.spriteStyle === 'gif' || c.command.toLowerCase() === 'gif') || {
        id: 'cmd-gif-auto',
        command: 'gif',
        spriteStyle: 'gif',
        displayName: 'GIF Overlay',
        description: 'Searches and displays animated GIF overlay',
        color: '#FBBF24',
        soundEnabled: true,
        duration: 5,
        scale: 1.0,
        cooldown: 1
      };
    }
  }

  // Auto-detect YouTube links or yt commands in chat messages
  const isYouTubeMessage = rawText.includes("youtube.com/") || rawText.includes("youtu.be/") || rawText.startsWith("youtube") || rawText.startsWith("!youtube") || rawText.startsWith("yt ") || rawText.startsWith("!yt ") || rawText === "yt" || rawText === "!yt";
  if (!matchedCmd && isYouTubeMessage) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'youtube' || c.command.toLowerCase() === 'yt' || c.command.toLowerCase() === 'youtube') || {
      id: 'cmd-youtube-auto',
      command: 'yt',
      spriteStyle: 'youtube',
      displayName: 'YouTube Video Overlay',
      description: 'Plays YouTube video links or search titles (e.g. yt midnight skies)',
      color: '#FF0000',
      soundEnabled: true,
      duration: 0,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect TRIGGER'D Logo static wallpaper command
  if (!matchedCmd && (rawText.startsWith("triggerd") || rawText.startsWith("!triggerd") || rawText.startsWith("logo"))) {
    matchedCmd = {
      id: 'cmd-triggerd-logo',
      command: 'triggerd',
      spriteStyle: 'triggerd' as any,
      displayName: "TRIGGER'D Logo Static Wallpaper Overlay",
      description: "Displays static TRIGGER'D logo wallpaper background overlay",
      color: '#00F0FF',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect Big Emoji Overlay command (e.g. emoji: 🚀, emoji:🔥, !emoji:😍)
  if (!matchedCmd && (rawText.includes("emoji:") || rawText.startsWith("emoji") || rawText.startsWith("!emoji"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'emoji' || c.command.toLowerCase().includes('emoji')) || {
      id: 'cmd-emoji-auto',
      command: 'emoji:',
      spriteStyle: 'emoji',
      displayName: 'Big Emoji Overlay',
      description: 'Displays a giant 40% screen size emoji centered on screen with entrance and exit animations',
      color: '#F43F5E',
      soundEnabled: true,
      duration: 5,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect Google Image search command (e.g. image: turtles, image turtles, !image: turtles)
  if (!matchedCmd && (rawText.includes("image:") || rawText.startsWith("image ") || rawText.startsWith("!image ") || rawText.startsWith("image") || rawText.startsWith("!image"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'image' || c.command.toLowerCase().includes('image')) || {
      id: 'cmd-google-image-auto',
      command: 'image:',
      spriteStyle: 'image',
      displayName: 'Google Image Search Overlay',
      description: 'Searches Google Images and displays top result center-left aligned at 80% size for 5 seconds',
      color: '#4285F4',
      soundEnabled: true,
      duration: 5,
      scale: 0.8,
      cooldown: 1
    };
  }

  // Auto-detect local: command (e.g. local: http://localhost:3000/file.html)
  if (!matchedCmd && (rawText.includes("local:") || rawText.startsWith("local ") || rawText.startsWith("!local"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === ('local' as any) || c.command.toLowerCase().includes('local:')) || {
      id: 'cmd-local-auto',
      command: 'local:',
      spriteStyle: 'local' as any,
      displayName: 'Local File Iframe Overlay',
      description: 'Loads local file or link in full size centered iframe overlay',
      color: '#00F0FF',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect m3u: or small_m3u: stream player command
  if (!matchedCmd && (rawText.includes("m3u:") || rawText.includes("small_m3u:") || rawText.startsWith("m3u") || rawText.startsWith("!m3u") || rawText.startsWith("small_m3u") || rawText.startsWith("!small_m3u"))) {
    const isSmallM3u = rawText.includes("small_m3u") || rawText.startsWith("small_m3u") || rawText.startsWith("!small_m3u");
    matchedCmd = activeCommands.find(c => c.spriteStyle === ('m3u' as any) || c.command.toLowerCase().includes('m3u:')) || {
      id: 'cmd-m3u-auto',
      command: isSmallM3u ? 'small_m3u:' : 'm3u:',
      spriteStyle: 'm3u' as any,
      displayName: isSmallM3u ? 'M3U Stream Player (50% Left)' : 'M3U Stream Player (Fullscreen)',
      description: 'Opens M3U / M3U8 video stream player overlay window',
      color: '#10B981',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: isSmallM3u ? 0.5 : 1.0,
      cooldown: 1
    };
  }

// Helper to parse stage background command variations on server side (colors, links, empty, grid, webcam)
function parseStageBgFromTextServer(rawText: string, currentBgIframe?: string, currentCamActive?: boolean) {
  const text = rawText.toLowerCase().trim();

  // 1. Check for URL or iframe link FIRST (e.g. https://..., http://..., www...., domain.com/path...)
  const urlRegex = /(?:https?:\/\/|www\.)[^\s"']+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s"']+/i;
  const urlMatch = rawText.match(urlRegex);
  if (urlMatch) {
    let linkUrl = urlMatch[0];
    if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
      linkUrl = 'https://' + linkUrl;
    }

    const isDirectImage = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(linkUrl) || linkUrl.startsWith('data:image/');
    if (isDirectImage) {
      return {
        bgType: 'image',
        bgImage: linkUrl,
        bgIframe: ''
      };
    } else {
      return {
        bgType: 'iframe',
        bgIframe: linkUrl,
        bgImage: ''
      };
    }
  }

  // 2. Check for empty / emptty / none / clear / transparent
  if (
    text.includes('empty') ||
    text.includes('emptty') ||
    text.includes('none') ||
    text.includes('clear') ||
    text.includes('transparent')
  ) {
    return {
      bgType: 'color',
      bgColor: 'transparent',
      showGrid: false,
      bgImage: '',
      bgIframe: ''
    };
  }

  // 3. Check for hex code (#ff0000, #fff, etc.) or rgb/hsl
  const hexMatch = rawText.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
  if (hexMatch) {
    return {
      bgType: 'color',
      bgColor: hexMatch[0],
      showGrid: false,
      bgImage: '',
      bgIframe: ''
    };
  }

  const rgbMatch = rawText.match(/(?:rgba?|hsl)\([^\)]+\)/i);
  if (rgbMatch) {
    return {
      bgType: 'color',
      bgColor: rgbMatch[0],
      showGrid: false,
      bgImage: '',
      bgIframe: ''
    };
  }

  // 4. Check for color names (blue, red, green, purple, yellow, orange, pink, cyan, magenta, dark, light, black, white, etc.)
  const colorMap: Record<string, string> = {
    blue: '#0284c7',
    red: '#ef4444',
    green: '#10b981',
    purple: '#8b5cf6',
    violet: '#7c3aed',
    yellow: '#eab308',
    orange: '#f97316',
    pink: '#ec4899',
    cyan: '#00f0ff',
    magenta: '#d946ef',
    teal: '#14b8a6',
    lime: '#84cc16',
    indigo: '#6366f1',
    navy: '#0f172a',
    darkblue: '#0a192f',
    dark: '#090d16',
    black: '#000000',
    white: '#ffffff',
    light: '#f8fafc',
    gray: '#64748b',
    grey: '#64748b'
  };

  for (const [colorName, colorHex] of Object.entries(colorMap)) {
    const wordRegex = new RegExp(`\\b${colorName}\\b`, 'i');
    if (wordRegex.test(text)) {
      return {
        bgType: 'color',
        bgColor: colorHex,
        showGrid: false,
        bgImage: '',
        bgIframe: ''
      };
    }
  }

  // 5. Check for webcam / camera / cam
  if (text.includes('webcam') || text.includes('camera') || text.includes('cam')) {
    return {
      bgType: currentCamActive ? 'color' : 'camera'
    };
  }

  // 6. Check for grid
  if (text.includes('grid')) {
    return {
      bgType: 'color',
      showGrid: true
    };
  }

  // 7. Check for iframe keyword (without link)
  if (text.includes('iframe')) {
    return {
      bgType: 'iframe',
      bgIframe: currentBgIframe || 'https://stumblechat.com'
    };
  }

  // Default fallback toggle
  return {
    bgType: 'color',
    showGrid: false
  };
}

  // Auto-detect Stage Background Toggle command (e.g. background: blue, background: red, background: https://..., backgrounds: empty, etc.)
  const isBackgroundTrigger =
    rawText.includes("background") ||
    rawText.includes("backgrounds") ||
    rawText.includes("bg:") ||
    rawText.startsWith("bg ") ||
    rawText.startsWith("!bg") ||
    commandOverride === "background" ||
    spriteStyleOverride === "background";

  if (!matchedCmd && isBackgroundTrigger) {
    // Process server-side stage settings update immediately
    const fullBgText = [message, rawText, commandOverride, spriteStyleOverride].filter(Boolean).join(" ");
    const bgUpdates = parseStageBgFromTextServer(
      fullBgText,
      currentStageSettings.bgIframe,
      currentStageSettings.bgType === 'camera'
    );

    currentStageSettings = { ...currentStageSettings, ...bgUpdates };
    clients.forEach(client => {
      try {
        client.res.write(`data: ${JSON.stringify({ type: 'stage-settings', stageSettings: currentStageSettings })}\n\n`);
      } catch (err) {}
    });

    matchedCmd = activeCommands.find(c => c.spriteStyle === ('background' as any) || c.command.toLowerCase().includes('background')) || {
      id: 'cmd-background-auto',
      command: 'background:',
      spriteStyle: 'background' as any,
      displayName: 'Stage Background Settings Toggle',
      description: 'Changes stage background settings (colors, empty, iframe with link, grid, or webcam)',
      color: '#8B5CF6',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect Weather Overlay command (e.g. weather: London, weather Tokyo, !weather: Miami)
  if (!matchedCmd && (rawText.includes("weather:") || rawText.startsWith("weather") || rawText.startsWith("!weather"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'weather' || c.command.toLowerCase().includes('weather')) || {
      id: 'cmd-weather-auto',
      command: 'weather:',
      spriteStyle: 'weather',
      displayName: 'Weather Widget Overlay',
      description: 'Displays 3D interactive weather widget for any city',
      color: '#38BDF8',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect Snow Overlay command
  if (!matchedCmd && (rawText.startsWith("snow") || rawText.startsWith("!snow"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'snow' || c.command.toLowerCase().includes('snow')) || {
      id: 'cmd-snow-auto',
      command: 'snow',
      spriteStyle: 'snow',
      displayName: 'Snow Storm Overlay',
      description: 'Gentle falling snow flakes with icy blue atmospheric ambient glow',
      color: '#E0F2FE',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect Rain Overlay command
  if (!matchedCmd && (rawText.startsWith("rain") || rawText.startsWith("!rain"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'rain' || c.command.toLowerCase() === 'rain' || c.command.toLowerCase().includes('rain')) || {
      id: 'cmd-rain-auto',
      command: 'rain',
      spriteStyle: 'rain',
      displayName: 'Rain Storm Overlay',
      description: 'Heavy falling rain streaks with storm lightning ambient glow',
      color: '#38BDF8',
      soundEnabled: true,
      duration: 0,
      isStatic: true,
      scale: 1.0,
      cooldown: 1,
      customMessage: ''
    };
  }

  // Auto-detect Smoke Overlay command
  if (!matchedCmd && (rawText.startsWith("smoke") || rawText.startsWith("!smoke"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === 'smoke' || c.command.toLowerCase().includes('smoke')) || {
      id: 'cmd-smoke-auto',
      command: 'smoke',
      spriteStyle: 'smoke',
      displayName: 'Rising Smoke Overlay (30s)',
      description: 'Volumetric rising smoke puffs ascending smoothly for 30 seconds before fading out',
      color: '#94A3B8',
      soundEnabled: true,
      duration: 30,
      isStatic: false,
      scale: 1.0,
      cooldown: 1
    };
  }

  // Auto-detect Custom Animated Text Overlay command (text! <anything>)
  if (!matchedCmd && (rawText.startsWith("text!") || rawText.includes("text!"))) {
    matchedCmd = activeCommands.find(c => c.spriteStyle === ('text' as any) || c.command.toLowerCase().includes('text!')) || {
      id: 'cmd-text-auto',
      command: 'text!',
      spriteStyle: 'text' as any,
      displayName: 'Text! Breathing Canvas Overlay',
      description: 'Turns text after text! into slowly breathing 8-second animated overlay with deep drop shadow filling 100% of canvas',
      color: '#FFFFFF',
      soundEnabled: true,
      duration: 8,
      isStatic: false,
      scale: 1.0,
      cooldown: 1
    };
  }

  if (!matchedCmd) {
    const sortedCommands = [...activeCommands].sort((a, b) => b.command.length - a.command.length);
    const lowerRaw = rawText.toLowerCase().trim();
    matchedCmd = sortedCommands.find(c => {
      let trigger = c.command.toLowerCase().trim();
      if (!trigger) return false;
      const cleanTrigger = trigger.replace(/^!/, '');
      const withExcl = `!${cleanTrigger}`;
      
      const escapedClean = cleanTrigger.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const escapedExcl = withExcl.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      
      // Allow exact match or word boundary match with or without exclamation mark prefix
      const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_])(?:${escapedExcl}|${escapedClean})(?:$|[^a-zA-Z0-9]|_|-)`, 'i');
      return pattern.test(rawText) ||
             lowerRaw.startsWith(cleanTrigger + '_') ||
             lowerRaw.startsWith(withExcl + '_') ||
             lowerRaw.startsWith(cleanTrigger + '-') ||
             lowerRaw.startsWith(withExcl + '-') ||
             lowerRaw.startsWith(cleanTrigger + ' ') ||
             lowerRaw.startsWith(withExcl + ' ') ||
             lowerRaw === cleanTrigger ||
             lowerRaw === withExcl ||
             lowerRaw.includes(' ' + cleanTrigger + '_') ||
             lowerRaw.includes(' ' + withExcl + '_');
    });
  }

  // Check for YouTube URLs anywhere in message or command
  const ytRegex = /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})|[?&]v=([a-zA-Z0-9_-]{11})/i;
  const directYtMatch = message.match(ytRegex) || rawText.match(ytRegex);
  let detectedYtId: string | undefined = undefined;
  if (directYtMatch) {
    detectedYtId = directYtMatch[1] || directYtMatch[2];
  }

  const isRedGifSearch = (rawText.startsWith("redgif") || rawText.startsWith("!redgif")) || (matchedCmd && (matchedCmd.spriteStyle === 'gif' || matchedCmd.command.toLowerCase() === 'gif' || matchedCmd.command.toLowerCase().includes('redgif')));
  const isYouTubeTrigger = !!detectedYtId || (matchedCmd && (matchedCmd.spriteStyle === 'youtube' || matchedCmd.command.toLowerCase() === 'yt' || matchedCmd.command.toLowerCase() === 'youtube')) || rawText.includes("youtube.com/") || rawText.includes("youtu.be/") || rawText.startsWith("youtube") || rawText.startsWith("!youtube") || rawText.startsWith("yt ") || rawText.startsWith("!yt ") || rawText === "yt" || rawText === "!yt";
  const isTwitchTrigger = rawText.startsWith("twitch") || rawText.startsWith("!twitch") || rawText.includes("twitch.tv/") || (matchedCmd && (matchedCmd.spriteStyle === 'twitch' || matchedCmd.command.toLowerCase().includes('twitch')));
  const isSquirtTrigger = rawText.startsWith("squirt") || rawText.startsWith("!squirt") || (matchedCmd && (matchedCmd.spriteStyle === 'squirt' || matchedCmd.command.toLowerCase().includes('squirt')));
  const isGifSearch = !isRedGifSearch && (rawText.startsWith("gif") || rawText.startsWith("!gif") || rawText.startsWith(".gif")) && (!matchedCmd || matchedCmd.command.toLowerCase() === 'gif' || !matchedCmd.customMessage?.startsWith('http'));
  const isGifTrigger = !isRedGifSearch && (isGifSearch || (matchedCmd && matchedCmd.spriteStyle === 'gif' && !matchedCmd.customMessage?.startsWith('http')));
  const isImageSearch = rawText.includes("image:") || rawText.startsWith("image ") || rawText.startsWith("!image ") || rawText.startsWith("image") || rawText.startsWith("!image") || (matchedCmd && (matchedCmd.spriteStyle === 'image' || matchedCmd.command.toLowerCase().includes('image')));
  const isWeatherTrigger = rawText.includes("weather:") || rawText.startsWith("weather") || rawText.startsWith("!weather") || (matchedCmd && (matchedCmd.spriteStyle === 'weather' || matchedCmd.command.toLowerCase().includes('weather')));
  const isLocalTrigger = rawText.includes("local:") || rawText.startsWith("local") || rawText.startsWith("!local") || (matchedCmd && (matchedCmd.spriteStyle === ('local' as any) || matchedCmd.command.toLowerCase().includes('local:')));
  const isM3uTrigger = rawText.includes("m3u:") || rawText.includes("small_m3u:") || rawText.startsWith("m3u") || rawText.startsWith("!m3u") || rawText.startsWith("small_m3u") || rawText.startsWith("!small_m3u") || (matchedCmd && (matchedCmd.spriteStyle === ('m3u' as any) || matchedCmd.command.toLowerCase().includes('m3u:')));
  const isTextTrigger = rawText.startsWith("text!") || rawText.startsWith("!text!") || rawText.includes("text!") || rawText.includes("!text!") || (matchedCmd && (matchedCmd.spriteStyle === 'text' || matchedCmd.command.toLowerCase().includes('text!')));
  const isEmojiTrigger = rawText.includes("emoji:") || rawText.startsWith("emoji") || rawText.startsWith("!emoji") || (matchedCmd && (matchedCmd.spriteStyle === 'emoji' || matchedCmd.command.toLowerCase().includes('emoji')));
  const isIframeTrigger = rawText.includes("iframe:") || rawText.includes("small-iframe:") || rawText.includes("big-iframe:") || rawText.includes("left-iframe:") || rawText.includes("center-iframe:") || rawText.includes("right-iframe:") || rawText.startsWith("iframe") || rawText.startsWith("!iframe") || rawText.startsWith("small-iframe") || rawText.startsWith("!small-iframe") || rawText.startsWith("big-iframe") || rawText.startsWith("!big-iframe") || rawText.startsWith("left-iframe") || rawText.startsWith("!left-iframe") || rawText.startsWith("center-iframe") || rawText.startsWith("!center-iframe") || rawText.startsWith("right-iframe") || rawText.startsWith("!right-iframe") || (matchedCmd && (matchedCmd.spriteStyle === ('iframe' as any) || matchedCmd.command.toLowerCase().includes('iframe')));

  const isCanvasLayers = (req.body.layers && Array.isArray(req.body.layers) && req.body.layers.length > 0) || (matchedCmd && matchedCmd.layers && matchedCmd.layers.length > 0) || (matchedCmd && matchedCmd.spriteStyle === 'canvas_layers') || (req.body.spriteStyleOverride === 'canvas_layers') || ((req.body.commandConfig || req.body.cmdConfig) && (((req.body.commandConfig || req.body.cmdConfig).layers && (req.body.commandConfig || req.body.cmdConfig).layers.length > 0) || (req.body.commandConfig || req.body.cmdConfig).spriteStyle === 'canvas_layers'));

  if (!matchedCmd && !commandOverride && !spriteStyleOverride && !isCanvasLayers && !isYouTubeTrigger && !isGifTrigger && !isRedGifSearch && !isImageSearch && !isWeatherTrigger && !isTwitchTrigger && !isSquirtTrigger && !isTextTrigger && !isLocalTrigger && !isM3uTrigger && !isEmojiTrigger && !isIframeTrigger) {
    return res.json({
      status: "passed",
      info: "Message received but no registered command trigger matched.",
      username,
      rawMessage: message
    });
  }

  // Check if matched command preset is explicitly disabled by user
  if (matchedCmd && matchedCmd.enabled === false) {
    console.log(`[DISABLED TRIGGER] Ignored trigger because '${matchedCmd.displayName}' is disabled.`);
    return res.json({
      status: "disabled",
      info: `Trigger preset '${matchedCmd.displayName}' is currently disabled by user.`,
      alert: null
    });
  }

  // Use matched command or override config
  let fallbackCmd = commandOverride || (isCanvasLayers ? (matchedCmd?.command || (req.body.commandConfig || req.body.cmdConfig)?.command || "canvas_trigger") : "trigger");
  const rawOv = (spriteStyleOverride || commandOverride || (isCanvasLayers ? 'canvas_layers' : 'cheers')).toLowerCase().trim().replace(/^!/, '').replace(/^cmd-/, '');
  let fallbackStyle: SpriteType = rawOv as SpriteType;
  if (isCanvasLayers) fallbackStyle = 'canvas_layers' as SpriteType;
  else if (rawOv.includes('vdo') || rawOv.includes('ninja')) fallbackStyle = 'vdo' as SpriteType;
  else if (rawOv.includes('snow')) fallbackStyle = 'snow' as SpriteType;
  else if (rawOv.includes('rain')) fallbackStyle = 'rain' as SpriteType;
  else if (rawOv.includes('smoke')) fallbackStyle = 'smoke' as SpriteType;
  else if (rawOv.includes('weather')) fallbackStyle = 'weather' as SpriteType;
  else if (rawOv.includes('matrix')) fallbackStyle = 'matrix' as SpriteType;
  else if (rawOv.includes('crt')) fallbackStyle = 'crt' as SpriteType;
  else if (rawOv.includes('glitch')) fallbackStyle = 'glitch' as SpriteType;
  else if (rawOv.includes('particle')) fallbackStyle = 'particles' as SpriteType;
  else if (rawOv.includes('plane') || rawOv.includes('airplane')) fallbackStyle = 'plane' as SpriteType;
  else if (rawOv.includes('ball')) fallbackStyle = 'balls' as SpriteType;
  else if (rawOv.includes('frame')) fallbackStyle = 'frame' as SpriteType;
  else if (rawOv.includes('welcome')) fallbackStyle = 'welcomeback' as SpriteType;
  else if (rawOv.includes('cheer')) fallbackStyle = 'cheers' as SpriteType;
  else if (rawOv.includes('lol')) fallbackStyle = 'lol' as SpriteType;
  else if (rawOv.includes('ugh')) fallbackStyle = 'ugh' as SpriteType;
  else if (rawOv.includes('text')) fallbackStyle = 'text' as SpriteType;

  let fallbackName = "Custom Trigger";
  let fallbackMsg = "";
  let fallbackColor = "#FBBF24";
  let fallbackDur = 0;

  if (isEmojiTrigger) {
    fallbackCmd = "emoji:";
    fallbackStyle = "emoji";
    fallbackName = "Big Emoji Overlay (emoji:)";
    fallbackMsg = message;
    fallbackColor = "#F43F5E";
    fallbackDur = 5;
  } else if (isTextTrigger) {
    fallbackCmd = "text!";
    fallbackStyle = "text";
    fallbackName = "Floating Text Overlay (text!)";
    fallbackMsg = message;
    fallbackColor = "#F59E0B";
    fallbackDur = 10;
  } else if (isTwitchTrigger) {
    fallbackCmd = "twitch";
    fallbackStyle = "twitch";
    fallbackName = "Twitch Stream Embed";
    fallbackColor = "#9146FF";
    fallbackDur = 0;
  } else if (isSquirtTrigger) {
    fallbackCmd = "squirt";
    fallbackStyle = "squirt";
    fallbackName = "Upward Squirt Spray";
    fallbackColor = "#06B6D4";
    fallbackDur = 8;
  } else if (isImageSearch) {
    fallbackCmd = "image:";
    fallbackStyle = "image";
    fallbackName = "Google Image Search Overlay";
    fallbackColor = "#4285F4";
    fallbackDur = 5;
  } else if (isRedGifSearch) {
    fallbackCmd = "redgif";
    fallbackStyle = "gif";
    fallbackName = "RedGIFs Overlay";
    fallbackColor = "#DA334D";
    fallbackDur = 0;
  } else if (isYouTubeTrigger) {
    fallbackCmd = "yt";
    fallbackStyle = "youtube";
    fallbackName = "YouTube Video";
    fallbackColor = "#EF4444";
    fallbackDur = 0;
  } else if (isGifTrigger) {
    fallbackCmd = "gif";
    fallbackStyle = "gif";
    fallbackName = "GIF Overlay";
    fallbackColor = "#FBBF24";
    fallbackDur = 0;
  } else if (isIframeTrigger) {
    fallbackCmd = "iframe:";
    fallbackStyle = "iframe" as any;
    fallbackName = "Iframe Website Overlay";
    fallbackColor = "#00F0FF";
    fallbackDur = 0;
  }

  const cmdConfig: CommandConfig = matchedCmd || {
    id: `custom-${Date.now()}`,
    command: fallbackCmd,
    spriteStyle: fallbackStyle,
    displayName: fallbackName,
    description: "Auto triggered overlay",
    customMessage: fallbackMsg,
    color: fallbackColor,
    soundEnabled: true,
    duration: fallbackDur,
    scale: isImageSearch ? 0.8 : 1.0,
    cooldown: 1
  };

  // Check secondary command options configured on the command preset
  if (cmdConfig.secondaryOptions && cmdConfig.secondaryOptions.length > 0) {
    const lowerMsg = String(message).toLowerCase().trim();
    for (const opt of cmdConfig.secondaryOptions) {
      if (opt.command && lowerMsg.includes(opt.command.toLowerCase().trim())) {
        if (opt.scale !== undefined) {
          cmdConfig.scale = opt.scale;
        }
        break;
      }
    }
  }

  // Extract search term or media URL
  let customMsg = cmdConfig.customMessage || "";
  let fetchedImageUrl = "";

  if (isTwitchTrigger) {
    let scaleVal = cmdConfig.scale || 1.0;
    const lowerMsg = message.toLowerCase().trim();

    if (lowerMsg.includes("twitch-small") || lowerMsg.includes("twitch small") || lowerMsg.includes("twitch-sm") || lowerMsg.includes("small")) {
      scaleVal = 0.65;
    } else if (lowerMsg.includes("twitch-big") || lowerMsg.includes("twitch big") || lowerMsg.includes("twitch-large") || lowerMsg.includes("twitch large") || lowerMsg.includes("twitch-lg") || lowerMsg.includes("big") || lowerMsg.includes("large")) {
      scaleVal = 1.4;
    } else if (lowerMsg.includes("twitch-full") || lowerMsg.includes("twitch full") || lowerMsg.includes("twitch-xl") || lowerMsg.includes("full")) {
      scaleVal = 1.8;
    } else if (lowerMsg.includes("twitch-medium") || lowerMsg.includes("twitch medium") || lowerMsg.includes("twitch-md") || lowerMsg.includes("medium")) {
      scaleVal = 1.0;
    }

    let channel = message.replace(/^!?:?twitch(-small|-medium|-big|-large|-full|-sm|-md|-lg|-xl)?\s*/i, '').trim();
    if (channel.toLowerCase().startsWith('small') || channel.toLowerCase().startsWith('big') || channel.toLowerCase().startsWith('medium') || channel.toLowerCase().startsWith('full') || channel.toLowerCase().startsWith('large')) {
      channel = channel.replace(/^(small|big|medium|full|large)\s*/i, '').trim();
    }

    customMsg = channel || message || 'valhalla_gaming420';
    cmdConfig.scale = scaleVal;
  } else if (isSquirtTrigger) {
    customMsg = message;
  } else if (isImageSearch) {
    const directImgMatch = (req.body.mediaUrl || message || "").match(/(https?:\/\/[^\s"']+|data:image\/[^\s"']+)/i);
    if (directImgMatch && directImgMatch[1] && (directImgMatch[1].match(/\.(jpeg|jpg|png|webp|svg|bmp|avif)/i) || directImgMatch[1].startsWith('data:image/'))) {
      fetchedImageUrl = directImgMatch[1];
      customMsg = directImgMatch[1];
    } else {
      const searchTerm = message.replace(/^!?(image:?|img:?)\s*/i, '').trim() || 'turtles';
      fetchedImageUrl = await fetchPublicImageUrl(searchTerm);
      customMsg = searchTerm;
    }
  } else if (isRedGifSearch) {
    const searchTerm = message.replace(/^!?redgif\s*/i, '').trim() || 'test';
    const fetchedRedGifEmbedUrl = await fetchRedGifEmbedUrl(searchTerm);
    customMsg = fetchedRedGifEmbedUrl;
  } else if (isGifSearch || isGifTrigger) {
    const directGifUrlMatch = (req.body.mediaUrl || message || "").match(/(https?:\/\/[^\s"']+)/i);
    if (req.body.mediaUrl && req.body.mediaUrl.startsWith('http')) {
      customMsg = req.body.mediaUrl;
    } else if (directGifUrlMatch && directGifUrlMatch[1] && (directGifUrlMatch[1].includes('tenor') || directGifUrlMatch[1].includes('giphy') || directGifUrlMatch[1].includes('imgur') || directGifUrlMatch[1].match(/\.(gif|webp|png|jpg|mp4)/i))) {
      customMsg = directGifUrlMatch[1];
    } else {
      let query = message.trim();
      if (matchedCmd && matchedCmd.command) {
        const cleanCmdName = matchedCmd.command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const cmdRegex = new RegExp('^[^a-zA-Z0-9]*' + cleanCmdName + '[^a-zA-Z0-9]*\\s*', 'i');
        query = query.replace(cmdRegex, '').trim();
      } else {
        query = query.replace(/^[^a-zA-Z0-9]*(gif|cmd-gif)[^a-zA-Z0-9]*\s*/i, '').trim();
      }
      if (!query || query.toLowerCase() === 'gif test' || query.toLowerCase() === 'gif') {
        query = message.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim();
      }
      if (!query || query.toLowerCase() === 'gif' || query.toLowerCase() === 'gif test') {
        query = 'funny';
      }
      const fetchedGifUrl = await fetchGifUrl(query);
      customMsg = fetchedGifUrl;
    }
  } else if (isYouTubeTrigger && !detectedYtId) {
    const ytSearchQuery = message.replace(/^!?(yt|youtube)\s*/i, '').trim();
    if (ytSearchQuery) {
      customMsg = ytSearchQuery;
    }
  } else if (isWeatherTrigger || isTextTrigger || isEmojiTrigger) {
    customMsg = message;
  }

  // Check for background/wallpaper URL links in trigger payload or message
  const isBgCmd = rawText.startsWith("background") || rawText.startsWith("!background") || rawText.startsWith("wallpaper") || rawText.startsWith("!wallpaper") || rawText.startsWith("screensaver") || rawText.startsWith("scifi-wallpaper") || (cmdConfig && (cmdConfig.spriteStyle === 'wallpaper' || cmdConfig.command.toLowerCase().includes('background') || cmdConfig.command.toLowerCase().includes('wallpaper')));
  const bgUrlMatch = (req.body.mediaUrl || message || "").match(/(https?:\/\/[^\s]+|data:image\/[^\s]+|data:video\/[^\s]+)/i);
  if (isBgCmd && bgUrlMatch && bgUrlMatch[1]) {
    const bgLink = bgUrlMatch[1].trim();
    fetchedImageUrl = bgLink;
    const isDirectImg = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(bgLink) || bgLink.startsWith('data:image/');
    const isIframeBg = bgLink.includes('<iframe') || !isDirectImg;
    currentStageSettings = {
      ...currentStageSettings,
      bgType: isIframeBg ? 'iframe' : 'image',
      bgImage: isIframeBg ? '' : bgLink,
      bgIframe: isIframeBg ? bgLink : ''
    };
    // Broadcast stage settings update to SSE clients
    clients.forEach(client => {
      try {
        client.res.write(`data: ${JSON.stringify({ type: 'stage-settings', stageSettings: currentStageSettings })}\n\n`);
      } catch (err) {}
    });
  }

  const isStaticTriggerPrefix = rawText.startsWith("static-") || rawText.startsWith("!static-") || cleanCmd.startsWith("static-") || cleanCmd.startsWith("!static-") || (commandOverride && commandOverride.toLowerCase().includes("static-")) || req.body.isStatic === true;

  let calculatedDuration = isStaticTriggerPrefix ? 0 : ((isTwitchTrigger || isWeatherTrigger) ? 0 : (isTextTrigger ? 10 : (isSquirtTrigger ? 8 : (isRedGifSearch ? 10 : ((isGifTrigger || isGifSearch) ? 40 : (isImageSearch ? 5 : (cmdConfig.duration !== undefined ? cmdConfig.duration : 10)))))));
  if (isYouTubeTrigger && !isStaticTriggerPrefix) {
    if (detectedYtId) {
      calculatedDuration = await fetchYouTubeDuration(detectedYtId);
    } else {
      calculatedDuration = 15;
    }
  }

  const newAlert: AlertPayload = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
    username: String(username),
    message: String(message),
    command: cmdConfig.command,
    type: isCanvasLayers ? ('canvas_layers' as any) : (isIframeTrigger ? ('iframe' as any) : (isEmojiTrigger ? 'emoji' : (isTextTrigger ? 'text' : (isTwitchTrigger ? 'twitch' : (isSquirtTrigger ? 'squirt' : (isImageSearch ? 'image' : (isRedGifSearch ? 'redgif' : (isGifTrigger ? 'gif' : (isYouTubeTrigger ? 'youtube' : cmdConfig.spriteStyle))))))))),
    spriteStyle: isCanvasLayers ? ('canvas_layers' as any) : cmdConfig.spriteStyle,
    positionBehavior: req.body.positionBehavior || cmdConfig.positionBehavior,
    animationStyle: req.body.animationStyle || cmdConfig.animationStyle,
    soundFile: req.body.soundFile || cmdConfig.soundFile,
    customMessage: customMsg,
    mediaUrl: isIframeTrigger ? (req.body.mediaUrl || message) : (isImageSearch ? fetchedImageUrl : (req.body.mediaUrl || cmdConfig.mediaUrl || "")),
    mediaType: isIframeTrigger ? "iframe" : (isImageSearch ? "image" : (req.body.mediaType || cmdConfig.mediaType || "none")),
    color: cmdConfig.color,
    sound: cmdConfig.soundEnabled,
    volume: 0.8,
    duration: req.body.duration !== undefined ? Number(req.body.duration) : calculatedDuration,
    scale: isImageSearch ? 0.8 : cmdConfig.scale,
    isStatic: isIframeTrigger ? true : (isStaticTriggerPrefix ? true : ((isTwitchTrigger || isWeatherTrigger) ? true : ((isGifTrigger || isGifSearch) ? false : (req.body.isStatic !== undefined ? !!req.body.isStatic : !!cmdConfig.isStatic)))),
    platform: String(platform),
    customHtml: (isImageSearch || isRedGifSearch || isGifTrigger || isYouTubeTrigger || isTwitchTrigger) ? undefined : (cmdConfig.customHtml || req.body.customHtml),
    customCss: (isImageSearch || isRedGifSearch || isGifTrigger || isYouTubeTrigger || isTwitchTrigger) ? undefined : (cmdConfig.customCss || req.body.customCss),
    customJs: cmdConfig.customJs || req.body.customJs,
    youtubeId: detectedYtId,
    layers: req.body.layers || cmdConfig.layers,
    canvasBg: req.body.canvasBg || cmdConfig.canvasBg || (cmdConfig as any)?.canvasBackground
  };

  // Prepend to history
  alertsHistory.unshift(newAlert);
  if (alertsHistory.length > 50) alertsHistory = alertsHistory.slice(0, 50);

  // Broadcast to all active SSE client connections (OBS Overlay instances)
  clients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(newAlert)}\n\n`);
    } catch (err) {
      console.error(`Failed to broadcast alert to client ${client.id}:`, err);
    }
  });

  res.status(200).json({
    success: true,
    matchedCommand: cmdConfig.command,
    spriteStyle: cmdConfig.spriteStyle,
    alert: newAlert
  });
});

// Legacy backward-compatible alert endpoint
app.post("/api/alert", (req, res) => {
  const {
    type = "explosion",
    triggerWord = "!alert",
    spokenPhrase = "",
    username = "Chatter",
    sound = true,
    customMessage = "",
    volume = 0.8,
    duration = 5,
    platform = "Web Dashboard"
  } = req.body;

  const newAlert: AlertPayload = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
    username: String(username),
    message: String(spokenPhrase || triggerWord),
    command: String(triggerWord),
    type: type as SpriteType,
    customMessage: customMessage || `{user} TRIGGERED ${triggerWord}!`,
    color: "#3B82F6",
    sound: !!sound,
    volume: Number(volume),
    duration: Number(duration),
    platform: String(platform)
  };

  alertsHistory.unshift(newAlert);
  if (alertsHistory.length > 50) alertsHistory = alertsHistory.slice(0, 50);

  clients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(newAlert)}\n\n`);
    } catch (err) {
      console.error(`Failed to broadcast alert to client ${client.id}:`, err);
    }
  });

  res.status(200).json({ success: true, alert: newAlert });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} with CORS enabled for Tampermonkey`);
  });
}

startServer();
