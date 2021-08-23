import path from 'path'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

const globalStyle = `
  html {
    background-color: #181818;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  body {
    animation: fade-in 0.6s linear 0s 1 normal;
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
  plugins: [['@vuepress/plugin-google-analytics', { id: 'G-PPVXN8YZWL' }]]
})
