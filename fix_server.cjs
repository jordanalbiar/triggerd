const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'server.ts');
let content = fs.readFileSync(file, 'utf8');

const oldBlock = `  if (rawText.startsWith("clear!") || rawText.startsWith("!clear") || rawText.startsWith("clear ") || rawText === "clear" || commandOverride === "clear!" || spriteStyleOverride === "clear") {
    let targetOverlay = "";
    const clearMatch = rawText.match(/^(?:clear!|!clear|clear)\\s*(.*)$/i);
    if (clearMatch && clearMatch[1]) {
      targetOverlay = clearMatch[1].trim().replace(/!/g, '').toLowerCase();
    }
    if (!targetOverlay || targetOverlay === "all" || targetOverlay === "overlays") {
      alertsHistory = [];
      targetOverlay = "";
    }

    const clearAlert: AlertPayload = {
      id: \`clear-\${Date.now()}\`,
      timestamp: new Date().toLocaleTimeString(),
      username: String(username),
      message: String(message),
      command: "clear!",
      type: "clear",
      targetOverlay: targetOverlay || undefined,
      customMessage: targetOverlay ? \`🧹 CLEARED OVERLAY: \${targetOverlay.toUpperCase()}!\` : "🧹 ALL OVERLAYS CLEARED!",
      duration: 1,
      platform: String(platform)
    };`;

const newBlock = `  if (rawText.startsWith("clear!") || rawText.startsWith("!clear") || rawText.startsWith("clear ") || rawText === "clear" || commandOverride === "clear!" || spriteStyleOverride === "clear") {
    let targetOverlay = "";
    const isExclamation = rawText.includes("clear!") || rawText.includes("!clear") || commandOverride === "clear!";
    const clearMatch = rawText.match(/^(?:clear!|!clear|clear)\\s*(.*)$/i);
    if (clearMatch && clearMatch[1]) {
      targetOverlay = clearMatch[1].trim().replace(/!/g, '').toLowerCase();
    }
    const isClearAll = isExclamation || targetOverlay === "all" || targetOverlay === "overlays";
    
    if (isClearAll) {
      alertsHistory = [];
      targetOverlay = "";
    } else {
      if (alertsHistory.length > 0) {
        alertsHistory.pop(); // remove the last one from history
      }
    }

    const actualCommand = isExclamation ? "clear!" : "clear";

    const clearAlert: AlertPayload = {
      id: \`clear-\${Date.now()}\`,
      timestamp: new Date().toLocaleTimeString(),
      username: String(username),
      message: String(message),
      command: actualCommand,
      type: "clear",
      targetOverlay: targetOverlay || undefined,
      customMessage: targetOverlay ? \`🧹 CLEARED OVERLAY: \${targetOverlay.toUpperCase()}!\` : (isClearAll ? "🧹 ALL OVERLAYS CLEARED!" : "🧹 CLEARED LAST OVERLAY!"),
      duration: 1,
      platform: String(platform)
    };`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed server.ts');
