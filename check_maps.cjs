const fs = require('fs');
const ts = require('typescript');

const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Dashboard.tsx', code, ts.ScriptTarget.Latest, true);

let mapCount = 0;
let mapsWithoutKey = 0;

function visit(node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        if (node.expression.name.text === 'map') {
            mapCount++;
            // Check if returning JSX elements
            let arg = node.arguments[0];
            if (arg && (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg))) {
                let returnsJSX = false;
                let hasKey = false;
                let line = 0;
                
                function checkJSX(n) {
                    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
                        returnsJSX = true;
                        let opening = ts.isJsxElement(n) ? n.openingElement : n;
                        let keyProp = opening.attributes.properties.find(p => p.name && p.name.text === 'key');
                        if (keyProp) {
                            hasKey = true;
                        } else {
                            if (!line) {
                                line = sourceFile.getLineAndCharacterOfPosition(n.getStart()).line + 1;
                            }
                        }
                    } else if (ts.isJsxFragment(n)) {
                        returnsJSX = true;
                        if (!line) {
                            line = sourceFile.getLineAndCharacterOfPosition(n.getStart()).line + 1;
                        }
                    }
                    ts.forEachChild(n, checkJSX);
                }
                
                if (ts.isBlock(arg.body)) {
                    // search for return statements
                    function findReturn(n) {
                        if (ts.isReturnStatement(n) && n.expression) {
                            // only check the top-level returned JSX
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
                    // arrow function returning directly
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
                    console.log(`Map without key at line ${line}`);
                }
            }
        }
    }
    ts.forEachChild(node, visit);
}
visit(sourceFile);
