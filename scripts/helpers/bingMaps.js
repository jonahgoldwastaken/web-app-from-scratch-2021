import { ROUTE_URI } from '../constants/bingMaps.js'
import { fetchAndParseJSON } from '../modules/fetch.js'

export { fetchTrip }

/**
 * Calculates the trip for the provided locations
 * @param  {...string} locations Location strings to include in the trip
 * @returns {object} The first and only leg of the calculated trip
 */
async function fetchTrip(...locations) {
  const { resourceSets } = await fetchAndParseJSON(
    `${ROUTE_URI}${locations.map((l, i) =>
      i === 0 || i === locations.length - 1
        ? `&wp.${i + 1}=${encodeURIComponent(l)}`
        : `&vwp.${i + 1}=${encodeURIComponent(l)}`
    )}`
  )
  console.log(resourceSets[0].resources[0].routeLegs[0])
  return resourceSets[0].resources[0].routeLegs[0]
}
