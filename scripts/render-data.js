export { renderUser }

/**
 * Renders a Spotify user object to the dom
 * @param {Object} data Spotify user object
 */
function renderUser(data) {
  const container = document.querySelector('[data-profile]')
  const nameElement = container.querySelector('[data-name]')
  const imageElement = container.querySelector('[data-image]')
  const countryElement = container.querySelector('[data-country]')
  const followersElement = container.querySelector('[data-followers]')
  const externalsElement = container.querySelector('[data-externals]')
  const loginButton = document.querySelector('[data-login]')

  nameElement.textContent = data.display_name
  imageElement.src = data.images[0].url
  imageElement.alt = `Profile picture of ${data.display_name}`
  countryElement.textContent += data.country
  followersElement.textContent += data.followers.total
  externalsElement.innerHTML = Object.entries(data.external_urls).map(
    url => `<li><a href=${url[1]}>${url[0]}</a></li>`
  )
  container.classList.remove('hidden')
  loginButton.classList.add('hidden')
}
