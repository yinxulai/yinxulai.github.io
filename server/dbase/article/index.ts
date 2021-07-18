import { getStatementMap } from './statement'

export async function createArticle(content: string) {
  const statementMap = await getStatementMap()
  const statement = statementMap.get('CreateArticle')!
  await statement.run({ ":content": content })
}

export async function deleteArticle(id: number): Promise<void> {
  const statementMap = await getStatementMap()
  const statement = statementMap.get('DeleteArticleById')!
  await statement.run({ ":id": id })
}

export async function queryArticleById(id: number) {
  const statementMap = await getStatementMap()
  const statement = statementMap.get("QueryArticleById")!
  const result = await statement.get({ ":id": id })
  statement.finalize()
  return result
}

export async function queryArticleList(offset: number, limit: number) {
  const statementMap = await getStatementMap()
  const statement = statementMap.get('QueryArticleList')!
  return await statement.all({ ':offset': offset, ':limit': limit })
}

export async function updateArticle(id: number, content: string) {
  const statementMap = await getStatementMap()
  const statement = statementMap.get('UpdateArticleById')!
  await statement.run({ ':id': id, ':content': content })
}
