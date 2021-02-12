import { isInObjectArray } from './array.js'

export { findCurrentRoute, parseCurrentRouteHash, compileToHash, replaceHash }

/**
 * Finds the right route for the currently used hash
 * @param {Array} routes Array of routes
 * @returns {Object|null} Either an existing route object or null
 */
function findCurrentRoute(routes) {
  return routes.find(isInObjectArray('path', parseCurrentRouteHash()))
}

/**
 * Parses the current location hash
 * @returns {string}
 */
function parseCurrentRouteHash() {
  return '/' + location.hash.split('=')[0].slice(1)
}

/**
 * Calls location.replace to the supplied location
 * @param {string} location Current location
 */
function replaceHash(location) {
  return window.location.replace(window.location.origin + location)
}

/**
 * Compiles a standard route location to a hash
 * @param {string} location Location to compile to a hash
 * @returns {string}
 */
function compileToHash(location) {
  return '#' + location.slice(1)
}
