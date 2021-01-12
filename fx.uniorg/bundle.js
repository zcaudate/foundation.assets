'use strict';

var bail_1 = bail;

function bail(err) {
  if (err) {
    throw err
  }
}

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

var extend = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

var isPlainObj = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};

var slice = [].slice;

var wrap_1 = wrap;

// Wrap `fn`.
// Can be sync or async; return a promise, receive a completion handler, return
// new values and errors.
function wrap(fn, callback) {
  var invoked;

  return wrapped

  function wrapped() {
    var params = slice.call(arguments, 0);
    var callback = fn.length > params.length;
    var result;

    if (callback) {
      params.push(done);
    }

    try {
      result = fn.apply(null, params);
    } catch (error) {
      // Well, this is quite the pickle.
      // `fn` received a callback and invoked it (thus continuing the pipeline),
      // but later also threw an error.
      // We’re not about to restart the pipeline again, so the only thing left
      // to do is to throw the thing instead.
      if (callback && invoked) {
        throw error
      }

      return done(error)
    }

    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }

  // Invoke `next`, only once.
  function done() {
    if (!invoked) {
      invoked = true;

      callback.apply(null, arguments);
    }
  }

  // Invoke `done` with one value.
  // Tracks if an error is passed, too.
  function then(value) {
    done(null, value);
  }
}

var trough_1 = trough;

trough.wrap = wrap_1;

var slice$1 = [].slice;

// Create new middleware.
function trough() {
  var fns = [];
  var middleware = {};

  middleware.run = run;
  middleware.use = use;

  return middleware

  // Run `fns`.  Last argument must be a completion handler.
  function run() {
    var index = -1;
    var input = slice$1.call(arguments, 0, -1);
    var done = arguments[arguments.length - 1];

    if (typeof done !== 'function') {
      throw new Error('Expected function as last argument, not ' + done)
    }

    next.apply(null, [null].concat(input));

    // Run the next `fn`, if any.
    function next(err) {
      var fn = fns[++index];
      var params = slice$1.call(arguments, 0);
      var values = params.slice(1);
      var length = input.length;
      var pos = -1;

      if (err) {
        done(err);
        return
      }

      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos];
        }
      }

      input = values;

      // Next or done.
      if (fn) {
        wrap_1(fn, next).apply(null, input);
      } else {
        done.apply(null, [null].concat(input));
      }
    }
  }

  // Add `fn` to the list.
  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn)
    }

    fns.push(fn);

    return middleware
  }
}

var own = {}.hasOwnProperty;

var unistUtilStringifyPosition = stringify;

function stringify(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if (own.call(value, 'position') || own.call(value, 'type')) {
    return position(value.position)
  }

  // Position.
  if (own.call(value, 'start') || own.call(value, 'end')) {
    return position(value)
  }

  // Point.
  if (own.call(value, 'line') || own.call(value, 'column')) {
    return point(value)
  }

  // ?
  return ''
}

function point(point) {
  if (!point || typeof point !== 'object') {
    point = {};
  }

  return index(point.line) + ':' + index(point.column)
}

function position(pos) {
  if (!pos || typeof pos !== 'object') {
    pos = {};
  }

  return point(pos.start) + '-' + point(pos.end)
}

function index(value) {
  return value && typeof value === 'number' ? value : 1
}

var vfileMessage = VMessage;

// Inherit from `Error#`.
function VMessagePrototype() {}
VMessagePrototype.prototype = Error.prototype;
VMessage.prototype = new VMessagePrototype();

// Message properties.
var proto = VMessage.prototype;

proto.file = '';
proto.name = '';
proto.reason = '';
proto.message = '';
proto.stack = '';
proto.fatal = null;
proto.column = null;
proto.line = null;

// Construct a new VMessage.
//
// Note: We cannot invoke `Error` on the created context, as that adds readonly
// `line` and `column` attributes on Safari 9, thus throwing and failing the
// data.
function VMessage(reason, position, origin) {
  var parts;
  var range;
  var location;

  if (typeof position === 'string') {
    origin = position;
    position = null;
  }

  parts = parseOrigin(origin);
  range = unistUtilStringifyPosition(position) || '1:1';

  location = {
    start: {line: null, column: null},
    end: {line: null, column: null}
  };

  // Node.
  if (position && position.position) {
    position = position.position;
  }

  if (position) {
    // Position.
    if (position.start) {
      location = position;
      position = position.start;
    } else {
      // Point.
      location.start = position;
    }
  }

  if (reason.stack) {
    this.stack = reason.stack;
    reason = reason.message;
  }

  this.message = reason;
  this.name = range;
  this.reason = reason;
  this.line = position ? position.line : null;
  this.column = position ? position.column : null;
  this.location = location;
  this.source = parts[0];
  this.ruleId = parts[1];
}

function parseOrigin(origin) {
  var result = [null, null];
  var index;

  if (typeof origin === 'string') {
    index = origin.indexOf(':');

    if (index === -1) {
      result[1] = origin;
    } else {
      result[0] = origin.slice(0, index);
      result[1] = origin.slice(index + 1);
    }
  }

  return result
}

// A derivative work based on:
// <https://github.com/browserify/path-browserify>.
// Which is licensed:
//
// MIT License
//
// Copyright (c) 2013 James Halliday
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// A derivative work based on:
//
// Parts of that are extracted from Node’s internal `path` module:
// <https://github.com/nodejs/node/blob/master/lib/path.js>.
// Which is licensed:
//
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var basename_1 = basename;
var dirname_1 = dirname;
var extname_1 = extname;
var join_1 = join;
var sep = '/';

function basename(path, ext) {
  var start = 0;
  var end = -1;
  var index;
  var firstNonSlashEnd;
  var seenNonSlash;
  var extIndex;

  if (ext !== undefined && typeof ext !== 'string') {
    throw new TypeError('"ext" argument must be a string')
  }

  assertPath(path);
  index = path.length;

  if (ext === undefined || !ext.length || ext.length > path.length) {
    while (index--) {
      if (path.charCodeAt(index) === 47 /* `/` */) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now.
        if (seenNonSlash) {
          start = index + 1;
          break
        }
      } else if (end < 0) {
        // We saw the first non-path separator, mark this as the end of our
        // path component.
        seenNonSlash = true;
        end = index + 1;
      }
    }

    return end < 0 ? '' : path.slice(start, end)
  }

  if (ext === path) {
    return ''
  }

  firstNonSlashEnd = -1;
  extIndex = ext.length - 1;

  while (index--) {
    if (path.charCodeAt(index) === 47 /* `/` */) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now.
      if (seenNonSlash) {
        start = index + 1;
        break
      }
    } else {
      if (firstNonSlashEnd < 0) {
        // We saw the first non-path separator, remember this index in case
        // we need it if the extension ends up not matching.
        seenNonSlash = true;
        firstNonSlashEnd = index + 1;
      }

      if (extIndex > -1) {
        // Try to match the explicit extension.
        if (path.charCodeAt(index) === ext.charCodeAt(extIndex--)) {
          if (extIndex < 0) {
            // We matched the extension, so mark this as the end of our path
            // component
            end = index;
          }
        } else {
          // Extension does not match, so our result is the entire path
          // component
          extIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }

  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path.length;
  }

  return path.slice(start, end)
}

function dirname(path) {
  var end;
  var unmatchedSlash;
  var index;

  assertPath(path);

  if (!path.length) {
    return '.'
  }

  end = -1;
  index = path.length;

  // Prefix `--` is important to not run on `0`.
  while (--index) {
    if (path.charCodeAt(index) === 47 /* `/` */) {
      if (unmatchedSlash) {
        end = index;
        break
      }
    } else if (!unmatchedSlash) {
      // We saw the first non-path separator
      unmatchedSlash = true;
    }
  }

  return end < 0
    ? path.charCodeAt(0) === 47 /* `/` */
      ? '/'
      : '.'
    : end === 1 && path.charCodeAt(0) === 47 /* `/` */
    ? '//'
    : path.slice(0, end)
}

function extname(path) {
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find.
  var preDotState = 0;
  var unmatchedSlash;
  var code;
  var index;

  assertPath(path);

  index = path.length;

  while (index--) {
    code = path.charCodeAt(index);

    if (code === 47 /* `/` */) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now.
      if (unmatchedSlash) {
        startPart = index + 1;
        break
      }

      continue
    }

    if (end < 0) {
      // We saw the first non-path separator, mark this as the end of our
      // extension.
      unmatchedSlash = true;
      end = index + 1;
    }

    if (code === 46 /* `.` */) {
      // If this is our first dot, mark it as the start of our extension.
      if (startDot < 0) {
        startDot = index;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension.
      preDotState = -1;
    }
  }

  if (
    startDot < 0 ||
    end < 0 ||
    // We saw a non-dot character immediately before the dot.
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly `..`.
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  ) {
    return ''
  }

  return path.slice(startDot, end)
}

function join() {
  var index = -1;
  var joined;

  while (++index < arguments.length) {
    assertPath(arguments[index]);

    if (arguments[index]) {
      joined =
        joined === undefined
          ? arguments[index]
          : joined + '/' + arguments[index];
    }
  }

  return joined === undefined ? '.' : normalize(joined)
}

// Note: `normalize` is not exposed as `path.normalize`, so some code is
// manually removed from it.
function normalize(path) {
  var absolute;
  var value;

  assertPath(path);

  absolute = path.charCodeAt(0) === 47; /* `/` */

  // Normalize the path according to POSIX rules.
  value = normalizeString(path, !absolute);

  if (!value.length && !absolute) {
    value = '.';
  }

  if (value.length && path.charCodeAt(path.length - 1) === 47 /* / */) {
    value += '/';
  }

  return absolute ? '/' + value : value
}

// Resolve `.` and `..` elements in a path with directory names.
function normalizeString(path, allowAboveRoot) {
  var result = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var index = -1;
  var code;
  var lastSlashIndex;

  while (++index <= path.length) {
    if (index < path.length) {
      code = path.charCodeAt(index);
    } else if (code === 47 /* `/` */) {
      break
    } else {
      code = 47; /* `/` */
    }

    if (code === 47 /* `/` */) {
      if (lastSlash === index - 1 || dots === 1) ; else if (lastSlash !== index - 1 && dots === 2) {
        if (
          result.length < 2 ||
          lastSegmentLength !== 2 ||
          result.charCodeAt(result.length - 1) !== 46 /* `.` */ ||
          result.charCodeAt(result.length - 2) !== 46 /* `.` */
        ) {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf('/');

            /* istanbul ignore else - No clue how to cover it. */
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = '';
                lastSegmentLength = 0;
              } else {
                result = result.slice(0, lastSlashIndex);
                lastSegmentLength = result.length - 1 - result.lastIndexOf('/');
              }

              lastSlash = index;
              dots = 0;
              continue
            }
          } else if (result.length) {
            result = '';
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue
          }
        }

        if (allowAboveRoot) {
          result = result.length ? result + '/..' : '..';
          lastSegmentLength = 2;
        }
      } else {
        if (result.length) {
          result += '/' + path.slice(lastSlash + 1, index);
        } else {
          result = path.slice(lastSlash + 1, index);
        }

        lastSegmentLength = index - lastSlash - 1;
      }

      lastSlash = index;
      dots = 0;
    } else if (code === 46 /* `.` */ && dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }

  return result
}

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError(
      'Path must be a string. Received ' + JSON.stringify(path)
    )
  }
}

var minpath_browser = {
	basename: basename_1,
	dirname: dirname_1,
	extname: extname_1,
	join: join_1,
	sep: sep
};

// Somewhat based on:
// <https://github.com/defunctzombie/node-process/blob/master/browser.js>.
// But I don’t think one tiny line of code can be copyrighted. 😅
var cwd_1 = cwd;

function cwd() {
  return '/'
}

var minproc_browser = {
	cwd: cwd_1
};

var core = VFile;

var own$1 = {}.hasOwnProperty;

// Order of setting (least specific to most), we need this because otherwise
// `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
// stem can be set.
var order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname'];

VFile.prototype.toString = toString;

// Access full path (`~/index.min.js`).
Object.defineProperty(VFile.prototype, 'path', {get: getPath, set: setPath});

// Access parent path (`~`).
Object.defineProperty(VFile.prototype, 'dirname', {
  get: getDirname,
  set: setDirname
});

// Access basename (`index.min.js`).
Object.defineProperty(VFile.prototype, 'basename', {
  get: getBasename,
  set: setBasename
});

// Access extname (`.js`).
Object.defineProperty(VFile.prototype, 'extname', {
  get: getExtname,
  set: setExtname
});

// Access stem (`index.min`).
Object.defineProperty(VFile.prototype, 'stem', {get: getStem, set: setStem});

// Construct a new file.
function VFile(options) {
  var prop;
  var index;

  if (!options) {
    options = {};
  } else if (typeof options === 'string' || isBuffer(options)) {
    options = {contents: options};
  } else if ('message' in options && 'messages' in options) {
    return options
  }

  if (!(this instanceof VFile)) {
    return new VFile(options)
  }

  this.data = {};
  this.messages = [];
  this.history = [];
  this.cwd = minproc_browser.cwd();

  // Set path related properties in the correct order.
  index = -1;

  while (++index < order.length) {
    prop = order[index];

    if (own$1.call(options, prop)) {
      this[prop] = options[prop];
    }
  }

  // Set non-path related properties.
  for (prop in options) {
    if (order.indexOf(prop) < 0) {
      this[prop] = options[prop];
    }
  }
}

function getPath() {
  return this.history[this.history.length - 1]
}

function setPath(path) {
  assertNonEmpty(path, 'path');

  if (this.path !== path) {
    this.history.push(path);
  }
}

function getDirname() {
  return typeof this.path === 'string' ? minpath_browser.dirname(this.path) : undefined
}

function setDirname(dirname) {
  assertPath$1(this.path, 'dirname');
  this.path = minpath_browser.join(dirname || '', this.basename);
}

function getBasename() {
  return typeof this.path === 'string' ? minpath_browser.basename(this.path) : undefined
}

function setBasename(basename) {
  assertNonEmpty(basename, 'basename');
  assertPart(basename, 'basename');
  this.path = minpath_browser.join(this.dirname || '', basename);
}

function getExtname() {
  return typeof this.path === 'string' ? minpath_browser.extname(this.path) : undefined
}

function setExtname(extname) {
  assertPart(extname, 'extname');
  assertPath$1(this.path, 'extname');

  if (extname) {
    if (extname.charCodeAt(0) !== 46 /* `.` */) {
      throw new Error('`extname` must start with `.`')
    }

    if (extname.indexOf('.', 1) > -1) {
      throw new Error('`extname` cannot contain multiple dots')
    }
  }

  this.path = minpath_browser.join(this.dirname, this.stem + (extname || ''));
}

function getStem() {
  return typeof this.path === 'string'
    ? minpath_browser.basename(this.path, this.extname)
    : undefined
}

function setStem(stem) {
  assertNonEmpty(stem, 'stem');
  assertPart(stem, 'stem');
  this.path = minpath_browser.join(this.dirname || '', stem + (this.extname || ''));
}

// Get the value of the file.
function toString(encoding) {
  return (this.contents || '').toString(encoding)
}

// Assert that `part` is not a path (i.e., does not contain `p.sep`).
function assertPart(part, name) {
  if (part && part.indexOf(minpath_browser.sep) > -1) {
    throw new Error(
      '`' + name + '` cannot be a path: did not expect `' + minpath_browser.sep + '`'
    )
  }
}

// Assert that `part` is not empty.
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

// Assert `path` exists.
function assertPath$1(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}

var lib = core;

core.prototype.message = message;
core.prototype.info = info;
core.prototype.fail = fail;

// Create a message with `reason` at `position`.
// When an error is passed in as `reason`, copies the stack.
function message(reason, position, origin) {
  var message = new vfileMessage(reason, position, origin);

  if (this.path) {
    message.name = this.path + ':' + message.name;
    message.file = this.path;
  }

  message.fatal = false;

  this.messages.push(message);

  return message
}

// Fail: creates a vmessage, associates it with the file, and throws it.
function fail() {
  var message = this.message.apply(this, arguments);

  message.fatal = true;

  throw message
}

// Info: creates a vmessage, associates it with the file, and marks the fatality
// as null.
function info() {
  var message = this.message.apply(this, arguments);

  message.fatal = null;

  return message
}

var vfile = lib;

// Expose a frozen processor.
var unified_1 = unified().freeze();

var slice$2 = [].slice;
var own$2 = {}.hasOwnProperty;

// Process pipeline.
var pipeline = trough_1()
  .use(pipelineParse)
  .use(pipelineRun)
  .use(pipelineStringify);

function pipelineParse(p, ctx) {
  ctx.tree = p.parse(ctx.file);
}

function pipelineRun(p, ctx, next) {
  p.run(ctx.tree, ctx.file, done);

  function done(err, tree, file) {
    if (err) {
      next(err);
    } else {
      ctx.tree = tree;
      ctx.file = file;
      next();
    }
  }
}

function pipelineStringify(p, ctx) {
  var result = p.stringify(ctx.tree, ctx.file);
  var file = ctx.file;

  if (result === undefined || result === null) ; else if (typeof result === 'string' || isBuffer(result)) {
    file.contents = result;
  } else {
    file.result = result;
  }
}

// Function to create the first processor.
function unified() {
  var attachers = [];
  var transformers = trough_1();
  var namespace = {};
  var frozen = false;
  var freezeIndex = -1;

  // Data management.
  processor.data = data;

  // Lock.
  processor.freeze = freeze;

  // Plugins.
  processor.attachers = attachers;
  processor.use = use;

  // API.
  processor.parse = parse;
  processor.stringify = stringify;
  processor.run = run;
  processor.runSync = runSync;
  processor.process = process;
  processor.processSync = processSync;

  // Expose.
  return processor

  // Create a new processor based on the processor in the current scope.
  function processor() {
    var destination = unified();
    var length = attachers.length;
    var index = -1;

    while (++index < length) {
      destination.use.apply(null, attachers[index]);
    }

    destination.data(extend(true, {}, namespace));

    return destination
  }

  // Freeze: used to signal a processor that has finished configuration.
  //
  // For example, take unified itself: it’s frozen.
  // Plugins should not be added to it.
  // Rather, it should be extended, by invoking it, before modifying it.
  //
  // In essence, always invoke this when exporting a processor.
  function freeze() {
    var values;
    var plugin;
    var options;
    var transformer;

    if (frozen) {
      return processor
    }

    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex];
      plugin = values[0];
      options = values[1];
      transformer = null;

      if (options === false) {
        continue
      }

      if (options === true) {
        values[1] = undefined;
      }

      transformer = plugin.apply(processor, values.slice(1));

      if (typeof transformer === 'function') {
        transformers.use(transformer);
      }
    }

    frozen = true;
    freezeIndex = Infinity;

    return processor
  }

  // Data management.
  // Getter / setter for processor-specific informtion.
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen);

        namespace[key] = value;

        return processor
      }

      // Get `key`.
      return (own$2.call(namespace, key) && namespace[key]) || null
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', frozen);
      namespace = key;
      return processor
    }

    // Get space.
    return namespace
  }

  // Plugin management.
  //
  // Pass it:
  // *   an attacher and options,
  // *   a preset,
  // *   a list of presets, attachers, and arguments (list of attachers and
  //     options).
  function use(value) {
    var settings;

    assertUnfrozen('use', frozen);

    if (value === null || value === undefined) ; else if (typeof value === 'function') {
      addPlugin.apply(null, arguments);
    } else if (typeof value === 'object') {
      if ('length' in value) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`')
    }

    if (settings) {
      namespace.settings = extend(namespace.settings || {}, settings);
    }

    return processor

    function addPreset(result) {
      addList(result.plugins);

      if (result.settings) {
        settings = extend(settings || {}, result.settings);
      }
    }

    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value);
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addPlugin.apply(null, value);
        } else {
          addPreset(value);
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`')
      }
    }

    function addList(plugins) {
      var length;
      var index;

      if (plugins === null || plugins === undefined) ; else if (typeof plugins === 'object' && 'length' in plugins) {
        length = plugins.length;
        index = -1;

        while (++index < length) {
          add(plugins[index]);
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    function addPlugin(plugin, value) {
      var entry = find(plugin);

      if (entry) {
        if (isPlainObj(entry[1]) && isPlainObj(value)) {
          value = extend(entry[1], value);
        }

        entry[1] = value;
      } else {
        attachers.push(slice$2.call(arguments));
      }
    }
  }

  function find(plugin) {
    var length = attachers.length;
    var index = -1;
    var entry;

    while (++index < length) {
      entry = attachers[index];

      if (entry[0] === plugin) {
        return entry
      }
    }
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc) {
    var file = vfile(doc);
    var Parser;

    freeze();
    Parser = processor.Parser;
    assertParser('parse', Parser);

    if (newable(Parser, 'parse')) {
      return new Parser(String(file), file).parse()
    }

    return Parser(String(file), file) // eslint-disable-line new-cap
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), async.
  function run(node, file, cb) {
    assertNode(node);
    freeze();

    if (!cb && typeof file === 'function') {
      cb = file;
      file = null;
    }

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb);

    function executor(resolve, reject) {
      transformers.run(node, vfile(file), done);

      function done(err, tree, file) {
        tree = tree || node;
        if (err) {
          reject(err);
        } else if (resolve) {
          resolve(tree);
        } else {
          cb(null, tree, file);
        }
      }
    }
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), sync.
  function runSync(node, file) {
    var complete = false;
    var result;

    run(node, file, done);

    assertDone('runSync', 'run', complete);

    return result

    function done(err, tree) {
      complete = true;
      bail_1(err);
      result = tree;
    }
  }

  // Stringify a unist node representation of a file (in string or vfile
  // representation) into a string using the `Compiler` on the processor.
  function stringify(node, doc) {
    var file = vfile(doc);
    var Compiler;

    freeze();
    Compiler = processor.Compiler;
    assertCompiler('stringify', Compiler);
    assertNode(node);

    if (newable(Compiler, 'compile')) {
      return new Compiler(node, file).compile()
    }

    return Compiler(node, file) // eslint-disable-line new-cap
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor, then run transforms on that node, and
  // compile the resulting node using the `Compiler` on the processor, and
  // store that result on the vfile.
  function process(doc, cb) {
    freeze();
    assertParser('process', processor.Parser);
    assertCompiler('process', processor.Compiler);

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb);

    function executor(resolve, reject) {
      var file = vfile(doc);

      pipeline.run(processor, {file: file}, done);

      function done(err) {
        if (err) {
          reject(err);
        } else if (resolve) {
          resolve(file);
        } else {
          cb(null, file);
        }
      }
    }
  }

  // Process the given document (in string or vfile representation), sync.
  function processSync(doc) {
    var complete = false;
    var file;

    freeze();
    assertParser('processSync', processor.Parser);
    assertCompiler('processSync', processor.Compiler);
    file = vfile(doc);

    process(file, done);

    assertDone('processSync', 'process', complete);

    return file

    function done(err) {
      complete = true;
      bail_1(err);
    }
  }
}

// Check if `value` is a constructor.
function newable(value, name) {
  return (
    typeof value === 'function' &&
    value.prototype &&
    // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    (keys(value.prototype) || name in value.prototype)
  )
}

// Check if `value` is an object with keys.
function keys(value) {
  var key;
  for (key in value) {
    return true
  }

  return false
}

// Assert a parser is available.
function assertParser(name, Parser) {
  if (typeof Parser !== 'function') {
    throw new Error('Cannot `' + name + '` without `Parser`')
  }
}

// Assert a compiler is available.
function assertCompiler(name, Compiler) {
  if (typeof Compiler !== 'function') {
    throw new Error('Cannot `' + name + '` without `Compiler`')
  }
}

// Assert the processor is not frozen.
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.'
    )
  }
}

// Assert `node` is a unist node.
function assertNode(node) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('Expected node, got `' + node + '`')
  }
}

// Assert that `complete` is `true`.
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var unistBuilder = u;

function u(type, props, value) {
  var node;

  if (
    (value === null || value === undefined) &&
    (typeof props !== 'object' || Array.isArray(props))
  ) {
    value = props;
    props = {};
  }

  node = Object.assign({type: String(type)}, props);

  if (Array.isArray(value)) {
    node.children = value;
  } else if (value !== null && value !== undefined) {
    node.value = String(value);
  }

  return node
}

var entities = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgEntity = void 0;
const getOrgEntity = (name) => {
    const e = orgEntities.find((x) => x[0] === name);
    if (!e)
        return null;
    return {
        name,
        latex: e[1],
        requireLatexMath: e[2],
        html: e[3],
        ascii: e[4],
        latin1: e[5],
        utf8: e[6],
    };
};
exports.getOrgEntity = getOrgEntity;
// (json-encode org-entities)
const orgEntities = [
    // * Letters
    // ** Latin
    ['Agrave', '\\`{A}', false, '&Agrave;', 'A', 'À', 'À'],
    ['agrave', '\\`{a}', false, '&agrave;', 'a', 'à', 'à'],
    ['Aacute', "\\'{A}", false, '&Aacute;', 'A', 'Á', 'Á'],
    ['aacute', "\\'{a}", false, '&aacute;', 'a', 'á', 'á'],
    ['Acirc', '\\^{A}', false, '&Acirc;', 'A', 'Â', 'Â'],
    ['acirc', '\\^{a}', false, '&acirc;', 'a', 'â', 'â'],
    ['Amacr', '\\bar{A}', false, '&Amacr;', 'A', 'Ã', 'Ã'],
    ['amacr', '\\bar{a}', false, '&amacr;', 'a', 'ã', 'ã'],
    ['Atilde', '\\~{A}', false, '&Atilde;', 'A', 'Ã', 'Ã'],
    ['atilde', '\\~{a}', false, '&atilde;', 'a', 'ã', 'ã'],
    ['Auml', '\\"{A}', false, '&Auml;', 'Ae', 'Ä', 'Ä'],
    ['auml', '\\"{a}', false, '&auml;', 'ae', 'ä', 'ä'],
    ['Aring', '\\AA{}', false, '&Aring;', 'A', 'Å', 'Å'],
    ['AA', '\\AA{}', false, '&Aring;', 'A', 'Å', 'Å'],
    ['aring', '\\aa{}', false, '&aring;', 'a', 'å', 'å'],
    ['AElig', '\\AE{}', false, '&AElig;', 'AE', 'Æ', 'Æ'],
    ['aelig', '\\ae{}', false, '&aelig;', 'ae', 'æ', 'æ'],
    ['Ccedil', '\\c{C}', false, '&Ccedil;', 'C', 'Ç', 'Ç'],
    ['ccedil', '\\c{c}', false, '&ccedil;', 'c', 'ç', 'ç'],
    ['Egrave', '\\`{E}', false, '&Egrave;', 'E', 'È', 'È'],
    ['egrave', '\\`{e}', false, '&egrave;', 'e', 'è', 'è'],
    ['Eacute', "\\'{E}", false, '&Eacute;', 'E', 'É', 'É'],
    ['eacute', "\\'{e}", false, '&eacute;', 'e', 'é', 'é'],
    ['Ecirc', '\\^{E}', false, '&Ecirc;', 'E', 'Ê', 'Ê'],
    ['ecirc', '\\^{e}', false, '&ecirc;', 'e', 'ê', 'ê'],
    ['Euml', '\\"{E}', false, '&Euml;', 'E', 'Ë', 'Ë'],
    ['euml', '\\"{e}', false, '&euml;', 'e', 'ë', 'ë'],
    ['Igrave', '\\`{I}', false, '&Igrave;', 'I', 'Ì', 'Ì'],
    ['igrave', '\\`{i}', false, '&igrave;', 'i', 'ì', 'ì'],
    ['Iacute', "\\'{I}", false, '&Iacute;', 'I', 'Í', 'Í'],
    ['iacute', "\\'{i}", false, '&iacute;', 'i', 'í', 'í'],
    ['Icirc', '\\^{I}', false, '&Icirc;', 'I', 'Î', 'Î'],
    ['icirc', '\\^{i}', false, '&icirc;', 'i', 'î', 'î'],
    ['Iuml', '\\"{I}', false, '&Iuml;', 'I', 'Ï', 'Ï'],
    ['iuml', '\\"{i}', false, '&iuml;', 'i', 'ï', 'ï'],
    ['Ntilde', '\\~{N}', false, '&Ntilde;', 'N', 'Ñ', 'Ñ'],
    ['ntilde', '\\~{n}', false, '&ntilde;', 'n', 'ñ', 'ñ'],
    ['Ograve', '\\`{O}', false, '&Ograve;', 'O', 'Ò', 'Ò'],
    ['ograve', '\\`{o}', false, '&ograve;', 'o', 'ò', 'ò'],
    ['Oacute', "\\'{O}", false, '&Oacute;', 'O', 'Ó', 'Ó'],
    ['oacute', "\\'{o}", false, '&oacute;', 'o', 'ó', 'ó'],
    ['Ocirc', '\\^{O}', false, '&Ocirc;', 'O', 'Ô', 'Ô'],
    ['ocirc', '\\^{o}', false, '&ocirc;', 'o', 'ô', 'ô'],
    ['Otilde', '\\~{O}', false, '&Otilde;', 'O', 'Õ', 'Õ'],
    ['otilde', '\\~{o}', false, '&otilde;', 'o', 'õ', 'õ'],
    ['Ouml', '\\"{O}', false, '&Ouml;', 'Oe', 'Ö', 'Ö'],
    ['ouml', '\\"{o}', false, '&ouml;', 'oe', 'ö', 'ö'],
    ['Oslash', '\\O', false, '&Oslash;', 'O', 'Ø', 'Ø'],
    ['oslash', '\\o{}', false, '&oslash;', 'o', 'ø', 'ø'],
    ['OElig', '\\OE{}', false, '&OElig;', 'OE', 'OE', 'Œ'],
    ['oelig', '\\oe{}', false, '&oelig;', 'oe', 'oe', 'œ'],
    ['Scaron', '\\v{S}', false, '&Scaron;', 'S', 'S', 'Š'],
    ['scaron', '\\v{s}', false, '&scaron;', 's', 's', 'š'],
    ['szlig', '\\ss{}', false, '&szlig;', 'ss', 'ß', 'ß'],
    ['Ugrave', '\\`{U}', false, '&Ugrave;', 'U', 'Ù', 'Ù'],
    ['ugrave', '\\`{u}', false, '&ugrave;', 'u', 'ù', 'ù'],
    ['Uacute', "\\'{U}", false, '&Uacute;', 'U', 'Ú', 'Ú'],
    ['uacute', "\\'{u}", false, '&uacute;', 'u', 'ú', 'ú'],
    ['Ucirc', '\\^{U}', false, '&Ucirc;', 'U', 'Û', 'Û'],
    ['ucirc', '\\^{u}', false, '&ucirc;', 'u', 'û', 'û'],
    ['Uuml', '\\"{U}', false, '&Uuml;', 'Ue', 'Ü', 'Ü'],
    ['uuml', '\\"{u}', false, '&uuml;', 'ue', 'ü', 'ü'],
    ['Yacute', "\\'{Y}", false, '&Yacute;', 'Y', 'Ý', 'Ý'],
    ['yacute', "\\'{y}", false, '&yacute;', 'y', 'ý', 'ý'],
    ['Yuml', '\\"{Y}', false, '&Yuml;', 'Y', 'Y', 'Ÿ'],
    ['yuml', '\\"{y}', false, '&yuml;', 'y', 'ÿ', 'ÿ'],
    // ** Latin (special face)
    ['fnof', '\\textit{f}', false, '&fnof;', 'f', 'f', 'ƒ'],
    ['real', '\\Re', true, '&real;', 'R', 'R', 'ℜ'],
    ['image', '\\Im', true, '&image;', 'I', 'I', 'ℑ'],
    ['weierp', '\\wp', true, '&weierp;', 'P', 'P', '℘'],
    ['ell', '\\ell', true, '&ell;', 'ell', 'ell', 'ℓ'],
    ['imath', '\\imath', true, '&imath;', '[dotless i]', 'dotless i', 'ı'],
    ['jmath', '\\jmath', true, '&jmath;', '[dotless j]', 'dotless j', 'ȷ'],
    // ** Greek
    ['Alpha', 'A', false, '&Alpha;', 'Alpha', 'Alpha', 'Α'],
    ['alpha', '\\alpha', true, '&alpha;', 'alpha', 'alpha', 'α'],
    ['Beta', 'B', false, '&Beta;', 'Beta', 'Beta', 'Β'],
    ['beta', '\\beta', true, '&beta;', 'beta', 'beta', 'β'],
    ['Gamma', '\\Gamma', true, '&Gamma;', 'Gamma', 'Gamma', 'Γ'],
    ['gamma', '\\gamma', true, '&gamma;', 'gamma', 'gamma', 'γ'],
    ['Delta', '\\Delta', true, '&Delta;', 'Delta', 'Delta', 'Δ'],
    ['delta', '\\delta', true, '&delta;', 'delta', 'delta', 'δ'],
    ['Epsilon', 'E', false, '&Epsilon;', 'Epsilon', 'Epsilon', 'Ε'],
    ['epsilon', '\\epsilon', true, '&epsilon;', 'epsilon', 'epsilon', 'ε'],
    [
        'varepsilon',
        '\\varepsilon',
        true,
        '&epsilon;',
        'varepsilon',
        'varepsilon',
        'ε',
    ],
    ['Zeta', 'Z', false, '&Zeta;', 'Zeta', 'Zeta', 'Ζ'],
    ['zeta', '\\zeta', true, '&zeta;', 'zeta', 'zeta', 'ζ'],
    ['Eta', 'H', false, '&Eta;', 'Eta', 'Eta', 'Η'],
    ['eta', '\\eta', true, '&eta;', 'eta', 'eta', 'η'],
    ['Theta', '\\Theta', true, '&Theta;', 'Theta', 'Theta', 'Θ'],
    ['theta', '\\theta', true, '&theta;', 'theta', 'theta', 'θ'],
    ['thetasym', '\\vartheta', true, '&thetasym;', 'theta', 'theta', 'ϑ'],
    ['vartheta', '\\vartheta', true, '&thetasym;', 'theta', 'theta', 'ϑ'],
    ['Iota', 'I', false, '&Iota;', 'Iota', 'Iota', 'Ι'],
    ['iota', '\\iota', true, '&iota;', 'iota', 'iota', 'ι'],
    ['Kappa', 'K', false, '&Kappa;', 'Kappa', 'Kappa', 'Κ'],
    ['kappa', '\\kappa', true, '&kappa;', 'kappa', 'kappa', 'κ'],
    ['Lambda', '\\Lambda', true, '&Lambda;', 'Lambda', 'Lambda', 'Λ'],
    ['lambda', '\\lambda', true, '&lambda;', 'lambda', 'lambda', 'λ'],
    ['Mu', 'M', false, '&Mu;', 'Mu', 'Mu', 'Μ'],
    ['mu', '\\mu', true, '&mu;', 'mu', 'mu', 'μ'],
    ['nu', '\\nu', true, '&nu;', 'nu', 'nu', 'ν'],
    ['Nu', 'N', false, '&Nu;', 'Nu', 'Nu', 'Ν'],
    ['Xi', '\\Xi', true, '&Xi;', 'Xi', 'Xi', 'Ξ'],
    ['xi', '\\xi', true, '&xi;', 'xi', 'xi', 'ξ'],
    ['Omicron', 'O', false, '&Omicron;', 'Omicron', 'Omicron', 'Ο'],
    ['omicron', '\\textit{o}', false, '&omicron;', 'omicron', 'omicron', 'ο'],
    ['Pi', '\\Pi', true, '&Pi;', 'Pi', 'Pi', 'Π'],
    ['pi', '\\pi', true, '&pi;', 'pi', 'pi', 'π'],
    ['Rho', 'P', false, '&Rho;', 'Rho', 'Rho', 'Ρ'],
    ['rho', '\\rho', true, '&rho;', 'rho', 'rho', 'ρ'],
    ['Sigma', '\\Sigma', true, '&Sigma;', 'Sigma', 'Sigma', 'Σ'],
    ['sigma', '\\sigma', true, '&sigma;', 'sigma', 'sigma', 'σ'],
    ['sigmaf', '\\varsigma', true, '&sigmaf;', 'sigmaf', 'sigmaf', 'ς'],
    ['varsigma', '\\varsigma', true, '&sigmaf;', 'varsigma', 'varsigma', 'ς'],
    ['Tau', 'T', false, '&Tau;', 'Tau', 'Tau', 'Τ'],
    ['Upsilon', '\\Upsilon', true, '&Upsilon;', 'Upsilon', 'Upsilon', 'Υ'],
    ['upsih', '\\Upsilon', true, '&upsih;', 'upsilon', 'upsilon', 'ϒ'],
    ['upsilon', '\\upsilon', true, '&upsilon;', 'upsilon', 'upsilon', 'υ'],
    ['Phi', '\\Phi', true, '&Phi;', 'Phi', 'Phi', 'Φ'],
    ['phi', '\\phi', true, '&phi;', 'phi', 'phi', 'ɸ'],
    ['varphi', '\\varphi', true, '&varphi;', 'varphi', 'varphi', 'φ'],
    ['Chi', 'X', false, '&Chi;', 'Chi', 'Chi', 'Χ'],
    ['chi', '\\chi', true, '&chi;', 'chi', 'chi', 'χ'],
    ['acutex', '\\acute x', true, '&acute;x', "'x", "'x", '𝑥́'],
    ['Psi', '\\Psi', true, '&Psi;', 'Psi', 'Psi', 'Ψ'],
    ['psi', '\\psi', true, '&psi;', 'psi', 'psi', 'ψ'],
    ['tau', '\\tau', true, '&tau;', 'tau', 'tau', 'τ'],
    ['Omega', '\\Omega', true, '&Omega;', 'Omega', 'Omega', 'Ω'],
    ['omega', '\\omega', true, '&omega;', 'omega', 'omega', 'ω'],
    ['piv', '\\varpi', true, '&piv;', 'omega-pi', 'omega-pi', 'ϖ'],
    ['varpi', '\\varpi', true, '&piv;', 'omega-pi', 'omega-pi', 'ϖ'],
    [
        'partial',
        '\\partial',
        true,
        '&part;',
        '[partial differential]',
        '[partial differential]',
        '∂',
    ],
    // ** Hebrew
    ['alefsym', '\\aleph', true, '&alefsym;', 'aleph', 'aleph', 'ℵ'],
    ['aleph', '\\aleph', true, '&aleph;', 'aleph', 'aleph', 'ℵ'],
    ['gimel', '\\gimel', true, '&gimel;', 'gimel', 'gimel', 'ℷ'],
    ['beth', '\\beth', true, '&beth;', 'beth', 'beth', 'ב'],
    ['dalet', '\\daleth', true, '&daleth;', 'dalet', 'dalet', 'ד'],
    // ** Icelandic
    ['ETH', '\\DH{}', false, '&ETH;', 'D', 'Ð', 'Ð'],
    ['eth', '\\dh{}', false, '&eth;', 'dh', 'ð', 'ð'],
    ['THORN', '\\TH{}', false, '&THORN;', 'TH', 'Þ', 'Þ'],
    ['thorn', '\\th{}', false, '&thorn;', 'th', 'þ', 'þ'],
    // * Punctuation
    // ** Dots and Marks
    ['dots', '\\dots{}', false, '&hellip;', '...', '...', '…'],
    ['cdots', '\\cdots{}', true, '&ctdot;', '...', '...', '⋯'],
    ['hellip', '\\dots{}', false, '&hellip;', '...', '...', '…'],
    ['middot', '\\textperiodcentered{}', false, '&middot;', '.', '·', '·'],
    ['iexcl', '!`', false, '&iexcl;', '!', '¡', '¡'],
    ['iquest', '?`', false, '&iquest;', '?', '¿', '¿'],
    // ** Dash-like
    ['shy', '\\-', false, '&shy;', '', '', ''],
    ['ndash', '--', false, '&ndash;', '-', '-', '–'],
    ['mdash', '---', false, '&mdash;', '--', '--', '—'],
    // ** Quotations
    ['quot', '\\textquotedbl{}', false, '&quot;', '"', '"', '"'],
    ['acute', '\\textasciiacute{}', false, '&acute;', "'", '´', '´'],
    ['ldquo', '\\textquotedblleft{}', false, '&ldquo;', '"', '"', '“'],
    ['rdquo', '\\textquotedblright{}', false, '&rdquo;', '"', '"', '”'],
    ['bdquo', '\\quotedblbase{}', false, '&bdquo;', '"', '"', '„'],
    ['lsquo', '\\textquoteleft{}', false, '&lsquo;', '`', '`', '‘'],
    ['rsquo', '\\textquoteright{}', false, '&rsquo;', "'", "'", '’'],
    ['sbquo', '\\quotesinglbase{}', false, '&sbquo;', ',', ',', '‚'],
    ['laquo', '\\guillemotleft{}', false, '&laquo;', '<<', '«', '«'],
    ['raquo', '\\guillemotright{}', false, '&raquo;', '>>', '»', '»'],
    ['lsaquo', '\\guilsinglleft{}', false, '&lsaquo;', '<', '<', '‹'],
    ['rsaquo', '\\guilsinglright{}', false, '&rsaquo;', '>', '>', '›'],
    // * Other
    // ** Misc. (often used)
    ['circ', '\\^{}', false, '&circ;', '^', '^', '∘'],
    ['vert', '\\vert{}', true, '&vert;', '|', '|', '|'],
    ['vbar', '|', false, '|', '|', '|', '|'],
    ['brvbar', '\\textbrokenbar{}', false, '&brvbar;', '|', '¦', '¦'],
    ['S', '\\S', false, '&sect;', 'paragraph', '§', '§'],
    ['sect', '\\S', false, '&sect;', 'paragraph', '§', '§'],
    ['amp', '\\&', false, '&amp;', '&', '&', '&'],
    ['lt', '\\textless{}', false, '&lt;', '<', '<', '<'],
    ['gt', '\\textgreater{}', false, '&gt;', '>', '>', '>'],
    ['tilde', '\\textasciitilde{}', false, '~', '~', '~', '~'],
    ['slash', '/', false, '/', '/', '/', '/'],
    ['plus', '+', false, '+', '+', '+', '+'],
    ['under', '\\_', false, '_', '_', '_', '_'],
    ['equal', '=', false, '=', '=', '=', '='],
    ['asciicirc', '\\textasciicircum{}', false, '^', '^', '^', '^'],
    ['dagger', '\\textdagger{}', false, '&dagger;', '[dagger]', '[dagger]', '†'],
    ['dag', '\\dag{}', false, '&dagger;', '[dagger]', '[dagger]', '†'],
    [
        'Dagger',
        '\\textdaggerdbl{}',
        false,
        '&Dagger;',
        '[doubledagger]',
        '[doubledagger]',
        '‡',
    ],
    [
        'ddag',
        '\\ddag{}',
        false,
        '&Dagger;',
        '[doubledagger]',
        '[doubledagger]',
        '‡',
    ],
    // ** Whitespace
    ['nbsp', '~', false, '&nbsp;', ' ', ' ', ' '],
    ['ensp', '\\hspace*{.5em}', false, '&ensp;', ' ', ' ', ' '],
    ['emsp', '\\hspace*{1em}', false, '&emsp;', ' ', ' ', ' '],
    ['thinsp', '\\hspace*{.2em}', false, '&thinsp;', ' ', ' ', ' '],
    // ** Currency
    ['curren', '\\textcurrency{}', false, '&curren;', 'curr.', '¤', '¤'],
    ['cent', '\\textcent{}', false, '&cent;', 'cent', '¢', '¢'],
    ['pound', '\\pounds{}', false, '&pound;', 'pound', '£', '£'],
    ['yen', '\\textyen{}', false, '&yen;', 'yen', '¥', '¥'],
    ['euro', '\\texteuro{}', false, '&euro;', 'EUR', 'EUR', '€'],
    ['EUR', '\\texteuro{}', false, '&euro;', 'EUR', 'EUR', '€'],
    ['dollar', '\\$', false, '$', '$', '$', '$'],
    ['USD', '\\$', false, '$', '$', '$', '$'],
    // ** Property Marks
    ['copy', '\\textcopyright{}', false, '&copy;', '(c)', '©', '©'],
    ['reg', '\\textregistered{}', false, '&reg;', '(r)', '®', '®'],
    ['trade', '\\texttrademark{}', false, '&trade;', 'TM', 'TM', '™'],
    // ** Science et al.
    ['minus', '\\minus', true, '&minus;', '-', '-', '−'],
    ['pm', '\\textpm{}', false, '&plusmn;', '+-', '±', '±'],
    ['plusmn', '\\textpm{}', false, '&plusmn;', '+-', '±', '±'],
    ['times', '\\texttimes{}', false, '&times;', '*', '×', '×'],
    ['frasl', '/', false, '&frasl;', '/', '/', '⁄'],
    ['colon', '\\colon', true, ':', ':', ':', ':'],
    ['div', '\\textdiv{}', false, '&divide;', '/', '÷', '÷'],
    ['frac12', '\\textonehalf{}', false, '&frac12;', '1/2', '½', '½'],
    ['frac14', '\\textonequarter{}', false, '&frac14;', '1/4', '¼', '¼'],
    ['frac34', '\\textthreequarters{}', false, '&frac34;', '3/4', '¾', '¾'],
    [
        'permil',
        '\\textperthousand{}',
        false,
        '&permil;',
        'per thousand',
        'per thousand',
        '‰',
    ],
    ['sup1', '\\textonesuperior{}', false, '&sup1;', '^1', '¹', '¹'],
    ['sup2', '\\texttwosuperior{}', false, '&sup2;', '^2', '²', '²'],
    ['sup3', '\\textthreesuperior{}', false, '&sup3;', '^3', '³', '³'],
    [
        'radic',
        '\\sqrt{\\,}',
        true,
        '&radic;',
        '[square root]',
        '[square root]',
        '√',
    ],
    ['sum', '\\sum', true, '&sum;', '[sum]', '[sum]', '∑'],
    ['prod', '\\prod', true, '&prod;', '[product]', '[n-ary product]', '∏'],
    ['micro', '\\textmu{}', false, '&micro;', 'micro', 'µ', 'µ'],
    ['macr', '\\textasciimacron{}', false, '&macr;', '[macron]', '¯', '¯'],
    ['deg', '\\textdegree{}', false, '&deg;', 'degree', '°', '°'],
    ['prime', '\\prime', true, '&prime;', "'", "'", '′'],
    ['Prime', '\\prime{}\\prime', true, '&Prime;', "''", "''", '″'],
    ['infin', '\\infty', true, '&infin;', '[infinity]', '[infinity]', '∞'],
    ['infty', '\\infty', true, '&infin;', '[infinity]', '[infinity]', '∞'],
    [
        'prop',
        '\\propto',
        true,
        '&prop;',
        '[proportional to]',
        '[proportional to]',
        '∝',
    ],
    [
        'propto',
        '\\propto',
        true,
        '&prop;',
        '[proportional to]',
        '[proportional to]',
        '∝',
    ],
    ['not', '\\textlnot{}', false, '&not;', '[angled dash]', '¬', '¬'],
    ['neg', '\\neg{}', true, '&not;', '[angled dash]', '¬', '¬'],
    ['land', '\\land', true, '&and;', '[logical and]', '[logical and]', '∧'],
    ['wedge', '\\wedge', true, '&and;', '[logical and]', '[logical and]', '∧'],
    ['lor', '\\lor', true, '&or;', '[logical or]', '[logical or]', '∨'],
    ['vee', '\\vee', true, '&or;', '[logical or]', '[logical or]', '∨'],
    ['cap', '\\cap', true, '&cap;', '[intersection]', '[intersection]', '∩'],
    ['cup', '\\cup', true, '&cup;', '[union]', '[union]', '∪'],
    ['smile', '\\smile', true, '&smile;', '[cup product]', '[cup product]', '⌣'],
    ['frown', '\\frown', true, '&frown;', '[Cap product]', '[cap product]', '⌢'],
    ['int', '\\int', true, '&int;', '[integral]', '[integral]', '∫'],
    [
        'therefore',
        '\\therefore',
        true,
        '&there4;',
        '[therefore]',
        '[therefore]',
        '∴',
    ],
    [
        'there4',
        '\\therefore',
        true,
        '&there4;',
        '[therefore]',
        '[therefore]',
        '∴',
    ],
    ['because', '\\because', true, '&because;', '[because]', '[because]', '∵'],
    ['sim', '\\sim', true, '&sim;', '~', '~', '∼'],
    [
        'cong',
        '\\cong',
        true,
        '&cong;',
        '[approx. equal to]',
        '[approx. equal to]',
        '≅',
    ],
    [
        'simeq',
        '\\simeq',
        true,
        '&cong;',
        '[approx. equal to]',
        '[approx. equal to]',
        '≅',
    ],
    [
        'asymp',
        '\\asymp',
        true,
        '&asymp;',
        '[almost equal to]',
        '[almost equal to]',
        '≈',
    ],
    [
        'approx',
        '\\approx',
        true,
        '&asymp;',
        '[almost equal to]',
        '[almost equal to]',
        '≈',
    ],
    ['ne', '\\ne', true, '&ne;', '[not equal to]', '[not equal to]', '≠'],
    ['neq', '\\neq', true, '&ne;', '[not equal to]', '[not equal to]', '≠'],
    [
        'equiv',
        '\\equiv',
        true,
        '&equiv;',
        '[identical to]',
        '[identical to]',
        '≡',
    ],
    [
        'triangleq',
        '\\triangleq',
        true,
        '&triangleq;',
        '[defined to]',
        '[defined to]',
        '≜',
    ],
    ['le', '\\le', true, '&le;', '<=', '<=', '≤'],
    ['leq', '\\le', true, '&le;', '<=', '<=', '≤'],
    ['ge', '\\ge', true, '&ge;', '>=', '>=', '≥'],
    ['geq', '\\ge', true, '&ge;', '>=', '>=', '≥'],
    [
        'lessgtr',
        '\\lessgtr',
        true,
        '&lessgtr;',
        '[less than or greater than]',
        '[less than or greater than]',
        '≶',
    ],
    [
        'lesseqgtr',
        '\\lesseqgtr',
        true,
        '&lesseqgtr;',
        '[less than or equal or greater than or equal]',
        '[less than or equal or greater than or equal]',
        '⋚',
    ],
    ['ll', '\\ll', true, '&Lt;', '<<', '<<', '≪'],
    ['Ll', '\\lll', true, '&Ll;', '<<<', '<<<', '⋘'],
    ['lll', '\\lll', true, '&Ll;', '<<<', '<<<', '⋘'],
    ['gg', '\\gg', true, '&Gt;', '>>', '>>', '≫'],
    ['Gg', '\\ggg', true, '&Gg;', '>>>', '>>>', '⋙'],
    ['ggg', '\\ggg', true, '&Gg;', '>>>', '>>>', '⋙'],
    ['prec', '\\prec', true, '&pr;', '[precedes]', '[precedes]', '≺'],
    [
        'preceq',
        '\\preceq',
        true,
        '&prcue;',
        '[precedes or equal]',
        '[precedes or equal]',
        '≼',
    ],
    [
        'preccurlyeq',
        '\\preccurlyeq',
        true,
        '&prcue;',
        '[precedes or equal]',
        '[precedes or equal]',
        '≼',
    ],
    ['succ', '\\succ', true, '&sc;', '[succeeds]', '[succeeds]', '≻'],
    [
        'succeq',
        '\\succeq',
        true,
        '&sccue;',
        '[succeeds or equal]',
        '[succeeds or equal]',
        '≽',
    ],
    [
        'succcurlyeq',
        '\\succcurlyeq',
        true,
        '&sccue;',
        '[succeeds or equal]',
        '[succeeds or equal]',
        '≽',
    ],
    ['sub', '\\subset', true, '&sub;', '[subset of]', '[subset of]', '⊂'],
    ['subset', '\\subset', true, '&sub;', '[subset of]', '[subset of]', '⊂'],
    ['sup', '\\supset', true, '&sup;', '[superset of]', '[superset of]', '⊃'],
    ['supset', '\\supset', true, '&sup;', '[superset of]', '[superset of]', '⊃'],
    [
        'nsub',
        '\\not\\subset',
        true,
        '&nsub;',
        '[not a subset of]',
        '[not a subset of',
        '⊄',
    ],
    [
        'sube',
        '\\subseteq',
        true,
        '&sube;',
        '[subset of or equal to]',
        '[subset of or equal to]',
        '⊆',
    ],
    [
        'nsup',
        '\\not\\supset',
        true,
        '&nsup;',
        '[not a superset of]',
        '[not a superset of]',
        '⊅',
    ],
    [
        'supe',
        '\\supseteq',
        true,
        '&supe;',
        '[superset of or equal to]',
        '[superset of or equal to]',
        '⊇',
    ],
    ['setminus', '\\setminus', true, '&setminus;', '" ', '"', '⧵'],
    ['forall', '\\forall', true, '&forall;', '[for all]', '[for all]', '∀'],
    [
        'exist',
        '\\exists',
        true,
        '&exist;',
        '[there exists]',
        '[there exists]',
        '∃',
    ],
    [
        'exists',
        '\\exists',
        true,
        '&exist;',
        '[there exists]',
        '[there exists]',
        '∃',
    ],
    [
        'nexist',
        '\\nexists',
        true,
        '&exist;',
        '[there does not exists]',
        '[there does not  exists]',
        '∄',
    ],
    [
        'nexists',
        '\\nexists',
        true,
        '&exist;',
        '[there does not exists]',
        '[there does not  exists]',
        '∄',
    ],
    ['empty', '\\emptyset', true, '&empty;', '[empty set]', '[empty set]', '∅'],
    [
        'emptyset',
        '\\emptyset',
        true,
        '&empty;',
        '[empty set]',
        '[empty set]',
        '∅',
    ],
    ['isin', '\\in', true, '&isin;', '[element of]', '[element of]', '∈'],
    ['in', '\\in', true, '&isin;', '[element of]', '[element of]', '∈'],
    [
        'notin',
        '\\notin',
        true,
        '&notin;',
        '[not an element of]',
        '[not an element of]',
        '∉',
    ],
    [
        'ni',
        '\\ni',
        true,
        '&ni;',
        '[contains as member]',
        '[contains as member]',
        '∋',
    ],
    ['nabla', '\\nabla', true, '&nabla;', '[nabla]', '[nabla]', '∇'],
    ['ang', '\\angle', true, '&ang;', '[angle]', '[angle]', '∠'],
    ['angle', '\\angle', true, '&ang;', '[angle]', '[angle]', '∠'],
    ['perp', '\\perp', true, '&perp;', '[up tack]', '[up tack]', '⊥'],
    ['parallel', '\\parallel', true, '&parallel;', '||', '||', '∥'],
    ['sdot', '\\cdot', true, '&sdot;', '[dot]', '[dot]', '⋅'],
    ['cdot', '\\cdot', true, '&sdot;', '[dot]', '[dot]', '⋅'],
    [
        'lceil',
        '\\lceil',
        true,
        '&lceil;',
        '[left ceiling]',
        '[left ceiling]',
        '⌈',
    ],
    [
        'rceil',
        '\\rceil',
        true,
        '&rceil;',
        '[right ceiling]',
        '[right ceiling]',
        '⌉',
    ],
    ['lfloor', '\\lfloor', true, '&lfloor;', '[left floor]', '[left floor]', '⌊'],
    [
        'rfloor',
        '\\rfloor',
        true,
        '&rfloor;',
        '[right floor]',
        '[right floor]',
        '⌋',
    ],
    ['lang', '\\langle', true, '&lang;', '<', '<', '⟨'],
    ['rang', '\\rangle', true, '&rang;', '>', '>', '⟩'],
    ['langle', '\\langle', true, '&lang;', '<', '<', '⟨'],
    ['rangle', '\\rangle', true, '&rang;', '>', '>', '⟩'],
    ['hbar', '\\hbar', true, '&hbar;', 'hbar', 'hbar', 'ℏ'],
    ['mho', '\\mho', true, '&mho;', 'mho', 'mho', '℧'],
    // ** Arrows
    ['larr', '\\leftarrow', true, '&larr;', '<-', '<-', '←'],
    ['leftarrow', '\\leftarrow', true, '&larr;', '<-', '<-', '←'],
    ['gets', '\\gets', true, '&larr;', '<-', '<-', '←'],
    ['lArr', '\\Leftarrow', true, '&lArr;', '<=', '<=', '⇐'],
    ['Leftarrow', '\\Leftarrow', true, '&lArr;', '<=', '<=', '⇐'],
    ['uarr', '\\uparrow', true, '&uarr;', '[uparrow]', '[uparrow]', '↑'],
    ['uparrow', '\\uparrow', true, '&uarr;', '[uparrow]', '[uparrow]', '↑'],
    ['uArr', '\\Uparrow', true, '&uArr;', '[dbluparrow]', '[dbluparrow]', '⇑'],
    ['Uparrow', '\\Uparrow', true, '&uArr;', '[dbluparrow]', '[dbluparrow]', '⇑'],
    ['rarr', '\\rightarrow', true, '&rarr;', '->', '->', '→'],
    ['to', '\\to', true, '&rarr;', '->', '->', '→'],
    ['rightarrow', '\\rightarrow', true, '&rarr;', '->', '->', '→'],
    ['rArr', '\\Rightarrow', true, '&rArr;', '=>', '=>', '⇒'],
    ['Rightarrow', '\\Rightarrow', true, '&rArr;', '=>', '=>', '⇒'],
    ['darr', '\\downarrow', true, '&darr;', '[downarrow]', '[downarrow]', '↓'],
    [
        'downarrow',
        '\\downarrow',
        true,
        '&darr;',
        '[downarrow]',
        '[downarrow]',
        '↓',
    ],
    [
        'dArr',
        '\\Downarrow',
        true,
        '&dArr;',
        '[dbldownarrow]',
        '[dbldownarrow]',
        '⇓',
    ],
    [
        'Downarrow',
        '\\Downarrow',
        true,
        '&dArr;',
        '[dbldownarrow]',
        '[dbldownarrow]',
        '⇓',
    ],
    ['harr', '\\leftrightarrow', true, '&harr;', '<->', '<->', '↔'],
    ['leftrightarrow', '\\leftrightarrow', true, '&harr;', '<->', '<->', '↔'],
    ['hArr', '\\Leftrightarrow', true, '&hArr;', '<=>', '<=>', '⇔'],
    ['Leftrightarrow', '\\Leftrightarrow', true, '&hArr;', '<=>', '<=>', '⇔'],
    ['crarr', '\\hookleftarrow', true, '&crarr;', "<-'", "<-'", '↵'],
    ['hookleftarrow', '\\hookleftarrow', true, '&crarr;', "<-'", "<-'", '↵'],
    // ** Function names
    ['arccos', '\\arccos', true, 'arccos', 'arccos', 'arccos', 'arccos'],
    ['arcsin', '\\arcsin', true, 'arcsin', 'arcsin', 'arcsin', 'arcsin'],
    ['arctan', '\\arctan', true, 'arctan', 'arctan', 'arctan', 'arctan'],
    ['arg', '\\arg', true, 'arg', 'arg', 'arg', 'arg'],
    ['cos', '\\cos', true, 'cos', 'cos', 'cos', 'cos'],
    ['cosh', '\\cosh', true, 'cosh', 'cosh', 'cosh', 'cosh'],
    ['cot', '\\cot', true, 'cot', 'cot', 'cot', 'cot'],
    ['coth', '\\coth', true, 'coth', 'coth', 'coth', 'coth'],
    ['csc', '\\csc', true, 'csc', 'csc', 'csc', 'csc'],
    ['deg', '\\deg', true, '&deg;', 'deg', 'deg', 'deg'],
    ['det', '\\det', true, 'det', 'det', 'det', 'det'],
    ['dim', '\\dim', true, 'dim', 'dim', 'dim', 'dim'],
    ['exp', '\\exp', true, 'exp', 'exp', 'exp', 'exp'],
    ['gcd', '\\gcd', true, 'gcd', 'gcd', 'gcd', 'gcd'],
    ['hom', '\\hom', true, 'hom', 'hom', 'hom', 'hom'],
    ['inf', '\\inf', true, 'inf', 'inf', 'inf', 'inf'],
    ['ker', '\\ker', true, 'ker', 'ker', 'ker', 'ker'],
    ['lg', '\\lg', true, 'lg', 'lg', 'lg', 'lg'],
    ['lim', '\\lim', true, 'lim', 'lim', 'lim', 'lim'],
    ['liminf', '\\liminf', true, 'liminf', 'liminf', 'liminf', 'liminf'],
    ['limsup', '\\limsup', true, 'limsup', 'limsup', 'limsup', 'limsup'],
    ['ln', '\\ln', true, 'ln', 'ln', 'ln', 'ln'],
    ['log', '\\log', true, 'log', 'log', 'log', 'log'],
    ['max', '\\max', true, 'max', 'max', 'max', 'max'],
    ['min', '\\min', true, 'min', 'min', 'min', 'min'],
    ['Pr', '\\Pr', true, 'Pr', 'Pr', 'Pr', 'Pr'],
    ['sec', '\\sec', true, 'sec', 'sec', 'sec', 'sec'],
    ['sin', '\\sin', true, 'sin', 'sin', 'sin', 'sin'],
    ['sinh', '\\sinh', true, 'sinh', 'sinh', 'sinh', 'sinh'],
    ['sup', '\\sup', true, '&sup;', 'sup', 'sup', 'sup'],
    ['tan', '\\tan', true, 'tan', 'tan', 'tan', 'tan'],
    ['tanh', '\\tanh', true, 'tanh', 'tanh', 'tanh', 'tanh'],
    // ** Signs & Symbols
    ['bull', '\\textbullet{}', false, '&bull;', '*', '*', '•'],
    ['bullet', '\\textbullet{}', false, '&bull;', '*', '*', '•'],
    ['star', '\\star', true, '*', '*', '*', '⋆'],
    ['lowast', '\\ast', true, '&lowast;', '*', '*', '∗'],
    ['ast', '\\ast', true, '&lowast;', '*', '*', '*'],
    ['odot', '\\odot', true, 'o', '[circled dot]', '[circled dot]', 'ʘ'],
    [
        'oplus',
        '\\oplus',
        true,
        '&oplus;',
        '[circled plus]',
        '[circled plus]',
        '⊕',
    ],
    [
        'otimes',
        '\\otimes',
        true,
        '&otimes;',
        '[circled times]',
        '[circled times]',
        '⊗',
    ],
    [
        'check',
        '\\checkmark',
        true,
        '&checkmark;',
        '[checkmark]',
        '[checkmark]',
        '✓',
    ],
    [
        'checkmark',
        '\\checkmark',
        true,
        '&check;',
        '[checkmark]',
        '[checkmark]',
        '✓',
    ],
    // ** Miscellaneous (seldom used)
    ['para', '\\P{}', false, '&para;', '[pilcrow]', '¶', '¶'],
    ['ordf', '\\textordfeminine{}', false, '&ordf;', '_a_', 'ª', 'ª'],
    ['ordm', '\\textordmasculine{}', false, '&ordm;', '_o_', 'º', 'º'],
    ['cedil', '\\c{}', false, '&cedil;', '[cedilla]', '¸', '¸'],
    ['oline', '\\overline{~}', true, '&oline;', '[overline]', '¯', '‾'],
    ['uml', '\\textasciidieresis{}', false, '&uml;', '[diaeresis]', '¨', '¨'],
    ['zwnj', '\\/{}', false, '&zwnj;', '', '', '‌'],
    ['zwj', '', false, '&zwj;', '', '', '‍'],
    ['lrm', '', false, '&lrm;', '', '', '‎'],
    ['rlm', '', false, '&rlm;', '', '', '‏'],
    // ** Smilies
    ['smiley', '\\ddot\\smile', true, '&#9786;', ':-)', ':-)', '☺'],
    ['blacksmile', '\\ddot\\smile', true, '&#9787;', ':-)', ':-)', '☻'],
    ['sad', '\\ddot\\frown', true, '&#9785;', ':-(', ':-(', '☹'],
    ['frowny', '\\ddot\\frown', true, '&#9785;', ':-(', ':-(', '☹'],
    // ** Suits
    ['clubs', '\\clubsuit', true, '&clubs;', '[clubs]', '[clubs]', '♣'],
    ['clubsuit', '\\clubsuit', true, '&clubs;', '[clubs]', '[clubs]', '♣'],
    ['spades', '\\spadesuit', true, '&spades;', '[spades]', '[spades]', '♠'],
    ['spadesuit', '\\spadesuit', true, '&spades;', '[spades]', '[spades]', '♠'],
    ['hearts', '\\heartsuit', true, '&hearts;', '[hearts]', '[hearts]', '♥'],
    [
        'heartsuit',
        '\\heartsuit',
        true,
        '&heartsuit;',
        '[hearts]',
        '[hearts]',
        '♥',
    ],
    ['diams', '\\diamondsuit', true, '&diams;', '[diamonds]', '[diamonds]', '◆'],
    [
        'diamondsuit',
        '\\diamondsuit',
        true,
        '&diams;',
        '[diamonds]',
        '[diamonds]',
        '◆',
    ],
    [
        'diamond',
        '\\diamondsuit',
        true,
        '&diamond;',
        '[diamond]',
        '[diamond]',
        '◆',
    ],
    [
        'Diamond',
        '\\diamondsuit',
        true,
        '&diamond;',
        '[diamond]',
        '[diamond]',
        '◆',
    ],
    ['loz', '\\lozenge', true, '&loz;', '[lozenge]', '[lozenge]', '⧫'],
    ['_ ', '\\hspace*{0.5em}', false, '&ensp;', ' ', ' ', ' '],
    ['_  ', '\\hspace*{1.0em}', false, '&ensp;&ensp;', '  ', '  ', '  '],
    [
        '_   ',
        '\\hspace*{1.5em}',
        false,
        '&ensp;&ensp;&ensp;',
        '   ',
        '   ',
        '   ',
    ],
    [
        '_    ',
        '\\hspace*{2.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;',
        '    ',
        '    ',
        '    ',
    ],
    [
        '_     ',
        '\\hspace*{2.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;',
        '     ',
        '     ',
        '     ',
    ],
    [
        '_      ',
        '\\hspace*{3.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '      ',
        '      ',
        '      ',
    ],
    [
        '_       ',
        '\\hspace*{3.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '       ',
        '       ',
        '       ',
    ],
    [
        '_        ',
        '\\hspace*{4.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '        ',
        '        ',
        '        ',
    ],
    [
        '_         ',
        '\\hspace*{4.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '         ',
        '         ',
        '         ',
    ],
    [
        '_          ',
        '\\hspace*{5.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '          ',
        '          ',
        '          ',
    ],
    [
        '_           ',
        '\\hspace*{5.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '           ',
        '           ',
        '           ',
    ],
    [
        '_            ',
        '\\hspace*{6.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '            ',
        '            ',
        '            ',
    ],
    [
        '_             ',
        '\\hspace*{6.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '             ',
        '             ',
        '             ',
    ],
    [
        '_              ',
        '\\hspace*{7.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '              ',
        '              ',
        '              ',
    ],
    [
        '_               ',
        '\\hspace*{7.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '               ',
        '               ',
        '               ',
    ],
    [
        '_                ',
        '\\hspace*{8.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '                ',
        '                ',
        '                ',
    ],
    [
        '_                 ',
        '\\hspace*{8.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '                 ',
        '                 ',
        '                 ',
    ],
    [
        '_                  ',
        '\\hspace*{9.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '                  ',
        '                  ',
        '                  ',
    ],
    [
        '_                   ',
        '\\hspace*{9.5em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '                   ',
        '                   ',
        '                   ',
    ],
    [
        '_                    ',
        '\\hspace*{10.0em}',
        false,
        '&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;',
        '                    ',
        '                    ',
        '                    ',
    ],
];

});

var utils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbatimRe = exports.emphRe = exports.unescapeCodeInString = exports.greaterElements = exports.restrictionFor = exports.listEndRe = exports.fullItemRe = exports.itemRe = exports.paragraphSeparateRe = exports.linkTypesRe = exports.linkPlainRe = exports.linkTypes = exports.emphasisRegexpComponents = exports.todoKeywords = exports.defaultOptions = void 0;
exports.defaultOptions = {
    todoKeywords: ['TODO', 'DONE'],
    emphasisRegexpComponents: {
        pre: '-–—\\s\\(\'"\\{',
        post: '-–—\\s.,:!?;\'"\\)\\}\\[',
        border: '\\s',
        body: '.',
        newline: 1,
    },
    linkTypes: [
        'eww',
        'rmail',
        'mhe',
        'irc',
        'info',
        'gnus',
        'docview',
        'bbdb',
        'w3m',
        'printindex',
        'index',
        'bibentry',
        'Autocites',
        'autocites',
        'supercites',
        'Textcites',
        'textcites',
        'Smartcites',
        'smartcites',
        'footcitetexts',
        'footcites',
        'Parencites',
        'parencites',
        'Cites',
        'cites',
        'fnotecite',
        'Pnotecite',
        'pnotecite',
        'Notecite',
        'notecite',
        'footfullcite',
        'fullcite',
        'citeurl',
        'citedate*',
        'citedate',
        'citetitle*',
        'citetitle',
        'Citeauthor*',
        'Autocite*',
        'autocite*',
        'Autocite',
        'autocite',
        'supercite',
        'parencite*',
        'cite*',
        'Smartcite',
        'smartcite',
        'Textcite',
        'textcite',
        'footcitetext',
        'footcite',
        'Parencite',
        'parencite',
        'Cite',
        'Citeauthor',
        'Citealp',
        'Citealt',
        'Citep',
        'Citet',
        'citeyearpar',
        'citeyear*',
        'citeyear',
        'citeauthor*',
        'citeauthor',
        'citetext',
        'citenum',
        'citealp*',
        'citealp',
        'citealt*',
        'citealt',
        'citep*',
        'citep',
        'citet*',
        'citet',
        'nocite',
        'cite',
        'Cref',
        'cref',
        'autoref',
        'eqref',
        'nameref',
        'pageref',
        'ref',
        'label',
        'list-of-tables',
        'list-of-figures',
        'addbibresource',
        'bibliographystyle',
        'printbibliography',
        'nobibliography',
        'bibliography',
        'Acp',
        'acp',
        'Ac',
        'ac',
        'acrfull',
        'acrlong',
        'acrshort',
        'glslink',
        'glsdesc',
        'glssymbol',
        'Glspl',
        'Gls',
        'glspl',
        'gls',
        'bibtex',
        'roam',
        'notmuch-tree',
        'notmuch-search',
        'notmuch',
        'attachment',
        'id',
        'file+sys',
        'file+emacs',
        'shell',
        'news',
        'mailto',
        'https',
        'http',
        'ftp',
        'help',
        'file',
        'elisp',
        'do',
    ],
};
exports.todoKeywords = exports.defaultOptions.todoKeywords, exports.emphasisRegexpComponents = exports.defaultOptions.emphasisRegexpComponents, exports.linkTypes = exports.defaultOptions.linkTypes;
function linkPlainRe() {
    return `${linkTypesRe()}:([^\\]\\[ \t\\n()<>]+(?:\\([\\w0-9_]+\\)|([^\\W \t\\n]|/)))`;
}
exports.linkPlainRe = linkPlainRe;
function linkTypesRe() {
    const linkTypes = exports.defaultOptions.linkTypes;
    return '(' + linkTypes.map((t) => t.replace(/\*/g, '\\*')).join('|') + ')';
}
exports.linkTypesRe = linkTypesRe;
function paragraphSeparateRe() {
    const plainListOrderedItemTerminator = [')', '.'];
    const term = `[${plainListOrderedItemTerminator.join('')}]`;
    const alpha =  '|[A-Za-z]' ;
    return new RegExp([
        '^(?:',
        [
            // Headlines, inlinetasks.
            '\\*+ ',
            // Footnote definitions.
            '\\[fn:[-_\\w]+\\]',
            // Diary sexps.
            '%%\\(',
            '[ \\t]*(?:' +
                [
                    // Empty lines.
                    '$',
                    // Tables (any type).
                    '\\|',
                    '\\+(?:-+\\+)+[ \t]*$',
                    // Comments, keyword-like or block-like constructs.
                    // Blocks and keywords with dual values need to be
                    // double-checked.
                    '#(?: |$|\\+(?:begin_\\S+|\\S+(?:\\[.*\\])?:[ \\t]*))',
                    // Drawers (any type) and fixed-width areas. Drawers need
                    // to be double-checked.
                    ':(?: |$|[-_\\w]+:[ \\t]*$)',
                    // Horizontal rules.
                    '-{5,}[ \\t]*$',
                    // LaTeX environments.
                    `\\\\begin\\{([A-Za-z0-9*]+)\\}`,
                    // Clock lines.
                    `CLOCK:`,
                    // Lists.
                    `(?:[-+*]|(?:[0-9]+${alpha})${term})(?:[ \\t]|$)`,
                ].join('|') +
                ')',
        ].join('|'),
        ')',
    ].join(''), 'mi');
}
exports.paragraphSeparateRe = paragraphSeparateRe;
function itemRe() {
    return new RegExp(`^(?<indent> *)(\\*|-|\\+|\\d+\\.|\\d+\\)|\\w\\.|\\w\\))( |\\n)`);
}
exports.itemRe = itemRe;
/// Matches a list item and puts everything into groups:
/// - indent
/// - bullet
/// - counter
/// - checkbox
/// - tag (description tag)
function fullItemRe() {
    return /^(?<indent>[ \t]*)(?<bullet>(?:[-+*]|(?:[0-9]+|[A-Za-z])[.)])(?:[ \t]+|$))(?:\[@(?:start:)?(?<counter>[0-9]+|[A-Za-z])\][ \t]*)?(?:(?<checkbox>\[[ X-]\])(?:[ \t]+|$))?(?:(?<tag>.*)[ \t]+::(?:[ \t]+|$))?/im;
}
exports.fullItemRe = fullItemRe;
function listEndRe() {
    return /^[ \t]*\n[ \t]*\n/m;
}
exports.listEndRe = listEndRe;
function restrictionFor(type) {
    const allObjects = new Set([
        'bold',
        'code',
        'entity',
        'export-snippet',
        'footnote-reference',
        'inline-babel-call',
        'inline-src-block',
        'italic',
        'line-break',
        'latex-fragment',
        'link',
        'macro',
        'radio-target',
        'statistics-cookie',
        'strike-through',
        'subscript',
        'superscript',
        'table-cell',
        'target',
        'timestamp',
        'underline',
        'verbatim',
    ]);
    const minimalSet = new Set([
        'bold',
        'code',
        'entity',
        'italic',
        'latex-fragment',
        'strike-through',
        'subscript',
        'superscript',
        'underline',
        'verbatim',
    ]);
    const standardSet = new Set(allObjects);
    standardSet.delete('table-cell');
    const standardSetNoLineBreak = new Set(standardSet);
    standardSetNoLineBreak.delete('line-break');
    const keywordSet = new Set(standardSet);
    keywordSet.delete('footnote-reference');
    const objectRestrictions = {
        bold: standardSet,
        'footnote-reference': standardSet,
        headline: standardSetNoLineBreak,
        inlinetask: standardSetNoLineBreak,
        italic: standardSet,
        item: standardSetNoLineBreak,
        keyword: keywordSet,
        // Ignore all links in a link description.  Also ignore
        // radio-targets and line breaks.
        link: new Set([
            'export-snippet',
            'inline-babel-call',
            'inline-src-block',
            'macro',
            'statistics-cookie',
            ...minimalSet,
        ]),
        paragraph: standardSet,
        // Remove any variable object from radio target as it would
        // prevent it from being properly recognized.
        'radio-target': minimalSet,
        'strike-through': standardSet,
        subscript: standardSet,
        superscript: standardSet,
        // Ignore inline babel call and inline source block as formulas
        // are possible.  Also ignore line breaks and statistics
        // cookies.
        'table-cell': new Set([
            'export-snippet',
            'footnote-reference',
            'link',
            'macro',
            'radio-target',
            'target',
            'timestamp',
            ...minimalSet,
        ]),
        'table-row': new Set(['table-cell']),
        underline: standardSet,
        'verse-block': standardSet,
    };
    return objectRestrictions[type];
}
exports.restrictionFor = restrictionFor;
exports.greaterElements = new Set([
    'center-block',
    'drawer',
    'dynamic-block',
    'footnote-definition',
    'headline',
    'inlinetask',
    'item',
    'plain-list',
    'property-drawer',
    'quote-block',
    'section',
    'special-block',
    'table',
]);
function unescapeCodeInString(s) {
    return s.replace(/^[ \t]*,*(,)(?:\*|#\+)/gm, '');
}
exports.unescapeCodeInString = unescapeCodeInString;
function emphTemplate(s) {
    const { pre, post, border, newline, body: b } = exports.emphasisRegexpComponents;
    const body = newline <= 0 ? b : `${b}*?(?:\\n${b}*?){0,${newline}}`;
    return new RegExp([
        `([${pre}]|^)`,
        `(([${s}])([^${border}]|[^${border}]${body}[^${border}])\\3)`,
        `([${post}]|$)`,
    ].join(''));
}
function emphRe() {
    return emphTemplate('*/_+');
}
exports.emphRe = emphRe;
function verbatimRe() {
    return emphTemplate('=~');
}
exports.verbatimRe = verbatimRe;

});

var reader = createCommonjsModule(function (module, exports) {
var __classPrivateFieldSet = (commonjsGlobal && commonjsGlobal.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (commonjsGlobal && commonjsGlobal.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _text, _offset, _left, _right, _narrows;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = void 0;
class Reader {
    constructor(text) {
        _text.set(this, void 0);
        /// Current cursor position ignoring the narrowing boundaries.
        _offset.set(this, 0);
        /// Left boundary of the currently active narrowing.
        _left.set(this, void 0);
        /// Right boundary of the currently active narrowing (exclusive).
        _right.set(this, void 0);
        /// Array of currently active narrows.
        _narrows.set(this, []);
        __classPrivateFieldSet(this, _text, text);
        __classPrivateFieldSet(this, _left, 0);
        __classPrivateFieldSet(this, _right, text.length);
    }
    advance(n) {
        if (!n) ;
        else if (typeof n === 'number') {
            __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + n);
        }
        else if (typeof n === 'string') {
            if (this.rest().startsWith(n)) {
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + n.length);
            }
        }
        else {
            __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + (n.index + n[0].length));
        }
        return n;
    }
    /**
     * Move cursor backwards.
     */
    backoff(n) {
        __classPrivateFieldSet(this, _offset, Math.max(__classPrivateFieldGet(this, _left), __classPrivateFieldGet(this, _offset) - n));
    }
    match(regex) {
        return regex.exec(this.rest());
    }
    lookingAt(regex) {
        const m = this.match(regex);
        return (m === null || m === void 0 ? void 0 : m.index) === 0 ? m : null;
    }
    forceMatch(regex) {
        const m = this.match(regex);
        if (!m) {
            throw new Error(`match error: ${regex} against ${JSON.stringify(this.rest())}`);
        }
        return m;
    }
    forceLookingAt(regex) {
        const m = this.lookingAt(regex);
        if (!m) {
            throw new Error(`match (lookingAt) error: ${regex} against ${JSON.stringify(this.rest())}`);
        }
        return m;
    }
    peek(n) {
        return __classPrivateFieldGet(this, _text).substring(__classPrivateFieldGet(this, _offset), __classPrivateFieldGet(this, _offset) + n);
    }
    line() {
        const rest = this.rest();
        const endl = rest.indexOf('\n');
        return rest.substring(0, endl === -1 ? rest.length : endl + 1);
    }
    rest() {
        return __classPrivateFieldGet(this, _text).substring(__classPrivateFieldGet(this, _offset), __classPrivateFieldGet(this, _right));
    }
    /**
     * Returns string at [left, right).
     *
     * Ignores narrowing.
     */
    substring(left, right) {
        return __classPrivateFieldGet(this, _text).substring(left, right);
    }
    eof() {
        return __classPrivateFieldGet(this, _offset) >= __classPrivateFieldGet(this, _right);
    }
    offset() {
        return __classPrivateFieldGet(this, _offset);
    }
    endOffset() {
        return __classPrivateFieldGet(this, _right);
    }
    resetOffset(offset) {
        __classPrivateFieldSet(this, _offset, offset);
    }
    /**
     * Narrows buffer to the region [`left`, `right`).
     *
     * If `preserveOffset` is false (default), also resets cursor to the
     * start of the narrowing region.
     */
    narrow(left, right, preserveOffset = false) {
        __classPrivateFieldGet(this, _narrows).push({
            prevLeft: __classPrivateFieldGet(this, _left),
            prevRight: __classPrivateFieldGet(this, _right),
            prevOffset: __classPrivateFieldGet(this, _offset),
        });
        __classPrivateFieldSet(this, _left, left);
        __classPrivateFieldSet(this, _right, right);
        if (!preserveOffset) {
            __classPrivateFieldSet(this, _offset, left);
        }
    }
    /**
     * Cancels the previous narrowing operation.
     *
     * If `preserveOffset` is false (default), restores the cursor
     * position that was current when the narrowing was invoked.
     */
    widen(preserveOffset = false) {
        const narrow = __classPrivateFieldGet(this, _narrows).pop();
        if (narrow) {
            __classPrivateFieldSet(this, _left, narrow.prevLeft);
            __classPrivateFieldSet(this, _right, narrow.prevRight);
            if (!preserveOffset) {
                __classPrivateFieldSet(this, _offset, narrow.prevOffset);
            }
        }
    }
}
exports.Reader = Reader;
_text = new WeakMap(), _offset = new WeakMap(), _left = new WeakMap(), _right = new WeakMap(), _narrows = new WeakMap();

});

var parser = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const unist_builder_1 = __importDefault(unistBuilder);



function parse(text, options) {
    return new Parser(text, options).parse();
}
exports.parse = parse;
class Parser {
    constructor(text, options = {}) {
        this.r = new reader.Reader(text);
        this.options = Object.assign(Object.assign({}, utils.defaultOptions), options);
    }
    parse() {
        this.parseEmptyLines();
        const children = this.parseElements('first-section');
        return unist_builder_1.default('org-data', { contentsBegin: 0, contentsEnd: this.r.endOffset() }, children);
    }
    // General parsing structure
    parseElements(mode, structure) {
        const elements = [];
        let prevOffset = -1;
        while (!this.r.eof()) {
            const offset = this.r.offset();
            if (offset === prevOffset) {
                console.log('elements:', elements, 'rest:', JSON.stringify(this.r.rest()));
                throw new Error('no progress (elements)');
            }
            prevOffset = offset;
            const element = this.parseElement(mode, structure);
            const type = element.type;
            const cbeg = element.contentsBegin;
            const cend = element.contentsEnd;
            if (cbeg === undefined || cend === undefined) ;
            else if (utils.greaterElements.has(type)) {
                this.r.narrow(cbeg, cend);
                element.children = this.parseElements(Parser.nextMode(mode, type, true), structure !== null && structure !== void 0 ? structure : element === null || element === void 0 ? void 0 : element.structure);
                this.r.widen();
            }
            else {
                this.r.narrow(cbeg, cend);
                element.children = this.parseObjects(utils.restrictionFor(element.type));
                this.r.widen();
            }
            elements.push(element);
            mode = Parser.nextMode(mode, type, false);
        }
        return elements;
    }
    static nextMode(mode, type, parent) {
        if (parent) {
            if (type === 'headline')
                return 'section';
            if (mode === 'first-section' && type === 'section')
                return 'top-comment';
            if (type === 'inlinetask')
                return 'planning';
            if (type === 'plain-list')
                return 'item';
            if (type === 'property-drawer')
                return 'node-property';
            if (type === 'section')
                return 'planning';
            if (type === 'table')
                return 'table-row';
        }
        else {
            if (mode === 'item')
                return 'item';
            if (mode === 'node-property')
                return 'node-property';
            if (mode === 'planning' && type === 'planning')
                return 'property-drawer';
            if (mode === 'table-row')
                return 'table-row';
            if (mode === 'top-comment' && type === 'comment')
                return 'property-drawer';
        }
        return null;
    }
    parseElement(mode, structure) {
        var _a, _b;
        // Item.
        if (mode === 'item')
            return this.parseItem(structure);
        // Table Row.
        if (mode === 'table-row')
            return this.parseTableRow();
        // Node Property.
        if (mode === 'node-property')
            return this.parseNodeProperty();
        // Headline.
        if (this.atHeading())
            return this.parseHeadline();
        // Sections (must be checked after headline).
        if (mode === 'section')
            return this.parseSection();
        if (mode === 'first-section') {
            const nextHeading = this.r.match(/^\*+[ \t]/m);
            this.r.narrow(this.r.offset(), nextHeading ? this.r.offset() + nextHeading.index : this.r.endOffset());
            const result = this.parseSection();
            this.r.widen(true);
            return result;
        }
        // Comments.
        if (this.r.lookingAt(/^[ \t]*#(?: |$)/m)) {
            return this.parseComment();
        }
        // Planning.
        if (mode === 'planning' &&
            // TODO: check previous line is headline
            this.r.match(/^[ \t]*(CLOSED:|DEADLINE:|SCHEDULED:)/)) {
            return this.parsePlanning();
        }
        if ((mode === 'planning' ||
            // && TODO: check previous line is headline
            ((mode === 'property-drawer' || mode === 'top-comment') &&
                !this.r.lookingAt(/\s*$/m))) &&
            this.r.lookingAt(/^[ \t]*:PROPERTIES:[ \t]*\n(?:[ \t]*:\S+:(?: .*)?[ \t]*\n)*?[ \t]*:END:[ \t]*$/m)) {
            return this.parsePropertyDrawer();
        }
        // When not at beginning of line, point is at the beginning of an
        // item or a footnote definition: next item is always a paragraph.
        if (!(this.r.offset() === 0 ||
            this.r.substring(this.r.offset() - 1, this.r.offset()) === '\n')) {
            return this.parseParagraph({});
        }
        // Clock.
        if (this.r.lookingAt(/^[ \t]*CLOCK:/)) {
            return this.parseClock();
        }
        // TODO: Inlinetask.
        // From there, elements can have affiliated keywords.
        const affiliated = this.parseAffiliatedKeywords();
        // LaTeX Environment.
        if (this.r.lookingAt(latexBeginEnvironmentRe)) {
            return this.parseLatexEnvironment(affiliated);
        }
        // Drawer.
        if (this.r.lookingAt(drawerRe)) {
            return this.parseDrawer(affiliated);
        }
        // Fixed width
        if (this.r.lookingAt(/[ \t]*:( |$)/m)) {
            return this.parseFixedWidth(affiliated);
        }
        // Inline Comments, Blocks, Babel Calls, Dynamic Blocks and
        // Keywords.
        {
            const offset = this.r.offset();
            if (this.r.advance(this.r.match(/^[ \t]*#\+/))) {
                const blockM = this.r.match(/^begin_(\S+)/i);
                if (blockM) {
                    this.r.resetOffset(offset);
                    const blockType = blockM[1].toLowerCase();
                    switch (blockType) {
                        case 'center':
                            return this.parseBlock('center-block', 'center', affiliated);
                        case 'comment':
                            return this.parseCommentBlock(affiliated);
                        case 'example':
                            return this.parseExampleBlock(affiliated);
                        case 'export':
                            return this.parseExportBlock(affiliated);
                        case 'quote':
                            return this.parseBlock('quote-block', 'quote', affiliated);
                        case 'src':
                            return this.parseSrcBlock(affiliated);
                        case 'verse':
                            return this.parseBlock('verse-block', 'verse', affiliated);
                        default:
                            return this.parseSpecialBlock(affiliated);
                    }
                }
                // TODO: parse babel-call
                // TODO: parse dynamic-block
                if (this.r.match(/\S+:/)) {
                    this.r.resetOffset(offset);
                    return this.parseKeyword(affiliated);
                }
                // fallback: parse as paragraph
                this.r.resetOffset(offset);
                return this.parseParagraph(affiliated);
            }
        }
        // Footnote Definition.
        if (this.r.lookingAt(footnoteDefinitionRe)) {
            return this.parseFootnoteDefinition(affiliated);
        }
        // Horizontal Rule.
        if (this.r.lookingAt(/^[ \t]*-{5,}[ \t]*$/)) {
            return this.parseHorizontalRule(affiliated);
        }
        // Diary Sexp.
        if (this.r.lookingAt(/^%%\(/)) {
            return this.parseDiarySexp(affiliated);
        }
        // Table.
        // There is no strict definition of a table.el table. Try to
        // prevent false positive while being quick.
        const ruleRe = /[ \t]*\+(-+\+)+[ \t]*$/;
        if (this.r.lookingAt(/^[ \t]*\|/)) {
            return this.parseTable(affiliated);
        }
        else if (this.r.lookingAt(ruleRe)) {
            const offset = this.r.offset();
            const nextLineOffset = offset + this.r.line().length;
            const firstNonTable = (_b = (_a = this.r.match(/^[ \t]*($|[^|])/m)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : null;
            this.r.advance(firstNonTable);
            const isTable = this.r.offset() > nextLineOffset && this.r.lookingAt(ruleRe);
            this.r.resetOffset(offset);
            if (isTable) {
                return this.parseTable(affiliated);
            }
            // fallthrough
        }
        // List.
        if (this.r.match(utils.itemRe())) {
            if (structure === undefined) {
                const offset = this.r.offset();
                structure = this.parseListStructure();
                this.r.resetOffset(offset);
            }
            return this.parseList(structure, affiliated);
        }
        // Default element: Paragraph.
        return this.parseParagraph(affiliated);
    }
    parseObjects(restriction) {
        const objects = [];
        // offset where previously parsed object ends.
        let prevEnd = this.r.offset();
        while (!this.r.eof()) {
            const prevOffset = this.r.offset();
            const mobject = this.parseObject(restriction);
            if (!mobject)
                break;
            // Handle parseObject returning result without advancing the
            // cursor. This is always a programming error and leads to
            // infinite loop here.
            if (this.r.offset() === prevOffset) {
                throw new Error(`no progress (parseObject): ${JSON.stringify(mobject)}, text: ${JSON.stringify(this.r.rest())}, objects: ${JSON.stringify(objects, null, 2)}`);
            }
            const [objectBegin, o] = mobject;
            if (objectBegin !== prevEnd) {
                // parse text before object
                const value = this.r.substring(prevEnd, objectBegin);
                objects.push(unist_builder_1.default('text', { value }));
            }
            const cbeg = o.contentsBegin;
            const cend = o.contentsEnd;
            if (cbeg !== undefined && cend !== undefined) {
                this.r.narrow(cbeg, cend);
                o.children = this.parseObjects(utils.restrictionFor(o.type));
                this.r.widen();
            }
            objects.push(o);
            prevEnd = this.r.offset();
        }
        this.r.resetOffset(prevEnd);
        // handle text after the last object
        const text = this.r.rest();
        this.r.advance(text.length);
        if (text.trim().length) {
            objects.push(unist_builder_1.default('text', { value: text }));
        }
        return objects;
    }
    parseObject(restriction) {
        // table-cell only allowed inside table-row and always succeed.
        if (restriction.has('table-cell')) {
            return [this.r.offset(), this.parseTableCell()];
        }
        // 1. Search for pattern that probably starts an object.
        // 2. Try to parse object at that position.
        // 3. If not a valid object, advance by one char and repeat.
        const objectRe = new RegExp([
            // Sub/superscript.
            '(?:[_^][-{(*+.,\\p{Letter}\\p{Number}])',
            // Bold, code, italic, strike-through, underline
            // and verbatim.
            `[*~=+_/][^${utils.emphasisRegexpComponents.border}]`,
            // Plain links.
            utils.linkPlainRe(),
            // Objects starting with "[": regular link,
            // footnote reference, statistics cookie,
            // timestamp (inactive).
            [
                '\\[(?:',
                'fn:',
                '|',
                '\\[',
                '|',
                '[0-9]{4}-[0-9]{2}-[0-9]{2}',
                '|',
                '[0-9]*(?:%|/[0-9]*)\\]',
                ')',
            ].join(''),
            // Objects starting with "@": export snippets.
            '@@',
            // Objects starting with "{": macro.
            '\\{\\{\\{',
            // Objects starting with "<": timestamp (active, diary),
            // target, radio target and angular links.
            `<(?:%%|<|[0-9]|${utils.linkTypesRe()})`,
            // Objects starting with "$": latex fragment.
            '\\$',
            // Objects starting with "\": line break, entity, latex
            // fragment.
            '\\\\(?:[a-zA-Z\\[\\(]|\\\\[ \\t]*$|_ +)',
            // Objects starting with raw text: inline Babel source block,
            // inline Babel call.
            '(?:call|src)_',
        ].join('|'), 'mu');
        while (!this.r.eof()) {
            const m = this.r.match(objectRe);
            if (!m)
                return null;
            this.r.advance(m.index);
            const begin = this.r.offset();
            const o = this.tryParseObject(restriction);
            if (o) {
                if (begin === this.r.offset()) {
                    throw new Error('no progress (tryParseObject)');
                }
                return [begin, o];
            }
            this.r.resetOffset(begin);
            // Matching objectRegexp does not guarantee that we've found a
            // valid object (e.g., italic without closing /). Advance cursor
            // by one char and try searching for the next object.
            this.r.advance(1);
        }
        return null;
    }
    tryParseObject(restriction) {
        const c = this.r.peek(2);
        switch (c[0]) {
            case '_':
                if (restriction.has('underline')) {
                    return this.parseUnderline();
                }
                break;
            case '*':
                if (restriction.has('bold')) {
                    return this.parseBold();
                }
                break;
            case '/':
                if (restriction.has('italic')) {
                    return this.parseItalic();
                }
                break;
            case '~':
                if (restriction.has('code')) {
                    return this.parseCode();
                }
                break;
            case '=':
                if (restriction.has('verbatim')) {
                    return this.parseVerbatim();
                }
                break;
            case '+':
                if (restriction.has('strike-through')) {
                    return this.parseStrikeThrough();
                }
                break;
            case '$':
                if (restriction.has('latex-fragment')) {
                    return this.parseLatexFragment();
                }
                break;
            case '<':
                if (c[1] === '<') ;
                else {
                    const offset = this.r.offset();
                    const ts = restriction.has('timestamp') && this.parseTimestamp();
                    if (ts)
                        return ts;
                    this.r.resetOffset(offset);
                    const link = restriction.has('link') && this.parseLink();
                    if (link)
                        return link;
                    this.r.resetOffset(offset);
                }
                break;
            case '\\':
                if (c[1] === '\\') ;
                else {
                    const offset = this.r.offset();
                    const entity = restriction.has('entity') && this.parseEntity();
                    if (entity)
                        return entity;
                    this.r.resetOffset(offset);
                    const fragment = restriction.has('latex-fragment') && this.parseLatexFragment();
                    if (fragment)
                        return fragment;
                    this.r.resetOffset(offset);
                }
                break;
            case '[':
                if (c[1] === '[') {
                    // normal link
                    if (restriction.has('link')) {
                        return this.parseLink();
                    }
                }
                else if (c[1] === 'f') {
                    if (restriction.has('footnote-reference')) {
                        return this.parseFootnoteReference();
                    }
                }
                else {
                    const offset = this.r.offset();
                    const ts = restriction.has('timestamp') && this.parseTimestamp();
                    if (ts)
                        return ts;
                    this.r.resetOffset(offset);
                    // TODO: statistics cookie
                }
                break;
            default:
                // This is probably a plain link.
                if (restriction.has('link')) {
                    return this.parseLink();
                }
        }
        return null;
    }
    // Elements parsers
    parseHeadline() {
        var _a, _b, _c;
        const stars = this.r.advance(this.r.forceMatch(new RegExp(`^(\\*+)[ \\t]+`)));
        const level = stars[1].length;
        const todoM = this.r.advance(this.r.match(new RegExp('^' + this.options.todoKeywords.join('|'))));
        const todoKeyword = (_a = todoM === null || todoM === void 0 ? void 0 : todoM[0]) !== null && _a !== void 0 ? _a : null;
        this.r.advance(this.r.match(/^[ \t]*/));
        const priorityM = this.r.advance(this.r.match(/^\[#.\]/));
        const priority = (_b = priorityM === null || priorityM === void 0 ? void 0 : priorityM[0][2]) !== null && _b !== void 0 ? _b : null;
        this.r.advance(this.r.match(/^[ \t]*/));
        const commented = !!this.r.advance(this.r.match(/^COMMENT/));
        this.r.advance(this.r.match(/^[ \t]*/));
        const titleStart = this.r.offset();
        const tagsM = this.r.match(/^(.*?)[ \t]+:([\w@#%:]+):[ \t]*$/);
        const tags = (_c = tagsM === null || tagsM === void 0 ? void 0 : tagsM[2].split(':')) !== null && _c !== void 0 ? _c : [];
        const titleEnd = tagsM
            ? titleStart + tagsM.index + tagsM[1].length
            : titleStart + this.r.match(/.*/)[0].length;
        const rawValue = this.r.substring(titleStart, titleEnd);
        this.r.narrow(titleStart, titleEnd);
        const title = this.parseObjects(utils.restrictionFor('headline'));
        this.r.widen();
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        const contentsBegin = this.r.offset();
        const endOfSubtree = this.r.match(new RegExp(`^\\*{1,${level}}[ \\t]`, 'm'));
        const contentsEnd = endOfSubtree
            ? contentsBegin + endOfSubtree.index
            : this.r.endOffset();
        this.r.resetOffset(contentsEnd);
        return unist_builder_1.default('headline', {
            level,
            todoKeyword,
            priority,
            commented,
            rawValue,
            title,
            tags,
            contentsBegin,
            contentsEnd,
        }, []);
    }
    parsePlanning() {
        this.r.narrow(this.r.offset(), this.r.offset() + this.r.line().length);
        let scheduled = null;
        let deadline = null;
        let closed = null;
        while (true) {
            const m = this.r.match(/\b(SCHEDULED:|DEADLINE:|CLOSED:) *[\[<]([^\]>]+)[\]>]/);
            if (!m)
                break;
            this.r.advance(m.index + m[1].length);
            this.r.advance(this.r.match(/^[ \t]*/));
            const keyword = m[1];
            const time = this.parseTimestamp();
            if (keyword === 'SCHEDULED:')
                scheduled = time;
            if (keyword === 'DEADLINE:')
                deadline = time;
            if (keyword === 'CLOSED:')
                closed = time;
        }
        this.r.widen(true);
        this.parseEmptyLines();
        return unist_builder_1.default('planning', { scheduled, deadline, closed });
    }
    parseSection() {
        const begin = this.r.offset();
        const m = this.r.match(/^\*+[ \\t]/m);
        const end = m ? begin + m.index : this.r.endOffset();
        this.r.resetOffset(end);
        return unist_builder_1.default('section', { contentsBegin: begin, contentsEnd: end }, []);
    }
    parseBlock(type, pattern, affiliated) {
        const endM = this.r.match(new RegExp(`^[ \\t]*#\\+end_${pattern}[ \\t]*$`, 'im'));
        if (!endM) {
            // Incomplete block: parse it as a paragraph.
            return this.parseParagraph(affiliated);
        }
        const begin = this.r.offset();
        const contentsBegin = begin + this.r.line().length;
        const contentsEnd = begin + endM.index;
        this.r.resetOffset(contentsEnd);
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        const _end = this.r.offset();
        return unist_builder_1.default(type, { affiliated, contentsBegin, contentsEnd }, []);
    }
    parseComment() {
        let valueLines = [];
        while (true) {
            const m = this.r.lookingAt(/^[ \t]*# ?(.*)$/m);
            if (!m)
                break;
            this.r.advance(this.r.line());
            valueLines.push(m[1]);
        }
        const value = valueLines.join('\n');
        return unist_builder_1.default('comment', { value });
    }
    parseFixedWidth(affiliated) {
        let valueLines = [];
        while (true) {
            const m = this.r.lookingAt(/^[ \t]*: ?(.*)$/m);
            if (!m)
                break;
            this.r.advance(this.r.line());
            valueLines.push(m[1]);
        }
        const value = valueLines.join('\n');
        return unist_builder_1.default('fixed-width', { affiliated, value });
    }
    parseCommentBlock(affiliated) {
        const comment = this.parseBlock('comment-block', 'comment', affiliated);
        if (comment.type !== 'comment-block') {
            // parsed as paragraph
            return comment;
        }
        const value = this.r.substring(comment.contentsBegin, comment.contentsEnd);
        return unist_builder_1.default('comment-block', { affiliated, value });
    }
    parseSrcBlock(affiliated) {
        const endM = this.r.match(/^[ \t]*#\+end_src[ \t]*$/im);
        if (!endM) {
            // Incomplete block: parse it as a paragraph.
            return this.parseParagraph(affiliated);
        }
        const headerM = this.r.forceMatch(/^[ \t]*#\+begin_src(?: +(?<language>\S+))?(?<switches>(?: +(?:-(?:l ".+"|[ikr])|[-+]n(?: *[0-9]+)?))+)?(?<parameters>.*)[ \t]*$/im);
        const { language, switches, parameters } = headerM.groups;
        const begin = this.r.offset();
        const contentsBegin = begin + this.r.line().length;
        const contentsEnd = begin + endM.index;
        const value = utils.unescapeCodeInString(this.r.substring(contentsBegin, contentsEnd));
        this.r.resetOffset(contentsEnd);
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        const _end = this.r.offset();
        return unist_builder_1.default('src-block', { affiliated, language, value });
    }
    parseExampleBlock(affiliated) {
        // TODO: parse switches
        const block = this.parseBlock('example-block', 'example', affiliated);
        if (block.type !== 'example-block') {
            // parsed as paragraph
            return block;
        }
        const value = this.r.substring(block.contentsBegin, block.contentsEnd);
        return unist_builder_1.default('example-block', { affiliated, value });
    }
    parseExportBlock(affiliated) {
        var _a;
        const endM = this.r.match(/^[ \t]*#\+end_export[ \t]*$/im);
        if (!endM) {
            // Incomplete block: parse it as a paragraph.
            return this.parseParagraph(affiliated);
        }
        const headerM = this.r.forceMatch(/^[ \t]*#\+begin_export(?:[ \t]+(\S+))?[ \t]*$/im);
        const backend = (_a = headerM[1]) !== null && _a !== void 0 ? _a : null;
        const begin = this.r.offset();
        const contentsBegin = begin + this.r.line().length;
        const contentsEnd = begin + endM.index;
        const value = utils.unescapeCodeInString(this.r.substring(contentsBegin, contentsEnd));
        this.r.resetOffset(contentsEnd);
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        const _end = this.r.offset();
        return unist_builder_1.default('export-block', { affiliated, backend, value });
    }
    parseSpecialBlock(affiliated) {
        const blockType = this.r.match(/[ \t]*#\+begin_(\S+)/i)[1];
        const endM = this.r.match(
        // TODO: regexp-quote blockType
        new RegExp(`^[ \\t]*#\\+end_${blockType}[ \\t]*$`, 'im'));
        if (!endM) {
            console.log('incomplete block', blockType, this.r.rest());
            // Incomplete block: parse it as a paragraph.
            return this.parseParagraph(affiliated);
        }
        const begin = this.r.offset();
        const contentsBegin = begin + this.r.line().length;
        const contentsEnd = begin + endM.index;
        this.r.resetOffset(contentsEnd);
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        const _end = this.r.offset();
        return unist_builder_1.default('special-block', { affiliated, blockType, contentsBegin, contentsEnd }, []);
    }
    parseAffiliatedKeywords() {
        var _a, _b, _c, _d;
        const offset = this.r.offset();
        const result = {};
        while (!this.r.eof()) {
            const keywordM = this.r.lookingAt(affiliatedRe);
            if (!keywordM)
                break;
            const rawKeyword = ((_b = (_a = keywordM.groups.dualKeyword) !== null && _a !== void 0 ? _a : keywordM.groups.regularKeyword) !== null && _b !== void 0 ? _b : keywordM.groups.attributeKeyword).toUpperCase();
            const keyword = (_c = keywordTranslationTable[rawKeyword]) !== null && _c !== void 0 ? _c : rawKeyword;
            // true if keyword should have its value parsed
            const isParsed = parsedKeywords.has(keyword);
            this.r.advance(keywordM);
            this.r.narrow(this.r.offset(), this.r.offset() + this.r.line().length);
            const mainValue = isParsed
                ? this.parseObjects(utils.restrictionFor('keyword'))
                : this.r.rest().trim();
            this.r.widen();
            this.r.advance(this.r.line());
            const isDual = dualKeywords.has(keyword);
            const dualValue = isDual ? (_d = keywordM.groups.dualValue) !== null && _d !== void 0 ? _d : null : null;
            const value = dualValue === null ? mainValue : [mainValue, dualValue];
            if (multipleKeywords.has(keyword) ||
                // Attributes can always appear on multiple lines.
                keyword.match(/^ATTR_/)) {
                result[keyword] = result[keyword] || [];
                result[keyword].push(value);
            }
            else {
                result[keyword] = value;
            }
        }
        // If affiliated keywords are orphaned: move back to first one.
        // They will be parsed as a paragraph.
        if (this.r.lookingAt(/^[ \t]*$/m)) {
            this.r.resetOffset(offset);
            return {};
        }
        return result;
    }
    parseKeyword(affiliated) {
        const m = this.r.match(/[ \t]*#\+(\S+):(.*)/);
        const key = m[1].toUpperCase();
        const value = m[2].trim();
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        return unist_builder_1.default('keyword', { affiliated, key, value });
    }
    parseLatexEnvironment(affiliated) {
        const beginOffset = this.r.offset();
        const beginM = this.r.advance(this.r.forceLookingAt(latexBeginEnvironmentRe));
        const name = beginM[1];
        const endM = this.r.match(latexEndEnvironmentRe(name));
        if (!endM) {
            // Incomplete latex environment: parse it as a paragraph.
            this.r.resetOffset(beginOffset);
            return this.parseParagraph(affiliated);
        }
        this.r.advance(endM);
        const endOffset = this.r.offset();
        this.parseEmptyLines();
        const value = this.r.substring(beginOffset, endOffset);
        return unist_builder_1.default('latex-environment', { affiliated, value });
    }
    parsePropertyDrawer() {
        this.r.advance(this.r.line());
        const contentsBegin = this.r.offset();
        const endM = this.r.forceMatch(/^[ \t]*:END:[ \t]*$/m);
        this.r.advance(endM.index);
        const contentsEnd = this.r.offset();
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        return unist_builder_1.default('property-drawer', { contentsBegin, contentsEnd }, []);
    }
    parseDrawer(affiliated) {
        const endM = this.r.match(/^[ \t]*:END:[ \t]*$/m);
        if (!endM) {
            console.log('incomplete drawer');
            // Incomplete drawer: parse it as a paragraph.
            return this.parseParagraph(affiliated);
        }
        const contentsEnd = this.r.offset() + endM.index;
        const name = this.r.forceLookingAt(drawerRe)[1];
        this.r.advance(this.r.line());
        const contentsBegin = this.r.offset();
        this.r.resetOffset(contentsEnd);
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        return unist_builder_1.default('drawer', { affiliated, name, contentsBegin, contentsEnd }, []);
    }
    parseClock() {
        this.r.advance(this.r.forceMatch(/^[ \t]*CLOCK:[ \t]*/));
        const value = this.parseTimestamp();
        this.r.advance(this.r.match(/^[ \t]+=>[ \t]*/));
        const durationM = this.r.advance(this.r.lookingAt(/^(\S+)[ \t]*$/m));
        const duration = durationM ? durationM[1] : null;
        const status = duration ? 'closed' : 'running';
        this.parseEmptyLines();
        return unist_builder_1.default('clock', { value, duration, status });
    }
    parseNodeProperty() {
        var _a;
        const propertyRe = /^[ \t]*:(?<key>\S+):(?:(?<value1>$)|[ \t]+(?<value2>.*?))[ \t]*$/m;
        const m = this.r.forceLookingAt(propertyRe);
        const key = m.groups['key'];
        const value = (_a = m.groups['value1']) !== null && _a !== void 0 ? _a : m.groups['value2'];
        this.r.advance(this.r.line());
        return unist_builder_1.default('node-property', { key, value });
    }
    parseParagraph(affiliated) {
        const contentsBegin = this.r.offset();
        this.r.advance(this.r.line());
        let next = null;
        while ((next = this.r.match(utils.paragraphSeparateRe()))) {
            this.r.advance(next.index);
            // A matching `paragraphSeparateRe` is not necessarily the end
            // of the paragraph. In particular, drawers, blocks or LaTeX
            // environments opening lines must be closed.  Moreover keywords
            // with a secondary value must belong to "dual keywords".
            const blockBeginM = this.r.lookingAt(/[ \t]*#\+begin_(\S+)/i);
            if (blockBeginM) {
                const blockEndM = this.r.match(new RegExp(`^[ \\t]*#\\+end_${blockBeginM[1]}[ \\t]*$`, 'im'));
                if (!blockEndM) {
                    this.r.advance(this.r.line());
                    continue;
                }
                break;
            }
            const drawerM = this.r.lookingAt(drawerRe);
            if (drawerM) {
                const endM = this.r.match(/^[ \t]*:END:[ \t]*$/m);
                if (!endM) {
                    this.r.advance(this.r.line());
                    continue;
                }
                break;
            }
            const latexEnvironmentM = this.r.lookingAt(latexBeginEnvironmentRe);
            if (latexEnvironmentM) {
                const name = latexEnvironmentM[1];
                const endM = this.r.match(latexEndEnvironmentRe(name));
                if (!endM) {
                    this.r.advance(this.r.line());
                    continue;
                }
                break;
            }
            const dualKeywordM = this.r.lookingAt(/[ \t]*#\+(\S+)\[.*\]:/);
            if (dualKeywordM) {
                if (!dualKeywords.has(dualKeywordM[1].toLowerCase())) {
                    this.r.advance(this.r.line());
                    continue;
                }
                break;
            }
            // Everything else unambigously ends paragraph.
            break;
        }
        const contentsEnd = next ? this.r.offset() : this.r.endOffset();
        this.r.resetOffset(contentsEnd);
        this.parseEmptyLines();
        return unist_builder_1.default('paragraph', { affiliated, contentsBegin, contentsEnd }, []);
    }
    parseFootnoteDefinition(affiliated) {
        var _a;
        const m = this.r.forceLookingAt(footnoteDefinitionRe);
        const label = m[1];
        const begin = this.r.offset();
        this.r.advance(this.r.line());
        const endM = this.r.match(footnoteDefinitionSeparatorRe);
        this.r.advance(endM === null || endM === void 0 ? void 0 : endM.index);
        let contentsEnd = endM ? this.r.offset() : this.r.endOffset();
        if (endM && endM[0][0] === '[') {
            // At a new footnote definition, make sure we end before any
            // affiliated keyword above.
            let lines = this.r.substring(begin, this.r.offset()).split('\n');
            // drop first line because this is the line definition starts,
            // drop last line because it is empty.
            lines = lines.slice(1, lines.length - 1);
            while (lines.length) {
                const line = lines.pop();
                if (((_a = line.match(affiliatedRe)) === null || _a === void 0 ? void 0 : _a.index) === 0) {
                    // -1 to compensate for \n
                    this.r.advance(-line.length - 1);
                }
                else {
                    break;
                }
            }
            contentsEnd = this.r.offset();
        }
        this.r.narrow(begin, contentsEnd);
        this.r.advance(this.r.forceMatch(/\][ \r\t\n]/m));
        const contentsBegin = this.r.offset();
        this.r.widen();
        this.r.resetOffset(contentsEnd);
        this.parseEmptyLines();
        return unist_builder_1.default('footnote-definition', { affiliated, label, contentsBegin, contentsEnd }, []);
    }
    parseHorizontalRule(affiliated) {
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        return unist_builder_1.default('horizontal-rule', { affiliated });
    }
    parseDiarySexp(affiliated) {
        const value = this.r.forceLookingAt(/(%%\(.*)[ \t]*$/)[1];
        this.r.advance(this.r.line());
        this.parseEmptyLines();
        return unist_builder_1.default('diary-sexp', { affiliated, value });
    }
    parseTable(affiliated) {
        const contentsBegin = this.r.offset();
        const tableType = this.r.lookingAt(/^[ \t]*\|/)
            ? 'org'
            : 'table.el';
        const endRe = new RegExp(`^[ \\t]*($|[^| \\t${tableType === 'org' ? '' : '+'}])`, 'm');
        const endM = this.r.match(endRe);
        const contentsEnd = endM ? contentsBegin + endM.index : this.r.endOffset();
        this.r.resetOffset(contentsEnd);
        let tblfm = '';
        while (true) {
            const tblfmM = this.r.lookingAt(/^[ \t]*#\+TBLFM: +(.*?)[ \t]*$/m);
            if (!tblfmM)
                break;
            tblfm = tblfm + tblfmM[1];
            this.r.advance(this.r.line());
        }
        this.parseEmptyLines();
        if (tableType === 'org') {
            return unist_builder_1.default('table', { tableType, tblfm, contentsBegin, contentsEnd }, []);
        }
        else {
            return unist_builder_1.default('table', {
                affiliated,
                tableType,
                tblfm,
                value: this.r.substring(contentsBegin, contentsEnd),
            }, []);
        }
    }
    parseTableRow() {
        const rowType = this.r.lookingAt(/^[ \t]*\|-/)
            ? 'rule'
            : 'standard';
        this.r.advance(this.r.forceMatch(/\|/));
        const contentsBegin = this.r.offset();
        this.r.advance(this.r.forceMatch(/^.*?[ \t]*$/m));
        // A table rule has no contents. In that case, ensure
        // contentsBegin matches contentsEnd.
        const contentsEnd = rowType === 'rule' ? contentsBegin : this.r.offset();
        this.r.advance(this.r.line());
        return unist_builder_1.default('table-row', { rowType, contentsBegin, contentsEnd }, []);
    }
    parseTableCell() {
        this.r.advance(this.r.forceLookingAt(/^[ \t]*/));
        const contentsBegin = this.r.offset();
        const m = this.r.advance(this.r.forceLookingAt(/(.*?)[ \t]*(?:\||$)/m));
        const contentsEnd = contentsBegin + m[1].length;
        return unist_builder_1.default('table-cell', { contentsBegin, contentsEnd }, []);
    }
    parseList(structure, affiliated) {
        const contentsBegin = this.r.offset();
        const item = structure.find((x) => x.begin === contentsBegin);
        if (!item) {
            throw new Error(`parseList: cannot find item. contentsBegin: ${contentsBegin}, structure: ${JSON.stringify(structure, null, 2)}`);
        }
        const indent = item.indent;
        const listType = item.tag
            ? 'descriptive'
            : '-+*'.includes(item.bullet[0])
                ? 'unordered'
                : 'ordered';
        let pos = item.end;
        while (true) {
            const next = structure.find((x) => x.begin === pos && x.indent === indent);
            if (!next)
                break;
            pos = next.end;
        }
        const contentsEnd = pos;
        this.r.resetOffset(contentsEnd);
        return unist_builder_1.default('plain-list', { affiliated, indent, listType, contentsBegin, contentsEnd, structure }, []);
    }
    parseItem(structure) {
        var _a;
        const offset = this.r.offset();
        const m = this.r.advance(this.r.forceMatch(utils.fullItemRe()));
        const bullet = m.groups.bullet;
        const checkbox = m.groups.checkbox === '[ ]'
            ? 'off'
            : ((_a = m.groups.checkbox) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === '[x]'
                ? 'on'
                : m.groups.checkbox === '[-]'
                    ? 'trans'
                    : null;
        const item = structure.find((x) => x.begin === offset);
        const contentsBegin = this.r.offset();
        const contentsEnd = item.end;
        this.r.resetOffset(contentsEnd);
        return unist_builder_1.default('item', {
            indent: item.indent,
            bullet,
            checkbox,
            tag: item.tag,
            contentsBegin,
            contentsEnd,
        }, []);
    }
    parseListStructure() {
        var _a;
        const items = [];
        const struct = [];
        while (true) {
            if (this.r.eof() || ((_a = this.r.match(utils.listEndRe())) === null || _a === void 0 ? void 0 : _a.index) === 0) {
                break;
            }
            const m = this.r.match(utils.itemRe());
            if (m) {
                const indent = m.groups.indent.length;
                // end previous siblings
                while (items.length && items[items.length - 1].indent >= indent) {
                    const item = items.pop();
                    item.end = this.r.offset();
                    struct.push(item);
                }
                const fullM = this.r.forceMatch(utils.fullItemRe());
                const { bullet, counter, checkbox, tag } = fullM.groups;
                const item = {
                    begin: this.r.offset(),
                    indent,
                    bullet,
                    counter: counter !== null && counter !== void 0 ? counter : null,
                    checkbox: checkbox !== null && checkbox !== void 0 ? checkbox : null,
                    tag: tag !== null && tag !== void 0 ? tag : null,
                    // will be overwritten later
                    end: this.r.offset(),
                };
                items.push(item);
                this.r.advance(this.r.line());
            }
            else if (this.r.match(/^[ \t]*\n/)) {
                // skip empty lines
                this.r.advance(this.r.line());
            }
            else {
                // At some text line. Check if it ends any previous item.
                const indent = this.r.match(/^[ \t]*/)[0].length;
                while (items.length && items[items.length - 1].indent >= indent) {
                    const item = items.pop();
                    item.end = this.r.offset();
                    struct.push(item);
                }
                if (!items.length) {
                    // closed full list
                    break;
                }
                // TODO: skip blocks
                this.r.advance(this.r.line());
            }
        }
        this.parseEmptyLines();
        // list end: close all items
        const end = this.r.offset();
        items.forEach((item) => {
            item.end = end;
        });
        struct.push(...items);
        return struct.sort((a, b) => a.begin - b.begin);
    }
    // Object parsers.
    parseUnderline() {
        // backoff one char to check border
        this.r.backoff(1);
        const m = this.r.lookingAt(utils.emphRe());
        if (!m)
            return null;
        const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
        const contentsEnd = contentsBegin + m[4].length;
        this.r.resetOffset(contentsEnd + 1);
        return unist_builder_1.default('underline', { contentsBegin, contentsEnd }, []);
    }
    parseBold() {
        // backoff one char to check border
        this.r.backoff(1);
        const m = this.r.lookingAt(utils.emphRe());
        if (!m)
            return null;
        const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
        const contentsEnd = contentsBegin + m[4].length;
        this.r.resetOffset(contentsEnd + 1);
        return unist_builder_1.default('bold', { contentsBegin, contentsEnd }, []);
    }
    parseItalic() {
        // backoff one char to check border
        this.r.backoff(1);
        const m = this.r.lookingAt(utils.emphRe());
        if (!m)
            return null;
        const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
        const contentsEnd = contentsBegin + m[4].length;
        this.r.resetOffset(contentsEnd + 1);
        return unist_builder_1.default('italic', { contentsBegin, contentsEnd }, []);
    }
    parseCode() {
        // backoff one char to check border
        this.r.backoff(1);
        const m = this.r.lookingAt(utils.verbatimRe());
        if (!m)
            return null;
        const value = m[4];
        const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
        const contentsEnd = contentsBegin + m[4].length;
        this.r.resetOffset(contentsEnd + 1);
        return unist_builder_1.default('code', { value }, []);
    }
    parseVerbatim() {
        this.r.backoff(1);
        const m = this.r.lookingAt(utils.verbatimRe());
        if (!m)
            return null;
        const value = m[4];
        const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
        const contentsEnd = contentsBegin + m[4].length;
        this.r.resetOffset(contentsEnd + 1);
        return unist_builder_1.default('verbatim', { value }, []);
    }
    parseStrikeThrough() {
        // backoff one char to check border
        this.r.backoff(1);
        const m = this.r.lookingAt(utils.emphRe());
        if (!m)
            return null;
        const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
        const contentsEnd = contentsBegin + m[4].length;
        this.r.resetOffset(contentsEnd + 1);
        return unist_builder_1.default('strike-through', { contentsBegin, contentsEnd }, []);
    }
    parseEntity() {
        var _a;
        const m = this.r.advance(this.r.lookingAt(/^\\(?:(?<value1>_ +)|(?<value2>there4|sup[123]|frac[13][24]|[a-zA-Z]+)(?<brackets>$|\{\}|\P{Letter}))/mu));
        if (!m)
            return null;
        const hasBrackets = m.groups.brackets === '{}';
        const value = entities.getOrgEntity((_a = m.groups.value1) !== null && _a !== void 0 ? _a : m.groups.value2);
        if (!value)
            return null;
        return unist_builder_1.default('entity', Object.assign({ useBrackets: hasBrackets }, value));
    }
    parseLatexFragment() {
        const begin = this.r.offset();
        const prefix = this.r.peek(2);
        if (prefix[0] !== '$') {
            switch (prefix[1]) {
                case '(':
                    this.r.advance(this.r.match(/\)/));
                    break;
                case '[':
                    this.r.advance(this.r.match(/\]/));
                    break;
                default: {
                    // Macro.
                    const m = this.r.advance(this.r.lookingAt(/^\\[a-zA-Z]+\*?((\[[^\]\[\n{}]*\])|(\{[^{}\n]*\}))*/));
                }
            }
        }
        else if (prefix[1] === '$') {
            this.r.advance(this.r.match(/\$\$.*?\$\$/));
        }
        else {
            const charBefore = this.r.substring(this.r.offset() - 1, this.r.offset());
            if (charBefore !== '$' &&
                !' \t\n,.;'.includes(prefix[1]) &&
                this.r.advance(this.r.match(/\$.*?\$/)) &&
                !' \t\n,.'.includes(this.r.substring(this.r.offset() - 1, this.r.offset())) &&
                this.r.lookingAt(/^(\p{Punctuation}|\p{White_Space}|\p{Open_Punctuation}|\p{Close_Punctuation}|\\"|'|$)/mu)) ;
            else {
                return null;
            }
        }
        const end = this.r.offset();
        if (begin === end)
            return null;
        const value = this.r.substring(begin, end);
        return unist_builder_1.default('latex-fragment', { value });
    }
    parseFootnoteReference() {
        var _a;
        const begin = this.r.offset();
        const m = this.r.match(footnoteRe);
        if (!m)
            return null;
        // return true if match is found
        const advanceToClosingBracket = () => {
            while (true) {
                const m = this.r.advance(this.r.match(/[\[\]]/));
                if (!m)
                    return false;
                if (m[0] == '[') {
                    const closed = advanceToClosingBracket();
                    if (!closed)
                        return false;
                }
                return true;
            }
        };
        const closed = advanceToClosingBracket();
        if (!closed)
            return null;
        const end = this.r.offset();
        const contentsBegin = begin + m.index + m[0].length;
        const contentsEnd = end - 1;
        const footnoteType = m.groups.inline
            ? 'inline'
            : 'standard';
        const label = footnoteType === 'inline'
            ? (_a = m.groups.label_inline) !== null && _a !== void 0 ? _a : null : m.groups.label;
        if (footnoteType === 'inline') {
            return unist_builder_1.default('footnote-reference', {
                label,
                footnoteType,
                contentsBegin,
                contentsEnd,
            }, []);
        }
        else {
            return unist_builder_1.default('footnote-reference', { label, footnoteType }, []);
        }
    }
    parseLink() {
        const initialOffset = this.r.offset();
        const linkBracketRe = /\[\[(?<link>([^\[\]]|\\(\\\\)*[\[\]]|\\+[^\[\]])+)\](\[(?<text>.+?)\])?\]/;
        const c = this.r.peek(1);
        switch (c) {
            case '[': {
                // normal link [[http://example.com][text]]
                const m = this.r.match(linkBracketRe);
                this.r.advance(m);
                if (m) {
                    const contents = {};
                    if (m.groups.text) {
                        const contentsBegin = (contents.contentsBegin =
                            initialOffset + 2 + m.groups.link.length + 2);
                        contents.contentsEnd = contentsBegin + m.groups.text.length;
                    }
                    const linkType = m.groups.link.match(/(.+?):(.*)/);
                    return unist_builder_1.default('link', Object.assign({ format: 'bracket', linkType: linkType ? linkType[1] : 'fuzzy', rawLink: m.groups.link, path: linkType ? linkType[2] : m.groups.link }, contents), []);
                }
                break;
            }
            default: {
                // plain link
                const linkPlainRe = new RegExp(`\\b${utils.linkTypesRe()}:([^\\][ \\t\\n()<>]+(?:([\\w0-9_]+)|([^\\p{Punctuation} \\t\\n]|/)))`, 'u');
                const m = this.r.match(linkPlainRe);
                this.r.advance(m);
                if (m) {
                    return unist_builder_1.default('link', {
                        format: 'plain',
                        linkType: m[1],
                        rawLink: m[0],
                        path: m[2],
                    }, []);
                }
            }
        }
        return null;
    }
    parseTimestamp() {
        const active = this.r.substring(this.r.offset(), this.r.offset() + 1) === '<';
        const m = this.r.advance(this.r.match(/^([<[](%%)?.*?)[\]>](?:--([<[].*?[\]>]))?/));
        if (!m)
            return null;
        const rawValue = m[0];
        const dateStart = m[1];
        const dateEnd = m[3];
        const diary = !!m[2];
        let timeRange = null;
        if (!diary) {
            const timeM = dateStart.match(/[012]?[0-9]:[0-5][0-9](-([012]?[0-9]):([0-5][0-9]))/);
            if (timeM) {
                timeRange = { hour: Number(timeM[2]), minute: Number(timeM[3]) };
            }
        }
        const timestampType = diary
            ? 'diary'
            : active && (dateEnd || timeRange)
                ? 'active-range'
                : active
                    ? 'active'
                    : dateEnd || timeRange
                        ? 'inactive-range'
                        : 'inactive';
        // TODO: repeater props
        // TODO: warning props
        const start = diary ? null : Parser.parseDate(dateStart);
        const end = !start
            ? null
            : dateEnd
                ? Parser.parseDate(dateEnd)
                : timeRange
                    ? Object.assign(Object.assign({}, start), timeRange) : null;
        return unist_builder_1.default('timestamp', {
            timestampType,
            rawValue,
            start,
            end,
        });
    }
    // Helpers
    static parseDate(s) {
        const m = s.match(/(([0-9]{4})-([0-9]{2})-([0-9]{2})( +[^\]+0-9>\r\n -]+)?( +([0-9]{1,2}):([0-9]{2}))?)/);
        if (!m)
            return null;
        return {
            year: Number(m[2]),
            month: Number(m[3]),
            day: Number(m[4]),
            hour: m[7] ? Number(m[7]) : null,
            minute: m[8] ? Number(m[8]) : null,
        };
    }
    parseEmptyLines() {
        return Parser.parseMulti(() => {
            const line = this.r.line();
            if (line.trim().length === 0) {
                this.r.advance(line.length);
                return line;
            }
            return null;
        });
    }
    static parseMulti(parse) {
        const result = [];
        for (let x = parse(); x; x = parse()) {
            result.push(x);
        }
        return result;
    }
    atHeading() {
        return this.r.match(/^\*+ /) !== null;
    }
}
const drawerRe = /^[ \t]*:((?:\w|[-_])+):[ \t]*$/m;
const latexBeginEnvironmentRe = /^[ \t]*\\begin\{([A-Za-z0-9*]+)\}/i;
const latexEndEnvironmentRe = (name) => new RegExp(`\\\\end\\{${name}\\}[ \\t]*$`, 'mi');
const affiliatedKeywords = [
    'CAPTION',
    'DATA',
    'HEADER',
    'HEADERS',
    'LABEL',
    'NAME',
    'PLOT',
    'RESNAME',
    'RESULT',
    'RESULTS',
    'SOURCE',
    'SRCNAME',
    'TBLNAME',
];
const dualKeywords = new Set(['RESULTS', 'CAPTION']);
const parsedKeywords = new Set(['CAPTION']);
const multipleKeywords = new Set(['CAPTION', 'HEADER']);
const keywordTranslationTable = {
    DATA: 'NAME',
    LABEL: 'NAME',
    RESNAME: 'NAME',
    SOURCE: 'NAME',
    SRCNAME: 'NAME',
    TBLNAME: 'NAME',
    RESULT: 'RESULTS',
    HEADERS: 'HEADER',
};
const affiliatedRe = new RegExp([
    '[ \\t]*#\\+(?:',
    [
        // Dual affiliated keywords.
        `(?<dualKeyword>${[...dualKeywords].join('|')})(?:\\[(?<dualValue>.*)\\])?`,
        // Regular affiliated keywords.
        `(?<regularKeyword>${affiliatedKeywords
            .filter((x) => !dualKeywords.has(x))
            .join('|')})`,
        // Export attributes.
        `(?<attributeKeyword>ATTR_[-_A-Za-z0-9]+)`,
    ].join('|'),
    '):[ \\t]*',
].join(''), 'i');
const footnoteRe = /\[fn:(?:(?<label_inline>[-_\w]+)?(?<inline>:)|(?<label>[-_\w]+)\])/;
const footnoteDefinitionRe = /^\[fn:([-_\w]+)\]/;
const footnoteDefinitionSeparatorRe = /^\*|^\[fn:([-_\w]+)\]|^([ \t]*\n){2,}/m;

});

function orgParse() {
    this.Parser = parser.parse;
}
var _default = orgParse;


var unifiedOrgParse = /*#__PURE__*/Object.defineProperty({
	default: _default
}, '__esModule', {value: true});

var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const unified_org_parse_1 = __importDefault(unifiedOrgParse);
var lib$1 = unified_org_parse_1.default;

const processor = unified_1().use(lib$1);

module.exports = processor;
