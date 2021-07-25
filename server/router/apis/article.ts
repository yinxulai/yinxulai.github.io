import Router from '@koa/router'
import { send } from '../../utils/api'
import * as database from '../../dbase/article'

import type { WithLogger } from '..'

export const articleRouter = new Router<any, WithLogger>()

articleRouter.post('/', async (ctx) => {
  if (ctx.body == null) {
    send(ctx, null, 400, '无效的参数!')
    return
  }

  const { title, content } = ctx.body

  if (title == null) {
    send(ctx, null, 400, '文章标题必填!')
    return
  }

  if (content == null) {
    send(ctx, null, 400, '文章内容不能为空!')
    return
  }

  try {
    await database.createArticle({ title, content })
  } catch (error) {
    ctx.logger.error(error)
    send(ctx, null, 500, '保存文章失败！')
    return
  }

  send(ctx, null, 200)
})

articleRouter.delete('/:id', async (ctx) => {
  const { id } = ctx.params

  if (isFinite(Number(id))) {
    send(ctx, null, 400, '无效的文章 ID!')
    return
  }

  try {
    await database.deleteArticle({ id: Number(id) })
  } catch (error) {
    ctx.logger.error(error)
    send(ctx, null, 500, '删除文章失败！')
    return
  }

  send(ctx, null, 200)
})

articleRouter.patch('/:id', async (ctx) => {
  const id = Number(ctx.params.id)

  if (isFinite(id)) {
    send(ctx, null, 400, '无效的文章 ID!')
    return
  }

  if (ctx.body == null) {
    send(ctx, null, 400, '无效的参数!')
    return
  }

  const title: string = ctx.body.title
  const content: string = ctx.body.content

  try {
    await database.updateArticle({ id, title, content })
  } catch (error) {
    ctx.logger.error(error)
    send(ctx, null, 500, '更新文章失败！')
    return
  }

  send(ctx, null, 200)
})

articleRouter.get('/', async (ctx) => {
  const { id, size, page } = ctx.query
  const [idNum, sizeNum, pageNum] = [id, size, page].map(Number)

  if (isFinite(sizeNum)) {
    send(ctx, null, 400, '无效的分页尺寸!')
    return
  }

  if (isFinite(pageNum)) {
    send(ctx, null, 400, '无效的翻页数!')
    return
  }

  let data

  try {
    data = await database.queryArticle({
      limit: sizeNum,
      filter: { id: idNum },
      offset: sizeNum * pageNum,
    })
  } catch (error) {
    send(ctx, null, 500, '获取文章列表失败！')
    ctx.logger.error(error)
    return
  }

  send(ctx, data, 200)
})
