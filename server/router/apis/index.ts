import Router from '@koa/router'

import { userRouter } from './user'
import { articleRouter } from './article'
import { bodyMiddleware } from '../middle/body'
import { loggerMiddleware } from '../middle/logger'
import { use } from '../../utils/koa2'

export const apisRouter = new Router()
const withMiddleRouter = use(use(apisRouter, loggerMiddleware('接口')), bodyMiddleware())
withMiddleRouter.use('/article', articleRouter.routes())
withMiddleRouter.use('/user', userRouter.routes())
