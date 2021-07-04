import next from 'next'
import Router, { Middleware } from '@koa/router'

import { isDev } from '../../../utils/env'

export function pagePrepare(): Middleware {
  let isPrepared = false
  let preparePromise: Promise<void>

  return async (_, next) => {
    if (isPrepared) {
      await next()
      return
    }

    if (preparePromise == null) preparePromise = nextServer.prepare()
    await preparePromise
    isPrepared = true
    await next()
  }
}

const nextServer = next({ dev: isDev })
const handle = nextServer.getRequestHandler()
const pagesRouter = new Router().use(pagePrepare())

pagesRouter.all('/', async (ctx) => {
  console.log('render')
  await nextServer.render(ctx.req, ctx.res, '/')
})

pagesRouter.all('(.*)', async (ctx) => {
  await handle(ctx.req, ctx.res)
  ctx.respond = false
})

export { pagesRouter }
