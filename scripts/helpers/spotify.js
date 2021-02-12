import { fetchAndParseJSON } from '../modules/fetch.js'
import { chunkArray } from '../utils/array.js'
import { createFetchAuthOptions } from '../utils/fetch.js'
import { sleep } from '../utils/function.js'
import { convertMStoS } from '../utils/time.js'

export {
  saveToken,
  fetchProfile,
  fetchAndTemplateParseProfile,
  fetchTopTracks,
  fetchRecommendations,
  getListInfo,
  createSpotifyPlaylist,
  trimList,
  filterOutTracksInList,
  populateSpotifyPlaylist,
  authenticationCheck,
}

/**
 * Saves token to sessionStorage
 * @param {string} token Token to save
 */
function saveToken(token) {
  return sessionStorage.setItem('spotify-token', `Bearer ${token}`)
}

/**
 * Fetches the profile
 * @returns {object} The Spotify user object
 */
async function fetchProfile() {
  const token = getToken()
  const profile = await fetchAndParseJSON(
    'https://api.spotify.com/v1/me',
    createFetchAuthOptions(token)
  )
  return profile
}

/**
 * Fetches the 20 Top Tracks for the currently logged-in user
 * @returns {array} Array of top tracks
 */
async function fetchTopTracks() {
  const token = getToken()
  const { items } = await fetchAndParseJSON(
    'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
    createFetchAuthOptions(token)
  )
  return items
}

/**
 * Fetches and parses the Spotify user object for use in templates
 * @returns {object} The parsed Spotify user object
 */
async function fetchAndTemplateParseProfile() {
  const profile = fetchProfile()
  return parseProfileForTemplate(profile)
}

/**
 * Fetches recommendations based on song IDs
 * @param {array} ids Array of Spotify Track IDs to use with recommendation fetching
 * @returns {object} Tracks
 */
async function fetchRecommendations(ids) {
  const token = getToken()
  const { tracks } = await fetchAndParseJSON(
    `https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${ids.join(
      ','
    )}`,
    createFetchAuthOptions(token)
  )
  return tracks
}

/**
 * Creates filter function to check if supplied track already exists in other array
 * @param {array} tracks tracks array to filter
 * @returns {Function} Filter function that takes a track to use in Array.prototype.filter
 */
function filterOutTracksInList(tracks) {
  return track => tracks.findIndex(t => t.id === track.id) === -1
}

/**
 * Trims tracklist until it's a little longer than the trip duration
 * @param {array} list Tracklist to trim
 * @param {number} tripTime Time the trip takes
 * @returns {array} Trimmed tracklist
 */
function trimList(list, tripTime) {
  let newList = list
  while (getListInfo([...newList].slice(0, -1)).totalTime > tripTime) {
    newList = [...newList].slice(0, -1)
  }
  return newList
}

/**
 * Creates Spotify playlist
 * @param {string} departure Departure location string
 * @param {string} arrival Arrival location string
 * @returns {object} Created Spotify playlist object
 */
async function createSpotifyPlaylist(departure, arrival) {
  const token = getToken()
  const { id } = await fetchProfile()
  return await fetchAndParseJSON(
    `https://api.spotify.com/v1/users/${id}/playlists`,
    {
      ...createFetchAuthOptions(token, 'POST'),
      body: JSON.stringify({
        name: `Triptoplist for ${departure} -> ${arrival}`,
        description: 'Generated by Triplist @ https://wafs.jonahgold.dev',
      }),
    }
  )
}

/**
 *
 * @param {string} playlistID Spotify Playlist ID
 * @param {array} songs Array of songs
 */
async function populateSpotifyPlaylist(id, songs) {
  const chunkedSongs = chunkArray(songs, 100)
  return await postSongsToPlaylist(id, chunkedSongs, 0)

  async function postSongsToPlaylist(id, songs, i) {
    if (i > 0) await sleep(400)
    const token = getToken()
    await fetchAndParseJSON(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        ...createFetchAuthOptions(token, 'POST'),
        body: JSON.stringify({
          uris: songs[i].map(song => song.uri),
        }),
      }
    )
    if (!songs[i + 1]) return true
    else return postSongsToPlaylist(id, songs, i + 1)
  }
}

/**
 * Gets the token from sessionStorage
 * @returns {string} Spotify token from sessionStorage
 */
function getToken() {
  return sessionStorage.getItem('spotify-token')
}

/**
 * Parses Spotify profile for use inside templates
 * @param {object} profile Spotify profile object
 * @returns {object} Parsed object
 */
function parseProfileForTemplate(profile) {
  return {
    ...profile,
    external_urls: Object.entries(profile.external_urls),
    images: profile.images[0],
  }
}

/**
 * Gets extra info for a tracklist
 * @param {array} list Track list
 * @returns {object} Object containing extra information
 */
function getListInfo(list) {
  const totalTime = convertMStoS(
    list.reduce((acc, curr) => acc + curr.duration_ms, 0)
  )
  return { totalTime }
}

function authenticationCheck() {
  return !!getToken()
}
