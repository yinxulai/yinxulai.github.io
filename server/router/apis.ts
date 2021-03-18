import Router from '@koa/router'

export const apis = new Router<any, {}>()

// 用户信息
apis.get('/user', async (ctx) => {
  ctx.body = 'user'
})
