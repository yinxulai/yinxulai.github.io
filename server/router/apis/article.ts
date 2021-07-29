import Router from '@koa/router'
import { send } from '../../utils/api'
import * as database from '../../dbase/article'

import { WithBody } from '../middle/body'
import { WithLogger } from '../middle/logger'

export const articleRouter = new Router<{}, WithLogger & WithBody>()

articleRouter.post('/', async (ctx) => {
  if (ctx.request.body == null) {
    send(ctx, null, 400, '无效的参数!')
    return
  }

  const { title, content } = ctx.request.body

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

  if (!isFinite(Number(id))) {
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

  if (!isFinite(id)) {
    send(ctx, null, 400, '无效的文章 ID!')
    return
  }

  if (ctx.request.body == null) {
    send(ctx, null, 400, '无效的参数!')
    return
  }

  const title: string = ctx.request.body.title
  const content: string = ctx.request.body.content

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
  const mode = (idNum <= 0 || !isFinite(idNum)) ? 'multiple' as const : 'single' as const

  // 如果没有指定 id 则必须存在 page、size
  if (mode === 'multiple') {
    if (!isFinite(pageNum)) {
      send(ctx, null, 400, '无效的翻页数!')
      return
    }

    if (!isFinite(sizeNum) || sizeNum <= 0) {
      send(ctx, null, 400, '无效的分页尺寸!')
      return
    }
  }

  // 单条查询
  if (mode === 'single') {
    if (!isFinite(idNum) || idNum <= 0) {
      send(ctx, null, 400, '无效的文章 ID!')
      return
    }
  }

  let data
  const queryData = mode === 'multiple' ? {
    filter: {},
    limit: sizeNum,
    offset: sizeNum * pageNum,
  } : {
    filter: { id: idNum },
  }

  try {
    data = await database.queryArticle(queryData)
  } catch (error) {
    send(ctx, null, 500, '获取文章列表失败！')
    ctx.logger.error(error)
    return
  }

  send(ctx, data, 200)
})
