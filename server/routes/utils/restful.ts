import { Context } from 'koa'

export function send<T = any>(ctx: Context, data: T, code = 200, message = 'OK') {
  ctx.status = 200
  ctx.body = JSON.stringify({ code, message, data })
}
