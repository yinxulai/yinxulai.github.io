import path from 'path'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions, PluginConfig } from 'vuepress'

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

function googleAnalyticsPlugin(id: string): PluginConfig {
  return ['@vuepress/plugin-google-analytics', { id }]
}

function registerComponentsPlugin(dir: string): PluginConfig {
  return ['@vuepress/register-components', {
    componentsDir: path.resolve(__dirname, dir),
    getComponentName: (file: string) => path.basename(file, '.vue')
  }]
}

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
  plugins: [googleAnalyticsPlugin('G-PPVXN8YZWL'), registerComponentsPlugin('./source')]
})
