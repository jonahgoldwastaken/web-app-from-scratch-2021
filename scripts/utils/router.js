import { isInObjectArray } from './array.js'
export { findCurrentRoute, parseCurrentRouteHash }

function findCurrentRoute(routes) {
  return routes.find(isInObjectArray('path', parseCurrentRouteHash()))
}

function parseCurrentRouteHash() {
  return '/' + location.hash.split('=')[0].slice(1)
}
