import Koa from 'koa'
import request from 'supertest'
import { bodyMiddleware } from '../middle/body'
import { loggerMiddleware } from '../middle/logger'
import { articleRouter } from './article'

describe('api/article test', () => {
  const app = new Koa()
  app
    .use(bodyMiddleware())
    .use(loggerMiddleware('测试'))
    .use(articleRouter.allowedMethods())
    .use(articleRouter.routes())

  test('create article', async () => {
    const testDataTable = [
      [{}, { code: 400 }],
      [null, { code: 400 }],
      [undefined, { code: 400 }],
      [{ title: '', content: '' }, { code: 200 }],
      [{ title: null, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: null }, { code: 400 }],
      [{ title: '标题', content: '内容' }, { code: 200 }],
      [{ title: undefined, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: undefined }, { code: 400 }]
    ] as const

    for await (const [body, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback())
          .post('/')
          .send(body)
          .set('Content-type', 'application/json')
          .expect(response.code)
          .end((err, res) => err ? reject(err) : resolve())
      })
    }
  })

  test('delete article', async () => {
    const testDataTable = [
      ['/1', { code: 200 }],
      ['/0', { code: 200 }],
      ['/', { code: 400 }],
    ] as const

    for await (const [path, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback()).delete(path)
          .expect(response.code)
          .end((err, _res) => {
            if (err == null) return resolve()
            return reject(err)
          })
      })
    }
  })

  test('update article', async () => {
    const testDataTable = [
      [{}, { code: 400 }],
      [null, { code: 400 }],
      [undefined, { code: 400 }],
      [{ title: '', content: '' }, { code: 400 }],
      [{ title: null, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: null }, { code: 400 }],
      [{ title: '标题', content: '内容' }, { code: 200 }],
      [{ title: undefined, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: undefined }, { code: 400 }]
    ] as const

    for await (const [body, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback()).post('/').send(body)
          .expect(response.code)
          .end((err, _res) => {
            if (err == null) return resolve()
            return reject(err)
          })
      })
    }
  })

  test('get article', async () => {
    const testDataTable = [
      [{}, { code: 400 }],
      [null, { code: 400 }],
      [undefined, { code: 400 }],
      [{ title: '', content: '' }, { code: 400 }],
      [{ title: null, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: null }, { code: 400 }],
      [{ title: '标题', content: '内容' }, { code: 200 }],
      [{ title: undefined, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: undefined }, { code: 400 }]
    ] as const

    for await (const [body, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback()).post('/').send(body)
          .expect(response.code)
          .end((err, _res) => {
            if (err == null) return resolve()
            return reject(err)
          })
      })
    }
  })
})
