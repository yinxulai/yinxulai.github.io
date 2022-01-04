<template>
  <canvas id="canvas"></canvas>
</template>
<script lang="ts" setup>

async function getSoundInput() {
  const userMediaStream = await navigator.mediaDevices.getUserMedia({audio: true})
  const audioNode = new AudioContext().createMediaStreamSource(userMediaStream)
  audioNode.numberOfOutputs
  // audioNode.addEventListener('') 
}
getSoundInput()
</script>
