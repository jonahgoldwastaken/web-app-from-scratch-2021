export { debounce }

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
