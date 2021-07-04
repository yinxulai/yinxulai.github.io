import Koa from 'koa'
import { config } from '@server/config'
import { router } from '@server/routes/index'

const server = new Koa()
server.use(router.routes())
server.listen(config.port, () => console.log(`> Ready on http://localhost:${config.port}`))
