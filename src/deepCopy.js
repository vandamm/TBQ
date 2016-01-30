'use strict';

/**
 * Deep copy properties of an object into flyweight
 * We're okay with having objects reference same functions as they always get game object as a param
 */
export default function (obj) {
  if (typeof obj !== 'object' || typeof obj === 'function') {
    return obj;
  }

  let copy = Array.isArray(obj) ? [] : Object.create(null);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
}
