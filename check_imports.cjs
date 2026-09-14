const ts = require('typescript');
const fs = require('fs');

const code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Dashboard.tsx', code, ts.ScriptTarget.Latest, true);

let imports = [];
ts.forEachChild(sourceFile, node => {
    if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier.text;
        if (moduleSpecifier.startsWith('.')) {
            if (node.importClause && node.importClause.namedBindings) {
                if (ts.isNamedImports(node.importClause.namedBindings)) {
                    node.importClause.namedBindings.elements.forEach(el => {
                        imports.push({ name: el.name.text, module: moduleSpecifier });
                    });
                }
            }
        }
    }
});

imports.forEach(imp => {
    try {
        let path = 'src/components/' + imp.module.replace('./', '').replace('../', '../') + '.tsx';
        if (!fs.existsSync(path)) {
            path = 'src/components/' + imp.module.replace('./', '').replace('../', '../') + '.ts';
        }
        if (!fs.existsSync(path)) {
            path = 'src/' + imp.module.replace('../', '') + '.tsx';
        }
        if (!fs.existsSync(path)) {
            path = 'src/' + imp.module.replace('../', '') + '.ts';
        }
        
        if (fs.existsSync(path)) {
            const content = fs.readFileSync(path, 'utf8');
            if (!content.includes('export const ' + imp.name) && 
                !content.includes('export function ' + imp.name) && 
                !content.includes('export class ' + imp.name) &&
                !content.includes('export interface ' + imp.name) &&
                !content.includes('export type ' + imp.name) &&
                !content.includes('export { ' + imp.name)) {
                console.log(`Missing export: ${imp.name} in ${path}`);
            }
        } else {
            console.log(`File not found for module: ${imp.module} (looked for ${path})`);
        }
    } catch(e) {
        console.error(e);
    }
});
