import path from 'path'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

const globalStyle = `
  html {
    background-color: #181818;
  }

  body {
    opacity: 0;
    transition-duration: 0.3s;
    transition-property: opacity;
  }
`

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: 'Alain Blog',
  description: 'Alain Blog',
  theme: path.resolve(__dirname, 'theme'),
  public: path.resolve(__dirname, 'public'),
  dest: path.resolve(__dirname, '.output/dest'),
  temp: path.resolve(__dirname, '.output/temp'),
  cache: path.resolve(__dirname, '.output/cache'),
  head: [['style', { type: 'text/css' }, globalStyle]],
})
