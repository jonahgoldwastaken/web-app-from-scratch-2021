import { getAuthToken } from './get-auth-token.js'
import { fetchCurrentUser } from './fetch-current-user.js'
import { renderUser } from './render-data.js'

if (window.location.pathname.includes('/callback')) {
  getAuthToken()
}

if (!sessionStorage.getItem('spotify-token')?.includes('undefined')) {
  fetchCurrentUser().then(renderUser)
}
