import {
  _classCallCheck,
  _createClass
} from "./chunk-AGZ6YBUO.js";
import {
  _defineProperty
} from "./chunk-Z4OB6ZNX.js";
import {
  _typeof
} from "./chunk-NL5XAXO4.js";
import {
  _extends
} from "./chunk-PQEZCWQY.js";
import {
  _objectWithoutPropertiesLoose
} from "./chunk-PSGUSLG5.js";
import {
  require_react
} from "./chunk-67XTWVEJ.js";
import {
  __commonJS,
  __toESM
} from "./chunk-5WWUZCGV.js";

// node_modules/void-elements/index.js
var require_void_elements = __commonJS({
  "node_modules/void-elements/index.js"(exports, module) {
    module.exports = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "menuitem": true,
      "meta": true,
      "param": true,
      "source": true,
      "track": true,
      "wbr": true
    };
  }
});

// node_modules/html-parse-stringify2/lib/parse-tag.js
var require_parse_tag = __commonJS({
  "node_modules/html-parse-stringify2/lib/parse-tag.js"(exports, module) {
    var attrRE = /([\w-]+)|=|(['"])([.\s\S]*?)\2/g;
    var voidElements = require_void_elements();
    module.exports = function(tag) {
      var i = 0;
      var key;
      var expectingValueAfterEquals = true;
      var res = {
        type: "tag",
        name: "",
        voidElement: false,
        attrs: {},
        children: []
      };
      tag.replace(attrRE, function(match) {
        if (match === "=") {
          expectingValueAfterEquals = true;
          i++;
          return;
        }
        if (!expectingValueAfterEquals) {
          if (key) {
            res.attrs[key] = key;
          }
          key = match;
        } else {
          if (i === 0) {
            if (voidElements[match] || tag.charAt(tag.length - 2) === "/") {
              res.voidElement = true;
            }
            res.name = match;
          } else {
            res.attrs[key] = match.replace(/^['"]|['"]$/g, "");
            key = void 0;
          }
        }
        i++;
        expectingValueAfterEquals = false;
      });
      return res;
    };
  }
});

// node_modules/html-parse-stringify2/lib/parse.js
var require_parse = __commonJS({
  "node_modules/html-parse-stringify2/lib/parse.js"(exports, module) {
    var tagRE = /(?:<!--[\S\s]*?-->|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)/g;
    var parseTag = require_parse_tag();
    var empty = Object.create ? /* @__PURE__ */ Object.create(null) : {};
    function pushTextNode(list, html, level, start, ignoreWhitespace) {
      var end = html.indexOf("<", start);
      var content = html.slice(start, end === -1 ? void 0 : end);
      if (/^\s*$/.test(content)) {
        content = " ";
      }
      if (!ignoreWhitespace && end > -1 && level + list.length >= 0 || content !== " ") {
        list.push({
          type: "text",
          content
        });
      }
    }
    module.exports = function parse(html, options) {
      options || (options = {});
      options.components || (options.components = empty);
      var result = [];
      var current;
      var level = -1;
      var arr = [];
      var byTag = {};
      var inComponent = false;
      html.replace(tagRE, function(tag, index) {
        if (inComponent) {
          if (tag !== "</" + current.name + ">") {
            return;
          } else {
            inComponent = false;
          }
        }
        var isOpen = tag.charAt(1) !== "/";
        var isComment = tag.indexOf("<!--") === 0;
        var start = index + tag.length;
        var nextChar = html.charAt(start);
        var parent;
        if (isOpen && !isComment) {
          level++;
          current = parseTag(tag);
          if (current.type === "tag" && options.components[current.name]) {
            current.type = "component";
            inComponent = true;
          }
          if (!current.voidElement && !inComponent && nextChar && nextChar !== "<") {
            pushTextNode(current.children, html, level, start, options.ignoreWhitespace);
          }
          byTag[current.tagName] = current;
          if (level === 0) {
            result.push(current);
          }
          parent = arr[level - 1];
          if (parent) {
            parent.children.push(current);
          }
          arr[level] = current;
        }
        if (isComment || !isOpen || current.voidElement) {
          if (!isComment) {
            level--;
          }
          if (!inComponent && nextChar !== "<" && nextChar) {
            parent = level === -1 ? result : arr[level].children;
            pushTextNode(parent, html, level, start, options.ignoreWhitespace);
          }
        }
      });
      if (!result.length && html.length) {
        pushTextNode(result, html, 0, 0, options.ignoreWhitespace);
      }
      return result;
    };
  }
});

// node_modules/html-parse-stringify2/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/html-parse-stringify2/lib/stringify.js"(exports, module) {
    function attrString(attrs) {
      var buff = [];
      for (var key in attrs) {
        buff.push(key + '="' + attrs[key] + '"');
      }
      if (!buff.length) {
        return "";
      }
      return " " + buff.join(" ");
    }
    function stringify(buff, doc) {
      switch (doc.type) {
        case "text":
          return buff + doc.content;
        case "tag":
          buff += "<" + doc.name + (doc.attrs ? attrString(doc.attrs) : "") + (doc.voidElement ? "/>" : ">");
          if (doc.voidElement) {
            return buff;
          }
          return buff + doc.children.reduce(stringify, "") + "</" + doc.name + ">";
      }
    }
    module.exports = function(doc) {
      return doc.reduce(function(token, rootEl) {
        return token + stringify("", rootEl);
      }, "");
    };
  }
});

// node_modules/html-parse-stringify2/index.js
var require_html_parse_stringify2 = __commonJS({
  "node_modules/html-parse-stringify2/index.js"(exports, module) {
    module.exports = {
      parse: require_parse(),
      stringify: require_stringify()
    };
  }
});

// node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}

// node_modules/react-i18next/dist/es/Trans.js
var import_react2 = __toESM(require_react());
var import_html_parse_stringify2 = __toESM(require_html_parse_stringify2());

// node_modules/react-i18next/dist/es/context.js
var import_react = __toESM(require_react());
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
var defaultOptions = {
  bindI18n: "languageChanging languageChanged",
  bindI18nStore: "",
  // nsMode: 'fallback' // loop through all namespaces given to hook, HOC, render prop for key lookup
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  // hashTransKey: key => key // calculate a key for Trans component based on defaultValue
  useSuspense: true
};
var i18nInstance;
var hasUsedI18nextProvider;
var I18nContext = import_react.default.createContext();
function usedI18nextProvider(used) {
  hasUsedI18nextProvider = used;
}
function getHasUsedI18nextProvider() {
  return hasUsedI18nextProvider;
}
function setDefaults() {
  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  defaultOptions = _objectSpread({}, defaultOptions, {}, options);
}
function getDefaults() {
  return defaultOptions;
}
var ReportNamespaces = function() {
  function ReportNamespaces2() {
    _classCallCheck(this, ReportNamespaces2);
    this.usedNamespaces = {};
  }
  _createClass(ReportNamespaces2, [{
    key: "addUsedNamespaces",
    value: function addUsedNamespaces(namespaces) {
      var _this = this;
      namespaces.forEach(function(ns) {
        if (!_this.usedNamespaces[ns])
          _this.usedNamespaces[ns] = true;
      });
    }
  }, {
    key: "getUsedNamespaces",
    value: function getUsedNamespaces() {
      return Object.keys(this.usedNamespaces);
    }
  }]);
  return ReportNamespaces2;
}();
function setI18n(instance) {
  i18nInstance = instance;
}
function getI18n() {
  return i18nInstance;
}
var initReactI18next = {
  type: "3rdParty",
  init: function init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  }
};
function composeInitialProps(ForComponent) {
  return function(ctx) {
    return new Promise(function(resolve) {
      var i18nInitialProps = getInitialProps();
      if (ForComponent.getInitialProps) {
        ForComponent.getInitialProps(ctx).then(function(componentsInitialProps) {
          resolve(_objectSpread({}, componentsInitialProps, {}, i18nInitialProps));
        });
      } else {
        resolve(i18nInitialProps);
      }
    });
  };
}
function getInitialProps() {
  var i18n = getI18n();
  var namespaces = i18n.reportNamespaces ? i18n.reportNamespaces.getUsedNamespaces() : [];
  var ret = {};
  var initialI18nStore = {};
  i18n.languages.forEach(function(l) {
    initialI18nStore[l] = {};
    namespaces.forEach(function(ns) {
      initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
    });
  });
  ret.initialI18nStore = initialI18nStore;
  ret.initialLanguage = i18n.language;
  return ret;
}

// node_modules/react-i18next/dist/es/utils.js
function warn() {
  if (console && console.warn) {
    var _console;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (typeof args[0] === "string")
      args[0] = "react-i18next:: ".concat(args[0]);
    (_console = console).warn.apply(_console, args);
  }
}
var alreadyWarned = {};
function warnOnce() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  if (typeof args[0] === "string" && alreadyWarned[args[0]])
    return;
  if (typeof args[0] === "string")
    alreadyWarned[args[0]] = /* @__PURE__ */ new Date();
  warn.apply(void 0, args);
}
function loadNamespaces(i18n, ns, cb) {
  i18n.loadNamespaces(ns, function() {
    if (i18n.isInitialized) {
      cb();
    } else {
      var initialized = function initialized2() {
        setTimeout(function() {
          i18n.off("initialized", initialized2);
        }, 0);
        cb();
      };
      i18n.on("initialized", initialized);
    }
  });
}
function hasLoadedNamespace(ns, i18n) {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce("i18n.languages were undefined or empty", i18n.languages);
    return true;
  }
  var lng = i18n.languages[0];
  var fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
  var lastLng = i18n.languages[i18n.languages.length - 1];
  if (lng.toLowerCase() === "cimode")
    return true;
  var loadNotPending = function loadNotPending2(l, n) {
    var loadState = i18n.services.backendConnector.state["".concat(l, "|").concat(n)];
    return loadState === -1 || loadState === 2;
  };
  if (i18n.hasResourceBundle(lng, ns))
    return true;
  if (!i18n.services.backendConnector.backend)
    return true;
  if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns)))
    return true;
  return false;
}
function getDisplayName(Component) {
  return Component.displayName || Component.name || (typeof Component === "string" && Component.length > 0 ? Component : "Unknown");
}

// node_modules/react-i18next/dist/es/Trans.js
function ownKeys2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys2(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys2(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function hasChildren(node) {
  return node && (node.children || node.props && node.props.children);
}
function getChildren(node) {
  if (!node)
    return [];
  return node && node.children ? node.children : node.props && node.props.children;
}
function hasValidReactChildren(children) {
  if (Object.prototype.toString.call(children) !== "[object Array]")
    return false;
  return children.every(function(child) {
    return import_react2.default.isValidElement(child);
  });
}
function getAsArray(data) {
  return Array.isArray(data) ? data : [data];
}
function nodesToString(startingString, children, index, i18nOptions) {
  if (!children)
    return "";
  var stringNode = startingString;
  var childrenArray = getAsArray(children);
  var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  childrenArray.forEach(function(child, i) {
    var elementKey = "".concat(i);
    if (typeof child === "string") {
      stringNode = "".concat(stringNode).concat(child);
    } else if (hasChildren(child)) {
      var elementTag = keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 1 && typeof hasChildren(child) === "string" ? child.type : elementKey;
      if (child.props && child.props.i18nIsDynamicList) {
        stringNode = "".concat(stringNode, "<").concat(elementTag, "></").concat(elementTag, ">");
      } else {
        stringNode = "".concat(stringNode, "<").concat(elementTag, ">").concat(nodesToString("", getChildren(child), i + 1, i18nOptions), "</").concat(elementTag, ">");
      }
    } else if (import_react2.default.isValidElement(child)) {
      if (keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 0) {
        stringNode = "".concat(stringNode, "<").concat(child.type, "/>");
      } else {
        stringNode = "".concat(stringNode, "<").concat(elementKey, "></").concat(elementKey, ">");
      }
    } else if (_typeof(child) === "object") {
      var clone = _objectSpread2({}, child);
      var format = clone.format;
      delete clone.format;
      var keys = Object.keys(clone);
      if (format && keys.length === 1) {
        stringNode = "".concat(stringNode, "{{").concat(keys[0], ", ").concat(format, "}}");
      } else if (keys.length === 1) {
        stringNode = "".concat(stringNode, "{{").concat(keys[0], "}}");
      } else {
        warn("react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.", child);
      }
    } else {
      warn("Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.", child);
    }
  });
  return stringNode;
}
function renderNodes(children, targetString, i18n, i18nOptions, combinedTOpts) {
  if (targetString === "")
    return [];
  var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  var emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.join("|")).test(targetString);
  if (!children && !emptyChildrenButNeedsHandling)
    return [targetString];
  var data = {};
  function getData(childs) {
    var childrenArray = getAsArray(childs);
    childrenArray.forEach(function(child) {
      if (typeof child === "string")
        return;
      if (hasChildren(child))
        getData(getChildren(child));
      else if (_typeof(child) === "object" && !import_react2.default.isValidElement(child))
        Object.assign(data, child);
    });
  }
  getData(children);
  var interpolatedString = i18n.services.interpolator.interpolate(targetString, _objectSpread2({}, data, {}, combinedTOpts), i18n.language);
  var ast = import_html_parse_stringify2.default.parse("<0>".concat(interpolatedString, "</0>"));
  function mapAST(reactNode, astNode) {
    var reactNodes = getAsArray(reactNode);
    var astNodes = getAsArray(astNode);
    return astNodes.reduce(function(mem, node, i) {
      var translationContent = node.children && node.children[0] && node.children[0].content;
      if (node.type === "tag") {
        var child = reactNodes[parseInt(node.name, 10)] || {};
        var isElement = import_react2.default.isValidElement(child);
        if (typeof child === "string") {
          mem.push(child);
        } else if (hasChildren(child)) {
          var childs = getChildren(child);
          var mappedChildren = mapAST(childs, node.children);
          var inner = hasValidReactChildren(childs) && mappedChildren.length === 0 ? childs : mappedChildren;
          if (child.dummy)
            child.children = inner;
          mem.push(import_react2.default.cloneElement(child, _objectSpread2({}, child.props, {
            key: i
          }), inner));
        } else if (emptyChildrenButNeedsHandling && _typeof(child) === "object" && child.dummy && !isElement) {
          var _inner = mapAST(
            reactNodes,
            node.children
          );
          mem.push(import_react2.default.cloneElement(child, _objectSpread2({}, child.props, {
            key: i
          }), _inner));
        } else if (Number.isNaN(parseFloat(node.name))) {
          if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
            if (node.voidElement) {
              mem.push(import_react2.default.createElement(node.name, {
                key: "".concat(node.name, "-").concat(i)
              }));
            } else {
              var _inner2 = mapAST(
                reactNodes,
                node.children
              );
              mem.push(import_react2.default.createElement(node.name, {
                key: "".concat(node.name, "-").concat(i)
              }, _inner2));
            }
          } else if (node.voidElement) {
            mem.push("<".concat(node.name, " />"));
          } else {
            var _inner3 = mapAST(
              reactNodes,
              node.children
            );
            mem.push("<".concat(node.name, ">").concat(_inner3, "</").concat(node.name, ">"));
          }
        } else if (_typeof(child) === "object" && !isElement) {
          var content = node.children[0] ? translationContent : null;
          if (content)
            mem.push(content);
        } else if (node.children.length === 1 && translationContent) {
          mem.push(import_react2.default.cloneElement(child, _objectSpread2({}, child.props, {
            key: i
          }), translationContent));
        } else {
          mem.push(import_react2.default.cloneElement(child, _objectSpread2({}, child.props, {
            key: i
          })));
        }
      } else if (node.type === "text") {
        mem.push(node.content);
      }
      return mem;
    }, []);
  }
  var result = mapAST([{
    dummy: true,
    children
  }], ast);
  return getChildren(result[0]);
}
function Trans(_ref) {
  var children = _ref.children, count = _ref.count, parent = _ref.parent, i18nKey = _ref.i18nKey, tOptions = _ref.tOptions, values = _ref.values, defaults = _ref.defaults, components = _ref.components, ns = _ref.ns, i18nFromProps = _ref.i18n, tFromProps = _ref.t, additionalProps = _objectWithoutProperties(_ref, ["children", "count", "parent", "i18nKey", "tOptions", "values", "defaults", "components", "ns", "i18n", "t"]);
  var _ref2 = getHasUsedI18nextProvider() ? (0, import_react2.useContext)(I18nContext) || {} : {}, i18nFromContext = _ref2.i18n, defaultNSFromContext = _ref2.defaultNS;
  var i18n = i18nFromProps || i18nFromContext || getI18n();
  if (!i18n) {
    warnOnce("You will need pass in an i18next instance by using i18nextReactModule");
    return children;
  }
  var t = tFromProps || i18n.t.bind(i18n) || function(k) {
    return k;
  };
  var reactI18nextOptions = _objectSpread2({}, getDefaults(), {}, i18n.options && i18n.options.react);
  var useAsParent = parent !== void 0 ? parent : reactI18nextOptions.defaultTransParent;
  var namespaces = ns || t.ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
  namespaces = typeof namespaces === "string" ? [namespaces] : namespaces || ["translation"];
  var defaultValue = defaults || nodesToString("", children, 0, reactI18nextOptions) || reactI18nextOptions.transEmptyNodeValue;
  var hashTransKey = reactI18nextOptions.hashTransKey;
  var key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
  var interpolationOverride = values ? {} : {
    interpolation: {
      prefix: "#$?",
      suffix: "?$#"
    }
  };
  var combinedTOpts = _objectSpread2({}, tOptions, {
    count
  }, values, {}, interpolationOverride, {
    defaultValue,
    ns: namespaces
  });
  var translation = key ? t(key, combinedTOpts) : defaultValue;
  if (!useAsParent)
    return renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts);
  return import_react2.default.createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts));
}

// node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}

// node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t)
          return;
        f = false;
      } else
        for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
          ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
          return;
      } finally {
        if (o)
          throw n;
      }
    }
    return a;
  }
}

// node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}

// node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

// node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// node_modules/@babel/runtime/helpers/esm/slicedToArray.js
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

// node_modules/react-i18next/dist/es/useTranslation.js
var import_react3 = __toESM(require_react());
function ownKeys3(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys3(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys3(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function useTranslation(ns) {
  var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var i18nFromProps = props.i18n;
  var ReactI18nContext = (0, import_react3.useContext)(I18nContext);
  var _ref = getHasUsedI18nextProvider() ? ReactI18nContext || {} : {}, i18nFromContext = _ref.i18n, defaultNSFromContext = _ref.defaultNS;
  var i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n && !i18n.reportNamespaces)
    i18n.reportNamespaces = new ReportNamespaces();
  if (!i18n) {
    warnOnce("You will need pass in an i18next instance by using initReactI18next");
    var retNotReady = [function(k) {
      return k;
    }, {}, false];
    retNotReady.t = function(k) {
      return k;
    };
    retNotReady.i18n = {};
    retNotReady.ready = false;
    return retNotReady;
  }
  var i18nOptions = _objectSpread3({}, getDefaults(), {}, i18n.options.react);
  var _props$useSuspense = props.useSuspense, useSuspense = _props$useSuspense === void 0 ? i18nOptions.useSuspense : _props$useSuspense;
  var namespaces = ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
  namespaces = typeof namespaces === "string" ? [namespaces] : namespaces || ["translation"];
  if (i18n.reportNamespaces.addUsedNamespaces)
    i18n.reportNamespaces.addUsedNamespaces(namespaces);
  var ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(function(n) {
    return hasLoadedNamespace(n, i18n);
  });
  function getT() {
    return {
      t: i18n.getFixedT(null, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0])
    };
  }
  var _useState = (0, import_react3.useState)(getT()), _useState2 = _slicedToArray(_useState, 2), t = _useState2[0], setT = _useState2[1];
  (0, import_react3.useEffect)(function() {
    var isMounted = true;
    var bindI18n = i18nOptions.bindI18n, bindI18nStore = i18nOptions.bindI18nStore;
    if (!ready && !useSuspense) {
      loadNamespaces(i18n, namespaces, function() {
        if (isMounted)
          setT(getT());
      });
    }
    function boundReset() {
      if (isMounted)
        setT(getT());
    }
    if (bindI18n && i18n)
      i18n.on(bindI18n, boundReset);
    if (bindI18nStore && i18n)
      i18n.store.on(bindI18nStore, boundReset);
    return function() {
      isMounted = false;
      if (bindI18n && i18n)
        bindI18n.split(" ").forEach(function(e) {
          return i18n.off(e, boundReset);
        });
      if (bindI18nStore && i18n)
        bindI18nStore.split(" ").forEach(function(e) {
          return i18n.store.off(e, boundReset);
        });
    };
  }, [namespaces.join()]);
  var ret = [t.t, i18n, ready];
  ret.t = t.t;
  ret.i18n = i18n;
  ret.ready = ready;
  if (ready)
    return ret;
  if (!ready && !useSuspense)
    return ret;
  throw new Promise(function(resolve) {
    loadNamespaces(i18n, namespaces, function() {
      setT(getT());
      resolve();
    });
  });
}

// node_modules/react-i18next/dist/es/withTranslation.js
var import_react4 = __toESM(require_react());
function ownKeys4(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys4(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys4(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function withTranslation(ns) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return function Extend(WrappedComponent) {
    function I18nextWithTranslation(_ref) {
      var forwardedRef = _ref.forwardedRef, rest = _objectWithoutProperties(_ref, ["forwardedRef"]);
      var _useTranslation = useTranslation(ns, rest), _useTranslation2 = _slicedToArray(_useTranslation, 3), t = _useTranslation2[0], i18n = _useTranslation2[1], ready = _useTranslation2[2];
      var passDownProps = _objectSpread4({}, rest, {
        t,
        i18n,
        tReady: ready
      });
      if (options.withRef && forwardedRef) {
        passDownProps.ref = forwardedRef;
      }
      return import_react4.default.createElement(WrappedComponent, passDownProps);
    }
    I18nextWithTranslation.displayName = "withI18nextTranslation(".concat(getDisplayName(WrappedComponent), ")");
    I18nextWithTranslation.WrappedComponent = WrappedComponent;
    var forwardRef = function forwardRef2(props, ref) {
      return import_react4.default.createElement(I18nextWithTranslation, _extends({}, props, {
        forwardedRef: ref
      }));
    };
    return options.withRef ? import_react4.default.forwardRef(forwardRef) : I18nextWithTranslation;
  };
}

// node_modules/react-i18next/dist/es/Translation.js
function Translation(props) {
  var ns = props.ns, children = props.children, options = _objectWithoutProperties(props, ["ns", "children"]);
  var _useTranslation = useTranslation(ns, options), _useTranslation2 = _slicedToArray(_useTranslation, 3), t = _useTranslation2[0], i18n = _useTranslation2[1], ready = _useTranslation2[2];
  return children(t, {
    i18n,
    lng: i18n.language
  }, ready);
}

// node_modules/react-i18next/dist/es/I18nextProvider.js
var import_react5 = __toESM(require_react());
function I18nextProvider(_ref) {
  var i18n = _ref.i18n, defaultNS = _ref.defaultNS, children = _ref.children;
  usedI18nextProvider(true);
  return import_react5.default.createElement(I18nContext.Provider, {
    value: {
      i18n,
      defaultNS
    }
  }, children);
}

// node_modules/react-i18next/dist/es/withSSR.js
var import_react7 = __toESM(require_react());

// node_modules/react-i18next/dist/es/useSSR.js
var import_react6 = __toESM(require_react());
function useSSR(initialI18nStore, initialLanguage) {
  var props = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var i18nFromProps = props.i18n;
  var ReactI18nContext = (0, import_react6.useContext)(I18nContext);
  var _ref = getHasUsedI18nextProvider() ? ReactI18nContext || {} : {}, i18nFromContext = _ref.i18n;
  var i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n.options && i18n.options.isClone)
    return;
  if (initialI18nStore && !i18n.initializedStoreOnce) {
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.initializedStoreOnce = true;
  }
  if (initialLanguage && !i18n.initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    i18n.initializedLanguageOnce = true;
  }
}

// node_modules/react-i18next/dist/es/withSSR.js
function ownKeys5(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread5(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys5(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys5(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function withSSR() {
  return function Extend(WrappedComponent) {
    function I18nextWithSSR(_ref) {
      var initialI18nStore = _ref.initialI18nStore, initialLanguage = _ref.initialLanguage, rest = _objectWithoutProperties(_ref, ["initialI18nStore", "initialLanguage"]);
      useSSR(initialI18nStore, initialLanguage);
      return import_react7.default.createElement(WrappedComponent, _objectSpread5({}, rest));
    }
    I18nextWithSSR.getInitialProps = composeInitialProps(WrappedComponent);
    I18nextWithSSR.displayName = "withI18nextSSR(".concat(getDisplayName(WrappedComponent), ")");
    I18nextWithSSR.WrappedComponent = WrappedComponent;
    return I18nextWithSSR;
  };
}
export {
  I18nContext,
  I18nextProvider,
  Trans,
  Translation,
  composeInitialProps,
  getDefaults,
  getI18n,
  getInitialProps,
  initReactI18next,
  setDefaults,
  setI18n,
  useSSR,
  useTranslation,
  withSSR,
  withTranslation
};
//# sourceMappingURL=react-i18next.js.map
