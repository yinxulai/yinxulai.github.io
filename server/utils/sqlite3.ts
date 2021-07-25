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
        driver: isProd ? sqlite3.cached.Database : sqlite3.verbose().cached.Database
      })

      // 添加性能监听
      database.on('profile', getLogger('DATABASE:PROFILE').info)
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
