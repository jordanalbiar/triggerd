const fs = require('fs');
const ts = require('typescript');

const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Dashboard.tsx', code, ts.ScriptTarget.Latest, true);

const tags = new Set();
function visit(node) {
    if (ts.isJsxElement(node)) {
        if (ts.isIdentifier(node.openingElement.tagName)) {
            tags.add(node.openingElement.tagName.text);
        }
    } else if (ts.isJsxSelfClosingElement(node)) {
        if (ts.isIdentifier(node.tagName)) {
            tags.add(node.tagName.text);
        }
    }
    ts.forEachChild(node, visit);
}

visit(sourceFile);
console.log(Array.from(tags).sort().join('\n'));
