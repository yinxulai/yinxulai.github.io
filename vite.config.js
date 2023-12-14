import * as path from 'path'
import { defineConfig } from 'vite'
import { VitePluginAirx } from 'vite-plugin-airx'
import { VitePluginAirxPages } from './plugin'


export default defineConfig({
  plugins: [
    VitePluginAirx(),
    VitePluginAirxPages({ posts:path.join(__dirname, './source') })
  ],
})
