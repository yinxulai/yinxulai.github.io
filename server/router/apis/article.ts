import Router from '@koa/router'
import { send } from '../../utils/api'
import * as database from '../../dbase/article'

import type { WithAuth, WithBody, WithLogger } from '../middlewares'

export const articleRouter = new Router<WithAuth, WithLogger<WithBody>>()

articleRouter.get('/list/:size/:page', async (ctx) => {
  const { size, page } = ctx.params
  const [sizeNum, pageNum] = [size, page].map(Number)

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
    data = await database.queryArticleList()
  } catch (error) {
    send(ctx, null, 500, '获取文章列表失败！')
    ctx.logger.error(error)
    return
  }

  send(ctx, data, 200)
})

articleRouter.delete('/:id', async (ctx) => {
  const { id } = ctx.params

  if (isFinite(Number(id))) {
    send(ctx, null, 400, '无效的文章 ID!')
    return
  }

  try {
    await database.deleteArticle(Number(id))
  } catch (error) {
    ctx.logger.error(error)
    send(ctx, null, 500, '删除文章失败！')
    return
  }

  send(ctx, null, 200)
})

interface UpdateArticleBody {
  title: string,
  content: string
}

articleRouter.patch('/:id', async (ctx) => {
  const { id } = ctx.params
  const body = ctx.body as UpdateArticleBody

  if (isFinite(Number(id))) {
    send(ctx, null, 400, '无效的文章 ID!')
    return
  }

  if (body == null) {
    send(ctx, null, 400, '无效的参数!')
    return
  }

  if (body.title == null) {
    send(ctx, null, 400, '文章标题必填!')
    return
  }

  if (body.content == null) {
    send(ctx, null, 400, '文章内容不能为空!')
    return
  }

  try {
    await database.updateArticle(
      Number(id),
      body.title,
      body.content
    )
  } catch (error) {
    ctx.logger.error(error)
    send(ctx, null, 500, '更新文章失败！')
    return
  }

  send(ctx, null, 200)
})


articleRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params

  if (isFinite(Number(id))) {
    send(ctx, null, 400, '无效的文章 ID!')
    return
  }

  let data

  try {
    data = await database.queryArticleById(Number(id))
  } catch (error) {
    send(ctx, null, 500, '获取文章失败！')
    ctx.logger.error(error)
    return
  }

  send(ctx, data, 200)
})

interface CreateArticleBody {
  title: string,
  content: string
}

articleRouter.post('/', async (ctx) => {
  const body = ctx.body as CreateArticleBody
  if (body == null) {
    send(ctx, null, 400, '无效的参数!')
    return
  }

  if (body.title == null) {
    send(ctx, null, 400, '文章标题不能为空!')
    return
  }

  if (body.content == null) {
    send(ctx, null, 400, '文章内容不能为空!')
    return
  }

  try {
    await database.createArticle(body.title, body.content)
  } catch (error) {
    ctx.logger.error(error)
    send(ctx, null, 500, '保存文章失败！')
    return
  }

  send(ctx, null, 200)
})
