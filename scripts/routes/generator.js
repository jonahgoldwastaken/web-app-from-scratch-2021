import { fetchProfile, fetchTopTracks } from '../helpers/spotify.js'
import { component, fetchTemplate } from '../modules/component.js'

export default generator

async function generator() {
  const source = await fetchTemplate('generator')
  return component(source, { topTracks: [] }, { mounted })
}

async function mounted(component) {
  const profile = await fetchProfile()
  console.log(profile)

  const tracks = await fetchTopTracks()
  component.state.topTracks = tracks
}
