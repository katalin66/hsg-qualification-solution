const _ = require("lodash");
const pathScanUtils = require("./pathScanUtils");
const AutograderError = require("./AutograderError");

module.exports = class MetaFunction {

    constructor(args) {
        const { pathToScan, functionName } = args;
        this.pathToScan = pathToScan;
        this.functionName = functionName;
    }

    async exists() {
        await this.initCandidatesIfRequired();
        return this.candidates.length > 0;
    }

    async getFn(skipFiles) {
        await this.initCandidatesIfRequired(skipFiles);

        if (this.candidates.length === 0) {
            throw new AutograderError(`The method named ${this.functionName} could not be found. Make sure to use the correct file and method name.`)
        }

        return this.candidates[0].fn;
    }

    async invoke() {
        await this.initCandidatesIfRequired();

        if (this.candidates.length === 0) {
            throw new AutograderError(`The method named ${this.functionName} could not be found. Make sure to use the correct file and method name.`)
        }

        let resultCandidates = this.candidates.map(fnObject => {
            const { fn } = fnObject;
            const argsArray = _.cloneDeep(argumentsToArray(arguments));
            return fn.apply(null, argsArray);
        });

        if (resultCandidates.length === 0) {
            return null;
        }

        return resultCandidates[0];
    }

    async instantiate() {
        await this.initCandidatesIfRequired();

        if (this.candidates.length === 0) {
            throw new AutograderError(`The class named ${this.functionName} could not be found. Make sure to use the correct file and method name.`)
        }

        let objects = this.candidates
            .filter(fnObject => fnObject.fnMetadata.functionName === this.functionName)
            .map(fnObject => {
                const { fn } = fnObject;
                const argsArray = _.cloneDeep(argumentsToArray(arguments));
                return applyToConstructor(fn, argsArray);
            });

        if (objects.length === 0) {
            return null;
        }

        return objects[0];

        function applyToConstructor(constructor, argArray) {
            let args = [null].concat(argArray);
            let factoryFunction = constructor.bind.apply(constructor, args);
            return new factoryFunction();
        }
    }

    async instanceOf(instance) {
        await this.initCandidatesIfRequired();

        return this.candidates
            .filter(fnObject => fnObject.fnMetadata.functionName === this.functionName)
            .some(fnObject => {
                const { fn } = fnObject;
                try {
                    return instance instanceof fn;
                } catch (e) {
                    return e;
                }
            });
    }

    async initCandidatesIfRequired(skipFiles) {
        if (!this.candidates) {
            let candidates = await pathScanUtils.findFunctions(this.pathToScan, skipFiles);
            if (this.functionName) {
                candidates = candidates.filter(fnObject => functionHasName(fnObject, this.functionName));
            }
            this.candidates = candidates;
        }
    }

    async invokeAndGetMetadata() {
        await this.initCandidatesIfRequired();
        return this.candidates.map(fnObject => {
            const { fn } = fnObject;
            const argsArray = _.cloneDeep(argumentsToArray(arguments));
            try {
                const result = fn.apply(null, argsArray);
                return {
                    functionMetadata: fnObject.fnMetadata,
                    arguments: argsArray,
                    result
                };
            } catch (e) {
                return {
                    functionMetadata: fnObject.fnMetadata,
                    arguments: argsArray,
                    result: e.message
                };
            }
        });
    }
};

function argumentsToArray(args) {
    return Array.prototype.slice.call(args);
}

function functionHasName(fnObject, name) {
    return fnObject.fnMetadata.fileName.endsWith(name + '.js')
        || (fnObject.fnMetadata.functionName && fnObject.fnMetadata.functionName === name)
        || (fnObject.fnMetadata.propName && fnObject.fnMetadata.propName === name);
}
