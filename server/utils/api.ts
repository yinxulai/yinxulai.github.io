import { Context } from 'koa'

export function send<T extends Context>(ctx: T, data: any, code = 200, message = 'OK') {
  ctx.status = code
  ctx.body = { message, data }
}
