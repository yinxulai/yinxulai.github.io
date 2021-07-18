import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

console.log(process.cwd())

import { isProd } from '../env'
import { config } from '../config'

export const getDatabase = (() => {
  let database: Database

  return async () => {
    if (database == null) {
      database = await open({
        driver: sqlite3.cached.Database,
        // 开发与测试情况使用内存作为数据存储介质
        filename: isProd ? config.sqlite.filePath : ':memory',
      })
    }

    return database
  }
})()
