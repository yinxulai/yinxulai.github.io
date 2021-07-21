import KoaBody from 'koa-body'
import Router, { Middleware } from '@koa/router'

import { getLogger, Logger } from '../logger'
import { pagesRouter } from './pages'
import { apisRouter } from './apis'

export type WithLogger<T = {}> = T & {
  logger: Logger
}

function loggerMiddleware(module: string) {
  let startTime: number

  const ware: Middleware<any, WithLogger> = async (ctx, next) => {
    startTime = Date.now()
    ctx.logger = getLogger(module)
    ctx.logger.info('请求开始:', ctx.method, ctx.url)

    return next().finally(() => {
      const time = Date.now() - startTime
      ctx.logger.info('请求结束:', ctx.method, ctx.status, `${time} ms`, ctx.url,)
    })
  }

  return ware
}

export type WithBody<T = {}, B = {}> = T & {
  body: B
}

function bodyMiddleware() {
  return KoaBody({
    multipart: false, // 支持文件上传
    encoding: 'gzip'
  })
}

const router = new Router<any, WithLogger>()
router.use('/api', loggerMiddleware('接口'), bodyMiddleware(), apisRouter.routes())
router.use('/', loggerMiddleware('页面'), pagesRouter.routes())
export { router }
