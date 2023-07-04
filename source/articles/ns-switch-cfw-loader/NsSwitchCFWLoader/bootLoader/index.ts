import { atmosphere } from './atmosphere'
import { hekate } from './hekate'
import { upload } from './upload'

export { injectBootLoader as bootLoader } from './inject'

export interface BootLoader {
  name: string
  cover: string
  getData: () => Promise<Uint8Array>
}

export const bootLoaders: BootLoader[] = [
  atmosphere,
  hekate,
  upload
]
