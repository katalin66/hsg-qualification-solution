const path = require('path');
const fs = require('fs');
const vm = require('vm');

module.exports = {

    findFunctions: async function (pathToScan, skipFiles) {

        const files = (await readdirRecursive(pathToScan))
            .filter(fileName => fileName.endsWith('.js'));

        let functions = [];
        for (let file of files) {
            try {
                if ( ! skipFiles || ! skipFiles.some(fileName => new RegExp(fileName).test(file)) ) {

                    const module = await import(file);
                    if (isEmptyObject(module)) {
                        const context = await loadNonModule(file);
                        collectFunctions(file, context, functions);
                    } else {
                        collectFunctions(file, module, functions);
                    }
                }
            } catch (e) {
                if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                    const context = await loadNonModule(file);
                    collectFunctions(file, context, functions);
                } else {
                    console.error(`Could not load file: ${file}`);
                    console.error(e);
                }
            }
        }
        return functions;
    },
    readdirRecursive
};

async function readdirRecursive(dir) {
    let result = [];
    const files = await fs.promises.readdir(dir);
    for (let file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.lstat(filePath);
        if (file !== '.' && file !== '..' && stat.isDirectory()) {
            const subdirFiles = await readdirRecursive(filePath);
            result = result.concat(subdirFiles);
        } else {
            result.push(filePath);
        }
    }
    return result;
}

function collectFunctions(fileName, module, functions) {
    if (typeof module === 'function') {
        functions.push({
            fnMetadata: {
                fileName,
                functionName: module.name
            },
            fn: module
        });
    }
    for (let prop in module) {
        if (module.hasOwnProperty(prop) && typeof module[prop] === 'function') {
            const fn = module[prop];
            functions.push({
                fnMetadata: {
                    fileName,
                    propName: prop,
                    functionName: fn.name
                },
                fn
            });
        }
    }
}

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor.name === 'Object';
}

/**
 * IMPORTANT: Functions declared in non-module files will only get recognized if:
 * - they are declared as global functions: function() {}
 * - they are assigned to a variable declared with 'var': var fn = () => {}  :-(
 * - unfortunately, even global variables declared with let or const do not get attached to the global object, thus they cannot be extracted here.
 */
async function loadNonModule(file) {
    //console.log('File ' + file + ' is not a module. Loading as a plain script with vm.Script');
    const context = vm.createContext({});
    const fileContents = await fs.promises.readFile(file);
    const script = new vm.Script(fileContents);
    script.runInContext(context);
    return context;
}
