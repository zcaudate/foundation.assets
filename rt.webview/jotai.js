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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rYnJvd3Nlci1wYWNrQDYuMS4wL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK3Byb2Nlc3NAMC4xMS4xMC9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzLy5wbnBtL3JlZ2lzdHJ5Lm5sYXJrLmNvbStwcm94eS1jb21wYXJlQDEuMS42L25vZGVfbW9kdWxlcy9wcm94eS1jb21wYXJlL2Rpc3QvaW5kZXgudW1kLmpzIiwic3JjL2pvdGFpL2luZGV4LmpzIiwic3JjL2pvdGFpL3V0aWxzLmpzIiwic3JjL2pvdGFpL3ZhbHRpby5qcyIsInNyYy92YWx0aW8vaW5kZXguanMiLCJzcmMvdmFsdGlvL3V0aWxzLmpzIiwic3JjL3ZhbHRpby92YW5pbGxhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6NUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoKGV8fHNlbGYpLnByb3h5Q29tcGFyZT17fSl9KHRoaXMsZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlLHQpeyhudWxsPT10fHx0PmUubGVuZ3RoKSYmKHQ9ZS5sZW5ndGgpO2Zvcih2YXIgcj0wLG49bmV3IEFycmF5KHQpO3I8dDtyKyspbltyXT1lW3JdO3JldHVybiBufXZhciByPVN5bWJvbCgpLG49U3ltYm9sKCksbz1TeW1ib2woKSxpPU9iamVjdC5nZXRQcm90b3R5cGVPZix1PW5ldyBXZWFrTWFwLGE9ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJih1LmhhcyhlKT91LmdldChlKTppKGUpPT09T2JqZWN0LnByb3RvdHlwZXx8aShlKT09PUFycmF5LnByb3RvdHlwZSl9LGY9ZnVuY3Rpb24oZSl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGUmJm51bGwhPT1lfSxjPWZ1bmN0aW9uKGUsdCx1KXtpZighYShlKSlyZXR1cm4gZTt2YXIgZj1lW29dfHxlLHM9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5pc0Zyb3plbihlKXx8T2JqZWN0LnZhbHVlcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhlKSkuc29tZShmdW5jdGlvbihlKXtyZXR1cm4hZS53cml0YWJsZX0pfShmKSxsPXUmJnUuZ2V0KGYpO3JldHVybiBsJiZsLmY9PT1zfHwoKGw9ZnVuY3Rpb24oZSx0KXt2YXIgaSx1PSExLGE9ZnVuY3Rpb24odCxyKXtpZighdSl7dmFyIG49dC5hLmdldChlKTtufHwobj1uZXcgU2V0LHQuYS5zZXQoZSxuKSksbi5hZGQocil9fSxmPSgoaT17fSkuZj10LGkuZ2V0PWZ1bmN0aW9uKHQscil7cmV0dXJuIHI9PT1vP2U6KGEodGhpcyxyKSxjKHRbcl0sdGhpcy5hLHRoaXMuYykpfSxpLmhhcz1mdW5jdGlvbih0LHIpe3JldHVybiByPT09bj8odT0hMCx0aGlzLmEuZGVsZXRlKGUpLCEwKTooYSh0aGlzLHIpLHIgaW4gdCl9LGkub3duS2V5cz1mdW5jdGlvbihlKXtyZXR1cm4gYSh0aGlzLHIpLFJlZmxlY3Qub3duS2V5cyhlKX0saSk7cmV0dXJuIHQmJihmLnNldD1mLmRlbGV0ZVByb3BlcnR5PWZ1bmN0aW9uKCl7cmV0dXJuITF9KSxmfShmLHMpKS5wPW5ldyBQcm94eShzP2Z1bmN0aW9uKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpcmV0dXJuIEFycmF5LmZyb20oZSk7dmFyIHQ9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoZSk7cmV0dXJuIE9iamVjdC52YWx1ZXModCkuZm9yRWFjaChmdW5jdGlvbihlKXtlLmNvbmZpZ3VyYWJsZT0hMH0pLE9iamVjdC5jcmVhdGUoaShlKSx0KX0oZik6ZixsKSx1JiZ1LnNldChmLGwpKSxsLmE9dCxsLmM9dSxsLnB9LHM9ZnVuY3Rpb24oZSx0KXt2YXIgcj1SZWZsZWN0Lm93bktleXMoZSksbj1SZWZsZWN0Lm93bktleXModCk7cmV0dXJuIHIubGVuZ3RoIT09bi5sZW5ndGh8fHIuc29tZShmdW5jdGlvbihlLHQpe3JldHVybiBlIT09blt0XX0pfTtlLk1PREVfQVNTVU1FX1VOQ0hBTkdFRF9JRl9VTkFGRkVDVEVEPTEsZS5NT0RFX0FTU1VNRV9VTkNIQU5HRURfSUZfVU5BRkZFQ1RFRF9JTl9ERUVQPTQsZS5NT0RFX0lHTk9SRV9SRUZfRVFVQUxJVFk9MixlLk1PREVfSUdOT1JFX1JFRl9FUVVBTElUWV9JTl9ERUVQPTgsZS5hZmZlY3RlZFRvUGF0aExpc3Q9ZnVuY3Rpb24oZSx0KXt2YXIgcj1bXTtyZXR1cm4gZnVuY3Rpb24gZShuLG8pe3ZhciBpPXQuZ2V0KG4pO2k/aS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2Uoblt0XSxvP1tdLmNvbmNhdChvLFt0XSk6W3RdKX0pOm8mJnIucHVzaChvKX0oZSkscn0sZS5jcmVhdGVEZWVwUHJveHk9YyxlLmdldFVudHJhY2tlZE9iamVjdD1mdW5jdGlvbihlKXtyZXR1cm4gYShlKSYmZVtvXXx8bnVsbH0sZS5pc0RlZXBDaGFuZ2VkPWZ1bmN0aW9uIGUobixvLGksdSxhKXtpZih2b2lkIDA9PT1hJiYoYT0wKSxPYmplY3QuaXMobixvKSYmKCFmKG4pfHwwPT0oMiZhKSkpcmV0dXJuITE7aWYoIWYobil8fCFmKG8pKXJldHVybiEwO3ZhciBjPWkuZ2V0KG4pO2lmKCFjKXJldHVybiAwPT0oMSZhKTtpZih1JiYwPT0oMiZhKSl7dmFyIGwseT11LmdldChuKTtpZih5JiZ5Lm49PT1vKXJldHVybiB5Lmc7dS5zZXQobiwoKGw9e30pLm49byxsLmc9ITEsbCkpfWZvcih2YXIgcCxiLGQ9bnVsbCxnPWZ1bmN0aW9uKGUscil7dmFyIG47aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFN5bWJvbHx8bnVsbD09ZVtTeW1ib2wuaXRlcmF0b3JdKXtpZihBcnJheS5pc0FycmF5KGUpfHwobj1mdW5jdGlvbihlLHIpe2lmKGUpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXJldHVybiB0KGUscik7dmFyIG49T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpLnNsaWNlKDgsLTEpO3JldHVyblwiT2JqZWN0XCI9PT1uJiZlLmNvbnN0cnVjdG9yJiYobj1lLmNvbnN0cnVjdG9yLm5hbWUpLFwiTWFwXCI9PT1ufHxcIlNldFwiPT09bj9BcnJheS5mcm9tKGUpOlwiQXJndW1lbnRzXCI9PT1ufHwvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKT90KGUscik6dm9pZCAwfX0oZSkpKXtuJiYoZT1uKTt2YXIgbz0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBvPj1lLmxlbmd0aD97ZG9uZTohMH06e2RvbmU6ITEsdmFsdWU6ZVtvKytdfX19dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpfXJldHVybihuPWVbU3ltYm9sLml0ZXJhdG9yXSgpKS5uZXh0LmJpbmQobil9KGMpOyEocD1nKCkpLmRvbmU7KXt2YXIgdj1wLnZhbHVlLEU9dj09PXI/cyhuLG8pOmUoblt2XSxvW3ZdLGksdSxhPj4+Mjw8MnxhPj4+Mik7aWYoITAhPT1FJiYhMSE9PUV8fChkPUUpLGQpYnJlYWt9cmV0dXJuIG51bGw9PT1kJiYoZD0wPT0oMSZhKSksdSYmMD09KDImYSkmJnUuc2V0KG4sKChiPXt9KS5uPW8sYi5nPWQsYikpLGR9LGUubWFya1RvVHJhY2s9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT10JiYodD0hMCksdS5zZXQoZSx0KX0sZS50cmFja01lbW89ZnVuY3Rpb24oZSl7cmV0dXJuISFhKGUpJiZuIGluIGV9fSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC51bWQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciByZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICByZXR1cm4gYXJyMjtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZShvLCBhbGxvd0FycmF5TGlrZSkge1xuICB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTtcbiAgaWYgKGl0KSByZXR1cm4gKGl0ID0gaXQuY2FsbChvKSkubmV4dC5iaW5kKGl0KTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7XG4gICAgaWYgKGl0KSBvID0gaXQ7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHtcbiAgICAgICAgZG9uZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogb1tpKytdXG4gICAgICB9O1xuICAgIH07XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbnZhciBoYXNJbml0aWFsVmFsdWUgPSBmdW5jdGlvbiBoYXNJbml0aWFsVmFsdWUoYXRvbSkge1xuICByZXR1cm4gJ2luaXQnIGluIGF0b207XG59O1xuXG52YXIgSVNfRVFVQUxfUFJPTUlTRSA9IFN5bWJvbCgpO1xudmFyIElOVEVSUlVQVF9QUk9NSVNFID0gU3ltYm9sKCk7XG5cbnZhciBpc0ludGVycnVwdGFibGVQcm9taXNlID0gZnVuY3Rpb24gaXNJbnRlcnJ1cHRhYmxlUHJvbWlzZShwcm9taXNlKSB7XG4gIHJldHVybiAhIXByb21pc2VbSU5URVJSVVBUX1BST01JU0VdO1xufTtcblxudmFyIGNyZWF0ZUludGVycnVwdGFibGVQcm9taXNlID0gZnVuY3Rpb24gY3JlYXRlSW50ZXJydXB0YWJsZVByb21pc2UocHJvbWlzZSkge1xuICB2YXIgaW50ZXJydXB0O1xuICB2YXIgaW50ZXJydXB0YWJsZVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaW50ZXJydXB0ID0gcmVzb2x2ZTtcbiAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgfSk7XG5cbiAgaW50ZXJydXB0YWJsZVByb21pc2VbSVNfRVFVQUxfUFJPTUlTRV0gPSBmdW5jdGlvbiAocCkge1xuICAgIHJldHVybiBwID09PSBpbnRlcnJ1cHRhYmxlUHJvbWlzZSB8fCBwID09PSBwcm9taXNlO1xuICB9O1xuXG4gIGludGVycnVwdGFibGVQcm9taXNlW0lOVEVSUlVQVF9QUk9NSVNFXSA9IGludGVycnVwdDtcbiAgcmV0dXJuIGludGVycnVwdGFibGVQcm9taXNlO1xufTtcblxudmFyIGNyZWF0ZVN0YXRlID0gZnVuY3Rpb24gY3JlYXRlU3RhdGUoaW5pdGlhbFZhbHVlcywgbmV3QXRvbVJlY2VpdmVyKSB7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICBuOiBuZXdBdG9tUmVjZWl2ZXIsXG4gICAgdjogMCxcbiAgICBhOiBuZXcgV2Vha01hcCgpLFxuICAgIG06IG5ldyBXZWFrTWFwKCksXG4gICAgcDogbmV3IFNldCgpXG4gIH07XG5cbiAgaWYgKGluaXRpYWxWYWx1ZXMpIHtcbiAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKGluaXRpYWxWYWx1ZXMpLCBfc3RlcDsgIShfc3RlcCA9IF9pdGVyYXRvcigpKS5kb25lOykge1xuICAgICAgdmFyIF9zdGVwJHZhbHVlID0gX3N0ZXAudmFsdWUsXG4gICAgICAgICAgYXRvbSA9IF9zdGVwJHZhbHVlWzBdLFxuICAgICAgICAgIHZhbHVlID0gX3N0ZXAkdmFsdWVbMV07XG4gICAgICB2YXIgYXRvbVN0YXRlID0ge1xuICAgICAgICB2OiB2YWx1ZSxcbiAgICAgICAgcjogMCxcbiAgICAgICAgZDogbmV3IE1hcCgpXG4gICAgICB9O1xuXG4gICAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShhdG9tU3RhdGUpO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZS5hLnNldChhdG9tLCBhdG9tU3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbnZhciBnZXRBdG9tU3RhdGUgPSBmdW5jdGlvbiBnZXRBdG9tU3RhdGUoc3RhdGUsIGF0b20pIHtcbiAgcmV0dXJuIHN0YXRlLmEuZ2V0KGF0b20pO1xufTtcblxudmFyIHdpcEF0b21TdGF0ZSA9IGZ1bmN0aW9uIHdpcEF0b21TdGF0ZShzdGF0ZSwgYXRvbSwgZGVwZW5kZW5jaWVzKSB7XG4gIHZhciBhdG9tU3RhdGUgPSBnZXRBdG9tU3RhdGUoc3RhdGUsIGF0b20pO1xuXG4gIHZhciBuZXh0QXRvbVN0YXRlID0gX2V4dGVuZHMoe1xuICAgIHI6IDBcbiAgfSwgYXRvbVN0YXRlLCB7XG4gICAgZDogZGVwZW5kZW5jaWVzID8gbmV3IE1hcChBcnJheS5mcm9tKGRlcGVuZGVuY2llcykubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICB2YXIgX2dldEF0b21TdGF0ZSRyLCBfZ2V0QXRvbVN0YXRlO1xuXG4gICAgICByZXR1cm4gW2EsIChfZ2V0QXRvbVN0YXRlJHIgPSAoX2dldEF0b21TdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYSkpID09IG51bGwgPyB2b2lkIDAgOiBfZ2V0QXRvbVN0YXRlLnIpICE9IG51bGwgPyBfZ2V0QXRvbVN0YXRlJHIgOiAwXTtcbiAgICB9KSkgOiBhdG9tU3RhdGUgPyBhdG9tU3RhdGUuZCA6IG5ldyBNYXAoKVxuICB9KTtcblxuICByZXR1cm4gW25leHRBdG9tU3RhdGUsIGF0b21TdGF0ZSA9PSBudWxsID8gdm9pZCAwIDogYXRvbVN0YXRlLmRdO1xufTtcblxudmFyIHNldEF0b21WYWx1ZSA9IGZ1bmN0aW9uIHNldEF0b21WYWx1ZShzdGF0ZSwgYXRvbSwgdmFsdWUsIGRlcGVuZGVuY2llcywgcHJvbWlzZSkge1xuICB2YXIgX2F0b21TdGF0ZSRwO1xuXG4gIHZhciBfd2lwQXRvbVN0YXRlID0gd2lwQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBkZXBlbmRlbmNpZXMpLFxuICAgICAgYXRvbVN0YXRlID0gX3dpcEF0b21TdGF0ZVswXSxcbiAgICAgIHByZXZEZXBlbmRlbmNpZXMgPSBfd2lwQXRvbVN0YXRlWzFdO1xuXG4gIGlmIChwcm9taXNlICYmICEoKF9hdG9tU3RhdGUkcCA9IGF0b21TdGF0ZS5wKSAhPSBudWxsICYmIF9hdG9tU3RhdGUkcFtJU19FUVVBTF9QUk9NSVNFXShwcm9taXNlKSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhdG9tU3RhdGUuYyA9PSBudWxsID8gdm9pZCAwIDogYXRvbVN0YXRlLmMoKTtcbiAgZGVsZXRlIGF0b21TdGF0ZS5lO1xuICBkZWxldGUgYXRvbVN0YXRlLnA7XG4gIGRlbGV0ZSBhdG9tU3RhdGUuYztcbiAgZGVsZXRlIGF0b21TdGF0ZS5pO1xuXG4gIGlmICghKCd2JyBpbiBhdG9tU3RhdGUpIHx8ICFPYmplY3QuaXMoYXRvbVN0YXRlLnYsIHZhbHVlKSkge1xuICAgIGF0b21TdGF0ZS52ID0gdmFsdWU7XG4gICAgKythdG9tU3RhdGUucjtcbiAgfVxuXG4gIGNvbW1pdEF0b21TdGF0ZShzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlKTtcbiAgbW91bnREZXBlbmRlbmNpZXMoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSwgcHJldkRlcGVuZGVuY2llcyk7XG59O1xuXG52YXIgc2V0QXRvbVJlYWRFcnJvciA9IGZ1bmN0aW9uIHNldEF0b21SZWFkRXJyb3Ioc3RhdGUsIGF0b20sIGVycm9yLCBkZXBlbmRlbmNpZXMsIHByb21pc2UpIHtcbiAgdmFyIF9hdG9tU3RhdGUkcDI7XG5cbiAgdmFyIF93aXBBdG9tU3RhdGUyID0gd2lwQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBkZXBlbmRlbmNpZXMpLFxuICAgICAgYXRvbVN0YXRlID0gX3dpcEF0b21TdGF0ZTJbMF0sXG4gICAgICBwcmV2RGVwZW5kZW5jaWVzID0gX3dpcEF0b21TdGF0ZTJbMV07XG5cbiAgaWYgKHByb21pc2UgJiYgISgoX2F0b21TdGF0ZSRwMiA9IGF0b21TdGF0ZS5wKSAhPSBudWxsICYmIF9hdG9tU3RhdGUkcDJbSVNfRVFVQUxfUFJPTUlTRV0ocHJvbWlzZSkpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXRvbVN0YXRlLmMgPT0gbnVsbCA/IHZvaWQgMCA6IGF0b21TdGF0ZS5jKCk7XG4gIGRlbGV0ZSBhdG9tU3RhdGUucDtcbiAgZGVsZXRlIGF0b21TdGF0ZS5jO1xuICBkZWxldGUgYXRvbVN0YXRlLmk7XG4gIGF0b21TdGF0ZS5lID0gZXJyb3I7XG4gIGNvbW1pdEF0b21TdGF0ZShzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlKTtcbiAgbW91bnREZXBlbmRlbmNpZXMoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSwgcHJldkRlcGVuZGVuY2llcyk7XG59O1xuXG52YXIgc2V0QXRvbVJlYWRQcm9taXNlID0gZnVuY3Rpb24gc2V0QXRvbVJlYWRQcm9taXNlKHN0YXRlLCBhdG9tLCBwcm9taXNlLCBkZXBlbmRlbmNpZXMpIHtcbiAgdmFyIF9hdG9tU3RhdGUkcDM7XG5cbiAgdmFyIF93aXBBdG9tU3RhdGUzID0gd2lwQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBkZXBlbmRlbmNpZXMpLFxuICAgICAgYXRvbVN0YXRlID0gX3dpcEF0b21TdGF0ZTNbMF0sXG4gICAgICBwcmV2RGVwZW5kZW5jaWVzID0gX3dpcEF0b21TdGF0ZTNbMV07XG5cbiAgaWYgKChfYXRvbVN0YXRlJHAzID0gYXRvbVN0YXRlLnApICE9IG51bGwgJiYgX2F0b21TdGF0ZSRwM1tJU19FUVVBTF9QUk9NSVNFXShwcm9taXNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF0b21TdGF0ZS5jID09IG51bGwgPyB2b2lkIDAgOiBhdG9tU3RhdGUuYygpO1xuXG4gIGlmIChpc0ludGVycnVwdGFibGVQcm9taXNlKHByb21pc2UpKSB7XG4gICAgYXRvbVN0YXRlLnAgPSBwcm9taXNlO1xuICAgIGRlbGV0ZSBhdG9tU3RhdGUuYztcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW50ZXJydXB0YWJsZVByb21pc2UgPSBjcmVhdGVJbnRlcnJ1cHRhYmxlUHJvbWlzZShwcm9taXNlKTtcbiAgICBhdG9tU3RhdGUucCA9IGludGVycnVwdGFibGVQcm9taXNlO1xuICAgIGF0b21TdGF0ZS5jID0gaW50ZXJydXB0YWJsZVByb21pc2VbSU5URVJSVVBUX1BST01JU0VdO1xuICB9XG5cbiAgY29tbWl0QXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBhdG9tU3RhdGUpO1xuICBtb3VudERlcGVuZGVuY2llcyhzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlLCBwcmV2RGVwZW5kZW5jaWVzKTtcbn07XG5cbnZhciBzZXRBdG9tSW52YWxpZGF0ZWQgPSBmdW5jdGlvbiBzZXRBdG9tSW52YWxpZGF0ZWQoc3RhdGUsIGF0b20pIHtcbiAgdmFyIF93aXBBdG9tU3RhdGU0ID0gd2lwQXRvbVN0YXRlKHN0YXRlLCBhdG9tKSxcbiAgICAgIGF0b21TdGF0ZSA9IF93aXBBdG9tU3RhdGU0WzBdO1xuXG4gIGF0b21TdGF0ZS5jID09IG51bGwgPyB2b2lkIDAgOiBhdG9tU3RhdGUuYygpO1xuICBkZWxldGUgYXRvbVN0YXRlLnA7XG4gIGRlbGV0ZSBhdG9tU3RhdGUuYztcbiAgYXRvbVN0YXRlLmkgPSBhdG9tU3RhdGUucjtcbiAgY29tbWl0QXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBhdG9tU3RhdGUpO1xufTtcblxudmFyIHNldEF0b21Xcml0ZVByb21pc2UgPSBmdW5jdGlvbiBzZXRBdG9tV3JpdGVQcm9taXNlKHN0YXRlLCBhdG9tLCBwcm9taXNlKSB7XG4gIHZhciBfd2lwQXRvbVN0YXRlNSA9IHdpcEF0b21TdGF0ZShzdGF0ZSwgYXRvbSksXG4gICAgICBhdG9tU3RhdGUgPSBfd2lwQXRvbVN0YXRlNVswXTtcblxuICBpZiAocHJvbWlzZSkge1xuICAgIGF0b21TdGF0ZS53ID0gcHJvbWlzZTtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgYXRvbVN0YXRlLnc7XG4gIH1cblxuICBjb21taXRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSk7XG59O1xuXG52YXIgc2NoZWR1bGVSZWFkQXRvbVN0YXRlID0gZnVuY3Rpb24gc2NoZWR1bGVSZWFkQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBwcm9taXNlKSB7XG4gIHByb21pc2UuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgcmVhZEF0b21TdGF0ZShzdGF0ZSwgYXRvbSwgdHJ1ZSk7XG4gIH0pO1xufTtcblxudmFyIHJlYWRBdG9tU3RhdGUgPSBmdW5jdGlvbiByZWFkQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBmb3JjZSkge1xuICBpZiAoIWZvcmNlKSB7XG4gICAgdmFyIGF0b21TdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYXRvbSk7XG5cbiAgICBpZiAoYXRvbVN0YXRlKSB7XG4gICAgICBhdG9tU3RhdGUuZC5mb3JFYWNoKGZ1bmN0aW9uIChfLCBhKSB7XG4gICAgICAgIGlmIChhICE9PSBhdG9tKSB7XG4gICAgICAgICAgdmFyIGFTdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYSk7XG5cbiAgICAgICAgICBpZiAoYVN0YXRlICYmICFhU3RhdGUuZSAmJiAhYVN0YXRlLnAgJiYgYVN0YXRlLnIgPT09IGFTdGF0ZS5pKSB7XG4gICAgICAgICAgICAgIHJlYWRBdG9tU3RhdGUoc3RhdGUsIGEsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKEFycmF5LmZyb20oYXRvbVN0YXRlLmQuZW50cmllcygpKS5ldmVyeShmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgYSA9IF9yZWZbMF0sXG4gICAgICAgICAgICByID0gX3JlZlsxXTtcbiAgICAgICAgdmFyIGFTdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYSk7XG4gICAgICAgIHJldHVybiBhU3RhdGUgJiYgIWFTdGF0ZS5lICYmICFhU3RhdGUucCAmJiBhU3RhdGUuciAhPT0gYVN0YXRlLmkgJiYgYVN0YXRlLnIgPT09IHI7XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4gYXRvbVN0YXRlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBlcnJvcjtcbiAgdmFyIHByb21pc2U7XG4gIHZhciB2YWx1ZTtcbiAgdmFyIGRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcblxuICB0cnkge1xuICAgIHZhciBwcm9taXNlT3JWYWx1ZSA9IGF0b20ucmVhZChmdW5jdGlvbiAoYSkge1xuICAgICAgZGVwZW5kZW5jaWVzLmFkZChhKTtcblxuICAgICAgaWYgKGEgIT09IGF0b20pIHtcbiAgICAgICAgdmFyIF9hU3RhdGUgPSByZWFkQXRvbVN0YXRlKHN0YXRlLCBhKTtcblxuICAgICAgICBpZiAoX2FTdGF0ZS5lKSB7XG4gICAgICAgICAgdGhyb3cgX2FTdGF0ZS5lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9hU3RhdGUucCkge1xuICAgICAgICAgIHRocm93IF9hU3RhdGUucDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfYVN0YXRlLnY7XG4gICAgICB9XG5cbiAgICAgIHZhciBhU3RhdGUgPSBnZXRBdG9tU3RhdGUoc3RhdGUsIGEpO1xuXG4gICAgICBpZiAoYVN0YXRlKSB7XG4gICAgICAgIGlmIChhU3RhdGUucCkge1xuICAgICAgICAgIHRocm93IGFTdGF0ZS5wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFTdGF0ZS52O1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzSW5pdGlhbFZhbHVlKGEpKSB7XG4gICAgICAgIHJldHVybiBhLmluaXQ7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gYXRvbSBpbml0Jyk7XG4gICAgfSk7XG5cbiAgICBpZiAocHJvbWlzZU9yVmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZU9yVmFsdWUudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgc2V0QXRvbVZhbHVlKHN0YXRlLCBhdG9tLCB2YWx1ZSwgZGVwZW5kZW5jaWVzLCBwcm9taXNlKTtcbiAgICAgICAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgIHNjaGVkdWxlUmVhZEF0b21TdGF0ZShzdGF0ZSwgYXRvbSwgZSk7XG4gICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRBdG9tUmVhZEVycm9yKHN0YXRlLCBhdG9tLCBlIGluc3RhbmNlb2YgRXJyb3IgPyBlIDogbmV3IEVycm9yKGUpLCBkZXBlbmRlbmNpZXMsIHByb21pc2UpO1xuICAgICAgICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gcHJvbWlzZU9yVmFsdWU7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvck9yUHJvbWlzZSkge1xuICAgIGlmIChlcnJvck9yUHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHByb21pc2UgPSBlcnJvck9yUHJvbWlzZTtcbiAgICB9IGVsc2UgaWYgKGVycm9yT3JQcm9taXNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGVycm9yID0gZXJyb3JPclByb21pc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGVycm9yT3JQcm9taXNlKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZXJyb3IpIHtcbiAgICBzZXRBdG9tUmVhZEVycm9yKHN0YXRlLCBhdG9tLCBlcnJvciwgZGVwZW5kZW5jaWVzKTtcbiAgfSBlbHNlIGlmIChwcm9taXNlKSB7XG4gICAgc2V0QXRvbVJlYWRQcm9taXNlKHN0YXRlLCBhdG9tLCBwcm9taXNlLCBkZXBlbmRlbmNpZXMpO1xuICB9IGVsc2Uge1xuICAgIHNldEF0b21WYWx1ZShzdGF0ZSwgYXRvbSwgdmFsdWUsIGRlcGVuZGVuY2llcyk7XG4gIH1cblxuICByZXR1cm4gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhdG9tKTtcbn07XG5cbnZhciByZWFkQXRvbSA9IGZ1bmN0aW9uIHJlYWRBdG9tKHN0YXRlLCByZWFkaW5nQXRvbSkge1xuICB2YXIgYXRvbVN0YXRlID0gcmVhZEF0b21TdGF0ZShzdGF0ZSwgcmVhZGluZ0F0b20pO1xuICBzdGF0ZS5wLmRlbGV0ZShyZWFkaW5nQXRvbSk7XG4gIGZsdXNoUGVuZGluZyhzdGF0ZSk7XG4gIHJldHVybiBhdG9tU3RhdGU7XG59O1xuXG52YXIgYWRkQXRvbSA9IGZ1bmN0aW9uIGFkZEF0b20oc3RhdGUsIGFkZGluZ0F0b20pIHtcbiAgdmFyIG1vdW50ZWQgPSBzdGF0ZS5tLmdldChhZGRpbmdBdG9tKTtcblxuICBpZiAoIW1vdW50ZWQpIHtcbiAgICBtb3VudGVkID0gbW91bnRBdG9tKHN0YXRlLCBhZGRpbmdBdG9tKTtcbiAgfVxuXG4gIGZsdXNoUGVuZGluZyhzdGF0ZSk7XG4gIHJldHVybiBtb3VudGVkO1xufTtcblxudmFyIGNhblVubW91bnRBdG9tID0gZnVuY3Rpb24gY2FuVW5tb3VudEF0b20oYXRvbSwgbW91bnRlZCkge1xuICByZXR1cm4gIW1vdW50ZWQubC5zaXplICYmICghbW91bnRlZC5kLnNpemUgfHwgbW91bnRlZC5kLnNpemUgPT09IDEgJiYgbW91bnRlZC5kLmhhcyhhdG9tKSk7XG59O1xuXG52YXIgZGVsQXRvbSA9IGZ1bmN0aW9uIGRlbEF0b20oc3RhdGUsIGRlbGV0aW5nQXRvbSkge1xuICB2YXIgbW91bnRlZCA9IHN0YXRlLm0uZ2V0KGRlbGV0aW5nQXRvbSk7XG5cbiAgaWYgKG1vdW50ZWQgJiYgY2FuVW5tb3VudEF0b20oZGVsZXRpbmdBdG9tLCBtb3VudGVkKSkge1xuICAgIHVubW91bnRBdG9tKHN0YXRlLCBkZWxldGluZ0F0b20pO1xuICB9XG5cbiAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbn07XG5cbnZhciBpbnZhbGlkYXRlRGVwZW5kZW50cyA9IGZ1bmN0aW9uIGludmFsaWRhdGVEZXBlbmRlbnRzKHN0YXRlLCBhdG9tKSB7XG4gIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYXRvbSk7XG4gIG1vdW50ZWQgPT0gbnVsbCA/IHZvaWQgMCA6IG1vdW50ZWQuZC5mb3JFYWNoKGZ1bmN0aW9uIChkZXBlbmRlbnQpIHtcbiAgICBpZiAoZGVwZW5kZW50ID09PSBhdG9tKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0QXRvbUludmFsaWRhdGVkKHN0YXRlLCBkZXBlbmRlbnQpO1xuICAgIGludmFsaWRhdGVEZXBlbmRlbnRzKHN0YXRlLCBkZXBlbmRlbnQpO1xuICB9KTtcbn07XG5cbnZhciB3cml0ZUF0b21TdGF0ZSA9IGZ1bmN0aW9uIHdyaXRlQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCB1cGRhdGUsIHBlbmRpbmdQcm9taXNlcykge1xuICB2YXIgaXNQZW5kaW5nUHJvbWlzZXNFeHBpcmVkID0gIXBlbmRpbmdQcm9taXNlcy5sZW5ndGg7XG4gIHZhciBhdG9tU3RhdGUgPSBnZXRBdG9tU3RhdGUoc3RhdGUsIGF0b20pO1xuXG4gIGlmIChhdG9tU3RhdGUgJiYgYXRvbVN0YXRlLncpIHtcbiAgICAgIHZhciBwcm9taXNlID0gYXRvbVN0YXRlLncudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdyaXRlQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCB1cGRhdGUsIHBlbmRpbmdQcm9taXNlcyk7XG5cbiAgICAgICAgaWYgKGlzUGVuZGluZ1Byb21pc2VzRXhwaXJlZCkge1xuICAgICAgICAgIGZsdXNoUGVuZGluZyhzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWlzUGVuZGluZ1Byb21pc2VzRXhwaXJlZCkge1xuICAgICAgICBwZW5kaW5nUHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICB0cnkge1xuICAgIHZhciBwcm9taXNlT3JWb2lkID0gYXRvbS53cml0ZShmdW5jdGlvbiAoYSkge1xuICAgICAgdmFyIGFTdGF0ZSA9IHJlYWRBdG9tU3RhdGUoc3RhdGUsIGEpO1xuXG4gICAgICBpZiAoYVN0YXRlLmUpIHtcbiAgICAgICAgdGhyb3cgYVN0YXRlLmU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhU3RhdGUucCkge1xuICAgICAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlYWRpbmcgcGVuZGluZyBhdG9tIHN0YXRlIGluIHdyaXRlIG9wZXJhdGlvbi4gV2UgdGhyb3cgYSBwcm9taXNlIGZvciBub3cuJywgYSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBhU3RhdGUucDtcbiAgICAgIH1cblxuICAgICAgaWYgKCd2JyBpbiBhU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGFTdGF0ZS52O1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdbQnVnXSBubyB2YWx1ZSBmb3VuZCB3aGlsZSByZWFkaW5nIGF0b20gaW4gd3JpdGUgb3BlcmF0aW9uLiBUaGlzIHByb2JhYmx5IGEgYnVnLicsIGEpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHZhbHVlIGZvdW5kJyk7XG4gICAgfSwgZnVuY3Rpb24gKGEsIHYpIHtcbiAgICAgIHZhciBpc1BlbmRpbmdQcm9taXNlc0V4cGlyZWQgPSAhcGVuZGluZ1Byb21pc2VzLmxlbmd0aDtcblxuICAgICAgaWYgKGEgPT09IGF0b20pIHtcbiAgICAgICAgc2V0QXRvbVZhbHVlKHN0YXRlLCBhLCB2KTtcbiAgICAgICAgaW52YWxpZGF0ZURlcGVuZGVudHMoc3RhdGUsIGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JpdGVBdG9tU3RhdGUoc3RhdGUsIGEsIHYsIHBlbmRpbmdQcm9taXNlcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1BlbmRpbmdQcm9taXNlc0V4cGlyZWQpIHtcbiAgICAgICAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9LCB1cGRhdGUpO1xuXG4gICAgaWYgKHByb21pc2VPclZvaWQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICB2YXIgX3Byb21pc2UgPSBwcm9taXNlT3JWb2lkLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRBdG9tV3JpdGVQcm9taXNlKHN0YXRlLCBhdG9tKTtcblxuICAgICAgICBpZiAoaXNQZW5kaW5nUHJvbWlzZXNFeHBpcmVkKSB7XG4gICAgICAgICAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghaXNQZW5kaW5nUHJvbWlzZXNFeHBpcmVkKSB7XG4gICAgICAgIHBlbmRpbmdQcm9taXNlcy5wdXNoKF9wcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXRvbVdyaXRlUHJvbWlzZShzdGF0ZSwgYXRvbSwgX3Byb21pc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChwZW5kaW5nUHJvbWlzZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZWxzZSBpZiAoIWlzUGVuZGluZ1Byb21pc2VzRXhwaXJlZCkge1xuICAgICAgcGVuZGluZ1Byb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24gKF9yZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBleGNlcHRpb246IFVzZSBwcm9taXNlIHRvIGNhdGNoIGVycm9yJywgZSk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgd3JpdGVBdG9tID0gZnVuY3Rpb24gd3JpdGVBdG9tKHN0YXRlLCB3cml0aW5nQXRvbSwgdXBkYXRlKSB7XG4gIHZhciBwZW5kaW5nUHJvbWlzZXMgPSBbUHJvbWlzZS5yZXNvbHZlKCldO1xuICB3cml0ZUF0b21TdGF0ZShzdGF0ZSwgd3JpdGluZ0F0b20sIHVwZGF0ZSwgcGVuZGluZ1Byb21pc2VzKTtcbiAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcblxuICBpZiAocGVuZGluZ1Byb21pc2VzLmxlbmd0aCA8PSAxKSB7XG4gICAgcGVuZGluZ1Byb21pc2VzLnNwbGljZSgwKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxvb3AgPSBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICBpZiAocGVuZGluZ1Byb21pc2VzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgcGVuZGluZ1Byb21pc2VzLnNwbGljZSgwKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgUHJvbWlzZS5hbGwocGVuZGluZ1Byb21pc2VzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHBlbmRpbmdQcm9taXNlcy5zcGxpY2UoMSk7XG4gICAgICAgICAgICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxvb3AoKTtcbiAgICB9KTtcbiAgfVxufTtcblxudmFyIGlzQWN0dWFsbHlXcml0YWJsZUF0b20gPSBmdW5jdGlvbiBpc0FjdHVhbGx5V3JpdGFibGVBdG9tKGF0b20pIHtcbiAgcmV0dXJuICEhYXRvbS53cml0ZTtcbn07XG5cbnZhciBtb3VudEF0b20gPSBmdW5jdGlvbiBtb3VudEF0b20oc3RhdGUsIGF0b20sIGluaXRpYWxEZXBlbmRlbnQpIHtcbiAgdmFyIGF0b21TdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYXRvbSk7XG5cbiAgaWYgKGF0b21TdGF0ZSkge1xuICAgIGF0b21TdGF0ZS5kLmZvckVhY2goZnVuY3Rpb24gKF8sIGEpIHtcbiAgICAgIGlmIChhICE9PSBhdG9tKSB7XG4gICAgICAgIGlmICghc3RhdGUubS5oYXMoYSkpIHtcbiAgICAgICAgICBtb3VudEF0b20oc3RhdGUsIGEsIGF0b20pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tCdWddIGNvdWxkIG5vdCBmaW5kIGF0b20gc3RhdGUgdG8gbW91bnQnLCBhdG9tKTtcbiAgfVxuXG4gIHZhciBtb3VudGVkID0ge1xuICAgIGQ6IG5ldyBTZXQoaW5pdGlhbERlcGVuZGVudCAmJiBbaW5pdGlhbERlcGVuZGVudF0pLFxuICAgIGw6IG5ldyBTZXQoKSxcbiAgICB1OiB1bmRlZmluZWRcbiAgfTtcbiAgc3RhdGUubS5zZXQoYXRvbSwgbW91bnRlZCk7XG5cbiAgaWYgKGlzQWN0dWFsbHlXcml0YWJsZUF0b20oYXRvbSkgJiYgYXRvbS5vbk1vdW50KSB7XG4gICAgdmFyIHNldEF0b20gPSBmdW5jdGlvbiBzZXRBdG9tKHVwZGF0ZSkge1xuICAgICAgcmV0dXJuIHdyaXRlQXRvbShzdGF0ZSwgYXRvbSwgdXBkYXRlKTtcbiAgICB9O1xuXG4gICAgbW91bnRlZC51ID0gYXRvbS5vbk1vdW50KHNldEF0b20pO1xuICB9XG5cbiAgcmV0dXJuIG1vdW50ZWQ7XG59O1xuXG52YXIgdW5tb3VudEF0b20gPSBmdW5jdGlvbiB1bm1vdW50QXRvbShzdGF0ZSwgYXRvbSkge1xuICB2YXIgX3N0YXRlJG0kZ2V0O1xuXG4gIHZhciBvblVubW91bnQgPSAoX3N0YXRlJG0kZ2V0ID0gc3RhdGUubS5nZXQoYXRvbSkpID09IG51bGwgPyB2b2lkIDAgOiBfc3RhdGUkbSRnZXQudTtcblxuICBpZiAob25Vbm1vdW50KSB7XG4gICAgb25Vbm1vdW50KCk7XG4gIH1cblxuICBzdGF0ZS5tLmRlbGV0ZShhdG9tKTtcbiAgdmFyIGF0b21TdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYXRvbSk7XG5cbiAgaWYgKGF0b21TdGF0ZSkge1xuICAgIGF0b21TdGF0ZS5kLmZvckVhY2goZnVuY3Rpb24gKF8sIGEpIHtcbiAgICAgIGlmIChhICE9PSBhdG9tKSB7XG4gICAgICAgIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYSk7XG5cbiAgICAgICAgaWYgKG1vdW50ZWQpIHtcbiAgICAgICAgICBtb3VudGVkLmQuZGVsZXRlKGF0b20pO1xuXG4gICAgICAgICAgaWYgKGNhblVubW91bnRBdG9tKGEsIG1vdW50ZWQpKSB7XG4gICAgICAgICAgICB1bm1vdW50QXRvbShzdGF0ZSwgYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tCdWddIGNvdWxkIG5vdCBmaW5kIGF0b20gc3RhdGUgdG8gdW5tb3VudCcsIGF0b20pO1xuICB9XG59O1xuXG52YXIgbW91bnREZXBlbmRlbmNpZXMgPSBmdW5jdGlvbiBtb3VudERlcGVuZGVuY2llcyhzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlLCBwcmV2RGVwZW5kZW5jaWVzKSB7XG4gIGlmIChwcmV2RGVwZW5kZW5jaWVzICE9PSBhdG9tU3RhdGUuZCkge1xuICAgIHZhciBkZXBlbmRlbmNpZXMgPSBuZXcgU2V0KGF0b21TdGF0ZS5kLmtleXMoKSk7XG5cbiAgICBpZiAocHJldkRlcGVuZGVuY2llcykge1xuICAgICAgcHJldkRlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uIChfLCBhKSB7XG4gICAgICAgIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYSk7XG5cbiAgICAgICAgaWYgKGRlcGVuZGVuY2llcy5oYXMoYSkpIHtcbiAgICAgICAgICBkZXBlbmRlbmNpZXMuZGVsZXRlKGEpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vdW50ZWQpIHtcbiAgICAgICAgICBtb3VudGVkLmQuZGVsZXRlKGF0b20pO1xuXG4gICAgICAgICAgaWYgKGNhblVubW91bnRBdG9tKGEsIG1vdW50ZWQpKSB7XG4gICAgICAgICAgICB1bm1vdW50QXRvbShzdGF0ZSwgYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbQnVnXSBhIGRlcGVuZGVuY3kgaXMgbm90IG1vdW50ZWQnLCBhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVwZW5kZW5jaWVzLmZvckVhY2goZnVuY3Rpb24gKGEpIHtcbiAgICAgIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYSk7XG5cbiAgICAgIGlmIChtb3VudGVkKSB7XG4gICAgICAgIHZhciBkZXBlbmRlbnRzID0gbW91bnRlZC5kO1xuICAgICAgICBkZXBlbmRlbnRzLmFkZChhdG9tKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdW50QXRvbShzdGF0ZSwgYSwgYXRvbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbnZhciBjb21taXRBdG9tU3RhdGUgPSBmdW5jdGlvbiBjb21taXRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSkge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBPYmplY3QuZnJlZXplKGF0b21TdGF0ZSk7XG4gIH1cblxuICB2YXIgaXNOZXdBdG9tID0gc3RhdGUubiAmJiAhc3RhdGUuYS5oYXMoYXRvbSk7XG4gIHN0YXRlLmEuc2V0KGF0b20sIGF0b21TdGF0ZSk7XG5cbiAgaWYgKGlzTmV3QXRvbSkge1xuICAgIHN0YXRlLm4oYXRvbSk7XG4gIH1cblxuICArK3N0YXRlLnY7XG4gIHN0YXRlLnAuYWRkKGF0b20pO1xufTtcblxudmFyIGZsdXNoUGVuZGluZyA9IGZ1bmN0aW9uIGZsdXNoUGVuZGluZyhzdGF0ZSkge1xuICBzdGF0ZS5wLmZvckVhY2goZnVuY3Rpb24gKGF0b20pIHtcbiAgICB2YXIgbW91bnRlZCA9IHN0YXRlLm0uZ2V0KGF0b20pO1xuICAgIG1vdW50ZWQgPT0gbnVsbCA/IHZvaWQgMCA6IG1vdW50ZWQubC5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH0pO1xuICBzdGF0ZS5wLmNsZWFyKCk7XG59O1xuXG52YXIgc3Vic2NyaWJlQXRvbSA9IGZ1bmN0aW9uIHN1YnNjcmliZUF0b20oc3RhdGUsIGF0b20sIGNhbGxiYWNrKSB7XG4gIHZhciBtb3VudGVkID0gYWRkQXRvbShzdGF0ZSwgYXRvbSk7XG4gIHZhciBsaXN0ZW5lcnMgPSBtb3VudGVkLmw7XG4gIGxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICAgIGRlbEF0b20oc3RhdGUsIGF0b20pO1xuICB9O1xufTtcblxudmFyIFRBUkdFVCA9IFN5bWJvbCgpO1xudmFyIEdFVF9WRVJTSU9OID0gU3ltYm9sKCk7XG52YXIgY3JlYXRlTXV0YWJsZVNvdXJjZSA9IGZ1bmN0aW9uIGNyZWF0ZU11dGFibGVTb3VyY2UodGFyZ2V0LCBnZXRWZXJzaW9uKSB7XG4gIHZhciBfcmVmO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFSR0VUXSA9IHRhcmdldCwgX3JlZltHRVRfVkVSU0lPTl0gPSBnZXRWZXJzaW9uLCBfcmVmO1xufTtcbnZhciB1c2VNdXRhYmxlU291cmNlID0gZnVuY3Rpb24gdXNlTXV0YWJsZVNvdXJjZShzb3VyY2UsIGdldFNuYXBzaG90LCBzdWJzY3JpYmUpIHtcbiAgdmFyIGxhc3RWZXJzaW9uID0gcmVhY3QudXNlUmVmKDApO1xuICB2YXIgY3VycmVudFZlcnNpb24gPSBzb3VyY2VbR0VUX1ZFUlNJT05dKHNvdXJjZVtUQVJHRVRdKTtcblxuICB2YXIgX3VzZVN0YXRlID0gcmVhY3QudXNlU3RhdGUoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pXTtcbiAgfSksXG4gICAgICBzdGF0ZSA9IF91c2VTdGF0ZVswXSxcbiAgICAgIHNldFN0YXRlID0gX3VzZVN0YXRlWzFdO1xuXG4gIHZhciBjdXJyZW50U25hcHNob3QgPSBzdGF0ZVs0XTtcblxuICBpZiAoc3RhdGVbMF0gIT09IHNvdXJjZSB8fCBzdGF0ZVsxXSAhPT0gZ2V0U25hcHNob3QgfHwgc3RhdGVbMl0gIT09IHN1YnNjcmliZSkge1xuICAgIGN1cnJlbnRTbmFwc2hvdCA9IGdldFNuYXBzaG90KHNvdXJjZVtUQVJHRVRdKTtcbiAgICBzZXRTdGF0ZShbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgY3VycmVudFNuYXBzaG90XSk7XG4gIH0gZWxzZSBpZiAoY3VycmVudFZlcnNpb24gIT09IHN0YXRlWzNdICYmIGN1cnJlbnRWZXJzaW9uICE9PSBsYXN0VmVyc2lvbi5jdXJyZW50KSB7XG4gICAgY3VycmVudFNuYXBzaG90ID0gZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pO1xuXG4gICAgaWYgKCFPYmplY3QuaXMoY3VycmVudFNuYXBzaG90LCBzdGF0ZVs0XSkpIHtcbiAgICAgIHNldFN0YXRlKFtzb3VyY2UsIGdldFNuYXBzaG90LCBzdWJzY3JpYmUsIGN1cnJlbnRWZXJzaW9uLCBjdXJyZW50U25hcHNob3RdKTtcbiAgICB9XG4gIH1cblxuICByZWFjdC51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaWRVbnN1YnNjcmliZSA9IGZhbHNlO1xuXG4gICAgdmFyIGNoZWNrRm9yVXBkYXRlcyA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlcygpIHtcbiAgICAgIGlmIChkaWRVbnN1YnNjcmliZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBuZXh0U25hcHNob3QgPSBnZXRTbmFwc2hvdChzb3VyY2VbVEFSR0VUXSk7XG4gICAgICAgIHZhciBuZXh0VmVyc2lvbiA9IHNvdXJjZVtHRVRfVkVSU0lPTl0oc291cmNlW1RBUkdFVF0pO1xuICAgICAgICBsYXN0VmVyc2lvbi5jdXJyZW50ID0gbmV4dFZlcnNpb247XG4gICAgICAgIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgaWYgKHByZXZbMF0gIT09IHNvdXJjZSB8fCBwcmV2WzFdICE9PSBnZXRTbmFwc2hvdCB8fCBwcmV2WzJdICE9PSBzdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChPYmplY3QuaXMocHJldls0XSwgbmV4dFNuYXBzaG90KSkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFtwcmV2WzBdLCBwcmV2WzFdLCBwcmV2WzJdLCBuZXh0VmVyc2lvbiwgbmV4dFNuYXBzaG90XTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChwcmV2KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShzb3VyY2VbVEFSR0VUXSwgY2hlY2tGb3JVcGRhdGVzKTtcbiAgICBjaGVja0ZvclVwZGF0ZXMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZGlkVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlXSk7XG4gIHJldHVybiBjdXJyZW50U25hcHNob3Q7XG59O1xuXG52YXIgY3JlYXRlU3RvcmVGb3JQcm9kdWN0aW9uID0gZnVuY3Rpb24gY3JlYXRlU3RvcmVGb3JQcm9kdWN0aW9uKGluaXRpYWxWYWx1ZXMpIHtcbiAgdmFyIHN0YXRlID0gY3JlYXRlU3RhdGUoaW5pdGlhbFZhbHVlcyk7XG4gIHZhciBzdGF0ZU11dGFibGVTb3VyY2UgPSBjcmVhdGVNdXRhYmxlU291cmNlKHN0YXRlLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHN0YXRlLnY7XG4gIH0pO1xuXG4gIHZhciB1cGRhdGVBdG9tID0gZnVuY3Rpb24gdXBkYXRlQXRvbShhdG9tLCB1cGRhdGUpIHtcbiAgICByZXR1cm4gd3JpdGVBdG9tKHN0YXRlLCBhdG9tLCB1cGRhdGUpO1xuICB9O1xuXG4gIHJldHVybiBbc3RhdGVNdXRhYmxlU291cmNlLCB1cGRhdGVBdG9tXTtcbn07XG5cbnZhciBjcmVhdGVTdG9yZUZvckRldmVsb3BtZW50ID0gZnVuY3Rpb24gY3JlYXRlU3RvcmVGb3JEZXZlbG9wbWVudChpbml0aWFsVmFsdWVzKSB7XG4gIHZhciBhdG9tc1N0b3JlID0ge1xuICAgIGF0b21zOiBbXSxcbiAgICBsaXN0ZW5lcnM6IG5ldyBTZXQoKVxuICB9O1xuICB2YXIgc3RhdGUgPSBjcmVhdGVTdGF0ZShpbml0aWFsVmFsdWVzLCBmdW5jdGlvbiAobmV3QXRvbSkge1xuICAgIGF0b21zU3RvcmUuYXRvbXMgPSBbXS5jb25jYXQoYXRvbXNTdG9yZS5hdG9tcywgW25ld0F0b21dKTtcbiAgICBhdG9tc1N0b3JlLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH0pO1xuICB2YXIgc3RhdGVNdXRhYmxlU291cmNlID0gY3JlYXRlTXV0YWJsZVNvdXJjZShzdGF0ZSwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzdGF0ZS52O1xuICB9KTtcblxuICB2YXIgdXBkYXRlQXRvbSA9IGZ1bmN0aW9uIHVwZGF0ZUF0b20oYXRvbSwgdXBkYXRlKSB7XG4gICAgcmV0dXJuIHdyaXRlQXRvbShzdGF0ZSwgYXRvbSwgdXBkYXRlKTtcbiAgfTtcblxuICB2YXIgYXRvbXNNdXRhYmxlU291cmNlID0gY3JlYXRlTXV0YWJsZVNvdXJjZShhdG9tc1N0b3JlLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGF0b21zU3RvcmUuYXRvbXM7XG4gIH0pO1xuICByZXR1cm4gW3N0YXRlTXV0YWJsZVNvdXJjZSwgdXBkYXRlQXRvbSwgYXRvbXNNdXRhYmxlU291cmNlXTtcbn07XG5cbnZhciBjcmVhdGVTdG9yZSA9IHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gY3JlYXRlU3RvcmVGb3JEZXZlbG9wbWVudCA6IGNyZWF0ZVN0b3JlRm9yUHJvZHVjdGlvbjtcbnZhciBTdG9yZUNvbnRleHRNYXAgPSBuZXcgTWFwKCk7XG52YXIgZ2V0U3RvcmVDb250ZXh0ID0gZnVuY3Rpb24gZ2V0U3RvcmVDb250ZXh0KHNjb3BlKSB7XG4gIGlmICghU3RvcmVDb250ZXh0TWFwLmhhcyhzY29wZSkpIHtcbiAgICBTdG9yZUNvbnRleHRNYXAuc2V0KHNjb3BlLCByZWFjdC5jcmVhdGVDb250ZXh0KGNyZWF0ZVN0b3JlKCkpKTtcbiAgfVxuXG4gIHJldHVybiBTdG9yZUNvbnRleHRNYXAuZ2V0KHNjb3BlKTtcbn07XG5cbnZhciBQcm92aWRlciA9IGZ1bmN0aW9uIFByb3ZpZGVyKF9yZWYpIHtcbiAgdmFyIGluaXRpYWxWYWx1ZXMgPSBfcmVmLmluaXRpYWxWYWx1ZXMsXG4gICAgICBzY29wZSA9IF9yZWYuc2NvcGUsXG4gICAgICBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBzdG9yZVJlZiA9IHJlYWN0LnVzZVJlZihudWxsKTtcblxuICBpZiAoc3RvcmVSZWYuY3VycmVudCA9PT0gbnVsbCkge1xuICAgIHN0b3JlUmVmLmN1cnJlbnQgPSBjcmVhdGVTdG9yZShpbml0aWFsVmFsdWVzKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBpc0RldlN0b3JlKHN0b3JlUmVmLmN1cnJlbnQpKSB7XG4gICAgdXNlRGVidWdTdGF0ZShzdG9yZVJlZi5jdXJyZW50KTtcbiAgfVxuXG4gIHZhciBTdG9yZUNvbnRleHQgPSBnZXRTdG9yZUNvbnRleHQoc2NvcGUpO1xuICByZXR1cm4gcmVhY3QuY3JlYXRlRWxlbWVudChTdG9yZUNvbnRleHQuUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogc3RvcmVSZWYuY3VycmVudFxuICB9LCBjaGlsZHJlbik7XG59O1xuXG52YXIgYXRvbVRvUHJpbnRhYmxlID0gZnVuY3Rpb24gYXRvbVRvUHJpbnRhYmxlKGF0b20pIHtcbiAgcmV0dXJuIGF0b20uZGVidWdMYWJlbCB8fCBhdG9tLnRvU3RyaW5nKCk7XG59O1xuXG52YXIgc3RhdGVUb1ByaW50YWJsZSA9IGZ1bmN0aW9uIHN0YXRlVG9QcmludGFibGUoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjJbMF0sXG4gICAgICBhdG9tcyA9IF9yZWYyWzFdO1xuICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGF0b21zLmZsYXRNYXAoZnVuY3Rpb24gKGF0b20pIHtcbiAgICB2YXIgbW91bnRlZCA9IHN0YXRlLm0uZ2V0KGF0b20pO1xuXG4gICAgaWYgKCFtb3VudGVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIGRlcGVuZGVudHMgPSBtb3VudGVkLmQ7XG4gICAgdmFyIGF0b21TdGF0ZSA9IHN0YXRlLmEuZ2V0KGF0b20pIHx8IHt9O1xuICAgIHJldHVybiBbW2F0b21Ub1ByaW50YWJsZShhdG9tKSwge1xuICAgICAgdmFsdWU6IGF0b21TdGF0ZS5lIHx8IGF0b21TdGF0ZS5wIHx8IGF0b21TdGF0ZS53IHx8IGF0b21TdGF0ZS52LFxuICAgICAgZGVwZW5kZW50czogQXJyYXkuZnJvbShkZXBlbmRlbnRzKS5tYXAoYXRvbVRvUHJpbnRhYmxlKVxuICAgIH1dXTtcbiAgfSkpO1xufTtcblxudmFyIGlzRGV2U3RvcmUgPSBmdW5jdGlvbiBpc0RldlN0b3JlKHN0b3JlKSB7XG4gIHJldHVybiBzdG9yZS5sZW5ndGggPiAyO1xufTtcblxudmFyIGdldERldlN0YXRlID0gZnVuY3Rpb24gZ2V0RGV2U3RhdGUoc3RhdGUpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSk7XG59O1xudmFyIGdldERldkF0b21zID0gZnVuY3Rpb24gZ2V0RGV2QXRvbXMoX3JlZjMpIHtcbiAgdmFyIGF0b21zID0gX3JlZjMuYXRvbXM7XG4gIHJldHVybiBhdG9tcztcbn07XG52YXIgc3Vic2NyaWJlRGV2QXRvbXMgPSBmdW5jdGlvbiBzdWJzY3JpYmVEZXZBdG9tcyhfcmVmNCwgY2FsbGJhY2spIHtcbiAgdmFyIGxpc3RlbmVycyA9IF9yZWY0Lmxpc3RlbmVycztcbiAgbGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICB9O1xufTtcblxudmFyIHVzZURlYnVnU3RhdGUgPSBmdW5jdGlvbiB1c2VEZWJ1Z1N0YXRlKHN0b3JlKSB7XG4gIHZhciBzdGF0ZU11dGFibGVTb3VyY2UgPSBzdG9yZVswXSxcbiAgICAgIGF0b21zTXV0YWJsZVNvdXJjZSA9IHN0b3JlWzJdO1xuICB2YXIgYXRvbXMgPSB1c2VNdXRhYmxlU291cmNlKGF0b21zTXV0YWJsZVNvdXJjZSwgZ2V0RGV2QXRvbXMsIHN1YnNjcmliZURldkF0b21zKTtcbiAgdmFyIHN1YnNjcmliZSA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgdW5zdWJzID0gYXRvbXMubWFwKGZ1bmN0aW9uIChhdG9tKSB7XG4gICAgICByZXR1cm4gc3Vic2NyaWJlQXRvbShzdGF0ZSwgYXRvbSwgY2FsbGJhY2spO1xuICAgIH0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB1bnN1YnMuZm9yRWFjaChmdW5jdGlvbiAodW5zdWIpIHtcbiAgICAgICAgcmV0dXJuIHVuc3ViKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LCBbYXRvbXNdKTtcbiAgdmFyIHN0YXRlID0gdXNlTXV0YWJsZVNvdXJjZShzdGF0ZU11dGFibGVTb3VyY2UsIGdldERldlN0YXRlLCBzdWJzY3JpYmUpO1xuICByZWFjdC51c2VEZWJ1Z1ZhbHVlKFtzdGF0ZSwgYXRvbXNdLCBzdGF0ZVRvUHJpbnRhYmxlKTtcbn07XG5cbnZhciBrZXlDb3VudCA9IDA7XG5mdW5jdGlvbiBhdG9tKHJlYWQsIHdyaXRlKSB7XG4gIHZhciBrZXkgPSBcImF0b21cIiArICsra2V5Q291bnQ7XG4gIHZhciBjb25maWcgPSB7XG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiByZWFkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uZmlnLnJlYWQgPSByZWFkO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5pbml0ID0gcmVhZDtcblxuICAgIGNvbmZpZy5yZWFkID0gZnVuY3Rpb24gKGdldCkge1xuICAgICAgcmV0dXJuIGdldChjb25maWcpO1xuICAgIH07XG5cbiAgICBjb25maWcud3JpdGUgPSBmdW5jdGlvbiAoZ2V0LCBzZXQsIHVwZGF0ZSkge1xuICAgICAgc2V0KGNvbmZpZywgdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoY29uZmlnKSkgOiB1cGRhdGUpO1xuICAgIH07XG4gIH1cblxuICBpZiAod3JpdGUpIHtcbiAgICBjb25maWcud3JpdGUgPSB3cml0ZTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG5cbnZhciBpc1dyaXRhYmxlID0gZnVuY3Rpb24gaXNXcml0YWJsZShhdG9tKSB7XG4gIHJldHVybiAhIWF0b20ud3JpdGU7XG59O1xuXG5mdW5jdGlvbiB1c2VBdG9tKGF0b20pIHtcbiAgdmFyIGdldEF0b21WYWx1ZSA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBhdG9tU3RhdGUgPSByZWFkQXRvbShzdGF0ZSwgYXRvbSk7XG5cbiAgICBpZiAoYXRvbVN0YXRlLmUpIHtcbiAgICAgIHRocm93IGF0b21TdGF0ZS5lO1xuICAgIH1cblxuICAgIGlmIChhdG9tU3RhdGUucCkge1xuICAgICAgdGhyb3cgYXRvbVN0YXRlLnA7XG4gICAgfVxuXG4gICAgaWYgKGF0b21TdGF0ZS53KSB7XG4gICAgICB0aHJvdyBhdG9tU3RhdGUudztcbiAgICB9XG5cbiAgICBpZiAoJ3YnIGluIGF0b21TdGF0ZSkge1xuICAgICAgcmV0dXJuIGF0b21TdGF0ZS52O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignbm8gYXRvbSB2YWx1ZScpO1xuICB9LCBbYXRvbV0pO1xuICB2YXIgc3Vic2NyaWJlID0gcmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKHN0YXRlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBzdWJzY3JpYmVBdG9tKHN0YXRlLCBhdG9tLCBjYWxsYmFjayk7XG4gIH0sIFthdG9tXSk7XG4gIHZhciBTdG9yZUNvbnRleHQgPSBnZXRTdG9yZUNvbnRleHQoYXRvbS5zY29wZSk7XG5cbiAgdmFyIF91c2VDb250ZXh0ID0gcmVhY3QudXNlQ29udGV4dChTdG9yZUNvbnRleHQpLFxuICAgICAgbXV0YWJsZVNvdXJjZSA9IF91c2VDb250ZXh0WzBdLFxuICAgICAgdXBkYXRlQXRvbSA9IF91c2VDb250ZXh0WzFdO1xuXG4gIHZhciB2YWx1ZSA9IHVzZU11dGFibGVTb3VyY2UobXV0YWJsZVNvdXJjZSwgZ2V0QXRvbVZhbHVlLCBzdWJzY3JpYmUpO1xuICB2YXIgc2V0QXRvbSA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uICh1cGRhdGUpIHtcbiAgICBpZiAoaXNXcml0YWJsZShhdG9tKSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZUF0b20oYXRvbSwgdXBkYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3Qgd3JpdGFibGUgYXRvbScpO1xuICAgIH1cbiAgfSwgW3VwZGF0ZUF0b20sIGF0b21dKTtcbiAgcmVhY3QudXNlRGVidWdWYWx1ZSh2YWx1ZSk7XG4gIHJldHVybiBbdmFsdWUsIHNldEF0b21dO1xufVxuXG5leHBvcnRzLlByb3ZpZGVyID0gUHJvdmlkZXI7XG5leHBvcnRzLlNFQ1JFVF9JTlRFUk5BTF9nZXRTdG9yZUNvbnRleHQgPSBnZXRTdG9yZUNvbnRleHQ7XG5leHBvcnRzLmF0b20gPSBhdG9tO1xuZXhwb3J0cy51c2VBdG9tID0gdXNlQXRvbTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIHJlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG52YXIgam90YWkgPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbmZ1bmN0aW9uIHVzZVVwZGF0ZUF0b20oYW5BdG9tKSB7XG4gIHZhciBTdG9yZUNvbnRleHQgPSBqb3RhaS5TRUNSRVRfSU5URVJOQUxfZ2V0U3RvcmVDb250ZXh0KGFuQXRvbS5zY29wZSk7XG5cbiAgdmFyIF91c2VDb250ZXh0ID0gcmVhY3QudXNlQ29udGV4dChTdG9yZUNvbnRleHQpLFxuICAgICAgdXBkYXRlQXRvbSA9IF91c2VDb250ZXh0WzFdO1xuXG4gIHZhciBzZXRBdG9tID0gcmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKHVwZGF0ZSkge1xuICAgIHJldHVybiB1cGRhdGVBdG9tKGFuQXRvbSwgdXBkYXRlKTtcbiAgfSwgW3VwZGF0ZUF0b20sIGFuQXRvbV0pO1xuICByZXR1cm4gc2V0QXRvbTtcbn1cblxuZnVuY3Rpb24gdXNlQXRvbVZhbHVlKGFuQXRvbSkge1xuICByZXR1cm4gam90YWkudXNlQXRvbShhbkF0b20pWzBdO1xufVxuXG52YXIgUkVTRVQgPSBTeW1ib2woKTtcbmZ1bmN0aW9uIGF0b21XaXRoUmVzZXQoaW5pdGlhbFZhbHVlKSB7XG4gIHZhciBhbkF0b20gPSBqb3RhaS5hdG9tKGluaXRpYWxWYWx1ZSwgZnVuY3Rpb24gKGdldCwgc2V0LCB1cGRhdGUpIHtcbiAgICBpZiAodXBkYXRlID09PSBSRVNFVCkge1xuICAgICAgc2V0KGFuQXRvbSwgaW5pdGlhbFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0KGFuQXRvbSwgdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoYW5BdG9tKSkgOiB1cGRhdGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhbkF0b207XG59XG5cbmZ1bmN0aW9uIHVzZVJlc2V0QXRvbShhbkF0b20pIHtcbiAgdmFyIFN0b3JlQ29udGV4dCA9IGpvdGFpLlNFQ1JFVF9JTlRFUk5BTF9nZXRTdG9yZUNvbnRleHQoYW5BdG9tLnNjb3BlKTtcblxuICB2YXIgX3VzZUNvbnRleHQgPSByZWFjdC51c2VDb250ZXh0KFN0b3JlQ29udGV4dCksXG4gICAgICB1cGRhdGVBdG9tID0gX3VzZUNvbnRleHRbMV07XG5cbiAgdmFyIHNldEF0b20gPSByZWFjdC51c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHVwZGF0ZUF0b20oYW5BdG9tLCBSRVNFVCk7XG4gIH0sIFt1cGRhdGVBdG9tLCBhbkF0b21dKTtcbiAgcmV0dXJuIHNldEF0b207XG59XG5cbmZ1bmN0aW9uIHVzZVJlZHVjZXJBdG9tKGFuQXRvbSwgcmVkdWNlcikge1xuICB2YXIgX3VzZUF0b20gPSBqb3RhaS51c2VBdG9tKGFuQXRvbSksXG4gICAgICBzdGF0ZSA9IF91c2VBdG9tWzBdLFxuICAgICAgc2V0U3RhdGUgPSBfdXNlQXRvbVsxXTtcblxuICB2YXIgZGlzcGF0Y2ggPSByZWFjdC51c2VDYWxsYmFjayhmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgc2V0U3RhdGUoZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgIHJldHVybiByZWR1Y2VyKHByZXYsIGFjdGlvbik7XG4gICAgfSk7XG4gIH0sIFtzZXRTdGF0ZSwgcmVkdWNlcl0pO1xuICByZXR1cm4gW3N0YXRlLCBkaXNwYXRjaF07XG59XG5cbmZ1bmN0aW9uIGF0b21XaXRoUmVkdWNlcihpbml0aWFsVmFsdWUsIHJlZHVjZXIpIHtcbiAgdmFyIGFuQXRvbSA9IGpvdGFpLmF0b20oaW5pdGlhbFZhbHVlLCBmdW5jdGlvbiAoZ2V0LCBzZXQsIGFjdGlvbikge1xuICAgIHJldHVybiBzZXQoYW5BdG9tLCByZWR1Y2VyKGdldChhbkF0b20pLCBhY3Rpb24pKTtcbiAgfSk7XG4gIHJldHVybiBhbkF0b207XG59XG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkge1xuICBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gIHJldHVybiBhcnIyO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKG8sIGFsbG93QXJyYXlMaWtlKSB7XG4gIHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdO1xuICBpZiAoaXQpIHJldHVybiAoaXQgPSBpdC5jYWxsKG8pKS5uZXh0LmJpbmQoaXQpO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHtcbiAgICBpZiAoaXQpIG8gPSBpdDtcbiAgICB2YXIgaSA9IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4ge1xuICAgICAgICBkb25lOiB0cnVlXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBvW2krK11cbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxuZnVuY3Rpb24gYXRvbUZhbWlseShpbml0aWFsaXplQXRvbSwgYXJlRXF1YWwpIHtcbiAgdmFyIHNob3VsZFJlbW92ZSA9IG51bGw7XG4gIHZhciBhdG9tcyA9IG5ldyBNYXAoKTtcblxuICB2YXIgY3JlYXRlQXRvbSA9IGZ1bmN0aW9uIGNyZWF0ZUF0b20ocGFyYW0pIHtcbiAgICB2YXIgaXRlbTtcblxuICAgIGlmIChhcmVFcXVhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpdGVtID0gYXRvbXMuZ2V0KHBhcmFtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZShhdG9tcyksIF9zdGVwOyAhKF9zdGVwID0gX2l0ZXJhdG9yKCkpLmRvbmU7KSB7XG4gICAgICAgIHZhciBfc3RlcCR2YWx1ZSA9IF9zdGVwLnZhbHVlLFxuICAgICAgICAgICAga2V5ID0gX3N0ZXAkdmFsdWVbMF0sXG4gICAgICAgICAgICB2YWx1ZSA9IF9zdGVwJHZhbHVlWzFdO1xuXG4gICAgICAgIGlmIChhcmVFcXVhbChrZXksIHBhcmFtKSkge1xuICAgICAgICAgIGl0ZW0gPSB2YWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpdGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzaG91bGRSZW1vdmUgIT0gbnVsbCAmJiBzaG91bGRSZW1vdmUoaXRlbVsxXSwgcGFyYW0pKSB7XG4gICAgICAgIGF0b21zLmRlbGV0ZShwYXJhbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbmV3QXRvbSA9IGluaXRpYWxpemVBdG9tKHBhcmFtKTtcbiAgICBhdG9tcy5zZXQocGFyYW0sIFtuZXdBdG9tLCBEYXRlLm5vdygpXSk7XG4gICAgcmV0dXJuIG5ld0F0b207XG4gIH07XG5cbiAgY3JlYXRlQXRvbS5yZW1vdmUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICBpZiAoYXJlRXF1YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYXRvbXMuZGVsZXRlKHBhcmFtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UoYXRvbXMpLCBfc3RlcDI7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMigpKS5kb25lOykge1xuICAgICAgICB2YXIgX3N0ZXAyJHZhbHVlID0gX3N0ZXAyLnZhbHVlLFxuICAgICAgICAgICAga2V5ID0gX3N0ZXAyJHZhbHVlWzBdO1xuXG4gICAgICAgIGlmIChhcmVFcXVhbChrZXksIHBhcmFtKSkge1xuICAgICAgICAgIGF0b21zLmRlbGV0ZShrZXkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNyZWF0ZUF0b20uc2V0U2hvdWxkUmVtb3ZlID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgc2hvdWxkUmVtb3ZlID0gZm47XG4gICAgaWYgKCFzaG91bGRSZW1vdmUpIHJldHVybjtcblxuICAgIGZvciAodmFyIF9pdGVyYXRvcjMgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKGF0b21zKSwgX3N0ZXAzOyAhKF9zdGVwMyA9IF9pdGVyYXRvcjMoKSkuZG9uZTspIHtcbiAgICAgIHZhciBfc3RlcDMkdmFsdWUgPSBfc3RlcDMudmFsdWUsXG4gICAgICAgICAga2V5ID0gX3N0ZXAzJHZhbHVlWzBdLFxuICAgICAgICAgIHZhbHVlID0gX3N0ZXAzJHZhbHVlWzFdO1xuXG4gICAgICBpZiAoc2hvdWxkUmVtb3ZlKHZhbHVlWzFdLCBrZXkpKSB7XG4gICAgICAgIGF0b21zLmRlbGV0ZShrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gY3JlYXRlQXRvbTtcbn1cblxudmFyIGdldFdlYWtDYWNoZUl0ZW0gPSBmdW5jdGlvbiBnZXRXZWFrQ2FjaGVJdGVtKGNhY2hlLCBkZXBzKSB7XG4gIHZhciBkZXAgPSBkZXBzWzBdLFxuICAgICAgcmVzdCA9IGRlcHMuc2xpY2UoMSk7XG4gIHZhciBlbnRyeSA9IGNhY2hlLmdldChkZXApO1xuXG4gIGlmICghZW50cnkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXJlc3QubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGVudHJ5WzFdO1xuICB9XG5cbiAgcmV0dXJuIGdldFdlYWtDYWNoZUl0ZW0oZW50cnlbMF0sIHJlc3QpO1xufTtcbnZhciBzZXRXZWFrQ2FjaGVJdGVtID0gZnVuY3Rpb24gc2V0V2Vha0NhY2hlSXRlbShjYWNoZSwgZGVwcywgaXRlbSkge1xuICB2YXIgZGVwID0gZGVwc1swXSxcbiAgICAgIHJlc3QgPSBkZXBzLnNsaWNlKDEpO1xuICB2YXIgZW50cnkgPSBjYWNoZS5nZXQoZGVwKTtcblxuICBpZiAoIWVudHJ5KSB7XG4gICAgZW50cnkgPSBbbmV3IFdlYWtNYXAoKV07XG4gICAgY2FjaGUuc2V0KGRlcCwgZW50cnkpO1xuICB9XG5cbiAgaWYgKCFyZXN0Lmxlbmd0aCkge1xuICAgIGVudHJ5WzFdID0gaXRlbTtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZXRXZWFrQ2FjaGVJdGVtKGVudHJ5WzBdLCByZXN0LCBpdGVtKTtcbn07XG5cbnZhciBzZWxlY3RBdG9tQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gc2VsZWN0QXRvbShhbkF0b20sIHNlbGVjdG9yLCBlcXVhbGl0eUZuKSB7XG4gIGlmIChlcXVhbGl0eUZuID09PSB2b2lkIDApIHtcbiAgICBlcXVhbGl0eUZuID0gT2JqZWN0LmlzO1xuICB9XG5cbiAgdmFyIGRlcHMgPSBbYW5BdG9tLCBzZWxlY3RvciwgZXF1YWxpdHlGbl07XG4gIHZhciBjYWNoZWRBdG9tID0gZ2V0V2Vha0NhY2hlSXRlbShzZWxlY3RBdG9tQ2FjaGUsIGRlcHMpO1xuXG4gIGlmIChjYWNoZWRBdG9tKSB7XG4gICAgcmV0dXJuIGNhY2hlZEF0b207XG4gIH1cblxuICB2YXIgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgdmFyIHByZXZTbGljZTtcbiAgdmFyIGRlcml2ZWRBdG9tID0gam90YWkuYXRvbShmdW5jdGlvbiAoZ2V0KSB7XG4gICAgdmFyIHNsaWNlID0gc2VsZWN0b3IoZ2V0KGFuQXRvbSkpO1xuXG4gICAgaWYgKGluaXRpYWxpemVkICYmIGVxdWFsaXR5Rm4ocHJldlNsaWNlLCBzbGljZSkpIHtcbiAgICAgIHJldHVybiBwcmV2U2xpY2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHByZXZTbGljZSA9IHNsaWNlO1xuICAgIHJldHVybiBzbGljZTtcbiAgfSk7XG4gIGRlcml2ZWRBdG9tLnNjb3BlID0gYW5BdG9tLnNjb3BlO1xuICBzZXRXZWFrQ2FjaGVJdGVtKHNlbGVjdEF0b21DYWNoZSwgZGVwcywgZGVyaXZlZEF0b20pO1xuICByZXR1cm4gZGVyaXZlZEF0b207XG59XG5cbmZ1bmN0aW9uIHVzZUF0b21DYWxsYmFjayhjYWxsYmFjaywgc2NvcGUpIHtcbiAgdmFyIGFuQXRvbSA9IHJlYWN0LnVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBqb3RhaS5hdG9tKG51bGwsIGZ1bmN0aW9uIChnZXQsIHNldCwgX3JlZikge1xuICAgICAgdmFyIGFyZyA9IF9yZWZbMF0sXG4gICAgICAgICAgcmVzb2x2ZSA9IF9yZWZbMV0sXG4gICAgICAgICAgcmVqZWN0ID0gX3JlZlsyXTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZShjYWxsYmFjayhnZXQsIHNldCwgYXJnKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgW2NhbGxiYWNrXSk7XG4gIGFuQXRvbS5zY29wZSA9IHNjb3BlO1xuXG4gIHZhciBfdXNlQXRvbSA9IGpvdGFpLnVzZUF0b20oYW5BdG9tKSxcbiAgICAgIGludm9rZSA9IF91c2VBdG9tWzFdO1xuXG4gIHJldHVybiByZWFjdC51c2VDYWxsYmFjayhmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGludm9rZShbYXJnLCByZXNvbHZlLCByZWplY3RdKTtcbiAgICB9KTtcbiAgfSwgW2ludm9rZV0pO1xufVxuXG52YXIgZnJlZXplQXRvbUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxudmFyIGRlZXBGcmVlemUgPSBmdW5jdGlvbiBkZWVwRnJlZXplKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSByZXR1cm47XG4gIE9iamVjdC5mcmVlemUob2JqKTtcbiAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG5cbiAgZm9yICh2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZShwcm9wTmFtZXMpLCBfc3RlcDsgIShfc3RlcCA9IF9pdGVyYXRvcigpKS5kb25lOykge1xuICAgIHZhciBuYW1lID0gX3N0ZXAudmFsdWU7XG4gICAgdmFyIHZhbHVlID0gb2JqW25hbWVdO1xuICAgIGRlZXBGcmVlemUodmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbmZ1bmN0aW9uIGZyZWV6ZUF0b20oYW5BdG9tKSB7XG4gIHZhciBkZXBzID0gW2FuQXRvbV07XG4gIHZhciBjYWNoZWRBdG9tID0gZ2V0V2Vha0NhY2hlSXRlbShmcmVlemVBdG9tQ2FjaGUsIGRlcHMpO1xuXG4gIGlmIChjYWNoZWRBdG9tKSB7XG4gICAgcmV0dXJuIGNhY2hlZEF0b207XG4gIH1cblxuICB2YXIgZnJvemVuQXRvbSA9IGpvdGFpLmF0b20oZnVuY3Rpb24gKGdldCkge1xuICAgIHJldHVybiBkZWVwRnJlZXplKGdldChhbkF0b20pKTtcbiAgfSwgZnVuY3Rpb24gKF9nZXQsIHNldCwgYXJnKSB7XG4gICAgcmV0dXJuIHNldChhbkF0b20sIGFyZyk7XG4gIH0pO1xuICBmcm96ZW5BdG9tLnNjb3BlID0gYW5BdG9tLnNjb3BlO1xuICBzZXRXZWFrQ2FjaGVJdGVtKGZyZWV6ZUF0b21DYWNoZSwgZGVwcywgZnJvemVuQXRvbSk7XG4gIHJldHVybiBmcm96ZW5BdG9tO1xufVxuZnVuY3Rpb24gZnJlZXplQXRvbUNyZWF0b3IoY3JlYXRlQXRvbSkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbkF0b20gPSBjcmVhdGVBdG9tLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICB2YXIgb3JpZ1JlYWQgPSBhbkF0b20ucmVhZDtcblxuICAgIGFuQXRvbS5yZWFkID0gZnVuY3Rpb24gKGdldCkge1xuICAgICAgcmV0dXJuIGRlZXBGcmVlemUob3JpZ1JlYWQoZ2V0KSk7XG4gICAgfTtcblxuICAgIHJldHVybiBhbkF0b207XG4gIH07XG59XG5cbnZhciBzcGxpdEF0b21DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbnZhciBpc1dyaXRhYmxlID0gZnVuY3Rpb24gaXNXcml0YWJsZShhdG9tKSB7XG4gIHJldHVybiAhIWF0b20ud3JpdGU7XG59O1xuXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59O1xuXG5mdW5jdGlvbiBzcGxpdEF0b20oYXJyQXRvbSwga2V5RXh0cmFjdG9yKSB7XG4gIHZhciBkZXBzID0ga2V5RXh0cmFjdG9yID8gW2FyckF0b20sIGtleUV4dHJhY3Rvcl0gOiBbYXJyQXRvbV07XG4gIHZhciBjYWNoZWRBdG9tID0gZ2V0V2Vha0NhY2hlSXRlbShzcGxpdEF0b21DYWNoZSwgZGVwcyk7XG5cbiAgaWYgKGNhY2hlZEF0b20pIHtcbiAgICByZXR1cm4gY2FjaGVkQXRvbTtcbiAgfVxuXG4gIHZhciBjdXJyZW50QXRvbUxpc3Q7XG4gIHZhciBjdXJyZW50S2V5TGlzdDtcblxuICB2YXIga2V5VG9BdG9tID0gZnVuY3Rpb24ga2V5VG9BdG9tKGtleSkge1xuICAgIHZhciBfY3VycmVudEtleUxpc3QsIF9jdXJyZW50QXRvbUxpc3Q7XG5cbiAgICB2YXIgaW5kZXggPSAoX2N1cnJlbnRLZXlMaXN0ID0gY3VycmVudEtleUxpc3QpID09IG51bGwgPyB2b2lkIDAgOiBfY3VycmVudEtleUxpc3QuaW5kZXhPZihrZXkpO1xuXG4gICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQgfHwgaW5kZXggPT09IC0xKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiAoX2N1cnJlbnRBdG9tTGlzdCA9IGN1cnJlbnRBdG9tTGlzdCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jdXJyZW50QXRvbUxpc3RbaW5kZXhdO1xuICB9O1xuXG4gIHZhciByZWFkID0gZnVuY3Rpb24gcmVhZChnZXQpIHtcbiAgICB2YXIgbmV4dEF0b21MaXN0ID0gW107XG4gICAgdmFyIG5leHRLZXlMaXN0ID0gW107XG4gICAgZ2V0KGFyckF0b20pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0ga2V5RXh0cmFjdG9yID8ga2V5RXh0cmFjdG9yKGl0ZW0pIDogaW5kZXg7XG4gICAgICBuZXh0S2V5TGlzdFtpbmRleF0gPSBrZXk7XG4gICAgICB2YXIgY2FjaGVkQXRvbSA9IGtleVRvQXRvbShrZXkpO1xuXG4gICAgICBpZiAoY2FjaGVkQXRvbSkge1xuICAgICAgICBuZXh0QXRvbUxpc3RbaW5kZXhdID0gY2FjaGVkQXRvbTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVhZCA9IGZ1bmN0aW9uIHJlYWQoZ2V0KSB7XG4gICAgICAgIHZhciBfY3VycmVudEtleUxpc3QyO1xuXG4gICAgICAgIHZhciBpbmRleCA9IChfY3VycmVudEtleUxpc3QyID0gY3VycmVudEtleUxpc3QpID09IG51bGwgPyB2b2lkIDAgOiBfY3VycmVudEtleUxpc3QyLmluZGV4T2Yoa2V5KTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCB8fCBpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4IG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdldChhcnJBdG9tKVtpbmRleF07XG4gICAgICB9O1xuXG4gICAgICB2YXIgd3JpdGUgPSBmdW5jdGlvbiB3cml0ZShnZXQsIHNldCwgdXBkYXRlKSB7XG4gICAgICAgIHZhciBfY3VycmVudEtleUxpc3QzO1xuXG4gICAgICAgIHZhciBpbmRleCA9IChfY3VycmVudEtleUxpc3QzID0gY3VycmVudEtleUxpc3QpID09IG51bGwgPyB2b2lkIDAgOiBfY3VycmVudEtleUxpc3QzLmluZGV4T2Yoa2V5KTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCB8fCBpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4IG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByZXYgPSBnZXQoYXJyQXRvbSk7XG4gICAgICAgIHZhciBuZXh0SXRlbSA9IGlzRnVuY3Rpb24odXBkYXRlKSA/IHVwZGF0ZShwcmV2W2luZGV4XSkgOiB1cGRhdGU7XG4gICAgICAgIHNldChhcnJBdG9tLCBbXS5jb25jYXQocHJldi5zbGljZSgwLCBpbmRleCksIFtuZXh0SXRlbV0sIHByZXYuc2xpY2UoaW5kZXggKyAxKSkpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGl0ZW1BdG9tID0gaXNXcml0YWJsZShhcnJBdG9tKSA/IGpvdGFpLmF0b20ocmVhZCwgd3JpdGUpIDogam90YWkuYXRvbShyZWFkKTtcbiAgICAgIGl0ZW1BdG9tLnNjb3BlID0gYXJyQXRvbS5zY29wZTtcbiAgICAgIG5leHRBdG9tTGlzdFtpbmRleF0gPSBpdGVtQXRvbTtcbiAgICB9KTtcbiAgICBjdXJyZW50S2V5TGlzdCA9IG5leHRLZXlMaXN0O1xuXG4gICAgaWYgKGN1cnJlbnRBdG9tTGlzdCAmJiBjdXJyZW50QXRvbUxpc3QubGVuZ3RoID09PSBuZXh0QXRvbUxpc3QubGVuZ3RoICYmIGN1cnJlbnRBdG9tTGlzdC5ldmVyeShmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgcmV0dXJuIHggPT09IG5leHRBdG9tTGlzdFtpXTtcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnRBdG9tTGlzdDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudEF0b21MaXN0ID0gbmV4dEF0b21MaXN0O1xuICB9O1xuXG4gIHZhciB3cml0ZSA9IGZ1bmN0aW9uIHdyaXRlKGdldCwgc2V0LCBhdG9tVG9SZW1vdmUpIHtcbiAgICB2YXIgaW5kZXggPSBnZXQoc3BsaXR0ZWRBdG9tKS5pbmRleE9mKGF0b21Ub1JlbW92ZSk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIHByZXYgPSBnZXQoYXJyQXRvbSk7XG4gICAgICBzZXQoYXJyQXRvbSwgW10uY29uY2F0KHByZXYuc2xpY2UoMCwgaW5kZXgpLCBwcmV2LnNsaWNlKGluZGV4ICsgMSkpKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHNwbGl0dGVkQXRvbSA9IGlzV3JpdGFibGUoYXJyQXRvbSkgPyBqb3RhaS5hdG9tKHJlYWQsIHdyaXRlKSA6IGpvdGFpLmF0b20ocmVhZCk7XG4gIHNwbGl0dGVkQXRvbS5zY29wZSA9IGFyckF0b20uc2NvcGU7XG4gIHNldFdlYWtDYWNoZUl0ZW0oc3BsaXRBdG9tQ2FjaGUsIGRlcHMsIHNwbGl0dGVkQXRvbSk7XG4gIHJldHVybiBzcGxpdHRlZEF0b207XG59XG5cbmZ1bmN0aW9uIGF0b21XaXRoRGVmYXVsdChnZXREZWZhdWx0KSB7XG4gIHZhciBFTVBUWSA9IFN5bWJvbCgpO1xuICB2YXIgb3ZlcndyaXR0ZW5BdG9tID0gam90YWkuYXRvbShFTVBUWSk7XG4gIHZhciBhbkF0b20gPSBqb3RhaS5hdG9tKGZ1bmN0aW9uIChnZXQpIHtcbiAgICB2YXIgb3ZlcndyaXR0ZW4gPSBnZXQob3ZlcndyaXR0ZW5BdG9tKTtcblxuICAgIGlmIChvdmVyd3JpdHRlbiAhPT0gRU1QVFkpIHtcbiAgICAgIHJldHVybiBvdmVyd3JpdHRlbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0RGVmYXVsdChnZXQpO1xuICB9LCBmdW5jdGlvbiAoZ2V0LCBzZXQsIHVwZGF0ZSkge1xuICAgIHJldHVybiBzZXQob3ZlcndyaXR0ZW5BdG9tLCB0eXBlb2YgdXBkYXRlID09PSAnZnVuY3Rpb24nID8gdXBkYXRlKGdldChhbkF0b20pKSA6IHVwZGF0ZSk7XG4gIH0pO1xuICByZXR1cm4gYW5BdG9tO1xufVxuXG52YXIgd2FpdEZvckFsbENhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHdhaXRGb3JBbGwoYXRvbXMpIHtcbiAgdmFyIGNhY2hlZEF0b20gPSBBcnJheS5pc0FycmF5KGF0b21zKSAmJiBnZXRXZWFrQ2FjaGVJdGVtKHdhaXRGb3JBbGxDYWNoZSwgYXRvbXMpO1xuXG4gIGlmIChjYWNoZWRBdG9tKSB7XG4gICAgcmV0dXJuIGNhY2hlZEF0b207XG4gIH1cblxuICB2YXIgdW53cmFwcGVkQXRvbXMgPSB1bndyYXBBdG9tcyhhdG9tcyk7XG4gIHZhciBkZXJpdmVkQXRvbSA9IGpvdGFpLmF0b20oZnVuY3Rpb24gKGdldCkge1xuICAgIHZhciBwcm9taXNlcyA9IFtdO1xuICAgIHZhciB2YWx1ZXMgPSB1bndyYXBwZWRBdG9tcy5tYXAoZnVuY3Rpb24gKGFuQXRvbSwgaW5kZXgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBnZXQoYW5BdG9tKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgcHJvbWlzZXNbaW5kZXhdID0gZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocHJvbWlzZXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBSZXN1bHRzKGF0b21zLCB2YWx1ZXMpO1xuICB9KTtcbiAgdmFyIHdhaXRGb3JBbGxTY29wZSA9IHVud3JhcHBlZEF0b21zWzBdLnNjb3BlO1xuICBkZXJpdmVkQXRvbS5zY29wZSA9IHdhaXRGb3JBbGxTY29wZTtcbiAgdmFsaWRhdGVBdG9tU2NvcGVzKHdhaXRGb3JBbGxTY29wZSwgdW53cmFwcGVkQXRvbXMpO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGF0b21zKSkge1xuICAgIHNldFdlYWtDYWNoZUl0ZW0od2FpdEZvckFsbENhY2hlLCBhdG9tcywgZGVyaXZlZEF0b20pO1xuICB9XG5cbiAgcmV0dXJuIGRlcml2ZWRBdG9tO1xufVxuXG52YXIgdW53cmFwQXRvbXMgPSBmdW5jdGlvbiB1bndyYXBBdG9tcyhhdG9tcykge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhdG9tcykgPyBhdG9tcyA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGF0b21zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBhdG9tc1trZXldO1xuICB9KTtcbn07XG5cbnZhciB3cmFwUmVzdWx0cyA9IGZ1bmN0aW9uIHdyYXBSZXN1bHRzKGF0b21zLCByZXN1bHRzKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGF0b21zKSA/IHJlc3VsdHMgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhdG9tcykucmVkdWNlKGZ1bmN0aW9uIChvdXQsIGtleSwgaWR4KSB7XG4gICAgdmFyIF9leHRlbmRzMjtcblxuICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgb3V0LCAoX2V4dGVuZHMyID0ge30sIF9leHRlbmRzMltrZXldID0gcmVzdWx0c1tpZHhdLCBfZXh0ZW5kczIpKTtcbiAgfSwge30pO1xufTtcblxuZnVuY3Rpb24gdmFsaWRhdGVBdG9tU2NvcGVzKHNjb3BlLCBhdG9tcykge1xuICBpZiAoc2NvcGUgJiYgIWF0b21zLmV2ZXJ5KGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGEuc2NvcGUgPT09IHNjb3BlO1xuICB9KSkge1xuICAgIGNvbnNvbGUud2FybignRGlmZmVyZW50IHNjb3BlcyB3ZXJlIGZvdW5kIGZvciBhdG9tcyBzdXBwbGllZCB0byB3YWl0Rm9yQWxsLiBUaGlzIGlzIHVuc3VwcG9ydGVkIGFuZCB3aWxsIHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGF0b21XaXRoSGFzaChrZXksIGluaXRpYWxWYWx1ZSwgc2VyaWFsaXplLCBkZXNlcmlhbGl6ZSkge1xuICBpZiAoc2VyaWFsaXplID09PSB2b2lkIDApIHtcbiAgICBzZXJpYWxpemUgPSBKU09OLnN0cmluZ2lmeTtcbiAgfVxuXG4gIGlmIChkZXNlcmlhbGl6ZSA9PT0gdm9pZCAwKSB7XG4gICAgZGVzZXJpYWxpemUgPSBKU09OLnBhcnNlO1xuICB9XG5cbiAgdmFyIGFuQXRvbSA9IGpvdGFpLmF0b20oaW5pdGlhbFZhbHVlLCBmdW5jdGlvbiAoZ2V0LCBzZXQsIHVwZGF0ZSkge1xuICAgIHZhciBuZXdWYWx1ZSA9IHR5cGVvZiB1cGRhdGUgPT09ICdmdW5jdGlvbicgPyB1cGRhdGUoZ2V0KGFuQXRvbSkpIDogdXBkYXRlO1xuICAgIHNldChhbkF0b20sIG5ld1ZhbHVlKTtcbiAgICB2YXIgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnNsaWNlKDEpKTtcbiAgICBzZWFyY2hQYXJhbXMuc2V0KGtleSwgc2VyaWFsaXplKG5ld1ZhbHVlKSk7XG4gICAgbG9jYXRpb24uaGFzaCA9IHNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xuICB9KTtcblxuICBhbkF0b20ub25Nb3VudCA9IGZ1bmN0aW9uIChzZXRBdG9tKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICB2YXIgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnNsaWNlKDEpKTtcbiAgICAgIHZhciBzdHIgPSBzZWFyY2hQYXJhbXMuZ2V0KGtleSk7XG5cbiAgICAgIGlmIChzdHIgIT09IG51bGwpIHtcbiAgICAgICAgc2V0QXRvbShkZXNlcmlhbGl6ZShzdHIpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBjYWxsYmFjayk7XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gYW5BdG9tO1xufVxuXG52YXIgZGVmYXVsdFN0b3JhZ2UgPSB7XG4gIGdldEl0ZW06IGZ1bmN0aW9uIGdldEl0ZW0oa2V5KSB7XG4gICAgdmFyIHN0b3JlZFZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcblxuICAgIGlmIChzdG9yZWRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyB2YWx1ZSBzdG9yZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZShzdG9yZWRWYWx1ZSk7XG4gIH0sXG4gIHNldEl0ZW06IGZ1bmN0aW9uIHNldEl0ZW0oa2V5LCBuZXdWYWx1ZSkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkobmV3VmFsdWUpKTtcbiAgfVxufTtcbmZ1bmN0aW9uIGF0b21XaXRoU3RvcmFnZShrZXksIGluaXRpYWxWYWx1ZSwgc3RvcmFnZSkge1xuICBpZiAoc3RvcmFnZSA9PT0gdm9pZCAwKSB7XG4gICAgc3RvcmFnZSA9IGRlZmF1bHRTdG9yYWdlO1xuICB9XG5cbiAgdmFyIGdldEluaXRpYWxWYWx1ZSA9IGZ1bmN0aW9uIGdldEluaXRpYWxWYWx1ZSgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH0gY2F0Y2ggKF91bnVzZWQpIHtcbiAgICAgIHJldHVybiBpbml0aWFsVmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIHZhciBiYXNlQXRvbSA9IGpvdGFpLmF0b20oaW5pdGlhbFZhbHVlKTtcblxuICBiYXNlQXRvbS5vbk1vdW50ID0gZnVuY3Rpb24gKHNldEF0b20pIHtcbiAgICB2YXIgdmFsdWUgPSBnZXRJbml0aWFsVmFsdWUoKTtcblxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHZhbHVlLnRoZW4oc2V0QXRvbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldEF0b20odmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgYW5BdG9tID0gam90YWkuYXRvbShmdW5jdGlvbiAoZ2V0KSB7XG4gICAgcmV0dXJuIGdldChiYXNlQXRvbSk7XG4gIH0sIGZ1bmN0aW9uIChnZXQsIHNldCwgdXBkYXRlKSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoYmFzZUF0b20pKSA6IHVwZGF0ZTtcbiAgICBzZXQoYmFzZUF0b20sIG5ld1ZhbHVlKTtcbiAgICBzdG9yYWdlLnNldEl0ZW0oa2V5LCBuZXdWYWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gYW5BdG9tO1xufVxuXG5leHBvcnRzLlJFU0VUID0gUkVTRVQ7XG5leHBvcnRzLmF0b21GYW1pbHkgPSBhdG9tRmFtaWx5O1xuZXhwb3J0cy5hdG9tV2l0aERlZmF1bHQgPSBhdG9tV2l0aERlZmF1bHQ7XG5leHBvcnRzLmF0b21XaXRoSGFzaCA9IGF0b21XaXRoSGFzaDtcbmV4cG9ydHMuYXRvbVdpdGhSZWR1Y2VyID0gYXRvbVdpdGhSZWR1Y2VyO1xuZXhwb3J0cy5hdG9tV2l0aFJlc2V0ID0gYXRvbVdpdGhSZXNldDtcbmV4cG9ydHMuYXRvbVdpdGhTdG9yYWdlID0gYXRvbVdpdGhTdG9yYWdlO1xuZXhwb3J0cy5mcmVlemVBdG9tID0gZnJlZXplQXRvbTtcbmV4cG9ydHMuZnJlZXplQXRvbUNyZWF0b3IgPSBmcmVlemVBdG9tQ3JlYXRvcjtcbmV4cG9ydHMuc2VsZWN0QXRvbSA9IHNlbGVjdEF0b207XG5leHBvcnRzLnNwbGl0QXRvbSA9IHNwbGl0QXRvbTtcbmV4cG9ydHMudXNlQXRvbUNhbGxiYWNrID0gdXNlQXRvbUNhbGxiYWNrO1xuZXhwb3J0cy51c2VBdG9tVmFsdWUgPSB1c2VBdG9tVmFsdWU7XG5leHBvcnRzLnVzZVJlZHVjZXJBdG9tID0gdXNlUmVkdWNlckF0b207XG5leHBvcnRzLnVzZVJlc2V0QXRvbSA9IHVzZVJlc2V0QXRvbTtcbmV4cG9ydHMudXNlVXBkYXRlQXRvbSA9IHVzZVVwZGF0ZUF0b207XG5leHBvcnRzLndhaXRGb3JBbGwgPSB3YWl0Rm9yQWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgdmFuaWxsYSA9IHJlcXVpcmUoJy4uL3ZhbHRpby92YW5pbGxhJyk7XG52YXIgam90YWkgPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbnZhciBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufTtcblxudmFyIGFwcGx5Q2hhbmdlcyA9IGZ1bmN0aW9uIGFwcGx5Q2hhbmdlcyhwcm94eU9iamVjdCwgcHJldiwgbmV4dCkge1xuICBPYmplY3Qua2V5cyhwcmV2KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIShrZXkgaW4gbmV4dCkpIHtcbiAgICAgIGRlbGV0ZSBwcm94eU9iamVjdFtrZXldO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmlzKHByZXZba2V5XSwgbmV4dFtrZXldKSkgOyBlbHNlIGlmIChpc09iamVjdChwcm94eU9iamVjdFtrZXldKSAmJiBpc09iamVjdChwcmV2W2tleV0pICYmIGlzT2JqZWN0KG5leHRba2V5XSkpIHtcbiAgICAgIGFwcGx5Q2hhbmdlcyhwcm94eU9iamVjdFtrZXldLCBwcmV2W2tleV0sIG5leHRba2V5XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3h5T2JqZWN0W2tleV0gPSBuZXh0W2tleV07XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmtleXMobmV4dCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCEoa2V5IGluIHByZXYpKSB7XG4gICAgICBwcm94eU9iamVjdFtrZXldID0gbmV4dFtrZXldO1xuICAgIH1cbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBhdG9tV2l0aFByb3h5KHByb3h5T2JqZWN0KSB7XG4gIHZhciBiYXNlQXRvbSA9IGpvdGFpLmF0b20odmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuXG4gIGJhc2VBdG9tLm9uTW91bnQgPSBmdW5jdGlvbiAoc2V0VmFsdWUpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgIHNldFZhbHVlKHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpKTtcbiAgICB9O1xuXG4gICAgdmFyIHVuc3ViID0gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjaygpO1xuICAgIHJldHVybiB1bnN1YjtcbiAgfTtcblxuICB2YXIgZGVyaXZlZEF0b20gPSBqb3RhaS5hdG9tKGZ1bmN0aW9uIChnZXQpIHtcbiAgICByZXR1cm4gZ2V0KGJhc2VBdG9tKTtcbiAgfSwgZnVuY3Rpb24gKGdldCwgX3NldCwgdXBkYXRlKSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoYmFzZUF0b20pKSA6IHVwZGF0ZTtcbiAgICBhcHBseUNoYW5nZXMocHJveHlPYmplY3QsIHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpLCBuZXdWYWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gZGVyaXZlZEF0b207XG59XG5cbmV4cG9ydHMuYXRvbVdpdGhQcm94eSA9IGF0b21XaXRoUHJveHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciB2YW5pbGxhID0gcmVxdWlyZSgnLi92YW5pbGxhJyk7XG52YXIgcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcbnZhciBwcm94eUNvbXBhcmUgPSByZXF1aXJlKCdwcm94eS1jb21wYXJlJyk7XG5cbnZhciBUQVJHRVQgPSBTeW1ib2woKTtcbnZhciBHRVRfVkVSU0lPTiA9IFN5bWJvbCgpO1xudmFyIGNyZWF0ZU11dGFibGVTb3VyY2UgPSBmdW5jdGlvbiBjcmVhdGVNdXRhYmxlU291cmNlKHRhcmdldCwgZ2V0VmVyc2lvbikge1xuICB2YXIgX3JlZjtcblxuICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW1RBUkdFVF0gPSB0YXJnZXQsIF9yZWZbR0VUX1ZFUlNJT05dID0gZ2V0VmVyc2lvbiwgX3JlZjtcbn07XG52YXIgdXNlTXV0YWJsZVNvdXJjZSA9IGZ1bmN0aW9uIHVzZU11dGFibGVTb3VyY2Uoc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlKSB7XG4gIHZhciBsYXN0VmVyc2lvbiA9IHJlYWN0LnVzZVJlZigwKTtcbiAgdmFyIGN1cnJlbnRWZXJzaW9uID0gc291cmNlW0dFVF9WRVJTSU9OXShzb3VyY2VbVEFSR0VUXSk7XG5cbiAgdmFyIF91c2VTdGF0ZSA9IHJlYWN0LnVzZVN0YXRlKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW3NvdXJjZSwgZ2V0U25hcHNob3QsIHN1YnNjcmliZSwgY3VycmVudFZlcnNpb24sIGdldFNuYXBzaG90KHNvdXJjZVtUQVJHRVRdKV07XG4gIH0pLFxuICAgICAgc3RhdGUgPSBfdXNlU3RhdGVbMF0sXG4gICAgICBzZXRTdGF0ZSA9IF91c2VTdGF0ZVsxXTtcblxuICB2YXIgY3VycmVudFNuYXBzaG90ID0gc3RhdGVbNF07XG5cbiAgaWYgKHN0YXRlWzBdICE9PSBzb3VyY2UgfHwgc3RhdGVbMV0gIT09IGdldFNuYXBzaG90IHx8IHN0YXRlWzJdICE9PSBzdWJzY3JpYmUpIHtcbiAgICBjdXJyZW50U25hcHNob3QgPSBnZXRTbmFwc2hvdChzb3VyY2VbVEFSR0VUXSk7XG4gICAgc2V0U3RhdGUoW3NvdXJjZSwgZ2V0U25hcHNob3QsIHN1YnNjcmliZSwgY3VycmVudFZlcnNpb24sIGN1cnJlbnRTbmFwc2hvdF0pO1xuICB9IGVsc2UgaWYgKGN1cnJlbnRWZXJzaW9uICE9PSBzdGF0ZVszXSAmJiBjdXJyZW50VmVyc2lvbiAhPT0gbGFzdFZlcnNpb24uY3VycmVudCkge1xuICAgIGN1cnJlbnRTbmFwc2hvdCA9IGdldFNuYXBzaG90KHNvdXJjZVtUQVJHRVRdKTtcblxuICAgIGlmICghT2JqZWN0LmlzKGN1cnJlbnRTbmFwc2hvdCwgc3RhdGVbNF0pKSB7XG4gICAgICBzZXRTdGF0ZShbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgY3VycmVudFNuYXBzaG90XSk7XG4gICAgfVxuICB9XG5cbiAgcmVhY3QudXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGlkVW5zdWJzY3JpYmUgPSBmYWxzZTtcblxuICAgIHZhciBjaGVja0ZvclVwZGF0ZXMgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZXMoKSB7XG4gICAgICBpZiAoZGlkVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbmV4dFNuYXBzaG90ID0gZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pO1xuICAgICAgICB2YXIgbmV4dFZlcnNpb24gPSBzb3VyY2VbR0VUX1ZFUlNJT05dKHNvdXJjZVtUQVJHRVRdKTtcbiAgICAgICAgbGFzdFZlcnNpb24uY3VycmVudCA9IG5leHRWZXJzaW9uO1xuICAgICAgICBzZXRTdGF0ZShmdW5jdGlvbiAocHJldikge1xuICAgICAgICAgIGlmIChwcmV2WzBdICE9PSBzb3VyY2UgfHwgcHJldlsxXSAhPT0gZ2V0U25hcHNob3QgfHwgcHJldlsyXSAhPT0gc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoT2JqZWN0LmlzKHByZXZbNF0sIG5leHRTbmFwc2hvdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBbcHJldlswXSwgcHJldlsxXSwgcHJldlsyXSwgbmV4dFZlcnNpb24sIG5leHRTbmFwc2hvdF07XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzZXRTdGF0ZShmdW5jdGlvbiAocHJldikge1xuICAgICAgICAgIHJldHVybiBbXS5jb25jYXQocHJldik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmUoc291cmNlW1RBUkdFVF0sIGNoZWNrRm9yVXBkYXRlcyk7XG4gICAgY2hlY2tGb3JVcGRhdGVzKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRpZFVuc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW3NvdXJjZSwgZ2V0U25hcHNob3QsIHN1YnNjcmliZV0pO1xuICByZXR1cm4gY3VycmVudFNuYXBzaG90O1xufTtcblxudmFyIGlzU1NSID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIXdpbmRvdy5uYXZpZ2F0b3IgfHwgL1NlcnZlclNpZGVSZW5kZXJpbmd8XkRlbm9cXC8vLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xudmFyIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgPSBpc1NTUiA/IHJlYWN0LnVzZUVmZmVjdCA6IHJlYWN0LnVzZUxheW91dEVmZmVjdDtcblxudmFyIHVzZUFmZmVjdGVkRGVidWdWYWx1ZSA9IGZ1bmN0aW9uIHVzZUFmZmVjdGVkRGVidWdWYWx1ZShzdGF0ZSwgYWZmZWN0ZWQpIHtcbiAgdmFyIHBhdGhMaXN0ID0gcmVhY3QudXNlUmVmKCk7XG4gIHJlYWN0LnVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgcGF0aExpc3QuY3VycmVudCA9IHByb3h5Q29tcGFyZS5hZmZlY3RlZFRvUGF0aExpc3Qoc3RhdGUsIGFmZmVjdGVkKTtcbiAgfSk7XG4gIHJlYWN0LnVzZURlYnVnVmFsdWUocGF0aExpc3QuY3VycmVudCk7XG59O1xuXG52YXIgbXV0YWJsZVNvdXJjZUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxudmFyIGdldE11dGFibGVTb3VyY2UgPSBmdW5jdGlvbiBnZXRNdXRhYmxlU291cmNlKHByb3h5T2JqZWN0KSB7XG4gIGlmICghbXV0YWJsZVNvdXJjZUNhY2hlLmhhcyhwcm94eU9iamVjdCkpIHtcbiAgICBtdXRhYmxlU291cmNlQ2FjaGUuc2V0KHByb3h5T2JqZWN0LCBjcmVhdGVNdXRhYmxlU291cmNlKHByb3h5T2JqZWN0LCB2YW5pbGxhLmdldFZlcnNpb24pKTtcbiAgfVxuXG4gIHJldHVybiBtdXRhYmxlU291cmNlQ2FjaGUuZ2V0KHByb3h5T2JqZWN0KTtcbn07XG5cbnZhciB1c2VTbmFwc2hvdCA9IGZ1bmN0aW9uIHVzZVNuYXBzaG90KHByb3h5T2JqZWN0LCBvcHRpb25zKSB7XG4gIHZhciBfdXNlUmVkdWNlciA9IHJlYWN0LnVzZVJlZHVjZXIoZnVuY3Rpb24gKGMpIHtcbiAgICByZXR1cm4gYyArIDE7XG4gIH0sIDApLFxuICAgICAgZm9yY2VVcGRhdGUgPSBfdXNlUmVkdWNlclsxXTtcblxuICB2YXIgYWZmZWN0ZWQgPSBuZXcgV2Vha01hcCgpO1xuICB2YXIgbGFzdEFmZmVjdGVkID0gcmVhY3QudXNlUmVmKCk7XG4gIHZhciBwcmV2U25hcHNob3QgPSByZWFjdC51c2VSZWYoKTtcbiAgdmFyIGxhc3RTbmFwc2hvdCA9IHJlYWN0LnVzZVJlZigpO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBsYXN0U25hcHNob3QuY3VycmVudCA9IHByZXZTbmFwc2hvdC5jdXJyZW50ID0gdmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCk7XG4gIH0sIFtwcm94eU9iamVjdF0pO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBsYXN0QWZmZWN0ZWQuY3VycmVudCA9IGFmZmVjdGVkO1xuXG4gICAgaWYgKHByZXZTbmFwc2hvdC5jdXJyZW50ICE9PSBsYXN0U25hcHNob3QuY3VycmVudCAmJiBwcm94eUNvbXBhcmUuaXNEZWVwQ2hhbmdlZChwcmV2U25hcHNob3QuY3VycmVudCwgbGFzdFNuYXBzaG90LmN1cnJlbnQsIGFmZmVjdGVkLCBuZXcgV2Vha01hcCgpKSkge1xuICAgICAgcHJldlNuYXBzaG90LmN1cnJlbnQgPSBsYXN0U25hcHNob3QuY3VycmVudDtcbiAgICAgIGZvcmNlVXBkYXRlKCk7XG4gICAgfVxuICB9KTtcbiAgdmFyIG5vdGlmeUluU3luYyA9IG9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IG9wdGlvbnMuc3luYztcbiAgdmFyIHN1YiA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChwcm94eU9iamVjdCwgY2IpIHtcbiAgICByZXR1cm4gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuZXh0U25hcHNob3QgPSB2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KTtcbiAgICAgIGxhc3RTbmFwc2hvdC5jdXJyZW50ID0gbmV4dFNuYXBzaG90O1xuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAobGFzdEFmZmVjdGVkLmN1cnJlbnQgJiYgIXByb3h5Q29tcGFyZS5pc0RlZXBDaGFuZ2VkKHByZXZTbmFwc2hvdC5jdXJyZW50LCBuZXh0U25hcHNob3QsIGxhc3RBZmZlY3RlZC5jdXJyZW50LCBuZXcgV2Vha01hcCgpKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgcHJldlNuYXBzaG90LmN1cnJlbnQgPSBuZXh0U25hcHNob3Q7XG4gICAgICBjYigpO1xuICAgIH0sIG5vdGlmeUluU3luYyk7XG4gIH0sIFtub3RpZnlJblN5bmNdKTtcbiAgdmFyIGN1cnJTbmFwc2hvdCA9IHVzZU11dGFibGVTb3VyY2UoZ2V0TXV0YWJsZVNvdXJjZShwcm94eU9iamVjdCksIHZhbmlsbGEuc25hcHNob3QsIHN1Yik7XG5cbiAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdXNlQWZmZWN0ZWREZWJ1Z1ZhbHVlKGN1cnJTbmFwc2hvdCwgYWZmZWN0ZWQpO1xuICB9XG5cbiAgdmFyIHByb3h5Q2FjaGUgPSByZWFjdC51c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFdlYWtNYXAoKTtcbiAgfSwgW10pO1xuICByZXR1cm4gcHJveHlDb21wYXJlLmNyZWF0ZURlZXBQcm94eShjdXJyU25hcHNob3QsIGFmZmVjdGVkLCBwcm94eUNhY2hlKTtcbn07XG5cbmV4cG9ydHMudXNlU25hcHNob3QgPSB1c2VTbmFwc2hvdDtcbk9iamVjdC5rZXlzKHZhbmlsbGEpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgaWYgKGsgIT09ICdkZWZhdWx0JyAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShrKSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGssIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZhbmlsbGFba107XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgcHJveHlDb21wYXJlID0gcmVxdWlyZSgncHJveHktY29tcGFyZScpO1xudmFyIHZhbmlsbGEgPSByZXF1aXJlKCcuL3ZhbmlsbGEnKTtcblxudmFyIHN1YnNjcmliZUtleSA9IGZ1bmN0aW9uIHN1YnNjcmliZUtleShwcm94eU9iamVjdCwga2V5LCBjYWxsYmFjaywgbm90aWZ5SW5TeW5jKSB7XG4gIHZhciBwcmV2VmFsdWUgPSBwcm94eU9iamVjdFtrZXldO1xuICByZXR1cm4gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV4dFZhbHVlID0gcHJveHlPYmplY3Rba2V5XTtcblxuICAgIGlmICghT2JqZWN0LmlzKHByZXZWYWx1ZSwgbmV4dFZhbHVlKSkge1xuICAgICAgY2FsbGJhY2socHJldlZhbHVlID0gbmV4dFZhbHVlKTtcbiAgICB9XG4gIH0sIG5vdGlmeUluU3luYyk7XG59O1xudmFyIGRldnRvb2xzID0gZnVuY3Rpb24gZGV2dG9vbHMocHJveHlPYmplY3QsIG5hbWUpIHtcbiAgdmFyIGV4dGVuc2lvbjtcblxuICB0cnkge1xuICAgIGV4dGVuc2lvbiA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fO1xuICB9IGNhdGNoIChfdW51c2VkKSB7fVxuXG4gIGlmICghZXh0ZW5zaW9uKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKCdbV2FybmluZ10gUGxlYXNlIGluc3RhbGwvZW5hYmxlIFJlZHV4IGRldnRvb2xzIGV4dGVuc2lvbicpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBpc1RpbWVUcmF2ZWxpbmcgPSBmYWxzZTtcbiAgdmFyIGRldnRvb2xzID0gZXh0ZW5zaW9uLmNvbm5lY3Qoe1xuICAgIG5hbWU6IG5hbWVcbiAgfSk7XG4gIHZhciB1bnN1YjEgPSB2YW5pbGxhLnN1YnNjcmliZShwcm94eU9iamVjdCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc1RpbWVUcmF2ZWxpbmcpIHtcbiAgICAgIGlzVGltZVRyYXZlbGluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXZ0b29scy5zZW5kKFwiVXBkYXRlIC0gXCIgKyBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCksIHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpKTtcbiAgICB9XG4gIH0pO1xuICB2YXIgdW5zdWIyID0gZGV2dG9vbHMuc3Vic2NyaWJlKGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgdmFyIF9tZXNzYWdlJHBheWxvYWQzLCBfbWVzc2FnZSRwYXlsb2FkNDtcblxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdESVNQQVRDSCcgJiYgbWVzc2FnZS5zdGF0ZSkge1xuICAgICAgdmFyIF9tZXNzYWdlJHBheWxvYWQsIF9tZXNzYWdlJHBheWxvYWQyO1xuXG4gICAgICBpZiAoKChfbWVzc2FnZSRwYXlsb2FkID0gbWVzc2FnZS5wYXlsb2FkKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZC50eXBlKSA9PT0gJ0pVTVBfVE9fQUNUSU9OJyB8fCAoKF9tZXNzYWdlJHBheWxvYWQyID0gbWVzc2FnZS5wYXlsb2FkKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZDIudHlwZSkgPT09ICdKVU1QX1RPX1NUQVRFJykge1xuICAgICAgICBpc1RpbWVUcmF2ZWxpbmcgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV4dFZhbHVlID0gSlNPTi5wYXJzZShtZXNzYWdlLnN0YXRlKTtcbiAgICAgIE9iamVjdC5rZXlzKG5leHRWYWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHByb3h5T2JqZWN0W2tleV0gPSBuZXh0VmFsdWVba2V5XTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnRElTUEFUQ0gnICYmICgoX21lc3NhZ2UkcGF5bG9hZDMgPSBtZXNzYWdlLnBheWxvYWQpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkMy50eXBlKSA9PT0gJ0NPTU1JVCcpIHtcbiAgICAgIGRldnRvb2xzLmluaXQodmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnRElTUEFUQ0gnICYmICgoX21lc3NhZ2UkcGF5bG9hZDQgPSBtZXNzYWdlLnBheWxvYWQpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkNC50eXBlKSA9PT0gJ0lNUE9SVF9TVEFURScpIHtcbiAgICAgIHZhciBfbWVzc2FnZSRwYXlsb2FkJG5leHQsIF9tZXNzYWdlJHBheWxvYWQkbmV4dDI7XG5cbiAgICAgIHZhciBhY3Rpb25zID0gKF9tZXNzYWdlJHBheWxvYWQkbmV4dCA9IG1lc3NhZ2UucGF5bG9hZC5uZXh0TGlmdGVkU3RhdGUpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkJG5leHQuYWN0aW9uc0J5SWQ7XG4gICAgICB2YXIgY29tcHV0ZWRTdGF0ZXMgPSAoKF9tZXNzYWdlJHBheWxvYWQkbmV4dDIgPSBtZXNzYWdlLnBheWxvYWQubmV4dExpZnRlZFN0YXRlKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZCRuZXh0Mi5jb21wdXRlZFN0YXRlcykgfHwgW107XG4gICAgICBpc1RpbWVUcmF2ZWxpbmcgPSB0cnVlO1xuICAgICAgY29tcHV0ZWRTdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZiwgaW5kZXgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZTtcbiAgICAgICAgdmFyIGFjdGlvbiA9IGFjdGlvbnNbaW5kZXhdIHx8IFwiVXBkYXRlIC0gXCIgKyBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBwcm94eU9iamVjdFtrZXldID0gc3RhdGVba2V5XTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgZGV2dG9vbHMuaW5pdCh2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGV2dG9vbHMuc2VuZChhY3Rpb24sIHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgZGV2dG9vbHMuaW5pdCh2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdW5zdWIxKCk7XG4gICAgdW5zdWIyKCk7XG4gIH07XG59O1xudmFyIGFkZENvbXB1dGVkID0gZnVuY3Rpb24gYWRkQ29tcHV0ZWQocHJveHlPYmplY3QsIGNvbXB1dGVkRm5zLCB0YXJnZXRPYmplY3QpIHtcbiAgaWYgKHRhcmdldE9iamVjdCA9PT0gdm9pZCAwKSB7XG4gICAgdGFyZ2V0T2JqZWN0ID0gcHJveHlPYmplY3Q7XG4gIH1cbiAgT2JqZWN0LmtleXMoY29tcHV0ZWRGbnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldE9iamVjdCwga2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QgcHJvcGVydHkgYWxyZWFkeSBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgdmFyIGdldCA9IGNvbXB1dGVkRm5zW2tleV07XG4gICAgdmFyIHByZXZTbmFwc2hvdDtcbiAgICB2YXIgYWZmZWN0ZWQgPSBuZXcgV2Vha01hcCgpO1xuICAgIHZhciBwZW5kaW5nID0gZmFsc2U7XG5cbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgIHZhciBuZXh0U25hcHNob3QgPSB2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KTtcblxuICAgICAgaWYgKCFwZW5kaW5nICYmICghcHJldlNuYXBzaG90IHx8IHByb3h5Q29tcGFyZS5pc0RlZXBDaGFuZ2VkKHByZXZTbmFwc2hvdCwgbmV4dFNuYXBzaG90LCBhZmZlY3RlZCkpKSB7XG4gICAgICAgIGFmZmVjdGVkID0gbmV3IFdlYWtNYXAoKTtcbiAgICAgICAgdmFyIHZhbHVlID0gZ2V0KHByb3h5Q29tcGFyZS5jcmVhdGVEZWVwUHJveHkobmV4dFNuYXBzaG90LCBhZmZlY3RlZCkpO1xuICAgICAgICBwcmV2U25hcHNob3QgPSBuZXh0U25hcHNob3Q7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgIHBlbmRpbmcgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlLnRoZW4oZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRhcmdldE9iamVjdFtrZXldID0gdjtcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdGFyZ2V0T2JqZWN0W2tleV0gPSBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRPYmplY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YW5pbGxhLnN1YnNjcmliZShwcm94eU9iamVjdCwgY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xufTtcbnZhciBwcm94eVdpdGhDb21wdXRlZCA9IGZ1bmN0aW9uIHByb3h5V2l0aENvbXB1dGVkKGluaXRpYWxPYmplY3QsIGNvbXB1dGVkRm5zKSB7XG4gIE9iamVjdC5rZXlzKGNvbXB1dGVkRm5zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbml0aWFsT2JqZWN0LCBrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCBwcm9wZXJ0eSBhbHJlYWR5IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcHV0ZWRGbiA9IGNvbXB1dGVkRm5zW2tleV07XG5cbiAgICB2YXIgX3JlZjIgPSB0eXBlb2YgY29tcHV0ZWRGbiA9PT0gJ2Z1bmN0aW9uJyA/IHtcbiAgICAgIGdldDogY29tcHV0ZWRGblxuICAgIH0gOiBjb21wdXRlZEZuLFxuICAgICAgICBnZXQgPSBfcmVmMi5nZXQsXG4gICAgICAgIHNldCA9IF9yZWYyLnNldDtcblxuICAgIHZhciBjb21wdXRlZFZhbHVlO1xuICAgIHZhciBwcmV2U25hcHNob3Q7XG4gICAgdmFyIGFmZmVjdGVkID0gbmV3IFdlYWtNYXAoKTtcbiAgICB2YXIgZGVzYyA9IHt9O1xuXG4gICAgZGVzYy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmV4dFNuYXBzaG90ID0gdmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCk7XG5cbiAgICAgIGlmICghcHJldlNuYXBzaG90IHx8IHByb3h5Q29tcGFyZS5pc0RlZXBDaGFuZ2VkKHByZXZTbmFwc2hvdCwgbmV4dFNuYXBzaG90LCBhZmZlY3RlZCkpIHtcbiAgICAgICAgYWZmZWN0ZWQgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgICBjb21wdXRlZFZhbHVlID0gZ2V0KHByb3h5Q29tcGFyZS5jcmVhdGVEZWVwUHJveHkobmV4dFNuYXBzaG90LCBhZmZlY3RlZCkpO1xuICAgICAgICBwcmV2U25hcHNob3QgPSBuZXh0U25hcHNob3Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wdXRlZFZhbHVlO1xuICAgIH07XG5cbiAgICBpZiAoc2V0KSB7XG4gICAgICBkZXNjLnNldCA9IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm4gc2V0KHByb3h5T2JqZWN0LCBuZXdWYWx1ZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbml0aWFsT2JqZWN0LCBrZXksIGRlc2MpO1xuICB9KTtcbiAgdmFyIHByb3h5T2JqZWN0ID0gdmFuaWxsYS5wcm94eShpbml0aWFsT2JqZWN0KTtcbiAgcmV0dXJuIHByb3h5T2JqZWN0O1xufTtcblxuZXhwb3J0cy5hZGRDb21wdXRlZCA9IGFkZENvbXB1dGVkO1xuZXhwb3J0cy5kZXZ0b29scyA9IGRldnRvb2xzO1xuZXhwb3J0cy5wcm94eVdpdGhDb21wdXRlZCA9IHByb3h5V2l0aENvbXB1dGVkO1xuZXhwb3J0cy5zdWJzY3JpYmVLZXkgPSBzdWJzY3JpYmVLZXk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBwcm94eUNvbXBhcmUgPSByZXF1aXJlKCdwcm94eS1jb21wYXJlJyk7XG5cbnZhciBWRVJTSU9OID0gU3ltYm9sKCk7XG52YXIgTElTVEVORVJTID0gU3ltYm9sKCk7XG52YXIgU05BUFNIT1QgPSBTeW1ib2woKTtcbnZhciBQUk9NSVNFX1JFU1VMVCA9IFN5bWJvbCgpO1xudmFyIFBST01JU0VfRVJST1IgPSBTeW1ib2woKTtcbnZhciByZWZTZXQgPSBuZXcgV2Vha1NldCgpO1xudmFyIHJlZiA9IGZ1bmN0aW9uIHJlZihvKSB7XG4gIHJlZlNldC5hZGQobyk7XG4gIHJldHVybiBvO1xufTtcblxudmFyIGlzU3VwcG9ydGVkT2JqZWN0ID0gZnVuY3Rpb24gaXNTdXBwb3J0ZWRPYmplY3QoeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwgJiYgKEFycmF5LmlzQXJyYXkoeCkgfHwgIXhbU3ltYm9sLml0ZXJhdG9yXSkgJiYgISh4IGluc3RhbmNlb2YgV2Vha01hcCkgJiYgISh4IGluc3RhbmNlb2YgV2Vha1NldCkgJiYgISh4IGluc3RhbmNlb2YgRXJyb3IpICYmICEoeCBpbnN0YW5jZW9mIE51bWJlcikgJiYgISh4IGluc3RhbmNlb2YgRGF0ZSkgJiYgISh4IGluc3RhbmNlb2YgU3RyaW5nKSAmJiAhKHggaW5zdGFuY2VvZiBSZWdFeHApICYmICEoeCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbn07XG5cbnZhciBwcm94eUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbnZhciBnbG9iYWxWZXJzaW9uID0gMTtcbnZhciBzbmFwc2hvdENhY2hlID0gbmV3IFdlYWtNYXAoKTtcbnZhciBwcm94eSA9IGZ1bmN0aW9uIHByb3h5KGluaXRpYWxPYmplY3QpIHtcbiAgaWYgKGluaXRpYWxPYmplY3QgPT09IHZvaWQgMCkge1xuICAgIGluaXRpYWxPYmplY3QgPSB7fTtcbiAgfVxuXG4gIGlmICghaXNTdXBwb3J0ZWRPYmplY3QoaW5pdGlhbE9iamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIG9iamVjdCB0eXBlJyk7XG4gIH1cblxuICBpZiAocHJveHlDYWNoZS5oYXMoaW5pdGlhbE9iamVjdCkpIHtcbiAgICByZXR1cm4gcHJveHlDYWNoZS5nZXQoaW5pdGlhbE9iamVjdCk7XG4gIH1cblxuICB2YXIgdmVyc2lvbiA9IGdsb2JhbFZlcnNpb247XG4gIHZhciBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG5cbiAgdmFyIG5vdGlmeVVwZGF0ZSA9IGZ1bmN0aW9uIG5vdGlmeVVwZGF0ZShuZXh0VmVyc2lvbikge1xuICAgIGlmICghbmV4dFZlcnNpb24pIHtcbiAgICAgIG5leHRWZXJzaW9uID0gKytnbG9iYWxWZXJzaW9uO1xuICAgIH1cblxuICAgIGlmICh2ZXJzaW9uICE9PSBuZXh0VmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IG5leHRWZXJzaW9uO1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcihuZXh0VmVyc2lvbik7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVNuYXBzaG90ID0gZnVuY3Rpb24gY3JlYXRlU25hcHNob3QodGFyZ2V0LCByZWNlaXZlcikge1xuICAgIHZhciBjYWNoZSA9IHNuYXBzaG90Q2FjaGUuZ2V0KHJlY2VpdmVyKTtcblxuICAgIGlmIChjYWNoZSAmJiBjYWNoZS52ZXJzaW9uID09PSB2ZXJzaW9uKSB7XG4gICAgICByZXR1cm4gY2FjaGUuc25hcHNob3Q7XG4gICAgfVxuXG4gICAgdmFyIHNuYXBzaG90ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpID8gW10gOiBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpKTtcbiAgICBwcm94eUNvbXBhcmUubWFya1RvVHJhY2soc25hcHNob3QsIHRydWUpO1xuICAgIHNuYXBzaG90Q2FjaGUuc2V0KHJlY2VpdmVyLCB7XG4gICAgICB2ZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgc25hcHNob3Q6IHNuYXBzaG90XG4gICAgfSk7XG4gICAgUmVmbGVjdC5vd25LZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSB0YXJnZXRba2V5XTtcblxuICAgICAgaWYgKHJlZlNldC5oYXModmFsdWUpKSB7XG4gICAgICAgIHByb3h5Q29tcGFyZS5tYXJrVG9UcmFjayh2YWx1ZSwgZmFsc2UpO1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCFpc1N1cHBvcnRlZE9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgaWYgKFBST01JU0VfUkVTVUxUIGluIHZhbHVlKSB7XG4gICAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlW1BST01JU0VfUkVTVUxUXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZXJyb3JPclByb21pc2UgPSB2YWx1ZVtQUk9NSVNFX0VSUk9SXSB8fCB2YWx1ZTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc25hcHNob3QsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgIHRocm93IGVycm9yT3JQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlW1ZFUlNJT05dKSB7XG4gICAgICAgIHNuYXBzaG90W2tleV0gPSB2YWx1ZVtTTkFQU0hPVF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmZyZWV6ZShzbmFwc2hvdCk7XG4gICAgcmV0dXJuIHNuYXBzaG90O1xuICB9O1xuXG4gIHZhciBiYXNlT2JqZWN0ID0gQXJyYXkuaXNBcnJheShpbml0aWFsT2JqZWN0KSA/IFtdIDogT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5pdGlhbE9iamVjdCkpO1xuICB2YXIgcHJveHlPYmplY3QgPSBuZXcgUHJveHkoYmFzZU9iamVjdCwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgIGlmIChwcm9wID09PSBWRVJTSU9OKSB7XG4gICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcCA9PT0gTElTVEVORVJTKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wID09PSBTTkFQU0hPVCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlU25hcHNob3QodGFyZ2V0LCByZWNlaXZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgfSxcbiAgICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKSB7XG4gICAgICB2YXIgcHJldlZhbHVlID0gdGFyZ2V0W3Byb3BdO1xuICAgICAgdmFyIGNoaWxkTGlzdGVuZXJzID0gcHJldlZhbHVlICYmIHByZXZWYWx1ZVtMSVNURU5FUlNdO1xuXG4gICAgICBpZiAoY2hpbGRMaXN0ZW5lcnMpIHtcbiAgICAgICAgY2hpbGRMaXN0ZW5lcnMuZGVsZXRlKG5vdGlmeVVwZGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBkZWxldGVkID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApO1xuXG4gICAgICBpZiAoZGVsZXRlZCkge1xuICAgICAgICBub3RpZnlVcGRhdGUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICB2YXIgX09iamVjdCRnZXRPd25Qcm9wZXJ0O1xuXG4gICAgICB2YXIgcHJldlZhbHVlID0gdGFyZ2V0W3Byb3BdO1xuXG4gICAgICBpZiAoT2JqZWN0LmlzKHByZXZWYWx1ZSwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRMaXN0ZW5lcnMgPSBwcmV2VmFsdWUgJiYgcHJldlZhbHVlW0xJU1RFTkVSU107XG5cbiAgICAgIGlmIChjaGlsZExpc3RlbmVycykge1xuICAgICAgICBjaGlsZExpc3RlbmVycy5kZWxldGUobm90aWZ5VXBkYXRlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZlNldC5oYXModmFsdWUpIHx8ICFpc1N1cHBvcnRlZE9iamVjdCh2YWx1ZSkgfHwgKF9PYmplY3QkZ2V0T3duUHJvcGVydCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKSkgIT0gbnVsbCAmJiBfT2JqZWN0JGdldE93blByb3BlcnQuc2V0KSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWUudGhlbihmdW5jdGlvbiAodikge1xuICAgICAgICAgIHRhcmdldFtwcm9wXVtQUk9NSVNFX1JFU1VMVF0gPSB2O1xuICAgICAgICAgIG5vdGlmeVVwZGF0ZSgpO1xuICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHRhcmdldFtwcm9wXVtQUk9NSVNFX0VSUk9SXSA9IGU7XG4gICAgICAgICAgbm90aWZ5VXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBwcm94eUNvbXBhcmUuZ2V0VW50cmFja2VkT2JqZWN0KHZhbHVlKSB8fCB2YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWVbTElTVEVORVJTXSkge1xuICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHByb3h5KHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFtwcm9wXVtMSVNURU5FUlNdLmFkZChub3RpZnlVcGRhdGUpO1xuICAgICAgfVxuXG4gICAgICBub3RpZnlVcGRhdGUoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHByb3h5Q2FjaGUuc2V0KGluaXRpYWxPYmplY3QsIHByb3h5T2JqZWN0KTtcbiAgUmVmbGVjdC5vd25LZXlzKGluaXRpYWxPYmplY3QpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbml0aWFsT2JqZWN0LCBrZXkpO1xuXG4gICAgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYmFzZU9iamVjdCwga2V5LCBkZXNjKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJveHlPYmplY3Rba2V5XSA9IGluaXRpYWxPYmplY3Rba2V5XTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcHJveHlPYmplY3Q7XG59O1xudmFyIGdldFZlcnNpb24gPSBmdW5jdGlvbiBnZXRWZXJzaW9uKHByb3h5T2JqZWN0KSB7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAoIXByb3h5T2JqZWN0IHx8ICFwcm94eU9iamVjdFtWRVJTSU9OXSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2UgcHJveHkgb2JqZWN0Jyk7XG4gIH1cblxuICByZXR1cm4gcHJveHlPYmplY3RbVkVSU0lPTl07XG59O1xudmFyIHN1YnNjcmliZSA9IGZ1bmN0aW9uIHN1YnNjcmliZShwcm94eU9iamVjdCwgY2FsbGJhY2ssIG5vdGlmeUluU3luYykge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgKCFwcm94eU9iamVjdCB8fCAhcHJveHlPYmplY3RbTElTVEVORVJTXSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2UgcHJveHkgb2JqZWN0Jyk7XG4gIH1cblxuICB2YXIgcGVuZGluZ1ZlcnNpb24gPSAwO1xuXG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIGxpc3RlbmVyKG5leHRWZXJzaW9uKSB7XG4gICAgaWYgKG5vdGlmeUluU3luYykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwZW5kaW5nVmVyc2lvbiA9IG5leHRWZXJzaW9uO1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKG5leHRWZXJzaW9uID09PSBwZW5kaW5nVmVyc2lvbikge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHByb3h5T2JqZWN0W0xJU1RFTkVSU10uYWRkKGxpc3RlbmVyKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBwcm94eU9iamVjdFtMSVNURU5FUlNdLmRlbGV0ZShsaXN0ZW5lcik7XG4gIH07XG59O1xudmFyIHNuYXBzaG90ID0gZnVuY3Rpb24gc25hcHNob3QocHJveHlPYmplY3QpIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICghcHJveHlPYmplY3QgfHwgIXByb3h5T2JqZWN0W1NOQVBTSE9UXSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2UgcHJveHkgb2JqZWN0Jyk7XG4gIH1cblxuICByZXR1cm4gcHJveHlPYmplY3RbU05BUFNIT1RdO1xufTtcblxuZXhwb3J0cy5nZXRWZXJzaW9uID0gZ2V0VmVyc2lvbjtcbmV4cG9ydHMucHJveHkgPSBwcm94eTtcbmV4cG9ydHMucmVmID0gcmVmO1xuZXhwb3J0cy5zbmFwc2hvdCA9IHNuYXBzaG90O1xuZXhwb3J0cy5zdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4iXX0=
