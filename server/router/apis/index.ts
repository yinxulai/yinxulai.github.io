import Router from '@koa/router'

import { userRouter } from './user'
import { articleRouter } from './article'
import type { WithLogger } from '..'


export const apisRouter = new Router<any, WithLogger>()
apisRouter.use('/article', articleRouter.routes())
apisRouter.use('/user', userRouter.routes())
