import {each} from 'magic-loops';
import {isF} from 'magic-types';

export function append (parent, ele) {
  var eleIsValid = ele && isF(ele.setAttribute)
  , parentIsValid = parent && isF(parent.appendChild)
  ;
  if ( eleIsValid && parentIsValid ) {
    return parent.appendChild(ele);
  }
  return false;
}

export function remove(ele) {
  if (ele && ele.parentNode && isF(ele.parentNode.removeChild) ) {
    ele.parentNode.removeChild(ele);
  }
}

export function parentNode(ele, type) {
  console.log('called findparentEle');
  var par = ele.parentNode;
  if ( ! par || ! type  ) {
    return false;
  }
  console.log('before compareType');
  if ( compareType(par, type) ) {
    return par;
  }
  console.log('before recursive');
  return findParentEle(par, type);
}

export function prepend (parent, ele) {
  var eleIsValid = ele && isF(ele.setAttribute)
  , parentIsValid = parent && isF(parent.insertBefore)
  ;
  if ( eleIsValid && parentIsValid ) {
    return parent.insertBefore(ele, parent.firstChild);
  }
}

export function create(ele) {
    var d = document
    , docIsValid = d && isF(d.createElement)
    ;
    if ( docIsValid ) {
      return document.createElement(ele);
    }
  }

export function id(ele, val) {
  if ( ! ele || ! isF(ele.setAttribute) ) {
    throw new Error('dom.id called without arguments, dom.id(ele, text)');
  }
  if ( ! val ) {
    return ele.getAttribute('id');
  }
  if ( isStr(val) ) {
    ele.setAttribute('id', val);
    return ele.getAttribute('id');
  }
}

export var cssClass = {
  toggle(ele, name) {
    if ( hasClass(ele, name) ) {
      rmClass(ele, name);
      return false;
    } else {
      addClass(ele, name);
      return true;
    }
  }

, has(ele, name) {
    return ele.className.indexOf(name) > -1;
  }

, add(ele, name) {
    ele.classList.add(name);
  }

, remove(ele, name) {
    ele.classList.remove(name);
  }
}

export function compareType(ele, type) {
  if ( type ) {
    if ( isStr(type) ) {
      return ele.parentNode.tagName.toLowerCase() === type.toLowerCase();
    } else if ( isArr(type) || isObj(type) ) {
      each(type, (t) => {
        if ( compareType(ele, t) ) {
          return true;
        }
      });
    }
    return false;
  }
}

export function getDimensions(ele) {
  var dimensions = {
    height: outerHeight(ele)
  , width: outerWidth(ele)
  };
  return dimensions;
}
/*
 * Gets the outer Height of divs, including margin
 */
export function outerHeight(el) {
  // Get the DOM Node if you pass in a string
  el = (typeof el === 'string') ? document.querySelector(el) : el; 
  if ( ! el ) { return -1; }

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

/*
 * Gets the outer Width of divs, including margin
 */
export function outerWidth(el) {
  // Get the DOM Node if you pass in a string
  el = (typeof el === 'string') ? document.querySelector(el) : el; 
  if ( ! el ) { return -1; }

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginLeft']) +
               parseFloat(styles['marginRight']);

  return Math.ceil(el.offsetWidth + margin);
}
