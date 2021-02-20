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
      trip: null,
      saving: false,
    },
    { mounted, updated }
  )
}

async function mounted(component) {
  tripStorage.subscribe(val => {
    if (!val) navigate('/trip-duration')
    else component.state.trip = val
  })()
  trackStorage.subscribe(val => {
    if (!val) navigate('/trip-duration')
    else component.state.topTracks = val
  })()
}

async function updated(component) {
  if (component.state.topTracks && component.state.trip) {
    if (!component.state.list.length) {
      for await (const list of generateList(
        component.state.trip,
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

      const listAddButton = document.querySelector('#modify-list #add button')
      const listRemoveButton = document.querySelector(
        '#modify-list #remove button'
      )

      listAddButton.addEventListener(
        'click',
        async e =>
          (component.state.list = await modifyPlaylist(
            'add',
            component.state.topTracks,
            component.state.list,
            e
          ))
      )
      listRemoveButton.addEventListener(
        'click',
        async e =>
          (component.state.list = await modifyPlaylist(
            'remove',
            component.state.topTracks,
            component.state.list,
            e
          ))
      )
    }
  }
}

/**
 * Generator function that generates the playlist, yielding every time the list is updated
 * @param {object} trip The trip object
 * @param {array} topTracks The list of top tracks to be used with recommendation fetching
 * @yields {array} List of songs
 * @returns {array} List of songs
 */
async function* generateList(trip, topTracks) {
  let list = []
  while (getListInfo(list).totalTime < trip.travelDuration) {
    await sleep(400)
    const newTracks = await fetchRecommendations(topTracks)
    const filteredTracks = newTracks.filter(filterOutTracksInList(list))
    list = [...list, ...filteredTracks]
    yield list
  }
  return trimList(list, trip.travelDuration)
}

/**
 * Toggles the song preview, handling all possible states like switching, playing and pausing.
 * @param {MouseEvent} e The mouse click event on the preview button
 */
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

/**
 * Handles the audio element 'ended' event, putting everything back into its default state.
 * @param {Event} e The audio 'ended' event
 */
function audioEndedHandler(e) {
  const previewUrl = e.currentTarget.src
  const previewButton = document.querySelector(`[data-preview="${previewUrl}"`)
  const previewStatus = previewButton.querySelector('[src="/assets/pause.svg"]')
  previewStatus.src = '/assets/play.svg'
  previewButton.classList.remove('playing')
}

/**
 * Swaps a song in the list with a new song at the same place.
 * @param {array} topTracks Array of top tracks used for seeding
 * @param {array} list The current playlist
 * @param {MouseEvent} e The mouseclick event
 * @returns {Promise<Array>} The playlist with the new song
 */
async function swapSong(topTracks, list, e) {
  const swapButton = e.currentTarget
  swapButton.classList.add('swapping')
  const index = list.findIndex(track => track.id === swapButton.dataset.swap)
  let newTrack
  do {
    const data = await fetchRecommendations(topTracks, 1)
    newTrack = data[0]
  } while (!filterOutTracksInList(list, newTrack))
  swapButton.classList.remove('swapping')
  return [...list.slice(0, index), newTrack, ...list.slice(index + 1)]
}

/**
 * Modifies a playlist, adding or removing songs from it
 * @param {string} type The type of modification applied to the playlist, 'add' or 'remove'
 * @param {array} topTracks Array of top tracks used for seeding
 * @param {array} list The current Playlist
 * @param {MouseEvent} e The mouseclick event
 * @returns {array} The updated list
 */
async function modifyPlaylist(type, topTracks, list, e) {
  const submitButton = e.currentTarget
  const input = submitButton.previousElementSibling.querySelector('input')
  const amount = input.value

  switch (type) {
    case 'add':
      let newSongs = []
      do {
        const data = await fetchRecommendations(topTracks, amount)
        newSongs = [...newSongs, ...data.filter(filterOutTracksInList(list))]
      } while (newSongs.length < amount)
      return [...newSongs.slice(0, amount), ...list]
    case 'remove':
      return list.slice(0, list.length - amount)
  }
}

/**
 * Saves the playlist to Spotify with the correct name and songs
 * @param {object} component The page component
 */
async function saveListToSpotify(component) {
  const { list, trip } = component.state
  const departure =
    trip.startLocation.address.adminDistrict2 ||
    trip.startLocation.address.adminDistrict ||
    trip.startLocation.name
  const arrival =
    trip.endLocation.address.adminDistrict2 ||
    trip.endLocation.address.adminDistrict ||
    trip.endLocation.name
  const playlist = await createSpotifyPlaylist(departure, arrival)
  if (await populateSpotifyPlaylist(playlist.id, list)) {
    playlistStorage.set(playlist)
    navigate('/result')
  }
}
