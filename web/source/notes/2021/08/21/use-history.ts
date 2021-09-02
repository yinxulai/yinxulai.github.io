import { ref, toRaw } from 'vue'
import defaultHistory from './history.json'
import type { Position, DrawCallback, DrawStroke } from './use-draw'

export function useHistory(draw: DrawStroke) {
  type History = Array<Position>
  const isPlaying = ref<boolean>(false)
  const history = ref<History>(defaultHistory)

  const drawCallback: DrawCallback = (record) => {
    history.value.push(record);
    (window as any).drawHistory = toRaw(history.value)
  }

  const clear = () => {
    history.value = []
  }

  const play = (speed = 0.8, cycle = true) => {
    const play = (index: number) => {
      if (isPlaying.value == true) {
        // 播放到倒数第二个点就播放完了
        if (index >= history.value.length - 1) {
          // 如果循环，就从 0 开始重复
          if (cycle) setTimeout(() => play(0), 1000 * 1)
        }

        // 没有播放完
        if (index < history.value.length - 1) {
          // 读取当前的和下一条记录
          const [it, next] = [history.value[index], history.value[index + 1]]
          const interval = Math.floor(((next.time - it.time) / 1000) * speed)

          setTimeout(() => play(index + 1), interval)
          draw([it, next])
        }
      }
    }

    play(0)
  }

  const start = () => {
    if (isPlaying.value == true) return
    isPlaying.value = true
    play()
  }

  const stop = () => {
    if (isPlaying.value == false) return
    isPlaying.value = false
  }

  return { drawCallback, clear, start, stop }
}
