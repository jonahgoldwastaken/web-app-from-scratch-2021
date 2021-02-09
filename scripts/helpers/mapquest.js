import { API_KEY } from '../contants/mapquest.js'
import { fetchAndParseJSON } from '../modules/fetch.js'
import { createWritableStore } from '../utils/state.js'

export { fetchRoute }

async function fetchRoute(departure, arrival) {
  const { route } = await fetchAndParseJSON(
    `https://www.mapquestapi.com/directions/v2/route?key=${API_KEY}&from=${encodeURIComponent(
      departure
    )}&to=${encodeURIComponent(arrival)}`
  )
  return route
}

export const routeStorage = createWritableStore({})
