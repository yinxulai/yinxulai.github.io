console.log(process.cwd())


import Koa from 'koa'
import { config } from './config'
import { router } from './router'

const server = new Koa()
server.use(router.routes())
server.use(async (ctx, next) => {
  ctx.res.statusCode = 200
  await next()
})

server.listen(config.port, () => console.log(`> Ready on http://localhost:${config.port}`))
