export { pickKeyFromObject }

/**
 * Picks a key from an object, returning its value
 * @param {string} key Key of object
 * @param {Object} object Object to pick key from
 * @returns {*} Value at the object key
 */
function pickKeyFromObject(key, object) {
  if (!object) return object => object[key]
  return object[key]
}
