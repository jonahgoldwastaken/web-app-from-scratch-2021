import { render, compile, update } from '../utils/template.js'
import { createState } from '../utils/state.js'

export { component }

function component(source, initialState = {}, mounted) {
  function renderer(rerender) {
    const template = compile(source)
    const state = createState(
      initialState,
      update.bind(null, rerender, template)
    )
    const firstRender = render(template, state)
    const component = { state, template: firstRender, mounted }
    return component
  }
  return renderer
}
