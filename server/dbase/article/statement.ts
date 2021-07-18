import { Statement } from 'sqlite'
import { getDatabase } from '../utils'

export const getStatementMap = (() => {

  type StatementName =
    | 'CreateTable'
    | 'TruncateTable'
    | 'CreateArticle'
    | 'UpdateArticleById'
    | 'DeleteArticleById'
    | 'QueryArticleById'
    | 'QueryArticleList'


  const statementMap = new Map<
    StatementName, Statement
  >()

  const statementStringMap = new Map<
    StatementName, string
  >()

  statementStringMap.set('CreateTable', [
    "CREATE TABLE IF NOT EXISTS `article` (",
    "`id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',",
    "`content` varchar(128) NOT NULL COMMENT '文章内容',",
    "`deletedTime` datetime DEFAULT NULL COMMENT '删除时间',",
    "`createdTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',",
    "`updatedTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',",
    "PRIMARY KEY (`id`)",
    ") ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;",
  ].join(' '))

  statementStringMap.set("TruncateTable", [
    "truncate table `article`;"
  ].join(' '))

  statementStringMap.set("TruncateTable", [
    "truncate table `article`;"
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

  return async function prepareStatement(): Promise<Map<StatementName, Statement>> {
    if (statementMap.size === 0) {
      const database = await getDatabase()
      Array.from(statementStringMap.entries()).forEach(async ([name, statementString]) => {
        statementMap.set(name, await database.prepare(statementString))
      })
    }

    return statementMap
  }
})()
