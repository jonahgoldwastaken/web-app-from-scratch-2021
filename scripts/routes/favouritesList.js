import { component, fetchTemplate } from '../modules/component.js'
import { navigate } from '../modules/router.js'
import { fetchTopTracks } from '../helpers/spotify.js'
import { trackStorage } from '../stores/spotify.js'

export default favouritesList

async function favouritesList() {
  const source = await fetchTemplate('list-favourites')
  return component(source, { topTracks: [] }, { mounted, updated })
}

async function mounted(component) {
  const { items } = await fetchTopTracks()
  component.state.topTracks = items
}

async function updated() {
  const generateButton = document.querySelector('[data-generate]')
  generateButton.addEventListener('click', generateClickHandler)
  const trackInputs = [].slice.call(
    document.querySelectorAll('#tracks [name="favourites"]')
  )
  trackInputs.forEach(input =>
    input.addEventListener('change', inputChangeHandler)
  )

  function generateClickHandler() {
    const selectedTrackInputs = [].slice.call(
      document.querySelectorAll('#tracks [name="favourites"]:checked')
    )

    const trackIds = selectedTrackInputs.map(input => input.value)
    if (trackIds.length) {
      trackStorage.set(trackIds)
      navigate('/generate')
    }
  }

  function inputChangeHandler() {
    const selectedTrackInputs = [].slice.call(
      document.querySelectorAll('#tracks [name="favourites"]:checked')
    )
    if (selectedTrackInputs.length > 5) {
      this.checked = false
    }
  }
}
