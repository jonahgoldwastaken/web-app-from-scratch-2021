import handlebars from 'https://cdn.skypack.dev/handlebars'

export { render, compile, update }

function render(template, state) {
  return template(state)
}

function compile(source) {
  return handlebars.compile(source)
}

function update(callback, template, state) {
  return callback(template(state))
}
