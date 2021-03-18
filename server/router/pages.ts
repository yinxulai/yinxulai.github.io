import next from 'next'
import Router from '@koa/router'
import { isDev } from 'utils/env'
import { pagePrepare } from './middleware/pagePrepare'

export const apis = new Router()
const app = next({ dev: isDev() })
const handle = app.getRequestHandler()
export const pages = new Router()

pages.use(pagePrepare(app))


// 这个路由不需要验证
pages.get('/auth', async (ctx) => {
  if (ctx.query.code != null) {
    ctx.cookies.set('authentication',
      Array.isArray(ctx.query.code)
        ? ctx.query.code[0]
        : ctx.query.code
    )

    ctx.redirect('/')
    return
  }

  await app.render(ctx.req, ctx.res, '/auth', ctx.query)
  ctx.respond = false
})

pages.get('/', async (ctx) => {
  await app.render(ctx.req, ctx.res, '/', ctx.query)
  ctx.respond = false
})

// 静态文件 不需要验证
pages.all('(.*)', async (ctx) => {
  await handle(ctx.req, ctx.res)
  ctx.respond = false
})
