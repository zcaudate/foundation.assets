(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t||self).proxyCompare={})}(this,function(t){function e(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var r=Symbol(),n=Symbol(),o=Symbol(),i=Object.getPrototypeOf,u=new WeakMap,a=function(t){return t&&(u.has(t)?u.get(t):i(t)===Object.prototype||i(t)===Array.prototype)},f=function(t){return"object"==typeof t&&null!==t},c=function(t,e,u){if(!a(t))return t;var f=t[o]||t,s=function(t){return Object.isFrozen(t)||Object.values(Object.getOwnPropertyDescriptors(t)).some(function(t){return!t.writable})}(f),l=u&&u.get(f);return l&&l.f===s||((l=function(t,e){var i,u=!1,a=function(e,r){if(!u){var n=e.a.get(t);n||(n=new Set,e.a.set(t,n)),n.add(r)}},f=((i={}).f=e,i.get=function(e,r){return r===o?t:(a(this,r),c(e[r],this.a,this.c))},i.has=function(e,r){return r===n?(u=!0,this.a.delete(t),!0):(a(this,r),r in e)},i.ownKeys=function(t){return a(this,r),Reflect.ownKeys(t)},i);return e&&(f.set=f.deleteProperty=function(){return!1}),f}(f,s)).p=new Proxy(s?function(t){if(Array.isArray(t))return Array.from(t);var e=Object.getOwnPropertyDescriptors(t);return Object.values(e).forEach(function(t){t.configurable=!0}),Object.create(i(t),e)}(f):f,l),u&&u.set(f,l)),l.a=e,l.c=u,l.p},s=function(t,e){var r=Reflect.ownKeys(t),n=Reflect.ownKeys(e);return r.length!==n.length||r.some(function(t,e){return t!==n[e]})};t.affectedToPathList=function(t,e){var r=[];return function t(n,o){var i=e.get(n);i?i.forEach(function(e){t(n[e],o?[].concat(o,[e]):[e])}):o&&r.push(o)}(t),r},t.createProxy=c,t.getUntracked=function(t){return a(t)&&t[o]||null},t.isChanged=function t(n,o,i,u){if(Object.is(n,o))return!1;if(!f(n)||!f(o))return!0;var a=i.get(n);if(!a)return!0;if(u){var c,l=u.get(n);if(l&&l.n===o)return l.g;u.set(n,((c={}).n=o,c.g=!1,c))}for(var y,p,b=null,d=function(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(n)return(n=n.call(t)).next.bind(n);if(Array.isArray(t)||(n=function(t,r){if(t){if("string"==typeof t)return e(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,r):void 0}}(t))){n&&(t=n);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(a);!(y=d()).done;){var g=y.value,h=g===r?s(n,o):t(n[g],o[g],i,u);if(!0!==h&&!1!==h||(b=h),b)break}return null===b&&(b=!0),u&&u.set(n,((p={}).n=o,p.g=b,p)),b},t.markToTrack=function(t,e){void 0===e&&(e=!0),u.set(t,e)},t.trackMemo=function(t){return!!a(t)&&n in t}});


},{}],2:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vanilla = require('valtio/vanilla');
var proxyCompare = require('proxy-compare');

var subscribeKey = function subscribeKey(proxyObject, key, callback, notifyInSync) {
  return vanilla.subscribe(proxyObject, function (ops) {
    if (ops.some(function (op) {
      return op[1][0] === key;
    })) {
      callback(proxyObject[key]);
    }
  }, notifyInSync);
};

var currentCleanups;
var watch = function watch(callback) {
  var cleanups = new Set();
  var subscriptions = new Set();
  var alive = true;

  var cleanup = function cleanup() {
    cleanups.forEach(function (clean) {
      clean();
    });
    cleanups.clear();
    subscriptions.clear();
  };

  var revalidate = function revalidate() {
    if (!alive) {
      return;
    }

    cleanup();
    var parent = currentCleanups;
    currentCleanups = cleanups;

    try {
      var cleanupReturn = callback(function (proxy) {
        subscriptions.add(proxy);
        return proxy;
      });

      if (cleanupReturn) {
        cleanups.add(cleanupReturn);
      }
    } finally {
      currentCleanups = parent;
    }

    subscriptions.forEach(function (proxy) {
      var clean = vanilla.subscribe(proxy, revalidate);
      cleanups.add(clean);
    });
  };

  var wrappedCleanup = function wrappedCleanup() {
    if (alive) {
      cleanup();
      alive = false;
    }
  };

  if (currentCleanups) {
    currentCleanups.add(wrappedCleanup);
  }

  revalidate();
  return wrappedCleanup;
};

var DEVTOOLS = Symbol();
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
  var unsub1 = vanilla.subscribe(proxyObject, function (ops) {
    var action = ops.filter(function (_ref) {
      _ref[0];
          var path = _ref[1];
      return path[0] !== DEVTOOLS;
    }).map(function (_ref2) {
      var op = _ref2[0],
          path = _ref2[1];
      return op + ":" + path.map(String).join('.');
    }).join(', ');

    if (!action) {
      return;
    }

    if (isTimeTraveling) {
      isTimeTraveling = false;
    } else {
      var snapWithoutDevtools = Object.assign({}, vanilla.snapshot(proxyObject));
      delete snapWithoutDevtools[DEVTOOLS];
      devtools.send({
        type: action,
        updatedAt: new Date().toLocaleString()
      }, snapWithoutDevtools);
    }
  });
  var unsub2 = devtools.subscribe(function (message) {
    var _message$payload3, _message$payload4;

    if (message.type === 'DISPATCH' && message.state) {
      var _message$payload, _message$payload2;

      if (((_message$payload = message.payload) == null ? void 0 : _message$payload.type) === 'JUMP_TO_ACTION' || ((_message$payload2 = message.payload) == null ? void 0 : _message$payload2.type) === 'JUMP_TO_STATE') {
        isTimeTraveling = true;
      }
      proxyObject[DEVTOOLS] = message;
    } else if (message.type === 'DISPATCH' && ((_message$payload3 = message.payload) == null ? void 0 : _message$payload3.type) === 'COMMIT') {
      devtools.init(vanilla.snapshot(proxyObject));
    } else if (message.type === 'DISPATCH' && ((_message$payload4 = message.payload) == null ? void 0 : _message$payload4.type) === 'IMPORT_STATE') {
      var _message$payload$next, _message$payload$next2;

      var actions = (_message$payload$next = message.payload.nextLiftedState) == null ? void 0 : _message$payload$next.actionsById;
      var computedStates = ((_message$payload$next2 = message.payload.nextLiftedState) == null ? void 0 : _message$payload$next2.computedStates) || [];
      isTimeTraveling = true;
      computedStates.forEach(function (_ref3, index) {
        var state = _ref3.state;
        var action = actions[index] || 'No action found';
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

var subscriptionsCache = new WeakMap();

var getSubscriptions = function getSubscriptions(proxyObject) {
  var subscriptions = subscriptionsCache.get(proxyObject);

  if (!subscriptions) {
    subscriptions = new Map();
    subscriptionsCache.set(proxyObject, subscriptions);
  }

  return subscriptions;
};

var unstable_getDeriveSubscriptions = getSubscriptions;
var derive = function derive(derivedFns, options) {
  var proxyObject = (options == null ? void 0 : options.proxy) || vanilla.proxy({});
  var notifyInSync = options == null ? void 0 : options.sync;
  var subscriptions = getSubscriptions(proxyObject);

  var addSubscription = function addSubscription(p, key, callback) {
    var subscription = subscriptions.get(p);

    if (subscription) {
      subscription[0].set(key, callback);
    } else {
      var unsubscribe = vanilla.subscribe(p, function (ops) {
        var _subscriptions$get;

        if (p === proxyObject && ops.every(function (op) {
          return op[1].length === 1 && op[1][0] in derivedFns;
        })) {
          return;
        }

        (_subscriptions$get = subscriptions.get(p)) == null ? void 0 : _subscriptions$get[0].forEach(function (cb) {
          cb();
        });
      }, notifyInSync);
      subscriptions.set(p, [new Map([[key, callback]]), unsubscribe]);
    }
  };

  var removeSubscription = function removeSubscription(p, key) {
    var subscription = subscriptions.get(p);

    if (subscription) {
      var callbackMap = subscription[0],
          unsubscribe = subscription[1];
      callbackMap.delete(key);

      if (!callbackMap.size) {
        unsubscribe();
        subscriptions.delete(p);
      }
    }
  };

  Object.keys(derivedFns).forEach(function (key) {
    if (Object.getOwnPropertyDescriptor(proxyObject, key)) {
      throw new Error('object property already defined');
    }

    var fn = derivedFns[key];
    var lastDependencies = null;

    var evaluate = function evaluate() {
      if (lastDependencies) {
        if (Array.from(lastDependencies).every(function (_ref) {
          var p = _ref[0],
              n = _ref[1];
          return vanilla.getVersion(p) === n;
        })) {
          return;
        }
      }

      var dependencies = new Map();

      var get = function get(p) {
        dependencies.set(p, vanilla.getVersion(p));
        return p;
      };

      var value = fn(get);

      var subscribe = function subscribe() {
        var _lastDependencies2;

        dependencies.forEach(function (_, p) {
          var _lastDependencies;

          if (!((_lastDependencies = lastDependencies) != null && _lastDependencies.has(p))) {
            addSubscription(p, key, evaluate);
          }
        });
        (_lastDependencies2 = lastDependencies) == null ? void 0 : _lastDependencies2.forEach(function (_, p) {
          if (!dependencies.has(p)) {
            removeSubscription(p, key);
          }
        });
        lastDependencies = dependencies;
      };

      if (value instanceof Promise) {
        value.then(function () {
          subscribe();
          evaluate();
        });
      } else {
        subscribe();
      }

      proxyObject[key] = value;
    };

    evaluate();
  });
  return proxyObject;
};
var underive = function underive(proxyObject, options) {
  var subscriptions = getSubscriptions(proxyObject);
  var keysToDelete = options != null && options.delete ? new Set() : null;
  subscriptions.forEach(function (_ref2, p) {
    var callbackMap = _ref2[0],
        unsubscribe = _ref2[1];

    if (options != null && options.keys) {
      options.keys.forEach(function (key) {
        if (callbackMap.has(key)) {
          callbackMap.delete(key);

          if (keysToDelete) {
            keysToDelete.add(key);
          }
        }
      });
    } else {
      if (keysToDelete) {
        Array.from(callbackMap.keys()).forEach(function (key) {
          keysToDelete.add(key);
        });
      }

      callbackMap.clear();
    }

    if (!callbackMap.size) {
      unsubscribe();
      subscriptions.delete(p);
    }
  });

  if (keysToDelete) {
    keysToDelete.forEach(function (key) {
      delete proxyObject[key];
    });
  }
};

var addComputed_DEPRECATED = function addComputed_DEPRECATED(proxyObject, computedFns_FAKE, targetObject) {
  if (targetObject === void 0) {
    targetObject = proxyObject;
  }

  console.warn('addComputed is deprecated. Please consider using `derive` or `proxyWithComputed` instead. Falling back to emulation with derive.');
  var derivedFns = {};
  Object.keys(computedFns_FAKE).forEach(function (key) {
    derivedFns[key] = function (get) {
      return computedFns_FAKE[key](get(proxyObject));
    };
  });
  return derive(derivedFns, {
    proxy: targetObject
  });
};

var proxyWithComputed = function proxyWithComputed(initialObject, computedFns) {
  Object.keys(computedFns).forEach(function (key) {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error('object property already defined');
    }

    var computedFn = computedFns[key];

    var _ref = typeof computedFn === 'function' ? {
      get: computedFn
    } : computedFn,
        get = _ref.get,
        set = _ref.set;

    var computedValue;
    var prevSnapshot;
    var affected = new WeakMap();
    var desc = {};

    desc.get = function () {
      var nextSnapshot = vanilla.snapshot(proxyObject);

      if (!prevSnapshot || proxyCompare.isChanged(prevSnapshot, nextSnapshot, affected)) {
        affected = new WeakMap();
        computedValue = get(proxyCompare.createProxy(nextSnapshot, affected));
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

var proxyWithHistory = function proxyWithHistory(initialValue, skipSubscribe) {
  if (skipSubscribe === void 0) {
    skipSubscribe = false;
  }

  var proxyObject = vanilla.proxy({
    value: initialValue,
    history: vanilla.ref({
      wip: initialValue,
      snapshots: [],
      index: -1
    }),
    canUndo: function canUndo() {
      return proxyObject.history.index > 0;
    },
    undo: function undo() {
      if (proxyObject.canUndo()) {
        proxyObject.value = proxyObject.history.wip = proxyObject.history.snapshots[--proxyObject.history.index];
        proxyObject.history.snapshots[proxyObject.history.index] = vanilla.snapshot(proxyObject).value;
      }
    },
    canRedo: function canRedo() {
      return proxyObject.history.index < proxyObject.history.snapshots.length - 1;
    },
    redo: function redo() {
      if (proxyObject.canRedo()) {
        proxyObject.value = proxyObject.history.wip = proxyObject.history.snapshots[++proxyObject.history.index];
        proxyObject.history.snapshots[proxyObject.history.index] = vanilla.snapshot(proxyObject).value;
      }
    },
    saveHistory: function saveHistory() {
      proxyObject.history.snapshots.splice(proxyObject.history.index + 1);
      proxyObject.history.snapshots.push(vanilla.snapshot(proxyObject).value);
      ++proxyObject.history.index;
    },
    subscribe: function subscribe() {
      return vanilla.subscribe(proxyObject, function (ops) {
        if (ops.some(function (op) {
          return op[1][0] === 'value' && (op[0] !== 'set' || op[2] !== proxyObject.history.wip);
        })) {
          proxyObject.saveHistory();
        }
      });
    }
  });
  proxyObject.saveHistory();

  if (!skipSubscribe) {
    proxyObject.subscribe();
  }

  return proxyObject;
};

exports.addComputed = addComputed_DEPRECATED;
exports.derive = derive;
exports.devtools = devtools;
exports.proxyWithComputed = proxyWithComputed;
exports.proxyWithHistory = proxyWithHistory;
exports.subscribeKey = subscribeKey;
exports.underive = underive;
exports.unstable_getDeriveSubscriptions = unstable_getDeriveSubscriptions;
exports.watch = watch;

}).call(this)}).call(this,require('_process'))

},{"_process":5,"proxy-compare":1,"valtio/vanilla":3}],3:[function(require,module,exports){
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

  var found = proxyCache.get(initialObject);

  if (found) {
    return found;
  }

  var version = globalVersion;
  var listeners = new Set();

  var notifyUpdate = function notifyUpdate(op, nextVersion) {
    if (!nextVersion) {
      nextVersion = ++globalVersion;
    }

    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach(function (listener) {
        return listener(op, nextVersion);
      });
    }
  };

  var propListeners = new Map();

  var getPropListener = function getPropListener(prop) {
    var propListener = propListeners.get(prop);

    if (!propListener) {
      propListener = function propListener(op, nextVersion) {
        var newOp = [].concat(op);
        newOp[1] = [prop].concat(newOp[1]);
        notifyUpdate(newOp, nextVersion);
      };

      propListeners.set(prop, propListener);
    }

    return propListener;
  };

  var popPropListener = function popPropListener(prop) {
    var propListener = propListeners.get(prop);
    propListeners.delete(prop);
    return propListener;
  };

  var createSnapshot = function createSnapshot(target, receiver) {
    var cache = snapshotCache.get(receiver);

    if ((cache == null ? void 0 : cache[0]) === version) {
      return cache[1];
    }

    var snapshot = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    proxyCompare.markToTrack(snapshot, true);
    snapshotCache.set(receiver, [version, snapshot]);
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
              if (PROMISE_RESULT in value) {
                return value[PROMISE_RESULT];
              }

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
      var childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];

      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }

      var deleted = Reflect.deleteProperty(target, prop);

      if (deleted) {
        notifyUpdate(['delete', [prop], prevValue]);
      }

      return deleted;
    },
    set: function set(target, prop, value) {
      var _Object$getOwnPropert;

      var prevValue = target[prop];

      if (Object.is(prevValue, value)) {
        return true;
      }

      var childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];

      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }

      if (refSet.has(value) || !isSupportedObject(value) || (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(target, prop)) != null && _Object$getOwnPropert.set) {
        target[prop] = value;
      } else if (value instanceof Promise) {
        target[prop] = value.then(function (v) {
          target[prop][PROMISE_RESULT] = v;
          notifyUpdate(['resolve', [prop], v]);
          return v;
        }).catch(function (e) {
          target[prop][PROMISE_ERROR] = e;
          notifyUpdate(['reject', [prop], e]);
        });
      } else {
        value = proxyCompare.getUntracked(value) || value;

        if (value[LISTENERS]) {
          target[prop] = value;
        } else {
          target[prop] = proxy(value);
        }

        target[prop][LISTENERS].add(getPropListener(prop));
      }

      notifyUpdate(['set', [prop], value, prevValue]);
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
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && !(proxyObject != null && proxyObject[VERSION])) {
    throw new Error('Please use proxy object');
  }

  return proxyObject[VERSION];
};
var subscribe = function subscribe(proxyObject, callback, notifyInSync) {
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && !(proxyObject != null && proxyObject[LISTENERS])) {
    throw new Error('Please use proxy object');
  }

  var pendingVersion = 0;
  var ops = [];

  var listener = function listener(op, nextVersion) {
    ops.push(op);

    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }

    pendingVersion = nextVersion;
    Promise.resolve().then(function () {
      if (nextVersion === pendingVersion) {
        callback(ops.splice(0));
      }
    });
  };

  proxyObject[LISTENERS].add(listener);
  return function () {
    proxyObject[LISTENERS].delete(listener);
  };
};
var snapshot = function snapshot(proxyObject) {
  if (typeof process === 'object' && process.env.NODE_ENV !== 'production' && !(proxyObject != null && proxyObject[SNAPSHOT])) {
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

},{"_process":5,"proxy-compare":1}],4:[function(require,module,exports){
// browser.build-valtio-core.main/ValtioCore
var ValtioCore = require("valtio/vanilla");

// browser.build-valtio-core.main/ValtioUtils
var ValtioUtils = require("valtio/utils");

// browser.build-valtio-core.main/__init__
globalThis["ValtioCore"] = ValtioCore;
globalThis["ValtioUtils"] = ValtioUtils;
},{"valtio/utils":2,"valtio/vanilla":3}],5:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rcHJveHktY29tcGFyZUAyLjAuMi9ub2RlX21vZHVsZXMvcHJveHktY29tcGFyZS9kaXN0L2luZGV4LnVtZC5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rdmFsdGlvQDEuMi4zL25vZGVfbW9kdWxlcy92YWx0aW8vbm9kZV9tb2R1bGVzL3ZhbHRpby91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rdmFsdGlvQDEuMi4zL25vZGVfbW9kdWxlcy92YWx0aW8vbm9kZV9tb2R1bGVzL3ZhbHRpby92YW5pbGxhLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzFiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUoKHR8fHNlbGYpLnByb3h5Q29tcGFyZT17fSl9KHRoaXMsZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LGUpeyhudWxsPT1lfHxlPnQubGVuZ3RoKSYmKGU9dC5sZW5ndGgpO2Zvcih2YXIgcj0wLG49bmV3IEFycmF5KGUpO3I8ZTtyKyspbltyXT10W3JdO3JldHVybiBufXZhciByPVN5bWJvbCgpLG49U3ltYm9sKCksbz1TeW1ib2woKSxpPU9iamVjdC5nZXRQcm90b3R5cGVPZix1PW5ldyBXZWFrTWFwLGE9ZnVuY3Rpb24odCl7cmV0dXJuIHQmJih1Lmhhcyh0KT91LmdldCh0KTppKHQpPT09T2JqZWN0LnByb3RvdHlwZXx8aSh0KT09PUFycmF5LnByb3RvdHlwZSl9LGY9ZnVuY3Rpb24odCl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIHQmJm51bGwhPT10fSxjPWZ1bmN0aW9uKHQsZSx1KXtpZighYSh0KSlyZXR1cm4gdDt2YXIgZj10W29dfHx0LHM9ZnVuY3Rpb24odCl7cmV0dXJuIE9iamVjdC5pc0Zyb3plbih0KXx8T2JqZWN0LnZhbHVlcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0KSkuc29tZShmdW5jdGlvbih0KXtyZXR1cm4hdC53cml0YWJsZX0pfShmKSxsPXUmJnUuZ2V0KGYpO3JldHVybiBsJiZsLmY9PT1zfHwoKGw9ZnVuY3Rpb24odCxlKXt2YXIgaSx1PSExLGE9ZnVuY3Rpb24oZSxyKXtpZighdSl7dmFyIG49ZS5hLmdldCh0KTtufHwobj1uZXcgU2V0LGUuYS5zZXQodCxuKSksbi5hZGQocil9fSxmPSgoaT17fSkuZj1lLGkuZ2V0PWZ1bmN0aW9uKGUscil7cmV0dXJuIHI9PT1vP3Q6KGEodGhpcyxyKSxjKGVbcl0sdGhpcy5hLHRoaXMuYykpfSxpLmhhcz1mdW5jdGlvbihlLHIpe3JldHVybiByPT09bj8odT0hMCx0aGlzLmEuZGVsZXRlKHQpLCEwKTooYSh0aGlzLHIpLHIgaW4gZSl9LGkub3duS2V5cz1mdW5jdGlvbih0KXtyZXR1cm4gYSh0aGlzLHIpLFJlZmxlY3Qub3duS2V5cyh0KX0saSk7cmV0dXJuIGUmJihmLnNldD1mLmRlbGV0ZVByb3BlcnR5PWZ1bmN0aW9uKCl7cmV0dXJuITF9KSxmfShmLHMpKS5wPW5ldyBQcm94eShzP2Z1bmN0aW9uKHQpe2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIEFycmF5LmZyb20odCk7dmFyIGU9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModCk7cmV0dXJuIE9iamVjdC52YWx1ZXMoZSkuZm9yRWFjaChmdW5jdGlvbih0KXt0LmNvbmZpZ3VyYWJsZT0hMH0pLE9iamVjdC5jcmVhdGUoaSh0KSxlKX0oZik6ZixsKSx1JiZ1LnNldChmLGwpKSxsLmE9ZSxsLmM9dSxsLnB9LHM9ZnVuY3Rpb24odCxlKXt2YXIgcj1SZWZsZWN0Lm93bktleXModCksbj1SZWZsZWN0Lm93bktleXMoZSk7cmV0dXJuIHIubGVuZ3RoIT09bi5sZW5ndGh8fHIuc29tZShmdW5jdGlvbih0LGUpe3JldHVybiB0IT09bltlXX0pfTt0LmFmZmVjdGVkVG9QYXRoTGlzdD1mdW5jdGlvbih0LGUpe3ZhciByPVtdO3JldHVybiBmdW5jdGlvbiB0KG4sbyl7dmFyIGk9ZS5nZXQobik7aT9pLmZvckVhY2goZnVuY3Rpb24oZSl7dChuW2VdLG8/W10uY29uY2F0KG8sW2VdKTpbZV0pfSk6byYmci5wdXNoKG8pfSh0KSxyfSx0LmNyZWF0ZVByb3h5PWMsdC5nZXRVbnRyYWNrZWQ9ZnVuY3Rpb24odCl7cmV0dXJuIGEodCkmJnRbb118fG51bGx9LHQuaXNDaGFuZ2VkPWZ1bmN0aW9uIHQobixvLGksdSl7aWYoT2JqZWN0LmlzKG4sbykpcmV0dXJuITE7aWYoIWYobil8fCFmKG8pKXJldHVybiEwO3ZhciBhPWkuZ2V0KG4pO2lmKCFhKXJldHVybiEwO2lmKHUpe3ZhciBjLGw9dS5nZXQobik7aWYobCYmbC5uPT09bylyZXR1cm4gbC5nO3Uuc2V0KG4sKChjPXt9KS5uPW8sYy5nPSExLGMpKX1mb3IodmFyIHkscCxiPW51bGwsZD1mdW5jdGlvbih0LHIpe3ZhciBuPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJnRbU3ltYm9sLml0ZXJhdG9yXXx8dFtcIkBAaXRlcmF0b3JcIl07aWYobilyZXR1cm4obj1uLmNhbGwodCkpLm5leHQuYmluZChuKTtpZihBcnJheS5pc0FycmF5KHQpfHwobj1mdW5jdGlvbih0LHIpe2lmKHQpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0KXJldHVybiBlKHQscik7dmFyIG49T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLnNsaWNlKDgsLTEpO3JldHVyblwiT2JqZWN0XCI9PT1uJiZ0LmNvbnN0cnVjdG9yJiYobj10LmNvbnN0cnVjdG9yLm5hbWUpLFwiTWFwXCI9PT1ufHxcIlNldFwiPT09bj9BcnJheS5mcm9tKHQpOlwiQXJndW1lbnRzXCI9PT1ufHwvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKT9lKHQscik6dm9pZCAwfX0odCkpKXtuJiYodD1uKTt2YXIgbz0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBvPj10Lmxlbmd0aD97ZG9uZTohMH06e2RvbmU6ITEsdmFsdWU6dFtvKytdfX19dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpfShhKTshKHk9ZCgpKS5kb25lOyl7dmFyIGc9eS52YWx1ZSxoPWc9PT1yP3MobixvKTp0KG5bZ10sb1tnXSxpLHUpO2lmKCEwIT09aCYmITEhPT1ofHwoYj1oKSxiKWJyZWFrfXJldHVybiBudWxsPT09YiYmKGI9ITApLHUmJnUuc2V0KG4sKChwPXt9KS5uPW8scC5nPWIscCkpLGJ9LHQubWFya1RvVHJhY2s9ZnVuY3Rpb24odCxlKXt2b2lkIDA9PT1lJiYoZT0hMCksdS5zZXQodCxlKX0sdC50cmFja01lbW89ZnVuY3Rpb24odCl7cmV0dXJuISFhKHQpJiZuIGluIHR9fSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC51bWQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciB2YW5pbGxhID0gcmVxdWlyZSgndmFsdGlvL3ZhbmlsbGEnKTtcbnZhciBwcm94eUNvbXBhcmUgPSByZXF1aXJlKCdwcm94eS1jb21wYXJlJyk7XG5cbnZhciBzdWJzY3JpYmVLZXkgPSBmdW5jdGlvbiBzdWJzY3JpYmVLZXkocHJveHlPYmplY3QsIGtleSwgY2FsbGJhY2ssIG5vdGlmeUluU3luYykge1xuICByZXR1cm4gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGZ1bmN0aW9uIChvcHMpIHtcbiAgICBpZiAob3BzLnNvbWUoZnVuY3Rpb24gKG9wKSB7XG4gICAgICByZXR1cm4gb3BbMV1bMF0gPT09IGtleTtcbiAgICB9KSkge1xuICAgICAgY2FsbGJhY2socHJveHlPYmplY3Rba2V5XSk7XG4gICAgfVxuICB9LCBub3RpZnlJblN5bmMpO1xufTtcblxudmFyIGN1cnJlbnRDbGVhbnVwcztcbnZhciB3YXRjaCA9IGZ1bmN0aW9uIHdhdGNoKGNhbGxiYWNrKSB7XG4gIHZhciBjbGVhbnVwcyA9IG5ldyBTZXQoKTtcbiAgdmFyIHN1YnNjcmlwdGlvbnMgPSBuZXcgU2V0KCk7XG4gIHZhciBhbGl2ZSA9IHRydWU7XG5cbiAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIGNsZWFudXBzLmZvckVhY2goZnVuY3Rpb24gKGNsZWFuKSB7XG4gICAgICBjbGVhbigpO1xuICAgIH0pO1xuICAgIGNsZWFudXBzLmNsZWFyKCk7XG4gICAgc3Vic2NyaXB0aW9ucy5jbGVhcigpO1xuICB9O1xuXG4gIHZhciByZXZhbGlkYXRlID0gZnVuY3Rpb24gcmV2YWxpZGF0ZSgpIHtcbiAgICBpZiAoIWFsaXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2xlYW51cCgpO1xuICAgIHZhciBwYXJlbnQgPSBjdXJyZW50Q2xlYW51cHM7XG4gICAgY3VycmVudENsZWFudXBzID0gY2xlYW51cHM7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIGNsZWFudXBSZXR1cm4gPSBjYWxsYmFjayhmdW5jdGlvbiAocHJveHkpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQocHJveHkpO1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNsZWFudXBSZXR1cm4pIHtcbiAgICAgICAgY2xlYW51cHMuYWRkKGNsZWFudXBSZXR1cm4pO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBjdXJyZW50Q2xlYW51cHMgPSBwYXJlbnQ7XG4gICAgfVxuXG4gICAgc3Vic2NyaXB0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChwcm94eSkge1xuICAgICAgdmFyIGNsZWFuID0gdmFuaWxsYS5zdWJzY3JpYmUocHJveHksIHJldmFsaWRhdGUpO1xuICAgICAgY2xlYW51cHMuYWRkKGNsZWFuKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgd3JhcHBlZENsZWFudXAgPSBmdW5jdGlvbiB3cmFwcGVkQ2xlYW51cCgpIHtcbiAgICBpZiAoYWxpdmUpIHtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIGFsaXZlID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGlmIChjdXJyZW50Q2xlYW51cHMpIHtcbiAgICBjdXJyZW50Q2xlYW51cHMuYWRkKHdyYXBwZWRDbGVhbnVwKTtcbiAgfVxuXG4gIHJldmFsaWRhdGUoKTtcbiAgcmV0dXJuIHdyYXBwZWRDbGVhbnVwO1xufTtcblxudmFyIERFVlRPT0xTID0gU3ltYm9sKCk7XG52YXIgZGV2dG9vbHMgPSBmdW5jdGlvbiBkZXZ0b29scyhwcm94eU9iamVjdCwgbmFtZSkge1xuICB2YXIgZXh0ZW5zaW9uO1xuXG4gIHRyeSB7XG4gICAgZXh0ZW5zaW9uID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX187XG4gIH0gY2F0Y2ggKF91bnVzZWQpIHt9XG5cbiAgaWYgKCFleHRlbnNpb24pIHtcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tXYXJuaW5nXSBQbGVhc2UgaW5zdGFsbC9lbmFibGUgUmVkdXggZGV2dG9vbHMgZXh0ZW5zaW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGlzVGltZVRyYXZlbGluZyA9IGZhbHNlO1xuICB2YXIgZGV2dG9vbHMgPSBleHRlbnNpb24uY29ubmVjdCh7XG4gICAgbmFtZTogbmFtZVxuICB9KTtcbiAgdmFyIHVuc3ViMSA9IHZhbmlsbGEuc3Vic2NyaWJlKHByb3h5T2JqZWN0LCBmdW5jdGlvbiAob3BzKSB7XG4gICAgdmFyIGFjdGlvbiA9IG9wcy5maWx0ZXIoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIF9yZWZbMF07XG4gICAgICAgICAgdmFyIHBhdGggPSBfcmVmWzFdO1xuICAgICAgcmV0dXJuIHBhdGhbMF0gIT09IERFVlRPT0xTO1xuICAgIH0pLm1hcChmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciBvcCA9IF9yZWYyWzBdLFxuICAgICAgICAgIHBhdGggPSBfcmVmMlsxXTtcbiAgICAgIHJldHVybiBvcCArIFwiOlwiICsgcGF0aC5tYXAoU3RyaW5nKS5qb2luKCcuJyk7XG4gICAgfSkuam9pbignLCAnKTtcblxuICAgIGlmICghYWN0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzVGltZVRyYXZlbGluZykge1xuICAgICAgaXNUaW1lVHJhdmVsaW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzbmFwV2l0aG91dERldnRvb2xzID0gT2JqZWN0LmFzc2lnbih7fSwgdmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuICAgICAgZGVsZXRlIHNuYXBXaXRob3V0RGV2dG9vbHNbREVWVE9PTFNdO1xuICAgICAgZGV2dG9vbHMuc2VuZCh7XG4gICAgICAgIHR5cGU6IGFjdGlvbixcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICAgIH0sIHNuYXBXaXRob3V0RGV2dG9vbHMpO1xuICAgIH1cbiAgfSk7XG4gIHZhciB1bnN1YjIgPSBkZXZ0b29scy5zdWJzY3JpYmUoZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB2YXIgX21lc3NhZ2UkcGF5bG9hZDMsIF9tZXNzYWdlJHBheWxvYWQ0O1xuXG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0RJU1BBVENIJyAmJiBtZXNzYWdlLnN0YXRlKSB7XG4gICAgICB2YXIgX21lc3NhZ2UkcGF5bG9hZCwgX21lc3NhZ2UkcGF5bG9hZDI7XG5cbiAgICAgIGlmICgoKF9tZXNzYWdlJHBheWxvYWQgPSBtZXNzYWdlLnBheWxvYWQpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkLnR5cGUpID09PSAnSlVNUF9UT19BQ1RJT04nIHx8ICgoX21lc3NhZ2UkcGF5bG9hZDIgPSBtZXNzYWdlLnBheWxvYWQpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkMi50eXBlKSA9PT0gJ0pVTVBfVE9fU1RBVEUnKSB7XG4gICAgICAgIGlzVGltZVRyYXZlbGluZyA9IHRydWU7XG4gICAgICB9XG4gICAgICBwcm94eU9iamVjdFtERVZUT09MU10gPSBtZXNzYWdlO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnRElTUEFUQ0gnICYmICgoX21lc3NhZ2UkcGF5bG9hZDMgPSBtZXNzYWdlLnBheWxvYWQpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkMy50eXBlKSA9PT0gJ0NPTU1JVCcpIHtcbiAgICAgIGRldnRvb2xzLmluaXQodmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnRElTUEFUQ0gnICYmICgoX21lc3NhZ2UkcGF5bG9hZDQgPSBtZXNzYWdlLnBheWxvYWQpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkNC50eXBlKSA9PT0gJ0lNUE9SVF9TVEFURScpIHtcbiAgICAgIHZhciBfbWVzc2FnZSRwYXlsb2FkJG5leHQsIF9tZXNzYWdlJHBheWxvYWQkbmV4dDI7XG5cbiAgICAgIHZhciBhY3Rpb25zID0gKF9tZXNzYWdlJHBheWxvYWQkbmV4dCA9IG1lc3NhZ2UucGF5bG9hZC5uZXh0TGlmdGVkU3RhdGUpID09IG51bGwgPyB2b2lkIDAgOiBfbWVzc2FnZSRwYXlsb2FkJG5leHQuYWN0aW9uc0J5SWQ7XG4gICAgICB2YXIgY29tcHV0ZWRTdGF0ZXMgPSAoKF9tZXNzYWdlJHBheWxvYWQkbmV4dDIgPSBtZXNzYWdlLnBheWxvYWQubmV4dExpZnRlZFN0YXRlKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZCRuZXh0Mi5jb21wdXRlZFN0YXRlcykgfHwgW107XG4gICAgICBpc1RpbWVUcmF2ZWxpbmcgPSB0cnVlO1xuICAgICAgY29tcHV0ZWRTdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZjMsIGluZGV4KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IF9yZWYzLnN0YXRlO1xuICAgICAgICB2YXIgYWN0aW9uID0gYWN0aW9uc1tpbmRleF0gfHwgJ05vIGFjdGlvbiBmb3VuZCc7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBwcm94eU9iamVjdFtrZXldID0gc3RhdGVba2V5XTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgZGV2dG9vbHMuaW5pdCh2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGV2dG9vbHMuc2VuZChhY3Rpb24sIHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgZGV2dG9vbHMuaW5pdCh2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdW5zdWIxKCk7XG4gICAgdW5zdWIyKCk7XG4gIH07XG59O1xuXG52YXIgc3Vic2NyaXB0aW9uc0NhY2hlID0gbmV3IFdlYWtNYXAoKTtcblxudmFyIGdldFN1YnNjcmlwdGlvbnMgPSBmdW5jdGlvbiBnZXRTdWJzY3JpcHRpb25zKHByb3h5T2JqZWN0KSB7XG4gIHZhciBzdWJzY3JpcHRpb25zID0gc3Vic2NyaXB0aW9uc0NhY2hlLmdldChwcm94eU9iamVjdCk7XG5cbiAgaWYgKCFzdWJzY3JpcHRpb25zKSB7XG4gICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICBzdWJzY3JpcHRpb25zQ2FjaGUuc2V0KHByb3h5T2JqZWN0LCBzdWJzY3JpcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBzdWJzY3JpcHRpb25zO1xufTtcblxudmFyIHVuc3RhYmxlX2dldERlcml2ZVN1YnNjcmlwdGlvbnMgPSBnZXRTdWJzY3JpcHRpb25zO1xudmFyIGRlcml2ZSA9IGZ1bmN0aW9uIGRlcml2ZShkZXJpdmVkRm5zLCBvcHRpb25zKSB7XG4gIHZhciBwcm94eU9iamVjdCA9IChvcHRpb25zID09IG51bGwgPyB2b2lkIDAgOiBvcHRpb25zLnByb3h5KSB8fCB2YW5pbGxhLnByb3h5KHt9KTtcbiAgdmFyIG5vdGlmeUluU3luYyA9IG9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IG9wdGlvbnMuc3luYztcbiAgdmFyIHN1YnNjcmlwdGlvbnMgPSBnZXRTdWJzY3JpcHRpb25zKHByb3h5T2JqZWN0KTtcblxuICB2YXIgYWRkU3Vic2NyaXB0aW9uID0gZnVuY3Rpb24gYWRkU3Vic2NyaXB0aW9uKHAsIGtleSwgY2FsbGJhY2spIHtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9ucy5nZXQocCk7XG5cbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb25bMF0uc2V0KGtleSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdW5zdWJzY3JpYmUgPSB2YW5pbGxhLnN1YnNjcmliZShwLCBmdW5jdGlvbiAob3BzKSB7XG4gICAgICAgIHZhciBfc3Vic2NyaXB0aW9ucyRnZXQ7XG5cbiAgICAgICAgaWYgKHAgPT09IHByb3h5T2JqZWN0ICYmIG9wcy5ldmVyeShmdW5jdGlvbiAob3ApIHtcbiAgICAgICAgICByZXR1cm4gb3BbMV0ubGVuZ3RoID09PSAxICYmIG9wWzFdWzBdIGluIGRlcml2ZWRGbnM7XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgKF9zdWJzY3JpcHRpb25zJGdldCA9IHN1YnNjcmlwdGlvbnMuZ2V0KHApKSA9PSBudWxsID8gdm9pZCAwIDogX3N1YnNjcmlwdGlvbnMkZ2V0WzBdLmZvckVhY2goZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBub3RpZnlJblN5bmMpO1xuICAgICAgc3Vic2NyaXB0aW9ucy5zZXQocCwgW25ldyBNYXAoW1trZXksIGNhbGxiYWNrXV0pLCB1bnN1YnNjcmliZV0pO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcmVtb3ZlU3Vic2NyaXB0aW9uID0gZnVuY3Rpb24gcmVtb3ZlU3Vic2NyaXB0aW9uKHAsIGtleSkge1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb25zLmdldChwKTtcblxuICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgIHZhciBjYWxsYmFja01hcCA9IHN1YnNjcmlwdGlvblswXSxcbiAgICAgICAgICB1bnN1YnNjcmliZSA9IHN1YnNjcmlwdGlvblsxXTtcbiAgICAgIGNhbGxiYWNrTWFwLmRlbGV0ZShrZXkpO1xuXG4gICAgICBpZiAoIWNhbGxiYWNrTWFwLnNpemUpIHtcbiAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kZWxldGUocCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIE9iamVjdC5rZXlzKGRlcml2ZWRGbnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3h5T2JqZWN0LCBrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCBwcm9wZXJ0eSBhbHJlYWR5IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICB2YXIgZm4gPSBkZXJpdmVkRm5zW2tleV07XG4gICAgdmFyIGxhc3REZXBlbmRlbmNpZXMgPSBudWxsO1xuXG4gICAgdmFyIGV2YWx1YXRlID0gZnVuY3Rpb24gZXZhbHVhdGUoKSB7XG4gICAgICBpZiAobGFzdERlcGVuZGVuY2llcykge1xuICAgICAgICBpZiAoQXJyYXkuZnJvbShsYXN0RGVwZW5kZW5jaWVzKS5ldmVyeShmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICAgIHZhciBwID0gX3JlZlswXSxcbiAgICAgICAgICAgICAgbiA9IF9yZWZbMV07XG4gICAgICAgICAgcmV0dXJuIHZhbmlsbGEuZ2V0VmVyc2lvbihwKSA9PT0gbjtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGRlcGVuZGVuY2llcyA9IG5ldyBNYXAoKTtcblxuICAgICAgdmFyIGdldCA9IGZ1bmN0aW9uIGdldChwKSB7XG4gICAgICAgIGRlcGVuZGVuY2llcy5zZXQocCwgdmFuaWxsYS5nZXRWZXJzaW9uKHApKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9O1xuXG4gICAgICB2YXIgdmFsdWUgPSBmbihnZXQpO1xuXG4gICAgICB2YXIgc3Vic2NyaWJlID0gZnVuY3Rpb24gc3Vic2NyaWJlKCkge1xuICAgICAgICB2YXIgX2xhc3REZXBlbmRlbmNpZXMyO1xuXG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uIChfLCBwKSB7XG4gICAgICAgICAgdmFyIF9sYXN0RGVwZW5kZW5jaWVzO1xuXG4gICAgICAgICAgaWYgKCEoKF9sYXN0RGVwZW5kZW5jaWVzID0gbGFzdERlcGVuZGVuY2llcykgIT0gbnVsbCAmJiBfbGFzdERlcGVuZGVuY2llcy5oYXMocCkpKSB7XG4gICAgICAgICAgICBhZGRTdWJzY3JpcHRpb24ocCwga2V5LCBldmFsdWF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgKF9sYXN0RGVwZW5kZW5jaWVzMiA9IGxhc3REZXBlbmRlbmNpZXMpID09IG51bGwgPyB2b2lkIDAgOiBfbGFzdERlcGVuZGVuY2llczIuZm9yRWFjaChmdW5jdGlvbiAoXywgcCkge1xuICAgICAgICAgIGlmICghZGVwZW5kZW5jaWVzLmhhcyhwKSkge1xuICAgICAgICAgICAgcmVtb3ZlU3Vic2NyaXB0aW9uKHAsIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGFzdERlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcztcbiAgICAgIH07XG5cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgdmFsdWUudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3Vic2NyaWJlKCk7XG4gICAgICAgICAgZXZhbHVhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzY3JpYmUoKTtcbiAgICAgIH1cblxuICAgICAgcHJveHlPYmplY3Rba2V5XSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICBldmFsdWF0ZSgpO1xuICB9KTtcbiAgcmV0dXJuIHByb3h5T2JqZWN0O1xufTtcbnZhciB1bmRlcml2ZSA9IGZ1bmN0aW9uIHVuZGVyaXZlKHByb3h5T2JqZWN0LCBvcHRpb25zKSB7XG4gIHZhciBzdWJzY3JpcHRpb25zID0gZ2V0U3Vic2NyaXB0aW9ucyhwcm94eU9iamVjdCk7XG4gIHZhciBrZXlzVG9EZWxldGUgPSBvcHRpb25zICE9IG51bGwgJiYgb3B0aW9ucy5kZWxldGUgPyBuZXcgU2V0KCkgOiBudWxsO1xuICBzdWJzY3JpcHRpb25zLmZvckVhY2goZnVuY3Rpb24gKF9yZWYyLCBwKSB7XG4gICAgdmFyIGNhbGxiYWNrTWFwID0gX3JlZjJbMF0sXG4gICAgICAgIHVuc3Vic2NyaWJlID0gX3JlZjJbMV07XG5cbiAgICBpZiAob3B0aW9ucyAhPSBudWxsICYmIG9wdGlvbnMua2V5cykge1xuICAgICAgb3B0aW9ucy5rZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoY2FsbGJhY2tNYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICBjYWxsYmFja01hcC5kZWxldGUoa2V5KTtcblxuICAgICAgICAgIGlmIChrZXlzVG9EZWxldGUpIHtcbiAgICAgICAgICAgIGtleXNUb0RlbGV0ZS5hZGQoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5c1RvRGVsZXRlKSB7XG4gICAgICAgIEFycmF5LmZyb20oY2FsbGJhY2tNYXAua2V5cygpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBrZXlzVG9EZWxldGUuYWRkKGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFja01hcC5jbGVhcigpO1xuICAgIH1cblxuICAgIGlmICghY2FsbGJhY2tNYXAuc2l6ZSkge1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIHN1YnNjcmlwdGlvbnMuZGVsZXRlKHApO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGtleXNUb0RlbGV0ZSkge1xuICAgIGtleXNUb0RlbGV0ZS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGRlbGV0ZSBwcm94eU9iamVjdFtrZXldO1xuICAgIH0pO1xuICB9XG59O1xuXG52YXIgYWRkQ29tcHV0ZWRfREVQUkVDQVRFRCA9IGZ1bmN0aW9uIGFkZENvbXB1dGVkX0RFUFJFQ0FURUQocHJveHlPYmplY3QsIGNvbXB1dGVkRm5zX0ZBS0UsIHRhcmdldE9iamVjdCkge1xuICBpZiAodGFyZ2V0T2JqZWN0ID09PSB2b2lkIDApIHtcbiAgICB0YXJnZXRPYmplY3QgPSBwcm94eU9iamVjdDtcbiAgfVxuXG4gIGNvbnNvbGUud2FybignYWRkQ29tcHV0ZWQgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIGNvbnNpZGVyIHVzaW5nIGBkZXJpdmVgIG9yIGBwcm94eVdpdGhDb21wdXRlZGAgaW5zdGVhZC4gRmFsbGluZyBiYWNrIHRvIGVtdWxhdGlvbiB3aXRoIGRlcml2ZS4nKTtcbiAgdmFyIGRlcml2ZWRGbnMgPSB7fTtcbiAgT2JqZWN0LmtleXMoY29tcHV0ZWRGbnNfRkFLRSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgZGVyaXZlZEZuc1trZXldID0gZnVuY3Rpb24gKGdldCkge1xuICAgICAgcmV0dXJuIGNvbXB1dGVkRm5zX0ZBS0Vba2V5XShnZXQocHJveHlPYmplY3QpKTtcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIGRlcml2ZShkZXJpdmVkRm5zLCB7XG4gICAgcHJveHk6IHRhcmdldE9iamVjdFxuICB9KTtcbn07XG5cbnZhciBwcm94eVdpdGhDb21wdXRlZCA9IGZ1bmN0aW9uIHByb3h5V2l0aENvbXB1dGVkKGluaXRpYWxPYmplY3QsIGNvbXB1dGVkRm5zKSB7XG4gIE9iamVjdC5rZXlzKGNvbXB1dGVkRm5zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbml0aWFsT2JqZWN0LCBrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCBwcm9wZXJ0eSBhbHJlYWR5IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcHV0ZWRGbiA9IGNvbXB1dGVkRm5zW2tleV07XG5cbiAgICB2YXIgX3JlZiA9IHR5cGVvZiBjb21wdXRlZEZuID09PSAnZnVuY3Rpb24nID8ge1xuICAgICAgZ2V0OiBjb21wdXRlZEZuXG4gICAgfSA6IGNvbXB1dGVkRm4sXG4gICAgICAgIGdldCA9IF9yZWYuZ2V0LFxuICAgICAgICBzZXQgPSBfcmVmLnNldDtcblxuICAgIHZhciBjb21wdXRlZFZhbHVlO1xuICAgIHZhciBwcmV2U25hcHNob3Q7XG4gICAgdmFyIGFmZmVjdGVkID0gbmV3IFdlYWtNYXAoKTtcbiAgICB2YXIgZGVzYyA9IHt9O1xuXG4gICAgZGVzYy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmV4dFNuYXBzaG90ID0gdmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCk7XG5cbiAgICAgIGlmICghcHJldlNuYXBzaG90IHx8IHByb3h5Q29tcGFyZS5pc0NoYW5nZWQocHJldlNuYXBzaG90LCBuZXh0U25hcHNob3QsIGFmZmVjdGVkKSkge1xuICAgICAgICBhZmZlY3RlZCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgIGNvbXB1dGVkVmFsdWUgPSBnZXQocHJveHlDb21wYXJlLmNyZWF0ZVByb3h5KG5leHRTbmFwc2hvdCwgYWZmZWN0ZWQpKTtcbiAgICAgICAgcHJldlNuYXBzaG90ID0gbmV4dFNuYXBzaG90O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29tcHV0ZWRWYWx1ZTtcbiAgICB9O1xuXG4gICAgaWYgKHNldCkge1xuICAgICAgZGVzYy5zZXQgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHNldChwcm94eU9iamVjdCwgbmV3VmFsdWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5pdGlhbE9iamVjdCwga2V5LCBkZXNjKTtcbiAgfSk7XG4gIHZhciBwcm94eU9iamVjdCA9IHZhbmlsbGEucHJveHkoaW5pdGlhbE9iamVjdCk7XG4gIHJldHVybiBwcm94eU9iamVjdDtcbn07XG5cbnZhciBwcm94eVdpdGhIaXN0b3J5ID0gZnVuY3Rpb24gcHJveHlXaXRoSGlzdG9yeShpbml0aWFsVmFsdWUsIHNraXBTdWJzY3JpYmUpIHtcbiAgaWYgKHNraXBTdWJzY3JpYmUgPT09IHZvaWQgMCkge1xuICAgIHNraXBTdWJzY3JpYmUgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm94eU9iamVjdCA9IHZhbmlsbGEucHJveHkoe1xuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgaGlzdG9yeTogdmFuaWxsYS5yZWYoe1xuICAgICAgd2lwOiBpbml0aWFsVmFsdWUsXG4gICAgICBzbmFwc2hvdHM6IFtdLFxuICAgICAgaW5kZXg6IC0xXG4gICAgfSksXG4gICAgY2FuVW5kbzogZnVuY3Rpb24gY2FuVW5kbygpIHtcbiAgICAgIHJldHVybiBwcm94eU9iamVjdC5oaXN0b3J5LmluZGV4ID4gMDtcbiAgICB9LFxuICAgIHVuZG86IGZ1bmN0aW9uIHVuZG8oKSB7XG4gICAgICBpZiAocHJveHlPYmplY3QuY2FuVW5kbygpKSB7XG4gICAgICAgIHByb3h5T2JqZWN0LnZhbHVlID0gcHJveHlPYmplY3QuaGlzdG9yeS53aXAgPSBwcm94eU9iamVjdC5oaXN0b3J5LnNuYXBzaG90c1stLXByb3h5T2JqZWN0Lmhpc3RvcnkuaW5kZXhdO1xuICAgICAgICBwcm94eU9iamVjdC5oaXN0b3J5LnNuYXBzaG90c1twcm94eU9iamVjdC5oaXN0b3J5LmluZGV4XSA9IHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpLnZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FuUmVkbzogZnVuY3Rpb24gY2FuUmVkbygpIHtcbiAgICAgIHJldHVybiBwcm94eU9iamVjdC5oaXN0b3J5LmluZGV4IDwgcHJveHlPYmplY3QuaGlzdG9yeS5zbmFwc2hvdHMubGVuZ3RoIC0gMTtcbiAgICB9LFxuICAgIHJlZG86IGZ1bmN0aW9uIHJlZG8oKSB7XG4gICAgICBpZiAocHJveHlPYmplY3QuY2FuUmVkbygpKSB7XG4gICAgICAgIHByb3h5T2JqZWN0LnZhbHVlID0gcHJveHlPYmplY3QuaGlzdG9yeS53aXAgPSBwcm94eU9iamVjdC5oaXN0b3J5LnNuYXBzaG90c1srK3Byb3h5T2JqZWN0Lmhpc3RvcnkuaW5kZXhdO1xuICAgICAgICBwcm94eU9iamVjdC5oaXN0b3J5LnNuYXBzaG90c1twcm94eU9iamVjdC5oaXN0b3J5LmluZGV4XSA9IHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpLnZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2F2ZUhpc3Rvcnk6IGZ1bmN0aW9uIHNhdmVIaXN0b3J5KCkge1xuICAgICAgcHJveHlPYmplY3QuaGlzdG9yeS5zbmFwc2hvdHMuc3BsaWNlKHByb3h5T2JqZWN0Lmhpc3RvcnkuaW5kZXggKyAxKTtcbiAgICAgIHByb3h5T2JqZWN0Lmhpc3Rvcnkuc25hcHNob3RzLnB1c2godmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkudmFsdWUpO1xuICAgICAgKytwcm94eU9iamVjdC5oaXN0b3J5LmluZGV4O1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiBzdWJzY3JpYmUoKSB7XG4gICAgICByZXR1cm4gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGZ1bmN0aW9uIChvcHMpIHtcbiAgICAgICAgaWYgKG9wcy5zb21lKGZ1bmN0aW9uIChvcCkge1xuICAgICAgICAgIHJldHVybiBvcFsxXVswXSA9PT0gJ3ZhbHVlJyAmJiAob3BbMF0gIT09ICdzZXQnIHx8IG9wWzJdICE9PSBwcm94eU9iamVjdC5oaXN0b3J5LndpcCk7XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgcHJveHlPYmplY3Quc2F2ZUhpc3RvcnkoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcHJveHlPYmplY3Quc2F2ZUhpc3RvcnkoKTtcblxuICBpZiAoIXNraXBTdWJzY3JpYmUpIHtcbiAgICBwcm94eU9iamVjdC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHJldHVybiBwcm94eU9iamVjdDtcbn07XG5cbmV4cG9ydHMuYWRkQ29tcHV0ZWQgPSBhZGRDb21wdXRlZF9ERVBSRUNBVEVEO1xuZXhwb3J0cy5kZXJpdmUgPSBkZXJpdmU7XG5leHBvcnRzLmRldnRvb2xzID0gZGV2dG9vbHM7XG5leHBvcnRzLnByb3h5V2l0aENvbXB1dGVkID0gcHJveHlXaXRoQ29tcHV0ZWQ7XG5leHBvcnRzLnByb3h5V2l0aEhpc3RvcnkgPSBwcm94eVdpdGhIaXN0b3J5O1xuZXhwb3J0cy5zdWJzY3JpYmVLZXkgPSBzdWJzY3JpYmVLZXk7XG5leHBvcnRzLnVuZGVyaXZlID0gdW5kZXJpdmU7XG5leHBvcnRzLnVuc3RhYmxlX2dldERlcml2ZVN1YnNjcmlwdGlvbnMgPSB1bnN0YWJsZV9nZXREZXJpdmVTdWJzY3JpcHRpb25zO1xuZXhwb3J0cy53YXRjaCA9IHdhdGNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgcHJveHlDb21wYXJlID0gcmVxdWlyZSgncHJveHktY29tcGFyZScpO1xuXG52YXIgVkVSU0lPTiA9IFN5bWJvbCgpO1xudmFyIExJU1RFTkVSUyA9IFN5bWJvbCgpO1xudmFyIFNOQVBTSE9UID0gU3ltYm9sKCk7XG52YXIgUFJPTUlTRV9SRVNVTFQgPSBTeW1ib2woKTtcbnZhciBQUk9NSVNFX0VSUk9SID0gU3ltYm9sKCk7XG52YXIgcmVmU2V0ID0gbmV3IFdlYWtTZXQoKTtcbnZhciByZWYgPSBmdW5jdGlvbiByZWYobykge1xuICByZWZTZXQuYWRkKG8pO1xuICByZXR1cm4gbztcbn07XG5cbnZhciBpc1N1cHBvcnRlZE9iamVjdCA9IGZ1bmN0aW9uIGlzU3VwcG9ydGVkT2JqZWN0KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsICYmIChBcnJheS5pc0FycmF5KHgpIHx8ICF4W1N5bWJvbC5pdGVyYXRvcl0pICYmICEoeCBpbnN0YW5jZW9mIFdlYWtNYXApICYmICEoeCBpbnN0YW5jZW9mIFdlYWtTZXQpICYmICEoeCBpbnN0YW5jZW9mIEVycm9yKSAmJiAhKHggaW5zdGFuY2VvZiBOdW1iZXIpICYmICEoeCBpbnN0YW5jZW9mIERhdGUpICYmICEoeCBpbnN0YW5jZW9mIFN0cmluZykgJiYgISh4IGluc3RhbmNlb2YgUmVnRXhwKSAmJiAhKHggaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG59O1xuXG52YXIgcHJveHlDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG52YXIgZ2xvYmFsVmVyc2lvbiA9IDE7XG52YXIgc25hcHNob3RDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG52YXIgcHJveHkgPSBmdW5jdGlvbiBwcm94eShpbml0aWFsT2JqZWN0KSB7XG4gIGlmIChpbml0aWFsT2JqZWN0ID09PSB2b2lkIDApIHtcbiAgICBpbml0aWFsT2JqZWN0ID0ge307XG4gIH1cblxuICBpZiAoIWlzU3VwcG9ydGVkT2JqZWN0KGluaXRpYWxPYmplY3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBvYmplY3QgdHlwZScpO1xuICB9XG5cbiAgdmFyIGZvdW5kID0gcHJveHlDYWNoZS5nZXQoaW5pdGlhbE9iamVjdCk7XG5cbiAgaWYgKGZvdW5kKSB7XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgdmFyIHZlcnNpb24gPSBnbG9iYWxWZXJzaW9uO1xuICB2YXIgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG4gIHZhciBub3RpZnlVcGRhdGUgPSBmdW5jdGlvbiBub3RpZnlVcGRhdGUob3AsIG5leHRWZXJzaW9uKSB7XG4gICAgaWYgKCFuZXh0VmVyc2lvbikge1xuICAgICAgbmV4dFZlcnNpb24gPSArK2dsb2JhbFZlcnNpb247XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gIT09IG5leHRWZXJzaW9uKSB7XG4gICAgICB2ZXJzaW9uID0gbmV4dFZlcnNpb247XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyKG9wLCBuZXh0VmVyc2lvbik7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHByb3BMaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5cbiAgdmFyIGdldFByb3BMaXN0ZW5lciA9IGZ1bmN0aW9uIGdldFByb3BMaXN0ZW5lcihwcm9wKSB7XG4gICAgdmFyIHByb3BMaXN0ZW5lciA9IHByb3BMaXN0ZW5lcnMuZ2V0KHByb3ApO1xuXG4gICAgaWYgKCFwcm9wTGlzdGVuZXIpIHtcbiAgICAgIHByb3BMaXN0ZW5lciA9IGZ1bmN0aW9uIHByb3BMaXN0ZW5lcihvcCwgbmV4dFZlcnNpb24pIHtcbiAgICAgICAgdmFyIG5ld09wID0gW10uY29uY2F0KG9wKTtcbiAgICAgICAgbmV3T3BbMV0gPSBbcHJvcF0uY29uY2F0KG5ld09wWzFdKTtcbiAgICAgICAgbm90aWZ5VXBkYXRlKG5ld09wLCBuZXh0VmVyc2lvbik7XG4gICAgICB9O1xuXG4gICAgICBwcm9wTGlzdGVuZXJzLnNldChwcm9wLCBwcm9wTGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9wTGlzdGVuZXI7XG4gIH07XG5cbiAgdmFyIHBvcFByb3BMaXN0ZW5lciA9IGZ1bmN0aW9uIHBvcFByb3BMaXN0ZW5lcihwcm9wKSB7XG4gICAgdmFyIHByb3BMaXN0ZW5lciA9IHByb3BMaXN0ZW5lcnMuZ2V0KHByb3ApO1xuICAgIHByb3BMaXN0ZW5lcnMuZGVsZXRlKHByb3ApO1xuICAgIHJldHVybiBwcm9wTGlzdGVuZXI7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVNuYXBzaG90ID0gZnVuY3Rpb24gY3JlYXRlU25hcHNob3QodGFyZ2V0LCByZWNlaXZlcikge1xuICAgIHZhciBjYWNoZSA9IHNuYXBzaG90Q2FjaGUuZ2V0KHJlY2VpdmVyKTtcblxuICAgIGlmICgoY2FjaGUgPT0gbnVsbCA/IHZvaWQgMCA6IGNhY2hlWzBdKSA9PT0gdmVyc2lvbikge1xuICAgICAgcmV0dXJuIGNhY2hlWzFdO1xuICAgIH1cblxuICAgIHZhciBzbmFwc2hvdCA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSA/IFtdIDogT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSk7XG4gICAgcHJveHlDb21wYXJlLm1hcmtUb1RyYWNrKHNuYXBzaG90LCB0cnVlKTtcbiAgICBzbmFwc2hvdENhY2hlLnNldChyZWNlaXZlciwgW3ZlcnNpb24sIHNuYXBzaG90XSk7XG4gICAgUmVmbGVjdC5vd25LZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgdmFsdWUgPSB0YXJnZXRba2V5XTtcblxuICAgICAgaWYgKHJlZlNldC5oYXModmFsdWUpKSB7XG4gICAgICAgIHByb3h5Q29tcGFyZS5tYXJrVG9UcmFjayh2YWx1ZSwgZmFsc2UpO1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCFpc1N1cHBvcnRlZE9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgaWYgKFBST01JU0VfUkVTVUxUIGluIHZhbHVlKSB7XG4gICAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlW1BST01JU0VfUkVTVUxUXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZXJyb3JPclByb21pc2UgPSB2YWx1ZVtQUk9NSVNFX0VSUk9SXSB8fCB2YWx1ZTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc25hcHNob3QsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgIGlmIChQUk9NSVNFX1JFU1VMVCBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVtQUk9NSVNFX1JFU1VMVF07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aHJvdyBlcnJvck9yUHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZVtWRVJTSU9OXSkge1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWVbU05BUFNIT1RdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5mcmVlemUoc25hcHNob3QpO1xuICAgIHJldHVybiBzbmFwc2hvdDtcbiAgfTtcblxuICB2YXIgYmFzZU9iamVjdCA9IEFycmF5LmlzQXJyYXkoaW5pdGlhbE9iamVjdCkgPyBbXSA6IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKGluaXRpYWxPYmplY3QpKTtcbiAgdmFyIHByb3h5T2JqZWN0ID0gbmV3IFByb3h5KGJhc2VPYmplY3QsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICBpZiAocHJvcCA9PT0gVkVSU0lPTikge1xuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3AgPT09IExJU1RFTkVSUykge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcCA9PT0gU05BUFNIT1QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVNuYXBzaG90KHRhcmdldCwgcmVjZWl2ZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgIH0sXG4gICAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCkge1xuICAgICAgdmFyIHByZXZWYWx1ZSA9IHRhcmdldFtwcm9wXTtcbiAgICAgIHZhciBjaGlsZExpc3RlbmVycyA9IHByZXZWYWx1ZSA9PSBudWxsID8gdm9pZCAwIDogcHJldlZhbHVlW0xJU1RFTkVSU107XG5cbiAgICAgIGlmIChjaGlsZExpc3RlbmVycykge1xuICAgICAgICBjaGlsZExpc3RlbmVycy5kZWxldGUocG9wUHJvcExpc3RlbmVyKHByb3ApKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlbGV0ZWQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCk7XG5cbiAgICAgIGlmIChkZWxldGVkKSB7XG4gICAgICAgIG5vdGlmeVVwZGF0ZShbJ2RlbGV0ZScsIFtwcm9wXSwgcHJldlZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWxldGVkO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgdmFyIF9PYmplY3QkZ2V0T3duUHJvcGVydDtcblxuICAgICAgdmFyIHByZXZWYWx1ZSA9IHRhcmdldFtwcm9wXTtcblxuICAgICAgaWYgKE9iamVjdC5pcyhwcmV2VmFsdWUsIHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoaWxkTGlzdGVuZXJzID0gcHJldlZhbHVlID09IG51bGwgPyB2b2lkIDAgOiBwcmV2VmFsdWVbTElTVEVORVJTXTtcblxuICAgICAgaWYgKGNoaWxkTGlzdGVuZXJzKSB7XG4gICAgICAgIGNoaWxkTGlzdGVuZXJzLmRlbGV0ZShwb3BQcm9wTGlzdGVuZXIocHJvcCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVmU2V0Lmhhcyh2YWx1ZSkgfHwgIWlzU3VwcG9ydGVkT2JqZWN0KHZhbHVlKSB8fCAoX09iamVjdCRnZXRPd25Qcm9wZXJ0ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3ApKSAhPSBudWxsICYmIF9PYmplY3QkZ2V0T3duUHJvcGVydC5zZXQpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZS50aGVuKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgdGFyZ2V0W3Byb3BdW1BST01JU0VfUkVTVUxUXSA9IHY7XG4gICAgICAgICAgbm90aWZ5VXBkYXRlKFsncmVzb2x2ZScsIFtwcm9wXSwgdl0pO1xuICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHRhcmdldFtwcm9wXVtQUk9NSVNFX0VSUk9SXSA9IGU7XG4gICAgICAgICAgbm90aWZ5VXBkYXRlKFsncmVqZWN0JywgW3Byb3BdLCBlXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBwcm94eUNvbXBhcmUuZ2V0VW50cmFja2VkKHZhbHVlKSB8fCB2YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWVbTElTVEVORVJTXSkge1xuICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHByb3h5KHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFtwcm9wXVtMSVNURU5FUlNdLmFkZChnZXRQcm9wTGlzdGVuZXIocHJvcCkpO1xuICAgICAgfVxuXG4gICAgICBub3RpZnlVcGRhdGUoWydzZXQnLCBbcHJvcF0sIHZhbHVlLCBwcmV2VmFsdWVdKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHByb3h5Q2FjaGUuc2V0KGluaXRpYWxPYmplY3QsIHByb3h5T2JqZWN0KTtcbiAgUmVmbGVjdC5vd25LZXlzKGluaXRpYWxPYmplY3QpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbml0aWFsT2JqZWN0LCBrZXkpO1xuXG4gICAgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYmFzZU9iamVjdCwga2V5LCBkZXNjKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJveHlPYmplY3Rba2V5XSA9IGluaXRpYWxPYmplY3Rba2V5XTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcHJveHlPYmplY3Q7XG59O1xudmFyIGdldFZlcnNpb24gPSBmdW5jdGlvbiBnZXRWZXJzaW9uKHByb3h5T2JqZWN0KSB7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhKHByb3h5T2JqZWN0ICE9IG51bGwgJiYgcHJveHlPYmplY3RbVkVSU0lPTl0pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdXNlIHByb3h5IG9iamVjdCcpO1xuICB9XG5cbiAgcmV0dXJuIHByb3h5T2JqZWN0W1ZFUlNJT05dO1xufTtcbnZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUocHJveHlPYmplY3QsIGNhbGxiYWNrLCBub3RpZnlJblN5bmMpIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICEocHJveHlPYmplY3QgIT0gbnVsbCAmJiBwcm94eU9iamVjdFtMSVNURU5FUlNdKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHVzZSBwcm94eSBvYmplY3QnKTtcbiAgfVxuXG4gIHZhciBwZW5kaW5nVmVyc2lvbiA9IDA7XG4gIHZhciBvcHMgPSBbXTtcblxuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihvcCwgbmV4dFZlcnNpb24pIHtcbiAgICBvcHMucHVzaChvcCk7XG5cbiAgICBpZiAobm90aWZ5SW5TeW5jKSB7XG4gICAgICBjYWxsYmFjayhvcHMuc3BsaWNlKDApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwZW5kaW5nVmVyc2lvbiA9IG5leHRWZXJzaW9uO1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKG5leHRWZXJzaW9uID09PSBwZW5kaW5nVmVyc2lvbikge1xuICAgICAgICBjYWxsYmFjayhvcHMuc3BsaWNlKDApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBwcm94eU9iamVjdFtMSVNURU5FUlNdLmFkZChsaXN0ZW5lcik7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcHJveHlPYmplY3RbTElTVEVORVJTXS5kZWxldGUobGlzdGVuZXIpO1xuICB9O1xufTtcbnZhciBzbmFwc2hvdCA9IGZ1bmN0aW9uIHNuYXBzaG90KHByb3h5T2JqZWN0KSB7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhKHByb3h5T2JqZWN0ICE9IG51bGwgJiYgcHJveHlPYmplY3RbU05BUFNIT1RdKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHVzZSBwcm94eSBvYmplY3QnKTtcbiAgfVxuXG4gIHJldHVybiBwcm94eU9iamVjdFtTTkFQU0hPVF07XG59O1xuXG5leHBvcnRzLmdldFZlcnNpb24gPSBnZXRWZXJzaW9uO1xuZXhwb3J0cy5wcm94eSA9IHByb3h5O1xuZXhwb3J0cy5yZWYgPSByZWY7XG5leHBvcnRzLnNuYXBzaG90ID0gc25hcHNob3Q7XG5leHBvcnRzLnN1YnNjcmliZSA9IHN1YnNjcmliZTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
