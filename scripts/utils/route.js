export { route }

/**
 * Creates a route for a certain path and component builder
 * @param {string} path Path for route to be mounted on
 * @param {Function} page Page function that returns a render function
 * @returns {Object} Route object containing path and buildComponent function
 */
function route(path, page) {
  return {
    path,
    buildComponent: async updateFunc => {
      const component = await page(updateFunc)
      return component
    },
  }
}
