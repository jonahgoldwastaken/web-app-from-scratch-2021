import { router } from './modules/router.js'
import accessToken from './routes/accessToken.js'
import generator from './routes/generator.js'
import index from './routes/index.js'
import routeDuration from './routes/routeDuration.js'
import { route } from './utils/route.js'

main()

async function main() {
  const render = await router([
    route('/', index),
    route('/access_token', accessToken),
    route('/route-duration', routeDuration),
    route('/generator', generator),
  ])
  render(document.querySelector('#app'))
}
