(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SWK"] = factory();
	else
		root["SWK"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/core/Camera.js":
/*!*******************************!*\
  !*** ./src/js/core/Camera.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Camera)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Camera management (Perspective and Orthographic)
 */


var Camera = /*#__PURE__*/function () {
  function Camera(container, config) {
    _classCallCheck(this, Camera);
    this.container = container;
    this.config = config;
    this.perspectiveCamera = null;
    this.orthographicCamera = null;
    this.currentCamera = null;
    this.currentMode = config.get('camera.mode');
    this.controls = null;
    this.init();
  }
  return _createClass(Camera, [{
    key: "init",
    value: function init() {
      var _this$perspectiveCame, _this$orthographicCam;
      var width = this.container.clientWidth;
      var height = this.container.clientHeight;
      var aspect = width / height;

      // Create perspective camera
      var fov = this.config.get('camera.fov');
      var near = this.config.get('camera.near');
      var far = this.config.get('camera.far');
      this.perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);

      // Create orthographic camera
      var frustumSize = 10;
      this.orthographicCamera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, near, far);

      // Set initial positions
      var position = this.config.get('camera.position');
      (_this$perspectiveCame = this.perspectiveCamera.position).set.apply(_this$perspectiveCame, _toConsumableArray(position));
      (_this$orthographicCam = this.orthographicCamera.position).set.apply(_this$orthographicCam, _toConsumableArray(position));

      // Set current camera
      this.currentCamera = this.currentMode === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_MODES.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;

      // Add resize listener
      window.addEventListener('resize', this.onResize.bind(this));
    }

    /**
     * Handle window resize
     */
  }, {
    key: "onResize",
    value: function onResize() {
      var width = this.container.clientWidth;
      var height = this.container.clientHeight;
      var aspect = width / height;

      // Update perspective camera
      this.perspectiveCamera.aspect = aspect;
      this.perspectiveCamera.updateProjectionMatrix();

      // Update orthographic camera
      var frustumSize = 10;
      this.orthographicCamera.left = frustumSize * aspect / -2;
      this.orthographicCamera.right = frustumSize * aspect / 2;
      this.orthographicCamera.top = frustumSize / 2;
      this.orthographicCamera.bottom = frustumSize / -2;
      this.orthographicCamera.updateProjectionMatrix();
    }

    /**
     * Get current camera
     */
  }, {
    key: "getCamera",
    value: function getCamera() {
      return this.currentCamera;
    }

    /**
     * Get perspective camera
     */
  }, {
    key: "getPerspectiveCamera",
    value: function getPerspectiveCamera() {
      return this.perspectiveCamera;
    }

    /**
     * Get orthographic camera
     */
  }, {
    key: "getOrthographicCamera",
    value: function getOrthographicCamera() {
      return this.orthographicCamera;
    }

    /**
     * Set camera mode
     */
  }, {
    key: "setMode",
    value: function setMode(mode) {
      if (!Object.values(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_MODES).includes(mode)) {
        console.warn("Invalid camera mode: ".concat(mode));
        return;
      }

      // Save current camera state
      var currentPosition = this.currentCamera.position.clone();
      var currentTarget = this.controls ? this.controls.target.clone() : new THREE.Vector3();

      // Switch camera
      this.currentMode = mode;
      this.currentCamera = mode === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_MODES.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;

      // Restore camera state
      this.currentCamera.position.copy(currentPosition);

      // Update controls if they exist
      if (this.controls) {
        this.controls.object = this.currentCamera;
        this.controls.target.copy(currentTarget);
        this.controls.update();
      }
    }

    /**
     * Get current mode
     */
  }, {
    key: "getMode",
    value: function getMode() {
      return this.currentMode;
    }

    /**
     * Set orbit controls
     */
  }, {
    key: "setControls",
    value: function setControls(controls) {
      this.controls = controls;
    }

    /**
     * Reset camera position
     */
  }, {
    key: "reset",
    value: function reset() {
      var _this$currentCamera$p;
      var position = this.config.get('camera.position');
      (_this$currentCamera$p = this.currentCamera.position).set.apply(_this$currentCamera$p, _toConsumableArray(position));
      if (this.controls) {
        this.controls.target.set(0, 0, 0);
        this.controls.update();
      }
    }

    /**
     * Dispose camera
     */
  }, {
    key: "dispose",
    value: function dispose() {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }]);
}();


/***/ }),

/***/ "./src/js/core/Config.js":
/*!*******************************!*\
  !*** ./src/js/core/Config.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CONFIG: () => (/* binding */ DEFAULT_CONFIG),
/* harmony export */   "default": () => (/* binding */ Config)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
/* harmony import */ var _utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Helpers.js */ "./src/js/utils/Helpers.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Configuration management with defaults and validation
 */




/**
 * Default configuration
 */
var DEFAULT_CONFIG = {
  // Container & Sizing
  container: null,
  width: '100%',
  height: '100%',
  // Viewport Appearance
  viewportBackground: "#".concat(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_COLORS.VIEWPORT_BG.toString(16).padStart(6, '0')),
  outlineColor: "#".concat(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_COLORS.OUTLINE.toString(16).padStart(6, '0')),
  outlineThickness: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.OUTLINE_THICKNESS,
  // Grid
  grid: {
    show: true,
    size: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.GRID_SETTINGS.SIZE,
    divisions: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.GRID_SETTINGS.DIVISIONS,
    centerColor: "#".concat(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_COLORS.GRID_CENTER.toString(16).padStart(6, '0')),
    linesColor: "#".concat(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_COLORS.GRID_LINES.toString(16).padStart(6, '0'))
  },
  // Camera
  camera: {
    mode: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_MODES.PERSPECTIVE,
    fov: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_SETTINGS.FOV,
    near: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_SETTINGS.NEAR,
    far: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_SETTINGS.FAR,
    position: _toConsumableArray(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_SETTINGS.POSITION)
  },
  // Transform
  transform: {
    mode: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.TRANSFORM_MODES.TRANSLATE,
    space: 'local',
    snapUnit: 0.1
  },
  // Lighting
  lighting: {
    ambient: {
      intensity: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.LIGHTING.AMBIENT_INTENSITY,
      color: "#".concat(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.LIGHTING.AMBIENT_COLOR.toString(16).padStart(6, '0'))
    },
    directional: {
      intensity: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.LIGHTING.DIRECTIONAL_INTENSITY,
      color: "#".concat(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.LIGHTING.DIRECTIONAL_COLOR.toString(16).padStart(6, '0')),
      position: _toConsumableArray(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.LIGHTING.DIRECTIONAL_POSITION)
    },
    castShadow: true
  },
  // UI Elements
  ui: {
    enabled: false,
    // UI disabled by default (use JS API)
    panels: {
      shapes: true,
      properties: true,
      outliner: true,
      controls: true
    }
  },
  // Features
  features: {
    grouping: true,
    undo: true,
    "export": true
  },
  // History
  history: {
    enabled: true,
    maxSize: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.HISTORY_MAX_SIZE
  },
  // Callbacks
  callbacks: {
    onObjectAdded: null,
    onObjectRemoved: null,
    onSelectionChanged: null,
    onTransformChange: null,
    onGroupCreated: null,
    onGroupRemoved: null
  }
};

/**
 * Configuration manager
 */
var Config = /*#__PURE__*/function () {
  function Config() {
    var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Config);
    this.config = this.mergeConfig(userConfig);
    this.validate();
  }

  /**
   * Merge user config with defaults
   */
  return _createClass(Config, [{
    key: "mergeConfig",
    value: function mergeConfig(userConfig) {
      return (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.deepMerge)(DEFAULT_CONFIG, userConfig);
    }

    /**
     * Validate configuration
     */
  }, {
    key: "validate",
    value: function validate() {
      // Validate container
      if (!this.config.container) {
        throw new Error('SWK: Container selector or element is required');
      }

      // Validate camera mode
      if (!Object.values(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_MODES).includes(this.config.camera.mode)) {
        console.warn("SWK: Invalid camera mode \"".concat(this.config.camera.mode, "\", using default"));
        this.config.camera.mode = _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.CAMERA_MODES.PERSPECTIVE;
      }

      // Validate transform mode
      if (!Object.values(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.TRANSFORM_MODES).includes(this.config.transform.mode)) {
        console.warn("SWK: Invalid transform mode \"".concat(this.config.transform.mode, "\", using default"));
        this.config.transform.mode = _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.TRANSFORM_MODES.TRANSLATE;
      }

      // Validate snap unit
      if (this.config.transform.snapUnit < 0) {
        console.warn('SWK: Snap unit must be non-negative, using 0');
        this.config.transform.snapUnit = 0;
      }
      return true;
    }

    /**
     * Get configuration value
     */
  }, {
    key: "get",
    value: function get(path) {
      var keys = path.split('.');
      var value = this.config;
      var _iterator = _createForOfIteratorHelper(keys),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          if (value && _typeof(value) === 'object' && key in value) {
            value = value[key];
          } else {
            return undefined;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return value;
    }

    /**
     * Set configuration value
     */
  }, {
    key: "set",
    value: function set(path, value) {
      var keys = path.split('.');
      var lastKey = keys.pop();
      var target = this.config;
      var _iterator2 = _createForOfIteratorHelper(keys),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value;
          if (!(key in target)) {
            target[key] = {};
          }
          target = target[key];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      target[lastKey] = value;
    }

    /**
     * Get all configuration
     */
  }, {
    key: "getAll",
    value: function getAll() {
      return _objectSpread({}, this.config);
    }
  }]);
}();


/***/ }),

/***/ "./src/js/core/EventEmitter.js":
/*!*************************************!*\
  !*** ./src/js/core/EventEmitter.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventEmitter)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Simple event emitter for internal communication
 */
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
    this.events = {};
  }

  /**
   * Register event listener
   */
  return _createClass(EventEmitter, [{
    key: "on",
    value: function on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
      return this;
    }

    /**
     * Register one-time event listener
     */
  }, {
    key: "once",
    value: function once(event, callback) {
      var _this = this;
      var _wrapper = function wrapper() {
        callback.apply(void 0, arguments);
        _this.off(event, _wrapper);
      };
      return this.on(event, _wrapper);
    }

    /**
     * Remove event listener
     */
  }, {
    key: "off",
    value: function off(event, callback) {
      if (!this.events[event]) return this;
      if (!callback) {
        delete this.events[event];
      } else {
        this.events[event] = this.events[event].filter(function (cb) {
          return cb !== callback;
        });
      }
      return this;
    }

    /**
     * Emit event
     */
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (!this.events[event]) return this;
      this.events[event].forEach(function (callback) {
        try {
          callback.apply(void 0, args);
        } catch (error) {
          console.error("Error in event handler for \"".concat(event, "\":"), error);
        }
      });
      return this;
    }

    /**
     * Remove all listeners
     */
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      this.events = {};
      return this;
    }
  }]);
}();


/***/ }),

/***/ "./src/js/core/Initializer.js":
/*!************************************!*\
  !*** ./src/js/core/Initializer.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Initializer)
/* harmony export */ });
/* harmony import */ var _utils_Helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Helpers.js */ "./src/js/utils/Helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Dual initialization system (JavaScript API and HTML attributes)
 */


var Initializer = /*#__PURE__*/function () {
  function Initializer() {
    _classCallCheck(this, Initializer);
  }
  return _createClass(Initializer, null, [{
    key: "fromAPI",
    value:
    /**
     * Initialize from JavaScript API
     */
    function fromAPI(selector) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Get container element
      var container;
      if (typeof selector === 'string') {
        container = document.querySelector(selector);
        if (!container) {
          throw new Error("SWK: Container element not found: ".concat(selector));
        }
      } else if (selector instanceof HTMLElement) {
        container = selector;
      } else {
        throw new Error('SWK: Invalid container selector or element');
      }

      // Merge options with container
      return {
        container: container,
        config: options
      };
    }

    /**
     * Auto-initialize from HTML attributes
     * Note: This will be called from SWK class after it's defined
     */
  }, {
    key: "autoInit",
    value: function autoInit(SWKClass) {
      // Find all elements with data-swk attribute
      var elements = document.querySelectorAll('[data-swk]');
      var instances = [];
      elements.forEach(function (element) {
        try {
          // Parse data attributes
          var config = (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_0__.parseDataAttributes)(element);

          // Create SWK instance using the element and config
          var instance = new SWKClass(element, config);
          instances.push(instance);
        } catch (error) {
          console.error('SWK: Failed to auto-initialize element:', element, error);
        }
      });
      return instances;
    }

    /**
     * Initialize from HTML element with data attributes
     */
  }, {
    key: "fromHTML",
    value: function fromHTML(element) {
      var parsedConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!(element instanceof HTMLElement)) {
        throw new Error('SWK: Invalid HTML element');
      }
      return {
        container: element,
        config: parsedConfig
      };
    }

    /**
     * Parse configuration from data attributes
     */
  }, {
    key: "parseConfig",
    value: function parseConfig(element) {
      return (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_0__.parseDataAttributes)(element);
    }
  }]);
}();


/***/ }),

/***/ "./src/js/core/Lighting.js":
/*!*********************************!*\
  !*** ./src/js/core/Lighting.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lighting)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Lighting setup (Ambient and Directional)
 */
var Lighting = /*#__PURE__*/function () {
  function Lighting(scene, config) {
    _classCallCheck(this, Lighting);
    this.scene = scene;
    this.config = config;
    this.ambientLight = null;
    this.directionalLight = null;
    this.init();
  }
  return _createClass(Lighting, [{
    key: "init",
    value: function init() {
      var _this$directionalLigh;
      // Create ambient light
      var ambientIntensity = this.config.get('lighting.ambient.intensity');
      var ambientColor = this.hexToNumber(this.config.get('lighting.ambient.color'));
      this.ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
      this.scene.add(this.ambientLight);

      // Create directional light
      var directionalIntensity = this.config.get('lighting.directional.intensity');
      var directionalColor = this.hexToNumber(this.config.get('lighting.directional.color'));
      var position = this.config.get('lighting.directional.position');
      this.directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
      (_this$directionalLigh = this.directionalLight.position).set.apply(_this$directionalLigh, _toConsumableArray(position));

      // Enable shadows if configured
      if (this.config.get('lighting.castShadow')) {
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.camera.left = -10;
        this.directionalLight.shadow.camera.right = 10;
        this.directionalLight.shadow.camera.top = 10;
        this.directionalLight.shadow.camera.bottom = -10;
      }
      this.scene.add(this.directionalLight);
    }

    /**
     * Convert hex string to number
     */
  }, {
    key: "hexToNumber",
    value: function hexToNumber(hex) {
      return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Set ambient light intensity
     */
  }, {
    key: "setAmbientIntensity",
    value: function setAmbientIntensity(intensity) {
      if (this.ambientLight) {
        this.ambientLight.intensity = intensity;
      }
    }

    /**
     * Set directional light intensity
     */
  }, {
    key: "setDirectionalIntensity",
    value: function setDirectionalIntensity(intensity) {
      if (this.directionalLight) {
        this.directionalLight.intensity = intensity;
      }
    }

    /**
     * Set ambient light color
     */
  }, {
    key: "setAmbientColor",
    value: function setAmbientColor(color) {
      if (this.ambientLight) {
        this.ambientLight.color.set(this.hexToNumber(color));
      }
    }

    /**
     * Set directional light color
     */
  }, {
    key: "setDirectionalColor",
    value: function setDirectionalColor(color) {
      if (this.directionalLight) {
        this.directionalLight.color.set(this.hexToNumber(color));
      }
    }

    /**
     * Get ambient light
     */
  }, {
    key: "getAmbientLight",
    value: function getAmbientLight() {
      return this.ambientLight;
    }

    /**
     * Get directional light
     */
  }, {
    key: "getDirectionalLight",
    value: function getDirectionalLight() {
      return this.directionalLight;
    }

    /**
     * Dispose lighting
     */
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.ambientLight) {
        this.scene.remove(this.ambientLight);
      }
      if (this.directionalLight) {
        this.scene.remove(this.directionalLight);
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/js/core/Renderer.js":
/*!*********************************!*\
  !*** ./src/js/core/Renderer.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Renderer)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * THREE.js Renderer management
 */
var Renderer = /*#__PURE__*/function () {
  function Renderer(container, config) {
    _classCallCheck(this, Renderer);
    this.container = container;
    this.config = config;
    this.renderer = null;
    this.init();
  }
  return _createClass(Renderer, [{
    key: "init",
    value: function init() {
      // Create WebGL renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });

      // Set size
      var width = this.container.clientWidth;
      var height = this.container.clientHeight;
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Set background color
      var bgColor = this.config.get('viewportBackground');
      this.renderer.setClearColor(this.hexToNumber(bgColor));

      // Enable shadows
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Append to container
      this.container.appendChild(this.renderer.domElement);

      // Add resize listener
      window.addEventListener('resize', this.onResize.bind(this));
    }

    /**
     * Handle window resize
     */
  }, {
    key: "onResize",
    value: function onResize() {
      var width = this.container.clientWidth;
      var height = this.container.clientHeight;
      this.renderer.setSize(width, height);
    }

    /**
     * Convert hex string to number
     */
  }, {
    key: "hexToNumber",
    value: function hexToNumber(hex) {
      return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Render scene with camera
     */
  }, {
    key: "render",
    value: function render(scene, camera) {
      this.renderer.render(scene, camera);
    }

    /**
     * Get renderer instance
     */
  }, {
    key: "getRenderer",
    value: function getRenderer() {
      return this.renderer;
    }

    /**
     * Set background color
     */
  }, {
    key: "setBackgroundColor",
    value: function setBackgroundColor(color) {
      this.renderer.setClearColor(this.hexToNumber(color));
    }

    /**
     * Get canvas element
     */
  }, {
    key: "getCanvas",
    value: function getCanvas() {
      return this.renderer.domElement;
    }

    /**
     * Dispose renderer
     */
  }, {
    key: "dispose",
    value: function dispose() {
      window.removeEventListener('resize', this.onResize.bind(this));
      if (this.renderer) {
        this.renderer.dispose();
        if (this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/js/core/Scene.js":
/*!******************************!*\
  !*** ./src/js/core/Scene.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Scene)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * THREE.js Scene management with grid
 */
var Scene = /*#__PURE__*/function () {
  function Scene(config) {
    _classCallCheck(this, Scene);
    this.config = config;
    this.scene = null;
    this.gridHelper = null;
    this.init();
  }
  return _createClass(Scene, [{
    key: "init",
    value: function init() {
      // Create scene
      this.scene = new THREE.Scene();

      // Add grid if enabled
      if (this.config.get('grid.show')) {
        this.createGrid();
      }
    }

    /**
     * Create grid helper
     */
  }, {
    key: "createGrid",
    value: function createGrid() {
      var size = this.config.get('grid.size');
      var divisions = this.config.get('grid.divisions');
      var centerColor = this.hexToNumber(this.config.get('grid.centerColor'));
      var linesColor = this.hexToNumber(this.config.get('grid.linesColor'));
      this.gridHelper = new THREE.GridHelper(size, divisions, centerColor, linesColor);
      this.scene.add(this.gridHelper);
    }

    /**
     * Convert hex string to number
     */
  }, {
    key: "hexToNumber",
    value: function hexToNumber(hex) {
      return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Get scene instance
     */
  }, {
    key: "getScene",
    value: function getScene() {
      return this.scene;
    }

    /**
     * Add object to scene
     */
  }, {
    key: "add",
    value: function add(object) {
      this.scene.add(object);
    }

    /**
     * Remove object from scene
     */
  }, {
    key: "remove",
    value: function remove(object) {
      this.scene.remove(object);
    }

    /**
     * Show grid
     */
  }, {
    key: "showGrid",
    value: function showGrid() {
      if (!this.gridHelper) {
        this.createGrid();
      } else {
        this.gridHelper.visible = true;
      }
    }

    /**
     * Hide grid
     */
  }, {
    key: "hideGrid",
    value: function hideGrid() {
      if (this.gridHelper) {
        this.gridHelper.visible = false;
      }
    }

    /**
     * Toggle grid visibility
     */
  }, {
    key: "toggleGrid",
    value: function toggleGrid() {
      if (this.gridHelper) {
        this.gridHelper.visible = !this.gridHelper.visible;
      }
    }

    /**
     * Dispose scene
     */
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.gridHelper) {
        this.scene.remove(this.gridHelper);
        this.gridHelper.geometry.dispose();
        this.gridHelper.material.dispose();
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/js/export/ExportManager.js":
/*!****************************************!*\
  !*** ./src/js/export/ExportManager.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
/* harmony import */ var _utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Helpers.js */ "./src/js/utils/Helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * ExportManager.js
 * Handles exporting the scene to various 3D file formats
 * Supports GLTF and STL formats with proper scene preparation
 */



var ExportManager = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {THREE.Scene} scene - The Three.js scene
   * @param {SWK} swkInstance - Main SWK instance
   * @param {Object} config - Configuration object
   */
  function ExportManager(scene, swkInstance, config) {
    var _this;
    _classCallCheck(this, ExportManager);
    _this = _callSuper(this, ExportManager);
    _this.scene = scene;
    _this.swk = swkInstance;
    _this.config = config;

    // Check if exporters are available
    _this.hasGLTFExporter = typeof THREE !== 'undefined' && THREE.GLTFExporter;
    _this.hasSTLExporter = typeof THREE !== 'undefined' && THREE.STLExporter;
    if (!_this.hasGLTFExporter) {
      console.warn('ExportManager: GLTFExporter not found. GLTF export will not be available.');
    }
    if (!_this.hasSTLExporter) {
      console.warn('ExportManager: STLExporter not found. STL export will not be available.');
    }
    return _this;
  }

  /**
   * Prepare scene for export (filter out non-exportable objects)
   * @returns {Array} Array of exportable objects
   */
  _inherits(ExportManager, _EventEmitter);
  return _createClass(ExportManager, [{
    key: "prepareSceneForExport",
    value: function prepareSceneForExport() {
      var exportableObjects = [];
      this.scene.children.forEach(function (child) {
        // Only export user-created objects
        if (child.userData && child.userData.isShape) {
          exportableObjects.push(child);
        }
      });
      return exportableObjects;
    }

    /**
     * Create a temporary scene with only exportable objects
     * @returns {THREE.Scene} Temporary scene for export
     */
  }, {
    key: "createExportScene",
    value: function createExportScene() {
      var exportScene = new THREE.Scene();
      var objects = this.prepareSceneForExport();

      // Clone objects to temporary scene
      objects.forEach(function (obj) {
        var clone = obj.clone();
        exportScene.add(clone);
      });
      return exportScene;
    }

    /**
     * Export scene as GLTF/GLB format
     * @param {Object} options - Export options
     * @param {boolean} options.binary - Export as GLB (binary) instead of GLTF
     * @param {string} options.filename - Custom filename (without extension)
     * @returns {Promise<boolean>} Success status
     */
  }, {
    key: "exportGLTF",
    value: (function () {
      var _exportGLTF = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this2 = this;
        var options,
          binary,
          filename,
          extension,
          exportScene,
          exporter,
          exportOptions,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              if (this.hasGLTFExporter) {
                _context.n = 1;
                break;
              }
              console.error('GLTFExporter is not available');
              this.emit('exportError', {
                format: 'gltf',
                error: 'GLTFExporter not found'
              });
              return _context.a(2, false);
            case 1:
              binary = options.binary !== undefined ? options.binary : false;
              filename = options.filename || "scene-".concat((0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.getTimestamp)());
              extension = binary ? 'glb' : 'gltf';
              _context.p = 2;
              this.emit('exportStart', {
                format: extension
              });

              // Create export scene
              exportScene = this.createExportScene();
              if (!(exportScene.children.length === 0)) {
                _context.n = 3;
                break;
              }
              console.warn('No objects to export');
              this.emit('exportError', {
                format: extension,
                error: 'No objects to export'
              });
              return _context.a(2, false);
            case 3:
              // Create exporter
              exporter = new THREE.GLTFExporter(); // Export options
              exportOptions = {
                binary: binary,
                embedImages: true,
                truncateDrawRange: false,
                onlyVisible: true,
                maxTextureSize: 4096
              }; // Export
              return _context.a(2, new Promise(function (resolve) {
                exporter.parse(exportScene, function (result) {
                  try {
                    if (binary) {
                      // GLB - binary format
                      var blob = new Blob([result], {
                        type: 'application/octet-stream'
                      });
                      (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.downloadFile)(blob, "".concat(filename, ".").concat(extension));
                    } else {
                      // GLTF - JSON format
                      var output = JSON.stringify(result, null, 2);
                      var _blob = new Blob([output], {
                        type: 'application/json'
                      });
                      (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.downloadFile)(_blob, "".concat(filename, ".").concat(extension));
                    }
                    console.log("Exported ".concat(exportScene.children.length, " objects as ").concat(extension.toUpperCase()));
                    _this2.emit('exportComplete', {
                      format: extension,
                      filename: "".concat(filename, ".").concat(extension),
                      objectCount: exportScene.children.length
                    });
                    resolve(true);
                  } catch (error) {
                    console.error('Failed to download exported file:', error);
                    _this2.emit('exportError', {
                      format: extension,
                      error: error.message
                    });
                    resolve(false);
                  }
                }, function (error) {
                  console.error('GLTF export failed:', error);
                  _this2.emit('exportError', {
                    format: extension,
                    error: error.message
                  });
                  resolve(false);
                }, exportOptions);
              }));
            case 4:
              _context.p = 4;
              _t = _context.v;
              console.error('GLTF export error:', _t);
              this.emit('exportError', {
                format: extension,
                error: _t.message
              });
              return _context.a(2, false);
          }
        }, _callee, this, [[2, 4]]);
      }));
      function exportGLTF() {
        return _exportGLTF.apply(this, arguments);
      }
      return exportGLTF;
    }()
    /**
     * Export scene as STL format
     * @param {Object} options - Export options
     * @param {boolean} options.binary - Export as binary STL instead of ASCII
     * @param {string} options.filename - Custom filename (without extension)
     * @returns {Promise<boolean>} Success status
     */
    )
  }, {
    key: "exportSTL",
    value: (function () {
      var _exportSTL = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var options,
          binary,
          filename,
          objects,
          exporter,
          exportGroup,
          result,
          blob,
          _blob2,
          _args2 = arguments,
          _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              if (this.hasSTLExporter) {
                _context2.n = 1;
                break;
              }
              console.error('STLExporter is not available');
              this.emit('exportError', {
                format: 'stl',
                error: 'STLExporter not found'
              });
              return _context2.a(2, false);
            case 1:
              binary = options.binary !== undefined ? options.binary : true;
              filename = options.filename || "scene-".concat((0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.getTimestamp)());
              _context2.p = 2;
              this.emit('exportStart', {
                format: 'stl'
              });

              // Get exportable objects
              objects = this.prepareSceneForExport();
              if (!(objects.length === 0)) {
                _context2.n = 3;
                break;
              }
              console.warn('No objects to export');
              this.emit('exportError', {
                format: 'stl',
                error: 'No objects to export'
              });
              return _context2.a(2, false);
            case 3:
              // Create exporter
              exporter = new THREE.STLExporter(); // STL can only export one mesh at a time or merged geometry
              // We'll create a group and export it
              exportGroup = new THREE.Group();
              objects.forEach(function (obj) {
                exportGroup.add(obj.clone());
              });

              // Export
              result = exporter.parse(exportGroup, {
                binary: binary
              }); // Download
              if (binary) {
                // Binary STL
                blob = new Blob([result], {
                  type: 'application/octet-stream'
                });
                (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.downloadFile)(blob, "".concat(filename, ".stl"));
              } else {
                // ASCII STL
                _blob2 = new Blob([result], {
                  type: 'text/plain'
                });
                (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.downloadFile)(_blob2, "".concat(filename, ".stl"));
              }
              console.log("Exported ".concat(objects.length, " objects as STL (").concat(binary ? 'binary' : 'ASCII', ")"));
              this.emit('exportComplete', {
                format: 'stl',
                filename: "".concat(filename, ".stl"),
                objectCount: objects.length,
                binary: binary
              });
              return _context2.a(2, true);
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              console.error('STL export error:', _t2);
              this.emit('exportError', {
                format: 'stl',
                error: _t2.message
              });
              return _context2.a(2, false);
          }
        }, _callee2, this, [[2, 4]]);
      }));
      function exportSTL() {
        return _exportSTL.apply(this, arguments);
      }
      return exportSTL;
    }()
    /**
     * Export selected objects only
     * @param {string} format - Export format ('gltf', 'glb', or 'stl')
     * @param {Object} options - Export options
     * @returns {Promise<boolean>} Success status
     */
    )
  }, {
    key: "exportSelected",
    value: (function () {
      var _exportSelected = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var format,
          options,
          selected,
          tempScene,
          originalScene,
          result,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              format = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : 'gltf';
              options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              selected = this.swk.getSelectedObjects();
              if (!(selected.length === 0)) {
                _context3.n = 1;
                break;
              }
              console.warn('No objects selected for export');
              this.emit('exportError', {
                format: format,
                error: 'No objects selected'
              });
              return _context3.a(2, false);
            case 1:
              // Create temporary scene with selected objects
              tempScene = new THREE.Scene();
              selected.forEach(function (obj) {
                tempScene.add(obj.clone());
              });

              // Temporarily swap scenes
              originalScene = this.scene;
              this.scene = tempScene;
              if (!(format === 'glb')) {
                _context3.n = 3;
                break;
              }
              _context3.n = 2;
              return this.exportGLTF(_objectSpread(_objectSpread({}, options), {}, {
                binary: true
              }));
            case 2:
              result = _context3.v;
              _context3.n = 8;
              break;
            case 3:
              if (!(format === 'gltf')) {
                _context3.n = 5;
                break;
              }
              _context3.n = 4;
              return this.exportGLTF(_objectSpread(_objectSpread({}, options), {}, {
                binary: false
              }));
            case 4:
              result = _context3.v;
              _context3.n = 8;
              break;
            case 5:
              if (!(format === 'stl')) {
                _context3.n = 7;
                break;
              }
              _context3.n = 6;
              return this.exportSTL(options);
            case 6:
              result = _context3.v;
              _context3.n = 8;
              break;
            case 7:
              console.error('Unknown export format:', format);
              result = false;
            case 8:
              // Restore original scene
              this.scene = originalScene;
              return _context3.a(2, result);
          }
        }, _callee3, this);
      }));
      function exportSelected() {
        return _exportSelected.apply(this, arguments);
      }
      return exportSelected;
    }()
    /**
     * Get available export formats
     * @returns {Array<Object>} Array of available export formats
     */
    )
  }, {
    key: "getAvailableFormats",
    value: function getAvailableFormats() {
      var formats = [];
      if (this.hasGLTFExporter) {
        formats.push({
          format: 'gltf',
          name: 'GLTF (JSON)',
          extension: 'gltf',
          binary: false
        }, {
          format: 'glb',
          name: 'GLB (Binary)',
          extension: 'glb',
          binary: true
        });
      }
      if (this.hasSTLExporter) {
        formats.push({
          format: 'stl',
          name: 'STL',
          extension: 'stl',
          binary: true
        });
      }
      return formats;
    }

    /**
     * Check if a format is available
     * @param {string} format - Format to check
     * @returns {boolean} True if available
     */
  }, {
    key: "isFormatAvailable",
    value: function isFormatAvailable(format) {
      var formats = this.getAvailableFormats();
      return formats.some(function (f) {
        return f.format === format;
      });
    }

    /**
     * Clean up
     */
  }, {
    key: "dispose",
    value: function dispose() {
      this.removeAllListeners();
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExportManager);

/***/ }),

/***/ "./src/js/grouping/GroupManager.js":
/*!*****************************************!*\
  !*** ./src/js/grouping/GroupManager.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GroupManager)
/* harmony export */ });
/* harmony import */ var _utils_Helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Helpers.js */ "./src/js/utils/Helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Group management for organizing objects
 */


var GroupManager = /*#__PURE__*/function () {
  function GroupManager(scene, eventEmitter, config) {
    _classCallCheck(this, GroupManager);
    this.scene = scene;
    this.eventEmitter = eventEmitter;
    this.config = config;
    this.groups = [];
    this.groupIdCounter = 0;
  }

  /**
   * Create group from selected objects
   */
  return _createClass(GroupManager, [{
    key: "createGroup",
    value: function createGroup(objects) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!objects || objects.length === 0) {
        console.warn('SWK: No objects provided for grouping');
        return null;
      }

      // Generate group ID and name
      var groupId = "group_".concat(this.groupIdCounter++);
      var groupName = name || "Group ".concat(this.groups.length + 1);

      // Create group data
      var group = {
        id: groupId,
        name: groupName,
        children: _toConsumableArray(objects),
        container: null,
        isDirty: true
      };

      // Mark objects as part of group
      objects.forEach(function (obj) {
        obj.userData.groupId = groupId;
      });

      // Store group
      this.groups.push(group);

      // Compute group container
      this.computeGroupContainer(group);

      // Emit event
      this.eventEmitter.emit('groupCreated', group.container);

      // Execute callback
      var callback = this.config.get('callbacks.onGroupCreated');
      if (callback && typeof callback === 'function') {
        callback(group.container);
      }
      console.log("SWK: Created ".concat(groupName, " with ").concat(objects.length, " objects"));
      return group.container;
    }

    /**
     * Compute group container (THREE.Group)
     */
  }, {
    key: "computeGroupContainer",
    value: function computeGroupContainer(group) {
      // Remove existing container if present
      if (group.container) {
        this.scene.remove(group.container);
      }
      if (group.children.length === 0) return;

      // Calculate bounding box of all children to find center
      var boundingBox = new THREE.Box3();
      group.children.forEach(function (child) {
        boundingBox.expandByObject(child);
      });

      // Get the center of the bounding box
      var center = boundingBox.getCenter(new THREE.Vector3());

      // Create THREE.Group container
      var groupContainer = new THREE.Group();
      groupContainer.userData.isGroupResult = true;
      groupContainer.userData.groupId = group.id;
      groupContainer.name = group.name;

      // Position the group container at the center
      groupContainer.position.copy(center);

      // Add all children to container, preserving world positions
      group.children.forEach(function (child) {
        // Store world transform before parenting
        var worldPos = new THREE.Vector3();
        var worldQuat = new THREE.Quaternion();
        var worldScale = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        child.getWorldQuaternion(worldQuat);
        child.getWorldScale(worldScale);

        // Remove from scene
        if (child.parent) {
          child.parent.remove(child);
        }

        // Parent to group
        groupContainer.add(child);

        // Adjust local position relative to group center
        child.position.copy(worldPos).sub(center);
        child.quaternion.copy(worldQuat);
        child.scale.copy(worldScale);
      });

      // Add container to scene
      this.scene.add(groupContainer);

      // Store reference
      group.container = groupContainer;
      group.isDirty = false;
    }

    /**
     * Ungroup - restore objects to scene
     */
  }, {
    key: "ungroup",
    value: function ungroup(groupContainer) {
      var _this = this;
      if (!groupContainer || !groupContainer.userData.isGroupResult) {
        console.warn('SWK: Invalid group container');
        return null;
      }
      var groupId = groupContainer.userData.groupId;
      var groupIndex = this.groups.findIndex(function (g) {
        return g.id === groupId;
      });
      if (groupIndex === -1) {
        console.warn('SWK: Group not found');
        return null;
      }
      var group = this.groups[groupIndex];
      var ungroupedObjects = [];

      // Unparent objects and restore to scene
      _toConsumableArray(group.children).forEach(function (obj) {
        // Preserve world transform
        var worldPosition = new THREE.Vector3();
        var worldRotation = new THREE.Quaternion();
        var worldScale = new THREE.Vector3();
        obj.getWorldPosition(worldPosition);
        obj.getWorldQuaternion(worldRotation);
        obj.getWorldScale(worldScale);

        // Remove from group
        group.container.remove(obj);

        // Add back to scene
        _this.scene.add(obj);

        // Restore world transform
        obj.position.copy(worldPosition);
        obj.quaternion.copy(worldRotation);
        obj.scale.copy(worldScale);

        // Clear group ID
        obj.userData.groupId = null;
        ungroupedObjects.push(obj);
      });

      // Remove group container from scene
      this.scene.remove(group.container);

      // Remove group from array
      this.groups.splice(groupIndex, 1);

      // Emit event
      this.eventEmitter.emit('groupRemoved', group.container);

      // Execute callback
      var callback = this.config.get('callbacks.onGroupRemoved');
      if (callback && typeof callback === 'function') {
        callback(group.container);
      }
      console.log("SWK: Ungrouped ".concat(group.name));
      return ungroupedObjects;
    }

    /**
     * Get group by ID
     */
  }, {
    key: "getGroupById",
    value: function getGroupById(groupId) {
      return this.groups.find(function (g) {
        return g.id === groupId;
      });
    }

    /**
     * Get group by container
     */
  }, {
    key: "getGroupByContainer",
    value: function getGroupByContainer(container) {
      if (!container || !container.userData.groupId) return null;
      return this.getGroupById(container.userData.groupId);
    }

    /**
     * Check if object is grouped
     */
  }, {
    key: "isGrouped",
    value: function isGrouped(object) {
      return object && object.userData && object.userData.groupId !== undefined && object.userData.groupId !== null;
    }

    /**
     * Check if object is a group container
     */
  }, {
    key: "isGroupContainer",
    value: function isGroupContainer(object) {
      return object && object.userData && object.userData.isGroupResult === true;
    }

    /**
     * Get all groups
     */
  }, {
    key: "getAllGroups",
    value: function getAllGroups() {
      return _toConsumableArray(this.groups);
    }

    /**
     * Get group children
     */
  }, {
    key: "getGroupChildren",
    value: function getGroupChildren(groupContainer) {
      var group = this.getGroupByContainer(groupContainer);
      return group ? _toConsumableArray(group.children) : [];
    }

    /**
     * Find object's group
     */
  }, {
    key: "findObjectGroup",
    value: function findObjectGroup(object) {
      if (!this.isGrouped(object)) return null;
      return this.getGroupById(object.userData.groupId);
    }

    /**
     * Rename group
     */
  }, {
    key: "renameGroup",
    value: function renameGroup(groupContainer, newName) {
      var group = this.getGroupByContainer(groupContainer);
      if (group) {
        group.name = newName;
        group.container.name = newName;
        return true;
      }
      return false;
    }

    /**
     * Remove object from its group
     */
  }, {
    key: "removeFromGroup",
    value: function removeFromGroup(object) {
      var group = this.findObjectGroup(object);
      if (!group) return false;

      // Preserve world transform
      var worldPosition = new THREE.Vector3();
      var worldRotation = new THREE.Quaternion();
      var worldScale = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      object.getWorldQuaternion(worldRotation);
      object.getWorldScale(worldScale);

      // Remove from group children
      var index = group.children.indexOf(object);
      if (index > -1) {
        group.children.splice(index, 1);
      }

      // Remove from container
      group.container.remove(object);

      // Add back to scene
      this.scene.add(object);

      // Restore world transform
      object.position.copy(worldPosition);
      object.quaternion.copy(worldRotation);
      object.scale.copy(worldScale);

      // Clear group ID
      object.userData.groupId = null;

      // If group is now empty, remove it
      if (group.children.length === 0) {
        this.scene.remove(group.container);
        var groupIndex = this.groups.indexOf(group);
        if (groupIndex > -1) {
          this.groups.splice(groupIndex, 1);
        }
      }
      return true;
    }

    /**
     * Add object to existing group
     */
  }, {
    key: "addToGroup",
    value: function addToGroup(object, groupContainer) {
      var group = this.getGroupByContainer(groupContainer);
      if (!group) return false;

      // Remove from current group if already grouped
      if (this.isGrouped(object)) {
        this.removeFromGroup(object);
      }

      // Store world transform
      var worldPos = new THREE.Vector3();
      var worldQuat = new THREE.Quaternion();
      var worldScale = new THREE.Vector3();
      object.getWorldPosition(worldPos);
      object.getWorldQuaternion(worldQuat);
      object.getWorldScale(worldScale);

      // Remove from scene
      if (object.parent) {
        object.parent.remove(object);
      }

      // Add to group
      group.container.add(object);
      group.children.push(object);

      // Adjust local position relative to group center
      var groupCenter = group.container.position;
      object.position.copy(worldPos).sub(groupCenter);
      object.quaternion.copy(worldQuat);
      object.scale.copy(worldScale);

      // Mark as grouped
      object.userData.groupId = group.id;
      return true;
    }

    /**
     * Clear all groups
     */
  }, {
    key: "clearAllGroups",
    value: function clearAllGroups() {
      var _this2 = this;
      _toConsumableArray(this.groups).forEach(function (group) {
        if (group.container) {
          _this2.ungroup(group.container);
        }
      });
    }

    /**
     * Get statistics
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        totalGroups: this.groups.length,
        groups: this.groups.map(function (g) {
          return {
            id: g.id,
            name: g.name,
            childCount: g.children.length
          };
        })
      };
    }
  }]);
}();


/***/ }),

/***/ "./src/js/history/HistoryManager.js":
/*!******************************************!*\
  !*** ./src/js/history/HistoryManager.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _StateCapture_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateCapture.js */ "./src/js/history/StateCapture.js");
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * HistoryManager.js
 * Manages undo/redo history with state snapshots
 * Implements a circular buffer with maximum history depth
 */



var HistoryManager = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {THREE.Scene} scene - The Three.js scene
   * @param {SelectionManager} selectionManager - Selection manager
   * @param {GroupManager} groupManager - Group manager
   * @param {ShapeFactory} shapeFactory - Shape factory
   * @param {Object} config - Configuration object
   * @param {TransformManager} transformManager - Transform manager (optional)
   */
  function HistoryManager(scene, selectionManager, groupManager, shapeFactory, config) {
    var _this;
    var transformManager = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    _classCallCheck(this, HistoryManager);
    _this = _callSuper(this, HistoryManager);
    _this.scene = scene;
    _this.selectionManager = selectionManager;
    _this.groupManager = groupManager;
    _this.shapeFactory = shapeFactory;
    _this.config = config;
    _this.transformManager = transformManager;

    // History array (stores all states)
    _this.history = [];
    _this.historyIndex = -1;

    // Configuration
    _this.maxHistory = config.get('maxHistory') || 50;
    _this.isRestoring = false; // Flag to prevent recording during restore

    // Capture initial state
    _this.captureState('Initial state');
    return _this;
  }

  /**
   * Capture current state and add to undo stack
   * @param {string} description - Description of the action (for debugging)
   * @returns {boolean} Success
   */
  _inherits(HistoryManager, _EventEmitter);
  return _createClass(HistoryManager, [{
    key: "captureState",
    value: function captureState() {
      var _this2 = this;
      var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'State change';
      // Don't capture if we're currently restoring a state
      if (this.isRestoring) {
        return false;
      }
      try {
        var state = _StateCapture_js__WEBPACK_IMPORTED_MODULE_0__["default"].captureState(this.scene, this.selectionManager, this.groupManager, this.shapeFactory);

        // Remove any forward history if we made a new change (do this FIRST)
        this.history = this.history.slice(0, this.historyIndex + 1);

        // Don't capture if state is identical to the last one in current history
        if (this.history.length > 0) {
          var lastState = this.history[this.history.length - 1];
          if (_StateCapture_js__WEBPACK_IMPORTED_MODULE_0__["default"].areStatesEqual(state, lastState.state)) {
            console.log('HistoryManager: State unchanged, skipping capture');
            return false;
          }
        }

        // Add to history array
        this.history.push({
          state: state,
          description: description,
          timestamp: Date.now()
        });

        // Limit history size
        if (this.history.length > this.maxHistory) {
          this.history.shift(); // Remove oldest, index stays the same (pointing to same logical position)
        } else {
          this.historyIndex++; // Move index forward only if not over limit
        }
        console.log("HistoryManager: State captured \"".concat(description, "\" - history: ").concat(this.history.length, " states, historyIndex: ").concat(this.historyIndex));
        console.log('HistoryManager: Current history:', this.history.map(function (entry, index) {
          return {
            index: index,
            description: entry.description,
            isCurrent: index === _this2.historyIndex,
            timestamp: entry.timestamp,
            objectCount: entry.state.objects.length,
            groupCount: entry.state.groups.length
          };
        }));
        this.emit('stateChanged', {
          canUndo: this.canUndo(),
          canRedo: this.canRedo(),
          historyCount: this.history.length,
          historyIndex: this.historyIndex
        });
        return true;
      } catch (error) {
        console.error('Failed to capture state:', error);
        return false;
      }
    }

    /**
     * Undo the last action
     * @returns {boolean} Success
     */
  }, {
    key: "undo",
    value: function undo() {
      if (!this.canUndo()) {
        return false;
      }
      try {
        console.log("HistoryManager: Undo - history: ".concat(this.history.length, " states, historyIndex: ").concat(this.historyIndex));

        // Move index backward in history
        this.historyIndex--;
        console.log("HistoryManager: After undo - historyIndex: ".concat(this.historyIndex));

        // Get the state at the new index
        var entry = this.history[this.historyIndex];

        // Set restoring flag to prevent capture during restore
        this.isRestoring = true;

        // Restore that state
        _StateCapture_js__WEBPACK_IMPORTED_MODULE_0__["default"].restoreState(entry.state, this.scene, this.selectionManager, this.groupManager, this.shapeFactory, this.transformManager);
        this.isRestoring = false;
        this.emit('stateRestored', {
          action: 'undo',
          description: entry.description
        });
        this.emit('stateChanged', {
          canUndo: this.canUndo(),
          canRedo: this.canRedo(),
          historyCount: this.history.length,
          historyIndex: this.historyIndex
        });
        return true;
      } catch (error) {
        console.error('Failed to undo:', error);
        this.isRestoring = false;
        return false;
      }
    }

    /**
     * Redo the last undone action
     * @returns {boolean} Success
     */
  }, {
    key: "redo",
    value: function redo() {
      if (!this.canRedo()) {
        return false;
      }
      try {
        console.log("HistoryManager: Redo - history: ".concat(this.history.length, " states, historyIndex: ").concat(this.historyIndex));

        // Move index forward in history
        this.historyIndex++;
        console.log("HistoryManager: After redo - historyIndex: ".concat(this.historyIndex));

        // Get the state at the new index
        var entry = this.history[this.historyIndex];

        // Set restoring flag to prevent capture during restore
        this.isRestoring = true;

        // Restore that state
        _StateCapture_js__WEBPACK_IMPORTED_MODULE_0__["default"].restoreState(entry.state, this.scene, this.selectionManager, this.groupManager, this.shapeFactory, this.transformManager);
        this.isRestoring = false;
        this.emit('stateRestored', {
          action: 'redo',
          description: entry.description
        });
        this.emit('stateChanged', {
          canUndo: this.canUndo(),
          canRedo: this.canRedo(),
          historyCount: this.history.length,
          historyIndex: this.historyIndex
        });
        return true;
      } catch (error) {
        console.error('Failed to redo:', error);
        this.isRestoring = false;
        return false;
      }
    }

    /**
     * Check if undo is available
     * @returns {boolean} True if can undo
     */
  }, {
    key: "canUndo",
    value: function canUndo() {
      return this.historyIndex > 0;
    }

    /**
     * Check if redo is available
     * @returns {boolean} True if can redo
     */
  }, {
    key: "canRedo",
    value: function canRedo() {
      return this.historyIndex < this.history.length - 1;
    }

    /**
     * Get the description of the next undo action
     * @returns {string|null} Description or null
     */
  }, {
    key: "getUndoDescription",
    value: function getUndoDescription() {
      var _this$history;
      if (!this.canUndo()) return null;
      return ((_this$history = this.history[this.historyIndex - 1]) === null || _this$history === void 0 ? void 0 : _this$history.description) || null;
    }

    /**
     * Get the description of the next redo action
     * @returns {string|null} Description or null
     */
  }, {
    key: "getRedoDescription",
    value: function getRedoDescription() {
      var _this$history2;
      if (!this.canRedo()) return null;
      return ((_this$history2 = this.history[this.historyIndex + 1]) === null || _this$history2 === void 0 ? void 0 : _this$history2.description) || null;
    }

    /**
     * Clear all history
     */
  }, {
    key: "clear",
    value: function clear() {
      this.history = [];
      this.historyIndex = -1;

      // Capture current state as initial
      this.captureState('History cleared');
      this.emit('stateChanged', {
        canUndo: false,
        canRedo: false,
        historyCount: this.history.length,
        historyIndex: this.historyIndex
      });
    }

    /**
     * Get history statistics
     * @returns {Object} History stats
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        historyCount: this.history.length,
        historyIndex: this.historyIndex,
        maxHistory: this.maxHistory,
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
        memoryUsage: this.estimateMemoryUsage()
      };
    }

    /**
     * Estimate memory usage of history (approximate)
     * @returns {number} Estimated size in bytes
     */
  }, {
    key: "estimateMemoryUsage",
    value: function estimateMemoryUsage() {
      return JSON.stringify(this.history).length;
    }

    /**
     * Clean up resources
     */
  }, {
    key: "dispose",
    value: function dispose() {
      this.clear();
      this.removeAllListeners();
      this.scene = null;
      this.selectionManager = null;
      this.groupManager = null;
      this.shapeFactory = null;
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HistoryManager);

/***/ }),

/***/ "./src/js/history/StateCapture.js":
/*!****************************************!*\
  !*** ./src/js/history/StateCapture.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * StateCapture.js
 * Utility for serializing and deserializing complete scene state
 * Captures: objects, groups, materials, transforms, selection, counters
 */


var StateCapture = /*#__PURE__*/function () {
  function StateCapture() {
    _classCallCheck(this, StateCapture);
  }
  return _createClass(StateCapture, null, [{
    key: "captureState",
    value:
    /**
     * Capture the complete current state of the scene
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {SelectionManager} selectionManager - Selection manager instance
     * @param {GroupManager} groupManager - Group manager instance
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @returns {Object} Serialized state object
     */
    function captureState(scene, selectionManager, groupManager, shapeFactory) {
      var _this = this;
      var state = {
        timestamp: Date.now(),
        objects: [],
        groups: [],
        selection: [],
        counters: {}
      };

      // Capture shape counters from ShapeFactory
      if (shapeFactory && shapeFactory.shapeCounters) {
        state.counters = _objectSpread({}, shapeFactory.shapeCounters);
      }

      // Get all user objects (exclude grid, lights, etc)
      var userObjects = scene.children.filter(function (obj) {
        return obj.userData && obj.userData.isUserObject;
      });

      // Capture objects and groups
      userObjects.forEach(function (obj) {
        if (groupManager && groupManager.isGroupContainer(obj)) {
          // This is a group container
          state.groups.push(_this.serializeGroup(obj, groupManager));
        } else if (!groupManager || !groupManager.isGrouped(obj)) {
          // This is a standalone object (not inside a group)
          state.objects.push(_this.serializeObject(obj));
        }
      });

      // Capture current selection
      var selectedObjects = selectionManager.getSelectedObjects();
      state.selection = selectedObjects.map(function (obj) {
        return obj.uuid;
      });
      return state;
    }

    /**
     * Serialize a single object
     * @param {THREE.Object3D} obj - The object to serialize
     * @returns {Object} Serialized object data
     */
  }, {
    key: "serializeObject",
    value: function serializeObject(obj) {
      var data = {
        uuid: obj.uuid,
        name: obj.name,
        type: obj.userData.shapeType || 'unknown',
        position: obj.position.toArray(),
        rotation: obj.rotation.toArray(),
        scale: obj.scale.toArray(),
        visible: obj.visible,
        userData: _objectSpread({}, obj.userData)
      };

      // Serialize material
      if (obj.material) {
        data.material = {
          color: obj.material.color.getHex(),
          opacity: obj.material.opacity,
          transparent: obj.material.transparent,
          wireframe: obj.material.wireframe
        };
      }

      // Special handling for text objects
      if (data.type === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TEXT && obj.userData.textContent) {
        data.textContent = obj.userData.textContent;
        data.textFont = obj.userData.textFont || 'sans';
      }
      return data;
    }

    /**
     * Serialize a group container with its children
     * @param {THREE.Group} group - The group to serialize
     * @param {GroupManager} groupManager - Group manager instance
     * @returns {Object} Serialized group data
     */
  }, {
    key: "serializeGroup",
    value: function serializeGroup(group, groupManager) {
      var _this2 = this;
      var data = {
        uuid: group.uuid,
        name: group.name,
        position: group.position.toArray(),
        rotation: group.rotation.toArray(),
        scale: group.scale.toArray(),
        visible: group.visible,
        children: []
      };

      // Serialize all children in the group
      var children = groupManager.getGroupChildren(group);
      children.forEach(function (child) {
        data.children.push(_this2.serializeObject(child));
      });
      return data;
    }

    /**
     * Restore state to the scene
     * @param {Object} state - The state object to restore
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {SelectionManager} selectionManager - Selection manager instance
     * @param {GroupManager} groupManager - Group manager instance
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @param {TransformManager} transformManager - Transform manager instance (optional)
     * @returns {Array} Array of restored objects
     */
  }, {
    key: "restoreState",
    value: function restoreState(state, scene, selectionManager, groupManager, shapeFactory) {
      var _this3 = this;
      var transformManager = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var restoredObjects = [];
      var uuidMap = new Map(); // Map old UUIDs to new objects

      // Detach transform controls before clearing scene to avoid errors
      if (transformManager) {
        transformManager.detach();
      }

      // Clear current scene (remove all user objects)
      var userObjects = scene.children.filter(function (obj) {
        return obj.userData && obj.userData.isUserObject;
      });
      userObjects.forEach(function (obj) {
        scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });

      // Clear selection
      selectionManager.clear();

      // Restore shape counters
      if (state.counters && shapeFactory) {
        shapeFactory.shapeCounters = _objectSpread({}, state.counters);
      }

      // Restore standalone objects
      state.objects.forEach(function (objData) {
        var obj = _this3.deserializeObject(objData, shapeFactory);
        if (obj) {
          scene.add(obj);
          restoredObjects.push(obj);
          uuidMap.set(objData.uuid, obj);
        }
      });

      // Restore groups
      state.groups.forEach(function (groupData) {
        var _this3$deserializeGro = _this3.deserializeGroup(groupData, shapeFactory),
          group = _this3$deserializeGro.group,
          children = _this3$deserializeGro.children;
        if (group && children.length > 0) {
          // Add children to scene first
          children.forEach(function (child) {
            scene.add(child);
            restoredObjects.push(child);
          });

          // Create the group
          var groupContainer = groupManager.createGroup(children);
          if (groupContainer) {
            // Restore group transform
            groupContainer.position.fromArray(groupData.position);
            groupContainer.rotation.fromArray(groupData.rotation);
            groupContainer.scale.fromArray(groupData.scale);
            groupContainer.visible = groupData.visible;
            groupContainer.name = groupData.name;
            restoredObjects.push(groupContainer);
            uuidMap.set(groupData.uuid, groupContainer);
          }
        }
      });

      // Restore selection
      if (state.selection && state.selection.length > 0) {
        state.selection.forEach(function (uuid) {
          var obj = uuidMap.get(uuid);
          if (obj) {
            selectionManager.addToSelection(obj);
          }
        });

        // Re-attach transform controls if single selection
        if (transformManager && state.selection.length === 1) {
          var selectedObj = uuidMap.get(state.selection[0]);
          if (selectedObj) {
            transformManager.attach(selectedObj);
          }
        }
      }
      return restoredObjects;
    }

    /**
     * Deserialize an object from data
     * @param {Object} data - Serialized object data
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @returns {THREE.Object3D|null} Restored object
     */
  }, {
    key: "deserializeObject",
    value: function deserializeObject(data, shapeFactory) {
      var _data$material;
      if (!shapeFactory) return null;
      var options = {
        color: (_data$material = data.material) === null || _data$material === void 0 ? void 0 : _data$material.color,
        position: data.position,
        rotation: data.rotation.slice(0, 3),
        // Exclude rotation order
        scale: data.scale
      };

      // Special handling for text
      if (data.type === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TEXT) {
        options.text = data.textContent || 'Text';
        options.font = data.textFont || 'sans';
      }

      // Create the object
      var obj = shapeFactory.createShape(data.type, options);
      if (!obj) return null;

      // Restore properties
      obj.uuid = data.uuid; // Preserve UUID for proper selection restoration
      obj.name = data.name;
      obj.visible = data.visible;
      obj.userData = _objectSpread({}, data.userData);

      // Restore material properties
      if (data.material && obj.material) {
        obj.material.opacity = data.material.opacity;
        obj.material.transparent = data.material.transparent;
        obj.material.wireframe = data.material.wireframe;
      }
      return obj;
    }

    /**
     * Deserialize a group from data
     * @param {Object} data - Serialized group data
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @returns {Object} Object with group container and children array
     */
  }, {
    key: "deserializeGroup",
    value: function deserializeGroup(data, shapeFactory) {
      var _this4 = this;
      var children = [];

      // Deserialize all children
      data.children.forEach(function (childData) {
        var child = _this4.deserializeObject(childData, shapeFactory);
        if (child) {
          children.push(child);
        }
      });
      return {
        group: data,
        children: children
      };
    }

    /**
     * Create a deep clone of a state object
     * @param {Object} state - State to clone
     * @returns {Object} Cloned state
     */
  }, {
    key: "cloneState",
    value: function cloneState(state) {
      return JSON.parse(JSON.stringify(state));
    }

    /**
     * Compare two states for equality (useful for detecting changes)
     * @param {Object} stateA - First state
     * @param {Object} stateB - Second state
     * @returns {boolean} True if states are equal
     */
  }, {
    key: "areStatesEqual",
    value: function areStatesEqual(stateA, stateB) {
      return JSON.stringify(stateA) === JSON.stringify(stateB);
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StateCapture);

/***/ }),

/***/ "./src/js/selection/Outliner.js":
/*!**************************************!*\
  !*** ./src/js/selection/Outliner.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Outliner)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Outline rendering and synchronization
 */


var Outliner = /*#__PURE__*/function () {
  function Outliner(scene, config) {
    _classCallCheck(this, Outliner);
    this.scene = scene;
    this.config = config;
    this.outlineMap = new Map();
    this.outlineColor = this.hexToNumber(config.get('outlineColor'));
    this.outlineThickness = config.get('outlineThickness') || _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.OUTLINE_THICKNESS;
  }

  /**
   * Create outline for mesh
   */
  return _createClass(Outliner, [{
    key: "createOutline",
    value: function createOutline(mesh) {
      if (!mesh || !mesh.geometry) {
        return null;
      }

      // Remove existing outline if present
      this.removeOutline(mesh);

      // Clone geometry for outline
      var outlineGeometry = mesh.geometry.clone();

      // Create outline material - rendered on backside
      var outlineMaterial = new THREE.MeshBasicMaterial({
        color: this.outlineColor,
        side: THREE.BackSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      });

      // Create outline mesh
      var outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);

      // Check if this is a text object
      var isText = mesh.userData.textContent !== undefined;

      // Apply world transform
      this.updateOutlineTransform(mesh, outlineMesh, isText);

      // Add to scene
      this.scene.add(outlineMesh);

      // Store in map
      this.outlineMap.set(mesh, {
        outline: outlineMesh,
        mesh: mesh,
        isText: isText
      });
      return outlineMesh;
    }

    /**
     * Update outline transform to match mesh
     */
  }, {
    key: "updateOutlineTransform",
    value: function updateOutlineTransform(mesh, outlineMesh, isText) {
      var worldPosition = new THREE.Vector3();
      var worldQuaternion = new THREE.Quaternion();
      var worldScale = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);
      mesh.getWorldQuaternion(worldQuaternion);
      mesh.getWorldScale(worldScale);
      if (isText) {
        // For text geometry, use offset instead of scaling
        var offsetAmount = this.outlineThickness;
        outlineMesh.position.copy(worldPosition);
        outlineMesh.position.x += offsetAmount;
        outlineMesh.position.y += offsetAmount;
        outlineMesh.quaternion.copy(worldQuaternion);
        outlineMesh.scale.copy(worldScale);
      } else {
        // For other geometries, scale slightly larger
        outlineMesh.position.copy(worldPosition);
        outlineMesh.quaternion.copy(worldQuaternion);
        outlineMesh.scale.copy(worldScale).multiplyScalar(1 + this.outlineThickness);
      }
    }

    /**
     * Remove outline from mesh
     */
  }, {
    key: "removeOutline",
    value: function removeOutline(mesh) {
      var outlineData = this.outlineMap.get(mesh);
      if (!outlineData) return;

      // Remove from scene
      this.scene.remove(outlineData.outline);

      // Dispose resources
      if (outlineData.outline.geometry) {
        outlineData.outline.geometry.dispose();
      }
      if (outlineData.outline.material) {
        outlineData.outline.material.dispose();
      }

      // Remove from map
      this.outlineMap["delete"](mesh);
    }

    /**
     * Sync all outlines with their meshes
     * Should be called every frame in animation loop
     */
  }, {
    key: "syncOutlines",
    value: function syncOutlines() {
      var _iterator = _createForOfIteratorHelper(this.outlineMap.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            mesh = _step$value[0],
            outlineData = _step$value[1];
          if (outlineData && outlineData.outline) {
            this.updateOutlineTransform(mesh, outlineData.outline, outlineData.isText);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Create outlines for multiple meshes
     */
  }, {
    key: "createOutlines",
    value: function createOutlines(meshes) {
      var _this = this;
      if (!meshes || !Array.isArray(meshes)) return;
      meshes.forEach(function (mesh) {
        return _this.createOutline(mesh);
      });
    }

    /**
     * Remove outlines from multiple meshes
     */
  }, {
    key: "removeOutlines",
    value: function removeOutlines(meshes) {
      var _this2 = this;
      if (!meshes || !Array.isArray(meshes)) return;
      meshes.forEach(function (mesh) {
        return _this2.removeOutline(mesh);
      });
    }

    /**
     * Clear all outlines
     */
  }, {
    key: "clearAllOutlines",
    value: function clearAllOutlines() {
      var _iterator2 = _createForOfIteratorHelper(this.outlineMap.entries()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            mesh = _step2$value[0],
            outlineData = _step2$value[1];
          this.scene.remove(outlineData.outline);
          if (outlineData.outline.geometry) {
            outlineData.outline.geometry.dispose();
          }
          if (outlineData.outline.material) {
            outlineData.outline.material.dispose();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      this.outlineMap.clear();
    }

    /**
     * Update outline color
     */
  }, {
    key: "setOutlineColor",
    value: function setOutlineColor(color) {
      this.outlineColor = this.hexToNumber(color);

      // Update all existing outlines
      var _iterator3 = _createForOfIteratorHelper(this.outlineMap.entries()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
            mesh = _step3$value[0],
            outlineData = _step3$value[1];
          if (outlineData.outline.material) {
            outlineData.outline.material.color.set(this.outlineColor);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    /**
     * Convert hex string to number
     */
  }, {
    key: "hexToNumber",
    value: function hexToNumber(hex) {
      return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Get outline for mesh
     */
  }, {
    key: "getOutline",
    value: function getOutline(mesh) {
      var outlineData = this.outlineMap.get(mesh);
      return outlineData ? outlineData.outline : null;
    }

    /**
     * Check if mesh has outline
     */
  }, {
    key: "hasOutline",
    value: function hasOutline(mesh) {
      return this.outlineMap.has(mesh);
    }

    /**
     * Dispose all resources
     */
  }, {
    key: "dispose",
    value: function dispose() {
      this.clearAllOutlines();
    }
  }]);
}();


/***/ }),

/***/ "./src/js/selection/Picker.js":
/*!************************************!*\
  !*** ./src/js/selection/Picker.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Picker)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Object picking using raycasting
 */
var Picker = /*#__PURE__*/function () {
  function Picker(camera, renderer) {
    _classCallCheck(this, Picker);
    this.camera = camera;
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  /**
   * Update mouse position from event
   */
  return _createClass(Picker, [{
    key: "updateMousePosition",
    value: function updateMousePosition(event, canvas) {
      var rect = canvas.getBoundingClientRect();
      this.mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    /**
     * Pick objects at current mouse position
     * @param {Array} objects - Array of THREE.Mesh objects to test
     * @param {boolean} recursive - Whether to check children recursively
     * @returns {THREE.Intersection|null} - First intersection or null
     */
  }, {
    key: "pick",
    value: function pick(objects) {
      var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!objects || objects.length === 0) {
        return null;
      }

      // Update raycaster with camera and mouse position
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Perform raycast
      var intersects = this.raycaster.intersectObjects(objects, recursive);
      if (intersects.length > 0) {
        return intersects[0];
      }
      return null;
    }

    /**
     * Pick all objects at current mouse position
     * @param {Array} objects - Array of THREE.Mesh objects to test
     * @param {boolean} recursive - Whether to check children recursively
     * @returns {Array} - Array of intersections
     */
  }, {
    key: "pickAll",
    value: function pickAll(objects) {
      var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!objects || objects.length === 0) {
        return [];
      }

      // Update raycaster with camera and mouse position
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Perform raycast
      return this.raycaster.intersectObjects(objects, recursive);
    }

    /**
     * Pick object from click event
     * @param {Event} event - Mouse click event
     * @param {HTMLElement} canvas - Canvas element
     * @param {Array} objects - Array of objects to test
     * @param {boolean} recursive - Whether to check children recursively
     * @returns {THREE.Intersection|null}
     */
  }, {
    key: "pickFromEvent",
    value: function pickFromEvent(event, canvas, objects) {
      var recursive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.updateMousePosition(event, canvas);
      return this.pick(objects, recursive);
    }

    /**
     * Get mouse position
     */
  }, {
    key: "getMousePosition",
    value: function getMousePosition() {
      return this.mouse.clone();
    }

    /**
     * Update camera reference
     */
  }, {
    key: "setCamera",
    value: function setCamera(camera) {
      this.camera = camera;
    }
  }]);
}();


/***/ }),

/***/ "./src/js/selection/SelectionManager.js":
/*!**********************************************!*\
  !*** ./src/js/selection/SelectionManager.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectionManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Selection state management with multi-select support
 */
var SelectionManager = /*#__PURE__*/function () {
  function SelectionManager(eventEmitter) {
    _classCallCheck(this, SelectionManager);
    this.eventEmitter = eventEmitter;
    this.selectedObjects = [];
    this.selectedObject = null;
  }

  /**
   * Select single object (replaces current selection)
   */
  return _createClass(SelectionManager, [{
    key: "select",
    value: function select(object) {
      if (!object) return;

      // Store previous selection for event
      var previousSelection = _toConsumableArray(this.selectedObjects);

      // Clear current selection
      this.selectedObjects = [object];
      this.selectedObject = object;

      // Emit event
      this.eventEmitter.emit('selectionChanged', this.selectedObjects, previousSelection);
      return this.selectedObjects;
    }

    /**
     * Add object to selection (multi-select)
     */
  }, {
    key: "addToSelection",
    value: function addToSelection(object) {
      if (!object) return;

      // Check if already selected
      if (this.selectedObjects.includes(object)) {
        return this.selectedObjects;
      }

      // Store previous selection
      var previousSelection = _toConsumableArray(this.selectedObjects);

      // Add to selection
      this.selectedObjects.push(object);
      this.selectedObject = this.selectedObjects[0];

      // Emit event
      this.eventEmitter.emit('selectionChanged', this.selectedObjects, previousSelection);
      return this.selectedObjects;
    }

    /**
     * Remove object from selection
     */
  }, {
    key: "removeFromSelection",
    value: function removeFromSelection(object) {
      if (!object) return;
      var index = this.selectedObjects.indexOf(object);
      if (index === -1) return;

      // Store previous selection
      var previousSelection = _toConsumableArray(this.selectedObjects);

      // Remove from selection
      this.selectedObjects.splice(index, 1);
      this.selectedObject = this.selectedObjects.length > 0 ? this.selectedObjects[0] : null;

      // Emit event
      this.eventEmitter.emit('selectionChanged', this.selectedObjects, previousSelection);
      return this.selectedObjects;
    }

    /**
     * Toggle object selection
     */
  }, {
    key: "toggle",
    value: function toggle(object) {
      if (!object) return;
      if (this.selectedObjects.includes(object)) {
        this.removeFromSelection(object);
      } else {
        this.addToSelection(object);
      }
      return this.selectedObjects;
    }

    /**
     * Clear all selection
     */
  }, {
    key: "clear",
    value: function clear() {
      if (this.selectedObjects.length === 0) return;

      // Store previous selection
      var previousSelection = _toConsumableArray(this.selectedObjects);

      // Clear selection
      this.selectedObjects = [];
      this.selectedObject = null;

      // Emit event
      this.eventEmitter.emit('selectionChanged', [], previousSelection);
    }

    /**
     * Check if object is selected
     */
  }, {
    key: "isSelected",
    value: function isSelected(object) {
      return this.selectedObjects.includes(object);
    }

    /**
     * Get all selected objects
     */
  }, {
    key: "getSelectedObjects",
    value: function getSelectedObjects() {
      return _toConsumableArray(this.selectedObjects);
    }

    /**
     * Get first selected object
     */
  }, {
    key: "getSelectedObject",
    value: function getSelectedObject() {
      return this.selectedObject;
    }

    /**
     * Get selection count
     */
  }, {
    key: "getSelectionCount",
    value: function getSelectionCount() {
      return this.selectedObjects.length;
    }

    /**
     * Check if has selection
     */
  }, {
    key: "hasSelection",
    value: function hasSelection() {
      return this.selectedObjects.length > 0;
    }

    /**
     * Check if has multiple selections
     */
  }, {
    key: "hasMultipleSelections",
    value: function hasMultipleSelections() {
      return this.selectedObjects.length > 1;
    }
  }]);
}();


/***/ }),

/***/ "./src/js/shapes/ShapeFactory.js":
/*!***************************************!*\
  !*** ./src/js/shapes/ShapeFactory.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShapeFactory)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Shape factory - Creates all 13 shape types
 */


var ShapeFactory = /*#__PURE__*/function () {
  function ShapeFactory(config) {
    _classCallCheck(this, ShapeFactory);
    this.config = config;
    this.fontLoader = new THREE.FontLoader();
    this.fonts = {};
    this.shapeCounters = {
      box: 0,
      sphere: 0,
      cylinder: 0,
      cone: 0,
      torus: 0,
      plane: 0,
      pyramid: 0,
      torusknot: 0,
      tetrahedron: 0,
      octahedron: 0,
      icosahedron: 0,
      dodecahedron: 0,
      text: 0
    };
  }

  /**
   * Load fonts for text shapes
   */
  return _createClass(ShapeFactory, [{
    key: "loadFonts",
    value: function loadFonts(onComplete) {
      var _this = this;
      var fontUrls = {
        sans: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        mono: '/src/font/DM_Mono_Regular.json',
        serif: 'https://threejs.org/examples/fonts/gentilis_regular.typeface.json'
      };
      var loadedCount = 0;
      var totalFonts = Object.keys(fontUrls).length;
      var _loop = function _loop() {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          fontName = _Object$entries$_i[0],
          url = _Object$entries$_i[1];
        _this.fontLoader.load(url, function (font) {
          _this.fonts[fontName] = font;
          loadedCount++;
          console.log("SWK: Font loaded: ".concat(fontName));
          if (loadedCount === totalFonts && onComplete) {
            onComplete();
          }
        }, undefined, function (error) {
          console.error("SWK: Failed to load font ".concat(fontName, ":"), error);
          loadedCount++;
          if (loadedCount === totalFonts && onComplete) {
            onComplete();
          }
        });
      };
      for (var _i = 0, _Object$entries = Object.entries(fontUrls); _i < _Object$entries.length; _i++) {
        _loop();
      }
    }

    /**
     * Create shape by type
     */
  }, {
    key: "createShape",
    value: function createShape(type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var shapeType = type.toLowerCase();
      if (!Object.values(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES).includes(shapeType)) {
        console.error("SWK: Unknown shape type: ".concat(type));
        return null;
      }
      var geometry;
      var name;
      var isFlat = false;
      switch (shapeType) {
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.BOX:
          geometry = new THREE.BoxGeometry(1, 1, 1);
          this.shapeCounters.box++;
          name = "Box ".concat(this.shapeCounters.box);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.SPHERE:
          geometry = new THREE.SphereGeometry(0.5, 32, 32);
          this.shapeCounters.sphere++;
          name = "Sphere ".concat(this.shapeCounters.sphere);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.CYLINDER:
          geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
          this.shapeCounters.cylinder++;
          name = "Cylinder ".concat(this.shapeCounters.cylinder);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.CONE:
          geometry = new THREE.ConeGeometry(0.5, 1, 32);
          this.shapeCounters.cone++;
          name = "Cone ".concat(this.shapeCounters.cone);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TORUS:
          geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
          this.shapeCounters.torus++;
          name = "Torus ".concat(this.shapeCounters.torus);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.PLANE:
          geometry = new THREE.PlaneGeometry(1, 1);
          this.shapeCounters.plane++;
          name = "Plane ".concat(this.shapeCounters.plane);
          isFlat = true;
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.PYRAMID:
          geometry = new THREE.ConeGeometry(0.7, 1, 4);
          this.shapeCounters.pyramid++;
          name = "Pyramid ".concat(this.shapeCounters.pyramid);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TORUS_KNOT:
          geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16);
          this.shapeCounters.torusknot++;
          name = "TorusKnot ".concat(this.shapeCounters.torusknot);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TETRAHEDRON:
          geometry = new THREE.TetrahedronGeometry(0.7);
          this.shapeCounters.tetrahedron++;
          name = "Tetrahedron ".concat(this.shapeCounters.tetrahedron);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.OCTAHEDRON:
          geometry = new THREE.OctahedronGeometry(0.7);
          this.shapeCounters.octahedron++;
          name = "Octahedron ".concat(this.shapeCounters.octahedron);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.ICOSAHEDRON:
          geometry = new THREE.IcosahedronGeometry(0.7);
          this.shapeCounters.icosahedron++;
          name = "Icosahedron ".concat(this.shapeCounters.icosahedron);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.DODECAHEDRON:
          geometry = new THREE.DodecahedronGeometry(0.7);
          this.shapeCounters.dodecahedron++;
          name = "Dodecahedron ".concat(this.shapeCounters.dodecahedron);
          break;
        case _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TEXT:
          var textContent = options.text || 'Text';
          var font = options.font || 'sans';
          var height = options.height || 0.2;
          var bevel = options.bevel || 0.01;
          geometry = this.createTextGeometry(textContent, font, height, bevel);
          if (!geometry) {
            console.warn('SWK: Text geometry not ready, fonts may not be loaded');
            return null;
          }
          this.shapeCounters.text++;
          name = "Text ".concat(this.shapeCounters.text);
          isFlat = true;
          break;
      }

      // Compute geometry bounds
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      geometry.center();

      // Create material
      var color = options.color || _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_COLORS.SHAPE_DEFAULT;
      var material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.3,
        transparent: false,
        opacity: 1.0
      });

      // Create mesh
      var mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Store color in userData
      mesh.userData.color = color;
      mesh.userData.shapeType = shapeType;
      mesh.userData.isUserObject = true;
      mesh.userData.id = mesh.uuid;

      // Position the shape
      if (isFlat || shapeType === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TEXT) {
        mesh.position.set(0, 0, 0);
      } else {
        // Raise 3D objects above ground
        var bbox = geometry.boundingBox;
        var _height = bbox.max.y - bbox.min.y;
        mesh.position.set(0, _height / 2, 0);
      }

      // Store text-specific data if it's a text shape
      if (shapeType === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TEXT) {
        mesh.userData.textContent = options.text || 'Text';
        mesh.userData.textFont = options.font || 'sans';
        mesh.userData.textHeight = options.height || 0.2;
        mesh.userData.textBevel = options.bevel || 0.01;
      }

      // Apply options (for restoring from history)
      if (options.position) {
        mesh.position.fromArray(options.position);
      }
      if (options.rotation) {
        mesh.rotation.fromArray(options.rotation);
      }
      if (options.scale) {
        mesh.scale.fromArray(options.scale);
      }
      return mesh;
    }

    /**
     * Create text geometry
     */
  }, {
    key: "createTextGeometry",
    value: function createTextGeometry(text) {
      var fontName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sans';
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.2;
      var bevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.01;
      if (!this.fonts[fontName]) {
        console.warn("SWK: Font ".concat(fontName, " not loaded yet"));
        // Try to use sans as fallback
        fontName = 'sans';
        if (!this.fonts[fontName]) {
          return null;
        }
      }
      var geometry = new THREE.TextGeometry(text, {
        font: this.fonts[fontName],
        size: 1,
        height: height,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 5
      });
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      geometry.center();
      return geometry;
    }

    /**
     * Update text geometry
     */
  }, {
    key: "updateTextGeometry",
    value: function updateTextGeometry(mesh, text, font, height, bevel) {
      if (mesh.userData.shapeType !== _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SHAPE_TYPES.TEXT) {
        return false;
      }
      var newGeometry = this.createTextGeometry(text, font, height, bevel);
      if (!newGeometry) {
        return false;
      }

      // Replace geometry
      mesh.geometry.dispose();
      mesh.geometry = newGeometry;

      // Update user data
      mesh.userData.textContent = text;
      mesh.userData.textFont = font;
      mesh.userData.textHeight = height;
      mesh.userData.textBevel = bevel;
      return true;
    }

    /**
     * Get shape counters
     */
  }, {
    key: "getCounters",
    value: function getCounters() {
      return _objectSpread({}, this.shapeCounters);
    }

    /**
     * Set shape counters (for undo/redo)
     */
  }, {
    key: "setCounters",
    value: function setCounters(counters) {
      this.shapeCounters = _objectSpread({}, counters);
    }
  }]);
}();


/***/ }),

/***/ "./src/js/transform/SnapManager.js":
/*!*****************************************!*\
  !*** ./src/js/transform/SnapManager.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SnapManager)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
/* harmony import */ var _utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Helpers.js */ "./src/js/utils/Helpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Snap settings manager for transform controls
 */



var SnapManager = /*#__PURE__*/function () {
  function SnapManager(transformControls, config, eventEmitter) {
    _classCallCheck(this, SnapManager);
    this.transformControls = transformControls;
    this.config = config;
    this.eventEmitter = eventEmitter;
    this.snapUnit = config.get('transform.snapUnit');
    this.rotationSnapDegrees = 15; // Default rotation snap in degrees

    this.applySnap();
  }

  /**
   * Apply snap settings to transform controls
   */
  return _createClass(SnapManager, [{
    key: "applySnap",
    value: function applySnap() {
      if (!this.transformControls) return;

      // Translation snap
      this.transformControls.setTranslationSnap(this.snapUnit);

      // Rotation snap (in radians)
      var rotationSnapRadians = this.snapUnit > 0 ? (0,_utils_Helpers_js__WEBPACK_IMPORTED_MODULE_1__.degToRad)(this.rotationSnapDegrees) : null;
      this.transformControls.setRotationSnap(rotationSnapRadians);

      // Scale snap
      this.transformControls.setScaleSnap(this.snapUnit);
    }

    /**
     * Set snap unit
     */
  }, {
    key: "setSnapUnit",
    value: function setSnapUnit(value) {
      if (typeof value !== 'number' || value < 0) {
        console.warn("SWK: Invalid snap unit: ".concat(value));
        return;
      }
      this.snapUnit = value;
      this.config.set('transform.snapUnit', value);
      this.applySnap();
      this.eventEmitter.emit('snapUnitChanged', value);
    }

    /**
     * Get snap unit
     */
  }, {
    key: "getSnapUnit",
    value: function getSnapUnit() {
      return this.snapUnit;
    }

    /**
     * Set rotation snap (in degrees)
     */
  }, {
    key: "setRotationSnap",
    value: function setRotationSnap(degrees) {
      if (typeof degrees !== 'number' || degrees < 0) {
        console.warn("SWK: Invalid rotation snap: ".concat(degrees));
        return;
      }
      this.rotationSnapDegrees = degrees;
      this.applySnap();
      this.eventEmitter.emit('rotationSnapChanged', degrees);
    }

    /**
     * Get rotation snap (in degrees)
     */
  }, {
    key: "getRotationSnap",
    value: function getRotationSnap() {
      return this.rotationSnapDegrees;
    }

    /**
     * Toggle snap on/off
     */
  }, {
    key: "toggleSnap",
    value: function toggleSnap() {
      if (this.snapUnit > 0) {
        // Disable snap
        this.setSnapUnit(0);
      } else {
        // Enable snap with default value
        this.setSnapUnit(0.1);
      }
    }

    /**
     * Check if snap is enabled
     */
  }, {
    key: "isSnapEnabled",
    value: function isSnapEnabled() {
      return this.snapUnit > 0;
    }

    /**
     * Cycle through predefined snap values
     */
  }, {
    key: "cycleSnapValue",
    value: function cycleSnapValue() {
      var currentIndex = _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SNAP_VALUES.indexOf(this.snapUnit);
      var nextIndex = (currentIndex + 1) % _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SNAP_VALUES.length;
      this.setSnapUnit(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SNAP_VALUES[nextIndex]);
    }

    /**
     * Get available snap values
     */
  }, {
    key: "getAvailableSnapValues",
    value: function getAvailableSnapValues() {
      return _toConsumableArray(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.SNAP_VALUES);
    }
  }]);
}();


/***/ }),

/***/ "./src/js/transform/TransformManager.js":
/*!**********************************************!*\
  !*** ./src/js/transform/TransformManager.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TransformManager)
/* harmony export */ });
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Transform controls manager with mode switching
 */


var TransformManager = /*#__PURE__*/function () {
  function TransformManager(camera, canvas, scene, config, eventEmitter) {
    _classCallCheck(this, TransformManager);
    this.camera = camera;
    this.canvas = canvas;
    this.scene = scene;
    this.config = config;
    this.eventEmitter = eventEmitter;
    this.transformControls = null;
    this.currentMode = config.get('transform.mode');
    this.currentSpace = config.get('transform.space');
    this.init();
  }

  /**
   * Initialize transform controls
   */
  return _createClass(TransformManager, [{
    key: "init",
    value: function init() {
      this.transformControls = new THREE.TransformControls(this.camera, this.canvas);

      // Set initial mode and space
      this.transformControls.setMode(this.currentMode);
      this.transformControls.setSpace(this.currentSpace);

      // Add to scene
      this.scene.add(this.transformControls);

      // Listen to transform events
      this.transformControls.addEventListener('change', this.onChange.bind(this));
      this.transformControls.addEventListener('dragging-changed', this.onDraggingChanged.bind(this));
      this.transformControls.addEventListener('objectChange', this.onObjectChange.bind(this));
    }

    /**
     * Handle transform change
     */
  }, {
    key: "onChange",
    value: function onChange() {
      // Emit transform event
      this.eventEmitter.emit('transform');
    }

    /**
     * Handle dragging state change
     */
  }, {
    key: "onDraggingChanged",
    value: function onDraggingChanged(event) {
      // Emit dragging event
      this.eventEmitter.emit('transformDragging', event.value);

      // Disable/enable orbit controls
      this.eventEmitter.emit('orbitControlsEnabled', !event.value);
    }

    /**
     * Handle object change
     */
  }, {
    key: "onObjectChange",
    value: function onObjectChange() {
      var object = this.transformControls.object;
      if (object) {
        this.eventEmitter.emit('objectTransformed', object);

        // Execute callback
        var callback = this.config.get('callbacks.onTransformChange');
        if (callback && typeof callback === 'function') {
          callback(object);
        }
      }
    }

    /**
     * Set transform mode
     */
  }, {
    key: "setMode",
    value: function setMode(mode) {
      if (!Object.values(_utils_Constants_js__WEBPACK_IMPORTED_MODULE_0__.TRANSFORM_MODES).includes(mode)) {
        console.warn("SWK: Invalid transform mode: ".concat(mode));
        return;
      }
      this.currentMode = mode;
      this.transformControls.setMode(mode);
      this.config.set('transform.mode', mode);
      this.eventEmitter.emit('transformModeChanged', mode);
    }

    /**
     * Get current mode
     */
  }, {
    key: "getMode",
    value: function getMode() {
      return this.currentMode;
    }

    /**
     * Set transform space
     */
  }, {
    key: "setSpace",
    value: function setSpace(space) {
      if (space !== 'local' && space !== 'world') {
        console.warn("SWK: Invalid transform space: ".concat(space));
        return;
      }
      this.currentSpace = space;
      this.transformControls.setSpace(space);
      this.config.set('transform.space', space);
      this.eventEmitter.emit('transformSpaceChanged', space);
    }

    /**
     * Get current space
     */
  }, {
    key: "getSpace",
    value: function getSpace() {
      return this.currentSpace;
    }

    /**
     * Attach to object
     */
  }, {
    key: "attach",
    value: function attach(object) {
      if (object) {
        this.transformControls.attach(object);
      }
    }

    /**
     * Detach from object
     */
  }, {
    key: "detach",
    value: function detach() {
      this.transformControls.detach();
    }

    /**
     * Get attached object
     */
  }, {
    key: "getAttachedObject",
    value: function getAttachedObject() {
      return this.transformControls.object || null;
    }

    /**
     * Check if dragging
     */
  }, {
    key: "isDragging",
    value: function isDragging() {
      return this.transformControls.dragging || false;
    }

    /**
     * Enable transform controls
     */
  }, {
    key: "enable",
    value: function enable() {
      this.transformControls.enabled = true;
    }

    /**
     * Disable transform controls
     */
  }, {
    key: "disable",
    value: function disable() {
      this.transformControls.enabled = false;
    }

    /**
     * Update camera reference
     */
  }, {
    key: "setCamera",
    value: function setCamera(camera) {
      this.camera = camera;
      this.transformControls.camera = camera;
    }

    /**
     * Get transform controls instance
     */
  }, {
    key: "getControls",
    value: function getControls() {
      return this.transformControls;
    }

    /**
     * Dispose transform controls
     */
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.transformControls) {
        this.transformControls.removeEventListener('change', this.onChange.bind(this));
        this.transformControls.removeEventListener('dragging-changed', this.onDraggingChanged.bind(this));
        this.transformControls.removeEventListener('objectChange', this.onObjectChange.bind(this));
        this.transformControls.detach();
        this.scene.remove(this.transformControls);
        this.transformControls.dispose();
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/js/ui/ControlsPanel.js":
/*!************************************!*\
  !*** ./src/js/ui/ControlsPanel.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * ControlsPanel.js
 * Bottom toolbar with transform modes, camera controls, history, and export
 */



var ControlsPanel = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {HTMLElement} container - Panel container element
   * @param {SWK} swkInstance - Main SWK instance
   * @param {Object} config - Configuration object
   */
  function ControlsPanel(container, swkInstance, config) {
    var _this;
    _classCallCheck(this, ControlsPanel);
    _this = _callSuper(this, ControlsPanel);
    _this.container = container;
    _this.swk = swkInstance;
    _this.config = config;
    return _this;
  }

  /**
   * Render the controls panel
   */
  _inherits(ControlsPanel, _EventEmitter);
  return _createClass(ControlsPanel, [{
    key: "render",
    value: function render() {
      this.container.innerHTML = "\n            <div class=\"swk-controls-toolbar\">\n                <!-- Transform Modes -->\n                <div class=\"swk-control-group\">\n                    <span class=\"swk-control-label\">Transform:</span>\n                    <div class=\"swk-button-group\">\n                        <button class=\"swk-control-button active\" data-mode=\"translate\" title=\"Translate (T)\">\n                            <span>\u21C4</span>\n                        </button>\n                        <button class=\"swk-control-button\" data-mode=\"rotate\" title=\"Rotate (R)\">\n                            <span>\u21BB</span>\n                        </button>\n                        <button class=\"swk-control-button\" data-mode=\"scale\" title=\"Scale (S)\">\n                            <span>\u21F2</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Camera Modes -->\n                <div class=\"swk-control-group\">\n                    <span class=\"swk-control-label\">Camera:</span>\n                    <div class=\"swk-button-group\">\n                        <button class=\"swk-control-button active\" data-camera=\"perspective\" title=\"Perspective\">\n                            <span>\uD83C\uDFA5</span>\n                        </button>\n                        <button class=\"swk-control-button\" data-camera=\"orthographic\" title=\"Orthographic\">\n                            <span>\u25A6</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Snap Settings -->\n                <div class=\"swk-control-group\">\n                    <span class=\"swk-control-label\">Snap:</span>\n                    <select class=\"swk-control-select\" id=\"swk-snap-select\">\n                        <option value=\"0\">Off</option>\n                        <option value=\"0.01\">0.01</option>\n                        <option value=\"0.025\">0.025</option>\n                        <option value=\"0.05\">0.05</option>\n                        <option value=\"0.1\" selected>0.1</option>\n                        <option value=\"0.2\">0.2</option>\n                        <option value=\"0.5\">0.5</option>\n                    </select>\n                </div>\n                \n                <!-- History -->\n                <div class=\"swk-control-group\">\n                    <span class=\"swk-control-label\">History:</span>\n                    <div class=\"swk-button-group\">\n                        <button class=\"swk-control-button\" id=\"swk-undo-btn\" title=\"Undo (Ctrl+Z)\" disabled>\n                            <span>\u21B6</span>\n                        </button>\n                        <button class=\"swk-control-button\" id=\"swk-redo-btn\" title=\"Redo (Ctrl+Y)\" disabled>\n                            <span>\u21B7</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Actions -->\n                <div class=\"swk-control-group\">\n                    <span class=\"swk-control-label\">Actions:</span>\n                    <div class=\"swk-button-group\">\n                        <button class=\"swk-control-button\" id=\"swk-group-btn\" title=\"Group Selected\">\n                            <span>\u229E</span>\n                        </button>\n                        <button class=\"swk-control-button\" id=\"swk-ungroup-btn\" title=\"Ungroup\">\n                            <span>\u229F</span>\n                        </button>\n                        <button class=\"swk-control-button\" id=\"swk-duplicate-btn\" title=\"Duplicate\">\n                            <span>\u29C9</span>\n                        </button>\n                        <button class=\"swk-control-button swk-control-button-danger\" id=\"swk-delete-btn\" title=\"Delete\">\n                            <span>\uD83D\uDDD1</span>\n                        </button>\n                    </div>\n                </div>\n                \n                <!-- Export -->\n                <div class=\"swk-control-group\">\n                    <span class=\"swk-control-label\">Export:</span>\n                    <div class=\"swk-button-group\">\n                        <button class=\"swk-control-button\" id=\"swk-export-gltf-btn\" title=\"Export GLTF\">\n                            <span>GLTF</span>\n                        </button>\n                        <button class=\"swk-control-button\" id=\"swk-export-stl-btn\" title=\"Export STL\">\n                            <span>STL</span>\n                        </button>\n                    </div>\n                </div>\n            </div>\n        ";
      this.attachEventListeners();
    }

    /**
     * Attach event listeners to controls
     */
  }, {
    key: "attachEventListeners",
    value: function attachEventListeners() {
      var _this2 = this;
      // Transform mode buttons
      var transformButtons = this.container.querySelectorAll('[data-mode]');
      transformButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var mode = btn.getAttribute('data-mode');
          _this2.swk.setTransformMode(mode);
        });
      });

      // Camera mode buttons
      var cameraButtons = this.container.querySelectorAll('[data-camera]');
      cameraButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var mode = btn.getAttribute('data-camera');
          _this2.swk.setCameraMode(mode);
        });
      });

      // Snap select
      var snapSelect = document.getElementById('swk-snap-select');
      if (snapSelect) {
        snapSelect.addEventListener('change', function (e) {
          var value = parseFloat(e.target.value);
          _this2.swk.setSnapUnit(value);
        });
      }

      // History buttons
      var undoBtn = document.getElementById('swk-undo-btn');
      if (undoBtn) {
        undoBtn.addEventListener('click', function () {
          return _this2.swk.undo();
        });
      }
      var redoBtn = document.getElementById('swk-redo-btn');
      if (redoBtn) {
        redoBtn.addEventListener('click', function () {
          return _this2.swk.redo();
        });
      }

      // Action buttons
      var groupBtn = document.getElementById('swk-group-btn');
      if (groupBtn) {
        groupBtn.addEventListener('click', function () {
          return _this2.swk.groupSelected();
        });
      }
      var ungroupBtn = document.getElementById('swk-ungroup-btn');
      if (ungroupBtn) {
        ungroupBtn.addEventListener('click', function () {
          return _this2.swk.ungroupSelected();
        });
      }
      var duplicateBtn = document.getElementById('swk-duplicate-btn');
      if (duplicateBtn) {
        duplicateBtn.addEventListener('click', function () {
          return _this2.swk.duplicateObject();
        });
      }
      var deleteBtn = document.getElementById('swk-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
          return _this2.swk.deleteObject();
        });
      }

      // Export buttons
      var exportGltfBtn = document.getElementById('swk-export-gltf-btn');
      if (exportGltfBtn) {
        exportGltfBtn.addEventListener('click', function () {
          return _this2.exportGLTF();
        });
      }
      var exportStlBtn = document.getElementById('swk-export-stl-btn');
      if (exportStlBtn) {
        exportStlBtn.addEventListener('click', function () {
          return _this2.exportSTL();
        });
      }
    }

    /**
     * Update transform mode buttons
     * @param {string} mode - Current transform mode
     */
  }, {
    key: "updateTransformMode",
    value: function updateTransformMode(mode) {
      var buttons = this.container.querySelectorAll('[data-mode]');
      buttons.forEach(function (btn) {
        if (btn.getAttribute('data-mode') === mode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    /**
     * Update camera mode buttons
     * @param {string} mode - Current camera mode
     */
  }, {
    key: "updateCameraMode",
    value: function updateCameraMode(mode) {
      var buttons = this.container.querySelectorAll('[data-camera]');
      buttons.forEach(function (btn) {
        if (btn.getAttribute('data-camera') === mode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    /**
     * Update history button states
     * @param {Object} data - History state data
     */
  }, {
    key: "updateHistoryState",
    value: function updateHistoryState(data) {
      var undoBtn = document.getElementById('swk-undo-btn');
      var redoBtn = document.getElementById('swk-redo-btn');
      if (undoBtn) {
        undoBtn.disabled = !data.canUndo;
      }
      if (redoBtn) {
        redoBtn.disabled = !data.canRedo;
      }
    }

    /**
     * Export scene as GLTF
     */
  }, {
    key: "exportGLTF",
    value: (function () {
      var _exportGLTF = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var success, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return this.swk.exportGLTF();
            case 1:
              success = _context.v;
              if (success) {
                console.log('✅ GLTF export completed');
              } else {
                console.warn('⚠️ GLTF export failed or cancelled');
              }
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error('❌ Failed to export GLTF:', _t);
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function exportGLTF() {
        return _exportGLTF.apply(this, arguments);
      }
      return exportGLTF;
    }()
    /**
     * Export scene as STL
     */
    )
  }, {
    key: "exportSTL",
    value: (function () {
      var _exportSTL = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var success, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return this.swk.exportSTL();
            case 1:
              success = _context2.v;
              if (success) {
                console.log('✅ STL export completed');
              } else {
                console.warn('⚠️ STL export failed or cancelled');
              }
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t2 = _context2.v;
              console.error('❌ Failed to export STL:', _t2);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function exportSTL() {
        return _exportSTL.apply(this, arguments);
      }
      return exportSTL;
    }()
    /**
     * Refresh the panel
     */
    )
  }, {
    key: "refresh",
    value: function refresh() {
      // Update button states based on current state
      this.updateTransformMode(this.swk.transformManager.getMode());
      this.updateCameraMode(this.swk.cameraManager.getMode());
      if (this.swk.historyManager) {
        this.updateHistoryState({
          canUndo: this.swk.canUndo(),
          canRedo: this.swk.canRedo()
        });
      }
    }

    /**
     * Clean up
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAllListeners();
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ControlsPanel);

/***/ }),

/***/ "./src/js/ui/OutlinerPanel.js":
/*!************************************!*\
  !*** ./src/js/ui/OutlinerPanel.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * OutlinerPanel.js
 * Scene hierarchy panel showing all objects and groups
 */


var OutlinerPanel = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {HTMLElement} container - Panel container element
   * @param {SWK} swkInstance - Main SWK instance
   * @param {Object} config - Configuration object
   */
  function OutlinerPanel(container, swkInstance, config) {
    var _this;
    _classCallCheck(this, OutlinerPanel);
    _this = _callSuper(this, OutlinerPanel);
    _this.container = container;
    _this.swk = swkInstance;
    _this.config = config;
    _this.expandedGroups = new Set();
    return _this;
  }

  /**
   * Render the outliner panel
   */
  _inherits(OutlinerPanel, _EventEmitter);
  return _createClass(OutlinerPanel, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      this.container.innerHTML = "\n            <div class=\"swk-panel-header\">\n                <h3>Outliner</h3>\n                <button class=\"swk-panel-button\" id=\"swk-outliner-refresh\" title=\"Refresh\">\u21BB</button>\n            </div>\n            <div class=\"swk-panel-content\">\n                <div class=\"swk-outliner-tree\" id=\"swk-outliner-tree\"></div>\n            </div>\n        ";

      // Refresh button
      var refreshBtn = document.getElementById('swk-outliner-refresh');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
          return _this2.refresh();
        });
      }
      this.refresh();
    }

    /**
     * Refresh the outliner tree
     */
  }, {
    key: "refresh",
    value: function refresh() {
      var _this3 = this;
      var tree = document.getElementById('swk-outliner-tree');
      if (!tree) return;
      var objects = this.swk.getAllObjects();
      if (objects.length === 0) {
        tree.innerHTML = "\n                <div class=\"swk-outliner-empty\">\n                    <p>No objects in scene</p>\n                    <small>Add shapes to see them here</small>\n                </div>\n            ";
        return;
      }
      tree.innerHTML = '';

      // Get root objects (not in groups)
      var rootObjects = objects.filter(function (obj) {
        return !obj.parent || !_this3.swk.isGroupContainer(obj.parent);
      });
      rootObjects.forEach(function (obj) {
        var item = _this3.createTreeItem(obj);
        tree.appendChild(item);
      });
    }

    /**
     * Create a tree item for an object
     * @param {THREE.Object3D} object - The object
     * @param {number} level - Nesting level
     * @returns {HTMLElement} Tree item element
     */
  }, {
    key: "createTreeItem",
    value: function createTreeItem(object) {
      var _this4 = this;
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var isGroup = this.swk.isGroupContainer(object);
      var isSelected = this.swk.selectionManager.isSelected(object);
      var isExpanded = this.expandedGroups.has(object.userData.id);
      var item = document.createElement('div');
      item.className = 'swk-outliner-item';
      item.setAttribute('data-object-id', object.userData.id);
      if (isSelected) {
        item.classList.add('swk-outliner-item-selected');
      }

      // Indentation
      var indent = level * 20;

      // Content
      var icon = '▢';
      if (isGroup) {
        icon = isExpanded ? '▼' : '▶';
      } else if (object.userData.shapeType) {
        icon = this.getShapeIcon(object.userData.shapeType);
      }
      item.innerHTML = "\n            <div class=\"swk-outliner-item-content\" style=\"padding-left: ".concat(indent, "px;\">\n                ").concat(isGroup ? "<span class=\"swk-outliner-toggle\" data-object-id=\"".concat(object.userData.id, "\">").concat(icon, "</span>") : "<span class=\"swk-outliner-icon\">".concat(icon, "</span>"), "\n                <span class=\"swk-outliner-name\">").concat(object.name, "</span>\n                <span class=\"swk-outliner-type\">").concat(isGroup ? 'Group' : object.userData.shapeType || '', "</span>\n            </div>\n        ");

      // Click to select
      var content = item.querySelector('.swk-outliner-item-content');
      content.addEventListener('click', function (e) {
        if (!e.target.classList.contains('swk-outliner-toggle')) {
          _this4.selectObject(object);
        }
      });

      // Toggle group expansion
      if (isGroup) {
        var toggle = item.querySelector('.swk-outliner-toggle');
        if (toggle) {
          toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            _this4.toggleGroup(object);
          });
        }
      }

      // Add children if group is expanded
      if (isGroup && isExpanded) {
        var children = this.swk.getGroupChildren(object);
        children.forEach(function (child) {
          var childItem = _this4.createTreeItem(child, level + 1);
          item.appendChild(childItem);
        });
      }
      return item;
    }

    /**
     * Get icon for shape type
     * @param {string} type - Shape type
     * @returns {string} Icon character
     */
  }, {
    key: "getShapeIcon",
    value: function getShapeIcon(type) {
      var icons = {
        'box': '▢',
        'sphere': '●',
        'cylinder': '⬬',
        'cone': '▲',
        'torus': '◯',
        'plane': '▭',
        'pyramid': '△',
        'torusknot': '⚭',
        'tetrahedron': '◊',
        'octahedron': '◈',
        'icosahedron': '⬟',
        'dodecahedron': '⬢',
        'text': 'T'
      };
      return icons[type] || '▢';
    }

    /**
     * Select an object
     * @param {THREE.Object3D} object - Object to select
     */
  }, {
    key: "selectObject",
    value: function selectObject(object) {
      this.swk.selectObject(object);
    }

    /**
     * Toggle group expansion
     * @param {THREE.Object3D} group - Group to toggle
     */
  }, {
    key: "toggleGroup",
    value: function toggleGroup(group) {
      var id = group.userData.id;
      if (this.expandedGroups.has(id)) {
        this.expandedGroups["delete"](id);
      } else {
        this.expandedGroups.add(id);
      }
      this.refresh();
    }

    /**
     * Update selection highlighting
     * @param {Array} selectedObjects - Selected objects
     */
  }, {
    key: "updateSelection",
    value: function updateSelection(selectedObjects) {
      var _this5 = this;
      // Remove all selected classes
      var items = this.container.querySelectorAll('.swk-outliner-item-selected');
      items.forEach(function (item) {
        return item.classList.remove('swk-outliner-item-selected');
      });

      // Add selected class to selected objects
      selectedObjects.forEach(function (obj) {
        var item = _this5.container.querySelector("[data-object-id=\"".concat(obj.userData.id, "\"]"));
        if (item) {
          item.classList.add('swk-outliner-item-selected');
        }
      });
    }

    /**
     * Add an object to the outliner
     * @param {THREE.Object3D} object - Object to add
     */
  }, {
    key: "addObject",
    value: function addObject(object) {
      this.refresh();
    }

    /**
     * Remove an object from the outliner
     * @param {THREE.Object3D} object - Object to remove
     */
  }, {
    key: "removeObject",
    value: function removeObject(object) {
      this.refresh();
    }

    /**
     * Clean up
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.expandedGroups.clear();
      this.removeAllListeners();
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OutlinerPanel);

/***/ }),

/***/ "./src/js/ui/PropertyPanel.js":
/*!************************************!*\
  !*** ./src/js/ui/PropertyPanel.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * PropertyPanel.js
 * Property editor panel for selected objects
 * Shows and allows editing of position, rotation, scale, color, and text properties
 */



var PropertyPanel = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {HTMLElement} container - Panel container element
   * @param {SWK} swkInstance - Main SWK instance
   * @param {Object} config - Configuration object
   */
  function PropertyPanel(container, swkInstance, config) {
    var _this;
    _classCallCheck(this, PropertyPanel);
    _this = _callSuper(this, PropertyPanel);
    _this.container = container;
    _this.swk = swkInstance;
    _this.config = config;
    _this.selectedObjects = [];
    _this.isUpdating = false; // Prevent feedback loops
    return _this;
  }

  /**
   * Render the property panel
   */
  _inherits(PropertyPanel, _EventEmitter);
  return _createClass(PropertyPanel, [{
    key: "render",
    value: function render() {
      this.container.innerHTML = "\n            <div class=\"swk-panel-header\">\n                <h3>Properties</h3>\n            </div>\n            <div class=\"swk-panel-content\" id=\"swk-property-content\">\n                <div class=\"swk-property-empty\">\n                    <p>No object selected</p>\n                    <small>Select an object to edit its properties</small>\n                </div>\n            </div>\n        ";
      this.contentElement = document.getElementById('swk-property-content');
    }

    /**
     * Update the panel when selection changes
     * @param {Array} selectedObjects - Array of selected objects
     */
  }, {
    key: "updateSelection",
    value: function updateSelection(selectedObjects) {
      this.selectedObjects = selectedObjects;
      this.refresh();
    }

    /**
     * Refresh the property panel content
     */
  }, {
    key: "refresh",
    value: function refresh() {
      if (!this.contentElement) return;
      if (this.selectedObjects.length === 0) {
        this.showEmptyState();
      } else if (this.selectedObjects.length === 1) {
        this.showSingleObjectProperties(this.selectedObjects[0]);
      } else {
        this.showMultipleObjectsProperties(this.selectedObjects);
      }
    }

    /**
     * Show empty state
     */
  }, {
    key: "showEmptyState",
    value: function showEmptyState() {
      this.contentElement.innerHTML = "\n            <div class=\"swk-property-empty\">\n                <p>No object selected</p>\n                <small>Select an object to edit its properties</small>\n            </div>\n        ";
    }

    /**
     * Show properties for a single object
     * @param {THREE.Object3D} object - The selected object
     */
  }, {
    key: "showSingleObjectProperties",
    value: function showSingleObjectProperties(object) {
      var isText = object.userData.shapeType === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.TEXT;
      var isGroup = this.swk.isGroupContainer(object);
      this.contentElement.innerHTML = "\n            <div class=\"swk-property-section\">\n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Name</label>\n                    <input type=\"text\" class=\"swk-property-input\" id=\"prop-name\" value=\"".concat(object.name, "\">\n                </div>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Type</label>\n                    <input type=\"text\" class=\"swk-property-input\" readonly value=\"").concat(isGroup ? 'Group' : object.userData.shapeType || 'Object', "\">\n                </div>\n            </div>\n            \n            <div class=\"swk-property-section\">\n                <h4 class=\"swk-property-section-title\">Transform</h4>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Position</label>\n                    <div class=\"swk-property-vector\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-pos-x\" value=\"").concat(object.position.x.toFixed(2), "\" step=\"0.1\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-pos-y\" value=\"").concat(object.position.y.toFixed(2), "\" step=\"0.1\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-pos-z\" value=\"").concat(object.position.z.toFixed(2), "\" step=\"0.1\">\n                    </div>\n                </div>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Rotation (\xB0)</label>\n                    <div class=\"swk-property-vector\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-rot-x\" value=\"").concat((object.rotation.x * 180 / Math.PI).toFixed(1), "\" step=\"1\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-rot-y\" value=\"").concat((object.rotation.y * 180 / Math.PI).toFixed(1), "\" step=\"1\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-rot-z\" value=\"").concat((object.rotation.z * 180 / Math.PI).toFixed(1), "\" step=\"1\">\n                    </div>\n                </div>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Scale</label>\n                    <div class=\"swk-property-vector\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-scale-x\" value=\"").concat(object.scale.x.toFixed(2), "\" step=\"0.1\" min=\"0.01\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-scale-y\" value=\"").concat(object.scale.y.toFixed(2), "\" step=\"0.1\" min=\"0.01\">\n                        <input type=\"number\" class=\"swk-property-input\" id=\"prop-scale-z\" value=\"").concat(object.scale.z.toFixed(2), "\" step=\"0.1\" min=\"0.01\">\n                    </div>\n                </div>\n            </div>\n            \n            ").concat(!isGroup ? "\n            <div class=\"swk-property-section\">\n                <h4 class=\"swk-property-section-title\">Material</h4>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Color</label>\n                    <input type=\"color\" class=\"swk-property-input swk-property-color\" id=\"prop-color\" value=\"#".concat(object.material.color.getHexString(), "\">\n                </div>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Visible</label>\n                    <input type=\"checkbox\" class=\"swk-property-checkbox\" id=\"prop-visible\" ").concat(object.visible ? 'checked' : '', ">\n                </div>\n            </div>\n            ") : '', "\n            \n            ").concat(isText ? "\n            <div class=\"swk-property-section\">\n                <h4 class=\"swk-property-section-title\">Text</h4>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Content</label>\n                    <input type=\"text\" class=\"swk-property-input\" id=\"prop-text\" value=\"".concat(object.userData.text || '', "\">\n                </div>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Font</label>\n                    <select class=\"swk-property-input\" id=\"prop-font\">\n                        <option value=\"sans\" ").concat(object.userData.fontType === 'sans' ? 'selected' : '', ">Sans Serif</option>\n                        <option value=\"serif\" ").concat(object.userData.fontType === 'serif' ? 'selected' : '', ">Serif</option>\n                        <option value=\"mono\" ").concat(object.userData.fontType === 'mono' ? 'selected' : '', ">Monospace</option>\n                    </select>\n                </div>\n                \n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Size</label>\n                    <input type=\"number\" class=\"swk-property-input\" id=\"prop-font-size\" value=\"").concat(object.userData.fontSize || 1, "\" step=\"0.1\" min=\"0.1\">\n                </div>\n            </div>\n            ") : '', "\n        ");
      this.attachEventListeners(object);
    }

    /**
     * Show properties for multiple objects
     * @param {Array} objects - Array of selected objects
     */
  }, {
    key: "showMultipleObjectsProperties",
    value: function showMultipleObjectsProperties(objects) {
      this.contentElement.innerHTML = "\n            <div class=\"swk-property-section\">\n                <div class=\"swk-property-group\">\n                    <label class=\"swk-property-label\">Selection</label>\n                    <input type=\"text\" class=\"swk-property-input\" readonly value=\"".concat(objects.length, " objects selected\">\n                </div>\n            </div>\n            \n            <div class=\"swk-property-section\">\n                <p class=\"swk-property-note\">Multiple objects selected. Transform operations will affect all selected objects.</p>\n            </div>\n        ");
    }

    /**
     * Attach event listeners to property inputs
     * @param {THREE.Object3D} object - The object being edited
     */
  }, {
    key: "attachEventListeners",
    value: function attachEventListeners(object) {
      var _this2 = this;
      // Name
      var nameInput = document.getElementById('prop-name');
      if (nameInput) {
        nameInput.addEventListener('change', function (e) {
          object.name = e.target.value;
          _this2.swk.captureState('Change name');
          _this2.emit('propertyChanged', {
            object: object,
            property: 'name',
            value: e.target.value
          });
        });
      }

      // Position
      ['x', 'y', 'z'].forEach(function (axis) {
        var input = document.getElementById("prop-pos-".concat(axis));
        if (input) {
          input.addEventListener('change', function (e) {
            object.position[axis] = parseFloat(e.target.value) || 0;
            _this2.swk.captureState('Change position');
            _this2.emit('propertyChanged', {
              object: object,
              property: 'position',
              axis: axis,
              value: object.position[axis]
            });
          });
        }
      });

      // Rotation (convert degrees to radians)
      ['x', 'y', 'z'].forEach(function (axis) {
        var input = document.getElementById("prop-rot-".concat(axis));
        if (input) {
          input.addEventListener('change', function (e) {
            var degrees = parseFloat(e.target.value) || 0;
            object.rotation[axis] = degrees * Math.PI / 180;
            _this2.swk.captureState('Change rotation');
            _this2.emit('propertyChanged', {
              object: object,
              property: 'rotation',
              axis: axis,
              value: object.rotation[axis]
            });
          });
        }
      });

      // Scale
      ['x', 'y', 'z'].forEach(function (axis) {
        var input = document.getElementById("prop-scale-".concat(axis));
        if (input) {
          input.addEventListener('change', function (e) {
            var value = parseFloat(e.target.value) || 0.01;
            object.scale[axis] = Math.max(0.01, value);
            _this2.swk.captureState('Change scale');
            _this2.emit('propertyChanged', {
              object: object,
              property: 'scale',
              axis: axis,
              value: object.scale[axis]
            });
          });
        }
      });

      // Color
      var colorInput = document.getElementById('prop-color');
      if (colorInput && object.material) {
        colorInput.addEventListener('change', function (e) {
          object.material.color.set(e.target.value);
          _this2.swk.captureState('Change color');
          _this2.emit('propertyChanged', {
            object: object,
            property: 'color',
            value: e.target.value
          });
        });
      }

      // Visible
      var visibleInput = document.getElementById('prop-visible');
      if (visibleInput) {
        visibleInput.addEventListener('change', function (e) {
          object.visible = e.target.checked;
          _this2.swk.captureState('Change visibility');
          _this2.emit('propertyChanged', {
            object: object,
            property: 'visible',
            value: object.visible
          });
        });
      }

      // Text content
      var textInput = document.getElementById('prop-text');
      if (textInput) {
        textInput.addEventListener('change', function (e) {
          _this2.updateTextGeometry(object, e.target.value, object.userData.fontSize, object.userData.fontType);
        });
      }

      // Font type
      var fontInput = document.getElementById('prop-font');
      if (fontInput) {
        fontInput.addEventListener('change', function (e) {
          _this2.updateTextGeometry(object, object.userData.text, object.userData.fontSize, e.target.value);
        });
      }

      // Font size
      var fontSizeInput = document.getElementById('prop-font-size');
      if (fontSizeInput) {
        fontSizeInput.addEventListener('change', function (e) {
          var size = Math.max(0.1, parseFloat(e.target.value) || 1);
          _this2.updateTextGeometry(object, object.userData.text, size, object.userData.fontType);
        });
      }
    }

    /**
     * Update text geometry
     * @param {THREE.Object3D} object - Text object
     * @param {string} text - New text content
     * @param {number} fontSize - Font size
     * @param {string} fontType - Font type
     */
  }, {
    key: "updateTextGeometry",
    value: (function () {
      var _updateTextGeometry = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(object, text, fontSize, fontType) {
        var shapeFactory, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              shapeFactory = this.swk.shapeFactory;
              if (!(shapeFactory && typeof shapeFactory.updateTextGeometry === 'function')) {
                _context.n = 2;
                break;
              }
              _context.n = 1;
              return shapeFactory.updateTextGeometry(object, text, fontSize, fontType);
            case 1:
              this.swk.captureState('Update text');
              this.emit('propertyChanged', {
                object: object,
                property: 'text'
              });
            case 2:
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              console.error('Failed to update text:', _t);
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[0, 3]]);
      }));
      function updateTextGeometry(_x, _x2, _x3, _x4) {
        return _updateTextGeometry.apply(this, arguments);
      }
      return updateTextGeometry;
    }()
    /**
     * Clean up
     */
    )
  }, {
    key: "destroy",
    value: function destroy() {
      this.selectedObjects = [];
      this.removeAllListeners();
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PropertyPanel);

/***/ }),

/***/ "./src/js/ui/ShapesPanel.js":
/*!**********************************!*\
  !*** ./src/js/ui/ShapesPanel.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
/* harmony import */ var _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Constants.js */ "./src/js/utils/Constants.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * ShapesPanel.js
 * Shape creation panel with buttons for all shape types
 */



var ShapesPanel = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {HTMLElement} container - Panel container element
   * @param {SWK} swkInstance - Main SWK instance
   * @param {Object} config - Configuration object
   */
  function ShapesPanel(container, swkInstance, config) {
    var _this;
    _classCallCheck(this, ShapesPanel);
    _this = _callSuper(this, ShapesPanel);
    _this.container = container;
    _this.swk = swkInstance;
    _this.config = config;
    _this.shapes = [{
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.BOX,
      label: 'Box',
      icon: '▢'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.SPHERE,
      label: 'Sphere',
      icon: '●'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.CYLINDER,
      label: 'Cylinder',
      icon: '⬬'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.CONE,
      label: 'Cone',
      icon: '▲'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.TORUS,
      label: 'Torus',
      icon: '◯'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.PLANE,
      label: 'Plane',
      icon: '▭'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.PYRAMID,
      label: 'Pyramid',
      icon: '△'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.TORUSKNOT,
      label: 'Torus Knot',
      icon: '⚭'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.TETRAHEDRON,
      label: 'Tetrahedron',
      icon: '◊'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.OCTAHEDRON,
      label: 'Octahedron',
      icon: '◈'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.ICOSAHEDRON,
      label: 'Icosahedron',
      icon: '⬟'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.DODECAHEDRON,
      label: 'Dodecahedron',
      icon: '⬢'
    }, {
      type: _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.TEXT,
      label: 'Text',
      icon: 'T'
    }];
    return _this;
  }

  /**
   * Render the shapes panel
   */
  _inherits(ShapesPanel, _EventEmitter);
  return _createClass(ShapesPanel, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      this.container.innerHTML = "\n            <div class=\"swk-panel-header\">\n                <h3>Shapes</h3>\n            </div>\n            <div class=\"swk-panel-content\">\n                <div class=\"swk-shapes-grid\" id=\"swk-shapes-grid\"></div>\n            </div>\n        ";
      var grid = document.getElementById('swk-shapes-grid');

      // Create shape buttons
      this.shapes.forEach(function (shape) {
        var button = document.createElement('button');
        button.className = 'swk-shape-button';
        button.setAttribute('data-shape-type', shape.type);
        button.title = shape.label;
        button.innerHTML = "\n                <span class=\"swk-shape-icon\">".concat(shape.icon, "</span>\n                <span class=\"swk-shape-label\">").concat(shape.label, "</span>\n            ");
        button.addEventListener('click', function () {
          return _this2.createShape(shape.type);
        });
        grid.appendChild(button);
      });
    }

    /**
     * Create a shape
     * @param {string} type - Shape type
     */
  }, {
    key: "createShape",
    value: (function () {
      var _createShape = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(type) {
        var options, text, shape, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              options = {}; // Special handling for text
              if (!(type === _utils_Constants_js__WEBPACK_IMPORTED_MODULE_1__.SHAPE_TYPES.TEXT)) {
                _context.n = 2;
                break;
              }
              text = prompt('Enter text:', 'Hello');
              if (text) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              options = {
                text: text
              };
            case 2:
              _context.n = 3;
              return this.swk.addShape(type, options);
            case 3:
              shape = _context.v;
              if (shape) {
                // Select the newly created shape
                this.swk.selectObject(shape);
                this.emit('shapeCreated', {
                  type: type,
                  shape: shape
                });
              }
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
              console.error('Failed to create shape:', _t);
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[0, 4]]);
      }));
      function createShape(_x) {
        return _createShape.apply(this, arguments);
      }
      return createShape;
    }()
    /**
     * Refresh the panel
     */
    )
  }, {
    key: "refresh",
    value: function refresh() {
      // Nothing to refresh for static buttons
    }

    /**
     * Clean up
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAllListeners();
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShapesPanel);

/***/ }),

/***/ "./src/js/ui/UIManager.js":
/*!********************************!*\
  !*** ./src/js/ui/UIManager.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
/* harmony import */ var _PropertyPanel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PropertyPanel.js */ "./src/js/ui/PropertyPanel.js");
/* harmony import */ var _ShapesPanel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShapesPanel.js */ "./src/js/ui/ShapesPanel.js");
/* harmony import */ var _OutlinerPanel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OutlinerPanel.js */ "./src/js/ui/OutlinerPanel.js");
/* harmony import */ var _ControlsPanel_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ControlsPanel.js */ "./src/js/ui/ControlsPanel.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * UIManager.js
 * Central coordinator for all UI panels and components
 * Manages initialization, event coordination, and panel lifecycle
 */






var UIManager = /*#__PURE__*/function (_EventEmitter) {
  /**
   * @param {HTMLElement} container - Main container element
   * @param {SWK} swkInstance - Main SWK instance
   * @param {Object} config - Configuration object
   */
  function UIManager(container, swkInstance, config) {
    var _this;
    _classCallCheck(this, UIManager);
    _this = _callSuper(this, UIManager);
    _this.container = container;
    _this.swk = swkInstance;
    _this.config = config;

    // UI Panels
    _this.propertyPanel = null;
    _this.shapesPanel = null;
    _this.outlinerPanel = null;
    _this.controlsPanel = null;

    // UI State
    _this.isInitialized = false;
    _this.uiElements = {};

    // Check if UI should be enabled
    _this.uiEnabled = config.get('ui.enabled') !== false;
    if (_this.uiEnabled) {
      _this.initialize();
    }
    return _this;
  }

  /**
   * Initialize all UI panels
   */
  _inherits(UIManager, _EventEmitter);
  return _createClass(UIManager, [{
    key: "initialize",
    value: function initialize() {
      if (this.isInitialized) return;
      try {
        // Create main UI structure
        this.createUIStructure();

        // Initialize panels
        this.initializePanels();

        // Set up event listeners
        this.setupEventListeners();
        this.isInitialized = true;
        this.emit('uiInitialized');
      } catch (error) {
        console.error('Failed to initialize UI:', error);
      }
    }

    /**
     * Create the main UI structure
     */
  }, {
    key: "createUIStructure",
    value: function createUIStructure() {
      // Add UI wrapper class to container
      this.container.classList.add('swk-ui-container');

      // Create UI wrapper
      var uiWrapper = document.createElement('div');
      uiWrapper.className = 'swk-ui-wrapper';

      // Create left sidebar
      var leftSidebar = document.createElement('div');
      leftSidebar.className = 'swk-sidebar swk-sidebar-left';
      leftSidebar.innerHTML = "\n            <div id=\"swk-shapes-panel\" class=\"swk-panel\"></div>\n            <div id=\"swk-property-panel\" class=\"swk-panel\"></div>\n        ";

      // Create right sidebar
      var rightSidebar = document.createElement('div');
      rightSidebar.className = 'swk-sidebar swk-sidebar-right';
      rightSidebar.innerHTML = "\n            <div id=\"swk-outliner-panel\" class=\"swk-panel\"></div>\n        ";

      // Create bottom toolbar
      var bottomToolbar = document.createElement('div');
      bottomToolbar.className = 'swk-toolbar swk-toolbar-bottom';
      bottomToolbar.innerHTML = "\n            <div id=\"swk-controls-panel\" class=\"swk-panel\"></div>\n        ";

      // Append to wrapper
      uiWrapper.appendChild(leftSidebar);
      uiWrapper.appendChild(rightSidebar);
      uiWrapper.appendChild(bottomToolbar);

      // Append to container
      this.container.appendChild(uiWrapper);

      // Store references
      this.uiElements = {
        wrapper: uiWrapper,
        leftSidebar: leftSidebar,
        rightSidebar: rightSidebar,
        bottomToolbar: bottomToolbar,
        shapesPanel: document.getElementById('swk-shapes-panel'),
        propertyPanel: document.getElementById('swk-property-panel'),
        outlinerPanel: document.getElementById('swk-outliner-panel'),
        controlsPanel: document.getElementById('swk-controls-panel')
      };
    }

    /**
     * Initialize all UI panels
     */
  }, {
    key: "initializePanels",
    value: function initializePanels() {
      // Initialize Shapes Panel
      if (this.config.get('ui.panels.shapes') !== false) {
        this.shapesPanel = new _ShapesPanel_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.uiElements.shapesPanel, this.swk, this.config);
        this.shapesPanel.render();
      }

      // Initialize Property Panel
      if (this.config.get('ui.panels.properties') !== false) {
        this.propertyPanel = new _PropertyPanel_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.uiElements.propertyPanel, this.swk, this.config);
        this.propertyPanel.render();
      }

      // Initialize Outliner Panel
      if (this.config.get('ui.panels.outliner') !== false) {
        this.outlinerPanel = new _OutlinerPanel_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.uiElements.outlinerPanel, this.swk, this.config);
        this.outlinerPanel.render();
      }

      // Initialize Controls Panel
      if (this.config.get('ui.panels.controls') !== false) {
        this.controlsPanel = new _ControlsPanel_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.uiElements.controlsPanel, this.swk, this.config);
        this.controlsPanel.render();
      }
    }

    /**
     * Set up event listeners for coordination between panels
     */
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;
      // Selection changes
      this.swk.on('selectionChanged', function (selected) {
        if (_this2.propertyPanel) {
          _this2.propertyPanel.updateSelection(selected);
        }
        if (_this2.outlinerPanel) {
          _this2.outlinerPanel.updateSelection(selected);
        }
      });

      // Object added
      this.swk.on('objectAdded', function (object) {
        if (_this2.outlinerPanel) {
          _this2.outlinerPanel.addObject(object);
        }
      });

      // Object removed
      this.swk.on('objectRemoved', function (object) {
        if (_this2.outlinerPanel) {
          _this2.outlinerPanel.removeObject(object);
        }
        if (_this2.propertyPanel) {
          _this2.propertyPanel.updateSelection([]);
        }
      });

      // Transform mode changed
      this.swk.on('transformModeChanged', function (mode) {
        if (_this2.controlsPanel) {
          _this2.controlsPanel.updateTransformMode(mode);
        }
      });

      // Camera mode changed
      this.swk.on('cameraModeChanged', function (mode) {
        if (_this2.controlsPanel) {
          _this2.controlsPanel.updateCameraMode(mode);
        }
      });

      // History changed
      this.swk.on('historyChanged', function (data) {
        if (_this2.controlsPanel) {
          _this2.controlsPanel.updateHistoryState(data);
        }
        if (_this2.outlinerPanel) {
          _this2.outlinerPanel.refresh();
        }
      });

      // Group created/removed
      this.swk.on('groupCreated', function () {
        if (_this2.outlinerPanel) {
          _this2.outlinerPanel.refresh();
        }
      });
      this.swk.on('groupRemoved', function () {
        if (_this2.outlinerPanel) {
          _this2.outlinerPanel.refresh();
        }
      });
    }

    /**
     * Show the UI
     */
  }, {
    key: "show",
    value: function show() {
      if (this.uiElements.wrapper) {
        this.uiElements.wrapper.style.display = '';
      }
    }

    /**
     * Hide the UI
     */
  }, {
    key: "hide",
    value: function hide() {
      if (this.uiElements.wrapper) {
        this.uiElements.wrapper.style.display = 'none';
      }
    }

    /**
     * Toggle UI visibility
     */
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.uiElements.wrapper) {
        var isHidden = this.uiElements.wrapper.style.display === 'none';
        if (isHidden) {
          this.show();
        } else {
          this.hide();
        }
      }
    }

    /**
     * Update a specific panel
     * @param {string} panelName - Name of the panel to update
     */
  }, {
    key: "updatePanel",
    value: function updatePanel(panelName) {
      var panel = this["".concat(panelName, "Panel")];
      if (panel && typeof panel.refresh === 'function') {
        panel.refresh();
      }
    }

    /**
     * Clean up UI and remove event listeners
     */
  }, {
    key: "destroy",
    value: function destroy() {
      // Destroy all panels
      if (this.shapesPanel) this.shapesPanel.destroy();
      if (this.propertyPanel) this.propertyPanel.destroy();
      if (this.outlinerPanel) this.outlinerPanel.destroy();
      if (this.controlsPanel) this.controlsPanel.destroy();

      // Remove UI elements
      if (this.uiElements.wrapper && this.uiElements.wrapper.parentNode) {
        this.uiElements.wrapper.parentNode.removeChild(this.uiElements.wrapper);
      }

      // Clear references
      this.uiElements = {};
      this.propertyPanel = null;
      this.shapesPanel = null;
      this.outlinerPanel = null;
      this.controlsPanel = null;

      // Remove all listeners
      this.removeAllListeners();
      this.isInitialized = false;
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UIManager);

/***/ }),

/***/ "./src/js/utils/Constants.js":
/*!***********************************!*\
  !*** ./src/js/utils/Constants.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CAMERA_MODES: () => (/* binding */ CAMERA_MODES),
/* harmony export */   CAMERA_SETTINGS: () => (/* binding */ CAMERA_SETTINGS),
/* harmony export */   DEFAULT_COLORS: () => (/* binding */ DEFAULT_COLORS),
/* harmony export */   FONT_URLS: () => (/* binding */ FONT_URLS),
/* harmony export */   GRID_SETTINGS: () => (/* binding */ GRID_SETTINGS),
/* harmony export */   HISTORY_MAX_SIZE: () => (/* binding */ HISTORY_MAX_SIZE),
/* harmony export */   LIGHTING: () => (/* binding */ LIGHTING),
/* harmony export */   OUTLINE_THICKNESS: () => (/* binding */ OUTLINE_THICKNESS),
/* harmony export */   SHAPE_TYPES: () => (/* binding */ SHAPE_TYPES),
/* harmony export */   SNAP_VALUES: () => (/* binding */ SNAP_VALUES),
/* harmony export */   TRANSFORM_MODES: () => (/* binding */ TRANSFORM_MODES)
/* harmony export */ });
/**
 * Global constants for SenangWebs Kiln
 */

var SHAPE_TYPES = {
  BOX: 'box',
  SPHERE: 'sphere',
  CYLINDER: 'cylinder',
  CONE: 'cone',
  TORUS: 'torus',
  PLANE: 'plane',
  PYRAMID: 'pyramid',
  TORUS_KNOT: 'torusknot',
  TETRAHEDRON: 'tetrahedron',
  OCTAHEDRON: 'octahedron',
  ICOSAHEDRON: 'icosahedron',
  DODECAHEDRON: 'dodecahedron',
  TEXT: 'text'
};
var TRANSFORM_MODES = {
  TRANSLATE: 'translate',
  ROTATE: 'rotate',
  SCALE: 'scale'
};
var CAMERA_MODES = {
  PERSPECTIVE: 'perspective',
  ORTHOGRAPHIC: 'orthographic'
};
var SNAP_VALUES = [0.5, 0.2, 0.1, 0.05, 0.025, 0.01, 0];
var FONT_URLS = {
  sans: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  mono: '/src/font/DM_Mono_Regular.json',
  serif: 'https://threejs.org/examples/fonts/gentilis_regular.typeface.json'
};
var DEFAULT_COLORS = {
  VIEWPORT_BG: 0xe2e8f0,
  GRID_CENTER: 0x45556c,
  GRID_LINES: 0x90a1b9,
  OUTLINE: 0x1d293d,
  SHAPE_DEFAULT: 0x007370
};
var GRID_SETTINGS = {
  SIZE: 20,
  DIVISIONS: 20
};
var LIGHTING = {
  AMBIENT_INTENSITY: 0.7,
  AMBIENT_COLOR: 0xffffff,
  DIRECTIONAL_INTENSITY: 0.9,
  DIRECTIONAL_COLOR: 0xffffff,
  DIRECTIONAL_POSITION: [5, 10, 5]
};
var CAMERA_SETTINGS = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  POSITION: [5, 5, 5]
};
var HISTORY_MAX_SIZE = 50;
var OUTLINE_THICKNESS = 0.04;

/***/ }),

/***/ "./src/js/utils/Helpers.js":
/*!*********************************!*\
  !*** ./src/js/utils/Helpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   deepMerge: () => (/* binding */ deepMerge),
/* harmony export */   degToRad: () => (/* binding */ degToRad),
/* harmony export */   disposeObject: () => (/* binding */ disposeObject),
/* harmony export */   downloadFile: () => (/* binding */ downloadFile),
/* harmony export */   generateId: () => (/* binding */ generateId),
/* harmony export */   getTimestamp: () => (/* binding */ getTimestamp),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   parseDataAttributes: () => (/* binding */ parseDataAttributes),
/* harmony export */   radToDeg: () => (/* binding */ radToDeg)
/* harmony export */ });
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Utility helper functions
 */

/**
 * Convert degrees to radians
 */
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Generate unique ID
 */
function generateId() {
  return "swk-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
  var output = _objectSpread({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, _defineProperty({}, key, source[key]));
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, _defineProperty({}, key, source[key]));
      }
    });
  }
  return output;
}

/**
 * Check if value is an object
 */
function isObject(item) {
  return item && _typeof(item) === 'object' && !Array.isArray(item);
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Download file
 */
function downloadFile(blob, filename) {
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Get timestamp for file naming
 */
function getTimestamp() {
  return Date.now();
}

/**
 * Parse HTML data attributes to config object
 */
function parseDataAttributes(element) {
  var config = {};
  var dataset = element.dataset;
  var _loop = function _loop() {
    if (key.startsWith('swk')) {
      // Remove 'swk' prefix and convert to config path
      // e.g., 'swkUiEnabled' -> 'ui.enabled', 'swkGridShow' -> 'grid.show'
      var configPath = key.replace('swk', '').replace(/^./, function (str) {
        return str.toLowerCase();
      });

      // Convert camelCase to dot notation for nested properties
      // uiEnabled -> ui.enabled, gridShow -> grid.show
      configPath = configPath.replace(/([A-Z])/g, function (match, letter, offset) {
        // Special handling for known nested properties
        var nestedProps = ['ui', 'grid', 'camera', 'history', 'viewport', 'transform', 'lighting'];
        var beforeLetter = configPath.substring(0, offset);

        // Check if this is a start of a nested property
        for (var _i = 0, _nestedProps = nestedProps; _i < _nestedProps.length; _i++) {
          var prop = _nestedProps[_i];
          if (beforeLetter.toLowerCase() === prop) {
            return '.' + letter.toLowerCase();
          }
        }
        return letter.toLowerCase();
      });
      var value = dataset[key];

      // Parse value
      var parsedValue;
      if (value === 'true') {
        parsedValue = true;
      } else if (value === 'false') {
        parsedValue = false;
      } else if (value.includes(',')) {
        // Handle arrays (e.g., "5,5,5" -> [5,5,5])
        parsedValue = value.split(',').map(function (v) {
          var trimmed = v.trim();
          return !isNaN(trimmed) ? parseFloat(trimmed) : trimmed;
        });
      } else if (!isNaN(value) && value !== '') {
        parsedValue = parseFloat(value);
      } else {
        parsedValue = value;
      }

      // Set nested property
      setNestedProperty(config, configPath, parsedValue);
    }
  };
  for (var key in dataset) {
    _loop();
  }
  return config;
}

/**
 * Set nested property in object using dot notation
 */
function setNestedProperty(obj, path, value) {
  var keys = path.split('.');
  var lastKey = keys.pop();
  var target = obj;
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      if (!(key in target)) {
        target[key] = {};
      }
      target = target[key];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  target[lastKey] = value;
}

/**
 * Create DOM element with classes
 */
function createElement(tag) {
  var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var element = document.createElement(tag);
  if (classes.length > 0) {
    element.className = classes.join(' ');
  }
  for (var _i2 = 0, _Object$entries = Object.entries(attributes); _i2 < _Object$entries.length; _i2++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    element.setAttribute(key, value);
  }
  return element;
}

/**
 * Dispose Three.js object properly
 */
function disposeObject(object) {
  if (!object) return;
  if (object.geometry) {
    object.geometry.dispose();
  }
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(function (material) {
        return material.dispose();
      });
    } else {
      object.material.dispose();
    }
  }
  if (object.texture) {
    object.texture.dispose();
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/swk.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Config.js */ "./src/js/core/Config.js");
/* harmony import */ var _core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/EventEmitter.js */ "./src/js/core/EventEmitter.js");
/* harmony import */ var _core_Initializer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/Initializer.js */ "./src/js/core/Initializer.js");
/* harmony import */ var _core_Scene_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/Scene.js */ "./src/js/core/Scene.js");
/* harmony import */ var _core_Renderer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/Renderer.js */ "./src/js/core/Renderer.js");
/* harmony import */ var _core_Camera_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/Camera.js */ "./src/js/core/Camera.js");
/* harmony import */ var _core_Lighting_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/Lighting.js */ "./src/js/core/Lighting.js");
/* harmony import */ var _shapes_ShapeFactory_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shapes/ShapeFactory.js */ "./src/js/shapes/ShapeFactory.js");
/* harmony import */ var _selection_Picker_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./selection/Picker.js */ "./src/js/selection/Picker.js");
/* harmony import */ var _selection_SelectionManager_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./selection/SelectionManager.js */ "./src/js/selection/SelectionManager.js");
/* harmony import */ var _selection_Outliner_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./selection/Outliner.js */ "./src/js/selection/Outliner.js");
/* harmony import */ var _transform_TransformManager_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./transform/TransformManager.js */ "./src/js/transform/TransformManager.js");
/* harmony import */ var _transform_SnapManager_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./transform/SnapManager.js */ "./src/js/transform/SnapManager.js");
/* harmony import */ var _grouping_GroupManager_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./grouping/GroupManager.js */ "./src/js/grouping/GroupManager.js");
/* harmony import */ var _history_HistoryManager_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./history/HistoryManager.js */ "./src/js/history/HistoryManager.js");
/* harmony import */ var _ui_UIManager_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ui/UIManager.js */ "./src/js/ui/UIManager.js");
/* harmony import */ var _export_ExportManager_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./export/ExportManager.js */ "./src/js/export/ExportManager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * SenangWebs Kiln (SWK) - Main Entry Point
 * A lightweight 3D modeling editor library
 */



















/**
 * Main SWK Class
 */
var SWK = /*#__PURE__*/function (_EventEmitter) {
  function SWK(selector) {
    var _this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, SWK);
    _this = _callSuper(this, SWK);

    // Initialize from selector
    var _Initializer$fromAPI = _core_Initializer_js__WEBPACK_IMPORTED_MODULE_2__["default"].fromAPI(selector, options),
      container = _Initializer$fromAPI.container,
      config = _Initializer$fromAPI.config;

    // Set up configuration
    _this.config = new _core_Config_js__WEBPACK_IMPORTED_MODULE_0__["default"](_objectSpread({
      container: container
    }, config));
    _this.container = container;

    // Core modules
    _this.renderer = null;
    _this.sceneManager = null;
    _this.cameraManager = null;
    _this.lighting = null;
    _this.shapeFactory = null;

    // Selection modules
    _this.picker = null;
    _this.selectionManager = null;
    _this.outliner = null;

    // Transform modules
    _this.transformManager = null;
    _this.snapManager = null;

    // Grouping module
    _this.groupManager = null;

    // History module
    _this.historyManager = null;

    // UI module
    _this.uiManager = null;

    // Export module
    _this.exportManager = null;

    // Object management
    _this.objects = [];
    _this.selectedObject = null;
    _this.selectedObjects = [];
    _this.groups = [];

    // State
    _this.initialized = false;
    _this.animationId = null;

    // Initialize
    _this.init();
    return _this;
  }

  /**
   * Initialize the editor
   */
  _inherits(SWK, _EventEmitter);
  return _createClass(SWK, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      if (this.initialized) {
        console.warn('SWK: Already initialized');
        return;
      }
      try {
        // Ensure container has proper styling
        this.setupContainer();

        // Initialize core modules
        this.renderer = new _core_Renderer_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.container, this.config);
        this.sceneManager = new _core_Scene_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.config);
        this.cameraManager = new _core_Camera_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.container, this.config);
        this.lighting = new _core_Lighting_js__WEBPACK_IMPORTED_MODULE_6__["default"](this.sceneManager.getScene(), this.config);
        this.shapeFactory = new _shapes_ShapeFactory_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.config);

        // Initialize selection modules
        this.picker = new _selection_Picker_js__WEBPACK_IMPORTED_MODULE_8__["default"](this.cameraManager.getCamera(), this.renderer.getRenderer());
        this.selectionManager = new _selection_SelectionManager_js__WEBPACK_IMPORTED_MODULE_9__["default"](this);
        this.outliner = new _selection_Outliner_js__WEBPACK_IMPORTED_MODULE_10__["default"](this.sceneManager.getScene(), this.config);

        // Initialize transform modules
        this.transformManager = new _transform_TransformManager_js__WEBPACK_IMPORTED_MODULE_11__["default"](this.cameraManager.getCamera(), this.renderer.getCanvas(), this.sceneManager.getScene(), this.config, this);
        this.snapManager = new _transform_SnapManager_js__WEBPACK_IMPORTED_MODULE_12__["default"](this.transformManager.getControls(), this.config, this);

        // Initialize grouping module
        this.groupManager = new _grouping_GroupManager_js__WEBPACK_IMPORTED_MODULE_13__["default"](this.sceneManager.getScene(), this, this.config);

        // Initialize history module
        if (this.config.get('history.enabled')) {
          this.historyManager = new _history_HistoryManager_js__WEBPACK_IMPORTED_MODULE_14__["default"](this.sceneManager.getScene(), this.selectionManager, this.groupManager, this.shapeFactory, {
            get: function get(key) {
              if (key === 'maxHistory') {
                return _this2.config.get('history.maxSize');
              }
              return _this2.config.get(key);
            }
          }, this.transformManager // Pass transformManager for proper detach/attach during undo/redo
          );

          // Listen to history events
          this.historyManager.on('stateChanged', function (data) {
            _this2.emit('historyChanged', data);
          });
          this.historyManager.on('stateRestored', function (data) {
            _this2.emit('historyRestored', data);
            // Update outliner after restore
            _this2.updateSelectionOutlines();
          });
        }

        // Store transform controls reference for compatibility
        this.transformControls = this.transformManager.getControls();

        // Initialize UI module
        if (this.config.get('ui.enabled')) {
          this.uiManager = new _ui_UIManager_js__WEBPACK_IMPORTED_MODULE_15__["default"](this.container, this, this.config);
        }

        // Initialize export module
        if (this.config.get('features.export')) {
          this.exportManager = new _export_ExportManager_js__WEBPACK_IMPORTED_MODULE_16__["default"](this.sceneManager.getScene(), this, this.config);

          // Listen to export events
          this.exportManager.on('exportStart', function (data) {
            _this2.emit('exportStart', data);
          });
          this.exportManager.on('exportComplete', function (data) {
            _this2.emit('exportComplete', data);
          });
          this.exportManager.on('exportError', function (data) {
            _this2.emit('exportError', data);
          });
        }

        // Load fonts for text shapes
        this.shapeFactory.loadFonts(function () {
          console.log('SWK: All fonts loaded');
        });

        // Set up orbit controls
        this.setupControls();

        // Set up event listeners
        this.setupEventListeners();

        // Link orbit controls with transform dragging
        this.on('orbitControlsEnabled', function (enabled) {
          if (_this2.controls) {
            _this2.controls.enabled = enabled;
          }
        });

        // Start animation loop
        this.animate();
        this.initialized = true;
        this.emit('initialized');
        console.log('SWK: Editor initialized successfully');
      } catch (error) {
        console.error('SWK: Initialization failed:', error);
        throw error;
      }
    }

    /**
     * Setup container styling
     */
  }, {
    key: "setupContainer",
    value: function setupContainer() {
      this.container.style.position = 'relative';
      this.container.style.width = this.config.get('width');
      this.container.style.height = this.config.get('height');
      this.container.style.overflow = 'hidden';
    }

    /**
     * Setup orbit controls
     */
  }, {
    key: "setupControls",
    value: function setupControls() {
      var camera = this.cameraManager.getCamera();
      var canvas = this.renderer.getCanvas();
      this.controls = new THREE.OrbitControls(camera, canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 100;
      this.controls.maxPolarAngle = Math.PI / 2;

      // Link controls to camera manager
      this.cameraManager.setControls(this.controls);
    }

    /**
     * Setup event listeners
     */
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this3 = this;
      // Canvas click for object selection
      var canvas = this.renderer.getCanvas();
      canvas.addEventListener('click', this.onCanvasClick.bind(this));

      // Keyboard shortcuts
      window.addEventListener('keydown', this.onKeyDown.bind(this));

      // Transform events for history
      var isTransforming = false;
      this.on('transformDragging', function (dragging) {
        console.log('Transform dragging:', dragging);
        if (!dragging && isTransforming) {
          // Transform ended, capture state
          _this3.captureState('Transform object');
          isTransforming = false;
        } else if (dragging) {
          isTransforming = true;
        }
      });
    }

    /**
     * Handle canvas click
     */
  }, {
    key: "onCanvasClick",
    value: function onCanvasClick(event) {
      // Check if clicking on transform controls
      if (this.transformControls && this.transformControls.dragging) {
        return;
      }

      // Pick object at mouse position
      var canvas = this.renderer.getCanvas();
      var intersection = this.picker.pickFromEvent(event, canvas, this.objects, false);
      if (intersection) {
        // Object clicked
        var clickedObject = intersection.object;

        // Check for multi-select (Ctrl key)
        if (event.ctrlKey || event.metaKey) {
          // Multi-select mode
          this.selectionManager.toggle(clickedObject);
        } else {
          // Single select mode
          this.selectionManager.select(clickedObject);
        }

        // Update transform controls
        if (this.selectionManager.getSelectionCount() === 1) {
          this.transformControls.attach(clickedObject);
        } else {
          this.transformControls.detach();
        }

        // Update outlines
        this.updateSelectionOutlines();
      } else {
        // Empty space clicked - deselect
        this.deselectAll();
      }

      // Emit click event
      this.emit('canvasClick', {
        mouse: this.picker.getMousePosition(),
        event: event,
        intersection: intersection
      });
    }

    /**
     * Handle keyboard shortcuts
     */
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      var _this4 = this;
      // Undo/Redo shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === 'z') {
          if (event.shiftKey) {
            // Ctrl+Shift+Z = Redo
            this.redo();
          } else {
            // Ctrl+Z = Undo
            this.undo();
          }
          event.preventDefault();
          return;
        } else if (event.key.toLowerCase() === 'y') {
          // Ctrl+Y = Redo
          this.redo();
          event.preventDefault();
          return;
        }
      }

      // Transform mode shortcuts (T, R, S)
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key.toLowerCase()) {
          case 't':
            this.setTransformMode('translate');
            event.preventDefault();
            break;
          case 'r':
            this.setTransformMode('rotate');
            event.preventDefault();
            break;
          case 's':
            this.setTransformMode('scale');
            event.preventDefault();
            break;
          case 'delete':
          case 'backspace':
            // Delete selected objects
            var selected = this.selectionManager.getSelectedObjects();
            selected.forEach(function (obj) {
              return _this4.deleteObject(obj);
            });
            event.preventDefault();
            break;
        }
      }

      // Emit keydown event
      this.emit('keydown', event);
    }

    /**
     * Animation loop
     */
  }, {
    key: "animate",
    value: function animate() {
      this.animationId = requestAnimationFrame(this.animate.bind(this));

      // Update controls
      if (this.controls) {
        this.controls.update();
      }

      // Sync outlines with mesh transforms
      if (this.outliner) {
        this.outliner.syncOutlines();
      }

      // Render scene
      var scene = this.sceneManager.getScene();
      var camera = this.cameraManager.getCamera();
      this.renderer.render(scene, camera);

      // Emit render event
      this.emit('render');
    }

    /**
     * Get scene
     */
  }, {
    key: "getScene",
    value: function getScene() {
      return this.sceneManager ? this.sceneManager.getScene() : null;
    }

    /**
     * Get renderer
     */
  }, {
    key: "getRenderer",
    value: function getRenderer() {
      return this.renderer ? this.renderer.getRenderer() : null;
    }

    /**
     * Get camera
     */
  }, {
    key: "getCamera",
    value: function getCamera() {
      return this.cameraManager ? this.cameraManager.getCamera() : null;
    }

    /**
     * Set camera mode
     */
  }, {
    key: "setCameraMode",
    value: function setCameraMode(mode) {
      if (this.cameraManager) {
        this.cameraManager.setMode(mode);
        if (this.transformManager) {
          this.transformManager.setCamera(this.cameraManager.getCamera());
        }
        if (this.picker) {
          this.picker.setCamera(this.cameraManager.getCamera());
        }
        this.emit('cameraModeChanged', mode);
      }
    }

    /**
     * Get camera mode
     */
  }, {
    key: "getCameraMode",
    value: function getCameraMode() {
      return this.cameraManager ? this.cameraManager.getMode() : null;
    }

    /**
     * Set background color
     */
  }, {
    key: "setBackground",
    value: function setBackground(color) {
      if (this.renderer) {
        this.renderer.setBackgroundColor(color);
        this.emit('backgroundChanged', color);
      }
    }

    /**
     * Reset camera
     */
  }, {
    key: "resetCamera",
    value: function resetCamera() {
      if (this.cameraManager) {
        this.cameraManager.reset();
        this.emit('cameraReset');
      }
    }

    /**
     * Add shape to scene
     */
  }, {
    key: "addShape",
    value: function addShape(type) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var mesh = this.shapeFactory.createShape(type, options);
      if (!mesh) {
        console.warn("SWK: Failed to create shape: ".concat(type));
        return null;
      }

      // Add to scene
      this.sceneManager.add(mesh);
      this.objects.push(mesh);

      // Emit event
      this.emit('objectAdded', mesh);

      // Execute callback
      var callback = this.config.get('callbacks.onObjectAdded');
      if (callback && typeof callback === 'function') {
        callback(mesh);
      }

      // Capture state for undo
      this.captureState("Add ".concat(mesh.name));
      console.log("SWK: Added ".concat(mesh.name));
      return mesh;
    }

    /**
     * Delete object from scene
     */
  }, {
    key: "deleteObject",
    value: function deleteObject(mesh) {
      if (!mesh) return false;

      // Remove from scene
      this.sceneManager.remove(mesh);

      // Remove from objects array
      var index = this.objects.indexOf(mesh);
      if (index > -1) {
        this.objects.splice(index, 1);
      }

      // Deselect if selected
      if (this.selectedObject === mesh) {
        this.deselectAll();
      }

      // Remove from multi-selection
      var multiIndex = this.selectedObjects.indexOf(mesh);
      if (multiIndex > -1) {
        this.selectedObjects.splice(multiIndex, 1);
      }

      // Dispose geometry and material
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(function (m) {
            return m.dispose();
          });
        } else {
          mesh.material.dispose();
        }
      }

      // Emit event
      this.emit('objectRemoved', mesh);

      // Execute callback
      var callback = this.config.get('callbacks.onObjectRemoved');
      if (callback && typeof callback === 'function') {
        callback(mesh);
      }

      // Capture state for undo
      this.captureState("Delete ".concat(mesh.name));
      return true;
    }

    /**
     * Duplicate object
     */
  }, {
    key: "duplicateObject",
    value: function duplicateObject(mesh) {
      if (!mesh) return null;
      var shapeType = mesh.userData.shapeType;
      var options = {
        color: mesh.userData.color
      };

      // Copy text options if it's a text shape
      if (shapeType === 'text') {
        options.text = mesh.userData.textContent;
        options.font = mesh.userData.textFont;
        options.height = mesh.userData.textHeight;
        options.bevel = mesh.userData.textBevel;
      }
      var duplicate = this.shapeFactory.createShape(shapeType, options);
      if (!duplicate) return null;

      // Copy transform
      duplicate.position.copy(mesh.position);
      duplicate.position.x += 0.5; // Offset slightly
      duplicate.rotation.copy(mesh.rotation);
      duplicate.scale.copy(mesh.scale);

      // Add to scene
      this.sceneManager.add(duplicate);
      this.objects.push(duplicate);

      // Emit event
      this.emit('objectAdded', duplicate);

      // Capture state for undo
      this.captureState("Duplicate ".concat(mesh.name));
      return duplicate;
    }

    /**
     * Get all objects from the scene (including those in groups)
     */
  }, {
    key: "getAllObjects",
    value: function getAllObjects() {
      var _this5 = this;
      // Get all user objects from scene
      var scene = this.sceneManager.getScene();
      var allObjects = [];
      scene.children.forEach(function (obj) {
        if (obj.userData && obj.userData.isUserObject) {
          if (_this5.groupManager.isGroupContainer(obj)) {
            // This is a group - get its children
            var children = _this5.groupManager.getGroupChildren(obj);
            allObjects.push.apply(allObjects, _toConsumableArray(children));
          } else {
            // Regular object
            allObjects.push(obj);
          }
        }
      });
      return allObjects;
    }

    /**
     * Select object
     */
  }, {
    key: "selectObject",
    value: function selectObject(mesh) {
      if (!mesh) return;
      this.selectionManager.select(mesh);
      this.updateSelectionOutlines();

      // Attach transform controls
      if (this.transformControls) {
        this.transformControls.attach(mesh);
      }
    }

    /**
     * Deselect all
     */
  }, {
    key: "deselectAll",
    value: function deselectAll() {
      this.selectionManager.clear();
      this.updateSelectionOutlines();

      // Detach transform controls
      if (this.transformControls) {
        this.transformControls.detach();
      }
    }

    /**
     * Update outlines based on selection
     */
  }, {
    key: "updateSelectionOutlines",
    value: function updateSelectionOutlines() {
      // Clear all outlines
      this.outliner.clearAllOutlines();

      // Create outlines for selected objects
      var selected = this.selectionManager.getSelectedObjects();
      if (selected.length > 0) {
        this.outliner.createOutlines(selected);
      }

      // Update internal references for compatibility
      this.selectedObjects = selected;
      this.selectedObject = this.selectionManager.getSelectedObject();

      // Execute callback
      var callback = this.config.get('callbacks.onSelectionChanged');
      if (callback && typeof callback === 'function') {
        callback(selected, []);
      }
    }

    /**
     * Get selected objects
     */
  }, {
    key: "getSelectedObjects",
    value: function getSelectedObjects() {
      return _toConsumableArray(this.selectedObjects);
    }

    /**
     * Get first selected object
     */
  }, {
    key: "getSelectedObject",
    value: function getSelectedObject() {
      return this.selectedObject;
    }

    /**
     * Set transform mode
     */
  }, {
    key: "setTransformMode",
    value: function setTransformMode(mode) {
      if (this.transformManager) {
        this.transformManager.setMode(mode);
      }
    }

    /**
     * Get transform mode
     */
  }, {
    key: "getTransformMode",
    value: function getTransformMode() {
      return this.transformManager ? this.transformManager.getMode() : null;
    }

    /**
     * Set transform space
     */
  }, {
    key: "setTransformSpace",
    value: function setTransformSpace(space) {
      if (this.transformManager) {
        this.transformManager.setSpace(space);
      }
    }

    /**
     * Get transform space
     */
  }, {
    key: "getTransformSpace",
    value: function getTransformSpace() {
      return this.transformManager ? this.transformManager.getSpace() : null;
    }

    /**
     * Set snap unit
     */
  }, {
    key: "setSnapUnit",
    value: function setSnapUnit(value) {
      if (this.snapManager) {
        this.snapManager.setSnapUnit(value);
      }
    }

    /**
     * Get snap unit
     */
  }, {
    key: "getSnapUnit",
    value: function getSnapUnit() {
      return this.snapManager ? this.snapManager.getSnapUnit() : 0;
    }

    /**
     * Toggle snap
     */
  }, {
    key: "toggleSnap",
    value: function toggleSnap() {
      if (this.snapManager) {
        this.snapManager.toggleSnap();
      }
    }

    /**
     * Group selected objects
     */
  }, {
    key: "groupSelected",
    value: function groupSelected() {
      if (!this.groupManager) return null;
      var selected = this.selectionManager.getSelectedObjects();
      if (selected.length < 1) {
        console.warn('SWK: No objects selected for grouping');
        return null;
      }

      // Remove outlines from objects being grouped
      this.outliner.removeOutlines(selected);

      // Create group
      var groupContainer = this.groupManager.createGroup(selected);
      if (groupContainer) {
        // Deselect all and select the group
        this.deselectAll();
        this.selectObject(groupContainer);

        // Update internal groups reference
        this.groups = this.groupManager.getAllGroups();

        // Capture state for undo
        this.captureState("Create group ".concat(groupContainer.name));
      }
      return groupContainer;
    }

    /**
     * Ungroup selected group
     */
  }, {
    key: "ungroupSelected",
    value: function ungroupSelected() {
      if (!this.groupManager) return null;
      var selected = this.selectionManager.getSelectedObject();
      if (!selected || !this.groupManager.isGroupContainer(selected)) {
        console.warn('SWK: Selected object is not a group');
        return null;
      }

      // Ungroup
      var ungroupedObjects = this.groupManager.ungroup(selected);
      if (ungroupedObjects && ungroupedObjects.length > 0) {
        // Deselect all
        this.deselectAll();

        // Update internal groups reference
        this.groups = this.groupManager.getAllGroups();

        // Capture state for undo
        this.captureState("Ungroup ".concat(selected.name));
      }
      return ungroupedObjects;
    }

    /**
     * Check if object is grouped
     */
  }, {
    key: "isGrouped",
    value: function isGrouped(object) {
      return this.groupManager ? this.groupManager.isGrouped(object) : false;
    }

    /**
     * Check if object is a group container
     */
  }, {
    key: "isGroupContainer",
    value: function isGroupContainer(object) {
      return this.groupManager ? this.groupManager.isGroupContainer(object) : false;
    }

    /**
     * Get all groups
     */
  }, {
    key: "getAllGroups",
    value: function getAllGroups() {
      return this.groupManager ? this.groupManager.getAllGroups() : [];
    }

    /**
     * Get group children
     */
  }, {
    key: "getGroupChildren",
    value: function getGroupChildren(groupContainer) {
      return this.groupManager ? this.groupManager.getGroupChildren(groupContainer) : [];
    }

    // ==================== History Methods ====================

    /**
     * Capture current state to history
     * @param {string} description - Description of the action
     */
  }, {
    key: "captureState",
    value: function captureState() {
      var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Action';
      if (this.historyManager) {
        return this.historyManager.captureState(description);
      }
      return false;
    }

    /**
     * Undo the last action
     * @returns {boolean} Success
     */
  }, {
    key: "undo",
    value: function undo() {
      if (this.historyManager) {
        var success = this.historyManager.undo();
        if (success) {
          // Refresh objects list
          this.objects = this.getAllObjects();
          this.groups = this.getAllGroups();
        }
        return success;
      }
      return false;
    }

    /**
     * Redo the last undone action
     * @returns {boolean} Success
     */
  }, {
    key: "redo",
    value: function redo() {
      if (this.historyManager) {
        var success = this.historyManager.redo();
        if (success) {
          // Refresh objects list
          this.objects = this.getAllObjects();
          this.groups = this.getAllGroups();
        }
        return success;
      }
      return false;
    }

    /**
     * Check if undo is available
     * @returns {boolean}
     */
  }, {
    key: "canUndo",
    value: function canUndo() {
      return this.historyManager ? this.historyManager.canUndo() : false;
    }

    /**
     * Check if redo is available
     * @returns {boolean}
     */
  }, {
    key: "canRedo",
    value: function canRedo() {
      return this.historyManager ? this.historyManager.canRedo() : false;
    }

    /**
     * Get history statistics
     * @returns {Object}
     */
  }, {
    key: "getHistoryStats",
    value: function getHistoryStats() {
      return this.historyManager ? this.historyManager.getStats() : null;
    }

    /**
     * Clear history
     */
  }, {
    key: "clearHistory",
    value: function clearHistory() {
      if (this.historyManager) {
        this.historyManager.clear();
      }
    }

    // ==================== Export Methods ====================

    /**
     * Export scene as GLTF
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
  }, {
    key: "exportGLTF",
    value: function () {
      var _exportGLTF = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var options,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              if (this.exportManager) {
                _context.n = 1;
                break;
              }
              console.warn('Export manager not initialized');
              return _context.a(2, false);
            case 1:
              _context.n = 2;
              return this.exportManager.exportGLTF(_objectSpread(_objectSpread({}, options), {}, {
                binary: false
              }));
            case 2:
              return _context.a(2, _context.v);
          }
        }, _callee, this);
      }));
      function exportGLTF() {
        return _exportGLTF.apply(this, arguments);
      }
      return exportGLTF;
    }()
    /**
     * Export scene as GLB (binary GLTF)
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
  }, {
    key: "exportGLB",
    value: (function () {
      var _exportGLB = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var options,
          _args2 = arguments;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              if (this.exportManager) {
                _context2.n = 1;
                break;
              }
              console.warn('Export manager not initialized');
              return _context2.a(2, false);
            case 1:
              _context2.n = 2;
              return this.exportManager.exportGLTF(_objectSpread(_objectSpread({}, options), {}, {
                binary: true
              }));
            case 2:
              return _context2.a(2, _context2.v);
          }
        }, _callee2, this);
      }));
      function exportGLB() {
        return _exportGLB.apply(this, arguments);
      }
      return exportGLB;
    }()
    /**
     * Export scene as STL
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
    )
  }, {
    key: "exportSTL",
    value: (function () {
      var _exportSTL = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var options,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              if (this.exportManager) {
                _context3.n = 1;
                break;
              }
              console.warn('Export manager not initialized');
              return _context3.a(2, false);
            case 1:
              _context3.n = 2;
              return this.exportManager.exportSTL(options);
            case 2:
              return _context3.a(2, _context3.v);
          }
        }, _callee3, this);
      }));
      function exportSTL() {
        return _exportSTL.apply(this, arguments);
      }
      return exportSTL;
    }()
    /**
     * Export selected objects only
     * @param {string} format - Export format ('gltf', 'glb', or 'stl')
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
    )
  }, {
    key: "exportSelected",
    value: (function () {
      var _exportSelected = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var format,
          options,
          _args4 = arguments;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              format = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 'gltf';
              options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
              if (this.exportManager) {
                _context4.n = 1;
                break;
              }
              console.warn('Export manager not initialized');
              return _context4.a(2, false);
            case 1:
              _context4.n = 2;
              return this.exportManager.exportSelected(format, options);
            case 2:
              return _context4.a(2, _context4.v);
          }
        }, _callee4, this);
      }));
      function exportSelected() {
        return _exportSelected.apply(this, arguments);
      }
      return exportSelected;
    }()
    /**
     * Get available export formats
     * @returns {Array<Object>}
     */
    )
  }, {
    key: "getAvailableExportFormats",
    value: function getAvailableExportFormats() {
      if (!this.exportManager) {
        return [];
      }
      return this.exportManager.getAvailableFormats();
    }

    // ==================== Lifecycle Methods ====================

    /**
     * Destroy instance and cleanup
     */
  }, {
    key: "destroy",
    value: function destroy() {
      // Stop animation
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      // Remove event listeners
      var canvas = this.renderer ? this.renderer.getCanvas() : null;
      if (canvas) {
        canvas.removeEventListener('click', this.onCanvasClick.bind(this));
      }
      window.removeEventListener('keydown', this.onKeyDown.bind(this));

      // Dispose modules
      if (this.uiManager) this.uiManager.destroy();
      if (this.exportManager) this.exportManager.dispose();
      if (this.groupManager) this.groupManager.clearAllGroups();
      if (this.historyManager) this.historyManager.dispose();
      if (this.transformManager) this.transformManager.dispose();
      if (this.outliner) this.outliner.dispose();
      if (this.lighting) this.lighting.dispose();
      if (this.cameraManager) this.cameraManager.dispose();
      if (this.sceneManager) this.sceneManager.dispose();
      if (this.renderer) this.renderer.dispose();

      // Clear references
      this.renderer = null;
      this.sceneManager = null;
      this.cameraManager = null;
      this.lighting = null;
      this.shapeFactory = null;
      this.picker = null;
      this.selectionManager = null;
      this.outliner = null;
      this.transformManager = null;
      this.snapManager = null;
      this.groupManager = null;
      this.historyManager = null;
      this.uiManager = null;
      this.exportManager = null;
      this.controls = null;
      this.transformControls = null;
      this.objects = [];
      this.selectedObjects = [];
      this.selectedObject = null;
      this.groups = [];

      // Remove all event listeners
      this.removeAllListeners();
      this.initialized = false;
      console.log('SWK: Editor destroyed');
    }
  }]);
}(_core_EventEmitter_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/**
 * Auto-initialize on DOM ready
 */
if (typeof window !== 'undefined') {
  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      SWK.autoInit = function () {
        return _core_Initializer_js__WEBPACK_IMPORTED_MODULE_2__["default"].autoInit(SWK);
      };
      // Don't auto-init automatically, let user call SWK.autoInit() if needed
    });
  } else {
    SWK.autoInit = function () {
      return _core_Initializer_js__WEBPACK_IMPORTED_MODULE_2__["default"].autoInit(SWK);
    };
  }
}

// Export for ES6 modules and UMD
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SWK);

// For UMD/browser global
if (typeof window !== 'undefined') {
  window.SWK = SWK;
}
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=swk.js.map