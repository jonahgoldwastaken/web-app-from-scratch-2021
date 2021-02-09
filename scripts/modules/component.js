import { fetchAndParseText } from '../modules/fetch.js'
import { createSameOriginUrl } from '../utils/fetch.js'
import { createState } from '../utils/state.js'
import { compile, render, update } from '../utils/template.js'

export { component, fetchTemplate }

function component(
  source,
  initialState = {},
  { mounted, updated } = { mounted: null, updated: null }
) {
  function renderer(rerender) {
    const template = compile(source)
    const state = createState(
      initialState,
      update.bind(null, rerender, template)
    )
    const firstRender = render(template, state)
    const component = { state, template: firstRender, mounted, updated }
    return component
  }
  return renderer
}

async function fetchTemplate(name) {
  return await fetchAndParseText(createSameOriginUrl(`/templates/${name}.hbs`))
}
