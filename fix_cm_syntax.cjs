const fs = require('fs');
let content = fs.readFileSync('src/components/CommandManager.tsx', 'utf8');

const faultyBlock = `<input
        type="file"
        ref={cardImportFileInputRef}
        accept=".json"
        onChange={handleImportCardTriggerFile}
        className="hidden"
      />
            </div>`;

content = content.replace(faultyBlock, `<input
        type="file"
        ref={cardImportFileInputRef}
        accept=".json"
        onChange={handleImportCardTriggerFile}
        className="hidden"
      />
            </div>, document.getElementById('cmd-nav-bar-portal')!)}`);

fs.writeFileSync('src/components/CommandManager.tsx', content);
