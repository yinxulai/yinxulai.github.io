import he from 'he'
import * as fs from 'fs'
import * as path from 'path'

// @ts-ignore 等 @types/marked 更新
import { Marked } from 'marked'

import hljs from 'highlight.js'
import { markedXhtml } from 'marked-xhtml'
import { markedHighlight } from 'marked-highlight'

interface MdMate {
  key: string
  value: string
}

export interface RawPost {
  path: string
  fullPath: string
  meta: MdMate[]
}

/**
 * 加载博客文件
 * @param targetPath 
 * @returns 
 */
export async function resolvePosts(startPath: string, targetPath?: string): Promise<RawPost[]> {
  if (!targetPath) targetPath = startPath

  const targetPathStat = await fs.promises.stat(targetPath)

  if (targetPathStat.isFile() && /mdx?$/.test(targetPath)) {
    const relativePath = startPath !== targetPath
      ? path.relative(startPath, targetPath)
      : path.basename(targetPath)

    const fileContext = await readPostFile(targetPath)
    const markdown = fileContext ? await parseMarkdown(fileContext) : null

    return [{
      path: relativePath,
      fullPath: targetPath,
      meta: markdown?.meta || [],
    }]
  }

  if (targetPathStat.isDirectory()) {
    const posts: RawPost[] = []
    const paths = await fs.promises.readdir(targetPath)
    for (let index = 0; index < paths.length; index++) {
      const nextPath = path.join(targetPath, paths[index])
      const nextPost = await resolvePosts(startPath, nextPath)
      posts.push(...nextPost)
    }

    return posts
  }

  return []
}

/**
 * 读取 post 文件内容
 * @param path 
 * @returns 
 */
export async function readPostFile(path: string): Promise<string | null> {
  return await fs.promises.readFile(path, 'utf-8')
}

interface MarkdownInlineCode {
  code: string
  language: CodeLanguage
}

interface CodeLanguage {
  language: string | undefined
  commands: string[]
}

interface Post {
  html: string
  meta: MdMate[]
  codes: MarkdownInlineCode[]
}

export async function parseMarkdown(post: string): Promise<Post> {
  const marked = new Marked()
  const meta: MdMate[] = []
  const codes: MarkdownInlineCode[] = []

  marked.use({
    extensions: [{
      name: 'md-meta',
      level: 'block',
      start: () => 0,
      renderer: () => '',
      tokenizer(src): MdMateToken | void {
        const regexp = /^-{3}\n((?:(?!-{3}).|\n)*)?-{3}\n?/
        const match = regexp.exec(src)
        if (match != null) {
          const data = match[1]
            .split('\n')
            .map(line => {
              if (!line) return null
              const stmt = line.split(':')
              return {
                key: stmt[0]?.trim(),
                value: stmt[1]?.trim()
              }
            })
            .filter(<T>(v: T): v is NonNullable<T> => v != '')

          return {
            data,
            raw: match[0],
            type: 'md-meta'
          } satisfies MdMateToken
        }
      }
    }]
  })
  marked.use(markedXhtml())
  marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  }))

  function parseLanguage(language: string | undefined): CodeLanguage {
    if (!language || !language.includes(':')) return { language, commands: [] }
    const languageStmt = language.split(':')
    return { language: languageStmt[0], commands: languageStmt[1].split(',') }
  }

  function code(code: string, language: string | undefined, isEscaped: boolean) {
    const languageObj = parseLanguage(language)
    const unEscapedCode = isEscaped ? he.unescape(code) : code
    codes.push({ code: unEscapedCode, language: languageObj })

    // 针对 inject 类型不渲染任何内容到 html 上
    if (languageObj.commands.includes('inject')) {
      return ''
    }

    return false
  }

  interface MdMateToken {
    type: 'md-meta'
    raw: string
    data: MdMate[]
  }

  marked.use({ renderer: { code } })

  const html = marked.parse(post, {
    silent: true,
    walkTokens(token) {
      const asToken = token as unknown as MdMateToken
      if (asToken.type === 'md-meta') {
        meta.push(...asToken.data)
      }
    }
  })

  return { html, meta, codes }
}
