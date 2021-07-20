import Router from '@koa/router'
import { send } from '../../utils/restful'
import * as database from '../../dbase/article'

export const articleRouter = new Router()

articleRouter.get('/list/:offset/:limit', async (ctx) => {
  const { offset, limit } = ctx.params
  const result = await database
    .queryArticleList(
      Number(offset),
      Number(limit)
    )

  send(ctx, result)
})

articleRouter.delete('/:id', async (ctx) => {
  const { id } = ctx.params
  await database.deleteArticle(Number(id))
  send(ctx, null, 200)
})

articleRouter.patch('/:id', async (ctx) => {
  const { id } = ctx.params
  await database.updateArticle(Number(id), ctx.body)
  send(ctx, null, 200)
})

articleRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params
  const data = await database.queryArticleById(Number(id))
  send(ctx, data, 200)
})

articleRouter.post('/', async (ctx) => {
  await database.createArticle(ctx.body)
  send(ctx, null, 200)
})
