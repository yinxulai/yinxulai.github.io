import Koa from 'koa'
import request from 'supertest'
import * as dbase from '../../dbase/article'
import { bodyMiddleware } from '../middle/body'
import { loggerMiddleware } from '../middle/logger'
import { articleRouter } from './article'

describe('api/article test', () => {
  const app = new Koa()
    .use(bodyMiddleware())
    .use(loggerMiddleware('测试'))
    .use(articleRouter.allowedMethods())
    .use(articleRouter.routes())

  beforeEach(async () => {
    await dbase.resetArticleTable()
  })

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
          .end((err, _res) => {
            if (err == null) return resolve()
            reject({ body, response, err })
          })
      })
    }
  })

  test('delete article', async () => {
    const testDataTable = [
      ['/1', { code: 200 }],
      ['/0', { code: 200 }],
      ['/null', { code: 400 }],
      ['/undefined', { code: 400 }]
    ] as const

    for await (const [path, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback()).delete(path)
          .end((err, _res) => {
            expect(_res.status).toBe(response.code)
            if (err == null) return resolve()
            reject({ path, response, err })
          })
      })
    }
  })

  test('update article', async () => {
    const testDataTable = [
      [{}, { code: 400 }],
      [null, { code: 400 }],
      [undefined, { code: 400 }],
      [{ title: '', content: '' }, { code: 200 }],
      [{ title: null, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: null }, { code: 200 }],
      [{ title: '标题', content: '内容' }, { code: 200 }],
      [{ title: undefined, content: '内容' }, { code: 400 }],
      [{ title: '标题', content: undefined }, { code: 200 }]
    ] as const

    for await (const [body, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback()).patch('/1').send(body)
          .end((err, _res) => {
            expect(_res.status).toBe(response.code)
            if (err == null) return resolve()
            reject({ body, response, err })
          })
      })
    }
  })

  test('get article', async () => {
    const testDataTable = [
      ['/?id=1', { code: 200 }],
      ['/?id=0', { code: 400 }],
      ['/?id=null', { code: 400 }],
      ['/?id=undefined', { code: 400 }],

      ['/?size=1&page=1', { code: 200 }],
      ['/?size=1&page=0', { code: 400 }],
      ['/?size=1&page=null', { code: 400 }],
      ['/?size=1&page=undefined', { code: 400 }],

      ['/?page=1&size=1', { code: 200 }],
      ['/?page=1&size=0', { code: 400 }],
      ['/?page=1&size=null', { code: 400 }],
      ['/?page=1&size=undefined', { code: 400 }],
    ] as const

    for await (const [path, response] of testDataTable) {
      await new Promise<void>((resolve, reject) => {
        request(app.callback()).get(path)
          .end((err, _res) => {
            expect(_res.status).toBe(response.code)
            if (err == null) return resolve()
            reject({ path, response, err })
          })
      })
    }
  })


  test('cross', async () => {
    const createDate = { title: '标题', content: '内容' }
    await new Promise<void>((resolve, reject) => {
      request(app.callback()).post('/')
        .send(createDate)
        .end((err, _res) => {
          expect(_res.status).toBe(200)
          if (err == null) return resolve()
          reject({ err, _res })
        })
    })

    await new Promise<void>((resolve, reject) => {
      request(app.callback()).get('/?id=1')
        .end((err, _res) => {
          expect(_res.status).toBe(200)
          expect(_res.body.data[0]).toMatchObject(createDate)
          if (err == null) return resolve()
          reject(err)
        })
    })

    const updateDate = { title: 'New 标题', content: 'New 内容' }
    await new Promise<void>((resolve, reject) => {
      request(app.callback()).patch('/1').send(updateDate)
        .end((err, _res) => {
          expect(_res.status).toBe(200)
          if (err == null) return resolve()
          reject(err)
        })
    })

    await new Promise<void>((resolve, reject) => {
      request(app.callback()).get('/?id=1')
        .end((err, _res) => {
          expect(_res.status).toBe(200)
          expect(_res.body.data[0]).toMatchObject(updateDate)
          if (err == null) return resolve()
          reject(err)
        })
    })

    await new Promise<void>((resolve, reject) => {
      request(app.callback()).delete('/1')
        .end((err, _res) => {
          expect(_res.status).toBe(200)
          if (err == null) return resolve()
          reject(err)
        })
    })

    await new Promise<void>((resolve, reject) => {
      request(app.callback()).get('/?id=1')
        .end((err, _res) => {
          expect(_res.status).toBe(200)
          expect(_res.body.data.length).toBe(0)
          if (err == null) return resolve()
          reject(err)
        })
    })
  })
})
