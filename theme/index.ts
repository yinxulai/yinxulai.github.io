import { path } from '@vuepress/utils'
import type { ThemeFunction, ThemeObject } from '@vuepress/core'
import { PluginFunction, PluginObject } from 'vuepress'

function getComponentName(file: string) {
  // 支持 Name/index.vue 的形式
  if (path.basename(file) === 'index.vue') {
    const paths = path.dirname(file).split('/')
    return paths[paths.length - 1]
  }

  return path.basename(file, '.vue')
}

// 将页面的第一级目录作为页面的 category 数据
const parsePageCategoryPlugin: PluginFunction = (_config, _app): PluginObject => {
  return {
    multiple: true,
    name: 'categoryPlugin',
    extendsPageData: page => {
      const words = page.path.split('/')
      if (words.length >= 3) page.frontmatter.category = words[1]
      return page
    }
  }
}

// 将页面的第二、三、四级目录作为页面的 date 数据
const parsePageDatePlugin: PluginFunction = (_config, _app): PluginObject => {
  return {
    multiple: true,
    name: 'checkPageDate',
    extendsPageData: page => {
      const words = page.path.split('/')
      if (words.length >= 7) {
        const [year, month, day] = words.slice(3, 6)
        page.frontmatter.date = new Date(+year, +month, +day);
      }
      return page
    }
  }
}

// 将一些公共的必要的样式注入到生成的 html 中（不是 link）
const globalStylePlugin: PluginFunction = (_config, _app) => {
  return {
    multiple: true,
    name: 'globalStylePlugin',
    onPrepared: app => {
      // console.log(app)
    },
    onGenerated: app => {
      // app.pluginApi.registerHooks
      // console.log(app)
    }
  }
}

const theme: ThemeFunction = () => {
  const plugins: ThemeObject['plugins'] = [
    globalStylePlugin,
    parsePageDatePlugin,
    parsePageCategoryPlugin,
    ['@vuepress/plugin-palette', {
      preset: 'less',
      userStyleFile: path.resolve(__dirname, './styles/global.less'),
      userPaletteFile: path.resolve(__dirname, './styles/palette.less')
    }],
    ['@vuepress/register-components', {
      getComponentName,
      componentsDir: path.resolve(__dirname, './'),
      componentsPatterns: ['components/**/*.vue', 'pages/**/*.vue']
    }],
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

export default theme
