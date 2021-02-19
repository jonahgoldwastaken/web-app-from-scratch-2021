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
      saveButton.addEventListener(
        'click',
        () => {
          component.state.saving = true
          saveListToSpotify(component)
        },
        true
      )

      const previewButtons = [].slice.call(
        document.querySelectorAll('[data-preview]')
      )
      previewButtons.forEach(button =>
        button.addEventListener('click', toggleSongPreview)
      )

      const audioElement = document.querySelector('[data-audio]')
      audioElement.volume = 0.5
      audioElement.addEventListener('ended', audioEndedHandler)

      const swapButtons = [].slice.call(
        document.querySelectorAll('[data-swap]')
      )
      swapButtons.forEach(button =>
        button.addEventListener('click', async e => {
          component.state.list = await swapSong(
            component.state.topTracks,
            component.state.list,
            e
          )
        })
      )
    }
  }
}

async function* generateList(route, topTracks) {
  let list = []
  while (getListInfo(list).totalTime < route.travelDuration) {
    await sleep(400)
    const newTracks = await fetchRecommendations(topTracks)
    const filteredTracks = newTracks.filter(filterOutTracksInList(list))
    list = [...list, ...filteredTracks]
    yield list
  }
  return trimList(list, route.travelDuration)
}

function toggleSongPreview(e) {
  const oldPlayStatus = document.querySelector(
    '[data-preview] img[src="/assets/pause.svg"]'
  )
  if (oldPlayStatus) oldPlayStatus.src = '/assets/play.svg'
  const oldPlayButton = document.querySelector('.playing')
  if (oldPlayButton) oldPlayButton.classList.remove('playing')

  const previewButton = e.currentTarget
  const playStatus = previewButton.querySelector('img[src$="svg"]')
  const audioElement = document.querySelector('[data-audio]')

  const previewUrl = previewButton.dataset.preview

  if (audioElement.src !== previewUrl) {
    audioElement.src = previewUrl
    audioElement.currentTime = 0
    audioElement.play()
    playStatus.src = '/assets/pause.svg'
    previewButton.classList.add('playing')
  } else if (audioElement.paused) {
    audioElement.play()
    playStatus.src = '/assets/pause.svg'
    previewButton.classList.add('playing')
  } else {
    audioElement.pause()
    audioElement.currentTime = 0
    previewButton.classList.remove('playing')
  }
}

function audioEndedHandler(e) {
  const previewUrl = e.currentTarget.src
  const previewButton = document.querySelector(`[data-preview="${previewUrl}"`)
  const previewStatus = previewButton.querySelector('[src="/assets/pause.svg"')
  previewStatus.src = '/assets/play.svg'
  previewButton.classList.remove('playing')
}

async function swapSong(topTracks, list, e) {
  const index = list.findIndex(
    track => track.id === e.currentTarget.dataset.swap
  )
  let newTrack
  do {
    const data = await fetchRecommendations(topTracks, 1)
    newTrack = data[0]
  } while (filterOutTracksInList(list)(newTrack))
  return [...list.slice(0, index), newTrack, ...list.slice(index + 1)]
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
