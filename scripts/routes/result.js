import { component, fetchTemplate } from '../modules/component.js'
import { fetchSpotifyPlaylist } from '../helpers/spotify.js'
import { playlistStorage } from '../stores/spotify.js'

export default result

async function result() {
  const source = await fetchTemplate('result')
  return component(source, { playlist: null }, { mounted, updated })
}

function mounted(component) {
  playlistStorage.subscribe(value => {
    if (!value?.images.length)
      fetchSpotifyPlaylist(value.id).then(playlist =>
        playlistStorage.set(playlist)
      )
    else component.state.playlist = value
  })
}

function updated(component) {
  console.log(component.state.playlist)
}
