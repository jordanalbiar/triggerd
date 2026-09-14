const fs = require('fs');
const ts = require('typescript');

const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Dashboard.tsx', code, ts.ScriptTarget.Latest, true);

function visit(node) {
    if (ts.isJsxElement(node)) {
        // check if this is the return of an arrow function inside a map call
        checkIfInMap(node);
    } else if (ts.isJsxSelfClosingElement(node)) {
        checkIfInMap(node);
    } else if (ts.isJsxFragment(node)) {
        checkIfInMap(node);
    }
    ts.forEachChild(node, visit);
}

function checkIfInMap(node) {
    let parent = node.parent;
    while (parent) {
        if (ts.isCallExpression(parent) && ts.isPropertyAccessExpression(parent.expression)) {
            if (parent.expression.name.text === 'map') {
                // node is inside a map. Let's see if it's the direct return.
                let p = node;
                while (p !== parent) {
                    if (ts.isReturnStatement(p) || ts.isArrowFunction(p)) {
                        break;
                    }
                    p = p.parent;
                }
                
                if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
                    let opening = ts.isJsxElement(node) ? node.openingElement : node;
                    let hasKey = false;
                    for (const prop of opening.attributes.properties) {
                        if (prop.name && prop.name.text === 'key') {
                            hasKey = true;
                        }
                    }
                    // Wait, this is tricky, I can just look for the node position in file
                }
            }
        }
        parent = parent.parent;
    }
}
// I will just use regex
