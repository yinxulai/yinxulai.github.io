<template>
  <div class="cellular-automata">
    <div class="row" v-for="(row, rowIndex) in mapTable" :key="rowIndex">
      <div
        class="column"
        :key="columnIndex"
        :class="live ? 'live' : 'die'"
        v-for="(live, columnIndex) in row"
        @click="() => switchState(rowIndex, columnIndex)"
      >
        {{ live ? '1' : '0' }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const row = ref<number>(30)
const column = ref<number>(50)
const mapTable = ref(new Array(row.value).fill(new Array(column.value).fill(false)))

const switchState = (row: number, column: number) => {
  mapTable.value[row][column] = !mapTable.value[row][column]
}

</script>
<style lang="less">
.cellular-automata {
  .canvas {
    width: 50rem;
    height: 30rem;
    overflow: hidden;
    border-radius: 10px;
    background-color: white;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;

    .column {
      flex: 1;
      display: flex;
      cursor: pointer;
      align-items: center;
      flex-direction: column;
      border: 1px solid black;
      background-color: white;
      transition: 0.2s;

      &.live {
        background-color: black;
      }

      &:hover {
        top: -1px;
        position: relative;
        transform: scale(1.2);
        box-shadow: 0px 5px 20px rgba(0, 0, 0.1);
      }
    }
  }
}
</style>
