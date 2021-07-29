import Koa from 'koa'
import { config } from './config'
import { router } from './router'
import { getLogger } from './logger'

const server = new Koa()
const logger = getLogger('应用')
server.use(router.routes()).use(router.allowedMethods())
server.listen(config.port, () => logger.info(`开始监听 http://localhost:${config.port}`))
