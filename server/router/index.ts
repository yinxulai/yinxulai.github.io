import Router from '@koa/router'

import { pagesRouter } from './pages'
import { apisRouter } from './apis'

export const router = new Router()
router.use('/api', apisRouter.allowedMethods(), apisRouter.routes())
router.use('/', pagesRouter.allowedMethods(), pagesRouter.routes())
