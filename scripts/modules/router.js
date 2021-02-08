import { findCurrentRoute, parseCurrentRouteHash } from '../utils/router.js'

export { router }

async function router(routes) {
  let hash
  let root

  window.addEventListener('hashchange', renderRoute)
  renderRoute()

  async function renderRoute() {
    const route = findCurrentRoute(routes)
    if (route) {
      hash = parseCurrentRouteHash()
      const renderComponent = await route.buildComponent()
      const renderedComponent = renderComponent(rerenderRoute.bind(null, hash))

      root.innerHTML = renderedComponent.template

      if (renderedComponent.mounted)
        renderedComponent.mounted(renderedComponent)
    }
  }

  function rerenderRoute(path, template) {
    if (path === hash) {
      root.innerHTML = template
    }
  }

  return element => {
    root = element
    renderRoute()
  }
}
