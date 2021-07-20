import Router from '@koa/router'
import { apisRouter } from './apis'
import { pagesRouter } from './pages'

const router = new Router()

router.use('/api', apisRouter.routes())
router.use('/', pagesRouter.routes())
export { router }
