import handlebars from 'https://cdn.skypack.dev/handlebars'

export { render, compile, update }

handlebars.registerHelper('timeFormatter', function (seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}:${minutes} ${hours === 1 ? 'hour' : 'hours'}`
})

function render(template, state) {
  return template(state)
}

function compile(source) {
  return handlebars.compile(source)
}

function update(callback, template, state) {
  return callback(template(state))
}
