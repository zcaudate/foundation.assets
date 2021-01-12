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

var immutable = extend$1;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend$1() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target
}

var schema = Schema;

var proto$1 = Schema.prototype;

proto$1.space = null;
proto$1.normal = {};
proto$1.property = {};

function Schema(property, normal, space) {
  this.property = property;
  this.normal = normal;

  if (space) {
    this.space = space;
  }
}

var merge_1 = merge;

function merge(definitions) {
  var length = definitions.length;
  var property = [];
  var normal = [];
  var index = -1;
  var info;
  var space;

  while (++index < length) {
    info = definitions[index];
    property.push(info.property);
    normal.push(info.normal);
    space = info.space;
  }

  return new schema(
    immutable.apply(null, property),
    immutable.apply(null, normal),
    space
  )
}

var normalize_1 = normalize$1;

function normalize$1(value) {
  return value.toLowerCase()
}

var info$1 = Info;

var proto$2 = Info.prototype;

proto$2.space = null;
proto$2.attribute = null;
proto$2.property = null;
proto$2.boolean = false;
proto$2.booleanish = false;
proto$2.overloadedBoolean = false;
proto$2.number = false;
proto$2.commaSeparated = false;
proto$2.spaceSeparated = false;
proto$2.commaOrSpaceSeparated = false;
proto$2.mustUseProperty = false;
proto$2.defined = false;

function Info(property, attribute) {
  this.property = property;
  this.attribute = attribute;
}

var powers = 0;

var boolean = increment();
var booleanish = increment();
var overloadedBoolean = increment();
var number = increment();
var spaceSeparated = increment();
var commaSeparated = increment();
var commaOrSpaceSeparated = increment();

function increment() {
  return Math.pow(2, ++powers)
}

var types = {
	boolean: boolean,
	booleanish: booleanish,
	overloadedBoolean: overloadedBoolean,
	number: number,
	spaceSeparated: spaceSeparated,
	commaSeparated: commaSeparated,
	commaOrSpaceSeparated: commaOrSpaceSeparated
};

var definedInfo = DefinedInfo;

DefinedInfo.prototype = new info$1();
DefinedInfo.prototype.defined = true;

var checks = [
  'boolean',
  'booleanish',
  'overloadedBoolean',
  'number',
  'commaSeparated',
  'spaceSeparated',
  'commaOrSpaceSeparated'
];
var checksLength = checks.length;

function DefinedInfo(property, attribute, mask, space) {
  var index = -1;
  var check;

  mark(this, 'space', space);

  info$1.call(this, property, attribute);

  while (++index < checksLength) {
    check = checks[index];
    mark(this, check, (mask & types[check]) === types[check]);
  }
}

function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}

var create_1 = create;

function create(definition) {
  var space = definition.space;
  var mustUseProperty = definition.mustUseProperty || [];
  var attributes = definition.attributes || {};
  var props = definition.properties;
  var transform = definition.transform;
  var property = {};
  var normal = {};
  var prop;
  var info;

  for (prop in props) {
    info = new definedInfo(
      prop,
      transform(attributes, prop),
      props[prop],
      space
    );

    if (mustUseProperty.indexOf(prop) !== -1) {
      info.mustUseProperty = true;
    }

    property[prop] = info;

    normal[normalize_1(prop)] = prop;
    normal[normalize_1(info.attribute)] = prop;
  }

  return new schema(property, normal, space)
}

var xlink = create_1({
  space: 'xlink',
  transform: xlinkTransform,
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});

function xlinkTransform(_, prop) {
  return 'xlink:' + prop.slice(5).toLowerCase()
}

var xml = create_1({
  space: 'xml',
  transform: xmlTransform,
  properties: {
    xmlLang: null,
    xmlBase: null,
    xmlSpace: null
  }
});

function xmlTransform(_, prop) {
  return 'xml:' + prop.slice(3).toLowerCase()
}

var caseSensitiveTransform_1 = caseSensitiveTransform;

function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute
}

var caseInsensitiveTransform_1 = caseInsensitiveTransform;

function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform_1(attributes, property.toLowerCase())
}

var xmlns = create_1({
  space: 'xmlns',
  attributes: {
    xmlnsxlink: 'xmlns:xlink'
  },
  transform: caseInsensitiveTransform_1,
  properties: {
    xmlns: null,
    xmlnsXLink: null
  }
});

var booleanish$1 = types.booleanish;
var number$1 = types.number;
var spaceSeparated$1 = types.spaceSeparated;

var aria = create_1({
  transform: ariaTransform,
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish$1,
    ariaAutoComplete: null,
    ariaBusy: booleanish$1,
    ariaChecked: booleanish$1,
    ariaColCount: number$1,
    ariaColIndex: number$1,
    ariaColSpan: number$1,
    ariaControls: spaceSeparated$1,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated$1,
    ariaDetails: null,
    ariaDisabled: booleanish$1,
    ariaDropEffect: spaceSeparated$1,
    ariaErrorMessage: null,
    ariaExpanded: booleanish$1,
    ariaFlowTo: spaceSeparated$1,
    ariaGrabbed: booleanish$1,
    ariaHasPopup: null,
    ariaHidden: booleanish$1,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated$1,
    ariaLevel: number$1,
    ariaLive: null,
    ariaModal: booleanish$1,
    ariaMultiLine: booleanish$1,
    ariaMultiSelectable: booleanish$1,
    ariaOrientation: null,
    ariaOwns: spaceSeparated$1,
    ariaPlaceholder: null,
    ariaPosInSet: number$1,
    ariaPressed: booleanish$1,
    ariaReadOnly: booleanish$1,
    ariaRelevant: null,
    ariaRequired: booleanish$1,
    ariaRoleDescription: spaceSeparated$1,
    ariaRowCount: number$1,
    ariaRowIndex: number$1,
    ariaRowSpan: number$1,
    ariaSelected: booleanish$1,
    ariaSetSize: number$1,
    ariaSort: null,
    ariaValueMax: number$1,
    ariaValueMin: number$1,
    ariaValueNow: number$1,
    ariaValueText: null,
    role: null
  }
});

function ariaTransform(_, prop) {
  return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
}

var boolean$1 = types.boolean;
var overloadedBoolean$1 = types.overloadedBoolean;
var booleanish$2 = types.booleanish;
var number$2 = types.number;
var spaceSeparated$2 = types.spaceSeparated;
var commaSeparated$1 = types.commaSeparated;

var html = create_1({
  space: 'html',
  attributes: {
    acceptcharset: 'accept-charset',
    classname: 'class',
    htmlfor: 'for',
    httpequiv: 'http-equiv'
  },
  transform: caseInsensitiveTransform_1,
  mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated$1,
    acceptCharset: spaceSeparated$2,
    accessKey: spaceSeparated$2,
    action: null,
    allow: null,
    allowFullScreen: boolean$1,
    allowPaymentRequest: boolean$1,
    allowUserMedia: boolean$1,
    alt: null,
    as: null,
    async: boolean$1,
    autoCapitalize: null,
    autoComplete: spaceSeparated$2,
    autoFocus: boolean$1,
    autoPlay: boolean$1,
    capture: boolean$1,
    charSet: null,
    checked: boolean$1,
    cite: null,
    className: spaceSeparated$2,
    cols: number$2,
    colSpan: null,
    content: null,
    contentEditable: booleanish$2,
    controls: boolean$1,
    controlsList: spaceSeparated$2,
    coords: number$2 | commaSeparated$1,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean$1,
    defer: boolean$1,
    dir: null,
    dirName: null,
    disabled: boolean$1,
    download: overloadedBoolean$1,
    draggable: booleanish$2,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean$1,
    formTarget: null,
    headers: spaceSeparated$2,
    height: number$2,
    hidden: boolean$1,
    high: number$2,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated$2,
    httpEquiv: spaceSeparated$2,
    id: null,
    imageSizes: null,
    imageSrcSet: commaSeparated$1,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean$1,
    itemId: null,
    itemProp: spaceSeparated$2,
    itemRef: spaceSeparated$2,
    itemScope: boolean$1,
    itemType: spaceSeparated$2,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean$1,
    low: number$2,
    manifest: null,
    max: null,
    maxLength: number$2,
    media: null,
    method: null,
    min: null,
    minLength: number$2,
    multiple: boolean$1,
    muted: boolean$1,
    name: null,
    nonce: null,
    noModule: boolean$1,
    noValidate: boolean$1,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextMenu: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean$1,
    optimum: number$2,
    pattern: null,
    ping: spaceSeparated$2,
    placeholder: null,
    playsInline: boolean$1,
    poster: null,
    preload: null,
    readOnly: boolean$1,
    referrerPolicy: null,
    rel: spaceSeparated$2,
    required: boolean$1,
    reversed: boolean$1,
    rows: number$2,
    rowSpan: number$2,
    sandbox: spaceSeparated$2,
    scope: null,
    scoped: boolean$1,
    seamless: boolean$1,
    selected: boolean$1,
    shape: null,
    size: number$2,
    sizes: null,
    slot: null,
    span: number$2,
    spellCheck: booleanish$2,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: commaSeparated$1,
    start: number$2,
    step: null,
    style: null,
    tabIndex: number$2,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean$1,
    useMap: null,
    value: booleanish$2,
    width: number$2,
    wrap: null,

    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null, // Several. Use CSS `text-align` instead,
    aLink: null, // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated$2, // `<object>`. List of URIs to archives
    axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null, // `<body>`. Use CSS `background-image` instead
    bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
    border: number$2, // `<table>`. Use CSS `border-width` instead,
    borderColor: null, // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number$2, // `<body>`
    cellPadding: null, // `<table>`
    cellSpacing: null, // `<table>`
    char: null, // Several table elements. When `align=char`, sets the character to align on
    charOff: null, // Several table elements. When `char`, offsets the alignment
    classId: null, // `<object>`
    clear: null, // `<br>`. Use CSS `clear` instead
    code: null, // `<object>`
    codeBase: null, // `<object>`
    codeType: null, // `<object>`
    color: null, // `<font>` and `<hr>`. Use CSS instead
    compact: boolean$1, // Lists. Use CSS to reduce space between items instead
    declare: boolean$1, // `<object>`
    event: null, // `<script>`
    face: null, // `<font>`. Use CSS instead
    frame: null, // `<table>`
    frameBorder: null, // `<iframe>`. Use CSS `border` instead
    hSpace: number$2, // `<img>` and `<object>`
    leftMargin: number$2, // `<body>`
    link: null, // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null, // `<img>`. Use a `<picture>`
    marginHeight: number$2, // `<body>`
    marginWidth: number$2, // `<body>`
    noResize: boolean$1, // `<frame>`
    noHref: boolean$1, // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean$1, // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean$1, // `<td>` and `<th>`
    object: null, // `<applet>`
    profile: null, // `<head>`
    prompt: null, // `<isindex>`
    rev: null, // `<link>`
    rightMargin: number$2, // `<body>`
    rules: null, // `<table>`
    scheme: null, // `<meta>`
    scrolling: booleanish$2, // `<frame>`. Use overflow in the child context
    standby: null, // `<object>`
    summary: null, // `<table>`
    text: null, // `<body>`. Use CSS `color` instead
    topMargin: number$2, // `<body>`
    valueType: null, // `<param>`
    version: null, // `<html>`. Use a doctype.
    vAlign: null, // Several. Use CSS `vertical-align` instead
    vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number$2, // `<img>` and `<object>`

    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean$1,
    disableRemotePlayback: boolean$1,
    prefix: null,
    property: null,
    results: number$2,
    security: null,
    unselectable: null
  }
});

var html_1 = merge_1([xml, xlink, xmlns, aria, html]);

var data = 'data';

var find_1 = find;

var valid = /^data[-\w.:]+$/i;
var dash = /-[a-z]/g;
var cap = /[A-Z]/g;

function find(schema, value) {
  var normal = normalize_1(value);
  var prop = value;
  var Type = info$1;

  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]]
  }

  if (normal.length > 4 && normal.slice(0, 4) === data && valid.test(value)) {
    // Attribute or property.
    if (value.charAt(4) === '-') {
      prop = datasetToProperty(value);
    } else {
      value = datasetToAttribute(value);
    }

    Type = definedInfo;
  }

  return new Type(prop, value)
}

function datasetToProperty(attribute) {
  var value = attribute.slice(5).replace(dash, camelcase);
  return data + value.charAt(0).toUpperCase() + value.slice(1)
}

function datasetToAttribute(property) {
  var value = property.slice(4);

  if (dash.test(value)) {
    return property
  }

  value = value.replace(cap, kebab);

  if (value.charAt(0) !== '-') {
    value = '-' + value;
  }

  return data + value
}

function kebab($0) {
  return '-' + $0.toLowerCase()
}

function camelcase($0) {
  return $0.charAt(1).toUpperCase()
}

var hastUtilParseSelector = parse;

var search = /[#.]/g;

// Create a hast element from a simple CSS selector.
function parse(selector, defaultTagName) {
  var value = selector || '';
  var name = defaultTagName || 'div';
  var props = {};
  var start = 0;
  var subvalue;
  var previous;
  var match;

  while (start < value.length) {
    search.lastIndex = start;
    match = search.exec(value);
    subvalue = value.slice(start, match ? match.index : value.length);

    if (subvalue) {
      if (!previous) {
        name = subvalue;
      } else if (previous === '#') {
        props.id = subvalue;
      } else if (props.className) {
        props.className.push(subvalue);
      } else {
        props.className = [subvalue];
      }

      start += subvalue.length;
    }

    if (match) {
      previous = match[0];
      start++;
    }
  }

  return {type: 'element', tagName: name, properties: props, children: []}
}

var parse_1 = parse$1;
var stringify_1 = stringify$1;

var empty = '';
var space = ' ';
var whiteSpace = /[ \t\n\r\f]+/g;

function parse$1(value) {
  var input = String(value || empty).trim();
  return input === empty ? [] : input.split(whiteSpace)
}

function stringify$1(values) {
  return values.join(space).trim()
}

var spaceSeparatedTokens = {
	parse: parse_1,
	stringify: stringify_1
};

var parse_1$1 = parse$2;
var stringify_1$1 = stringify$2;

var comma = ',';
var space$1 = ' ';
var empty$1 = '';

// Parse comma-separated tokens to an array.
function parse$2(value) {
  var values = [];
  var input = String(value || empty$1);
  var index = input.indexOf(comma);
  var lastIndex = 0;
  var end = false;
  var val;

  while (!end) {
    if (index === -1) {
      index = input.length;
      end = true;
    }

    val = input.slice(lastIndex, index).trim();

    if (val || !end) {
      values.push(val);
    }

    lastIndex = index + 1;
    index = input.indexOf(comma, lastIndex);
  }

  return values
}

// Compile an array to comma-separated tokens.
// `options.padLeft` (default: `true`) pads a space left of each token, and
// `options.padRight` (default: `false`) pads a space to the right of each token.
function stringify$2(values, options) {
  var settings = options || {};
  var left = settings.padLeft === false ? empty$1 : space$1;
  var right = settings.padRight ? space$1 : empty$1;

  // Ensure the last empty entry is seen.
  if (values[values.length - 1] === empty$1) {
    values = values.concat(empty$1);
  }

  return values.join(right + comma + left).trim()
}

var commaSeparatedTokens = {
	parse: parse_1$1,
	stringify: stringify_1$1
};

var spaces = spaceSeparatedTokens.parse;
var commas = commaSeparatedTokens.parse;

var factory_1 = factory;

var own$3 = {}.hasOwnProperty;

function factory(schema, defaultTagName, caseSensitive) {
  var adjust = caseSensitive ? createAdjustMap(caseSensitive) : null;

  return h

  // Hyperscript compatible DSL for creating virtual hast trees.
  function h(selector, properties) {
    var node = hastUtilParseSelector(selector, defaultTagName);
    var children = Array.prototype.slice.call(arguments, 2);
    var name = node.tagName.toLowerCase();
    var property;

    node.tagName = adjust && own$3.call(adjust, name) ? adjust[name] : name;

    if (properties && isChildren(properties, node)) {
      children.unshift(properties);
      properties = null;
    }

    if (properties) {
      for (property in properties) {
        addProperty(node.properties, property, properties[property]);
      }
    }

    addChild(node.children, children);

    if (node.tagName === 'template') {
      node.content = {type: 'root', children: node.children};
      node.children = [];
    }

    return node
  }

  function addProperty(properties, key, value) {
    var info;
    var property;
    var result;

    // Ignore nullish and NaN values.
    if (value === null || value === undefined || value !== value) {
      return
    }

    info = find_1(schema, key);
    property = info.property;
    result = value;

    // Handle list values.
    if (typeof result === 'string') {
      if (info.spaceSeparated) {
        result = spaces(result);
      } else if (info.commaSeparated) {
        result = commas(result);
      } else if (info.commaOrSpaceSeparated) {
        result = spaces(commas(result).join(' '));
      }
    }

    // Accept `object` on style.
    if (property === 'style' && typeof value !== 'string') {
      result = style(result);
    }

    // Class-names (which can be added both on the `selector` and here).
    if (property === 'className' && properties.className) {
      result = properties.className.concat(result);
    }

    properties[property] = parsePrimitives(info, property, result);
  }
}

function isChildren(value, node) {
  return (
    typeof value === 'string' ||
    'length' in value ||
    isNode(node.tagName, value)
  )
}

function isNode(tagName, value) {
  var type = value.type;

  if (tagName === 'input' || !type || typeof type !== 'string') {
    return false
  }

  if (typeof value.children === 'object' && 'length' in value.children) {
    return true
  }

  type = type.toLowerCase();

  if (tagName === 'button') {
    return (
      type !== 'menu' &&
      type !== 'submit' &&
      type !== 'reset' &&
      type !== 'button'
    )
  }

  return 'value' in value
}

function addChild(nodes, value) {
  var index;
  var length;

  if (typeof value === 'string' || typeof value === 'number') {
    nodes.push({type: 'text', value: String(value)});
    return
  }

  if (typeof value === 'object' && 'length' in value) {
    index = -1;
    length = value.length;

    while (++index < length) {
      addChild(nodes, value[index]);
    }

    return
  }

  if (typeof value !== 'object' || !('type' in value)) {
    throw new Error('Expected node, nodes, or string, got `' + value + '`')
  }

  nodes.push(value);
}

// Parse a (list of) primitives.
function parsePrimitives(info, name, value) {
  var index;
  var length;
  var result;

  if (typeof value !== 'object' || !('length' in value)) {
    return parsePrimitive(info, name, value)
  }

  length = value.length;
  index = -1;
  result = [];

  while (++index < length) {
    result[index] = parsePrimitive(info, name, value[index]);
  }

  return result
}

// Parse a single primitives.
function parsePrimitive(info, name, value) {
  var result = value;

  if (info.number || info.positiveNumber) {
    if (!isNaN(result) && result !== '') {
      result = Number(result);
    }
  } else if (info.boolean || info.overloadedBoolean) {
    // Accept `boolean` and `string`.
    if (
      typeof result === 'string' &&
      (result === '' || normalize_1(value) === normalize_1(name))
    ) {
      result = true;
    }
  }

  return result
}

function style(value) {
  var result = [];
  var key;

  for (key in value) {
    result.push([key, value[key]].join(': '));
  }

  return result.join('; ')
}

function createAdjustMap(values) {
  var length = values.length;
  var index = -1;
  var result = {};
  var value;

  while (++index < length) {
    value = values[index];
    result[value.toLowerCase()] = value;
  }

  return result
}

var html$1 = factory_1(html_1, 'div');
html$1.displayName = 'html';

var html_1$1 = html$1;

var hastscript = html_1$1;

var orgToHast_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgToHast = void 0;
const unist_builder_1 = __importDefault(unistBuilder);
const hastscript_1 = __importDefault(hastscript);
const defaultOptions = {
    imageFilenameExtensions: [
        'png',
        'jpeg',
        'jpg',
        'gif',
        'tiff',
        'tif',
        'xbm',
        'xpm',
        'pbm',
        'pgm',
        'ppm',
        'pnm',
        'svg',
    ],
};
function orgToHast(org, opts = {}) {
    const options = Object.assign(Object.assign({}, defaultOptions), opts);
    return toHast(org);
    function toHast(node) {
        if (Array.isArray(node)) {
            return node.map(toHast).filter((x) => x !== null && x !== undefined);
        }
        const org = node;
        switch (org.type) {
            case 'org-data':
                return hastscript_1.default('div', toHast(org.children));
            case 'headline': {
                if (org.commented)
                    return null;
                const intersperse = (items, sep) => items.flatMap((e) => [sep, e]).slice(1);
                const todo = org.todoKeyword
                    ? [
                        hastscript_1.default('span', { className: ['todo-keyword', org.todoKeyword] }, org.todoKeyword),
                        ' ',
                    ]
                    : null;
                const priority = org.priority
                    ? [hastscript_1.default('span', { className: 'priority' }, `[${org.priority}]`), ' ']
                    : null;
                const tags = org.tags.length
                    ? [
                        unist_builder_1.default('text', { value: '\xa0\xa0\xa0' }),
                        hastscript_1.default('span.tags', intersperse(org.tags.map((x) => hastscript_1.default('span.tag', { className: `tag-${x}` }, x)), '\xa0')),
                    ]
                    : null;
                return [
                    hastscript_1.default(`h${org.level}`, [todo, priority, toHast(org.title), tags].filter((x) => x)),
                    ...toHast(org.children),
                ];
            }
            case 'section':
                return toHast(org.children);
            case 'plain-list':
                if (org.listType === 'unordered') {
                    return hastscript_1.default('ul', toHast(org.children));
                }
                else if (org.listType === 'ordered') {
                    return hastscript_1.default('ol', toHast(org.children));
                }
                else {
                    return hastscript_1.default('dl', toHast(org.children));
                }
            case 'item':
                if (org.tag !== null) {
                    return [hastscript_1.default('dt', org.tag), hastscript_1.default('dd', toHast(org.children))];
                }
                else {
                    return hastscript_1.default('li', toHast(org.children));
                }
            case 'quote-block':
                return hastscript_1.default('blockquote', toHast(org.children));
            case 'src-block':
                return hastscript_1.default('pre', hastscript_1.default('code', {
                    className: org.language ? `language-${org.language}` : undefined,
                }, removeCommonIndent(org.value)));
            case 'verse-block':
                return hastscript_1.default('p.verse', toHast(org.children));
            case 'center-block':
                return hastscript_1.default('div.center', toHast(org.children));
            case 'comment-block':
                return null;
            case 'example-block':
                return hastscript_1.default('div.exampe', org.value);
            case 'export-block':
                if (org.backend === 'html') {
                    return unist_builder_1.default('raw', org.value);
                }
                return null;
            case 'special-block':
                return hastscript_1.default('div', toHast(org.children));
            case 'keyword':
                return null;
            case 'horizontal-rule':
                return hastscript_1.default('hr');
            case 'diary-sexp':
                return null;
            case 'footnote-reference':
            case 'footnote-definition':
                // TODO: serialize footnotes and footnote definitions.
                return null;
            case 'paragraph':
                return hastscript_1.default('p', toHast(org.children));
            case 'bold':
                return hastscript_1.default('strong', toHast(org.children));
            case 'italic':
                return hastscript_1.default('em', toHast(org.children));
            case 'code':
                return hastscript_1.default('code', { className: 'inline-code' }, org.value);
            case 'verbatim':
                // org-mode renders verbatim as <code>
                return hastscript_1.default('code', { className: 'inline-verbatim' }, org.value);
            case 'strike-through':
                return hastscript_1.default('del', toHast(org.children));
            case 'underline':
                return hastscript_1.default('span', { style: 'text-decoration: underline;' }, toHast(org.children));
            case 'text':
                return org.value;
            case 'link': {
                const link = org.rawLink;
                const imageRe = new RegExp(`\.(${options.imageFilenameExtensions.join('|')})$`);
                if (link.match(imageRe)) {
                    // TODO: set alt
                    return hastscript_1.default('img', { src: link });
                }
                return hastscript_1.default('a', { href: link }, org.children.length ? toHast(org.children) : org.rawLink);
            }
            case 'timestamp':
                return hastscript_1.default('span.timestamp', org.rawValue);
            case 'planning':
                return null;
            case 'property-drawer':
                return null;
            case 'drawer':
                return null;
            case 'comment':
                return null;
            case 'fixed-width':
                return hastscript_1.default('pre', org.value);
            case 'clock':
                return null;
            case 'latex-environment':
                return hastscript_1.default('div.math.math-display', org.value);
            case 'latex-fragment':
                return hastscript_1.default('span.math.math-inline', org.value);
            case 'entity':
                // rehype does not allow html escapes, so we use utf8 value instead.
                return unist_builder_1.default('text', { value: org.utf8 });
            case 'table': {
                // TODO: support column groups
                // see https://orgmode.org/manual/Column-Groups.html
                const table = hastscript_1.default('table', []);
                let hasHead = false;
                let group = [];
                org.children.forEach((r) => {
                    if (r.rowType === 'rule') {
                        // rule finishes the group
                        if (!hasHead) {
                            table.children.push(hastscript_1.default('thead', group.map((row) => hastscript_1.default('tr', row.children.map((cell) => hastscript_1.default('th', toHast(cell.children)))))));
                            hasHead = true;
                        }
                        else {
                            table.children.push(hastscript_1.default('tbody', toHast(group)));
                        }
                        group = [];
                    }
                    group.push(r);
                });
                if (group.length) {
                    table.children.push(hastscript_1.default('tbody', toHast(group)));
                }
                return table;
            }
            case 'table-row':
                if (org.rowType === 'standard') {
                    return hastscript_1.default('tr', toHast(org.children));
                }
                else {
                    return null;
                }
            case 'table-cell':
                return hastscript_1.default('td', toHast(org.children));
            default:
                return org;
        }
    }
}
exports.orgToHast = orgToHast;
const removeCommonIndent = (s) => {
    const lines = s.split(/\n/g);
    const minIndent = Math.min(...lines.map((l) => { var _a, _b; return (_b = (_a = l.match(/\S/)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : Infinity; }));
    const indent = minIndent === Infinity ? 0 : minIndent;
    return lines.map((l) => l.substring(indent)).join('\n');
};

});

function org2rehype() {
    return transformer;
    function transformer(org) {
        return orgToHast_1.orgToHast(org);
    }
}
var _default$1 = org2rehype;


var unifiedOrgRehype = /*#__PURE__*/Object.defineProperty({
	default: _default$1
}, '__esModule', {value: true});

var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const unified_org_rehype_1 = __importDefault$1(unifiedOrgRehype);
var lib$2 = unified_org_rehype_1.default;

var own$4 = {}.hasOwnProperty;

var hastUtilHasProperty = hasProperty;

// Check if `node` has a set `name` property.
function hasProperty(node, name) {
  var props;
  var value;

  if (!node || !name || typeof node !== 'object' || node.type !== 'element') {
    return false
  }

  props = node.properties;
  value = props && own$4.call(props, name) && props[name];

  return value !== null && value !== undefined && value !== false
}

var convert_1 = convert;

function convert(test) {
  if (typeof test === 'string') {
    return tagNameFactory(test)
  }

  if (test === null || test === undefined) {
    return element
  }

  if (typeof test === 'object') {
    return any(test)
  }

  if (typeof test === 'function') {
    return callFactory(test)
  }

  throw new Error('Expected function, string, or array as test')
}

function convertAll(tests) {
  var length = tests.length;
  var index = -1;
  var results = [];

  while (++index < length) {
    results[index] = convert(tests[index]);
  }

  return results
}

function any(tests) {
  var checks = convertAll(tests);
  var length = checks.length;

  return matches

  function matches() {
    var index = -1;

    while (++index < length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string a tag name check.
function tagNameFactory(test) {
  return tagName

  function tagName(node) {
    return element(node) && node.tagName === test
  }
}

// Utility to convert a function check.
function callFactory(test) {
  return call

  function call(node) {
    return element(node) && Boolean(test.apply(this, arguments))
  }
}

// Utility to return true if this is an element.
function element(node) {
  return (
    node &&
    typeof node === 'object' &&
    node.type === 'element' &&
    typeof node.tagName === 'string'
  )
}

var hastUtilIsElement = isElement;

isElement.convert = convert_1;

// Check if if `node` is an `element` and whether it passes the given test.
function isElement(node, test, index, parent, context) {
  var hasParent = parent !== null && parent !== undefined;
  var hasIndex = index !== null && index !== undefined;
  var check = convert_1(test);

  if (
    hasIndex &&
    (typeof index !== 'number' || index < 0 || index === Infinity)
  ) {
    throw new Error('Expected positive finite index for child node')
  }

  if (hasParent && (!parent.type || !parent.children)) {
    throw new Error('Expected parent node')
  }

  if (!node || !node.type || typeof node.type !== 'string') {
    return false
  }

  if (hasParent !== hasIndex) {
    throw new Error('Expected both parent and index')
  }

  return check.call(context, node, index, parent)
}

var hastUtilEmbedded = convert_1([
  'audio',
  'canvas',
  'embed',
  'iframe',
  'img',
  'math',
  'object',
  'picture',
  'svg',
  'video'
]);

var convert_1$1 = convert$1;

function convert$1(test) {
  if (test == null) {
    return ok
  }

  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : allFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function allFactory(test) {
  return all

  function all(node) {
    var key;

    for (key in test) {
      if (node[key] !== test[key]) return false
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = [];
  var index = -1;

  while (++index < tests.length) {
    checks[index] = convert$1(tests[index]);
  }

  return any

  function any() {
    var index = -1;

    while (++index < checks.length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok() {
  return true
}

var hastUtilWhitespace = interElementWhiteSpace;

// HTML white-space expression.
// See <https://html.spec.whatwg.org/#space-character>.
var re = /[ \t\n\f\r]/g;

function interElementWhiteSpace(node) {
  var value;

  if (node && typeof node === 'object' && node.type === 'text') {
    value = node.value || '';
  } else if (typeof node === 'string') {
    value = node;
  } else {
    return false
  }

  return value.replace(re, '') === ''
}

// See: <https://html.spec.whatwg.org/#the-css-user-agent-style-sheet-and-presentational-hints>
var block = [
  // Contribute whitespace intrinsically.
  'br',
  'wbr',
  // Similar to block.
  'li',
  'table',
  'caption',
  'colgroup',
  'col',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'summary',
  'optgroup',
  'option',
  // Page
  'html',
  'head',
  'body',
  // Flow content
  'address',
  'blockquote',
  'center', // Legacy
  'dialog',
  'div',
  'figure',
  'figcaption',
  'footer',
  'form',
  'header',
  'hr',
  'legend',
  'listing', // Legacy
  'main',
  'p',
  'plaintext', // Legacy
  'pre',
  'xmp', // Legacy
  // Sections and headings
  'article',
  'aside',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hgroup',
  'nav',
  'section',
  // Lists
  'dir', // Legacy
  'dd',
  'dl',
  'dt',
  'menu',
  'ol',
  'ul',
  // Block-like:
  'li',
  'th',
  'td'
];

var content = [
  // Form.
  'button',
  'input',
  'select',
  'textarea'
];

var skippable = [
  'area',
  'base',
  'basefont',
  'dialog',
  'datalist',
  'head',
  'link',
  'meta',
  'noembed',
  'noframes',
  'param',
  'rp',
  'script',
  'source',
  'style',
  'template',
  'track',
  'title'
];

/**
 * @fileoverview
 *   Collapse whitespace.
 *
 *   Normally, collapses to a single space.
 *   If `newlines: true`, collapses whitespace containing newlines to `'\n'`
 *   instead of `' '`.
 * @example
 *   <h1>Heading</h1>
 *   <p><strong>This</strong> and <em>that</em></p>
 */









var rehypeMinifyWhitespace = minifyWhitespace;

var ignorableNode = convert_1$1(['doctype', 'comment']);
var parent = convert_1$1(['element', 'root']);
var root = convert_1$1(['root']);
var element$1 = convert_1$1(['element']);
var text = convert_1$1(['text']);

function minifyWhitespace(options) {
  var collapse = collapseFactory(
    (options || {}).newlines ? replaceNewlines : replaceWhitespace
  );

  return transform

  function transform(tree) {
    minify(tree, {collapse: collapse, whitespace: 'normal'});
  }
}

function minify(node, options) {
  var settings;

  if (parent(node)) {
    settings = Object.assign({}, options);

    if (root(node) || blocklike(node)) {
      settings.before = true;
      settings.after = true;
    }

    settings.whitespace = inferWhiteSpace(node, options);

    return all(node, settings)
  }

  if (text(node)) {
    if (options.whitespace === 'normal') {
      return minifyText(node, options)
    }

    // Naïve collapse, but no trimming:
    if (options.whitespace === 'nowrap') {
      node.value = options.collapse(node.value);
    }

    // The `pre-wrap` or `pre` whitespace settings are neither collapsed nor
    // trimmed.
  }

  return {
    remove: false,
    ignore: ignorableNode(node),
    stripAtStart: false
  }
}

function minifyText(node, options) {
  var value = options.collapse(node.value);
  var start = 0;
  var end = value.length;
  var result = {remove: false, ignore: false, stripAtStart: false};

  if (options.before && removable(value.charAt(0))) {
    start++;
  }

  if (start !== end && removable(value.charAt(end - 1))) {
    if (options.after) {
      end--;
    } else {
      result.stripAtStart = true;
    }
  }

  if (start === end) {
    result.remove = true;
  } else {
    node.value = value.slice(start, end);
  }

  return result
}

function all(parent, options) {
  var before = options.before;
  var after = options.after;
  var children = parent.children;
  var length = children.length;
  var index = -1;
  var result;

  while (++index < length) {
    result = minify(
      children[index],
      Object.assign({}, options, {
        before: before,
        after: collapsableAfter(children, index, after)
      })
    );

    if (result.remove) {
      children.splice(index, 1);
      index--;
      length--;
    } else if (!result.ignore) {
      before = result.stripAtStart;
    }

    // If this element, such as a `<select>` or `<img>`, contributes content
    // somehow, allow whitespace again.
    if (content$1(children[index])) {
      before = false;
    }
  }

  return {
    remove: false,
    ignore: false,
    stripAtStart: before || after
  }
}

function collapsableAfter(nodes, index, after) {
  var length = nodes.length;
  var node;
  var result;

  while (++index < length) {
    node = nodes[index];
    result = inferBoundary(node);

    if (result === undefined && node.children && !skippable$1(node)) {
      result = collapsableAfter(node.children, -1);
    }

    if (typeof result === 'boolean') {
      return result
    }
  }

  return after
}

// Infer two types of boundaries:
//
// 1. `true` — boundary for which whitespace around it does not contribute
//    anything
// 2. `false` — boundary for which whitespace around it *does* contribute
//
// No result (`undefined`) is returned if it is unknown.
function inferBoundary(node) {
  if (element$1(node)) {
    if (content$1(node)) {
      return false
    }

    if (blocklike(node)) {
      return true
    }

    // Unknown: either depends on siblings if embedded or metadata, or on
    // children.
  } else if (text(node)) {
    if (!hastUtilWhitespace(node)) {
      return false
    }
  } else if (!ignorableNode(node)) {
    return false
  }
}

// Infer whether a node is skippable.
function content$1(node) {
  return hastUtilEmbedded(node) || hastUtilIsElement(node, content)
}

// See: <https://html.spec.whatwg.org/#the-css-user-agent-style-sheet-and-presentational-hints>
function blocklike(node) {
  return hastUtilIsElement(node, block)
}

function skippable$1(node) {
  /* istanbul ignore next - currently only used on elements, but just to make sure. */
  var props = node.properties || {};

  return ignorableNode(node) || hastUtilIsElement(node, skippable) || props.hidden
}

function removable(character) {
  return character === ' ' || character === '\n'
}

function replaceNewlines(value) {
  var match = /\r?\n|\r/.exec(value);
  return match ? match[0] : ' '
}

function replaceWhitespace() {
  return ' '
}

function collapseFactory(replace) {
  return collapse
  function collapse(value) {
    return String(value).replace(/[\t\n\v\f\r ]+/g, replace)
  }
}

// We don’t support void elements here (so `nobr wbr` -> `normal` is ignored).
function inferWhiteSpace(node, options) {
  var props = node.properties || {};

  switch (node.tagName) {
    case 'listing':
    case 'plaintext':
    case 'xmp':
      return 'pre'
    case 'nobr':
      return 'nowrap'
    case 'pre':
      return props.wrap ? 'pre-wrap' : 'pre'
    case 'td':
    case 'th':
      return props.noWrap ? 'nowrap' : options.whitespace
    case 'textarea':
      return 'pre-wrap'
    default:
      return options.whitespace
  }
}

var color_browser = identity;
function identity(d) {
  return d
}

var unistUtilVisitParents = visitParents;




var CONTINUE = true;
var SKIP = 'skip';
var EXIT = false;

visitParents.CONTINUE = CONTINUE;
visitParents.SKIP = SKIP;
visitParents.EXIT = EXIT;

function visitParents(tree, test, visitor, reverse) {
  var step;
  var is;

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  is = convert_1$1(test);
  step = reverse ? -1 : 1;

  factory(tree, null, [])();

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {};
    var name;

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined;

      visit.displayName =
        'node (' + color_browser(value.type + (name ? '<' + name + '>' : '')) + ')';
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node);
      var result = [];
      var subresult;
      var offset;

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents));

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step;

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)();

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step;
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}

var unistUtilVisit = visit;



var CONTINUE$1 = unistUtilVisitParents.CONTINUE;
var SKIP$1 = unistUtilVisitParents.SKIP;
var EXIT$1 = unistUtilVisitParents.EXIT;

visit.CONTINUE = CONTINUE$1;
visit.SKIP = SKIP$1;
visit.EXIT = EXIT$1;

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
    test = null;
  }

  unistUtilVisitParents(tree, test, overload, reverse);

  function overload(node, parents) {
    var parent = parents[parents.length - 1];
    var index = parent ? parent.children.indexOf(node) : null;
    return visitor(node, index, parent)
  }
}

var all_1 = all$1;



function all$1(h, parent) {
  var nodes = parent.children || [];
  var values = [];
  var index = -1;
  var result;

  while (++index < nodes.length) {
    result = one_1(h, nodes[index], parent);

    if (result) {
      values = values.concat(result);
    }
  }

  return values
}

var own$5 = {}.hasOwnProperty;

var wrapText_1 = wrapText;

function wrapText(h, value) {
  return h.wrapText ? value : value.replace(/\r?\n|\r/g, ' ')
}

var one_1 = one;





function one(h, node, parent) {
  var fn;

  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own$5.call(h.handlers, node.tagName)) {
      fn = h.handlers[node.tagName];
    }
  } else if (own$5.call(h.handlers, node.type)) {
    fn = h.handlers[node.type];
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

function unknown(h, node) {
  if (node.value) {
    return h(node, 'text', wrapText_1(h, node.value))
  }

  return all_1(h, node)
}

var isPhrasing = convert_1$1([
  'break',
  'delete',
  'emphasis',
  'footnote',
  'footnoteReference',
  'image',
  'imageReference',
  'inlineCode',
  'link',
  'linkReference',
  'strong',
  'text'
]);

isPhrasing.displayName = 'isPhrasing';
var mdastUtilPhrasing = isPhrasing;

var shallow_1 = shallow;



// Shallow copy of a node, excluding its children.
function shallow(node) {
  var copy = {};
  var key;

  for (key in node) {
    if (own$5.call(node, key) && key !== 'children') {
      copy[key] = node[key];
    }
  }

  return copy
}

var wrap_1$1 = wrap$1;

wrap$1.needed = needed;





function wrap$1(nodes) {
  return runs(nodes, onphrasing)

  function onphrasing(nodes) {
    var head = nodes[0];

    if (
      nodes.length === 1 &&
      head.type === 'text' &&
      (head.value === ' ' || head.value === '\n')
    ) {
      return []
    }

    return {type: 'paragraph', children: nodes}
  }
}

// Wrap all runs of mdast phrasing content in `paragraph` nodes.
function runs(nodes, onphrasing, onnonphrasing) {
  var nonphrasing = onnonphrasing || identity$1;
  var flattened = flatten(nodes);
  var result = [];
  var index = -1;
  var node;
  var queue;

  while (++index < flattened.length) {
    node = flattened[index];

    if (mdastUtilPhrasing(node)) {
      if (!queue) queue = [];
      queue.push(node);
    } else {
      if (queue) {
        result = result.concat(onphrasing(queue));
        queue = undefined;
      }

      result = result.concat(nonphrasing(node));
    }
  }

  if (queue) {
    result = result.concat(onphrasing(queue));
  }

  return result
}

// Flatten a list of nodes.
function flatten(nodes) {
  var flattened = [];
  var index = -1;
  var node;

  while (++index < nodes.length) {
    node = nodes[index];

    // Straddling: some elements are *weird*.
    // Namely: `map`, `ins`, `del`, and `a`, as they are hybrid elements.
    // See: <https://html.spec.whatwg.org/#paragraphs>.
    // Paragraphs are the weirdest of them all.
    // See the straddling fixture for more info!
    // `ins` is ignored in mdast, so we don’t need to worry about that.
    // `map` maps to its content, so we don’t need to worry about that either.
    // `del` maps to `delete` and `a` to `link`, so we do handle those.
    // What we’ll do is split `node` over each of its children.
    if (
      (node.type === 'delete' || node.type === 'link') &&
      needed(node.children)
    ) {
      flattened = flattened.concat(split(node));
    } else {
      flattened.push(node);
    }
  }

  return flattened
}

// Check if there are non-phrasing mdast nodes returned.
// This is needed if a fragment is given, which could just be a sentence, and
// doesn’t need a wrapper paragraph.
function needed(nodes) {
  var index = -1;
  var node;

  while (++index < nodes.length) {
    node = nodes[index];

    if (!mdastUtilPhrasing(node) || (node.children && needed(node.children))) {
      return true
    }
  }
}

function split(node) {
  return runs(node.children, onphrasing, onnonphrasing)

  // Use `child`, add `parent` as its first child, put the original children
  // into `parent`.
  function onnonphrasing(child) {
    var parent = extend(true, {}, shallow_1(node));
    var copy = shallow_1(child);

    copy.children = [parent];
    parent.children = child.children;

    return copy
  }

  // Use `parent`, put the phrasing run inside it.
  function onphrasing(nodes) {
    var parent = extend(true, {}, shallow_1(node));
    parent.children = nodes;
    return parent
  }
}

function identity$1(n) {
  return n
}

var wrapChildren = wrapped;




function wrapped(h, node) {
  return wrap_1$1(all_1(h, node))
}

var base_1 = base;

function base(h, node) {
  if (!h.baseFound) {
    h.frozenBaseUrl = node.properties.href;
    h.baseFound = true;
  }
}

var blockquote_1 = blockquote;



function blockquote(h, node) {
  return h(node, 'blockquote', wrapChildren(h, node))
}

var _break = br;

function br(h, node) {
  return h.wrapText ? h(node, 'break') : h(node, 'text', ' ')
}

/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

/**
 * Results cache
 */

var res = '';
var cache;

/**
 * Expose `repeat`
 */

var repeatString = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}

var unistUtilFindAfter = findAfter;

function findAfter(parent, index, test) {
  var is = convert_1$1(test);
  var children;
  var child;
  var length;

  if (!parent || !parent.type || !parent.children) {
    throw new Error('Expected parent node')
  }

  children = parent.children;
  length = children.length;

  if (index && index.type) {
    index = children.indexOf(index);
  }

  if (isNaN(index) || index < 0 || index === Infinity) {
    throw new Error('Expected positive finite index or child node')
  }

  while (++index < length) {
    child = children[index];

    if (is(child, index, parent)) {
      return child
    }
  }

  return null
}

var hastUtilToText = toText;

var searchLineFeeds = /\n/g;
var searchTabOrSpaces = /[\t ]+/g;

var br$1 = convert_1('br');
var p = convert_1('p');
var cell = convert_1(['th', 'td']);
var row = convert_1('tr');

// Note that we don’t need to include void elements here as they don’t have text.
// See: <https://github.com/wooorm/html-void-elements>
var notRendered = convert_1([
  // List from: <https://html.spec.whatwg.org/#hidden-elements>
  'datalist',
  'head',
  'noembed',
  'noframes',
  'rp',
  'script',
  'style',
  'template',
  'title',
  // Act as if we support scripting.
  'noscript',
  // Hidden attribute.
  hidden,
  // From: <https://html.spec.whatwg.org/#flow-content-3>
  closedDialog
]);

// See: <https://html.spec.whatwg.org/#the-css-user-agent-style-sheet-and-presentational-hints>
var blockOrCaption = convert_1([
  'caption', // `table-caption`
  // Page
  'html',
  'body',
  // Flow content
  'address',
  'blockquote',
  'center', // Legacy
  'dialog',
  'div',
  'figure',
  'figcaption',
  'footer',
  'form,',
  'header',
  'hr',
  'legend',
  'listing', // Legacy
  'main',
  'p',
  'plaintext', // Legacy
  'pre',
  'xmp', // Legacy
  // Sections and headings
  'article',
  'aside',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hgroup',
  'nav',
  'section',
  // Lists
  'dir', // Legacy
  'dd',
  'dl',
  'dt',
  'menu',
  'ol',
  'ul'
]);

// Implementation of the `innerText` getter:
// <https://html.spec.whatwg.org/#the-innertext-idl-attribute>
// Note that we act as if `node` is being rendered, and as if we’re a
// CSS-supporting user agent.
function toText(node) {
  var children = node.children || [];
  var block = blockOrCaption(node);
  var whiteSpace = inferWhiteSpace$1(node, {});
  var index = -1;
  var results;
  var result;
  var value;
  var count;

  // Treat `text` and `comment` as having normal white-space.
  // This deviates from the spec as in the DOM the node’s `.data` has to be
  // returned.
  // If you want that behavior use `hast-util-to-string`.
  // All other nodes are later handled as if they are `element`s (so the
  // algorithm also works on a `root`).
  // Nodes without children are treated as a void element, so `doctype` is thus
  // ignored.
  if (node.type === 'text' || node.type === 'comment') {
    return collectText(node, {
      whiteSpace: whiteSpace,
      breakBefore: true,
      breakAfter: true
    })
  }

  // 1.  If this element is not being rendered, or if the user agent is a
  //     non-CSS user agent, then return the same value as the textContent IDL
  //     attribute on this element.
  //
  //     Note: we’re not supporting stylesheets so we’re acting as if the node
  //     is rendered.
  //
  //     If you want that behavior use `hast-util-to-string`.
  //     Important: we’ll have to account for this later though.

  // 2.  Let results be a new empty list.
  results = [];

  // 3.  For each child node node of this element:
  while (++index < children.length) {
    // 3.1. Let current be the list resulting in running the inner text
    //      collection steps with node.
    //      Each item in results will either be a JavaScript string or a
    //      positive integer (a required line break count).
    // 3.2. For each item item in current, append item to results.
    results = results.concat(
      innerTextCollection(children[index], index, node, {
        whiteSpace: whiteSpace,
        breakBefore: index ? null : block,
        breakAfter:
          index < children.length - 1 ? br$1(children[index + 1]) : block
      })
    );
  }

  // 4.  Remove any items from results that are the empty string.
  // 5.  Remove any runs of consecutive required line break count items at the
  //     start or end of results.
  // 6.  Replace each remaining run of consecutive required line break count
  //     items with a string consisting of as many U+000A LINE FEED (LF)
  //     characters as the maximum of the values in the required line break
  //     count items.
  index = -1;
  result = [];

  while (++index < results.length) {
    value = results[index];

    if (typeof value === 'number') {
      if (count !== undefined && value > count) count = value;
    } else if (value) {
      if (count) result.push(repeatString('\n', count));
      count = 0;
      result.push(value);
    }
  }

  // 7.  Return the concatenation of the string items in results.
  return result.join('')
}

// <https://html.spec.whatwg.org/#inner-text-collection-steps>
function innerTextCollection(node, index, parent, options) {
  if (node.type === 'element') {
    return collectElement(node, index, parent, options)
  }

  if (node.type === 'text') {
    return [
      options.whiteSpace === 'normal'
        ? collectText(node, options)
        : collectPreText(node)
    ]
  }

  return []
}

// Collect an element.
function collectElement(node, _, parent, options) {
  // First we infer the `white-space` property.
  var whiteSpace = inferWhiteSpace$1(node, options);
  var children = node.children || [];
  var index = -1;
  var items = [];
  var prefix;
  var suffix;

  // We’re ignoring point 3, and exiting without any content here, because we
  // deviated from the spec in `toText` at step 3.
  if (notRendered(node)) {
    return items
  }

  // Note: we first detect if there is going to be a break before or after the
  // contents, as that changes the white-space handling.

  // 2.  If node’s computed value of `visibility` is not `visible`, then return
  //     items.
  //
  //     Note: Ignored, as everything is visible by default user agent styles.

  // 3.  If node is not being rendered, then return items. [...]
  //
  //     Note: We already did this above.

  // See `collectText` for step 4.

  // 5.  If node is a `<br>` element, then append a string containing a single
  //     U+000A LINE FEED (LF) character to items.
  if (br$1(node)) {
    suffix = '\n';
  }

  // 7.  If node’s computed value of `display` is `table-row`, and node’s CSS
  //     box is not the last `table-row` box of the nearest ancestor `table`
  //     box, then append a string containing a single U+000A LINE FEED (LF)
  //     character to items.
  //
  //     See: <https://html.spec.whatwg.org/#tables-2>
  //     Note: needs further investigation as this does not account for implicit
  //     rows.
  else if (row(node) && unistUtilFindAfter(parent, node, row)) {
    suffix = '\n';
  }

  // 8.  If node is a `<p>` element, then append 2 (a required line break count)
  //     at the beginning and end of items.
  else if (p(node)) {
    prefix = 2;
    suffix = 2;
  }

  // 9.  If node’s used value of `display` is block-level or `table-caption`,
  //     then append 1 (a required line break count) at the beginning and end of
  //     items.
  else if (blockOrCaption(node)) {
    prefix = 1;
    suffix = 1;
  }

  // 1.  Let items be the result of running the inner text collection steps with
  //     each child node of node in tree order, and then concatenating the
  //     results to a single list.
  while (++index < children.length) {
    items = items.concat(
      innerTextCollection(children[index], index, node, {
        whiteSpace: whiteSpace,
        breakBefore: index ? null : prefix,
        breakAfter:
          index < children.length - 1 ? br$1(children[index + 1]) : suffix
      })
    );
  }

  // 6.  If node’s computed value of `display` is `table-cell`, and node’s CSS
  //     box is not the last `table-cell` box of its enclosing `table-row` box,
  //     then append a string containing a single U+0009 CHARACTER TABULATION
  //     (tab) character to items.
  //
  //     See: <https://html.spec.whatwg.org/#tables-2>
  if (cell(node) && unistUtilFindAfter(parent, node, cell)) {
    items.push('\t');
  }

  // Add the pre- and suffix.
  if (prefix) items.unshift(prefix);
  if (suffix) items.push(suffix);

  return items
}

// 4.  If node is a Text node, then for each CSS text box produced by node,
//     in content order, compute the text of the box after application of the
//     CSS `white-space` processing rules and `text-transform` rules, set
//     items to the list of the resulting strings, and return items.
//     The CSS `white-space` processing rules are slightly modified:
//     collapsible spaces at the end of lines are always collapsed, but they
//     are only removed if the line is the last line of the block, or it ends
//     with a br element.
//     Soft hyphens should be preserved.
//
//     Note: See `collectText` and `collectPreText`.
//     Note: we don’t deal with `text-transform`, no element has that by
//     default.
//
// See: <https://drafts.csswg.org/css-text/#white-space-phase-1>
function collectText(node, options) {
  var value = String(node.value);
  var lines = [];
  var result = [];
  var start = 0;
  var index = -1;
  var match;
  var end;
  var join;

  while (start < value.length) {
    searchLineFeeds.lastIndex = start;
    match = searchLineFeeds.exec(value);
    end = match ? match.index : value.length;

    lines.push(
      // Any sequence of collapsible spaces and tabs immediately preceding or
      // following a segment break is removed.
      trimAndcollapseSpacesAndTabs(
        // [...] ignoring bidi formatting characters (characters with the
        // Bidi_Control property [UAX9]: ALM, LTR, RTL, LRE-RLO, LRI-PDI) as if
        // they were not there.
        value
          .slice(start, end)
          .replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, ''),
        options.breakBefore,
        options.breakAfter
      )
    );

    start = end + 1;
  }

  // Collapsible segment breaks are transformed for rendering according to the
  // segment break transformation rules.
  // So here we jump to 4.1.2 of [CSSTEXT]:
  // Any collapsible segment break immediately following another collapsible
  // segment break is removed
  while (++index < lines.length) {
    // *   If the character immediately before or immediately after the segment
    //     break is the zero-width space character (U+200B), then the break is
    //     removed, leaving behind the zero-width space.
    if (
      lines[index].charCodeAt(lines[index].length - 1) === 0x200b /* ZWSP */ ||
      (index < lines.length - 1 &&
        lines[index + 1].charCodeAt(0) === 0x200b) /* ZWSP */
    ) {
      result.push(lines[index]);
      join = '';
    }

    // *   Otherwise, if the East Asian Width property [UAX11] of both the
    //     character before and after the segment break is Fullwidth, Wide, or
    //     Halfwidth (not Ambiguous), and neither side is Hangul, then the
    //     segment break is removed.
    //
    //     Note: ignored.
    // *   Otherwise, if the writing system of the segment break is Chinese,
    //     Japanese, or Yi, and the character before or after the segment break
    //     is punctuation or a symbol (Unicode general category P* or S*) and
    //     has an East Asian Width property of Ambiguous, and the character on
    //     the other side of the segment break is Fullwidth, Wide, or Halfwidth,
    //     and not Hangul, then the segment break is removed.
    //
    //     Note: ignored.

    // *   Otherwise, the segment break is converted to a space (U+0020).
    else if (lines[index]) {
      if (join) result.push(join);
      result.push(lines[index]);
      join = ' ';
    }
  }

  return result.join('')
}

function collectPreText(node) {
  return String(node.value)
}

// 3.  Every collapsible tab is converted to a collapsible space (U+0020).
// 4.  Any collapsible space immediately following another collapsible
//     space—even one outside the boundary of the inline containing that
//     space, provided both spaces are within the same inline formatting
//     context—is collapsed to have zero advance width. (It is invisible,
//     but retains its soft wrap opportunity, if any.)
function trimAndcollapseSpacesAndTabs(value, breakBefore, breakAfter) {
  var result = [];
  var start = 0;
  var match;
  var end;

  while (start < value.length) {
    searchTabOrSpaces.lastIndex = start;
    match = searchTabOrSpaces.exec(value);
    end = match ? match.index : value.length;

    // If we’re not directly after a segment break, but there was white space,
    // add an empty value that will be turned into a space.
    if (!start && !end && match && !breakBefore) {
      result.push('');
    }

    if (start !== end) {
      result.push(value.slice(start, end));
    }

    start = match ? end + match[0].length : end;
  }

  // If we reached the end, there was trailing white space, and there’s no
  // segment break after this node, add an empty value that will be turned
  // into a space.
  if (start !== end && !breakAfter) {
    result.push('');
  }

  return result.join(' ')
}

// We don’t support void elements here (so `nobr wbr` -> `normal` is ignored).
function inferWhiteSpace$1(node, options) {
  var props = node.properties || {};
  var inherit = options.whiteSpace || 'normal';

  switch (node.tagName) {
    case 'listing':
    case 'plaintext':
    case 'xmp':
      return 'pre'
    case 'nobr':
      return 'nowrap'
    case 'pre':
      return props.wrap ? 'pre-wrap' : 'pre'
    case 'td':
    case 'th':
      return props.noWrap ? 'nowrap' : inherit
    case 'textarea':
      return 'pre-wrap'
    default:
      return inherit
  }
}

function hidden(node) {
  return (node.properties || {}).hidden
}

function closedDialog(node) {
  return node.tagName === 'dialog' && !(node.properties || {}).open
}

var trimTrailingLines_1 = trimTrailingLines;

// Remove final newline characters from `value`.
function trimTrailingLines(value) {
  return String(value).replace(/\n+$/, '')
}

var code_1 = code;







var prefix = 'language-';

var pre = convert_1('pre');
var isCode = convert_1('code');

function code(h, node) {
  var children = node.children;
  var index = -1;
  var classList;
  var lang;

  if (pre(node)) {
    while (++index < children.length) {
      if (isCode(children[index]) && hastUtilHasProperty(children[index], 'className')) {
        classList = children[index].properties.className;
        break
      }
    }
  }

  if (classList) {
    index = -1;

    while (++index < classList.length) {
      if (classList[index].slice(0, prefix.length) === prefix) {
        lang = classList[index].slice(prefix.length);
        break
      }
    }
  }

  return h(
    node,
    'code',
    {lang: lang || null, meta: null},
    trimTrailingLines_1(wrapText_1(h, hastUtilToText(node)))
  )
}

var comment_1 = comment;



function comment(h, node) {
  return h(node, 'html', '<!--' + wrapText_1(h, node.value) + '-->')
}

var _delete = del;



function del(h, node) {
  return h(node, 'delete', all_1(h, node))
}

var listItemsSpread = spread;

function spread(children) {
  var index = -1;

  if (children.length > 1) {
    while (++index < children.length) {
      if (children[index].spread) {
        return true
      }
    }
  }

  return false
}

var wrapListItems_1 = wrapListItems;



function wrapListItems(h, node) {
  var children = all_1(h, node);
  var index = -1;

  while (++index < children.length) {
    if (children[index].type !== 'listItem') {
      children[index] = {
        type: 'listItem',
        spread: false,
        checked: null,
        children: [children[index]]
      };
    }
  }

  return children
}

var dl_1 = dl;





var div = convert_1('div');
var dt = convert_1('dt');
var dd = convert_1('dd');

function dl(h, node) {
  var children = node.children;
  var index = -1;
  var clean = [];
  var groups = [];
  var group = {titles: [], definitions: []};
  var content;
  var child;

  // Unwrap `<div>`s
  while (++index < children.length) {
    child = children[index];
    clean = clean.concat(div(child) ? child.children : child);
  }

  index = -1;

  // Group titles and definitions.
  while (++index < clean.length) {
    child = clean[index];

    if (dt(child)) {
      if (dd(clean[index - 1])) {
        groups.push(group);
        group = {titles: [], definitions: []};
      }

      group.titles.push(child);
    } else {
      group.definitions.push(child);
    }
  }

  groups.push(group);

  // Create items.
  index = -1;
  content = [];

  while (++index < groups.length) {
    group = handle(h, groups[index].titles).concat(
      handle(h, groups[index].definitions)
    );

    if (group.length) {
      content.push({
        type: 'listItem',
        spread: group.length > 1,
        checked: null,
        children: group
      });
    }
  }

  // Create a list if there are items.
  if (content.length) {
    return h(
      node,
      'list',
      {ordered: false, start: null, spread: listItemsSpread(content)},
      content
    )
  }
}

function handle(h, children) {
  var nodes = wrapListItems_1(h, {children: children});

  if (!nodes.length) {
    return nodes
  }

  if (nodes.length === 1) {
    return nodes[0].children
  }

  return [
    {
      type: 'list',
      ordered: false,
      start: null,
      spread: listItemsSpread(nodes),
      children: nodes
    }
  ]
}

var emphasis_1 = emphasis;



function emphasis(h, node) {
  return h(node, 'emphasis', all_1(h, node))
}

var heading_1 = heading;



function heading(h, node) {
  /* istanbul ignore next - `else` shouldn’t happen, of course… */
  var depth = Number(node.tagName.charAt(1)) || 1;
  var wrap = h.wrapText;
  var result;

  h.wrapText = false;
  result = h(node, 'heading', {depth: depth}, all_1(h, node));
  h.wrapText = wrap;

  return result
}

var resolve_1 = resolve;

function resolve(h, url) {
  if (url === null || url === undefined) {
    return ''
  }

  /* istanbul ignore next - ignored for older Node */
  if (h.frozenBaseUrl && typeof URL !== 'undefined') {
    return String(new URL(url, h.frozenBaseUrl))
  }

  return url
}

var iframe_1 = iframe;




function iframe(h, node) {
  var src = node.properties.src;
  var title = node.properties.title;

  // Only create a link if there is a title.
  // We can’t use the content of the frame because conforming HTML parsers treat
  // it as text, whereas legacy parsers treat it as HTML, so it will likely
  // contain tags that will show up in text.
  if (src && title) {
    return {
      type: 'link',
      title: null,
      url: resolve_1(h, src),
      children: [{type: 'text', value: wrapText_1(h, title)}]
    }
  }
}

var image_1 = image;



function image(h, node) {
  return h(node, 'image', {
    url: resolve_1(h, node.properties.src),
    title: node.properties.title || null,
    alt: node.properties.alt || ''
  })
}

var inlineCode_1 = inlineCode;




function inlineCode(h, node) {
  return h(node, 'inlineCode', wrapText_1(h, hastUtilToText(node)))
}

var findSelectedOptions_1 = findSelectedOptions;

var option = convert_1('option');

function findSelectedOptions(h, node, properties) {
  var props = properties || node.properties;
  var options = findOptions(node);
  var size = Math.min(parseInt(props.size, 10), 0) || (props.multiple ? 4 : 1);
  var index = -1;
  var selectedOptions = [];
  var values = [];
  var option;
  var list;
  var content;
  var label;
  var value;

  while (++index < options.length) {
    if (hastUtilHasProperty(options[index], 'selected')) {
      selectedOptions.push(options[index]);
    }
  }

  list = selectedOptions.length ? selectedOptions : options;
  options = list.slice(0, size);
  index = -1;

  while (++index < options.length) {
    option = options[index];
    content = wrapText_1(h, hastUtilToText(option));
    label = content || option.properties.label;
    value = option.properties.value || content;

    values.push([value, label === value ? null : label]);
  }

  return values
}

function findOptions(node) {
  var children = node.children;
  var index = -1;
  var results = [];
  var child;

  while (++index < children.length) {
    child = children[index];

    if (option(child)) {
      if (!hastUtilHasProperty(child, 'disabled')) {
        results.push(child);
      }
    } else if (child.children) {
      results = results.concat(findOptions(child));
    }
  }

  return results
}

var input_1 = input;








var datalist = convert_1('datalist');

function input(h, node) {
  var props = node.properties;
  var value = props.value || props.placeholder;
  var results = [];
  var values = [];
  var index = -1;
  var list;

  if (props.disabled || props.type === 'hidden' || props.type === 'file') {
    return
  }

  if (props.type === 'checkbox' || props.type === 'radio') {
    return h(
      node,
      'text',
      wrapText_1(h, h[props.checked ? 'checked' : 'unchecked'])
    )
  }

  if (props.type === 'image') {
    return props.alt || value
      ? h(node, 'image', {
          url: resolve_1(h, props.src),
          title: (props.title && wrapText_1(h, props.title)) || null,
          alt: wrapText_1(h, props.alt || value)
        })
      : []
  }

  if (value) {
    values = [[value]];
  } else if (
    // `list` is not supported on these types:
    props.type !== 'password' &&
    props.type !== 'file' &&
    props.type !== 'submit' &&
    props.type !== 'reset' &&
    props.type !== 'button' &&
    props.list
  ) {
    list = String(props.list).toUpperCase();

    if (own$5.call(h.nodeById, list) && datalist(h.nodeById[list])) {
      values = findSelectedOptions_1(h, h.nodeById[list], props);
    }
  }

  if (!values.length) {
    return
  }

  // Hide password value.
  if (props.type === 'password') {
    // Passwords don’t support `list`.
    values[0] = [repeatString('•', values[0][0].length)];
  }

  if (props.type === 'url' || props.type === 'email') {
    while (++index < values.length) {
      value = resolve_1(h, values[index][0]);

      results.push(
        h(
          node,
          'link',
          {
            title: null,
            url: wrapText_1(h, props.type === 'email' ? 'mailto:' + value : value)
          },
          [{type: 'text', value: wrapText_1(h, values[index][1] || value)}]
        )
      );

      if (index !== values.length - 1) {
        results.push({type: 'text', value: ', '});
      }
    }

    return results
  }

  while (++index < values.length) {
    results.push(
      values[index][1]
        ? values[index][1] + ' (' + values[index][0] + ')'
        : values[index][0]
    );
  }

  return h(node, 'text', wrapText_1(h, results.join(', ')))
}

var link_1 = link;




function link(h, node) {
  return h(
    node,
    'link',
    {
      title: node.properties.title || null,
      url: resolve_1(h, node.properties.href)
    },
    all_1(h, node)
  )
}

var listItem_1 = listItem;





var p$1 = convert_1('p');
var input$1 = convert_1('input');

function listItem(h, node) {
  var head = node.children[0];
  var checked = null;
  var content;
  var checkbox;
  var clone;
  var headClone;

  // Check if this node starts with a checkbox.
  if (p$1(head)) {
    checkbox = head.children[0];

    if (
      input$1(checkbox) &&
      (checkbox.properties.type === 'checkbox' ||
        checkbox.properties.type === 'radio')
    ) {
      checked = Boolean(checkbox.properties.checked);
      headClone = shallow_1(head);
      headClone.children = head.children.slice(1);
      clone = shallow_1(node);
      clone.children = [headClone].concat(node.children.slice(1));
    }
  }

  content = wrapChildren(h, clone || node);

  return h(
    node,
    'listItem',
    {spread: content.length > 1, checked: checked},
    content
  )
}

var list_1 = list;






var ol = convert_1('ol');

function list(h, node) {
  var ordered = ol(node);
  var children = wrapListItems_1(h, node);
  var start = null;

  if (ordered) {
    start = hastUtilHasProperty(node, 'start') ? node.properties.start : 1;
  }

  return h(
    node,
    'list',
    {ordered: ordered, start: start, spread: listItemsSpread(children)},
    children
  )
}

var mdastUtilToString = toString$1;

// Get the text content of a node.
// Prefer the node’s plain-text fields, otherwise serialize its children,
// and if the given value is an array, serialize the nodes in it.
function toString$1(node) {
  return (
    (node &&
      (node.value ||
        node.alt ||
        node.title ||
        ('children' in node && all$2(node.children)) ||
        ('length' in node && all$2(node)))) ||
    ''
  )
}

function all$2(values) {
  var result = [];
  var length = values.length;
  var index = -1;

  while (++index < length) {
    result[index] = toString$1(values[index]);
  }

  return result.join('')
}

var media_1 = media;








var source = convert_1('source');
var video = convert_1('video');

function media(h, node) {
  var nodes = all_1(h, node);
  var poster = video(node) && node.properties.poster;
  var src = node.properties.src;
  var index = -1;
  var linkInFallbackContent;

  unistUtilVisit({type: 'root', children: nodes}, 'link', findLink);

  // If the content links to something, or if it’s not phrasing…
  if (linkInFallbackContent || wrap_1$1.needed(nodes)) {
    return nodes
  }

  // Find the source.
  while (!src && ++index < node.children.length) {
    if (source(node.children[index])) {
      src = node.children[index].properties.src;
    }
  }

  // If there’s a poster defined on the video, create an image.
  if (poster) {
    nodes = [
      {
        type: 'image',
        title: null,
        url: resolve_1(h, poster),
        alt: mdastUtilToString({children: nodes})
      }
    ];
  }

  // Link to the media resource.
  return {
    type: 'link',
    title: node.properties.title || null,
    url: resolve_1(h, src),
    children: nodes
  }

  function findLink() {
    linkInFallbackContent = true;
    return unistUtilVisit.EXIT
  }
}

var paragraph_1 = paragraph;



function paragraph(h, node) {
  var nodes = all_1(h, node);

  if (nodes.length) {
    return h(node, 'paragraph', nodes)
  }
}

var q_1 = q;



function q(h, node) {
  var expected = h.quotes[h.qNesting % h.quotes.length];
  var contents;

  h.qNesting++;
  contents = all_1(h, node);
  h.qNesting--;

  contents.unshift({type: 'text', value: expected.charAt(0)});

  contents.push({
    type: 'text',
    value: expected.length > 1 ? expected.charAt(1) : expected
  });

  return contents
}

var root_1 = root$1;




function root$1(h, node) {
  var children = all_1(h, node);

  if (h.document || wrap_1$1.needed(children)) {
    children = wrap_1$1(children);
  }

  return h(node, 'root', children)
}

var select_1 = select;




function select(h, node) {
  var values = findSelectedOptions_1(h, node);
  var index = -1;
  var results = [];
  var value;

  while (++index < values.length) {
    value = values[index];
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0]);
  }

  if (results.length) {
    return h(node, 'text', wrapText_1(h, results.join(', ')))
  }
}

var strong_1 = strong;



function strong(h, node) {
  return h(node, 'strong', all_1(h, node))
}

var tableCell = cell$1;



function cell$1(h, node) {
  var wrap = h.wrapText;
  var result;

  h.wrapText = false;
  result = h(node, 'tableCell', all_1(h, node));
  h.wrapText = wrap;

  return result
}

var tableRow = row$1;



function row$1(h, node) {
  return h(node, 'tableRow', all_1(h, node))
}

var table_1 = table;





var thead = convert_1('thead');
var tr = convert_1('tr');
var cell$2 = convert_1(['th', 'td']);

function table(h, node) {
  var info = inspect(node);
  return h(node, 'table', {align: info.align}, toRows(all_1(h, node), info))
}

// Infer whether the HTML table has a head and how it aligns.
function inspect(node) {
  var headless = true;
  var align = [null];
  var rowIndex = 0;
  var cellIndex = 0;

  unistUtilVisit(node, 'element', visitor);

  return {align: align, headless: headless}

  function visitor(child) {
    // If there is a `thead`, assume there is a header row.
    if (thead(child)) {
      headless = false;
    } else if (tr(child)) {
      rowIndex++;
      cellIndex = 0;
    } else if (cell$2(child)) {
      if (!align[cellIndex]) {
        align[cellIndex] = child.properties.align || null;
      }

      // If there is a th in the first row, assume there is a header row.
      if (headless && rowIndex < 2 && child.tagName === 'th') {
        headless = false;
      }

      cellIndex++;
    }
  }
}

// Ensure the rows are properly structured.
function toRows(children, info) {
  var nodes = [];
  var index = -1;
  var node;
  var queue;

  // Add an empty header row.
  if (info.headless) {
    nodes.push({type: 'tableRow', children: []});
  }

  while (++index < children.length) {
    node = children[index];

    if (node.type === 'tableRow') {
      if (queue) {
        node.children = queue.concat(node.children);
        queue = undefined;
      }

      nodes.push(node);
    } else {
      if (!queue) queue = [];
      queue.push(node);
    }
  }

  if (queue) {
    node = nodes[nodes.length - 1];
    node.children = node.children.concat(queue);
  }

  index = -1;

  while (++index < nodes.length) {
    node = nodes[index];
    node.children = toCells(node.children, info);
  }

  return nodes
}

// Ensure the cells in a row are properly structured.
function toCells(children, info) {
  var nodes = [];
  var index = -1;
  var node;
  var queue;

  while (++index < children.length) {
    node = children[index];

    if (node.type === 'tableCell') {
      if (queue) {
        node.children = queue.concat(node.children);
        queue = undefined;
      }

      nodes.push(node);
    } else {
      if (!queue) queue = [];
      queue.push(node);
    }
  }

  if (queue) {
    node = nodes[nodes.length - 1];

    if (!node) {
      node = {type: 'tableCell', children: []};
      nodes.push(node);
    }

    node.children = node.children.concat(queue);
  }

  index = nodes.length - 1;

  while (++index < info.align.length) {
    nodes.push({type: 'tableCell', children: []});
  }

  return nodes
}

var text_1 = text$1;



function text$1(h, node) {
  return h(node, 'text', wrapText_1(h, node.value))
}

var textarea_1 = textarea;




function textarea(h, node) {
  return h(node, 'text', wrapText_1(h, hastUtilToText(node)))
}

var thematicBreak_1 = thematicBreak;

function thematicBreak(h, node) {
  return h(node, 'thematicBreak')
}

var wbr_1 = wbr;

function wbr(h, node) {
  return h(node, 'text', '\u200b')
}

var root_1$1 = root_1;
var text_1$1 = text_1;
var comment_1$1 = comment_1;
var doctype = ignore;

var applet = ignore;
var area = ignore;
var basefont = ignore;
var bgsound = ignore;
var caption = ignore;
var col = ignore;
var colgroup = ignore;
var command = ignore;
var content$2 = ignore;
var datalist$1 = ignore;
var dialog = ignore;
var element$2 = ignore;
var embed = ignore;
var frame = ignore;
var frameset = ignore;
var isindex = ignore;
var keygen = ignore;
var link_1$1 = ignore;
var math = ignore;
var menu = ignore;
var menuitem = ignore;
var meta = ignore;
var nextid = ignore;
var noembed = ignore;
var noframes = ignore;
var optgroup = ignore;
var option$1 = ignore;
var param = ignore;
var script = ignore;
var shadow = ignore;
var source$1 = ignore;
var spacer = ignore;
var style$1 = ignore;
var svg = ignore;
var template = ignore;
var title = ignore;
var track = ignore;

var abbr = all_1;
var acronym = all_1;
var bdi = all_1;
var bdo = all_1;
var big = all_1;
var blink = all_1;
var button = all_1;
var canvas = all_1;
var cite = all_1;
var data$1 = all_1;
var details = all_1;
var dfn = all_1;
var font = all_1;
var ins = all_1;
var label = all_1;
var map = all_1;
var marquee = all_1;
var meter = all_1;
var nobr = all_1;
var noscript = all_1;
var object = all_1;
var output = all_1;
var progress = all_1;
var rb = all_1;
var rbc = all_1;
var rp = all_1;
var rt = all_1;
var rtc = all_1;
var ruby = all_1;
var slot = all_1;
var small = all_1;
var span = all_1;
var sup = all_1;
var sub = all_1;
var tbody = all_1;
var tfoot = all_1;
var thead$1 = all_1;
var time = all_1;

var address = wrapChildren;
var article = wrapChildren;
var aside = wrapChildren;
var body = wrapChildren;
var center = wrapChildren;
var div$1 = wrapChildren;
var fieldset = wrapChildren;
var figcaption = wrapChildren;
var figure = wrapChildren;
var form = wrapChildren;
var footer = wrapChildren;
var header = wrapChildren;
var hgroup = wrapChildren;
var html$2 = wrapChildren;
var legend = wrapChildren;
var main = wrapChildren;
var multicol = wrapChildren;
var nav = wrapChildren;
var picture = wrapChildren;
var section = wrapChildren;

var a = link_1;
var audio = media_1;
var b = strong_1;
var base_1$1 = base_1;
var blockquote_1$1 = blockquote_1;
var br_1 = _break;
var code_1$1 = inlineCode_1;
var dir = list_1;
var dl_1$1 = dl_1;
var dt$1 = listItem_1;
var dd$1 = listItem_1;
var del_1 = _delete;
var em = emphasis_1;
var h1 = heading_1;
var h2 = heading_1;
var h3 = heading_1;
var h4 = heading_1;
var h5 = heading_1;
var h6 = heading_1;
var hr = thematicBreak_1;
var i = emphasis_1;
var iframe_1$1 = iframe_1;
var img = image_1;
var image_1$1 = image_1;
var input_1$1 = input_1;
var kbd = inlineCode_1;
var li = listItem_1;
var listing = code_1;
var mark$1 = emphasis_1;
var ol$1 = list_1;
var p$2 = paragraph_1;
var plaintext = code_1;
var pre$1 = code_1;
var q$1 = q_1;
var s = _delete;
var samp = inlineCode_1;
var select_1$1 = select_1;
var strike = _delete;
var strong_1$1 = strong_1;
var summary = paragraph_1;
var table_1$1 = table_1;
var td = tableCell;
var textarea_1$1 = textarea_1;
var th = tableCell;
var tr$1 = tableRow;
var tt = inlineCode_1;
var u$1 = emphasis_1;
var ul = list_1;
var _var = inlineCode_1;
var video$1 = media_1;
var wbr_1$1 = wbr_1;
var xmp = code_1;

function ignore() {}

var handlers = {
	root: root_1$1,
	text: text_1$1,
	comment: comment_1$1,
	doctype: doctype,
	applet: applet,
	area: area,
	basefont: basefont,
	bgsound: bgsound,
	caption: caption,
	col: col,
	colgroup: colgroup,
	command: command,
	content: content$2,
	datalist: datalist$1,
	dialog: dialog,
	element: element$2,
	embed: embed,
	frame: frame,
	frameset: frameset,
	isindex: isindex,
	keygen: keygen,
	link: link_1$1,
	math: math,
	menu: menu,
	menuitem: menuitem,
	meta: meta,
	nextid: nextid,
	noembed: noembed,
	noframes: noframes,
	optgroup: optgroup,
	option: option$1,
	param: param,
	script: script,
	shadow: shadow,
	source: source$1,
	spacer: spacer,
	style: style$1,
	svg: svg,
	template: template,
	title: title,
	track: track,
	abbr: abbr,
	acronym: acronym,
	bdi: bdi,
	bdo: bdo,
	big: big,
	blink: blink,
	button: button,
	canvas: canvas,
	cite: cite,
	data: data$1,
	details: details,
	dfn: dfn,
	font: font,
	ins: ins,
	label: label,
	map: map,
	marquee: marquee,
	meter: meter,
	nobr: nobr,
	noscript: noscript,
	object: object,
	output: output,
	progress: progress,
	rb: rb,
	rbc: rbc,
	rp: rp,
	rt: rt,
	rtc: rtc,
	ruby: ruby,
	slot: slot,
	small: small,
	span: span,
	sup: sup,
	sub: sub,
	tbody: tbody,
	tfoot: tfoot,
	thead: thead$1,
	time: time,
	address: address,
	article: article,
	aside: aside,
	body: body,
	center: center,
	div: div$1,
	fieldset: fieldset,
	figcaption: figcaption,
	figure: figure,
	form: form,
	footer: footer,
	header: header,
	hgroup: hgroup,
	html: html$2,
	legend: legend,
	main: main,
	multicol: multicol,
	nav: nav,
	picture: picture,
	section: section,
	a: a,
	audio: audio,
	b: b,
	base: base_1$1,
	blockquote: blockquote_1$1,
	br: br_1,
	code: code_1$1,
	dir: dir,
	dl: dl_1$1,
	dt: dt$1,
	dd: dd$1,
	del: del_1,
	em: em,
	h1: h1,
	h2: h2,
	h3: h3,
	h4: h4,
	h5: h5,
	h6: h6,
	hr: hr,
	i: i,
	iframe: iframe_1$1,
	img: img,
	image: image_1$1,
	input: input_1$1,
	kbd: kbd,
	li: li,
	listing: listing,
	mark: mark$1,
	ol: ol$1,
	p: p$2,
	plaintext: plaintext,
	pre: pre$1,
	q: q$1,
	s: s,
	samp: samp,
	select: select_1$1,
	strike: strike,
	strong: strong_1$1,
	summary: summary,
	table: table_1$1,
	td: td,
	textarea: textarea_1$1,
	th: th,
	tr: tr$1,
	tt: tt,
	u: u$1,
	ul: ul,
	var: _var,
	video: video$1,
	wbr: wbr_1$1,
	xmp: xmp
};

var hastUtilToMdast = toMdast;










var block$1 = convert_1$1(['heading', 'paragraph', 'root']);

function toMdast(tree, options) {
  var settings = options || {};
  var byId = {};
  var mdast;

  h.nodeById = byId;
  h.baseFound = false;
  h.frozenBaseUrl = null;
  h.wrapText = true;
  h.qNesting = 0;

  h.handlers = settings.handlers ? immutable(handlers, settings.handlers) : handlers;
  h.augment = augment;

  h.document = settings.document;
  h.checked = settings.checked || '[x]';
  h.unchecked = settings.unchecked || '[ ]';
  h.quotes = settings.quotes || ['"'];

  unistUtilVisit(tree, 'element', onelement);

  rehypeMinifyWhitespace({newlines: settings.newlines === true})(tree);

  mdast = one_1(h, tree, null);

  unistUtilVisit(mdast, 'text', ontext);

  return mdast

  function h(node, type, props, children) {
    var result;

    if (
      !children &&
      (typeof props === 'string' ||
        (typeof props === 'object' && 'length' in props))
    ) {
      children = props;
      props = {};
    }

    result = immutable({type: type}, props);

    if (typeof children === 'string') {
      result.value = children;
    } else if (children) {
      result.children = children;
    }

    return augment(node, result)
  }

  // To do: inline in a future major.
  // `right` is the finalized mdast node, created from `left`, a hast node.
  function augment(left, right) {
    if (left.position) {
      right.position = left.position;
    }

    return right
  }

  function onelement(node) {
    var id = hastUtilHasProperty(node, 'id') && String(node.properties.id).toUpperCase();

    if (id && !own$5.call(byId, id)) {
      byId[id] = node;
    }
  }

  // Collapse text nodes, and fix whitespace.
  // Most of this is taken care of by `rehype-minify-whitespace`, but
  // we’re generating some whitespace too, and some nodes are in the end
  // ignored.
  // So clean up:
  function ontext(node, index, parent) {
    var previous = parent.children[index - 1];

    if (previous && node.type === previous.type) {
      previous.value += node.value;

      parent.children.splice(index, 1);

      if (previous.position && node.position) {
        previous.position.end = node.position.end;
      }

      // Iterate over the previous node again, to handle its total value.
      return index - 1
    }

    node.value = node.value.replace(/[\t ]*(\r?\n|\r)[\t ]*/, '$1');

    // We don’t care about other phrasing nodes in between (e.g., `[ asd ]()`),
    // as there the whitespace matters.
    if (block$1(parent)) {
      if (!index) {
        node.value = node.value.replace(/^[\t ]+/, '');
      }

      if (index === parent.children.length - 1) {
        node.value = node.value.replace(/[\t ]+$/, '');
      }
    }

    if (!node.value) {
      parent.children.splice(index, 1);
      return index
    }
  }
}

var rehypeRemark = attacher;

// Attacher.
// If a destination is given, runs the destination with the new mdast tree
// (bridge-mode).
// Without destination, returns the mdast tree: further plugins run on that tree
// (mutate-mode).
function attacher(destination, options) {
  var settings;

  if (destination && !destination.process) {
    settings = destination;
    destination = null;
  }

  settings = settings || options || {};

  if (settings.document === undefined || settings.document === null) {
    settings.document = true;
  }

  return destination ? bridge(destination, settings) : mutate(settings)
}

// Bridge-mode.
// Runs the destination with the new mdast tree.
function bridge(destination, options) {
  return transformer
  function transformer(node, file, next) {
    destination.run(hastUtilToMdast(node, options), file, done);
    function done(err) {
      next(err);
    }
  }
}

// Mutate-mode.
// Further transformers run on the mdast tree.
function mutate(options) {
  return transformer
  function transformer(node) {
    return hastUtilToMdast(node, options)
  }
}

var zwitch = factory$1;

var noop = Function.prototype;
var own$6 = {}.hasOwnProperty;

// Handle values based on a property.
function factory$1(key, options) {
  var settings = options || {};

  function one(value) {
    var fn = one.invalid;
    var handlers = one.handlers;

    if (value && own$6.call(value, key)) {
      fn = own$6.call(handlers, value[key]) ? handlers[value[key]] : one.unknown;
    }

    return (fn || noop).apply(this, arguments)
  }

  one.handlers = settings.handlers || {};
  one.invalid = settings.invalid;
  one.unknown = settings.unknown;

  return one
}

var configure_1 = configure;

function configure(base, extension) {
  var index = -1;
  var key;

  // First do subextensions.
  if (extension.extensions) {
    while (++index < extension.extensions.length) {
      configure(base, extension.extensions[index]);
    }
  }

  for (key in extension) {
    if (key === 'extensions') ; else if (key === 'unsafe' || key === 'join') {
      base[key] = base[key].concat(extension[key] || []);
    } else if (key === 'handlers') {
      base[key] = Object.assign(base[key], extension[key] || {});
    } else {
      base.options[key] = extension[key];
    }
  }

  return base
}

var containerFlow = flow;



function flow(parent, context) {
  var children = parent.children || [];
  var results = [];
  var index = -1;
  var child;

  while (++index < children.length) {
    child = children[index];

    results.push(
      context.handle(child, parent, context, {before: '\n', after: '\n'})
    );

    if (index + 1 < children.length) {
      results.push(between(child, children[index + 1]));
    }
  }

  return results.join('')

  function between(left, right) {
    var index = -1;
    var result;

    while (++index < context.join.length) {
      result = context.join[index](left, right, parent, context);

      if (result === true || result === 1) {
        break
      }

      if (typeof result === 'number') {
        return repeatString('\n', 1 + Number(result))
      }

      if (result === false) {
        return '\n\n<!---->\n\n'
      }
    }

    return '\n\n'
  }
}

var indentLines_1 = indentLines;

var eol = /\r?\n|\r/g;

function indentLines(value, map) {
  var result = [];
  var start = 0;
  var line = 0;
  var match;

  while ((match = eol.exec(value))) {
    one(value.slice(start, match.index));
    result.push(match[0]);
    start = match.index + match[0].length;
    line++;
  }

  one(value.slice(start));

  return result.join('')

  function one(value) {
    result.push(map(value, line, !value));
  }
}

var blockquote_1$2 = blockquote$1;




function blockquote$1(node, _, context) {
  var exit = context.enter('blockquote');
  var value = indentLines_1(containerFlow(node, context), map$1);
  exit();
  return value
}

function map$1(line, index, blank) {
  return '>' + (blank ? '' : ' ') + line
}

var _break$1 = hardBreak;

function hardBreak() {
  return '\\\n'
}

var longestStreak_1 = longestStreak;

// Get the count of the longest repeating streak of `character` in `value`.
function longestStreak(value, character) {
  var count = 0;
  var maximum = 0;
  var expected;
  var index;

  if (typeof character !== 'string' || character.length !== 1) {
    throw new Error('Expected character')
  }

  value = String(value);
  index = value.indexOf(character);
  expected = index;

  while (index !== -1) {
    count++;

    if (index === expected) {
      if (count > maximum) {
        maximum = count;
      }
    } else {
      count = 1;
    }

    expected = index + 1;
    index = value.indexOf(character, expected);
  }

  return maximum
}

var formatCodeAsIndented_1 = formatCodeAsIndented;

function formatCodeAsIndented(node, context) {
  return (
    !context.options.fences &&
    node.value &&
    // If there’s no info…
    !node.lang &&
    // And there’s a non-whitespace character…
    /[^ \r\n]/.test(node.value) &&
    // And the value doesn’t start or end in a blank…
    !/^[\t ]*[\r\n]|[\r\n][\t ]*$/.test(node.value)
  )
}

var checkFence_1 = checkFence;

function checkFence(context) {
  var marker = context.options.fence || '`';

  if (marker !== '`' && marker !== '~') {
    throw new Error(
      'Cannot serialize code with `' +
        marker +
        '` for `options.fence`, expected `` ` `` or `~`'
    )
  }

  return marker
}

var safe_1 = safe;

function safe(context, input, config) {
  var value = (config.before || '') + (input || '') + (config.after || '');
  var positions = [];
  var result = [];
  var infos = {};
  var index = -1;
  var before;
  var after;
  var position;
  var pattern;
  var expression;
  var match;
  var start;
  var end;

  while (++index < context.unsafe.length) {
    pattern = context.unsafe[index];

    if (
      !inScope(context.stack, pattern.inConstruct, true) ||
      inScope(context.stack, pattern.notInConstruct)
    ) {
      continue
    }

    expression =
      pattern._compiled || (pattern._compiled = toExpression(pattern));

    while ((match = expression.exec(value))) {
      before = 'before' in pattern || pattern.atBreak;
      after = 'after' in pattern;
      position = match.index + (before ? match[1].length : 0);

      if (positions.indexOf(position) === -1) {
        positions.push(position);
        infos[position] = {before: before, after: after};
      } else {
        if (infos[position].before && !before) {
          infos[position].before = false;
        }

        if (infos[position].after && !after) {
          infos[position].after = false;
        }
      }
    }
  }

  positions.sort(numerical);

  start = config.before ? config.before.length : 0;
  end = value.length - (config.after ? config.after.length : 0);
  index = -1;

  while (++index < positions.length) {
    position = positions[index];

    if (
      // Character before or after matched:
      position < start ||
      position >= end
    ) {
      continue
    }

    // If this character is supposed to be escaped because it has a condition on
    // the next character, and the next character is definitly being escaped,
    // then skip this escape.
    if (
      position + 1 < end &&
      positions[index + 1] === position + 1 &&
      infos[position].after &&
      !infos[position + 1].before &&
      !infos[position + 1].after
    ) {
      continue
    }

    if (start !== position) {
      result.push(value.slice(start, position));
    }

    start = position;

    if (
      /[!-/:-@[-`{-~]/.test(value.charAt(position)) &&
      (!config.encode || config.encode.indexOf(value.charAt(position)) === -1)
    ) {
      // Character escape.
      result.push('\\');
    } else {
      // Character reference.
      result.push(
        '&#x' + value.charCodeAt(position).toString(16).toUpperCase() + ';'
      );
      start++;
    }
  }

  result.push(value.slice(start, end));

  return result.join('')
}

function inScope(stack, list, none) {
  var index;

  if (!list) {
    return none
  }

  if (typeof list === 'string') {
    list = [list];
  }

  index = -1;

  while (++index < list.length) {
    if (stack.indexOf(list[index]) !== -1) {
      return true
    }
  }

  return false
}

function toExpression(pattern) {
  var before = pattern.before ? '(?:' + pattern.before + ')' : '';
  var after = pattern.after ? '(?:' + pattern.after + ')' : '';

  if (pattern.atBreak) {
    before = '[\\r\\n][\\t ]*' + before;
  }

  return new RegExp(
    (before ? '(' + before + ')' : '') +
      (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
      pattern.character +
      (after || ''),
    'g'
  )
}

function numerical(a, b) {
  return a - b
}

var code_1$2 = code$1;








function code$1(node, _, context) {
  var marker = checkFence_1(context);
  var raw = node.value || '';
  var suffix = marker === '`' ? 'GraveAccent' : 'Tilde';
  var value;
  var sequence;
  var exit;
  var subexit;

  if (formatCodeAsIndented_1(node, context)) {
    exit = context.enter('codeIndented');
    value = indentLines_1(raw, map$2);
  } else {
    sequence = repeatString(marker, Math.max(longestStreak_1(raw, marker) + 1, 3));
    exit = context.enter('codeFenced');
    value = sequence;

    if (node.lang) {
      subexit = context.enter('codeFencedLang' + suffix);
      value += safe_1(context, node.lang, {
        before: '`',
        after: ' ',
        encode: ['`']
      });
      subexit();
    }

    if (node.lang && node.meta) {
      subexit = context.enter('codeFencedMeta' + suffix);
      value +=
        ' ' +
        safe_1(context, node.meta, {
          before: ' ',
          after: '\n',
          encode: ['`']
        });
      subexit();
    }

    value += '\n';

    if (raw) {
      value += raw + '\n';
    }

    value += sequence;
  }

  exit();
  return value
}

function map$2(line, _, blank) {
  return (blank ? '' : '    ') + line
}

/* eslint-env browser */

var el;

var semicolon = 59; //  ';'

var decodeEntity_browser = decodeEntity;

function decodeEntity(characters) {
  var entity = '&' + characters + ';';
  var char;

  el = el || document.createElement('i');
  el.innerHTML = entity;
  char = el.textContent;

  // Some entities do not require the closing semicolon (`&not` - for instance),
  // which leads to situations where parsing the assumed entity of &notit; will
  // result in the string `¬it;`.  When we encounter a trailing semicolon after
  // parsing and the entity to decode was not a semicolon (`&semi;`), we can
  // assume that the matching was incomplete
  if (char.charCodeAt(char.length - 1) === semicolon && characters !== 'semi') {
    return false
  }

  // If the decoded string is equal to the input, the entity was not valid
  return char === entity ? false : char
}

var association_1 = association;



var characterEscape = /\\([!-/:-@[-`{-~])/g;
var characterReference = /&(#(\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;

// The `label` of an association is the string value: character escapes and
// references work, and casing is intact.
// The `identifier` is used to match one association to another: controversially,
// character escapes and references don’t work in this matching: `&copy;` does
// not match `©`, and `\+` does not match `+`.
// But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
// matches `a b`.
// So, we do prefer the label when figuring out how we’re going to serialize:
// it has whitespace, casing, and we can ignore most useless character escapes
// and all character references.
function association(node) {
  if (node.label || !node.identifier) {
    return node.label || ''
  }

  return node.identifier
    .replace(characterEscape, '$1')
    .replace(characterReference, decodeIfPossible)
}

function decodeIfPossible($0, $1) {
  return decodeEntity_browser($1) || $0
}

var checkQuote_1 = checkQuote;

function checkQuote(context) {
  var marker = context.options.quote || '"';

  if (marker !== '"' && marker !== "'") {
    throw new Error(
      'Cannot serialize title with `' +
        marker +
        '` for `options.quote`, expected `"`, or `\'`'
    )
  }

  return marker
}

var definition_1 = definition;





function definition(node, _, context) {
  var marker = checkQuote_1(context);
  var suffix = marker === '"' ? 'Quote' : 'Apostrophe';
  var exit = context.enter('definition');
  var subexit = context.enter('label');
  var value =
    '[' + safe_1(context, association_1(node), {before: '[', after: ']'}) + ']: ';

  subexit();

  if (
    // If there’s no url, or…
    !node.url ||
    // If there’s whitespace, enclosed is prettier.
    /[ \t\r\n]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value += '<' + safe_1(context, node.url, {before: '<', after: '>'}) + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += safe_1(context, node.url, {before: ' ', after: ' '});
  }

  subexit();

  if (node.title) {
    subexit = context.enter('title' + suffix);
    value +=
      ' ' +
      marker +
      safe_1(context, node.title, {before: marker, after: marker}) +
      marker;
    subexit();
  }

  exit();

  return value
}

var checkEmphasis_1 = checkEmphasis;

function checkEmphasis(context) {
  var marker = context.options.emphasis || '*';

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize emphasis with `' +
        marker +
        '` for `options.emphasis`, expected `*`, or `_`'
    )
  }

  return marker
}

var containerPhrasing = phrasing;

function phrasing(parent, context, safeOptions) {
  var children = parent.children || [];
  var results = [];
  var index = -1;
  var before = safeOptions.before;
  var after;
  var handle;
  var child;

  while (++index < children.length) {
    child = children[index];

    if (index + 1 < children.length) {
      handle = context.handle.handlers[children[index + 1].type];
      if (handle && handle.peek) handle = handle.peek;
      after = handle
        ? handle(children[index + 1], parent, context, {
            before: '',
            after: ''
          }).charAt(0)
        : '';
    } else {
      after = safeOptions.after;
    }

    results.push(
      context.handle(child, parent, context, {
        before: before,
        after: after
      })
    );
    before = results[results.length - 1].slice(-1);
  }

  return results.join('')
}

var emphasis_1$1 = emphasis$1;
emphasis$1.peek = emphasisPeek;




// To do: there are cases where emphasis cannot “form” depending on the
// previous or next character of sequences.
// There’s no way around that though, except for injecting zero-width stuff.
// Do we need to safeguard against that?
function emphasis$1(node, _, context) {
  var marker = checkEmphasis_1(context);
  var exit = context.enter('emphasis');
  var value = containerPhrasing(node, context, {before: marker, after: marker});
  exit();
  return marker + value + marker
}

function emphasisPeek(node, _, context) {
  return context.options.emphasis || '*'
}

var mdastUtilToString$1 = toString$2;

// Get the text content of a node.
// Prefer the node’s plain-text fields, otherwise serialize its children,
// and if the given value is an array, serialize the nodes in it.
function toString$2(node) {
  return (
    (node &&
      (node.value ||
        node.alt ||
        node.title ||
        ('children' in node && all$3(node.children)) ||
        ('length' in node && all$3(node)))) ||
    ''
  )
}

function all$3(values) {
  var result = [];
  var index = -1;

  while (++index < values.length) {
    result[index] = toString$2(values[index]);
  }

  return result.join('')
}

var formatHeadingAsSetext_1 = formatHeadingAsSetext;



function formatHeadingAsSetext(node, context) {
  return (
    context.options.setext && (!node.depth || node.depth < 3) && mdastUtilToString$1(node)
  )
}

var heading_1$1 = heading$1;





function heading$1(node, _, context) {
  var rank = Math.max(Math.min(6, node.depth || 1), 1);
  var exit;
  var subexit;
  var value;
  var sequence;

  if (formatHeadingAsSetext_1(node, context)) {
    exit = context.enter('headingSetext');
    subexit = context.enter('phrasing');
    value = containerPhrasing(node, context, {before: '\n', after: '\n'});
    subexit();
    exit();

    return (
      value +
      '\n' +
      repeatString(
        rank === 1 ? '=' : '-',
        // The whole size…
        value.length -
          // Minus the position of the character after the last EOL (or
          // 0 if there is none)…
          (Math.max(value.lastIndexOf('\r'), value.lastIndexOf('\n')) + 1)
      )
    )
  }

  sequence = repeatString('#', rank);
  exit = context.enter('headingAtx');
  subexit = context.enter('phrasing');
  value = containerPhrasing(node, context, {before: '# ', after: '\n'});
  value = value ? sequence + ' ' + value : sequence;
  if (context.options.closeAtx) {
    value += ' ' + sequence;
  }

  subexit();
  exit();

  return value
}

var html_1$2 = html$3;

function html$3(node) {
  return node.value || ''
}

var image_1$2 = image$1;
image$1.peek = imagePeek;




function image$1(node, _, context) {
  var quote = checkQuote_1(context);
  var suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  var exit = context.enter('image');
  var subexit = context.enter('label');
  var value = '![' + safe_1(context, node.alt, {before: '[', after: ']'}) + '](';

  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // Or if there’s markdown whitespace or an eol, enclose.
    /[ \t\r\n]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value += '<' + safe_1(context, node.url, {before: '<', after: '>'}) + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += safe_1(context, node.url, {
      before: '(',
      after: node.title ? ' ' : ')'
    });
  }

  subexit();

  if (node.title) {
    subexit = context.enter('title' + suffix);
    value +=
      ' ' +
      quote +
      safe_1(context, node.title, {before: quote, after: quote}) +
      quote;
    subexit();
  }

  value += ')';
  exit();

  return value
}

function imagePeek() {
  return '!'
}

var imageReference_1 = imageReference;
imageReference.peek = imageReferencePeek;




function imageReference(node, _, context) {
  var type = node.referenceType;
  var exit = context.enter('imageReference');
  var subexit = context.enter('label');
  var alt = safe_1(context, node.alt, {before: '[', after: ']'});
  var value = '![' + alt + ']';
  var reference;
  var stack;

  subexit();
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  stack = context.stack;
  context.stack = [];
  subexit = context.enter('reference');
  reference = safe_1(context, association_1(node), {before: '[', after: ']'});
  subexit();
  context.stack = stack;
  exit();

  if (type === 'full' || !alt || alt !== reference) {
    value += '[' + reference + ']';
  } else if (type !== 'shortcut') {
    value += '[]';
  }

  return value
}

function imageReferencePeek() {
  return '!'
}

var inlineCode_1$1 = inlineCode$1;
inlineCode$1.peek = inlineCodePeek;

function inlineCode$1(node) {
  var value = node.value || '';
  var sequence = '`';
  var pad = '';

  // If there is a single grave accent on its own in the code, use a fence of
  // two.
  // If there are two in a row, use one.
  while (new RegExp('(^|[^`])' + sequence + '([^`]|$)').test(value)) {
    sequence += '`';
  }

  // If this is not just spaces or eols (tabs don’t count), and either the
  // first or last character are a space, eol, or tick, then pad with spaces.
  if (
    /[^ \r\n]/.test(value) &&
    (/[ \r\n`]/.test(value.charAt(0)) ||
      /[ \r\n`]/.test(value.charAt(value.length - 1)))
  ) {
    pad = ' ';
  }

  return sequence + pad + value + pad + sequence
}

function inlineCodePeek() {
  return '`'
}

var formatLinkAsAutolink_1 = formatLinkAsAutolink;



function formatLinkAsAutolink(node, context) {
  var raw = mdastUtilToString$1(node);

  return (
    !context.options.resourceLink &&
    // If there’s a url…
    node.url &&
    // And there’s a no title…
    !node.title &&
    // And the content of `node` is a single text node…
    node.children &&
    node.children.length === 1 &&
    node.children[0].type === 'text' &&
    // And if the url is the same as the content…
    (raw === node.url || 'mailto:' + raw === node.url) &&
    // And that starts w/ a protocol…
    /^[a-z][a-z+.-]+:/i.test(node.url) &&
    // And that doesn’t contain ASCII control codes (character escapes and
    // references don’t work) or angle brackets…
    !/[\0- <>\u007F]/.test(node.url)
  )
}

var link_1$2 = link$1;
link$1.peek = linkPeek;






function link$1(node, _, context) {
  var quote = checkQuote_1(context);
  var suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  var exit;
  var subexit;
  var value;
  var stack;

  if (formatLinkAsAutolink_1(node, context)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    stack = context.stack;
    context.stack = [];
    exit = context.enter('autolink');
    value = '<' + containerPhrasing(node, context, {before: '<', after: '>'}) + '>';
    exit();
    context.stack = stack;
    return value
  }

  exit = context.enter('link');
  subexit = context.enter('label');
  value = '[' + containerPhrasing(node, context, {before: '[', after: ']'}) + '](';
  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // Or if there’s markdown whitespace or an eol, enclose.
    /[ \t\r\n]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value += '<' + safe_1(context, node.url, {before: '<', after: '>'}) + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += safe_1(context, node.url, {
      before: '(',
      after: node.title ? ' ' : ')'
    });
  }

  subexit();

  if (node.title) {
    subexit = context.enter('title' + suffix);
    value +=
      ' ' +
      quote +
      safe_1(context, node.title, {before: quote, after: quote}) +
      quote;
    subexit();
  }

  value += ')';

  exit();
  return value
}

function linkPeek(node, _, context) {
  return formatLinkAsAutolink_1(node, context) ? '<' : '['
}

var linkReference_1 = linkReference;
linkReference.peek = linkReferencePeek;





function linkReference(node, _, context) {
  var type = node.referenceType;
  var exit = context.enter('linkReference');
  var subexit = context.enter('label');
  var text = containerPhrasing(node, context, {before: '[', after: ']'});
  var value = '[' + text + ']';
  var reference;
  var stack;

  subexit();
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  stack = context.stack;
  context.stack = [];
  subexit = context.enter('reference');
  reference = safe_1(context, association_1(node), {before: '[', after: ']'});
  subexit();
  context.stack = stack;
  exit();

  if (type === 'full' || !text || text !== reference) {
    value += '[' + reference + ']';
  } else if (type !== 'shortcut') {
    value += '[]';
  }

  return value
}

function linkReferencePeek() {
  return '['
}

var list_1$1 = list$1;



function list$1(node, _, context) {
  var exit = context.enter('list');
  var value = containerFlow(node, context);
  exit();
  return value
}

var checkBullet_1 = checkBullet;

function checkBullet(context) {
  var marker = context.options.bullet || '*';

  if (marker !== '*' && marker !== '+' && marker !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        marker +
        '` for `options.bullet`, expected `*`, `+`, or `-`'
    )
  }

  return marker
}

var checkListItemIndent_1 = checkListItemIndent;

function checkListItemIndent(context) {
  var style = context.options.listItemIndent || 'tab';

  if (style === 1 || style === '1') {
    return 'one'
  }

  if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
    throw new Error(
      'Cannot serialize items with `' +
        style +
        '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`'
    )
  }

  return style
}

var listItem_1$1 = listItem$1;







function listItem$1(node, parent, context) {
  var bullet = checkBullet_1(context);
  var listItemIndent = checkListItemIndent_1(context);
  var size;
  var value;
  var exit;

  if (parent && parent.ordered) {
    bullet =
      (parent.start > -1 ? parent.start : 1) +
      (context.options.incrementListMarker === false
        ? 0
        : parent.children.indexOf(node)) +
      '.';
  }

  size = bullet.length + 1;

  if (
    listItemIndent === 'tab' ||
    (listItemIndent === 'mixed' && ((parent && parent.spread) || node.spread))
  ) {
    size = Math.ceil(size / 4) * 4;
  }

  exit = context.enter('listItem');
  value = indentLines_1(containerFlow(node, context), map);
  exit();

  return value

  function map(line, index, blank) {
    if (index) {
      return (blank ? '' : repeatString(' ', size)) + line
    }

    return (blank ? bullet : bullet + repeatString(' ', size - bullet.length)) + line
  }
}

var paragraph_1$1 = paragraph$1;



function paragraph$1(node, _, context) {
  var exit = context.enter('paragraph');
  var subexit = context.enter('phrasing');
  var value = containerPhrasing(node, context, {before: '\n', after: '\n'});
  subexit();
  exit();
  return value
}

var root_1$2 = root$2;



function root$2(node, _, context) {
  return containerFlow(node, context)
}

var checkStrong_1 = checkStrong;

function checkStrong(context) {
  var marker = context.options.strong || '*';

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize strong with `' +
        marker +
        '` for `options.strong`, expected `*`, or `_`'
    )
  }

  return marker
}

var strong_1$2 = strong$1;
strong$1.peek = strongPeek;




// To do: there are cases where emphasis cannot “form” depending on the
// previous or next character of sequences.
// There’s no way around that though, except for injecting zero-width stuff.
// Do we need to safeguard against that?
function strong$1(node, _, context) {
  var marker = checkStrong_1(context);
  var exit = context.enter('strong');
  var value = containerPhrasing(node, context, {before: marker, after: marker});
  exit();
  return marker + marker + value + marker + marker
}

function strongPeek(node, _, context) {
  return context.options.strong || '*'
}

var text_1$2 = text$2;



function text$2(node, parent, context, safeOptions) {
  return safe_1(context, node.value, safeOptions)
}

var checkRuleRepeat = checkRule;

function checkRule(context) {
  var repetition = context.options.ruleRepetition || 3;

  if (repetition < 3) {
    throw new Error(
      'Cannot serialize rules with repetition `' +
        repetition +
        '` for `options.ruleRepetition`, expected `3` or more'
    )
  }

  return repetition
}

var checkRule_1 = checkRule$1;

function checkRule$1(context) {
  var marker = context.options.rule || '*';

  if (marker !== '*' && marker !== '-' && marker !== '_') {
    throw new Error(
      'Cannot serialize rules with `' +
        marker +
        '` for `options.rule`, expected `*`, `-`, or `_`'
    )
  }

  return marker
}

var thematicBreak_1$1 = thematicBreak$1;





function thematicBreak$1(node, parent, context) {
  var value = repeatString(
    checkRule_1(context) + (context.options.ruleSpaces ? ' ' : ''),
    checkRuleRepeat(context)
  );

  return context.options.ruleSpaces ? value.slice(0, -1) : value
}

var blockquote$2 = blockquote_1$2;
var _break$2 = _break$1;
var code$2 = code_1$2;
var definition$1 = definition_1;
var emphasis$2 = emphasis_1$1;
var hardBreak$1 = _break$1;
var heading$2 = heading_1$1;
var html$4 = html_1$2;
var image$2 = image_1$2;
var imageReference$1 = imageReference_1;
var inlineCode$2 = inlineCode_1$1;
var link$2 = link_1$2;
var linkReference$1 = linkReference_1;
var list$2 = list_1$1;
var listItem$2 = listItem_1$1;
var paragraph$2 = paragraph_1$1;
var root$3 = root_1$2;
var strong$2 = strong_1$2;
var text$3 = text_1$2;
var thematicBreak$2 = thematicBreak_1$1;

var handle$1 = {
	blockquote: blockquote$2,
	break: _break$2,
	code: code$2,
	definition: definition$1,
	emphasis: emphasis$2,
	hardBreak: hardBreak$1,
	heading: heading$2,
	html: html$4,
	image: image$2,
	imageReference: imageReference$1,
	inlineCode: inlineCode$2,
	link: link$2,
	linkReference: linkReference$1,
	list: list$2,
	listItem: listItem$2,
	paragraph: paragraph$2,
	root: root$3,
	strong: strong$2,
	text: text$3,
	thematicBreak: thematicBreak$2
};

var join$1 = [joinDefaults];




function joinDefaults(left, right, parent, context) {
  if (
    // Two lists with the same marker.
    (right.type === 'list' &&
      right.type === left.type &&
      Boolean(left.ordered) === Boolean(right.ordered)) ||
    // Indented code after list or another indented code.
    (right.type === 'code' &&
      formatCodeAsIndented_1(right, context) &&
      (left.type === 'list' ||
        (left.type === right.type && formatCodeAsIndented_1(left, context))))
  ) {
    return false
  }

  // Join children of a list or an item.
  // In which case, `parent` has a `spread` field.
  if (typeof parent.spread === 'boolean') {
    if (
      left.type === 'paragraph' &&
      // Two paragraphs.
      (left.type === right.type ||
        right.type === 'definition' ||
        // Paragraph followed by a setext heading.
        (right.type === 'heading' && formatHeadingAsSetext_1(right, context)))
    ) {
      return
    }

    return parent.spread ? 1 : 0
  }
}

var unsafe = [
  {
    character: '\t',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde']
  },
  {
    character: '\r',
    inConstruct: [
      'codeFencedLangGraveAccent',
      'codeFencedLangTilde',
      'codeFencedMetaGraveAccent',
      'codeFencedMetaTilde',
      'destinationLiteral',
      'headingAtx'
    ]
  },
  {
    character: '\n',
    inConstruct: [
      'codeFencedLangGraveAccent',
      'codeFencedLangTilde',
      'codeFencedMetaGraveAccent',
      'codeFencedMetaTilde',
      'destinationLiteral',
      'headingAtx'
    ]
  },
  {
    character: ' ',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde']
  },
  // An exclamation mark can start an image, if it is followed by a link or
  // a link reference.
  {character: '!', after: '\\[', inConstruct: 'phrasing'},
  // A quote can break out of a title.
  {character: '"', inConstruct: 'titleQuote'},
  // A number sign could start an ATX heading if it starts a line.
  {atBreak: true, character: '#'},
  // Dollar sign and percentage are not used in markdown.
  // An ampersand could start a character reference.
  {character: '&', after: '[#A-Za-z]', inConstruct: 'phrasing'},
  // An apostrophe can break out of a title.
  {character: "'", inConstruct: 'titleApostrophe'},
  // A left paren could break out of a destination raw.
  {character: '(', inConstruct: 'destinationRaw'},
  {before: '\\]', character: '(', inConstruct: 'phrasing'},
  // A right paren could start a list item or break out of a destination
  // raw.
  {atBreak: true, before: '\\d+', character: ')'},
  {character: ')', inConstruct: 'destinationRaw'},
  // An asterisk can start thematic breaks, list items, emphasis, strong.
  {atBreak: true, character: '*'},
  {character: '*', inConstruct: 'phrasing'},
  // A plus sign could start a list item.
  {atBreak: true, character: '+'},
  // A dash can start thematic breaks, list items, and setext heading
  // underlines.
  {atBreak: true, character: '-'},
  // A dot could start a list item.
  {atBreak: true, before: '\\d+', character: '.', after: '(?:[ \t\r\n]|$)'},
  // Slash, colon, and semicolon are not used in markdown for constructs.
  // A less than can start html (flow or text) or an autolink.
  // HTML could start with an exclamation mark (declaration, cdata, comment),
  // slash (closing tag), question mark (instruction), or a letter (tag).
  // An autolink also starts with a letter.
  // Finally, it could break out of a destination literal.
  {atBreak: true, character: '<', after: '[!/?A-Za-z]'},
  {character: '<', after: '[!/?A-Za-z]', inConstruct: 'phrasing'},
  {character: '<', inConstruct: 'destinationLiteral'},
  // An equals to can start setext heading underlines.
  {atBreak: true, character: '='},
  // A greater than can start block quotes and it can break out of a
  // destination literal.
  {atBreak: true, character: '>'},
  {character: '>', inConstruct: 'destinationLiteral'},
  // Question mark and at sign are not used in markdown for constructs.
  // A left bracket can start definitions, references, labels,
  {atBreak: true, character: '['},
  {
    character: '[',
    inConstruct: ['phrasing', 'label', 'reference']
  },
  // A backslash can start an escape (when followed by punctuation) or a
  // hard break (when followed by an eol).
  {character: '\\', after: '[!-/:-@[-`{-~]'},
  {character: '\\', after: '[\\r\\n]', inConstruct: 'phrasing'},
  // A right bracket can exit labels.
  {
    character: ']',
    inConstruct: ['label', 'reference']
  },
  // Caret is not used in markdown for constructs.
  // An underscore can start emphasis, strong, or a thematic break.
  {atBreak: true, character: '_'},
  {before: '[^A-Za-z]', character: '_', inConstruct: 'phrasing'},
  {character: '_', after: '[^A-Za-z]', inConstruct: 'phrasing'},
  // A grave accent can start code (fenced or text), or it can break out of
  // a grave accent code fence.
  {atBreak: true, character: '`'},
  {
    character: '`',
    inConstruct: [
      'codeFencedLangGraveAccent',
      'codeFencedMetaGraveAccent',
      'phrasing'
    ]
  },
  // Left brace, vertical bar, right brace are not used in markdown for
  // constructs.
  // A tilde can start code (fenced).
  {atBreak: true, character: '~'}
];

var lib$3 = toMarkdown;







function toMarkdown(tree, options) {
  var settings = options || {};
  var context = {
    enter: enter,
    stack: [],
    unsafe: [],
    join: [],
    handlers: {},
    options: {}
  };
  var result;

  configure_1(context, {
    unsafe: unsafe,
    join: join$1,
    handlers: handle$1
  });
  configure_1(context, settings);

  if (context.options.tightDefinitions) {
    context.join = [joinDefinition].concat(context.join);
  }

  context.handle = zwitch('type', {
    invalid: invalid,
    unknown: unknown$1,
    handlers: context.handlers
  });

  result = context.handle(tree, null, context, {before: '\n', after: '\n'});

  if (
    result &&
    result.charCodeAt(result.length - 1) !== 10 &&
    result.charCodeAt(result.length - 1) !== 13
  ) {
    result += '\n';
  }

  return result

  function enter(name) {
    context.stack.push(name);
    return exit

    function exit() {
      context.stack.pop();
    }
  }
}

function invalid(value) {
  throw new Error('Cannot handle value `' + value + '`, expected node')
}

function unknown$1(node) {
  throw new Error('Cannot handle unknown node `' + node.type + '`')
}

function joinDefinition(left, right) {
  // No blank line between adjacent definitions.
  if (left.type === 'definition' && left.type === right.type) {
    return 0
  }
}

var mdastUtilToMarkdown = lib$3;

var remarkStringify = stringify$3;



function stringify$3(options) {
  var self = this;

  this.Compiler = compile;

  function compile(tree) {
    return mdastUtilToMarkdown(
      tree,
      Object.assign({}, self.data('settings'), options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        extensions: self.data('toMarkdownExtensions') || []
      })
    )
  }
}

function extract_ast(s) {
  return JSON.stringify(unified_1().use(lib$1).parse(s));
}

function extract_readme(s) {
  return unified_1()
    .use(lib$1)
    .use(lib$2)
    .use(rehypeRemark)
    .use(remarkStringify)
    .process(s);
}

const EXPORTS = { extract_ast, extract_readme };

var main$1 = EXPORTS;

module.exports = main$1;
