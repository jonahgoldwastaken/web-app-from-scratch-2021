import { createSameOriginUrl } from './utils/fetch.js'
import { fetchAndParseText, fetchAndParseData } from './modules/fetch.js'
import { parseQueryString } from './modules/query.js'

export { prepareLoginButton, getAuthToken }

function prepareLoginButton() {
  const button = document.querySelector('[data-login]')
  if (button) {
    button.addEventListener('click', getLoginUrl)
  }
}

function getLoginUrl() {
  fetchAndParseText(createSameOriginUrl('/.netlify/functions/login')).then(
    url => {
      window.location = url
    }
  )
}

function getAuthToken() {
  if (window.location.pathname.includes('/callback')) {
    const { code } = parseQueryString()
    fetchAndParseData(
      createSameOriginUrl(`/.netlify/functions/callback?code=${code}`)
    ).then(data => {
      sessionStorage.setItem(
        'spotify-token',
        `${data.token_type} ${data.access_token}`
      )
      window.location.replace('http://localhost:8888')
    })
  }
}
