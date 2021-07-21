import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

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
      database.on('profile', getLogger('DATABASE:PROFILE').info)
    }

    return database
  }
})()
