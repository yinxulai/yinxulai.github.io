import Router, { Middleware } from '@koa/router'
import { Logger } from '../../logger'

import { articleRouter } from './article'
import { userRouter } from './user'

function loggerMiddleware(module: string): Middleware {
  const logger = new Logger(module)

  return async (ctx, next) => {
    logger.info('请求开始:', ctx.url, ctx.method)
    const nextPromise = next()

    nextPromise.then(
      () => logger.info('请求完成:', ctx.url, ctx.method),
      () => logger.info('请求异常:', ctx.url, ctx.method)
    )

    return nextPromise
  }
}

export const apisRouter = new Router()
apisRouter.use('/article', loggerMiddleware('article'), articleRouter.routes())
apisRouter.use('/user', loggerMiddleware('article'), userRouter.routes())
