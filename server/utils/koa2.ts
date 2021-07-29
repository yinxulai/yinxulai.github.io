import Router from '@koa/router'

// 解决 router 没办法使用中间件动态扩展 State 以及 Context 类型的问题
export function use<S, C, IS, IC>(router: Router<S, C>, middleware: Router.Middleware<IS, IC>): Router<IS & S, IC & C>
export function use<S, C, IS, IC>(router: Router<S, C>, path: string | string[] | RegExp, middleware: Router.Middleware<IS, IC>): Router<IS & S, IC & C>
export function use(router: Router<any, any>, path: any, middleware?: Router.Middleware<any, any>): Router<any, any> {
  if (middleware != null) return router.use(path, middleware)
  const trueMiddleware = path
  return router.use(trueMiddleware)
}
