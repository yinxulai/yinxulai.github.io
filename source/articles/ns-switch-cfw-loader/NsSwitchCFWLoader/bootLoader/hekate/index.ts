import { data } from './bin'
import cover from './cover.png'
import type { BootLoader } from '..'

export const hekate: BootLoader = {
  cover: cover,
  name: 'hekate',
  getData: ()=> Promise.resolve(data),
}
