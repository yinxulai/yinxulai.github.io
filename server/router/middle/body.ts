import KoaBody from 'koa-body'
import { Middleware } from 'koa'

///// 请求 body 解析中间件 /////

export type WithBody<B = {}> = {
  body: B
}

export function bodyMiddleware(): Middleware<{}, WithBody> {
  return KoaBody()
}
