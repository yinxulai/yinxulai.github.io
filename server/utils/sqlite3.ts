import sqlite3 from 'sqlite3'
import { open, Database, Statement } from 'sqlite'

import { getLogger } from '../logger'
import { config } from '../config'
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
      database.on('profile', (sql: string, time: number) => {
        getLogger('数据库:性能').info(`${time} ms`, sql)
      })
    }

    return database
  }
})()

export const pareStatement = (() => {
  const statementMap = new Map<string, Statement>()

  return async (sql: string): Promise<Statement> => {
    if (statementMap.size === 0 || statementMap.get(sql) == null) {
      const database = await getDatabase()
      statementMap.set(sql, await database.prepare(sql))
    }

    return statementMap.get(sql)!
  }
})()
