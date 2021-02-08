export { getValueFromObject }

function getValueFromObject(key) {
  return object => object[key]
}
