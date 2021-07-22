import Router from '@koa/router'

import type { WithLogger } from '../middlewares'

export const qiniuRouter = new Router<any, WithLogger>()

qiniuRouter.get('/upload-token', () => {

})
