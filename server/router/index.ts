import Router, { Middleware } from '@koa/router'
import { getLogger } from '../logger'
import { pagesRouter } from './pages'
import { apisRouter } from './apis'

function loggerMiddleware(module: string): Middleware {
  let startTime: number


  return async (ctx, next) => {
    startTime = Date.now()
    const logger = getLogger(module)
    logger.info('请求开始:', ctx.url, ctx.method)

    return next().finally(() => {
      const time = Date.now() - startTime
      logger.info('请求结束:', ctx.url, ctx.method, `${time} ms`)
    })
  }
}

const router = new Router()
router.use('/api', loggerMiddleware('API'), apisRouter.routes())
router.use('/', loggerMiddleware('PAGE'), pagesRouter.routes())
export { router }
