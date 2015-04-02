(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === 'function') {
  symbolValueOf = Symbol.prototype.valueOf;
}
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  boolean: 1,
  number: 1,
  string: 1,
  undefined: 1
};

var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a = is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return typeof value !== 'undefined';
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toStr.call(value);
  var key;

  if ('[object Array]' === type || '[object Arguments]' === type || '[object String]' === type) {
    return value.length === 0;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (owns.call(value, key)) { return false; }
    }
    return true;
  }

  return !value;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function (value, other) {
  var strictlyEqual = value === other;
  if (strictlyEqual) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if ('[object Array]' === type) {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if ('[object Function]' === type) {
    return value.prototype === other.prototype;
  }

  if ('[object Date]' === type) {
    return value.getTime() === other.getTime();
  }

  return strictlyEqual;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is.nil = is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is.undefined = function (value) {
  return typeof value === 'undefined';
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is.arguments = function (value) {
  var isStandardArguments = '[object Arguments]' === toStr.call(value);
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = function (value) {
  return '[object Array]' === toStr.call(value);
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.boolean(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.boolean
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.boolean = function (value) {
  return '[object Boolean]' === toStr.call(value);
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.boolean(value) && Boolean(Number(value)) === false;
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.boolean(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return '[object Date]' === toStr.call(value);
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return '[object Error]' === toStr.call(value);
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || '[object Function]' === toStr.call(value);
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return '[object Number]' === toStr.call(value);
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.int
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.int = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return '[object Object]' === toStr.call(value);
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return '[object RegExp]' === toStr.call(value);
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return '[object String]' === toStr.call(value);
};

/**
 * Test base64 string.
 */

/**
 * is.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

is.base64 = function (value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * is.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

is.hex = function (value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};

/**
 * is.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

is.symbol = function (value) {
  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
};

},{}],2:[function(require,module,exports){
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

function each(arrOrObj, fn) {
  fn = fn || function () {};

  if (isA(arrOrObj)) {
    for (var i = 0; i < arrOrObj.length; i++) {
      if (isF(fn)) {
        fn(arrOrObj[i], i);
      }
    }
  } else if (isO(arrOrObj)) {
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
},{"magic-types":3}],3:[function(require,module,exports){
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
  return toStr.call(ele) === "[object Object]";
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

//longExplicitNames
var isArray = isA,
    isBoolean = isB,
    isDefined = isD,
    isFunction = isF,
    isNumber = isN,
    isObject = isO,
    isString = isS,
    isNodeList = isNL
//short
,
    isArr = isA,
    isBool = isB,
    isDef = isD,
    isFn = isF,
    isNum = isN,
    isObj = isO,
    isStr = isS
//s
,
    arr = isA,
    bool = isB,
    def = isD,
    fn = isF,
    num = isN,
    obj = isO,
    str = isS,
    nl = isNL
//special types
,
    date = isDate,
    falsy = isFalsy,
    truthy = isFalsy;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isDefined = isDefined;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.isNodeList = isNodeList;
exports.isArr = isArr;
exports.isBool = isBool;
exports.isDef = isDef;
exports.isFn = isFn;
exports.isNum = isNum;
exports.isObj = isObj;
exports.isStr = isStr;
exports.arr = arr;
exports.bool = bool;
exports.def = def;
exports.fn = fn;
exports.num = num;
exports.obj = obj;
exports.str = str;
exports.nl = nl;
exports.date = date;
exports.falsy = falsy;
exports.truthy = truthy;

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var each = require("magic-loops").each;

var is = _interopRequire(require("is"));

function appendEle(parent, ele) {
  var eleIsValid = ele && is.fn(ele.setAttribute),
      parentIsValid = parent && is.fn(parent.appendChild);
  if (eleIsValid && parentIsValid) {
    return parent.appendChild(ele);
  }
  return false;
}

function removeEle(ele) {
  if (ele && ele.parentNode && is.fn(ele.parentNode.removeChild)) {
    ele.parentNode.removeChild(ele);
  }
}

function findParentEle(ele) {
  var type = arguments[1] === undefined ? false : arguments[1];

  console.log("find parent for ele " + ele + " and type " + type);
  if (!ele || !ele.parentNode || !type) {
    return false;
  }
  if (compareType(ele.parentNode, type)) {
    return ele.parentNode;rr;
  }
  findParent(ele.parentNode, type);
}

var dom = {
  prepend: function prepend(parent, ele) {
    var eleIsValid = ele && is.fn(ele.setAttribute),
        parentIsValid = parent && is.fn(parent.insertBefore);
    if (eleIsValid && parentIsValid) {
      return parent.insertBefore(ele, parent.firstChild);
    }
  },

  create: function create(ele) {
    var d = document,
        docIsValid = d && is.fn(d.createElement);
    if (docIsValid) {
      return document.createElement(ele);
    }
  },

  id: function id(ele, val) {
    if (!ele || !is.fn(ele.setAttribute)) {
      throw new Error("dom.id called without arguments, dom.id(ele, text)");
    }
    if (!val) {
      return ele.getAttribute("id");
    }
    if (isStr(val)) {
      ele.setAttribute("id", val);
      return ele.getAttribute("id");
    }
  },

  "class": {
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
  },

  compareType: (function (_compareType) {
    var _compareTypeWrapper = function compareType(_x) {
      return _compareType.apply(this, arguments);
    };

    _compareTypeWrapper.toString = function () {
      return _compareType.toString();
    };

    return _compareTypeWrapper;
  })(function (ele) {
    var type = arguments[1] === undefined ? false : arguments[1];

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
  }),

  append: appendEle,
  add: appendEle,
  rm: removeEle,
  remove: removeEle,
  findParent: findParentEle,
  parentNode: findParentEle

};

exports.dom = dom;
exports["default"] = dom;

},{"is":1,"magic-loops":2}]},{},[4]);
