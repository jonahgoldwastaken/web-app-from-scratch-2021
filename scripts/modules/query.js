export { parseHashString }

/**
 * Parses the window hash
 * @returns {Object} Object containing window hashes
 */
function parseHashString() {
  return window.location.hash
    .slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: curr[1],
      }),
      {}
    )
}
