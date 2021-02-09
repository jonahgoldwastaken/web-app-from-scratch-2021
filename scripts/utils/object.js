export { pickKeyFromObject }

function pickKeyFromObject(key, object) {
  if (!object) return object => object[key]
  return object[key]
}
