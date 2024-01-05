import * as fs from 'fs'
import * as path from 'path'
import { ViteDevServer } from 'vite'
import { MdMeta, parseMarkdown, parseMarkdownFile } from './markdown'

export interface Post {
  path: string
  meta: MdMeta[]
  content: string
  filePath: string
}

export class Context {
  private posts = new Map<string, Post>()
  constructor(private postPath: string) {}

  async resolvePosts(startPath: string = this.postPath, targetPath?: string): Promise<void> {
    if (!targetPath) targetPath = startPath

    const targetPathStat = await fs.promises.stat(targetPath)

    if (targetPathStat.isFile() && /mdx?$/.test(targetPath)) {
      const relativePath = startPath !== targetPath
        ? path.relative(startPath, targetPath)
        : path.basename(targetPath)

      const fileContext = await fs.promises.readFile(targetPath, 'utf-8')
      if (fileContext == '' || fileContext == null) return
      const { meta } = await parseMarkdown(fileContext)

      this.posts.set(targetPath, {
        meta,
        path: relativePath,
        content: fileContext,
        filePath: targetPath,
      })
    }

    if (targetPathStat.isDirectory()) {
      const paths = await fs.promises.readdir(targetPath)
      for (let index = 0; index < paths.length; index++) {
        const nextPath = path.join(targetPath, paths[index])
        await this.resolvePosts(startPath, nextPath)
      }
    }
  }

  async generateRouteCode(): Promise<string> {
    const importCodes: string[] = []
    const routesCodes: string[] = []
    const postArray = [...this.posts.values()]
    for (let index = 0; index < postArray.length; index++) {
      const post = postArray[index]
      const importedDefaultName = `Post${index}`
      const importedMetaName = `PostMeta${index}`
      importCodes.push(`import ${importedDefaultName} from '${post.filePath}';`)
      importCodes.push(`import { meta as ${importedMetaName} } from '${post.filePath}';`)
      routesCodes.push(`{ path: '${post.path}', meta: ${importedMetaName}, component: ${importedDefaultName} }`)
    }

    return [
      importCodes.join('\n'),
      `export default [${routesCodes.join(',')}]`
    ].join('\n')
  }

  async generatePageCode(path: string): Promise<string> {
    const markdown = await parseMarkdownFile(path)
    const injectedCodes = markdown.codes
      .filter(code => (
        ['jsx', 'js', 'tsx', 'ts'].includes(code.language.language || '')
        && code.language.commands.includes('inject')
      ))
      .map(code => code.code)

    const code = [
      ...injectedCodes,
      `export const meta = ${JSON.stringify(markdown.meta)};`,
      `export default function() { return () => (<>${markdown.html}</>); };`
    ].join('\n')

    return code
  }
  
}
