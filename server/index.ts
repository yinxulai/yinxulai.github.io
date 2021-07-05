import Koa from 'koa'
import { config } from './config'
import { router } from './routes'

const server = new Koa()
server.use(router.routes())
server.listen(config.port, () => console.log(`> Ready on http://localhost:${config.port}`))
