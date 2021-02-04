import { parseHashString } from './modules/query.js'
import {
  CLIENT_ID,
  LOGIN_URL,
  SCOPES,
  REDIRECT_URI,
} from './contants/spotify.js'

export { prepareLoginButton, getAuthToken }

function prepareLoginButton() {
  const button = document.querySelector('[data-login]')
  if (button) {
    button.addEventListener('click', loginButtonHandler)
  }
}

function loginButtonHandler() {
  window.location = `${LOGIN_URL}?response_type=token&client_id=${CLIENT_ID}&scopes=${SCOPES}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}`
}

function getAuthToken() {
  if (window.location.href.includes('access_token')) {
    const { access_token } = parseHashString()
    sessionStorage.setItem('spotify-token', `Bearer ${access_token}`)
    window.location.replace(window.location.origin)
  }
}
