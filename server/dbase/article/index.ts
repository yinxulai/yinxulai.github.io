import { getStatement } from './statement'

export const autoCreateArticleTable = (() => {
  let isExistTable = false
  let createPromise: Promise<any>

  return async (): Promise<void> => {
    if (isExistTable === true) {
      return
    }

    if (createPromise != null) {
      return await createPromise
    }

    const existTable = await (await getStatement('ExistTable')).all()
    if (existTable[0] != null && existTable[0].count > 0) {
      isExistTable = true
      return
    }

    createPromise = (await getStatement('CreateTable')).run()
    return createPromise
  }
})()

export async function resetArticleTable() {
  await autoCreateArticleTable()
  const statement = await getStatement('ResetTable')
  await statement.run()
}

export async function createArticle(title: string, content: string) {
  await autoCreateArticleTable()
  const statement = await getStatement('CreateArticle')
  await statement.run({ ":content": content, ':title': title })
}

export async function deleteArticle(id: number): Promise<void> {
  await autoCreateArticleTable()
  const statement = await getStatement('DeleteArticleById')
  await statement.run({ ":id": id })
}

export async function queryArticleById(id: number) {
  await autoCreateArticleTable()
  const statement = await getStatement('QueryArticleById')
  const result = await statement.all({ ":id": id })
  return result[0]
}

export async function queryArticleList(offset: number, limit: number) {
  await autoCreateArticleTable()
  const statement = await getStatement('QueryArticleList')
  await statement.all({ ':offset': offset, ':limit': limit })
}

export async function updateArticle(id: number, title: string, content: string) {
  await autoCreateArticleTable()
  const statement = await getStatement('UpdateArticleById')
  await statement.run({ ':id': id, ':title': title, ':content': content })
}
