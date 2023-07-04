import { createRef } from 'airx'
import styles from './style.module.less'

const defaultCharacterList =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

interface GrayscaleMap {
  keys: number[]
  map: Map<number, string>
}

export function ConvertImageToGrayscale() {

  const column = createRef<number>(100)
  const image = createRef<HTMLImageElement | undefined>(undefined)
  const characterList = createRef<string>(defaultCharacterList)

  const imageGrayscaleTable = createRef<number[][]>([])
  const fontGrayscaleMap = createRef<GrayscaleMap>({ map: new Map(), keys: [] })

  const getGrayscale = (data: Uint8ClampedArray) => {
    const rgbaData = data.reduce(
      (previous, current, i) => {
        previous[i % 4] += current
        return previous
      },
      [0, 0, 0, 0]
    )

    const pixCount = data.length / 4
    const r = Math.floor((rgbaData[0] / pixCount) * 0.299)
    const g = Math.floor((rgbaData[1] / pixCount) * 0.587)
    const b = Math.floor((rgbaData[2] / pixCount) * 0.114)

    return r + g + b
  }

  const handleSelectFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null || target.files == null) return
    const file = target.files[0]
    const imageObject = new Image()
    imageObject.src = URL.createObjectURL(file)
    imageObject.addEventListener('load', () => {
      URL.revokeObjectURL(imageObject.src)
      image.value = imageObject
      refreshGrayscaleTable()
    })
  }

  const getCanvas2DContext = (width = 10, height = 10) => {
    const canvas = document.createElement('canvas')
    canvas.height = height
    canvas.width = width

    return canvas.getContext('2d')!
  }

  const refreshFontGrayscaleMap = () => {
    if (!characterList.value) return

    const map = new Map<number, string>()
    const size = 50
    const characters = characterList.value
    const context = getCanvas2DContext(size, size)!
    const characterSet = new Set(characters.split(''))
    for (const character of characterSet) {
      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, size, size)

      context.fillStyle = '#000000'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `Bold 50px Menlo`
      context.fillText(character, size / 2, size / 2)
      const imageData = context.getImageData(0, 0, size, size)
      const value = getGrayscale(imageData.data)
      // 个别字符的灰度信息相同，导致被替换
      map.set(value, character)
    }

    const keys = Array.from(map.keys()).sort()
    fontGrayscaleMap.value = { map, keys }
  }

  const refreshGrayscaleTable = () => {
    if (image.value == null) return

    const table: number[][] = []
    const { width, height } = image.value
    const context = getCanvas2DContext(width, height)
    const blockSize = Math.floor(width / column.value)
    context.drawImage(image.value, 0, 0, width, height)

    for (let x = 0; x < width; x += blockSize) {
      for (let y = 0; y < height; y += blockSize) {
        if (!Array.isArray(table[y / blockSize])) table[y / blockSize] = []
        const chuckData = context.getImageData(x, y, blockSize, blockSize)
        table[y / blockSize][x / blockSize] = getGrayscale(chuckData.data)
      }
    }

    imageGrayscaleTable.value = table
  }

  const renderText = (gray: number) => {
    let result: number | null = null
    const keys = fontGrayscaleMap.value.keys
    for (let index = 0; index < keys.length; index++) {
      const current = keys[index]
      if (result == null) {
        result = current
        continue
      }

      if (Math.abs(gray - current) <= Math.abs(gray - result)) {
        result = current
      }
    }

    return fontGrayscaleMap.value.map.get(result!)
  }

  refreshFontGrayscaleMap()
  refreshGrayscaleTable()

  return () => (
    <div>
      {/*
        <input v-model.lazy="column" placeholder="请输入填充字符" />
        <input v-model.lazy="characterList" placeholder="请输入填充字符" />
       */}

      <input type="file" accept="image/*" onChange={handleSelectFile} />
      {imageGrayscaleTable.value.map((row, x) => (
        <div key={x} class={styles.row}>
          {row.map((gray, y) => (
            <div key={y} class={styles.column}>
              {renderText(gray)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
