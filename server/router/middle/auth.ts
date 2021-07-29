import { Middleware } from 'koa'


///// 鉴权中间件 /////

export type WithAuth = {
  user: number
}

// TODO: 支持权限配置
export interface AuthOptions {
  Permissions: string[]
}

export function authMiddleware(): Middleware<{}, WithAuth> {
  return async (ctx, _next) => {
    const noTypeCtx = ctx as any
    const _cookies = ctx.cookies.get('auth')
    noTypeCtx.user = _cookies
  }
}
