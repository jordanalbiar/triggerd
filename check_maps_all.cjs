const fs = require('fs');
const ts = require('typescript');
const path = require('path');

function checkFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    const code = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(path.basename(filePath), code, ts.ScriptTarget.Latest, true);

    function visit(node) {
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
            if (node.expression.name.text === 'map') {
                let arg = node.arguments[0];
                if (arg && (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg))) {
                    let returnsJSX = false;
                    let hasKey = false;
                    let line = 0;
                    
                    if (ts.isBlock(arg.body)) {
                        function findReturn(n) {
                            if (ts.isReturnStatement(n) && n.expression) {
                                if (ts.isJsxElement(n.expression) || ts.isJsxSelfClosingElement(n.expression)) {
                                    returnsJSX = true;
                                    let opening = ts.isJsxElement(n.expression) ? n.expression.openingElement : n.expression;
                                    let keyProp = opening.attributes.properties.find(p => p.name && p.name.text === 'key');
                                    if (keyProp) hasKey = true;
                                    else line = sourceFile.getLineAndCharacterOfPosition(n.expression.getStart()).line + 1;
                                } else if (ts.isJsxFragment(n.expression)) {
                                    returnsJSX = true;
                                    line = sourceFile.getLineAndCharacterOfPosition(n.expression.getStart()).line + 1;
                                } else if (ts.isParenthesizedExpression(n.expression)) {
                                    if (ts.isJsxElement(n.expression.expression) || ts.isJsxSelfClosingElement(n.expression.expression)) {
                                        returnsJSX = true;
                                        let opening = ts.isJsxElement(n.expression.expression) ? n.expression.expression.openingElement : n.expression.expression;
                                        let keyProp = opening.attributes.properties.find(p => p.name && p.name.text === 'key');
                                        if (keyProp) hasKey = true;
                                        else line = sourceFile.getLineAndCharacterOfPosition(n.expression.expression.getStart()).line + 1;
                                    } else if (ts.isJsxFragment(n.expression.expression)) {
                                        returnsJSX = true;
                                        line = sourceFile.getLineAndCharacterOfPosition(n.expression.expression.getStart()).line + 1;
                                    }
                                }
                            } else {
                                ts.forEachChild(n, findReturn);
                            }
                        }
                        findReturn(arg.body);
                    } else {
                        if (ts.isJsxElement(arg.body) || ts.isJsxSelfClosingElement(arg.body)) {
                            returnsJSX = true;
                            let opening = ts.isJsxElement(arg.body) ? arg.body.openingElement : arg.body;
                            let keyProp = opening.attributes.properties.find(p => p.name && p.name.text === 'key');
                            if (keyProp) hasKey = true;
                            else line = sourceFile.getLineAndCharacterOfPosition(arg.body.getStart()).line + 1;
                        } else if (ts.isJsxFragment(arg.body)) {
                            returnsJSX = true;
                            line = sourceFile.getLineAndCharacterOfPosition(arg.body.getStart()).line + 1;
                        } else if (ts.isParenthesizedExpression(arg.body)) {
                            if (ts.isJsxElement(arg.body.expression) || ts.isJsxSelfClosingElement(arg.body.expression)) {
                                returnsJSX = true;
                                let opening = ts.isJsxElement(arg.body.expression) ? arg.body.expression.openingElement : arg.body.expression;
                                let keyProp = opening.attributes.properties.find(p => p.name && p.name.text === 'key');
                                if (keyProp) hasKey = true;
                                else line = sourceFile.getLineAndCharacterOfPosition(arg.body.expression.getStart()).line + 1;
                            } else if (ts.isJsxFragment(arg.body.expression)) {
                                returnsJSX = true;
                                line = sourceFile.getLineAndCharacterOfPosition(arg.body.expression.getStart()).line + 1;
                            }
                        }
                    }
                    
                    if (returnsJSX && !hasKey) {
                        console.log(`Map without key at line ${line} in ${filePath}`);
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
}

const dir = 'src/components/';
fs.readdirSync(dir).forEach(file => {
    checkFile(path.join(dir, file));
});
