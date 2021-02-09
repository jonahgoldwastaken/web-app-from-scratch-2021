export { isValidArrayIndex, isInObjectArray, chunkArray }

function isValidArrayIndex(array, value) {
  return array.find(val => value === val) > -1
}

function isInObjectArray(key, value) {
  return val => val[key] === value
}

function chunkArray(array, chunkSize) {
  return array.reduce(
    (acc, curr, i) =>
      i % chunkSize === 0
        ? [...acc, [curr]]
        : [...[...acc].slice(0, -1), [...acc[acc.length - 1], curr]],
    []
  )
}
