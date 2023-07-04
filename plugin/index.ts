import he from 'he'
import * as path from 'path'
import { Plugin } from 'vite'
import { RawPost, readPostFile, parseMarkdown, resolvePosts } from './loader'

interface VitePluginAirxPressOptions {
  entry: string
  /** 主题所在路径 */
  theme: string
  /** 博文所在路径 */
  posts: string
}

interface AirxPressContext {
  inited: boolean
  postMap: Map<string, RawPost>
}

export function VitePluginAirxPress(options: VitePluginAirxPressOptions): Plugin {
  const ctx: AirxPressContext = {
    inited: false,
    postMap: new Map(),
  }

  function isPostRequest(id: string) {
    const isMdFile = /mdx?$/.test(id)
    return isMdFile
  }

  return {
    enforce: 'pre',
    name: 'airx-press',
    config(config) {
      config.esbuild = {
        ...config.esbuild,
        jsx: 'transform',
        jsxFragment: '__airx__.Fragment',
        jsxFactory: '__airx__.createElement',
        jsxInject: 'import * as __airx__ from \'airx\''
      }

      return config
    },
    async resolveId(id) {
      if (ctx.inited == false) {
        // 不管访问什么文件，先扫描目录 TODO: 处理并发情况
        const posts = await resolvePosts(options.posts)
        for (let index = 0; index < posts.length; index++) {
          const post = posts[index]
          ctx.postMap.set(post.path, post)
        }
        ctx.inited = true
      }

      if (ctx.inited && ctx.postMap.size > 0) {
        if (isPostRequest(id)) {
          // 给该文件加一个虚假的后缀
          // 让 rollup 后面将该文件作为 jsx 处理
          const fakeSuffix = '.jsx'
          return id + fakeSuffix
        }
      }
    },
    async load(id) {
      if (id === '/index.tsx') {
        const importCodes: string[] = []
        const routesCodes: string[] = []
        const themeEntryImportedPath = path.join(options.theme, 'index.tsx')
        importCodes.push(`import ThemeApp from '${themeEntryImportedPath}';`)

        const postList = Array.from(ctx.postMap.values())
        for (let index = 0; index < postList.length; index++) {
          const post = postList[index]
          const importedDefaultName = `Post${index}`
          const importedMetaName = `PostMeta${index}`
          importCodes.push(`import ${importedDefaultName} from '${post.fullPath}';`)
          importCodes.push(`import { meta as ${importedMetaName} } from '${post.fullPath}';`)
          routesCodes.push(`{ path: '${post.path}', meta: ${importedMetaName}, component: ${importedDefaultName} }`)
        }

        const entryCode = `const app = __airx__.createElement(ThemeApp, {posts: [${routesCodes.join(',')}]})`
        const mountCode = `__airx__.createApp(app).mount(document.getElementById('app'))`
        return [...importCodes, entryCode, mountCode].join('\n')
      }

      // 如果是请求博文就去编译并生成页面
      if (/md\.jsx$/.test(id)) {
        const realPath = id.slice(0, id.length - 4)
        const content = await readPostFile(realPath)
        if (content != null) {
          if (!this.getWatchFiles().includes(realPath)) {
            this.addWatchFile(realPath)
          }

          const markdown = await parseMarkdown(content)
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
    }
  }
}

export default VitePluginAirxPress
