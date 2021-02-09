import { fetchRecommendations, trackStorage } from '../helpers/spotify.js'
import { component, fetchTemplate } from '../modules/component.js'

export default generator

async function generator() {
  const source = await fetchTemplate('generate')
  return component(source, { generating: true, list: [] }, { mounted })
}

async function mounted(component) {
  trackStorage.subscribe(ids => {
    fetchRecommendations(ids).then(recommendations => {
      component.state.list = recommendations
      component.state.generating = false
    })
  })
}
