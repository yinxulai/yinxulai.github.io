import { createRef } from 'airx'

import styles from './style.module.less'

type State = 'live' | 'die'
export function CellularAutomata() {
  const rowRef = createRef<number>(50)
  const columnRef = createRef<number>(50)
  const requestAnimationIdRef = createRef<number | undefined>(undefined)
  const stateTableRef = createRef<State[][]>([])
  const testState =
    '[[3,23],[3,24],[4,23],[4,24],[8,24],[9,23],[9,25],[10,22],[10,26],[11,23],[11,24],[11,25],[12,21],[12,22],[12,26],[12,27]]'

  const exportBlockState = () => {
    const stateTable = stateTableRef.value
    const livedPoints: [number, number][] = []
    for (let row = 0; row < stateTable.length; row++) {
      if (!Array.isArray(stateTable[row])) stateTable[row] = []
      for (let column = 0; column < stateTable[row].length; column++) {
        const current = getBlockState(row, column) // 当前
        if (current === 'live') livedPoints.push([row, column])
      }
    }
  }

  const randomBlockState = () => {
    const stashTable = new Array<State[]>()
    for (let row = 0; row <= rowRef.value; row++) {
      if (!Array.isArray(stashTable[row])) stashTable[row] = []
      for (let column = 0; column <= columnRef.value; column++) {
        stashTable[row][column] = Math.random() < 0.1 ? 'live' : 'die'
      }
    }
    stateTableRef.value = stashTable
  }

  const loadBlockState = () => {
    const stashTable = new Array<State[]>()
    const states: [number, number][] = JSON.parse(testState)
    for (let index = 0; index < states.length; index++) {
      const [row, column] = states[index]
      if (!Array.isArray(stashTable[row])) {
        stashTable[row] = []
      }
      stashTable[row][column] = 'live'
    }

    stateTableRef.value = stashTable
  }

  const getBlockState = (row: number, column: number) => {
    const stateTable = stateTableRef.value
    return stateTable[row] && stateTable[row][column] && stateTable[row][column] === 'live'
      ? 'live'
      : 'die'
  }

  const switchBlockState = (row: number, column: number) => {
    const stateTable = stateTableRef.value
    if (!Array.isArray(stateTable[row])) stateTable[row] = []
    stateTable[row][column] = getBlockState(row, column) === 'die' ? 'live' : 'die'

    stateTableRef.value = stateTable
  }

  const update = () => {
    const stateTable = stateTableRef.value
    const stashTable = new Array<State[]>()
    for (let row = 0; row < rowRef.value; row++) {
      if (!Array.isArray(stashTable[row])) stashTable[row] = []
      if (!Array.isArray(stateTable[row])) stateTable[row] = []
      for (let column = 0; column < columnRef.value; column++) {
        const lt = getBlockState(row - 1, column - 1) // 左上
        const rt = getBlockState(row - 1, column + 1) // 右上
        const ct = getBlockState(row - 1, column) // 中上
        const lc = getBlockState(row, column - 1) // 左中
        const rc = getBlockState(row, column + 1) // 右中
        const cb = getBlockState(row + 1, column) // 中下
        const lb = getBlockState(row + 1, column - 1) // 左下
        const rb = getBlockState(row + 1, column + 1) // 右下

        const current = getBlockState(row, column) // 当前
        const envStates: State[] = [ct, lt, rt, rc, lc, cb, rb, lb]
        const livedCount = envStates.filter((state) => state === 'live').length

        // 当前细胞为存活状态时，当周围低于2个（不包含2个）存活细胞时，该细胞变成死亡状态
        if (current === 'live' && livedCount < 2) stashTable[row][column] = 'die'
        // 当前细胞为存活状态时，当周围有2个或3个存活细胞时， 该细胞保持原样。
        if (current === 'live' && (livedCount === 2 || livedCount === 3)) {
          stashTable[row][column] = current
        }
        // 当前细胞为存活状态时，当周围有3个以上的存活细胞时，该细胞变成死亡状态。
        if (current === 'live' && livedCount > 3) stashTable[row][column] = 'die'
        // 当前细胞为死亡状态时，当周围有3个存活细胞时，该细胞变成存活状态。
        if (current === 'die' && livedCount === 3) stashTable[row][column] = 'live'
      }
    }

    stateTableRef.value = stashTable
  }

  const start = () => {
    update()
    requestAnimationIdRef.value = requestAnimationFrame(start)
  }

  const stop = () => {
    if (requestAnimationIdRef.value != null) {
      cancelAnimationFrame(requestAnimationIdRef.value)
    }
  }

  const next = () => {
    update()
  }

  return () => (
    <div class={styles.root}>
      <button onClick={exportBlockState}>
        导出当前状态
      </button>
      <button onClick={randomBlockState} >
        随机生成状态
      </button >
      <button onClick={loadBlockState} >
        加载状态
      </button >
      <button onClick={start} >
        开始
      </button >
      <button onClick={stop} >
        停止
      </button >
      <button onClick={next} >
        步进
      </button >
      <div class={styles.cellularAutomata}>
        {new Array(rowRef.value).fill(null).map((_, rowIndex) => (
          <div key={rowIndex} class={styles.row}>
            {new Array(columnRef.value).fill(null).map((_, columnIndex) => {
              const className = [styles.block]
              const blockState = getBlockState(rowIndex, columnIndex)
              className.push(blockState === 'die' ? styles.die : styles.live)
              return (
                <span
                  key={columnIndex}
                  class={className.join(' ')}
                  onClick={() => switchBlockState(rowIndex, columnIndex)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
