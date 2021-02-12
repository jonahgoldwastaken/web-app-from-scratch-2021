import { fetchAndParseText } from '../modules/fetch.js'
import { createSameOriginUrl } from '../utils/fetch.js'
import { createState } from '../utils/state.js'
import { compile, render, update } from '../utils/template.js'

export { component, fetchTemplate }

/**
 * Creates a reactive Handlebars component
 * @param {string} source Handlebars string
 * @param {object} initialState Initial state object
 * @param {object} lifeCycleFunctions Objects containing lifecycle functions `mounted` & `updated`
 * @returns {Function} Function to return to a `route` function
 */
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

/**
 * Fetches template from the template folder
 * @param {string} name Template name
 * @returns {Promise} Promise resolving to Handlebars template string
 */
async function fetchTemplate(name) {
  return await fetchAndParseText(createSameOriginUrl(`/templates/${name}.hbs`))
}
