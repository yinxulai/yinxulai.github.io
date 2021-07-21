import Router, { Middleware } from '@koa/router'
import { getLogger } from '../logger'
import { pagesRouter } from './pages'
import { apisRouter } from './apis'

function loggerMiddleware(module: string): Middleware {
  let startTime: number

  return async (ctx, next) => {
    startTime = Date.now()
    const logger = getLogger(module)
    logger.info('请求开始:', ctx.method, ctx.url)

    return next().finally(() => {
      const time = Date.now() - startTime
      logger.info('请求结束:', ctx.method, ctx.status, `${time} ms`, ctx.url,)
    })
  }
}

const router = new Router()
router.use('/api', loggerMiddleware('接口'), apisRouter.routes())
router.use('/', loggerMiddleware('页面'), pagesRouter.routes())
export { router }
