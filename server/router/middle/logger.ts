import { Middleware } from 'koa'
import { getLogger, Logger } from '../../logger'

///// 日志中间件 /////

export type WithLogger = {
  logger: Logger
}

export function loggerMiddleware(module: string): Middleware<{}, WithLogger> {
  let startTime: number

  return async (ctx, next) => {
    startTime = Date.now()
    const noTypeCtx = ctx as any

    if (noTypeCtx.logger != null) {
      noTypeCtx.logger.name += `:${module}`
    } else {
      noTypeCtx.logger = getLogger(module)
    }


    noTypeCtx.logger.info('请求开始:', ctx.method, ctx.url, ctx.request.body)

    return next().finally(() => {
      const time = Date.now() - startTime
      noTypeCtx.logger.info('请求结束:', ctx.method, ctx.status, `${time} ms`, ctx.url, ctx.response.body)
    })
  }
}
