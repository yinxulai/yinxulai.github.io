import Router from '@koa/router'

import { userRouter } from './user'
import { articleRouter } from './article'
import { WithBody, WithLogger } from '../middlewares'

export const apisRouter = new Router<any, WithLogger<WithBody>>()
apisRouter.use('/article', articleRouter.routes())
apisRouter.use('/user', userRouter.routes())
