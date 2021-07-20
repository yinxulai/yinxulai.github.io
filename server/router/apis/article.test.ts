import Koa from 'koa'
import request from 'supertest'
import { articleRouter } from './article'

describe('api/article test', () => {
  const app = new Koa()
  app.use(articleRouter.routes())

  test('create article', () => {
    return new Promise<void>((resolve, reject) => {
      request(app.callback()).post('/').expect(200).end(function (err, res) {
          if (err) return reject(err)
          expect(res.body).toBeNull()
          resolve()
        })
    })
  })
})
