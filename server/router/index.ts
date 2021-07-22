import Router from '@koa/router'
import { bodyMiddleware, loggerMiddleware, WithBody, WithLogger } from './middlewares'
import { pagesRouter } from './pages'
import { apisRouter } from './apis'


const router = new Router()
router.use('/api', loggerMiddleware('接口'), bodyMiddleware(), apisRouter.routes())
router.use('/', loggerMiddleware('页面'), pagesRouter.routes())
export { router }
