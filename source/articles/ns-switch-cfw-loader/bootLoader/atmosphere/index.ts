import { data } from './bin'
import cover from './cover.png'
import type { BootLoader } from '..'

export const atmosphere: BootLoader = {
  cover: cover,
  name: 'Atmosphere',
  getData: ()=> Promise.resolve(data),
}
