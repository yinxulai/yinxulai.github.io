import path from 'path'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions, PluginConfig } from 'vuepress'

const globalStyle = `
  html {
    background-color: #181818;
  }
  body {
    opacity: 0;
  }
`

function googleAnalyticsPlugin(id: string): PluginConfig {
  return ['@vuepress/plugin-google-analytics', { id }]
}

function registerComponentsPlugin(dir: string): PluginConfig {
  return ['@vuepress/register-components', {
    componentsDir: path.resolve(__dirname, dir),
    getComponentName: (file: string) => path.basename(file, '.vue')
  }]
}

function syntaxHighlightPlugin(): PluginConfig {
  return ['@vuepress/plugin-shiki', { theme: 'dracula' }]
}

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: 'Alain Blog',
  description: 'Alain Blog',
  theme: path.resolve(__dirname, 'theme'),
  dest: path.resolve(__dirname, '.output/dest'),
  temp: path.resolve(__dirname, '.output/temp'),
  cache: path.resolve(__dirname, '.output/cache'),
  head: [['style', { type: 'text/css' }, globalStyle]],
  alias: { '@hooks':  path.resolve(__dirname, './common/hooks') },
  plugins: [googleAnalyticsPlugin('G-PPVXN8YZWL'), registerComponentsPlugin('./source'), syntaxHighlightPlugin()]
})
