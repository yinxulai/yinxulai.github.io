import Router from '@koa/router'
import { pagesRouter } from './pages'

const router = new Router()
router.get('/', pagesRouter.routes())

export { router }
