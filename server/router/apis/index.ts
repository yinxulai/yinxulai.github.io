import KoaBody from 'koa-body'
import Router, { Middleware } from '@koa/router'

import { userRouter } from './user'
import { articleRouter } from './article'

function bodyMiddleware(): Middleware {
  return KoaBody({
    multipart: false, // 支持文件上传
    encoding: 'gzip'
  })
}

export const apisRouter = new Router().use(bodyMiddleware())
apisRouter.use('/article', articleRouter.routes())
apisRouter.use('/user', userRouter.routes())
