export { isValidArrayIndex, isInObjectArray, chunkArray }

/**
 * Checks if value has a valid index in the array
 * @param {Array} array Array to check index in
 * @param {*} value Value to find index of
 * @returns {Boolean}
 */
function isValidArrayIndex(array, value) {
  return array.findIndex(val => value === val) > -1
}

/**
 * Checks if a certain value exists under a key
 * @param {string} key Key to try and find in object array
 * @param {*} value Value to find in object array
 * @returns {Boolean}
 */
function isInObjectArray(key, value) {
  return val => val[key] === value
}

/**
 * Chunks an array into separate pieces of a certain length
 * @param {Array} array Array to chunk
 * @param {number} chunkSize Length of array chunk
 * @returns {Array} Array with chunks
 */
function chunkArray(array, chunkSize) {
  return array.reduce(
    (acc, curr, i) =>
      i % chunkSize === 0
        ? [...acc, [curr]]
        : [...[...acc].slice(0, -1), [...acc[acc.length - 1], curr]],
    []
  )
}
