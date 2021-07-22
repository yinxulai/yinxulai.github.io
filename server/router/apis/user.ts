import Router from '@koa/router'
import { WithAuth, WithBody, WithLogger } from '../middlewares'

export const userRouter = new Router<WithAuth, WithLogger<WithBody>>()
