import next from 'next'
import Router, { Middleware } from '@koa/router'
import { isDev } from '../../utils/env'

function pagePrepare(): Middleware {
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
export const pagesRouter = new Router().use(pagePrepare())

pagesRouter.get('/', async (ctx) => {
  await nextServer.render(ctx.req, ctx.res, '/')
})

pagesRouter.get('/user', async (ctx) => {
  await nextServer.render(ctx.req, ctx.res, '/')
})

pagesRouter.get('(.*)', async (ctx) => {
  await handle(ctx.req, ctx.res)
})
