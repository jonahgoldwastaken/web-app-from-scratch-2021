import handlebars from 'https://cdn.skypack.dev/handlebars@^4.7.7'
import { getListInfo } from '../helpers/spotify.js'

export { render, compile, update }

handlebars.registerHelper('timeFormatter', function (seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
})

handlebars.registerHelper('cityName', function (location) {
  return (
    location.address.adminDistrict2 ||
    location.address.adminDistrict ||
    location.name
  )
})

handlebars.registerHelper('distanceFormatter', function (distance) {
  return Number(distance).toFixed(2)
})

handlebars.registerHelper('durationFormatter', function (list) {
  if (!list.length) return '00:00:00'
  const seconds = getListInfo(list).totalTime
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const parsedSeconds = Math.floor(seconds - hours * 3600 - minutes * 60)
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${parsedSeconds < 10 ? `0${parsedSeconds}` : parsedSeconds}`
})

handlebars.registerHelper('progress', function (list, trip) {
  return (getListInfo(list).totalTime / trip.travelDuration) * 100
})

handlebars.registerHelper('validUrl', function (string) {
  return string && (string.includes('http://') || string.includes('https://'))
})
/**
 * Renders provided template with provided state values
 * @param {Function} template Template to render
 * @param {Object} state State object whose values get passed into the rendering template
 * @returns {string} Rendered Handlebars template
 */
function render(template, state) {
  return template(state)
}

/**
 * Compiles passed source string into Handlebars render function
 * @param {string} source
 */
function compile(source) {
  return handlebars.compile(source)
}

/**
 * Runs the passed callback function with the updated template
 * @param {Function} callback Function that needs to be called with the rerendered template
 * @param {Function} template Template that needs to be rerendered
 * @param {Object} state New version of state that gets passed into Template
 * @returns {*} Callback function return value
 */
function update(callback, template, state) {
  return callback(template(state))
}
