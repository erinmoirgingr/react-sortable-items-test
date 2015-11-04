var Sortable =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1);
	var Update = __webpack_require__(2);
	var cx = __webpack_require__(8);

	module.exports = React.createClass({
	  displayName: 'Sortable',
	  propTypes: {
	    onSort: React.PropTypes.func,
	    horizontal: React.PropTypes.bool,
	    sensitivity: function(props, propName, componentName) {
	      if (isNaN(parseFloat(props[propName])) && !isFinite(props[propName]) || props[propName] < 0 || props[propName] > 1) {
	        return new Error('sensitivity must be a number from 0 to 1.');
	      }
	    }.bind(this),
	    /**
	      If a sortable item has isDraggable set to false, prevent sorting below the item.
	      This is most useful if items are pinned at the bottom until validated.
	      Note that anything below an undraggable element can be moved above it.
	      This option takes precedence over floatUndraggables if both are set to true.
	    */
	    sinkUndraggables: React.PropTypes.bool,
	    /**
	      See sinkUndraggables. This won't allow sorting above undraggable items.
	      This defers to sinkUndraggables if both are set to true.
	    */
	    floatUndraggables: React.PropTypes.bool,
	    minDragDistance: React.PropTypes.number
	  },
	  getDefaultProps: function() {
	    return {
	      onSort: function() {},
	      horizontal: false,
	      sinkUndraggables: false,
	      sensitivity: 0,
	      minDragDistance: 0
	    }
	  },
	  getInitialState: function() {
	    this.rerender(this.props.children);

	    return {
	      isDragging: false,
	      placeHolderIndex: null,
	      left: null,
	      top: null
	    };
	  },
	  componentWillReceiveProps: function (nextProps) {
	    if (this.props.children !== nextProps.children) {
	      this.rerender(nextProps.children);
	    }
	  },
	  rerender: function(children) {
	    this._firstDraggable = 0;
	    this._lastDraggable = React.Children.count(children) - 1;
	    var lastDraggableSet = false;
	    this._orderArr = [];
	    this._dimensionArr = children.map(function(item, idx) {
	      if (this.props.sinkUndraggables && !item.props.isDraggable && idx <= this._lastDraggable && !lastDraggableSet) {
	        this._lastDraggable = idx - 1;
	        lastDraggableSet = true;
	      } else if (this.props.floatUndraggables && !item.props.isDraggable && idx >= this._firstDraggable) {
	        this._firstDraggable = idx + 1;
	      }
	      this._orderArr.push(idx);
	      return {}
	    }.bind(this));
	  },
	  componentDidMount: function(){
	    this._dragDimensions = null;
	  },
	  componentWillUnmount: function() {
	    this.unbindEvent();
	  },
	  bindEvent: function(){
	    document.addEventListener('mousemove', this.handleMouseMove);
	    document.addEventListener('mouseup', this.handleMouseUp);
	  },
	  unbindEvent: function(){
	    document.removeEventListener('mousemove', this.handleMouseMove);
	    document.removeEventListener('mouseup', this.handleMouseUp);
	  },
	  handleMouseDown: function(e, index){
	    this.containerWidth = this.getDOMNode().offsetWidth;
	    this.containerHeight = this.getDOMNode().offsetHeight;
	    this._draggingIndex = index;
	    this._prevX = e.pageX;
	    this._prevY = e.pageY;
	    this._initOffset = e.offset;
	    this.bindEvent();
	  },
	  handleMouseMove: function(e){
	    var newOffset = this.calculateNewOffset(e);
	    var newIndex = this.calculateNewIndex(e);

	    var newState = {
	      isDragging: true,
	      top: newOffset.top,
	      left: newOffset.left
	    };
	    var deltaX = newOffset.left - this._initOffset.left;
	    var deltaY = newOffset.top - this._initOffset.top;
	    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
	    if(distance > this.props.minDragDistance) {
	        if (newIndex !== -1) {
	          this._draggingIndex = newIndex;
	          newState['placeHolderIndex'] = newIndex;
	        }

	        this.setState(newState);

	        this._prevX = e.pageX;
	        this._prevY = e.pageY;
	    }

	  },
	  handleMouseUp: function(e){
	    this.unbindEvent();

	    //reset temp vars
	    this._draggingIndex = null;
	    this._initOffset = null;
	    this._prevX = null;
	    this._prevY = null;
	    this._dragDimensions = null;

	    if (this.state.isDragging) {
	        this.props.onSort(this.getSortData());
	    }

	    this.isMounted() && this.setState({
	      isDragging: false,
	      placeHolderIndex: null,
	      left: null,
	      top: null
	    });
	  },

	  handleChildUpdate: function(offset, width, height, index){
	    this._dimensionArr[index] = Update(this._dimensionArr[index], {
	      top: { $set: offset.top },
	      left: { $set: offset.left },
	      width: { $set: width },
	      height: { $set: height }
	    });
	  },

	  getIndexByOffset: function(offset, direction){
	    if (!offset || !this.isNumeric(offset.top) || !this.isNumeric(offset.left)) {
	      return -1;
	    }

	    var offsetX = offset.left;
	    var offsetY = offset.top;
	    var prevIndex = this.state.placeHolderIndex !== null ?
	      this.state.placeHolderIndex :
	      this._draggingIndex;
	    var newIndex;

	    if (this.props.horizontal) {
	      newIndex = this.getHorizontalIndexOffset(offsetX, offsetY, direction);
	    } else {
	      newIndex = this.getVerticalIndexOffset(offsetX, offsetY, direction);
	    }

	    return newIndex !== undefined ? newIndex : prevIndex;
	  },
	  getVerticalIndexOffset: function(offsetX, offsetY, direction) {
	    var newIndex;
	    var lastDimens = this._dimensionArr[this._dimensionArr.length - 1];
	    var buffer = 1 - this.props.sensitivity;
	    this._dimensionArr.every(function(coord, index) {
	      var relativeLeft = offsetX - coord.left;
	      var relativeTop = offsetY - coord.top;
	      if (offsetY < 0) {
	        newIndex = 0;
	        return false;
	      } else if (offsetY > this.containerHeight || offsetY > (lastDimens.top + lastDimens.height)) {
	        newIndex = this._dimensionArr.length - 1;
	        return false;
	      } else if (relativeTop < coord.height && relativeLeft < coord.width) {
	        if (relativeTop < ((coord.height / 2) - ((coord.height / 4) * buffer)) && direction === 'up') {
	          newIndex = index;
	        } else if (relativeTop > ((coord.height / 2) + ((coord.height / 4) * buffer)) && direction === 'down') {
	          newIndex = Math.min(index + 1, this._dimensionArr.length - 1);
	        }
	        return false;
	      }
	      return true;
	    }.bind(this));

	    return newIndex;
	  },
	  getHorizontalIndexOffset: function(offsetX, offsetY, direction) {
	    var newIndex;
	    var lastDimens = this._dimensionArr[this._dimensionArr.length - 1];
	    var buffer = 1 - this.props.sensitivity;
	    this._dimensionArr.every(function(coord, index) {
	      var relativeLeft = offsetX - coord.left;
	      var relativeTop = offsetY - coord.top;
	      if (offsetX < 0) {
	        newIndex = 0;
	        return false;
	      } else if (offsetX > this.containerWidth || offsetX > (lastDimens.left + lastDimens.width)) {
	        newIndex = this._dimensionArr.length - 1;
	        return false;
	      } else if (relativeLeft < coord.width) {
	        if (relativeLeft < ((coord.width / 2) - ((coord.width / 4) * buffer)) && direction === 'left') {
	          newIndex = index;
	        } else if (relativeLeft > ((coord.width / 2) + ((coord.width / 4) * buffer)) && direction === 'right') {
	          newIndex = Math.min(index + 1, this._dimensionArr.length - 1);
	        }
	        return false;
	      }
	      return true;
	    }.bind(this));
	    return newIndex;
	  },
	  isNumeric: function(val) {
	    return !isNaN(parseFloat(val)) && isFinite(val);
	  },

	  swapArrayItemPosition: function(arr, from, to){
	    if (!arr || !this.isNumeric(from) || !this.isNumeric(to)) {
	      return arr;
	    }

	    var fromEl = arr.splice(from, 1)[0];
	    arr.splice(to, 0, fromEl);
	    return arr;
	  },
	  calculateNewOffset: function(e){
	    var deltaX = this._prevX - e.pageX;
	    var deltaY = this._prevY - e.pageY;

	    var prevLeft = this.state.left !== null ? this.state.left : this._initOffset.left;
	    var prevTop = this.state.top !== null ? this.state.top : this._initOffset.top;
	    var newLeft = prevLeft - deltaX;
	    var newTop = prevTop - deltaY;

	    return {
	      left: newLeft,
	      top: newTop
	    };
	  },
	  getPosition: function() {
	    return {
	      left: this.getDOMNode().offsetLeft,
	      top: this.getDOMNode().offsetTop
	    }
	  },
	  closest: function(element, f) {
	    return element && (f(element) ? element : this.closest(element.parentNode, f));
	  },
	  calculateNewIndex: function(e){
	    var placeHolderIndex = this.state.placeHolderIndex !== null ?
	      this.state.placeHolderIndex :
	      this._draggingIndex;
	    var dragElement = this.closest(e.target, function(element) {
	      if (typeof element === 'undefined' || typeof element.classList === 'undefined') return false;
	      return element.classList.contains('SortableItem');
	    });

	    var offset;
	    if (dragElement) {
	      offset = { left: dragElement.offsetLeft, top: dragElement.offsetTop };
	    }

	    var direction = '';

	    if (this.props.horizontal) {
	      direction = this._prevX > e.pageX ? 'left' : 'right';
	    } else {
	      direction = this._prevY > e.pageY ? 'up' : 'down';
	    }

	    var newIndex = this.getIndexByOffset(offset, direction);
	    if (newIndex !== -1 && newIndex < this._firstDraggable) {
	      newIndex = this._firstDraggable;
	      if (this._draggingIndex < this._firstDraggable) {
	        newIndex = this._firstDraggable - 1;
	        this._firstDraggable -= 1;
	      }
	    } else if (newIndex !== -1 && newIndex > this._lastDraggable) {
	      newIndex = this._lastDraggable;
	      if (this._draggingIndex > this._lastDraggable) {
	        newIndex = this._lastDraggable + 1;
	        this._lastDraggable += 1;
	      }
	    }

	    if (newIndex !== -1 && newIndex !== placeHolderIndex) {
	      this._dimensionArr = this.swapArrayItemPosition(this._dimensionArr, placeHolderIndex, newIndex);
	      this._orderArr = this.swapArrayItemPosition(this._orderArr, placeHolderIndex, newIndex);
	    }

	    return newIndex;
	  },
	  getSortData: function() {
	    return this._orderArr.map(function(itemIndex){
	      return this.props.children[itemIndex].props.sortData;
	    }.bind(this));
	  },
	  renderItems: function() {
	    var draggingItem = [];
	    var childrenCount = React.Children.count(this.props.children);

	    var items = this._orderArr.map(function(itemIndex, index) {
	      var item = this.props.children[itemIndex];
	      if (index === this._draggingIndex && item.props.isDraggable) {
	        if (this._dragDimensions === null) {
	          this._dragDimensions = {
	            width: this._dimensionArr[this._draggingIndex].width,
	            height: this._dimensionArr[this._draggingIndex].height
	          };
	        }
	        draggingItem.push(this.renderDraggingItem(item));
	      }
	      return React.cloneElement(item, {
	        key: index,
	        _isPlaceholder: index === this.state.placeHolderIndex,
	        sortableIndex: index,
	        onSortableItemMouseDown: function(e) {
	          this.handleMouseDown(e, index);
	        }.bind(this),
	        onSortableItemMount: this.handleChildUpdate
	      });
	    }.bind(this));

	    return items.concat(draggingItem);
	  },
	  renderDraggingItem: function(item) {
	    var style = {
	      top: this.state.top,
	      left: this.state.left,
	      width: this._dragDimensions.width,
	      height: this._dragDimensions.height
	    };
	    return React.cloneElement(item, {
	      key: this._dimensionArr.length,
	      sortableStyle: style,
	      _isDragging: true
	    });
	  },
	  render: function(){
	    return (
	      React.createElement("div", {className: "Sortable", ref: "movable"}, 
	        this.renderItems()
	      )
	    );
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule update
	 */

	/* global hasOwnProperty:true */

	'use strict';

	var assign = __webpack_require__(5);
	var keyOf = __webpack_require__(6);
	var invariant = __webpack_require__(7);
	var hasOwnProperty = ({}).hasOwnProperty;

	function shallowCopy(x) {
	  if (Array.isArray(x)) {
	    return x.concat();
	  } else if (x && typeof x === 'object') {
	    return assign(new x.constructor(), x);
	  } else {
	    return x;
	  }
	}

	var COMMAND_PUSH = keyOf({ $push: null });
	var COMMAND_UNSHIFT = keyOf({ $unshift: null });
	var COMMAND_SPLICE = keyOf({ $splice: null });
	var COMMAND_SET = keyOf({ $set: null });
	var COMMAND_MERGE = keyOf({ $merge: null });
	var COMMAND_APPLY = keyOf({ $apply: null });

	var ALL_COMMANDS_LIST = [COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_SPLICE, COMMAND_SET, COMMAND_MERGE, COMMAND_APPLY];

	var ALL_COMMANDS_SET = {};

	ALL_COMMANDS_LIST.forEach(function (command) {
	  ALL_COMMANDS_SET[command] = true;
	});

	function invariantArrayCase(value, spec, command) {
	  !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected target of %s to be an array; got %s.', command, value) : invariant(false) : undefined;
	  var specValue = spec[command];
	  !Array.isArray(specValue) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array; got %s. ' + 'Did you forget to wrap your parameter in an array?', command, specValue) : invariant(false) : undefined;
	}

	function update(value, spec) {
	  !(typeof spec === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): You provided a key path to update() that did not contain one ' + 'of %s. Did you forget to include {%s: ...}?', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : invariant(false) : undefined;

	  if (hasOwnProperty.call(spec, COMMAND_SET)) {
	    !(Object.keys(spec).length === 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot have more than one key in an object with %s', COMMAND_SET) : invariant(false) : undefined;

	    return spec[COMMAND_SET];
	  }

	  var nextValue = shallowCopy(value);

	  if (hasOwnProperty.call(spec, COMMAND_MERGE)) {
	    var mergeObj = spec[COMMAND_MERGE];
	    !(mergeObj && typeof mergeObj === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a spec of type \'object\'; got %s', COMMAND_MERGE, mergeObj) : invariant(false) : undefined;
	    !(nextValue && typeof nextValue === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a target of type \'object\'; got %s', COMMAND_MERGE, nextValue) : invariant(false) : undefined;
	    assign(nextValue, spec[COMMAND_MERGE]);
	  }

	  if (hasOwnProperty.call(spec, COMMAND_PUSH)) {
	    invariantArrayCase(value, spec, COMMAND_PUSH);
	    spec[COMMAND_PUSH].forEach(function (item) {
	      nextValue.push(item);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_UNSHIFT)) {
	    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
	    spec[COMMAND_UNSHIFT].forEach(function (item) {
	      nextValue.unshift(item);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_SPLICE)) {
	    !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s target to be an array; got %s', COMMAND_SPLICE, value) : invariant(false) : undefined;
	    !Array.isArray(spec[COMMAND_SPLICE]) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : invariant(false) : undefined;
	    spec[COMMAND_SPLICE].forEach(function (args) {
	      !Array.isArray(args) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : invariant(false) : undefined;
	      nextValue.splice.apply(nextValue, args);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_APPLY)) {
	    !(typeof spec[COMMAND_APPLY] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be a function; got %s.', COMMAND_APPLY, spec[COMMAND_APPLY]) : invariant(false) : undefined;
	    nextValue = spec[COMMAND_APPLY](nextValue);
	  }

	  for (var k in spec) {
	    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
	      nextValue[k] = update(value[k], spec[k]);
	    }
	  }

	  return nextValue;
	}

	module.exports = update;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Object.assign
	 */

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

	'use strict';

	function assign(target, sources) {
	  if (target == null) {
	    throw new TypeError('Object.assign target cannot be null or undefined');
	  }

	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }

	    var from = Object(nextSource);

	    // We don't currently support accessors nor proxies. Therefore this
	    // copy cannot throw. If we ever supported this then we must handle
	    // exceptions and side-effects. We don't support symbols so they won't
	    // be transferred.

	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }

	  return to;
	}

	module.exports = assign;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule keyOf
	 */

	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without losing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	"use strict";

	var keyOf = function (oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};

	module.exports = keyOf;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function (condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/

	function classNames() {
		var classes = '';
		var arg;

		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}

			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}

	// safely export classNames for node / browserify
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}

	// safely export classNames for RequireJS
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}


/***/ }
/******/ ]);