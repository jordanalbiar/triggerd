const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.anim-grid-light')) {
  css += `
@keyframes gridLightTravelAnim {
  from {
    background-position: 0px 0px, 0px 0px, 0px 0px, 0px 0px;
  }
  to {
    background-position: 100px 100px, 100px 100px, 100px 100px, 100px 100px;
  }
}
.anim-grid-light {
  animation: gridLightTravelAnim 8s linear infinite !important;
}
`;
  fs.writeFileSync('src/index.css', css);
}

let ao = fs.readFileSync('src/components/AlertOverlay.tsx', 'utf8');
ao = ao.replace(/<style>\{`[^`]*gridLightTravelAnim[^`]*`\}<\/style>/, '');
fs.writeFileSync('src/components/AlertOverlay.tsx', ao);
