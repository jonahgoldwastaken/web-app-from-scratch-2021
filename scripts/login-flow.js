import { parseHashString } from './modules/query.js'
import {
  CLIENT_ID,
  LOGIN_URL,
  SCOPES,
  REDIRECT_URI,
} from './contants/spotify.js'

export { prepareLoginButton, getAuthToken }

/**
 * Adds click event listener to login button
 */
function prepareLoginButton() {
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

/**
 * Grabs the auth token from window.location.hash and stores it to Session Storage
 */
function getAuthToken() {
  if (window.location.href.includes('access_token')) {
    const { access_token } = parseHashString()
    sessionStorage.setItem('spotify-token', `Bearer ${access_token}`)
    window.location.replace(window.location.origin)
  }
}
