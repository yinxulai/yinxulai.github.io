<template>
  <input v-model.lazy="column" placeholder="请输入填充字符" />
  <input v-model.lazy="characterList" placeholder="请输入填充字符" />
  <input type="file" accept="image/*" @change="handleSelectFile" />
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
const baseCharacters = ['Yin', 'Xu', 'Lai']

function encode(input: string):string {
  return ''
}

function decode(input: string):string {
  return ''
}

</script>
<style lang="less">
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.column {
  display: inline-block;
  width: 10px;
  height: 10px;
  font-size: 10px;
  line-height: 10px;
  flex-shrink: 0;
  transform: scale(0.8);
}
</style>
