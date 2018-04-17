(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("loam", [], factory);
	else if(typeof exports === 'object')
		exports["loam"] = factory();
	else
		root["loam"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = randomKey;
// https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
function randomKey() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
    var chars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0123456789abcdefghijklmnopqrstuvwxyz';

    var result = '';

    for (var i = length; i > 0; i--) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
module.exports = exports['default'];

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = guessFileExtension;
function guessFileExtension(args) {
    var supportedFormats = {
        PNG: 'png',
        JPEG: 'jpg',
        GTiff: 'tif'
    };

    // Match GDAL 2.1 behavior: if output format is unspecified, the output format is GeoTiff
    // This changes to auto-detection based on extension in GDAL 2.3, so if/when we upgrade to that,
    // this will need to be changed.
    if (!args.includes('-of')) {
        return 'tif';
    }
    // Otherwise, try to guess the format from the arguments; this isn't meant for validation, just
    // to provide a reasonable filename if it ever ends up getting exposed to the user.
    var formatStr = args[args.indexOf('-of') + 1];

    if (Object.keys(supportedFormats).includes(formatStr)) {
        return supportedFormats[formatStr];
    }
    // If the next parameter after `-of` isn't in our supported formats, then the user is trying
    // to specify a format that's not supported by gdal-js, or their gdal_translate arguments
    // array is malformed. Either way, it's not really this function's business to validate
    // that, so just return the best guess as to what the user might have intended. Any errors
    // will be handled by the main function's error handling code.
    return formatStr;
}
module.exports = exports['default'];

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gdalOpen = __webpack_require__(7);

var _gdalOpen2 = _interopRequireDefault(_gdalOpen);

var _gdalClose = __webpack_require__(8);

var _gdalClose2 = _interopRequireDefault(_gdalClose);

var _gdalGetRasterCount = __webpack_require__(9);

var _gdalGetRasterCount2 = _interopRequireDefault(_gdalGetRasterCount);

var _gdalGetRasterXSize = __webpack_require__(10);

var _gdalGetRasterXSize2 = _interopRequireDefault(_gdalGetRasterXSize);

var _gdalGetRasterYSize = __webpack_require__(11);

var _gdalGetRasterYSize2 = _interopRequireDefault(_gdalGetRasterYSize);

var _gdalGetProjectionRef = __webpack_require__(12);

var _gdalGetProjectionRef2 = _interopRequireDefault(_gdalGetProjectionRef);

var _gdalGetGeoTransform = __webpack_require__(13);

var _gdalGetGeoTransform2 = _interopRequireDefault(_gdalGetGeoTransform);

var _gdalTranslate = __webpack_require__(14);

var _gdalTranslate2 = _interopRequireDefault(_gdalTranslate);

var _gdalWarp = __webpack_require__(15);

var _gdalWarp2 = _interopRequireDefault(_gdalWarp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* global FS, Runtime, importScripts, postMessage */

// w is for wrap
// The wrappers are factories that return functions which perform the necessary setup and
// teardown for interacting with GDAL inside Emscripten world.


var DATASETPATH = '/datasets';

var initialized = false;

var registry = {};
var errorHandling = {
    // In order to make enums available from JS it's necessary to use embind, which seems like
    // overkill for something this small. But this is a replication of the CPLErr enum in
    // cpl_error.h
    CPLErr: {
        CENone: 0,
        CEDebug: 1,
        CEWarning: 2,
        CEFailure: 3,
        CEFatal: 4
    },
    // These will be populated by onRuntimeInitialized, below
    CPLErrorReset: null,
    CPLGetLastErrorMsg: null,
    CPLGetLastErrorNo: null,
    CPLGetLastErrorType: null
};

self.Module = {
    'print': function print(text) {
        console.log('stdout: ' + text);
    },
    'printErr': function printErr(text) {
        console.log('stderr: ' + text);
    },
    // Optimized builds contain a .js.mem file which is loaded asynchronously;
    // this waits until that has finished before performing further setup.
    'onRuntimeInitialized': function onRuntimeInitialized() {
        // Initialize GDAL
        self.Module.ccall('GDALAllRegister', null, [], []);

        // Set up error handling
        errorHandling.CPLErrorReset = self.Module.cwrap('CPLErrorReset', null, []);
        errorHandling.CPLGetLastErrorMsg = self.Module.cwrap('CPLGetLastErrorMsg', 'string', []);
        errorHandling.CPLGetLastErrorNo = self.Module.cwrap('CPLGetLastErrorNo', 'number', []);
        errorHandling.CPLGetLastErrorType = self.Module.cwrap('CPLGetLastErrorType', 'number', []);
        // Get a "function pointer" to the built-in quiet error handler so that errors don't
        // cause tons of console noise.
        var cplQuietFnPtr = Runtime.addFunction(self.Module.cwrap('CPLQuietErrorHandler', 'number', ['number']));

        // Then set the error handler to the quiet handler.
        self.Module.ccall('CPLSetErrorHandler', 'number', ['number'], [cplQuietFnPtr]);

        // Set up JS proxy functions
        // Note that JS Number types are used to represent pointers, which means that
        // any time we want to pass a pointer to an object, such as in GDALOpen, which in
        // C returns a pointer to a GDALDataset, we need to use 'number'.
        //
        registry.GDALOpen = (0, _gdalOpen2.default)(self.Module.cwrap('GDALOpen', 'number', ['string']), errorHandling, DATASETPATH);
        registry.GDALClose = (0, _gdalClose2.default)(self.Module.cwrap('GDALClose', 'number', ['number']), errorHandling);
        registry.GDALGetRasterCount = (0, _gdalGetRasterCount2.default)(self.Module.cwrap('GDALGetRasterCount', 'number', ['number']), errorHandling);
        registry.GDALGetRasterXSize = (0, _gdalGetRasterXSize2.default)(self.Module.cwrap('GDALGetRasterXSize', 'number', ['number']), errorHandling);
        registry.GDALGetRasterYSize = (0, _gdalGetRasterYSize2.default)(self.Module.cwrap('GDALGetRasterYSize', 'number', ['number']), errorHandling);
        registry.GDALGetProjectionRef = (0, _gdalGetProjectionRef2.default)(self.Module.cwrap('GDALGetProjectionRef', 'string', ['number']), errorHandling);
        registry.GDALGetGeoTransform = (0, _gdalGetGeoTransform2.default)(self.Module.cwrap('GDALGetGeoTransform', 'number', ['number', 'number']), errorHandling);
        registry.GDALTranslate = (0, _gdalTranslate2.default)(self.Module.cwrap('GDALTranslate', 'number', ['string', // Output path
        'number', // GDALDatasetH source dataset
        'number', // GDALTranslateOptions *
        'number' // int * to use for error reporting
        ]), errorHandling, DATASETPATH);
        registry.GDALWarp = (0, _gdalWarp2.default)(self.Module.cwrap('GDALWarp', 'number', ['string', // Destination dataset path or NULL
        'number', // GDALDatasetH destination dataset or NULL
        'number', // Number of input datasets
        'number', // GDALDatasetH * list of source datasets
        'number', // GDALWarpAppOptions *
        'number' // int * to use for error reporting
        ]), errorHandling, DATASETPATH);
        registry.LoamFlushFS = function () {
            var datasetFolders = FS.lookupPath(DATASETPATH).node.contents;

            Object.values(datasetFolders).forEach(function (node) {
                FS.unmount(FS.getPath(node));
                FS.rmdir(FS.getPath(node));
            });
            return true;
        };
        FS.mkdir(DATASETPATH);
        initialized = true;
        postMessage({ ready: true });
    }
};

// Load gdal.js. This will populate the Module object, and then call
// Module.onRuntimeInitialized() when it is ready for user code to interact with it.
importScripts('gdal.js');

onmessage = function onmessage(msg) {
    if (!initialized) {
        postMessage({ success: false, message: 'Runtime not yet initialized' });
        return;
    }
    if (msg.data['function'] && registry[msg.data['function']]) {
        var func = registry[msg.data['function']];
        var args = msg.data.arguments;

        // TODO: More error handling
        try {
            var result = func.apply(undefined, _toConsumableArray(args));

            postMessage({
                success: true,
                result: result,
                id: msg.data.id
            });
        } catch (error) {
            postMessage({
                success: false,
                message: error.message,
                id: msg.data.id
            });
        }
        return;
    }
    postMessage({
        success: false,
        message: 'No "function" key specified or function not found',
        id: msg.data.id
    });
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALOpen, errorHandling, rootPath) {
    return function (file) {
        var filename = void 0;
        var directory = rootPath + '/' + (0, _randomKey2.default)();

        FS.mkdir(directory);

        if (file instanceof File) {
            filename = file.name;
            FS.mount(WORKERFS, { files: [file] }, directory);
        } else if (file instanceof Blob) {
            filename = 'geotiff.tif';
            FS.mount(WORKERFS, { blobs: [{ name: filename, data: file }] }, directory);
        }
        var filePath = directory + '/' + filename;
        var datasetPtr = GDALOpen(filePath);
        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            FS.unmount(directory);
            FS.rmdir(directory);
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        } else {
            return {
                datasetPtr: datasetPtr,
                filePath: filePath,
                directory: directory,
                filename: filename
            };
        }
    };
};

var _randomKey = __webpack_require__(0);

var _randomKey2 = _interopRequireDefault(_randomKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/* global FS WORKERFS */

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALClose, errorHandling) {
    return function (datasetPtr, directory, datasetPath) {
        var returnFileBytes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        GDALClose(datasetPtr);
        var result = [];

        if (returnFileBytes) {
            result = FS.readFile(datasetPath, { encoding: 'binary' });
        }
        FS.unmount(directory);
        FS.rmdir(directory);

        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        } else {
            return result;
        }
    };
};

module.exports = exports['default']; /* global FS */

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALGetRasterCount, errorHandling) {
    return function (datasetPtr) {
        var result = GDALGetRasterCount(datasetPtr);
        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        } else {
            return result;
        }
    };
};

module.exports = exports["default"];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALGetRasterXSize, errorHandling) {
    return function (datasetPtr) {
        var result = GDALGetRasterXSize(datasetPtr);
        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        } else {
            return result;
        }
    };
};

module.exports = exports["default"];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALGetRasterYSize, errorHandling) {
    return function (datasetPtr) {
        var result = GDALGetRasterYSize(datasetPtr);
        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            var message = errorHandling.CPLGetLastErrorMsg();

            throw Error(message);
        } else {
            return result;
        }
    };
};

module.exports = exports["default"];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALGetProjectionRef, errorHandling) {
    return function (datasetPtr) {
        var result = GDALGetProjectionRef(datasetPtr);
        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        } else {
            return result;
        }
    };
};

module.exports = exports["default"];

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALGetGeoTransform, errorHandling) {
    return function (datasetPtr) {
        // This is the first wrapper where things get a bit hairy; the C function follows a common C
        // pattern where an array to store the results is allocated and passed into the function,
        // which populates the array with the results. Emscripten supports passing arrays to
        // functions, but it always creates a *copy* of the array, which means that the original JS
        // array remains unchanged, which isn't what we want in this case. So first, we have to
        // malloc an array inside the Emscripten heap with the correct size. In this case that is 6
        // because the GDAL affine transform array has six elements.
        var byteOffset = Module._malloc(6 * Float64Array.BYTES_PER_ELEMENT);

        // byteOffset is now a pointer to the start of the double array in Emscripten heap space
        // GDALGetGeoTransform dumps 6 values into the passed double array.
        GDALGetGeoTransform(datasetPtr, byteOffset);

        // Module.HEAPF64 provides a view into the Emscripten heap, as an array of doubles.
        // Therefore, our byte offset from _malloc needs to be converted into a double offset, so we
        // divide it by the number of bytes per double, and then get a subarray of those six
        // elements off the Emscripten heap.
        var geoTransform = Module.HEAPF64.subarray(byteOffset / Float64Array.BYTES_PER_ELEMENT, byteOffset / Float64Array.BYTES_PER_ELEMENT + 6);
        var errorType = errorHandling.CPLGetLastErrorType();

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            Module._free(byteOffset);
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        } else {
            // To avoid memory leaks in the Emscripten heap, we need to free up the memory we allocated
            // after we've converted it into a Javascript object.
            var result = Array.from(geoTransform);

            Module._free(byteOffset);

            return result;
        }
    };
};

module.exports = exports["default"]; /* global Module */

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALTranslate, errorHandling, rootPath) {
    // Args is expected to be an array of strings that could function as arguments to gdal_translate
    return function (dataset, args) {
        // So first, we need to allocate Emscripten heap space sufficient to store each string as a
        // null-terminated C string.
        // Because the C function signature is char **, this array of pointers is going to need to
        // get copied into Emscripten heap space eventually, so we're going to prepare by storing
        // the pointers as a typed array so that we can more easily copy it into heap space later.
        var argPtrsArray = Uint32Array.from(args.map(function (argStr) {
            return Module._malloc(Module.lengthBytesUTF8(argStr) + 1); // +1 for the null terminator byte
        }).concat([0]));
        // ^ In addition to each individual argument being null-terminated, the GDAL docs specify that
        // GDALTranslateOptionsNew takes its options passed in as a null-terminated array of
        // pointers, so we have to add on a null (0) byte at the end.

        // Next, we need to write each string from the JS string array into the Emscripten heap space
        // we've allocated for it.
        args.forEach(function (argStr, i) {
            Module.stringToUTF8(argStr, argPtrsArray[i], Module.lengthBytesUTF8(argStr) + 1);
        });

        // Now, as mentioned above, we also need to copy the pointer array itself into heap space.
        var argPtrsArrayPtr = Module._malloc(argPtrsArray.length * argPtrsArray.BYTES_PER_ELEMENT);

        Module.HEAPU32.set(argPtrsArray, argPtrsArrayPtr / argPtrsArray.BYTES_PER_ELEMENT);

        // Whew, all finished. argPtrsArrayPtr is now the address of the start of the list of
        // pointers in Emscripten heap space. Each pointer identifies the address of the start of a
        // parameter string, also stored in heap space. This is the direct equivalent of a char **,
        // which is what GDALTranslateOptionsNew requires.
        var translateOptionsPtr = Module.ccall('GDALTranslateOptionsNew', 'number', ['number', 'number'], [argPtrsArrayPtr, null]);
        // Validate that the options were correct
        var optionsErrType = errorHandling.CPLGetLastErrorType();

        if (optionsErrType === errorHandling.CPLErr.CEFailure || optionsErrType === errorHandling.CPLErr.CEFatal) {
            Module._free(argPtrsArrayPtr);
            // Don't try to free the null terminator byte
            argPtrsArray.subarray(0, argPtrsArray.length - 1).forEach(function (ptr) {
                return Module._free(ptr);
            });
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        }

        // Now that we have our translate options, we need to make a file location to hold the output.
        var directory = rootPath + '/' + (0, _randomKey2.default)();

        FS.mkdir(directory);
        // This makes it easier to remove later because we can just unmount rather than recursing
        // through the whole directory structure.
        FS.mount(MEMFS, {}, directory);
        var filename = (0, _randomKey2.default)(8) + '.' + (0, _guessFileExtension2.default)(args);
        var filePath = directory + '/' + filename;
        // And then we can kick off the actual translation process.
        // TODO: The last parameter is an int* that can be used to detect certain kinds of errors,
        // but I'm not sure how it works yet and whether it gives the same or different information
        // than CPLGetLastErrorType
        // We can get some error information out of the final pbUsageError parameter, which is an
        // int*, so malloc ourselves an int and set it to 0 (False)
        var usageErrPtr = Module._malloc(Int32Array.BYTES_PER_ELEMENT);

        Module.setValue(usageErrPtr, 0, 'i32');
        var newDatasetPtr = GDALTranslate(filePath, dataset, translateOptionsPtr, usageErrPtr);
        var errorType = errorHandling.CPLGetLastErrorType();
        // If we ever want to use the usage error pointer:
        // let usageErr = Module.getValue(usageErrPtr, 'i32');

        // The final set of cleanup we need to do, in a function to avoid writing it twice.
        function cleanUp() {
            Module.ccall('GDALTranslateOptionsFree', null, ['number'], [translateOptionsPtr]);
            Module._free(argPtrsArrayPtr);
            Module._free(usageErrPtr);
            // Don't try to free the null terminator byte
            argPtrsArray.subarray(0, argPtrsArray.length - 1).forEach(function (ptr) {
                return Module._free(ptr);
            });
        }

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            cleanUp();
            var _message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(_message);
        } else {
            var result = {
                datasetPtr: newDatasetPtr,
                filePath: filePath,
                directory: directory,
                filename: filename
            };

            cleanUp();

            return result;
        }
    };
};

var _randomKey = __webpack_require__(0);

var _randomKey2 = _interopRequireDefault(_randomKey);

var _guessFileExtension = __webpack_require__(3);

var _guessFileExtension2 = _interopRequireDefault(_guessFileExtension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/* global Module, FS, MEMFS */

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (GDALWarp, errorHandling, rootPath) {
    // Args is expected to be an array of strings that could function as arguments to gdal_translate
    return function (dataset, args) {
        // So first, we need to allocate Emscripten heap space sufficient to store each string as a
        // null-terminated C string.
        // Because the C function signature is char **, this array of pointers is going to need to
        // get copied into Emscripten heap space eventually, so we're going to prepare by storing
        // the pointers as a typed array so that we can more easily copy it into heap space later.
        var argPtrsArray = Uint32Array.from(args.map(function (argStr) {
            return Module._malloc(Module.lengthBytesUTF8(argStr) + 1); // +1 for the null terminator byte
        }).concat([0]));
        // ^ In addition to each individual argument being null-terminated, the GDAL docs specify that
        // GDALTranslateOptionsNew takes its options passed in as a null-terminated array of
        // pointers, so we have to add on a null (0) byte at the end.

        // Next, we need to write each string from the JS string array into the Emscripten heap space
        // we've allocated for it.
        args.forEach(function (argStr, i) {
            Module.stringToUTF8(argStr, argPtrsArray[i], Module.lengthBytesUTF8(argStr) + 1);
        });

        // Now, as mentioned above, we also need to copy the pointer array itself into heap space.
        var argPtrsArrayPtr = Module._malloc(argPtrsArray.length * argPtrsArray.BYTES_PER_ELEMENT);

        Module.HEAPU32.set(argPtrsArray, argPtrsArrayPtr / argPtrsArray.BYTES_PER_ELEMENT);

        // Whew, all finished. argPtrsArrayPtr is now the address of the start of the list of
        // pointers in Emscripten heap space. Each pointer identifies the address of the start of a
        // parameter string, also stored in heap space. This is the direct equivalent of a char **,
        // which is what GDALWarpAppOptionsNew requires.
        var warpAppOptionsPtr = Module.ccall('GDALWarpAppOptionsNew', 'number', ['number', 'number'], [argPtrsArrayPtr, null]);
        // Validate that the options were correct
        var optionsErrType = errorHandling.CPLGetLastErrorType();

        if (optionsErrType === errorHandling.CPLErr.CEFailure || optionsErrType === errorHandling.CPLErr.CEFatal) {
            Module._free(argPtrsArrayPtr);
            // Don't try to free the null terminator byte
            argPtrsArray.subarray(0, argPtrsArray.length - 1).forEach(function (ptr) {
                return Module._free(ptr);
            });
            var message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(message);
        }

        // Now that we have our translate options, we need to make a file location to hold the output.
        var directory = rootPath + '/' + (0, _randomKey2.default)();

        FS.mkdir(directory);
        // This makes it easier to remove later because we can just unmount rather than recursing
        // through the whole directory structure.
        FS.mount(MEMFS, {}, directory);
        var filename = (0, _randomKey2.default)(8) + '.' + (0, _guessFileExtension2.default)(args);
        var filePath = directory + '/' + filename;
        // And then we can kick off the actual warping process.
        // TODO: The last parameter is an int* that can be used to detect certain kinds of errors,
        // but I'm not sure how it works yet and whether it gives the same or different information
        // than CPLGetLastErrorType
        // We can get some error information out of the final pbUsageError parameter, which is an
        // int*, so malloc ourselves an int and set it to 0 (False)
        var usageErrPtr = Module._malloc(Int32Array.BYTES_PER_ELEMENT);

        Module.setValue(usageErrPtr, 0, 'i32');

        // We also need a GDALDatasetH * list of datasets. Since we're just warping a single dataset
        // at a time, we don't need to do anything fancy here.
        var datasetListPtr = Module._malloc(4); // 32-bit pointer

        Module.setValue(datasetListPtr, dataset, '*'); // Set datasetListPtr to the address of dataset
        var newDatasetPtr = GDALWarp(filePath, // Output
        0, // NULL because filePath is not NULL
        1, // Number of input datasets; this is always called on a single dataset
        datasetListPtr, warpAppOptionsPtr, usageErrPtr);
        var errorType = errorHandling.CPLGetLastErrorType();
        // If we ever want to use the usage error pointer:
        // let usageErr = Module.getValue(usageErrPtr, 'i32');

        // The final set of cleanup we need to do, in a function to avoid writing it twice.
        function cleanUp() {
            Module.ccall('GDALWarpAppOptionsFree', null, ['number'], [warpAppOptionsPtr]);
            Module._free(argPtrsArrayPtr);
            Module._free(usageErrPtr);
            // Don't try to free the null terminator byte
            argPtrsArray.subarray(0, argPtrsArray.length - 1).forEach(function (ptr) {
                return Module._free(ptr);
            });
        }

        // Check for errors; clean up and throw if error is detected
        if (errorType === errorHandling.CPLErr.CEFailure || errorType === errorHandling.CPLErr.CEFatal) {
            cleanUp();
            var _message = errorHandling.CPLGetLastErrorMsg();

            throw new Error(_message);
        } else {
            var result = {
                datasetPtr: newDatasetPtr,
                filePath: filePath,
                directory: directory,
                filename: filename
            };

            cleanUp();

            return result;
        }
    };
};

var _randomKey = __webpack_require__(0);

var _randomKey2 = _interopRequireDefault(_randomKey);

var _guessFileExtension = __webpack_require__(3);

var _guessFileExtension2 = _interopRequireDefault(_guessFileExtension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/* global Module, FS, MEMFS */

/***/ })
/******/ ]);
});
//# sourceMappingURL=loam-worker.js.map