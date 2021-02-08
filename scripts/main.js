import { router } from './modules/router.js'
import { route } from './utils/route.js'
import index from './routes/index.js'
import accessToken from './routes/accessToken.js'
import profile from './routes/profile.js'

main()

async function main() {
  const render = await router([
    route('/', index),
    route('/access_token', accessToken),
    route('/profile', profile),
  ])
  render(document.querySelector('#app'))
}
