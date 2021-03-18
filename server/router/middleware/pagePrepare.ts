import { Middleware } from '@koa/router'
import { NextServer } from 'next/dist/server/next'

export function pagePrepare(app: NextServer): Middleware {
  let isPrepared = false
  return async (_, next) => {
    if (isPrepared) {
      await next()
      return
    }

    await app.prepare()
    isPrepared = true
    await next()
  }
}
