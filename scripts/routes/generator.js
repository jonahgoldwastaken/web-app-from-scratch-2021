import { routeStorage } from '../stores/maps.js'
import {
  createSpotifyPlaylist,
  fetchRecommendations,
  filterOutTracksInList,
  getListInfo,
  populateSpotifyPlaylist,
  trimList,
} from '../helpers/spotify.js'
import {
  component as createComponent,
  fetchTemplate,
} from '../modules/component.js'
import { trackStorage } from '../stores/spotify.js'
import { sleep } from '../utils/function.js'

export default generator

async function generator() {
  const source = await fetchTemplate('generate')
  return createComponent(
    source,
    {
      generating: true,
      list: null,
      topTracks: null,
      route: null,
    },
    { mounted, updated }
  )
}

async function mounted(component) {
  trackStorage.subscribe(val => (component.state.topTracks = val))
  routeStorage.subscribe(val => (component.state.route = val))
}

async function updated(component) {
  if (component.state.topTracks && component.state.route) {
    if (!component.state.list) {
      component.state.list = await generateList(component)
      component.state.generating = false
      return
    }
    const saveButton = document.querySelector('[data-save]')
    saveButton.addEventListener(
      'click',
      saveListToSpotify.bind(null, component),
      true
    )
  }
}

async function generateList(component, list = []) {
  if (list.length) await sleep(400)
  const freshTracks = await fetchRecommendations(component.state.topTracks)
  const filteredTracks = freshTracks.filter(filterOutTracksInList(list))
  const newList = [...list, ...filteredTracks]
  const { totalTime } = getListInfo(newList)

  if (totalTime >= component.state.route.travelDuration)
    return trimList(newList, component.state.route.travelDuration)
  return await generateList(component, newList)
}

async function saveListToSpotify(component) {
  const { list, route } = component.state
  const departure = route.startLocation.name
  const arrival = route.endLocation.name
  const playlist = await createSpotifyPlaylist(departure, arrival)
  if (await populateSpotifyPlaylist(playlist.id, list))
    console.log(`Gelukt! ${list.length} nummers toegevoegd aan de triplist!`)
}
