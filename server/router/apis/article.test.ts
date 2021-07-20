import Koa from 'koa'
import http from 'http'
import request from 'supertest'
import { userRouter } from './user'

describe('api/article test', () => {
  const app = new Koa()
  app.use(userRouter.routes())

  test('api/article', () => {
    return new Promise<void>((resolve, reject) => {
      request(http.createServer(app.callback()))
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return reject(err)
          expect(res.body).toBeNull()
          resolve()
        })
    })
  })
})
