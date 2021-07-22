import Router from '@koa/router'

import type { WithAuth, WithBody, WithLogger } from '../middlewares'

export const qiniuRouter = new Router<WithAuth, WithLogger<WithBody>>()

qiniuRouter.get('/upload-token', () => {

})
