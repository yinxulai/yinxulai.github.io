import Router from '@koa/router'
import { WithAuth } from '../middle/auth'
import { WithBody } from '../middle/body'
import { WithLogger } from '../middle/logger'

export const userRouter = new Router<WithAuth, WithLogger & WithBody>()
