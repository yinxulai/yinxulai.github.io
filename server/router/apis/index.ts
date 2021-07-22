import Router from '@koa/router'

import { WithBody, WithLogger } from '../middlewares'
import { articleRouter } from './article'
import { userRouter } from './user'

export const apisRouter = new Router<any, WithLogger<WithBody>>()
apisRouter.use('/article', articleRouter.routes())
apisRouter.use('/user', userRouter.routes())
