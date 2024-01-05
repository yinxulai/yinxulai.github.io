import he from 'he'
import * as fs from 'fs'

// @ts-ignore 等 @types/marked 更新
import { Marked } from 'marked'

import hljs from 'highlight.js'
import { markedXhtml } from 'marked-xhtml'
import { markedHighlight } from 'marked-highlight'

export interface MdMeta {
  key: string
  value: string
}

interface MarkdownInlineCode {
  code: string
  language: CodeLanguage
}

interface CodeLanguage {
  language: string | undefined
  commands: string[]
}

interface MarkdownResult {
  html: string
  meta: MdMeta[]
  codes: MarkdownInlineCode[]
}

export async function parseMarkdown(content: string): Promise<MarkdownResult> {
  const marked = new Marked()
  const meta: MdMeta[] = []
  const codes: MarkdownInlineCode[] = []

  marked.use({
    extensions: [{
      name: 'md-meta',
      level: 'block',
      renderer: () => '',
      start: src => src.indexOf('---\n'),
      tokenizer: (src): MdMateToken | void => {
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
    },
      // {
      //   name: 'html-comment',
      //   level: 'block',
      //   renderer: () => '',
      //   start: src => src.indexOf('<!--'),
      //   tokenizer: src => {
      //     const regexp = /<!--((?:(?!-{2}>).|\n)*)?-->/
      //     const match = regexp.exec(src)
      //     if (match != null) {
      //       console.log(match)
      //       return {
      //         raw: match[0],
      //         type: 'html-comment'
      //       }
      //     }
      //   }
      // }
    ]
  })
  marked.use(markedXhtml())
  marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  }))

  interface MdMateToken {
    type: 'md-meta'
    raw: string
    data: MdMeta[]
  }

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

  marked.use({ renderer: { code } })

  const html = marked.parse(content, {
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

export async function parseMarkdownFile(filePath: string): Promise<MarkdownResult> {
  const content = await fs.promises.readFile(filePath, 'utf-8')
  return parseMarkdown(content)
}
