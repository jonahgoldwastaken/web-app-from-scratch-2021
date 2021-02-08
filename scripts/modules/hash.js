export { parseAccessToken }

/**
 * Parses the window hash
 * @returns {Object} Object containing window hashes
 */
function parseAccessToken() {
  return window.location.hash
    .slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .find(d => d[0] === 'access_token')[1]
}
