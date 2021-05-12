(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

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
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
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

  it = o[Symbol.iterator]();
  return it.next.bind(it);
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
    if (atomState.p && typeof process === 'object' && process.env.NODE_ENV !== 'production') {
      console.warn('[Bug] deleting atomState with read promise', atom);
    }

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

}).call(this)}).call(this,require('_process'))

},{"_process":5,"react":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var jotai = require('jotai');

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
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
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

  it = o[Symbol.iterator]();
  return it.next.bind(it);
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
    Promise.resolve(getInitialValue()).then(setAtom);
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

},{"jotai":1,"react":10}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vanilla = require('valtio/vanilla');
var jotai = require('jotai');

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

},{"jotai":1,"valtio/vanilla":16}],4:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e||self).proxyCompare={})}(this,function(e){function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var r=Symbol(),n=Symbol(),o=Symbol(),i=Object.getPrototypeOf,u=new WeakMap,a=function(e){return e&&(u.has(e)?u.get(e):i(e)===Object.prototype||i(e)===Array.prototype)},f=function(e){return"object"==typeof e&&null!==e},c=function(e,t,u){if(!a(e))return e;var f=e[o]||e,s=function(e){return Object.isFrozen(e)||Object.values(Object.getOwnPropertyDescriptors(e)).some(function(e){return!e.writable})}(f),l=u&&u.get(f);return l&&l.f===s||((l=function(e,t){var i,u=!1,a=function(t,r){if(!u){var n=t.a.get(e);n||(n=new Set,t.a.set(e,n)),n.add(r)}},f=((i={}).f=t,i.get=function(t,r){return r===o?e:(a(this,r),c(t[r],this.a,this.c))},i.has=function(t,r){return r===n?(u=!0,this.a.delete(e),!0):(a(this,r),r in t)},i.ownKeys=function(e){return a(this,r),Reflect.ownKeys(e)},i);return t&&(f.set=f.deleteProperty=function(){return!1}),f}(f,s)).p=new Proxy(s?function(e){if(Array.isArray(e))return Array.from(e);var t=Object.getOwnPropertyDescriptors(e);return Object.values(t).forEach(function(e){e.configurable=!0}),Object.create(i(e),t)}(f):f,l),u&&u.set(f,l)),l.a=t,l.c=u,l.p},s=function(e,t){var r=Reflect.ownKeys(e),n=Reflect.ownKeys(t);return r.length!==n.length||r.some(function(e,t){return e!==n[t]})};e.MODE_ASSUME_UNCHANGED_IF_UNAFFECTED=1,e.MODE_ASSUME_UNCHANGED_IF_UNAFFECTED_IN_DEEP=4,e.MODE_IGNORE_REF_EQUALITY=2,e.MODE_IGNORE_REF_EQUALITY_IN_DEEP=8,e.affectedToPathList=function(e,t){var r=[];return function e(n,o){var i=t.get(n);i?i.forEach(function(t){e(n[t],o?[].concat(o,[t]):[t])}):o&&r.push(o)}(e),r},e.createDeepProxy=c,e.getUntrackedObject=function(e){return a(e)&&e[o]||null},e.isDeepChanged=function e(n,o,i,u,a){if(void 0===a&&(a=0),Object.is(n,o)&&(!f(n)||0==(2&a)))return!1;if(!f(n)||!f(o))return!0;var c=i.get(n);if(!c)return 0==(1&a);if(u&&0==(2&a)){var l,y=u.get(n);if(y&&y.n===o)return y.g;u.set(n,((l={}).n=o,l.g=!1,l))}for(var p,b,d=null,g=function(e,r){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,r){if(e){if("string"==typeof e)return t(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?t(e,r):void 0}}(e))){n&&(e=n);var o=0;return function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}(c);!(p=g()).done;){var v=p.value,E=v===r?s(n,o):e(n[v],o[v],i,u,a>>>2<<2|a>>>2);if(!0!==E&&!1!==E||(d=E),d)break}return null===d&&(d=0==(1&a)),u&&0==(2&a)&&u.set(n,((b={}).n=o,b.g=d,b)),d},e.markToTrack=function(e,t){void 0===t&&(t=!0),u.set(e,t)},e.trackMemo=function(e){return!!a(e)&&n in e}});


},{}],7:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("object-assign"),t=require("react"),n=require("scheduler");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var l=r(e),i=r(t),u=r(n);var a,o,c=(function(e){
/** @license React v0.25.1
 * react-reconciler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
e.exports=function t(n){var r=l.default,a=i.default,o=u.default;function c(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var f=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;f.hasOwnProperty("ReactCurrentDispatcher")||(f.ReactCurrentDispatcher={current:null}),f.hasOwnProperty("ReactCurrentBatchConfig")||(f.ReactCurrentBatchConfig={suspense:null});var s="function"==typeof Symbol&&Symbol.for,d=s?Symbol.for("react.element"):60103,p=s?Symbol.for("react.portal"):60106,m=s?Symbol.for("react.fragment"):60107,h=s?Symbol.for("react.strict_mode"):60108,g=s?Symbol.for("react.profiler"):60114,b=s?Symbol.for("react.provider"):60109,v=s?Symbol.for("react.context"):60110,y=s?Symbol.for("react.concurrent_mode"):60111,T=s?Symbol.for("react.forward_ref"):60112,x=s?Symbol.for("react.suspense"):60113,E=s?Symbol.for("react.suspense_list"):60120,S=s?Symbol.for("react.memo"):60115,k=s?Symbol.for("react.lazy"):60116,w=s?Symbol.for("react.block"):60121,z="function"==typeof Symbol&&Symbol.iterator;function C(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=z&&e[z]||e["@@iterator"])?e:null}function P(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case m:return"Fragment";case p:return"Portal";case g:return"Profiler";case h:return"StrictMode";case x:return"Suspense";case E:return"SuspenseList"}if("object"==typeof e)switch(e.$$typeof){case v:return"Context.Consumer";case b:return"Context.Provider";case T:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case S:return P(e.type);case w:return P(e.render);case k:if(e=1===e._status?e._result:null)return P(e)}return null}function N(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do{0!=(1026&(t=e).effectTag)&&(n=t.return),e=t.return}while(e)}return 3===t.tag?n:null}function _(e){if(N(e)!==e)throw Error(c(188))}function I(e){var t=e.alternate;if(!t){if(null===(t=N(e)))throw Error(c(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(null===l)break;var i=l.alternate;if(null===i){if(null!==(r=l.return)){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return _(l),e;if(i===r)return _(l),t;i=i.sibling}throw Error(c(188))}if(n.return!==r.return)n=l,r=i;else{for(var u=!1,a=l.child;a;){if(a===n){u=!0,n=l,r=i;break}if(a===r){u=!0,r=l,n=i;break}a=a.sibling}if(!u){for(a=i.child;a;){if(a===n){u=!0,n=i,r=l;break}if(a===r){u=!0,r=i,n=l;break}a=a.sibling}if(!u)throw Error(c(189))}}if(n.alternate!==r)throw Error(c(190))}if(3!==n.tag)throw Error(c(188));return n.stateNode.current===n?e:t}function R(e){if(!(e=I(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}var M=n.getPublicInstance,Q=n.getRootHostContext,U=n.getChildHostContext,D=n.prepareForCommit,F=n.resetAfterCommit,W=n.createInstance,H=n.appendInitialChild,j=n.finalizeInitialChildren,A=n.prepareUpdate,B=n.shouldSetTextContent,O=n.shouldDeprioritizeSubtree,L=n.createTextInstance,q=n.setTimeout,V=n.clearTimeout,$=n.noTimeout,K=n.isPrimaryRenderer,G=n.supportsMutation,Y=n.supportsPersistence,J=n.supportsHydration,X=n.appendChild,Z=n.appendChildToContainer,ee=n.commitTextUpdate,te=n.commitMount,ne=n.commitUpdate,re=n.insertBefore,le=n.insertInContainerBefore,ie=n.removeChild,ue=n.removeChildFromContainer,ae=n.resetTextContent,oe=n.hideInstance,ce=n.hideTextInstance,fe=n.unhideInstance,se=n.unhideTextInstance,de=n.cloneInstance,pe=n.createContainerChildSet,me=n.appendChildToContainerChildSet,he=n.finalizeContainerChildren,ge=n.replaceContainerChildren,be=n.cloneHiddenInstance,ve=n.cloneHiddenTextInstance,ye=n.canHydrateInstance,Te=n.canHydrateTextInstance,xe=n.isSuspenseInstancePending,Ee=n.isSuspenseInstanceFallback,Se=n.getNextHydratableSibling,ke=n.getFirstHydratableChild,we=n.hydrateInstance,ze=n.hydrateTextInstance,Ce=n.getNextHydratableInstanceAfterSuspenseInstance,Pe=n.commitHydratedContainer,Ne=n.commitHydratedSuspenseInstance,_e=/^(.*)[\\\/]/;function Ie(e){var t="";do{e:switch(e.tag){case 3:case 4:case 6:case 7:case 10:case 9:var n="";break e;default:var r=e._debugOwner,l=e._debugSource,i=P(e.type);n=null,r&&(n=P(r.type)),r=i,i="",l?i=" (at "+l.fileName.replace(_e,"")+":"+l.lineNumber+")":n&&(i=" (created by "+n+")"),n="\n    in "+(r||"Unknown")+i}t+=n,e=e.return}while(e);return t}var Re=[],Me=-1;function Qe(e){0>Me||(e.current=Re[Me],Re[Me]=null,Me--)}function Ue(e,t){Me++,Re[Me]=e.current,e.current=t}var De={},Fe={current:De},We={current:!1},He=De;function je(e,t){var n=e.type.contextTypes;if(!n)return De;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l,i={};for(l in n)i[l]=t[l];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function Ae(e){return null!=(e=e.childContextTypes)}function Be(){Qe(We),Qe(Fe)}function Oe(e,t,n){if(Fe.current!==De)throw Error(c(168));Ue(Fe,t),Ue(We,n)}function Le(e,t,n){var l=e.stateNode;if(e=t.childContextTypes,"function"!=typeof l.getChildContext)return n;for(var i in l=l.getChildContext())if(!(i in e))throw Error(c(108,P(t)||"Unknown",i));return r({},n,{},l)}function qe(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||De,He=Fe.current,Ue(Fe,e),Ue(We,We.current),!0}function Ve(e,t,n){var r=e.stateNode;if(!r)throw Error(c(169));n?(e=Le(e,t,He),r.__reactInternalMemoizedMergedChildContext=e,Qe(We),Qe(Fe),Ue(Fe,e)):Qe(We),Ue(We,n)}var $e=o.unstable_runWithPriority,Ke=o.unstable_scheduleCallback,Ge=o.unstable_cancelCallback,Ye=o.unstable_requestPaint,Je=o.unstable_now,Xe=o.unstable_getCurrentPriorityLevel,Ze=o.unstable_ImmediatePriority,et=o.unstable_UserBlockingPriority,tt=o.unstable_NormalPriority,nt=o.unstable_LowPriority,rt=o.unstable_IdlePriority,lt={},it=o.unstable_shouldYield,ut=void 0!==Ye?Ye:function(){},at=null,ot=null,ct=!1,ft=Je(),st=1e4>ft?Je:function(){return Je()-ft};function dt(){switch(Xe()){case Ze:return 99;case et:return 98;case tt:return 97;case nt:return 96;case rt:return 95;default:throw Error(c(332))}}function pt(e){switch(e){case 99:return Ze;case 98:return et;case 97:return tt;case 96:return nt;case 95:return rt;default:throw Error(c(332))}}function mt(e,t){return e=pt(e),$e(e,t)}function ht(e,t,n){return e=pt(e),Ke(e,t,n)}function gt(e){return null===at?(at=[e],ot=Ke(Ze,vt)):at.push(e),lt}function bt(){if(null!==ot){var e=ot;ot=null,Ge(e)}vt()}function vt(){if(!ct&&null!==at){ct=!0;var e=0;try{var t=at;mt(99,(function(){for(;e<t.length;e++){var n=t[e];do{n=n(!0)}while(null!==n)}})),at=null}catch(t){throw null!==at&&(at=at.slice(e+1)),Ke(Ze,bt),t}finally{ct=!1}}}function yt(e,t,n){return 1073741821-(1+((1073741821-e+t/10)/(n/=10)|0))*n}var Tt="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},xt=Object.prototype.hasOwnProperty;function Et(e,t){if(Tt(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!xt.call(t,n[r])||!Tt(e[n[r]],t[n[r]]))return!1;return!0}function St(e,t){if(e&&e.defaultProps)for(var n in t=r({},t),e=e.defaultProps)void 0===t[n]&&(t[n]=e[n]);return t}var kt={current:null},wt=null,zt=null,Ct=null;function Pt(){Ct=zt=wt=null}function Nt(e,t){e=e.type._context,K?(Ue(kt,e._currentValue),e._currentValue=t):(Ue(kt,e._currentValue2),e._currentValue2=t)}function _t(e){var t=kt.current;Qe(kt),e=e.type._context,K?e._currentValue=t:e._currentValue2=t}function It(e,t){for(;null!==e;){var n=e.alternate;if(e.childExpirationTime<t)e.childExpirationTime=t,null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t);else{if(!(null!==n&&n.childExpirationTime<t))break;n.childExpirationTime=t}e=e.return}}function Rt(e,t){wt=e,Ct=zt=null,null!==(e=e.dependencies)&&null!==e.firstContext&&(e.expirationTime>=t&&(ur=!0),e.firstContext=null)}function Mt(e,t){if(Ct!==e&&!1!==t&&0!==t)if("number"==typeof t&&1073741823!==t||(Ct=e,t=1073741823),t={context:e,observedBits:t,next:null},null===zt){if(null===wt)throw Error(c(308));zt=t,wt.dependencies={expirationTime:0,firstContext:t,responders:null}}else zt=zt.next=t;return K?e._currentValue:e._currentValue2}var Qt=!1;function Ut(e){e.updateQueue={baseState:e.memoizedState,baseQueue:null,shared:{pending:null},effects:null}}function Dt(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,baseQueue:e.baseQueue,shared:e.shared,effects:e.effects})}function Ft(e,t){return(e={expirationTime:e,suspenseConfig:t,tag:0,payload:null,callback:null,next:null}).next=e}function Wt(e,t){if(null!==(e=e.updateQueue)){var n=(e=e.shared).pending;null===n?t.next=t:(t.next=n.next,n.next=t),e.pending=t}}function Ht(e,t){var n=e.alternate;null!==n&&Dt(n,e),null===(n=(e=e.updateQueue).baseQueue)?(e.baseQueue=t.next=t,t.next=t):(t.next=n.next,n.next=t)}function jt(e,t,n,l){var i=e.updateQueue;Qt=!1;var u=i.baseQueue,a=i.shared.pending;if(null!==a){if(null!==u){var o=u.next;u.next=a.next,a.next=o}u=a,i.shared.pending=null,null!==(o=e.alternate)&&null!==(o=o.updateQueue)&&(o.baseQueue=a)}if(null!==u){o=u.next;var c=i.baseState,f=0,s=null,d=null,p=null;if(null!==o)for(var m=o;;){if((a=m.expirationTime)<l){var h={expirationTime:m.expirationTime,suspenseConfig:m.suspenseConfig,tag:m.tag,payload:m.payload,callback:m.callback,next:null};null===p?(d=p=h,s=c):p=p.next=h,a>f&&(f=a)}else{null!==p&&(p=p.next={expirationTime:1073741823,suspenseConfig:m.suspenseConfig,tag:m.tag,payload:m.payload,callback:m.callback,next:null}),Ll(a,m.suspenseConfig);e:{var g=e,b=m;switch(a=t,h=n,b.tag){case 1:if("function"==typeof(g=b.payload)){c=g.call(h,c,a);break e}c=g;break e;case 3:g.effectTag=-4097&g.effectTag|64;case 0:if(null==(a="function"==typeof(g=b.payload)?g.call(h,c,a):g))break e;c=r({},c,a);break e;case 2:Qt=!0}}null!==m.callback&&(e.effectTag|=32,null===(a=i.effects)?i.effects=[m]:a.push(m))}if(null===(m=m.next)||m===o){if(null===(a=i.shared.pending))break;m=u.next=a.next,a.next=o,i.baseQueue=u=a,i.shared.pending=null}}null===p?s=c:p.next=d,i.baseState=s,i.baseQueue=p,ql(f),e.expirationTime=f,e.memoizedState=c}}function At(e,t,n){if(e=t.effects,t.effects=null,null!==e)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(null!==l){if(r.callback=null,r=l,l=n,"function"!=typeof r)throw Error(c(191,r));r.call(l)}}}var Bt=f.ReactCurrentBatchConfig,Ot=(new a.Component).refs;function Lt(e,t,n,l){n=null==(n=n(l,t=e.memoizedState))?t:r({},t,n),e.memoizedState=n,0===e.expirationTime&&(e.updateQueue.baseState=n)}var qt={isMounted:function(e){return!!(e=e._reactInternalFiber)&&N(e)===e},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=Il(),l=Bt.suspense;(l=Ft(r=Rl(r,e,l),l)).payload=t,null!=n&&(l.callback=n),Wt(e,l),Ml(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=Il(),l=Bt.suspense;(l=Ft(r=Rl(r,e,l),l)).tag=1,l.payload=t,null!=n&&(l.callback=n),Wt(e,l),Ml(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=Il(),r=Bt.suspense;(r=Ft(n=Rl(n,e,r),r)).tag=2,null!=t&&(r.callback=t),Wt(e,r),Ml(e,n)}};function Vt(e,t,n,r,l,i,u){return"function"==typeof(e=e.stateNode).shouldComponentUpdate?e.shouldComponentUpdate(r,i,u):!(t.prototype&&t.prototype.isPureReactComponent&&Et(n,r)&&Et(l,i))}function $t(e,t,n){var r=!1,l=De,i=t.contextType;return"object"==typeof i&&null!==i?i=Mt(i):(l=Ae(t)?He:Fe.current,i=(r=null!=(r=t.contextTypes))?je(e,l):De),t=new t(n,i),e.memoizedState=null!==t.state&&void 0!==t.state?t.state:null,t.updater=qt,e.stateNode=t,t._reactInternalFiber=e,r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function Kt(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&qt.enqueueReplaceState(t,t.state,null)}function Gt(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs=Ot,Ut(e);var i=t.contextType;"object"==typeof i&&null!==i?l.context=Mt(i):(i=Ae(t)?He:Fe.current,l.context=je(e,i)),jt(e,n,l,r),l.state=e.memoizedState,"function"==typeof(i=t.getDerivedStateFromProps)&&(Lt(e,t,i,n),l.state=e.memoizedState),"function"==typeof t.getDerivedStateFromProps||"function"==typeof l.getSnapshotBeforeUpdate||"function"!=typeof l.UNSAFE_componentWillMount&&"function"!=typeof l.componentWillMount||(t=l.state,"function"==typeof l.componentWillMount&&l.componentWillMount(),"function"==typeof l.UNSAFE_componentWillMount&&l.UNSAFE_componentWillMount(),t!==l.state&&qt.enqueueReplaceState(l,l.state,null),jt(e,n,l,r),l.state=e.memoizedState),"function"==typeof l.componentDidMount&&(e.effectTag|=4)}var Yt=Array.isArray;function Jt(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){if(n=n._owner){if(1!==n.tag)throw Error(c(309));var r=n.stateNode}if(!r)throw Error(c(147,e));var l=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===l?t.ref:((t=function(e){var t=r.refs;t===Ot&&(t=r.refs={}),null===e?delete t[l]:t[l]=e})._stringRef=l,t)}if("string"!=typeof e)throw Error(c(284));if(!n._owner)throw Error(c(290,e))}return e}function Xt(e,t){if("textarea"!==e.type)throw Error(c(31,"[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,""))}function Zt(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function l(e,t){return(e=di(e,t)).index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=2,n):r:(t.effectTag=2,n):n}function u(t){return e&&null===t.alternate&&(t.effectTag=2),t}function a(e,t,n,r){return null===t||6!==t.tag?((t=hi(n,e.mode,r)).return=e,t):((t=l(t,n)).return=e,t)}function o(e,t,n,r){return null!==t&&t.elementType===n.type?((r=l(t,n.props)).ref=Jt(e,t,n),r.return=e,r):((r=pi(n.type,n.key,n.props,null,e.mode,r)).ref=Jt(e,t,n),r.return=e,r)}function f(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=gi(n,e.mode,r)).return=e,t):((t=l(t,n.children||[])).return=e,t)}function s(e,t,n,r,i){return null===t||7!==t.tag?((t=mi(n,e.mode,r,i)).return=e,t):((t=l(t,n)).return=e,t)}function h(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=hi(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case d:return(n=pi(t.type,t.key,t.props,null,e.mode,n)).ref=Jt(e,null,t),n.return=e,n;case p:return(t=gi(t,e.mode,n)).return=e,t}if(Yt(t)||C(t))return(t=mi(t,e.mode,n,null)).return=e,t;Xt(e,t)}return null}function g(e,t,n,r){var l=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==l?null:a(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case d:return n.key===l?n.type===m?s(e,t,n.props.children,r,l):o(e,t,n,r):null;case p:return n.key===l?f(e,t,n,r):null}if(Yt(n)||C(n))return null!==l?null:s(e,t,n,r,null);Xt(e,n)}return null}function b(e,t,n,r,l){if("string"==typeof r||"number"==typeof r)return a(t,e=e.get(n)||null,""+r,l);if("object"==typeof r&&null!==r){switch(r.$$typeof){case d:return e=e.get(null===r.key?n:r.key)||null,r.type===m?s(t,e,r.props.children,l,r.key):o(t,e,r,l);case p:return f(t,e=e.get(null===r.key?n:r.key)||null,r,l)}if(Yt(r)||C(r))return s(t,e=e.get(n)||null,r,l,null);Xt(t,r)}return null}function v(l,u,a,o){for(var c=null,f=null,s=u,d=u=0,p=null;null!==s&&d<a.length;d++){s.index>d?(p=s,s=null):p=s.sibling;var m=g(l,s,a[d],o);if(null===m){null===s&&(s=p);break}e&&s&&null===m.alternate&&t(l,s),u=i(m,u,d),null===f?c=m:f.sibling=m,f=m,s=p}if(d===a.length)return n(l,s),c;if(null===s){for(;d<a.length;d++)null!==(s=h(l,a[d],o))&&(u=i(s,u,d),null===f?c=s:f.sibling=s,f=s);return c}for(s=r(l,s);d<a.length;d++)null!==(p=b(s,l,d,a[d],o))&&(e&&null!==p.alternate&&s.delete(null===p.key?d:p.key),u=i(p,u,d),null===f?c=p:f.sibling=p,f=p);return e&&s.forEach((function(e){return t(l,e)})),c}function y(l,u,a,o){var f=C(a);if("function"!=typeof f)throw Error(c(150));if(null==(a=f.call(a)))throw Error(c(151));for(var s=f=null,d=u,p=u=0,m=null,v=a.next();null!==d&&!v.done;p++,v=a.next()){d.index>p?(m=d,d=null):m=d.sibling;var y=g(l,d,v.value,o);if(null===y){null===d&&(d=m);break}e&&d&&null===y.alternate&&t(l,d),u=i(y,u,p),null===s?f=y:s.sibling=y,s=y,d=m}if(v.done)return n(l,d),f;if(null===d){for(;!v.done;p++,v=a.next())null!==(v=h(l,v.value,o))&&(u=i(v,u,p),null===s?f=v:s.sibling=v,s=v);return f}for(d=r(l,d);!v.done;p++,v=a.next())null!==(v=b(d,l,p,v.value,o))&&(e&&null!==v.alternate&&d.delete(null===v.key?p:v.key),u=i(v,u,p),null===s?f=v:s.sibling=v,s=v);return e&&d.forEach((function(e){return t(l,e)})),f}return function(e,r,i,a){var o="object"==typeof i&&null!==i&&i.type===m&&null===i.key;o&&(i=i.props.children);var f="object"==typeof i&&null!==i;if(f)switch(i.$$typeof){case d:e:{for(f=i.key,o=r;null!==o;){if(o.key===f){switch(o.tag){case 7:if(i.type===m){n(e,o.sibling),(r=l(o,i.props.children)).return=e,e=r;break e}break;default:if(o.elementType===i.type){n(e,o.sibling),(r=l(o,i.props)).ref=Jt(e,o,i),r.return=e,e=r;break e}}n(e,o);break}t(e,o),o=o.sibling}i.type===m?((r=mi(i.props.children,e.mode,a,i.key)).return=e,e=r):((a=pi(i.type,i.key,i.props,null,e.mode,a)).ref=Jt(e,r,i),a.return=e,e=a)}return u(e);case p:e:{for(o=i.key;null!==r;){if(r.key===o){if(4===r.tag&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),(r=l(r,i.children||[])).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=gi(i,e.mode,a)).return=e,e=r}return u(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==r&&6===r.tag?(n(e,r.sibling),(r=l(r,i)).return=e,e=r):(n(e,r),(r=hi(i,e.mode,a)).return=e,e=r),u(e);if(Yt(i))return v(e,r,i,a);if(C(i))return y(e,r,i,a);if(f&&Xt(e,i),void 0===i&&!o)switch(e.tag){case 1:case 0:throw e=e.type,Error(c(152,e.displayName||e.name||"Component"))}return n(e,r)}}var en=Zt(!0),tn=Zt(!1),nn={},rn={current:nn},ln={current:nn},un={current:nn};function an(e){if(e===nn)throw Error(c(174));return e}function on(e,t){Ue(un,t),Ue(ln,e),Ue(rn,nn),e=Q(t),Qe(rn),Ue(rn,e)}function cn(){Qe(rn),Qe(ln),Qe(un)}function fn(e){var t=an(un.current),n=an(rn.current);n!==(t=U(n,e.type,t))&&(Ue(ln,e),Ue(rn,t))}function sn(e){ln.current===e&&(Qe(rn),Qe(ln))}var dn={current:0};function pn(e){for(var t=e;null!==t;){if(13===t.tag){var n=t.memoizedState;if(null!==n&&(null===(n=n.dehydrated)||xe(n)||Ee(n)))return t}else if(19===t.tag&&void 0!==t.memoizedProps.revealOrder){if(0!=(64&t.effectTag))return t}else if(null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}function mn(e,t){return{responder:e,props:t}}var hn=f.ReactCurrentDispatcher,gn=f.ReactCurrentBatchConfig,bn=0,vn=null,yn=null,Tn=null,xn=!1;function En(){throw Error(c(321))}function Sn(e,t){if(null===t)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Tt(e[n],t[n]))return!1;return!0}function kn(e,t,n,r,l,i){if(bn=i,vn=t,t.memoizedState=null,t.updateQueue=null,t.expirationTime=0,hn.current=null===e||null===e.memoizedState?$n:Kn,e=n(r,l),t.expirationTime===bn){i=0;do{if(t.expirationTime=0,!(25>i))throw Error(c(301));i+=1,Tn=yn=null,t.updateQueue=null,hn.current=Gn,e=n(r,l)}while(t.expirationTime===bn)}if(hn.current=Vn,t=null!==yn&&null!==yn.next,bn=0,Tn=yn=vn=null,xn=!1,t)throw Error(c(300));return e}function wn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return null===Tn?vn.memoizedState=Tn=e:Tn=Tn.next=e,Tn}function zn(){if(null===yn){var e=vn.alternate;e=null!==e?e.memoizedState:null}else e=yn.next;var t=null===Tn?vn.memoizedState:Tn.next;if(null!==t)Tn=t,yn=e;else{if(null===e)throw Error(c(310));e={memoizedState:(yn=e).memoizedState,baseState:yn.baseState,baseQueue:yn.baseQueue,queue:yn.queue,next:null},null===Tn?vn.memoizedState=Tn=e:Tn=Tn.next=e}return Tn}function Cn(e,t){return"function"==typeof t?t(e):t}function Pn(e){var t=zn(),n=t.queue;if(null===n)throw Error(c(311));n.lastRenderedReducer=e;var r=yn,l=r.baseQueue,i=n.pending;if(null!==i){if(null!==l){var u=l.next;l.next=i.next,i.next=u}r.baseQueue=l=i,n.pending=null}if(null!==l){l=l.next,r=r.baseState;var a=u=i=null,o=l;do{var f=o.expirationTime;if(f<bn){var s={expirationTime:o.expirationTime,suspenseConfig:o.suspenseConfig,action:o.action,eagerReducer:o.eagerReducer,eagerState:o.eagerState,next:null};null===a?(u=a=s,i=r):a=a.next=s,f>vn.expirationTime&&(vn.expirationTime=f,ql(f))}else null!==a&&(a=a.next={expirationTime:1073741823,suspenseConfig:o.suspenseConfig,action:o.action,eagerReducer:o.eagerReducer,eagerState:o.eagerState,next:null}),Ll(f,o.suspenseConfig),r=o.eagerReducer===e?o.eagerState:e(r,o.action);o=o.next}while(null!==o&&o!==l);null===a?i=r:a.next=u,Tt(r,t.memoizedState)||(ur=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=a,n.lastRenderedState=r}return[t.memoizedState,n.dispatch]}function Nn(e){var t=zn(),n=t.queue;if(null===n)throw Error(c(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(null!==l){n.pending=null;var u=l=l.next;do{i=e(i,u.action),u=u.next}while(u!==l);Tt(i,t.memoizedState)||(ur=!0),t.memoizedState=i,null===t.baseQueue&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function _n(e){var t=wn();return"function"==typeof e&&(e=e()),t.memoizedState=t.baseState=e,e=(e=t.queue={pending:null,dispatch:null,lastRenderedReducer:Cn,lastRenderedState:e}).dispatch=qn.bind(null,vn,e),[t.memoizedState,e]}function In(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},null===(t=vn.updateQueue)?(t={lastEffect:null},vn.updateQueue=t,t.lastEffect=e.next=e):null===(n=t.lastEffect)?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function Rn(){return zn().memoizedState}function Mn(e,t,n,r){var l=wn();vn.effectTag|=e,l.memoizedState=In(1|t,n,void 0,void 0===r?null:r)}function Qn(e,t,n,r){var l=zn();r=void 0===r?null:r;var i=void 0;if(null!==yn){var u=yn.memoizedState;if(i=u.destroy,null!==r&&Sn(r,u.deps))return void In(t,n,i,r)}vn.effectTag|=e,l.memoizedState=In(1|t,n,i,r)}function Un(e,t){return Mn(516,4,e,t)}function Dn(e,t){return Qn(516,4,e,t)}function Fn(e,t){return Qn(4,2,e,t)}function Wn(e,t){return"function"==typeof t?(e=e(),t(e),function(){t(null)}):null!=t?(e=e(),t.current=e,function(){t.current=null}):void 0}function Hn(e,t,n){return n=null!=n?n.concat([e]):null,Qn(4,2,Wn.bind(null,t,e),n)}function jn(){}function An(e,t){return wn().memoizedState=[e,void 0===t?null:t],e}function Bn(e,t){var n=zn();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&Sn(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function On(e,t){var n=zn();t=void 0===t?null:t;var r=n.memoizedState;return null!==r&&null!==t&&Sn(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ln(e,t,n){var r=dt();mt(98>r?98:r,(function(){e(!0)})),mt(97<r?97:r,(function(){var r=gn.suspense;gn.suspense=void 0===t?null:t;try{e(!1),n()}finally{gn.suspense=r}}))}function qn(e,t,n){var r=Il(),l=Bt.suspense;l={expirationTime:r=Rl(r,e,l),suspenseConfig:l,action:n,eagerReducer:null,eagerState:null,next:null};var i=t.pending;if(null===i?l.next=l:(l.next=i.next,i.next=l),t.pending=l,i=e.alternate,e===vn||null!==i&&i===vn)xn=!0,l.expirationTime=bn,vn.expirationTime=bn;else{if(0===e.expirationTime&&(null===i||0===i.expirationTime)&&null!==(i=t.lastRenderedReducer))try{var u=t.lastRenderedState,a=i(u,n);if(l.eagerReducer=i,l.eagerState=a,Tt(a,u))return}catch(e){}Ml(e,r)}}var Vn={readContext:Mt,useCallback:En,useContext:En,useEffect:En,useImperativeHandle:En,useLayoutEffect:En,useMemo:En,useReducer:En,useRef:En,useState:En,useDebugValue:En,useResponder:En,useDeferredValue:En,useTransition:En},$n={readContext:Mt,useCallback:An,useContext:Mt,useEffect:Un,useImperativeHandle:function(e,t,n){return n=null!=n?n.concat([e]):null,Mn(4,2,Wn.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Mn(4,2,e,t)},useMemo:function(e,t){var n=wn();return t=void 0===t?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=wn();return t=void 0!==n?n(t):t,r.memoizedState=r.baseState=t,e=(e=r.queue={pending:null,dispatch:null,lastRenderedReducer:e,lastRenderedState:t}).dispatch=qn.bind(null,vn,e),[r.memoizedState,e]},useRef:function(e){return e={current:e},wn().memoizedState=e},useState:_n,useDebugValue:jn,useResponder:mn,useDeferredValue:function(e,t){var n=_n(e),r=n[0],l=n[1];return Un((function(){var n=gn.suspense;gn.suspense=void 0===t?null:t;try{l(e)}finally{gn.suspense=n}}),[e,t]),r},useTransition:function(e){var t=_n(!1),n=t[0];return t=t[1],[An(Ln.bind(null,t,e),[t,e]),n]}},Kn={readContext:Mt,useCallback:Bn,useContext:Mt,useEffect:Dn,useImperativeHandle:Hn,useLayoutEffect:Fn,useMemo:On,useReducer:Pn,useRef:Rn,useState:function(){return Pn(Cn)},useDebugValue:jn,useResponder:mn,useDeferredValue:function(e,t){var n=Pn(Cn),r=n[0],l=n[1];return Dn((function(){var n=gn.suspense;gn.suspense=void 0===t?null:t;try{l(e)}finally{gn.suspense=n}}),[e,t]),r},useTransition:function(e){var t=Pn(Cn),n=t[0];return t=t[1],[Bn(Ln.bind(null,t,e),[t,e]),n]}},Gn={readContext:Mt,useCallback:Bn,useContext:Mt,useEffect:Dn,useImperativeHandle:Hn,useLayoutEffect:Fn,useMemo:On,useReducer:Nn,useRef:Rn,useState:function(){return Nn(Cn)},useDebugValue:jn,useResponder:mn,useDeferredValue:function(e,t){var n=Nn(Cn),r=n[0],l=n[1];return Dn((function(){var n=gn.suspense;gn.suspense=void 0===t?null:t;try{l(e)}finally{gn.suspense=n}}),[e,t]),r},useTransition:function(e){var t=Nn(Cn),n=t[0];return t=t[1],[Bn(Ln.bind(null,t,e),[t,e]),n]}},Yn=null,Jn=null,Xn=!1;function Zn(e,t){var n=fi(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function er(e,t){switch(e.tag){case 5:return null!==(t=ye(t,e.type,e.pendingProps))&&(e.stateNode=t,!0);case 6:return null!==(t=Te(t,e.pendingProps))&&(e.stateNode=t,!0);case 13:default:return!1}}function tr(e){if(Xn){var t=Jn;if(t){var n=t;if(!er(e,t)){if(!(t=Se(n))||!er(e,t))return e.effectTag=-1025&e.effectTag|2,Xn=!1,void(Yn=e);Zn(Yn,n)}Yn=e,Jn=ke(t)}else e.effectTag=-1025&e.effectTag|2,Xn=!1,Yn=e}}function nr(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag&&13!==e.tag;)e=e.return;Yn=e}function rr(e){if(!J||e!==Yn)return!1;if(!Xn)return nr(e),Xn=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!B(t,e.memoizedProps))for(t=Jn;t;)Zn(e,t),t=Se(t);if(nr(e),13===e.tag){if(!J)throw Error(c(316));if(!(e=null!==(e=e.memoizedState)?e.dehydrated:null))throw Error(c(317));Jn=Ce(e)}else Jn=Yn?Se(e.stateNode):null;return!0}function lr(){J&&(Jn=Yn=null,Xn=!1)}var ir=f.ReactCurrentOwner,ur=!1;function ar(e,t,n,r){t.child=null===e?tn(t,null,n,r):en(t,e.child,n,r)}function or(e,t,n,r,l){n=n.render;var i=t.ref;return Rt(t,l),r=kn(e,t,n,r,i,l),null===e||ur?(t.effectTag|=1,ar(e,t,r,l),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=l&&(e.expirationTime=0),wr(e,t,l))}function cr(e,t,n,r,l,i){if(null===e){var u=n.type;return"function"!=typeof u||si(u)||void 0!==u.defaultProps||null!==n.compare||void 0!==n.defaultProps?((e=pi(n.type,null,r,null,t.mode,i)).ref=t.ref,e.return=t,t.child=e):(t.tag=15,t.type=u,fr(e,t,u,r,l,i))}return u=e.child,l<i&&(l=u.memoizedProps,(n=null!==(n=n.compare)?n:Et)(l,r)&&e.ref===t.ref)?wr(e,t,i):(t.effectTag|=1,(e=di(u,r)).ref=t.ref,e.return=t,t.child=e)}function fr(e,t,n,r,l,i){return null!==e&&Et(e.memoizedProps,r)&&e.ref===t.ref&&(ur=!1,l<i)?(t.expirationTime=e.expirationTime,wr(e,t,i)):dr(e,t,n,r,i)}function sr(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function dr(e,t,n,r,l){var i=Ae(n)?He:Fe.current;return i=je(t,i),Rt(t,l),n=kn(e,t,n,r,i,l),null===e||ur?(t.effectTag|=1,ar(e,t,n,l),t.child):(t.updateQueue=e.updateQueue,t.effectTag&=-517,e.expirationTime<=l&&(e.expirationTime=0),wr(e,t,l))}function pr(e,t,n,r,l){if(Ae(n)){var i=!0;qe(t)}else i=!1;if(Rt(t,l),null===t.stateNode)null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),$t(t,n,r),Gt(t,n,r,l),r=!0;else if(null===e){var u=t.stateNode,a=t.memoizedProps;u.props=a;var o=u.context,c=n.contextType;c="object"==typeof c&&null!==c?Mt(c):je(t,c=Ae(n)?He:Fe.current);var f=n.getDerivedStateFromProps,s="function"==typeof f||"function"==typeof u.getSnapshotBeforeUpdate;s||"function"!=typeof u.UNSAFE_componentWillReceiveProps&&"function"!=typeof u.componentWillReceiveProps||(a!==r||o!==c)&&Kt(t,u,r,c),Qt=!1;var d=t.memoizedState;u.state=d,jt(t,r,u,l),o=t.memoizedState,a!==r||d!==o||We.current||Qt?("function"==typeof f&&(Lt(t,n,f,r),o=t.memoizedState),(a=Qt||Vt(t,n,a,r,d,o,c))?(s||"function"!=typeof u.UNSAFE_componentWillMount&&"function"!=typeof u.componentWillMount||("function"==typeof u.componentWillMount&&u.componentWillMount(),"function"==typeof u.UNSAFE_componentWillMount&&u.UNSAFE_componentWillMount()),"function"==typeof u.componentDidMount&&(t.effectTag|=4)):("function"==typeof u.componentDidMount&&(t.effectTag|=4),t.memoizedProps=r,t.memoizedState=o),u.props=r,u.state=o,u.context=c,r=a):("function"==typeof u.componentDidMount&&(t.effectTag|=4),r=!1)}else u=t.stateNode,Dt(e,t),a=t.memoizedProps,u.props=t.type===t.elementType?a:St(t.type,a),o=u.context,c="object"==typeof(c=n.contextType)&&null!==c?Mt(c):je(t,c=Ae(n)?He:Fe.current),(s="function"==typeof(f=n.getDerivedStateFromProps)||"function"==typeof u.getSnapshotBeforeUpdate)||"function"!=typeof u.UNSAFE_componentWillReceiveProps&&"function"!=typeof u.componentWillReceiveProps||(a!==r||o!==c)&&Kt(t,u,r,c),Qt=!1,o=t.memoizedState,u.state=o,jt(t,r,u,l),d=t.memoizedState,a!==r||o!==d||We.current||Qt?("function"==typeof f&&(Lt(t,n,f,r),d=t.memoizedState),(f=Qt||Vt(t,n,a,r,o,d,c))?(s||"function"!=typeof u.UNSAFE_componentWillUpdate&&"function"!=typeof u.componentWillUpdate||("function"==typeof u.componentWillUpdate&&u.componentWillUpdate(r,d,c),"function"==typeof u.UNSAFE_componentWillUpdate&&u.UNSAFE_componentWillUpdate(r,d,c)),"function"==typeof u.componentDidUpdate&&(t.effectTag|=4),"function"==typeof u.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof u.componentDidUpdate||a===e.memoizedProps&&o===e.memoizedState||(t.effectTag|=4),"function"!=typeof u.getSnapshotBeforeUpdate||a===e.memoizedProps&&o===e.memoizedState||(t.effectTag|=256),t.memoizedProps=r,t.memoizedState=d),u.props=r,u.state=d,u.context=c,r=f):("function"!=typeof u.componentDidUpdate||a===e.memoizedProps&&o===e.memoizedState||(t.effectTag|=4),"function"!=typeof u.getSnapshotBeforeUpdate||a===e.memoizedProps&&o===e.memoizedState||(t.effectTag|=256),r=!1);return mr(e,t,n,r,i,l)}function mr(e,t,n,r,l,i){sr(e,t);var u=0!=(64&t.effectTag);if(!r&&!u)return l&&Ve(t,n,!1),wr(e,t,i);r=t.stateNode,ir.current=t;var a=u&&"function"!=typeof n.getDerivedStateFromError?null:r.render();return t.effectTag|=1,null!==e&&u?(t.child=en(t,e.child,null,i),t.child=en(t,null,a,i)):ar(e,t,a,i),t.memoizedState=r.state,l&&Ve(t,n,!0),t.child}function hr(e){var t=e.stateNode;t.pendingContext?Oe(0,t.pendingContext,t.pendingContext!==t.context):t.context&&Oe(0,t.context,!1),on(e,t.containerInfo)}var gr,br,vr,yr,Tr={dehydrated:null,retryTime:0};function xr(e,t,n){var r,l=t.mode,i=t.pendingProps,u=dn.current,a=!1;if((r=0!=(64&t.effectTag))||(r=0!=(2&u)&&(null===e||null!==e.memoizedState)),r?(a=!0,t.effectTag&=-65):null!==e&&null===e.memoizedState||void 0===i.fallback||!0===i.unstable_avoidThisFallback||(u|=1),Ue(dn,1&u),null===e){if(void 0!==i.fallback&&tr(t),a){if(a=i.fallback,(i=mi(null,l,0,null)).return=t,0==(2&t.mode))for(e=null!==t.memoizedState?t.child.child:t.child,i.child=e;null!==e;)e.return=i,e=e.sibling;return(n=mi(a,l,n,null)).return=t,i.sibling=n,t.memoizedState=Tr,t.child=i,n}return l=i.children,t.memoizedState=null,t.child=tn(t,null,l,n)}if(null!==e.memoizedState){if(l=(e=e.child).sibling,a){if(i=i.fallback,(n=di(e,e.pendingProps)).return=t,0==(2&t.mode)&&(a=null!==t.memoizedState?t.child.child:t.child)!==e.child)for(n.child=a;null!==a;)a.return=n,a=a.sibling;return(l=di(l,i)).return=t,n.sibling=l,n.childExpirationTime=0,t.memoizedState=Tr,t.child=n,l}return n=en(t,e.child,i.children,n),t.memoizedState=null,t.child=n}if(e=e.child,a){if(a=i.fallback,(i=mi(null,l,0,null)).return=t,i.child=e,null!==e&&(e.return=i),0==(2&t.mode))for(e=null!==t.memoizedState?t.child.child:t.child,i.child=e;null!==e;)e.return=i,e=e.sibling;return(n=mi(a,l,n,null)).return=t,i.sibling=n,n.effectTag|=2,i.childExpirationTime=0,t.memoizedState=Tr,t.child=i,n}return t.memoizedState=null,t.child=en(t,e,i.children,n)}function Er(e,t){e.expirationTime<t&&(e.expirationTime=t);var n=e.alternate;null!==n&&n.expirationTime<t&&(n.expirationTime=t),It(e.return,t)}function Sr(e,t,n,r,l,i){var u=e.memoizedState;null===u?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailExpiration:0,tailMode:l,lastEffect:i}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=r,u.tail=n,u.tailExpiration=0,u.tailMode=l,u.lastEffect=i)}function kr(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(ar(e,t,r.children,n),0!=(2&(r=dn.current)))r=1&r|2,t.effectTag|=64;else{if(null!==e&&0!=(64&e.effectTag))e:for(e=t.child;null!==e;){if(13===e.tag)null!==e.memoizedState&&Er(e,n);else if(19===e.tag)Er(e,n);else if(null!==e.child){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;null===e.sibling;){if(null===e.return||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(Ue(dn,r),0==(2&t.mode))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;null!==n;)null!==(e=n.alternate)&&null===pn(e)&&(l=n),n=n.sibling;null===(n=l)?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Sr(t,!1,l,n,i,t.lastEffect);break;case"backwards":for(n=null,l=t.child,t.child=null;null!==l;){if(null!==(e=l.alternate)&&null===pn(e)){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Sr(t,!0,n,null,i,t.lastEffect);break;case"together":Sr(t,!1,null,null,void 0,t.lastEffect);break;default:t.memoizedState=null}return t.child}function wr(e,t,n){null!==e&&(t.dependencies=e.dependencies);var r=t.expirationTime;if(0!==r&&ql(r),t.childExpirationTime<n)return null;if(null!==e&&t.child!==e.child)throw Error(c(153));if(null!==t.child){for(n=di(e=t.child,e.pendingProps),t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=di(e,e.pendingProps)).return=t;n.sibling=null}return t.child}function zr(e){e.effectTag|=4}if(G)gr=function(e,t){for(var n=t.child;null!==n;){if(5===n.tag||6===n.tag)H(e,n.stateNode);else if(4!==n.tag&&null!==n.child){n.child.return=n,n=n.child;continue}if(n===t)break;for(;null===n.sibling;){if(null===n.return||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},br=function(){},vr=function(e,t,n,r,l){if((e=e.memoizedProps)!==r){var i=t.stateNode,u=an(rn.current);n=A(i,n,e,r,l,u),(t.updateQueue=n)&&zr(t)}},yr=function(e,t,n,r){n!==r&&zr(t)};else if(Y){gr=function(e,t,n,r){for(var l=t.child;null!==l;){if(5===l.tag){var i=l.stateNode;n&&r&&(i=be(i,l.type,l.memoizedProps,l)),H(e,i)}else if(6===l.tag)i=l.stateNode,n&&r&&(i=ve(i,l.memoizedProps,l)),H(e,i);else if(4!==l.tag){if(13===l.tag&&0!=(4&l.effectTag)&&(i=null!==l.memoizedState)){var u=l.child;if(null!==u&&(null!==u.child&&(u.child.return=u,gr(e,u,!0,i)),null!==(i=u.sibling))){i.return=l,l=i;continue}}if(null!==l.child){l.child.return=l,l=l.child;continue}}if(l===t)break;for(;null===l.sibling;){if(null===l.return||l.return===t)return;l=l.return}l.sibling.return=l.return,l=l.sibling}};var Cr=function(e,t,n,r){for(var l=t.child;null!==l;){if(5===l.tag){var i=l.stateNode;n&&r&&(i=be(i,l.type,l.memoizedProps,l)),me(e,i)}else if(6===l.tag)i=l.stateNode,n&&r&&(i=ve(i,l.memoizedProps,l)),me(e,i);else if(4!==l.tag){if(13===l.tag&&0!=(4&l.effectTag)&&(i=null!==l.memoizedState)){var u=l.child;if(null!==u&&(null!==u.child&&(u.child.return=u,Cr(e,u,!0,i)),null!==(i=u.sibling))){i.return=l,l=i;continue}}if(null!==l.child){l.child.return=l,l=l.child;continue}}if(l===t)break;for(;null===l.sibling;){if(null===l.return||l.return===t)return;l=l.return}l.sibling.return=l.return,l=l.sibling}};br=function(e){var t=e.stateNode;if(null!==e.firstEffect){var n=t.containerInfo,r=pe(n);Cr(r,e,!1,!1),t.pendingChildren=r,zr(e),he(n,r)}},vr=function(e,t,n,r,l){var i=e.stateNode,u=e.memoizedProps;if((e=null===t.firstEffect)&&u===r)t.stateNode=i;else{var a=t.stateNode,o=an(rn.current),c=null;u!==r&&(c=A(a,n,u,r,l,o)),e&&null===c?t.stateNode=i:(i=de(i,c,n,u,r,t,e,a),j(i,n,r,l,o)&&zr(t),t.stateNode=i,e?zr(t):gr(i,t,!1,!1))}},yr=function(e,t,n,r){n!==r?(e=an(un.current),n=an(rn.current),t.stateNode=L(r,e,n,t),zr(t)):t.stateNode=e.stateNode}}else br=function(){},vr=function(){},yr=function(){};function Pr(e,t){switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;null!==t;)null!==t.alternate&&(n=t),t=t.sibling;null===n?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;null!==n;)null!==n.alternate&&(r=n),n=n.sibling;null===r?t||null===e.tail?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Nr(e,t,n){var r=t.pendingProps;switch(t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ae(t.type)&&Be(),null;case 3:return cn(),Qe(We),Qe(Fe),(r=t.stateNode).pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(null===e||null===e.child)&&rr(t)&&zr(t),br(t),null;case 5:sn(t);var l=an(un.current);if(n=t.type,null!==e&&null!=t.stateNode)vr(e,t,n,r,l),e.ref!==t.ref&&(t.effectTag|=128);else{if(!r){if(null===t.stateNode)throw Error(c(166));return null}if(e=an(rn.current),rr(t)){if(!J)throw Error(c(175));e=we(t.stateNode,t.type,t.memoizedProps,l,e,t),t.updateQueue=e,null!==e&&zr(t)}else{var i=W(n,r,l,e,t);gr(i,t,!1,!1),t.stateNode=i,j(i,n,r,l,e)&&zr(t)}null!==t.ref&&(t.effectTag|=128)}return null;case 6:if(e&&null!=t.stateNode)yr(e,t,e.memoizedProps,r);else{if("string"!=typeof r&&null===t.stateNode)throw Error(c(166));if(e=an(un.current),l=an(rn.current),rr(t)){if(!J)throw Error(c(176));ze(t.stateNode,t.memoizedProps,t)&&zr(t)}else t.stateNode=L(r,e,l,t)}return null;case 13:return Qe(dn),r=t.memoizedState,0!=(64&t.effectTag)?(t.expirationTime=n,t):(r=null!==r,l=!1,null===e?void 0!==t.memoizedProps.fallback&&rr(t):(l=null!==(n=e.memoizedState),r||null===n||null!==(n=e.child.sibling)&&(null!==(i=t.firstEffect)?(t.firstEffect=n,n.nextEffect=i):(t.firstEffect=t.lastEffect=n,n.nextEffect=null),n.effectTag=8)),r&&!l&&0!=(2&t.mode)&&(null===e&&!0!==t.memoizedProps.unstable_avoidThisFallback||0!=(1&dn.current)?dl===il&&(dl=ul):(dl!==il&&dl!==ul||(dl=al),0!==bl&&null!==cl&&(yi(cl,sl),Ti(cl,bl)))),Y&&r&&(t.effectTag|=4),G&&(r||l)&&(t.effectTag|=4),null);case 4:return cn(),br(t),null;case 10:return _t(t),null;case 17:return Ae(t.type)&&Be(),null;case 19:if(Qe(dn),null===(r=t.memoizedState))return null;if(l=0!=(64&t.effectTag),null===(i=r.rendering)){if(l)Pr(r,!1);else if(dl!==il||null!==e&&0!=(64&e.effectTag))for(e=t.child;null!==e;){if(null!==(i=pn(e))){for(t.effectTag|=64,Pr(r,!1),null!==(e=i.updateQueue)&&(t.updateQueue=e,t.effectTag|=4),null===r.lastEffect&&(t.firstEffect=null),t.lastEffect=r.lastEffect,e=n,r=t.child;null!==r;)n=e,(l=r).effectTag&=2,l.nextEffect=null,l.firstEffect=null,l.lastEffect=null,null===(i=l.alternate)?(l.childExpirationTime=0,l.expirationTime=n,l.child=null,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null):(l.childExpirationTime=i.childExpirationTime,l.expirationTime=i.expirationTime,l.child=i.child,l.memoizedProps=i.memoizedProps,l.memoizedState=i.memoizedState,l.updateQueue=i.updateQueue,n=i.dependencies,l.dependencies=null===n?null:{expirationTime:n.expirationTime,firstContext:n.firstContext,responders:n.responders}),r=r.sibling;return Ue(dn,1&dn.current|2),t.child}e=e.sibling}}else{if(!l)if(null!==(e=pn(i))){if(t.effectTag|=64,l=!0,null!==(e=e.updateQueue)&&(t.updateQueue=e,t.effectTag|=4),Pr(r,!0),null===r.tail&&"hidden"===r.tailMode&&!i.alternate)return null!==(t=t.lastEffect=r.lastEffect)&&(t.nextEffect=null),null}else 2*st()-r.renderingStartTime>r.tailExpiration&&1<n&&(t.effectTag|=64,l=!0,Pr(r,!1),t.expirationTime=t.childExpirationTime=n-1);r.isBackwards?(i.sibling=t.child,t.child=i):(null!==(e=r.last)?e.sibling=i:t.child=i,r.last=i)}return null!==r.tail?(0===r.tailExpiration&&(r.tailExpiration=st()+500),e=r.tail,r.rendering=e,r.tail=e.sibling,r.lastEffect=t.lastEffect,r.renderingStartTime=st(),e.sibling=null,t=dn.current,Ue(dn,l?1&t|2:1&t),e):null}throw Error(c(156,t.tag))}function _r(e){switch(e.tag){case 1:Ae(e.type)&&Be();var t=e.effectTag;return 4096&t?(e.effectTag=-4097&t|64,e):null;case 3:if(cn(),Qe(We),Qe(Fe),0!=(64&(t=e.effectTag)))throw Error(c(285));return e.effectTag=-4097&t|64,e;case 5:return sn(e),null;case 13:return Qe(dn),4096&(t=e.effectTag)?(e.effectTag=-4097&t|64,e):null;case 19:return Qe(dn),null;case 4:return cn(),null;case 10:return _t(e),null;default:return null}}function Ir(e,t){return{value:e,source:t,stack:Ie(t)}}var Rr="function"==typeof WeakSet?WeakSet:Set;function Mr(e,t){var n=t.source,r=t.stack;null===r&&null!==n&&(r=Ie(n)),null!==n&&P(n.type),t=t.value,null!==e&&1===e.tag&&P(e.type);try{console.error(t)}catch(e){setTimeout((function(){throw e}))}}function Qr(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){ri(e,t)}else t.current=null}function Ur(e,t){switch(t.tag){case 0:case 11:case 15:case 22:return;case 1:if(256&t.effectTag&&null!==e){var n=e.memoizedProps,r=e.memoizedState;t=(e=t.stateNode).getSnapshotBeforeUpdate(t.elementType===t.type?n:St(t.type,n),r),e.__reactInternalSnapshotBeforeUpdate=t}return;case 3:case 5:case 6:case 4:case 17:return}throw Error(c(163))}function Dr(e,t){if(null!==(t=null!==(t=t.updateQueue)?t.lastEffect:null)){var n=t=t.next;do{if((n.tag&e)===e){var r=n.destroy;n.destroy=void 0,void 0!==r&&r()}n=n.next}while(n!==t)}}function Fr(e,t){if(null!==(t=null!==(t=t.updateQueue)?t.lastEffect:null)){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Wr(e,t,n){switch(n.tag){case 0:case 11:case 15:case 22:return void Fr(3,n);case 1:if(e=n.stateNode,4&n.effectTag)if(null===t)e.componentDidMount();else{var r=n.elementType===n.type?t.memoizedProps:St(n.type,t.memoizedProps);e.componentDidUpdate(r,t.memoizedState,e.__reactInternalSnapshotBeforeUpdate)}return void(null!==(t=n.updateQueue)&&At(n,t,e));case 3:if(null!==(t=n.updateQueue)){if(e=null,null!==n.child)switch(n.child.tag){case 5:e=M(n.child.stateNode);break;case 1:e=n.child.stateNode}At(n,t,e)}return;case 5:return e=n.stateNode,void(null===t&&4&n.effectTag&&te(e,n.type,n.memoizedProps,n));case 6:case 4:case 12:return;case 13:return void(J&&null===n.memoizedState&&(n=n.alternate,null!==n&&(n=n.memoizedState,null!==n&&(n=n.dehydrated,null!==n&&Ne(n)))));case 19:case 17:case 20:case 21:return}throw Error(c(163))}function Hr(e,t,n){switch("function"==typeof oi&&oi(t),t.tag){case 0:case 11:case 14:case 15:case 22:if(null!==(e=t.updateQueue)&&null!==(e=e.lastEffect)){var r=e.next;mt(97<n?97:n,(function(){var e=r;do{var n=e.destroy;if(void 0!==n){var l=t;try{n()}catch(e){ri(l,e)}}e=e.next}while(e!==r)}))}break;case 1:Qr(t),"function"==typeof(n=t.stateNode).componentWillUnmount&&function(e,t){try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){ri(e,t)}}(t,n);break;case 5:Qr(t);break;case 4:G?Vr(e,t,n):Y&&function(e){if(Y){e=e.stateNode.containerInfo;var t=pe(e);ge(e,t)}}(t)}}function jr(e,t,n){for(var r=t;;)if(Hr(e,r,n),null===r.child||G&&4===r.tag){if(r===t)break;for(;null===r.sibling;){if(null===r.return||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}else r.child.return=r,r=r.child}function Ar(e){var t=e.alternate;e.return=null,e.child=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.alternate=null,e.firstEffect=null,e.lastEffect=null,e.pendingProps=null,e.memoizedProps=null,e.stateNode=null,null!==t&&Ar(t)}function Br(e){return 5===e.tag||3===e.tag||4===e.tag}function Or(e){if(G){e:{for(var t=e.return;null!==t;){if(Br(t)){var n=t;break e}t=t.return}throw Error(c(160))}switch(t=n.stateNode,n.tag){case 5:var r=!1;break;case 3:case 4:t=t.containerInfo,r=!0;break;default:throw Error(c(161))}16&n.effectTag&&(ae(t),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||Br(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag&&18!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}r?Lr(e,n,t):qr(e,n,t)}}function Lr(e,t,n){var r=e.tag,l=5===r||6===r;if(l)e=l?e.stateNode:e.stateNode.instance,t?le(n,e,t):Z(n,e);else if(4!==r&&null!==(e=e.child))for(Lr(e,t,n),e=e.sibling;null!==e;)Lr(e,t,n),e=e.sibling}function qr(e,t,n){var r=e.tag,l=5===r||6===r;if(l)e=l?e.stateNode:e.stateNode.instance,t?re(n,e,t):X(n,e);else if(4!==r&&null!==(e=e.child))for(qr(e,t,n),e=e.sibling;null!==e;)qr(e,t,n),e=e.sibling}function Vr(e,t,n){for(var r,l,i=t,u=!1;;){if(!u){u=i.return;e:for(;;){if(null===u)throw Error(c(160));switch(r=u.stateNode,u.tag){case 5:l=!1;break e;case 3:case 4:r=r.containerInfo,l=!0;break e}u=u.return}u=!0}if(5===i.tag||6===i.tag)jr(e,i,n),l?ue(r,i.stateNode):ie(r,i.stateNode);else if(4===i.tag){if(null!==i.child){r=i.stateNode.containerInfo,l=!0,i.child.return=i,i=i.child;continue}}else if(Hr(e,i,n),null!==i.child){i.child.return=i,i=i.child;continue}if(i===t)break;for(;null===i.sibling;){if(null===i.return||i.return===t)return;4===(i=i.return).tag&&(u=!1)}i.sibling.return=i.return,i=i.sibling}}function $r(e,t){if(G){switch(t.tag){case 0:case 11:case 14:case 15:case 22:return void Dr(3,t);case 1:return;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps;e=null!==e?e.memoizedProps:r;var l=t.type,i=t.updateQueue;t.updateQueue=null,null!==i&&ne(n,i,l,e,r,t)}return;case 6:if(null===t.stateNode)throw Error(c(162));return n=t.memoizedProps,void ee(t.stateNode,null!==e?e.memoizedProps:n,n);case 3:return void(J&&(t=t.stateNode,t.hydrate&&(t.hydrate=!1,Pe(t.containerInfo))));case 12:return;case 13:return Kr(t),void Gr(t);case 19:return void Gr(t);case 17:return}throw Error(c(163))}switch(t.tag){case 0:case 11:case 14:case 15:case 22:return void Dr(3,t);case 12:return;case 13:return Kr(t),void Gr(t);case 19:return void Gr(t);case 3:J&&(n=t.stateNode).hydrate&&(n.hydrate=!1,Pe(n.containerInfo))}e:if(Y){switch(t.tag){case 1:case 5:case 6:case 20:break e;case 3:case 4:t=t.stateNode,ge(t.containerInfo,t.pendingChildren);break e}throw Error(c(163))}}function Kr(e){var t=e;if(null===e.memoizedState)var n=!1;else n=!0,t=e.child,yl=st();if(G&&null!==t)e:if(e=t,G)for(t=e;;){if(5===t.tag){var r=t.stateNode;n?oe(r):fe(t.stateNode,t.memoizedProps)}else if(6===t.tag)r=t.stateNode,n?ce(r):se(r,t.memoizedProps);else{if(13===t.tag&&null!==t.memoizedState&&null===t.memoizedState.dehydrated){(r=t.child.sibling).return=t,t=r;continue}if(null!==t.child){t.child.return=t,t=t.child;continue}}if(t===e)break e;for(;null===t.sibling;){if(null===t.return||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}}function Gr(e){var t=e.updateQueue;if(null!==t){e.updateQueue=null;var n=e.stateNode;null===n&&(n=e.stateNode=new Rr),t.forEach((function(t){var r=ii.bind(null,e,t);n.has(t)||(n.add(t),t.then(r,r))}))}}var Yr="function"==typeof WeakMap?WeakMap:Map;function Jr(e,t,n){(n=Ft(n,null)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){xl||(xl=!0,El=r),Mr(e,t)},n}function Xr(e,t,n){(n=Ft(n,null)).tag=3;var r=e.type.getDerivedStateFromError;if("function"==typeof r){var l=t.value;n.payload=function(){return Mr(e,t),r(l)}}var i=e.stateNode;return null!==i&&"function"==typeof i.componentDidCatch&&(n.callback=function(){"function"!=typeof r&&(null===Sl?Sl=new Set([this]):Sl.add(this),Mr(e,t));var n=t.stack;this.componentDidCatch(t.value,{componentStack:null!==n?n:""})}),n}var Zr,el=Math.ceil,tl=f.ReactCurrentDispatcher,nl=f.ReactCurrentOwner,rl=16,ll=32,il=0,ul=3,al=4,ol=0,cl=null,fl=null,sl=0,dl=il,pl=null,ml=1073741823,hl=1073741823,gl=null,bl=0,vl=!1,yl=0,Tl=null,xl=!1,El=null,Sl=null,kl=!1,wl=null,zl=90,Cl=null,Pl=0,Nl=null,_l=0;function Il(){return 0!=(48&ol)?1073741821-(st()/10|0):0!==_l?_l:_l=1073741821-(st()/10|0)}function Rl(e,t,n){if(0==(2&(t=t.mode)))return 1073741823;var r=dt();if(0==(4&t))return 99===r?1073741823:1073741822;if(0!=(ol&rl))return sl;if(null!==n)e=yt(e,0|n.timeoutMs||5e3,250);else switch(r){case 99:e=1073741823;break;case 98:e=yt(e,150,100);break;case 97:case 96:e=yt(e,5e3,250);break;case 95:e=2;break;default:throw Error(c(326))}return null!==cl&&e===sl&&--e,e}function Ml(e,t){if(50<Pl)throw Pl=0,Nl=null,Error(c(185));if(null!==(e=Ql(e,t))){var n=dt();1073741823===t?0!=(8&ol)&&0==(48&ol)?Wl(e):(Dl(e),0===ol&&bt()):Dl(e),0==(4&ol)||98!==n&&99!==n||(null===Cl?Cl=new Map([[e,t]]):(void 0===(n=Cl.get(e))||n>t)&&Cl.set(e,t))}}function Ql(e,t){e.expirationTime<t&&(e.expirationTime=t);var n=e.alternate;null!==n&&n.expirationTime<t&&(n.expirationTime=t);var r=e.return,l=null;if(null===r&&3===e.tag)l=e.stateNode;else for(;null!==r;){if(n=r.alternate,r.childExpirationTime<t&&(r.childExpirationTime=t),null!==n&&n.childExpirationTime<t&&(n.childExpirationTime=t),null===r.return&&3===r.tag){l=r.stateNode;break}r=r.return}return null!==l&&(cl===l&&(ql(t),dl===al&&yi(l,sl)),Ti(l,t)),l}function Ul(e){var t=e.lastExpiredTime;if(0!==t)return t;if(!vi(e,t=e.firstPendingTime))return t;var n=e.lastPingedTime;return 2>=(e=n>(e=e.nextKnownPendingLevel)?n:e)&&t!==e?0:e}function Dl(e){if(0!==e.lastExpiredTime)e.callbackExpirationTime=1073741823,e.callbackPriority=99,e.callbackNode=gt(Wl.bind(null,e));else{var t=Ul(e),n=e.callbackNode;if(0===t)null!==n&&(e.callbackNode=null,e.callbackExpirationTime=0,e.callbackPriority=90);else{var r=Il();if(r=1073741823===t?99:1===t||2===t?95:0>=(r=10*(1073741821-t)-10*(1073741821-r))?99:250>=r?98:5250>=r?97:95,null!==n){var l=e.callbackPriority;if(e.callbackExpirationTime===t&&l>=r)return;n!==lt&&Ge(n)}e.callbackExpirationTime=t,e.callbackPriority=r,t=1073741823===t?gt(Wl.bind(null,e)):ht(r,Fl.bind(null,e),{timeout:10*(1073741821-t)-st()}),e.callbackNode=t}}}function Fl(e,t){if(_l=0,t)return xi(e,t=Il()),Dl(e),null;var n=Ul(e);if(0!==n){if(t=e.callbackNode,0!=(48&ol))throw Error(c(327));if(ei(),e===cl&&n===sl||Al(e,n),null!==fl){var r=ol;ol|=rl;for(var l=Ol();;)try{$l();break}catch(t){Bl(e,t)}if(Pt(),ol=r,tl.current=l,1===dl)throw t=pl,Al(e,n),yi(e,n),Dl(e),t;if(null===fl)switch(l=e.finishedWork=e.current.alternate,e.finishedExpirationTime=n,r=dl,cl=null,r){case il:case 1:throw Error(c(345));case 2:xi(e,2<n?2:n);break;case ul:if(yi(e,n),n===(r=e.lastSuspendedTime)&&(e.nextKnownPendingLevel=Yl(l)),1073741823===ml&&10<(l=yl+500-st())){if(vl){var i=e.lastPingedTime;if(0===i||i>=n){e.lastPingedTime=n,Al(e,n);break}}if(0!==(i=Ul(e))&&i!==n)break;if(0!==r&&r!==n){e.lastPingedTime=r;break}e.timeoutHandle=q(Jl.bind(null,e),l);break}Jl(e);break;case al:if(yi(e,n),n===(r=e.lastSuspendedTime)&&(e.nextKnownPendingLevel=Yl(l)),vl&&(0===(l=e.lastPingedTime)||l>=n)){e.lastPingedTime=n,Al(e,n);break}if(0!==(l=Ul(e))&&l!==n)break;if(0!==r&&r!==n){e.lastPingedTime=r;break}if(1073741823!==hl?r=10*(1073741821-hl)-st():1073741823===ml?r=0:(r=10*(1073741821-ml)-5e3,0>(r=(l=st())-r)&&(r=0),(n=10*(1073741821-n)-l)<(r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*el(r/1960))-r)&&(r=n)),10<r){e.timeoutHandle=q(Jl.bind(null,e),r);break}Jl(e);break;case 5:if(1073741823!==ml&&null!==gl){i=ml;var u=gl;if(0>=(r=0|u.busyMinDurationMs)?r=0:(l=0|u.busyDelayMs,r=(i=st()-(10*(1073741821-i)-(0|u.timeoutMs||5e3)))<=l?0:l+r-i),10<r){yi(e,n),e.timeoutHandle=q(Jl.bind(null,e),r);break}}Jl(e);break;default:throw Error(c(329))}if(Dl(e),e.callbackNode===t)return Fl.bind(null,e)}}return null}function Wl(e){var t=e.lastExpiredTime;if(t=0!==t?t:1073741823,0!=(48&ol))throw Error(c(327));if(ei(),e===cl&&t===sl||Al(e,t),null!==fl){var n=ol;ol|=rl;for(var r=Ol();;)try{Vl();break}catch(t){Bl(e,t)}if(Pt(),ol=n,tl.current=r,1===dl)throw n=pl,Al(e,t),yi(e,t),Dl(e),n;if(null!==fl)throw Error(c(261));e.finishedWork=e.current.alternate,e.finishedExpirationTime=t,cl=null,Jl(e),Dl(e)}return null}function Hl(e,t){var n=ol;ol|=1;try{return e(t)}finally{0===(ol=n)&&bt()}}function jl(e,t){if(0!=(48&ol))throw Error(c(187));var n=ol;ol|=1;try{return mt(99,e.bind(null,t))}finally{ol=n,bt()}}function Al(e,t){e.finishedWork=null,e.finishedExpirationTime=0;var n=e.timeoutHandle;if(n!==$&&(e.timeoutHandle=$,V(n)),null!==fl)for(n=fl.return;null!==n;){var r=n;switch(r.tag){case 1:null!=(r=r.type.childContextTypes)&&Be();break;case 3:cn(),Qe(We),Qe(Fe);break;case 5:sn(r);break;case 4:cn();break;case 13:case 19:Qe(dn);break;case 10:_t(r)}n=n.return}cl=e,fl=di(e.current,null),sl=t,dl=il,pl=null,hl=ml=1073741823,gl=null,bl=0,vl=!1}function Bl(e,t){for(;;){try{if(Pt(),hn.current=Vn,xn)for(var n=vn.memoizedState;null!==n;){var r=n.queue;null!==r&&(r.pending=null),n=n.next}if(bn=0,Tn=yn=vn=null,xn=!1,null===fl||null===fl.return)return dl=1,pl=t,fl=null;e:{var l=e,i=fl.return,u=fl,a=t;if(t=sl,u.effectTag|=2048,u.firstEffect=u.lastEffect=null,null!==a&&"object"==typeof a&&"function"==typeof a.then){var o=a;if(0==(2&u.mode)){var c=u.alternate;c?(u.updateQueue=c.updateQueue,u.memoizedState=c.memoizedState,u.expirationTime=c.expirationTime):(u.updateQueue=null,u.memoizedState=null)}var f=0!=(1&dn.current),s=i;do{var d;if(d=13===s.tag){var p=s.memoizedState;if(null!==p)d=null!==p.dehydrated;else{var m=s.memoizedProps;d=void 0!==m.fallback&&(!0!==m.unstable_avoidThisFallback||!f)}}if(d){var h=s.updateQueue;if(null===h){var g=new Set;g.add(o),s.updateQueue=g}else h.add(o);if(0==(2&s.mode)){if(s.effectTag|=64,u.effectTag&=-2981,1===u.tag)if(null===u.alternate)u.tag=17;else{var b=Ft(1073741823,null);b.tag=2,Wt(u,b)}u.expirationTime=1073741823;break e}a=void 0,u=t;var v=l.pingCache;if(null===v?(v=l.pingCache=new Yr,a=new Set,v.set(o,a)):void 0===(a=v.get(o))&&(a=new Set,v.set(o,a)),!a.has(u)){a.add(u);var y=li.bind(null,l,o,u);o.then(y,y)}s.effectTag|=4096,s.expirationTime=t;break e}s=s.return}while(null!==s);a=Error((P(u.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+Ie(u))}5!==dl&&(dl=2),a=Ir(a,u),s=i;do{switch(s.tag){case 3:o=a,s.effectTag|=4096,s.expirationTime=t,Ht(s,Jr(s,o,t));break e;case 1:o=a;var T=s.type,x=s.stateNode;if(0==(64&s.effectTag)&&("function"==typeof T.getDerivedStateFromError||null!==x&&"function"==typeof x.componentDidCatch&&(null===Sl||!Sl.has(x)))){s.effectTag|=4096,s.expirationTime=t,Ht(s,Xr(s,o,t));break e}}s=s.return}while(null!==s)}fl=Gl(fl)}catch(e){t=e;continue}break}}function Ol(){var e=tl.current;return tl.current=Vn,null===e?Vn:e}function Ll(e,t){e<ml&&2<e&&(ml=e),null!==t&&e<hl&&2<e&&(hl=e,gl=t)}function ql(e){e>bl&&(bl=e)}function Vl(){for(;null!==fl;)fl=Kl(fl)}function $l(){for(;null!==fl&&!it();)fl=Kl(fl)}function Kl(e){var t=Zr(e.alternate,e,sl);return e.memoizedProps=e.pendingProps,null===t&&(t=Gl(e)),nl.current=null,t}function Gl(e){fl=e;do{var t=fl.alternate;if(e=fl.return,0==(2048&fl.effectTag)){if(t=Nr(t,fl,sl),1===sl||1!==fl.childExpirationTime){for(var n=0,r=fl.child;null!==r;){var l=r.expirationTime,i=r.childExpirationTime;l>n&&(n=l),i>n&&(n=i),r=r.sibling}fl.childExpirationTime=n}if(null!==t)return t;null!==e&&0==(2048&e.effectTag)&&(null===e.firstEffect&&(e.firstEffect=fl.firstEffect),null!==fl.lastEffect&&(null!==e.lastEffect&&(e.lastEffect.nextEffect=fl.firstEffect),e.lastEffect=fl.lastEffect),1<fl.effectTag&&(null!==e.lastEffect?e.lastEffect.nextEffect=fl:e.firstEffect=fl,e.lastEffect=fl))}else{if(null!==(t=_r(fl)))return t.effectTag&=2047,t;null!==e&&(e.firstEffect=e.lastEffect=null,e.effectTag|=2048)}if(null!==(t=fl.sibling))return t;fl=e}while(null!==fl);return dl===il&&(dl=5),null}function Yl(e){var t=e.expirationTime;return t>(e=e.childExpirationTime)?t:e}function Jl(e){var t=dt();return mt(99,Xl.bind(null,e,t)),null}function Xl(e,t){do{ei()}while(null!==wl);if(0!=(48&ol))throw Error(c(327));var n=e.finishedWork,r=e.finishedExpirationTime;if(null===n)return null;if(e.finishedWork=null,e.finishedExpirationTime=0,n===e.current)throw Error(c(177));e.callbackNode=null,e.callbackExpirationTime=0,e.callbackPriority=90,e.nextKnownPendingLevel=0;var l=Yl(n);if(e.firstPendingTime=l,r<=e.lastSuspendedTime?e.firstSuspendedTime=e.lastSuspendedTime=e.nextKnownPendingLevel=0:r<=e.firstSuspendedTime&&(e.firstSuspendedTime=r-1),r<=e.lastPingedTime&&(e.lastPingedTime=0),r<=e.lastExpiredTime&&(e.lastExpiredTime=0),e===cl&&(fl=cl=null,sl=0),1<n.effectTag?null!==n.lastEffect?(n.lastEffect.nextEffect=n,l=n.firstEffect):l=n:l=n.firstEffect,null!==l){var i=ol;ol|=ll,nl.current=null,D(e.containerInfo),Tl=l;do{try{Zl()}catch(e){if(null===Tl)throw Error(c(330));ri(Tl,e),Tl=Tl.nextEffect}}while(null!==Tl);Tl=l;do{try{for(var u=e,a=t;null!==Tl;){var o=Tl.effectTag;if(16&o&&G&&ae(Tl.stateNode),128&o){var f=Tl.alternate;if(null!==f){var s=f.ref;null!==s&&("function"==typeof s?s(null):s.current=null)}}switch(1038&o){case 2:Or(Tl),Tl.effectTag&=-3;break;case 6:Or(Tl),Tl.effectTag&=-3,$r(Tl.alternate,Tl);break;case 1024:Tl.effectTag&=-1025;break;case 1028:Tl.effectTag&=-1025,$r(Tl.alternate,Tl);break;case 4:$r(Tl.alternate,Tl);break;case 8:var d=u,p=Tl,m=a;G?Vr(d,p,m):jr(d,p,m),Ar(p)}Tl=Tl.nextEffect}}catch(e){if(null===Tl)throw Error(c(330));ri(Tl,e),Tl=Tl.nextEffect}}while(null!==Tl);F(e.containerInfo),e.current=n,Tl=l;do{try{for(o=e;null!==Tl;){var h=Tl.effectTag;if(36&h&&Wr(o,Tl.alternate,Tl),128&h){f=void 0;var g=Tl.ref;if(null!==g){var b=Tl.stateNode;switch(Tl.tag){case 5:f=M(b);break;default:f=b}"function"==typeof g?g(f):g.current=f}}Tl=Tl.nextEffect}}catch(e){if(null===Tl)throw Error(c(330));ri(Tl,e),Tl=Tl.nextEffect}}while(null!==Tl);Tl=null,ut(),ol=i}else e.current=n;if(kl)kl=!1,wl=e,zl=t;else for(Tl=l;null!==Tl;)t=Tl.nextEffect,Tl.nextEffect=null,Tl=t;if(0===(t=e.firstPendingTime)&&(Sl=null),1073741823===t?e===Nl?Pl++:(Pl=0,Nl=e):Pl=0,"function"==typeof ai&&ai(n.stateNode,r),Dl(e),xl)throw xl=!1,e=El,El=null,e;return 0!=(8&ol)||bt(),null}function Zl(){for(;null!==Tl;){var e=Tl.effectTag;0!=(256&e)&&Ur(Tl.alternate,Tl),0==(512&e)||kl||(kl=!0,ht(97,(function(){return ei(),null}))),Tl=Tl.nextEffect}}function ei(){if(90!==zl){var e=97<zl?97:zl;return zl=90,mt(e,ti)}}function ti(){if(null===wl)return!1;var e=wl;if(wl=null,0!=(48&ol))throw Error(c(331));var t=ol;for(ol|=ll,e=e.current.firstEffect;null!==e;){try{var n=e;if(0!=(512&n.effectTag))switch(n.tag){case 0:case 11:case 15:case 22:Dr(5,n),Fr(5,n)}}catch(t){if(null===e)throw Error(c(330));ri(e,t)}n=e.nextEffect,e.nextEffect=null,e=n}return ol=t,bt(),!0}function ni(e,t,n){Wt(e,t=Jr(e,t=Ir(n,t),1073741823)),null!==(e=Ql(e,1073741823))&&Dl(e)}function ri(e,t){if(3===e.tag)ni(e,e,t);else for(var n=e.return;null!==n;){if(3===n.tag){ni(n,e,t);break}if(1===n.tag){var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromError||"function"==typeof r.componentDidCatch&&(null===Sl||!Sl.has(r))){Wt(n,e=Xr(n,e=Ir(t,e),1073741823)),null!==(n=Ql(n,1073741823))&&Dl(n);break}}n=n.return}}function li(e,t,n){var r=e.pingCache;null!==r&&r.delete(t),cl===e&&sl===n?dl===al||dl===ul&&1073741823===ml&&st()-yl<500?Al(e,sl):vl=!0:vi(e,n)&&(0!==(t=e.lastPingedTime)&&t<n||(e.lastPingedTime=n,Dl(e)))}function ii(e,t){var n=e.stateNode;null!==n&&n.delete(t),0==(t=0)&&(t=Rl(t=Il(),e,null)),null!==(e=Ql(e,t))&&Dl(e)}Zr=function(e,t,n){var r=t.expirationTime;if(null!==e){var l=t.pendingProps;if(e.memoizedProps!==l||We.current)ur=!0;else{if(r<n){switch(ur=!1,t.tag){case 3:hr(t),lr();break;case 5:if(fn(t),4&t.mode&&1!==n&&O(t.type,l))return t.expirationTime=t.childExpirationTime=1,null;break;case 1:Ae(t.type)&&qe(t);break;case 4:on(t,t.stateNode.containerInfo);break;case 10:Nt(t,t.memoizedProps.value);break;case 13:if(null!==t.memoizedState)return 0!==(r=t.child.childExpirationTime)&&r>=n?xr(e,t,n):(Ue(dn,1&dn.current),null!==(t=wr(e,t,n))?t.sibling:null);Ue(dn,1&dn.current);break;case 19:if(r=t.childExpirationTime>=n,0!=(64&e.effectTag)){if(r)return kr(e,t,n);t.effectTag|=64}if(null!==(l=t.memoizedState)&&(l.rendering=null,l.tail=null),Ue(dn,dn.current),!r)return null}return wr(e,t,n)}ur=!1}}else ur=!1;switch(t.expirationTime=0,t.tag){case 2:if(r=t.type,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),e=t.pendingProps,l=je(t,Fe.current),Rt(t,n),l=kn(null,t,r,e,l,n),t.effectTag|=1,"object"==typeof l&&null!==l&&"function"==typeof l.render&&void 0===l.$$typeof){if(t.tag=1,t.memoizedState=null,t.updateQueue=null,Ae(r)){var i=!0;qe(t)}else i=!1;t.memoizedState=null!==l.state&&void 0!==l.state?l.state:null,Ut(t);var u=r.getDerivedStateFromProps;"function"==typeof u&&Lt(t,r,u,e),l.updater=qt,t.stateNode=l,l._reactInternalFiber=t,Gt(t,r,e,n),t=mr(null,t,r,!0,i,n)}else t.tag=0,ar(null,t,l,n),t=t.child;return t;case 16:e:{if(l=t.elementType,null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),e=t.pendingProps,function(e){if(-1===e._status){e._status=0;var t=e._ctor;t=t(),e._result=t,t.then((function(t){0===e._status&&(t=t.default,e._status=1,e._result=t)}),(function(t){0===e._status&&(e._status=2,e._result=t)}))}}(l),1!==l._status)throw l._result;switch(l=l._result,t.type=l,i=t.tag=function(e){if("function"==typeof e)return si(e)?1:0;if(null!=e){if((e=e.$$typeof)===T)return 11;if(e===S)return 14}return 2}(l),e=St(l,e),i){case 0:t=dr(null,t,l,e,n);break e;case 1:t=pr(null,t,l,e,n);break e;case 11:t=or(null,t,l,e,n);break e;case 14:t=cr(null,t,l,St(l.type,e),r,n);break e}throw Error(c(306,l,""))}return t;case 0:return r=t.type,l=t.pendingProps,dr(e,t,r,l=t.elementType===r?l:St(r,l),n);case 1:return r=t.type,l=t.pendingProps,pr(e,t,r,l=t.elementType===r?l:St(r,l),n);case 3:if(hr(t),r=t.updateQueue,null===e||null===r)throw Error(c(282));if(r=t.pendingProps,l=null!==(l=t.memoizedState)?l.element:null,Dt(e,t),jt(t,r,null,n),(r=t.memoizedState.element)===l)lr(),t=wr(e,t,n);else{if((l=t.stateNode.hydrate)&&(J?(Jn=ke(t.stateNode.containerInfo),Yn=t,l=Xn=!0):l=!1),l)for(n=tn(t,null,r,n),t.child=n;n;)n.effectTag=-3&n.effectTag|1024,n=n.sibling;else ar(e,t,r,n),lr();t=t.child}return t;case 5:return fn(t),null===e&&tr(t),r=t.type,l=t.pendingProps,i=null!==e?e.memoizedProps:null,u=l.children,B(r,l)?u=null:null!==i&&B(r,i)&&(t.effectTag|=16),sr(e,t),4&t.mode&&1!==n&&O(r,l)?(t.expirationTime=t.childExpirationTime=1,t=null):(ar(e,t,u,n),t=t.child),t;case 6:return null===e&&tr(t),null;case 13:return xr(e,t,n);case 4:return on(t,t.stateNode.containerInfo),r=t.pendingProps,null===e?t.child=en(t,null,r,n):ar(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,or(e,t,r,l=t.elementType===r?l:St(r,l),n);case 7:return ar(e,t,t.pendingProps,n),t.child;case 8:case 12:return ar(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,u=t.memoizedProps,Nt(t,i=l.value),null!==u){var a=u.value;if(0==(i=Tt(a,i)?0:0|("function"==typeof r._calculateChangedBits?r._calculateChangedBits(a,i):1073741823))){if(u.children===l.children&&!We.current){t=wr(e,t,n);break e}}else for(null!==(a=t.child)&&(a.return=t);null!==a;){var o=a.dependencies;if(null!==o){u=a.child;for(var f=o.firstContext;null!==f;){if(f.context===r&&0!=(f.observedBits&i)){1===a.tag&&((f=Ft(n,null)).tag=2,Wt(a,f)),a.expirationTime<n&&(a.expirationTime=n),null!==(f=a.alternate)&&f.expirationTime<n&&(f.expirationTime=n),It(a.return,n),o.expirationTime<n&&(o.expirationTime=n);break}f=f.next}}else u=10===a.tag&&a.type===t.type?null:a.child;if(null!==u)u.return=a;else for(u=a;null!==u;){if(u===t){u=null;break}if(null!==(a=u.sibling)){a.return=u.return,u=a;break}u=u.return}a=u}}ar(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=(i=t.pendingProps).children,Rt(t,n),r=r(l=Mt(l,i.unstable_observedBits)),t.effectTag|=1,ar(e,t,r,n),t.child;case 14:return i=St(l=t.type,t.pendingProps),cr(e,t,l,i=St(l.type,i),r,n);case 15:return fr(e,t,t.type,t.pendingProps,r,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:St(r,l),null!==e&&(e.alternate=null,t.alternate=null,t.effectTag|=2),t.tag=1,Ae(r)?(e=!0,qe(t)):e=!1,Rt(t,n),$t(t,r,l),Gt(t,r,l,n),mr(null,t,r,!0,e,n);case 19:return kr(e,t,n)}throw Error(c(156,t.tag))};var ui={current:!1},ai=null,oi=null;function ci(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childExpirationTime=this.expirationTime=0,this.alternate=null}function fi(e,t,n,r){return new ci(e,t,n,r)}function si(e){return!(!(e=e.prototype)||!e.isReactComponent)}function di(e,t){var n=e.alternate;return null===n?((n=fi(e.tag,t,e.key,e.mode)).elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.effectTag=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childExpirationTime=e.childExpirationTime,n.expirationTime=e.expirationTime,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=null===t?null:{expirationTime:t.expirationTime,firstContext:t.firstContext,responders:t.responders},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function pi(e,t,n,r,l,i){var u=2;if(r=e,"function"==typeof e)si(e)&&(u=1);else if("string"==typeof e)u=5;else e:switch(e){case m:return mi(n.children,l,i,t);case y:u=8,l|=7;break;case h:u=8,l|=1;break;case g:return(e=fi(12,n,t,8|l)).elementType=g,e.type=g,e.expirationTime=i,e;case x:return(e=fi(13,n,t,l)).type=x,e.elementType=x,e.expirationTime=i,e;case E:return(e=fi(19,n,t,l)).elementType=E,e.expirationTime=i,e;default:if("object"==typeof e&&null!==e)switch(e.$$typeof){case b:u=10;break e;case v:u=9;break e;case T:u=11;break e;case S:u=14;break e;case k:u=16,r=null;break e;case w:u=22;break e}throw Error(c(130,null==e?e:typeof e,""))}return(t=fi(u,n,t,l)).elementType=e,t.type=r,t.expirationTime=i,t}function mi(e,t,n,r){return(e=fi(7,e,r,t)).expirationTime=n,e}function hi(e,t,n){return(e=fi(6,e,null,t)).expirationTime=n,e}function gi(e,t,n){return(t=fi(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function bi(e,t,n){this.tag=t,this.current=null,this.containerInfo=e,this.pingCache=this.pendingChildren=null,this.finishedExpirationTime=0,this.finishedWork=null,this.timeoutHandle=$,this.pendingContext=this.context=null,this.hydrate=n,this.callbackNode=null,this.callbackPriority=90,this.lastExpiredTime=this.lastPingedTime=this.nextKnownPendingLevel=this.lastSuspendedTime=this.firstSuspendedTime=this.firstPendingTime=0}function vi(e,t){var n=e.firstSuspendedTime;return e=e.lastSuspendedTime,0!==n&&n>=t&&e<=t}function yi(e,t){var n=e.firstSuspendedTime,r=e.lastSuspendedTime;n<t&&(e.firstSuspendedTime=t),(r>t||0===n)&&(e.lastSuspendedTime=t),t<=e.lastPingedTime&&(e.lastPingedTime=0),t<=e.lastExpiredTime&&(e.lastExpiredTime=0)}function Ti(e,t){t>e.firstPendingTime&&(e.firstPendingTime=t);var n=e.firstSuspendedTime;0!==n&&(t>=n?e.firstSuspendedTime=e.lastSuspendedTime=e.nextKnownPendingLevel=0:t>=e.lastSuspendedTime&&(e.lastSuspendedTime=t+1),t>e.nextKnownPendingLevel&&(e.nextKnownPendingLevel=t))}function xi(e,t){var n=e.lastExpiredTime;(0===n||n>t)&&(e.lastExpiredTime=t)}var Ei=null;function Si(e){var t=e._reactInternalFiber;if(void 0===t){if("function"==typeof e.render)throw Error(c(188));throw Error(c(268,Object.keys(e)))}return null===(e=R(t))?null:e.stateNode}function ki(e,t){null!==(e=e.memoizedState)&&null!==e.dehydrated&&e.retryTime<t&&(e.retryTime=t)}function wi(e,t){ki(e,t),(e=e.alternate)&&ki(e,t)}var zi=f.IsSomeRendererActing,Ci="function"==typeof o.unstable_flushAllWithoutAsserting,Pi=o.unstable_flushAllWithoutAsserting||function(){for(var e=!1;ei();)e=!0;return e};function Ni(t){try{Pi(),function(t){if(null===Ei)try{var n=("require"+Math.random()).slice(0,7);Ei=(e&&e[n])("timers").setImmediate}catch(e){Ei=function(e){var t=new MessageChannel;t.port1.onmessage=e,t.port2.postMessage(void 0)}}Ei(t)}((function(){Pi()?Ni(t):t()}))}catch(e){t(e)}}var _i=0,Ii=!1,Ri={__proto__:null,createContainer:function(e,t,n){return e=new bi(e,t,n),t=fi(3,null,null,2===t?7:1===t?3:0),e.current=t,t.stateNode=e,Ut(t),e},updateContainer:function(e,t,n,r){var l=t.current,i=Il(),u=Bt.suspense;i=Rl(i,l,u);e:if(n){t:{if(N(n=n._reactInternalFiber)!==n||1!==n.tag)throw Error(c(170));var a=n;do{switch(a.tag){case 3:a=a.stateNode.context;break t;case 1:if(Ae(a.type)){a=a.stateNode.__reactInternalMemoizedMergedChildContext;break t}}a=a.return}while(null!==a);throw Error(c(171))}if(1===n.tag){var o=n.type;if(Ae(o)){n=Le(n,o,a);break e}}n=a}else n=De;return null===t.context?t.context=n:t.pendingContext=n,(t=Ft(i,u)).payload={element:e},null!==(r=void 0===r?null:r)&&(t.callback=r),Wt(l,t),Ml(l,i),i},batchedEventUpdates:function(e,t){var n=ol;ol|=2;try{return e(t)}finally{0===(ol=n)&&bt()}},batchedUpdates:Hl,unbatchedUpdates:function(e,t){var n=ol;ol&=-2,ol|=8;try{return e(t)}finally{0===(ol=n)&&bt()}},deferredUpdates:function(e){return mt(97,e)},syncUpdates:function(e,t,n,r){return mt(99,e.bind(null,t,n,r))},discreteUpdates:function(e,t,n,r,l){var i=ol;ol|=4;try{return mt(98,e.bind(null,t,n,r,l))}finally{0===(ol=i)&&bt()}},flushDiscreteUpdates:function(){0==(49&ol)&&(function(){if(null!==Cl){var e=Cl;Cl=null,e.forEach((function(e,t){xi(t,e),Dl(t)})),bt()}}(),ei())},flushControlled:function(e){var t=ol;ol|=1;try{mt(99,e)}finally{0===(ol=t)&&bt()}},flushSync:jl,flushPassiveEffects:ei,IsThisRendererActing:ui,getPublicRootInstance:function(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:return M(e.child.stateNode);default:return e.child.stateNode}},attemptSynchronousHydration:function(e){switch(e.tag){case 3:var t=e.stateNode;t.hydrate&&function(e,t){xi(e,t),Dl(e),0==(48&ol)&&bt()}(t,t.firstPendingTime);break;case 13:jl((function(){return Ml(e,1073741823)})),t=yt(Il(),150,100),wi(e,t)}},attemptUserBlockingHydration:function(e){if(13===e.tag){var t=yt(Il(),150,100);Ml(e,t),wi(e,t)}},attemptContinuousHydration:function(e){13===e.tag&&(Ml(e,3),wi(e,3))},attemptHydrationAtCurrentPriority:function(e){if(13===e.tag){var t=Il();Ml(e,t=Rl(t,e,null)),wi(e,t)}},findHostInstance:Si,findHostInstanceWithWarning:function(e){return Si(e)},findHostInstanceWithNoPortals:function(e){return null===(e=function(e){if(!(e=I(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child&&4!==t.tag)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}(e))?null:20===e.tag?e.stateNode.instance:e.stateNode},shouldSuspend:function(){return!1},injectIntoDevTools:function(e){var t=e.findFiberByHostInstance;return function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);ai=function(e){try{t.onCommitFiberRoot(n,e,void 0,64==(64&e.current.effectTag))}catch(e){}},oi=function(e){try{t.onCommitFiberUnmount(n,e)}catch(e){}}}catch(e){}return!0}(r({},e,{overrideHookState:null,overrideProps:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:f.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return null===(e=R(e))?null:e.stateNode},findFiberByHostInstance:function(e){return t?t(e):null},findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null}))},act:function(e){function t(){_i--,zi.current=n,ui.current=r}!1===Ii&&(Ii=!0,console.error("act(...) is not supported in production builds of React, and might not behave as expected.")),_i++;var n=zi.current,r=ui.current;zi.current=!0,ui.current=!0;try{var l=Hl(e)}catch(e){throw t(),e}if(null!==l&&"object"==typeof l&&"function"==typeof l.then)return{then:function(e,r){l.then((function(){1<_i||!0===Ci&&!0===n?(t(),e()):Ni((function(n){t(),n?r(n):e()}))}),(function(e){t(),r(e)}))}};try{1!==_i||!1!==Ci&&!1!==n||Pi(),t()}catch(e){throw t(),e}return{then:function(e){e()}}}},Mi=Ri&&Ri.default||Ri;e.exports=Mi.default||Mi;var Qi=e.exports;return e.exports=t,Qi}}(o={path:a,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&o.path)}},o.exports),o.exports);const f=new Map,s={},d=c({supportsMutation:!0,isPrimaryRenderer:!0,now:()=>Date.now(),createInstance:()=>null,appendInitialChild(){},appendChild(){},appendChildToContainer(){},insertBefore(){},removeChild(){},removeChildFromContainer(){},commitUpdate(){},getPublicInstance:e=>e,getRootHostContext:()=>s,getChildHostContext:()=>s,createTextInstance(){},finalizeInitialChildren:()=>!1,prepareUpdate:()=>s,shouldDeprioritizeSubtree:()=>!1,prepareForCommit(){},resetAfterCommit(){},shouldSetTextContent:()=>!1,schedulePassiveEffects(e){e()},cancelPassiveEffects(e){}});exports.render=function(e,t="default"){let n=f.get(t);return n||f.set(t,n=d.createContainer(t,0,!1,null)),d.updateContainer(e,n,null,void 0),d.getPublicRootInstance(n)},exports.unmountComponentAtNode=function(e="default"){const t=f.get(e);t&&d.updateContainer(null,t,null,()=>f.delete(e))};

},{"object-assign":4,"react":10,"scheduler":13}],8:[function(require,module,exports){
(function (process){(function (){
/** @license React v17.0.2
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var _assign = require('object-assign');

// TODO: this is special because it gets imported during build.
var ReactVersion = '17.0.2';

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = 0xeac7;
var REACT_PORTAL_TYPE = 0xeaca;
exports.Fragment = 0xeacb;
exports.StrictMode = 0xeacc;
exports.Profiler = 0xead2;
var REACT_PROVIDER_TYPE = 0xeacd;
var REACT_CONTEXT_TYPE = 0xeace;
var REACT_FORWARD_REF_TYPE = 0xead0;
exports.Suspense = 0xead1;
var REACT_SUSPENSE_LIST_TYPE = 0xead8;
var REACT_MEMO_TYPE = 0xead3;
var REACT_LAZY_TYPE = 0xead4;
var REACT_BLOCK_TYPE = 0xead9;
var REACT_SERVER_BLOCK_TYPE = 0xeada;
var REACT_FUNDAMENTAL_TYPE = 0xead5;
var REACT_SCOPE_TYPE = 0xead7;
var REACT_OPAQUE_ID_TYPE = 0xeae0;
var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
var REACT_OFFSCREEN_TYPE = 0xeae2;
var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

if (typeof Symbol === 'function' && Symbol.for) {
  var symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor('react.element');
  REACT_PORTAL_TYPE = symbolFor('react.portal');
  exports.Fragment = symbolFor('react.fragment');
  exports.StrictMode = symbolFor('react.strict_mode');
  exports.Profiler = symbolFor('react.profiler');
  REACT_PROVIDER_TYPE = symbolFor('react.provider');
  REACT_CONTEXT_TYPE = symbolFor('react.context');
  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
  exports.Suspense = symbolFor('react.suspense');
  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
  REACT_MEMO_TYPE = symbolFor('react.memo');
  REACT_LAZY_TYPE = symbolFor('react.lazy');
  REACT_BLOCK_TYPE = symbolFor('react.block');
  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
  REACT_SCOPE_TYPE = symbolFor('react.scope');
  REACT_OPAQUE_ID_TYPE = symbolFor('react.opaque.id');
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
  REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
}

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  transition: 0
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var ReactDebugCurrentFrame = {};
var currentExtraStackFrame = null;
function setExtraStackFrame(stack) {
  {
    currentExtraStackFrame = stack;
  }
}

{
  ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
    {
      currentExtraStackFrame = stack;
    }
  }; // Stack implementation injected by the current renderer.


  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = ''; // Add an extra top frame while an element is being validated

    if (currentExtraStackFrame) {
      stack += currentExtraStackFrame;
    } // Delegate to the injected renderer-specific implementation


    var impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

/**
 * Used by act() to track whether you're inside an act() scope.
 */
var IsSomeRendererActing = {
  current: false
};

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner,
  IsSomeRendererActing: IsSomeRendererActing,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
}

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    printWarning('warn', format, args);
  }
}
function error(format) {
  {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    printWarning('error', format, args);
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    }

    var argsWithFormat = args.map(function (item) {
      return '' + item;
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + "." + callerName;

    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }

    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}
/**
 * This is the abstract API for an update queue.
 */


var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};

{
  Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */


function Component(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };

  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

        return undefined;
      }
    });
  };

  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

_assign(pureComponentPrototype, Component.prototype);

pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };

  {
    Object.seal(refObject);
  }

  return refObject;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
}

function getContextName(type) {
  return type.displayName || 'Context';
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case exports.Fragment:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case exports.Profiler:
      return 'Profiler';

    case exports.StrictMode:
      return 'StrictMode';

    case exports.Suspense:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        return getComponentName(type.type);

      case REACT_BLOCK_TYPE:
        return getComponentName(type._render);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentName(init(payload));
          } catch (x) {
            return null;
          }
        }
    }
  }

  return null;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    }
  };

  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
      var componentName = getComponentName(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */

function cloneElement(element, config, children) {
  if (!!(element === null || element === undefined)) {
    {
      throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
    }
  }

  var propName; // Original props are copied

  var props = _assign({}, element.props); // Reserved names are extracted


  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = key.replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */


var didWarnAboutMaps = false;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return text.replace(userProvidedKeyEscapeRegex, '$&/');
}
/**
 * Generate a key string that identifies a element within a set.
 *
 * @param {*} element A element that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */


function getElementKey(element, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof element === 'object' && element !== null && element.key != null) {
    // Explicit key
    return escape('' + element.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}

function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;

      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }

    }
  }

  if (invokeCallback) {
    var _child = children;
    var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows:

    var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

    if (Array.isArray(mappedChild)) {
      var escapedChildKey = '';

      if (childKey != null) {
        escapedChildKey = escapeUserProvidedKey(childKey) + '/';
      }

      mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
        mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
        escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
      }

      array.push(mappedChild);
    }

    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getElementKey(child, i);
      subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
    }
  } else {
    var iteratorFn = getIteratorFn(children);

    if (typeof iteratorFn === 'function') {
      var iterableChildren = children;

      {
        // Warn about using Maps as children
        if (iteratorFn === iterableChildren.entries) {
          if (!didWarnAboutMaps) {
            warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
          }

          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(iterableChildren);
      var step;
      var ii = 0;

      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getElementKey(child, ii++);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else if (type === 'object') {
      var childrenString = '' + children;

      {
        {
          throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). If you meant to render a collection of children, use an array instead." );
        }
      }
    }
  }

  return subtreeCount;
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  var count = 0;
  mapIntoArray(children, result, '', '', function (child) {
    return func.call(context, child, count++);
  });
  return result;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


function countChildren(children) {
  var n = 0;
  mapChildren(children, function () {
    n++; // Don't return anything
  });
  return n;
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  mapChildren(children, function () {
    forEachFunc.apply(this, arguments); // Don't return anything.
  }, forEachContext);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */


function toArray(children) {
  return mapChildren(children, function (child) {
    return child;
  }) || [];
}
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  if (!isValidElement(children)) {
    {
      throw Error( "React.Children.only expected to receive a single React element child." );
    }
  }

  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
        error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
      }
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;
  var hasWarnedAboutDisplayNameOnConsumer = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      },
      displayName: {
        get: function () {
          return context.displayName;
        },
        set: function (displayName) {
          if (!hasWarnedAboutDisplayNameOnConsumer) {
            warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

            hasWarnedAboutDisplayNameOnConsumer = true;
          }
        }
      }
    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

var Uninitialized = -1;
var Pending = 0;
var Resolved = 1;
var Rejected = 2;

function lazyInitializer(payload) {
  if (payload._status === Uninitialized) {
    var ctor = payload._result;
    var thenable = ctor(); // Transition to the next state.

    var pending = payload;
    pending._status = Pending;
    pending._result = thenable;
    thenable.then(function (moduleObject) {
      if (payload._status === Pending) {
        var defaultExport = moduleObject.default;

        {
          if (defaultExport === undefined) {
            error('lazy: Expected the result of a dynamic import() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
            'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
          }
        } // Transition to the next state.


        var resolved = payload;
        resolved._status = Resolved;
        resolved._result = defaultExport;
      }
    }, function (error) {
      if (payload._status === Pending) {
        // Transition to the next state.
        var rejected = payload;
        rejected._status = Rejected;
        rejected._result = error;
      }
    });
  }

  if (payload._status === Resolved) {
    return payload._result;
  } else {
    throw payload._result;
  }
}

function lazy(ctor) {
  var payload = {
    // We use these fields to store the result.
    _status: -1,
    _result: ctor
  };
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer
  };

  {
    // In production, this would just set it on the object.
    var defaultProps;
    var propTypes; // $FlowFixMe

    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          defaultProps = newDefaultProps; // Match production behavior more closely:
          // $FlowFixMe

          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          propTypes = newPropTypes; // Match production behavior more closely:
          // $FlowFixMe

          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      if (render.length !== 0 && render.length !== 2) {
        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
      }
    }
  }

  var elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };

  {
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name;

        if (render.displayName == null) {
          render.displayName = name;
        }
      }
    });
  }

  return elementType;
}

// Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

var enableScopeAPI = false; // Experimental Create Event Handle API.

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
      return true;
    }
  }

  return false;
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }

  var elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };

  {
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name;

        if (type.displayName == null) {
          type.displayName = name;
        }
      }
    });
  }

  return elementType;
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;

  if (!(dispatcher !== null)) {
    {
      throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem." );
    }
  }

  return dispatcher;
}

function useContext(Context, unstable_observedBits) {
  var dispatcher = resolveDispatcher();

  {
    if (unstable_observedBits !== undefined) {
      error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://reactjs.org/link/rules-of-hooks' : '');
    } // TODO: add a more generic warning for invalid values.


    if (Context._context !== undefined) {
      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.

      if (realContext.Consumer === Context) {
        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }

  return dispatcher.useContext(Context, unstable_observedBits);
}
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
function useEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function useLayoutEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
function useCallback(callback, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
function useMemo(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
function useImperativeHandle(ref, create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: _assign({}, props, {
          value: prevLog
        }),
        info: _assign({}, props, {
          value: prevInfo
        }),
        warn: _assign({}, props, {
          value: prevWarn
        }),
        error: _assign({}, props, {
          value: prevError
        }),
        group: _assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: _assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: _assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if (!fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher$1.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher$1.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case exports.Suspense:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_BLOCK_TYPE:
        return describeFunctionComponentFrame(type._render);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var loggedTypeFailures = {};
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(Object.prototype.hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      setExtraStackFrame(stack);
    } else {
      setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);

    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }

  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }

  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }

  return '';
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

    if (parentName) {
      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
    }
  }

  return info;
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }

  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.

  var childOwner = '';

  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
  }

  {
    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];

      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);

    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;

        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentName(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentName(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  if (!validType) {
    var info = '';

    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString;

    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    {
      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }
  }

  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.

  if (element == null) {
    return element;
  } // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)


  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === exports.Fragment) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
var didWarnAboutDeprecatedCreateFactory = false;
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;

  {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;

      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
    } // Legacy hook: remove it


    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);

  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }

  validatePropTypes(newElement);
  return newElement;
}

{

  try {
    var frozenObject = Object.freeze({});
    /* eslint-disable no-new */

    new Map([[frozenObject, null]]);
    new Set([frozenObject]);
    /* eslint-enable no-new */
  } catch (e) {
  }
}

var createElement$1 =  createElementWithValidation ;
var cloneElement$1 =  cloneElementWithValidation ;
var createFactory =  createFactoryWithValidation ;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray: toArray,
  only: onlyChild
};

exports.Children = Children;
exports.Component = Component;
exports.PureComponent = PureComponent;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createFactory = createFactory;
exports.createRef = createRef;
exports.forwardRef = forwardRef;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useEffect = useEffect;
exports.useImperativeHandle = useImperativeHandle;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.version = ReactVersion;
  })();
}

}).call(this)}).call(this,require('_process'))

},{"_process":5,"object-assign":4}],9:[function(require,module,exports){
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var l=require("object-assign"),n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy")}var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return"function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
function K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return"object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};
exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,
key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};exports.forwardRef=function(a){return{$$typeof:t,render:a}};exports.isValidElement=L;
exports.lazy=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.2";

},{"object-assign":4}],10:[function(require,module,exports){
(function (process){(function (){
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}

}).call(this)}).call(this,require('_process'))

},{"./cjs/react.development.js":8,"./cjs/react.production.min.js":9,"_process":5}],11:[function(require,module,exports){
(function (process){(function (){
/** @license React v0.20.2
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var enableSchedulerDebugging = false;
var enableProfiling = false;

var requestHostCallback;
var requestHostTimeout;
var cancelHostTimeout;
var requestPaint;
var hasPerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

if (hasPerformanceNow) {
  var localPerformance = performance;

  exports.unstable_now = function () {
    return localPerformance.now();
  };
} else {
  var localDate = Date;
  var initialTime = localDate.now();

  exports.unstable_now = function () {
    return localDate.now() - initialTime;
  };
}

if ( // If Scheduler runs in a non-DOM environment, it falls back to a naive
// implementation using setTimeout.
typeof window === 'undefined' || // Check if MessageChannel is supported, too.
typeof MessageChannel !== 'function') {
  // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
  // fallback to a naive implementation.
  var _callback = null;
  var _timeoutID = null;

  var _flushCallback = function () {
    if (_callback !== null) {
      try {
        var currentTime = exports.unstable_now();
        var hasRemainingTime = true;

        _callback(hasRemainingTime, currentTime);

        _callback = null;
      } catch (e) {
        setTimeout(_flushCallback, 0);
        throw e;
      }
    }
  };

  requestHostCallback = function (cb) {
    if (_callback !== null) {
      // Protect against re-entrancy.
      setTimeout(requestHostCallback, 0, cb);
    } else {
      _callback = cb;
      setTimeout(_flushCallback, 0);
    }
  };

  requestHostTimeout = function (cb, ms) {
    _timeoutID = setTimeout(cb, ms);
  };

  cancelHostTimeout = function () {
    clearTimeout(_timeoutID);
  };

  exports.unstable_shouldYield = function () {
    return false;
  };

  requestPaint = exports.unstable_forceFrameRate = function () {};
} else {
  // Capture local references to native APIs, in case a polyfill overrides them.
  var _setTimeout = window.setTimeout;
  var _clearTimeout = window.clearTimeout;

  if (typeof console !== 'undefined') {
    // TODO: Scheduler no longer requires these methods to be polyfilled. But
    // maybe we want to continue warning if they don't exist, to preserve the
    // option to rely on it in the future?
    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;

    if (typeof requestAnimationFrame !== 'function') {
      // Using console['error'] to evade Babel and ESLint
      console['error']("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://reactjs.org/link/react-polyfills');
    }

    if (typeof cancelAnimationFrame !== 'function') {
      // Using console['error'] to evade Babel and ESLint
      console['error']("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://reactjs.org/link/react-polyfills');
    }
  }

  var isMessageLoopRunning = false;
  var scheduledHostCallback = null;
  var taskTimeoutID = -1; // Scheduler periodically yields in case there is other work on the main
  // thread, like user events. By default, it yields multiple times per frame.
  // It does not attempt to align with frame boundaries, since most tasks don't
  // need to be frame aligned; for those that do, use requestAnimationFrame.

  var yieldInterval = 5;
  var deadline = 0; // TODO: Make this configurable

  {
    // `isInputPending` is not available. Since we have no way of knowing if
    // there's pending input, always yield at the end of the frame.
    exports.unstable_shouldYield = function () {
      return exports.unstable_now() >= deadline;
    }; // Since we yield every frame regardless, `requestPaint` has no effect.


    requestPaint = function () {};
  }

  exports.unstable_forceFrameRate = function (fps) {
    if (fps < 0 || fps > 125) {
      // Using console['error'] to evade Babel and ESLint
      console['error']('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing frame rates higher than 125 fps is not supported');
      return;
    }

    if (fps > 0) {
      yieldInterval = Math.floor(1000 / fps);
    } else {
      // reset the framerate
      yieldInterval = 5;
    }
  };

  var performWorkUntilDeadline = function () {
    if (scheduledHostCallback !== null) {
      var currentTime = exports.unstable_now(); // Yield after `yieldInterval` ms, regardless of where we are in the vsync
      // cycle. This means there's always time remaining at the beginning of
      // the message event.

      deadline = currentTime + yieldInterval;
      var hasTimeRemaining = true;

      try {
        var hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);

        if (!hasMoreWork) {
          isMessageLoopRunning = false;
          scheduledHostCallback = null;
        } else {
          // If there's more work, schedule the next message event at the end
          // of the preceding one.
          port.postMessage(null);
        }
      } catch (error) {
        // If a scheduler task throws, exit the current browser task so the
        // error can be observed.
        port.postMessage(null);
        throw error;
      }
    } else {
      isMessageLoopRunning = false;
    } // Yielding to the browser will give it a chance to paint, so we can
  };

  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;

  requestHostCallback = function (callback) {
    scheduledHostCallback = callback;

    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true;
      port.postMessage(null);
    }
  };

  requestHostTimeout = function (callback, ms) {
    taskTimeoutID = _setTimeout(function () {
      callback(exports.unstable_now());
    }, ms);
  };

  cancelHostTimeout = function () {
    _clearTimeout(taskTimeoutID);

    taskTimeoutID = -1;
  };
}

function push(heap, node) {
  var index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}
function peek(heap) {
  var first = heap[0];
  return first === undefined ? null : first;
}
function pop(heap) {
  var first = heap[0];

  if (first !== undefined) {
    var last = heap.pop();

    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }

    return first;
  } else {
    return null;
  }
}

function siftUp(heap, node, i) {
  var index = i;

  while (true) {
    var parentIndex = index - 1 >>> 1;
    var parent = heap[parentIndex];

    if (parent !== undefined && compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  var index = i;
  var length = heap.length;

  while (index < length) {
    var leftIndex = (index + 1) * 2 - 1;
    var left = heap[leftIndex];
    var rightIndex = leftIndex + 1;
    var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  var diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

function markTaskErrored(task, ms) {
}

/* eslint-disable no-var */
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111

var maxSigned31BitInt = 1073741823; // Times out immediately

var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Tasks are stored on a min heap

var taskQueue = [];
var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.
var currentTask = null;
var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrancy.

var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;

function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  var timer = peek(timerQueue);

  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      // Remaining timers are pending.
      return;
    }

    timer = peek(timerQueue);
  }
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

function flushWork(hasTimeRemaining, initialTime) {


  isHostCallbackScheduled = false;

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  var previousPriorityLevel = currentPriorityLevel;

  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          var currentTime = exports.unstable_now();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }

        throw error;
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  var currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  while (currentTask !== null && !(enableSchedulerDebugging )) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || exports.unstable_shouldYield())) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }

    var callback = currentTask.callback;

    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      var continuationCallback = callback(didUserCallbackTimeout);
      currentTime = exports.unstable_now();

      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
      } else {

        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }

      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  } // Return whether there's additional work


  if (currentTask !== null) {
    return true;
  } else {
    var firstTimer = peek(timerQueue);

    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }

    return false;
  }
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;

    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_next(eventHandler) {
  var priorityLevel;

  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // Shift down to normal priority
      priorityLevel = NormalPriority;
      break;

    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function () {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now();
  var startTime;

  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;

    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      } // Schedule a timeout.


      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // wait until the next time we yield.


    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

function unstable_pauseExecution() {
}

function unstable_continueExecution() {

  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}

function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}

function unstable_cancelCallback(task) {
  // remove from the queue because you can't remove arbitrary nodes from an
  // array based heap, only the first one.)


  task.callback = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

var unstable_requestPaint = requestPaint;
var unstable_Profiling =  null;

exports.unstable_IdlePriority = IdlePriority;
exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_Profiling = unstable_Profiling;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
exports.unstable_next = unstable_next;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_requestPaint = unstable_requestPaint;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_wrapCallback = unstable_wrapCallback;
  })();
}

}).call(this)}).call(this,require('_process'))

},{"_process":5}],12:[function(require,module,exports){
/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}
if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0))};g=function(a,b){u=setTimeout(a,b)};h=function(){clearTimeout(u)};exports.unstable_shouldYield=function(){return!1};k=exports.unstable_forceFrameRate=function(){}}else{var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null)}catch(b){throw G.postMessage(null),b;}}else A=!1};f=function(a){B=a;A||(A=!0,G.postMessage(null))};g=function(a,b){C=
x(function(){a(exports.unstable_now())},b)};h=function(){y(C);C=-1}}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M)}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else{var b=J(M);null!==b&&g(U,b.startTime-a)}}
function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b)}else K(L);O=J(L)}if(null!==O)var m=!0;else{var n=J(M);null!==n&&g(U,n.startTime-b);m=!1}return m}finally{O=null,P=c,Q=!1}}var W=k;exports.unstable_IdlePriority=5;
exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V))};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P}var c=P;P=b;try{return a()}finally{P=c}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=P;P=a;try{return b()}finally{P=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c}}};

},{}],13:[function(require,module,exports){
(function (process){(function (){
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/scheduler.production.min.js');
} else {
  module.exports = require('./cjs/scheduler.development.js');
}

}).call(this)}).call(this,require('_process'))

},{"./cjs/scheduler.development.js":11,"./cjs/scheduler.production.min.js":12,"_process":5}],14:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vanilla = require('valtio/vanilla');
var react = require('react');
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

}).call(this)}).call(this,require('_process'))

},{"_process":5,"proxy-compare":6,"react":10,"valtio/vanilla":16}],15:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var proxyCompare = require('proxy-compare');
var vanilla = require('valtio/vanilla');

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

},{"_process":5,"proxy-compare":6,"valtio/vanilla":16}],16:[function(require,module,exports){
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

},{"_process":5,"proxy-compare":6}],17:[function(require,module,exports){
// browser.build-harness.main/React
const React = require("react")

// browser.build-harness.main/ReactNIL
const ReactNIL = require("react-nil")

// browser.build-harness.main/valtio
const valtio = require("valtio")

// browser.build-harness.main/valtioUtils
const valtioUtils = require("valtio/utils")

// browser.build-harness.main/jotai
const jotai = require("jotai")

// browser.build-harness.main/jotaiUtils
const jotaiUtils = require("jotai/utils")

// browser.build-harness.main/jotaiValtio
const jotaiValtio = require("jotai/valtio")

// browser.build-harness.main/__init__
globalThis["React"] = React;
globalThis["ReactNIL"] = ReactNIL;
globalThis["valtio"] = valtio;
globalThis["valtioUtils"] = valtioUtils;
globalThis["jotai"] = jotai;
globalThis["jotaiUtils"] = jotaiUtils;
globalThis["jotaiValtio"] = jotaiValtio;
},{"jotai":1,"jotai/utils":2,"jotai/valtio":3,"react":10,"react-nil":7,"valtio":14,"valtio/utils":15}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rYnJvd3Nlci1wYWNrQDYuMS4wL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK2pvdGFpQDAuMTYuNF9yZWFjdEAxNy4wLjIrdmFsdGlvQDEuMC40L25vZGVfbW9kdWxlcy9qb3RhaS9ub2RlX21vZHVsZXMvam90YWkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK2pvdGFpQDAuMTYuNF9yZWFjdEAxNy4wLjIrdmFsdGlvQDEuMC40L25vZGVfbW9kdWxlcy9qb3RhaS91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20ram90YWlAMC4xNi40X3JlYWN0QDE3LjAuMit2YWx0aW9AMS4wLjQvbm9kZV9tb2R1bGVzL2pvdGFpL3ZhbHRpby5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rb2JqZWN0LWFzc2lnbkA0LjEuMS9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rcHJvY2Vzc0AwLjExLjEwL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK3Byb3h5LWNvbXBhcmVAMS4xLjYvbm9kZV9tb2R1bGVzL3Byb3h5LWNvbXBhcmUvZGlzdC9pbmRleC51bWQuanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK3JlYWN0LW5pbEAwLjAuM19yZWFjdEAxNy4wLjIvbm9kZV9tb2R1bGVzL3JlYWN0LW5pbC9kaXN0L2luZGV4LmNqcy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rcmVhY3RAMTcuMC4yL25vZGVfbW9kdWxlcy9yZWFjdC9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK3JlYWN0QDE3LjAuMi9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzIiwibm9kZV9tb2R1bGVzLy5wbnBtL3JlZ2lzdHJ5Lm5sYXJrLmNvbStyZWFjdEAxNy4wLjIvbm9kZV9tb2R1bGVzL3JlYWN0L25vZGVfbW9kdWxlcy9yZWFjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rc2NoZWR1bGVyQDAuMjAuMi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2Nqcy9zY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK3NjaGVkdWxlckAwLjIwLjIvbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzIiwibm9kZV9tb2R1bGVzLy5wbnBtL3JlZ2lzdHJ5Lm5sYXJrLmNvbStzY2hlZHVsZXJAMC4yMC4yL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9yZWdpc3RyeS5ubGFyay5jb20rdmFsdGlvQDEuMC40X3JlYWN0QDE3LjAuMi9ub2RlX21vZHVsZXMvdmFsdGlvL25vZGVfbW9kdWxlcy92YWx0aW8vaW5kZXguanMiLCJub2RlX21vZHVsZXMvLnBucG0vcmVnaXN0cnkubmxhcmsuY29tK3ZhbHRpb0AxLjAuNF9yZWFjdEAxNy4wLjIvbm9kZV9tb2R1bGVzL3ZhbHRpby9ub2RlX21vZHVsZXMvdmFsdGlvL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzLy5wbnBtL3JlZ2lzdHJ5Lm5sYXJrLmNvbSt2YWx0aW9AMS4wLjRfcmVhY3RAMTcuMC4yL25vZGVfbW9kdWxlcy92YWx0aW8vdmFuaWxsYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqNkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3eEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIHJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UobywgYWxsb3dBcnJheUxpa2UpIHtcbiAgdmFyIGl0O1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8IG9bU3ltYm9sLml0ZXJhdG9yXSA9PSBudWxsKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgaWYgKGl0KSBvID0gaXQ7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHtcbiAgICAgICAgICBkb25lOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IG9baSsrXVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG4gIH1cblxuICBpdCA9IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xuICByZXR1cm4gaXQubmV4dC5iaW5kKGl0KTtcbn1cblxudmFyIGhhc0luaXRpYWxWYWx1ZSA9IGZ1bmN0aW9uIGhhc0luaXRpYWxWYWx1ZShhdG9tKSB7XG4gIHJldHVybiAnaW5pdCcgaW4gYXRvbTtcbn07XG5cbnZhciBJU19FUVVBTF9QUk9NSVNFID0gU3ltYm9sKCk7XG52YXIgSU5URVJSVVBUX1BST01JU0UgPSBTeW1ib2woKTtcblxudmFyIGlzSW50ZXJydXB0YWJsZVByb21pc2UgPSBmdW5jdGlvbiBpc0ludGVycnVwdGFibGVQcm9taXNlKHByb21pc2UpIHtcbiAgcmV0dXJuICEhcHJvbWlzZVtJTlRFUlJVUFRfUFJPTUlTRV07XG59O1xuXG52YXIgY3JlYXRlSW50ZXJydXB0YWJsZVByb21pc2UgPSBmdW5jdGlvbiBjcmVhdGVJbnRlcnJ1cHRhYmxlUHJvbWlzZShwcm9taXNlKSB7XG4gIHZhciBpbnRlcnJ1cHQ7XG4gIHZhciBpbnRlcnJ1cHRhYmxlUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpbnRlcnJ1cHQgPSByZXNvbHZlO1xuICAgIHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICB9KTtcblxuICBpbnRlcnJ1cHRhYmxlUHJvbWlzZVtJU19FUVVBTF9QUk9NSVNFXSA9IGZ1bmN0aW9uIChwKSB7XG4gICAgcmV0dXJuIHAgPT09IGludGVycnVwdGFibGVQcm9taXNlIHx8IHAgPT09IHByb21pc2U7XG4gIH07XG5cbiAgaW50ZXJydXB0YWJsZVByb21pc2VbSU5URVJSVVBUX1BST01JU0VdID0gaW50ZXJydXB0O1xuICByZXR1cm4gaW50ZXJydXB0YWJsZVByb21pc2U7XG59O1xuXG52YXIgY3JlYXRlU3RhdGUgPSBmdW5jdGlvbiBjcmVhdGVTdGF0ZShpbml0aWFsVmFsdWVzLCBuZXdBdG9tUmVjZWl2ZXIpIHtcbiAgdmFyIHN0YXRlID0ge1xuICAgIG46IG5ld0F0b21SZWNlaXZlcixcbiAgICB2OiAwLFxuICAgIGE6IG5ldyBXZWFrTWFwKCksXG4gICAgbTogbmV3IFdlYWtNYXAoKSxcbiAgICBwOiBuZXcgU2V0KClcbiAgfTtcblxuICBpZiAoaW5pdGlhbFZhbHVlcykge1xuICAgIGZvciAodmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UoaW5pdGlhbFZhbHVlcyksIF9zdGVwOyAhKF9zdGVwID0gX2l0ZXJhdG9yKCkpLmRvbmU7KSB7XG4gICAgICB2YXIgX3N0ZXAkdmFsdWUgPSBfc3RlcC52YWx1ZSxcbiAgICAgICAgICBhdG9tID0gX3N0ZXAkdmFsdWVbMF0sXG4gICAgICAgICAgdmFsdWUgPSBfc3RlcCR2YWx1ZVsxXTtcbiAgICAgIHZhciBhdG9tU3RhdGUgPSB7XG4gICAgICAgIHY6IHZhbHVlLFxuICAgICAgICByOiAwLFxuICAgICAgICBkOiBuZXcgTWFwKClcbiAgICAgIH07XG5cbiAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBPYmplY3QuZnJlZXplKGF0b21TdGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIHN0YXRlLmEuc2V0KGF0b20sIGF0b21TdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxudmFyIGdldEF0b21TdGF0ZSA9IGZ1bmN0aW9uIGdldEF0b21TdGF0ZShzdGF0ZSwgYXRvbSkge1xuICByZXR1cm4gc3RhdGUuYS5nZXQoYXRvbSk7XG59O1xuXG52YXIgd2lwQXRvbVN0YXRlID0gZnVuY3Rpb24gd2lwQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBkZXBlbmRlbmNpZXMpIHtcbiAgdmFyIGF0b21TdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYXRvbSk7XG5cbiAgdmFyIG5leHRBdG9tU3RhdGUgPSBfZXh0ZW5kcyh7XG4gICAgcjogMFxuICB9LCBhdG9tU3RhdGUsIHtcbiAgICBkOiBkZXBlbmRlbmNpZXMgPyBuZXcgTWFwKEFycmF5LmZyb20oZGVwZW5kZW5jaWVzKS5tYXAoZnVuY3Rpb24gKGEpIHtcbiAgICAgIHZhciBfZ2V0QXRvbVN0YXRlJHIsIF9nZXRBdG9tU3RhdGU7XG5cbiAgICAgIHJldHVybiBbYSwgKF9nZXRBdG9tU3RhdGUkciA9IChfZ2V0QXRvbVN0YXRlID0gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9nZXRBdG9tU3RhdGUucikgIT0gbnVsbCA/IF9nZXRBdG9tU3RhdGUkciA6IDBdO1xuICAgIH0pKSA6IGF0b21TdGF0ZSA/IGF0b21TdGF0ZS5kIDogbmV3IE1hcCgpXG4gIH0pO1xuXG4gIHJldHVybiBbbmV4dEF0b21TdGF0ZSwgYXRvbVN0YXRlID09IG51bGwgPyB2b2lkIDAgOiBhdG9tU3RhdGUuZF07XG59O1xuXG52YXIgc2V0QXRvbVZhbHVlID0gZnVuY3Rpb24gc2V0QXRvbVZhbHVlKHN0YXRlLCBhdG9tLCB2YWx1ZSwgZGVwZW5kZW5jaWVzLCBwcm9taXNlKSB7XG4gIHZhciBfYXRvbVN0YXRlJHA7XG5cbiAgdmFyIF93aXBBdG9tU3RhdGUgPSB3aXBBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGRlcGVuZGVuY2llcyksXG4gICAgICBhdG9tU3RhdGUgPSBfd2lwQXRvbVN0YXRlWzBdLFxuICAgICAgcHJldkRlcGVuZGVuY2llcyA9IF93aXBBdG9tU3RhdGVbMV07XG5cbiAgaWYgKHByb21pc2UgJiYgISgoX2F0b21TdGF0ZSRwID0gYXRvbVN0YXRlLnApICE9IG51bGwgJiYgX2F0b21TdGF0ZSRwW0lTX0VRVUFMX1BST01JU0VdKHByb21pc2UpKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF0b21TdGF0ZS5jID09IG51bGwgPyB2b2lkIDAgOiBhdG9tU3RhdGUuYygpO1xuICBkZWxldGUgYXRvbVN0YXRlLmU7XG4gIGRlbGV0ZSBhdG9tU3RhdGUucDtcbiAgZGVsZXRlIGF0b21TdGF0ZS5jO1xuICBkZWxldGUgYXRvbVN0YXRlLmk7XG5cbiAgaWYgKCEoJ3YnIGluIGF0b21TdGF0ZSkgfHwgIU9iamVjdC5pcyhhdG9tU3RhdGUudiwgdmFsdWUpKSB7XG4gICAgYXRvbVN0YXRlLnYgPSB2YWx1ZTtcbiAgICArK2F0b21TdGF0ZS5yO1xuICB9XG5cbiAgY29tbWl0QXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBhdG9tU3RhdGUpO1xuICBtb3VudERlcGVuZGVuY2llcyhzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlLCBwcmV2RGVwZW5kZW5jaWVzKTtcbn07XG5cbnZhciBzZXRBdG9tUmVhZEVycm9yID0gZnVuY3Rpb24gc2V0QXRvbVJlYWRFcnJvcihzdGF0ZSwgYXRvbSwgZXJyb3IsIGRlcGVuZGVuY2llcywgcHJvbWlzZSkge1xuICB2YXIgX2F0b21TdGF0ZSRwMjtcblxuICB2YXIgX3dpcEF0b21TdGF0ZTIgPSB3aXBBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGRlcGVuZGVuY2llcyksXG4gICAgICBhdG9tU3RhdGUgPSBfd2lwQXRvbVN0YXRlMlswXSxcbiAgICAgIHByZXZEZXBlbmRlbmNpZXMgPSBfd2lwQXRvbVN0YXRlMlsxXTtcblxuICBpZiAocHJvbWlzZSAmJiAhKChfYXRvbVN0YXRlJHAyID0gYXRvbVN0YXRlLnApICE9IG51bGwgJiYgX2F0b21TdGF0ZSRwMltJU19FUVVBTF9QUk9NSVNFXShwcm9taXNlKSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhdG9tU3RhdGUuYyA9PSBudWxsID8gdm9pZCAwIDogYXRvbVN0YXRlLmMoKTtcbiAgZGVsZXRlIGF0b21TdGF0ZS5wO1xuICBkZWxldGUgYXRvbVN0YXRlLmM7XG4gIGRlbGV0ZSBhdG9tU3RhdGUuaTtcbiAgYXRvbVN0YXRlLmUgPSBlcnJvcjtcbiAgY29tbWl0QXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBhdG9tU3RhdGUpO1xuICBtb3VudERlcGVuZGVuY2llcyhzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlLCBwcmV2RGVwZW5kZW5jaWVzKTtcbn07XG5cbnZhciBzZXRBdG9tUmVhZFByb21pc2UgPSBmdW5jdGlvbiBzZXRBdG9tUmVhZFByb21pc2Uoc3RhdGUsIGF0b20sIHByb21pc2UsIGRlcGVuZGVuY2llcykge1xuICB2YXIgX2F0b21TdGF0ZSRwMztcblxuICB2YXIgX3dpcEF0b21TdGF0ZTMgPSB3aXBBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGRlcGVuZGVuY2llcyksXG4gICAgICBhdG9tU3RhdGUgPSBfd2lwQXRvbVN0YXRlM1swXSxcbiAgICAgIHByZXZEZXBlbmRlbmNpZXMgPSBfd2lwQXRvbVN0YXRlM1sxXTtcblxuICBpZiAoKF9hdG9tU3RhdGUkcDMgPSBhdG9tU3RhdGUucCkgIT0gbnVsbCAmJiBfYXRvbVN0YXRlJHAzW0lTX0VRVUFMX1BST01JU0VdKHByb21pc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXRvbVN0YXRlLmMgPT0gbnVsbCA/IHZvaWQgMCA6IGF0b21TdGF0ZS5jKCk7XG5cbiAgaWYgKGlzSW50ZXJydXB0YWJsZVByb21pc2UocHJvbWlzZSkpIHtcbiAgICBhdG9tU3RhdGUucCA9IHByb21pc2U7XG4gICAgZGVsZXRlIGF0b21TdGF0ZS5jO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcnJ1cHRhYmxlUHJvbWlzZSA9IGNyZWF0ZUludGVycnVwdGFibGVQcm9taXNlKHByb21pc2UpO1xuICAgIGF0b21TdGF0ZS5wID0gaW50ZXJydXB0YWJsZVByb21pc2U7XG4gICAgYXRvbVN0YXRlLmMgPSBpbnRlcnJ1cHRhYmxlUHJvbWlzZVtJTlRFUlJVUFRfUFJPTUlTRV07XG4gIH1cblxuICBjb21taXRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSk7XG4gIG1vdW50RGVwZW5kZW5jaWVzKHN0YXRlLCBhdG9tLCBhdG9tU3RhdGUsIHByZXZEZXBlbmRlbmNpZXMpO1xufTtcblxudmFyIHNldEF0b21JbnZhbGlkYXRlZCA9IGZ1bmN0aW9uIHNldEF0b21JbnZhbGlkYXRlZChzdGF0ZSwgYXRvbSkge1xuICB2YXIgX3dpcEF0b21TdGF0ZTQgPSB3aXBBdG9tU3RhdGUoc3RhdGUsIGF0b20pLFxuICAgICAgYXRvbVN0YXRlID0gX3dpcEF0b21TdGF0ZTRbMF07XG5cbiAgYXRvbVN0YXRlLmMgPT0gbnVsbCA/IHZvaWQgMCA6IGF0b21TdGF0ZS5jKCk7XG4gIGRlbGV0ZSBhdG9tU3RhdGUucDtcbiAgZGVsZXRlIGF0b21TdGF0ZS5jO1xuICBhdG9tU3RhdGUuaSA9IGF0b21TdGF0ZS5yO1xuICBjb21taXRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSk7XG59O1xuXG52YXIgc2V0QXRvbVdyaXRlUHJvbWlzZSA9IGZ1bmN0aW9uIHNldEF0b21Xcml0ZVByb21pc2Uoc3RhdGUsIGF0b20sIHByb21pc2UpIHtcbiAgdmFyIF93aXBBdG9tU3RhdGU1ID0gd2lwQXRvbVN0YXRlKHN0YXRlLCBhdG9tKSxcbiAgICAgIGF0b21TdGF0ZSA9IF93aXBBdG9tU3RhdGU1WzBdO1xuXG4gIGlmIChwcm9taXNlKSB7XG4gICAgYXRvbVN0YXRlLncgPSBwcm9taXNlO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBhdG9tU3RhdGUudztcbiAgfVxuXG4gIGNvbW1pdEF0b21TdGF0ZShzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlKTtcbn07XG5cbnZhciBzY2hlZHVsZVJlYWRBdG9tU3RhdGUgPSBmdW5jdGlvbiBzY2hlZHVsZVJlYWRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIHByb21pc2UpIHtcbiAgcHJvbWlzZS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICByZWFkQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCB0cnVlKTtcbiAgfSk7XG59O1xuXG52YXIgcmVhZEF0b21TdGF0ZSA9IGZ1bmN0aW9uIHJlYWRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGZvcmNlKSB7XG4gIGlmICghZm9yY2UpIHtcbiAgICB2YXIgYXRvbVN0YXRlID0gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhdG9tKTtcblxuICAgIGlmIChhdG9tU3RhdGUpIHtcbiAgICAgIGF0b21TdGF0ZS5kLmZvckVhY2goZnVuY3Rpb24gKF8sIGEpIHtcbiAgICAgICAgaWYgKGEgIT09IGF0b20pIHtcbiAgICAgICAgICB2YXIgYVN0YXRlID0gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhKTtcblxuICAgICAgICAgIGlmIChhU3RhdGUgJiYgIWFTdGF0ZS5lICYmICFhU3RhdGUucCAmJiBhU3RhdGUuciA9PT0gYVN0YXRlLmkpIHtcbiAgICAgICAgICAgICAgcmVhZEF0b21TdGF0ZShzdGF0ZSwgYSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoQXJyYXkuZnJvbShhdG9tU3RhdGUuZC5lbnRyaWVzKCkpLmV2ZXJ5KGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgIHZhciBhID0gX3JlZlswXSxcbiAgICAgICAgICAgIHIgPSBfcmVmWzFdO1xuICAgICAgICB2YXIgYVN0YXRlID0gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhKTtcbiAgICAgICAgcmV0dXJuIGFTdGF0ZSAmJiAhYVN0YXRlLmUgJiYgIWFTdGF0ZS5wICYmIGFTdGF0ZS5yICE9PSBhU3RhdGUuaSAmJiBhU3RhdGUuciA9PT0gcjtcbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiBhdG9tU3RhdGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGVycm9yO1xuICB2YXIgcHJvbWlzZTtcbiAgdmFyIHZhbHVlO1xuICB2YXIgZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuXG4gIHRyeSB7XG4gICAgdmFyIHByb21pc2VPclZhbHVlID0gYXRvbS5yZWFkKGZ1bmN0aW9uIChhKSB7XG4gICAgICBkZXBlbmRlbmNpZXMuYWRkKGEpO1xuXG4gICAgICBpZiAoYSAhPT0gYXRvbSkge1xuICAgICAgICB2YXIgX2FTdGF0ZSA9IHJlYWRBdG9tU3RhdGUoc3RhdGUsIGEpO1xuXG4gICAgICAgIGlmIChfYVN0YXRlLmUpIHtcbiAgICAgICAgICB0aHJvdyBfYVN0YXRlLmU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2FTdGF0ZS5wKSB7XG4gICAgICAgICAgdGhyb3cgX2FTdGF0ZS5wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9hU3RhdGUudjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFTdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYSk7XG5cbiAgICAgIGlmIChhU3RhdGUpIHtcbiAgICAgICAgaWYgKGFTdGF0ZS5wKSB7XG4gICAgICAgICAgdGhyb3cgYVN0YXRlLnA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYVN0YXRlLnY7XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNJbml0aWFsVmFsdWUoYSkpIHtcbiAgICAgICAgcmV0dXJuIGEuaW5pdDtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBhdG9tIGluaXQnKTtcbiAgICB9KTtcblxuICAgIGlmIChwcm9taXNlT3JWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlT3JWYWx1ZS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBzZXRBdG9tVmFsdWUoc3RhdGUsIGF0b20sIHZhbHVlLCBkZXBlbmRlbmNpZXMsIHByb21pc2UpO1xuICAgICAgICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgc2NoZWR1bGVSZWFkQXRvbVN0YXRlKHN0YXRlLCBhdG9tLCBlKTtcbiAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEF0b21SZWFkRXJyb3Ioc3RhdGUsIGF0b20sIGUgaW5zdGFuY2VvZiBFcnJvciA/IGUgOiBuZXcgRXJyb3IoZSksIGRlcGVuZGVuY2llcywgcHJvbWlzZSk7XG4gICAgICAgIGZsdXNoUGVuZGluZyhzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBwcm9taXNlT3JWYWx1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yT3JQcm9taXNlKSB7XG4gICAgaWYgKGVycm9yT3JQcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgcHJvbWlzZSA9IGVycm9yT3JQcm9taXNlO1xuICAgIH0gZWxzZSBpZiAoZXJyb3JPclByb21pc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgZXJyb3IgPSBlcnJvck9yUHJvbWlzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3JPclByb21pc2UpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlcnJvcikge1xuICAgIHNldEF0b21SZWFkRXJyb3Ioc3RhdGUsIGF0b20sIGVycm9yLCBkZXBlbmRlbmNpZXMpO1xuICB9IGVsc2UgaWYgKHByb21pc2UpIHtcbiAgICBzZXRBdG9tUmVhZFByb21pc2Uoc3RhdGUsIGF0b20sIHByb21pc2UsIGRlcGVuZGVuY2llcyk7XG4gIH0gZWxzZSB7XG4gICAgc2V0QXRvbVZhbHVlKHN0YXRlLCBhdG9tLCB2YWx1ZSwgZGVwZW5kZW5jaWVzKTtcbiAgfVxuXG4gIHJldHVybiBnZXRBdG9tU3RhdGUoc3RhdGUsIGF0b20pO1xufTtcblxudmFyIHJlYWRBdG9tID0gZnVuY3Rpb24gcmVhZEF0b20oc3RhdGUsIHJlYWRpbmdBdG9tKSB7XG4gIHZhciBhdG9tU3RhdGUgPSByZWFkQXRvbVN0YXRlKHN0YXRlLCByZWFkaW5nQXRvbSk7XG4gIHN0YXRlLnAuZGVsZXRlKHJlYWRpbmdBdG9tKTtcbiAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbiAgcmV0dXJuIGF0b21TdGF0ZTtcbn07XG5cbnZhciBhZGRBdG9tID0gZnVuY3Rpb24gYWRkQXRvbShzdGF0ZSwgYWRkaW5nQXRvbSkge1xuICB2YXIgbW91bnRlZCA9IHN0YXRlLm0uZ2V0KGFkZGluZ0F0b20pO1xuXG4gIGlmICghbW91bnRlZCkge1xuICAgIG1vdW50ZWQgPSBtb3VudEF0b20oc3RhdGUsIGFkZGluZ0F0b20pO1xuICB9XG5cbiAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbiAgcmV0dXJuIG1vdW50ZWQ7XG59O1xuXG52YXIgY2FuVW5tb3VudEF0b20gPSBmdW5jdGlvbiBjYW5Vbm1vdW50QXRvbShhdG9tLCBtb3VudGVkKSB7XG4gIHJldHVybiAhbW91bnRlZC5sLnNpemUgJiYgKCFtb3VudGVkLmQuc2l6ZSB8fCBtb3VudGVkLmQuc2l6ZSA9PT0gMSAmJiBtb3VudGVkLmQuaGFzKGF0b20pKTtcbn07XG5cbnZhciBkZWxBdG9tID0gZnVuY3Rpb24gZGVsQXRvbShzdGF0ZSwgZGVsZXRpbmdBdG9tKSB7XG4gIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoZGVsZXRpbmdBdG9tKTtcblxuICBpZiAobW91bnRlZCAmJiBjYW5Vbm1vdW50QXRvbShkZWxldGluZ0F0b20sIG1vdW50ZWQpKSB7XG4gICAgdW5tb3VudEF0b20oc3RhdGUsIGRlbGV0aW5nQXRvbSk7XG4gIH1cblxuICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xufTtcblxudmFyIGludmFsaWRhdGVEZXBlbmRlbnRzID0gZnVuY3Rpb24gaW52YWxpZGF0ZURlcGVuZGVudHMoc3RhdGUsIGF0b20pIHtcbiAgdmFyIG1vdW50ZWQgPSBzdGF0ZS5tLmdldChhdG9tKTtcbiAgbW91bnRlZCA9PSBudWxsID8gdm9pZCAwIDogbW91bnRlZC5kLmZvckVhY2goZnVuY3Rpb24gKGRlcGVuZGVudCkge1xuICAgIGlmIChkZXBlbmRlbnQgPT09IGF0b20pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRBdG9tSW52YWxpZGF0ZWQoc3RhdGUsIGRlcGVuZGVudCk7XG4gICAgaW52YWxpZGF0ZURlcGVuZGVudHMoc3RhdGUsIGRlcGVuZGVudCk7XG4gIH0pO1xufTtcblxudmFyIHdyaXRlQXRvbVN0YXRlID0gZnVuY3Rpb24gd3JpdGVBdG9tU3RhdGUoc3RhdGUsIGF0b20sIHVwZGF0ZSwgcGVuZGluZ1Byb21pc2VzKSB7XG4gIHZhciBpc1BlbmRpbmdQcm9taXNlc0V4cGlyZWQgPSAhcGVuZGluZ1Byb21pc2VzLmxlbmd0aDtcbiAgdmFyIGF0b21TdGF0ZSA9IGdldEF0b21TdGF0ZShzdGF0ZSwgYXRvbSk7XG5cbiAgaWYgKGF0b21TdGF0ZSAmJiBhdG9tU3RhdGUudykge1xuICAgICAgdmFyIHByb21pc2UgPSBhdG9tU3RhdGUudy50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd3JpdGVBdG9tU3RhdGUoc3RhdGUsIGF0b20sIHVwZGF0ZSwgcGVuZGluZ1Byb21pc2VzKTtcblxuICAgICAgICBpZiAoaXNQZW5kaW5nUHJvbWlzZXNFeHBpcmVkKSB7XG4gICAgICAgICAgZmx1c2hQZW5kaW5nKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghaXNQZW5kaW5nUHJvbWlzZXNFeHBpcmVkKSB7XG4gICAgICAgIHBlbmRpbmdQcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHByb21pc2VPclZvaWQgPSBhdG9tLndyaXRlKGZ1bmN0aW9uIChhKSB7XG4gICAgICB2YXIgYVN0YXRlID0gcmVhZEF0b21TdGF0ZShzdGF0ZSwgYSk7XG5cbiAgICAgIGlmIChhU3RhdGUuZSkge1xuICAgICAgICB0aHJvdyBhU3RhdGUuZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFTdGF0ZS5wKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNvbnNvbGUud2FybignUmVhZGluZyBwZW5kaW5nIGF0b20gc3RhdGUgaW4gd3JpdGUgb3BlcmF0aW9uLiBXZSB0aHJvdyBhIHByb21pc2UgZm9yIG5vdy4nLCBhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IGFTdGF0ZS5wO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ3YnIGluIGFTdGF0ZSkge1xuICAgICAgICByZXR1cm4gYVN0YXRlLnY7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tCdWddIG5vIHZhbHVlIGZvdW5kIHdoaWxlIHJlYWRpbmcgYXRvbSBpbiB3cml0ZSBvcGVyYXRpb24uIFRoaXMgcHJvYmFibHkgYSBidWcuJywgYSk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdmFsdWUgZm91bmQnKTtcbiAgICB9LCBmdW5jdGlvbiAoYSwgdikge1xuICAgICAgdmFyIGlzUGVuZGluZ1Byb21pc2VzRXhwaXJlZCA9ICFwZW5kaW5nUHJvbWlzZXMubGVuZ3RoO1xuXG4gICAgICBpZiAoYSA9PT0gYXRvbSkge1xuICAgICAgICBzZXRBdG9tVmFsdWUoc3RhdGUsIGEsIHYpO1xuICAgICAgICBpbnZhbGlkYXRlRGVwZW5kZW50cyhzdGF0ZSwgYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cml0ZUF0b21TdGF0ZShzdGF0ZSwgYSwgdiwgcGVuZGluZ1Byb21pc2VzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzUGVuZGluZ1Byb21pc2VzRXhwaXJlZCkge1xuICAgICAgICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xuICAgICAgfVxuICAgIH0sIHVwZGF0ZSk7XG5cbiAgICBpZiAocHJvbWlzZU9yVm9pZCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHZhciBfcHJvbWlzZSA9IHByb21pc2VPclZvaWQuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldEF0b21Xcml0ZVByb21pc2Uoc3RhdGUsIGF0b20pO1xuXG4gICAgICAgIGlmIChpc1BlbmRpbmdQcm9taXNlc0V4cGlyZWQpIHtcbiAgICAgICAgICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc1BlbmRpbmdQcm9taXNlc0V4cGlyZWQpIHtcbiAgICAgICAgcGVuZGluZ1Byb21pc2VzLnB1c2goX3Byb21pc2UpO1xuICAgICAgfVxuXG4gICAgICBzZXRBdG9tV3JpdGVQcm9taXNlKHN0YXRlLCBhdG9tLCBfcHJvbWlzZSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKHBlbmRpbmdQcm9taXNlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBlbHNlIGlmICghaXNQZW5kaW5nUHJvbWlzZXNFeHBpcmVkKSB7XG4gICAgICBwZW5kaW5nUHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZShmdW5jdGlvbiAoX3Jlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuY2F1Z2h0IGV4Y2VwdGlvbjogVXNlIHByb21pc2UgdG8gY2F0Y2ggZXJyb3InLCBlKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciB3cml0ZUF0b20gPSBmdW5jdGlvbiB3cml0ZUF0b20oc3RhdGUsIHdyaXRpbmdBdG9tLCB1cGRhdGUpIHtcbiAgdmFyIHBlbmRpbmdQcm9taXNlcyA9IFtQcm9taXNlLnJlc29sdmUoKV07XG4gIHdyaXRlQXRvbVN0YXRlKHN0YXRlLCB3cml0aW5nQXRvbSwgdXBkYXRlLCBwZW5kaW5nUHJvbWlzZXMpO1xuICBmbHVzaFBlbmRpbmcoc3RhdGUpO1xuXG4gIGlmIChwZW5kaW5nUHJvbWlzZXMubGVuZ3RoIDw9IDEpIHtcbiAgICBwZW5kaW5nUHJvbWlzZXMuc3BsaWNlKDApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbG9vcCA9IGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIGlmIChwZW5kaW5nUHJvbWlzZXMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICBwZW5kaW5nUHJvbWlzZXMuc3BsaWNlKDApO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBQcm9taXNlLmFsbChwZW5kaW5nUHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGVuZGluZ1Byb21pc2VzLnNwbGljZSgxKTtcbiAgICAgICAgICAgIGZsdXNoUGVuZGluZyhzdGF0ZSk7XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgbG9vcCgpO1xuICAgIH0pO1xuICB9XG59O1xuXG52YXIgaXNBY3R1YWxseVdyaXRhYmxlQXRvbSA9IGZ1bmN0aW9uIGlzQWN0dWFsbHlXcml0YWJsZUF0b20oYXRvbSkge1xuICByZXR1cm4gISFhdG9tLndyaXRlO1xufTtcblxudmFyIG1vdW50QXRvbSA9IGZ1bmN0aW9uIG1vdW50QXRvbShzdGF0ZSwgYXRvbSwgaW5pdGlhbERlcGVuZGVudCkge1xuICB2YXIgYXRvbVN0YXRlID0gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhdG9tKTtcblxuICBpZiAoYXRvbVN0YXRlKSB7XG4gICAgYXRvbVN0YXRlLmQuZm9yRWFjaChmdW5jdGlvbiAoXywgYSkge1xuICAgICAgaWYgKGEgIT09IGF0b20pIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5tLmhhcyhhKSkge1xuICAgICAgICAgIG1vdW50QXRvbShzdGF0ZSwgYSwgYXRvbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGNvbnNvbGUud2FybignW0J1Z10gY291bGQgbm90IGZpbmQgYXRvbSBzdGF0ZSB0byBtb3VudCcsIGF0b20pO1xuICB9XG5cbiAgdmFyIG1vdW50ZWQgPSB7XG4gICAgZDogbmV3IFNldChpbml0aWFsRGVwZW5kZW50ICYmIFtpbml0aWFsRGVwZW5kZW50XSksXG4gICAgbDogbmV3IFNldCgpLFxuICAgIHU6IHVuZGVmaW5lZFxuICB9O1xuICBzdGF0ZS5tLnNldChhdG9tLCBtb3VudGVkKTtcblxuICBpZiAoaXNBY3R1YWxseVdyaXRhYmxlQXRvbShhdG9tKSAmJiBhdG9tLm9uTW91bnQpIHtcbiAgICB2YXIgc2V0QXRvbSA9IGZ1bmN0aW9uIHNldEF0b20odXBkYXRlKSB7XG4gICAgICByZXR1cm4gd3JpdGVBdG9tKHN0YXRlLCBhdG9tLCB1cGRhdGUpO1xuICAgIH07XG5cbiAgICBtb3VudGVkLnUgPSBhdG9tLm9uTW91bnQoc2V0QXRvbSk7XG4gIH1cblxuICByZXR1cm4gbW91bnRlZDtcbn07XG5cbnZhciB1bm1vdW50QXRvbSA9IGZ1bmN0aW9uIHVubW91bnRBdG9tKHN0YXRlLCBhdG9tKSB7XG4gIHZhciBfc3RhdGUkbSRnZXQ7XG5cbiAgdmFyIG9uVW5tb3VudCA9IChfc3RhdGUkbSRnZXQgPSBzdGF0ZS5tLmdldChhdG9tKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9zdGF0ZSRtJGdldC51O1xuXG4gIGlmIChvblVubW91bnQpIHtcbiAgICBvblVubW91bnQoKTtcbiAgfVxuXG4gIHN0YXRlLm0uZGVsZXRlKGF0b20pO1xuICB2YXIgYXRvbVN0YXRlID0gZ2V0QXRvbVN0YXRlKHN0YXRlLCBhdG9tKTtcblxuICBpZiAoYXRvbVN0YXRlKSB7XG4gICAgaWYgKGF0b21TdGF0ZS5wICYmIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tCdWddIGRlbGV0aW5nIGF0b21TdGF0ZSB3aXRoIHJlYWQgcHJvbWlzZScsIGF0b20pO1xuICAgIH1cblxuICAgIGF0b21TdGF0ZS5kLmZvckVhY2goZnVuY3Rpb24gKF8sIGEpIHtcbiAgICAgIGlmIChhICE9PSBhdG9tKSB7XG4gICAgICAgIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYSk7XG5cbiAgICAgICAgaWYgKG1vdW50ZWQpIHtcbiAgICAgICAgICBtb3VudGVkLmQuZGVsZXRlKGF0b20pO1xuXG4gICAgICAgICAgaWYgKGNhblVubW91bnRBdG9tKGEsIG1vdW50ZWQpKSB7XG4gICAgICAgICAgICB1bm1vdW50QXRvbShzdGF0ZSwgYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tCdWddIGNvdWxkIG5vdCBmaW5kIGF0b20gc3RhdGUgdG8gdW5tb3VudCcsIGF0b20pO1xuICB9XG59O1xuXG52YXIgbW91bnREZXBlbmRlbmNpZXMgPSBmdW5jdGlvbiBtb3VudERlcGVuZGVuY2llcyhzdGF0ZSwgYXRvbSwgYXRvbVN0YXRlLCBwcmV2RGVwZW5kZW5jaWVzKSB7XG4gIGlmIChwcmV2RGVwZW5kZW5jaWVzICE9PSBhdG9tU3RhdGUuZCkge1xuICAgIHZhciBkZXBlbmRlbmNpZXMgPSBuZXcgU2V0KGF0b21TdGF0ZS5kLmtleXMoKSk7XG5cbiAgICBpZiAocHJldkRlcGVuZGVuY2llcykge1xuICAgICAgcHJldkRlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uIChfLCBhKSB7XG4gICAgICAgIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYSk7XG5cbiAgICAgICAgaWYgKGRlcGVuZGVuY2llcy5oYXMoYSkpIHtcbiAgICAgICAgICBkZXBlbmRlbmNpZXMuZGVsZXRlKGEpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vdW50ZWQpIHtcbiAgICAgICAgICBtb3VudGVkLmQuZGVsZXRlKGF0b20pO1xuXG4gICAgICAgICAgaWYgKGNhblVubW91bnRBdG9tKGEsIG1vdW50ZWQpKSB7XG4gICAgICAgICAgICB1bm1vdW50QXRvbShzdGF0ZSwgYSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbQnVnXSBhIGRlcGVuZGVuY3kgaXMgbm90IG1vdW50ZWQnLCBhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVwZW5kZW5jaWVzLmZvckVhY2goZnVuY3Rpb24gKGEpIHtcbiAgICAgIHZhciBtb3VudGVkID0gc3RhdGUubS5nZXQoYSk7XG5cbiAgICAgIGlmIChtb3VudGVkKSB7XG4gICAgICAgIHZhciBkZXBlbmRlbnRzID0gbW91bnRlZC5kO1xuICAgICAgICBkZXBlbmRlbnRzLmFkZChhdG9tKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdW50QXRvbShzdGF0ZSwgYSwgYXRvbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbnZhciBjb21taXRBdG9tU3RhdGUgPSBmdW5jdGlvbiBjb21taXRBdG9tU3RhdGUoc3RhdGUsIGF0b20sIGF0b21TdGF0ZSkge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBPYmplY3QuZnJlZXplKGF0b21TdGF0ZSk7XG4gIH1cblxuICB2YXIgaXNOZXdBdG9tID0gc3RhdGUubiAmJiAhc3RhdGUuYS5oYXMoYXRvbSk7XG4gIHN0YXRlLmEuc2V0KGF0b20sIGF0b21TdGF0ZSk7XG5cbiAgaWYgKGlzTmV3QXRvbSkge1xuICAgIHN0YXRlLm4oYXRvbSk7XG4gIH1cblxuICArK3N0YXRlLnY7XG4gIHN0YXRlLnAuYWRkKGF0b20pO1xufTtcblxudmFyIGZsdXNoUGVuZGluZyA9IGZ1bmN0aW9uIGZsdXNoUGVuZGluZyhzdGF0ZSkge1xuICBzdGF0ZS5wLmZvckVhY2goZnVuY3Rpb24gKGF0b20pIHtcbiAgICB2YXIgbW91bnRlZCA9IHN0YXRlLm0uZ2V0KGF0b20pO1xuICAgIG1vdW50ZWQgPT0gbnVsbCA/IHZvaWQgMCA6IG1vdW50ZWQubC5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH0pO1xuICBzdGF0ZS5wLmNsZWFyKCk7XG59O1xuXG52YXIgc3Vic2NyaWJlQXRvbSA9IGZ1bmN0aW9uIHN1YnNjcmliZUF0b20oc3RhdGUsIGF0b20sIGNhbGxiYWNrKSB7XG4gIHZhciBtb3VudGVkID0gYWRkQXRvbShzdGF0ZSwgYXRvbSk7XG4gIHZhciBsaXN0ZW5lcnMgPSBtb3VudGVkLmw7XG4gIGxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICAgIGRlbEF0b20oc3RhdGUsIGF0b20pO1xuICB9O1xufTtcblxudmFyIFRBUkdFVCA9IFN5bWJvbCgpO1xudmFyIEdFVF9WRVJTSU9OID0gU3ltYm9sKCk7XG52YXIgY3JlYXRlTXV0YWJsZVNvdXJjZSA9IGZ1bmN0aW9uIGNyZWF0ZU11dGFibGVTb3VyY2UodGFyZ2V0LCBnZXRWZXJzaW9uKSB7XG4gIHZhciBfcmVmO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFSR0VUXSA9IHRhcmdldCwgX3JlZltHRVRfVkVSU0lPTl0gPSBnZXRWZXJzaW9uLCBfcmVmO1xufTtcbnZhciB1c2VNdXRhYmxlU291cmNlID0gZnVuY3Rpb24gdXNlTXV0YWJsZVNvdXJjZShzb3VyY2UsIGdldFNuYXBzaG90LCBzdWJzY3JpYmUpIHtcbiAgdmFyIGxhc3RWZXJzaW9uID0gcmVhY3QudXNlUmVmKDApO1xuICB2YXIgY3VycmVudFZlcnNpb24gPSBzb3VyY2VbR0VUX1ZFUlNJT05dKHNvdXJjZVtUQVJHRVRdKTtcblxuICB2YXIgX3VzZVN0YXRlID0gcmVhY3QudXNlU3RhdGUoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pXTtcbiAgfSksXG4gICAgICBzdGF0ZSA9IF91c2VTdGF0ZVswXSxcbiAgICAgIHNldFN0YXRlID0gX3VzZVN0YXRlWzFdO1xuXG4gIHZhciBjdXJyZW50U25hcHNob3QgPSBzdGF0ZVs0XTtcblxuICBpZiAoc3RhdGVbMF0gIT09IHNvdXJjZSB8fCBzdGF0ZVsxXSAhPT0gZ2V0U25hcHNob3QgfHwgc3RhdGVbMl0gIT09IHN1YnNjcmliZSkge1xuICAgIGN1cnJlbnRTbmFwc2hvdCA9IGdldFNuYXBzaG90KHNvdXJjZVtUQVJHRVRdKTtcbiAgICBzZXRTdGF0ZShbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgY3VycmVudFNuYXBzaG90XSk7XG4gIH0gZWxzZSBpZiAoY3VycmVudFZlcnNpb24gIT09IHN0YXRlWzNdICYmIGN1cnJlbnRWZXJzaW9uICE9PSBsYXN0VmVyc2lvbi5jdXJyZW50KSB7XG4gICAgY3VycmVudFNuYXBzaG90ID0gZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pO1xuXG4gICAgaWYgKCFPYmplY3QuaXMoY3VycmVudFNuYXBzaG90LCBzdGF0ZVs0XSkpIHtcbiAgICAgIHNldFN0YXRlKFtzb3VyY2UsIGdldFNuYXBzaG90LCBzdWJzY3JpYmUsIGN1cnJlbnRWZXJzaW9uLCBjdXJyZW50U25hcHNob3RdKTtcbiAgICB9XG4gIH1cblxuICByZWFjdC51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaWRVbnN1YnNjcmliZSA9IGZhbHNlO1xuXG4gICAgdmFyIGNoZWNrRm9yVXBkYXRlcyA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlcygpIHtcbiAgICAgIGlmIChkaWRVbnN1YnNjcmliZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBuZXh0U25hcHNob3QgPSBnZXRTbmFwc2hvdChzb3VyY2VbVEFSR0VUXSk7XG4gICAgICAgIHZhciBuZXh0VmVyc2lvbiA9IHNvdXJjZVtHRVRfVkVSU0lPTl0oc291cmNlW1RBUkdFVF0pO1xuICAgICAgICBsYXN0VmVyc2lvbi5jdXJyZW50ID0gbmV4dFZlcnNpb247XG4gICAgICAgIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgaWYgKHByZXZbMF0gIT09IHNvdXJjZSB8fCBwcmV2WzFdICE9PSBnZXRTbmFwc2hvdCB8fCBwcmV2WzJdICE9PSBzdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChPYmplY3QuaXMocHJldls0XSwgbmV4dFNuYXBzaG90KSkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFtwcmV2WzBdLCBwcmV2WzFdLCBwcmV2WzJdLCBuZXh0VmVyc2lvbiwgbmV4dFNuYXBzaG90XTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChwcmV2KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShzb3VyY2VbVEFSR0VUXSwgY2hlY2tGb3JVcGRhdGVzKTtcbiAgICBjaGVja0ZvclVwZGF0ZXMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZGlkVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlXSk7XG4gIHJldHVybiBjdXJyZW50U25hcHNob3Q7XG59O1xuXG52YXIgY3JlYXRlU3RvcmVGb3JQcm9kdWN0aW9uID0gZnVuY3Rpb24gY3JlYXRlU3RvcmVGb3JQcm9kdWN0aW9uKGluaXRpYWxWYWx1ZXMpIHtcbiAgdmFyIHN0YXRlID0gY3JlYXRlU3RhdGUoaW5pdGlhbFZhbHVlcyk7XG4gIHZhciBzdGF0ZU11dGFibGVTb3VyY2UgPSBjcmVhdGVNdXRhYmxlU291cmNlKHN0YXRlLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHN0YXRlLnY7XG4gIH0pO1xuXG4gIHZhciB1cGRhdGVBdG9tID0gZnVuY3Rpb24gdXBkYXRlQXRvbShhdG9tLCB1cGRhdGUpIHtcbiAgICByZXR1cm4gd3JpdGVBdG9tKHN0YXRlLCBhdG9tLCB1cGRhdGUpO1xuICB9O1xuXG4gIHJldHVybiBbc3RhdGVNdXRhYmxlU291cmNlLCB1cGRhdGVBdG9tXTtcbn07XG5cbnZhciBjcmVhdGVTdG9yZUZvckRldmVsb3BtZW50ID0gZnVuY3Rpb24gY3JlYXRlU3RvcmVGb3JEZXZlbG9wbWVudChpbml0aWFsVmFsdWVzKSB7XG4gIHZhciBhdG9tc1N0b3JlID0ge1xuICAgIGF0b21zOiBbXSxcbiAgICBsaXN0ZW5lcnM6IG5ldyBTZXQoKVxuICB9O1xuICB2YXIgc3RhdGUgPSBjcmVhdGVTdGF0ZShpbml0aWFsVmFsdWVzLCBmdW5jdGlvbiAobmV3QXRvbSkge1xuICAgIGF0b21zU3RvcmUuYXRvbXMgPSBbXS5jb25jYXQoYXRvbXNTdG9yZS5hdG9tcywgW25ld0F0b21dKTtcbiAgICBhdG9tc1N0b3JlLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH0pO1xuICB2YXIgc3RhdGVNdXRhYmxlU291cmNlID0gY3JlYXRlTXV0YWJsZVNvdXJjZShzdGF0ZSwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzdGF0ZS52O1xuICB9KTtcblxuICB2YXIgdXBkYXRlQXRvbSA9IGZ1bmN0aW9uIHVwZGF0ZUF0b20oYXRvbSwgdXBkYXRlKSB7XG4gICAgcmV0dXJuIHdyaXRlQXRvbShzdGF0ZSwgYXRvbSwgdXBkYXRlKTtcbiAgfTtcblxuICB2YXIgYXRvbXNNdXRhYmxlU291cmNlID0gY3JlYXRlTXV0YWJsZVNvdXJjZShhdG9tc1N0b3JlLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGF0b21zU3RvcmUuYXRvbXM7XG4gIH0pO1xuICByZXR1cm4gW3N0YXRlTXV0YWJsZVNvdXJjZSwgdXBkYXRlQXRvbSwgYXRvbXNNdXRhYmxlU291cmNlXTtcbn07XG5cbnZhciBjcmVhdGVTdG9yZSA9IHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gY3JlYXRlU3RvcmVGb3JEZXZlbG9wbWVudCA6IGNyZWF0ZVN0b3JlRm9yUHJvZHVjdGlvbjtcbnZhciBTdG9yZUNvbnRleHRNYXAgPSBuZXcgTWFwKCk7XG52YXIgZ2V0U3RvcmVDb250ZXh0ID0gZnVuY3Rpb24gZ2V0U3RvcmVDb250ZXh0KHNjb3BlKSB7XG4gIGlmICghU3RvcmVDb250ZXh0TWFwLmhhcyhzY29wZSkpIHtcbiAgICBTdG9yZUNvbnRleHRNYXAuc2V0KHNjb3BlLCByZWFjdC5jcmVhdGVDb250ZXh0KGNyZWF0ZVN0b3JlKCkpKTtcbiAgfVxuXG4gIHJldHVybiBTdG9yZUNvbnRleHRNYXAuZ2V0KHNjb3BlKTtcbn07XG5cbnZhciBQcm92aWRlciA9IGZ1bmN0aW9uIFByb3ZpZGVyKF9yZWYpIHtcbiAgdmFyIGluaXRpYWxWYWx1ZXMgPSBfcmVmLmluaXRpYWxWYWx1ZXMsXG4gICAgICBzY29wZSA9IF9yZWYuc2NvcGUsXG4gICAgICBjaGlsZHJlbiA9IF9yZWYuY2hpbGRyZW47XG4gIHZhciBzdG9yZVJlZiA9IHJlYWN0LnVzZVJlZihudWxsKTtcblxuICBpZiAoc3RvcmVSZWYuY3VycmVudCA9PT0gbnVsbCkge1xuICAgIHN0b3JlUmVmLmN1cnJlbnQgPSBjcmVhdGVTdG9yZShpbml0aWFsVmFsdWVzKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBpc0RldlN0b3JlKHN0b3JlUmVmLmN1cnJlbnQpKSB7XG4gICAgdXNlRGVidWdTdGF0ZShzdG9yZVJlZi5jdXJyZW50KTtcbiAgfVxuXG4gIHZhciBTdG9yZUNvbnRleHQgPSBnZXRTdG9yZUNvbnRleHQoc2NvcGUpO1xuICByZXR1cm4gcmVhY3QuY3JlYXRlRWxlbWVudChTdG9yZUNvbnRleHQuUHJvdmlkZXIsIHtcbiAgICB2YWx1ZTogc3RvcmVSZWYuY3VycmVudFxuICB9LCBjaGlsZHJlbik7XG59O1xuXG52YXIgYXRvbVRvUHJpbnRhYmxlID0gZnVuY3Rpb24gYXRvbVRvUHJpbnRhYmxlKGF0b20pIHtcbiAgcmV0dXJuIGF0b20uZGVidWdMYWJlbCB8fCBhdG9tLnRvU3RyaW5nKCk7XG59O1xuXG52YXIgc3RhdGVUb1ByaW50YWJsZSA9IGZ1bmN0aW9uIHN0YXRlVG9QcmludGFibGUoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjJbMF0sXG4gICAgICBhdG9tcyA9IF9yZWYyWzFdO1xuICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGF0b21zLmZsYXRNYXAoZnVuY3Rpb24gKGF0b20pIHtcbiAgICB2YXIgbW91bnRlZCA9IHN0YXRlLm0uZ2V0KGF0b20pO1xuXG4gICAgaWYgKCFtb3VudGVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIGRlcGVuZGVudHMgPSBtb3VudGVkLmQ7XG4gICAgdmFyIGF0b21TdGF0ZSA9IHN0YXRlLmEuZ2V0KGF0b20pIHx8IHt9O1xuICAgIHJldHVybiBbW2F0b21Ub1ByaW50YWJsZShhdG9tKSwge1xuICAgICAgdmFsdWU6IGF0b21TdGF0ZS5lIHx8IGF0b21TdGF0ZS5wIHx8IGF0b21TdGF0ZS53IHx8IGF0b21TdGF0ZS52LFxuICAgICAgZGVwZW5kZW50czogQXJyYXkuZnJvbShkZXBlbmRlbnRzKS5tYXAoYXRvbVRvUHJpbnRhYmxlKVxuICAgIH1dXTtcbiAgfSkpO1xufTtcblxudmFyIGlzRGV2U3RvcmUgPSBmdW5jdGlvbiBpc0RldlN0b3JlKHN0b3JlKSB7XG4gIHJldHVybiBzdG9yZS5sZW5ndGggPiAyO1xufTtcblxudmFyIGdldERldlN0YXRlID0gZnVuY3Rpb24gZ2V0RGV2U3RhdGUoc3RhdGUpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSk7XG59O1xudmFyIGdldERldkF0b21zID0gZnVuY3Rpb24gZ2V0RGV2QXRvbXMoX3JlZjMpIHtcbiAgdmFyIGF0b21zID0gX3JlZjMuYXRvbXM7XG4gIHJldHVybiBhdG9tcztcbn07XG52YXIgc3Vic2NyaWJlRGV2QXRvbXMgPSBmdW5jdGlvbiBzdWJzY3JpYmVEZXZBdG9tcyhfcmVmNCwgY2FsbGJhY2spIHtcbiAgdmFyIGxpc3RlbmVycyA9IF9yZWY0Lmxpc3RlbmVycztcbiAgbGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICB9O1xufTtcblxudmFyIHVzZURlYnVnU3RhdGUgPSBmdW5jdGlvbiB1c2VEZWJ1Z1N0YXRlKHN0b3JlKSB7XG4gIHZhciBzdGF0ZU11dGFibGVTb3VyY2UgPSBzdG9yZVswXSxcbiAgICAgIGF0b21zTXV0YWJsZVNvdXJjZSA9IHN0b3JlWzJdO1xuICB2YXIgYXRvbXMgPSB1c2VNdXRhYmxlU291cmNlKGF0b21zTXV0YWJsZVNvdXJjZSwgZ2V0RGV2QXRvbXMsIHN1YnNjcmliZURldkF0b21zKTtcbiAgdmFyIHN1YnNjcmliZSA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgdW5zdWJzID0gYXRvbXMubWFwKGZ1bmN0aW9uIChhdG9tKSB7XG4gICAgICByZXR1cm4gc3Vic2NyaWJlQXRvbShzdGF0ZSwgYXRvbSwgY2FsbGJhY2spO1xuICAgIH0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB1bnN1YnMuZm9yRWFjaChmdW5jdGlvbiAodW5zdWIpIHtcbiAgICAgICAgcmV0dXJuIHVuc3ViKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LCBbYXRvbXNdKTtcbiAgdmFyIHN0YXRlID0gdXNlTXV0YWJsZVNvdXJjZShzdGF0ZU11dGFibGVTb3VyY2UsIGdldERldlN0YXRlLCBzdWJzY3JpYmUpO1xuICByZWFjdC51c2VEZWJ1Z1ZhbHVlKFtzdGF0ZSwgYXRvbXNdLCBzdGF0ZVRvUHJpbnRhYmxlKTtcbn07XG5cbnZhciBrZXlDb3VudCA9IDA7XG5mdW5jdGlvbiBhdG9tKHJlYWQsIHdyaXRlKSB7XG4gIHZhciBrZXkgPSBcImF0b21cIiArICsra2V5Q291bnQ7XG4gIHZhciBjb25maWcgPSB7XG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiByZWFkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uZmlnLnJlYWQgPSByZWFkO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5pbml0ID0gcmVhZDtcblxuICAgIGNvbmZpZy5yZWFkID0gZnVuY3Rpb24gKGdldCkge1xuICAgICAgcmV0dXJuIGdldChjb25maWcpO1xuICAgIH07XG5cbiAgICBjb25maWcud3JpdGUgPSBmdW5jdGlvbiAoZ2V0LCBzZXQsIHVwZGF0ZSkge1xuICAgICAgc2V0KGNvbmZpZywgdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoY29uZmlnKSkgOiB1cGRhdGUpO1xuICAgIH07XG4gIH1cblxuICBpZiAod3JpdGUpIHtcbiAgICBjb25maWcud3JpdGUgPSB3cml0ZTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG5cbnZhciBpc1dyaXRhYmxlID0gZnVuY3Rpb24gaXNXcml0YWJsZShhdG9tKSB7XG4gIHJldHVybiAhIWF0b20ud3JpdGU7XG59O1xuXG5mdW5jdGlvbiB1c2VBdG9tKGF0b20pIHtcbiAgdmFyIGdldEF0b21WYWx1ZSA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBhdG9tU3RhdGUgPSByZWFkQXRvbShzdGF0ZSwgYXRvbSk7XG5cbiAgICBpZiAoYXRvbVN0YXRlLmUpIHtcbiAgICAgIHRocm93IGF0b21TdGF0ZS5lO1xuICAgIH1cblxuICAgIGlmIChhdG9tU3RhdGUucCkge1xuICAgICAgdGhyb3cgYXRvbVN0YXRlLnA7XG4gICAgfVxuXG4gICAgaWYgKGF0b21TdGF0ZS53KSB7XG4gICAgICB0aHJvdyBhdG9tU3RhdGUudztcbiAgICB9XG5cbiAgICBpZiAoJ3YnIGluIGF0b21TdGF0ZSkge1xuICAgICAgcmV0dXJuIGF0b21TdGF0ZS52O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignbm8gYXRvbSB2YWx1ZScpO1xuICB9LCBbYXRvbV0pO1xuICB2YXIgc3Vic2NyaWJlID0gcmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKHN0YXRlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBzdWJzY3JpYmVBdG9tKHN0YXRlLCBhdG9tLCBjYWxsYmFjayk7XG4gIH0sIFthdG9tXSk7XG4gIHZhciBTdG9yZUNvbnRleHQgPSBnZXRTdG9yZUNvbnRleHQoYXRvbS5zY29wZSk7XG5cbiAgdmFyIF91c2VDb250ZXh0ID0gcmVhY3QudXNlQ29udGV4dChTdG9yZUNvbnRleHQpLFxuICAgICAgbXV0YWJsZVNvdXJjZSA9IF91c2VDb250ZXh0WzBdLFxuICAgICAgdXBkYXRlQXRvbSA9IF91c2VDb250ZXh0WzFdO1xuXG4gIHZhciB2YWx1ZSA9IHVzZU11dGFibGVTb3VyY2UobXV0YWJsZVNvdXJjZSwgZ2V0QXRvbVZhbHVlLCBzdWJzY3JpYmUpO1xuICB2YXIgc2V0QXRvbSA9IHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uICh1cGRhdGUpIHtcbiAgICBpZiAoaXNXcml0YWJsZShhdG9tKSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZUF0b20oYXRvbSwgdXBkYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3Qgd3JpdGFibGUgYXRvbScpO1xuICAgIH1cbiAgfSwgW3VwZGF0ZUF0b20sIGF0b21dKTtcbiAgcmVhY3QudXNlRGVidWdWYWx1ZSh2YWx1ZSk7XG4gIHJldHVybiBbdmFsdWUsIHNldEF0b21dO1xufVxuXG5leHBvcnRzLlByb3ZpZGVyID0gUHJvdmlkZXI7XG5leHBvcnRzLlNFQ1JFVF9JTlRFUk5BTF9nZXRTdG9yZUNvbnRleHQgPSBnZXRTdG9yZUNvbnRleHQ7XG5leHBvcnRzLmF0b20gPSBhdG9tO1xuZXhwb3J0cy51c2VBdG9tID0gdXNlQXRvbTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIHJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBqb3RhaSA9IHJlcXVpcmUoJ2pvdGFpJyk7XG5cbmZ1bmN0aW9uIHVzZVVwZGF0ZUF0b20oYW5BdG9tKSB7XG4gIHZhciBTdG9yZUNvbnRleHQgPSBqb3RhaS5TRUNSRVRfSU5URVJOQUxfZ2V0U3RvcmVDb250ZXh0KGFuQXRvbS5zY29wZSk7XG5cbiAgdmFyIF91c2VDb250ZXh0ID0gcmVhY3QudXNlQ29udGV4dChTdG9yZUNvbnRleHQpLFxuICAgICAgdXBkYXRlQXRvbSA9IF91c2VDb250ZXh0WzFdO1xuXG4gIHZhciBzZXRBdG9tID0gcmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKHVwZGF0ZSkge1xuICAgIHJldHVybiB1cGRhdGVBdG9tKGFuQXRvbSwgdXBkYXRlKTtcbiAgfSwgW3VwZGF0ZUF0b20sIGFuQXRvbV0pO1xuICByZXR1cm4gc2V0QXRvbTtcbn1cblxuZnVuY3Rpb24gdXNlQXRvbVZhbHVlKGFuQXRvbSkge1xuICByZXR1cm4gam90YWkudXNlQXRvbShhbkF0b20pWzBdO1xufVxuXG52YXIgUkVTRVQgPSBTeW1ib2woKTtcbmZ1bmN0aW9uIGF0b21XaXRoUmVzZXQoaW5pdGlhbFZhbHVlKSB7XG4gIHZhciBhbkF0b20gPSBqb3RhaS5hdG9tKGluaXRpYWxWYWx1ZSwgZnVuY3Rpb24gKGdldCwgc2V0LCB1cGRhdGUpIHtcbiAgICBpZiAodXBkYXRlID09PSBSRVNFVCkge1xuICAgICAgc2V0KGFuQXRvbSwgaW5pdGlhbFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0KGFuQXRvbSwgdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoYW5BdG9tKSkgOiB1cGRhdGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhbkF0b207XG59XG5cbmZ1bmN0aW9uIHVzZVJlc2V0QXRvbShhbkF0b20pIHtcbiAgdmFyIFN0b3JlQ29udGV4dCA9IGpvdGFpLlNFQ1JFVF9JTlRFUk5BTF9nZXRTdG9yZUNvbnRleHQoYW5BdG9tLnNjb3BlKTtcblxuICB2YXIgX3VzZUNvbnRleHQgPSByZWFjdC51c2VDb250ZXh0KFN0b3JlQ29udGV4dCksXG4gICAgICB1cGRhdGVBdG9tID0gX3VzZUNvbnRleHRbMV07XG5cbiAgdmFyIHNldEF0b20gPSByZWFjdC51c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHVwZGF0ZUF0b20oYW5BdG9tLCBSRVNFVCk7XG4gIH0sIFt1cGRhdGVBdG9tLCBhbkF0b21dKTtcbiAgcmV0dXJuIHNldEF0b207XG59XG5cbmZ1bmN0aW9uIHVzZVJlZHVjZXJBdG9tKGFuQXRvbSwgcmVkdWNlcikge1xuICB2YXIgX3VzZUF0b20gPSBqb3RhaS51c2VBdG9tKGFuQXRvbSksXG4gICAgICBzdGF0ZSA9IF91c2VBdG9tWzBdLFxuICAgICAgc2V0U3RhdGUgPSBfdXNlQXRvbVsxXTtcblxuICB2YXIgZGlzcGF0Y2ggPSByZWFjdC51c2VDYWxsYmFjayhmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgc2V0U3RhdGUoZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgIHJldHVybiByZWR1Y2VyKHByZXYsIGFjdGlvbik7XG4gICAgfSk7XG4gIH0sIFtzZXRTdGF0ZSwgcmVkdWNlcl0pO1xuICByZXR1cm4gW3N0YXRlLCBkaXNwYXRjaF07XG59XG5cbmZ1bmN0aW9uIGF0b21XaXRoUmVkdWNlcihpbml0aWFsVmFsdWUsIHJlZHVjZXIpIHtcbiAgdmFyIGFuQXRvbSA9IGpvdGFpLmF0b20oaW5pdGlhbFZhbHVlLCBmdW5jdGlvbiAoZ2V0LCBzZXQsIGFjdGlvbikge1xuICAgIHJldHVybiBzZXQoYW5BdG9tLCByZWR1Y2VyKGdldChhbkF0b20pLCBhY3Rpb24pKTtcbiAgfSk7XG4gIHJldHVybiBhbkF0b207XG59XG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkge1xuICBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gIHJldHVybiBhcnIyO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKG8sIGFsbG93QXJyYXlMaWtlKSB7XG4gIHZhciBpdDtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBvW1N5bWJvbC5pdGVyYXRvcl0gPT0gbnVsbCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGlmIChpdCkgbyA9IGl0O1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7XG4gICAgICAgICAgZG9uZTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBvW2krK11cbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xuICB9XG5cbiAgaXQgPSBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgcmV0dXJuIGl0Lm5leHQuYmluZChpdCk7XG59XG5cbmZ1bmN0aW9uIGF0b21GYW1pbHkoaW5pdGlhbGl6ZUF0b20sIGFyZUVxdWFsKSB7XG4gIHZhciBzaG91bGRSZW1vdmUgPSBudWxsO1xuICB2YXIgYXRvbXMgPSBuZXcgTWFwKCk7XG5cbiAgdmFyIGNyZWF0ZUF0b20gPSBmdW5jdGlvbiBjcmVhdGVBdG9tKHBhcmFtKSB7XG4gICAgdmFyIGl0ZW07XG5cbiAgICBpZiAoYXJlRXF1YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaXRlbSA9IGF0b21zLmdldChwYXJhbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UoYXRvbXMpLCBfc3RlcDsgIShfc3RlcCA9IF9pdGVyYXRvcigpKS5kb25lOykge1xuICAgICAgICB2YXIgX3N0ZXAkdmFsdWUgPSBfc3RlcC52YWx1ZSxcbiAgICAgICAgICAgIGtleSA9IF9zdGVwJHZhbHVlWzBdLFxuICAgICAgICAgICAgdmFsdWUgPSBfc3RlcCR2YWx1ZVsxXTtcblxuICAgICAgICBpZiAoYXJlRXF1YWwoa2V5LCBwYXJhbSkpIHtcbiAgICAgICAgICBpdGVtID0gdmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc2hvdWxkUmVtb3ZlICE9IG51bGwgJiYgc2hvdWxkUmVtb3ZlKGl0ZW1bMV0sIHBhcmFtKSkge1xuICAgICAgICBhdG9tcy5kZWxldGUocGFyYW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1bMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG5ld0F0b20gPSBpbml0aWFsaXplQXRvbShwYXJhbSk7XG4gICAgYXRvbXMuc2V0KHBhcmFtLCBbbmV3QXRvbSwgRGF0ZS5ub3coKV0pO1xuICAgIHJldHVybiBuZXdBdG9tO1xuICB9O1xuXG4gIGNyZWF0ZUF0b20ucmVtb3ZlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgaWYgKGFyZUVxdWFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF0b21zLmRlbGV0ZShwYXJhbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKGF0b21zKSwgX3N0ZXAyOyAhKF9zdGVwMiA9IF9pdGVyYXRvcjIoKSkuZG9uZTspIHtcbiAgICAgICAgdmFyIF9zdGVwMiR2YWx1ZSA9IF9zdGVwMi52YWx1ZSxcbiAgICAgICAgICAgIGtleSA9IF9zdGVwMiR2YWx1ZVswXTtcblxuICAgICAgICBpZiAoYXJlRXF1YWwoa2V5LCBwYXJhbSkpIHtcbiAgICAgICAgICBhdG9tcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjcmVhdGVBdG9tLnNldFNob3VsZFJlbW92ZSA9IGZ1bmN0aW9uIChmbikge1xuICAgIHNob3VsZFJlbW92ZSA9IGZuO1xuICAgIGlmICghc2hvdWxkUmVtb3ZlKSByZXR1cm47XG5cbiAgICBmb3IgKHZhciBfaXRlcmF0b3IzID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZShhdG9tcyksIF9zdGVwMzsgIShfc3RlcDMgPSBfaXRlcmF0b3IzKCkpLmRvbmU7KSB7XG4gICAgICB2YXIgX3N0ZXAzJHZhbHVlID0gX3N0ZXAzLnZhbHVlLFxuICAgICAgICAgIGtleSA9IF9zdGVwMyR2YWx1ZVswXSxcbiAgICAgICAgICB2YWx1ZSA9IF9zdGVwMyR2YWx1ZVsxXTtcblxuICAgICAgaWYgKHNob3VsZFJlbW92ZSh2YWx1ZVsxXSwga2V5KSkge1xuICAgICAgICBhdG9tcy5kZWxldGUoa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNyZWF0ZUF0b207XG59XG5cbnZhciBnZXRXZWFrQ2FjaGVJdGVtID0gZnVuY3Rpb24gZ2V0V2Vha0NhY2hlSXRlbShjYWNoZSwgZGVwcykge1xuICB2YXIgZGVwID0gZGVwc1swXSxcbiAgICAgIHJlc3QgPSBkZXBzLnNsaWNlKDEpO1xuICB2YXIgZW50cnkgPSBjYWNoZS5nZXQoZGVwKTtcblxuICBpZiAoIWVudHJ5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFyZXN0Lmxlbmd0aCkge1xuICAgIHJldHVybiBlbnRyeVsxXTtcbiAgfVxuXG4gIHJldHVybiBnZXRXZWFrQ2FjaGVJdGVtKGVudHJ5WzBdLCByZXN0KTtcbn07XG52YXIgc2V0V2Vha0NhY2hlSXRlbSA9IGZ1bmN0aW9uIHNldFdlYWtDYWNoZUl0ZW0oY2FjaGUsIGRlcHMsIGl0ZW0pIHtcbiAgdmFyIGRlcCA9IGRlcHNbMF0sXG4gICAgICByZXN0ID0gZGVwcy5zbGljZSgxKTtcbiAgdmFyIGVudHJ5ID0gY2FjaGUuZ2V0KGRlcCk7XG5cbiAgaWYgKCFlbnRyeSkge1xuICAgIGVudHJ5ID0gW25ldyBXZWFrTWFwKCldO1xuICAgIGNhY2hlLnNldChkZXAsIGVudHJ5KTtcbiAgfVxuXG4gIGlmICghcmVzdC5sZW5ndGgpIHtcbiAgICBlbnRyeVsxXSA9IGl0ZW07XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2V0V2Vha0NhY2hlSXRlbShlbnRyeVswXSwgcmVzdCwgaXRlbSk7XG59O1xuXG52YXIgc2VsZWN0QXRvbUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHNlbGVjdEF0b20oYW5BdG9tLCBzZWxlY3RvciwgZXF1YWxpdHlGbikge1xuICBpZiAoZXF1YWxpdHlGbiA9PT0gdm9pZCAwKSB7XG4gICAgZXF1YWxpdHlGbiA9IE9iamVjdC5pcztcbiAgfVxuXG4gIHZhciBkZXBzID0gW2FuQXRvbSwgc2VsZWN0b3IsIGVxdWFsaXR5Rm5dO1xuICB2YXIgY2FjaGVkQXRvbSA9IGdldFdlYWtDYWNoZUl0ZW0oc2VsZWN0QXRvbUNhY2hlLCBkZXBzKTtcblxuICBpZiAoY2FjaGVkQXRvbSkge1xuICAgIHJldHVybiBjYWNoZWRBdG9tO1xuICB9XG5cbiAgdmFyIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIHZhciBwcmV2U2xpY2U7XG4gIHZhciBkZXJpdmVkQXRvbSA9IGpvdGFpLmF0b20oZnVuY3Rpb24gKGdldCkge1xuICAgIHZhciBzbGljZSA9IHNlbGVjdG9yKGdldChhbkF0b20pKTtcblxuICAgIGlmIChpbml0aWFsaXplZCAmJiBlcXVhbGl0eUZuKHByZXZTbGljZSwgc2xpY2UpKSB7XG4gICAgICByZXR1cm4gcHJldlNsaWNlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBwcmV2U2xpY2UgPSBzbGljZTtcbiAgICByZXR1cm4gc2xpY2U7XG4gIH0pO1xuICBkZXJpdmVkQXRvbS5zY29wZSA9IGFuQXRvbS5zY29wZTtcbiAgc2V0V2Vha0NhY2hlSXRlbShzZWxlY3RBdG9tQ2FjaGUsIGRlcHMsIGRlcml2ZWRBdG9tKTtcbiAgcmV0dXJuIGRlcml2ZWRBdG9tO1xufVxuXG5mdW5jdGlvbiB1c2VBdG9tQ2FsbGJhY2soY2FsbGJhY2ssIHNjb3BlKSB7XG4gIHZhciBhbkF0b20gPSByZWFjdC51c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gam90YWkuYXRvbShudWxsLCBmdW5jdGlvbiAoZ2V0LCBzZXQsIF9yZWYpIHtcbiAgICAgIHZhciBhcmcgPSBfcmVmWzBdLFxuICAgICAgICAgIHJlc29sdmUgPSBfcmVmWzFdLFxuICAgICAgICAgIHJlamVjdCA9IF9yZWZbMl07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmUoY2FsbGJhY2soZ2V0LCBzZXQsIGFyZykpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIFtjYWxsYmFja10pO1xuICBhbkF0b20uc2NvcGUgPSBzY29wZTtcblxuICB2YXIgX3VzZUF0b20gPSBqb3RhaS51c2VBdG9tKGFuQXRvbSksXG4gICAgICBpbnZva2UgPSBfdXNlQXRvbVsxXTtcblxuICByZXR1cm4gcmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpbnZva2UoW2FyZywgcmVzb2x2ZSwgcmVqZWN0XSk7XG4gICAgfSk7XG4gIH0sIFtpbnZva2VdKTtcbn1cblxudmFyIGZyZWV6ZUF0b21DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbnZhciBkZWVwRnJlZXplID0gZnVuY3Rpb24gZGVlcEZyZWV6ZShvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuO1xuICBPYmplY3QuZnJlZXplKG9iaik7XG4gIHZhciBwcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuXG4gIGZvciAodmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UocHJvcE5hbWVzKSwgX3N0ZXA7ICEoX3N0ZXAgPSBfaXRlcmF0b3IoKSkuZG9uZTspIHtcbiAgICB2YXIgbmFtZSA9IF9zdGVwLnZhbHVlO1xuICAgIHZhciB2YWx1ZSA9IG9ialtuYW1lXTtcbiAgICBkZWVwRnJlZXplKHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5mdW5jdGlvbiBmcmVlemVBdG9tKGFuQXRvbSkge1xuICB2YXIgZGVwcyA9IFthbkF0b21dO1xuICB2YXIgY2FjaGVkQXRvbSA9IGdldFdlYWtDYWNoZUl0ZW0oZnJlZXplQXRvbUNhY2hlLCBkZXBzKTtcblxuICBpZiAoY2FjaGVkQXRvbSkge1xuICAgIHJldHVybiBjYWNoZWRBdG9tO1xuICB9XG5cbiAgdmFyIGZyb3plbkF0b20gPSBqb3RhaS5hdG9tKGZ1bmN0aW9uIChnZXQpIHtcbiAgICByZXR1cm4gZGVlcEZyZWV6ZShnZXQoYW5BdG9tKSk7XG4gIH0sIGZ1bmN0aW9uIChfZ2V0LCBzZXQsIGFyZykge1xuICAgIHJldHVybiBzZXQoYW5BdG9tLCBhcmcpO1xuICB9KTtcbiAgZnJvemVuQXRvbS5zY29wZSA9IGFuQXRvbS5zY29wZTtcbiAgc2V0V2Vha0NhY2hlSXRlbShmcmVlemVBdG9tQ2FjaGUsIGRlcHMsIGZyb3plbkF0b20pO1xuICByZXR1cm4gZnJvemVuQXRvbTtcbn1cbmZ1bmN0aW9uIGZyZWV6ZUF0b21DcmVhdG9yKGNyZWF0ZUF0b20pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYW5BdG9tID0gY3JlYXRlQXRvbS5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG4gICAgdmFyIG9yaWdSZWFkID0gYW5BdG9tLnJlYWQ7XG5cbiAgICBhbkF0b20ucmVhZCA9IGZ1bmN0aW9uIChnZXQpIHtcbiAgICAgIHJldHVybiBkZWVwRnJlZXplKG9yaWdSZWFkKGdldCkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gYW5BdG9tO1xuICB9O1xufVxuXG52YXIgc3BsaXRBdG9tQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG52YXIgaXNXcml0YWJsZSA9IGZ1bmN0aW9uIGlzV3JpdGFibGUoYXRvbSkge1xuICByZXR1cm4gISFhdG9tLndyaXRlO1xufTtcblxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufTtcblxuZnVuY3Rpb24gc3BsaXRBdG9tKGFyckF0b20sIGtleUV4dHJhY3Rvcikge1xuICB2YXIgZGVwcyA9IGtleUV4dHJhY3RvciA/IFthcnJBdG9tLCBrZXlFeHRyYWN0b3JdIDogW2FyckF0b21dO1xuICB2YXIgY2FjaGVkQXRvbSA9IGdldFdlYWtDYWNoZUl0ZW0oc3BsaXRBdG9tQ2FjaGUsIGRlcHMpO1xuXG4gIGlmIChjYWNoZWRBdG9tKSB7XG4gICAgcmV0dXJuIGNhY2hlZEF0b207XG4gIH1cblxuICB2YXIgY3VycmVudEF0b21MaXN0O1xuICB2YXIgY3VycmVudEtleUxpc3Q7XG5cbiAgdmFyIGtleVRvQXRvbSA9IGZ1bmN0aW9uIGtleVRvQXRvbShrZXkpIHtcbiAgICB2YXIgX2N1cnJlbnRLZXlMaXN0LCBfY3VycmVudEF0b21MaXN0O1xuXG4gICAgdmFyIGluZGV4ID0gKF9jdXJyZW50S2V5TGlzdCA9IGN1cnJlbnRLZXlMaXN0KSA9PSBudWxsID8gdm9pZCAwIDogX2N1cnJlbnRLZXlMaXN0LmluZGV4T2Yoa2V5KTtcblxuICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkIHx8IGluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gKF9jdXJyZW50QXRvbUxpc3QgPSBjdXJyZW50QXRvbUxpc3QpID09IG51bGwgPyB2b2lkIDAgOiBfY3VycmVudEF0b21MaXN0W2luZGV4XTtcbiAgfTtcblxuICB2YXIgcmVhZCA9IGZ1bmN0aW9uIHJlYWQoZ2V0KSB7XG4gICAgdmFyIG5leHRBdG9tTGlzdCA9IFtdO1xuICAgIHZhciBuZXh0S2V5TGlzdCA9IFtdO1xuICAgIGdldChhcnJBdG9tKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIGtleSA9IGtleUV4dHJhY3RvciA/IGtleUV4dHJhY3RvcihpdGVtKSA6IGluZGV4O1xuICAgICAgbmV4dEtleUxpc3RbaW5kZXhdID0ga2V5O1xuICAgICAgdmFyIGNhY2hlZEF0b20gPSBrZXlUb0F0b20oa2V5KTtcblxuICAgICAgaWYgKGNhY2hlZEF0b20pIHtcbiAgICAgICAgbmV4dEF0b21MaXN0W2luZGV4XSA9IGNhY2hlZEF0b207XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlYWQgPSBmdW5jdGlvbiByZWFkKGdldCkge1xuICAgICAgICB2YXIgX2N1cnJlbnRLZXlMaXN0MjtcblxuICAgICAgICB2YXIgaW5kZXggPSAoX2N1cnJlbnRLZXlMaXN0MiA9IGN1cnJlbnRLZXlMaXN0KSA9PSBudWxsID8gdm9pZCAwIDogX2N1cnJlbnRLZXlMaXN0Mi5pbmRleE9mKGtleSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQgfHwgaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbmRleCBub3QgZm91bmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnZXQoYXJyQXRvbSlbaW5kZXhdO1xuICAgICAgfTtcblxuICAgICAgdmFyIHdyaXRlID0gZnVuY3Rpb24gd3JpdGUoZ2V0LCBzZXQsIHVwZGF0ZSkge1xuICAgICAgICB2YXIgX2N1cnJlbnRLZXlMaXN0MztcblxuICAgICAgICB2YXIgaW5kZXggPSAoX2N1cnJlbnRLZXlMaXN0MyA9IGN1cnJlbnRLZXlMaXN0KSA9PSBudWxsID8gdm9pZCAwIDogX2N1cnJlbnRLZXlMaXN0My5pbmRleE9mKGtleSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQgfHwgaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbmRleCBub3QgZm91bmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcmV2ID0gZ2V0KGFyckF0b20pO1xuICAgICAgICB2YXIgbmV4dEl0ZW0gPSBpc0Z1bmN0aW9uKHVwZGF0ZSkgPyB1cGRhdGUocHJldltpbmRleF0pIDogdXBkYXRlO1xuICAgICAgICBzZXQoYXJyQXRvbSwgW10uY29uY2F0KHByZXYuc2xpY2UoMCwgaW5kZXgpLCBbbmV4dEl0ZW1dLCBwcmV2LnNsaWNlKGluZGV4ICsgMSkpKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBpdGVtQXRvbSA9IGlzV3JpdGFibGUoYXJyQXRvbSkgPyBqb3RhaS5hdG9tKHJlYWQsIHdyaXRlKSA6IGpvdGFpLmF0b20ocmVhZCk7XG4gICAgICBpdGVtQXRvbS5zY29wZSA9IGFyckF0b20uc2NvcGU7XG4gICAgICBuZXh0QXRvbUxpc3RbaW5kZXhdID0gaXRlbUF0b207XG4gICAgfSk7XG4gICAgY3VycmVudEtleUxpc3QgPSBuZXh0S2V5TGlzdDtcblxuICAgIGlmIChjdXJyZW50QXRvbUxpc3QgJiYgY3VycmVudEF0b21MaXN0Lmxlbmd0aCA9PT0gbmV4dEF0b21MaXN0Lmxlbmd0aCAmJiBjdXJyZW50QXRvbUxpc3QuZXZlcnkoZnVuY3Rpb24gKHgsIGkpIHtcbiAgICAgIHJldHVybiB4ID09PSBuZXh0QXRvbUxpc3RbaV07XG4gICAgfSkpIHtcbiAgICAgIHJldHVybiBjdXJyZW50QXRvbUxpc3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRBdG9tTGlzdCA9IG5leHRBdG9tTGlzdDtcbiAgfTtcblxuICB2YXIgd3JpdGUgPSBmdW5jdGlvbiB3cml0ZShnZXQsIHNldCwgYXRvbVRvUmVtb3ZlKSB7XG4gICAgdmFyIGluZGV4ID0gZ2V0KHNwbGl0dGVkQXRvbSkuaW5kZXhPZihhdG9tVG9SZW1vdmUpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBwcmV2ID0gZ2V0KGFyckF0b20pO1xuICAgICAgc2V0KGFyckF0b20sIFtdLmNvbmNhdChwcmV2LnNsaWNlKDAsIGluZGV4KSwgcHJldi5zbGljZShpbmRleCArIDEpKSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBzcGxpdHRlZEF0b20gPSBpc1dyaXRhYmxlKGFyckF0b20pID8gam90YWkuYXRvbShyZWFkLCB3cml0ZSkgOiBqb3RhaS5hdG9tKHJlYWQpO1xuICBzcGxpdHRlZEF0b20uc2NvcGUgPSBhcnJBdG9tLnNjb3BlO1xuICBzZXRXZWFrQ2FjaGVJdGVtKHNwbGl0QXRvbUNhY2hlLCBkZXBzLCBzcGxpdHRlZEF0b20pO1xuICByZXR1cm4gc3BsaXR0ZWRBdG9tO1xufVxuXG5mdW5jdGlvbiBhdG9tV2l0aERlZmF1bHQoZ2V0RGVmYXVsdCkge1xuICB2YXIgRU1QVFkgPSBTeW1ib2woKTtcbiAgdmFyIG92ZXJ3cml0dGVuQXRvbSA9IGpvdGFpLmF0b20oRU1QVFkpO1xuICB2YXIgYW5BdG9tID0gam90YWkuYXRvbShmdW5jdGlvbiAoZ2V0KSB7XG4gICAgdmFyIG92ZXJ3cml0dGVuID0gZ2V0KG92ZXJ3cml0dGVuQXRvbSk7XG5cbiAgICBpZiAob3ZlcndyaXR0ZW4gIT09IEVNUFRZKSB7XG4gICAgICByZXR1cm4gb3ZlcndyaXR0ZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldERlZmF1bHQoZ2V0KTtcbiAgfSwgZnVuY3Rpb24gKGdldCwgc2V0LCB1cGRhdGUpIHtcbiAgICByZXR1cm4gc2V0KG92ZXJ3cml0dGVuQXRvbSwgdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoYW5BdG9tKSkgOiB1cGRhdGUpO1xuICB9KTtcbiAgcmV0dXJuIGFuQXRvbTtcbn1cblxudmFyIHdhaXRGb3JBbGxDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiB3YWl0Rm9yQWxsKGF0b21zKSB7XG4gIHZhciBjYWNoZWRBdG9tID0gQXJyYXkuaXNBcnJheShhdG9tcykgJiYgZ2V0V2Vha0NhY2hlSXRlbSh3YWl0Rm9yQWxsQ2FjaGUsIGF0b21zKTtcblxuICBpZiAoY2FjaGVkQXRvbSkge1xuICAgIHJldHVybiBjYWNoZWRBdG9tO1xuICB9XG5cbiAgdmFyIHVud3JhcHBlZEF0b21zID0gdW53cmFwQXRvbXMoYXRvbXMpO1xuICB2YXIgZGVyaXZlZEF0b20gPSBqb3RhaS5hdG9tKGZ1bmN0aW9uIChnZXQpIHtcbiAgICB2YXIgcHJvbWlzZXMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gdW53cmFwcGVkQXRvbXMubWFwKGZ1bmN0aW9uIChhbkF0b20sIGluZGV4KSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZ2V0KGFuQXRvbSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHByb21pc2VzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwUmVzdWx0cyhhdG9tcywgdmFsdWVzKTtcbiAgfSk7XG4gIHZhciB3YWl0Rm9yQWxsU2NvcGUgPSB1bndyYXBwZWRBdG9tc1swXS5zY29wZTtcbiAgZGVyaXZlZEF0b20uc2NvcGUgPSB3YWl0Rm9yQWxsU2NvcGU7XG4gIHZhbGlkYXRlQXRvbVNjb3Blcyh3YWl0Rm9yQWxsU2NvcGUsIHVud3JhcHBlZEF0b21zKTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShhdG9tcykpIHtcbiAgICBzZXRXZWFrQ2FjaGVJdGVtKHdhaXRGb3JBbGxDYWNoZSwgYXRvbXMsIGRlcml2ZWRBdG9tKTtcbiAgfVxuXG4gIHJldHVybiBkZXJpdmVkQXRvbTtcbn1cblxudmFyIHVud3JhcEF0b21zID0gZnVuY3Rpb24gdW53cmFwQXRvbXMoYXRvbXMpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXRvbXMpID8gYXRvbXMgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhdG9tcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gYXRvbXNba2V5XTtcbiAgfSk7XG59O1xuXG52YXIgd3JhcFJlc3VsdHMgPSBmdW5jdGlvbiB3cmFwUmVzdWx0cyhhdG9tcywgcmVzdWx0cykge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhdG9tcykgPyByZXN1bHRzIDogT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYXRvbXMpLnJlZHVjZShmdW5jdGlvbiAob3V0LCBrZXksIGlkeCkge1xuICAgIHZhciBfZXh0ZW5kczI7XG5cbiAgICByZXR1cm4gX2V4dGVuZHMoe30sIG91dCwgKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJba2V5XSA9IHJlc3VsdHNbaWR4XSwgX2V4dGVuZHMyKSk7XG4gIH0sIHt9KTtcbn07XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXRvbVNjb3BlcyhzY29wZSwgYXRvbXMpIHtcbiAgaWYgKHNjb3BlICYmICFhdG9tcy5ldmVyeShmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBhLnNjb3BlID09PSBzY29wZTtcbiAgfSkpIHtcbiAgICBjb25zb2xlLndhcm4oJ0RpZmZlcmVudCBzY29wZXMgd2VyZSBmb3VuZCBmb3IgYXRvbXMgc3VwcGxpZWQgdG8gd2FpdEZvckFsbC4gVGhpcyBpcyB1bnN1cHBvcnRlZCBhbmQgd2lsbCByZXN1bHQgaW4gdW5leHBlY3RlZCBiZWhhdmlvci4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhdG9tV2l0aEhhc2goa2V5LCBpbml0aWFsVmFsdWUsIHNlcmlhbGl6ZSwgZGVzZXJpYWxpemUpIHtcbiAgaWYgKHNlcmlhbGl6ZSA9PT0gdm9pZCAwKSB7XG4gICAgc2VyaWFsaXplID0gSlNPTi5zdHJpbmdpZnk7XG4gIH1cblxuICBpZiAoZGVzZXJpYWxpemUgPT09IHZvaWQgMCkge1xuICAgIGRlc2VyaWFsaXplID0gSlNPTi5wYXJzZTtcbiAgfVxuXG4gIHZhciBhbkF0b20gPSBqb3RhaS5hdG9tKGluaXRpYWxWYWx1ZSwgZnVuY3Rpb24gKGdldCwgc2V0LCB1cGRhdGUpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0eXBlb2YgdXBkYXRlID09PSAnZnVuY3Rpb24nID8gdXBkYXRlKGdldChhbkF0b20pKSA6IHVwZGF0ZTtcbiAgICBzZXQoYW5BdG9tLCBuZXdWYWx1ZSk7XG4gICAgdmFyIHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zbGljZSgxKSk7XG4gICAgc2VhcmNoUGFyYW1zLnNldChrZXksIHNlcmlhbGl6ZShuZXdWYWx1ZSkpO1xuICAgIGxvY2F0aW9uLmhhc2ggPSBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcbiAgfSk7XG5cbiAgYW5BdG9tLm9uTW91bnQgPSBmdW5jdGlvbiAoc2V0QXRvbSkge1xuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgICAgdmFyIHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zbGljZSgxKSk7XG4gICAgICB2YXIgc3RyID0gc2VhcmNoUGFyYW1zLmdldChrZXkpO1xuXG4gICAgICBpZiAoc3RyICE9PSBudWxsKSB7XG4gICAgICAgIHNldEF0b20oZGVzZXJpYWxpemUoc3RyKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgY2FsbGJhY2spO1xuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIGFuQXRvbTtcbn1cblxudmFyIGRlZmF1bHRTdG9yYWdlID0ge1xuICBnZXRJdGVtOiBmdW5jdGlvbiBnZXRJdGVtKGtleSkge1xuICAgIHZhciBzdG9yZWRWYWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG5cbiAgICBpZiAoc3RvcmVkVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gdmFsdWUgc3RvcmVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RvcmVkVmFsdWUpO1xuICB9LFxuICBzZXRJdGVtOiBmdW5jdGlvbiBzZXRJdGVtKGtleSwgbmV3VmFsdWUpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG5ld1ZhbHVlKSk7XG4gIH1cbn07XG5mdW5jdGlvbiBhdG9tV2l0aFN0b3JhZ2Uoa2V5LCBpbml0aWFsVmFsdWUsIHN0b3JhZ2UpIHtcbiAgaWYgKHN0b3JhZ2UgPT09IHZvaWQgMCkge1xuICAgIHN0b3JhZ2UgPSBkZWZhdWx0U3RvcmFnZTtcbiAgfVxuXG4gIHZhciBnZXRJbml0aWFsVmFsdWUgPSBmdW5jdGlvbiBnZXRJbml0aWFsVmFsdWUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9IGNhdGNoIChfdW51c2VkKSB7XG4gICAgICByZXR1cm4gaW5pdGlhbFZhbHVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIgYmFzZUF0b20gPSBqb3RhaS5hdG9tKGluaXRpYWxWYWx1ZSk7XG5cbiAgYmFzZUF0b20ub25Nb3VudCA9IGZ1bmN0aW9uIChzZXRBdG9tKSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKGdldEluaXRpYWxWYWx1ZSgpKS50aGVuKHNldEF0b20pO1xuICB9O1xuXG4gIHZhciBhbkF0b20gPSBqb3RhaS5hdG9tKGZ1bmN0aW9uIChnZXQpIHtcbiAgICByZXR1cm4gZ2V0KGJhc2VBdG9tKTtcbiAgfSwgZnVuY3Rpb24gKGdldCwgc2V0LCB1cGRhdGUpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0eXBlb2YgdXBkYXRlID09PSAnZnVuY3Rpb24nID8gdXBkYXRlKGdldChiYXNlQXRvbSkpIDogdXBkYXRlO1xuICAgIHNldChiYXNlQXRvbSwgbmV3VmFsdWUpO1xuICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIG5ld1ZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiBhbkF0b207XG59XG5cbmV4cG9ydHMuUkVTRVQgPSBSRVNFVDtcbmV4cG9ydHMuYXRvbUZhbWlseSA9IGF0b21GYW1pbHk7XG5leHBvcnRzLmF0b21XaXRoRGVmYXVsdCA9IGF0b21XaXRoRGVmYXVsdDtcbmV4cG9ydHMuYXRvbVdpdGhIYXNoID0gYXRvbVdpdGhIYXNoO1xuZXhwb3J0cy5hdG9tV2l0aFJlZHVjZXIgPSBhdG9tV2l0aFJlZHVjZXI7XG5leHBvcnRzLmF0b21XaXRoUmVzZXQgPSBhdG9tV2l0aFJlc2V0O1xuZXhwb3J0cy5hdG9tV2l0aFN0b3JhZ2UgPSBhdG9tV2l0aFN0b3JhZ2U7XG5leHBvcnRzLmZyZWV6ZUF0b20gPSBmcmVlemVBdG9tO1xuZXhwb3J0cy5mcmVlemVBdG9tQ3JlYXRvciA9IGZyZWV6ZUF0b21DcmVhdG9yO1xuZXhwb3J0cy5zZWxlY3RBdG9tID0gc2VsZWN0QXRvbTtcbmV4cG9ydHMuc3BsaXRBdG9tID0gc3BsaXRBdG9tO1xuZXhwb3J0cy51c2VBdG9tQ2FsbGJhY2sgPSB1c2VBdG9tQ2FsbGJhY2s7XG5leHBvcnRzLnVzZUF0b21WYWx1ZSA9IHVzZUF0b21WYWx1ZTtcbmV4cG9ydHMudXNlUmVkdWNlckF0b20gPSB1c2VSZWR1Y2VyQXRvbTtcbmV4cG9ydHMudXNlUmVzZXRBdG9tID0gdXNlUmVzZXRBdG9tO1xuZXhwb3J0cy51c2VVcGRhdGVBdG9tID0gdXNlVXBkYXRlQXRvbTtcbmV4cG9ydHMud2FpdEZvckFsbCA9IHdhaXRGb3JBbGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciB2YW5pbGxhID0gcmVxdWlyZSgndmFsdGlvL3ZhbmlsbGEnKTtcbnZhciBqb3RhaSA9IHJlcXVpcmUoJ2pvdGFpJyk7XG5cbnZhciBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufTtcblxudmFyIGFwcGx5Q2hhbmdlcyA9IGZ1bmN0aW9uIGFwcGx5Q2hhbmdlcyhwcm94eU9iamVjdCwgcHJldiwgbmV4dCkge1xuICBPYmplY3Qua2V5cyhwcmV2KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIShrZXkgaW4gbmV4dCkpIHtcbiAgICAgIGRlbGV0ZSBwcm94eU9iamVjdFtrZXldO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmlzKHByZXZba2V5XSwgbmV4dFtrZXldKSkgOyBlbHNlIGlmIChpc09iamVjdChwcm94eU9iamVjdFtrZXldKSAmJiBpc09iamVjdChwcmV2W2tleV0pICYmIGlzT2JqZWN0KG5leHRba2V5XSkpIHtcbiAgICAgIGFwcGx5Q2hhbmdlcyhwcm94eU9iamVjdFtrZXldLCBwcmV2W2tleV0sIG5leHRba2V5XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3h5T2JqZWN0W2tleV0gPSBuZXh0W2tleV07XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmtleXMobmV4dCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCEoa2V5IGluIHByZXYpKSB7XG4gICAgICBwcm94eU9iamVjdFtrZXldID0gbmV4dFtrZXldO1xuICAgIH1cbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBhdG9tV2l0aFByb3h5KHByb3h5T2JqZWN0KSB7XG4gIHZhciBiYXNlQXRvbSA9IGpvdGFpLmF0b20odmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuXG4gIGJhc2VBdG9tLm9uTW91bnQgPSBmdW5jdGlvbiAoc2V0VmFsdWUpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgIHNldFZhbHVlKHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpKTtcbiAgICB9O1xuXG4gICAgdmFyIHVuc3ViID0gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjaygpO1xuICAgIHJldHVybiB1bnN1YjtcbiAgfTtcblxuICB2YXIgZGVyaXZlZEF0b20gPSBqb3RhaS5hdG9tKGZ1bmN0aW9uIChnZXQpIHtcbiAgICByZXR1cm4gZ2V0KGJhc2VBdG9tKTtcbiAgfSwgZnVuY3Rpb24gKGdldCwgX3NldCwgdXBkYXRlKSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdHlwZW9mIHVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHVwZGF0ZShnZXQoYmFzZUF0b20pKSA6IHVwZGF0ZTtcbiAgICBhcHBseUNoYW5nZXMocHJveHlPYmplY3QsIHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpLCBuZXdWYWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gZGVyaXZlZEF0b207XG59XG5cbmV4cG9ydHMuYXRvbVdpdGhQcm94eSA9IGF0b21XaXRoUHJveHk7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoKGV8fHNlbGYpLnByb3h5Q29tcGFyZT17fSl9KHRoaXMsZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlLHQpeyhudWxsPT10fHx0PmUubGVuZ3RoKSYmKHQ9ZS5sZW5ndGgpO2Zvcih2YXIgcj0wLG49bmV3IEFycmF5KHQpO3I8dDtyKyspbltyXT1lW3JdO3JldHVybiBufXZhciByPVN5bWJvbCgpLG49U3ltYm9sKCksbz1TeW1ib2woKSxpPU9iamVjdC5nZXRQcm90b3R5cGVPZix1PW5ldyBXZWFrTWFwLGE9ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJih1LmhhcyhlKT91LmdldChlKTppKGUpPT09T2JqZWN0LnByb3RvdHlwZXx8aShlKT09PUFycmF5LnByb3RvdHlwZSl9LGY9ZnVuY3Rpb24oZSl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGUmJm51bGwhPT1lfSxjPWZ1bmN0aW9uKGUsdCx1KXtpZighYShlKSlyZXR1cm4gZTt2YXIgZj1lW29dfHxlLHM9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5pc0Zyb3plbihlKXx8T2JqZWN0LnZhbHVlcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhlKSkuc29tZShmdW5jdGlvbihlKXtyZXR1cm4hZS53cml0YWJsZX0pfShmKSxsPXUmJnUuZ2V0KGYpO3JldHVybiBsJiZsLmY9PT1zfHwoKGw9ZnVuY3Rpb24oZSx0KXt2YXIgaSx1PSExLGE9ZnVuY3Rpb24odCxyKXtpZighdSl7dmFyIG49dC5hLmdldChlKTtufHwobj1uZXcgU2V0LHQuYS5zZXQoZSxuKSksbi5hZGQocil9fSxmPSgoaT17fSkuZj10LGkuZ2V0PWZ1bmN0aW9uKHQscil7cmV0dXJuIHI9PT1vP2U6KGEodGhpcyxyKSxjKHRbcl0sdGhpcy5hLHRoaXMuYykpfSxpLmhhcz1mdW5jdGlvbih0LHIpe3JldHVybiByPT09bj8odT0hMCx0aGlzLmEuZGVsZXRlKGUpLCEwKTooYSh0aGlzLHIpLHIgaW4gdCl9LGkub3duS2V5cz1mdW5jdGlvbihlKXtyZXR1cm4gYSh0aGlzLHIpLFJlZmxlY3Qub3duS2V5cyhlKX0saSk7cmV0dXJuIHQmJihmLnNldD1mLmRlbGV0ZVByb3BlcnR5PWZ1bmN0aW9uKCl7cmV0dXJuITF9KSxmfShmLHMpKS5wPW5ldyBQcm94eShzP2Z1bmN0aW9uKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpcmV0dXJuIEFycmF5LmZyb20oZSk7dmFyIHQ9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoZSk7cmV0dXJuIE9iamVjdC52YWx1ZXModCkuZm9yRWFjaChmdW5jdGlvbihlKXtlLmNvbmZpZ3VyYWJsZT0hMH0pLE9iamVjdC5jcmVhdGUoaShlKSx0KX0oZik6ZixsKSx1JiZ1LnNldChmLGwpKSxsLmE9dCxsLmM9dSxsLnB9LHM9ZnVuY3Rpb24oZSx0KXt2YXIgcj1SZWZsZWN0Lm93bktleXMoZSksbj1SZWZsZWN0Lm93bktleXModCk7cmV0dXJuIHIubGVuZ3RoIT09bi5sZW5ndGh8fHIuc29tZShmdW5jdGlvbihlLHQpe3JldHVybiBlIT09blt0XX0pfTtlLk1PREVfQVNTVU1FX1VOQ0hBTkdFRF9JRl9VTkFGRkVDVEVEPTEsZS5NT0RFX0FTU1VNRV9VTkNIQU5HRURfSUZfVU5BRkZFQ1RFRF9JTl9ERUVQPTQsZS5NT0RFX0lHTk9SRV9SRUZfRVFVQUxJVFk9MixlLk1PREVfSUdOT1JFX1JFRl9FUVVBTElUWV9JTl9ERUVQPTgsZS5hZmZlY3RlZFRvUGF0aExpc3Q9ZnVuY3Rpb24oZSx0KXt2YXIgcj1bXTtyZXR1cm4gZnVuY3Rpb24gZShuLG8pe3ZhciBpPXQuZ2V0KG4pO2k/aS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2Uoblt0XSxvP1tdLmNvbmNhdChvLFt0XSk6W3RdKX0pOm8mJnIucHVzaChvKX0oZSkscn0sZS5jcmVhdGVEZWVwUHJveHk9YyxlLmdldFVudHJhY2tlZE9iamVjdD1mdW5jdGlvbihlKXtyZXR1cm4gYShlKSYmZVtvXXx8bnVsbH0sZS5pc0RlZXBDaGFuZ2VkPWZ1bmN0aW9uIGUobixvLGksdSxhKXtpZih2b2lkIDA9PT1hJiYoYT0wKSxPYmplY3QuaXMobixvKSYmKCFmKG4pfHwwPT0oMiZhKSkpcmV0dXJuITE7aWYoIWYobil8fCFmKG8pKXJldHVybiEwO3ZhciBjPWkuZ2V0KG4pO2lmKCFjKXJldHVybiAwPT0oMSZhKTtpZih1JiYwPT0oMiZhKSl7dmFyIGwseT11LmdldChuKTtpZih5JiZ5Lm49PT1vKXJldHVybiB5Lmc7dS5zZXQobiwoKGw9e30pLm49byxsLmc9ITEsbCkpfWZvcih2YXIgcCxiLGQ9bnVsbCxnPWZ1bmN0aW9uKGUscil7dmFyIG47aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFN5bWJvbHx8bnVsbD09ZVtTeW1ib2wuaXRlcmF0b3JdKXtpZihBcnJheS5pc0FycmF5KGUpfHwobj1mdW5jdGlvbihlLHIpe2lmKGUpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXJldHVybiB0KGUscik7dmFyIG49T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpLnNsaWNlKDgsLTEpO3JldHVyblwiT2JqZWN0XCI9PT1uJiZlLmNvbnN0cnVjdG9yJiYobj1lLmNvbnN0cnVjdG9yLm5hbWUpLFwiTWFwXCI9PT1ufHxcIlNldFwiPT09bj9BcnJheS5mcm9tKGUpOlwiQXJndW1lbnRzXCI9PT1ufHwvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKT90KGUscik6dm9pZCAwfX0oZSkpKXtuJiYoZT1uKTt2YXIgbz0wO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBvPj1lLmxlbmd0aD97ZG9uZTohMH06e2RvbmU6ITEsdmFsdWU6ZVtvKytdfX19dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpfXJldHVybihuPWVbU3ltYm9sLml0ZXJhdG9yXSgpKS5uZXh0LmJpbmQobil9KGMpOyEocD1nKCkpLmRvbmU7KXt2YXIgdj1wLnZhbHVlLEU9dj09PXI/cyhuLG8pOmUoblt2XSxvW3ZdLGksdSxhPj4+Mjw8MnxhPj4+Mik7aWYoITAhPT1FJiYhMSE9PUV8fChkPUUpLGQpYnJlYWt9cmV0dXJuIG51bGw9PT1kJiYoZD0wPT0oMSZhKSksdSYmMD09KDImYSkmJnUuc2V0KG4sKChiPXt9KS5uPW8sYi5nPWQsYikpLGR9LGUubWFya1RvVHJhY2s9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT10JiYodD0hMCksdS5zZXQoZSx0KX0sZS50cmFja01lbW89ZnVuY3Rpb24oZSl7cmV0dXJuISFhKGUpJiZuIGluIGV9fSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC51bWQuanMubWFwXG4iLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgZT1yZXF1aXJlKFwib2JqZWN0LWFzc2lnblwiKSx0PXJlcXVpcmUoXCJyZWFjdFwiKSxuPXJlcXVpcmUoXCJzY2hlZHVsZXJcIik7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmXCJvYmplY3RcIj09dHlwZW9mIGUmJlwiZGVmYXVsdFwiaW4gZT9lOntkZWZhdWx0OmV9fXZhciBsPXIoZSksaT1yKHQpLHU9cihuKTt2YXIgYSxvLGM9KGZ1bmN0aW9uKGUpe1xuLyoqIEBsaWNlbnNlIFJlYWN0IHYwLjI1LjFcbiAqIHJlYWN0LXJlY29uY2lsZXIucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuZS5leHBvcnRzPWZ1bmN0aW9uIHQobil7dmFyIHI9bC5kZWZhdWx0LGE9aS5kZWZhdWx0LG89dS5kZWZhdWx0O2Z1bmN0aW9uIGMoZSl7Zm9yKHZhciB0PVwiaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL2Vycm9yLWRlY29kZXIuaHRtbD9pbnZhcmlhbnQ9XCIrZSxuPTE7bjxhcmd1bWVudHMubGVuZ3RoO24rKyl0Kz1cIiZhcmdzW109XCIrZW5jb2RlVVJJQ29tcG9uZW50KGFyZ3VtZW50c1tuXSk7cmV0dXJuXCJNaW5pZmllZCBSZWFjdCBlcnJvciAjXCIrZStcIjsgdmlzaXQgXCIrdCtcIiBmb3IgdGhlIGZ1bGwgbWVzc2FnZSBvciB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgZm9yIGZ1bGwgZXJyb3JzIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuXCJ9dmFyIGY9YS5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDtmLmhhc093blByb3BlcnR5KFwiUmVhY3RDdXJyZW50RGlzcGF0Y2hlclwiKXx8KGYuUmVhY3RDdXJyZW50RGlzcGF0Y2hlcj17Y3VycmVudDpudWxsfSksZi5oYXNPd25Qcm9wZXJ0eShcIlJlYWN0Q3VycmVudEJhdGNoQ29uZmlnXCIpfHwoZi5SZWFjdEN1cnJlbnRCYXRjaENvbmZpZz17c3VzcGVuc2U6bnVsbH0pO3ZhciBzPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvcixkPXM/U3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIik6NjAxMDMscD1zP1N5bWJvbC5mb3IoXCJyZWFjdC5wb3J0YWxcIik6NjAxMDYsbT1zP1N5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKTo2MDEwNyxoPXM/U3ltYm9sLmZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpOjYwMTA4LGc9cz9TeW1ib2wuZm9yKFwicmVhY3QucHJvZmlsZXJcIik6NjAxMTQsYj1zP1N5bWJvbC5mb3IoXCJyZWFjdC5wcm92aWRlclwiKTo2MDEwOSx2PXM/U3ltYm9sLmZvcihcInJlYWN0LmNvbnRleHRcIik6NjAxMTAseT1zP1N5bWJvbC5mb3IoXCJyZWFjdC5jb25jdXJyZW50X21vZGVcIik6NjAxMTEsVD1zP1N5bWJvbC5mb3IoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKTo2MDExMix4PXM/U3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpOjYwMTEzLEU9cz9TeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VfbGlzdFwiKTo2MDEyMCxTPXM/U3ltYm9sLmZvcihcInJlYWN0Lm1lbW9cIik6NjAxMTUsaz1zP1N5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpOjYwMTE2LHc9cz9TeW1ib2wuZm9yKFwicmVhY3QuYmxvY2tcIik6NjAxMjEsej1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5pdGVyYXRvcjtmdW5jdGlvbiBDKGUpe3JldHVybiBudWxsPT09ZXx8XCJvYmplY3RcIiE9dHlwZW9mIGU/bnVsbDpcImZ1bmN0aW9uXCI9PXR5cGVvZihlPXomJmVbel18fGVbXCJAQGl0ZXJhdG9yXCJdKT9lOm51bGx9ZnVuY3Rpb24gUChlKXtpZihudWxsPT1lKXJldHVybiBudWxsO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUpcmV0dXJuIGUuZGlzcGxheU5hbWV8fGUubmFtZXx8bnVsbDtpZihcInN0cmluZ1wiPT10eXBlb2YgZSlyZXR1cm4gZTtzd2l0Y2goZSl7Y2FzZSBtOnJldHVyblwiRnJhZ21lbnRcIjtjYXNlIHA6cmV0dXJuXCJQb3J0YWxcIjtjYXNlIGc6cmV0dXJuXCJQcm9maWxlclwiO2Nhc2UgaDpyZXR1cm5cIlN0cmljdE1vZGVcIjtjYXNlIHg6cmV0dXJuXCJTdXNwZW5zZVwiO2Nhc2UgRTpyZXR1cm5cIlN1c3BlbnNlTGlzdFwifWlmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXN3aXRjaChlLiQkdHlwZW9mKXtjYXNlIHY6cmV0dXJuXCJDb250ZXh0LkNvbnN1bWVyXCI7Y2FzZSBiOnJldHVyblwiQ29udGV4dC5Qcm92aWRlclwiO2Nhc2UgVDp2YXIgdD1lLnJlbmRlcjtyZXR1cm4gdD10LmRpc3BsYXlOYW1lfHx0Lm5hbWV8fFwiXCIsZS5kaXNwbGF5TmFtZXx8KFwiXCIhPT10P1wiRm9yd2FyZFJlZihcIit0K1wiKVwiOlwiRm9yd2FyZFJlZlwiKTtjYXNlIFM6cmV0dXJuIFAoZS50eXBlKTtjYXNlIHc6cmV0dXJuIFAoZS5yZW5kZXIpO2Nhc2UgazppZihlPTE9PT1lLl9zdGF0dXM/ZS5fcmVzdWx0Om51bGwpcmV0dXJuIFAoZSl9cmV0dXJuIG51bGx9ZnVuY3Rpb24gTihlKXt2YXIgdD1lLG49ZTtpZihlLmFsdGVybmF0ZSlmb3IoO3QucmV0dXJuOyl0PXQucmV0dXJuO2Vsc2V7ZT10O2RvezAhPSgxMDI2Jih0PWUpLmVmZmVjdFRhZykmJihuPXQucmV0dXJuKSxlPXQucmV0dXJufXdoaWxlKGUpfXJldHVybiAzPT09dC50YWc/bjpudWxsfWZ1bmN0aW9uIF8oZSl7aWYoTihlKSE9PWUpdGhyb3cgRXJyb3IoYygxODgpKX1mdW5jdGlvbiBJKGUpe3ZhciB0PWUuYWx0ZXJuYXRlO2lmKCF0KXtpZihudWxsPT09KHQ9TihlKSkpdGhyb3cgRXJyb3IoYygxODgpKTtyZXR1cm4gdCE9PWU/bnVsbDplfWZvcih2YXIgbj1lLHI9dDs7KXt2YXIgbD1uLnJldHVybjtpZihudWxsPT09bClicmVhazt2YXIgaT1sLmFsdGVybmF0ZTtpZihudWxsPT09aSl7aWYobnVsbCE9PShyPWwucmV0dXJuKSl7bj1yO2NvbnRpbnVlfWJyZWFrfWlmKGwuY2hpbGQ9PT1pLmNoaWxkKXtmb3IoaT1sLmNoaWxkO2k7KXtpZihpPT09bilyZXR1cm4gXyhsKSxlO2lmKGk9PT1yKXJldHVybiBfKGwpLHQ7aT1pLnNpYmxpbmd9dGhyb3cgRXJyb3IoYygxODgpKX1pZihuLnJldHVybiE9PXIucmV0dXJuKW49bCxyPWk7ZWxzZXtmb3IodmFyIHU9ITEsYT1sLmNoaWxkO2E7KXtpZihhPT09bil7dT0hMCxuPWwscj1pO2JyZWFrfWlmKGE9PT1yKXt1PSEwLHI9bCxuPWk7YnJlYWt9YT1hLnNpYmxpbmd9aWYoIXUpe2ZvcihhPWkuY2hpbGQ7YTspe2lmKGE9PT1uKXt1PSEwLG49aSxyPWw7YnJlYWt9aWYoYT09PXIpe3U9ITAscj1pLG49bDticmVha31hPWEuc2libGluZ31pZighdSl0aHJvdyBFcnJvcihjKDE4OSkpfX1pZihuLmFsdGVybmF0ZSE9PXIpdGhyb3cgRXJyb3IoYygxOTApKX1pZigzIT09bi50YWcpdGhyb3cgRXJyb3IoYygxODgpKTtyZXR1cm4gbi5zdGF0ZU5vZGUuY3VycmVudD09PW4/ZTp0fWZ1bmN0aW9uIFIoZSl7aWYoIShlPUkoZSkpKXJldHVybiBudWxsO2Zvcih2YXIgdD1lOzspe2lmKDU9PT10LnRhZ3x8Nj09PXQudGFnKXJldHVybiB0O2lmKHQuY2hpbGQpdC5jaGlsZC5yZXR1cm49dCx0PXQuY2hpbGQ7ZWxzZXtpZih0PT09ZSlicmVhaztmb3IoOyF0LnNpYmxpbmc7KXtpZighdC5yZXR1cm58fHQucmV0dXJuPT09ZSlyZXR1cm4gbnVsbDt0PXQucmV0dXJufXQuc2libGluZy5yZXR1cm49dC5yZXR1cm4sdD10LnNpYmxpbmd9fXJldHVybiBudWxsfXZhciBNPW4uZ2V0UHVibGljSW5zdGFuY2UsUT1uLmdldFJvb3RIb3N0Q29udGV4dCxVPW4uZ2V0Q2hpbGRIb3N0Q29udGV4dCxEPW4ucHJlcGFyZUZvckNvbW1pdCxGPW4ucmVzZXRBZnRlckNvbW1pdCxXPW4uY3JlYXRlSW5zdGFuY2UsSD1uLmFwcGVuZEluaXRpYWxDaGlsZCxqPW4uZmluYWxpemVJbml0aWFsQ2hpbGRyZW4sQT1uLnByZXBhcmVVcGRhdGUsQj1uLnNob3VsZFNldFRleHRDb250ZW50LE89bi5zaG91bGREZXByaW9yaXRpemVTdWJ0cmVlLEw9bi5jcmVhdGVUZXh0SW5zdGFuY2UscT1uLnNldFRpbWVvdXQsVj1uLmNsZWFyVGltZW91dCwkPW4ubm9UaW1lb3V0LEs9bi5pc1ByaW1hcnlSZW5kZXJlcixHPW4uc3VwcG9ydHNNdXRhdGlvbixZPW4uc3VwcG9ydHNQZXJzaXN0ZW5jZSxKPW4uc3VwcG9ydHNIeWRyYXRpb24sWD1uLmFwcGVuZENoaWxkLFo9bi5hcHBlbmRDaGlsZFRvQ29udGFpbmVyLGVlPW4uY29tbWl0VGV4dFVwZGF0ZSx0ZT1uLmNvbW1pdE1vdW50LG5lPW4uY29tbWl0VXBkYXRlLHJlPW4uaW5zZXJ0QmVmb3JlLGxlPW4uaW5zZXJ0SW5Db250YWluZXJCZWZvcmUsaWU9bi5yZW1vdmVDaGlsZCx1ZT1uLnJlbW92ZUNoaWxkRnJvbUNvbnRhaW5lcixhZT1uLnJlc2V0VGV4dENvbnRlbnQsb2U9bi5oaWRlSW5zdGFuY2UsY2U9bi5oaWRlVGV4dEluc3RhbmNlLGZlPW4udW5oaWRlSW5zdGFuY2Usc2U9bi51bmhpZGVUZXh0SW5zdGFuY2UsZGU9bi5jbG9uZUluc3RhbmNlLHBlPW4uY3JlYXRlQ29udGFpbmVyQ2hpbGRTZXQsbWU9bi5hcHBlbmRDaGlsZFRvQ29udGFpbmVyQ2hpbGRTZXQsaGU9bi5maW5hbGl6ZUNvbnRhaW5lckNoaWxkcmVuLGdlPW4ucmVwbGFjZUNvbnRhaW5lckNoaWxkcmVuLGJlPW4uY2xvbmVIaWRkZW5JbnN0YW5jZSx2ZT1uLmNsb25lSGlkZGVuVGV4dEluc3RhbmNlLHllPW4uY2FuSHlkcmF0ZUluc3RhbmNlLFRlPW4uY2FuSHlkcmF0ZVRleHRJbnN0YW5jZSx4ZT1uLmlzU3VzcGVuc2VJbnN0YW5jZVBlbmRpbmcsRWU9bi5pc1N1c3BlbnNlSW5zdGFuY2VGYWxsYmFjayxTZT1uLmdldE5leHRIeWRyYXRhYmxlU2libGluZyxrZT1uLmdldEZpcnN0SHlkcmF0YWJsZUNoaWxkLHdlPW4uaHlkcmF0ZUluc3RhbmNlLHplPW4uaHlkcmF0ZVRleHRJbnN0YW5jZSxDZT1uLmdldE5leHRIeWRyYXRhYmxlSW5zdGFuY2VBZnRlclN1c3BlbnNlSW5zdGFuY2UsUGU9bi5jb21taXRIeWRyYXRlZENvbnRhaW5lcixOZT1uLmNvbW1pdEh5ZHJhdGVkU3VzcGVuc2VJbnN0YW5jZSxfZT0vXiguKilbXFxcXFxcL10vO2Z1bmN0aW9uIEllKGUpe3ZhciB0PVwiXCI7ZG97ZTpzd2l0Y2goZS50YWcpe2Nhc2UgMzpjYXNlIDQ6Y2FzZSA2OmNhc2UgNzpjYXNlIDEwOmNhc2UgOTp2YXIgbj1cIlwiO2JyZWFrIGU7ZGVmYXVsdDp2YXIgcj1lLl9kZWJ1Z093bmVyLGw9ZS5fZGVidWdTb3VyY2UsaT1QKGUudHlwZSk7bj1udWxsLHImJihuPVAoci50eXBlKSkscj1pLGk9XCJcIixsP2k9XCIgKGF0IFwiK2wuZmlsZU5hbWUucmVwbGFjZShfZSxcIlwiKStcIjpcIitsLmxpbmVOdW1iZXIrXCIpXCI6biYmKGk9XCIgKGNyZWF0ZWQgYnkgXCIrbitcIilcIiksbj1cIlxcbiAgICBpbiBcIisocnx8XCJVbmtub3duXCIpK2l9dCs9bixlPWUucmV0dXJufXdoaWxlKGUpO3JldHVybiB0fXZhciBSZT1bXSxNZT0tMTtmdW5jdGlvbiBRZShlKXswPk1lfHwoZS5jdXJyZW50PVJlW01lXSxSZVtNZV09bnVsbCxNZS0tKX1mdW5jdGlvbiBVZShlLHQpe01lKyssUmVbTWVdPWUuY3VycmVudCxlLmN1cnJlbnQ9dH12YXIgRGU9e30sRmU9e2N1cnJlbnQ6RGV9LFdlPXtjdXJyZW50OiExfSxIZT1EZTtmdW5jdGlvbiBqZShlLHQpe3ZhciBuPWUudHlwZS5jb250ZXh0VHlwZXM7aWYoIW4pcmV0dXJuIERlO3ZhciByPWUuc3RhdGVOb2RlO2lmKHImJnIuX19yZWFjdEludGVybmFsTWVtb2l6ZWRVbm1hc2tlZENoaWxkQ29udGV4dD09PXQpcmV0dXJuIHIuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNYXNrZWRDaGlsZENvbnRleHQ7dmFyIGwsaT17fTtmb3IobCBpbiBuKWlbbF09dFtsXTtyZXR1cm4gciYmKChlPWUuc3RhdGVOb2RlKS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZFVubWFza2VkQ2hpbGRDb250ZXh0PXQsZS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZE1hc2tlZENoaWxkQ29udGV4dD1pKSxpfWZ1bmN0aW9uIEFlKGUpe3JldHVybiBudWxsIT0oZT1lLmNoaWxkQ29udGV4dFR5cGVzKX1mdW5jdGlvbiBCZSgpe1FlKFdlKSxRZShGZSl9ZnVuY3Rpb24gT2UoZSx0LG4pe2lmKEZlLmN1cnJlbnQhPT1EZSl0aHJvdyBFcnJvcihjKDE2OCkpO1VlKEZlLHQpLFVlKFdlLG4pfWZ1bmN0aW9uIExlKGUsdCxuKXt2YXIgbD1lLnN0YXRlTm9kZTtpZihlPXQuY2hpbGRDb250ZXh0VHlwZXMsXCJmdW5jdGlvblwiIT10eXBlb2YgbC5nZXRDaGlsZENvbnRleHQpcmV0dXJuIG47Zm9yKHZhciBpIGluIGw9bC5nZXRDaGlsZENvbnRleHQoKSlpZighKGkgaW4gZSkpdGhyb3cgRXJyb3IoYygxMDgsUCh0KXx8XCJVbmtub3duXCIsaSkpO3JldHVybiByKHt9LG4se30sbCl9ZnVuY3Rpb24gcWUoZSl7cmV0dXJuIGU9KGU9ZS5zdGF0ZU5vZGUpJiZlLl9fcmVhY3RJbnRlcm5hbE1lbW9pemVkTWVyZ2VkQ2hpbGRDb250ZXh0fHxEZSxIZT1GZS5jdXJyZW50LFVlKEZlLGUpLFVlKFdlLFdlLmN1cnJlbnQpLCEwfWZ1bmN0aW9uIFZlKGUsdCxuKXt2YXIgcj1lLnN0YXRlTm9kZTtpZighcil0aHJvdyBFcnJvcihjKDE2OSkpO24/KGU9TGUoZSx0LEhlKSxyLl9fcmVhY3RJbnRlcm5hbE1lbW9pemVkTWVyZ2VkQ2hpbGRDb250ZXh0PWUsUWUoV2UpLFFlKEZlKSxVZShGZSxlKSk6UWUoV2UpLFVlKFdlLG4pfXZhciAkZT1vLnVuc3RhYmxlX3J1bldpdGhQcmlvcml0eSxLZT1vLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2ssR2U9by51bnN0YWJsZV9jYW5jZWxDYWxsYmFjayxZZT1vLnVuc3RhYmxlX3JlcXVlc3RQYWludCxKZT1vLnVuc3RhYmxlX25vdyxYZT1vLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsLFplPW8udW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHksZXQ9by51bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSx0dD1vLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5LG50PW8udW5zdGFibGVfTG93UHJpb3JpdHkscnQ9by51bnN0YWJsZV9JZGxlUHJpb3JpdHksbHQ9e30saXQ9by51bnN0YWJsZV9zaG91bGRZaWVsZCx1dD12b2lkIDAhPT1ZZT9ZZTpmdW5jdGlvbigpe30sYXQ9bnVsbCxvdD1udWxsLGN0PSExLGZ0PUplKCksc3Q9MWU0PmZ0P0plOmZ1bmN0aW9uKCl7cmV0dXJuIEplKCktZnR9O2Z1bmN0aW9uIGR0KCl7c3dpdGNoKFhlKCkpe2Nhc2UgWmU6cmV0dXJuIDk5O2Nhc2UgZXQ6cmV0dXJuIDk4O2Nhc2UgdHQ6cmV0dXJuIDk3O2Nhc2UgbnQ6cmV0dXJuIDk2O2Nhc2UgcnQ6cmV0dXJuIDk1O2RlZmF1bHQ6dGhyb3cgRXJyb3IoYygzMzIpKX19ZnVuY3Rpb24gcHQoZSl7c3dpdGNoKGUpe2Nhc2UgOTk6cmV0dXJuIFplO2Nhc2UgOTg6cmV0dXJuIGV0O2Nhc2UgOTc6cmV0dXJuIHR0O2Nhc2UgOTY6cmV0dXJuIG50O2Nhc2UgOTU6cmV0dXJuIHJ0O2RlZmF1bHQ6dGhyb3cgRXJyb3IoYygzMzIpKX19ZnVuY3Rpb24gbXQoZSx0KXtyZXR1cm4gZT1wdChlKSwkZShlLHQpfWZ1bmN0aW9uIGh0KGUsdCxuKXtyZXR1cm4gZT1wdChlKSxLZShlLHQsbil9ZnVuY3Rpb24gZ3QoZSl7cmV0dXJuIG51bGw9PT1hdD8oYXQ9W2VdLG90PUtlKFplLHZ0KSk6YXQucHVzaChlKSxsdH1mdW5jdGlvbiBidCgpe2lmKG51bGwhPT1vdCl7dmFyIGU9b3Q7b3Q9bnVsbCxHZShlKX12dCgpfWZ1bmN0aW9uIHZ0KCl7aWYoIWN0JiZudWxsIT09YXQpe2N0PSEwO3ZhciBlPTA7dHJ5e3ZhciB0PWF0O210KDk5LChmdW5jdGlvbigpe2Zvcig7ZTx0Lmxlbmd0aDtlKyspe3ZhciBuPXRbZV07ZG97bj1uKCEwKX13aGlsZShudWxsIT09bil9fSkpLGF0PW51bGx9Y2F0Y2godCl7dGhyb3cgbnVsbCE9PWF0JiYoYXQ9YXQuc2xpY2UoZSsxKSksS2UoWmUsYnQpLHR9ZmluYWxseXtjdD0hMX19fWZ1bmN0aW9uIHl0KGUsdCxuKXtyZXR1cm4gMTA3Mzc0MTgyMS0oMSsoKDEwNzM3NDE4MjEtZSt0LzEwKS8obi89MTApfDApKSpufXZhciBUdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBPYmplY3QuaXM/T2JqZWN0LmlzOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGU9PT10JiYoMCE9PWV8fDEvZT09MS90KXx8ZSE9ZSYmdCE9dH0seHQ9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiBFdChlLHQpe2lmKFR0KGUsdCkpcmV0dXJuITA7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGV8fG51bGw9PT1lfHxcIm9iamVjdFwiIT10eXBlb2YgdHx8bnVsbD09PXQpcmV0dXJuITE7dmFyIG49T2JqZWN0LmtleXMoZSkscj1PYmplY3Qua2V5cyh0KTtpZihuLmxlbmd0aCE9PXIubGVuZ3RoKXJldHVybiExO2ZvcihyPTA7cjxuLmxlbmd0aDtyKyspaWYoIXh0LmNhbGwodCxuW3JdKXx8IVR0KGVbbltyXV0sdFtuW3JdXSkpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gU3QoZSx0KXtpZihlJiZlLmRlZmF1bHRQcm9wcylmb3IodmFyIG4gaW4gdD1yKHt9LHQpLGU9ZS5kZWZhdWx0UHJvcHMpdm9pZCAwPT09dFtuXSYmKHRbbl09ZVtuXSk7cmV0dXJuIHR9dmFyIGt0PXtjdXJyZW50Om51bGx9LHd0PW51bGwsenQ9bnVsbCxDdD1udWxsO2Z1bmN0aW9uIFB0KCl7Q3Q9enQ9d3Q9bnVsbH1mdW5jdGlvbiBOdChlLHQpe2U9ZS50eXBlLl9jb250ZXh0LEs/KFVlKGt0LGUuX2N1cnJlbnRWYWx1ZSksZS5fY3VycmVudFZhbHVlPXQpOihVZShrdCxlLl9jdXJyZW50VmFsdWUyKSxlLl9jdXJyZW50VmFsdWUyPXQpfWZ1bmN0aW9uIF90KGUpe3ZhciB0PWt0LmN1cnJlbnQ7UWUoa3QpLGU9ZS50eXBlLl9jb250ZXh0LEs/ZS5fY3VycmVudFZhbHVlPXQ6ZS5fY3VycmVudFZhbHVlMj10fWZ1bmN0aW9uIEl0KGUsdCl7Zm9yKDtudWxsIT09ZTspe3ZhciBuPWUuYWx0ZXJuYXRlO2lmKGUuY2hpbGRFeHBpcmF0aW9uVGltZTx0KWUuY2hpbGRFeHBpcmF0aW9uVGltZT10LG51bGwhPT1uJiZuLmNoaWxkRXhwaXJhdGlvblRpbWU8dCYmKG4uY2hpbGRFeHBpcmF0aW9uVGltZT10KTtlbHNle2lmKCEobnVsbCE9PW4mJm4uY2hpbGRFeHBpcmF0aW9uVGltZTx0KSlicmVhaztuLmNoaWxkRXhwaXJhdGlvblRpbWU9dH1lPWUucmV0dXJufX1mdW5jdGlvbiBSdChlLHQpe3d0PWUsQ3Q9enQ9bnVsbCxudWxsIT09KGU9ZS5kZXBlbmRlbmNpZXMpJiZudWxsIT09ZS5maXJzdENvbnRleHQmJihlLmV4cGlyYXRpb25UaW1lPj10JiYodXI9ITApLGUuZmlyc3RDb250ZXh0PW51bGwpfWZ1bmN0aW9uIE10KGUsdCl7aWYoQ3QhPT1lJiYhMSE9PXQmJjAhPT10KWlmKFwibnVtYmVyXCI9PXR5cGVvZiB0JiYxMDczNzQxODIzIT09dHx8KEN0PWUsdD0xMDczNzQxODIzKSx0PXtjb250ZXh0OmUsb2JzZXJ2ZWRCaXRzOnQsbmV4dDpudWxsfSxudWxsPT09enQpe2lmKG51bGw9PT13dCl0aHJvdyBFcnJvcihjKDMwOCkpO3p0PXQsd3QuZGVwZW5kZW5jaWVzPXtleHBpcmF0aW9uVGltZTowLGZpcnN0Q29udGV4dDp0LHJlc3BvbmRlcnM6bnVsbH19ZWxzZSB6dD16dC5uZXh0PXQ7cmV0dXJuIEs/ZS5fY3VycmVudFZhbHVlOmUuX2N1cnJlbnRWYWx1ZTJ9dmFyIFF0PSExO2Z1bmN0aW9uIFV0KGUpe2UudXBkYXRlUXVldWU9e2Jhc2VTdGF0ZTplLm1lbW9pemVkU3RhdGUsYmFzZVF1ZXVlOm51bGwsc2hhcmVkOntwZW5kaW5nOm51bGx9LGVmZmVjdHM6bnVsbH19ZnVuY3Rpb24gRHQoZSx0KXtlPWUudXBkYXRlUXVldWUsdC51cGRhdGVRdWV1ZT09PWUmJih0LnVwZGF0ZVF1ZXVlPXtiYXNlU3RhdGU6ZS5iYXNlU3RhdGUsYmFzZVF1ZXVlOmUuYmFzZVF1ZXVlLHNoYXJlZDplLnNoYXJlZCxlZmZlY3RzOmUuZWZmZWN0c30pfWZ1bmN0aW9uIEZ0KGUsdCl7cmV0dXJuKGU9e2V4cGlyYXRpb25UaW1lOmUsc3VzcGVuc2VDb25maWc6dCx0YWc6MCxwYXlsb2FkOm51bGwsY2FsbGJhY2s6bnVsbCxuZXh0Om51bGx9KS5uZXh0PWV9ZnVuY3Rpb24gV3QoZSx0KXtpZihudWxsIT09KGU9ZS51cGRhdGVRdWV1ZSkpe3ZhciBuPShlPWUuc2hhcmVkKS5wZW5kaW5nO251bGw9PT1uP3QubmV4dD10Oih0Lm5leHQ9bi5uZXh0LG4ubmV4dD10KSxlLnBlbmRpbmc9dH19ZnVuY3Rpb24gSHQoZSx0KXt2YXIgbj1lLmFsdGVybmF0ZTtudWxsIT09biYmRHQobixlKSxudWxsPT09KG49KGU9ZS51cGRhdGVRdWV1ZSkuYmFzZVF1ZXVlKT8oZS5iYXNlUXVldWU9dC5uZXh0PXQsdC5uZXh0PXQpOih0Lm5leHQ9bi5uZXh0LG4ubmV4dD10KX1mdW5jdGlvbiBqdChlLHQsbixsKXt2YXIgaT1lLnVwZGF0ZVF1ZXVlO1F0PSExO3ZhciB1PWkuYmFzZVF1ZXVlLGE9aS5zaGFyZWQucGVuZGluZztpZihudWxsIT09YSl7aWYobnVsbCE9PXUpe3ZhciBvPXUubmV4dDt1Lm5leHQ9YS5uZXh0LGEubmV4dD1vfXU9YSxpLnNoYXJlZC5wZW5kaW5nPW51bGwsbnVsbCE9PShvPWUuYWx0ZXJuYXRlKSYmbnVsbCE9PShvPW8udXBkYXRlUXVldWUpJiYoby5iYXNlUXVldWU9YSl9aWYobnVsbCE9PXUpe289dS5uZXh0O3ZhciBjPWkuYmFzZVN0YXRlLGY9MCxzPW51bGwsZD1udWxsLHA9bnVsbDtpZihudWxsIT09bylmb3IodmFyIG09bzs7KXtpZigoYT1tLmV4cGlyYXRpb25UaW1lKTxsKXt2YXIgaD17ZXhwaXJhdGlvblRpbWU6bS5leHBpcmF0aW9uVGltZSxzdXNwZW5zZUNvbmZpZzptLnN1c3BlbnNlQ29uZmlnLHRhZzptLnRhZyxwYXlsb2FkOm0ucGF5bG9hZCxjYWxsYmFjazptLmNhbGxiYWNrLG5leHQ6bnVsbH07bnVsbD09PXA/KGQ9cD1oLHM9Yyk6cD1wLm5leHQ9aCxhPmYmJihmPWEpfWVsc2V7bnVsbCE9PXAmJihwPXAubmV4dD17ZXhwaXJhdGlvblRpbWU6MTA3Mzc0MTgyMyxzdXNwZW5zZUNvbmZpZzptLnN1c3BlbnNlQ29uZmlnLHRhZzptLnRhZyxwYXlsb2FkOm0ucGF5bG9hZCxjYWxsYmFjazptLmNhbGxiYWNrLG5leHQ6bnVsbH0pLExsKGEsbS5zdXNwZW5zZUNvbmZpZyk7ZTp7dmFyIGc9ZSxiPW07c3dpdGNoKGE9dCxoPW4sYi50YWcpe2Nhc2UgMTppZihcImZ1bmN0aW9uXCI9PXR5cGVvZihnPWIucGF5bG9hZCkpe2M9Zy5jYWxsKGgsYyxhKTticmVhayBlfWM9ZzticmVhayBlO2Nhc2UgMzpnLmVmZmVjdFRhZz0tNDA5NyZnLmVmZmVjdFRhZ3w2NDtjYXNlIDA6aWYobnVsbD09KGE9XCJmdW5jdGlvblwiPT10eXBlb2YoZz1iLnBheWxvYWQpP2cuY2FsbChoLGMsYSk6ZykpYnJlYWsgZTtjPXIoe30sYyxhKTticmVhayBlO2Nhc2UgMjpRdD0hMH19bnVsbCE9PW0uY2FsbGJhY2smJihlLmVmZmVjdFRhZ3w9MzIsbnVsbD09PShhPWkuZWZmZWN0cyk/aS5lZmZlY3RzPVttXTphLnB1c2gobSkpfWlmKG51bGw9PT0obT1tLm5leHQpfHxtPT09byl7aWYobnVsbD09PShhPWkuc2hhcmVkLnBlbmRpbmcpKWJyZWFrO209dS5uZXh0PWEubmV4dCxhLm5leHQ9byxpLmJhc2VRdWV1ZT11PWEsaS5zaGFyZWQucGVuZGluZz1udWxsfX1udWxsPT09cD9zPWM6cC5uZXh0PWQsaS5iYXNlU3RhdGU9cyxpLmJhc2VRdWV1ZT1wLHFsKGYpLGUuZXhwaXJhdGlvblRpbWU9ZixlLm1lbW9pemVkU3RhdGU9Y319ZnVuY3Rpb24gQXQoZSx0LG4pe2lmKGU9dC5lZmZlY3RzLHQuZWZmZWN0cz1udWxsLG51bGwhPT1lKWZvcih0PTA7dDxlLmxlbmd0aDt0Kyspe3ZhciByPWVbdF0sbD1yLmNhbGxiYWNrO2lmKG51bGwhPT1sKXtpZihyLmNhbGxiYWNrPW51bGwscj1sLGw9bixcImZ1bmN0aW9uXCIhPXR5cGVvZiByKXRocm93IEVycm9yKGMoMTkxLHIpKTtyLmNhbGwobCl9fX12YXIgQnQ9Zi5SZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxPdD0obmV3IGEuQ29tcG9uZW50KS5yZWZzO2Z1bmN0aW9uIEx0KGUsdCxuLGwpe249bnVsbD09KG49bihsLHQ9ZS5tZW1vaXplZFN0YXRlKSk/dDpyKHt9LHQsbiksZS5tZW1vaXplZFN0YXRlPW4sMD09PWUuZXhwaXJhdGlvblRpbWUmJihlLnVwZGF0ZVF1ZXVlLmJhc2VTdGF0ZT1uKX12YXIgcXQ9e2lzTW91bnRlZDpmdW5jdGlvbihlKXtyZXR1cm4hIShlPWUuX3JlYWN0SW50ZXJuYWxGaWJlcikmJk4oZSk9PT1lfSxlbnF1ZXVlU2V0U3RhdGU6ZnVuY3Rpb24oZSx0LG4pe2U9ZS5fcmVhY3RJbnRlcm5hbEZpYmVyO3ZhciByPUlsKCksbD1CdC5zdXNwZW5zZTsobD1GdChyPVJsKHIsZSxsKSxsKSkucGF5bG9hZD10LG51bGwhPW4mJihsLmNhbGxiYWNrPW4pLFd0KGUsbCksTWwoZSxyKX0sZW5xdWV1ZVJlcGxhY2VTdGF0ZTpmdW5jdGlvbihlLHQsbil7ZT1lLl9yZWFjdEludGVybmFsRmliZXI7dmFyIHI9SWwoKSxsPUJ0LnN1c3BlbnNlOyhsPUZ0KHI9UmwocixlLGwpLGwpKS50YWc9MSxsLnBheWxvYWQ9dCxudWxsIT1uJiYobC5jYWxsYmFjaz1uKSxXdChlLGwpLE1sKGUscil9LGVucXVldWVGb3JjZVVwZGF0ZTpmdW5jdGlvbihlLHQpe2U9ZS5fcmVhY3RJbnRlcm5hbEZpYmVyO3ZhciBuPUlsKCkscj1CdC5zdXNwZW5zZTsocj1GdChuPVJsKG4sZSxyKSxyKSkudGFnPTIsbnVsbCE9dCYmKHIuY2FsbGJhY2s9dCksV3QoZSxyKSxNbChlLG4pfX07ZnVuY3Rpb24gVnQoZSx0LG4scixsLGksdSl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YoZT1lLnN0YXRlTm9kZSkuc2hvdWxkQ29tcG9uZW50VXBkYXRlP2Uuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHIsaSx1KTohKHQucHJvdG90eXBlJiZ0LnByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCYmRXQobixyKSYmRXQobCxpKSl9ZnVuY3Rpb24gJHQoZSx0LG4pe3ZhciByPSExLGw9RGUsaT10LmNvbnRleHRUeXBlO3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiBpJiZudWxsIT09aT9pPU10KGkpOihsPUFlKHQpP0hlOkZlLmN1cnJlbnQsaT0ocj1udWxsIT0ocj10LmNvbnRleHRUeXBlcykpP2plKGUsbCk6RGUpLHQ9bmV3IHQobixpKSxlLm1lbW9pemVkU3RhdGU9bnVsbCE9PXQuc3RhdGUmJnZvaWQgMCE9PXQuc3RhdGU/dC5zdGF0ZTpudWxsLHQudXBkYXRlcj1xdCxlLnN0YXRlTm9kZT10LHQuX3JlYWN0SW50ZXJuYWxGaWJlcj1lLHImJigoZT1lLnN0YXRlTm9kZSkuX19yZWFjdEludGVybmFsTWVtb2l6ZWRVbm1hc2tlZENoaWxkQ29udGV4dD1sLGUuX19yZWFjdEludGVybmFsTWVtb2l6ZWRNYXNrZWRDaGlsZENvbnRleHQ9aSksdH1mdW5jdGlvbiBLdChlLHQsbixyKXtlPXQuc3RhdGUsXCJmdW5jdGlvblwiPT10eXBlb2YgdC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ0LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobixyKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LlVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZ0LlVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG4sciksdC5zdGF0ZSE9PWUmJnF0LmVucXVldWVSZXBsYWNlU3RhdGUodCx0LnN0YXRlLG51bGwpfWZ1bmN0aW9uIEd0KGUsdCxuLHIpe3ZhciBsPWUuc3RhdGVOb2RlO2wucHJvcHM9bixsLnN0YXRlPWUubWVtb2l6ZWRTdGF0ZSxsLnJlZnM9T3QsVXQoZSk7dmFyIGk9dC5jb250ZXh0VHlwZTtcIm9iamVjdFwiPT10eXBlb2YgaSYmbnVsbCE9PWk/bC5jb250ZXh0PU10KGkpOihpPUFlKHQpP0hlOkZlLmN1cnJlbnQsbC5jb250ZXh0PWplKGUsaSkpLGp0KGUsbixsLHIpLGwuc3RhdGU9ZS5tZW1vaXplZFN0YXRlLFwiZnVuY3Rpb25cIj09dHlwZW9mKGk9dC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMpJiYoTHQoZSx0LGksbiksbC5zdGF0ZT1lLm1lbW9pemVkU3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBsLlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGwuY29tcG9uZW50V2lsbE1vdW50fHwodD1sLnN0YXRlLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwuY29tcG9uZW50V2lsbE1vdW50JiZsLmNvbXBvbmVudFdpbGxNb3VudCgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwuVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCYmbC5VTlNBRkVfY29tcG9uZW50V2lsbE1vdW50KCksdCE9PWwuc3RhdGUmJnF0LmVucXVldWVSZXBsYWNlU3RhdGUobCxsLnN0YXRlLG51bGwpLGp0KGUsbixsLHIpLGwuc3RhdGU9ZS5tZW1vaXplZFN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLmNvbXBvbmVudERpZE1vdW50JiYoZS5lZmZlY3RUYWd8PTQpfXZhciBZdD1BcnJheS5pc0FycmF5O2Z1bmN0aW9uIEp0KGUsdCxuKXtpZihudWxsIT09KGU9bi5yZWYpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZcIm9iamVjdFwiIT10eXBlb2YgZSl7aWYobi5fb3duZXIpe2lmKG49bi5fb3duZXIpe2lmKDEhPT1uLnRhZyl0aHJvdyBFcnJvcihjKDMwOSkpO3ZhciByPW4uc3RhdGVOb2RlfWlmKCFyKXRocm93IEVycm9yKGMoMTQ3LGUpKTt2YXIgbD1cIlwiK2U7cmV0dXJuIG51bGwhPT10JiZudWxsIT09dC5yZWYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHQucmVmJiZ0LnJlZi5fc3RyaW5nUmVmPT09bD90LnJlZjooKHQ9ZnVuY3Rpb24oZSl7dmFyIHQ9ci5yZWZzO3Q9PT1PdCYmKHQ9ci5yZWZzPXt9KSxudWxsPT09ZT9kZWxldGUgdFtsXTp0W2xdPWV9KS5fc3RyaW5nUmVmPWwsdCl9aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGUpdGhyb3cgRXJyb3IoYygyODQpKTtpZighbi5fb3duZXIpdGhyb3cgRXJyb3IoYygyOTAsZSkpfXJldHVybiBlfWZ1bmN0aW9uIFh0KGUsdCl7aWYoXCJ0ZXh0YXJlYVwiIT09ZS50eXBlKXRocm93IEVycm9yKGMoMzEsXCJbb2JqZWN0IE9iamVjdF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KT9cIm9iamVjdCB3aXRoIGtleXMge1wiK09iamVjdC5rZXlzKHQpLmpvaW4oXCIsIFwiKStcIn1cIjp0LFwiXCIpKX1mdW5jdGlvbiBadChlKXtmdW5jdGlvbiB0KHQsbil7aWYoZSl7dmFyIHI9dC5sYXN0RWZmZWN0O251bGwhPT1yPyhyLm5leHRFZmZlY3Q9bix0Lmxhc3RFZmZlY3Q9bik6dC5maXJzdEVmZmVjdD10Lmxhc3RFZmZlY3Q9bixuLm5leHRFZmZlY3Q9bnVsbCxuLmVmZmVjdFRhZz04fX1mdW5jdGlvbiBuKG4scil7aWYoIWUpcmV0dXJuIG51bGw7Zm9yKDtudWxsIT09cjspdChuLHIpLHI9ci5zaWJsaW5nO3JldHVybiBudWxsfWZ1bmN0aW9uIHIoZSx0KXtmb3IoZT1uZXcgTWFwO251bGwhPT10OyludWxsIT09dC5rZXk/ZS5zZXQodC5rZXksdCk6ZS5zZXQodC5pbmRleCx0KSx0PXQuc2libGluZztyZXR1cm4gZX1mdW5jdGlvbiBsKGUsdCl7cmV0dXJuKGU9ZGkoZSx0KSkuaW5kZXg9MCxlLnNpYmxpbmc9bnVsbCxlfWZ1bmN0aW9uIGkodCxuLHIpe3JldHVybiB0LmluZGV4PXIsZT9udWxsIT09KHI9dC5hbHRlcm5hdGUpPyhyPXIuaW5kZXgpPG4/KHQuZWZmZWN0VGFnPTIsbik6cjoodC5lZmZlY3RUYWc9MixuKTpufWZ1bmN0aW9uIHUodCl7cmV0dXJuIGUmJm51bGw9PT10LmFsdGVybmF0ZSYmKHQuZWZmZWN0VGFnPTIpLHR9ZnVuY3Rpb24gYShlLHQsbixyKXtyZXR1cm4gbnVsbD09PXR8fDYhPT10LnRhZz8oKHQ9aGkobixlLm1vZGUscikpLnJldHVybj1lLHQpOigodD1sKHQsbikpLnJldHVybj1lLHQpfWZ1bmN0aW9uIG8oZSx0LG4scil7cmV0dXJuIG51bGwhPT10JiZ0LmVsZW1lbnRUeXBlPT09bi50eXBlPygocj1sKHQsbi5wcm9wcykpLnJlZj1KdChlLHQsbiksci5yZXR1cm49ZSxyKTooKHI9cGkobi50eXBlLG4ua2V5LG4ucHJvcHMsbnVsbCxlLm1vZGUscikpLnJlZj1KdChlLHQsbiksci5yZXR1cm49ZSxyKX1mdW5jdGlvbiBmKGUsdCxuLHIpe3JldHVybiBudWxsPT09dHx8NCE9PXQudGFnfHx0LnN0YXRlTm9kZS5jb250YWluZXJJbmZvIT09bi5jb250YWluZXJJbmZvfHx0LnN0YXRlTm9kZS5pbXBsZW1lbnRhdGlvbiE9PW4uaW1wbGVtZW50YXRpb24/KCh0PWdpKG4sZS5tb2RlLHIpKS5yZXR1cm49ZSx0KTooKHQ9bCh0LG4uY2hpbGRyZW58fFtdKSkucmV0dXJuPWUsdCl9ZnVuY3Rpb24gcyhlLHQsbixyLGkpe3JldHVybiBudWxsPT09dHx8NyE9PXQudGFnPygodD1taShuLGUubW9kZSxyLGkpKS5yZXR1cm49ZSx0KTooKHQ9bCh0LG4pKS5yZXR1cm49ZSx0KX1mdW5jdGlvbiBoKGUsdCxuKXtpZihcInN0cmluZ1wiPT10eXBlb2YgdHx8XCJudW1iZXJcIj09dHlwZW9mIHQpcmV0dXJuKHQ9aGkoXCJcIit0LGUubW9kZSxuKSkucmV0dXJuPWUsdDtpZihcIm9iamVjdFwiPT10eXBlb2YgdCYmbnVsbCE9PXQpe3N3aXRjaCh0LiQkdHlwZW9mKXtjYXNlIGQ6cmV0dXJuKG49cGkodC50eXBlLHQua2V5LHQucHJvcHMsbnVsbCxlLm1vZGUsbikpLnJlZj1KdChlLG51bGwsdCksbi5yZXR1cm49ZSxuO2Nhc2UgcDpyZXR1cm4odD1naSh0LGUubW9kZSxuKSkucmV0dXJuPWUsdH1pZihZdCh0KXx8Qyh0KSlyZXR1cm4odD1taSh0LGUubW9kZSxuLG51bGwpKS5yZXR1cm49ZSx0O1h0KGUsdCl9cmV0dXJuIG51bGx9ZnVuY3Rpb24gZyhlLHQsbixyKXt2YXIgbD1udWxsIT09dD90LmtleTpudWxsO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBufHxcIm51bWJlclwiPT10eXBlb2YgbilyZXR1cm4gbnVsbCE9PWw/bnVsbDphKGUsdCxcIlwiK24scik7aWYoXCJvYmplY3RcIj09dHlwZW9mIG4mJm51bGwhPT1uKXtzd2l0Y2gobi4kJHR5cGVvZil7Y2FzZSBkOnJldHVybiBuLmtleT09PWw/bi50eXBlPT09bT9zKGUsdCxuLnByb3BzLmNoaWxkcmVuLHIsbCk6byhlLHQsbixyKTpudWxsO2Nhc2UgcDpyZXR1cm4gbi5rZXk9PT1sP2YoZSx0LG4scik6bnVsbH1pZihZdChuKXx8QyhuKSlyZXR1cm4gbnVsbCE9PWw/bnVsbDpzKGUsdCxuLHIsbnVsbCk7WHQoZSxuKX1yZXR1cm4gbnVsbH1mdW5jdGlvbiBiKGUsdCxuLHIsbCl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHJ8fFwibnVtYmVyXCI9PXR5cGVvZiByKXJldHVybiBhKHQsZT1lLmdldChuKXx8bnVsbCxcIlwiK3IsbCk7aWYoXCJvYmplY3RcIj09dHlwZW9mIHImJm51bGwhPT1yKXtzd2l0Y2goci4kJHR5cGVvZil7Y2FzZSBkOnJldHVybiBlPWUuZ2V0KG51bGw9PT1yLmtleT9uOnIua2V5KXx8bnVsbCxyLnR5cGU9PT1tP3ModCxlLHIucHJvcHMuY2hpbGRyZW4sbCxyLmtleSk6byh0LGUscixsKTtjYXNlIHA6cmV0dXJuIGYodCxlPWUuZ2V0KG51bGw9PT1yLmtleT9uOnIua2V5KXx8bnVsbCxyLGwpfWlmKFl0KHIpfHxDKHIpKXJldHVybiBzKHQsZT1lLmdldChuKXx8bnVsbCxyLGwsbnVsbCk7WHQodCxyKX1yZXR1cm4gbnVsbH1mdW5jdGlvbiB2KGwsdSxhLG8pe2Zvcih2YXIgYz1udWxsLGY9bnVsbCxzPXUsZD11PTAscD1udWxsO251bGwhPT1zJiZkPGEubGVuZ3RoO2QrKyl7cy5pbmRleD5kPyhwPXMscz1udWxsKTpwPXMuc2libGluZzt2YXIgbT1nKGwscyxhW2RdLG8pO2lmKG51bGw9PT1tKXtudWxsPT09cyYmKHM9cCk7YnJlYWt9ZSYmcyYmbnVsbD09PW0uYWx0ZXJuYXRlJiZ0KGwscyksdT1pKG0sdSxkKSxudWxsPT09Zj9jPW06Zi5zaWJsaW5nPW0sZj1tLHM9cH1pZihkPT09YS5sZW5ndGgpcmV0dXJuIG4obCxzKSxjO2lmKG51bGw9PT1zKXtmb3IoO2Q8YS5sZW5ndGg7ZCsrKW51bGwhPT0ocz1oKGwsYVtkXSxvKSkmJih1PWkocyx1LGQpLG51bGw9PT1mP2M9czpmLnNpYmxpbmc9cyxmPXMpO3JldHVybiBjfWZvcihzPXIobCxzKTtkPGEubGVuZ3RoO2QrKyludWxsIT09KHA9YihzLGwsZCxhW2RdLG8pKSYmKGUmJm51bGwhPT1wLmFsdGVybmF0ZSYmcy5kZWxldGUobnVsbD09PXAua2V5P2Q6cC5rZXkpLHU9aShwLHUsZCksbnVsbD09PWY/Yz1wOmYuc2libGluZz1wLGY9cCk7cmV0dXJuIGUmJnMuZm9yRWFjaCgoZnVuY3Rpb24oZSl7cmV0dXJuIHQobCxlKX0pKSxjfWZ1bmN0aW9uIHkobCx1LGEsbyl7dmFyIGY9QyhhKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBmKXRocm93IEVycm9yKGMoMTUwKSk7aWYobnVsbD09KGE9Zi5jYWxsKGEpKSl0aHJvdyBFcnJvcihjKDE1MSkpO2Zvcih2YXIgcz1mPW51bGwsZD11LHA9dT0wLG09bnVsbCx2PWEubmV4dCgpO251bGwhPT1kJiYhdi5kb25lO3ArKyx2PWEubmV4dCgpKXtkLmluZGV4PnA/KG09ZCxkPW51bGwpOm09ZC5zaWJsaW5nO3ZhciB5PWcobCxkLHYudmFsdWUsbyk7aWYobnVsbD09PXkpe251bGw9PT1kJiYoZD1tKTticmVha31lJiZkJiZudWxsPT09eS5hbHRlcm5hdGUmJnQobCxkKSx1PWkoeSx1LHApLG51bGw9PT1zP2Y9eTpzLnNpYmxpbmc9eSxzPXksZD1tfWlmKHYuZG9uZSlyZXR1cm4gbihsLGQpLGY7aWYobnVsbD09PWQpe2Zvcig7IXYuZG9uZTtwKyssdj1hLm5leHQoKSludWxsIT09KHY9aChsLHYudmFsdWUsbykpJiYodT1pKHYsdSxwKSxudWxsPT09cz9mPXY6cy5zaWJsaW5nPXYscz12KTtyZXR1cm4gZn1mb3IoZD1yKGwsZCk7IXYuZG9uZTtwKyssdj1hLm5leHQoKSludWxsIT09KHY9YihkLGwscCx2LnZhbHVlLG8pKSYmKGUmJm51bGwhPT12LmFsdGVybmF0ZSYmZC5kZWxldGUobnVsbD09PXYua2V5P3A6di5rZXkpLHU9aSh2LHUscCksbnVsbD09PXM/Zj12OnMuc2libGluZz12LHM9dik7cmV0dXJuIGUmJmQuZm9yRWFjaCgoZnVuY3Rpb24oZSl7cmV0dXJuIHQobCxlKX0pKSxmfXJldHVybiBmdW5jdGlvbihlLHIsaSxhKXt2YXIgbz1cIm9iamVjdFwiPT10eXBlb2YgaSYmbnVsbCE9PWkmJmkudHlwZT09PW0mJm51bGw9PT1pLmtleTtvJiYoaT1pLnByb3BzLmNoaWxkcmVuKTt2YXIgZj1cIm9iamVjdFwiPT10eXBlb2YgaSYmbnVsbCE9PWk7aWYoZilzd2l0Y2goaS4kJHR5cGVvZil7Y2FzZSBkOmU6e2ZvcihmPWkua2V5LG89cjtudWxsIT09bzspe2lmKG8ua2V5PT09Zil7c3dpdGNoKG8udGFnKXtjYXNlIDc6aWYoaS50eXBlPT09bSl7bihlLG8uc2libGluZyksKHI9bChvLGkucHJvcHMuY2hpbGRyZW4pKS5yZXR1cm49ZSxlPXI7YnJlYWsgZX1icmVhaztkZWZhdWx0OmlmKG8uZWxlbWVudFR5cGU9PT1pLnR5cGUpe24oZSxvLnNpYmxpbmcpLChyPWwobyxpLnByb3BzKSkucmVmPUp0KGUsbyxpKSxyLnJldHVybj1lLGU9cjticmVhayBlfX1uKGUsbyk7YnJlYWt9dChlLG8pLG89by5zaWJsaW5nfWkudHlwZT09PW0/KChyPW1pKGkucHJvcHMuY2hpbGRyZW4sZS5tb2RlLGEsaS5rZXkpKS5yZXR1cm49ZSxlPXIpOigoYT1waShpLnR5cGUsaS5rZXksaS5wcm9wcyxudWxsLGUubW9kZSxhKSkucmVmPUp0KGUscixpKSxhLnJldHVybj1lLGU9YSl9cmV0dXJuIHUoZSk7Y2FzZSBwOmU6e2ZvcihvPWkua2V5O251bGwhPT1yOyl7aWYoci5rZXk9PT1vKXtpZig0PT09ci50YWcmJnIuc3RhdGVOb2RlLmNvbnRhaW5lckluZm89PT1pLmNvbnRhaW5lckluZm8mJnIuc3RhdGVOb2RlLmltcGxlbWVudGF0aW9uPT09aS5pbXBsZW1lbnRhdGlvbil7bihlLHIuc2libGluZyksKHI9bChyLGkuY2hpbGRyZW58fFtdKSkucmV0dXJuPWUsZT1yO2JyZWFrIGV9bihlLHIpO2JyZWFrfXQoZSxyKSxyPXIuc2libGluZ30ocj1naShpLGUubW9kZSxhKSkucmV0dXJuPWUsZT1yfXJldHVybiB1KGUpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBpfHxcIm51bWJlclwiPT10eXBlb2YgaSlyZXR1cm4gaT1cIlwiK2ksbnVsbCE9PXImJjY9PT1yLnRhZz8obihlLHIuc2libGluZyksKHI9bChyLGkpKS5yZXR1cm49ZSxlPXIpOihuKGUsciksKHI9aGkoaSxlLm1vZGUsYSkpLnJldHVybj1lLGU9ciksdShlKTtpZihZdChpKSlyZXR1cm4gdihlLHIsaSxhKTtpZihDKGkpKXJldHVybiB5KGUscixpLGEpO2lmKGYmJlh0KGUsaSksdm9pZCAwPT09aSYmIW8pc3dpdGNoKGUudGFnKXtjYXNlIDE6Y2FzZSAwOnRocm93IGU9ZS50eXBlLEVycm9yKGMoMTUyLGUuZGlzcGxheU5hbWV8fGUubmFtZXx8XCJDb21wb25lbnRcIikpfXJldHVybiBuKGUscil9fXZhciBlbj1adCghMCksdG49WnQoITEpLG5uPXt9LHJuPXtjdXJyZW50Om5ufSxsbj17Y3VycmVudDpubn0sdW49e2N1cnJlbnQ6bm59O2Z1bmN0aW9uIGFuKGUpe2lmKGU9PT1ubil0aHJvdyBFcnJvcihjKDE3NCkpO3JldHVybiBlfWZ1bmN0aW9uIG9uKGUsdCl7VWUodW4sdCksVWUobG4sZSksVWUocm4sbm4pLGU9USh0KSxRZShybiksVWUocm4sZSl9ZnVuY3Rpb24gY24oKXtRZShybiksUWUobG4pLFFlKHVuKX1mdW5jdGlvbiBmbihlKXt2YXIgdD1hbih1bi5jdXJyZW50KSxuPWFuKHJuLmN1cnJlbnQpO24hPT0odD1VKG4sZS50eXBlLHQpKSYmKFVlKGxuLGUpLFVlKHJuLHQpKX1mdW5jdGlvbiBzbihlKXtsbi5jdXJyZW50PT09ZSYmKFFlKHJuKSxRZShsbikpfXZhciBkbj17Y3VycmVudDowfTtmdW5jdGlvbiBwbihlKXtmb3IodmFyIHQ9ZTtudWxsIT09dDspe2lmKDEzPT09dC50YWcpe3ZhciBuPXQubWVtb2l6ZWRTdGF0ZTtpZihudWxsIT09biYmKG51bGw9PT0obj1uLmRlaHlkcmF0ZWQpfHx4ZShuKXx8RWUobikpKXJldHVybiB0fWVsc2UgaWYoMTk9PT10LnRhZyYmdm9pZCAwIT09dC5tZW1vaXplZFByb3BzLnJldmVhbE9yZGVyKXtpZigwIT0oNjQmdC5lZmZlY3RUYWcpKXJldHVybiB0fWVsc2UgaWYobnVsbCE9PXQuY2hpbGQpe3QuY2hpbGQucmV0dXJuPXQsdD10LmNoaWxkO2NvbnRpbnVlfWlmKHQ9PT1lKWJyZWFrO2Zvcig7bnVsbD09PXQuc2libGluZzspe2lmKG51bGw9PT10LnJldHVybnx8dC5yZXR1cm49PT1lKXJldHVybiBudWxsO3Q9dC5yZXR1cm59dC5zaWJsaW5nLnJldHVybj10LnJldHVybix0PXQuc2libGluZ31yZXR1cm4gbnVsbH1mdW5jdGlvbiBtbihlLHQpe3JldHVybntyZXNwb25kZXI6ZSxwcm9wczp0fX12YXIgaG49Zi5SZWFjdEN1cnJlbnREaXNwYXRjaGVyLGduPWYuUmVhY3RDdXJyZW50QmF0Y2hDb25maWcsYm49MCx2bj1udWxsLHluPW51bGwsVG49bnVsbCx4bj0hMTtmdW5jdGlvbiBFbigpe3Rocm93IEVycm9yKGMoMzIxKSl9ZnVuY3Rpb24gU24oZSx0KXtpZihudWxsPT09dClyZXR1cm4hMTtmb3IodmFyIG49MDtuPHQubGVuZ3RoJiZuPGUubGVuZ3RoO24rKylpZighVHQoZVtuXSx0W25dKSlyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiBrbihlLHQsbixyLGwsaSl7aWYoYm49aSx2bj10LHQubWVtb2l6ZWRTdGF0ZT1udWxsLHQudXBkYXRlUXVldWU9bnVsbCx0LmV4cGlyYXRpb25UaW1lPTAsaG4uY3VycmVudD1udWxsPT09ZXx8bnVsbD09PWUubWVtb2l6ZWRTdGF0ZT8kbjpLbixlPW4ocixsKSx0LmV4cGlyYXRpb25UaW1lPT09Ym4pe2k9MDtkb3tpZih0LmV4cGlyYXRpb25UaW1lPTAsISgyNT5pKSl0aHJvdyBFcnJvcihjKDMwMSkpO2krPTEsVG49eW49bnVsbCx0LnVwZGF0ZVF1ZXVlPW51bGwsaG4uY3VycmVudD1HbixlPW4ocixsKX13aGlsZSh0LmV4cGlyYXRpb25UaW1lPT09Ym4pfWlmKGhuLmN1cnJlbnQ9Vm4sdD1udWxsIT09eW4mJm51bGwhPT15bi5uZXh0LGJuPTAsVG49eW49dm49bnVsbCx4bj0hMSx0KXRocm93IEVycm9yKGMoMzAwKSk7cmV0dXJuIGV9ZnVuY3Rpb24gd24oKXt2YXIgZT17bWVtb2l6ZWRTdGF0ZTpudWxsLGJhc2VTdGF0ZTpudWxsLGJhc2VRdWV1ZTpudWxsLHF1ZXVlOm51bGwsbmV4dDpudWxsfTtyZXR1cm4gbnVsbD09PVRuP3ZuLm1lbW9pemVkU3RhdGU9VG49ZTpUbj1Ubi5uZXh0PWUsVG59ZnVuY3Rpb24gem4oKXtpZihudWxsPT09eW4pe3ZhciBlPXZuLmFsdGVybmF0ZTtlPW51bGwhPT1lP2UubWVtb2l6ZWRTdGF0ZTpudWxsfWVsc2UgZT15bi5uZXh0O3ZhciB0PW51bGw9PT1Ubj92bi5tZW1vaXplZFN0YXRlOlRuLm5leHQ7aWYobnVsbCE9PXQpVG49dCx5bj1lO2Vsc2V7aWYobnVsbD09PWUpdGhyb3cgRXJyb3IoYygzMTApKTtlPXttZW1vaXplZFN0YXRlOih5bj1lKS5tZW1vaXplZFN0YXRlLGJhc2VTdGF0ZTp5bi5iYXNlU3RhdGUsYmFzZVF1ZXVlOnluLmJhc2VRdWV1ZSxxdWV1ZTp5bi5xdWV1ZSxuZXh0Om51bGx9LG51bGw9PT1Ubj92bi5tZW1vaXplZFN0YXRlPVRuPWU6VG49VG4ubmV4dD1lfXJldHVybiBUbn1mdW5jdGlvbiBDbihlLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChlKTp0fWZ1bmN0aW9uIFBuKGUpe3ZhciB0PXpuKCksbj10LnF1ZXVlO2lmKG51bGw9PT1uKXRocm93IEVycm9yKGMoMzExKSk7bi5sYXN0UmVuZGVyZWRSZWR1Y2VyPWU7dmFyIHI9eW4sbD1yLmJhc2VRdWV1ZSxpPW4ucGVuZGluZztpZihudWxsIT09aSl7aWYobnVsbCE9PWwpe3ZhciB1PWwubmV4dDtsLm5leHQ9aS5uZXh0LGkubmV4dD11fXIuYmFzZVF1ZXVlPWw9aSxuLnBlbmRpbmc9bnVsbH1pZihudWxsIT09bCl7bD1sLm5leHQscj1yLmJhc2VTdGF0ZTt2YXIgYT11PWk9bnVsbCxvPWw7ZG97dmFyIGY9by5leHBpcmF0aW9uVGltZTtpZihmPGJuKXt2YXIgcz17ZXhwaXJhdGlvblRpbWU6by5leHBpcmF0aW9uVGltZSxzdXNwZW5zZUNvbmZpZzpvLnN1c3BlbnNlQ29uZmlnLGFjdGlvbjpvLmFjdGlvbixlYWdlclJlZHVjZXI6by5lYWdlclJlZHVjZXIsZWFnZXJTdGF0ZTpvLmVhZ2VyU3RhdGUsbmV4dDpudWxsfTtudWxsPT09YT8odT1hPXMsaT1yKTphPWEubmV4dD1zLGY+dm4uZXhwaXJhdGlvblRpbWUmJih2bi5leHBpcmF0aW9uVGltZT1mLHFsKGYpKX1lbHNlIG51bGwhPT1hJiYoYT1hLm5leHQ9e2V4cGlyYXRpb25UaW1lOjEwNzM3NDE4MjMsc3VzcGVuc2VDb25maWc6by5zdXNwZW5zZUNvbmZpZyxhY3Rpb246by5hY3Rpb24sZWFnZXJSZWR1Y2VyOm8uZWFnZXJSZWR1Y2VyLGVhZ2VyU3RhdGU6by5lYWdlclN0YXRlLG5leHQ6bnVsbH0pLExsKGYsby5zdXNwZW5zZUNvbmZpZykscj1vLmVhZ2VyUmVkdWNlcj09PWU/by5lYWdlclN0YXRlOmUocixvLmFjdGlvbik7bz1vLm5leHR9d2hpbGUobnVsbCE9PW8mJm8hPT1sKTtudWxsPT09YT9pPXI6YS5uZXh0PXUsVHQocix0Lm1lbW9pemVkU3RhdGUpfHwodXI9ITApLHQubWVtb2l6ZWRTdGF0ZT1yLHQuYmFzZVN0YXRlPWksdC5iYXNlUXVldWU9YSxuLmxhc3RSZW5kZXJlZFN0YXRlPXJ9cmV0dXJuW3QubWVtb2l6ZWRTdGF0ZSxuLmRpc3BhdGNoXX1mdW5jdGlvbiBObihlKXt2YXIgdD16bigpLG49dC5xdWV1ZTtpZihudWxsPT09bil0aHJvdyBFcnJvcihjKDMxMSkpO24ubGFzdFJlbmRlcmVkUmVkdWNlcj1lO3ZhciByPW4uZGlzcGF0Y2gsbD1uLnBlbmRpbmcsaT10Lm1lbW9pemVkU3RhdGU7aWYobnVsbCE9PWwpe24ucGVuZGluZz1udWxsO3ZhciB1PWw9bC5uZXh0O2Rve2k9ZShpLHUuYWN0aW9uKSx1PXUubmV4dH13aGlsZSh1IT09bCk7VHQoaSx0Lm1lbW9pemVkU3RhdGUpfHwodXI9ITApLHQubWVtb2l6ZWRTdGF0ZT1pLG51bGw9PT10LmJhc2VRdWV1ZSYmKHQuYmFzZVN0YXRlPWkpLG4ubGFzdFJlbmRlcmVkU3RhdGU9aX1yZXR1cm5baSxyXX1mdW5jdGlvbiBfbihlKXt2YXIgdD13bigpO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJihlPWUoKSksdC5tZW1vaXplZFN0YXRlPXQuYmFzZVN0YXRlPWUsZT0oZT10LnF1ZXVlPXtwZW5kaW5nOm51bGwsZGlzcGF0Y2g6bnVsbCxsYXN0UmVuZGVyZWRSZWR1Y2VyOkNuLGxhc3RSZW5kZXJlZFN0YXRlOmV9KS5kaXNwYXRjaD1xbi5iaW5kKG51bGwsdm4sZSksW3QubWVtb2l6ZWRTdGF0ZSxlXX1mdW5jdGlvbiBJbihlLHQsbixyKXtyZXR1cm4gZT17dGFnOmUsY3JlYXRlOnQsZGVzdHJveTpuLGRlcHM6cixuZXh0Om51bGx9LG51bGw9PT0odD12bi51cGRhdGVRdWV1ZSk/KHQ9e2xhc3RFZmZlY3Q6bnVsbH0sdm4udXBkYXRlUXVldWU9dCx0Lmxhc3RFZmZlY3Q9ZS5uZXh0PWUpOm51bGw9PT0obj10Lmxhc3RFZmZlY3QpP3QubGFzdEVmZmVjdD1lLm5leHQ9ZToocj1uLm5leHQsbi5uZXh0PWUsZS5uZXh0PXIsdC5sYXN0RWZmZWN0PWUpLGV9ZnVuY3Rpb24gUm4oKXtyZXR1cm4gem4oKS5tZW1vaXplZFN0YXRlfWZ1bmN0aW9uIE1uKGUsdCxuLHIpe3ZhciBsPXduKCk7dm4uZWZmZWN0VGFnfD1lLGwubWVtb2l6ZWRTdGF0ZT1JbigxfHQsbix2b2lkIDAsdm9pZCAwPT09cj9udWxsOnIpfWZ1bmN0aW9uIFFuKGUsdCxuLHIpe3ZhciBsPXpuKCk7cj12b2lkIDA9PT1yP251bGw6cjt2YXIgaT12b2lkIDA7aWYobnVsbCE9PXluKXt2YXIgdT15bi5tZW1vaXplZFN0YXRlO2lmKGk9dS5kZXN0cm95LG51bGwhPT1yJiZTbihyLHUuZGVwcykpcmV0dXJuIHZvaWQgSW4odCxuLGkscil9dm4uZWZmZWN0VGFnfD1lLGwubWVtb2l6ZWRTdGF0ZT1JbigxfHQsbixpLHIpfWZ1bmN0aW9uIFVuKGUsdCl7cmV0dXJuIE1uKDUxNiw0LGUsdCl9ZnVuY3Rpb24gRG4oZSx0KXtyZXR1cm4gUW4oNTE2LDQsZSx0KX1mdW5jdGlvbiBGbihlLHQpe3JldHVybiBRbig0LDIsZSx0KX1mdW5jdGlvbiBXbihlLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/KGU9ZSgpLHQoZSksZnVuY3Rpb24oKXt0KG51bGwpfSk6bnVsbCE9dD8oZT1lKCksdC5jdXJyZW50PWUsZnVuY3Rpb24oKXt0LmN1cnJlbnQ9bnVsbH0pOnZvaWQgMH1mdW5jdGlvbiBIbihlLHQsbil7cmV0dXJuIG49bnVsbCE9bj9uLmNvbmNhdChbZV0pOm51bGwsUW4oNCwyLFduLmJpbmQobnVsbCx0LGUpLG4pfWZ1bmN0aW9uIGpuKCl7fWZ1bmN0aW9uIEFuKGUsdCl7cmV0dXJuIHduKCkubWVtb2l6ZWRTdGF0ZT1bZSx2b2lkIDA9PT10P251bGw6dF0sZX1mdW5jdGlvbiBCbihlLHQpe3ZhciBuPXpuKCk7dD12b2lkIDA9PT10P251bGw6dDt2YXIgcj1uLm1lbW9pemVkU3RhdGU7cmV0dXJuIG51bGwhPT1yJiZudWxsIT09dCYmU24odCxyWzFdKT9yWzBdOihuLm1lbW9pemVkU3RhdGU9W2UsdF0sZSl9ZnVuY3Rpb24gT24oZSx0KXt2YXIgbj16bigpO3Q9dm9pZCAwPT09dD9udWxsOnQ7dmFyIHI9bi5tZW1vaXplZFN0YXRlO3JldHVybiBudWxsIT09ciYmbnVsbCE9PXQmJlNuKHQsclsxXSk/clswXTooZT1lKCksbi5tZW1vaXplZFN0YXRlPVtlLHRdLGUpfWZ1bmN0aW9uIExuKGUsdCxuKXt2YXIgcj1kdCgpO210KDk4PnI/OTg6ciwoZnVuY3Rpb24oKXtlKCEwKX0pKSxtdCg5NzxyPzk3OnIsKGZ1bmN0aW9uKCl7dmFyIHI9Z24uc3VzcGVuc2U7Z24uc3VzcGVuc2U9dm9pZCAwPT09dD9udWxsOnQ7dHJ5e2UoITEpLG4oKX1maW5hbGx5e2duLnN1c3BlbnNlPXJ9fSkpfWZ1bmN0aW9uIHFuKGUsdCxuKXt2YXIgcj1JbCgpLGw9QnQuc3VzcGVuc2U7bD17ZXhwaXJhdGlvblRpbWU6cj1SbChyLGUsbCksc3VzcGVuc2VDb25maWc6bCxhY3Rpb246bixlYWdlclJlZHVjZXI6bnVsbCxlYWdlclN0YXRlOm51bGwsbmV4dDpudWxsfTt2YXIgaT10LnBlbmRpbmc7aWYobnVsbD09PWk/bC5uZXh0PWw6KGwubmV4dD1pLm5leHQsaS5uZXh0PWwpLHQucGVuZGluZz1sLGk9ZS5hbHRlcm5hdGUsZT09PXZufHxudWxsIT09aSYmaT09PXZuKXhuPSEwLGwuZXhwaXJhdGlvblRpbWU9Ym4sdm4uZXhwaXJhdGlvblRpbWU9Ym47ZWxzZXtpZigwPT09ZS5leHBpcmF0aW9uVGltZSYmKG51bGw9PT1pfHwwPT09aS5leHBpcmF0aW9uVGltZSkmJm51bGwhPT0oaT10Lmxhc3RSZW5kZXJlZFJlZHVjZXIpKXRyeXt2YXIgdT10Lmxhc3RSZW5kZXJlZFN0YXRlLGE9aSh1LG4pO2lmKGwuZWFnZXJSZWR1Y2VyPWksbC5lYWdlclN0YXRlPWEsVHQoYSx1KSlyZXR1cm59Y2F0Y2goZSl7fU1sKGUscil9fXZhciBWbj17cmVhZENvbnRleHQ6TXQsdXNlQ2FsbGJhY2s6RW4sdXNlQ29udGV4dDpFbix1c2VFZmZlY3Q6RW4sdXNlSW1wZXJhdGl2ZUhhbmRsZTpFbix1c2VMYXlvdXRFZmZlY3Q6RW4sdXNlTWVtbzpFbix1c2VSZWR1Y2VyOkVuLHVzZVJlZjpFbix1c2VTdGF0ZTpFbix1c2VEZWJ1Z1ZhbHVlOkVuLHVzZVJlc3BvbmRlcjpFbix1c2VEZWZlcnJlZFZhbHVlOkVuLHVzZVRyYW5zaXRpb246RW59LCRuPXtyZWFkQ29udGV4dDpNdCx1c2VDYWxsYmFjazpBbix1c2VDb250ZXh0Ok10LHVzZUVmZmVjdDpVbix1c2VJbXBlcmF0aXZlSGFuZGxlOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gbj1udWxsIT1uP24uY29uY2F0KFtlXSk6bnVsbCxNbig0LDIsV24uYmluZChudWxsLHQsZSksbil9LHVzZUxheW91dEVmZmVjdDpmdW5jdGlvbihlLHQpe3JldHVybiBNbig0LDIsZSx0KX0sdXNlTWVtbzpmdW5jdGlvbihlLHQpe3ZhciBuPXduKCk7cmV0dXJuIHQ9dm9pZCAwPT09dD9udWxsOnQsZT1lKCksbi5tZW1vaXplZFN0YXRlPVtlLHRdLGV9LHVzZVJlZHVjZXI6ZnVuY3Rpb24oZSx0LG4pe3ZhciByPXduKCk7cmV0dXJuIHQ9dm9pZCAwIT09bj9uKHQpOnQsci5tZW1vaXplZFN0YXRlPXIuYmFzZVN0YXRlPXQsZT0oZT1yLnF1ZXVlPXtwZW5kaW5nOm51bGwsZGlzcGF0Y2g6bnVsbCxsYXN0UmVuZGVyZWRSZWR1Y2VyOmUsbGFzdFJlbmRlcmVkU3RhdGU6dH0pLmRpc3BhdGNoPXFuLmJpbmQobnVsbCx2bixlKSxbci5tZW1vaXplZFN0YXRlLGVdfSx1c2VSZWY6ZnVuY3Rpb24oZSl7cmV0dXJuIGU9e2N1cnJlbnQ6ZX0sd24oKS5tZW1vaXplZFN0YXRlPWV9LHVzZVN0YXRlOl9uLHVzZURlYnVnVmFsdWU6am4sdXNlUmVzcG9uZGVyOm1uLHVzZURlZmVycmVkVmFsdWU6ZnVuY3Rpb24oZSx0KXt2YXIgbj1fbihlKSxyPW5bMF0sbD1uWzFdO3JldHVybiBVbigoZnVuY3Rpb24oKXt2YXIgbj1nbi5zdXNwZW5zZTtnbi5zdXNwZW5zZT12b2lkIDA9PT10P251bGw6dDt0cnl7bChlKX1maW5hbGx5e2duLnN1c3BlbnNlPW59fSksW2UsdF0pLHJ9LHVzZVRyYW5zaXRpb246ZnVuY3Rpb24oZSl7dmFyIHQ9X24oITEpLG49dFswXTtyZXR1cm4gdD10WzFdLFtBbihMbi5iaW5kKG51bGwsdCxlKSxbdCxlXSksbl19fSxLbj17cmVhZENvbnRleHQ6TXQsdXNlQ2FsbGJhY2s6Qm4sdXNlQ29udGV4dDpNdCx1c2VFZmZlY3Q6RG4sdXNlSW1wZXJhdGl2ZUhhbmRsZTpIbix1c2VMYXlvdXRFZmZlY3Q6Rm4sdXNlTWVtbzpPbix1c2VSZWR1Y2VyOlBuLHVzZVJlZjpSbix1c2VTdGF0ZTpmdW5jdGlvbigpe3JldHVybiBQbihDbil9LHVzZURlYnVnVmFsdWU6am4sdXNlUmVzcG9uZGVyOm1uLHVzZURlZmVycmVkVmFsdWU6ZnVuY3Rpb24oZSx0KXt2YXIgbj1QbihDbikscj1uWzBdLGw9blsxXTtyZXR1cm4gRG4oKGZ1bmN0aW9uKCl7dmFyIG49Z24uc3VzcGVuc2U7Z24uc3VzcGVuc2U9dm9pZCAwPT09dD9udWxsOnQ7dHJ5e2woZSl9ZmluYWxseXtnbi5zdXNwZW5zZT1ufX0pLFtlLHRdKSxyfSx1c2VUcmFuc2l0aW9uOmZ1bmN0aW9uKGUpe3ZhciB0PVBuKENuKSxuPXRbMF07cmV0dXJuIHQ9dFsxXSxbQm4oTG4uYmluZChudWxsLHQsZSksW3QsZV0pLG5dfX0sR249e3JlYWRDb250ZXh0Ok10LHVzZUNhbGxiYWNrOkJuLHVzZUNvbnRleHQ6TXQsdXNlRWZmZWN0OkRuLHVzZUltcGVyYXRpdmVIYW5kbGU6SG4sdXNlTGF5b3V0RWZmZWN0OkZuLHVzZU1lbW86T24sdXNlUmVkdWNlcjpObix1c2VSZWY6Um4sdXNlU3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gTm4oQ24pfSx1c2VEZWJ1Z1ZhbHVlOmpuLHVzZVJlc3BvbmRlcjptbix1c2VEZWZlcnJlZFZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIG49Tm4oQ24pLHI9blswXSxsPW5bMV07cmV0dXJuIERuKChmdW5jdGlvbigpe3ZhciBuPWduLnN1c3BlbnNlO2duLnN1c3BlbnNlPXZvaWQgMD09PXQ/bnVsbDp0O3RyeXtsKGUpfWZpbmFsbHl7Z24uc3VzcGVuc2U9bn19KSxbZSx0XSkscn0sdXNlVHJhbnNpdGlvbjpmdW5jdGlvbihlKXt2YXIgdD1ObihDbiksbj10WzBdO3JldHVybiB0PXRbMV0sW0JuKExuLmJpbmQobnVsbCx0LGUpLFt0LGVdKSxuXX19LFluPW51bGwsSm49bnVsbCxYbj0hMTtmdW5jdGlvbiBabihlLHQpe3ZhciBuPWZpKDUsbnVsbCxudWxsLDApO24uZWxlbWVudFR5cGU9XCJERUxFVEVEXCIsbi50eXBlPVwiREVMRVRFRFwiLG4uc3RhdGVOb2RlPXQsbi5yZXR1cm49ZSxuLmVmZmVjdFRhZz04LG51bGwhPT1lLmxhc3RFZmZlY3Q/KGUubGFzdEVmZmVjdC5uZXh0RWZmZWN0PW4sZS5sYXN0RWZmZWN0PW4pOmUuZmlyc3RFZmZlY3Q9ZS5sYXN0RWZmZWN0PW59ZnVuY3Rpb24gZXIoZSx0KXtzd2l0Y2goZS50YWcpe2Nhc2UgNTpyZXR1cm4gbnVsbCE9PSh0PXllKHQsZS50eXBlLGUucGVuZGluZ1Byb3BzKSkmJihlLnN0YXRlTm9kZT10LCEwKTtjYXNlIDY6cmV0dXJuIG51bGwhPT0odD1UZSh0LGUucGVuZGluZ1Byb3BzKSkmJihlLnN0YXRlTm9kZT10LCEwKTtjYXNlIDEzOmRlZmF1bHQ6cmV0dXJuITF9fWZ1bmN0aW9uIHRyKGUpe2lmKFhuKXt2YXIgdD1KbjtpZih0KXt2YXIgbj10O2lmKCFlcihlLHQpKXtpZighKHQ9U2UobikpfHwhZXIoZSx0KSlyZXR1cm4gZS5lZmZlY3RUYWc9LTEwMjUmZS5lZmZlY3RUYWd8MixYbj0hMSx2b2lkKFluPWUpO1puKFluLG4pfVluPWUsSm49a2UodCl9ZWxzZSBlLmVmZmVjdFRhZz0tMTAyNSZlLmVmZmVjdFRhZ3wyLFhuPSExLFluPWV9fWZ1bmN0aW9uIG5yKGUpe2ZvcihlPWUucmV0dXJuO251bGwhPT1lJiY1IT09ZS50YWcmJjMhPT1lLnRhZyYmMTMhPT1lLnRhZzspZT1lLnJldHVybjtZbj1lfWZ1bmN0aW9uIHJyKGUpe2lmKCFKfHxlIT09WW4pcmV0dXJuITE7aWYoIVhuKXJldHVybiBucihlKSxYbj0hMCwhMTt2YXIgdD1lLnR5cGU7aWYoNSE9PWUudGFnfHxcImhlYWRcIiE9PXQmJlwiYm9keVwiIT09dCYmIUIodCxlLm1lbW9pemVkUHJvcHMpKWZvcih0PUpuO3Q7KVpuKGUsdCksdD1TZSh0KTtpZihucihlKSwxMz09PWUudGFnKXtpZighSil0aHJvdyBFcnJvcihjKDMxNikpO2lmKCEoZT1udWxsIT09KGU9ZS5tZW1vaXplZFN0YXRlKT9lLmRlaHlkcmF0ZWQ6bnVsbCkpdGhyb3cgRXJyb3IoYygzMTcpKTtKbj1DZShlKX1lbHNlIEpuPVluP1NlKGUuc3RhdGVOb2RlKTpudWxsO3JldHVybiEwfWZ1bmN0aW9uIGxyKCl7SiYmKEpuPVluPW51bGwsWG49ITEpfXZhciBpcj1mLlJlYWN0Q3VycmVudE93bmVyLHVyPSExO2Z1bmN0aW9uIGFyKGUsdCxuLHIpe3QuY2hpbGQ9bnVsbD09PWU/dG4odCxudWxsLG4scik6ZW4odCxlLmNoaWxkLG4scil9ZnVuY3Rpb24gb3IoZSx0LG4scixsKXtuPW4ucmVuZGVyO3ZhciBpPXQucmVmO3JldHVybiBSdCh0LGwpLHI9a24oZSx0LG4scixpLGwpLG51bGw9PT1lfHx1cj8odC5lZmZlY3RUYWd8PTEsYXIoZSx0LHIsbCksdC5jaGlsZCk6KHQudXBkYXRlUXVldWU9ZS51cGRhdGVRdWV1ZSx0LmVmZmVjdFRhZyY9LTUxNyxlLmV4cGlyYXRpb25UaW1lPD1sJiYoZS5leHBpcmF0aW9uVGltZT0wKSx3cihlLHQsbCkpfWZ1bmN0aW9uIGNyKGUsdCxuLHIsbCxpKXtpZihudWxsPT09ZSl7dmFyIHU9bi50eXBlO3JldHVyblwiZnVuY3Rpb25cIiE9dHlwZW9mIHV8fHNpKHUpfHx2b2lkIDAhPT11LmRlZmF1bHRQcm9wc3x8bnVsbCE9PW4uY29tcGFyZXx8dm9pZCAwIT09bi5kZWZhdWx0UHJvcHM/KChlPXBpKG4udHlwZSxudWxsLHIsbnVsbCx0Lm1vZGUsaSkpLnJlZj10LnJlZixlLnJldHVybj10LHQuY2hpbGQ9ZSk6KHQudGFnPTE1LHQudHlwZT11LGZyKGUsdCx1LHIsbCxpKSl9cmV0dXJuIHU9ZS5jaGlsZCxsPGkmJihsPXUubWVtb2l6ZWRQcm9wcywobj1udWxsIT09KG49bi5jb21wYXJlKT9uOkV0KShsLHIpJiZlLnJlZj09PXQucmVmKT93cihlLHQsaSk6KHQuZWZmZWN0VGFnfD0xLChlPWRpKHUscikpLnJlZj10LnJlZixlLnJldHVybj10LHQuY2hpbGQ9ZSl9ZnVuY3Rpb24gZnIoZSx0LG4scixsLGkpe3JldHVybiBudWxsIT09ZSYmRXQoZS5tZW1vaXplZFByb3BzLHIpJiZlLnJlZj09PXQucmVmJiYodXI9ITEsbDxpKT8odC5leHBpcmF0aW9uVGltZT1lLmV4cGlyYXRpb25UaW1lLHdyKGUsdCxpKSk6ZHIoZSx0LG4scixpKX1mdW5jdGlvbiBzcihlLHQpe3ZhciBuPXQucmVmOyhudWxsPT09ZSYmbnVsbCE9PW58fG51bGwhPT1lJiZlLnJlZiE9PW4pJiYodC5lZmZlY3RUYWd8PTEyOCl9ZnVuY3Rpb24gZHIoZSx0LG4scixsKXt2YXIgaT1BZShuKT9IZTpGZS5jdXJyZW50O3JldHVybiBpPWplKHQsaSksUnQodCxsKSxuPWtuKGUsdCxuLHIsaSxsKSxudWxsPT09ZXx8dXI/KHQuZWZmZWN0VGFnfD0xLGFyKGUsdCxuLGwpLHQuY2hpbGQpOih0LnVwZGF0ZVF1ZXVlPWUudXBkYXRlUXVldWUsdC5lZmZlY3RUYWcmPS01MTcsZS5leHBpcmF0aW9uVGltZTw9bCYmKGUuZXhwaXJhdGlvblRpbWU9MCksd3IoZSx0LGwpKX1mdW5jdGlvbiBwcihlLHQsbixyLGwpe2lmKEFlKG4pKXt2YXIgaT0hMDtxZSh0KX1lbHNlIGk9ITE7aWYoUnQodCxsKSxudWxsPT09dC5zdGF0ZU5vZGUpbnVsbCE9PWUmJihlLmFsdGVybmF0ZT1udWxsLHQuYWx0ZXJuYXRlPW51bGwsdC5lZmZlY3RUYWd8PTIpLCR0KHQsbixyKSxHdCh0LG4scixsKSxyPSEwO2Vsc2UgaWYobnVsbD09PWUpe3ZhciB1PXQuc3RhdGVOb2RlLGE9dC5tZW1vaXplZFByb3BzO3UucHJvcHM9YTt2YXIgbz11LmNvbnRleHQsYz1uLmNvbnRleHRUeXBlO2M9XCJvYmplY3RcIj09dHlwZW9mIGMmJm51bGwhPT1jP010KGMpOmplKHQsYz1BZShuKT9IZTpGZS5jdXJyZW50KTt2YXIgZj1uLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyxzPVwiZnVuY3Rpb25cIj09dHlwZW9mIGZ8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHUuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGU7c3x8XCJmdW5jdGlvblwiIT10eXBlb2YgdS5VTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmXCJmdW5jdGlvblwiIT10eXBlb2YgdS5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzfHwoYSE9PXJ8fG8hPT1jKSYmS3QodCx1LHIsYyksUXQ9ITE7dmFyIGQ9dC5tZW1vaXplZFN0YXRlO3Uuc3RhdGU9ZCxqdCh0LHIsdSxsKSxvPXQubWVtb2l6ZWRTdGF0ZSxhIT09cnx8ZCE9PW98fFdlLmN1cnJlbnR8fFF0PyhcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiYoTHQodCxuLGYsciksbz10Lm1lbW9pemVkU3RhdGUpLChhPVF0fHxWdCh0LG4sYSxyLGQsbyxjKSk/KHN8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIHUuVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCYmXCJmdW5jdGlvblwiIT10eXBlb2YgdS5jb21wb25lbnRXaWxsTW91bnR8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LmNvbXBvbmVudFdpbGxNb3VudCYmdS5jb21wb25lbnRXaWxsTW91bnQoKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LlVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQmJnUuVU5TQUZFX2NvbXBvbmVudFdpbGxNb3VudCgpKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LmNvbXBvbmVudERpZE1vdW50JiYodC5lZmZlY3RUYWd8PTQpKTooXCJmdW5jdGlvblwiPT10eXBlb2YgdS5jb21wb25lbnREaWRNb3VudCYmKHQuZWZmZWN0VGFnfD00KSx0Lm1lbW9pemVkUHJvcHM9cix0Lm1lbW9pemVkU3RhdGU9byksdS5wcm9wcz1yLHUuc3RhdGU9byx1LmNvbnRleHQ9YyxyPWEpOihcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LmNvbXBvbmVudERpZE1vdW50JiYodC5lZmZlY3RUYWd8PTQpLHI9ITEpfWVsc2UgdT10LnN0YXRlTm9kZSxEdChlLHQpLGE9dC5tZW1vaXplZFByb3BzLHUucHJvcHM9dC50eXBlPT09dC5lbGVtZW50VHlwZT9hOlN0KHQudHlwZSxhKSxvPXUuY29udGV4dCxjPVwib2JqZWN0XCI9PXR5cGVvZihjPW4uY29udGV4dFR5cGUpJiZudWxsIT09Yz9NdChjKTpqZSh0LGM9QWUobik/SGU6RmUuY3VycmVudCksKHM9XCJmdW5jdGlvblwiPT10eXBlb2YoZj1uLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyl8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHUuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUpfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LlVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHN8fChhIT09cnx8byE9PWMpJiZLdCh0LHUscixjKSxRdD0hMSxvPXQubWVtb2l6ZWRTdGF0ZSx1LnN0YXRlPW8sanQodCxyLHUsbCksZD10Lm1lbW9pemVkU3RhdGUsYSE9PXJ8fG8hPT1kfHxXZS5jdXJyZW50fHxRdD8oXCJmdW5jdGlvblwiPT10eXBlb2YgZiYmKEx0KHQsbixmLHIpLGQ9dC5tZW1vaXplZFN0YXRlKSwoZj1RdHx8VnQodCxuLGEscixvLGQsYykpPyhzfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LlVOU0FGRV9jb21wb25lbnRXaWxsVXBkYXRlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LmNvbXBvbmVudFdpbGxVcGRhdGV8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LmNvbXBvbmVudFdpbGxVcGRhdGUmJnUuY29tcG9uZW50V2lsbFVwZGF0ZShyLGQsYyksXCJmdW5jdGlvblwiPT10eXBlb2YgdS5VTlNBRkVfY29tcG9uZW50V2lsbFVwZGF0ZSYmdS5VTlNBRkVfY29tcG9uZW50V2lsbFVwZGF0ZShyLGQsYykpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHUuY29tcG9uZW50RGlkVXBkYXRlJiYodC5lZmZlY3RUYWd8PTQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHUuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUmJih0LmVmZmVjdFRhZ3w9MjU2KSk6KFwiZnVuY3Rpb25cIiE9dHlwZW9mIHUuY29tcG9uZW50RGlkVXBkYXRlfHxhPT09ZS5tZW1vaXplZFByb3BzJiZvPT09ZS5tZW1vaXplZFN0YXRlfHwodC5lZmZlY3RUYWd8PTQpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIHUuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fGE9PT1lLm1lbW9pemVkUHJvcHMmJm89PT1lLm1lbW9pemVkU3RhdGV8fCh0LmVmZmVjdFRhZ3w9MjU2KSx0Lm1lbW9pemVkUHJvcHM9cix0Lm1lbW9pemVkU3RhdGU9ZCksdS5wcm9wcz1yLHUuc3RhdGU9ZCx1LmNvbnRleHQ9YyxyPWYpOihcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LmNvbXBvbmVudERpZFVwZGF0ZXx8YT09PWUubWVtb2l6ZWRQcm9wcyYmbz09PWUubWVtb2l6ZWRTdGF0ZXx8KHQuZWZmZWN0VGFnfD00KSxcImZ1bmN0aW9uXCIhPXR5cGVvZiB1LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHxhPT09ZS5tZW1vaXplZFByb3BzJiZvPT09ZS5tZW1vaXplZFN0YXRlfHwodC5lZmZlY3RUYWd8PTI1Nikscj0hMSk7cmV0dXJuIG1yKGUsdCxuLHIsaSxsKX1mdW5jdGlvbiBtcihlLHQsbixyLGwsaSl7c3IoZSx0KTt2YXIgdT0wIT0oNjQmdC5lZmZlY3RUYWcpO2lmKCFyJiYhdSlyZXR1cm4gbCYmVmUodCxuLCExKSx3cihlLHQsaSk7cj10LnN0YXRlTm9kZSxpci5jdXJyZW50PXQ7dmFyIGE9dSYmXCJmdW5jdGlvblwiIT10eXBlb2Ygbi5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3I/bnVsbDpyLnJlbmRlcigpO3JldHVybiB0LmVmZmVjdFRhZ3w9MSxudWxsIT09ZSYmdT8odC5jaGlsZD1lbih0LGUuY2hpbGQsbnVsbCxpKSx0LmNoaWxkPWVuKHQsbnVsbCxhLGkpKTphcihlLHQsYSxpKSx0Lm1lbW9pemVkU3RhdGU9ci5zdGF0ZSxsJiZWZSh0LG4sITApLHQuY2hpbGR9ZnVuY3Rpb24gaHIoZSl7dmFyIHQ9ZS5zdGF0ZU5vZGU7dC5wZW5kaW5nQ29udGV4dD9PZSgwLHQucGVuZGluZ0NvbnRleHQsdC5wZW5kaW5nQ29udGV4dCE9PXQuY29udGV4dCk6dC5jb250ZXh0JiZPZSgwLHQuY29udGV4dCwhMSksb24oZSx0LmNvbnRhaW5lckluZm8pfXZhciBncixicix2cix5cixUcj17ZGVoeWRyYXRlZDpudWxsLHJldHJ5VGltZTowfTtmdW5jdGlvbiB4cihlLHQsbil7dmFyIHIsbD10Lm1vZGUsaT10LnBlbmRpbmdQcm9wcyx1PWRuLmN1cnJlbnQsYT0hMTtpZigocj0wIT0oNjQmdC5lZmZlY3RUYWcpKXx8KHI9MCE9KDImdSkmJihudWxsPT09ZXx8bnVsbCE9PWUubWVtb2l6ZWRTdGF0ZSkpLHI/KGE9ITAsdC5lZmZlY3RUYWcmPS02NSk6bnVsbCE9PWUmJm51bGw9PT1lLm1lbW9pemVkU3RhdGV8fHZvaWQgMD09PWkuZmFsbGJhY2t8fCEwPT09aS51bnN0YWJsZV9hdm9pZFRoaXNGYWxsYmFja3x8KHV8PTEpLFVlKGRuLDEmdSksbnVsbD09PWUpe2lmKHZvaWQgMCE9PWkuZmFsbGJhY2smJnRyKHQpLGEpe2lmKGE9aS5mYWxsYmFjaywoaT1taShudWxsLGwsMCxudWxsKSkucmV0dXJuPXQsMD09KDImdC5tb2RlKSlmb3IoZT1udWxsIT09dC5tZW1vaXplZFN0YXRlP3QuY2hpbGQuY2hpbGQ6dC5jaGlsZCxpLmNoaWxkPWU7bnVsbCE9PWU7KWUucmV0dXJuPWksZT1lLnNpYmxpbmc7cmV0dXJuKG49bWkoYSxsLG4sbnVsbCkpLnJldHVybj10LGkuc2libGluZz1uLHQubWVtb2l6ZWRTdGF0ZT1Ucix0LmNoaWxkPWksbn1yZXR1cm4gbD1pLmNoaWxkcmVuLHQubWVtb2l6ZWRTdGF0ZT1udWxsLHQuY2hpbGQ9dG4odCxudWxsLGwsbil9aWYobnVsbCE9PWUubWVtb2l6ZWRTdGF0ZSl7aWYobD0oZT1lLmNoaWxkKS5zaWJsaW5nLGEpe2lmKGk9aS5mYWxsYmFjaywobj1kaShlLGUucGVuZGluZ1Byb3BzKSkucmV0dXJuPXQsMD09KDImdC5tb2RlKSYmKGE9bnVsbCE9PXQubWVtb2l6ZWRTdGF0ZT90LmNoaWxkLmNoaWxkOnQuY2hpbGQpIT09ZS5jaGlsZClmb3Iobi5jaGlsZD1hO251bGwhPT1hOylhLnJldHVybj1uLGE9YS5zaWJsaW5nO3JldHVybihsPWRpKGwsaSkpLnJldHVybj10LG4uc2libGluZz1sLG4uY2hpbGRFeHBpcmF0aW9uVGltZT0wLHQubWVtb2l6ZWRTdGF0ZT1Ucix0LmNoaWxkPW4sbH1yZXR1cm4gbj1lbih0LGUuY2hpbGQsaS5jaGlsZHJlbixuKSx0Lm1lbW9pemVkU3RhdGU9bnVsbCx0LmNoaWxkPW59aWYoZT1lLmNoaWxkLGEpe2lmKGE9aS5mYWxsYmFjaywoaT1taShudWxsLGwsMCxudWxsKSkucmV0dXJuPXQsaS5jaGlsZD1lLG51bGwhPT1lJiYoZS5yZXR1cm49aSksMD09KDImdC5tb2RlKSlmb3IoZT1udWxsIT09dC5tZW1vaXplZFN0YXRlP3QuY2hpbGQuY2hpbGQ6dC5jaGlsZCxpLmNoaWxkPWU7bnVsbCE9PWU7KWUucmV0dXJuPWksZT1lLnNpYmxpbmc7cmV0dXJuKG49bWkoYSxsLG4sbnVsbCkpLnJldHVybj10LGkuc2libGluZz1uLG4uZWZmZWN0VGFnfD0yLGkuY2hpbGRFeHBpcmF0aW9uVGltZT0wLHQubWVtb2l6ZWRTdGF0ZT1Ucix0LmNoaWxkPWksbn1yZXR1cm4gdC5tZW1vaXplZFN0YXRlPW51bGwsdC5jaGlsZD1lbih0LGUsaS5jaGlsZHJlbixuKX1mdW5jdGlvbiBFcihlLHQpe2UuZXhwaXJhdGlvblRpbWU8dCYmKGUuZXhwaXJhdGlvblRpbWU9dCk7dmFyIG49ZS5hbHRlcm5hdGU7bnVsbCE9PW4mJm4uZXhwaXJhdGlvblRpbWU8dCYmKG4uZXhwaXJhdGlvblRpbWU9dCksSXQoZS5yZXR1cm4sdCl9ZnVuY3Rpb24gU3IoZSx0LG4scixsLGkpe3ZhciB1PWUubWVtb2l6ZWRTdGF0ZTtudWxsPT09dT9lLm1lbW9pemVkU3RhdGU9e2lzQmFja3dhcmRzOnQscmVuZGVyaW5nOm51bGwscmVuZGVyaW5nU3RhcnRUaW1lOjAsbGFzdDpyLHRhaWw6bix0YWlsRXhwaXJhdGlvbjowLHRhaWxNb2RlOmwsbGFzdEVmZmVjdDppfToodS5pc0JhY2t3YXJkcz10LHUucmVuZGVyaW5nPW51bGwsdS5yZW5kZXJpbmdTdGFydFRpbWU9MCx1Lmxhc3Q9cix1LnRhaWw9bix1LnRhaWxFeHBpcmF0aW9uPTAsdS50YWlsTW9kZT1sLHUubGFzdEVmZmVjdD1pKX1mdW5jdGlvbiBrcihlLHQsbil7dmFyIHI9dC5wZW5kaW5nUHJvcHMsbD1yLnJldmVhbE9yZGVyLGk9ci50YWlsO2lmKGFyKGUsdCxyLmNoaWxkcmVuLG4pLDAhPSgyJihyPWRuLmN1cnJlbnQpKSlyPTEmcnwyLHQuZWZmZWN0VGFnfD02NDtlbHNle2lmKG51bGwhPT1lJiYwIT0oNjQmZS5lZmZlY3RUYWcpKWU6Zm9yKGU9dC5jaGlsZDtudWxsIT09ZTspe2lmKDEzPT09ZS50YWcpbnVsbCE9PWUubWVtb2l6ZWRTdGF0ZSYmRXIoZSxuKTtlbHNlIGlmKDE5PT09ZS50YWcpRXIoZSxuKTtlbHNlIGlmKG51bGwhPT1lLmNoaWxkKXtlLmNoaWxkLnJldHVybj1lLGU9ZS5jaGlsZDtjb250aW51ZX1pZihlPT09dClicmVhayBlO2Zvcig7bnVsbD09PWUuc2libGluZzspe2lmKG51bGw9PT1lLnJldHVybnx8ZS5yZXR1cm49PT10KWJyZWFrIGU7ZT1lLnJldHVybn1lLnNpYmxpbmcucmV0dXJuPWUucmV0dXJuLGU9ZS5zaWJsaW5nfXImPTF9aWYoVWUoZG4sciksMD09KDImdC5tb2RlKSl0Lm1lbW9pemVkU3RhdGU9bnVsbDtlbHNlIHN3aXRjaChsKXtjYXNlXCJmb3J3YXJkc1wiOmZvcihuPXQuY2hpbGQsbD1udWxsO251bGwhPT1uOyludWxsIT09KGU9bi5hbHRlcm5hdGUpJiZudWxsPT09cG4oZSkmJihsPW4pLG49bi5zaWJsaW5nO251bGw9PT0obj1sKT8obD10LmNoaWxkLHQuY2hpbGQ9bnVsbCk6KGw9bi5zaWJsaW5nLG4uc2libGluZz1udWxsKSxTcih0LCExLGwsbixpLHQubGFzdEVmZmVjdCk7YnJlYWs7Y2FzZVwiYmFja3dhcmRzXCI6Zm9yKG49bnVsbCxsPXQuY2hpbGQsdC5jaGlsZD1udWxsO251bGwhPT1sOyl7aWYobnVsbCE9PShlPWwuYWx0ZXJuYXRlKSYmbnVsbD09PXBuKGUpKXt0LmNoaWxkPWw7YnJlYWt9ZT1sLnNpYmxpbmcsbC5zaWJsaW5nPW4sbj1sLGw9ZX1Tcih0LCEwLG4sbnVsbCxpLHQubGFzdEVmZmVjdCk7YnJlYWs7Y2FzZVwidG9nZXRoZXJcIjpTcih0LCExLG51bGwsbnVsbCx2b2lkIDAsdC5sYXN0RWZmZWN0KTticmVhaztkZWZhdWx0OnQubWVtb2l6ZWRTdGF0ZT1udWxsfXJldHVybiB0LmNoaWxkfWZ1bmN0aW9uIHdyKGUsdCxuKXtudWxsIT09ZSYmKHQuZGVwZW5kZW5jaWVzPWUuZGVwZW5kZW5jaWVzKTt2YXIgcj10LmV4cGlyYXRpb25UaW1lO2lmKDAhPT1yJiZxbChyKSx0LmNoaWxkRXhwaXJhdGlvblRpbWU8bilyZXR1cm4gbnVsbDtpZihudWxsIT09ZSYmdC5jaGlsZCE9PWUuY2hpbGQpdGhyb3cgRXJyb3IoYygxNTMpKTtpZihudWxsIT09dC5jaGlsZCl7Zm9yKG49ZGkoZT10LmNoaWxkLGUucGVuZGluZ1Byb3BzKSx0LmNoaWxkPW4sbi5yZXR1cm49dDtudWxsIT09ZS5zaWJsaW5nOyllPWUuc2libGluZywobj1uLnNpYmxpbmc9ZGkoZSxlLnBlbmRpbmdQcm9wcykpLnJldHVybj10O24uc2libGluZz1udWxsfXJldHVybiB0LmNoaWxkfWZ1bmN0aW9uIHpyKGUpe2UuZWZmZWN0VGFnfD00fWlmKEcpZ3I9ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG49dC5jaGlsZDtudWxsIT09bjspe2lmKDU9PT1uLnRhZ3x8Nj09PW4udGFnKUgoZSxuLnN0YXRlTm9kZSk7ZWxzZSBpZig0IT09bi50YWcmJm51bGwhPT1uLmNoaWxkKXtuLmNoaWxkLnJldHVybj1uLG49bi5jaGlsZDtjb250aW51ZX1pZihuPT09dClicmVhaztmb3IoO251bGw9PT1uLnNpYmxpbmc7KXtpZihudWxsPT09bi5yZXR1cm58fG4ucmV0dXJuPT09dClyZXR1cm47bj1uLnJldHVybn1uLnNpYmxpbmcucmV0dXJuPW4ucmV0dXJuLG49bi5zaWJsaW5nfX0sYnI9ZnVuY3Rpb24oKXt9LHZyPWZ1bmN0aW9uKGUsdCxuLHIsbCl7aWYoKGU9ZS5tZW1vaXplZFByb3BzKSE9PXIpe3ZhciBpPXQuc3RhdGVOb2RlLHU9YW4ocm4uY3VycmVudCk7bj1BKGksbixlLHIsbCx1KSwodC51cGRhdGVRdWV1ZT1uKSYmenIodCl9fSx5cj1mdW5jdGlvbihlLHQsbixyKXtuIT09ciYmenIodCl9O2Vsc2UgaWYoWSl7Z3I9ZnVuY3Rpb24oZSx0LG4scil7Zm9yKHZhciBsPXQuY2hpbGQ7bnVsbCE9PWw7KXtpZig1PT09bC50YWcpe3ZhciBpPWwuc3RhdGVOb2RlO24mJnImJihpPWJlKGksbC50eXBlLGwubWVtb2l6ZWRQcm9wcyxsKSksSChlLGkpfWVsc2UgaWYoNj09PWwudGFnKWk9bC5zdGF0ZU5vZGUsbiYmciYmKGk9dmUoaSxsLm1lbW9pemVkUHJvcHMsbCkpLEgoZSxpKTtlbHNlIGlmKDQhPT1sLnRhZyl7aWYoMTM9PT1sLnRhZyYmMCE9KDQmbC5lZmZlY3RUYWcpJiYoaT1udWxsIT09bC5tZW1vaXplZFN0YXRlKSl7dmFyIHU9bC5jaGlsZDtpZihudWxsIT09dSYmKG51bGwhPT11LmNoaWxkJiYodS5jaGlsZC5yZXR1cm49dSxncihlLHUsITAsaSkpLG51bGwhPT0oaT11LnNpYmxpbmcpKSl7aS5yZXR1cm49bCxsPWk7Y29udGludWV9fWlmKG51bGwhPT1sLmNoaWxkKXtsLmNoaWxkLnJldHVybj1sLGw9bC5jaGlsZDtjb250aW51ZX19aWYobD09PXQpYnJlYWs7Zm9yKDtudWxsPT09bC5zaWJsaW5nOyl7aWYobnVsbD09PWwucmV0dXJufHxsLnJldHVybj09PXQpcmV0dXJuO2w9bC5yZXR1cm59bC5zaWJsaW5nLnJldHVybj1sLnJldHVybixsPWwuc2libGluZ319O3ZhciBDcj1mdW5jdGlvbihlLHQsbixyKXtmb3IodmFyIGw9dC5jaGlsZDtudWxsIT09bDspe2lmKDU9PT1sLnRhZyl7dmFyIGk9bC5zdGF0ZU5vZGU7biYmciYmKGk9YmUoaSxsLnR5cGUsbC5tZW1vaXplZFByb3BzLGwpKSxtZShlLGkpfWVsc2UgaWYoNj09PWwudGFnKWk9bC5zdGF0ZU5vZGUsbiYmciYmKGk9dmUoaSxsLm1lbW9pemVkUHJvcHMsbCkpLG1lKGUsaSk7ZWxzZSBpZig0IT09bC50YWcpe2lmKDEzPT09bC50YWcmJjAhPSg0JmwuZWZmZWN0VGFnKSYmKGk9bnVsbCE9PWwubWVtb2l6ZWRTdGF0ZSkpe3ZhciB1PWwuY2hpbGQ7aWYobnVsbCE9PXUmJihudWxsIT09dS5jaGlsZCYmKHUuY2hpbGQucmV0dXJuPXUsQ3IoZSx1LCEwLGkpKSxudWxsIT09KGk9dS5zaWJsaW5nKSkpe2kucmV0dXJuPWwsbD1pO2NvbnRpbnVlfX1pZihudWxsIT09bC5jaGlsZCl7bC5jaGlsZC5yZXR1cm49bCxsPWwuY2hpbGQ7Y29udGludWV9fWlmKGw9PT10KWJyZWFrO2Zvcig7bnVsbD09PWwuc2libGluZzspe2lmKG51bGw9PT1sLnJldHVybnx8bC5yZXR1cm49PT10KXJldHVybjtsPWwucmV0dXJufWwuc2libGluZy5yZXR1cm49bC5yZXR1cm4sbD1sLnNpYmxpbmd9fTticj1mdW5jdGlvbihlKXt2YXIgdD1lLnN0YXRlTm9kZTtpZihudWxsIT09ZS5maXJzdEVmZmVjdCl7dmFyIG49dC5jb250YWluZXJJbmZvLHI9cGUobik7Q3IocixlLCExLCExKSx0LnBlbmRpbmdDaGlsZHJlbj1yLHpyKGUpLGhlKG4scil9fSx2cj1mdW5jdGlvbihlLHQsbixyLGwpe3ZhciBpPWUuc3RhdGVOb2RlLHU9ZS5tZW1vaXplZFByb3BzO2lmKChlPW51bGw9PT10LmZpcnN0RWZmZWN0KSYmdT09PXIpdC5zdGF0ZU5vZGU9aTtlbHNle3ZhciBhPXQuc3RhdGVOb2RlLG89YW4ocm4uY3VycmVudCksYz1udWxsO3UhPT1yJiYoYz1BKGEsbix1LHIsbCxvKSksZSYmbnVsbD09PWM/dC5zdGF0ZU5vZGU9aTooaT1kZShpLGMsbix1LHIsdCxlLGEpLGooaSxuLHIsbCxvKSYmenIodCksdC5zdGF0ZU5vZGU9aSxlP3pyKHQpOmdyKGksdCwhMSwhMSkpfX0seXI9ZnVuY3Rpb24oZSx0LG4scil7biE9PXI/KGU9YW4odW4uY3VycmVudCksbj1hbihybi5jdXJyZW50KSx0LnN0YXRlTm9kZT1MKHIsZSxuLHQpLHpyKHQpKTp0LnN0YXRlTm9kZT1lLnN0YXRlTm9kZX19ZWxzZSBicj1mdW5jdGlvbigpe30sdnI9ZnVuY3Rpb24oKXt9LHlyPWZ1bmN0aW9uKCl7fTtmdW5jdGlvbiBQcihlLHQpe3N3aXRjaChlLnRhaWxNb2RlKXtjYXNlXCJoaWRkZW5cIjp0PWUudGFpbDtmb3IodmFyIG49bnVsbDtudWxsIT09dDspbnVsbCE9PXQuYWx0ZXJuYXRlJiYobj10KSx0PXQuc2libGluZztudWxsPT09bj9lLnRhaWw9bnVsbDpuLnNpYmxpbmc9bnVsbDticmVhaztjYXNlXCJjb2xsYXBzZWRcIjpuPWUudGFpbDtmb3IodmFyIHI9bnVsbDtudWxsIT09bjspbnVsbCE9PW4uYWx0ZXJuYXRlJiYocj1uKSxuPW4uc2libGluZztudWxsPT09cj90fHxudWxsPT09ZS50YWlsP2UudGFpbD1udWxsOmUudGFpbC5zaWJsaW5nPW51bGw6ci5zaWJsaW5nPW51bGx9fWZ1bmN0aW9uIE5yKGUsdCxuKXt2YXIgcj10LnBlbmRpbmdQcm9wcztzd2l0Y2godC50YWcpe2Nhc2UgMjpjYXNlIDE2OmNhc2UgMTU6Y2FzZSAwOmNhc2UgMTE6Y2FzZSA3OmNhc2UgODpjYXNlIDEyOmNhc2UgOTpjYXNlIDE0OnJldHVybiBudWxsO2Nhc2UgMTpyZXR1cm4gQWUodC50eXBlKSYmQmUoKSxudWxsO2Nhc2UgMzpyZXR1cm4gY24oKSxRZShXZSksUWUoRmUpLChyPXQuc3RhdGVOb2RlKS5wZW5kaW5nQ29udGV4dCYmKHIuY29udGV4dD1yLnBlbmRpbmdDb250ZXh0LHIucGVuZGluZ0NvbnRleHQ9bnVsbCksKG51bGw9PT1lfHxudWxsPT09ZS5jaGlsZCkmJnJyKHQpJiZ6cih0KSxicih0KSxudWxsO2Nhc2UgNTpzbih0KTt2YXIgbD1hbih1bi5jdXJyZW50KTtpZihuPXQudHlwZSxudWxsIT09ZSYmbnVsbCE9dC5zdGF0ZU5vZGUpdnIoZSx0LG4scixsKSxlLnJlZiE9PXQucmVmJiYodC5lZmZlY3RUYWd8PTEyOCk7ZWxzZXtpZighcil7aWYobnVsbD09PXQuc3RhdGVOb2RlKXRocm93IEVycm9yKGMoMTY2KSk7cmV0dXJuIG51bGx9aWYoZT1hbihybi5jdXJyZW50KSxycih0KSl7aWYoIUopdGhyb3cgRXJyb3IoYygxNzUpKTtlPXdlKHQuc3RhdGVOb2RlLHQudHlwZSx0Lm1lbW9pemVkUHJvcHMsbCxlLHQpLHQudXBkYXRlUXVldWU9ZSxudWxsIT09ZSYmenIodCl9ZWxzZXt2YXIgaT1XKG4scixsLGUsdCk7Z3IoaSx0LCExLCExKSx0LnN0YXRlTm9kZT1pLGooaSxuLHIsbCxlKSYmenIodCl9bnVsbCE9PXQucmVmJiYodC5lZmZlY3RUYWd8PTEyOCl9cmV0dXJuIG51bGw7Y2FzZSA2OmlmKGUmJm51bGwhPXQuc3RhdGVOb2RlKXlyKGUsdCxlLm1lbW9pemVkUHJvcHMscik7ZWxzZXtpZihcInN0cmluZ1wiIT10eXBlb2YgciYmbnVsbD09PXQuc3RhdGVOb2RlKXRocm93IEVycm9yKGMoMTY2KSk7aWYoZT1hbih1bi5jdXJyZW50KSxsPWFuKHJuLmN1cnJlbnQpLHJyKHQpKXtpZighSil0aHJvdyBFcnJvcihjKDE3NikpO3plKHQuc3RhdGVOb2RlLHQubWVtb2l6ZWRQcm9wcyx0KSYmenIodCl9ZWxzZSB0LnN0YXRlTm9kZT1MKHIsZSxsLHQpfXJldHVybiBudWxsO2Nhc2UgMTM6cmV0dXJuIFFlKGRuKSxyPXQubWVtb2l6ZWRTdGF0ZSwwIT0oNjQmdC5lZmZlY3RUYWcpPyh0LmV4cGlyYXRpb25UaW1lPW4sdCk6KHI9bnVsbCE9PXIsbD0hMSxudWxsPT09ZT92b2lkIDAhPT10Lm1lbW9pemVkUHJvcHMuZmFsbGJhY2smJnJyKHQpOihsPW51bGwhPT0obj1lLm1lbW9pemVkU3RhdGUpLHJ8fG51bGw9PT1ufHxudWxsIT09KG49ZS5jaGlsZC5zaWJsaW5nKSYmKG51bGwhPT0oaT10LmZpcnN0RWZmZWN0KT8odC5maXJzdEVmZmVjdD1uLG4ubmV4dEVmZmVjdD1pKToodC5maXJzdEVmZmVjdD10Lmxhc3RFZmZlY3Q9bixuLm5leHRFZmZlY3Q9bnVsbCksbi5lZmZlY3RUYWc9OCkpLHImJiFsJiYwIT0oMiZ0Lm1vZGUpJiYobnVsbD09PWUmJiEwIT09dC5tZW1vaXplZFByb3BzLnVuc3RhYmxlX2F2b2lkVGhpc0ZhbGxiYWNrfHwwIT0oMSZkbi5jdXJyZW50KT9kbD09PWlsJiYoZGw9dWwpOihkbCE9PWlsJiZkbCE9PXVsfHwoZGw9YWwpLDAhPT1ibCYmbnVsbCE9PWNsJiYoeWkoY2wsc2wpLFRpKGNsLGJsKSkpKSxZJiZyJiYodC5lZmZlY3RUYWd8PTQpLEcmJihyfHxsKSYmKHQuZWZmZWN0VGFnfD00KSxudWxsKTtjYXNlIDQ6cmV0dXJuIGNuKCksYnIodCksbnVsbDtjYXNlIDEwOnJldHVybiBfdCh0KSxudWxsO2Nhc2UgMTc6cmV0dXJuIEFlKHQudHlwZSkmJkJlKCksbnVsbDtjYXNlIDE5OmlmKFFlKGRuKSxudWxsPT09KHI9dC5tZW1vaXplZFN0YXRlKSlyZXR1cm4gbnVsbDtpZihsPTAhPSg2NCZ0LmVmZmVjdFRhZyksbnVsbD09PShpPXIucmVuZGVyaW5nKSl7aWYobClQcihyLCExKTtlbHNlIGlmKGRsIT09aWx8fG51bGwhPT1lJiYwIT0oNjQmZS5lZmZlY3RUYWcpKWZvcihlPXQuY2hpbGQ7bnVsbCE9PWU7KXtpZihudWxsIT09KGk9cG4oZSkpKXtmb3IodC5lZmZlY3RUYWd8PTY0LFByKHIsITEpLG51bGwhPT0oZT1pLnVwZGF0ZVF1ZXVlKSYmKHQudXBkYXRlUXVldWU9ZSx0LmVmZmVjdFRhZ3w9NCksbnVsbD09PXIubGFzdEVmZmVjdCYmKHQuZmlyc3RFZmZlY3Q9bnVsbCksdC5sYXN0RWZmZWN0PXIubGFzdEVmZmVjdCxlPW4scj10LmNoaWxkO251bGwhPT1yOyluPWUsKGw9cikuZWZmZWN0VGFnJj0yLGwubmV4dEVmZmVjdD1udWxsLGwuZmlyc3RFZmZlY3Q9bnVsbCxsLmxhc3RFZmZlY3Q9bnVsbCxudWxsPT09KGk9bC5hbHRlcm5hdGUpPyhsLmNoaWxkRXhwaXJhdGlvblRpbWU9MCxsLmV4cGlyYXRpb25UaW1lPW4sbC5jaGlsZD1udWxsLGwubWVtb2l6ZWRQcm9wcz1udWxsLGwubWVtb2l6ZWRTdGF0ZT1udWxsLGwudXBkYXRlUXVldWU9bnVsbCxsLmRlcGVuZGVuY2llcz1udWxsKToobC5jaGlsZEV4cGlyYXRpb25UaW1lPWkuY2hpbGRFeHBpcmF0aW9uVGltZSxsLmV4cGlyYXRpb25UaW1lPWkuZXhwaXJhdGlvblRpbWUsbC5jaGlsZD1pLmNoaWxkLGwubWVtb2l6ZWRQcm9wcz1pLm1lbW9pemVkUHJvcHMsbC5tZW1vaXplZFN0YXRlPWkubWVtb2l6ZWRTdGF0ZSxsLnVwZGF0ZVF1ZXVlPWkudXBkYXRlUXVldWUsbj1pLmRlcGVuZGVuY2llcyxsLmRlcGVuZGVuY2llcz1udWxsPT09bj9udWxsOntleHBpcmF0aW9uVGltZTpuLmV4cGlyYXRpb25UaW1lLGZpcnN0Q29udGV4dDpuLmZpcnN0Q29udGV4dCxyZXNwb25kZXJzOm4ucmVzcG9uZGVyc30pLHI9ci5zaWJsaW5nO3JldHVybiBVZShkbiwxJmRuLmN1cnJlbnR8MiksdC5jaGlsZH1lPWUuc2libGluZ319ZWxzZXtpZighbClpZihudWxsIT09KGU9cG4oaSkpKXtpZih0LmVmZmVjdFRhZ3w9NjQsbD0hMCxudWxsIT09KGU9ZS51cGRhdGVRdWV1ZSkmJih0LnVwZGF0ZVF1ZXVlPWUsdC5lZmZlY3RUYWd8PTQpLFByKHIsITApLG51bGw9PT1yLnRhaWwmJlwiaGlkZGVuXCI9PT1yLnRhaWxNb2RlJiYhaS5hbHRlcm5hdGUpcmV0dXJuIG51bGwhPT0odD10Lmxhc3RFZmZlY3Q9ci5sYXN0RWZmZWN0KSYmKHQubmV4dEVmZmVjdD1udWxsKSxudWxsfWVsc2UgMipzdCgpLXIucmVuZGVyaW5nU3RhcnRUaW1lPnIudGFpbEV4cGlyYXRpb24mJjE8biYmKHQuZWZmZWN0VGFnfD02NCxsPSEwLFByKHIsITEpLHQuZXhwaXJhdGlvblRpbWU9dC5jaGlsZEV4cGlyYXRpb25UaW1lPW4tMSk7ci5pc0JhY2t3YXJkcz8oaS5zaWJsaW5nPXQuY2hpbGQsdC5jaGlsZD1pKToobnVsbCE9PShlPXIubGFzdCk/ZS5zaWJsaW5nPWk6dC5jaGlsZD1pLHIubGFzdD1pKX1yZXR1cm4gbnVsbCE9PXIudGFpbD8oMD09PXIudGFpbEV4cGlyYXRpb24mJihyLnRhaWxFeHBpcmF0aW9uPXN0KCkrNTAwKSxlPXIudGFpbCxyLnJlbmRlcmluZz1lLHIudGFpbD1lLnNpYmxpbmcsci5sYXN0RWZmZWN0PXQubGFzdEVmZmVjdCxyLnJlbmRlcmluZ1N0YXJ0VGltZT1zdCgpLGUuc2libGluZz1udWxsLHQ9ZG4uY3VycmVudCxVZShkbixsPzEmdHwyOjEmdCksZSk6bnVsbH10aHJvdyBFcnJvcihjKDE1Nix0LnRhZykpfWZ1bmN0aW9uIF9yKGUpe3N3aXRjaChlLnRhZyl7Y2FzZSAxOkFlKGUudHlwZSkmJkJlKCk7dmFyIHQ9ZS5lZmZlY3RUYWc7cmV0dXJuIDQwOTYmdD8oZS5lZmZlY3RUYWc9LTQwOTcmdHw2NCxlKTpudWxsO2Nhc2UgMzppZihjbigpLFFlKFdlKSxRZShGZSksMCE9KDY0Jih0PWUuZWZmZWN0VGFnKSkpdGhyb3cgRXJyb3IoYygyODUpKTtyZXR1cm4gZS5lZmZlY3RUYWc9LTQwOTcmdHw2NCxlO2Nhc2UgNTpyZXR1cm4gc24oZSksbnVsbDtjYXNlIDEzOnJldHVybiBRZShkbiksNDA5NiYodD1lLmVmZmVjdFRhZyk/KGUuZWZmZWN0VGFnPS00MDk3JnR8NjQsZSk6bnVsbDtjYXNlIDE5OnJldHVybiBRZShkbiksbnVsbDtjYXNlIDQ6cmV0dXJuIGNuKCksbnVsbDtjYXNlIDEwOnJldHVybiBfdChlKSxudWxsO2RlZmF1bHQ6cmV0dXJuIG51bGx9fWZ1bmN0aW9uIElyKGUsdCl7cmV0dXJue3ZhbHVlOmUsc291cmNlOnQsc3RhY2s6SWUodCl9fXZhciBScj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBXZWFrU2V0P1dlYWtTZXQ6U2V0O2Z1bmN0aW9uIE1yKGUsdCl7dmFyIG49dC5zb3VyY2Uscj10LnN0YWNrO251bGw9PT1yJiZudWxsIT09biYmKHI9SWUobikpLG51bGwhPT1uJiZQKG4udHlwZSksdD10LnZhbHVlLG51bGwhPT1lJiYxPT09ZS50YWcmJlAoZS50eXBlKTt0cnl7Y29uc29sZS5lcnJvcih0KX1jYXRjaChlKXtzZXRUaW1lb3V0KChmdW5jdGlvbigpe3Rocm93IGV9KSl9fWZ1bmN0aW9uIFFyKGUpe3ZhciB0PWUucmVmO2lmKG51bGwhPT10KWlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpdHJ5e3QobnVsbCl9Y2F0Y2godCl7cmkoZSx0KX1lbHNlIHQuY3VycmVudD1udWxsfWZ1bmN0aW9uIFVyKGUsdCl7c3dpdGNoKHQudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE1OmNhc2UgMjI6cmV0dXJuO2Nhc2UgMTppZigyNTYmdC5lZmZlY3RUYWcmJm51bGwhPT1lKXt2YXIgbj1lLm1lbW9pemVkUHJvcHMscj1lLm1lbW9pemVkU3RhdGU7dD0oZT10LnN0YXRlTm9kZSkuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUodC5lbGVtZW50VHlwZT09PXQudHlwZT9uOlN0KHQudHlwZSxuKSxyKSxlLl9fcmVhY3RJbnRlcm5hbFNuYXBzaG90QmVmb3JlVXBkYXRlPXR9cmV0dXJuO2Nhc2UgMzpjYXNlIDU6Y2FzZSA2OmNhc2UgNDpjYXNlIDE3OnJldHVybn10aHJvdyBFcnJvcihjKDE2MykpfWZ1bmN0aW9uIERyKGUsdCl7aWYobnVsbCE9PSh0PW51bGwhPT0odD10LnVwZGF0ZVF1ZXVlKT90Lmxhc3RFZmZlY3Q6bnVsbCkpe3ZhciBuPXQ9dC5uZXh0O2Rve2lmKChuLnRhZyZlKT09PWUpe3ZhciByPW4uZGVzdHJveTtuLmRlc3Ryb3k9dm9pZCAwLHZvaWQgMCE9PXImJnIoKX1uPW4ubmV4dH13aGlsZShuIT09dCl9fWZ1bmN0aW9uIEZyKGUsdCl7aWYobnVsbCE9PSh0PW51bGwhPT0odD10LnVwZGF0ZVF1ZXVlKT90Lmxhc3RFZmZlY3Q6bnVsbCkpe3ZhciBuPXQ9dC5uZXh0O2Rve2lmKChuLnRhZyZlKT09PWUpe3ZhciByPW4uY3JlYXRlO24uZGVzdHJveT1yKCl9bj1uLm5leHR9d2hpbGUobiE9PXQpfX1mdW5jdGlvbiBXcihlLHQsbil7c3dpdGNoKG4udGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE1OmNhc2UgMjI6cmV0dXJuIHZvaWQgRnIoMyxuKTtjYXNlIDE6aWYoZT1uLnN0YXRlTm9kZSw0Jm4uZWZmZWN0VGFnKWlmKG51bGw9PT10KWUuY29tcG9uZW50RGlkTW91bnQoKTtlbHNle3ZhciByPW4uZWxlbWVudFR5cGU9PT1uLnR5cGU/dC5tZW1vaXplZFByb3BzOlN0KG4udHlwZSx0Lm1lbW9pemVkUHJvcHMpO2UuY29tcG9uZW50RGlkVXBkYXRlKHIsdC5tZW1vaXplZFN0YXRlLGUuX19yZWFjdEludGVybmFsU25hcHNob3RCZWZvcmVVcGRhdGUpfXJldHVybiB2b2lkKG51bGwhPT0odD1uLnVwZGF0ZVF1ZXVlKSYmQXQobix0LGUpKTtjYXNlIDM6aWYobnVsbCE9PSh0PW4udXBkYXRlUXVldWUpKXtpZihlPW51bGwsbnVsbCE9PW4uY2hpbGQpc3dpdGNoKG4uY2hpbGQudGFnKXtjYXNlIDU6ZT1NKG4uY2hpbGQuc3RhdGVOb2RlKTticmVhaztjYXNlIDE6ZT1uLmNoaWxkLnN0YXRlTm9kZX1BdChuLHQsZSl9cmV0dXJuO2Nhc2UgNTpyZXR1cm4gZT1uLnN0YXRlTm9kZSx2b2lkKG51bGw9PT10JiY0Jm4uZWZmZWN0VGFnJiZ0ZShlLG4udHlwZSxuLm1lbW9pemVkUHJvcHMsbikpO2Nhc2UgNjpjYXNlIDQ6Y2FzZSAxMjpyZXR1cm47Y2FzZSAxMzpyZXR1cm4gdm9pZChKJiZudWxsPT09bi5tZW1vaXplZFN0YXRlJiYobj1uLmFsdGVybmF0ZSxudWxsIT09biYmKG49bi5tZW1vaXplZFN0YXRlLG51bGwhPT1uJiYobj1uLmRlaHlkcmF0ZWQsbnVsbCE9PW4mJk5lKG4pKSkpKTtjYXNlIDE5OmNhc2UgMTc6Y2FzZSAyMDpjYXNlIDIxOnJldHVybn10aHJvdyBFcnJvcihjKDE2MykpfWZ1bmN0aW9uIEhyKGUsdCxuKXtzd2l0Y2goXCJmdW5jdGlvblwiPT10eXBlb2Ygb2kmJm9pKHQpLHQudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE0OmNhc2UgMTU6Y2FzZSAyMjppZihudWxsIT09KGU9dC51cGRhdGVRdWV1ZSkmJm51bGwhPT0oZT1lLmxhc3RFZmZlY3QpKXt2YXIgcj1lLm5leHQ7bXQoOTc8bj85NzpuLChmdW5jdGlvbigpe3ZhciBlPXI7ZG97dmFyIG49ZS5kZXN0cm95O2lmKHZvaWQgMCE9PW4pe3ZhciBsPXQ7dHJ5e24oKX1jYXRjaChlKXtyaShsLGUpfX1lPWUubmV4dH13aGlsZShlIT09cil9KSl9YnJlYWs7Y2FzZSAxOlFyKHQpLFwiZnVuY3Rpb25cIj09dHlwZW9mKG49dC5zdGF0ZU5vZGUpLmNvbXBvbmVudFdpbGxVbm1vdW50JiZmdW5jdGlvbihlLHQpe3RyeXt0LnByb3BzPWUubWVtb2l6ZWRQcm9wcyx0LnN0YXRlPWUubWVtb2l6ZWRTdGF0ZSx0LmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2godCl7cmkoZSx0KX19KHQsbik7YnJlYWs7Y2FzZSA1OlFyKHQpO2JyZWFrO2Nhc2UgNDpHP1ZyKGUsdCxuKTpZJiZmdW5jdGlvbihlKXtpZihZKXtlPWUuc3RhdGVOb2RlLmNvbnRhaW5lckluZm87dmFyIHQ9cGUoZSk7Z2UoZSx0KX19KHQpfX1mdW5jdGlvbiBqcihlLHQsbil7Zm9yKHZhciByPXQ7OylpZihIcihlLHIsbiksbnVsbD09PXIuY2hpbGR8fEcmJjQ9PT1yLnRhZyl7aWYocj09PXQpYnJlYWs7Zm9yKDtudWxsPT09ci5zaWJsaW5nOyl7aWYobnVsbD09PXIucmV0dXJufHxyLnJldHVybj09PXQpcmV0dXJuO3I9ci5yZXR1cm59ci5zaWJsaW5nLnJldHVybj1yLnJldHVybixyPXIuc2libGluZ31lbHNlIHIuY2hpbGQucmV0dXJuPXIscj1yLmNoaWxkfWZ1bmN0aW9uIEFyKGUpe3ZhciB0PWUuYWx0ZXJuYXRlO2UucmV0dXJuPW51bGwsZS5jaGlsZD1udWxsLGUubWVtb2l6ZWRTdGF0ZT1udWxsLGUudXBkYXRlUXVldWU9bnVsbCxlLmRlcGVuZGVuY2llcz1udWxsLGUuYWx0ZXJuYXRlPW51bGwsZS5maXJzdEVmZmVjdD1udWxsLGUubGFzdEVmZmVjdD1udWxsLGUucGVuZGluZ1Byb3BzPW51bGwsZS5tZW1vaXplZFByb3BzPW51bGwsZS5zdGF0ZU5vZGU9bnVsbCxudWxsIT09dCYmQXIodCl9ZnVuY3Rpb24gQnIoZSl7cmV0dXJuIDU9PT1lLnRhZ3x8Mz09PWUudGFnfHw0PT09ZS50YWd9ZnVuY3Rpb24gT3IoZSl7aWYoRyl7ZTp7Zm9yKHZhciB0PWUucmV0dXJuO251bGwhPT10Oyl7aWYoQnIodCkpe3ZhciBuPXQ7YnJlYWsgZX10PXQucmV0dXJufXRocm93IEVycm9yKGMoMTYwKSl9c3dpdGNoKHQ9bi5zdGF0ZU5vZGUsbi50YWcpe2Nhc2UgNTp2YXIgcj0hMTticmVhaztjYXNlIDM6Y2FzZSA0OnQ9dC5jb250YWluZXJJbmZvLHI9ITA7YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihjKDE2MSkpfTE2Jm4uZWZmZWN0VGFnJiYoYWUodCksbi5lZmZlY3RUYWcmPS0xNyk7ZTp0OmZvcihuPWU7Oyl7Zm9yKDtudWxsPT09bi5zaWJsaW5nOyl7aWYobnVsbD09PW4ucmV0dXJufHxCcihuLnJldHVybikpe249bnVsbDticmVhayBlfW49bi5yZXR1cm59Zm9yKG4uc2libGluZy5yZXR1cm49bi5yZXR1cm4sbj1uLnNpYmxpbmc7NSE9PW4udGFnJiY2IT09bi50YWcmJjE4IT09bi50YWc7KXtpZigyJm4uZWZmZWN0VGFnKWNvbnRpbnVlIHQ7aWYobnVsbD09PW4uY2hpbGR8fDQ9PT1uLnRhZyljb250aW51ZSB0O24uY2hpbGQucmV0dXJuPW4sbj1uLmNoaWxkfWlmKCEoMiZuLmVmZmVjdFRhZykpe249bi5zdGF0ZU5vZGU7YnJlYWsgZX19cj9McihlLG4sdCk6cXIoZSxuLHQpfX1mdW5jdGlvbiBMcihlLHQsbil7dmFyIHI9ZS50YWcsbD01PT09cnx8Nj09PXI7aWYobCllPWw/ZS5zdGF0ZU5vZGU6ZS5zdGF0ZU5vZGUuaW5zdGFuY2UsdD9sZShuLGUsdCk6WihuLGUpO2Vsc2UgaWYoNCE9PXImJm51bGwhPT0oZT1lLmNoaWxkKSlmb3IoTHIoZSx0LG4pLGU9ZS5zaWJsaW5nO251bGwhPT1lOylMcihlLHQsbiksZT1lLnNpYmxpbmd9ZnVuY3Rpb24gcXIoZSx0LG4pe3ZhciByPWUudGFnLGw9NT09PXJ8fDY9PT1yO2lmKGwpZT1sP2Uuc3RhdGVOb2RlOmUuc3RhdGVOb2RlLmluc3RhbmNlLHQ/cmUobixlLHQpOlgobixlKTtlbHNlIGlmKDQhPT1yJiZudWxsIT09KGU9ZS5jaGlsZCkpZm9yKHFyKGUsdCxuKSxlPWUuc2libGluZztudWxsIT09ZTspcXIoZSx0LG4pLGU9ZS5zaWJsaW5nfWZ1bmN0aW9uIFZyKGUsdCxuKXtmb3IodmFyIHIsbCxpPXQsdT0hMTs7KXtpZighdSl7dT1pLnJldHVybjtlOmZvcig7Oyl7aWYobnVsbD09PXUpdGhyb3cgRXJyb3IoYygxNjApKTtzd2l0Y2gocj11LnN0YXRlTm9kZSx1LnRhZyl7Y2FzZSA1Omw9ITE7YnJlYWsgZTtjYXNlIDM6Y2FzZSA0OnI9ci5jb250YWluZXJJbmZvLGw9ITA7YnJlYWsgZX11PXUucmV0dXJufXU9ITB9aWYoNT09PWkudGFnfHw2PT09aS50YWcpanIoZSxpLG4pLGw/dWUocixpLnN0YXRlTm9kZSk6aWUocixpLnN0YXRlTm9kZSk7ZWxzZSBpZig0PT09aS50YWcpe2lmKG51bGwhPT1pLmNoaWxkKXtyPWkuc3RhdGVOb2RlLmNvbnRhaW5lckluZm8sbD0hMCxpLmNoaWxkLnJldHVybj1pLGk9aS5jaGlsZDtjb250aW51ZX19ZWxzZSBpZihIcihlLGksbiksbnVsbCE9PWkuY2hpbGQpe2kuY2hpbGQucmV0dXJuPWksaT1pLmNoaWxkO2NvbnRpbnVlfWlmKGk9PT10KWJyZWFrO2Zvcig7bnVsbD09PWkuc2libGluZzspe2lmKG51bGw9PT1pLnJldHVybnx8aS5yZXR1cm49PT10KXJldHVybjs0PT09KGk9aS5yZXR1cm4pLnRhZyYmKHU9ITEpfWkuc2libGluZy5yZXR1cm49aS5yZXR1cm4saT1pLnNpYmxpbmd9fWZ1bmN0aW9uICRyKGUsdCl7aWYoRyl7c3dpdGNoKHQudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE0OmNhc2UgMTU6Y2FzZSAyMjpyZXR1cm4gdm9pZCBEcigzLHQpO2Nhc2UgMTpyZXR1cm47Y2FzZSA1OnZhciBuPXQuc3RhdGVOb2RlO2lmKG51bGwhPW4pe3ZhciByPXQubWVtb2l6ZWRQcm9wcztlPW51bGwhPT1lP2UubWVtb2l6ZWRQcm9wczpyO3ZhciBsPXQudHlwZSxpPXQudXBkYXRlUXVldWU7dC51cGRhdGVRdWV1ZT1udWxsLG51bGwhPT1pJiZuZShuLGksbCxlLHIsdCl9cmV0dXJuO2Nhc2UgNjppZihudWxsPT09dC5zdGF0ZU5vZGUpdGhyb3cgRXJyb3IoYygxNjIpKTtyZXR1cm4gbj10Lm1lbW9pemVkUHJvcHMsdm9pZCBlZSh0LnN0YXRlTm9kZSxudWxsIT09ZT9lLm1lbW9pemVkUHJvcHM6bixuKTtjYXNlIDM6cmV0dXJuIHZvaWQoSiYmKHQ9dC5zdGF0ZU5vZGUsdC5oeWRyYXRlJiYodC5oeWRyYXRlPSExLFBlKHQuY29udGFpbmVySW5mbykpKSk7Y2FzZSAxMjpyZXR1cm47Y2FzZSAxMzpyZXR1cm4gS3IodCksdm9pZCBHcih0KTtjYXNlIDE5OnJldHVybiB2b2lkIEdyKHQpO2Nhc2UgMTc6cmV0dXJufXRocm93IEVycm9yKGMoMTYzKSl9c3dpdGNoKHQudGFnKXtjYXNlIDA6Y2FzZSAxMTpjYXNlIDE0OmNhc2UgMTU6Y2FzZSAyMjpyZXR1cm4gdm9pZCBEcigzLHQpO2Nhc2UgMTI6cmV0dXJuO2Nhc2UgMTM6cmV0dXJuIEtyKHQpLHZvaWQgR3IodCk7Y2FzZSAxOTpyZXR1cm4gdm9pZCBHcih0KTtjYXNlIDM6SiYmKG49dC5zdGF0ZU5vZGUpLmh5ZHJhdGUmJihuLmh5ZHJhdGU9ITEsUGUobi5jb250YWluZXJJbmZvKSl9ZTppZihZKXtzd2l0Y2godC50YWcpe2Nhc2UgMTpjYXNlIDU6Y2FzZSA2OmNhc2UgMjA6YnJlYWsgZTtjYXNlIDM6Y2FzZSA0OnQ9dC5zdGF0ZU5vZGUsZ2UodC5jb250YWluZXJJbmZvLHQucGVuZGluZ0NoaWxkcmVuKTticmVhayBlfXRocm93IEVycm9yKGMoMTYzKSl9fWZ1bmN0aW9uIEtyKGUpe3ZhciB0PWU7aWYobnVsbD09PWUubWVtb2l6ZWRTdGF0ZSl2YXIgbj0hMTtlbHNlIG49ITAsdD1lLmNoaWxkLHlsPXN0KCk7aWYoRyYmbnVsbCE9PXQpZTppZihlPXQsRylmb3IodD1lOzspe2lmKDU9PT10LnRhZyl7dmFyIHI9dC5zdGF0ZU5vZGU7bj9vZShyKTpmZSh0LnN0YXRlTm9kZSx0Lm1lbW9pemVkUHJvcHMpfWVsc2UgaWYoNj09PXQudGFnKXI9dC5zdGF0ZU5vZGUsbj9jZShyKTpzZShyLHQubWVtb2l6ZWRQcm9wcyk7ZWxzZXtpZigxMz09PXQudGFnJiZudWxsIT09dC5tZW1vaXplZFN0YXRlJiZudWxsPT09dC5tZW1vaXplZFN0YXRlLmRlaHlkcmF0ZWQpeyhyPXQuY2hpbGQuc2libGluZykucmV0dXJuPXQsdD1yO2NvbnRpbnVlfWlmKG51bGwhPT10LmNoaWxkKXt0LmNoaWxkLnJldHVybj10LHQ9dC5jaGlsZDtjb250aW51ZX19aWYodD09PWUpYnJlYWsgZTtmb3IoO251bGw9PT10LnNpYmxpbmc7KXtpZihudWxsPT09dC5yZXR1cm58fHQucmV0dXJuPT09ZSlicmVhayBlO3Q9dC5yZXR1cm59dC5zaWJsaW5nLnJldHVybj10LnJldHVybix0PXQuc2libGluZ319ZnVuY3Rpb24gR3IoZSl7dmFyIHQ9ZS51cGRhdGVRdWV1ZTtpZihudWxsIT09dCl7ZS51cGRhdGVRdWV1ZT1udWxsO3ZhciBuPWUuc3RhdGVOb2RlO251bGw9PT1uJiYobj1lLnN0YXRlTm9kZT1uZXcgUnIpLHQuZm9yRWFjaCgoZnVuY3Rpb24odCl7dmFyIHI9aWkuYmluZChudWxsLGUsdCk7bi5oYXModCl8fChuLmFkZCh0KSx0LnRoZW4ocixyKSl9KSl9fXZhciBZcj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBXZWFrTWFwP1dlYWtNYXA6TWFwO2Z1bmN0aW9uIEpyKGUsdCxuKXsobj1GdChuLG51bGwpKS50YWc9MyxuLnBheWxvYWQ9e2VsZW1lbnQ6bnVsbH07dmFyIHI9dC52YWx1ZTtyZXR1cm4gbi5jYWxsYmFjaz1mdW5jdGlvbigpe3hsfHwoeGw9ITAsRWw9ciksTXIoZSx0KX0sbn1mdW5jdGlvbiBYcihlLHQsbil7KG49RnQobixudWxsKSkudGFnPTM7dmFyIHI9ZS50eXBlLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcjtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiByKXt2YXIgbD10LnZhbHVlO24ucGF5bG9hZD1mdW5jdGlvbigpe3JldHVybiBNcihlLHQpLHIobCl9fXZhciBpPWUuc3RhdGVOb2RlO3JldHVybiBudWxsIT09aSYmXCJmdW5jdGlvblwiPT10eXBlb2YgaS5jb21wb25lbnREaWRDYXRjaCYmKG4uY2FsbGJhY2s9ZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCIhPXR5cGVvZiByJiYobnVsbD09PVNsP1NsPW5ldyBTZXQoW3RoaXNdKTpTbC5hZGQodGhpcyksTXIoZSx0KSk7dmFyIG49dC5zdGFjazt0aGlzLmNvbXBvbmVudERpZENhdGNoKHQudmFsdWUse2NvbXBvbmVudFN0YWNrOm51bGwhPT1uP246XCJcIn0pfSksbn12YXIgWnIsZWw9TWF0aC5jZWlsLHRsPWYuUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixubD1mLlJlYWN0Q3VycmVudE93bmVyLHJsPTE2LGxsPTMyLGlsPTAsdWw9MyxhbD00LG9sPTAsY2w9bnVsbCxmbD1udWxsLHNsPTAsZGw9aWwscGw9bnVsbCxtbD0xMDczNzQxODIzLGhsPTEwNzM3NDE4MjMsZ2w9bnVsbCxibD0wLHZsPSExLHlsPTAsVGw9bnVsbCx4bD0hMSxFbD1udWxsLFNsPW51bGwsa2w9ITEsd2w9bnVsbCx6bD05MCxDbD1udWxsLFBsPTAsTmw9bnVsbCxfbD0wO2Z1bmN0aW9uIElsKCl7cmV0dXJuIDAhPSg0OCZvbCk/MTA3Mzc0MTgyMS0oc3QoKS8xMHwwKTowIT09X2w/X2w6X2w9MTA3Mzc0MTgyMS0oc3QoKS8xMHwwKX1mdW5jdGlvbiBSbChlLHQsbil7aWYoMD09KDImKHQ9dC5tb2RlKSkpcmV0dXJuIDEwNzM3NDE4MjM7dmFyIHI9ZHQoKTtpZigwPT0oNCZ0KSlyZXR1cm4gOTk9PT1yPzEwNzM3NDE4MjM6MTA3Mzc0MTgyMjtpZigwIT0ob2wmcmwpKXJldHVybiBzbDtpZihudWxsIT09billPXl0KGUsMHxuLnRpbWVvdXRNc3x8NWUzLDI1MCk7ZWxzZSBzd2l0Y2gocil7Y2FzZSA5OTplPTEwNzM3NDE4MjM7YnJlYWs7Y2FzZSA5ODplPXl0KGUsMTUwLDEwMCk7YnJlYWs7Y2FzZSA5NzpjYXNlIDk2OmU9eXQoZSw1ZTMsMjUwKTticmVhaztjYXNlIDk1OmU9MjticmVhaztkZWZhdWx0OnRocm93IEVycm9yKGMoMzI2KSl9cmV0dXJuIG51bGwhPT1jbCYmZT09PXNsJiYtLWUsZX1mdW5jdGlvbiBNbChlLHQpe2lmKDUwPFBsKXRocm93IFBsPTAsTmw9bnVsbCxFcnJvcihjKDE4NSkpO2lmKG51bGwhPT0oZT1RbChlLHQpKSl7dmFyIG49ZHQoKTsxMDczNzQxODIzPT09dD8wIT0oOCZvbCkmJjA9PSg0OCZvbCk/V2woZSk6KERsKGUpLDA9PT1vbCYmYnQoKSk6RGwoZSksMD09KDQmb2wpfHw5OCE9PW4mJjk5IT09bnx8KG51bGw9PT1DbD9DbD1uZXcgTWFwKFtbZSx0XV0pOih2b2lkIDA9PT0obj1DbC5nZXQoZSkpfHxuPnQpJiZDbC5zZXQoZSx0KSl9fWZ1bmN0aW9uIFFsKGUsdCl7ZS5leHBpcmF0aW9uVGltZTx0JiYoZS5leHBpcmF0aW9uVGltZT10KTt2YXIgbj1lLmFsdGVybmF0ZTtudWxsIT09biYmbi5leHBpcmF0aW9uVGltZTx0JiYobi5leHBpcmF0aW9uVGltZT10KTt2YXIgcj1lLnJldHVybixsPW51bGw7aWYobnVsbD09PXImJjM9PT1lLnRhZylsPWUuc3RhdGVOb2RlO2Vsc2UgZm9yKDtudWxsIT09cjspe2lmKG49ci5hbHRlcm5hdGUsci5jaGlsZEV4cGlyYXRpb25UaW1lPHQmJihyLmNoaWxkRXhwaXJhdGlvblRpbWU9dCksbnVsbCE9PW4mJm4uY2hpbGRFeHBpcmF0aW9uVGltZTx0JiYobi5jaGlsZEV4cGlyYXRpb25UaW1lPXQpLG51bGw9PT1yLnJldHVybiYmMz09PXIudGFnKXtsPXIuc3RhdGVOb2RlO2JyZWFrfXI9ci5yZXR1cm59cmV0dXJuIG51bGwhPT1sJiYoY2w9PT1sJiYocWwodCksZGw9PT1hbCYmeWkobCxzbCkpLFRpKGwsdCkpLGx9ZnVuY3Rpb24gVWwoZSl7dmFyIHQ9ZS5sYXN0RXhwaXJlZFRpbWU7aWYoMCE9PXQpcmV0dXJuIHQ7aWYoIXZpKGUsdD1lLmZpcnN0UGVuZGluZ1RpbWUpKXJldHVybiB0O3ZhciBuPWUubGFzdFBpbmdlZFRpbWU7cmV0dXJuIDI+PShlPW4+KGU9ZS5uZXh0S25vd25QZW5kaW5nTGV2ZWwpP246ZSkmJnQhPT1lPzA6ZX1mdW5jdGlvbiBEbChlKXtpZigwIT09ZS5sYXN0RXhwaXJlZFRpbWUpZS5jYWxsYmFja0V4cGlyYXRpb25UaW1lPTEwNzM3NDE4MjMsZS5jYWxsYmFja1ByaW9yaXR5PTk5LGUuY2FsbGJhY2tOb2RlPWd0KFdsLmJpbmQobnVsbCxlKSk7ZWxzZXt2YXIgdD1VbChlKSxuPWUuY2FsbGJhY2tOb2RlO2lmKDA9PT10KW51bGwhPT1uJiYoZS5jYWxsYmFja05vZGU9bnVsbCxlLmNhbGxiYWNrRXhwaXJhdGlvblRpbWU9MCxlLmNhbGxiYWNrUHJpb3JpdHk9OTApO2Vsc2V7dmFyIHI9SWwoKTtpZihyPTEwNzM3NDE4MjM9PT10Pzk5OjE9PT10fHwyPT09dD85NTowPj0ocj0xMCooMTA3Mzc0MTgyMS10KS0xMCooMTA3Mzc0MTgyMS1yKSk/OTk6MjUwPj1yPzk4OjUyNTA+PXI/OTc6OTUsbnVsbCE9PW4pe3ZhciBsPWUuY2FsbGJhY2tQcmlvcml0eTtpZihlLmNhbGxiYWNrRXhwaXJhdGlvblRpbWU9PT10JiZsPj1yKXJldHVybjtuIT09bHQmJkdlKG4pfWUuY2FsbGJhY2tFeHBpcmF0aW9uVGltZT10LGUuY2FsbGJhY2tQcmlvcml0eT1yLHQ9MTA3Mzc0MTgyMz09PXQ/Z3QoV2wuYmluZChudWxsLGUpKTpodChyLEZsLmJpbmQobnVsbCxlKSx7dGltZW91dDoxMCooMTA3Mzc0MTgyMS10KS1zdCgpfSksZS5jYWxsYmFja05vZGU9dH19fWZ1bmN0aW9uIEZsKGUsdCl7aWYoX2w9MCx0KXJldHVybiB4aShlLHQ9SWwoKSksRGwoZSksbnVsbDt2YXIgbj1VbChlKTtpZigwIT09bil7aWYodD1lLmNhbGxiYWNrTm9kZSwwIT0oNDgmb2wpKXRocm93IEVycm9yKGMoMzI3KSk7aWYoZWkoKSxlPT09Y2wmJm49PT1zbHx8QWwoZSxuKSxudWxsIT09Zmwpe3ZhciByPW9sO29sfD1ybDtmb3IodmFyIGw9T2woKTs7KXRyeXskbCgpO2JyZWFrfWNhdGNoKHQpe0JsKGUsdCl9aWYoUHQoKSxvbD1yLHRsLmN1cnJlbnQ9bCwxPT09ZGwpdGhyb3cgdD1wbCxBbChlLG4pLHlpKGUsbiksRGwoZSksdDtpZihudWxsPT09Zmwpc3dpdGNoKGw9ZS5maW5pc2hlZFdvcms9ZS5jdXJyZW50LmFsdGVybmF0ZSxlLmZpbmlzaGVkRXhwaXJhdGlvblRpbWU9bixyPWRsLGNsPW51bGwscil7Y2FzZSBpbDpjYXNlIDE6dGhyb3cgRXJyb3IoYygzNDUpKTtjYXNlIDI6eGkoZSwyPG4/MjpuKTticmVhaztjYXNlIHVsOmlmKHlpKGUsbiksbj09PShyPWUubGFzdFN1c3BlbmRlZFRpbWUpJiYoZS5uZXh0S25vd25QZW5kaW5nTGV2ZWw9WWwobCkpLDEwNzM3NDE4MjM9PT1tbCYmMTA8KGw9eWwrNTAwLXN0KCkpKXtpZih2bCl7dmFyIGk9ZS5sYXN0UGluZ2VkVGltZTtpZigwPT09aXx8aT49bil7ZS5sYXN0UGluZ2VkVGltZT1uLEFsKGUsbik7YnJlYWt9fWlmKDAhPT0oaT1VbChlKSkmJmkhPT1uKWJyZWFrO2lmKDAhPT1yJiZyIT09bil7ZS5sYXN0UGluZ2VkVGltZT1yO2JyZWFrfWUudGltZW91dEhhbmRsZT1xKEpsLmJpbmQobnVsbCxlKSxsKTticmVha31KbChlKTticmVhaztjYXNlIGFsOmlmKHlpKGUsbiksbj09PShyPWUubGFzdFN1c3BlbmRlZFRpbWUpJiYoZS5uZXh0S25vd25QZW5kaW5nTGV2ZWw9WWwobCkpLHZsJiYoMD09PShsPWUubGFzdFBpbmdlZFRpbWUpfHxsPj1uKSl7ZS5sYXN0UGluZ2VkVGltZT1uLEFsKGUsbik7YnJlYWt9aWYoMCE9PShsPVVsKGUpKSYmbCE9PW4pYnJlYWs7aWYoMCE9PXImJnIhPT1uKXtlLmxhc3RQaW5nZWRUaW1lPXI7YnJlYWt9aWYoMTA3Mzc0MTgyMyE9PWhsP3I9MTAqKDEwNzM3NDE4MjEtaGwpLXN0KCk6MTA3Mzc0MTgyMz09PW1sP3I9MDoocj0xMCooMTA3Mzc0MTgyMS1tbCktNWUzLDA+KHI9KGw9c3QoKSktcikmJihyPTApLChuPTEwKigxMDczNzQxODIxLW4pLWwpPChyPSgxMjA+cj8xMjA6NDgwPnI/NDgwOjEwODA+cj8xMDgwOjE5MjA+cj8xOTIwOjNlMz5yPzNlMzo0MzIwPnI/NDMyMDoxOTYwKmVsKHIvMTk2MCkpLXIpJiYocj1uKSksMTA8cil7ZS50aW1lb3V0SGFuZGxlPXEoSmwuYmluZChudWxsLGUpLHIpO2JyZWFrfUpsKGUpO2JyZWFrO2Nhc2UgNTppZigxMDczNzQxODIzIT09bWwmJm51bGwhPT1nbCl7aT1tbDt2YXIgdT1nbDtpZigwPj0ocj0wfHUuYnVzeU1pbkR1cmF0aW9uTXMpP3I9MDoobD0wfHUuYnVzeURlbGF5TXMscj0oaT1zdCgpLSgxMCooMTA3Mzc0MTgyMS1pKS0oMHx1LnRpbWVvdXRNc3x8NWUzKSkpPD1sPzA6bCtyLWkpLDEwPHIpe3lpKGUsbiksZS50aW1lb3V0SGFuZGxlPXEoSmwuYmluZChudWxsLGUpLHIpO2JyZWFrfX1KbChlKTticmVhaztkZWZhdWx0OnRocm93IEVycm9yKGMoMzI5KSl9aWYoRGwoZSksZS5jYWxsYmFja05vZGU9PT10KXJldHVybiBGbC5iaW5kKG51bGwsZSl9fXJldHVybiBudWxsfWZ1bmN0aW9uIFdsKGUpe3ZhciB0PWUubGFzdEV4cGlyZWRUaW1lO2lmKHQ9MCE9PXQ/dDoxMDczNzQxODIzLDAhPSg0OCZvbCkpdGhyb3cgRXJyb3IoYygzMjcpKTtpZihlaSgpLGU9PT1jbCYmdD09PXNsfHxBbChlLHQpLG51bGwhPT1mbCl7dmFyIG49b2w7b2x8PXJsO2Zvcih2YXIgcj1PbCgpOzspdHJ5e1ZsKCk7YnJlYWt9Y2F0Y2godCl7QmwoZSx0KX1pZihQdCgpLG9sPW4sdGwuY3VycmVudD1yLDE9PT1kbCl0aHJvdyBuPXBsLEFsKGUsdCkseWkoZSx0KSxEbChlKSxuO2lmKG51bGwhPT1mbCl0aHJvdyBFcnJvcihjKDI2MSkpO2UuZmluaXNoZWRXb3JrPWUuY3VycmVudC5hbHRlcm5hdGUsZS5maW5pc2hlZEV4cGlyYXRpb25UaW1lPXQsY2w9bnVsbCxKbChlKSxEbChlKX1yZXR1cm4gbnVsbH1mdW5jdGlvbiBIbChlLHQpe3ZhciBuPW9sO29sfD0xO3RyeXtyZXR1cm4gZSh0KX1maW5hbGx5ezA9PT0ob2w9bikmJmJ0KCl9fWZ1bmN0aW9uIGpsKGUsdCl7aWYoMCE9KDQ4Jm9sKSl0aHJvdyBFcnJvcihjKDE4NykpO3ZhciBuPW9sO29sfD0xO3RyeXtyZXR1cm4gbXQoOTksZS5iaW5kKG51bGwsdCkpfWZpbmFsbHl7b2w9bixidCgpfX1mdW5jdGlvbiBBbChlLHQpe2UuZmluaXNoZWRXb3JrPW51bGwsZS5maW5pc2hlZEV4cGlyYXRpb25UaW1lPTA7dmFyIG49ZS50aW1lb3V0SGFuZGxlO2lmKG4hPT0kJiYoZS50aW1lb3V0SGFuZGxlPSQsVihuKSksbnVsbCE9PWZsKWZvcihuPWZsLnJldHVybjtudWxsIT09bjspe3ZhciByPW47c3dpdGNoKHIudGFnKXtjYXNlIDE6bnVsbCE9KHI9ci50eXBlLmNoaWxkQ29udGV4dFR5cGVzKSYmQmUoKTticmVhaztjYXNlIDM6Y24oKSxRZShXZSksUWUoRmUpO2JyZWFrO2Nhc2UgNTpzbihyKTticmVhaztjYXNlIDQ6Y24oKTticmVhaztjYXNlIDEzOmNhc2UgMTk6UWUoZG4pO2JyZWFrO2Nhc2UgMTA6X3Qocil9bj1uLnJldHVybn1jbD1lLGZsPWRpKGUuY3VycmVudCxudWxsKSxzbD10LGRsPWlsLHBsPW51bGwsaGw9bWw9MTA3Mzc0MTgyMyxnbD1udWxsLGJsPTAsdmw9ITF9ZnVuY3Rpb24gQmwoZSx0KXtmb3IoOzspe3RyeXtpZihQdCgpLGhuLmN1cnJlbnQ9Vm4seG4pZm9yKHZhciBuPXZuLm1lbW9pemVkU3RhdGU7bnVsbCE9PW47KXt2YXIgcj1uLnF1ZXVlO251bGwhPT1yJiYoci5wZW5kaW5nPW51bGwpLG49bi5uZXh0fWlmKGJuPTAsVG49eW49dm49bnVsbCx4bj0hMSxudWxsPT09Zmx8fG51bGw9PT1mbC5yZXR1cm4pcmV0dXJuIGRsPTEscGw9dCxmbD1udWxsO2U6e3ZhciBsPWUsaT1mbC5yZXR1cm4sdT1mbCxhPXQ7aWYodD1zbCx1LmVmZmVjdFRhZ3w9MjA0OCx1LmZpcnN0RWZmZWN0PXUubGFzdEVmZmVjdD1udWxsLG51bGwhPT1hJiZcIm9iamVjdFwiPT10eXBlb2YgYSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS50aGVuKXt2YXIgbz1hO2lmKDA9PSgyJnUubW9kZSkpe3ZhciBjPXUuYWx0ZXJuYXRlO2M/KHUudXBkYXRlUXVldWU9Yy51cGRhdGVRdWV1ZSx1Lm1lbW9pemVkU3RhdGU9Yy5tZW1vaXplZFN0YXRlLHUuZXhwaXJhdGlvblRpbWU9Yy5leHBpcmF0aW9uVGltZSk6KHUudXBkYXRlUXVldWU9bnVsbCx1Lm1lbW9pemVkU3RhdGU9bnVsbCl9dmFyIGY9MCE9KDEmZG4uY3VycmVudCkscz1pO2Rve3ZhciBkO2lmKGQ9MTM9PT1zLnRhZyl7dmFyIHA9cy5tZW1vaXplZFN0YXRlO2lmKG51bGwhPT1wKWQ9bnVsbCE9PXAuZGVoeWRyYXRlZDtlbHNle3ZhciBtPXMubWVtb2l6ZWRQcm9wcztkPXZvaWQgMCE9PW0uZmFsbGJhY2smJighMCE9PW0udW5zdGFibGVfYXZvaWRUaGlzRmFsbGJhY2t8fCFmKX19aWYoZCl7dmFyIGg9cy51cGRhdGVRdWV1ZTtpZihudWxsPT09aCl7dmFyIGc9bmV3IFNldDtnLmFkZChvKSxzLnVwZGF0ZVF1ZXVlPWd9ZWxzZSBoLmFkZChvKTtpZigwPT0oMiZzLm1vZGUpKXtpZihzLmVmZmVjdFRhZ3w9NjQsdS5lZmZlY3RUYWcmPS0yOTgxLDE9PT11LnRhZylpZihudWxsPT09dS5hbHRlcm5hdGUpdS50YWc9MTc7ZWxzZXt2YXIgYj1GdCgxMDczNzQxODIzLG51bGwpO2IudGFnPTIsV3QodSxiKX11LmV4cGlyYXRpb25UaW1lPTEwNzM3NDE4MjM7YnJlYWsgZX1hPXZvaWQgMCx1PXQ7dmFyIHY9bC5waW5nQ2FjaGU7aWYobnVsbD09PXY/KHY9bC5waW5nQ2FjaGU9bmV3IFlyLGE9bmV3IFNldCx2LnNldChvLGEpKTp2b2lkIDA9PT0oYT12LmdldChvKSkmJihhPW5ldyBTZXQsdi5zZXQobyxhKSksIWEuaGFzKHUpKXthLmFkZCh1KTt2YXIgeT1saS5iaW5kKG51bGwsbCxvLHUpO28udGhlbih5LHkpfXMuZWZmZWN0VGFnfD00MDk2LHMuZXhwaXJhdGlvblRpbWU9dDticmVhayBlfXM9cy5yZXR1cm59d2hpbGUobnVsbCE9PXMpO2E9RXJyb3IoKFAodS50eXBlKXx8XCJBIFJlYWN0IGNvbXBvbmVudFwiKStcIiBzdXNwZW5kZWQgd2hpbGUgcmVuZGVyaW5nLCBidXQgbm8gZmFsbGJhY2sgVUkgd2FzIHNwZWNpZmllZC5cXG5cXG5BZGQgYSA8U3VzcGVuc2UgZmFsbGJhY2s9Li4uPiBjb21wb25lbnQgaGlnaGVyIGluIHRoZSB0cmVlIHRvIHByb3ZpZGUgYSBsb2FkaW5nIGluZGljYXRvciBvciBwbGFjZWhvbGRlciB0byBkaXNwbGF5LlwiK0llKHUpKX01IT09ZGwmJihkbD0yKSxhPUlyKGEsdSkscz1pO2Rve3N3aXRjaChzLnRhZyl7Y2FzZSAzOm89YSxzLmVmZmVjdFRhZ3w9NDA5NixzLmV4cGlyYXRpb25UaW1lPXQsSHQocyxKcihzLG8sdCkpO2JyZWFrIGU7Y2FzZSAxOm89YTt2YXIgVD1zLnR5cGUseD1zLnN0YXRlTm9kZTtpZigwPT0oNjQmcy5lZmZlY3RUYWcpJiYoXCJmdW5jdGlvblwiPT10eXBlb2YgVC5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3J8fG51bGwhPT14JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB4LmNvbXBvbmVudERpZENhdGNoJiYobnVsbD09PVNsfHwhU2wuaGFzKHgpKSkpe3MuZWZmZWN0VGFnfD00MDk2LHMuZXhwaXJhdGlvblRpbWU9dCxIdChzLFhyKHMsbyx0KSk7YnJlYWsgZX19cz1zLnJldHVybn13aGlsZShudWxsIT09cyl9Zmw9R2woZmwpfWNhdGNoKGUpe3Q9ZTtjb250aW51ZX1icmVha319ZnVuY3Rpb24gT2woKXt2YXIgZT10bC5jdXJyZW50O3JldHVybiB0bC5jdXJyZW50PVZuLG51bGw9PT1lP1ZuOmV9ZnVuY3Rpb24gTGwoZSx0KXtlPG1sJiYyPGUmJihtbD1lKSxudWxsIT09dCYmZTxobCYmMjxlJiYoaGw9ZSxnbD10KX1mdW5jdGlvbiBxbChlKXtlPmJsJiYoYmw9ZSl9ZnVuY3Rpb24gVmwoKXtmb3IoO251bGwhPT1mbDspZmw9S2woZmwpfWZ1bmN0aW9uICRsKCl7Zm9yKDtudWxsIT09ZmwmJiFpdCgpOylmbD1LbChmbCl9ZnVuY3Rpb24gS2woZSl7dmFyIHQ9WnIoZS5hbHRlcm5hdGUsZSxzbCk7cmV0dXJuIGUubWVtb2l6ZWRQcm9wcz1lLnBlbmRpbmdQcm9wcyxudWxsPT09dCYmKHQ9R2woZSkpLG5sLmN1cnJlbnQ9bnVsbCx0fWZ1bmN0aW9uIEdsKGUpe2ZsPWU7ZG97dmFyIHQ9ZmwuYWx0ZXJuYXRlO2lmKGU9ZmwucmV0dXJuLDA9PSgyMDQ4JmZsLmVmZmVjdFRhZykpe2lmKHQ9TnIodCxmbCxzbCksMT09PXNsfHwxIT09ZmwuY2hpbGRFeHBpcmF0aW9uVGltZSl7Zm9yKHZhciBuPTAscj1mbC5jaGlsZDtudWxsIT09cjspe3ZhciBsPXIuZXhwaXJhdGlvblRpbWUsaT1yLmNoaWxkRXhwaXJhdGlvblRpbWU7bD5uJiYobj1sKSxpPm4mJihuPWkpLHI9ci5zaWJsaW5nfWZsLmNoaWxkRXhwaXJhdGlvblRpbWU9bn1pZihudWxsIT09dClyZXR1cm4gdDtudWxsIT09ZSYmMD09KDIwNDgmZS5lZmZlY3RUYWcpJiYobnVsbD09PWUuZmlyc3RFZmZlY3QmJihlLmZpcnN0RWZmZWN0PWZsLmZpcnN0RWZmZWN0KSxudWxsIT09ZmwubGFzdEVmZmVjdCYmKG51bGwhPT1lLmxhc3RFZmZlY3QmJihlLmxhc3RFZmZlY3QubmV4dEVmZmVjdD1mbC5maXJzdEVmZmVjdCksZS5sYXN0RWZmZWN0PWZsLmxhc3RFZmZlY3QpLDE8ZmwuZWZmZWN0VGFnJiYobnVsbCE9PWUubGFzdEVmZmVjdD9lLmxhc3RFZmZlY3QubmV4dEVmZmVjdD1mbDplLmZpcnN0RWZmZWN0PWZsLGUubGFzdEVmZmVjdD1mbCkpfWVsc2V7aWYobnVsbCE9PSh0PV9yKGZsKSkpcmV0dXJuIHQuZWZmZWN0VGFnJj0yMDQ3LHQ7bnVsbCE9PWUmJihlLmZpcnN0RWZmZWN0PWUubGFzdEVmZmVjdD1udWxsLGUuZWZmZWN0VGFnfD0yMDQ4KX1pZihudWxsIT09KHQ9Zmwuc2libGluZykpcmV0dXJuIHQ7Zmw9ZX13aGlsZShudWxsIT09ZmwpO3JldHVybiBkbD09PWlsJiYoZGw9NSksbnVsbH1mdW5jdGlvbiBZbChlKXt2YXIgdD1lLmV4cGlyYXRpb25UaW1lO3JldHVybiB0PihlPWUuY2hpbGRFeHBpcmF0aW9uVGltZSk/dDplfWZ1bmN0aW9uIEpsKGUpe3ZhciB0PWR0KCk7cmV0dXJuIG10KDk5LFhsLmJpbmQobnVsbCxlLHQpKSxudWxsfWZ1bmN0aW9uIFhsKGUsdCl7ZG97ZWkoKX13aGlsZShudWxsIT09d2wpO2lmKDAhPSg0OCZvbCkpdGhyb3cgRXJyb3IoYygzMjcpKTt2YXIgbj1lLmZpbmlzaGVkV29yayxyPWUuZmluaXNoZWRFeHBpcmF0aW9uVGltZTtpZihudWxsPT09bilyZXR1cm4gbnVsbDtpZihlLmZpbmlzaGVkV29yaz1udWxsLGUuZmluaXNoZWRFeHBpcmF0aW9uVGltZT0wLG49PT1lLmN1cnJlbnQpdGhyb3cgRXJyb3IoYygxNzcpKTtlLmNhbGxiYWNrTm9kZT1udWxsLGUuY2FsbGJhY2tFeHBpcmF0aW9uVGltZT0wLGUuY2FsbGJhY2tQcmlvcml0eT05MCxlLm5leHRLbm93blBlbmRpbmdMZXZlbD0wO3ZhciBsPVlsKG4pO2lmKGUuZmlyc3RQZW5kaW5nVGltZT1sLHI8PWUubGFzdFN1c3BlbmRlZFRpbWU/ZS5maXJzdFN1c3BlbmRlZFRpbWU9ZS5sYXN0U3VzcGVuZGVkVGltZT1lLm5leHRLbm93blBlbmRpbmdMZXZlbD0wOnI8PWUuZmlyc3RTdXNwZW5kZWRUaW1lJiYoZS5maXJzdFN1c3BlbmRlZFRpbWU9ci0xKSxyPD1lLmxhc3RQaW5nZWRUaW1lJiYoZS5sYXN0UGluZ2VkVGltZT0wKSxyPD1lLmxhc3RFeHBpcmVkVGltZSYmKGUubGFzdEV4cGlyZWRUaW1lPTApLGU9PT1jbCYmKGZsPWNsPW51bGwsc2w9MCksMTxuLmVmZmVjdFRhZz9udWxsIT09bi5sYXN0RWZmZWN0PyhuLmxhc3RFZmZlY3QubmV4dEVmZmVjdD1uLGw9bi5maXJzdEVmZmVjdCk6bD1uOmw9bi5maXJzdEVmZmVjdCxudWxsIT09bCl7dmFyIGk9b2w7b2x8PWxsLG5sLmN1cnJlbnQ9bnVsbCxEKGUuY29udGFpbmVySW5mbyksVGw9bDtkb3t0cnl7WmwoKX1jYXRjaChlKXtpZihudWxsPT09VGwpdGhyb3cgRXJyb3IoYygzMzApKTtyaShUbCxlKSxUbD1UbC5uZXh0RWZmZWN0fX13aGlsZShudWxsIT09VGwpO1RsPWw7ZG97dHJ5e2Zvcih2YXIgdT1lLGE9dDtudWxsIT09VGw7KXt2YXIgbz1UbC5lZmZlY3RUYWc7aWYoMTYmbyYmRyYmYWUoVGwuc3RhdGVOb2RlKSwxMjgmbyl7dmFyIGY9VGwuYWx0ZXJuYXRlO2lmKG51bGwhPT1mKXt2YXIgcz1mLnJlZjtudWxsIT09cyYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHM/cyhudWxsKTpzLmN1cnJlbnQ9bnVsbCl9fXN3aXRjaCgxMDM4Jm8pe2Nhc2UgMjpPcihUbCksVGwuZWZmZWN0VGFnJj0tMzticmVhaztjYXNlIDY6T3IoVGwpLFRsLmVmZmVjdFRhZyY9LTMsJHIoVGwuYWx0ZXJuYXRlLFRsKTticmVhaztjYXNlIDEwMjQ6VGwuZWZmZWN0VGFnJj0tMTAyNTticmVhaztjYXNlIDEwMjg6VGwuZWZmZWN0VGFnJj0tMTAyNSwkcihUbC5hbHRlcm5hdGUsVGwpO2JyZWFrO2Nhc2UgNDokcihUbC5hbHRlcm5hdGUsVGwpO2JyZWFrO2Nhc2UgODp2YXIgZD11LHA9VGwsbT1hO0c/VnIoZCxwLG0pOmpyKGQscCxtKSxBcihwKX1UbD1UbC5uZXh0RWZmZWN0fX1jYXRjaChlKXtpZihudWxsPT09VGwpdGhyb3cgRXJyb3IoYygzMzApKTtyaShUbCxlKSxUbD1UbC5uZXh0RWZmZWN0fX13aGlsZShudWxsIT09VGwpO0YoZS5jb250YWluZXJJbmZvKSxlLmN1cnJlbnQ9bixUbD1sO2Rve3RyeXtmb3Iobz1lO251bGwhPT1UbDspe3ZhciBoPVRsLmVmZmVjdFRhZztpZigzNiZoJiZXcihvLFRsLmFsdGVybmF0ZSxUbCksMTI4Jmgpe2Y9dm9pZCAwO3ZhciBnPVRsLnJlZjtpZihudWxsIT09Zyl7dmFyIGI9VGwuc3RhdGVOb2RlO3N3aXRjaChUbC50YWcpe2Nhc2UgNTpmPU0oYik7YnJlYWs7ZGVmYXVsdDpmPWJ9XCJmdW5jdGlvblwiPT10eXBlb2YgZz9nKGYpOmcuY3VycmVudD1mfX1UbD1UbC5uZXh0RWZmZWN0fX1jYXRjaChlKXtpZihudWxsPT09VGwpdGhyb3cgRXJyb3IoYygzMzApKTtyaShUbCxlKSxUbD1UbC5uZXh0RWZmZWN0fX13aGlsZShudWxsIT09VGwpO1RsPW51bGwsdXQoKSxvbD1pfWVsc2UgZS5jdXJyZW50PW47aWYoa2wpa2w9ITEsd2w9ZSx6bD10O2Vsc2UgZm9yKFRsPWw7bnVsbCE9PVRsOyl0PVRsLm5leHRFZmZlY3QsVGwubmV4dEVmZmVjdD1udWxsLFRsPXQ7aWYoMD09PSh0PWUuZmlyc3RQZW5kaW5nVGltZSkmJihTbD1udWxsKSwxMDczNzQxODIzPT09dD9lPT09Tmw/UGwrKzooUGw9MCxObD1lKTpQbD0wLFwiZnVuY3Rpb25cIj09dHlwZW9mIGFpJiZhaShuLnN0YXRlTm9kZSxyKSxEbChlKSx4bCl0aHJvdyB4bD0hMSxlPUVsLEVsPW51bGwsZTtyZXR1cm4gMCE9KDgmb2wpfHxidCgpLG51bGx9ZnVuY3Rpb24gWmwoKXtmb3IoO251bGwhPT1UbDspe3ZhciBlPVRsLmVmZmVjdFRhZzswIT0oMjU2JmUpJiZVcihUbC5hbHRlcm5hdGUsVGwpLDA9PSg1MTImZSl8fGtsfHwoa2w9ITAsaHQoOTcsKGZ1bmN0aW9uKCl7cmV0dXJuIGVpKCksbnVsbH0pKSksVGw9VGwubmV4dEVmZmVjdH19ZnVuY3Rpb24gZWkoKXtpZig5MCE9PXpsKXt2YXIgZT05Nzx6bD85Nzp6bDtyZXR1cm4gemw9OTAsbXQoZSx0aSl9fWZ1bmN0aW9uIHRpKCl7aWYobnVsbD09PXdsKXJldHVybiExO3ZhciBlPXdsO2lmKHdsPW51bGwsMCE9KDQ4Jm9sKSl0aHJvdyBFcnJvcihjKDMzMSkpO3ZhciB0PW9sO2ZvcihvbHw9bGwsZT1lLmN1cnJlbnQuZmlyc3RFZmZlY3Q7bnVsbCE9PWU7KXt0cnl7dmFyIG49ZTtpZigwIT0oNTEyJm4uZWZmZWN0VGFnKSlzd2l0Y2gobi50YWcpe2Nhc2UgMDpjYXNlIDExOmNhc2UgMTU6Y2FzZSAyMjpEcig1LG4pLEZyKDUsbil9fWNhdGNoKHQpe2lmKG51bGw9PT1lKXRocm93IEVycm9yKGMoMzMwKSk7cmkoZSx0KX1uPWUubmV4dEVmZmVjdCxlLm5leHRFZmZlY3Q9bnVsbCxlPW59cmV0dXJuIG9sPXQsYnQoKSwhMH1mdW5jdGlvbiBuaShlLHQsbil7V3QoZSx0PUpyKGUsdD1JcihuLHQpLDEwNzM3NDE4MjMpKSxudWxsIT09KGU9UWwoZSwxMDczNzQxODIzKSkmJkRsKGUpfWZ1bmN0aW9uIHJpKGUsdCl7aWYoMz09PWUudGFnKW5pKGUsZSx0KTtlbHNlIGZvcih2YXIgbj1lLnJldHVybjtudWxsIT09bjspe2lmKDM9PT1uLnRhZyl7bmkobixlLHQpO2JyZWFrfWlmKDE9PT1uLnRhZyl7dmFyIHI9bi5zdGF0ZU5vZGU7aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcnx8XCJmdW5jdGlvblwiPT10eXBlb2Ygci5jb21wb25lbnREaWRDYXRjaCYmKG51bGw9PT1TbHx8IVNsLmhhcyhyKSkpe1d0KG4sZT1YcihuLGU9SXIodCxlKSwxMDczNzQxODIzKSksbnVsbCE9PShuPVFsKG4sMTA3Mzc0MTgyMykpJiZEbChuKTticmVha319bj1uLnJldHVybn19ZnVuY3Rpb24gbGkoZSx0LG4pe3ZhciByPWUucGluZ0NhY2hlO251bGwhPT1yJiZyLmRlbGV0ZSh0KSxjbD09PWUmJnNsPT09bj9kbD09PWFsfHxkbD09PXVsJiYxMDczNzQxODIzPT09bWwmJnN0KCkteWw8NTAwP0FsKGUsc2wpOnZsPSEwOnZpKGUsbikmJigwIT09KHQ9ZS5sYXN0UGluZ2VkVGltZSkmJnQ8bnx8KGUubGFzdFBpbmdlZFRpbWU9bixEbChlKSkpfWZ1bmN0aW9uIGlpKGUsdCl7dmFyIG49ZS5zdGF0ZU5vZGU7bnVsbCE9PW4mJm4uZGVsZXRlKHQpLDA9PSh0PTApJiYodD1SbCh0PUlsKCksZSxudWxsKSksbnVsbCE9PShlPVFsKGUsdCkpJiZEbChlKX1acj1mdW5jdGlvbihlLHQsbil7dmFyIHI9dC5leHBpcmF0aW9uVGltZTtpZihudWxsIT09ZSl7dmFyIGw9dC5wZW5kaW5nUHJvcHM7aWYoZS5tZW1vaXplZFByb3BzIT09bHx8V2UuY3VycmVudCl1cj0hMDtlbHNle2lmKHI8bil7c3dpdGNoKHVyPSExLHQudGFnKXtjYXNlIDM6aHIodCksbHIoKTticmVhaztjYXNlIDU6aWYoZm4odCksNCZ0Lm1vZGUmJjEhPT1uJiZPKHQudHlwZSxsKSlyZXR1cm4gdC5leHBpcmF0aW9uVGltZT10LmNoaWxkRXhwaXJhdGlvblRpbWU9MSxudWxsO2JyZWFrO2Nhc2UgMTpBZSh0LnR5cGUpJiZxZSh0KTticmVhaztjYXNlIDQ6b24odCx0LnN0YXRlTm9kZS5jb250YWluZXJJbmZvKTticmVhaztjYXNlIDEwOk50KHQsdC5tZW1vaXplZFByb3BzLnZhbHVlKTticmVhaztjYXNlIDEzOmlmKG51bGwhPT10Lm1lbW9pemVkU3RhdGUpcmV0dXJuIDAhPT0ocj10LmNoaWxkLmNoaWxkRXhwaXJhdGlvblRpbWUpJiZyPj1uP3hyKGUsdCxuKTooVWUoZG4sMSZkbi5jdXJyZW50KSxudWxsIT09KHQ9d3IoZSx0LG4pKT90LnNpYmxpbmc6bnVsbCk7VWUoZG4sMSZkbi5jdXJyZW50KTticmVhaztjYXNlIDE5OmlmKHI9dC5jaGlsZEV4cGlyYXRpb25UaW1lPj1uLDAhPSg2NCZlLmVmZmVjdFRhZykpe2lmKHIpcmV0dXJuIGtyKGUsdCxuKTt0LmVmZmVjdFRhZ3w9NjR9aWYobnVsbCE9PShsPXQubWVtb2l6ZWRTdGF0ZSkmJihsLnJlbmRlcmluZz1udWxsLGwudGFpbD1udWxsKSxVZShkbixkbi5jdXJyZW50KSwhcilyZXR1cm4gbnVsbH1yZXR1cm4gd3IoZSx0LG4pfXVyPSExfX1lbHNlIHVyPSExO3N3aXRjaCh0LmV4cGlyYXRpb25UaW1lPTAsdC50YWcpe2Nhc2UgMjppZihyPXQudHlwZSxudWxsIT09ZSYmKGUuYWx0ZXJuYXRlPW51bGwsdC5hbHRlcm5hdGU9bnVsbCx0LmVmZmVjdFRhZ3w9MiksZT10LnBlbmRpbmdQcm9wcyxsPWplKHQsRmUuY3VycmVudCksUnQodCxuKSxsPWtuKG51bGwsdCxyLGUsbCxuKSx0LmVmZmVjdFRhZ3w9MSxcIm9iamVjdFwiPT10eXBlb2YgbCYmbnVsbCE9PWwmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGwucmVuZGVyJiZ2b2lkIDA9PT1sLiQkdHlwZW9mKXtpZih0LnRhZz0xLHQubWVtb2l6ZWRTdGF0ZT1udWxsLHQudXBkYXRlUXVldWU9bnVsbCxBZShyKSl7dmFyIGk9ITA7cWUodCl9ZWxzZSBpPSExO3QubWVtb2l6ZWRTdGF0ZT1udWxsIT09bC5zdGF0ZSYmdm9pZCAwIT09bC5zdGF0ZT9sLnN0YXRlOm51bGwsVXQodCk7dmFyIHU9ci5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHM7XCJmdW5jdGlvblwiPT10eXBlb2YgdSYmTHQodCxyLHUsZSksbC51cGRhdGVyPXF0LHQuc3RhdGVOb2RlPWwsbC5fcmVhY3RJbnRlcm5hbEZpYmVyPXQsR3QodCxyLGUsbiksdD1tcihudWxsLHQsciwhMCxpLG4pfWVsc2UgdC50YWc9MCxhcihudWxsLHQsbCxuKSx0PXQuY2hpbGQ7cmV0dXJuIHQ7Y2FzZSAxNjplOntpZihsPXQuZWxlbWVudFR5cGUsbnVsbCE9PWUmJihlLmFsdGVybmF0ZT1udWxsLHQuYWx0ZXJuYXRlPW51bGwsdC5lZmZlY3RUYWd8PTIpLGU9dC5wZW5kaW5nUHJvcHMsZnVuY3Rpb24oZSl7aWYoLTE9PT1lLl9zdGF0dXMpe2UuX3N0YXR1cz0wO3ZhciB0PWUuX2N0b3I7dD10KCksZS5fcmVzdWx0PXQsdC50aGVuKChmdW5jdGlvbih0KXswPT09ZS5fc3RhdHVzJiYodD10LmRlZmF1bHQsZS5fc3RhdHVzPTEsZS5fcmVzdWx0PXQpfSksKGZ1bmN0aW9uKHQpezA9PT1lLl9zdGF0dXMmJihlLl9zdGF0dXM9MixlLl9yZXN1bHQ9dCl9KSl9fShsKSwxIT09bC5fc3RhdHVzKXRocm93IGwuX3Jlc3VsdDtzd2l0Y2gobD1sLl9yZXN1bHQsdC50eXBlPWwsaT10LnRhZz1mdW5jdGlvbihlKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlKXJldHVybiBzaShlKT8xOjA7aWYobnVsbCE9ZSl7aWYoKGU9ZS4kJHR5cGVvZik9PT1UKXJldHVybiAxMTtpZihlPT09UylyZXR1cm4gMTR9cmV0dXJuIDJ9KGwpLGU9U3QobCxlKSxpKXtjYXNlIDA6dD1kcihudWxsLHQsbCxlLG4pO2JyZWFrIGU7Y2FzZSAxOnQ9cHIobnVsbCx0LGwsZSxuKTticmVhayBlO2Nhc2UgMTE6dD1vcihudWxsLHQsbCxlLG4pO2JyZWFrIGU7Y2FzZSAxNDp0PWNyKG51bGwsdCxsLFN0KGwudHlwZSxlKSxyLG4pO2JyZWFrIGV9dGhyb3cgRXJyb3IoYygzMDYsbCxcIlwiKSl9cmV0dXJuIHQ7Y2FzZSAwOnJldHVybiByPXQudHlwZSxsPXQucGVuZGluZ1Byb3BzLGRyKGUsdCxyLGw9dC5lbGVtZW50VHlwZT09PXI/bDpTdChyLGwpLG4pO2Nhc2UgMTpyZXR1cm4gcj10LnR5cGUsbD10LnBlbmRpbmdQcm9wcyxwcihlLHQscixsPXQuZWxlbWVudFR5cGU9PT1yP2w6U3QocixsKSxuKTtjYXNlIDM6aWYoaHIodCkscj10LnVwZGF0ZVF1ZXVlLG51bGw9PT1lfHxudWxsPT09cil0aHJvdyBFcnJvcihjKDI4MikpO2lmKHI9dC5wZW5kaW5nUHJvcHMsbD1udWxsIT09KGw9dC5tZW1vaXplZFN0YXRlKT9sLmVsZW1lbnQ6bnVsbCxEdChlLHQpLGp0KHQscixudWxsLG4pLChyPXQubWVtb2l6ZWRTdGF0ZS5lbGVtZW50KT09PWwpbHIoKSx0PXdyKGUsdCxuKTtlbHNle2lmKChsPXQuc3RhdGVOb2RlLmh5ZHJhdGUpJiYoSj8oSm49a2UodC5zdGF0ZU5vZGUuY29udGFpbmVySW5mbyksWW49dCxsPVhuPSEwKTpsPSExKSxsKWZvcihuPXRuKHQsbnVsbCxyLG4pLHQuY2hpbGQ9bjtuOyluLmVmZmVjdFRhZz0tMyZuLmVmZmVjdFRhZ3wxMDI0LG49bi5zaWJsaW5nO2Vsc2UgYXIoZSx0LHIsbiksbHIoKTt0PXQuY2hpbGR9cmV0dXJuIHQ7Y2FzZSA1OnJldHVybiBmbih0KSxudWxsPT09ZSYmdHIodCkscj10LnR5cGUsbD10LnBlbmRpbmdQcm9wcyxpPW51bGwhPT1lP2UubWVtb2l6ZWRQcm9wczpudWxsLHU9bC5jaGlsZHJlbixCKHIsbCk/dT1udWxsOm51bGwhPT1pJiZCKHIsaSkmJih0LmVmZmVjdFRhZ3w9MTYpLHNyKGUsdCksNCZ0Lm1vZGUmJjEhPT1uJiZPKHIsbCk/KHQuZXhwaXJhdGlvblRpbWU9dC5jaGlsZEV4cGlyYXRpb25UaW1lPTEsdD1udWxsKTooYXIoZSx0LHUsbiksdD10LmNoaWxkKSx0O2Nhc2UgNjpyZXR1cm4gbnVsbD09PWUmJnRyKHQpLG51bGw7Y2FzZSAxMzpyZXR1cm4geHIoZSx0LG4pO2Nhc2UgNDpyZXR1cm4gb24odCx0LnN0YXRlTm9kZS5jb250YWluZXJJbmZvKSxyPXQucGVuZGluZ1Byb3BzLG51bGw9PT1lP3QuY2hpbGQ9ZW4odCxudWxsLHIsbik6YXIoZSx0LHIsbiksdC5jaGlsZDtjYXNlIDExOnJldHVybiByPXQudHlwZSxsPXQucGVuZGluZ1Byb3BzLG9yKGUsdCxyLGw9dC5lbGVtZW50VHlwZT09PXI/bDpTdChyLGwpLG4pO2Nhc2UgNzpyZXR1cm4gYXIoZSx0LHQucGVuZGluZ1Byb3BzLG4pLHQuY2hpbGQ7Y2FzZSA4OmNhc2UgMTI6cmV0dXJuIGFyKGUsdCx0LnBlbmRpbmdQcm9wcy5jaGlsZHJlbixuKSx0LmNoaWxkO2Nhc2UgMTA6ZTp7aWYocj10LnR5cGUuX2NvbnRleHQsbD10LnBlbmRpbmdQcm9wcyx1PXQubWVtb2l6ZWRQcm9wcyxOdCh0LGk9bC52YWx1ZSksbnVsbCE9PXUpe3ZhciBhPXUudmFsdWU7aWYoMD09KGk9VHQoYSxpKT8wOjB8KFwiZnVuY3Rpb25cIj09dHlwZW9mIHIuX2NhbGN1bGF0ZUNoYW5nZWRCaXRzP3IuX2NhbGN1bGF0ZUNoYW5nZWRCaXRzKGEsaSk6MTA3Mzc0MTgyMykpKXtpZih1LmNoaWxkcmVuPT09bC5jaGlsZHJlbiYmIVdlLmN1cnJlbnQpe3Q9d3IoZSx0LG4pO2JyZWFrIGV9fWVsc2UgZm9yKG51bGwhPT0oYT10LmNoaWxkKSYmKGEucmV0dXJuPXQpO251bGwhPT1hOyl7dmFyIG89YS5kZXBlbmRlbmNpZXM7aWYobnVsbCE9PW8pe3U9YS5jaGlsZDtmb3IodmFyIGY9by5maXJzdENvbnRleHQ7bnVsbCE9PWY7KXtpZihmLmNvbnRleHQ9PT1yJiYwIT0oZi5vYnNlcnZlZEJpdHMmaSkpezE9PT1hLnRhZyYmKChmPUZ0KG4sbnVsbCkpLnRhZz0yLFd0KGEsZikpLGEuZXhwaXJhdGlvblRpbWU8biYmKGEuZXhwaXJhdGlvblRpbWU9biksbnVsbCE9PShmPWEuYWx0ZXJuYXRlKSYmZi5leHBpcmF0aW9uVGltZTxuJiYoZi5leHBpcmF0aW9uVGltZT1uKSxJdChhLnJldHVybixuKSxvLmV4cGlyYXRpb25UaW1lPG4mJihvLmV4cGlyYXRpb25UaW1lPW4pO2JyZWFrfWY9Zi5uZXh0fX1lbHNlIHU9MTA9PT1hLnRhZyYmYS50eXBlPT09dC50eXBlP251bGw6YS5jaGlsZDtpZihudWxsIT09dSl1LnJldHVybj1hO2Vsc2UgZm9yKHU9YTtudWxsIT09dTspe2lmKHU9PT10KXt1PW51bGw7YnJlYWt9aWYobnVsbCE9PShhPXUuc2libGluZykpe2EucmV0dXJuPXUucmV0dXJuLHU9YTticmVha311PXUucmV0dXJufWE9dX19YXIoZSx0LGwuY2hpbGRyZW4sbiksdD10LmNoaWxkfXJldHVybiB0O2Nhc2UgOTpyZXR1cm4gbD10LnR5cGUscj0oaT10LnBlbmRpbmdQcm9wcykuY2hpbGRyZW4sUnQodCxuKSxyPXIobD1NdChsLGkudW5zdGFibGVfb2JzZXJ2ZWRCaXRzKSksdC5lZmZlY3RUYWd8PTEsYXIoZSx0LHIsbiksdC5jaGlsZDtjYXNlIDE0OnJldHVybiBpPVN0KGw9dC50eXBlLHQucGVuZGluZ1Byb3BzKSxjcihlLHQsbCxpPVN0KGwudHlwZSxpKSxyLG4pO2Nhc2UgMTU6cmV0dXJuIGZyKGUsdCx0LnR5cGUsdC5wZW5kaW5nUHJvcHMscixuKTtjYXNlIDE3OnJldHVybiByPXQudHlwZSxsPXQucGVuZGluZ1Byb3BzLGw9dC5lbGVtZW50VHlwZT09PXI/bDpTdChyLGwpLG51bGwhPT1lJiYoZS5hbHRlcm5hdGU9bnVsbCx0LmFsdGVybmF0ZT1udWxsLHQuZWZmZWN0VGFnfD0yKSx0LnRhZz0xLEFlKHIpPyhlPSEwLHFlKHQpKTplPSExLFJ0KHQsbiksJHQodCxyLGwpLEd0KHQscixsLG4pLG1yKG51bGwsdCxyLCEwLGUsbik7Y2FzZSAxOTpyZXR1cm4ga3IoZSx0LG4pfXRocm93IEVycm9yKGMoMTU2LHQudGFnKSl9O3ZhciB1aT17Y3VycmVudDohMX0sYWk9bnVsbCxvaT1udWxsO2Z1bmN0aW9uIGNpKGUsdCxuLHIpe3RoaXMudGFnPWUsdGhpcy5rZXk9bix0aGlzLnNpYmxpbmc9dGhpcy5jaGlsZD10aGlzLnJldHVybj10aGlzLnN0YXRlTm9kZT10aGlzLnR5cGU9dGhpcy5lbGVtZW50VHlwZT1udWxsLHRoaXMuaW5kZXg9MCx0aGlzLnJlZj1udWxsLHRoaXMucGVuZGluZ1Byb3BzPXQsdGhpcy5kZXBlbmRlbmNpZXM9dGhpcy5tZW1vaXplZFN0YXRlPXRoaXMudXBkYXRlUXVldWU9dGhpcy5tZW1vaXplZFByb3BzPW51bGwsdGhpcy5tb2RlPXIsdGhpcy5lZmZlY3RUYWc9MCx0aGlzLmxhc3RFZmZlY3Q9dGhpcy5maXJzdEVmZmVjdD10aGlzLm5leHRFZmZlY3Q9bnVsbCx0aGlzLmNoaWxkRXhwaXJhdGlvblRpbWU9dGhpcy5leHBpcmF0aW9uVGltZT0wLHRoaXMuYWx0ZXJuYXRlPW51bGx9ZnVuY3Rpb24gZmkoZSx0LG4scil7cmV0dXJuIG5ldyBjaShlLHQsbixyKX1mdW5jdGlvbiBzaShlKXtyZXR1cm4hKCEoZT1lLnByb3RvdHlwZSl8fCFlLmlzUmVhY3RDb21wb25lbnQpfWZ1bmN0aW9uIGRpKGUsdCl7dmFyIG49ZS5hbHRlcm5hdGU7cmV0dXJuIG51bGw9PT1uPygobj1maShlLnRhZyx0LGUua2V5LGUubW9kZSkpLmVsZW1lbnRUeXBlPWUuZWxlbWVudFR5cGUsbi50eXBlPWUudHlwZSxuLnN0YXRlTm9kZT1lLnN0YXRlTm9kZSxuLmFsdGVybmF0ZT1lLGUuYWx0ZXJuYXRlPW4pOihuLnBlbmRpbmdQcm9wcz10LG4uZWZmZWN0VGFnPTAsbi5uZXh0RWZmZWN0PW51bGwsbi5maXJzdEVmZmVjdD1udWxsLG4ubGFzdEVmZmVjdD1udWxsKSxuLmNoaWxkRXhwaXJhdGlvblRpbWU9ZS5jaGlsZEV4cGlyYXRpb25UaW1lLG4uZXhwaXJhdGlvblRpbWU9ZS5leHBpcmF0aW9uVGltZSxuLmNoaWxkPWUuY2hpbGQsbi5tZW1vaXplZFByb3BzPWUubWVtb2l6ZWRQcm9wcyxuLm1lbW9pemVkU3RhdGU9ZS5tZW1vaXplZFN0YXRlLG4udXBkYXRlUXVldWU9ZS51cGRhdGVRdWV1ZSx0PWUuZGVwZW5kZW5jaWVzLG4uZGVwZW5kZW5jaWVzPW51bGw9PT10P251bGw6e2V4cGlyYXRpb25UaW1lOnQuZXhwaXJhdGlvblRpbWUsZmlyc3RDb250ZXh0OnQuZmlyc3RDb250ZXh0LHJlc3BvbmRlcnM6dC5yZXNwb25kZXJzfSxuLnNpYmxpbmc9ZS5zaWJsaW5nLG4uaW5kZXg9ZS5pbmRleCxuLnJlZj1lLnJlZixufWZ1bmN0aW9uIHBpKGUsdCxuLHIsbCxpKXt2YXIgdT0yO2lmKHI9ZSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlKXNpKGUpJiYodT0xKTtlbHNlIGlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXU9NTtlbHNlIGU6c3dpdGNoKGUpe2Nhc2UgbTpyZXR1cm4gbWkobi5jaGlsZHJlbixsLGksdCk7Y2FzZSB5OnU9OCxsfD03O2JyZWFrO2Nhc2UgaDp1PTgsbHw9MTticmVhaztjYXNlIGc6cmV0dXJuKGU9ZmkoMTIsbix0LDh8bCkpLmVsZW1lbnRUeXBlPWcsZS50eXBlPWcsZS5leHBpcmF0aW9uVGltZT1pLGU7Y2FzZSB4OnJldHVybihlPWZpKDEzLG4sdCxsKSkudHlwZT14LGUuZWxlbWVudFR5cGU9eCxlLmV4cGlyYXRpb25UaW1lPWksZTtjYXNlIEU6cmV0dXJuKGU9ZmkoMTksbix0LGwpKS5lbGVtZW50VHlwZT1FLGUuZXhwaXJhdGlvblRpbWU9aSxlO2RlZmF1bHQ6aWYoXCJvYmplY3RcIj09dHlwZW9mIGUmJm51bGwhPT1lKXN3aXRjaChlLiQkdHlwZW9mKXtjYXNlIGI6dT0xMDticmVhayBlO2Nhc2Ugdjp1PTk7YnJlYWsgZTtjYXNlIFQ6dT0xMTticmVhayBlO2Nhc2UgUzp1PTE0O2JyZWFrIGU7Y2FzZSBrOnU9MTYscj1udWxsO2JyZWFrIGU7Y2FzZSB3OnU9MjI7YnJlYWsgZX10aHJvdyBFcnJvcihjKDEzMCxudWxsPT1lP2U6dHlwZW9mIGUsXCJcIikpfXJldHVybih0PWZpKHUsbix0LGwpKS5lbGVtZW50VHlwZT1lLHQudHlwZT1yLHQuZXhwaXJhdGlvblRpbWU9aSx0fWZ1bmN0aW9uIG1pKGUsdCxuLHIpe3JldHVybihlPWZpKDcsZSxyLHQpKS5leHBpcmF0aW9uVGltZT1uLGV9ZnVuY3Rpb24gaGkoZSx0LG4pe3JldHVybihlPWZpKDYsZSxudWxsLHQpKS5leHBpcmF0aW9uVGltZT1uLGV9ZnVuY3Rpb24gZ2koZSx0LG4pe3JldHVybih0PWZpKDQsbnVsbCE9PWUuY2hpbGRyZW4/ZS5jaGlsZHJlbjpbXSxlLmtleSx0KSkuZXhwaXJhdGlvblRpbWU9bix0LnN0YXRlTm9kZT17Y29udGFpbmVySW5mbzplLmNvbnRhaW5lckluZm8scGVuZGluZ0NoaWxkcmVuOm51bGwsaW1wbGVtZW50YXRpb246ZS5pbXBsZW1lbnRhdGlvbn0sdH1mdW5jdGlvbiBiaShlLHQsbil7dGhpcy50YWc9dCx0aGlzLmN1cnJlbnQ9bnVsbCx0aGlzLmNvbnRhaW5lckluZm89ZSx0aGlzLnBpbmdDYWNoZT10aGlzLnBlbmRpbmdDaGlsZHJlbj1udWxsLHRoaXMuZmluaXNoZWRFeHBpcmF0aW9uVGltZT0wLHRoaXMuZmluaXNoZWRXb3JrPW51bGwsdGhpcy50aW1lb3V0SGFuZGxlPSQsdGhpcy5wZW5kaW5nQ29udGV4dD10aGlzLmNvbnRleHQ9bnVsbCx0aGlzLmh5ZHJhdGU9bix0aGlzLmNhbGxiYWNrTm9kZT1udWxsLHRoaXMuY2FsbGJhY2tQcmlvcml0eT05MCx0aGlzLmxhc3RFeHBpcmVkVGltZT10aGlzLmxhc3RQaW5nZWRUaW1lPXRoaXMubmV4dEtub3duUGVuZGluZ0xldmVsPXRoaXMubGFzdFN1c3BlbmRlZFRpbWU9dGhpcy5maXJzdFN1c3BlbmRlZFRpbWU9dGhpcy5maXJzdFBlbmRpbmdUaW1lPTB9ZnVuY3Rpb24gdmkoZSx0KXt2YXIgbj1lLmZpcnN0U3VzcGVuZGVkVGltZTtyZXR1cm4gZT1lLmxhc3RTdXNwZW5kZWRUaW1lLDAhPT1uJiZuPj10JiZlPD10fWZ1bmN0aW9uIHlpKGUsdCl7dmFyIG49ZS5maXJzdFN1c3BlbmRlZFRpbWUscj1lLmxhc3RTdXNwZW5kZWRUaW1lO248dCYmKGUuZmlyc3RTdXNwZW5kZWRUaW1lPXQpLChyPnR8fDA9PT1uKSYmKGUubGFzdFN1c3BlbmRlZFRpbWU9dCksdDw9ZS5sYXN0UGluZ2VkVGltZSYmKGUubGFzdFBpbmdlZFRpbWU9MCksdDw9ZS5sYXN0RXhwaXJlZFRpbWUmJihlLmxhc3RFeHBpcmVkVGltZT0wKX1mdW5jdGlvbiBUaShlLHQpe3Q+ZS5maXJzdFBlbmRpbmdUaW1lJiYoZS5maXJzdFBlbmRpbmdUaW1lPXQpO3ZhciBuPWUuZmlyc3RTdXNwZW5kZWRUaW1lOzAhPT1uJiYodD49bj9lLmZpcnN0U3VzcGVuZGVkVGltZT1lLmxhc3RTdXNwZW5kZWRUaW1lPWUubmV4dEtub3duUGVuZGluZ0xldmVsPTA6dD49ZS5sYXN0U3VzcGVuZGVkVGltZSYmKGUubGFzdFN1c3BlbmRlZFRpbWU9dCsxKSx0PmUubmV4dEtub3duUGVuZGluZ0xldmVsJiYoZS5uZXh0S25vd25QZW5kaW5nTGV2ZWw9dCkpfWZ1bmN0aW9uIHhpKGUsdCl7dmFyIG49ZS5sYXN0RXhwaXJlZFRpbWU7KDA9PT1ufHxuPnQpJiYoZS5sYXN0RXhwaXJlZFRpbWU9dCl9dmFyIEVpPW51bGw7ZnVuY3Rpb24gU2koZSl7dmFyIHQ9ZS5fcmVhY3RJbnRlcm5hbEZpYmVyO2lmKHZvaWQgMD09PXQpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUucmVuZGVyKXRocm93IEVycm9yKGMoMTg4KSk7dGhyb3cgRXJyb3IoYygyNjgsT2JqZWN0LmtleXMoZSkpKX1yZXR1cm4gbnVsbD09PShlPVIodCkpP251bGw6ZS5zdGF0ZU5vZGV9ZnVuY3Rpb24ga2koZSx0KXtudWxsIT09KGU9ZS5tZW1vaXplZFN0YXRlKSYmbnVsbCE9PWUuZGVoeWRyYXRlZCYmZS5yZXRyeVRpbWU8dCYmKGUucmV0cnlUaW1lPXQpfWZ1bmN0aW9uIHdpKGUsdCl7a2koZSx0KSwoZT1lLmFsdGVybmF0ZSkmJmtpKGUsdCl9dmFyIHppPWYuSXNTb21lUmVuZGVyZXJBY3RpbmcsQ2k9XCJmdW5jdGlvblwiPT10eXBlb2Ygby51bnN0YWJsZV9mbHVzaEFsbFdpdGhvdXRBc3NlcnRpbmcsUGk9by51bnN0YWJsZV9mbHVzaEFsbFdpdGhvdXRBc3NlcnRpbmd8fGZ1bmN0aW9uKCl7Zm9yKHZhciBlPSExO2VpKCk7KWU9ITA7cmV0dXJuIGV9O2Z1bmN0aW9uIE5pKHQpe3RyeXtQaSgpLGZ1bmN0aW9uKHQpe2lmKG51bGw9PT1FaSl0cnl7dmFyIG49KFwicmVxdWlyZVwiK01hdGgucmFuZG9tKCkpLnNsaWNlKDAsNyk7RWk9KGUmJmVbbl0pKFwidGltZXJzXCIpLnNldEltbWVkaWF0ZX1jYXRjaChlKXtFaT1mdW5jdGlvbihlKXt2YXIgdD1uZXcgTWVzc2FnZUNoYW5uZWw7dC5wb3J0MS5vbm1lc3NhZ2U9ZSx0LnBvcnQyLnBvc3RNZXNzYWdlKHZvaWQgMCl9fUVpKHQpfSgoZnVuY3Rpb24oKXtQaSgpP05pKHQpOnQoKX0pKX1jYXRjaChlKXt0KGUpfX12YXIgX2k9MCxJaT0hMSxSaT17X19wcm90b19fOm51bGwsY3JlYXRlQ29udGFpbmVyOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZT1uZXcgYmkoZSx0LG4pLHQ9ZmkoMyxudWxsLG51bGwsMj09PXQ/NzoxPT09dD8zOjApLGUuY3VycmVudD10LHQuc3RhdGVOb2RlPWUsVXQodCksZX0sdXBkYXRlQ29udGFpbmVyOmZ1bmN0aW9uKGUsdCxuLHIpe3ZhciBsPXQuY3VycmVudCxpPUlsKCksdT1CdC5zdXNwZW5zZTtpPVJsKGksbCx1KTtlOmlmKG4pe3Q6e2lmKE4obj1uLl9yZWFjdEludGVybmFsRmliZXIpIT09bnx8MSE9PW4udGFnKXRocm93IEVycm9yKGMoMTcwKSk7dmFyIGE9bjtkb3tzd2l0Y2goYS50YWcpe2Nhc2UgMzphPWEuc3RhdGVOb2RlLmNvbnRleHQ7YnJlYWsgdDtjYXNlIDE6aWYoQWUoYS50eXBlKSl7YT1hLnN0YXRlTm9kZS5fX3JlYWN0SW50ZXJuYWxNZW1vaXplZE1lcmdlZENoaWxkQ29udGV4dDticmVhayB0fX1hPWEucmV0dXJufXdoaWxlKG51bGwhPT1hKTt0aHJvdyBFcnJvcihjKDE3MSkpfWlmKDE9PT1uLnRhZyl7dmFyIG89bi50eXBlO2lmKEFlKG8pKXtuPUxlKG4sbyxhKTticmVhayBlfX1uPWF9ZWxzZSBuPURlO3JldHVybiBudWxsPT09dC5jb250ZXh0P3QuY29udGV4dD1uOnQucGVuZGluZ0NvbnRleHQ9biwodD1GdChpLHUpKS5wYXlsb2FkPXtlbGVtZW50OmV9LG51bGwhPT0ocj12b2lkIDA9PT1yP251bGw6cikmJih0LmNhbGxiYWNrPXIpLFd0KGwsdCksTWwobCxpKSxpfSxiYXRjaGVkRXZlbnRVcGRhdGVzOmZ1bmN0aW9uKGUsdCl7dmFyIG49b2w7b2x8PTI7dHJ5e3JldHVybiBlKHQpfWZpbmFsbHl7MD09PShvbD1uKSYmYnQoKX19LGJhdGNoZWRVcGRhdGVzOkhsLHVuYmF0Y2hlZFVwZGF0ZXM6ZnVuY3Rpb24oZSx0KXt2YXIgbj1vbDtvbCY9LTIsb2x8PTg7dHJ5e3JldHVybiBlKHQpfWZpbmFsbHl7MD09PShvbD1uKSYmYnQoKX19LGRlZmVycmVkVXBkYXRlczpmdW5jdGlvbihlKXtyZXR1cm4gbXQoOTcsZSl9LHN5bmNVcGRhdGVzOmZ1bmN0aW9uKGUsdCxuLHIpe3JldHVybiBtdCg5OSxlLmJpbmQobnVsbCx0LG4scikpfSxkaXNjcmV0ZVVwZGF0ZXM6ZnVuY3Rpb24oZSx0LG4scixsKXt2YXIgaT1vbDtvbHw9NDt0cnl7cmV0dXJuIG10KDk4LGUuYmluZChudWxsLHQsbixyLGwpKX1maW5hbGx5ezA9PT0ob2w9aSkmJmJ0KCl9fSxmbHVzaERpc2NyZXRlVXBkYXRlczpmdW5jdGlvbigpezA9PSg0OSZvbCkmJihmdW5jdGlvbigpe2lmKG51bGwhPT1DbCl7dmFyIGU9Q2w7Q2w9bnVsbCxlLmZvckVhY2goKGZ1bmN0aW9uKGUsdCl7eGkodCxlKSxEbCh0KX0pKSxidCgpfX0oKSxlaSgpKX0sZmx1c2hDb250cm9sbGVkOmZ1bmN0aW9uKGUpe3ZhciB0PW9sO29sfD0xO3RyeXttdCg5OSxlKX1maW5hbGx5ezA9PT0ob2w9dCkmJmJ0KCl9fSxmbHVzaFN5bmM6amwsZmx1c2hQYXNzaXZlRWZmZWN0czplaSxJc1RoaXNSZW5kZXJlckFjdGluZzp1aSxnZXRQdWJsaWNSb290SW5zdGFuY2U6ZnVuY3Rpb24oZSl7aWYoIShlPWUuY3VycmVudCkuY2hpbGQpcmV0dXJuIG51bGw7c3dpdGNoKGUuY2hpbGQudGFnKXtjYXNlIDU6cmV0dXJuIE0oZS5jaGlsZC5zdGF0ZU5vZGUpO2RlZmF1bHQ6cmV0dXJuIGUuY2hpbGQuc3RhdGVOb2RlfX0sYXR0ZW1wdFN5bmNocm9ub3VzSHlkcmF0aW9uOmZ1bmN0aW9uKGUpe3N3aXRjaChlLnRhZyl7Y2FzZSAzOnZhciB0PWUuc3RhdGVOb2RlO3QuaHlkcmF0ZSYmZnVuY3Rpb24oZSx0KXt4aShlLHQpLERsKGUpLDA9PSg0OCZvbCkmJmJ0KCl9KHQsdC5maXJzdFBlbmRpbmdUaW1lKTticmVhaztjYXNlIDEzOmpsKChmdW5jdGlvbigpe3JldHVybiBNbChlLDEwNzM3NDE4MjMpfSkpLHQ9eXQoSWwoKSwxNTAsMTAwKSx3aShlLHQpfX0sYXR0ZW1wdFVzZXJCbG9ja2luZ0h5ZHJhdGlvbjpmdW5jdGlvbihlKXtpZigxMz09PWUudGFnKXt2YXIgdD15dChJbCgpLDE1MCwxMDApO01sKGUsdCksd2koZSx0KX19LGF0dGVtcHRDb250aW51b3VzSHlkcmF0aW9uOmZ1bmN0aW9uKGUpezEzPT09ZS50YWcmJihNbChlLDMpLHdpKGUsMykpfSxhdHRlbXB0SHlkcmF0aW9uQXRDdXJyZW50UHJpb3JpdHk6ZnVuY3Rpb24oZSl7aWYoMTM9PT1lLnRhZyl7dmFyIHQ9SWwoKTtNbChlLHQ9UmwodCxlLG51bGwpKSx3aShlLHQpfX0sZmluZEhvc3RJbnN0YW5jZTpTaSxmaW5kSG9zdEluc3RhbmNlV2l0aFdhcm5pbmc6ZnVuY3Rpb24oZSl7cmV0dXJuIFNpKGUpfSxmaW5kSG9zdEluc3RhbmNlV2l0aE5vUG9ydGFsczpmdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09PShlPWZ1bmN0aW9uKGUpe2lmKCEoZT1JKGUpKSlyZXR1cm4gbnVsbDtmb3IodmFyIHQ9ZTs7KXtpZig1PT09dC50YWd8fDY9PT10LnRhZylyZXR1cm4gdDtpZih0LmNoaWxkJiY0IT09dC50YWcpdC5jaGlsZC5yZXR1cm49dCx0PXQuY2hpbGQ7ZWxzZXtpZih0PT09ZSlicmVhaztmb3IoOyF0LnNpYmxpbmc7KXtpZighdC5yZXR1cm58fHQucmV0dXJuPT09ZSlyZXR1cm4gbnVsbDt0PXQucmV0dXJufXQuc2libGluZy5yZXR1cm49dC5yZXR1cm4sdD10LnNpYmxpbmd9fXJldHVybiBudWxsfShlKSk/bnVsbDoyMD09PWUudGFnP2Uuc3RhdGVOb2RlLmluc3RhbmNlOmUuc3RhdGVOb2RlfSxzaG91bGRTdXNwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuITF9LGluamVjdEludG9EZXZUb29sczpmdW5jdGlvbihlKXt2YXIgdD1lLmZpbmRGaWJlckJ5SG9zdEluc3RhbmNlO3JldHVybiBmdW5jdGlvbihlKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fKXJldHVybiExO3ZhciB0PV9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXztpZih0LmlzRGlzYWJsZWR8fCF0LnN1cHBvcnRzRmliZXIpcmV0dXJuITA7dHJ5e3ZhciBuPXQuaW5qZWN0KGUpO2FpPWZ1bmN0aW9uKGUpe3RyeXt0Lm9uQ29tbWl0RmliZXJSb290KG4sZSx2b2lkIDAsNjQ9PSg2NCZlLmN1cnJlbnQuZWZmZWN0VGFnKSl9Y2F0Y2goZSl7fX0sb2k9ZnVuY3Rpb24oZSl7dHJ5e3Qub25Db21taXRGaWJlclVubW91bnQobixlKX1jYXRjaChlKXt9fX1jYXRjaChlKXt9cmV0dXJuITB9KHIoe30sZSx7b3ZlcnJpZGVIb29rU3RhdGU6bnVsbCxvdmVycmlkZVByb3BzOm51bGwsc2V0U3VzcGVuc2VIYW5kbGVyOm51bGwsc2NoZWR1bGVVcGRhdGU6bnVsbCxjdXJyZW50RGlzcGF0Y2hlclJlZjpmLlJlYWN0Q3VycmVudERpc3BhdGNoZXIsZmluZEhvc3RJbnN0YW5jZUJ5RmliZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIG51bGw9PT0oZT1SKGUpKT9udWxsOmUuc3RhdGVOb2RlfSxmaW5kRmliZXJCeUhvc3RJbnN0YW5jZTpmdW5jdGlvbihlKXtyZXR1cm4gdD90KGUpOm51bGx9LGZpbmRIb3N0SW5zdGFuY2VzRm9yUmVmcmVzaDpudWxsLHNjaGVkdWxlUmVmcmVzaDpudWxsLHNjaGVkdWxlUm9vdDpudWxsLHNldFJlZnJlc2hIYW5kbGVyOm51bGwsZ2V0Q3VycmVudEZpYmVyOm51bGx9KSl9LGFjdDpmdW5jdGlvbihlKXtmdW5jdGlvbiB0KCl7X2ktLSx6aS5jdXJyZW50PW4sdWkuY3VycmVudD1yfSExPT09SWkmJihJaT0hMCxjb25zb2xlLmVycm9yKFwiYWN0KC4uLikgaXMgbm90IHN1cHBvcnRlZCBpbiBwcm9kdWN0aW9uIGJ1aWxkcyBvZiBSZWFjdCwgYW5kIG1pZ2h0IG5vdCBiZWhhdmUgYXMgZXhwZWN0ZWQuXCIpKSxfaSsrO3ZhciBuPXppLmN1cnJlbnQscj11aS5jdXJyZW50O3ppLmN1cnJlbnQ9ITAsdWkuY3VycmVudD0hMDt0cnl7dmFyIGw9SGwoZSl9Y2F0Y2goZSl7dGhyb3cgdCgpLGV9aWYobnVsbCE9PWwmJlwib2JqZWN0XCI9PXR5cGVvZiBsJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBsLnRoZW4pcmV0dXJue3RoZW46ZnVuY3Rpb24oZSxyKXtsLnRoZW4oKGZ1bmN0aW9uKCl7MTxfaXx8ITA9PT1DaSYmITA9PT1uPyh0KCksZSgpKTpOaSgoZnVuY3Rpb24obil7dCgpLG4/cihuKTplKCl9KSl9KSwoZnVuY3Rpb24oZSl7dCgpLHIoZSl9KSl9fTt0cnl7MSE9PV9pfHwhMSE9PUNpJiYhMSE9PW58fFBpKCksdCgpfWNhdGNoKGUpe3Rocm93IHQoKSxlfXJldHVybnt0aGVuOmZ1bmN0aW9uKGUpe2UoKX19fX0sTWk9UmkmJlJpLmRlZmF1bHR8fFJpO2UuZXhwb3J0cz1NaS5kZWZhdWx0fHxNaTt2YXIgUWk9ZS5leHBvcnRzO3JldHVybiBlLmV4cG9ydHM9dCxRaX19KG89e3BhdGg6YSxleHBvcnRzOnt9LHJlcXVpcmU6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJEeW5hbWljIHJlcXVpcmVzIGFyZSBub3QgY3VycmVudGx5IHN1cHBvcnRlZCBieSBAcm9sbHVwL3BsdWdpbi1jb21tb25qc1wiKX0obnVsbD09dCYmby5wYXRoKX19LG8uZXhwb3J0cyksby5leHBvcnRzKTtjb25zdCBmPW5ldyBNYXAscz17fSxkPWMoe3N1cHBvcnRzTXV0YXRpb246ITAsaXNQcmltYXJ5UmVuZGVyZXI6ITAsbm93OigpPT5EYXRlLm5vdygpLGNyZWF0ZUluc3RhbmNlOigpPT5udWxsLGFwcGVuZEluaXRpYWxDaGlsZCgpe30sYXBwZW5kQ2hpbGQoKXt9LGFwcGVuZENoaWxkVG9Db250YWluZXIoKXt9LGluc2VydEJlZm9yZSgpe30scmVtb3ZlQ2hpbGQoKXt9LHJlbW92ZUNoaWxkRnJvbUNvbnRhaW5lcigpe30sY29tbWl0VXBkYXRlKCl7fSxnZXRQdWJsaWNJbnN0YW5jZTplPT5lLGdldFJvb3RIb3N0Q29udGV4dDooKT0+cyxnZXRDaGlsZEhvc3RDb250ZXh0OigpPT5zLGNyZWF0ZVRleHRJbnN0YW5jZSgpe30sZmluYWxpemVJbml0aWFsQ2hpbGRyZW46KCk9PiExLHByZXBhcmVVcGRhdGU6KCk9PnMsc2hvdWxkRGVwcmlvcml0aXplU3VidHJlZTooKT0+ITEscHJlcGFyZUZvckNvbW1pdCgpe30scmVzZXRBZnRlckNvbW1pdCgpe30sc2hvdWxkU2V0VGV4dENvbnRlbnQ6KCk9PiExLHNjaGVkdWxlUGFzc2l2ZUVmZmVjdHMoZSl7ZSgpfSxjYW5jZWxQYXNzaXZlRWZmZWN0cyhlKXt9fSk7ZXhwb3J0cy5yZW5kZXI9ZnVuY3Rpb24oZSx0PVwiZGVmYXVsdFwiKXtsZXQgbj1mLmdldCh0KTtyZXR1cm4gbnx8Zi5zZXQodCxuPWQuY3JlYXRlQ29udGFpbmVyKHQsMCwhMSxudWxsKSksZC51cGRhdGVDb250YWluZXIoZSxuLG51bGwsdm9pZCAwKSxkLmdldFB1YmxpY1Jvb3RJbnN0YW5jZShuKX0sZXhwb3J0cy51bm1vdW50Q29tcG9uZW50QXROb2RlPWZ1bmN0aW9uKGU9XCJkZWZhdWx0XCIpe2NvbnN0IHQ9Zi5nZXQoZSk7dCYmZC51cGRhdGVDb250YWluZXIobnVsbCx0LG51bGwsKCk9PmYuZGVsZXRlKGUpKX07XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE3LjAuMlxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuLy8gVE9ETzogdGhpcyBpcyBzcGVjaWFsIGJlY2F1c2UgaXQgZ2V0cyBpbXBvcnRlZCBkdXJpbmcgYnVpbGQuXG52YXIgUmVhY3RWZXJzaW9uID0gJzE3LjAuMic7XG5cbi8vIEFUVEVOVElPTlxuLy8gV2hlbiBhZGRpbmcgbmV3IHN5bWJvbHMgdG8gdGhpcyBmaWxlLFxuLy8gUGxlYXNlIGNvbnNpZGVyIGFsc28gYWRkaW5nIHRvICdyZWFjdC1kZXZ0b29scy1zaGFyZWQvc3JjL2JhY2tlbmQvUmVhY3RTeW1ib2xzJ1xuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAweGVhYzc7XG52YXIgUkVBQ1RfUE9SVEFMX1RZUEUgPSAweGVhY2E7XG5leHBvcnRzLkZyYWdtZW50ID0gMHhlYWNiO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gMHhlYWNjO1xuZXhwb3J0cy5Qcm9maWxlciA9IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IDB4ZWFjZTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gMHhlYWQwO1xuZXhwb3J0cy5TdXNwZW5zZSA9IDB4ZWFkMTtcbnZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSAweGVhZDg7XG52YXIgUkVBQ1RfTUVNT19UWVBFID0gMHhlYWQzO1xudmFyIFJFQUNUX0xBWllfVFlQRSA9IDB4ZWFkNDtcbnZhciBSRUFDVF9CTE9DS19UWVBFID0gMHhlYWQ5O1xudmFyIFJFQUNUX1NFUlZFUl9CTE9DS19UWVBFID0gMHhlYWRhO1xudmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSAweGVhZDU7XG52YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IDB4ZWFkNztcbnZhciBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IDB4ZWFlMDtcbnZhciBSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSA9IDB4ZWFlMTtcbnZhciBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IDB4ZWFlMjtcbnZhciBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgPSAweGVhZTM7XG5cbmlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3IpIHtcbiAgdmFyIHN5bWJvbEZvciA9IFN5bWJvbC5mb3I7XG4gIFJFQUNUX0VMRU1FTlRfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZWxlbWVudCcpO1xuICBSRUFDVF9QT1JUQUxfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QucG9ydGFsJyk7XG4gIGV4cG9ydHMuRnJhZ21lbnQgPSBzeW1ib2xGb3IoJ3JlYWN0LmZyYWdtZW50Jyk7XG4gIGV4cG9ydHMuU3RyaWN0TW9kZSA9IHN5bWJvbEZvcigncmVhY3Quc3RyaWN0X21vZGUnKTtcbiAgZXhwb3J0cy5Qcm9maWxlciA9IHN5bWJvbEZvcigncmVhY3QucHJvZmlsZXInKTtcbiAgUkVBQ1RfUFJPVklERVJfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QucHJvdmlkZXInKTtcbiAgUkVBQ1RfQ09OVEVYVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5jb250ZXh0Jyk7XG4gIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmZvcndhcmRfcmVmJyk7XG4gIGV4cG9ydHMuU3VzcGVuc2UgPSBzeW1ib2xGb3IoJ3JlYWN0LnN1c3BlbnNlJyk7XG4gIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2VfbGlzdCcpO1xuICBSRUFDVF9NRU1PX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0Lm1lbW8nKTtcbiAgUkVBQ1RfTEFaWV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sYXp5Jyk7XG4gIFJFQUNUX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmJsb2NrJyk7XG4gIFJFQUNUX1NFUlZFUl9CTE9DS19UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zZXJ2ZXIuYmxvY2snKTtcbiAgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZnVuZGFtZW50YWwnKTtcbiAgUkVBQ1RfU0NPUEVfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc2NvcGUnKTtcbiAgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0Lm9wYXF1ZS5pZCcpO1xuICBSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZGVidWdfdHJhY2VfbW9kZScpO1xuICBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub2Zmc2NyZWVuJyk7XG4gIFJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubGVnYWN5X2hpZGRlbicpO1xufVxuXG52YXIgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgaWYgKG1heWJlSXRlcmFibGUgPT09IG51bGwgfHwgdHlwZW9mIG1heWJlSXRlcmFibGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgbWF5YmVJdGVyYXRvciA9IE1BWUJFX0lURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW01BWUJFX0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF07XG5cbiAgaWYgKHR5cGVvZiBtYXliZUl0ZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3I7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBkaXNwYXRjaGVyLlxuICovXG52YXIgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGJhdGNoJ3MgY29uZmlndXJhdGlvbiBzdWNoIGFzIGhvdyBsb25nIGFuIHVwZGF0ZVxuICogc2hvdWxkIHN1c3BlbmQgZm9yIGlmIGl0IG5lZWRzIHRvLlxuICovXG52YXIgUmVhY3RDdXJyZW50QmF0Y2hDb25maWcgPSB7XG4gIHRyYW5zaXRpb246IDBcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgb3duZXIuXG4gKlxuICogVGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIGNvbXBvbmVudCB3aG8gc2hvdWxkIG93biBhbnkgY29tcG9uZW50cyB0aGF0IGFyZVxuICogY3VycmVudGx5IGJlaW5nIGNvbnN0cnVjdGVkLlxuICovXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSB7fTtcbnZhciBjdXJyZW50RXh0cmFTdGFja0ZyYW1lID0gbnVsbDtcbmZ1bmN0aW9uIHNldEV4dHJhU3RhY2tGcmFtZShzdGFjaykge1xuICB7XG4gICAgY3VycmVudEV4dHJhU3RhY2tGcmFtZSA9IHN0YWNrO1xuICB9XG59XG5cbntcbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5zZXRFeHRyYVN0YWNrRnJhbWUgPSBmdW5jdGlvbiAoc3RhY2spIHtcbiAgICB7XG4gICAgICBjdXJyZW50RXh0cmFTdGFja0ZyYW1lID0gc3RhY2s7XG4gICAgfVxuICB9OyAvLyBTdGFjayBpbXBsZW1lbnRhdGlvbiBpbmplY3RlZCBieSB0aGUgY3VycmVudCByZW5kZXJlci5cblxuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrID0gbnVsbDtcblxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gJyc7IC8vIEFkZCBhbiBleHRyYSB0b3AgZnJhbWUgd2hpbGUgYW4gZWxlbWVudCBpcyBiZWluZyB2YWxpZGF0ZWRcblxuICAgIGlmIChjdXJyZW50RXh0cmFTdGFja0ZyYW1lKSB7XG4gICAgICBzdGFjayArPSBjdXJyZW50RXh0cmFTdGFja0ZyYW1lO1xuICAgIH0gLy8gRGVsZWdhdGUgdG8gdGhlIGluamVjdGVkIHJlbmRlcmVyLXNwZWNpZmljIGltcGxlbWVudGF0aW9uXG5cblxuICAgIHZhciBpbXBsID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2s7XG5cbiAgICBpZiAoaW1wbCkge1xuICAgICAgc3RhY2sgKz0gaW1wbCgpIHx8ICcnO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFjaztcbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VkIGJ5IGFjdCgpIHRvIHRyYWNrIHdoZXRoZXIgeW91J3JlIGluc2lkZSBhbiBhY3QoKSBzY29wZS5cbiAqL1xudmFyIElzU29tZVJlbmRlcmVyQWN0aW5nID0ge1xuICBjdXJyZW50OiBmYWxzZVxufTtcblxudmFyIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0ge1xuICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyOiBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLFxuICBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZzogUmVhY3RDdXJyZW50QmF0Y2hDb25maWcsXG4gIFJlYWN0Q3VycmVudE93bmVyOiBSZWFjdEN1cnJlbnRPd25lcixcbiAgSXNTb21lUmVuZGVyZXJBY3Rpbmc6IElzU29tZVJlbmRlcmVyQWN0aW5nLFxuICAvLyBVc2VkIGJ5IHJlbmRlcmVycyB0byBhdm9pZCBidW5kbGluZyBvYmplY3QtYXNzaWduIHR3aWNlIGluIFVNRCBidW5kbGVzOlxuICBhc3NpZ246IF9hc3NpZ25cbn07XG5cbntcbiAgUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG59XG5cbi8vIGJ5IGNhbGxzIHRvIHRoZXNlIG1ldGhvZHMgYnkgYSBCYWJlbCBwbHVnaW4uXG4vL1xuLy8gSW4gUFJPRCAob3IgaW4gcGFja2FnZXMgd2l0aG91dCBhY2Nlc3MgdG8gUmVhY3QgaW50ZXJuYWxzKSxcbi8vIHRoZXkgYXJlIGxlZnQgYXMgdGhleSBhcmUgaW5zdGVhZC5cblxuZnVuY3Rpb24gd2Fybihmb3JtYXQpIHtcbiAge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHByaW50V2FybmluZygnd2FybicsIGZvcm1hdCwgYXJncyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGVycm9yKGZvcm1hdCkge1xuICB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcHJpbnRXYXJuaW5nKCdlcnJvcicsIGZvcm1hdCwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGxldmVsLCBmb3JtYXQsIGFyZ3MpIHtcbiAgLy8gV2hlbiBjaGFuZ2luZyB0aGlzIGxvZ2ljLCB5b3UgbWlnaHQgd2FudCB0byBhbHNvXG4gIC8vIHVwZGF0ZSBjb25zb2xlV2l0aFN0YWNrRGV2Lnd3dy5qcyBhcyB3ZWxsLlxuICB7XG4gICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuXG4gICAgaWYgKHN0YWNrICE9PSAnJykge1xuICAgICAgZm9ybWF0ICs9ICclcyc7XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQoW3N0YWNrXSk7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3NXaXRoRm9ybWF0ID0gYXJncy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgfSk7IC8vIENhcmVmdWw6IFJOIGN1cnJlbnRseSBkZXBlbmRzIG9uIHRoaXMgcHJlZml4XG5cbiAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTsgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAvLyBicmVha3MgSUU5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzEzNjEwXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZ1xuXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZVtsZXZlbF0sIGNvbnNvbGUsIGFyZ3NXaXRoRm9ybWF0KTtcbiAgfVxufVxuXG52YXIgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50ID0ge307XG5cbmZ1bmN0aW9uIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBjYWxsZXJOYW1lKSB7XG4gIHtcbiAgICB2YXIgX2NvbnN0cnVjdG9yID0gcHVibGljSW5zdGFuY2UuY29uc3RydWN0b3I7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBfY29uc3RydWN0b3IgJiYgKF9jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBfY29uc3RydWN0b3IubmFtZSkgfHwgJ1JlYWN0Q2xhc3MnO1xuICAgIHZhciB3YXJuaW5nS2V5ID0gY29tcG9uZW50TmFtZSArIFwiLlwiICsgY2FsbGVyTmFtZTtcblxuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlcnJvcihcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFwiICsgJ1RoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uICcgKyAnSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgICcgKyAnY2xhc3MgcHJvcGVydHkgd2l0aCB0aGUgZGVzaXJlZCBzdGF0ZSBpbiB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNvbXBvbmVudE5hbWUpO1xuXG4gICAgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldID0gdHJ1ZTtcbiAgfVxufVxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xuXG5cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGlzIGNvbXBvc2l0ZSBjb21wb25lbnQgaXMgbW91bnRlZC5cbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2Ugd2Ugd2FudCB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gICAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gICAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gICAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjb21wbGV0ZVN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAncmVwbGFjZVN0YXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBUaGlzIG9ubHkgZXhpc3RzIGJlY2F1c2UgX3BlbmRpbmdTdGF0ZSBpc1xuICAgKiBpbnRlcm5hbC4gVGhpcyBwcm92aWRlcyBhIG1lcmdpbmcgc3RyYXRlZ3kgdGhhdCBpcyBub3QgYXZhaWxhYmxlIHRvIGRlZXBcbiAgICogcHJvcGVydGllcyB3aGljaCBpcyBjb25mdXNpbmcuIFRPRE86IEV4cG9zZSBwZW5kaW5nU3RhdGUgb3IgZG9uJ3QgdXNlIGl0XG4gICAqIGR1cmluZyB0aGUgbWVyZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBOYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVTZXRTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcblxue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cblxuXG5mdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0OyAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cblxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDsgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCB1cGRhdGVyIGJ1dCB0aGUgcmVhbCBvbmUgZ2V0cyBpbmplY3RlZCBieSB0aGVcbiAgLy8gcmVuZGVyZXIuXG5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCEodHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyB8fCBwYXJ0aWFsU3RhdGUgPT0gbnVsbCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlU2V0U3RhdGUodGhpcywgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgJ3NldFN0YXRlJyk7XG59O1xuLyoqXG4gKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAqXG4gKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICpcbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cblxuXG5Db21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcywgY2FsbGJhY2ssICdmb3JjZVVwZGF0ZScpO1xufTtcbi8qKlxuICogRGVwcmVjYXRlZCBBUElzLiBUaGVzZSBBUElzIHVzZWQgdG8gZXhpc3Qgb24gY2xhc3NpYyBSZWFjdCBjbGFzc2VzIGJ1dCBzaW5jZVxuICogd2Ugd291bGQgbGlrZSB0byBkZXByZWNhdGUgdGhlbSwgd2UncmUgbm90IGdvaW5nIHRvIG1vdmUgdGhlbSBvdmVyIHRvIHRoaXNcbiAqIG1vZGVybiBiYXNlIGNsYXNzLiBJbnN0ZWFkLCB3ZSBkZWZpbmUgYSBnZXR0ZXIgdGhhdCB3YXJucyBpZiBpdCdzIGFjY2Vzc2VkLlxuICovXG5cblxue1xuICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgaXNNb3VudGVkOiBbJ2lzTW91bnRlZCcsICdJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiAnICsgJ2NvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLiddLFxuICAgIHJlcGxhY2VTdGF0ZTogWydyZXBsYWNlU3RhdGUnLCAnUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgJyArICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMyMzYpLiddXG4gIH07XG5cbiAgdmFyIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBpbmZvKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB3YXJuKCclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgZm9yICh2YXIgZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRBUElzLmhhc093blByb3BlcnR5KGZuTmFtZSkpIHtcbiAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBDb21wb25lbnREdW1teSgpIHt9XG5cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG4vKipcbiAqIENvbnZlbmllbmNlIGNvbXBvbmVudCB3aXRoIGRlZmF1bHQgc2hhbGxvdyBlcXVhbGl0eSBjaGVjayBmb3Igc0NVLlxuICovXG5cbmZ1bmN0aW9uIFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0OyAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cblxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxudmFyIHB1cmVDb21wb25lbnRQcm90b3R5cGUgPSBQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFB1cmVDb21wb25lbnQ7IC8vIEF2b2lkIGFuIGV4dHJhIHByb3RvdHlwZSBqdW1wIGZvciB0aGVzZSBtZXRob2RzLlxuXG5fYXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xuXG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gdHJ1ZTtcblxuLy8gYW4gaW1tdXRhYmxlIG9iamVjdCB3aXRoIGEgc2luZ2xlIG11dGFibGUgdmFsdWVcbmZ1bmN0aW9uIGNyZWF0ZVJlZigpIHtcbiAgdmFyIHJlZk9iamVjdCA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG5cbiAge1xuICAgIE9iamVjdC5zZWFsKHJlZk9iamVjdCk7XG4gIH1cblxuICByZXR1cm4gcmVmT2JqZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRXcmFwcGVkTmFtZShvdXRlclR5cGUsIGlubmVyVHlwZSwgd3JhcHBlck5hbWUpIHtcbiAgdmFyIGZ1bmN0aW9uTmFtZSA9IGlubmVyVHlwZS5kaXNwbGF5TmFtZSB8fCBpbm5lclR5cGUubmFtZSB8fCAnJztcbiAgcmV0dXJuIG91dGVyVHlwZS5kaXNwbGF5TmFtZSB8fCAoZnVuY3Rpb25OYW1lICE9PSAnJyA/IHdyYXBwZXJOYW1lICsgXCIoXCIgKyBmdW5jdGlvbk5hbWUgKyBcIilcIiA6IHdyYXBwZXJOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGV4dE5hbWUodHlwZSkge1xuICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCAnQ29udGV4dCc7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUodHlwZSkge1xuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgLy8gSG9zdCByb290LCB0ZXh0IG5vZGUgb3IganVzdCBpbnZhbGlkIHR5cGUuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB7XG4gICAgaWYgKHR5cGVvZiB0eXBlLnRhZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGVycm9yKCdSZWNlaXZlZCBhbiB1bmV4cGVjdGVkIG9iamVjdCBpbiBnZXRDb21wb25lbnROYW1lKCkuICcgKyAnVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBudWxsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBleHBvcnRzLkZyYWdtZW50OlxuICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG5cbiAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgcmV0dXJuICdQb3J0YWwnO1xuXG4gICAgY2FzZSBleHBvcnRzLlByb2ZpbGVyOlxuICAgICAgcmV0dXJuICdQcm9maWxlcic7XG5cbiAgICBjYXNlIGV4cG9ydHMuU3RyaWN0TW9kZTpcbiAgICAgIHJldHVybiAnU3RyaWN0TW9kZSc7XG5cbiAgICBjYXNlIGV4cG9ydHMuU3VzcGVuc2U6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlJztcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZUxpc3QnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHN3aXRjaCAodHlwZS4kJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgIHZhciBjb250ZXh0ID0gdHlwZTtcbiAgICAgICAgcmV0dXJuIGdldENvbnRleHROYW1lKGNvbnRleHQpICsgJy5Db25zdW1lcic7XG5cbiAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgdmFyIHByb3ZpZGVyID0gdHlwZTtcbiAgICAgICAgcmV0dXJuIGdldENvbnRleHROYW1lKHByb3ZpZGVyLl9jb250ZXh0KSArICcuUHJvdmlkZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRXcmFwcGVkTmFtZSh0eXBlLCB0eXBlLnJlbmRlciwgJ0ZvcndhcmRSZWYnKTtcblxuICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSk7XG5cbiAgICAgIGNhc2UgUkVBQ1RfQkxPQ0tfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS5fcmVuZGVyKTtcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbGF6eUNvbXBvbmVudCA9IHR5cGU7XG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBsYXp5Q29tcG9uZW50Ll9wYXlsb2FkO1xuICAgICAgICAgIHZhciBpbml0ID0gbGF6eUNvbXBvbmVudC5faW5pdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZShpbml0KHBheWxvYWQpKTtcbiAgICAgICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24sIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duLCBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzO1xuXG57XG4gIGRpZFdhcm5BYm91dFN0cmluZ1JlZnMgPSB7fTtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRSZWYoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdyZWYnKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAncmVmJykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5yZWYgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdrZXknKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAna2V5JykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAge1xuICAgICAgaWYgKCFzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bikge1xuICAgICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHRydWU7XG5cbiAgICAgICAgZXJyb3IoJyVzOiBga2V5YCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3NwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdrZXknLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ1JlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdhcm5BYm91dEFjY2Vzc2luZ1JlZi5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ3JlZicsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ1JlZixcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcpIHtcbiAge1xuICAgIGlmICh0eXBlb2YgY29uZmlnLnJlZiA9PT0gJ3N0cmluZycgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCAmJiBjb25maWcuX19zZWxmICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuc3RhdGVOb2RlICE9PSBjb25maWcuX19zZWxmKSB7XG4gICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcblxuICAgICAgaWYgKCFkaWRXYXJuQWJvdXRTdHJpbmdSZWZzW2NvbXBvbmVudE5hbWVdKSB7XG4gICAgICAgIGVycm9yKCdDb21wb25lbnQgXCIlc1wiIGNvbnRhaW5zIHRoZSBzdHJpbmcgcmVmIFwiJXNcIi4gJyArICdTdXBwb3J0IGZvciBzdHJpbmcgcmVmcyB3aWxsIGJlIHJlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gJyArICdUaGlzIGNhc2UgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgY29udmVydGVkIHRvIGFuIGFycm93IGZ1bmN0aW9uLiAnICsgJ1dlIGFzayB5b3UgdG8gbWFudWFsbHkgZml4IHRoaXMgY2FzZSBieSB1c2luZyB1c2VSZWYoKSBvciBjcmVhdGVSZWYoKSBpbnN0ZWFkLiAnICsgJ0xlYXJuIG1vcmUgYWJvdXQgdXNpbmcgcmVmcyBzYWZlbHkgaGVyZTogJyArICdodHRwczovL3JlYWN0anMub3JnL2xpbmsvc3RyaWN0LW1vZGUtc3RyaW5nLXJlZicsIGNvbXBvbmVudE5hbWUsIGNvbmZpZy5yZWYpO1xuXG4gICAgICAgIGRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgbm90IHdvcmsuIEluc3RlYWQgdGVzdCAkJHR5cGVvZiBmaWVsZCBhZ2FpbnN0IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSB0byBjaGVja1xuICogaWYgc29tZXRoaW5nIGlzIGEgUmVhY3QgRWxlbWVudC5cbiAqXG4gKiBAcGFyYW0geyp9IHR5cGVcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBwYXJhbSB7Kn0ga2V5XG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJlZlxuICogQHBhcmFtIHsqfSBvd25lclxuICogQHBhcmFtIHsqfSBzZWxmIEEgKnRlbXBvcmFyeSogaGVscGVyIHRvIGRldGVjdCBwbGFjZXMgd2hlcmUgYHRoaXNgIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSB0aGUgYG93bmVyYCB3aGVuIFJlYWN0LmNyZWF0ZUVsZW1lbnQgaXMgY2FsbGVkLCBzbyB0aGF0IHdlXG4gKiBjYW4gd2Fybi4gV2Ugd2FudCB0byBnZXQgcmlkIG9mIG93bmVyIGFuZCByZXBsYWNlIHN0cmluZyBgcmVmYHMgd2l0aCBhcnJvd1xuICogZnVuY3Rpb25zLCBhbmQgYXMgbG9uZyBhcyBgdGhpc2AgYW5kIG93bmVyIGFyZSB0aGUgc2FtZSwgdGhlcmUgd2lsbCBiZSBub1xuICogY2hhbmdlIGluIGJlaGF2aW9yLlxuICogQHBhcmFtIHsqfSBzb3VyY2UgQW4gYW5ub3RhdGlvbiBvYmplY3QgKGFkZGVkIGJ5IGEgdHJhbnNwaWxlciBvciBvdGhlcndpc2UpXG4gKiBpbmRpY2F0aW5nIGZpbGVuYW1lLCBsaW5lIG51bWJlciwgYW5kL29yIG90aGVyIGluZm9ybWF0aW9uLlxuICogQGludGVybmFsXG4gKi9cblxuXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICB7XG4gICAgLy8gVGhlIHZhbGlkYXRpb24gZmxhZyBpcyBjdXJyZW50bHkgbXV0YXRpdmUuIFdlIHB1dCBpdCBvblxuICAgIC8vIGFuIGV4dGVybmFsIGJhY2tpbmcgc3RvcmUgc28gdGhhdCB3ZSBjYW4gZnJlZXplIHRoZSB3aG9sZSBvYmplY3QuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIFdlYWtNYXAgb25jZSB0aGV5IGFyZSBpbXBsZW1lbnRlZCBpblxuICAgIC8vIGNvbW1vbmx5IHVzZWQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzLlxuICAgIGVsZW1lbnQuX3N0b3JlID0ge307IC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7IC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pOyAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcbi8qKlxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IG9mIHRoZSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG4gIHZhciBwcm9wcyA9IHt9O1xuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7XG4gIHZhciBzZWxmID0gbnVsbDtcbiAgdmFyIHNvdXJjZSA9IG51bGw7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG5cbiAgICAgIHtcbiAgICAgICAgd2FybklmU3RyaW5nUmVmQ2Fubm90QmVBdXRvQ29udmVydGVkKGNvbmZpZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICBzZWxmID0gY29uZmlnLl9fc2VsZiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NlbGY7XG4gICAgc291cmNlID0gY29uZmlnLl9fc291cmNlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc291cmNlOyAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuXG5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG5cbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuXG4gICAge1xuICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH0gLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG5cblxuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcblxuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB7XG4gICAgaWYgKGtleSB8fCByZWYpIHtcbiAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59XG5mdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnJlZiwgb2xkRWxlbWVudC5fc2VsZiwgb2xkRWxlbWVudC5fc291cmNlLCBvbGRFbGVtZW50Ll9vd25lciwgb2xkRWxlbWVudC5wcm9wcyk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY2xvbmVlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gY2xvbmVFbGVtZW50KGVsZW1lbnQsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgaWYgKCEhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcIlJlYWN0LmNsb25lRWxlbWVudCguLi4pOiBUaGUgYXJndW1lbnQgbXVzdCBiZSBhIFJlYWN0IGVsZW1lbnQsIGJ1dCB5b3UgcGFzc2VkIFwiICsgZWxlbWVudCArIFwiLlwiICk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb3BOYW1lOyAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG5cbiAgdmFyIHByb3BzID0gX2Fzc2lnbih7fSwgZWxlbWVudC5wcm9wcyk7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuXG4gIHZhciBrZXkgPSBlbGVtZW50LmtleTtcbiAgdmFyIHJlZiA9IGVsZW1lbnQucmVmOyAvLyBTZWxmIGlzIHByZXNlcnZlZCBzaW5jZSB0aGUgb3duZXIgaXMgcHJlc2VydmVkLlxuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjsgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG5cbiAgdmFyIHNvdXJjZSA9IGVsZW1lbnQuX3NvdXJjZTsgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuXG4gIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICAvLyBTaWxlbnRseSBzdGVhbCB0aGUgcmVmIGZyb20gdGhlIHBhcmVudC5cbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgICBvd25lciA9IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9IC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG5cblxuICAgIHZhciBkZWZhdWx0UHJvcHM7XG5cbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBkZWZhdWx0UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuXG5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG5cbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuXG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudChlbGVtZW50LnR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcyk7XG59XG4vKipcbiAqIFZlcmlmaWVzIHRoZSBvYmplY3QgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2lzdmFsaWRlbGVtZW50XG4gKiBAcGFyYW0gez9vYmplY3R9IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBgb2JqZWN0YCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIEBmaW5hbFxuICovXG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufVxuXG52YXIgU0VQQVJBVE9SID0gJy4nO1xudmFyIFNVQlNFUEFSQVRPUiA9ICc6Jztcbi8qKlxuICogRXNjYXBlIGFuZCB3cmFwIGtleSBzbyBpdCBpcyBzYWZlIHRvIHVzZSBhcyBhIHJlYWN0aWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIGJlIGVzY2FwZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBlc2NhcGVkIGtleS5cbiAqL1xuXG5mdW5jdGlvbiBlc2NhcGUoa2V5KSB7XG4gIHZhciBlc2NhcGVSZWdleCA9IC9bPTpdL2c7XG4gIHZhciBlc2NhcGVyTG9va3VwID0ge1xuICAgICc9JzogJz0wJyxcbiAgICAnOic6ICc9MidcbiAgfTtcbiAgdmFyIGVzY2FwZWRTdHJpbmcgPSBrZXkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcbiAgcmV0dXJuICckJyArIGVzY2FwZWRTdHJpbmc7XG59XG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG5cbnZhciBkaWRXYXJuQWJvdXRNYXBzID0gZmFsc2U7XG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuXG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LCAnJCYvJyk7XG59XG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBlbGVtZW50IHdpdGhpbiBhIHNldC5cbiAqXG4gKiBAcGFyYW0geyp9IGVsZW1lbnQgQSBlbGVtZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiBnZXRFbGVtZW50S2V5KGVsZW1lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIGVsZW1lbnQgIT09IG51bGwgJiYgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBlc2NhcGUoJycgKyBlbGVtZW50LmtleSk7XG4gIH0gLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcblxuXG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIG1hcEludG9BcnJheShjaGlsZHJlbiwgYXJyYXksIGVzY2FwZWRQcmVmaXgsIG5hbWVTb0ZhciwgY2FsbGJhY2spIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG5cbiAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIC8vIEFsbCBvZiB0aGUgYWJvdmUgYXJlIHBlcmNlaXZlZCBhcyBudWxsLlxuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIHZhciBpbnZva2VDYWxsYmFjayA9IGZhbHNlO1xuXG4gIGlmIChjaGlsZHJlbiA9PT0gbnVsbCkge1xuICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBzd2l0Y2ggKGNoaWxkcmVuLiQkdHlwZW9mKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgaWYgKGludm9rZUNhbGxiYWNrKSB7XG4gICAgdmFyIF9jaGlsZCA9IGNoaWxkcmVuO1xuICAgIHZhciBtYXBwZWRDaGlsZCA9IGNhbGxiYWNrKF9jaGlsZCk7IC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93czpcblxuICAgIHZhciBjaGlsZEtleSA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgKyBnZXRFbGVtZW50S2V5KF9jaGlsZCwgMCkgOiBuYW1lU29GYXI7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICAgIHZhciBlc2NhcGVkQ2hpbGRLZXkgPSAnJztcblxuICAgICAgaWYgKGNoaWxkS2V5ICE9IG51bGwpIHtcbiAgICAgICAgZXNjYXBlZENoaWxkS2V5ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KGNoaWxkS2V5KSArICcvJztcbiAgICAgIH1cblxuICAgICAgbWFwSW50b0FycmF5KG1hcHBlZENoaWxkLCBhcnJheSwgZXNjYXBlZENoaWxkS2V5LCAnJywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgICAgbWFwcGVkQ2hpbGQgPSBjbG9uZUFuZFJlcGxhY2VLZXkobWFwcGVkQ2hpbGQsIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAgICBlc2NhcGVkUHJlZml4ICsgKCAvLyAkRmxvd0ZpeE1lIEZsb3cgaW5jb3JyZWN0bHkgdGhpbmtzIFJlYWN0LlBvcnRhbCBkb2Vzbid0IGhhdmUgYSBrZXlcbiAgICAgICAgbWFwcGVkQ2hpbGQua2V5ICYmICghX2NoaWxkIHx8IF9jaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSkgPyAvLyAkRmxvd0ZpeE1lIEZsb3cgaW5jb3JyZWN0bHkgdGhpbmtzIGV4aXN0aW5nIGVsZW1lbnQncyBrZXkgY2FuIGJlIGEgbnVtYmVyXG4gICAgICAgIGVzY2FwZVVzZXJQcm92aWRlZEtleSgnJyArIG1hcHBlZENoaWxkLmtleSkgKyAnLycgOiAnJykgKyBjaGlsZEtleSk7XG4gICAgICB9XG5cbiAgICAgIGFycmF5LnB1c2gobWFwcGVkQ2hpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkO1xuICB2YXIgbmV4dE5hbWU7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRFbGVtZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSBtYXBJbnRvQXJyYXkoY2hpbGQsIGFycmF5LCBlc2NhcGVkUHJlZml4LCBuZXh0TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuXG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgaXRlcmFibGVDaGlsZHJlbiA9IGNoaWxkcmVuO1xuXG4gICAgICB7XG4gICAgICAgIC8vIFdhcm4gYWJvdXQgdXNpbmcgTWFwcyBhcyBjaGlsZHJlblxuICAgICAgICBpZiAoaXRlcmF0b3JGbiA9PT0gaXRlcmFibGVDaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgICAgaWYgKCFkaWRXYXJuQWJvdXRNYXBzKSB7XG4gICAgICAgICAgICB3YXJuKCdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnVXNlIGFuIGFycmF5IG9mIGtleWVkIFJlYWN0RWxlbWVudHMgaW5zdGVhZC4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwoaXRlcmFibGVDaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHZhciBpaSA9IDA7XG5cbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0RWxlbWVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgIHN1YnRyZWVDb3VudCArPSBtYXBJbnRvQXJyYXkoY2hpbGQsIGFycmF5LCBlc2NhcGVkUHJlZml4LCBuZXh0TmFtZSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9ICcnICsgY2hpbGRyZW47XG5cbiAgICAgIHtcbiAgICAgICAge1xuICAgICAgICAgIHRocm93IEVycm9yKCBcIk9iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogXCIgKyAoY2hpbGRyZW5TdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9JyA6IGNoaWxkcmVuU3RyaW5nKSArIFwiKS4gSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSBpbnN0ZWFkLlwiICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VidHJlZUNvdW50O1xufVxuXG4vKipcbiAqIE1hcHMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm1hcFxuICpcbiAqIFRoZSBwcm92aWRlZCBtYXBGdW5jdGlvbihjaGlsZCwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmdW5jIFRoZSBtYXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgQ29udGV4dCBmb3IgbWFwRnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBvcmRlcmVkIG1hcCBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuYywgY29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGNvdW50ID0gMDtcbiAgbWFwSW50b0FycmF5KGNoaWxkcmVuLCByZXN1bHQsICcnLCAnJywgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgY291bnQrKyk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXNcbiAqIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuXG5cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgdmFyIG4gPSAwO1xuICBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKCkge1xuICAgIG4rKzsgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nXG4gIH0pO1xuICByZXR1cm4gbjtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKCkge1xuICAgIGZvckVhY2hGdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vIERvbid0IHJldHVybiBhbnl0aGluZy5cbiAgfSwgZm9yRWFjaENvbnRleHQpO1xufVxuLyoqXG4gKiBGbGF0dGVuIGEgY2hpbGRyZW4gb2JqZWN0ICh0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmApIGFuZFxuICogcmV0dXJuIGFuIGFycmF5IHdpdGggYXBwcm9wcmlhdGVseSByZS1rZXllZCBjaGlsZHJlbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW50b2FycmF5XG4gKi9cblxuXG5mdW5jdGlvbiB0b0FycmF5KGNoaWxkcmVuKSB7XG4gIHJldHVybiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9KSB8fCBbXTtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgY2hpbGQgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuIGFuZCB2ZXJpZmllcyB0aGF0IHRoZXJlXG4gKiBpcyBvbmx5IG9uZSBjaGlsZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5vbmx5XG4gKlxuICogVGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgYSBzaW5nbGUgY2hpbGQgZ2V0c1xuICogcGFzc2VkIHdpdGhvdXQgYSB3cmFwcGVyLCBidXQgdGhlIHB1cnBvc2Ugb2YgdGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMgdG9cbiAqIGFic3RyYWN0IGF3YXkgdGhlIHBhcnRpY3VsYXIgc3RydWN0dXJlIG9mIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gY2hpbGRyZW4gQ2hpbGQgY29sbGVjdGlvbiBzdHJ1Y3R1cmUuXG4gKiBAcmV0dXJuIHtSZWFjdEVsZW1lbnR9IFRoZSBmaXJzdCBhbmQgb25seSBgUmVhY3RFbGVtZW50YCBjb250YWluZWQgaW4gdGhlXG4gKiBzdHJ1Y3R1cmUuXG4gKi9cblxuXG5mdW5jdGlvbiBvbmx5Q2hpbGQoY2hpbGRyZW4pIHtcbiAgaWYgKCFpc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjaGlsZHJlbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGV4dChkZWZhdWx0VmFsdWUsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKSB7XG4gIGlmIChjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHtcbiAgICAgIGlmIChjYWxjdWxhdGVDaGFuZ2VkQml0cyAhPT0gbnVsbCAmJiB0eXBlb2YgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXJyb3IoJ2NyZWF0ZUNvbnRleHQ6IEV4cGVjdGVkIHRoZSBvcHRpb25hbCBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSAnICsgJ2Z1bmN0aW9uLiBJbnN0ZWFkIHJlY2VpdmVkOiAlcycsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgY29udGV4dCA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY2FsY3VsYXRlQ2hhbmdlZEJpdHMsXG4gICAgLy8gQXMgYSB3b3JrYXJvdW5kIHRvIHN1cHBvcnQgbXVsdGlwbGUgY29uY3VycmVudCByZW5kZXJlcnMsIHdlIGNhdGVnb3JpemVcbiAgICAvLyBzb21lIHJlbmRlcmVycyBhcyBwcmltYXJ5IGFuZCBvdGhlcnMgYXMgc2Vjb25kYXJ5LiBXZSBvbmx5IGV4cGVjdFxuICAgIC8vIHRoZXJlIHRvIGJlIHR3byBjb25jdXJyZW50IHJlbmRlcmVycyBhdCBtb3N0OiBSZWFjdCBOYXRpdmUgKHByaW1hcnkpIGFuZFxuICAgIC8vIEZhYnJpYyAoc2Vjb25kYXJ5KTsgUmVhY3QgRE9NIChwcmltYXJ5KSBhbmQgUmVhY3QgQVJUIChzZWNvbmRhcnkpLlxuICAgIC8vIFNlY29uZGFyeSByZW5kZXJlcnMgc3RvcmUgdGhlaXIgY29udGV4dCB2YWx1ZXMgb24gc2VwYXJhdGUgZmllbGRzLlxuICAgIF9jdXJyZW50VmFsdWU6IGRlZmF1bHRWYWx1ZSxcbiAgICBfY3VycmVudFZhbHVlMjogZGVmYXVsdFZhbHVlLFxuICAgIC8vIFVzZWQgdG8gdHJhY2sgaG93IG1hbnkgY29uY3VycmVudCByZW5kZXJlcnMgdGhpcyBjb250ZXh0IGN1cnJlbnRseVxuICAgIC8vIHN1cHBvcnRzIHdpdGhpbiBpbiBhIHNpbmdsZSByZW5kZXJlci4gU3VjaCBhcyBwYXJhbGxlbCBzZXJ2ZXIgcmVuZGVyaW5nLlxuICAgIF90aHJlYWRDb3VudDogMCxcbiAgICAvLyBUaGVzZSBhcmUgY2lyY3VsYXJcbiAgICBQcm92aWRlcjogbnVsbCxcbiAgICBDb25zdW1lcjogbnVsbFxuICB9O1xuICBjb250ZXh0LlByb3ZpZGVyID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9QUk9WSURFUl9UWVBFLFxuICAgIF9jb250ZXh0OiBjb250ZXh0XG4gIH07XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IGZhbHNlO1xuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSBmYWxzZTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0RGlzcGxheU5hbWVPbkNvbnN1bWVyID0gZmFsc2U7XG5cbiAge1xuICAgIC8vIEEgc2VwYXJhdGUgb2JqZWN0LCBidXQgcHJveGllcyBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb250ZXh0IG9iamVjdCBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gSXQgaGFzIGEgZGlmZmVyZW50ICQkdHlwZW9mLCBzbyB3ZSBjYW4gcHJvcGVybHlcbiAgICAvLyB3YXJuIGZvciB0aGUgaW5jb3JyZWN0IHVzYWdlIG9mIENvbnRleHQgYXMgYSBDb25zdW1lci5cbiAgICB2YXIgQ29uc3VtZXIgPSB7XG4gICAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgICAgX2NvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNvbnRleHQuX2NhbGN1bGF0ZUNoYW5nZWRCaXRzXG4gICAgfTsgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbm90IHNldHRpbmcgYSB2YWx1ZSwgd2hpY2ggaXMgaW50ZW50aW9uYWwgaGVyZVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ29uc3VtZXIsIHtcbiAgICAgIFByb3ZpZGVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gdHJ1ZTtcblxuICAgICAgICAgICAgZXJyb3IoJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Qcm92aWRlcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Qcm92aWRlcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Qcm92aWRlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX1Byb3ZpZGVyKSB7XG4gICAgICAgICAgY29udGV4dC5Qcm92aWRlciA9IF9Qcm92aWRlcjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZSA9IF9jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlMjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlMjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZTIpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUyID0gX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfdGhyZWFkQ291bnQ6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX3RocmVhZENvdW50O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfdGhyZWFkQ291bnQpIHtcbiAgICAgICAgICBjb250ZXh0Ll90aHJlYWRDb3VudCA9IF90aHJlYWRDb3VudDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENvbnN1bWVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gdHJ1ZTtcblxuICAgICAgICAgICAgZXJyb3IoJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Db25zdW1lcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Db25zdW1lcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Db25zdW1lcjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRpc3BsYXlOYW1lOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0LmRpc3BsYXlOYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChkaXNwbGF5TmFtZSkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXREaXNwbGF5TmFtZU9uQ29uc3VtZXIpIHtcbiAgICAgICAgICAgIHdhcm4oJ1NldHRpbmcgYGRpc3BsYXlOYW1lYCBvbiBDb250ZXh0LkNvbnN1bWVyIGhhcyBubyBlZmZlY3QuICcgKyBcIllvdSBzaG91bGQgc2V0IGl0IGRpcmVjdGx5IG9uIHRoZSBjb250ZXh0IHdpdGggQ29udGV4dC5kaXNwbGF5TmFtZSA9ICclcycuXCIsIGRpc3BsYXlOYW1lKTtcblxuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXREaXNwbGF5TmFtZU9uQ29uc3VtZXIgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pOyAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBtaXNzaW5nIHByb3BlcnRpZXMgYmVjYXVzZSBpdCBkb2Vzbid0IHVuZGVyc3RhbmQgZGVmaW5lUHJvcGVydHlcblxuICAgIGNvbnRleHQuQ29uc3VtZXIgPSBDb25zdW1lcjtcbiAgfVxuXG4gIHtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIgPSBudWxsO1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlcjIgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbnZhciBVbmluaXRpYWxpemVkID0gLTE7XG52YXIgUGVuZGluZyA9IDA7XG52YXIgUmVzb2x2ZWQgPSAxO1xudmFyIFJlamVjdGVkID0gMjtcblxuZnVuY3Rpb24gbGF6eUluaXRpYWxpemVyKHBheWxvYWQpIHtcbiAgaWYgKHBheWxvYWQuX3N0YXR1cyA9PT0gVW5pbml0aWFsaXplZCkge1xuICAgIHZhciBjdG9yID0gcGF5bG9hZC5fcmVzdWx0O1xuICAgIHZhciB0aGVuYWJsZSA9IGN0b3IoKTsgLy8gVHJhbnNpdGlvbiB0byB0aGUgbmV4dCBzdGF0ZS5cblxuICAgIHZhciBwZW5kaW5nID0gcGF5bG9hZDtcbiAgICBwZW5kaW5nLl9zdGF0dXMgPSBQZW5kaW5nO1xuICAgIHBlbmRpbmcuX3Jlc3VsdCA9IHRoZW5hYmxlO1xuICAgIHRoZW5hYmxlLnRoZW4oZnVuY3Rpb24gKG1vZHVsZU9iamVjdCkge1xuICAgICAgaWYgKHBheWxvYWQuX3N0YXR1cyA9PT0gUGVuZGluZykge1xuICAgICAgICB2YXIgZGVmYXVsdEV4cG9ydCA9IG1vZHVsZU9iamVjdC5kZWZhdWx0O1xuXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdEV4cG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlcnJvcignbGF6eTogRXhwZWN0ZWQgdGhlIHJlc3VsdCBvZiBhIGR5bmFtaWMgaW1wb3J0KCkgY2FsbC4gJyArICdJbnN0ZWFkIHJlY2VpdmVkOiAlc1xcblxcbllvdXIgY29kZSBzaG91bGQgbG9vayBsaWtlOiBcXG4gICcgKyAvLyBCcmVhayB1cCBpbXBvcnRzIHRvIGF2b2lkIGFjY2lkZW50YWxseSBwYXJzaW5nIHRoZW0gYXMgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgJ2NvbnN0IE15Q29tcG9uZW50ID0gbGF6eSgoKSA9PiBpbXAnICsgXCJvcnQoJy4vTXlDb21wb25lbnQnKSlcIiwgbW9kdWxlT2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gLy8gVHJhbnNpdGlvbiB0byB0aGUgbmV4dCBzdGF0ZS5cblxuXG4gICAgICAgIHZhciByZXNvbHZlZCA9IHBheWxvYWQ7XG4gICAgICAgIHJlc29sdmVkLl9zdGF0dXMgPSBSZXNvbHZlZDtcbiAgICAgICAgcmVzb2x2ZWQuX3Jlc3VsdCA9IGRlZmF1bHRFeHBvcnQ7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBpZiAocGF5bG9hZC5fc3RhdHVzID09PSBQZW5kaW5nKSB7XG4gICAgICAgIC8vIFRyYW5zaXRpb24gdG8gdGhlIG5leHQgc3RhdGUuXG4gICAgICAgIHZhciByZWplY3RlZCA9IHBheWxvYWQ7XG4gICAgICAgIHJlamVjdGVkLl9zdGF0dXMgPSBSZWplY3RlZDtcbiAgICAgICAgcmVqZWN0ZWQuX3Jlc3VsdCA9IGVycm9yO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHBheWxvYWQuX3N0YXR1cyA9PT0gUmVzb2x2ZWQpIHtcbiAgICByZXR1cm4gcGF5bG9hZC5fcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHRocm93IHBheWxvYWQuX3Jlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBsYXp5KGN0b3IpIHtcbiAgdmFyIHBheWxvYWQgPSB7XG4gICAgLy8gV2UgdXNlIHRoZXNlIGZpZWxkcyB0byBzdG9yZSB0aGUgcmVzdWx0LlxuICAgIF9zdGF0dXM6IC0xLFxuICAgIF9yZXN1bHQ6IGN0b3JcbiAgfTtcbiAgdmFyIGxhenlUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9MQVpZX1RZUEUsXG4gICAgX3BheWxvYWQ6IHBheWxvYWQsXG4gICAgX2luaXQ6IGxhenlJbml0aWFsaXplclxuICB9O1xuXG4gIHtcbiAgICAvLyBJbiBwcm9kdWN0aW9uLCB0aGlzIHdvdWxkIGp1c3Qgc2V0IGl0IG9uIHRoZSBvYmplY3QuXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcbiAgICB2YXIgcHJvcFR5cGVzOyAvLyAkRmxvd0ZpeE1lXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhsYXp5VHlwZSwge1xuICAgICAgZGVmYXVsdFByb3BzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZmF1bHRQcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3RGVmYXVsdFByb3BzKSB7XG4gICAgICAgICAgZXJyb3IoJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYGRlZmF1bHRQcm9wc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcblxuICAgICAgICAgIGRlZmF1bHRQcm9wcyA9IG5ld0RlZmF1bHRQcm9wczsgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZVxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAnZGVmYXVsdFByb3BzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BUeXBlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3UHJvcFR5cGVzKSB7XG4gICAgICAgICAgZXJyb3IoJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYHByb3BUeXBlc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcblxuICAgICAgICAgIHByb3BUeXBlcyA9IG5ld1Byb3BUeXBlczsgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZVxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAncHJvcFR5cGVzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbGF6eVR5cGU7XG59XG5cbmZ1bmN0aW9uIGZvcndhcmRSZWYocmVuZGVyKSB7XG4gIHtcbiAgICBpZiAocmVuZGVyICE9IG51bGwgJiYgcmVuZGVyLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpIHtcbiAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCByZWNlaXZlZCBhIGBtZW1vYCAnICsgJ2NvbXBvbmVudC4gSW5zdGVhZCBvZiBmb3J3YXJkUmVmKG1lbW8oLi4uKSksIHVzZSAnICsgJ21lbW8oZm9yd2FyZFJlZiguLi4pKS4nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZW5kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCB3YXMgZ2l2ZW4gJXMuJywgcmVuZGVyID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZW5kZXIubGVuZ3RoICE9PSAwICYmIHJlbmRlci5sZW5ndGggIT09IDIpIHtcbiAgICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBhY2NlcHQgZXhhY3RseSB0d28gcGFyYW1ldGVyczogcHJvcHMgYW5kIHJlZi4gJXMnLCByZW5kZXIubGVuZ3RoID09PSAxID8gJ0RpZCB5b3UgZm9yZ2V0IHRvIHVzZSB0aGUgcmVmIHBhcmFtZXRlcj8nIDogJ0FueSBhZGRpdGlvbmFsIHBhcmFtZXRlciB3aWxsIGJlIHVuZGVmaW5lZC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVuZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZW5kZXIuZGVmYXVsdFByb3BzICE9IG51bGwgfHwgcmVuZGVyLnByb3BUeXBlcyAhPSBudWxsKSB7XG4gICAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgcHJvcFR5cGVzIG9yIGRlZmF1bHRQcm9wcy4gJyArICdEaWQgeW91IGFjY2lkZW50YWxseSBwYXNzIGEgUmVhY3QgY29tcG9uZW50PycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBlbGVtZW50VHlwZSA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSxcbiAgICByZW5kZXI6IHJlbmRlclxuICB9O1xuXG4gIHtcbiAgICB2YXIgb3duTmFtZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudFR5cGUsICdkaXNwbGF5TmFtZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvd25OYW1lO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgb3duTmFtZSA9IG5hbWU7XG5cbiAgICAgICAgaWYgKHJlbmRlci5kaXNwbGF5TmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmVuZGVyLmRpc3BsYXlOYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRUeXBlO1xufVxuXG4vLyBGaWx0ZXIgY2VydGFpbiBET00gYXR0cmlidXRlcyAoZS5nLiBzcmMsIGhyZWYpIGlmIHRoZWlyIHZhbHVlcyBhcmUgZW1wdHkgc3RyaW5ncy5cblxudmFyIGVuYWJsZVNjb3BlQVBJID0gZmFsc2U7IC8vIEV4cGVyaW1lbnRhbCBDcmVhdGUgRXZlbnQgSGFuZGxlIEFQSS5cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIE5vdGU6IHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIChlLmcuIGlmIGl0J3MgYSBwb2x5ZmlsbCkuXG5cblxuICBpZiAodHlwZSA9PT0gZXhwb3J0cy5GcmFnbWVudCB8fCB0eXBlID09PSBleHBvcnRzLlByb2ZpbGVyIHx8IHR5cGUgPT09IFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFIHx8IHR5cGUgPT09IGV4cG9ydHMuU3RyaWN0TW9kZSB8fCB0eXBlID09PSBleHBvcnRzLlN1c3BlbnNlIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSB8fCB0eXBlWzBdID09PSBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBtZW1vKHR5cGUsIGNvbXBhcmUpIHtcbiAge1xuICAgIGlmICghaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpKSB7XG4gICAgICBlcnJvcignbWVtbzogVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBjb21wb25lbnQuIEluc3RlYWQgJyArICdyZWNlaXZlZDogJXMnLCB0eXBlID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBlbGVtZW50VHlwZSA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTUVNT19UWVBFLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgY29tcGFyZTogY29tcGFyZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbXBhcmVcbiAgfTtcblxuICB7XG4gICAgdmFyIG93bk5hbWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnRUeXBlLCAnZGlzcGxheU5hbWUnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gb3duTmFtZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIG93bk5hbWUgPSBuYW1lO1xuXG4gICAgICAgIGlmICh0eXBlLmRpc3BsYXlOYW1lID09IG51bGwpIHtcbiAgICAgICAgICB0eXBlLmRpc3BsYXlOYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRUeXBlO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRGlzcGF0Y2hlcigpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLmN1cnJlbnQ7XG5cbiAgaWYgKCEoZGlzcGF0Y2hlciAhPT0gbnVsbCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJJbnZhbGlkIGhvb2sgY2FsbC4gSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSBvZiB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4gVGhpcyBjb3VsZCBoYXBwZW4gZm9yIG9uZSBvZiB0aGUgZm9sbG93aW5nIHJlYXNvbnM6XFxuMS4gWW91IG1pZ2h0IGhhdmUgbWlzbWF0Y2hpbmcgdmVyc2lvbnMgb2YgUmVhY3QgYW5kIHRoZSByZW5kZXJlciAoc3VjaCBhcyBSZWFjdCBET00pXFxuMi4gWW91IG1pZ2h0IGJlIGJyZWFraW5nIHRoZSBSdWxlcyBvZiBIb29rc1xcbjMuIFlvdSBtaWdodCBoYXZlIG1vcmUgdGhhbiBvbmUgY29weSBvZiBSZWFjdCBpbiB0aGUgc2FtZSBhcHBcXG5TZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL2ludmFsaWQtaG9vay1jYWxsIGZvciB0aXBzIGFib3V0IGhvdyB0byBkZWJ1ZyBhbmQgZml4IHRoaXMgcHJvYmxlbS5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG5mdW5jdGlvbiB1c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG5cbiAge1xuICAgIGlmICh1bnN0YWJsZV9vYnNlcnZlZEJpdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IoJ3VzZUNvbnRleHQoKSBzZWNvbmQgYXJndW1lbnQgaXMgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSAnICsgJ3VzZSBpbiBSZWFjdC4gUGFzc2luZyBpdCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ1lvdSBwYXNzZWQ6ICVzLiVzJywgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzLCB0eXBlb2YgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1syXSkgPyAnXFxuXFxuRGlkIHlvdSBjYWxsIGFycmF5Lm1hcCh1c2VDb250ZXh0KT8gJyArICdDYWxsaW5nIEhvb2tzIGluc2lkZSBhIGxvb3AgaXMgbm90IHN1cHBvcnRlZC4gJyArICdMZWFybiBtb3JlIGF0IGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9ydWxlcy1vZi1ob29rcycgOiAnJyk7XG4gICAgfSAvLyBUT0RPOiBhZGQgYSBtb3JlIGdlbmVyaWMgd2FybmluZyBmb3IgaW52YWxpZCB2YWx1ZXMuXG5cblxuICAgIGlmIChDb250ZXh0Ll9jb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciByZWFsQ29udGV4dCA9IENvbnRleHQuX2NvbnRleHQ7IC8vIERvbid0IGRlZHVwbGljYXRlIGJlY2F1c2UgdGhpcyBsZWdpdGltYXRlbHkgY2F1c2VzIGJ1Z3NcbiAgICAgIC8vIGFuZCBub2JvZHkgc2hvdWxkIGJlIHVzaW5nIHRoaXMgaW4gZXhpc3RpbmcgY29kZS5cblxuICAgICAgaWYgKHJlYWxDb250ZXh0LkNvbnN1bWVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIGVycm9yKCdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Db25zdW1lcikgaXMgbm90IHN1cHBvcnRlZCwgbWF5IGNhdXNlIGJ1Z3MsIGFuZCB3aWxsIGJlICcgKyAncmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9IGVsc2UgaWYgKHJlYWxDb250ZXh0LlByb3ZpZGVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIGVycm9yKCdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Qcm92aWRlcikgaXMgbm90IHN1cHBvcnRlZC4gJyArICdEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpO1xufVxuZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbn1cbmZ1bmN0aW9uIHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCk7XG59XG5mdW5jdGlvbiB1c2VSZWYoaW5pdGlhbFZhbHVlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVmKGluaXRpYWxWYWx1ZSk7XG59XG5mdW5jdGlvbiB1c2VFZmZlY3QoY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VDYWxsYmFjayhjYWxsYmFjaywgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZU1lbW8oY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTWVtbyhjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pIHtcbiAge1xuICAgIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgICByZXR1cm4gZGlzcGF0Y2hlci51c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbik7XG4gIH1cbn1cblxuLy8gSGVscGVycyB0byBwYXRjaCBjb25zb2xlLmxvZ3MgdG8gYXZvaWQgbG9nZ2luZyBkdXJpbmcgc2lkZS1lZmZlY3QgZnJlZVxuLy8gcmVwbGF5aW5nIG9uIHJlbmRlciBmdW5jdGlvbi4gVGhpcyBjdXJyZW50bHkgb25seSBwYXRjaGVzIHRoZSBvYmplY3Rcbi8vIGxhemlseSB3aGljaCB3b24ndCBjb3ZlciBpZiB0aGUgbG9nIGZ1bmN0aW9uIHdhcyBleHRyYWN0ZWQgZWFnZXJseS5cbi8vIFdlIGNvdWxkIGFsc28gZWFnZXJseSBwYXRjaCB0aGUgbWV0aG9kLlxudmFyIGRpc2FibGVkRGVwdGggPSAwO1xudmFyIHByZXZMb2c7XG52YXIgcHJldkluZm87XG52YXIgcHJldldhcm47XG52YXIgcHJldkVycm9yO1xudmFyIHByZXZHcm91cDtcbnZhciBwcmV2R3JvdXBDb2xsYXBzZWQ7XG52YXIgcHJldkdyb3VwRW5kO1xuXG5mdW5jdGlvbiBkaXNhYmxlZExvZygpIHt9XG5cbmRpc2FibGVkTG9nLl9fcmVhY3REaXNhYmxlZExvZyA9IHRydWU7XG5mdW5jdGlvbiBkaXNhYmxlTG9ncygpIHtcbiAge1xuICAgIGlmIChkaXNhYmxlZERlcHRoID09PSAwKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICAgIHByZXZMb2cgPSBjb25zb2xlLmxvZztcbiAgICAgIHByZXZJbmZvID0gY29uc29sZS5pbmZvO1xuICAgICAgcHJldldhcm4gPSBjb25zb2xlLndhcm47XG4gICAgICBwcmV2RXJyb3IgPSBjb25zb2xlLmVycm9yO1xuICAgICAgcHJldkdyb3VwID0gY29uc29sZS5ncm91cDtcbiAgICAgIHByZXZHcm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQ7XG4gICAgICBwcmV2R3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kOyAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzE5MDk5XG5cbiAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZGlzYWJsZWRMb2csXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lIEZsb3cgdGhpbmtzIGNvbnNvbGUgaXMgaW1tdXRhYmxlLlxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb25zb2xlLCB7XG4gICAgICAgIGluZm86IHByb3BzLFxuICAgICAgICBsb2c6IHByb3BzLFxuICAgICAgICB3YXJuOiBwcm9wcyxcbiAgICAgICAgZXJyb3I6IHByb3BzLFxuICAgICAgICBncm91cDogcHJvcHMsXG4gICAgICAgIGdyb3VwQ29sbGFwc2VkOiBwcm9wcyxcbiAgICAgICAgZ3JvdXBFbmQ6IHByb3BzXG4gICAgICB9KTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgfVxuXG4gICAgZGlzYWJsZWREZXB0aCsrO1xuICB9XG59XG5mdW5jdGlvbiByZWVuYWJsZUxvZ3MoKSB7XG4gIHtcbiAgICBkaXNhYmxlZERlcHRoLS07XG5cbiAgICBpZiAoZGlzYWJsZWREZXB0aCA9PT0gMCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH07IC8vICRGbG93Rml4TWUgRmxvdyB0aGlua3MgY29uc29sZSBpcyBpbW11dGFibGUuXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbnNvbGUsIHtcbiAgICAgICAgbG9nOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2TG9nXG4gICAgICAgIH0pLFxuICAgICAgICBpbmZvOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2SW5mb1xuICAgICAgICB9KSxcbiAgICAgICAgd2FybjogX2Fzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldldhcm5cbiAgICAgICAgfSksXG4gICAgICAgIGVycm9yOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2RXJyb3JcbiAgICAgICAgfSksXG4gICAgICAgIGdyb3VwOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2R3JvdXBcbiAgICAgICAgfSksXG4gICAgICAgIGdyb3VwQ29sbGFwc2VkOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2R3JvdXBDb2xsYXBzZWRcbiAgICAgICAgfSksXG4gICAgICAgIGdyb3VwRW5kOiBfYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2R3JvdXBFbmRcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICB9XG5cbiAgICBpZiAoZGlzYWJsZWREZXB0aCA8IDApIHtcbiAgICAgIGVycm9yKCdkaXNhYmxlZERlcHRoIGZlbGwgYmVsb3cgemVyby4gJyArICdUaGlzIGlzIGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIFJlYWN0Q3VycmVudERpc3BhdGNoZXIkMSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0Q3VycmVudERpc3BhdGNoZXI7XG52YXIgcHJlZml4O1xuZnVuY3Rpb24gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUobmFtZSwgc291cmNlLCBvd25lckZuKSB7XG4gIHtcbiAgICBpZiAocHJlZml4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEV4dHJhY3QgdGhlIFZNIHNwZWNpZmljIHByZWZpeCB1c2VkIGJ5IGVhY2ggbGluZS5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHguc3RhY2sudHJpbSgpLm1hdGNoKC9cXG4oICooYXQgKT8pLyk7XG4gICAgICAgIHByZWZpeCA9IG1hdGNoICYmIG1hdGNoWzFdIHx8ICcnO1xuICAgICAgfVxuICAgIH0gLy8gV2UgdXNlIHRoZSBwcmVmaXggdG8gZW5zdXJlIG91ciBzdGFja3MgbGluZSB1cCB3aXRoIG5hdGl2ZSBzdGFjayBmcmFtZXMuXG5cblxuICAgIHJldHVybiAnXFxuJyArIHByZWZpeCArIG5hbWU7XG4gIH1cbn1cbnZhciByZWVudHJ5ID0gZmFsc2U7XG52YXIgY29tcG9uZW50RnJhbWVDYWNoZTtcblxue1xuICB2YXIgUG9zc2libHlXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgPyBXZWFrTWFwIDogTWFwO1xuICBjb21wb25lbnRGcmFtZUNhY2hlID0gbmV3IFBvc3NpYmx5V2Vha01hcCgpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZU5hdGl2ZUNvbXBvbmVudEZyYW1lKGZuLCBjb25zdHJ1Y3QpIHtcbiAgLy8gSWYgc29tZXRoaW5nIGFza2VkIGZvciBhIHN0YWNrIGluc2lkZSBhIGZha2UgcmVuZGVyLCBpdCBzaG91bGQgZ2V0IGlnbm9yZWQuXG4gIGlmICghZm4gfHwgcmVlbnRyeSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHtcbiAgICB2YXIgZnJhbWUgPSBjb21wb25lbnRGcmFtZUNhY2hlLmdldChmbik7XG5cbiAgICBpZiAoZnJhbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZyYW1lO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb250cm9sO1xuICByZWVudHJ5ID0gdHJ1ZTtcbiAgdmFyIHByZXZpb3VzUHJlcGFyZVN0YWNrVHJhY2UgPSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZTsgLy8gJEZsb3dGaXhNZSBJdCBkb2VzIGFjY2VwdCB1bmRlZmluZWQuXG5cbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSB1bmRlZmluZWQ7XG4gIHZhciBwcmV2aW91c0Rpc3BhdGNoZXI7XG5cbiAge1xuICAgIHByZXZpb3VzRGlzcGF0Y2hlciA9IFJlYWN0Q3VycmVudERpc3BhdGNoZXIkMS5jdXJyZW50OyAvLyBTZXQgdGhlIGRpc3BhdGNoZXIgaW4gREVWIGJlY2F1c2UgdGhpcyBtaWdodCBiZSBjYWxsIGluIHRoZSByZW5kZXIgZnVuY3Rpb25cbiAgICAvLyBmb3Igd2FybmluZ3MuXG5cbiAgICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyJDEuY3VycmVudCA9IG51bGw7XG4gICAgZGlzYWJsZUxvZ3MoKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gVGhpcyBzaG91bGQgdGhyb3cuXG4gICAgaWYgKGNvbnN0cnVjdCkge1xuICAgICAgLy8gU29tZXRoaW5nIHNob3VsZCBiZSBzZXR0aW5nIHRoZSBwcm9wcyBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgICB2YXIgRmFrZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgIH07IC8vICRGbG93Rml4TWVcblxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRmFrZS5wcm90b3R5cGUsICdwcm9wcycsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gV2UgdXNlIGEgdGhyb3dpbmcgc2V0dGVyIGluc3RlYWQgb2YgZnJvemVuIG9yIG5vbi13cml0YWJsZSBwcm9wc1xuICAgICAgICAgIC8vIGJlY2F1c2UgdGhhdCB3b24ndCB0aHJvdyBpbiBhIG5vbi1zdHJpY3QgbW9kZSBmdW5jdGlvbi5cbiAgICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyAmJiBSZWZsZWN0LmNvbnN0cnVjdCkge1xuICAgICAgICAvLyBXZSBjb25zdHJ1Y3QgYSBkaWZmZXJlbnQgY29udHJvbCBmb3IgdGhpcyBjYXNlIHRvIGluY2x1ZGUgYW55IGV4dHJhXG4gICAgICAgIC8vIGZyYW1lcyBhZGRlZCBieSB0aGUgY29uc3RydWN0IGNhbGwuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgUmVmbGVjdC5jb25zdHJ1Y3QoRmFrZSwgW10pO1xuICAgICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgICAgY29udHJvbCA9IHg7XG4gICAgICAgIH1cblxuICAgICAgICBSZWZsZWN0LmNvbnN0cnVjdChmbiwgW10sIEZha2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBGYWtlLmNhbGwoKTtcbiAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgICB9XG5cbiAgICAgICAgZm4uY2FsbChGYWtlLnByb3RvdHlwZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgfVxuXG4gICAgICBmbigpO1xuICAgIH1cbiAgfSBjYXRjaCAoc2FtcGxlKSB7XG4gICAgLy8gVGhpcyBpcyBpbmxpbmVkIG1hbnVhbGx5IGJlY2F1c2UgY2xvc3VyZSBkb2Vzbid0IGRvIGl0IGZvciB1cy5cbiAgICBpZiAoc2FtcGxlICYmIGNvbnRyb2wgJiYgdHlwZW9mIHNhbXBsZS5zdGFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFRoaXMgZXh0cmFjdHMgdGhlIGZpcnN0IGZyYW1lIGZyb20gdGhlIHNhbXBsZSB0aGF0IGlzbid0IGFsc28gaW4gdGhlIGNvbnRyb2wuXG4gICAgICAvLyBTa2lwcGluZyBvbmUgZnJhbWUgdGhhdCB3ZSBhc3N1bWUgaXMgdGhlIGZyYW1lIHRoYXQgY2FsbHMgdGhlIHR3by5cbiAgICAgIHZhciBzYW1wbGVMaW5lcyA9IHNhbXBsZS5zdGFjay5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgY29udHJvbExpbmVzID0gY29udHJvbC5zdGFjay5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgcyA9IHNhbXBsZUxpbmVzLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgYyA9IGNvbnRyb2xMaW5lcy5sZW5ndGggLSAxO1xuXG4gICAgICB3aGlsZSAocyA+PSAxICYmIGMgPj0gMCAmJiBzYW1wbGVMaW5lc1tzXSAhPT0gY29udHJvbExpbmVzW2NdKSB7XG4gICAgICAgIC8vIFdlIGV4cGVjdCBhdCBsZWFzdCBvbmUgc3RhY2sgZnJhbWUgdG8gYmUgc2hhcmVkLlxuICAgICAgICAvLyBUeXBpY2FsbHkgdGhpcyB3aWxsIGJlIHRoZSByb290IG1vc3Qgb25lLiBIb3dldmVyLCBzdGFjayBmcmFtZXMgbWF5IGJlXG4gICAgICAgIC8vIGN1dCBvZmYgZHVlIHRvIG1heGltdW0gc3RhY2sgbGltaXRzLiBJbiB0aGlzIGNhc2UsIG9uZSBtYXliZSBjdXQgb2ZmXG4gICAgICAgIC8vIGVhcmxpZXIgdGhhbiB0aGUgb3RoZXIuIFdlIGFzc3VtZSB0aGF0IHRoZSBzYW1wbGUgaXMgbG9uZ2VyIG9yIHRoZSBzYW1lXG4gICAgICAgIC8vIGFuZCB0aGVyZSBmb3IgY3V0IG9mZiBlYXJsaWVyLiBTbyB3ZSBzaG91bGQgZmluZCB0aGUgcm9vdCBtb3N0IGZyYW1lIGluXG4gICAgICAgIC8vIHRoZSBzYW1wbGUgc29tZXdoZXJlIGluIHRoZSBjb250cm9sLlxuICAgICAgICBjLS07XG4gICAgICB9XG5cbiAgICAgIGZvciAoOyBzID49IDEgJiYgYyA+PSAwOyBzLS0sIGMtLSkge1xuICAgICAgICAvLyBOZXh0IHdlIGZpbmQgdGhlIGZpcnN0IG9uZSB0aGF0IGlzbid0IHRoZSBzYW1lIHdoaWNoIHNob3VsZCBiZSB0aGVcbiAgICAgICAgLy8gZnJhbWUgdGhhdCBjYWxsZWQgb3VyIHNhbXBsZSBmdW5jdGlvbiBhbmQgdGhlIGNvbnRyb2wuXG4gICAgICAgIGlmIChzYW1wbGVMaW5lc1tzXSAhPT0gY29udHJvbExpbmVzW2NdKSB7XG4gICAgICAgICAgLy8gSW4gVjgsIHRoZSBmaXJzdCBsaW5lIGlzIGRlc2NyaWJpbmcgdGhlIG1lc3NhZ2UgYnV0IG90aGVyIFZNcyBkb24ndC5cbiAgICAgICAgICAvLyBJZiB3ZSdyZSBhYm91dCB0byByZXR1cm4gdGhlIGZpcnN0IGxpbmUsIGFuZCB0aGUgY29udHJvbCBpcyBhbHNvIG9uIHRoZSBzYW1lXG4gICAgICAgICAgLy8gbGluZSwgdGhhdCdzIGEgcHJldHR5IGdvb2QgaW5kaWNhdG9yIHRoYXQgb3VyIHNhbXBsZSB0aHJldyBhdCBzYW1lIGxpbmUgYXNcbiAgICAgICAgICAvLyB0aGUgY29udHJvbC4gSS5lLiBiZWZvcmUgd2UgZW50ZXJlZCB0aGUgc2FtcGxlIGZyYW1lLiBTbyB3ZSBpZ25vcmUgdGhpcyByZXN1bHQuXG4gICAgICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIGlmIHlvdSBwYXNzZWQgYSBjbGFzcyB0byBmdW5jdGlvbiBjb21wb25lbnQsIG9yIG5vbi1mdW5jdGlvbi5cbiAgICAgICAgICBpZiAocyAhPT0gMSB8fCBjICE9PSAxKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgIHMtLTtcbiAgICAgICAgICAgICAgYy0tOyAvLyBXZSBtYXkgc3RpbGwgaGF2ZSBzaW1pbGFyIGludGVybWVkaWF0ZSBmcmFtZXMgZnJvbSB0aGUgY29uc3RydWN0IGNhbGwuXG4gICAgICAgICAgICAgIC8vIFRoZSBuZXh0IG9uZSB0aGF0IGlzbid0IHRoZSBzYW1lIHNob3VsZCBiZSBvdXIgbWF0Y2ggdGhvdWdoLlxuXG4gICAgICAgICAgICAgIGlmIChjIDwgMCB8fCBzYW1wbGVMaW5lc1tzXSAhPT0gY29udHJvbExpbmVzW2NdKSB7XG4gICAgICAgICAgICAgICAgLy8gVjggYWRkcyBhIFwibmV3XCIgcHJlZml4IGZvciBuYXRpdmUgY2xhc3Nlcy4gTGV0J3MgcmVtb3ZlIGl0IHRvIG1ha2UgaXQgcHJldHRpZXIuXG4gICAgICAgICAgICAgICAgdmFyIF9mcmFtZSA9ICdcXG4nICsgc2FtcGxlTGluZXNbc10ucmVwbGFjZSgnIGF0IG5ldyAnLCAnIGF0ICcpO1xuXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRGcmFtZUNhY2hlLnNldChmbiwgX2ZyYW1lKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IC8vIFJldHVybiB0aGUgbGluZSB3ZSBmb3VuZC5cblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9mcmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAocyA+PSAxICYmIGMgPj0gMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmVlbnRyeSA9IGZhbHNlO1xuXG4gICAge1xuICAgICAgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciQxLmN1cnJlbnQgPSBwcmV2aW91c0Rpc3BhdGNoZXI7XG4gICAgICByZWVuYWJsZUxvZ3MoKTtcbiAgICB9XG5cbiAgICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IHByZXZpb3VzUHJlcGFyZVN0YWNrVHJhY2U7XG4gIH0gLy8gRmFsbGJhY2sgdG8ganVzdCB1c2luZyB0aGUgbmFtZSBpZiB3ZSBjb3VsZG4ndCBtYWtlIGl0IHRocm93LlxuXG5cbiAgdmFyIG5hbWUgPSBmbiA/IGZuLmRpc3BsYXlOYW1lIHx8IGZuLm5hbWUgOiAnJztcbiAgdmFyIHN5bnRoZXRpY0ZyYW1lID0gbmFtZSA/IGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKG5hbWUpIDogJyc7XG5cbiAge1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBvbmVudEZyYW1lQ2FjaGUuc2V0KGZuLCBzeW50aGV0aWNGcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN5bnRoZXRpY0ZyYW1lO1xufVxuZnVuY3Rpb24gZGVzY3JpYmVGdW5jdGlvbkNvbXBvbmVudEZyYW1lKGZuLCBzb3VyY2UsIG93bmVyRm4pIHtcbiAge1xuICAgIHJldHVybiBkZXNjcmliZU5hdGl2ZUNvbXBvbmVudEZyYW1lKGZuLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2hvdWxkQ29uc3RydWN0KENvbXBvbmVudCkge1xuICB2YXIgcHJvdG90eXBlID0gQ29tcG9uZW50LnByb3RvdHlwZTtcbiAgcmV0dXJuICEhKHByb3RvdHlwZSAmJiBwcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCk7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVih0eXBlLCBzb3VyY2UsIG93bmVyRm4pIHtcblxuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAge1xuICAgICAgcmV0dXJuIGRlc2NyaWJlTmF0aXZlQ29tcG9uZW50RnJhbWUodHlwZSwgc2hvdWxkQ29uc3RydWN0KHR5cGUpKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKHR5cGUpO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBleHBvcnRzLlN1c3BlbnNlOlxuICAgICAgcmV0dXJuIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKCdTdXNwZW5zZScpO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICByZXR1cm4gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUoJ1N1c3BlbnNlTGlzdCcpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHN3aXRjaCAodHlwZS4kJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZGVzY3JpYmVGdW5jdGlvbkNvbXBvbmVudEZyYW1lKHR5cGUucmVuZGVyKTtcblxuICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgIC8vIE1lbW8gbWF5IGNvbnRhaW4gYW55IGNvbXBvbmVudCB0eXBlIHNvIHdlIHJlY3Vyc2l2ZWx5IHJlc29sdmUgaXQuXG4gICAgICAgIHJldHVybiBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYodHlwZS50eXBlLCBzb3VyY2UsIG93bmVyRm4pO1xuXG4gICAgICBjYXNlIFJFQUNUX0JMT0NLX1RZUEU6XG4gICAgICAgIHJldHVybiBkZXNjcmliZUZ1bmN0aW9uQ29tcG9uZW50RnJhbWUodHlwZS5fcmVuZGVyKTtcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbGF6eUNvbXBvbmVudCA9IHR5cGU7XG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBsYXp5Q29tcG9uZW50Ll9wYXlsb2FkO1xuICAgICAgICAgIHZhciBpbml0ID0gbGF6eUNvbXBvbmVudC5faW5pdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBMYXp5IG1heSBjb250YWluIGFueSBjb21wb25lbnQgdHlwZSBzbyB3ZSByZWN1cnNpdmVseSByZXNvbHZlIGl0LlxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVihpbml0KHBheWxvYWQpLCBzb3VyY2UsIG93bmVyRm4pO1xuICAgICAgICAgIH0gY2F0Y2ggKHgpIHt9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbnZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbnZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lJDEgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuXG5mdW5jdGlvbiBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KSB7XG4gIHtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG4gICAgICB2YXIgc3RhY2sgPSBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYoZWxlbWVudC50eXBlLCBlbGVtZW50Ll9zb3VyY2UsIG93bmVyID8gb3duZXIudHlwZSA6IG51bGwpO1xuICAgICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSQxLnNldEV4dHJhU3RhY2tGcmFtZShzdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMS5zZXRFeHRyYVN0YWNrRnJhbWUobnVsbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZWxlbWVudCkge1xuICB7XG4gICAgLy8gJEZsb3dGaXhNZSBUaGlzIGlzIG9rYXkgYnV0IEZsb3cgZG9lc24ndCBrbm93IGl0LlxuICAgIHZhciBoYXMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAoaGFzKHR5cGVTcGVjcywgdHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3IkMSA9IHZvaWQgMDsgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLicgKyAnVGhpcyBvZnRlbiBoYXBwZW5zIGJlY2F1c2Ugb2YgdHlwb3Mgc3VjaCBhcyBgUHJvcFR5cGVzLmZ1bmN0aW9uYCBpbnN0ZWFkIG9mIGBQcm9wVHlwZXMuZnVuY2AuJyk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlcnJvciQxID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciQxID0gZXg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IkMSAmJiAhKGVycm9yJDEgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGVycm9yKCclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzJyArICcgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yJDEpO1xuXG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IkMSBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IkMS5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvciQxLm1lc3NhZ2VdID0gdHJ1ZTtcbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGVycm9yKCdGYWlsZWQgJXMgdHlwZTogJXMnLCBsb2NhdGlvbiwgZXJyb3IkMS5tZXNzYWdlKTtcblxuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZWxlbWVudCkge1xuICB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuICAgICAgdmFyIHN0YWNrID0gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKGVsZW1lbnQudHlwZSwgZWxlbWVudC5fc291cmNlLCBvd25lciA/IG93bmVyLnR5cGUgOiBudWxsKTtcbiAgICAgIHNldEV4dHJhU3RhY2tGcmFtZShzdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldEV4dHJhU3RhY2tGcmFtZShudWxsKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duO1xuXG57XG4gIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpIHtcbiAgaWYgKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShzb3VyY2UpIHtcbiAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMoZWxlbWVudFByb3BzKSB7XG4gIGlmIChlbGVtZW50UHJvcHMgIT09IG51bGwgJiYgZWxlbWVudFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oZWxlbWVudFByb3BzLl9fc291cmNlKTtcbiAgfVxuXG4gIHJldHVybiAnJztcbn1cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG5cblxudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAgdmFyIGluZm8gPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcblxuICBpZiAoIWluZm8pIHtcbiAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcblxuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICBpbmZvID0gXCJcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDxcIiArIHBhcmVudE5hbWUgKyBcIj4uXCI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZm87XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIGlmICghZWxlbWVudC5fc3RvcmUgfHwgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkIHx8IGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG5cbiAgaWYgKG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7IC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG5cbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5fb3duZXIgJiYgZWxlbWVudC5fb3duZXIgIT09IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjb21wb25lbnQgdGhhdCBvcmlnaW5hbGx5IGNyZWF0ZWQgdGhpcyBjaGlsZC5cbiAgICBjaGlsZE93bmVyID0gXCIgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gXCIgKyBnZXRDb21wb25lbnROYW1lKGVsZW1lbnQuX293bmVyLnR5cGUpICsgXCIuXCI7XG4gIH1cblxuICB7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShlbGVtZW50KTtcblxuICAgIGVycm9yKCdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL3JlYWN0anMub3JnL2xpbmsvd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLicsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIpO1xuXG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShudWxsKTtcbiAgfVxufVxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZVtpXTtcblxuICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KGNoaWxkKSkge1xuICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNWYWxpZEVsZW1lbnQobm9kZSkpIHtcbiAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiBhIHZhbGlkIGxvY2F0aW9uLlxuICAgIGlmIChub2RlLl9zdG9yZSkge1xuICAgICAgbm9kZS5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobm9kZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihub2RlKTtcblxuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gRW50cnkgaXRlcmF0b3JzIHVzZWQgdG8gcHJvdmlkZSBpbXBsaWNpdCBrZXlzLFxuICAgICAgLy8gYnV0IG5vdyB3ZSBwcmludCBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIHRoZW0gbGF0ZXIuXG4gICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gbm9kZS5lbnRyaWVzKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChub2RlKTtcbiAgICAgICAgdmFyIHN0ZXA7XG5cbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KSB7XG4gIHtcbiAgICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcblxuICAgIGlmICh0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcHJvcFR5cGVzO1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gICAgLy8gSW5uZXIgcHJvcHMgYXJlIGNoZWNrZWQgaW4gdGhlIHJlY29uY2lsZXIuXG4gICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSkge1xuICAgICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcFR5cGVzKSB7XG4gICAgICAvLyBJbnRlbnRpb25hbGx5IGluc2lkZSB0byBhdm9pZCB0cmlnZ2VyaW5nIGxhenkgaW5pdGlhbGl6ZXJzOlxuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHR5cGUpO1xuICAgICAgY2hlY2tQcm9wVHlwZXMocHJvcFR5cGVzLCBlbGVtZW50LnByb3BzLCAncHJvcCcsIG5hbWUsIGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZS5Qcm9wVHlwZXMgIT09IHVuZGVmaW5lZCAmJiAhcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24pIHtcbiAgICAgIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gdHJ1ZTsgLy8gSW50ZW50aW9uYWxseSBpbnNpZGUgdG8gYXZvaWQgdHJpZ2dlcmluZyBsYXp5IGluaXRpYWxpemVyczpcblxuICAgICAgdmFyIF9uYW1lID0gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKTtcblxuICAgICAgZXJyb3IoJ0NvbXBvbmVudCAlcyBkZWNsYXJlZCBgUHJvcFR5cGVzYCBpbnN0ZWFkIG9mIGBwcm9wVHlwZXNgLiBEaWQgeW91IG1pc3NwZWxsIHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50PycsIF9uYW1lIHx8ICdVbmtub3duJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0eXBlLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJyAmJiAhdHlwZS5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQpIHtcbiAgICAgIGVycm9yKCdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJyk7XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEdpdmVuIGEgZnJhZ21lbnQsIHZhbGlkYXRlIHRoYXQgaXQgY2FuIG9ubHkgYmUgcHJvdmlkZWQgd2l0aCBmcmFnbWVudCBwcm9wc1xuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGZyYWdtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZnJhZ21lbnQpIHtcbiAge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJhZ21lbnQucHJvcHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcblxuICAgICAgaWYgKGtleSAhPT0gJ2NoaWxkcmVuJyAmJiBrZXkgIT09ICdrZXknKSB7XG4gICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZnJhZ21lbnQpO1xuXG4gICAgICAgIGVycm9yKCdJbnZhbGlkIHByb3AgYCVzYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLiAnICsgJ1JlYWN0LkZyYWdtZW50IGNhbiBvbmx5IGhhdmUgYGtleWAgYW5kIGBjaGlsZHJlbmAgcHJvcHMuJywga2V5KTtcblxuICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnJhZ21lbnQucmVmICE9PSBudWxsKSB7XG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGZyYWdtZW50KTtcblxuICAgICAgZXJyb3IoJ0ludmFsaWQgYXR0cmlidXRlIGByZWZgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuJyk7XG5cbiAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEobnVsbCk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7IC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG5cbiAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuXG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bUZvclByb3BzKHByb3BzKTtcblxuICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICBpbmZvICs9IHNvdXJjZUluZm87XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGVTdHJpbmc7XG5cbiAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgdHlwZVN0cmluZyA9ICdudWxsJztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSkge1xuICAgICAgdHlwZVN0cmluZyA9IFwiPFwiICsgKGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgXCIgLz5cIjtcbiAgICAgIGluZm8gPSAnIERpZCB5b3UgYWNjaWRlbnRhbGx5IGV4cG9ydCBhIEpTWCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjb21wb25lbnQ/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGVycm9yKCdSZWFjdC5jcmVhdGVFbGVtZW50OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyAvLyBUaGUgcmVzdWx0IGNhbiBiZSBudWxsaXNoIGlmIGEgbW9jayBvciBhIGN1c3RvbSBmdW5jdGlvbiBpcyB1c2VkLlxuICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9IC8vIFNraXAga2V5IHdhcm5pbmcgaWYgdGhlIHR5cGUgaXNuJ3QgdmFsaWQgc2luY2Ugb3VyIGtleSB2YWxpZGF0aW9uIGxvZ2ljXG4gIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAvLyAoUmVuZGVyaW5nIHdpbGwgdGhyb3cgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZSBhbmQgYXMgc29vbiBhcyB0aGUgdHlwZSBpc1xuICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG5cblxuICBpZiAodmFsaWRUeXBlKSB7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGUgPT09IGV4cG9ydHMuRnJhZ21lbnQpIHtcbiAgICB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZWxlbWVudCk7XG4gIH0gZWxzZSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cbnZhciBkaWRXYXJuQWJvdXREZXByZWNhdGVkQ3JlYXRlRmFjdG9yeSA9IGZhbHNlO1xuZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uKHR5cGUpIHtcbiAgdmFyIHZhbGlkYXRlZEZhY3RvcnkgPSBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24uYmluZChudWxsLCB0eXBlKTtcbiAgdmFsaWRhdGVkRmFjdG9yeS50eXBlID0gdHlwZTtcblxuICB7XG4gICAgaWYgKCFkaWRXYXJuQWJvdXREZXByZWNhdGVkQ3JlYXRlRmFjdG9yeSkge1xuICAgICAgZGlkV2FybkFib3V0RGVwcmVjYXRlZENyZWF0ZUZhY3RvcnkgPSB0cnVlO1xuXG4gICAgICB3YXJuKCdSZWFjdC5jcmVhdGVGYWN0b3J5KCkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gQ29uc2lkZXIgdXNpbmcgSlNYICcgKyAnb3IgdXNlIFJlYWN0LmNyZWF0ZUVsZW1lbnQoKSBkaXJlY3RseSBpbnN0ZWFkLicpO1xuICAgIH0gLy8gTGVnYWN5IGhvb2s6IHJlbW92ZSBpdFxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsaWRhdGVkRmFjdG9yeSwgJ3R5cGUnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB3YXJuKCdGYWN0b3J5LnR5cGUgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHRoZSBjbGFzcyBkaXJlY3RseSAnICsgJ2JlZm9yZSBwYXNzaW5nIGl0IHRvIGNyZWF0ZUZhY3RvcnkuJyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0eXBlJywge1xuICAgICAgICAgIHZhbHVlOiB0eXBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWxpZGF0ZWRGYWN0b3J5O1xufVxuZnVuY3Rpb24gY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24oZWxlbWVudCwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciBuZXdFbGVtZW50ID0gY2xvbmVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIG5ld0VsZW1lbnQudHlwZSk7XG4gIH1cblxuICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbntcblxuICB0cnkge1xuICAgIHZhciBmcm96ZW5PYmplY3QgPSBPYmplY3QuZnJlZXplKHt9KTtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXcgKi9cblxuICAgIG5ldyBNYXAoW1tmcm96ZW5PYmplY3QsIG51bGxdXSk7XG4gICAgbmV3IFNldChbZnJvemVuT2JqZWN0XSk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1uZXcgKi9cbiAgfSBjYXRjaCAoZSkge1xuICB9XG59XG5cbnZhciBjcmVhdGVFbGVtZW50JDEgPSAgY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uIDtcbnZhciBjbG9uZUVsZW1lbnQkMSA9ICBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiA7XG52YXIgY3JlYXRlRmFjdG9yeSA9ICBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24gO1xudmFyIENoaWxkcmVuID0ge1xuICBtYXA6IG1hcENoaWxkcmVuLFxuICBmb3JFYWNoOiBmb3JFYWNoQ2hpbGRyZW4sXG4gIGNvdW50OiBjb3VudENoaWxkcmVuLFxuICB0b0FycmF5OiB0b0FycmF5LFxuICBvbmx5OiBvbmx5Q2hpbGRcbn07XG5cbmV4cG9ydHMuQ2hpbGRyZW4gPSBDaGlsZHJlbjtcbmV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuZXhwb3J0cy5QdXJlQ29tcG9uZW50ID0gUHVyZUNvbXBvbmVudDtcbmV4cG9ydHMuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQgPSBSZWFjdFNoYXJlZEludGVybmFscztcbmV4cG9ydHMuY2xvbmVFbGVtZW50ID0gY2xvbmVFbGVtZW50JDE7XG5leHBvcnRzLmNyZWF0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0O1xuZXhwb3J0cy5jcmVhdGVFbGVtZW50ID0gY3JlYXRlRWxlbWVudCQxO1xuZXhwb3J0cy5jcmVhdGVGYWN0b3J5ID0gY3JlYXRlRmFjdG9yeTtcbmV4cG9ydHMuY3JlYXRlUmVmID0gY3JlYXRlUmVmO1xuZXhwb3J0cy5mb3J3YXJkUmVmID0gZm9yd2FyZFJlZjtcbmV4cG9ydHMuaXNWYWxpZEVsZW1lbnQgPSBpc1ZhbGlkRWxlbWVudDtcbmV4cG9ydHMubGF6eSA9IGxhenk7XG5leHBvcnRzLm1lbW8gPSBtZW1vO1xuZXhwb3J0cy51c2VDYWxsYmFjayA9IHVzZUNhbGxiYWNrO1xuZXhwb3J0cy51c2VDb250ZXh0ID0gdXNlQ29udGV4dDtcbmV4cG9ydHMudXNlRGVidWdWYWx1ZSA9IHVzZURlYnVnVmFsdWU7XG5leHBvcnRzLnVzZUVmZmVjdCA9IHVzZUVmZmVjdDtcbmV4cG9ydHMudXNlSW1wZXJhdGl2ZUhhbmRsZSA9IHVzZUltcGVyYXRpdmVIYW5kbGU7XG5leHBvcnRzLnVzZUxheW91dEVmZmVjdCA9IHVzZUxheW91dEVmZmVjdDtcbmV4cG9ydHMudXNlTWVtbyA9IHVzZU1lbW87XG5leHBvcnRzLnVzZVJlZHVjZXIgPSB1c2VSZWR1Y2VyO1xuZXhwb3J0cy51c2VSZWYgPSB1c2VSZWY7XG5leHBvcnRzLnVzZVN0YXRlID0gdXNlU3RhdGU7XG5leHBvcnRzLnZlcnNpb24gPSBSZWFjdFZlcnNpb247XG4gIH0pKCk7XG59XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE3LjAuMlxuICogcmVhY3QucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuJ3VzZSBzdHJpY3QnO3ZhciBsPXJlcXVpcmUoXCJvYmplY3QtYXNzaWduXCIpLG49NjAxMDMscD02MDEwNjtleHBvcnRzLkZyYWdtZW50PTYwMTA3O2V4cG9ydHMuU3RyaWN0TW9kZT02MDEwODtleHBvcnRzLlByb2ZpbGVyPTYwMTE0O3ZhciBxPTYwMTA5LHI9NjAxMTAsdD02MDExMjtleHBvcnRzLlN1c3BlbnNlPTYwMTEzO3ZhciB1PTYwMTE1LHY9NjAxMTY7XG5pZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yKXt2YXIgdz1TeW1ib2wuZm9yO249dyhcInJlYWN0LmVsZW1lbnRcIik7cD13KFwicmVhY3QucG9ydGFsXCIpO2V4cG9ydHMuRnJhZ21lbnQ9dyhcInJlYWN0LmZyYWdtZW50XCIpO2V4cG9ydHMuU3RyaWN0TW9kZT13KFwicmVhY3Quc3RyaWN0X21vZGVcIik7ZXhwb3J0cy5Qcm9maWxlcj13KFwicmVhY3QucHJvZmlsZXJcIik7cT13KFwicmVhY3QucHJvdmlkZXJcIik7cj13KFwicmVhY3QuY29udGV4dFwiKTt0PXcoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKTtleHBvcnRzLlN1c3BlbnNlPXcoXCJyZWFjdC5zdXNwZW5zZVwiKTt1PXcoXCJyZWFjdC5tZW1vXCIpO3Y9dyhcInJlYWN0LmxhenlcIil9dmFyIHg9XCJmdW5jdGlvblwiPT09dHlwZW9mIFN5bWJvbCYmU3ltYm9sLml0ZXJhdG9yO1xuZnVuY3Rpb24geShhKXtpZihudWxsPT09YXx8XCJvYmplY3RcIiE9PXR5cGVvZiBhKXJldHVybiBudWxsO2E9eCYmYVt4XXx8YVtcIkBAaXRlcmF0b3JcIl07cmV0dXJuXCJmdW5jdGlvblwiPT09dHlwZW9mIGE/YTpudWxsfWZ1bmN0aW9uIHooYSl7Zm9yKHZhciBiPVwiaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL2Vycm9yLWRlY29kZXIuaHRtbD9pbnZhcmlhbnQ9XCIrYSxjPTE7Yzxhcmd1bWVudHMubGVuZ3RoO2MrKyliKz1cIiZhcmdzW109XCIrZW5jb2RlVVJJQ29tcG9uZW50KGFyZ3VtZW50c1tjXSk7cmV0dXJuXCJNaW5pZmllZCBSZWFjdCBlcnJvciAjXCIrYStcIjsgdmlzaXQgXCIrYitcIiBmb3IgdGhlIGZ1bGwgbWVzc2FnZSBvciB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgZm9yIGZ1bGwgZXJyb3JzIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuXCJ9XG52YXIgQT17aXNNb3VudGVkOmZ1bmN0aW9uKCl7cmV0dXJuITF9LGVucXVldWVGb3JjZVVwZGF0ZTpmdW5jdGlvbigpe30sZW5xdWV1ZVJlcGxhY2VTdGF0ZTpmdW5jdGlvbigpe30sZW5xdWV1ZVNldFN0YXRlOmZ1bmN0aW9uKCl7fX0sQj17fTtmdW5jdGlvbiBDKGEsYixjKXt0aGlzLnByb3BzPWE7dGhpcy5jb250ZXh0PWI7dGhpcy5yZWZzPUI7dGhpcy51cGRhdGVyPWN8fEF9Qy5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudD17fTtDLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihhLGIpe2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYSYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGEmJm51bGwhPWEpdGhyb3cgRXJyb3Ioeig4NSkpO3RoaXMudXBkYXRlci5lbnF1ZXVlU2V0U3RhdGUodGhpcyxhLGIsXCJzZXRTdGF0ZVwiKX07Qy5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24oYSl7dGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLGEsXCJmb3JjZVVwZGF0ZVwiKX07XG5mdW5jdGlvbiBEKCl7fUQucHJvdG90eXBlPUMucHJvdG90eXBlO2Z1bmN0aW9uIEUoYSxiLGMpe3RoaXMucHJvcHM9YTt0aGlzLmNvbnRleHQ9Yjt0aGlzLnJlZnM9Qjt0aGlzLnVwZGF0ZXI9Y3x8QX12YXIgRj1FLnByb3RvdHlwZT1uZXcgRDtGLmNvbnN0cnVjdG9yPUU7bChGLEMucHJvdG90eXBlKTtGLmlzUHVyZVJlYWN0Q29tcG9uZW50PSEwO3ZhciBHPXtjdXJyZW50Om51bGx9LEg9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxJPXtrZXk6ITAscmVmOiEwLF9fc2VsZjohMCxfX3NvdXJjZTohMH07XG5mdW5jdGlvbiBKKGEsYixjKXt2YXIgZSxkPXt9LGs9bnVsbCxoPW51bGw7aWYobnVsbCE9Yilmb3IoZSBpbiB2b2lkIDAhPT1iLnJlZiYmKGg9Yi5yZWYpLHZvaWQgMCE9PWIua2V5JiYoaz1cIlwiK2Iua2V5KSxiKUguY2FsbChiLGUpJiYhSS5oYXNPd25Qcm9wZXJ0eShlKSYmKGRbZV09YltlXSk7dmFyIGc9YXJndW1lbnRzLmxlbmd0aC0yO2lmKDE9PT1nKWQuY2hpbGRyZW49YztlbHNlIGlmKDE8Zyl7Zm9yKHZhciBmPUFycmF5KGcpLG09MDttPGc7bSsrKWZbbV09YXJndW1lbnRzW20rMl07ZC5jaGlsZHJlbj1mfWlmKGEmJmEuZGVmYXVsdFByb3BzKWZvcihlIGluIGc9YS5kZWZhdWx0UHJvcHMsZyl2b2lkIDA9PT1kW2VdJiYoZFtlXT1nW2VdKTtyZXR1cm57JCR0eXBlb2Y6bix0eXBlOmEsa2V5OmsscmVmOmgscHJvcHM6ZCxfb3duZXI6Ry5jdXJyZW50fX1cbmZ1bmN0aW9uIEsoYSxiKXtyZXR1cm57JCR0eXBlb2Y6bix0eXBlOmEudHlwZSxrZXk6YixyZWY6YS5yZWYscHJvcHM6YS5wcm9wcyxfb3duZXI6YS5fb3duZXJ9fWZ1bmN0aW9uIEwoYSl7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSYmYS4kJHR5cGVvZj09PW59ZnVuY3Rpb24gZXNjYXBlKGEpe3ZhciBiPXtcIj1cIjpcIj0wXCIsXCI6XCI6XCI9MlwifTtyZXR1cm5cIiRcIithLnJlcGxhY2UoL1s9Ol0vZyxmdW5jdGlvbihhKXtyZXR1cm4gYlthXX0pfXZhciBNPS9cXC8rL2c7ZnVuY3Rpb24gTihhLGIpe3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEmJm51bGwhPWEua2V5P2VzY2FwZShcIlwiK2Eua2V5KTpiLnRvU3RyaW5nKDM2KX1cbmZ1bmN0aW9uIE8oYSxiLGMsZSxkKXt2YXIgaz10eXBlb2YgYTtpZihcInVuZGVmaW5lZFwiPT09a3x8XCJib29sZWFuXCI9PT1rKWE9bnVsbDt2YXIgaD0hMTtpZihudWxsPT09YSloPSEwO2Vsc2Ugc3dpdGNoKGspe2Nhc2UgXCJzdHJpbmdcIjpjYXNlIFwibnVtYmVyXCI6aD0hMDticmVhaztjYXNlIFwib2JqZWN0XCI6c3dpdGNoKGEuJCR0eXBlb2Ype2Nhc2UgbjpjYXNlIHA6aD0hMH19aWYoaClyZXR1cm4gaD1hLGQ9ZChoKSxhPVwiXCI9PT1lP1wiLlwiK04oaCwwKTplLEFycmF5LmlzQXJyYXkoZCk/KGM9XCJcIixudWxsIT1hJiYoYz1hLnJlcGxhY2UoTSxcIiQmL1wiKStcIi9cIiksTyhkLGIsYyxcIlwiLGZ1bmN0aW9uKGEpe3JldHVybiBhfSkpOm51bGwhPWQmJihMKGQpJiYoZD1LKGQsYysoIWQua2V5fHxoJiZoLmtleT09PWQua2V5P1wiXCI6KFwiXCIrZC5rZXkpLnJlcGxhY2UoTSxcIiQmL1wiKStcIi9cIikrYSkpLGIucHVzaChkKSksMTtoPTA7ZT1cIlwiPT09ZT9cIi5cIjplK1wiOlwiO2lmKEFycmF5LmlzQXJyYXkoYSkpZm9yKHZhciBnPVxuMDtnPGEubGVuZ3RoO2crKyl7az1hW2ddO3ZhciBmPWUrTihrLGcpO2grPU8oayxiLGMsZixkKX1lbHNlIGlmKGY9eShhKSxcImZ1bmN0aW9uXCI9PT10eXBlb2YgZilmb3IoYT1mLmNhbGwoYSksZz0wOyEoaz1hLm5leHQoKSkuZG9uZTspaz1rLnZhbHVlLGY9ZStOKGssZysrKSxoKz1PKGssYixjLGYsZCk7ZWxzZSBpZihcIm9iamVjdFwiPT09ayl0aHJvdyBiPVwiXCIrYSxFcnJvcih6KDMxLFwiW29iamVjdCBPYmplY3RdXCI9PT1iP1wib2JqZWN0IHdpdGgga2V5cyB7XCIrT2JqZWN0LmtleXMoYSkuam9pbihcIiwgXCIpK1wifVwiOmIpKTtyZXR1cm4gaH1mdW5jdGlvbiBQKGEsYixjKXtpZihudWxsPT1hKXJldHVybiBhO3ZhciBlPVtdLGQ9MDtPKGEsZSxcIlwiLFwiXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGIuY2FsbChjLGEsZCsrKX0pO3JldHVybiBlfVxuZnVuY3Rpb24gUShhKXtpZigtMT09PWEuX3N0YXR1cyl7dmFyIGI9YS5fcmVzdWx0O2I9YigpO2EuX3N0YXR1cz0wO2EuX3Jlc3VsdD1iO2IudGhlbihmdW5jdGlvbihiKXswPT09YS5fc3RhdHVzJiYoYj1iLmRlZmF1bHQsYS5fc3RhdHVzPTEsYS5fcmVzdWx0PWIpfSxmdW5jdGlvbihiKXswPT09YS5fc3RhdHVzJiYoYS5fc3RhdHVzPTIsYS5fcmVzdWx0PWIpfSl9aWYoMT09PWEuX3N0YXR1cylyZXR1cm4gYS5fcmVzdWx0O3Rocm93IGEuX3Jlc3VsdDt9dmFyIFI9e2N1cnJlbnQ6bnVsbH07ZnVuY3Rpb24gUygpe3ZhciBhPVIuY3VycmVudDtpZihudWxsPT09YSl0aHJvdyBFcnJvcih6KDMyMSkpO3JldHVybiBhfXZhciBUPXtSZWFjdEN1cnJlbnREaXNwYXRjaGVyOlIsUmVhY3RDdXJyZW50QmF0Y2hDb25maWc6e3RyYW5zaXRpb246MH0sUmVhY3RDdXJyZW50T3duZXI6RyxJc1NvbWVSZW5kZXJlckFjdGluZzp7Y3VycmVudDohMX0sYXNzaWduOmx9O1xuZXhwb3J0cy5DaGlsZHJlbj17bWFwOlAsZm9yRWFjaDpmdW5jdGlvbihhLGIsYyl7UChhLGZ1bmN0aW9uKCl7Yi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGMpfSxjb3VudDpmdW5jdGlvbihhKXt2YXIgYj0wO1AoYSxmdW5jdGlvbigpe2IrK30pO3JldHVybiBifSx0b0FycmF5OmZ1bmN0aW9uKGEpe3JldHVybiBQKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KXx8W119LG9ubHk6ZnVuY3Rpb24oYSl7aWYoIUwoYSkpdGhyb3cgRXJyb3IoeigxNDMpKTtyZXR1cm4gYX19O2V4cG9ydHMuQ29tcG9uZW50PUM7ZXhwb3J0cy5QdXJlQ29tcG9uZW50PUU7ZXhwb3J0cy5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRD1UO1xuZXhwb3J0cy5jbG9uZUVsZW1lbnQ9ZnVuY3Rpb24oYSxiLGMpe2lmKG51bGw9PT1hfHx2b2lkIDA9PT1hKXRocm93IEVycm9yKHooMjY3LGEpKTt2YXIgZT1sKHt9LGEucHJvcHMpLGQ9YS5rZXksaz1hLnJlZixoPWEuX293bmVyO2lmKG51bGwhPWIpe3ZvaWQgMCE9PWIucmVmJiYoaz1iLnJlZixoPUcuY3VycmVudCk7dm9pZCAwIT09Yi5rZXkmJihkPVwiXCIrYi5rZXkpO2lmKGEudHlwZSYmYS50eXBlLmRlZmF1bHRQcm9wcyl2YXIgZz1hLnR5cGUuZGVmYXVsdFByb3BzO2ZvcihmIGluIGIpSC5jYWxsKGIsZikmJiFJLmhhc093blByb3BlcnR5KGYpJiYoZVtmXT12b2lkIDA9PT1iW2ZdJiZ2b2lkIDAhPT1nP2dbZl06YltmXSl9dmFyIGY9YXJndW1lbnRzLmxlbmd0aC0yO2lmKDE9PT1mKWUuY2hpbGRyZW49YztlbHNlIGlmKDE8Zil7Zz1BcnJheShmKTtmb3IodmFyIG09MDttPGY7bSsrKWdbbV09YXJndW1lbnRzW20rMl07ZS5jaGlsZHJlbj1nfXJldHVybnskJHR5cGVvZjpuLHR5cGU6YS50eXBlLFxua2V5OmQscmVmOmsscHJvcHM6ZSxfb3duZXI6aH19O2V4cG9ydHMuY3JlYXRlQ29udGV4dD1mdW5jdGlvbihhLGIpe3ZvaWQgMD09PWImJihiPW51bGwpO2E9eyQkdHlwZW9mOnIsX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOmIsX2N1cnJlbnRWYWx1ZTphLF9jdXJyZW50VmFsdWUyOmEsX3RocmVhZENvdW50OjAsUHJvdmlkZXI6bnVsbCxDb25zdW1lcjpudWxsfTthLlByb3ZpZGVyPXskJHR5cGVvZjpxLF9jb250ZXh0OmF9O3JldHVybiBhLkNvbnN1bWVyPWF9O2V4cG9ydHMuY3JlYXRlRWxlbWVudD1KO2V4cG9ydHMuY3JlYXRlRmFjdG9yeT1mdW5jdGlvbihhKXt2YXIgYj1KLmJpbmQobnVsbCxhKTtiLnR5cGU9YTtyZXR1cm4gYn07ZXhwb3J0cy5jcmVhdGVSZWY9ZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpudWxsfX07ZXhwb3J0cy5mb3J3YXJkUmVmPWZ1bmN0aW9uKGEpe3JldHVybnskJHR5cGVvZjp0LHJlbmRlcjphfX07ZXhwb3J0cy5pc1ZhbGlkRWxlbWVudD1MO1xuZXhwb3J0cy5sYXp5PWZ1bmN0aW9uKGEpe3JldHVybnskJHR5cGVvZjp2LF9wYXlsb2FkOntfc3RhdHVzOi0xLF9yZXN1bHQ6YX0sX2luaXQ6UX19O2V4cG9ydHMubWVtbz1mdW5jdGlvbihhLGIpe3JldHVybnskJHR5cGVvZjp1LHR5cGU6YSxjb21wYXJlOnZvaWQgMD09PWI/bnVsbDpifX07ZXhwb3J0cy51c2VDYWxsYmFjaz1mdW5jdGlvbihhLGIpe3JldHVybiBTKCkudXNlQ2FsbGJhY2soYSxiKX07ZXhwb3J0cy51c2VDb250ZXh0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIFMoKS51c2VDb250ZXh0KGEsYil9O2V4cG9ydHMudXNlRGVidWdWYWx1ZT1mdW5jdGlvbigpe307ZXhwb3J0cy51c2VFZmZlY3Q9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gUygpLnVzZUVmZmVjdChhLGIpfTtleHBvcnRzLnVzZUltcGVyYXRpdmVIYW5kbGU9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBTKCkudXNlSW1wZXJhdGl2ZUhhbmRsZShhLGIsYyl9O1xuZXhwb3J0cy51c2VMYXlvdXRFZmZlY3Q9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gUygpLnVzZUxheW91dEVmZmVjdChhLGIpfTtleHBvcnRzLnVzZU1lbW89ZnVuY3Rpb24oYSxiKXtyZXR1cm4gUygpLnVzZU1lbW8oYSxiKX07ZXhwb3J0cy51c2VSZWR1Y2VyPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gUygpLnVzZVJlZHVjZXIoYSxiLGMpfTtleHBvcnRzLnVzZVJlZj1mdW5jdGlvbihhKXtyZXR1cm4gUygpLnVzZVJlZihhKX07ZXhwb3J0cy51c2VTdGF0ZT1mdW5jdGlvbihhKXtyZXR1cm4gUygpLnVzZVN0YXRlKGEpfTtleHBvcnRzLnZlcnNpb249XCIxNy4wLjJcIjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYwLjIwLjJcbiAqIHNjaGVkdWxlci5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgPSBmYWxzZTtcbnZhciBlbmFibGVQcm9maWxpbmcgPSBmYWxzZTtcblxudmFyIHJlcXVlc3RIb3N0Q2FsbGJhY2s7XG52YXIgcmVxdWVzdEhvc3RUaW1lb3V0O1xudmFyIGNhbmNlbEhvc3RUaW1lb3V0O1xudmFyIHJlcXVlc3RQYWludDtcbnZhciBoYXNQZXJmb3JtYW5jZU5vdyA9IHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJztcblxuaWYgKGhhc1BlcmZvcm1hbmNlTm93KSB7XG4gIHZhciBsb2NhbFBlcmZvcm1hbmNlID0gcGVyZm9ybWFuY2U7XG5cbiAgZXhwb3J0cy51bnN0YWJsZV9ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxvY2FsUGVyZm9ybWFuY2Uubm93KCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgbG9jYWxEYXRlID0gRGF0ZTtcbiAgdmFyIGluaXRpYWxUaW1lID0gbG9jYWxEYXRlLm5vdygpO1xuXG4gIGV4cG9ydHMudW5zdGFibGVfbm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsb2NhbERhdGUubm93KCkgLSBpbml0aWFsVGltZTtcbiAgfTtcbn1cblxuaWYgKCAvLyBJZiBTY2hlZHVsZXIgcnVucyBpbiBhIG5vbi1ET00gZW52aXJvbm1lbnQsIGl0IGZhbGxzIGJhY2sgdG8gYSBuYWl2ZVxuLy8gaW1wbGVtZW50YXRpb24gdXNpbmcgc2V0VGltZW91dC5cbnR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8IC8vIENoZWNrIGlmIE1lc3NhZ2VDaGFubmVsIGlzIHN1cHBvcnRlZCwgdG9vLlxudHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAnZnVuY3Rpb24nKSB7XG4gIC8vIElmIHRoaXMgYWNjaWRlbnRhbGx5IGdldHMgaW1wb3J0ZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudCwgZS5nLiBKYXZhU2NyaXB0Q29yZSxcbiAgLy8gZmFsbGJhY2sgdG8gYSBuYWl2ZSBpbXBsZW1lbnRhdGlvbi5cbiAgdmFyIF9jYWxsYmFjayA9IG51bGw7XG4gIHZhciBfdGltZW91dElEID0gbnVsbDtcblxuICB2YXIgX2ZsdXNoQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF9jYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcbiAgICAgICAgdmFyIGhhc1JlbWFpbmluZ1RpbWUgPSB0cnVlO1xuXG4gICAgICAgIF9jYWxsYmFjayhoYXNSZW1haW5pbmdUaW1lLCBjdXJyZW50VGltZSk7XG5cbiAgICAgICAgX2NhbGxiYWNrID0gbnVsbDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChfZmx1c2hDYWxsYmFjaywgMCk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICBpZiAoX2NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAvLyBQcm90ZWN0IGFnYWluc3QgcmUtZW50cmFuY3kuXG4gICAgICBzZXRUaW1lb3V0KHJlcXVlc3RIb3N0Q2FsbGJhY2ssIDAsIGNiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2NhbGxiYWNrID0gY2I7XG4gICAgICBzZXRUaW1lb3V0KF9mbHVzaENhbGxiYWNrLCAwKTtcbiAgICB9XG4gIH07XG5cbiAgcmVxdWVzdEhvc3RUaW1lb3V0ID0gZnVuY3Rpb24gKGNiLCBtcykge1xuICAgIF90aW1lb3V0SUQgPSBzZXRUaW1lb3V0KGNiLCBtcyk7XG4gIH07XG5cbiAgY2FuY2VsSG9zdFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2xlYXJUaW1lb3V0KF90aW1lb3V0SUQpO1xuICB9O1xuXG4gIGV4cG9ydHMudW5zdGFibGVfc2hvdWxkWWllbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJlcXVlc3RQYWludCA9IGV4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGUgPSBmdW5jdGlvbiAoKSB7fTtcbn0gZWxzZSB7XG4gIC8vIENhcHR1cmUgbG9jYWwgcmVmZXJlbmNlcyB0byBuYXRpdmUgQVBJcywgaW4gY2FzZSBhIHBvbHlmaWxsIG92ZXJyaWRlcyB0aGVtLlxuICB2YXIgX3NldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcbiAgdmFyIF9jbGVhclRpbWVvdXQgPSB3aW5kb3cuY2xlYXJUaW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBUT0RPOiBTY2hlZHVsZXIgbm8gbG9uZ2VyIHJlcXVpcmVzIHRoZXNlIG1ldGhvZHMgdG8gYmUgcG9seWZpbGxlZC4gQnV0XG4gICAgLy8gbWF5YmUgd2Ugd2FudCB0byBjb250aW51ZSB3YXJuaW5nIGlmIHRoZXkgZG9uJ3QgZXhpc3QsIHRvIHByZXNlcnZlIHRoZVxuICAgIC8vIG9wdGlvbiB0byByZWx5IG9uIGl0IGluIHRoZSBmdXR1cmU/XG4gICAgdmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgdmFyIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuXG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIFVzaW5nIGNvbnNvbGVbJ2Vycm9yJ10gdG8gZXZhZGUgQmFiZWwgYW5kIEVTTGludFxuICAgICAgY29uc29sZVsnZXJyb3InXShcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLiBcIiArICdNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhICcgKyAncG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9yZWFjdC1wb2x5ZmlsbHMnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBVc2luZyBjb25zb2xlWydlcnJvciddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcbiAgICAgIGNvbnNvbGVbJ2Vycm9yJ10oXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGNhbmNlbEFuaW1hdGlvbkZyYW1lLiBcIiArICdNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhICcgKyAncG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9yZWFjdC1wb2x5ZmlsbHMnKTtcbiAgICB9XG4gIH1cblxuICB2YXIgaXNNZXNzYWdlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgdmFyIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IG51bGw7XG4gIHZhciB0YXNrVGltZW91dElEID0gLTE7IC8vIFNjaGVkdWxlciBwZXJpb2RpY2FsbHkgeWllbGRzIGluIGNhc2UgdGhlcmUgaXMgb3RoZXIgd29yayBvbiB0aGUgbWFpblxuICAvLyB0aHJlYWQsIGxpa2UgdXNlciBldmVudHMuIEJ5IGRlZmF1bHQsIGl0IHlpZWxkcyBtdWx0aXBsZSB0aW1lcyBwZXIgZnJhbWUuXG4gIC8vIEl0IGRvZXMgbm90IGF0dGVtcHQgdG8gYWxpZ24gd2l0aCBmcmFtZSBib3VuZGFyaWVzLCBzaW5jZSBtb3N0IHRhc2tzIGRvbid0XG4gIC8vIG5lZWQgdG8gYmUgZnJhbWUgYWxpZ25lZDsgZm9yIHRob3NlIHRoYXQgZG8sIHVzZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuXG5cbiAgdmFyIHlpZWxkSW50ZXJ2YWwgPSA1O1xuICB2YXIgZGVhZGxpbmUgPSAwOyAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlXG5cbiAge1xuICAgIC8vIGBpc0lucHV0UGVuZGluZ2AgaXMgbm90IGF2YWlsYWJsZS4gU2luY2Ugd2UgaGF2ZSBubyB3YXkgb2Yga25vd2luZyBpZlxuICAgIC8vIHRoZXJlJ3MgcGVuZGluZyBpbnB1dCwgYWx3YXlzIHlpZWxkIGF0IHRoZSBlbmQgb2YgdGhlIGZyYW1lLlxuICAgIGV4cG9ydHMudW5zdGFibGVfc2hvdWxkWWllbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy51bnN0YWJsZV9ub3coKSA+PSBkZWFkbGluZTtcbiAgICB9OyAvLyBTaW5jZSB3ZSB5aWVsZCBldmVyeSBmcmFtZSByZWdhcmRsZXNzLCBgcmVxdWVzdFBhaW50YCBoYXMgbm8gZWZmZWN0LlxuXG5cbiAgICByZXF1ZXN0UGFpbnQgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuXG4gIGV4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGUgPSBmdW5jdGlvbiAoZnBzKSB7XG4gICAgaWYgKGZwcyA8IDAgfHwgZnBzID4gMTI1KSB7XG4gICAgICAvLyBVc2luZyBjb25zb2xlWydlcnJvciddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcbiAgICAgIGNvbnNvbGVbJ2Vycm9yJ10oJ2ZvcmNlRnJhbWVSYXRlIHRha2VzIGEgcG9zaXRpdmUgaW50IGJldHdlZW4gMCBhbmQgMTI1LCAnICsgJ2ZvcmNpbmcgZnJhbWUgcmF0ZXMgaGlnaGVyIHRoYW4gMTI1IGZwcyBpcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGZwcyA+IDApIHtcbiAgICAgIHlpZWxkSW50ZXJ2YWwgPSBNYXRoLmZsb29yKDEwMDAgLyBmcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZXNldCB0aGUgZnJhbWVyYXRlXG4gICAgICB5aWVsZEludGVydmFsID0gNTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2NoZWR1bGVkSG9zdENhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpOyAvLyBZaWVsZCBhZnRlciBgeWllbGRJbnRlcnZhbGAgbXMsIHJlZ2FyZGxlc3Mgb2Ygd2hlcmUgd2UgYXJlIGluIHRoZSB2c3luY1xuICAgICAgLy8gY3ljbGUuIFRoaXMgbWVhbnMgdGhlcmUncyBhbHdheXMgdGltZSByZW1haW5pbmcgYXQgdGhlIGJlZ2lubmluZyBvZlxuICAgICAgLy8gdGhlIG1lc3NhZ2UgZXZlbnQuXG5cbiAgICAgIGRlYWRsaW5lID0gY3VycmVudFRpbWUgKyB5aWVsZEludGVydmFsO1xuICAgICAgdmFyIGhhc1RpbWVSZW1haW5pbmcgPSB0cnVlO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgaGFzTW9yZVdvcmsgPSBzY2hlZHVsZWRIb3N0Q2FsbGJhY2soaGFzVGltZVJlbWFpbmluZywgY3VycmVudFRpbWUpO1xuXG4gICAgICAgIGlmICghaGFzTW9yZVdvcmspIHtcbiAgICAgICAgICBpc01lc3NhZ2VMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBtb3JlIHdvcmssIHNjaGVkdWxlIHRoZSBuZXh0IG1lc3NhZ2UgZXZlbnQgYXQgdGhlIGVuZFxuICAgICAgICAgIC8vIG9mIHRoZSBwcmVjZWRpbmcgb25lLlxuICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2UobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElmIGEgc2NoZWR1bGVyIHRhc2sgdGhyb3dzLCBleGl0IHRoZSBjdXJyZW50IGJyb3dzZXIgdGFzayBzbyB0aGVcbiAgICAgICAgLy8gZXJyb3IgY2FuIGJlIG9ic2VydmVkLlxuICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKG51bGwpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNNZXNzYWdlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9IC8vIFlpZWxkaW5nIHRvIHRoZSBicm93c2VyIHdpbGwgZ2l2ZSBpdCBhIGNoYW5jZSB0byBwYWludCwgc28gd2UgY2FuXG4gIH07XG5cbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgdmFyIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IHBlcmZvcm1Xb3JrVW50aWxEZWFkbGluZTtcblxuICByZXF1ZXN0SG9zdENhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICBpZiAoIWlzTWVzc2FnZUxvb3BSdW5uaW5nKSB7XG4gICAgICBpc01lc3NhZ2VMb29wUnVubmluZyA9IHRydWU7XG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKG51bGwpO1xuICAgIH1cbiAgfTtcblxuICByZXF1ZXN0SG9zdFRpbWVvdXQgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIG1zKSB7XG4gICAgdGFza1RpbWVvdXRJRCA9IF9zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbGxiYWNrKGV4cG9ydHMudW5zdGFibGVfbm93KCkpO1xuICAgIH0sIG1zKTtcbiAgfTtcblxuICBjYW5jZWxIb3N0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBfY2xlYXJUaW1lb3V0KHRhc2tUaW1lb3V0SUQpO1xuXG4gICAgdGFza1RpbWVvdXRJRCA9IC0xO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwdXNoKGhlYXAsIG5vZGUpIHtcbiAgdmFyIGluZGV4ID0gaGVhcC5sZW5ndGg7XG4gIGhlYXAucHVzaChub2RlKTtcbiAgc2lmdFVwKGhlYXAsIG5vZGUsIGluZGV4KTtcbn1cbmZ1bmN0aW9uIHBlZWsoaGVhcCkge1xuICB2YXIgZmlyc3QgPSBoZWFwWzBdO1xuICByZXR1cm4gZmlyc3QgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBmaXJzdDtcbn1cbmZ1bmN0aW9uIHBvcChoZWFwKSB7XG4gIHZhciBmaXJzdCA9IGhlYXBbMF07XG5cbiAgaWYgKGZpcnN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgbGFzdCA9IGhlYXAucG9wKCk7XG5cbiAgICBpZiAobGFzdCAhPT0gZmlyc3QpIHtcbiAgICAgIGhlYXBbMF0gPSBsYXN0O1xuICAgICAgc2lmdERvd24oaGVhcCwgbGFzdCwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNpZnRVcChoZWFwLCBub2RlLCBpKSB7XG4gIHZhciBpbmRleCA9IGk7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgcGFyZW50SW5kZXggPSBpbmRleCAtIDEgPj4+IDE7XG4gICAgdmFyIHBhcmVudCA9IGhlYXBbcGFyZW50SW5kZXhdO1xuXG4gICAgaWYgKHBhcmVudCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmUocGFyZW50LCBub2RlKSA+IDApIHtcbiAgICAgIC8vIFRoZSBwYXJlbnQgaXMgbGFyZ2VyLiBTd2FwIHBvc2l0aW9ucy5cbiAgICAgIGhlYXBbcGFyZW50SW5kZXhdID0gbm9kZTtcbiAgICAgIGhlYXBbaW5kZXhdID0gcGFyZW50O1xuICAgICAgaW5kZXggPSBwYXJlbnRJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHBhcmVudCBpcyBzbWFsbGVyLiBFeGl0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzaWZ0RG93bihoZWFwLCBub2RlLCBpKSB7XG4gIHZhciBpbmRleCA9IGk7XG4gIHZhciBsZW5ndGggPSBoZWFwLmxlbmd0aDtcblxuICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgbGVmdEluZGV4ID0gKGluZGV4ICsgMSkgKiAyIC0gMTtcbiAgICB2YXIgbGVmdCA9IGhlYXBbbGVmdEluZGV4XTtcbiAgICB2YXIgcmlnaHRJbmRleCA9IGxlZnRJbmRleCArIDE7XG4gICAgdmFyIHJpZ2h0ID0gaGVhcFtyaWdodEluZGV4XTsgLy8gSWYgdGhlIGxlZnQgb3IgcmlnaHQgbm9kZSBpcyBzbWFsbGVyLCBzd2FwIHdpdGggdGhlIHNtYWxsZXIgb2YgdGhvc2UuXG5cbiAgICBpZiAobGVmdCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmUobGVmdCwgbm9kZSkgPCAwKSB7XG4gICAgICBpZiAocmlnaHQgIT09IHVuZGVmaW5lZCAmJiBjb21wYXJlKHJpZ2h0LCBsZWZ0KSA8IDApIHtcbiAgICAgICAgaGVhcFtpbmRleF0gPSByaWdodDtcbiAgICAgICAgaGVhcFtyaWdodEluZGV4XSA9IG5vZGU7XG4gICAgICAgIGluZGV4ID0gcmlnaHRJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYXBbaW5kZXhdID0gbGVmdDtcbiAgICAgICAgaGVhcFtsZWZ0SW5kZXhdID0gbm9kZTtcbiAgICAgICAgaW5kZXggPSBsZWZ0SW5kZXg7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyaWdodCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmUocmlnaHQsIG5vZGUpIDwgMCkge1xuICAgICAgaGVhcFtpbmRleF0gPSByaWdodDtcbiAgICAgIGhlYXBbcmlnaHRJbmRleF0gPSBub2RlO1xuICAgICAgaW5kZXggPSByaWdodEluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOZWl0aGVyIGNoaWxkIGlzIHNtYWxsZXIuIEV4aXQuXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAvLyBDb21wYXJlIHNvcnQgaW5kZXggZmlyc3QsIHRoZW4gdGFzayBpZC5cbiAgdmFyIGRpZmYgPSBhLnNvcnRJbmRleCAtIGIuc29ydEluZGV4O1xuICByZXR1cm4gZGlmZiAhPT0gMCA/IGRpZmYgOiBhLmlkIC0gYi5pZDtcbn1cblxuLy8gVE9ETzogVXNlIHN5bWJvbHM/XG52YXIgSW1tZWRpYXRlUHJpb3JpdHkgPSAxO1xudmFyIFVzZXJCbG9ja2luZ1ByaW9yaXR5ID0gMjtcbnZhciBOb3JtYWxQcmlvcml0eSA9IDM7XG52YXIgTG93UHJpb3JpdHkgPSA0O1xudmFyIElkbGVQcmlvcml0eSA9IDU7XG5cbmZ1bmN0aW9uIG1hcmtUYXNrRXJyb3JlZCh0YXNrLCBtcykge1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbi8vIE1hdGgucG93KDIsIDMwKSAtIDFcbi8vIDBiMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExXG5cbnZhciBtYXhTaWduZWQzMUJpdEludCA9IDEwNzM3NDE4MjM7IC8vIFRpbWVzIG91dCBpbW1lZGlhdGVseVxuXG52YXIgSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQgPSAtMTsgLy8gRXZlbnR1YWxseSB0aW1lcyBvdXRcblxudmFyIFVTRVJfQkxPQ0tJTkdfUFJJT1JJVFlfVElNRU9VVCA9IDI1MDtcbnZhciBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVCA9IDUwMDA7XG52YXIgTE9XX1BSSU9SSVRZX1RJTUVPVVQgPSAxMDAwMDsgLy8gTmV2ZXIgdGltZXMgb3V0XG5cbnZhciBJRExFX1BSSU9SSVRZX1RJTUVPVVQgPSBtYXhTaWduZWQzMUJpdEludDsgLy8gVGFza3MgYXJlIHN0b3JlZCBvbiBhIG1pbiBoZWFwXG5cbnZhciB0YXNrUXVldWUgPSBbXTtcbnZhciB0aW1lclF1ZXVlID0gW107IC8vIEluY3JlbWVudGluZyBpZCBjb3VudGVyLiBVc2VkIHRvIG1haW50YWluIGluc2VydGlvbiBvcmRlci5cblxudmFyIHRhc2tJZENvdW50ZXIgPSAxOyAvLyBQYXVzaW5nIHRoZSBzY2hlZHVsZXIgaXMgdXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG52YXIgY3VycmVudFRhc2sgPSBudWxsO1xudmFyIGN1cnJlbnRQcmlvcml0eUxldmVsID0gTm9ybWFsUHJpb3JpdHk7IC8vIFRoaXMgaXMgc2V0IHdoaWxlIHBlcmZvcm1pbmcgd29yaywgdG8gcHJldmVudCByZS1lbnRyYW5jeS5cblxudmFyIGlzUGVyZm9ybWluZ1dvcmsgPSBmYWxzZTtcbnZhciBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xudmFyIGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gYWR2YW5jZVRpbWVycyhjdXJyZW50VGltZSkge1xuICAvLyBDaGVjayBmb3IgdGFza3MgdGhhdCBhcmUgbm8gbG9uZ2VyIGRlbGF5ZWQgYW5kIGFkZCB0aGVtIHRvIHRoZSBxdWV1ZS5cbiAgdmFyIHRpbWVyID0gcGVlayh0aW1lclF1ZXVlKTtcblxuICB3aGlsZSAodGltZXIgIT09IG51bGwpIHtcbiAgICBpZiAodGltZXIuY2FsbGJhY2sgPT09IG51bGwpIHtcbiAgICAgIC8vIFRpbWVyIHdhcyBjYW5jZWxsZWQuXG4gICAgICBwb3AodGltZXJRdWV1ZSk7XG4gICAgfSBlbHNlIGlmICh0aW1lci5zdGFydFRpbWUgPD0gY3VycmVudFRpbWUpIHtcbiAgICAgIC8vIFRpbWVyIGZpcmVkLiBUcmFuc2ZlciB0byB0aGUgdGFzayBxdWV1ZS5cbiAgICAgIHBvcCh0aW1lclF1ZXVlKTtcbiAgICAgIHRpbWVyLnNvcnRJbmRleCA9IHRpbWVyLmV4cGlyYXRpb25UaW1lO1xuICAgICAgcHVzaCh0YXNrUXVldWUsIHRpbWVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVtYWluaW5nIHRpbWVycyBhcmUgcGVuZGluZy5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aW1lciA9IHBlZWsodGltZXJRdWV1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlVGltZW91dChjdXJyZW50VGltZSkge1xuICBpc0hvc3RUaW1lb3V0U2NoZWR1bGVkID0gZmFsc2U7XG4gIGFkdmFuY2VUaW1lcnMoY3VycmVudFRpbWUpO1xuXG4gIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQpIHtcbiAgICBpZiAocGVlayh0YXNrUXVldWUpICE9PSBudWxsKSB7XG4gICAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICByZXF1ZXN0SG9zdENhbGxiYWNrKGZsdXNoV29yayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmaXJzdFRpbWVyID0gcGVlayh0aW1lclF1ZXVlKTtcblxuICAgICAgaWYgKGZpcnN0VGltZXIgIT09IG51bGwpIHtcbiAgICAgICAgcmVxdWVzdEhvc3RUaW1lb3V0KGhhbmRsZVRpbWVvdXQsIGZpcnN0VGltZXIuc3RhcnRUaW1lIC0gY3VycmVudFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbHVzaFdvcmsoaGFzVGltZVJlbWFpbmluZywgaW5pdGlhbFRpbWUpIHtcblxuXG4gIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgaWYgKGlzSG9zdFRpbWVvdXRTY2hlZHVsZWQpIHtcbiAgICAvLyBXZSBzY2hlZHVsZWQgYSB0aW1lb3V0IGJ1dCBpdCdzIG5vIGxvbmdlciBuZWVkZWQuIENhbmNlbCBpdC5cbiAgICBpc0hvc3RUaW1lb3V0U2NoZWR1bGVkID0gZmFsc2U7XG4gICAgY2FuY2VsSG9zdFRpbWVvdXQoKTtcbiAgfVxuXG4gIGlzUGVyZm9ybWluZ1dvcmsgPSB0cnVlO1xuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG5cbiAgdHJ5IHtcbiAgICBpZiAoZW5hYmxlUHJvZmlsaW5nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gd29ya0xvb3AoaGFzVGltZVJlbWFpbmluZywgaW5pdGlhbFRpbWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRUYXNrICE9PSBudWxsKSB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcbiAgICAgICAgICBtYXJrVGFza0Vycm9yZWQoY3VycmVudFRhc2ssIGN1cnJlbnRUaW1lKTtcbiAgICAgICAgICBjdXJyZW50VGFzay5pc1F1ZXVlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIGNhdGNoIGluIHByb2QgY29kZSBwYXRoLlxuICAgICAgcmV0dXJuIHdvcmtMb29wKGhhc1RpbWVSZW1haW5pbmcsIGluaXRpYWxUaW1lKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudFRhc2sgPSBudWxsO1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICAgIGlzUGVyZm9ybWluZ1dvcmsgPSBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3b3JrTG9vcChoYXNUaW1lUmVtYWluaW5nLCBpbml0aWFsVGltZSkge1xuICB2YXIgY3VycmVudFRpbWUgPSBpbml0aWFsVGltZTtcbiAgYWR2YW5jZVRpbWVycyhjdXJyZW50VGltZSk7XG4gIGN1cnJlbnRUYXNrID0gcGVlayh0YXNrUXVldWUpO1xuXG4gIHdoaWxlIChjdXJyZW50VGFzayAhPT0gbnVsbCAmJiAhKGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyApKSB7XG4gICAgaWYgKGN1cnJlbnRUYXNrLmV4cGlyYXRpb25UaW1lID4gY3VycmVudFRpbWUgJiYgKCFoYXNUaW1lUmVtYWluaW5nIHx8IGV4cG9ydHMudW5zdGFibGVfc2hvdWxkWWllbGQoKSkpIHtcbiAgICAgIC8vIFRoaXMgY3VycmVudFRhc2sgaGFzbid0IGV4cGlyZWQsIGFuZCB3ZSd2ZSByZWFjaGVkIHRoZSBkZWFkbGluZS5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBjYWxsYmFjayA9IGN1cnJlbnRUYXNrLmNhbGxiYWNrO1xuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY3VycmVudFRhc2suY2FsbGJhY2sgPSBudWxsO1xuICAgICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBjdXJyZW50VGFzay5wcmlvcml0eUxldmVsO1xuICAgICAgdmFyIGRpZFVzZXJDYWxsYmFja1RpbWVvdXQgPSBjdXJyZW50VGFzay5leHBpcmF0aW9uVGltZSA8PSBjdXJyZW50VGltZTtcblxuICAgICAgdmFyIGNvbnRpbnVhdGlvbkNhbGxiYWNrID0gY2FsbGJhY2soZGlkVXNlckNhbGxiYWNrVGltZW91dCk7XG4gICAgICBjdXJyZW50VGltZSA9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XG5cbiAgICAgIGlmICh0eXBlb2YgY29udGludWF0aW9uQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3VycmVudFRhc2suY2FsbGJhY2sgPSBjb250aW51YXRpb25DYWxsYmFjaztcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUYXNrID09PSBwZWVrKHRhc2tRdWV1ZSkpIHtcbiAgICAgICAgICBwb3AodGFza1F1ZXVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhZHZhbmNlVGltZXJzKGN1cnJlbnRUaW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9wKHRhc2tRdWV1ZSk7XG4gICAgfVxuXG4gICAgY3VycmVudFRhc2sgPSBwZWVrKHRhc2tRdWV1ZSk7XG4gIH0gLy8gUmV0dXJuIHdoZXRoZXIgdGhlcmUncyBhZGRpdGlvbmFsIHdvcmtcblxuXG4gIGlmIChjdXJyZW50VGFzayAhPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBmaXJzdFRpbWVyID0gcGVlayh0aW1lclF1ZXVlKTtcblxuICAgIGlmIChmaXJzdFRpbWVyICE9PSBudWxsKSB7XG4gICAgICByZXF1ZXN0SG9zdFRpbWVvdXQoaGFuZGxlVGltZW91dCwgZmlyc3RUaW1lci5zdGFydFRpbWUgLSBjdXJyZW50VGltZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3J1bldpdGhQcmlvcml0eShwcmlvcml0eUxldmVsLCBldmVudEhhbmRsZXIpIHtcbiAgc3dpdGNoIChwcmlvcml0eUxldmVsKSB7XG4gICAgY2FzZSBJbW1lZGlhdGVQcmlvcml0eTpcbiAgICBjYXNlIFVzZXJCbG9ja2luZ1ByaW9yaXR5OlxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgY2FzZSBMb3dQcmlvcml0eTpcbiAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcbiAgfVxuXG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmlvcml0eUxldmVsO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGV2ZW50SGFuZGxlcigpO1xuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX25leHQoZXZlbnRIYW5kbGVyKSB7XG4gIHZhciBwcmlvcml0eUxldmVsO1xuXG4gIHN3aXRjaCAoY3VycmVudFByaW9yaXR5TGV2ZWwpIHtcbiAgICBjYXNlIEltbWVkaWF0ZVByaW9yaXR5OlxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgY2FzZSBOb3JtYWxQcmlvcml0eTpcbiAgICAgIC8vIFNoaWZ0IGRvd24gdG8gbm9ybWFsIHByaW9yaXR5XG4gICAgICBwcmlvcml0eUxldmVsID0gTm9ybWFsUHJpb3JpdHk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBBbnl0aGluZyBsb3dlciB0aGFuIG5vcm1hbCBwcmlvcml0eSBzaG91bGQgcmVtYWluIGF0IHRoZSBjdXJyZW50IGxldmVsLlxuICAgICAgcHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJpb3JpdHlMZXZlbDtcblxuICB0cnkge1xuICAgIHJldHVybiBldmVudEhhbmRsZXIoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV93cmFwQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgdmFyIHBhcmVudFByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGlzIGlzIGEgZm9yayBvZiBydW5XaXRoUHJpb3JpdHksIGlubGluZWQgZm9yIHBlcmZvcm1hbmNlLlxuICAgIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHBhcmVudFByaW9yaXR5TGV2ZWw7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayhwcmlvcml0eUxldmVsLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuICB2YXIgc3RhcnRUaW1lO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucyAhPT0gbnVsbCkge1xuICAgIHZhciBkZWxheSA9IG9wdGlvbnMuZGVsYXk7XG5cbiAgICBpZiAodHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyAmJiBkZWxheSA+IDApIHtcbiAgICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lICsgZGVsYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzdGFydFRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIHZhciB0aW1lb3V0O1xuXG4gIHN3aXRjaCAocHJpb3JpdHlMZXZlbCkge1xuICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgICB0aW1lb3V0ID0gSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgICB0aW1lb3V0ID0gVVNFUl9CTE9DS0lOR19QUklPUklUWV9USU1FT1VUO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgIHRpbWVvdXQgPSBJRExFX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgTG93UHJpb3JpdHk6XG4gICAgICB0aW1lb3V0ID0gTE9XX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRpbWVvdXQgPSBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVDtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgdGltZW91dDtcbiAgdmFyIG5ld1Rhc2sgPSB7XG4gICAgaWQ6IHRhc2tJZENvdW50ZXIrKyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgcHJpb3JpdHlMZXZlbDogcHJpb3JpdHlMZXZlbCxcbiAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSxcbiAgICBleHBpcmF0aW9uVGltZTogZXhwaXJhdGlvblRpbWUsXG4gICAgc29ydEluZGV4OiAtMVxuICB9O1xuXG4gIGlmIChzdGFydFRpbWUgPiBjdXJyZW50VGltZSkge1xuICAgIC8vIFRoaXMgaXMgYSBkZWxheWVkIHRhc2suXG4gICAgbmV3VGFzay5zb3J0SW5kZXggPSBzdGFydFRpbWU7XG4gICAgcHVzaCh0aW1lclF1ZXVlLCBuZXdUYXNrKTtcblxuICAgIGlmIChwZWVrKHRhc2tRdWV1ZSkgPT09IG51bGwgJiYgbmV3VGFzayA9PT0gcGVlayh0aW1lclF1ZXVlKSkge1xuICAgICAgLy8gQWxsIHRhc2tzIGFyZSBkZWxheWVkLCBhbmQgdGhpcyBpcyB0aGUgdGFzayB3aXRoIHRoZSBlYXJsaWVzdCBkZWxheS5cbiAgICAgIGlmIChpc0hvc3RUaW1lb3V0U2NoZWR1bGVkKSB7XG4gICAgICAgIC8vIENhbmNlbCBhbiBleGlzdGluZyB0aW1lb3V0LlxuICAgICAgICBjYW5jZWxIb3N0VGltZW91dCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNIb3N0VGltZW91dFNjaGVkdWxlZCA9IHRydWU7XG4gICAgICB9IC8vIFNjaGVkdWxlIGEgdGltZW91dC5cblxuXG4gICAgICByZXF1ZXN0SG9zdFRpbWVvdXQoaGFuZGxlVGltZW91dCwgc3RhcnRUaW1lIC0gY3VycmVudFRpbWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuZXdUYXNrLnNvcnRJbmRleCA9IGV4cGlyYXRpb25UaW1lO1xuICAgIHB1c2godGFza1F1ZXVlLCBuZXdUYXNrKTtcbiAgICAvLyB3YWl0IHVudGlsIHRoZSBuZXh0IHRpbWUgd2UgeWllbGQuXG5cblxuICAgIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgJiYgIWlzUGVyZm9ybWluZ1dvcmspIHtcbiAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3VGFzaztcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfcGF1c2VFeGVjdXRpb24oKSB7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uKCkge1xuXG4gIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgJiYgIWlzUGVyZm9ybWluZ1dvcmspIHtcbiAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IHRydWU7XG4gICAgcmVxdWVzdEhvc3RDYWxsYmFjayhmbHVzaFdvcmspO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlKCkge1xuICByZXR1cm4gcGVlayh0YXNrUXVldWUpO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9jYW5jZWxDYWxsYmFjayh0YXNrKSB7XG4gIC8vIHJlbW92ZSBmcm9tIHRoZSBxdWV1ZSBiZWNhdXNlIHlvdSBjYW4ndCByZW1vdmUgYXJiaXRyYXJ5IG5vZGVzIGZyb20gYW5cbiAgLy8gYXJyYXkgYmFzZWQgaGVhcCwgb25seSB0aGUgZmlyc3Qgb25lLilcblxuXG4gIHRhc2suY2FsbGJhY2sgPSBudWxsO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCgpIHtcbiAgcmV0dXJuIGN1cnJlbnRQcmlvcml0eUxldmVsO1xufVxuXG52YXIgdW5zdGFibGVfcmVxdWVzdFBhaW50ID0gcmVxdWVzdFBhaW50O1xudmFyIHVuc3RhYmxlX1Byb2ZpbGluZyA9ICBudWxsO1xuXG5leHBvcnRzLnVuc3RhYmxlX0lkbGVQcmlvcml0eSA9IElkbGVQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHkgPSBJbW1lZGlhdGVQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfTG93UHJpb3JpdHkgPSBMb3dQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfTm9ybWFsUHJpb3JpdHkgPSBOb3JtYWxQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfUHJvZmlsaW5nID0gdW5zdGFibGVfUHJvZmlsaW5nO1xuZXhwb3J0cy51bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSA9IFVzZXJCbG9ja2luZ1ByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjayA9IHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrO1xuZXhwb3J0cy51bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbiA9IHVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uO1xuZXhwb3J0cy51bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCA9IHVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsO1xuZXhwb3J0cy51bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZSA9IHVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlO1xuZXhwb3J0cy51bnN0YWJsZV9uZXh0ID0gdW5zdGFibGVfbmV4dDtcbmV4cG9ydHMudW5zdGFibGVfcGF1c2VFeGVjdXRpb24gPSB1bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbjtcbmV4cG9ydHMudW5zdGFibGVfcmVxdWVzdFBhaW50ID0gdW5zdGFibGVfcmVxdWVzdFBhaW50O1xuZXhwb3J0cy51bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHkgPSB1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sgPSB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrO1xuZXhwb3J0cy51bnN0YWJsZV93cmFwQ2FsbGJhY2sgPSB1bnN0YWJsZV93cmFwQ2FsbGJhY2s7XG4gIH0pKCk7XG59XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjAuMjAuMlxuICogc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbid1c2Ugc3RyaWN0Jzt2YXIgZixnLGgsaztpZihcIm9iamVjdFwiPT09dHlwZW9mIHBlcmZvcm1hbmNlJiZcImZ1bmN0aW9uXCI9PT10eXBlb2YgcGVyZm9ybWFuY2Uubm93KXt2YXIgbD1wZXJmb3JtYW5jZTtleHBvcnRzLnVuc3RhYmxlX25vdz1mdW5jdGlvbigpe3JldHVybiBsLm5vdygpfX1lbHNle3ZhciBwPURhdGUscT1wLm5vdygpO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHAubm93KCktcX19XG5pZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIHdpbmRvd3x8XCJmdW5jdGlvblwiIT09dHlwZW9mIE1lc3NhZ2VDaGFubmVsKXt2YXIgdD1udWxsLHU9bnVsbCx3PWZ1bmN0aW9uKCl7aWYobnVsbCE9PXQpdHJ5e3ZhciBhPWV4cG9ydHMudW5zdGFibGVfbm93KCk7dCghMCxhKTt0PW51bGx9Y2F0Y2goYil7dGhyb3cgc2V0VGltZW91dCh3LDApLGI7fX07Zj1mdW5jdGlvbihhKXtudWxsIT09dD9zZXRUaW1lb3V0KGYsMCxhKToodD1hLHNldFRpbWVvdXQodywwKSl9O2c9ZnVuY3Rpb24oYSxiKXt1PXNldFRpbWVvdXQoYSxiKX07aD1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KX07ZXhwb3J0cy51bnN0YWJsZV9zaG91bGRZaWVsZD1mdW5jdGlvbigpe3JldHVybiExfTtrPWV4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGU9ZnVuY3Rpb24oKXt9fWVsc2V7dmFyIHg9d2luZG93LnNldFRpbWVvdXQseT13aW5kb3cuY2xlYXJUaW1lb3V0O2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIHo9XG53aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XCJmdW5jdGlvblwiIT09dHlwZW9mIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUmJmNvbnNvbGUuZXJyb3IoXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4gTWFrZSBzdXJlIHRoYXQgeW91IGxvYWQgYSBwb2x5ZmlsbCBpbiBvbGRlciBicm93c2Vycy4gaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3JlYWN0LXBvbHlmaWxsc1wiKTtcImZ1bmN0aW9uXCIhPT10eXBlb2YgeiYmY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgY2FuY2VsQW5pbWF0aW9uRnJhbWUuIE1ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgcG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9yZWFjdC1wb2x5ZmlsbHNcIil9dmFyIEE9ITEsQj1udWxsLEM9LTEsRD01LEU9MDtleHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkPWZ1bmN0aW9uKCl7cmV0dXJuIGV4cG9ydHMudW5zdGFibGVfbm93KCk+PVxuRX07az1mdW5jdGlvbigpe307ZXhwb3J0cy51bnN0YWJsZV9mb3JjZUZyYW1lUmF0ZT1mdW5jdGlvbihhKXswPmF8fDEyNTxhP2NvbnNvbGUuZXJyb3IoXCJmb3JjZUZyYW1lUmF0ZSB0YWtlcyBhIHBvc2l0aXZlIGludCBiZXR3ZWVuIDAgYW5kIDEyNSwgZm9yY2luZyBmcmFtZSByYXRlcyBoaWdoZXIgdGhhbiAxMjUgZnBzIGlzIG5vdCBzdXBwb3J0ZWRcIik6RD0wPGE/TWF0aC5mbG9vcigxRTMvYSk6NX07dmFyIEY9bmV3IE1lc3NhZ2VDaGFubmVsLEc9Ri5wb3J0MjtGLnBvcnQxLm9ubWVzc2FnZT1mdW5jdGlvbigpe2lmKG51bGwhPT1CKXt2YXIgYT1leHBvcnRzLnVuc3RhYmxlX25vdygpO0U9YStEO3RyeXtCKCEwLGEpP0cucG9zdE1lc3NhZ2UobnVsbCk6KEE9ITEsQj1udWxsKX1jYXRjaChiKXt0aHJvdyBHLnBvc3RNZXNzYWdlKG51bGwpLGI7fX1lbHNlIEE9ITF9O2Y9ZnVuY3Rpb24oYSl7Qj1hO0F8fChBPSEwLEcucG9zdE1lc3NhZ2UobnVsbCkpfTtnPWZ1bmN0aW9uKGEsYil7Qz1cbngoZnVuY3Rpb24oKXthKGV4cG9ydHMudW5zdGFibGVfbm93KCkpfSxiKX07aD1mdW5jdGlvbigpe3koQyk7Qz0tMX19ZnVuY3Rpb24gSChhLGIpe3ZhciBjPWEubGVuZ3RoO2EucHVzaChiKTthOmZvcig7Oyl7dmFyIGQ9Yy0xPj4+MSxlPWFbZF07aWYodm9pZCAwIT09ZSYmMDxJKGUsYikpYVtkXT1iLGFbY109ZSxjPWQ7ZWxzZSBicmVhayBhfX1mdW5jdGlvbiBKKGEpe2E9YVswXTtyZXR1cm4gdm9pZCAwPT09YT9udWxsOmF9XG5mdW5jdGlvbiBLKGEpe3ZhciBiPWFbMF07aWYodm9pZCAwIT09Yil7dmFyIGM9YS5wb3AoKTtpZihjIT09Yil7YVswXT1jO2E6Zm9yKHZhciBkPTAsZT1hLmxlbmd0aDtkPGU7KXt2YXIgbT0yKihkKzEpLTEsbj1hW21dLHY9bSsxLHI9YVt2XTtpZih2b2lkIDAhPT1uJiYwPkkobixjKSl2b2lkIDAhPT1yJiYwPkkocixuKT8oYVtkXT1yLGFbdl09YyxkPXYpOihhW2RdPW4sYVttXT1jLGQ9bSk7ZWxzZSBpZih2b2lkIDAhPT1yJiYwPkkocixjKSlhW2RdPXIsYVt2XT1jLGQ9djtlbHNlIGJyZWFrIGF9fXJldHVybiBifXJldHVybiBudWxsfWZ1bmN0aW9uIEkoYSxiKXt2YXIgYz1hLnNvcnRJbmRleC1iLnNvcnRJbmRleDtyZXR1cm4gMCE9PWM/YzphLmlkLWIuaWR9dmFyIEw9W10sTT1bXSxOPTEsTz1udWxsLFA9MyxRPSExLFI9ITEsUz0hMTtcbmZ1bmN0aW9uIFQoYSl7Zm9yKHZhciBiPUooTSk7bnVsbCE9PWI7KXtpZihudWxsPT09Yi5jYWxsYmFjaylLKE0pO2Vsc2UgaWYoYi5zdGFydFRpbWU8PWEpSyhNKSxiLnNvcnRJbmRleD1iLmV4cGlyYXRpb25UaW1lLEgoTCxiKTtlbHNlIGJyZWFrO2I9SihNKX19ZnVuY3Rpb24gVShhKXtTPSExO1QoYSk7aWYoIVIpaWYobnVsbCE9PUooTCkpUj0hMCxmKFYpO2Vsc2V7dmFyIGI9SihNKTtudWxsIT09YiYmZyhVLGIuc3RhcnRUaW1lLWEpfX1cbmZ1bmN0aW9uIFYoYSxiKXtSPSExO1MmJihTPSExLGgoKSk7UT0hMDt2YXIgYz1QO3RyeXtUKGIpO2ZvcihPPUooTCk7bnVsbCE9PU8mJighKE8uZXhwaXJhdGlvblRpbWU+Yil8fGEmJiFleHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkKCkpOyl7dmFyIGQ9Ty5jYWxsYmFjaztpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZCl7Ty5jYWxsYmFjaz1udWxsO1A9Ty5wcmlvcml0eUxldmVsO3ZhciBlPWQoTy5leHBpcmF0aW9uVGltZTw9Yik7Yj1leHBvcnRzLnVuc3RhYmxlX25vdygpO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBlP08uY2FsbGJhY2s9ZTpPPT09SihMKSYmSyhMKTtUKGIpfWVsc2UgSyhMKTtPPUooTCl9aWYobnVsbCE9PU8pdmFyIG09ITA7ZWxzZXt2YXIgbj1KKE0pO251bGwhPT1uJiZnKFUsbi5zdGFydFRpbWUtYik7bT0hMX1yZXR1cm4gbX1maW5hbGx5e089bnVsbCxQPWMsUT0hMX19dmFyIFc9aztleHBvcnRzLnVuc3RhYmxlX0lkbGVQcmlvcml0eT01O1xuZXhwb3J0cy51bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eT0xO2V4cG9ydHMudW5zdGFibGVfTG93UHJpb3JpdHk9NDtleHBvcnRzLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5PTM7ZXhwb3J0cy51bnN0YWJsZV9Qcm9maWxpbmc9bnVsbDtleHBvcnRzLnVuc3RhYmxlX1VzZXJCbG9ja2luZ1ByaW9yaXR5PTI7ZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjaz1mdW5jdGlvbihhKXthLmNhbGxiYWNrPW51bGx9O2V4cG9ydHMudW5zdGFibGVfY29udGludWVFeGVjdXRpb249ZnVuY3Rpb24oKXtSfHxRfHwoUj0hMCxmKFYpKX07ZXhwb3J0cy51bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbD1mdW5jdGlvbigpe3JldHVybiBQfTtleHBvcnRzLnVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIEooTCl9O1xuZXhwb3J0cy51bnN0YWJsZV9uZXh0PWZ1bmN0aW9uKGEpe3N3aXRjaChQKXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzp2YXIgYj0zO2JyZWFrO2RlZmF1bHQ6Yj1QfXZhciBjPVA7UD1iO3RyeXtyZXR1cm4gYSgpfWZpbmFsbHl7UD1jfX07ZXhwb3J0cy51bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbj1mdW5jdGlvbigpe307ZXhwb3J0cy51bnN0YWJsZV9yZXF1ZXN0UGFpbnQ9VztleHBvcnRzLnVuc3RhYmxlX3J1bldpdGhQcmlvcml0eT1mdW5jdGlvbihhLGIpe3N3aXRjaChhKXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzpjYXNlIDQ6Y2FzZSA1OmJyZWFrO2RlZmF1bHQ6YT0zfXZhciBjPVA7UD1hO3RyeXtyZXR1cm4gYigpfWZpbmFsbHl7UD1jfX07XG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2s9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWV4cG9ydHMudW5zdGFibGVfbm93KCk7XCJvYmplY3RcIj09PXR5cGVvZiBjJiZudWxsIT09Yz8oYz1jLmRlbGF5LGM9XCJudW1iZXJcIj09PXR5cGVvZiBjJiYwPGM/ZCtjOmQpOmM9ZDtzd2l0Y2goYSl7Y2FzZSAxOnZhciBlPS0xO2JyZWFrO2Nhc2UgMjplPTI1MDticmVhaztjYXNlIDU6ZT0xMDczNzQxODIzO2JyZWFrO2Nhc2UgNDplPTFFNDticmVhaztkZWZhdWx0OmU9NUUzfWU9YytlO2E9e2lkOk4rKyxjYWxsYmFjazpiLHByaW9yaXR5TGV2ZWw6YSxzdGFydFRpbWU6YyxleHBpcmF0aW9uVGltZTplLHNvcnRJbmRleDotMX07Yz5kPyhhLnNvcnRJbmRleD1jLEgoTSxhKSxudWxsPT09SihMKSYmYT09PUooTSkmJihTP2goKTpTPSEwLGcoVSxjLWQpKSk6KGEuc29ydEluZGV4PWUsSChMLGEpLFJ8fFF8fChSPSEwLGYoVikpKTtyZXR1cm4gYX07XG5leHBvcnRzLnVuc3RhYmxlX3dyYXBDYWxsYmFjaz1mdW5jdGlvbihhKXt2YXIgYj1QO3JldHVybiBmdW5jdGlvbigpe3ZhciBjPVA7UD1iO3RyeXtyZXR1cm4gYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZmluYWxseXtQPWN9fX07XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgdmFuaWxsYSA9IHJlcXVpcmUoJ3ZhbHRpby92YW5pbGxhJyk7XG52YXIgcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIHByb3h5Q29tcGFyZSA9IHJlcXVpcmUoJ3Byb3h5LWNvbXBhcmUnKTtcblxudmFyIFRBUkdFVCA9IFN5bWJvbCgpO1xudmFyIEdFVF9WRVJTSU9OID0gU3ltYm9sKCk7XG52YXIgY3JlYXRlTXV0YWJsZVNvdXJjZSA9IGZ1bmN0aW9uIGNyZWF0ZU11dGFibGVTb3VyY2UodGFyZ2V0LCBnZXRWZXJzaW9uKSB7XG4gIHZhciBfcmVmO1xuXG4gIHJldHVybiBfcmVmID0ge30sIF9yZWZbVEFSR0VUXSA9IHRhcmdldCwgX3JlZltHRVRfVkVSU0lPTl0gPSBnZXRWZXJzaW9uLCBfcmVmO1xufTtcbnZhciB1c2VNdXRhYmxlU291cmNlID0gZnVuY3Rpb24gdXNlTXV0YWJsZVNvdXJjZShzb3VyY2UsIGdldFNuYXBzaG90LCBzdWJzY3JpYmUpIHtcbiAgdmFyIGxhc3RWZXJzaW9uID0gcmVhY3QudXNlUmVmKDApO1xuICB2YXIgY3VycmVudFZlcnNpb24gPSBzb3VyY2VbR0VUX1ZFUlNJT05dKHNvdXJjZVtUQVJHRVRdKTtcblxuICB2YXIgX3VzZVN0YXRlID0gcmVhY3QudXNlU3RhdGUoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pXTtcbiAgfSksXG4gICAgICBzdGF0ZSA9IF91c2VTdGF0ZVswXSxcbiAgICAgIHNldFN0YXRlID0gX3VzZVN0YXRlWzFdO1xuXG4gIHZhciBjdXJyZW50U25hcHNob3QgPSBzdGF0ZVs0XTtcblxuICBpZiAoc3RhdGVbMF0gIT09IHNvdXJjZSB8fCBzdGF0ZVsxXSAhPT0gZ2V0U25hcHNob3QgfHwgc3RhdGVbMl0gIT09IHN1YnNjcmliZSkge1xuICAgIGN1cnJlbnRTbmFwc2hvdCA9IGdldFNuYXBzaG90KHNvdXJjZVtUQVJHRVRdKTtcbiAgICBzZXRTdGF0ZShbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlLCBjdXJyZW50VmVyc2lvbiwgY3VycmVudFNuYXBzaG90XSk7XG4gIH0gZWxzZSBpZiAoY3VycmVudFZlcnNpb24gIT09IHN0YXRlWzNdICYmIGN1cnJlbnRWZXJzaW9uICE9PSBsYXN0VmVyc2lvbi5jdXJyZW50KSB7XG4gICAgY3VycmVudFNuYXBzaG90ID0gZ2V0U25hcHNob3Qoc291cmNlW1RBUkdFVF0pO1xuXG4gICAgaWYgKCFPYmplY3QuaXMoY3VycmVudFNuYXBzaG90LCBzdGF0ZVs0XSkpIHtcbiAgICAgIHNldFN0YXRlKFtzb3VyY2UsIGdldFNuYXBzaG90LCBzdWJzY3JpYmUsIGN1cnJlbnRWZXJzaW9uLCBjdXJyZW50U25hcHNob3RdKTtcbiAgICB9XG4gIH1cblxuICByZWFjdC51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBkaWRVbnN1YnNjcmliZSA9IGZhbHNlO1xuXG4gICAgdmFyIGNoZWNrRm9yVXBkYXRlcyA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlcygpIHtcbiAgICAgIGlmIChkaWRVbnN1YnNjcmliZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBuZXh0U25hcHNob3QgPSBnZXRTbmFwc2hvdChzb3VyY2VbVEFSR0VUXSk7XG4gICAgICAgIHZhciBuZXh0VmVyc2lvbiA9IHNvdXJjZVtHRVRfVkVSU0lPTl0oc291cmNlW1RBUkdFVF0pO1xuICAgICAgICBsYXN0VmVyc2lvbi5jdXJyZW50ID0gbmV4dFZlcnNpb247XG4gICAgICAgIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgaWYgKHByZXZbMF0gIT09IHNvdXJjZSB8fCBwcmV2WzFdICE9PSBnZXRTbmFwc2hvdCB8fCBwcmV2WzJdICE9PSBzdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChPYmplY3QuaXMocHJldls0XSwgbmV4dFNuYXBzaG90KSkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFtwcmV2WzBdLCBwcmV2WzFdLCBwcmV2WzJdLCBuZXh0VmVyc2lvbiwgbmV4dFNuYXBzaG90XTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNldFN0YXRlKGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChwcmV2KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1bnN1YnNjcmliZSA9IHN1YnNjcmliZShzb3VyY2VbVEFSR0VUXSwgY2hlY2tGb3JVcGRhdGVzKTtcbiAgICBjaGVja0ZvclVwZGF0ZXMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZGlkVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbc291cmNlLCBnZXRTbmFwc2hvdCwgc3Vic2NyaWJlXSk7XG4gIHJldHVybiBjdXJyZW50U25hcHNob3Q7XG59O1xuXG52YXIgaXNTU1IgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAhd2luZG93Lm5hdmlnYXRvciB8fCAvU2VydmVyU2lkZVJlbmRlcmluZ3xeRGVub1xcLy8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG52YXIgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCA9IGlzU1NSID8gcmVhY3QudXNlRWZmZWN0IDogcmVhY3QudXNlTGF5b3V0RWZmZWN0O1xuXG52YXIgdXNlQWZmZWN0ZWREZWJ1Z1ZhbHVlID0gZnVuY3Rpb24gdXNlQWZmZWN0ZWREZWJ1Z1ZhbHVlKHN0YXRlLCBhZmZlY3RlZCkge1xuICB2YXIgcGF0aExpc3QgPSByZWFjdC51c2VSZWYoKTtcbiAgcmVhY3QudXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBwYXRoTGlzdC5jdXJyZW50ID0gcHJveHlDb21wYXJlLmFmZmVjdGVkVG9QYXRoTGlzdChzdGF0ZSwgYWZmZWN0ZWQpO1xuICB9KTtcbiAgcmVhY3QudXNlRGVidWdWYWx1ZShwYXRoTGlzdC5jdXJyZW50KTtcbn07XG5cbnZhciBtdXRhYmxlU291cmNlQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuXG52YXIgZ2V0TXV0YWJsZVNvdXJjZSA9IGZ1bmN0aW9uIGdldE11dGFibGVTb3VyY2UocHJveHlPYmplY3QpIHtcbiAgaWYgKCFtdXRhYmxlU291cmNlQ2FjaGUuaGFzKHByb3h5T2JqZWN0KSkge1xuICAgIG11dGFibGVTb3VyY2VDYWNoZS5zZXQocHJveHlPYmplY3QsIGNyZWF0ZU11dGFibGVTb3VyY2UocHJveHlPYmplY3QsIHZhbmlsbGEuZ2V0VmVyc2lvbikpO1xuICB9XG5cbiAgcmV0dXJuIG11dGFibGVTb3VyY2VDYWNoZS5nZXQocHJveHlPYmplY3QpO1xufTtcblxudmFyIHVzZVNuYXBzaG90ID0gZnVuY3Rpb24gdXNlU25hcHNob3QocHJveHlPYmplY3QsIG9wdGlvbnMpIHtcbiAgdmFyIF91c2VSZWR1Y2VyID0gcmVhY3QudXNlUmVkdWNlcihmdW5jdGlvbiAoYykge1xuICAgIHJldHVybiBjICsgMTtcbiAgfSwgMCksXG4gICAgICBmb3JjZVVwZGF0ZSA9IF91c2VSZWR1Y2VyWzFdO1xuXG4gIHZhciBhZmZlY3RlZCA9IG5ldyBXZWFrTWFwKCk7XG4gIHZhciBsYXN0QWZmZWN0ZWQgPSByZWFjdC51c2VSZWYoKTtcbiAgdmFyIHByZXZTbmFwc2hvdCA9IHJlYWN0LnVzZVJlZigpO1xuICB2YXIgbGFzdFNuYXBzaG90ID0gcmVhY3QudXNlUmVmKCk7XG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGxhc3RTbmFwc2hvdC5jdXJyZW50ID0gcHJldlNuYXBzaG90LmN1cnJlbnQgPSB2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KTtcbiAgfSwgW3Byb3h5T2JqZWN0XSk7XG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGxhc3RBZmZlY3RlZC5jdXJyZW50ID0gYWZmZWN0ZWQ7XG5cbiAgICBpZiAocHJldlNuYXBzaG90LmN1cnJlbnQgIT09IGxhc3RTbmFwc2hvdC5jdXJyZW50ICYmIHByb3h5Q29tcGFyZS5pc0RlZXBDaGFuZ2VkKHByZXZTbmFwc2hvdC5jdXJyZW50LCBsYXN0U25hcHNob3QuY3VycmVudCwgYWZmZWN0ZWQsIG5ldyBXZWFrTWFwKCkpKSB7XG4gICAgICBwcmV2U25hcHNob3QuY3VycmVudCA9IGxhc3RTbmFwc2hvdC5jdXJyZW50O1xuICAgICAgZm9yY2VVcGRhdGUoKTtcbiAgICB9XG4gIH0pO1xuICB2YXIgbm90aWZ5SW5TeW5jID0gb3B0aW9ucyA9PSBudWxsID8gdm9pZCAwIDogb3B0aW9ucy5zeW5jO1xuICB2YXIgc3ViID0gcmVhY3QudXNlQ2FsbGJhY2soZnVuY3Rpb24gKHByb3h5T2JqZWN0LCBjYikge1xuICAgIHJldHVybiB2YW5pbGxhLnN1YnNjcmliZShwcm94eU9iamVjdCwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5leHRTbmFwc2hvdCA9IHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpO1xuICAgICAgbGFzdFNuYXBzaG90LmN1cnJlbnQgPSBuZXh0U25hcHNob3Q7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChsYXN0QWZmZWN0ZWQuY3VycmVudCAmJiAhcHJveHlDb21wYXJlLmlzRGVlcENoYW5nZWQocHJldlNuYXBzaG90LmN1cnJlbnQsIG5leHRTbmFwc2hvdCwgbGFzdEFmZmVjdGVkLmN1cnJlbnQsIG5ldyBXZWFrTWFwKCkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgICBwcmV2U25hcHNob3QuY3VycmVudCA9IG5leHRTbmFwc2hvdDtcbiAgICAgIGNiKCk7XG4gICAgfSwgbm90aWZ5SW5TeW5jKTtcbiAgfSwgW25vdGlmeUluU3luY10pO1xuICB2YXIgY3VyclNuYXBzaG90ID0gdXNlTXV0YWJsZVNvdXJjZShnZXRNdXRhYmxlU291cmNlKHByb3h5T2JqZWN0KSwgdmFuaWxsYS5zbmFwc2hvdCwgc3ViKTtcblxuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB1c2VBZmZlY3RlZERlYnVnVmFsdWUoY3VyclNuYXBzaG90LCBhZmZlY3RlZCk7XG4gIH1cblxuICB2YXIgcHJveHlDYWNoZSA9IHJlYWN0LnVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgV2Vha01hcCgpO1xuICB9LCBbXSk7XG4gIHJldHVybiBwcm94eUNvbXBhcmUuY3JlYXRlRGVlcFByb3h5KGN1cnJTbmFwc2hvdCwgYWZmZWN0ZWQsIHByb3h5Q2FjaGUpO1xufTtcblxuZXhwb3J0cy51c2VTbmFwc2hvdCA9IHVzZVNuYXBzaG90O1xuT2JqZWN0LmtleXModmFuaWxsYSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICBpZiAoayAhPT0gJ2RlZmF1bHQnICYmICFleHBvcnRzLmhhc093blByb3BlcnR5KGspKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgaywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmFuaWxsYVtrXTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBwcm94eUNvbXBhcmUgPSByZXF1aXJlKCdwcm94eS1jb21wYXJlJyk7XG52YXIgdmFuaWxsYSA9IHJlcXVpcmUoJ3ZhbHRpby92YW5pbGxhJyk7XG5cbnZhciBzdWJzY3JpYmVLZXkgPSBmdW5jdGlvbiBzdWJzY3JpYmVLZXkocHJveHlPYmplY3QsIGtleSwgY2FsbGJhY2ssIG5vdGlmeUluU3luYykge1xuICB2YXIgcHJldlZhbHVlID0gcHJveHlPYmplY3Rba2V5XTtcbiAgcmV0dXJuIHZhbmlsbGEuc3Vic2NyaWJlKHByb3h5T2JqZWN0LCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5leHRWYWx1ZSA9IHByb3h5T2JqZWN0W2tleV07XG5cbiAgICBpZiAoIU9iamVjdC5pcyhwcmV2VmFsdWUsIG5leHRWYWx1ZSkpIHtcbiAgICAgIGNhbGxiYWNrKHByZXZWYWx1ZSA9IG5leHRWYWx1ZSk7XG4gICAgfVxuICB9LCBub3RpZnlJblN5bmMpO1xufTtcbnZhciBkZXZ0b29scyA9IGZ1bmN0aW9uIGRldnRvb2xzKHByb3h5T2JqZWN0LCBuYW1lKSB7XG4gIHZhciBleHRlbnNpb247XG5cbiAgdHJ5IHtcbiAgICBleHRlbnNpb24gPSB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXztcbiAgfSBjYXRjaCAoX3VudXNlZCkge31cblxuICBpZiAoIWV4dGVuc2lvbikge1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dhcm5pbmddIFBsZWFzZSBpbnN0YWxsL2VuYWJsZSBSZWR1eCBkZXZ0b29scyBleHRlbnNpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaXNUaW1lVHJhdmVsaW5nID0gZmFsc2U7XG4gIHZhciBkZXZ0b29scyA9IGV4dGVuc2lvbi5jb25uZWN0KHtcbiAgICBuYW1lOiBuYW1lXG4gIH0pO1xuICB2YXIgdW5zdWIxID0gdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaXNUaW1lVHJhdmVsaW5nKSB7XG4gICAgICBpc1RpbWVUcmF2ZWxpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGV2dG9vbHMuc2VuZChcIlVwZGF0ZSAtIFwiICsgbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpLCB2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KSk7XG4gICAgfVxuICB9KTtcbiAgdmFyIHVuc3ViMiA9IGRldnRvb2xzLnN1YnNjcmliZShmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIHZhciBfbWVzc2FnZSRwYXlsb2FkMywgX21lc3NhZ2UkcGF5bG9hZDQ7XG5cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnRElTUEFUQ0gnICYmIG1lc3NhZ2Uuc3RhdGUpIHtcbiAgICAgIHZhciBfbWVzc2FnZSRwYXlsb2FkLCBfbWVzc2FnZSRwYXlsb2FkMjtcblxuICAgICAgaWYgKCgoX21lc3NhZ2UkcGF5bG9hZCA9IG1lc3NhZ2UucGF5bG9hZCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9tZXNzYWdlJHBheWxvYWQudHlwZSkgPT09ICdKVU1QX1RPX0FDVElPTicgfHwgKChfbWVzc2FnZSRwYXlsb2FkMiA9IG1lc3NhZ2UucGF5bG9hZCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9tZXNzYWdlJHBheWxvYWQyLnR5cGUpID09PSAnSlVNUF9UT19TVEFURScpIHtcbiAgICAgICAgaXNUaW1lVHJhdmVsaW5nID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5leHRWYWx1ZSA9IEpTT04ucGFyc2UobWVzc2FnZS5zdGF0ZSk7XG4gICAgICBPYmplY3Qua2V5cyhuZXh0VmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBwcm94eU9iamVjdFtrZXldID0gbmV4dFZhbHVlW2tleV07XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0RJU1BBVENIJyAmJiAoKF9tZXNzYWdlJHBheWxvYWQzID0gbWVzc2FnZS5wYXlsb2FkKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZDMudHlwZSkgPT09ICdDT01NSVQnKSB7XG4gICAgICBkZXZ0b29scy5pbml0KHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0RJU1BBVENIJyAmJiAoKF9tZXNzYWdlJHBheWxvYWQ0ID0gbWVzc2FnZS5wYXlsb2FkKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZDQudHlwZSkgPT09ICdJTVBPUlRfU1RBVEUnKSB7XG4gICAgICB2YXIgX21lc3NhZ2UkcGF5bG9hZCRuZXh0LCBfbWVzc2FnZSRwYXlsb2FkJG5leHQyO1xuXG4gICAgICB2YXIgYWN0aW9ucyA9IChfbWVzc2FnZSRwYXlsb2FkJG5leHQgPSBtZXNzYWdlLnBheWxvYWQubmV4dExpZnRlZFN0YXRlKSA9PSBudWxsID8gdm9pZCAwIDogX21lc3NhZ2UkcGF5bG9hZCRuZXh0LmFjdGlvbnNCeUlkO1xuICAgICAgdmFyIGNvbXB1dGVkU3RhdGVzID0gKChfbWVzc2FnZSRwYXlsb2FkJG5leHQyID0gbWVzc2FnZS5wYXlsb2FkLm5leHRMaWZ0ZWRTdGF0ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9tZXNzYWdlJHBheWxvYWQkbmV4dDIuY29tcHV0ZWRTdGF0ZXMpIHx8IFtdO1xuICAgICAgaXNUaW1lVHJhdmVsaW5nID0gdHJ1ZTtcbiAgICAgIGNvbXB1dGVkU3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYsIGluZGV4KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGU7XG4gICAgICAgIHZhciBhY3Rpb24gPSBhY3Rpb25zW2luZGV4XSB8fCBcIlVwZGF0ZSAtIFwiICsgbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICBPYmplY3Qua2V5cyhzdGF0ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcHJveHlPYmplY3Rba2V5XSA9IHN0YXRlW2tleV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIGRldnRvb2xzLmluaXQodmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRldnRvb2xzLnNlbmQoYWN0aW9uLCB2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGRldnRvb2xzLmluaXQodmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCkpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHVuc3ViMSgpO1xuICAgIHVuc3ViMigpO1xuICB9O1xufTtcbnZhciBhZGRDb21wdXRlZCA9IGZ1bmN0aW9uIGFkZENvbXB1dGVkKHByb3h5T2JqZWN0LCBjb21wdXRlZEZucywgdGFyZ2V0T2JqZWN0KSB7XG4gIGlmICh0YXJnZXRPYmplY3QgPT09IHZvaWQgMCkge1xuICAgIHRhcmdldE9iamVjdCA9IHByb3h5T2JqZWN0O1xuICB9XG4gIE9iamVjdC5rZXlzKGNvbXB1dGVkRm5zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXRPYmplY3QsIGtleSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb2JqZWN0IHByb3BlcnR5IGFscmVhZHkgZGVmaW5lZCcpO1xuICAgIH1cblxuICAgIHZhciBnZXQgPSBjb21wdXRlZEZuc1trZXldO1xuICAgIHZhciBwcmV2U25hcHNob3Q7XG4gICAgdmFyIGFmZmVjdGVkID0gbmV3IFdlYWtNYXAoKTtcbiAgICB2YXIgcGVuZGluZyA9IGZhbHNlO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICB2YXIgbmV4dFNuYXBzaG90ID0gdmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCk7XG5cbiAgICAgIGlmICghcGVuZGluZyAmJiAoIXByZXZTbmFwc2hvdCB8fCBwcm94eUNvbXBhcmUuaXNEZWVwQ2hhbmdlZChwcmV2U25hcHNob3QsIG5leHRTbmFwc2hvdCwgYWZmZWN0ZWQpKSkge1xuICAgICAgICBhZmZlY3RlZCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgIHZhciB2YWx1ZSA9IGdldChwcm94eUNvbXBhcmUuY3JlYXRlRGVlcFByb3h5KG5leHRTbmFwc2hvdCwgYWZmZWN0ZWQpKTtcbiAgICAgICAgcHJldlNuYXBzaG90ID0gbmV4dFNuYXBzaG90O1xuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZS50aGVuKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICB0YXJnZXRPYmplY3Rba2V5XSA9IHY7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHRhcmdldE9iamVjdFtrZXldID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0T2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFuaWxsYS5zdWJzY3JpYmUocHJveHlPYmplY3QsIGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcbn07XG52YXIgcHJveHlXaXRoQ29tcHV0ZWQgPSBmdW5jdGlvbiBwcm94eVdpdGhDb21wdXRlZChpbml0aWFsT2JqZWN0LCBjb21wdXRlZEZucykge1xuICBPYmplY3Qua2V5cyhjb21wdXRlZEZucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaW5pdGlhbE9iamVjdCwga2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QgcHJvcGVydHkgYWxyZWFkeSBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXB1dGVkRm4gPSBjb21wdXRlZEZuc1trZXldO1xuXG4gICAgdmFyIF9yZWYyID0gdHlwZW9mIGNvbXB1dGVkRm4gPT09ICdmdW5jdGlvbicgPyB7XG4gICAgICBnZXQ6IGNvbXB1dGVkRm5cbiAgICB9IDogY29tcHV0ZWRGbixcbiAgICAgICAgZ2V0ID0gX3JlZjIuZ2V0LFxuICAgICAgICBzZXQgPSBfcmVmMi5zZXQ7XG5cbiAgICB2YXIgY29tcHV0ZWRWYWx1ZTtcbiAgICB2YXIgcHJldlNuYXBzaG90O1xuICAgIHZhciBhZmZlY3RlZCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgdmFyIGRlc2MgPSB7fTtcblxuICAgIGRlc2MuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5leHRTbmFwc2hvdCA9IHZhbmlsbGEuc25hcHNob3QocHJveHlPYmplY3QpO1xuXG4gICAgICBpZiAoIXByZXZTbmFwc2hvdCB8fCBwcm94eUNvbXBhcmUuaXNEZWVwQ2hhbmdlZChwcmV2U25hcHNob3QsIG5leHRTbmFwc2hvdCwgYWZmZWN0ZWQpKSB7XG4gICAgICAgIGFmZmVjdGVkID0gbmV3IFdlYWtNYXAoKTtcbiAgICAgICAgY29tcHV0ZWRWYWx1ZSA9IGdldChwcm94eUNvbXBhcmUuY3JlYXRlRGVlcFByb3h5KG5leHRTbmFwc2hvdCwgYWZmZWN0ZWQpKTtcbiAgICAgICAgcHJldlNuYXBzaG90ID0gbmV4dFNuYXBzaG90O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29tcHV0ZWRWYWx1ZTtcbiAgICB9O1xuXG4gICAgaWYgKHNldCkge1xuICAgICAgZGVzYy5zZXQgPSBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHNldChwcm94eU9iamVjdCwgbmV3VmFsdWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5pdGlhbE9iamVjdCwga2V5LCBkZXNjKTtcbiAgfSk7XG4gIHZhciBwcm94eU9iamVjdCA9IHZhbmlsbGEucHJveHkoaW5pdGlhbE9iamVjdCk7XG4gIHJldHVybiBwcm94eU9iamVjdDtcbn07XG5cbmV4cG9ydHMuYWRkQ29tcHV0ZWQgPSBhZGRDb21wdXRlZDtcbmV4cG9ydHMuZGV2dG9vbHMgPSBkZXZ0b29scztcbmV4cG9ydHMucHJveHlXaXRoQ29tcHV0ZWQgPSBwcm94eVdpdGhDb21wdXRlZDtcbmV4cG9ydHMuc3Vic2NyaWJlS2V5ID0gc3Vic2NyaWJlS2V5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgcHJveHlDb21wYXJlID0gcmVxdWlyZSgncHJveHktY29tcGFyZScpO1xuXG52YXIgVkVSU0lPTiA9IFN5bWJvbCgpO1xudmFyIExJU1RFTkVSUyA9IFN5bWJvbCgpO1xudmFyIFNOQVBTSE9UID0gU3ltYm9sKCk7XG52YXIgUFJPTUlTRV9SRVNVTFQgPSBTeW1ib2woKTtcbnZhciBQUk9NSVNFX0VSUk9SID0gU3ltYm9sKCk7XG52YXIgcmVmU2V0ID0gbmV3IFdlYWtTZXQoKTtcbnZhciByZWYgPSBmdW5jdGlvbiByZWYobykge1xuICByZWZTZXQuYWRkKG8pO1xuICByZXR1cm4gbztcbn07XG5cbnZhciBpc1N1cHBvcnRlZE9iamVjdCA9IGZ1bmN0aW9uIGlzU3VwcG9ydGVkT2JqZWN0KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsICYmIChBcnJheS5pc0FycmF5KHgpIHx8ICF4W1N5bWJvbC5pdGVyYXRvcl0pICYmICEoeCBpbnN0YW5jZW9mIFdlYWtNYXApICYmICEoeCBpbnN0YW5jZW9mIFdlYWtTZXQpICYmICEoeCBpbnN0YW5jZW9mIEVycm9yKSAmJiAhKHggaW5zdGFuY2VvZiBOdW1iZXIpICYmICEoeCBpbnN0YW5jZW9mIERhdGUpICYmICEoeCBpbnN0YW5jZW9mIFN0cmluZykgJiYgISh4IGluc3RhbmNlb2YgUmVnRXhwKSAmJiAhKHggaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG59O1xuXG52YXIgcHJveHlDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG52YXIgZ2xvYmFsVmVyc2lvbiA9IDE7XG52YXIgc25hcHNob3RDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG52YXIgcHJveHkgPSBmdW5jdGlvbiBwcm94eShpbml0aWFsT2JqZWN0KSB7XG4gIGlmIChpbml0aWFsT2JqZWN0ID09PSB2b2lkIDApIHtcbiAgICBpbml0aWFsT2JqZWN0ID0ge307XG4gIH1cblxuICBpZiAoIWlzU3VwcG9ydGVkT2JqZWN0KGluaXRpYWxPYmplY3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBvYmplY3QgdHlwZScpO1xuICB9XG5cbiAgaWYgKHByb3h5Q2FjaGUuaGFzKGluaXRpYWxPYmplY3QpKSB7XG4gICAgcmV0dXJuIHByb3h5Q2FjaGUuZ2V0KGluaXRpYWxPYmplY3QpO1xuICB9XG5cbiAgdmFyIHZlcnNpb24gPSBnbG9iYWxWZXJzaW9uO1xuICB2YXIgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG4gIHZhciBub3RpZnlVcGRhdGUgPSBmdW5jdGlvbiBub3RpZnlVcGRhdGUobmV4dFZlcnNpb24pIHtcbiAgICBpZiAoIW5leHRWZXJzaW9uKSB7XG4gICAgICBuZXh0VmVyc2lvbiA9ICsrZ2xvYmFsVmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbiAhPT0gbmV4dFZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSBuZXh0VmVyc2lvbjtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIobmV4dFZlcnNpb24pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjcmVhdGVTbmFwc2hvdCA9IGZ1bmN0aW9uIGNyZWF0ZVNuYXBzaG90KHRhcmdldCwgcmVjZWl2ZXIpIHtcbiAgICB2YXIgY2FjaGUgPSBzbmFwc2hvdENhY2hlLmdldChyZWNlaXZlcik7XG5cbiAgICBpZiAoY2FjaGUgJiYgY2FjaGUudmVyc2lvbiA9PT0gdmVyc2lvbikge1xuICAgICAgcmV0dXJuIGNhY2hlLnNuYXBzaG90O1xuICAgIH1cblxuICAgIHZhciBzbmFwc2hvdCA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSA/IFtdIDogT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSk7XG4gICAgcHJveHlDb21wYXJlLm1hcmtUb1RyYWNrKHNuYXBzaG90LCB0cnVlKTtcbiAgICBzbmFwc2hvdENhY2hlLnNldChyZWNlaXZlciwge1xuICAgICAgdmVyc2lvbjogdmVyc2lvbixcbiAgICAgIHNuYXBzaG90OiBzbmFwc2hvdFxuICAgIH0pO1xuICAgIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gdGFyZ2V0W2tleV07XG5cbiAgICAgIGlmIChyZWZTZXQuaGFzKHZhbHVlKSkge1xuICAgICAgICBwcm94eUNvbXBhcmUubWFya1RvVHJhY2sodmFsdWUsIGZhbHNlKTtcbiAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICghaXNTdXBwb3J0ZWRPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHNuYXBzaG90W2tleV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIGlmIChQUk9NSVNFX1JFU1VMVCBpbiB2YWx1ZSkge1xuICAgICAgICAgIHNuYXBzaG90W2tleV0gPSB2YWx1ZVtQUk9NSVNFX1JFU1VMVF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGVycm9yT3JQcm9taXNlID0gdmFsdWVbUFJPTUlTRV9FUlJPUl0gfHwgdmFsdWU7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNuYXBzaG90LCBrZXksIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICB0aHJvdyBlcnJvck9yUHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZVtWRVJTSU9OXSkge1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWVbU05BUFNIT1RdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5mcmVlemUoc25hcHNob3QpO1xuICAgIHJldHVybiBzbmFwc2hvdDtcbiAgfTtcblxuICB2YXIgYmFzZU9iamVjdCA9IEFycmF5LmlzQXJyYXkoaW5pdGlhbE9iamVjdCkgPyBbXSA6IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKGluaXRpYWxPYmplY3QpKTtcbiAgdmFyIHByb3h5T2JqZWN0ID0gbmV3IFByb3h5KGJhc2VPYmplY3QsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICBpZiAocHJvcCA9PT0gVkVSU0lPTikge1xuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3AgPT09IExJU1RFTkVSUykge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcCA9PT0gU05BUFNIT1QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVNuYXBzaG90KHRhcmdldCwgcmVjZWl2ZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgIH0sXG4gICAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCkge1xuICAgICAgdmFyIHByZXZWYWx1ZSA9IHRhcmdldFtwcm9wXTtcbiAgICAgIHZhciBjaGlsZExpc3RlbmVycyA9IHByZXZWYWx1ZSAmJiBwcmV2VmFsdWVbTElTVEVORVJTXTtcblxuICAgICAgaWYgKGNoaWxkTGlzdGVuZXJzKSB7XG4gICAgICAgIGNoaWxkTGlzdGVuZXJzLmRlbGV0ZShub3RpZnlVcGRhdGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVsZXRlZCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcblxuICAgICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm90aWZ5VXBkYXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWxldGVkO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgdmFyIF9PYmplY3QkZ2V0T3duUHJvcGVydDtcblxuICAgICAgdmFyIHByZXZWYWx1ZSA9IHRhcmdldFtwcm9wXTtcblxuICAgICAgaWYgKE9iamVjdC5pcyhwcmV2VmFsdWUsIHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoaWxkTGlzdGVuZXJzID0gcHJldlZhbHVlICYmIHByZXZWYWx1ZVtMSVNURU5FUlNdO1xuXG4gICAgICBpZiAoY2hpbGRMaXN0ZW5lcnMpIHtcbiAgICAgICAgY2hpbGRMaXN0ZW5lcnMuZGVsZXRlKG5vdGlmeVVwZGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWZTZXQuaGFzKHZhbHVlKSB8fCAhaXNTdXBwb3J0ZWRPYmplY3QodmFsdWUpIHx8IChfT2JqZWN0JGdldE93blByb3BlcnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCkpICE9IG51bGwgJiYgX09iamVjdCRnZXRPd25Qcm9wZXJ0LnNldCkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlLnRoZW4oZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICB0YXJnZXRbcHJvcF1bUFJPTUlTRV9SRVNVTFRdID0gdjtcbiAgICAgICAgICBub3RpZnlVcGRhdGUoKTtcbiAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB0YXJnZXRbcHJvcF1bUFJPTUlTRV9FUlJPUl0gPSBlO1xuICAgICAgICAgIG5vdGlmeVVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gcHJveHlDb21wYXJlLmdldFVudHJhY2tlZE9iamVjdCh2YWx1ZSkgfHwgdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlW0xJU1RFTkVSU10pIHtcbiAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBwcm94eSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRbcHJvcF1bTElTVEVORVJTXS5hZGQobm90aWZ5VXBkYXRlKTtcbiAgICAgIH1cblxuICAgICAgbm90aWZ5VXBkYXRlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBwcm94eUNhY2hlLnNldChpbml0aWFsT2JqZWN0LCBwcm94eU9iamVjdCk7XG4gIFJlZmxlY3Qub3duS2V5cyhpbml0aWFsT2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaW5pdGlhbE9iamVjdCwga2V5KTtcblxuICAgIGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGJhc2VPYmplY3QsIGtleSwgZGVzYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3h5T2JqZWN0W2tleV0gPSBpbml0aWFsT2JqZWN0W2tleV07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHByb3h5T2JqZWN0O1xufTtcbnZhciBnZXRWZXJzaW9uID0gZnVuY3Rpb24gZ2V0VmVyc2lvbihwcm94eU9iamVjdCkge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgKCFwcm94eU9iamVjdCB8fCAhcHJveHlPYmplY3RbVkVSU0lPTl0pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdXNlIHByb3h5IG9iamVjdCcpO1xuICB9XG5cbiAgcmV0dXJuIHByb3h5T2JqZWN0W1ZFUlNJT05dO1xufTtcbnZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUocHJveHlPYmplY3QsIGNhbGxiYWNrLCBub3RpZnlJblN5bmMpIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICghcHJveHlPYmplY3QgfHwgIXByb3h5T2JqZWN0W0xJU1RFTkVSU10pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdXNlIHByb3h5IG9iamVjdCcpO1xuICB9XG5cbiAgdmFyIHBlbmRpbmdWZXJzaW9uID0gMDtcblxuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihuZXh0VmVyc2lvbikge1xuICAgIGlmIChub3RpZnlJblN5bmMpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGVuZGluZ1ZlcnNpb24gPSBuZXh0VmVyc2lvbjtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChuZXh0VmVyc2lvbiA9PT0gcGVuZGluZ1ZlcnNpb24pIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBwcm94eU9iamVjdFtMSVNURU5FUlNdLmFkZChsaXN0ZW5lcik7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcHJveHlPYmplY3RbTElTVEVORVJTXS5kZWxldGUobGlzdGVuZXIpO1xuICB9O1xufTtcbnZhciBzbmFwc2hvdCA9IGZ1bmN0aW9uIHNuYXBzaG90KHByb3h5T2JqZWN0KSB7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAoIXByb3h5T2JqZWN0IHx8ICFwcm94eU9iamVjdFtTTkFQU0hPVF0pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdXNlIHByb3h5IG9iamVjdCcpO1xuICB9XG5cbiAgcmV0dXJuIHByb3h5T2JqZWN0W1NOQVBTSE9UXTtcbn07XG5cbmV4cG9ydHMuZ2V0VmVyc2lvbiA9IGdldFZlcnNpb247XG5leHBvcnRzLnByb3h5ID0gcHJveHk7XG5leHBvcnRzLnJlZiA9IHJlZjtcbmV4cG9ydHMuc25hcHNob3QgPSBzbmFwc2hvdDtcbmV4cG9ydHMuc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuIl19
