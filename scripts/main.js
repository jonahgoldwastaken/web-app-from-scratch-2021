import { prepareLoginButton, getAuthToken } from './login-flow.js'
import { fetchCurrentUser } from './fetch-current-user.js'
import { renderUser } from './render-data.js'

window.addEventListener('load', () => {
  prepareLoginButton()
  getAuthToken()

  if (sessionStorage.getItem('spotify-token')?.includes('Bearer')) {
    fetchCurrentUser().then(renderUser)
  }
})
