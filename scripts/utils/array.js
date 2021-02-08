export { isValidArrayIndex, isInObjectArray }

function isValidArrayIndex(array, value) {
  return array.find(val => value === val) > -1
}

function isInObjectArray(key, value) {
  return val => val[key] === value
}
