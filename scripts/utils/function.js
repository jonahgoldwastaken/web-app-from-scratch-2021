export { debounce, sleep }

/**
 * Debounces passed function
 * With help from [this article from freeCodeCamp]{@link https://www.freecodecamp.org/news/javascript-debounce-example/}
 */
function debounce(fn, timeout = 1000) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), timeout)
  }
}

/**
 * Generic Promise-based sleep function
 * @param {number} timeout Amount of milliseconds to sleep
 * @returns {Promise} Sleep promise resolving after certain timeout
 */
function sleep(timeout = 500) {
  return new Promise(resolve => setTimeout(() => resolve(true), timeout))
}
