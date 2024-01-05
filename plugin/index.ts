import { Plugin } from 'vite'
import { transform } from 'esbuild'
import { Context } from './context'

export const PAGES_VIRTUAL_MODULE_ID = '~airx-pages'

interface VitePluginAirxPagesOptions {
  /** 博文所在路径 */
  posts: string
}

export function VitePluginAirxPages(options: VitePluginAirxPagesOptions): Plugin {
  const ctx = new Context(options.posts)

  return {
    enforce: 'pre',
    name: 'airx-pages',
    async configResolved() {
      await ctx.resolvePosts()
    },
    async resolveId(id) {
      if (id === PAGES_VIRTUAL_MODULE_ID) {
        return PAGES_VIRTUAL_MODULE_ID
      }
    },
    async load(id) {
      if (id === PAGES_VIRTUAL_MODULE_ID) {
        return ctx.generateRouteCode()
      }

      if (/\.(md|mdx)$/.test(id)) {
        const rawCode = await ctx.generatePageCode(id)
        const { code, map } = await transform(rawCode, {
          loader: 'jsx',
          jsx: 'transform',
          jsxFragment: 'airx.Fragment',
          jsxFactory: 'airx.createElement',
          banner: `import * as airx from 'airx'`
        })

        return { code, map }
      }
    }
  }
}

export default VitePluginAirxPages
