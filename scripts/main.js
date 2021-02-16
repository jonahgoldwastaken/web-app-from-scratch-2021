import { authenticationCheck } from './helpers/spotify.js'
import { router } from './modules/router.js'
import accessToken from './routes/accessToken.js'
import favouritesList from './routes/favouritesList.js'
import generator from './routes/generator.js'
import result from './routes/result.js'
import index from './routes/index.js'
import tripDuration from './routes/tripDuration.js'
import { route } from './utils/route.js'

main()

async function main() {
  const render = router([
    route('/', index),
    route('/access_token', accessToken),
    route('/trip-duration', tripDuration, authenticationCheck),
    route('/list-favourites', favouritesList, authenticationCheck),
    route('/generate', generator, authenticationCheck),
    route('/result', result, authenticationCheck),
  ])
  render(document.querySelector('#app'))
}
