import Koa from 'koa'
import Router from '@koa/router'
import { config } from 'config'
import { apis } from './router/apis'
import { pages } from './router/pages'

const server = new Koa()
const router = new Router()
const port = config.port || 3000

router.use('/api', apis.routes())
router.use(pages.routes())

server.use(router.routes())
server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`)
})
