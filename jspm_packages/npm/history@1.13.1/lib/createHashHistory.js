/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  var _extends = Object.assign || function(target) {
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
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  var _warning = require('warning');
  var _warning2 = _interopRequireDefault(_warning);
  var _invariant = require('invariant');
  var _invariant2 = _interopRequireDefault(_invariant);
  var _Actions = require('./Actions');
  var _ExecutionEnvironment = require('./ExecutionEnvironment');
  var _DOMUtils = require('./DOMUtils');
  var _DOMStateStorage = require('./DOMStateStorage');
  var _createDOMHistory = require('./createDOMHistory');
  var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);
  function isAbsolutePath(path) {
    return typeof path === 'string' && path.charAt(0) === '/';
  }
  function ensureSlash() {
    var path = _DOMUtils.getHashPath();
    if (isAbsolutePath(path))
      return true;
    _DOMUtils.replaceHashPath('/' + path);
    return false;
  }
  function addQueryStringValueToPath(path, key, value) {
    return path + (path.indexOf('?') === -1 ? '?' : '&') + (key + '=' + value);
  }
  function stripQueryStringValueFromPath(path, key) {
    return path.replace(new RegExp('[?&]?' + key + '=[a-zA-Z0-9]+'), '');
  }
  function getQueryStringValueFromPath(path, key) {
    var match = path.match(new RegExp('\\?.*?\\b' + key + '=(.+?)\\b'));
    return match && match[1];
  }
  var DefaultQueryKey = '_k';
  function createHashHistory() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Hash history needs a DOM') : _invariant2['default'](false) : undefined;
    var queryKey = options.queryKey;
    if (queryKey === undefined || !!queryKey)
      queryKey = typeof queryKey === 'string' ? queryKey : DefaultQueryKey;
    function getCurrentLocation() {
      var path = _DOMUtils.getHashPath();
      var key = undefined,
          state = undefined;
      if (queryKey) {
        key = getQueryStringValueFromPath(path, queryKey);
        path = stripQueryStringValueFromPath(path, queryKey);
        if (key) {
          state = _DOMStateStorage.readState(key);
        } else {
          state = null;
          key = history.createKey();
          _DOMUtils.replaceHashPath(addQueryStringValueToPath(path, queryKey, key));
        }
      } else {
        key = state = null;
      }
      return history.createLocation(path, state, undefined, key);
    }
    function startHashChangeListener(_ref) {
      var transitionTo = _ref.transitionTo;
      function hashChangeListener() {
        if (!ensureSlash())
          return;
        transitionTo(getCurrentLocation());
      }
      ensureSlash();
      _DOMUtils.addEventListener(window, 'hashchange', hashChangeListener);
      return function() {
        _DOMUtils.removeEventListener(window, 'hashchange', hashChangeListener);
      };
    }
    function finishTransition(location) {
      var basename = location.basename;
      var pathname = location.pathname;
      var search = location.search;
      var state = location.state;
      var action = location.action;
      var key = location.key;
      if (action === _Actions.POP)
        return;
      var path = (basename || '') + pathname + search;
      if (queryKey) {
        path = addQueryStringValueToPath(path, queryKey, key);
        _DOMStateStorage.saveState(key, state);
      } else {
        location.key = location.state = null;
      }
      var currentHash = _DOMUtils.getHashPath();
      if (action === _Actions.PUSH) {
        if (currentHash !== path) {
          window.location.hash = path;
        } else {
          process.env.NODE_ENV !== 'production' ? _warning2['default'](false, 'You cannot PUSH the same path using hash history') : undefined;
        }
      } else if (currentHash !== path) {
        _DOMUtils.replaceHashPath(path);
      }
    }
    var history = _createDOMHistory2['default'](_extends({}, options, {
      getCurrentLocation: getCurrentLocation,
      finishTransition: finishTransition,
      saveState: _DOMStateStorage.saveState
    }));
    var listenerCount = 0,
        stopHashChangeListener = undefined;
    function listenBefore(listener) {
      if (++listenerCount === 1)
        stopHashChangeListener = startHashChangeListener(history);
      var unlisten = history.listenBefore(listener);
      return function() {
        unlisten();
        if (--listenerCount === 0)
          stopHashChangeListener();
      };
    }
    function listen(listener) {
      if (++listenerCount === 1)
        stopHashChangeListener = startHashChangeListener(history);
      var unlisten = history.listen(listener);
      return function() {
        unlisten();
        if (--listenerCount === 0)
          stopHashChangeListener();
      };
    }
    function pushState(state, path) {
      process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;
      history.pushState(state, path);
    }
    function replaceState(state, path) {
      process.env.NODE_ENV !== 'production' ? _warning2['default'](queryKey || state == null, 'You cannot use state without a queryKey it will be dropped') : undefined;
      history.replaceState(state, path);
    }
    var goIsSupportedWithoutReload = _DOMUtils.supportsGoWithoutReloadUsingHash();
    function go(n) {
      process.env.NODE_ENV !== 'production' ? _warning2['default'](goIsSupportedWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : undefined;
      history.go(n);
    }
    function createHref(path) {
      return '#' + history.createHref(path);
    }
    function registerTransitionHook(hook) {
      if (++listenerCount === 1)
        stopHashChangeListener = startHashChangeListener(history);
      history.registerTransitionHook(hook);
    }
    function unregisterTransitionHook(hook) {
      history.unregisterTransitionHook(hook);
      if (--listenerCount === 0)
        stopHashChangeListener();
    }
    return _extends({}, history, {
      listenBefore: listenBefore,
      listen: listen,
      pushState: pushState,
      replaceState: replaceState,
      go: go,
      createHref: createHref,
      registerTransitionHook: registerTransitionHook,
      unregisterTransitionHook: unregisterTransitionHook
    });
  }
  exports['default'] = createHashHistory;
  module.exports = exports['default'];
})(require('process'));
