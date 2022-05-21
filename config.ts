import path from 'path'
import { defineUserConfig } from 'vuepress'

// 插件
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { shikiPlugin } from '@vuepress/plugin-shiki'

import { theme } from './theme'

const globalStyle = `
  html {
    background-color: #181818;
  }
  body {
    opacity: 0;
  }
`

const registerComponentsOptions = {
  componentsDir: path.resolve(__dirname, './source'),
  getComponentName: (file: string) => path.basename(file, '.vue')
}

export default defineUserConfig({
  theme: theme,
  lang: 'zh-CN',
  title: 'Alain Blog',
  description: 'Alain Blog',
  dest: path.resolve(__dirname, '.output/dest'),
  temp: path.resolve(__dirname, '.output/temp'),
  cache: path.resolve(__dirname, '.output/cache'),
  head: [['style', { type: 'text/css' }, globalStyle]],
  alias: { '@hooks': path.resolve(__dirname, 'hooks') },
  plugins: [
    registerComponentsPlugin(registerComponentsOptions),
    googleAnalyticsPlugin({ id: 'G-PPVXN8YZWL' }),
    shikiPlugin({ theme: 'dracula' })
  ]
})
