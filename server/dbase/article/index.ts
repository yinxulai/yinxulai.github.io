import { parseStatement, toStatementParams } from '../../utils/sqlite3'

interface Article {
  id: number
  title: string
  content: string
}

interface DataMeta {
  deletedTime: string
  createdTime: string
  updatedTime: string
}

const autoCreateArticleTable = (() => {
  let isExistTable = false
  let createPromise: Promise<any>

  return async (): Promise<void> => {
    if (isExistTable === true) {
      return
    }

    if (createPromise != null) {
      return await createPromise
    }

    const countTable = [
      "SELECT COUNT(*) as 'count' FROM 'sqlite_master'",
      "WHERE",
      "type='table'",
      "AND",
      "name='article';"
    ].join(" ")

    const existTable = await (await parseStatement(countTable)).all()
    if (existTable[0] != null && existTable[0].count > 0) {
      isExistTable = true
      return
    }

    const createSql = [
      "CREATE TABLE `article` (",
      "`title` VARCHAR NOT NULL,",
      "`content` TEXT NOT NULL,",
      "`deletedTime` DATETIME DEFAULT NULL,",
      "`createdTime` DATETIME DEFAULT CURRENT_TIMESTAMP,",
      "`updatedTime` DATETIME DEFAULT CURRENT_TIMESTAMP,",
      "`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT",
      ");",
    ].join(" ")

    const statement = await parseStatement(createSql)
    statement.run()
  }
})()

export async function resetArticleTable() {
  await autoCreateArticleTable()

  const sql = [
    "DELETE FROM `article`;",
    "UPDATE sqlite_sequence SET seq = 0 WHERE name = 'article';"
  ].join(" ")

  const statement = await parseStatement(sql)
  statement.run()
}

type CreateOptions = Omit<Article, 'id'>
export async function createArticle(options: CreateOptions) {
  await autoCreateArticleTable()
  const sql = "INSERT INTO `article` (`title`,`content`) VALUES (:title, :content);"
  const statement = await parseStatement(sql)
  statement.run(toStatementParams(options))
}

type DeleteOptions = Pick<Article, 'id'>
export async function deleteArticle(options: DeleteOptions): Promise<void> {
  await autoCreateArticleTable()
  const sql = "UPDATE `article` SET `deletedTime`=:deletedTime WHERE `id`=:id;"
  const statement = await parseStatement(sql)
  statement.run(toStatementParams({ ...options, deletedTime: Date.now() }))
}

interface QueryOptions {
  limit?: number
  offset?: number
  filter: Partial<Pick<Article, 'id'>> & {
    deleted?: boolean // 是否包含已删除的条目，默认 false
  }
}

export async function queryArticle(options: QueryOptions): Promise<Array<Article & DataMeta>> {
  await autoCreateArticleTable()
  const { filter: { id, deleted = false }, limit, offset } = options

  const sql = ["SELECT * FROM `article` WHERE"]

  const where = []
  if (deleted === false) where.push("`deletedTime` IS NULL")
  if (id != null) where.push("`id`=:id")
  sql.push(where.join(" AND "))

  if (limit != null) sql.push("LIMIT :limit")
  if (offset != null) sql.push("OFFSET :offset")
  sql.push(';')

  console.log(options, sql.join(' '))
  const statement = await parseStatement(sql.join(' '))
  return statement.all(toStatementParams({ id, limit, offset }))
}

type UpdateOptions = Article
export async function updateArticle(options: UpdateOptions) {
  await autoCreateArticleTable()

  const sql = ["UPDATE `article` SET"]

  const fields: string[] = []
  if (options.title != null) fields.push("`title`=:title")
  if (options.content != null) fields.push("`content`=:content")
  sql.push(fields.join(","))

  sql.push("WHERE `id` =:id;")

  const statement = await parseStatement(sql.join(' '))
  await statement.run(toStatementParams(options))
}
