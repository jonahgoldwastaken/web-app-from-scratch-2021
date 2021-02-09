import { fetchAndParseJSON } from '../modules/fetch.js'
import { createFetchAuthOptions } from '../utils/fetch.js'
import { createWritableStore } from '../utils/state.js'

export {
    saveToken,
    fetchProfile,
    fetchAndTemplateParseProfile,
    fetchTopTracks,
    fetchRecommendations,
}

function saveToken(token) {
  return sessionStorage.setItem('spotify-token', `Bearer ${token}`)
}

async function fetchProfile() {
  const token = getToken()
  const profile = await fetchAndParseJSON(
    'https://api.spotify.com/v1/me',
    createFetchAuthOptions(token)
  )
  return profile
}

async function fetchTopTracks() {
  const token = getToken()
  const tracks = await fetchAndParseJSON(
    'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
    createFetchAuthOptions(token)
  )
  return tracks
}

async function fetchAndTemplateParseProfile() {
  const profile = fetchProfile()
  return parseProfileForTemplate(profile)
}

async function fetchRecommendations(ids) {
  const token = getToken()
  const { tracks } = await fetchAndParseJSON(
    `https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${ids.join(
      ','
    )}`,
    createFetchAuthOptions(token)
  )
  return tracks
}

function getToken() {
  return sessionStorage.getItem('spotify-token')
}

function parseProfileForTemplate(profile) {
  return {
    ...profile,
    external_urls: Object.entries(profile.external_urls),
    images: profile.images[0],
  }
}

export const trackStorage = createWritableStore([])
