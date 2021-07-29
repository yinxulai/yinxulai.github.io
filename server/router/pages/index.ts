import next from 'next'
import Router, { Middleware } from '@koa/router'

import { isDev } from '../../utils/env'
import { use } from '../../utils/koa2'

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

export const pagesRouter = new Router()
const nextServer = next({ dev: isDev })
const handle = nextServer.getRequestHandler()
const withMiddleRouter = use(pagesRouter, pagePrepare())

withMiddleRouter.get('/', async (ctx) => {
  await nextServer.render(ctx.req, ctx.res, '/')
})

withMiddleRouter.get('/user', async (ctx) => {
  await nextServer.render(ctx.req, ctx.res, '/')
})

pagesRouter.get('(.*)', async (ctx) => {
  await handle(ctx.req, ctx.res)
})
