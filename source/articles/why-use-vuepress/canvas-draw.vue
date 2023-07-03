<script lang="tsx">
import { ref, watch, onMounted } from 'vue'
import { defineComponent } from '@utils/vue'
import { controllerSymbol } from './controller-symbol'
import { useHistory } from './use-history'
import { useDraw } from './use-draw'

export default defineComponent((props, ctx) => {

  const canvasRef = ref<HTMLCanvasElement>()

  const draw = useDraw(canvasRef)
  const history = useHistory(draw.drawStroke)
  draw.addDrawCallback(history.drawCallback)

  watch([canvasRef], () => {
    if (canvasRef.value != null) {
      history.start()
      return
    }
    history.stop()
  })

  onMounted(() => {
    if (window != null) {
      const global = globalThis as any
      global[controllerSymbol] = {
        clearCanvas: draw.clear,
        clearHistory: history.clear,
        stopPlayHistory: history.stop,
        startPlayHistory: history.start
      }
    }
  })

  return () => (
    <div class="drawing">
      <canvas ref={canvasRef} class="canvas" />
    </div>
  )
})

</script>
<style lang="less" scoped>
.drawing,
.canvas {
  width: 50rem;
  height: 30rem;
  overflow: hidden;
  background: white;
  border-radius: 10px;
}
</style>
