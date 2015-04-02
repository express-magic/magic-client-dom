import {each} from 'magic-loops';
import is from 'is';

function appendEle (parent, ele) {
  var eleIsValid = ele && is.fn(ele.setAttribute)
  , parentIsValid = parent && is.fn(parent.appendChild)
  ;
  if ( eleIsValid && parentIsValid ) {
    return parent.appendChild(ele);
  }
  return false;
}

function removeEle(ele) {
  if (ele && ele.parentNode && is.fn(ele.parentNode.removeChild) ) {
    ele.parentNode.removeChild(ele);
  }
}

function findParentEle(ele, type=false) {
  console.log(`find parent for ele ${ele} and type ${type}`);
  if ( ! ele || ! ele.parentNode || ! type  ) {
    return false;
  }
  if ( compareType(ele.parentNode, type) ) {
    return ele.parentNode;rr
  }
  findParent(ele.parentNode, type);
}

export var dom = {
  prepend (parent, ele) {
    var eleIsValid = ele && is.fn(ele.setAttribute)
    , parentIsValid = parent && is.fn(parent.insertBefore)
    ;
    if ( eleIsValid && parentIsValid ) {
      return parent.insertBefore(ele, parent.firstChild);
    }
  }

, create(ele) {
    var d = document
    , docIsValid = d && is.fn(d.createElement)
    ;
    if ( docIsValid ) {
      return document.createElement(ele);
    }
  }

, id(ele, val) {
    if ( ! ele || ! is.fn(ele.setAttribute) ) {
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

, class: {
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

, compareType(ele, type=false) {
    if (type ) {
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
  
, append    : appendEle
, add       : appendEle
, rm        : removeEle
, remove    : removeEle
, findParent: findParentEle
, parentNode: findParentEle

};

export default dom;
