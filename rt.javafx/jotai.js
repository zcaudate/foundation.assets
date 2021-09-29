(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
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
    var timeout = runTimeout(cleanUpNextTick);
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
    runClearTimeout(timeout);
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
        runTimeout(drainQueue);
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e||self).proxyCompare={})}(this,function(e){function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var r=Symbol(),n=Symbol(),o=Symbol(),i=Object.getPrototypeOf,u=new WeakMap,a=function(e){return e&&(u.has(e)?u.get(e):i(e)===Object.prototype||i(e)===Array.prototype)},f=function(e){return"object"==typeof e&&null!==e},c=function(e,t,u){if(!a(e))return e;var f=e[o]||e,s=function(e){return Object.isFrozen(e)||Object.values(Object.getOwnPropertyDescriptors(e)).some(function(e){return!e.writable})}(f),l=u&&u.get(f);return l&&l.f===s||((l=function(e,t){var i,u=!1,a=function(t,r){if(!u){var n=t.a.get(e);n||(n=new Set,t.a.set(e,n)),n.add(r)}},f=((i={}).f=t,i.get=function(t,r){return r===o?e:(a(this,r),c(t[r],this.a,this.c))},i.has=function(t,r){return r===n?(u=!0,this.a.delete(e),!0):(a(this,r),r in t)},i.ownKeys=function(e){return a(this,r),Reflect.ownKeys(e)},i);return t&&(f.set=f.deleteProperty=function(){return!1}),f}(f,s)).p=new Proxy(s?function(e){if(Array.isArray(e))return Array.from(e);var t=Object.getOwnPropertyDescriptors(e);return Object.values(t).forEach(function(e){e.configurable=!0}),Object.create(i(e),t)}(f):f,l),u&&u.set(f,l)),l.a=t,l.c=u,l.p},s=function(e,t){var r=Reflect.ownKeys(e),n=Reflect.ownKeys(t);return r.length!==n.length||r.some(function(e,t){return e!==n[t]})};e.MODE_ASSUME_UNCHANGED_IF_UNAFFECTED=1,e.MODE_ASSUME_UNCHANGED_IF_UNAFFECTED_IN_DEEP=4,e.MODE_IGNORE_REF_EQUALITY=2,e.MODE_IGNORE_REF_EQUALITY_IN_DEEP=8,e.affectedToPathList=function(e,t){var r=[];return function e(n,o){var i=t.get(n);i?i.forEach(function(t){e(n[t],o?[].concat(o,[t]):[t])}):o&&r.push(o)}(e),r},e.createDeepProxy=c,e.getUntrackedObject=function(e){return a(e)&&e[o]||null},e.isDeepChanged=function e(n,o,i,u,a){if(void 0===a&&(a=0),Object.is(n,o)&&(!f(n)||0==(2&a)))return!1;if(!f(n)||!f(o))return!0;var c=i.get(n);if(!c)return 0==(1&a);if(u&&0==(2&a)){var l,y=u.get(n);if(y&&y.n===o)return y.g;u.set(n,((l={}).n=o,l.g=!1,l))}for(var p,b,d=null,g=function(e,r){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,r){if(e){if("string"==typeof e)return t(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?t(e,r):void 0}}(e))){n&&(e=n);var o=0;return function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}(c);!(p=g()).done;){var v=p.value,E=v===r?s(n,o):e(n[v],o[v],i,u,a>>>2<<2|a>>>2);if(!0!==E&&!1!==E||(d=E),d)break}return null===d&&(d=0==(1&a)),u&&0==(2&a)&&u.set(n,((b={}).n=o,b.g=d,b)),d},e.markToTrack=function(e,t){void 0===t&&(t=!0),u.set(e,t)},e.trackMemo=function(e){return!!a(e)&&n in e}});


},{}],3:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var hasInitialValue = function hasInitialValue(atom) {
  return 'init' in atom;
};

var IS_EQUAL_PROMISE = Symbol();
var INTERRUPT_PROMISE = Symbol();

var isInterruptablePromise = function isInterruptablePromise(promise) {
  return !!promise[INTERRUPT_PROMISE];
};

var createInterruptablePromise = function createInterruptablePromise(promise) {
  var interrupt;
  var interruptablePromise = new Promise(function (resolve, reject) {
    interrupt = resolve;
    promise.then(resolve, reject);
  });

  interruptablePromise[IS_EQUAL_PROMISE] = function (p) {
    return p === interruptablePromise || p === promise;
  };

  interruptablePromise[INTERRUPT_PROMISE] = interrupt;
  return interruptablePromise;
};

var createState = function createState(initialValues, newAtomReceiver) {
  var state = {
    n: newAtomReceiver,
    v: 0,
    a: new WeakMap(),
    m: new WeakMap(),
    p: new Set()
  };

  if (initialValues) {
    for (var _iterator = _createForOfIteratorHelperLoose(initialValues), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          atom = _step$value[0],
          value = _step$value[1];
      var atomState = {
        v: value,
        r: 0,
        d: new Map()
      };

      if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
        Object.freeze(atomState);
      }

      state.a.set(atom, atomState);
    }
  }

  return state;
};

var getAtomState = function getAtomState(state, atom) {
  return state.a.get(atom);
};

var wipAtomState = function wipAtomState(state, atom, dependencies) {
  var atomState = getAtomState(state, atom);

  var nextAtomState = _extends({
    r: 0
  }, atomState, {
    d: dependencies ? new Map(Array.from(dependencies).map(function (a) {
      var _getAtomState$r, _getAtomState;

      return [a, (_getAtomState$r = (_getAtomState = getAtomState(state, a)) == null ? void 0 : _getAtomState.r) != null ? _getAtomState$r : 0];
    })) : atomState ? atomState.d : new Map()
  });

  return [nextAtomState, atomState == null ? void 0 : atomState.d];
};

var setAtomValue = function setAtomValue(state, atom, value, dependencies, promise) {
  var _atomState$p;

  var _wipAtomState = wipAtomState(state, atom, dependencies),
      atomState = _wipAtomState[0],
      prevDependencies = _wipAtomState[1];

  if (promise && !((_atomState$p = atomState.p) != null && _atomState$p[IS_EQUAL_PROMISE](promise))) {
    return;
  }

  atomState.c == null ? void 0 : atomState.c();
  delete atomState.e;
  delete atomState.p;
  delete atomState.c;
  delete atomState.i;

  if (!('v' in atomState) || !Object.is(atomState.v, value)) {
    atomState.v = value;
    ++atomState.r;
  }

  commitAtomState(state, atom, atomState);
  mountDependencies(state, atom, atomState, prevDependencies);
};

var setAtomReadError = function setAtomReadError(state, atom, error, dependencies, promise) {
  var _atomState$p2;

  var _wipAtomState2 = wipAtomState(state, atom, dependencies),
      atomState = _wipAtomState2[0],
      prevDependencies = _wipAtomState2[1];

  if (promise && !((_atomState$p2 = atomState.p) != null && _atomState$p2[IS_EQUAL_PROMISE](promise))) {
    return;
  }

  atomState.c == null ? void 0 : atomState.c();
  delete atomState.p;
  delete atomState.c;
  delete atomState.i;
  atomState.e = error;
  commitAtomState(state, atom, atomState);
  mountDependencies(state, atom, atomState, prevDependencies);
};

var setAtomReadPromise = function setAtomReadPromise(state, atom, promise, dependencies) {
  var _atomState$p3;

  var _wipAtomState3 = wipAtomState(state, atom, dependencies),
      atomState = _wipAtomState3[0],
      prevDependencies = _wipAtomState3[1];

  if ((_atomState$p3 = atomState.p) != null && _atomState$p3[IS_EQUAL_PROMISE](promise)) {
    return;
  }

  atomState.c == null ? void 0 : atomState.c();

  if (isInterruptablePromise(promise)) {
    atomState.p = promise;
    delete atomState.c;
  } else {
    var interruptablePromise = createInterruptablePromise(promise);
    atomState.p = interruptablePromise;
    atomState.c = interruptablePromise[INTERRUPT_PROMISE];
  }

  commitAtomState(state, atom, atomState);
  mountDependencies(state, atom, atomState, prevDependencies);
};

var setAtomInvalidated = function setAtomInvalidated(state, atom) {
  var _wipAtomState4 = wipAtomState(state, atom),
      atomState = _wipAtomState4[0];

  atomState.c == null ? void 0 : atomState.c();
  delete atomState.p;
  delete atomState.c;
  atomState.i = atomState.r;
  commitAtomState(state, atom, atomState);
};

var setAtomWritePromise = function setAtomWritePromise(state, atom, promise) {
  var _wipAtomState5 = wipAtomState(state, atom),
      atomState = _wipAtomState5[0];

  if (promise) {
    atomState.w = promise;
  } else {
    delete atomState.w;
  }

  commitAtomState(state, atom, atomState);
};

var scheduleReadAtomState = function scheduleReadAtomState(state, atom, promise) {
  promise.finally(function () {
    readAtomState(state, atom, true);
  });
};

var readAtomState = function readAtomState(state, atom, force) {
  if (!force) {
    var atomState = getAtomState(state, atom);

    if (atomState) {
      atomState.d.forEach(function (_, a) {
        if (a !== atom) {
          var aState = getAtomState(state, a);

          if (aState && !aState.e && !aState.p && aState.r === aState.i) {
              readAtomState(state, a, true);
            }
        }
      });

      if (Array.from(atomState.d.entries()).every(function (_ref) {
        var a = _ref[0],
            r = _ref[1];
        var aState = getAtomState(state, a);
        return aState && !aState.e && !aState.p && aState.r !== aState.i && aState.r === r;
      })) {
        return atomState;
      }
    }
  }

  var error;
  var promise;
  var value;
  var dependencies = new Set();

  try {
    var promiseOrValue = atom.read(function (a) {
      dependencies.add(a);

      if (a !== atom) {
        var _aState = readAtomState(state, a);

        if (_aState.e) {
          throw _aState.e;
        }

        if (_aState.p) {
          throw _aState.p;
        }

        return _aState.v;
      }

      var aState = getAtomState(state, a);

      if (aState) {
        if (aState.p) {
          throw aState.p;
        }

        return aState.v;
      }

      if (hasInitialValue(a)) {
        return a.init;
      }

      throw new Error('no atom init');
    });

    if (promiseOrValue instanceof Promise) {
      promise = promiseOrValue.then(function (value) {
        setAtomValue(state, atom, value, dependencies, promise);
        flushPending(state);
      }).catch(function (e) {
        if (e instanceof Promise) {
          scheduleReadAtomState(state, atom, e);
          return e;
        }

        setAtomReadError(state, atom, e instanceof Error ? e : new Error(e), dependencies, promise);
        flushPending(state);
      });
    } else {
      value = promiseOrValue;
    }
  } catch (errorOrPromise) {
    if (errorOrPromise instanceof Promise) {
      promise = errorOrPromise;
    } else if (errorOrPromise instanceof Error) {
      error = errorOrPromise;
    } else {
      error = new Error(errorOrPromise);
    }
  }

  if (error) {
    setAtomReadError(state, atom, error, dependencies);
  } else if (promise) {
    setAtomReadPromise(state, atom, promise, dependencies);
  } else {
    setAtomValue(state, atom, value, dependencies);
  }

  return getAtomState(state, atom);
};

var readAtom = function readAtom(state, readingAtom) {
  var atomState = readAtomState(state, readingAtom);
  state.p.delete(readingAtom);
  flushPending(state);
  return atomState;
};

var addAtom = function addAtom(state, addingAtom) {
  var mounted = state.m.get(addingAtom);

  if (!mounted) {
    mounted = mountAtom(state, addingAtom);
  }

  flushPending(state);
  return mounted;
};

var canUnmountAtom = function canUnmountAtom(atom, mounted) {
  return !mounted.l.size && (!mounted.d.size || mounted.d.size === 1 && mounted.d.has(atom));
};

var delAtom = function delAtom(state, deletingAtom) {
  var mounted = state.m.get(deletingAtom);

  if (mounted && canUnmountAtom(deletingAtom, mounted)) {
    unmountAtom(state, deletingAtom);
  }

  flushPending(state);
};

var invalidateDependents = function invalidateDependents(state, atom) {
  var mounted = state.m.get(atom);
  mounted == null ? void 0 : mounted.d.forEach(function (dependent) {
    if (dependent === atom) {
      return;
    }

    setAtomInvalidated(state, dependent);
    invalidateDependents(state, dependent);
  });
};

var writeAtomState = function writeAtomState(state, atom, update, pendingPromises) {
  var isPendingPromisesExpired = !pendingPromises.length;
  var atomState = getAtomState(state, atom);

  if (atomState && atomState.w) {
      var promise = atomState.w.then(function () {
        writeAtomState(state, atom, update, pendingPromises);

        if (isPendingPromisesExpired) {
          flushPending(state);
        }
      });

      if (!isPendingPromisesExpired) {
        pendingPromises.push(promise);
      }

      return;
    }

  try {
    var promiseOrVoid = atom.write(function (a) {
      var aState = readAtomState(state, a);

      if (aState.e) {
        throw aState.e;
      }

      if (aState.p) {
        if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
          console.warn('Reading pending atom state in write operation. We throw a promise for now.', a);
        }

        throw aState.p;
      }

      if ('v' in aState) {
        return aState.v;
      }

      if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
        console.warn('[Bug] no value found while reading atom in write operation. This probably a bug.', a);
      }

      throw new Error('no value found');
    }, function (a, v) {
      var isPendingPromisesExpired = !pendingPromises.length;

      if (a === atom) {
        setAtomValue(state, a, v);
        invalidateDependents(state, a);
      } else {
        writeAtomState(state, a, v, pendingPromises);
      }

      if (isPendingPromisesExpired) {
        flushPending(state);
      }
    }, update);

    if (promiseOrVoid instanceof Promise) {
      var _promise = promiseOrVoid.finally(function () {
        setAtomWritePromise(state, atom);

        if (isPendingPromisesExpired) {
          flushPending(state);
        }
      });

      if (!isPendingPromisesExpired) {
        pendingPromises.push(_promise);
      }

      setAtomWritePromise(state, atom, _promise);
    }
  } catch (e) {
    if (pendingPromises.length === 1) {
      throw e;
    } else if (!isPendingPromisesExpired) {
      pendingPromises.push(new Promise(function (_resolve, reject) {
        reject(e);
      }));
    } else {
      console.error('Uncaught exception: Use promise to catch error', e);
    }
  }
};

var writeAtom = function writeAtom(state, writingAtom, update) {
  var pendingPromises = [Promise.resolve()];
  writeAtomState(state, writingAtom, update, pendingPromises);
  flushPending(state);

  if (pendingPromises.length <= 1) {
    pendingPromises.splice(0);
  } else {
    return new Promise(function (resolve, reject) {
      var loop = function loop() {
        if (pendingPromises.length <= 1) {
          pendingPromises.splice(0);
          resolve();
        } else {
          Promise.all(pendingPromises).then(function () {
            pendingPromises.splice(1);
            flushPending(state);
            loop();
          }).catch(reject);
        }
      };

      loop();
    });
  }
};

var isActuallyWritableAtom = function isActuallyWritableAtom(atom) {
  return !!atom.write;
};

var mountAtom = function mountAtom(state, atom, initialDependent) {
  var atomState = getAtomState(state, atom);

  if (atomState) {
    atomState.d.forEach(function (_, a) {
      if (a !== atom) {
        if (!state.m.has(a)) {
          mountAtom(state, a, atom);
        }
      }
    });
  } else if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
    console.warn('[Bug] could not find atom state to mount', atom);
  }

  var mounted = {
    d: new Set(initialDependent && [initialDependent]),
    l: new Set(),
    u: undefined
  };
  state.m.set(atom, mounted);

  if (isActuallyWritableAtom(atom) && atom.onMount) {
    var setAtom = function setAtom(update) {
      return writeAtom(state, atom, update);
    };

    mounted.u = atom.onMount(setAtom);
  }

  return mounted;
};

var unmountAtom = function unmountAtom(state, atom) {
  var _state$m$get;

  var onUnmount = (_state$m$get = state.m.get(atom)) == null ? void 0 : _state$m$get.u;

  if (onUnmount) {
    onUnmount();
  }

  state.m.delete(atom);
  var atomState = getAtomState(state, atom);

  if (atomState) {
    atomState.d.forEach(function (_, a) {
      if (a !== atom) {
        var mounted = state.m.get(a);

        if (mounted) {
          mounted.d.delete(atom);

          if (canUnmountAtom(a, mounted)) {
            unmountAtom(state, a);
          }
        }
      }
    });
  } else if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
    console.warn('[Bug] could not find atom state to unmount', atom);
  }
};

var mountDependencies = function mountDependencies(state, atom, atomState, prevDependencies) {
  if (prevDependencies !== atomState.d) {
    var dependencies = new Set(atomState.d.keys());

    if (prevDependencies) {
      prevDependencies.forEach(function (_, a) {
        var mounted = state.m.get(a);

        if (dependencies.has(a)) {
          dependencies.delete(a);
        } else if (mounted) {
          mounted.d.delete(atom);

          if (canUnmountAtom(a, mounted)) {
            unmountAtom(state, a);
          }
        } else if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
          console.warn('[Bug] a dependency is not mounted', a);
        }
      });
    }

    dependencies.forEach(function (a) {
      var mounted = state.m.get(a);

      if (mounted) {
        var dependents = mounted.d;
        dependents.add(atom);
      } else {
        mountAtom(state, a, atom);
      }
    });
  }
};

var commitAtomState = function commitAtomState(state, atom, atomState) {
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
    Object.freeze(atomState);
  }

  var isNewAtom = state.n && !state.a.has(atom);
  state.a.set(atom, atomState);

  if (isNewAtom) {
    state.n(atom);
  }

  ++state.v;
  state.p.add(atom);
};

var flushPending = function flushPending(state) {
  state.p.forEach(function (atom) {
    var mounted = state.m.get(atom);
    mounted == null ? void 0 : mounted.l.forEach(function (listener) {
      return listener();
    });
  });
  state.p.clear();
};

var subscribeAtom = function subscribeAtom(state, atom, callback) {
  var mounted = addAtom(state, atom);
  var listeners = mounted.l;
  listeners.add(callback);
  return function () {
    listeners.delete(callback);
    delAtom(state, atom);
  };
};

var TARGET = Symbol();
var GET_VERSION = Symbol();
var createMutableSource = function createMutableSource(target, getVersion) {
  var _ref;

  return _ref = {}, _ref[TARGET] = target, _ref[GET_VERSION] = getVersion, _ref;
};
var useMutableSource = function useMutableSource(source, getSnapshot, subscribe) {
  var lastVersion = react.useRef(0);
  var currentVersion = source[GET_VERSION](source[TARGET]);

  var _useState = react.useState(function () {
    return [source, getSnapshot, subscribe, currentVersion, getSnapshot(source[TARGET])];
  }),
      state = _useState[0],
      setState = _useState[1];

  var currentSnapshot = state[4];

  if (state[0] !== source || state[1] !== getSnapshot || state[2] !== subscribe) {
    currentSnapshot = getSnapshot(source[TARGET]);
    setState([source, getSnapshot, subscribe, currentVersion, currentSnapshot]);
  } else if (currentVersion !== state[3] && currentVersion !== lastVersion.current) {
    currentSnapshot = getSnapshot(source[TARGET]);

    if (!Object.is(currentSnapshot, state[4])) {
      setState([source, getSnapshot, subscribe, currentVersion, currentSnapshot]);
    }
  }

  react.useEffect(function () {
    var didUnsubscribe = false;

    var checkForUpdates = function checkForUpdates() {
      if (didUnsubscribe) {
        return;
      }

      try {
        var nextSnapshot = getSnapshot(source[TARGET]);
        var nextVersion = source[GET_VERSION](source[TARGET]);
        lastVersion.current = nextVersion;
        setState(function (prev) {
          if (prev[0] !== source || prev[1] !== getSnapshot || prev[2] !== subscribe) {
            return prev;
          }

          if (Object.is(prev[4], nextSnapshot)) {
            return prev;
          }

          return [prev[0], prev[1], prev[2], nextVersion, nextSnapshot];
        });
      } catch (e) {
        setState(function (prev) {
          return [].concat(prev);
        });
      }
    };

    var unsubscribe = subscribe(source[TARGET], checkForUpdates);
    checkForUpdates();
    return function () {
      didUnsubscribe = true;
      unsubscribe();
    };
  }, [source, getSnapshot, subscribe]);
  return currentSnapshot;
};

var createStoreForProduction = function createStoreForProduction(initialValues) {
  var state = createState(initialValues);
  var stateMutableSource = createMutableSource(state, function () {
    return state.v;
  });

  var updateAtom = function updateAtom(atom, update) {
    return writeAtom(state, atom, update);
  };

  return [stateMutableSource, updateAtom];
};

var createStoreForDevelopment = function createStoreForDevelopment(initialValues) {
  var atomsStore = {
    atoms: [],
    listeners: new Set()
  };
  var state = createState(initialValues, function (newAtom) {
    atomsStore.atoms = [].concat(atomsStore.atoms, [newAtom]);
    atomsStore.listeners.forEach(function (listener) {
      return listener();
    });
  });
  var stateMutableSource = createMutableSource(state, function () {
    return state.v;
  });

  var updateAtom = function updateAtom(atom, update) {
    return writeAtom(state, atom, update);
  };

  var atomsMutableSource = createMutableSource(atomsStore, function () {
    return atomsStore.atoms;
  });
  return [stateMutableSource, updateAtom, atomsMutableSource];
};

var createStore = typeof process === 'object' && process.env.NODE_ENV !== 'production' ? createStoreForDevelopment : createStoreForProduction;
var StoreContextMap = new Map();
var getStoreContext = function getStoreContext(scope) {
  if (!StoreContextMap.has(scope)) {
    StoreContextMap.set(scope, react.createContext(createStore()));
  }

  return StoreContextMap.get(scope);
};

var Provider = function Provider(_ref) {
  var initialValues = _ref.initialValues,
      scope = _ref.scope,
      children = _ref.children;
  var storeRef = react.useRef(null);

  if (storeRef.current === null) {
    storeRef.current = createStore(initialValues);
  }

  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && isDevStore(storeRef.current)) {
    useDebugState(storeRef.current);
  }

  var StoreContext = getStoreContext(scope);
  return react.createElement(StoreContext.Provider, {
    value: storeRef.current
  }, children);
};

var atomToPrintable = function atomToPrintable(atom) {
  return atom.debugLabel || atom.toString();
};

var stateToPrintable = function stateToPrintable(_ref2) {
  var state = _ref2[0],
      atoms = _ref2[1];
  return Object.fromEntries(atoms.flatMap(function (atom) {
    var mounted = state.m.get(atom);

    if (!mounted) {
      return [];
    }

    var dependents = mounted.d;
    var atomState = state.a.get(atom) || {};
    return [[atomToPrintable(atom), {
      value: atomState.e || atomState.p || atomState.w || atomState.v,
      dependents: Array.from(dependents).map(atomToPrintable)
    }]];
  }));
};

var isDevStore = function isDevStore(store) {
  return store.length > 2;
};

var getDevState = function getDevState(state) {
  return _extends({}, state);
};
var getDevAtoms = function getDevAtoms(_ref3) {
  var atoms = _ref3.atoms;
  return atoms;
};
var subscribeDevAtoms = function subscribeDevAtoms(_ref4, callback) {
  var listeners = _ref4.listeners;
  listeners.add(callback);
  return function () {
    return listeners.delete(callback);
  };
};

var useDebugState = function useDebugState(store) {
  var stateMutableSource = store[0],
      atomsMutableSource = store[2];
  var atoms = useMutableSource(atomsMutableSource, getDevAtoms, subscribeDevAtoms);
  var subscribe = react.useCallback(function (state, callback) {
    var unsubs = atoms.map(function (atom) {
      return subscribeAtom(state, atom, callback);
    });
    return function () {
      unsubs.forEach(function (unsub) {
        return unsub();
      });
    };
  }, [atoms]);
  var state = useMutableSource(stateMutableSource, getDevState, subscribe);
  react.useDebugValue([state, atoms], stateToPrintable);
};

var keyCount = 0;
function atom(read, write) {
  var key = "atom" + ++keyCount;
  var config = {
    toString: function toString() {
      return key;
    }
  };

  if (typeof read === 'function') {
    config.read = read;
  } else {
    config.init = read;

    config.read = function (get) {
      return get(config);
    };

    config.write = function (get, set, update) {
      set(config, typeof update === 'function' ? update(get(config)) : update);
    };
  }

  if (write) {
    config.write = write;
  }

  return config;
}

var isWritable = function isWritable(atom) {
  return !!atom.write;
};

function useAtom(atom) {
  var getAtomValue = react.useCallback(function (state) {
    var atomState = readAtom(state, atom);

    if (atomState.e) {
      throw atomState.e;
    }

    if (atomState.p) {
      throw atomState.p;
    }

    if (atomState.w) {
      throw atomState.w;
    }

    if ('v' in atomState) {
      return atomState.v;
    }

    throw new Error('no atom value');
  }, [atom]);
  var subscribe = react.useCallback(function (state, callback) {
    return subscribeAtom(state, atom, callback);
  }, [atom]);
  var StoreContext = getStoreContext(atom.scope);

  var _useContext = react.useContext(StoreContext),
      mutableSource = _useContext[0],
      updateAtom = _useContext[1];

  var value = useMutableSource(mutableSource, getAtomValue, subscribe);
  var setAtom = react.useCallback(function (update) {
    if (isWritable(atom)) {
      return updateAtom(atom, update);
    } else {
      throw new Error('not writable atom');
    }
  }, [updateAtom, atom]);
  react.useDebugValue(value);
  return [value, setAtom];
}

exports.Provider = Provider;
exports.SECRET_INTERNAL_getStoreContext = getStoreContext;
exports.atom = atom;
exports.useAtom = useAtom;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],4:[function(require,module,exports){
(function (global){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var jotai = require('./index');

function useUpdateAtom(anAtom) {
  var StoreContext = jotai.SECRET_INTERNAL_getStoreContext(anAtom.scope);

  var _useContext = react.useContext(StoreContext),
      updateAtom = _useContext[1];

  var setAtom = react.useCallback(function (update) {
    return updateAtom(anAtom, update);
  }, [updateAtom, anAtom]);
  return setAtom;
}

function useAtomValue(anAtom) {
  return jotai.useAtom(anAtom)[0];
}

var RESET = Symbol();
function atomWithReset(initialValue) {
  var anAtom = jotai.atom(initialValue, function (get, set, update) {
    if (update === RESET) {
      set(anAtom, initialValue);
    } else {
      set(anAtom, typeof update === 'function' ? update(get(anAtom)) : update);
    }
  });
  return anAtom;
}

function useResetAtom(anAtom) {
  var StoreContext = jotai.SECRET_INTERNAL_getStoreContext(anAtom.scope);

  var _useContext = react.useContext(StoreContext),
      updateAtom = _useContext[1];

  var setAtom = react.useCallback(function () {
    return updateAtom(anAtom, RESET);
  }, [updateAtom, anAtom]);
  return setAtom;
}

function useReducerAtom(anAtom, reducer) {
  var _useAtom = jotai.useAtom(anAtom),
      state = _useAtom[0],
      setState = _useAtom[1];

  var dispatch = react.useCallback(function (action) {
    setState(function (prev) {
      return reducer(prev, action);
    });
  }, [setState, reducer]);
  return [state, dispatch];
}

function atomWithReducer(initialValue, reducer) {
  var anAtom = jotai.atom(initialValue, function (get, set, action) {
    return set(anAtom, reducer(get(anAtom), action));
  });
  return anAtom;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function atomFamily(initializeAtom, areEqual) {
  var shouldRemove = null;
  var atoms = new Map();

  var createAtom = function createAtom(param) {
    var item;

    if (areEqual === undefined) {
      item = atoms.get(param);
    } else {
      for (var _iterator = _createForOfIteratorHelperLoose(atoms), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
            key = _step$value[0],
            value = _step$value[1];

        if (areEqual(key, param)) {
          item = value;
          break;
        }
      }
    }

    if (item !== undefined) {
      if (shouldRemove != null && shouldRemove(item[1], param)) {
        atoms.delete(param);
      } else {
        return item[0];
      }
    }

    var newAtom = initializeAtom(param);
    atoms.set(param, [newAtom, Date.now()]);
    return newAtom;
  };

  createAtom.remove = function (param) {
    if (areEqual === undefined) {
      atoms.delete(param);
    } else {
      for (var _iterator2 = _createForOfIteratorHelperLoose(atoms), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
            key = _step2$value[0];

        if (areEqual(key, param)) {
          atoms.delete(key);
          break;
        }
      }
    }
  };

  createAtom.setShouldRemove = function (fn) {
    shouldRemove = fn;
    if (!shouldRemove) return;

    for (var _iterator3 = _createForOfIteratorHelperLoose(atoms), _step3; !(_step3 = _iterator3()).done;) {
      var _step3$value = _step3.value,
          key = _step3$value[0],
          value = _step3$value[1];

      if (shouldRemove(value[1], key)) {
        atoms.delete(key);
      }
    }
  };

  return createAtom;
}

var getWeakCacheItem = function getWeakCacheItem(cache, deps) {
  var dep = deps[0],
      rest = deps.slice(1);
  var entry = cache.get(dep);

  if (!entry) {
    return;
  }

  if (!rest.length) {
    return entry[1];
  }

  return getWeakCacheItem(entry[0], rest);
};
var setWeakCacheItem = function setWeakCacheItem(cache, deps, item) {
  var dep = deps[0],
      rest = deps.slice(1);
  var entry = cache.get(dep);

  if (!entry) {
    entry = [new WeakMap()];
    cache.set(dep, entry);
  }

  if (!rest.length) {
    entry[1] = item;
    return;
  }

  setWeakCacheItem(entry[0], rest, item);
};

var selectAtomCache = new WeakMap();
function selectAtom(anAtom, selector, equalityFn) {
  if (equalityFn === void 0) {
    equalityFn = Object.is;
  }

  var deps = [anAtom, selector, equalityFn];
  var cachedAtom = getWeakCacheItem(selectAtomCache, deps);

  if (cachedAtom) {
    return cachedAtom;
  }

  var initialized = false;
  var prevSlice;
  var derivedAtom = jotai.atom(function (get) {
    var slice = selector(get(anAtom));

    if (initialized && equalityFn(prevSlice, slice)) {
      return prevSlice;
    }

    initialized = true;
    prevSlice = slice;
    return slice;
  });
  derivedAtom.scope = anAtom.scope;
  setWeakCacheItem(selectAtomCache, deps, derivedAtom);
  return derivedAtom;
}

function useAtomCallback(callback, scope) {
  var anAtom = react.useMemo(function () {
    return jotai.atom(null, function (get, set, _ref) {
      var arg = _ref[0],
          resolve = _ref[1],
          reject = _ref[2];

      try {
        resolve(callback(get, set, arg));
      } catch (e) {
        reject(e);
      }
    });
  }, [callback]);
  anAtom.scope = scope;

  var _useAtom = jotai.useAtom(anAtom),
      invoke = _useAtom[1];

  return react.useCallback(function (arg) {
    return new Promise(function (resolve, reject) {
      invoke([arg, resolve, reject]);
    });
  }, [invoke]);
}

var freezeAtomCache = new WeakMap();

var deepFreeze = function deepFreeze(obj) {
  if (typeof obj !== 'object' || obj === null) return;
  Object.freeze(obj);
  var propNames = Object.getOwnPropertyNames(obj);

  for (var _iterator = _createForOfIteratorHelperLoose(propNames), _step; !(_step = _iterator()).done;) {
    var name = _step.value;
    var value = obj[name];
    deepFreeze(value);
  }

  return obj;
};

function freezeAtom(anAtom) {
  var deps = [anAtom];
  var cachedAtom = getWeakCacheItem(freezeAtomCache, deps);

  if (cachedAtom) {
    return cachedAtom;
  }

  var frozenAtom = jotai.atom(function (get) {
    return deepFreeze(get(anAtom));
  }, function (_get, set, arg) {
    return set(anAtom, arg);
  });
  frozenAtom.scope = anAtom.scope;
  setWeakCacheItem(freezeAtomCache, deps, frozenAtom);
  return frozenAtom;
}
function freezeAtomCreator(createAtom) {
  return function () {
    var anAtom = createAtom.apply(void 0, arguments);
    var origRead = anAtom.read;

    anAtom.read = function (get) {
      return deepFreeze(origRead(get));
    };

    return anAtom;
  };
}

var splitAtomCache = new WeakMap();

var isWritable = function isWritable(atom) {
  return !!atom.write;
};

var isFunction = function isFunction(x) {
  return typeof x === 'function';
};

function splitAtom(arrAtom, keyExtractor) {
  var deps = keyExtractor ? [arrAtom, keyExtractor] : [arrAtom];
  var cachedAtom = getWeakCacheItem(splitAtomCache, deps);

  if (cachedAtom) {
    return cachedAtom;
  }

  var currentAtomList;
  var currentKeyList;

  var keyToAtom = function keyToAtom(key) {
    var _currentKeyList, _currentAtomList;

    var index = (_currentKeyList = currentKeyList) == null ? void 0 : _currentKeyList.indexOf(key);

    if (index === undefined || index === -1) {
      return undefined;
    }

    return (_currentAtomList = currentAtomList) == null ? void 0 : _currentAtomList[index];
  };

  var read = function read(get) {
    var nextAtomList = [];
    var nextKeyList = [];
    get(arrAtom).forEach(function (item, index) {
      var key = keyExtractor ? keyExtractor(item) : index;
      nextKeyList[index] = key;
      var cachedAtom = keyToAtom(key);

      if (cachedAtom) {
        nextAtomList[index] = cachedAtom;
        return;
      }

      var read = function read(get) {
        var _currentKeyList2;

        var index = (_currentKeyList2 = currentKeyList) == null ? void 0 : _currentKeyList2.indexOf(key);

        if (index === undefined || index === -1) {
          throw new Error('index not found');
        }

        return get(arrAtom)[index];
      };

      var write = function write(get, set, update) {
        var _currentKeyList3;

        var index = (_currentKeyList3 = currentKeyList) == null ? void 0 : _currentKeyList3.indexOf(key);

        if (index === undefined || index === -1) {
          throw new Error('index not found');
        }

        var prev = get(arrAtom);
        var nextItem = isFunction(update) ? update(prev[index]) : update;
        set(arrAtom, [].concat(prev.slice(0, index), [nextItem], prev.slice(index + 1)));
      };

      var itemAtom = isWritable(arrAtom) ? jotai.atom(read, write) : jotai.atom(read);
      itemAtom.scope = arrAtom.scope;
      nextAtomList[index] = itemAtom;
    });
    currentKeyList = nextKeyList;

    if (currentAtomList && currentAtomList.length === nextAtomList.length && currentAtomList.every(function (x, i) {
      return x === nextAtomList[i];
    })) {
      return currentAtomList;
    }

    return currentAtomList = nextAtomList;
  };

  var write = function write(get, set, atomToRemove) {
    var index = get(splittedAtom).indexOf(atomToRemove);

    if (index >= 0) {
      var prev = get(arrAtom);
      set(arrAtom, [].concat(prev.slice(0, index), prev.slice(index + 1)));
    }
  };

  var splittedAtom = isWritable(arrAtom) ? jotai.atom(read, write) : jotai.atom(read);
  splittedAtom.scope = arrAtom.scope;
  setWeakCacheItem(splitAtomCache, deps, splittedAtom);
  return splittedAtom;
}

function atomWithDefault(getDefault) {
  var EMPTY = Symbol();
  var overwrittenAtom = jotai.atom(EMPTY);
  var anAtom = jotai.atom(function (get) {
    var overwritten = get(overwrittenAtom);

    if (overwritten !== EMPTY) {
      return overwritten;
    }

    return getDefault(get);
  }, function (get, set, update) {
    return set(overwrittenAtom, typeof update === 'function' ? update(get(anAtom)) : update);
  });
  return anAtom;
}

var waitForAllCache = new WeakMap();
function waitForAll(atoms) {
  var cachedAtom = Array.isArray(atoms) && getWeakCacheItem(waitForAllCache, atoms);

  if (cachedAtom) {
    return cachedAtom;
  }

  var unwrappedAtoms = unwrapAtoms(atoms);
  var derivedAtom = jotai.atom(function (get) {
    var promises = [];
    var values = unwrappedAtoms.map(function (anAtom, index) {
      try {
        return get(anAtom);
      } catch (e) {
        if (e instanceof Promise) {
          promises[index] = e;
        } else {
          throw e;
        }
      }
    });

    if (promises.length) {
      throw Promise.all(promises);
    }

    return wrapResults(atoms, values);
  });
  var waitForAllScope = unwrappedAtoms[0].scope;
  derivedAtom.scope = waitForAllScope;
  validateAtomScopes(waitForAllScope, unwrappedAtoms);

  if (Array.isArray(atoms)) {
    setWeakCacheItem(waitForAllCache, atoms, derivedAtom);
  }

  return derivedAtom;
}

var unwrapAtoms = function unwrapAtoms(atoms) {
  return Array.isArray(atoms) ? atoms : Object.getOwnPropertyNames(atoms).map(function (key) {
    return atoms[key];
  });
};

var wrapResults = function wrapResults(atoms, results) {
  return Array.isArray(atoms) ? results : Object.getOwnPropertyNames(atoms).reduce(function (out, key, idx) {
    var _extends2;

    return _extends({}, out, (_extends2 = {}, _extends2[key] = results[idx], _extends2));
  }, {});
};

function validateAtomScopes(scope, atoms) {
  if (scope && !atoms.every(function (a) {
    return a.scope === scope;
  })) {
    console.warn('Different scopes were found for atoms supplied to waitForAll. This is unsupported and will result in unexpected behavior.');
  }
}

function atomWithHash(key, initialValue, serialize, deserialize) {
  if (serialize === void 0) {
    serialize = JSON.stringify;
  }

  if (deserialize === void 0) {
    deserialize = JSON.parse;
  }

  var anAtom = jotai.atom(initialValue, function (get, set, update) {
    var newValue = typeof update === 'function' ? update(get(anAtom)) : update;
    set(anAtom, newValue);
    var searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, serialize(newValue));
    location.hash = searchParams.toString();
  });

  anAtom.onMount = function (setAtom) {
    var callback = function callback() {
      var searchParams = new URLSearchParams(location.hash.slice(1));
      var str = searchParams.get(key);

      if (str !== null) {
        setAtom(deserialize(str));
      }
    };

    window.addEventListener('hashchange', callback);
    callback();
    return function () {
      window.removeEventListener('hashchange', callback);
    };
  };

  return anAtom;
}

var defaultStorage = {
  getItem: function getItem(key) {
    var storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      throw new Error('no value stored');
    }

    return JSON.parse(storedValue);
  },
  setItem: function setItem(key, newValue) {
    localStorage.setItem(key, JSON.stringify(newValue));
  }
};
function atomWithStorage(key, initialValue, storage) {
  if (storage === void 0) {
    storage = defaultStorage;
  }

  var getInitialValue = function getInitialValue() {
    try {
      return storage.getItem(key);
    } catch (_unused) {
      return initialValue;
    }
  };

  var baseAtom = jotai.atom(initialValue);

  baseAtom.onMount = function (setAtom) {
    var value = getInitialValue();

    if (value instanceof Promise) {
      value.then(setAtom);
    } else {
      setAtom(value);
    }
  };

  var anAtom = jotai.atom(function (get) {
    return get(baseAtom);
  }, function (get, set, update) {
    var newValue = typeof update === 'function' ? update(get(baseAtom)) : update;
    set(baseAtom, newValue);
    storage.setItem(key, newValue);
  });
  return anAtom;
}

exports.RESET = RESET;
exports.atomFamily = atomFamily;
exports.atomWithDefault = atomWithDefault;
exports.atomWithHash = atomWithHash;
exports.atomWithReducer = atomWithReducer;
exports.atomWithReset = atomWithReset;
exports.atomWithStorage = atomWithStorage;
exports.freezeAtom = freezeAtom;
exports.freezeAtomCreator = freezeAtomCreator;
exports.selectAtom = selectAtom;
exports.splitAtom = splitAtom;
exports.useAtomCallback = useAtomCallback;
exports.useAtomValue = useAtomValue;
exports.useReducerAtom = useReducerAtom;
exports.useResetAtom = useResetAtom;
exports.useUpdateAtom = useUpdateAtom;
exports.waitForAll = waitForAll;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./index":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vanilla = require('../valtio/vanilla');
var jotai = require('./index');

var isObject = function isObject(x) {
  return typeof x === 'object' && x !== null;
};

var applyChanges = function applyChanges(proxyObject, prev, next) {
  Object.keys(prev).forEach(function (key) {
    if (!(key in next)) {
      delete proxyObject[key];
    } else if (Object.is(prev[key], next[key])) ; else if (isObject(proxyObject[key]) && isObject(prev[key]) && isObject(next[key])) {
      applyChanges(proxyObject[key], prev[key], next[key]);
    } else {
      proxyObject[key] = next[key];
    }
  });
  Object.keys(next).forEach(function (key) {
    if (!(key in prev)) {
      proxyObject[key] = next[key];
    }
  });
};

function atomWithProxy(proxyObject) {
  var baseAtom = jotai.atom(vanilla.snapshot(proxyObject));

  baseAtom.onMount = function (setValue) {
    var callback = function callback() {
      setValue(vanilla.snapshot(proxyObject));
    };

    var unsub = vanilla.subscribe(proxyObject, callback);
    callback();
    return unsub;
  };

  var derivedAtom = jotai.atom(function (get) {
    return get(baseAtom);
  }, function (get, _set, update) {
    var newValue = typeof update === 'function' ? update(get(baseAtom)) : update;
    applyChanges(proxyObject, vanilla.snapshot(proxyObject), newValue);
  });
  return derivedAtom;
}

exports.atomWithProxy = atomWithProxy;

},{"../valtio/vanilla":8,"./index":3}],6:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vanilla = require('./vanilla');
var react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var proxyCompare = require('proxy-compare');

var TARGET = Symbol();
var GET_VERSION = Symbol();
var createMutableSource = function createMutableSource(target, getVersion) {
  var _ref;

  return _ref = {}, _ref[TARGET] = target, _ref[GET_VERSION] = getVersion, _ref;
};
var useMutableSource = function useMutableSource(source, getSnapshot, subscribe) {
  var lastVersion = react.useRef(0);
  var currentVersion = source[GET_VERSION](source[TARGET]);

  var _useState = react.useState(function () {
    return [source, getSnapshot, subscribe, currentVersion, getSnapshot(source[TARGET])];
  }),
      state = _useState[0],
      setState = _useState[1];

  var currentSnapshot = state[4];

  if (state[0] !== source || state[1] !== getSnapshot || state[2] !== subscribe) {
    currentSnapshot = getSnapshot(source[TARGET]);
    setState([source, getSnapshot, subscribe, currentVersion, currentSnapshot]);
  } else if (currentVersion !== state[3] && currentVersion !== lastVersion.current) {
    currentSnapshot = getSnapshot(source[TARGET]);

    if (!Object.is(currentSnapshot, state[4])) {
      setState([source, getSnapshot, subscribe, currentVersion, currentSnapshot]);
    }
  }

  react.useEffect(function () {
    var didUnsubscribe = false;

    var checkForUpdates = function checkForUpdates() {
      if (didUnsubscribe) {
        return;
      }

      try {
        var nextSnapshot = getSnapshot(source[TARGET]);
        var nextVersion = source[GET_VERSION](source[TARGET]);
        lastVersion.current = nextVersion;
        setState(function (prev) {
          if (prev[0] !== source || prev[1] !== getSnapshot || prev[2] !== subscribe) {
            return prev;
          }

          if (Object.is(prev[4], nextSnapshot)) {
            return prev;
          }

          return [prev[0], prev[1], prev[2], nextVersion, nextSnapshot];
        });
      } catch (e) {
        setState(function (prev) {
          return [].concat(prev);
        });
      }
    };

    var unsubscribe = subscribe(source[TARGET], checkForUpdates);
    checkForUpdates();
    return function () {
      didUnsubscribe = true;
      unsubscribe();
    };
  }, [source, getSnapshot, subscribe]);
  return currentSnapshot;
};

var isSSR = typeof window === 'undefined' || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
var useIsomorphicLayoutEffect = isSSR ? react.useEffect : react.useLayoutEffect;

var useAffectedDebugValue = function useAffectedDebugValue(state, affected) {
  var pathList = react.useRef();
  react.useEffect(function () {
    pathList.current = proxyCompare.affectedToPathList(state, affected);
  });
  react.useDebugValue(pathList.current);
};

var mutableSourceCache = new WeakMap();

var getMutableSource = function getMutableSource(proxyObject) {
  if (!mutableSourceCache.has(proxyObject)) {
    mutableSourceCache.set(proxyObject, createMutableSource(proxyObject, vanilla.getVersion));
  }

  return mutableSourceCache.get(proxyObject);
};

var useSnapshot = function useSnapshot(proxyObject, options) {
  var _useReducer = react.useReducer(function (c) {
    return c + 1;
  }, 0),
      forceUpdate = _useReducer[1];

  var affected = new WeakMap();
  var lastAffected = react.useRef();
  var prevSnapshot = react.useRef();
  var lastSnapshot = react.useRef();
  useIsomorphicLayoutEffect(function () {
    lastSnapshot.current = prevSnapshot.current = vanilla.snapshot(proxyObject);
  }, [proxyObject]);
  useIsomorphicLayoutEffect(function () {
    lastAffected.current = affected;

    if (prevSnapshot.current !== lastSnapshot.current && proxyCompare.isDeepChanged(prevSnapshot.current, lastSnapshot.current, affected, new WeakMap())) {
      prevSnapshot.current = lastSnapshot.current;
      forceUpdate();
    }
  });
  var notifyInSync = options == null ? void 0 : options.sync;
  var sub = react.useCallback(function (proxyObject, cb) {
    return vanilla.subscribe(proxyObject, function () {
      var nextSnapshot = vanilla.snapshot(proxyObject);
      lastSnapshot.current = nextSnapshot;

      try {
        if (lastAffected.current && !proxyCompare.isDeepChanged(prevSnapshot.current, nextSnapshot, lastAffected.current, new WeakMap())) {
          return;
        }
      } catch (e) {}

      prevSnapshot.current = nextSnapshot;
      cb();
    }, notifyInSync);
  }, [notifyInSync]);
  var currSnapshot = useMutableSource(getMutableSource(proxyObject), vanilla.snapshot, sub);

  if (typeof process === 'object' && process.env.NODE_ENV !== 'production') {
    useAffectedDebugValue(currSnapshot, affected);
  }

  var proxyCache = react.useMemo(function () {
    return new WeakMap();
  }, []);
  return proxyCompare.createDeepProxy(currSnapshot, affected, proxyCache);
};

exports.useSnapshot = useSnapshot;
Object.keys(vanilla).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return vanilla[k];
    }
  });
});

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./vanilla":8,"_process":1,"proxy-compare":2}],7:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var proxyCompare = require('proxy-compare');
var vanilla = require('./vanilla');

var subscribeKey = function subscribeKey(proxyObject, key, callback, notifyInSync) {
  var prevValue = proxyObject[key];
  return vanilla.subscribe(proxyObject, function () {
    var nextValue = proxyObject[key];

    if (!Object.is(prevValue, nextValue)) {
      callback(prevValue = nextValue);
    }
  }, notifyInSync);
};
var devtools = function devtools(proxyObject, name) {
  var extension;

  try {
    extension = window.__REDUX_DEVTOOLS_EXTENSION__;
  } catch (_unused) {}

  if (!extension) {
    if (typeof process === 'object' && process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.warn('[Warning] Please install/enable Redux devtools extension');
    }

    return;
  }

  var isTimeTraveling = false;
  var devtools = extension.connect({
    name: name
  });
  var unsub1 = vanilla.subscribe(proxyObject, function () {
    if (isTimeTraveling) {
      isTimeTraveling = false;
    } else {
      devtools.send("Update - " + new Date().toLocaleString(), vanilla.snapshot(proxyObject));
    }
  });
  var unsub2 = devtools.subscribe(function (message) {
    var _message$payload3, _message$payload4;

    if (message.type === 'DISPATCH' && message.state) {
      var _message$payload, _message$payload2;

      if (((_message$payload = message.payload) == null ? void 0 : _message$payload.type) === 'JUMP_TO_ACTION' || ((_message$payload2 = message.payload) == null ? void 0 : _message$payload2.type) === 'JUMP_TO_STATE') {
        isTimeTraveling = true;
      }

      var nextValue = JSON.parse(message.state);
      Object.keys(nextValue).forEach(function (key) {
        proxyObject[key] = nextValue[key];
      });
    } else if (message.type === 'DISPATCH' && ((_message$payload3 = message.payload) == null ? void 0 : _message$payload3.type) === 'COMMIT') {
      devtools.init(vanilla.snapshot(proxyObject));
    } else if (message.type === 'DISPATCH' && ((_message$payload4 = message.payload) == null ? void 0 : _message$payload4.type) === 'IMPORT_STATE') {
      var _message$payload$next, _message$payload$next2;

      var actions = (_message$payload$next = message.payload.nextLiftedState) == null ? void 0 : _message$payload$next.actionsById;
      var computedStates = ((_message$payload$next2 = message.payload.nextLiftedState) == null ? void 0 : _message$payload$next2.computedStates) || [];
      isTimeTraveling = true;
      computedStates.forEach(function (_ref, index) {
        var state = _ref.state;
        var action = actions[index] || "Update - " + new Date().toLocaleString();
        Object.keys(state).forEach(function (key) {
          proxyObject[key] = state[key];
        });

        if (index === 0) {
          devtools.init(vanilla.snapshot(proxyObject));
        } else {
          devtools.send(action, vanilla.snapshot(proxyObject));
        }
      });
    }
  });
  devtools.init(vanilla.snapshot(proxyObject));
  return function () {
    unsub1();
    unsub2();
  };
};
var addComputed = function addComputed(proxyObject, computedFns, targetObject) {
  if (targetObject === void 0) {
    targetObject = proxyObject;
  }
  Object.keys(computedFns).forEach(function (key) {
    if (Object.getOwnPropertyDescriptor(targetObject, key)) {
      throw new Error('object property already defined');
    }

    var get = computedFns[key];
    var prevSnapshot;
    var affected = new WeakMap();
    var pending = false;

    var callback = function callback() {
      var nextSnapshot = vanilla.snapshot(proxyObject);

      if (!pending && (!prevSnapshot || proxyCompare.isDeepChanged(prevSnapshot, nextSnapshot, affected))) {
        affected = new WeakMap();
        var value = get(proxyCompare.createDeepProxy(nextSnapshot, affected));
        prevSnapshot = nextSnapshot;

        if (value instanceof Promise) {
          pending = true;
          value.then(function (v) {
            targetObject[key] = v;
          }).catch(function (e) {
            targetObject[key] = new Proxy({}, {
              get: function get() {
                throw e;
              }
            });
          }).finally(function () {
            pending = false;
          });
        }

        targetObject[key] = value;
      }
    };

    vanilla.subscribe(proxyObject, callback);
    callback();
  });
};
var proxyWithComputed = function proxyWithComputed(initialObject, computedFns) {
  Object.keys(computedFns).forEach(function (key) {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error('object property already defined');
    }

    var computedFn = computedFns[key];

    var _ref2 = typeof computedFn === 'function' ? {
      get: computedFn
    } : computedFn,
        get = _ref2.get,
        set = _ref2.set;

    var computedValue;
    var prevSnapshot;
    var affected = new WeakMap();
    var desc = {};

    desc.get = function () {
      var nextSnapshot = vanilla.snapshot(proxyObject);

      if (!prevSnapshot || proxyCompare.isDeepChanged(prevSnapshot, nextSnapshot, affected)) {
        affected = new WeakMap();
        computedValue = get(proxyCompare.createDeepProxy(nextSnapshot, affected));
        prevSnapshot = nextSnapshot;
      }

      return computedValue;
    };

    if (set) {
      desc.set = function (newValue) {
        return set(proxyObject, newValue);
      };
    }

    Object.defineProperty(initialObject, key, desc);
  });
  var proxyObject = vanilla.proxy(initialObject);
  return proxyObject;
};

exports.addComputed = addComputed;
exports.devtools = devtools;
exports.proxyWithComputed = proxyWithComputed;
exports.subscribeKey = subscribeKey;

}).call(this)}).call(this,require('_process'))

},{"./vanilla":8,"_process":1,"proxy-compare":2}],8:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var proxyCompare = require('proxy-compare');

var VERSION = Symbol();
var LISTENERS = Symbol();
var SNAPSHOT = Symbol();
var PROMISE_RESULT = Symbol();
var PROMISE_ERROR = Symbol();
var refSet = new WeakSet();
var ref = function ref(o) {
  refSet.add(o);
  return o;
};

var isSupportedObject = function isSupportedObject(x) {
  return typeof x === 'object' && x !== null && (Array.isArray(x) || !x[Symbol.iterator]) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer);
};

var proxyCache = new WeakMap();
var globalVersion = 1;
var snapshotCache = new WeakMap();
var proxy = function proxy(initialObject) {
  if (initialObject === void 0) {
    initialObject = {};
  }

  if (!isSupportedObject(initialObject)) {
    throw new Error('unsupported object type');
  }

  if (proxyCache.has(initialObject)) {
    return proxyCache.get(initialObject);
  }

  var version = globalVersion;
  var listeners = new Set();

  var notifyUpdate = function notifyUpdate(nextVersion) {
    if (!nextVersion) {
      nextVersion = ++globalVersion;
    }

    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach(function (listener) {
        return listener(nextVersion);
      });
    }
  };

  var createSnapshot = function createSnapshot(target, receiver) {
    var cache = snapshotCache.get(receiver);

    if (cache && cache.version === version) {
      return cache.snapshot;
    }

    var snapshot = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    proxyCompare.markToTrack(snapshot, true);
    snapshotCache.set(receiver, {
      version: version,
      snapshot: snapshot
    });
    Reflect.ownKeys(target).forEach(function (key) {
      var value = target[key];

      if (refSet.has(value)) {
        proxyCompare.markToTrack(value, false);
        snapshot[key] = value;
      } else if (!isSupportedObject(value)) {
        snapshot[key] = value;
      } else if (value instanceof Promise) {
        if (PROMISE_RESULT in value) {
          snapshot[key] = value[PROMISE_RESULT];
        } else {
          var errorOrPromise = value[PROMISE_ERROR] || value;
          Object.defineProperty(snapshot, key, {
            get: function get() {
              throw errorOrPromise;
            }
          });
        }
      } else if (value[VERSION]) {
        snapshot[key] = value[SNAPSHOT];
      } else {
        snapshot[key] = value;
      }
    });
    Object.freeze(snapshot);
    return snapshot;
  };

  var baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  var proxyObject = new Proxy(baseObject, {
    get: function get(target, prop, receiver) {
      if (prop === VERSION) {
        return version;
      }

      if (prop === LISTENERS) {
        return listeners;
      }

      if (prop === SNAPSHOT) {
        return createSnapshot(target, receiver);
      }

      return target[prop];
    },
    deleteProperty: function deleteProperty(target, prop) {
      var prevValue = target[prop];
      var childListeners = prevValue && prevValue[LISTENERS];

      if (childListeners) {
        childListeners.delete(notifyUpdate);
      }

      var deleted = Reflect.deleteProperty(target, prop);

      if (deleted) {
        notifyUpdate();
      }

      return deleted;
    },
    set: function set(target, prop, value) {
      var _Object$getOwnPropert;

      var prevValue = target[prop];

      if (Object.is(prevValue, value)) {
        return true;
      }

      var childListeners = prevValue && prevValue[LISTENERS];

      if (childListeners) {
        childListeners.delete(notifyUpdate);
      }

      if (refSet.has(value) || !isSupportedObject(value) || (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(target, prop)) != null && _Object$getOwnPropert.set) {
        target[prop] = value;
      } else if (value instanceof Promise) {
        target[prop] = value.then(function (v) {
          target[prop][PROMISE_RESULT] = v;
          notifyUpdate();
          return v;
        }).catch(function (e) {
          target[prop][PROMISE_ERROR] = e;
          notifyUpdate();
        });
      } else {
        value = proxyCompare.getUntrackedObject(value) || value;

        if (value[LISTENERS]) {
          target[prop] = value;
        } else {
          target[prop] = proxy(value);
        }

        target[prop][LISTENERS].add(notifyUpdate);
      }

      notifyUpdate();
      return true;
    }
  });
  proxyCache.set(initialObject, proxyObject);
  Reflect.ownKeys(initialObject).forEach(function (key) {
    var desc = Object.getOwnPropertyDescriptor(initialObject, key);

    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = initialObject[key];
    }
  });
  return proxyObject;
};
var getVersion = function getVersion(proxyObject) {
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && (!proxyObject || !proxyObject[VERSION])) {
    throw new Error('Please use proxy object');
  }

  return proxyObject[VERSION];
};
var subscribe = function subscribe(proxyObject, callback, notifyInSync) {
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && (!proxyObject || !proxyObject[LISTENERS])) {
    throw new Error('Please use proxy object');
  }

  var pendingVersion = 0;

  var listener = function listener(nextVersion) {
    if (notifyInSync) {
      callback();
      return;
    }

    pendingVersion = nextVersion;
    Promise.resolve().then(function () {
      if (nextVersion === pendingVersion) {
        callback();
      }
    });
  };

  proxyObject[LISTENERS].add(listener);
  return function () {
    proxyObject[LISTENERS].delete(listener);
  };
};
var snapshot = function snapshot(proxyObject) {
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && (!proxyObject || !proxyObject[SNAPSHOT])) {
    throw new Error('Please use proxy object');
  }

  return proxyObject[SNAPSHOT];
};

exports.getVersion = getVersion;
exports.proxy = proxy;
exports.ref = ref;
exports.snapshot = snapshot;
exports.subscribe = subscribe;

}).call(this)}).call(this,require('_process'))

},{"_process":1,"proxy-compare":2}],9:[function(require,module,exports){
// browser.build-jotai.main/reactNil
// const reactNil = require("./react-nil")

// browser.build-jotai.main/valtio
const valtio = require("./valtio")

// browser.build-jotai.main/valtioUtils
const valtioUtils = require("./valtio/utils")

// browser.build-jotai.main/jotai
const jotai = require("./jotai")

// browser.build-jotai.main/jotaiUtils
const jotaiUtils = require("./jotai/utils")

// browser.build-jotai.main/jotaiValtio
const jotaiValtio = require("./jotai/valtio")

// browser.build-jotai.main/__init__
// globalThis["renderNil"] = reactNil.render;
globalThis["valtio"] = valtio;
globalThis["valtioUtils"] = valtioUtils;
globalThis["jotai"] = jotai;
globalThis["jotaiUtils"] = jotaiUtils;
globalThis["jotaiValtio"] = jotaiValtio;
},{"./jotai":3,"./jotai/utils":4,"./jotai/valtio":5,"./valtio":6,"./valtio/utils":7}]},{},[9])
