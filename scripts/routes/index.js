import {
  CLIENT_ID,
  LOGIN_URL,
  REDIRECT_URI,
  SCOPES,
} from '../constants/spotify.js'
import { component, fetchTemplate } from '../modules/component.js'

export default index

/**
 * Index route
 */
async function index() {
  const source = await fetchTemplate('index')
  return component(source, null, { mounted })
}

function mounted() {
  const loginButton = document.querySelector('[data-login]')
  if (loginButton) loginButton.addEventListener('click', loginButtonHandler)
}

/**
 * Handles the login button click
 */
function loginButtonHandler() {
  window.location = `${LOGIN_URL}?response_type=token&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}`
}
