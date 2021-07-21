import { pareStatement } from '../../utils/sqlite3'

export const getStatement = (() => {
  const statementStringMap = new Map<
    StatementName, string
  >()

  type StatementName =
    | 'ExistTable'
    | 'ResetTable'
    | 'CreateTable'
    | 'CreateArticle'
    | 'UpdateArticleById'
    | 'DeleteArticleById'
    | 'QueryArticleById'
    | 'QueryArticleList'


  statementStringMap.set('CreateTable', [
    "CREATE TABLE `article` (",
    "`title` VARCHAR NOT NULL,",
    "`content` TEXT NOT NULL,",
    "`deletedTime` DATETIME DEFAULT NULL,",
    "`createdTime` DATETIME DEFAULT CURRENT_TIMESTAMP,",
    "`updatedTime` DATETIME DEFAULT CURRENT_TIMESTAMP,",
    "`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT",
    ")",
  ].join(' '))

  // 检查表是否存在
  statementStringMap.set("ExistTable", [
    "SELECT COUNT(*) as 'count' FROM 'sqlite_master'",
    "WHERE",
    "type='table'",
    "AND",
    "name='article';"
  ].join(' '))

  // 重置表（主要用于测试）
  statementStringMap.set("ResetTable", [
    "DELETE FROM `article`;",
    "UPDATE sqlite_sequence SET seq = 0 WHERE name = 'article';"
  ].join(' '))

  statementStringMap.set("CreateArticle", [
    "INSERT INTO `article`",
    "(`content`)",
    "VALUES",
    "(:content);",
  ].join(' '))

  statementStringMap.set("UpdateArticleById", [
    "UPDATE `article`",
    "SET",
    "`title`=:title,",
    "`content`=:content",
    "WHERE",
    "`id`=:id;",
  ].join(' '))

  statementStringMap.set("DeleteArticleById", [
    "UPDATE `article`",
    "SET",
    "`deletedTime`= NOW()",
    "WHERE",
    "`id`=:id;",
  ].join(' '))

  statementStringMap.set("QueryArticleById", [
    "SELECT * FROM `article`",
    "WHERE",
    "`id`=:id AND `deletedTime` IS NULL;",
  ].join(' '))

  statementStringMap.set("QueryArticleList", [
    "SELECT * FROM `article`",
    "WHERE",
    "`deletedTime` IS NULL",
    "LIMIT :limit OFFSET :offset"
  ].join(' '))

  return async (name: StatementName) => {
    return pareStatement(statementStringMap.get(name)!)
  }
})()
