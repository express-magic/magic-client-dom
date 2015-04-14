(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.each = each;
exports.count = count;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _magicTypes = require("magic-types");

var isA = _magicTypes.isA;
var isO = _magicTypes.isO;
var isF = _magicTypes.isF;
var isNL = _magicTypes.isNL;

function each(arrOrObj, fn) {
  fn = fn || function () {};

  if (isA(arrOrObj)) {
    for (var i = 0; i < arrOrObj.length; i++) {
      if (isF(fn)) {
        fn(arrOrObj[i], i);
      }
    }
  } else if (isO(arrOrObj) || isNL(arrOrObj)) {
    for (var key in arrOrObj) {
      if (arrOrObj.hasOwnProperty(key) && isF(fn)) {
        fn(arrOrObj[key], key);
      }
    }
  }
}

function count(arrOrObj, cb) {
  var cnt = 0;
  each(arrOrObj, function () {
    return cnt++;
  });

  if (isF(cb)) {
    return cb(cnt);
  }

  return cnt;
}

var loops = {
  each: each,
  count: count
};

exports["default"] = loops;

//# sourceMappingURL=index.js.map
},{"magic-types":2}],2:[function(require,module,exports){
"use strict";

exports.cleanType = cleanType;
exports.cleanTypes = cleanTypes;
exports.test = test;
exports.is = is;
exports.not = not;
exports.isA = isA;
exports.isB = isB;
exports.isD = isD;
exports.isF = isF;
exports.isN = isN;
exports.isO = isO;
exports.isS = isS;
exports.isDate = isDate;
exports.isTruthy = isTruthy;
exports.isFalsy = isFalsy;
exports.isEmpty = isEmpty;

//browser only
exports.isNL = isNL;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var objProto = Object.prototype,
    getOwnPropertyNames = Object.getOwnPropertyNames,
    toStr = objProto.toString;

function cleanType(t) {
  if (t === "array") {
    t = "[object Array]";
  } else if (t === "nodeList" || t === "nodelist") {
    t = "[object NodeList]";
  } else if (t === "object") {
    t = "[object Object]";
  }
  return t;
}

function cleanTypes(types) {
  if (isS(types)) {
    return cleanType(t);
  }
  if (isA(types)) {
    for (var i = 0; i < types.length; i++) {
      if (isA(types[i])) {
        types[i] = cleanTypes(types[i]);
      } else if (isS(types[i])) {
        types[i] = cleanType(types[i]);
      }
    }
  }
  return types;
}

function test(ele, types) {
  if (isS(types)) {
    types = cleanType(types);
    return toStr.call(ele) === types || typeof ele === types;
  }
  var res = false;
  if (isA(types)) {
    types.forEach(function (t) {
      if (!res) {
        res = test(ele, t);
      }
    });
  }
  return res;
}

function is(ele) {
  for (var _len = arguments.length, types = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  return test(ele, types);
}

function not(ele) {
  for (var _len = arguments.length, types = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  return !test(ele, types);
}

function isA(ele) {
  return toStr.call(ele) === "[object Array]";
}

function isB(ele) {
  return typeof ele === "boolean";
}

function isD(ele) {
  return typeof ele !== "undefined";
}

function isF(ele) {
  return typeof ele === "function";
}

function isN(ele) {
  return typeof ele === "number";
}

function isO(ele) {
  return typeof ele === "object";
}

function isS(ele) {
  return typeof ele === "string";
}

function isDate(ele) {
  return ele.constructor === Date;
}

function isTruthy(ele) {
  return !!ele;
}

function isFalsy(ele) {
  return !ele || isEmpty(ele);
}

function isEmpty(ele) {
  if (!ele) {
    return true;
  }
  if (isA(ele) && ele.length === 0) {
    return true;
  };
  if (isO(ele) && getOwnPropertyNames(ele).length === 0) {
    return true;
  }
  return false;
}

function isNL(ele) {
  return toStr.call(ele) === "[object NodeList]";
}

},{}],3:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],4:[function(require,module,exports){
"use strict";

exports.append = append;
exports.remove = remove;
exports.parentNode = parentNode;
exports.prepend = prepend;
exports.create = create;
exports.id = id;
exports.compareType = compareType;
exports.getDimensions = getDimensions;

/*
 * Gets the outer Height of divs, including margin
 */
exports.outerHeight = outerHeight;

/*
 * Gets the outer Width of divs, including margin
 */
exports.outerWidth = outerWidth;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var each = require("magic-loops").each;

var isF = require("magic-types").isF;

function append(parent, ele) {
  var eleIsValid = ele && isF(ele.setAttribute),
      parentIsValid = parent && isF(parent.appendChild);
  if (eleIsValid && parentIsValid) {
    return parent.appendChild(ele);
  }
  return false;
}

function remove(ele) {
  if (ele && ele.parentNode && isF(ele.parentNode.removeChild)) {
    ele.parentNode.removeChild(ele);
  }
}

function parentNode(ele, type) {
  console.log("called findparentEle");
  var par = ele.parentNode;
  if (!par || !type) {
    return false;
  }
  console.log("before compareType");
  if (compareType(par, type)) {
    return par;
  }
  console.log("before recursive");
  return findParentEle(par, type);
}

function prepend(parent, ele) {
  var eleIsValid = ele && isF(ele.setAttribute),
      parentIsValid = parent && isF(parent.insertBefore);
  if (eleIsValid && parentIsValid) {
    return parent.insertBefore(ele, parent.firstChild);
  }
}

function create(ele) {
  var d = document,
      docIsValid = d && isF(d.createElement);
  if (docIsValid) {
    return document.createElement(ele);
  }
}

function id(ele, val) {
  if (!ele || !isF(ele.setAttribute)) {
    throw new Error("dom.id called without arguments, dom.id(ele, text)");
  }
  if (!val) {
    return ele.getAttribute("id");
  }
  if (isStr(val)) {
    ele.setAttribute("id", val);
    return ele.getAttribute("id");
  }
}

var cssClass = {
  toggle: function toggle(ele, name) {
    if (hasClass(ele, name)) {
      rmClass(ele, name);
      return false;
    } else {
      addClass(ele, name);
      return true;
    }
  },

  has: function has(ele, name) {
    return ele.className.indexOf(name) > -1;
  },

  add: function add(ele, name) {
    ele.classList.add(name);
  },

  remove: function remove(ele, name) {
    ele.classList.remove(name);
  }
};

exports.cssClass = cssClass;

function compareType(ele, type) {
  if (type) {
    if (isStr(type)) {
      return ele.parentNode.tagName.toLowerCase() === type.toLowerCase();
    } else if (isArr(type) || isObj(type)) {
      each(type, function (t) {
        if (compareType(ele, t)) {
          return true;
        }
      });
    }
    return false;
  }
}

function getDimensions(ele) {
  var dimensions = {
    height: outerHeight(ele),
    width: outerWidth(ele)
  };
  return dimensions;
}

function outerHeight(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;
  if (!el) {
    return -1;
  }

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

  return Math.ceil(el.offsetHeight + margin);
}

function outerWidth(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;
  if (!el) {
    return -1;
  }

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);

  return Math.ceil(el.offsetWidth + margin);
}

},{"magic-loops":1,"magic-types":3}]},{},[4]);
