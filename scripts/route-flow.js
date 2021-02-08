import { fetchAndParseData } from './modules/fetch.js'
import { API_KEY } from './contants/mapquest.js'

export { prepareRouteFlow }

function prepareRouteFlow() {
  const routeCalculateButton = document.querySelector('[data-calculate-route]')
  routeCalculateButton.addEventListener('click', parseRoute)
}

function parseRoute() {
  const departureInput = document.querySelector('[data-departure]')
  const arrivalInput = document.querySelector('[data-arrival]')
  const departure = departureInput.value
  const arrival = arrivalInput.value

  fetchAndParseData(
    `http://www.mapquestapi.com/directions/v2/route?key=${API_KEY}&from=${encodeURIComponent(
      departure
    )}&to=${encodeURIComponent(arrival)}`
  ).then(console.log)
}
