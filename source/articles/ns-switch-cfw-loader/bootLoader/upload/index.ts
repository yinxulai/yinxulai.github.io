import cover from './cover.png'
import type { BootLoader } from '..'

export const upload: BootLoader = {
  cover: cover,
  name: 'local file',
  getData: () => {
    return new Promise<Uint8Array>((resolve, reject) => {
      const element = document.createElement('input', {})
      element.type = 'file'
      element.addEventListener('change', event => {
        const reader = new FileReader()
        reader.onload = e => {
          element.value = ''
          if (e.target == null) return reject()
          const data = e.target.result as Uint8Array
          resolve(data)
        }
        
        if (element.files == null) return reject()
        if (element.files.length === 0) return reject()
        reader.readAsArrayBuffer(element.files[0])
      })

      element.click()
    })
  },
}
