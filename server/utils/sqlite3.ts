import sqlite3 from 'sqlite3'
import { open, Database, Statement } from 'sqlite'

import { getLogger } from '../logger'
import { config } from '../config'

import { ObjectKeys } from './object'
import { isProd } from './env'

export const getDatabase = (() => {
  let database: Database

  return async () => {
    if (database == null) {
      database = await open({
        // 开发与测试情况使用内存作为数据存储介质
        filename: isProd ? config.sqlite.filePath : ':memory:',
        driver: isProd ? sqlite3.cached.Database : sqlite3.verbose().Database
      })

      const instance = database.getDatabaseInstance()

      instance.on('open', () => {
        getLogger('数据库:打开').info(null)
      })
      instance.on('close', () => {
        getLogger('数据库:关闭').info(null)
      })
      instance.on('trace', (sql: string) => {
        getLogger('数据库:追踪').info(sql)
      })
      instance.on('error', (error: Error) => {
        getLogger('数据库:错误').info(error.message)
      })
      // 添加性能监听
      instance.on('profile', (sql: string, time: number) => {
        getLogger('数据库:性能').info(`${time} ms`, sql)
      })
    }

    return database
  }
})()

export const parseStatement = (() => {
  const statementMap = new Map<string, Statement>()

  return async (sql: string): Promise<Statement> => {
    if (statementMap.size === 0 || statementMap.get(sql) == null) {
      const database = await getDatabase()
      statementMap.set(sql, await database.prepare(sql))
    }

    return statementMap.get(sql)!
  }
})()

export function toStatementParams<T extends object>(target: T): object {
  return ObjectKeys(target).reduce((acc, key) => {
    acc[`:${key}`] = target[key]
    return acc
  }, {} as any)
}
