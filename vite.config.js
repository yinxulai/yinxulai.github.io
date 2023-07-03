import * as path from 'path'
import { defineConfig } from 'vite'
import { VitePluginAirxPress } from './plugin'

const theme = path.join(__dirname, './theme')
const posts = path.join(__dirname, './source')

export default defineConfig({
  plugins: [VitePluginAirxPress({ theme, posts })],
})
