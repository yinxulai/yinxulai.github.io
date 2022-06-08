<template>
  <div ref="chartContainerRef" class="scatter-chart">
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import * as Plotly from 'plotly.js'

const chartContainerRef = ref<HTMLDivElement>()

function drawChart() {
  if (chartContainerRef.value == null) return
  const containerRect = chartContainerRef.value.getBoundingClientRect()
  const { width, height } = containerRect

  function getRandom(num: number, mul: number) {
    var value = []
    for (let i = 0; i <= num; i++) {
      var rand = Math.random() * mul
      value.push(rand)
    }
    return value
  }

  const trace1: Partial<Plotly.Data> = {
    opacity: 0,
    type: 'mesh3d',
    x: getRandom(50, -75),
    y: getRandom(50, 75),
    z: getRandom(50, 75),
  }


  const layout: Partial<Plotly.Layout> = {
    height,
    width,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    }
  }

  Plotly.newPlot(chartContainerRef.value, [trace1], layout)
}

onMounted(()=> {
  drawChart()
})

</script>
<style lang="less" scoped>
.scatter-chart {
  width: 50rem;
  height: 20rem;
  background-color: white;
}
</style>
