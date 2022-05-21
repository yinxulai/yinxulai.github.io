import { path } from '@vuepress/utils'
import { PluginFunction, PluginObject } from 'vuepress'
import type { ThemeFunction, ThemeObject } from '@vuepress/core'

// 插件
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { palettePlugin } from '@vuepress/plugin-palette'

function getComponentName(file: string) {
  // 支持 {ComponentName}/index.vue 的形式
  if (path.basename(file) === 'index.vue') {
    const paths = path.dirname(file).split('/')
    return paths[paths.length - 1]
  }

  return path.basename(file, '.vue')
}

// 将页面的第一级目录作为页面的 category 数据
const parsePageCategoryPlugin: PluginFunction = (_app): PluginObject => {
  return {
    multiple: true,
    name: 'categoryPlugin',
    extendsPage: page => {
      const words = page.path.split('/')
      if (words.length >= 3) page.frontmatter.category = words[1]
    }
  }
}

// 将页面的第二、三、四级目录作为页面的 date 数据
const parsePageDatePlugin: PluginFunction = (_app): PluginObject => {
  return {
    multiple: true,
    name: 'checkPageDate',
    extendsPage: page => {
      const words = page.path.split('/')
      if (words.length >= 7) {
        const [year, month, day] = words.slice(3, 6)
        page.frontmatter.date = new Date(+year, +month, +day);
      }
    }
  }
}

export const theme: ThemeFunction = () => {
  const plugins: ThemeObject['plugins'] = [
    parsePageDatePlugin,
    parsePageCategoryPlugin,
    palettePlugin({
      preset: 'less',
      userStyleFile: path.resolve(__dirname, './styles/global.less'),
      userPaletteFile: path.resolve(__dirname, './styles/palette.less')
    }),
    registerComponentsPlugin({
      getComponentName,
      componentsDir: path.resolve(__dirname, './'),
      componentsPatterns: ['common/**/*.vue', 'pages/**/*.vue']
    })
  ]

  const layouts: ThemeObject['layouts'] = {
    404: path.resolve(__dirname, 'layout/404.vue'),
    Layout: path.resolve(__dirname, 'layout/index.vue')
  }

  return {
    plugins,
    layouts,
    name: 'vuepress-theme-yinxulai'
  }
}
