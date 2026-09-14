require('tsx/cjs');
const { Dashboard } = require('./src/components/Dashboard.tsx');
try {
  Dashboard({});
} catch(e) {
  console.error("Error during call:", e.message);
}
