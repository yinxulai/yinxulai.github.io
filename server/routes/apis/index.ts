import Router from '@koa/router'
import { userRouter } from './user'
import { articleRouter } from './article'

export const apisRouter = new Router()
apisRouter.all('/article', articleRouter.routes())
apisRouter.all('/user', userRouter.routes())
