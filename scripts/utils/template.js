import handlebars from 'https://cdn.skypack.dev/handlebars'

export { render, compile, update }

handlebars.registerHelper('timeFormatter', function (seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes} hours`
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
