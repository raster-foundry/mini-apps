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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.callWorker = exports.initWorker = undefined;

var _randomKey = __webpack_require__(0);

var _randomKey2 = _interopRequireDefault(_randomKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messages = {};

var workerPromise = void 0;

// Cache the currently executing script at initialization so that we can use it later to figure
// out where all the other scripts should be pulled from
var _scripts = document.getElementsByTagName('script');
var THIS_SCRIPT = _scripts[_scripts.length - 1];

// Inspired by Emscripten's method for doing the same thing
function getPathPrefix() {
    return THIS_SCRIPT.src.substring(0, THIS_SCRIPT.src.lastIndexOf('/')) + '/';
}

// Set up a WebWorker and an associated promise that resolves once it's ready
function initWorker() {
    if (typeof workerPromise === 'undefined') {
        workerPromise = new Promise(function (resolve, reject) {
            var _worker = new Worker(getPathPrefix() + 'loam-worker.js');

            // The worker needs to do some initialization, and will send a message when it's ready.
            _worker.onmessage = function (msg) {
                if (msg.data.ready) {
                    // Once the worker's ready, change the onMessage function to execute and clear
                    // the stored promise resolvers.
                    _worker.onmessage = function (msg) {
                        // Execute stored promise resolver by message ID
                        // Promise resolvers are stored by callWorker().
                        if (msg.data.success) {
                            messages[msg.data.id][0](msg.data.result);
                        } else {
                            messages[msg.data.id][1](new Error(msg.data.message));
                        }
                        delete messages[msg.data.id];
                    };
                    resolve(_worker);
                }
            };
        });
    }
    return workerPromise;
}

// Store a listener function with a key so that we can associate it with a message later.
function addMessageResolver(callback, errback) {
    var key = (0, _randomKey2.default)();

    while (messages.hasOwnProperty(key)) {
        key = (0, _randomKey2.default)();
    }
    messages[key] = [callback, errback];
    return key;
}

// Call the GDAL API function specified by `name`, with an array of arguments
function callWorker(name, args) {
    return initWorker().then(function (worker) {
        return new Promise(function (resolve, reject) {
            var resolverId = addMessageResolver(function (gdalResult) {
                resolve(gdalResult);
            }, function (reason) {
                reject(reason);
            });

            worker.postMessage({
                id: resolverId,
                function: name,
                arguments: args
            });
        });
    });
}

exports.initWorker = initWorker;
exports.callWorker = callWorker;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _workerCommunication = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GDALDataset = function () {
    function GDALDataset(datasetPtr, filePath, directory, filename) {
        _classCallCheck(this, GDALDataset);

        this.datasetPtr = datasetPtr;
        this.filePath = filePath;
        this.directory = directory;
        this.filename = filename;
    }

    _createClass(GDALDataset, [{
        key: '_deleteSelf',
        value: function _deleteSelf() {
            delete this.datasetPtr;
            delete this.filePath;
            delete this.directory;
            delete this.filename;
        }
    }, {
        key: 'close',
        value: function close() {
            var _this = this;

            return (0, _workerCommunication.callWorker)('GDALClose', [this.datasetPtr, this.directory, this.filePath]).then(function (result) {
                _this._deleteSelf();
                return result;
            }, function (reason) {
                _this._deleteSelf();
                throw reason;
            });
        }
    }, {
        key: 'closeAndReadBytes',
        value: function closeAndReadBytes() {
            var _this2 = this;

            return (0, _workerCommunication.callWorker)('GDALClose', [this.datasetPtr, this.directory, this.filePath, true]).then(function (result) {
                _this2._deleteSelf();
                return result;
            }, function (reason) {
                _this2._deleteSelf();
                throw reason;
            });
        }
    }, {
        key: 'count',
        value: function count() {
            return (0, _workerCommunication.callWorker)('GDALGetRasterCount', [this.datasetPtr]);
        }
    }, {
        key: 'width',
        value: function width() {
            return (0, _workerCommunication.callWorker)('GDALGetRasterXSize', [this.datasetPtr]);
        }
    }, {
        key: 'height',
        value: function height() {
            return (0, _workerCommunication.callWorker)('GDALGetRasterYSize', [this.datasetPtr]);
        }
    }, {
        key: 'wkt',
        value: function wkt() {
            return (0, _workerCommunication.callWorker)('GDALGetProjectionRef', [this.datasetPtr]);
        }
    }, {
        key: 'transform',
        value: function transform() {
            return (0, _workerCommunication.callWorker)('GDALGetGeoTransform', [this.datasetPtr]);
        }
    }, {
        key: 'convert',
        value: function convert(args) {
            return (0, _workerCommunication.callWorker)('GDALTranslate', [this.datasetPtr, args]).then(function (translateResult) {
                return new GDALDataset(translateResult.datasetPtr, translateResult.filePath, translateResult.directory, translateResult.filename);
            }, function (error) {
                throw error;
            });
        }
    }, {
        key: 'warp',
        value: function warp(args) {
            return (0, _workerCommunication.callWorker)('GDALWarp', [this.datasetPtr, args]).then(function (warpResult) {
                return new GDALDataset(warpResult.datasetPtr, warpResult.filePath, warpResult.directory, warpResult.filename);
            }, function (error) {
                throw error;
            });
        }
    }]);

    return GDALDataset;
}();

exports.default = GDALDataset;
module.exports = exports['default'];

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(5);

var _gdalDataset = __webpack_require__(2);

var _gdalDataset2 = _interopRequireDefault(_gdalDataset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { open: _api.open, flushFS: _api.flushFS, GDALDataset: _gdalDataset2.default, initialize: _api.initialize };
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialize = exports.flushFS = exports.open = undefined;

var _workerCommunication = __webpack_require__(1);

var _gdalDataset = __webpack_require__(2);

var _gdalDataset2 = _interopRequireDefault(_gdalDataset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function open(file) {
    return (0, _workerCommunication.callWorker)('GDALOpen', [file]).then(function (openResult) {
        return new _gdalDataset2.default(openResult.datasetPtr, openResult.filePath, openResult.directory, openResult.filename);
    }, function (error) {
        throw error;
    });
}

function flushFS() {
    return (0, _workerCommunication.callWorker)('LoamFlushFS', []);
}

function initialize() {
    return (0, _workerCommunication.initWorker)();
}

exports.open = open;
exports.flushFS = flushFS;
exports.initialize = initialize;

/***/ })
/******/ ]);
});
//# sourceMappingURL=loam.js.map