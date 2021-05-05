const AutograderError = require("./AutograderError");

module.exports = {
    executionMetadataToString(metadata, expectedValue) {
        let result = '\nSearching for a function that meets the desired test condition:\n' +
            'It should return ' + JSON.stringify(expectedValue) + '\n\n' +
            'We might be trying to execute multiple functions you submitted\n' +
            'in order to make up for any typos in function names.\n\n' +
            'We have tried executing the following functions:\n\n';
               for (let element of metadata) {
                result += 'Function: ' + JSON.stringify(element.functionMetadata, null, 2) + '\n';
                result += 'With arguments: ' + JSON.stringify(element.arguments) + '\n';
                result += 'Resulted in: ' + JSON.stringify(element.result)+ '\n\n';
               }
               return result;
    },

    captureConsoleLogSync(fn, outputCapture) {
        outputCapture = outputCapture || {};

        let output = "";
        const logFn = console.log;
        console.log = function(str) {
            output += str + "\n";
        };

        fn();

        console.log = logFn;

        outputCapture.output = output;

        return output;
    },

    async captureConsoleLog(fn, outputCapture) {
        outputCapture = outputCapture || {};

        let output = "";
        const logFn = console.log;
        console.log = function(str) {
            output += str + "\n";
        };

        await fn();

        console.log = logFn;

        outputCapture.output = output;

        return output;
    },

    async captureError(fn) {
        try {
            await fn();
        }
        catch (e) {
            if(e instanceof AutograderError) {
                throw e;
            }

            return e;
        }
    }
};

expect.extend({
    toBeArray(received, argument) {
        if(Array.isArray(received)) {
            return {
                pass: true
            }
        }

        return {
            pass: false,
            message: `expected ${received} to be an array`
        };
    },
    toEndWith(received, argument) {
        if(received.endsWith(argument)) {
            return {
                pass: true
            }
        }

        return {
            pass: false,
            message: `expected URL to end with ${argument}`
        };
    }
});
