import { fetchTrip } from '../helpers/bingMaps.js'
import { tripStorage } from '../stores/maps.js'
import { component, fetchTemplate } from '../modules/component.js'
import { navigate } from '../modules/router.js'

export default tripDuration

/**
 * Trip Duration route
 */
async function tripDuration() {
  const source = await fetchTemplate('trip-duration')
  return component(source, { trip: null }, { updated, mounted })
}

function mounted(component) {
  const form = document.querySelector('form[data-trip]')
  const departureInput = form.querySelector('[name="departure"]')
  const arrivalInput = form.querySelector('[name="arrival"]')
  form.addEventListener('submit', submitHandler)

  async function submitHandler(e) {
    e.preventDefault()
    const departure = departureInput.value
    const arrival = arrivalInput.value

    const data = await fetchTrip(departure, arrival)
    component.state.trip = data
  }
}

function updated(component) {
  const form = document.querySelector('form[data-trip]')
  const departureInput = form.querySelector('[name="departure"]')
  const arrivalInput = form.querySelector('[name="arrival"]')
  form.addEventListener('submit', submitHandler)

  const confirmationButton = document.querySelector('[data-confirm]')
  confirmationButton.addEventListener('click', confirmTrip)

  /**
   * Handles the search form submit
   * @param {Event} e Form submit event
   */
  async function submitHandler(e) {
    e.preventDefault()
    const departure = departureInput.value
    const arrival = arrivalInput.value

    const data = await fetchTrip(departure, arrival)
    component.state.trip = data
  }

  /**
   * Handles trip confirmation
   */
  function confirmTrip() {
    tripStorage.set(component.state.trip)
    navigate('/list-favourites')
  }
}
