import Router from '@koa/router'
import compose from 'koa-compose'

import { bodyMiddleware, loggerMiddleware, WithBody, WithLogger } from './middlewares'
import { pagesRouter } from './pages'
import { apisRouter } from './apis'

export const router = new Router()
router.all<{}, WithLogger<WithBody>>('/api', compose([loggerMiddleware('接口'), bodyMiddleware()]), apisRouter.routes())
router.all<any, WithLogger>('/', compose([loggerMiddleware('页面')]), pagesRouter.routes())
