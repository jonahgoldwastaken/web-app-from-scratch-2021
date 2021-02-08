import { createSameOriginUrl } from '../utils/fetch.js'
import { fetchAndParseText } from '../modules/fetch.js'
import { component } from '../modules/component.js'
import {
  CLIENT_ID,
  LOGIN_URL,
  SCOPES,
  REDIRECT_URI,
} from '../contants/spotify.js'

export default index

async function index() {
  const source = await fetchAndParseText(
    createSameOriginUrl('/templates/index.hbs')
  )
  return component(source, { what: 'test' }, mounted)
}

function mounted() {
  const loginButton = document.querySelector('[data-login]')
  if (loginButton) {
    loginButton.addEventListener('click', loginButtonHandler)
  }
}

/**
 * Handles the login button click
 */
function loginButtonHandler() {
  window.location = `${LOGIN_URL}?response_type=token&client_id=${CLIENT_ID}&scopes=${SCOPES}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}`
}
