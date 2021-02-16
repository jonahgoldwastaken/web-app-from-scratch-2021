export { route }

/**
 * Creates a route for a certain path and component builder
 * @param {string} path Path for route to be mounted on
 * @param {Function} page Page function that returns a render function
 * @param {Function} [authMiddleware] Function determining if the user is authenticated for the page
 * @returns {Object} Route object containing path and buildComponent function
 */
function route(path, page, authMiddleware) {
  return {
    path,
    authMiddleware,
    buildComponent: async () => {
      const component = await page()
      return component
    },
  }
}
