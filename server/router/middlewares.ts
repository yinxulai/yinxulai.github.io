import KoaBody from 'koa-body'
import { Middleware, RouterParamContext } from '@koa/router'
import { getLogger, Logger } from '../logger'

///// NextJS 服务中间件 /////


///// 日志中间件 /////

export type WithLogger<T = RouterParamContext> = T & {
  logger: Logger
}

export function loggerMiddleware(module: string): Middleware {
  let startTime: number

  return async (ctx, next) => {
    startTime = Date.now()
    const noTypeCtx = ctx as any
    noTypeCtx.logger = getLogger(module)
    noTypeCtx.logger.info('请求开始:', ctx.method, ctx.url)

    return next().finally(() => {
      const time = Date.now() - startTime
      noTypeCtx.logger.info('请求结束:', ctx.method, ctx.status, `${time} ms`, ctx.url,)
    })
  }
}

///// 请求 body 解析中间件 /////

export type WithBody<B = {}, T = RouterParamContext> = T & {
  body: B
}

export function bodyMiddleware(): Middleware {
  return KoaBody({
    multipart: false, // 支持文件上传
    encoding: 'gzip'
  })
}

///// 鉴权中间件 /////

export type WithAuth<T = RouterParamContext> = T & {
  user: number
}

// TODO: 支持权限配置
export interface AuthOptions {
  Permissions: string[]
}

export function authMiddleware(): Middleware {
  return async (ctx, _next) => {
    const noTypeCtx = ctx as any
    const _cookies = ctx.cookies.get('auth')
    noTypeCtx.user = _cookies
  }
}
