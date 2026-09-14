const fs = require('fs');

let content = fs.readFileSync('src/components/GifPortalSearch.tsx', 'utf8');

// I also need to ensure keepAspectRatio: false is correctly set in handleSelectGif
content = content.replace(
  /type: 'gif',/,
  "type: 'gif',\n      keepAspectRatio: false,\n      aspectRatio: 'auto',"
);

fs.writeFileSync('src/components/GifPortalSearch.tsx', content);
console.log("GIF properties added!");
