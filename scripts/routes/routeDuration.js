import { fetchRoute, routeStorage } from '../helpers/mapquest.js'
import { component, fetchTemplate } from '../modules/component.js'
import { navigate } from '../modules/router.js'

export default routeDuration

async function routeDuration() {
  const source = await fetchTemplate('route-duration')
  return component(source, { route: null }, { updated, mounted })
}

function mounted(component) {
  const form = document.querySelector('form[data-route]')
  const departureInput = form.querySelector('[name="departure"]')
  const arrivalInput = form.querySelector('[name="arrival"]')
  form.addEventListener('submit', submitHandler)

  async function submitHandler(e) {
    e.preventDefault()
    const departure = departureInput.value
    const arrival = arrivalInput.value

    const data = await fetchRoute(departure, arrival)
    component.state.route = data
  }
}

function updated(component) {
  const form = document.querySelector('form[data-route]')
  const departureInput = form.querySelector('[name="departure"]')
  const arrivalInput = form.querySelector('[name="arrival"]')
  form.addEventListener('submit', submitHandler)

  async function submitHandler(e) {
    e.preventDefault()
    const departure = departureInput.value
    const arrival = arrivalInput.value

    const data = await fetchRoute(departure, arrival)
    component.state.route = data
  }

  departureInput.value = `${component.state.route.locations[0].adminArea5}, ${component.state.route.locations[0].adminArea3}`
  arrivalInput.value = `${component.state.route.locations[1].adminArea5}, ${component.state.route.locations[1].adminArea3}`
  const confirmationButton = document.querySelector('[data-confirm]')
  confirmationButton.addEventListener('click', confirmRoute)

  function confirmRoute() {
    routeStorage.set(component.state.route)
    navigate('/list-favourites')
  }
}
