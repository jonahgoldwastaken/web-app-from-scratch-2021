import { tripStorage } from '../stores/maps.js'
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
import { trackStorage, playlistStorage } from '../stores/spotify.js'
import { sleep } from '../utils/function.js'
import { navigate } from '../modules/router.js'

export default generator

/**
 * Generator route
 */
async function generator() {
  const source = await fetchTemplate('generate')
  return createComponent(
    source,
    {
      generating: true,
      list: [],
      topTracks: null,
      route: null,
      saving: false,
    },
    { mounted, updated }
  )
}

async function mounted(component) {
  tripStorage.subscribe(val => {
    if (!val) navigate('/trip-duration')
    else component.state.route = val
  })()
  trackStorage.subscribe(val => {
    if (!val) navigate('/trip-duration')
    else component.state.topTracks = val
  })()
}

async function updated(component) {
  if (component.state.topTracks && component.state.route) {
    if (!component.state.list.length) {
      for await (const list of generateList(
        component.state.route,
        component.state.topTracks
      )) {
        component.state.list = list
      }
      component.state.generating = false
      return
    }
    if (!component.state.generating && !component.state.saving) {
      const saveButton = document.querySelector('[data-save]')
      saveButton.addEventListener(
        'click',
        () => {
          component.state.saving = true
          saveListToSpotify(component)
        },
        true
      )
    }
  }
}

async function* generateList(route, tracks) {
  let list = []
  while (getListInfo(list).totalTime < route.travelDuration) {
    await sleep(400)
    const freshTracks = await fetchRecommendations(tracks)
    const filteredTracks = freshTracks.filter(filterOutTracksInList(list))
    list = [...list, ...filteredTracks]
    yield list
  }
  return trimList(list, route.travelDuration)
}

async function saveListToSpotify(component) {
  const { list, route } = component.state
  const departure =
    route.startLocation.address.adminDistrict2 ||
    route.startLocation.address.adminDistrict ||
    route.startLocation.name
  const arrival =
    route.endLocation.address.adminDistrict2 ||
    route.endLocation.address.adminDistrict ||
    route.endLocation.name
  const playlist = await createSpotifyPlaylist(departure, arrival)
  if (await populateSpotifyPlaylist(playlist.id, list)) {
    playlistStorage.set(playlist)
    navigate('/result')
  }
}
