import {
  compileToHash,
  findCurrentRoute,
  parseCurrentRouteHash,
  replaceHash,
} from '../utils/router.js'

export { router, navigate }

/**
 * Creates a router that switches between supplied routes
 * @param {array} routes Array of route functions
 * @returns {Function} Function to render to the DOM
 */
function router(routes) {
  let hash
  let root
  let currentComponent

  window.addEventListener('hashchange', renderRoute)
  renderRoute()

  async function renderRoute() {
    const route = findCurrentRoute(routes)
    if (route) {
      if (route.authMiddleware) {
        if (!route.authMiddleware()) {
          navigate('/')
          return
        }
      }
      hash = parseCurrentRouteHash()
      const renderComponent = await route.buildComponent()
      const renderedComponent = renderComponent(rerenderRoute.bind(null, hash))
      currentComponent = renderedComponent

      root.innerHTML = renderedComponent.template

      if (currentComponent.mounted) currentComponent.mounted(currentComponent)
    } else navigate('/')
  }

  function rerenderRoute(path, template) {
    if (path === hash) {
      root.innerHTML = template
      if (currentComponent.updated) currentComponent.updated(currentComponent)
    }
  }

  return element => {
    root = element
    renderRoute()
  }
}

function navigate(destination, replace) {
  const hash = compileToHash(destination)
  if (replace) replaceHash(hash)
  else window.location.hash = hash
}
