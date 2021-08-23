<template>
  <div class="drawing">
    <canvas class="canvas" ref="canvasRef" />
  </div>
</template>
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

<script lang="ts" setup>
import drawData from "./draw-data.json";
import { computed, ref, watch } from "vue";
import { controllerSymbol } from "./controller-symbol";

const canvasRef = ref<HTMLCanvasElement>();
const canvasContext = computed(() => {
  if (canvasRef.value == null) return null;
  return canvasRef.value.getContext("2d");
});

interface Position {
  x: number;
  y: number;
}

type HistoryItem = [Position & { time: number }, Position & { time: number }];
type DrawHostory = Array<HistoryItem>;

const isStartDraw = ref<boolean>(false);
const isStopPlayHistory = ref<boolean>(false);
const history = ref<DrawHostory>(drawData as DrawHostory);
const lastDrawPosition = ref<Position>({ x: 0, y: 0 });
const lastDrawTime = ref<number>(Date.now());

const relativeCanvasPosition = (point: Position): Position => {
  if (canvasRef.value == null) return point;

  //创建canvas所对应的包围盒
  const clientRect = canvasRef.value.getBoundingClientRect();
  //返回屏幕x坐标减去bbox距离左边的间距就是canvas距离左边的位置,顶部同理左边
  return {
    x: Math.round(point.x - clientRect.left),
    y: Math.round(point.y - clientRect.top),
  };
};

const autoSetCanvasSize = () => {
  if (canvasRef.value == null) return;
  //创建canvas所对应的包围盒
  const clientRect = canvasRef.value.getBoundingClientRect();
  canvasRef.value.width = clientRect.width;
  canvasRef.value.height = clientRect.height;
};

const startDraw = (event: MouseEvent) => {
  event.preventDefault();
  const { clientX, clientY } = event;
  lastDrawPosition.value = relativeCanvasPosition({
    x: clientX,
    y: clientY,
  });
  isStartDraw.value = true;
  stopPlayHistory();
};

const closeDraw = (event: MouseEvent) => {
  event.preventDefault();
  const { clientX, clientY } = event;
  lastDrawPosition.value = relativeCanvasPosition({
    x: clientX,
    y: clientY,
  });
  isStartDraw.value = false;
};

const clearHistory = () => {
  history.value = [];
  stopPlayHistory();
  clearCanvas(1);
};

const clearCanvas = (alpha = 1) => {
  if (canvasRef.value == null) return;
  if (canvasContext.value == null) return;
  canvasContext.value.fillStyle = `rgba(255,255,255,${alpha})`;
  canvasContext.value.fillRect(
    0,
    0,
    canvasRef.value.width,
    canvasRef.value.height
  );
};

const drawStroke = (line: [Position, Position]) => {
  if (canvasRef.value == null) return;
  if (canvasContext.value == null) return;

  const [lastPosition, nowPosition] = line;
  const context = canvasContext.value!;

  //设置画笔粗细
  context.lineWidth = 10;
  //填补空白
  context.lineCap = "round";
  //线条更加平滑
  context.lineJoin = "round";
  //设置画笔颜色
  context.strokeStyle = "black";

  context.beginPath();
  context.moveTo(lastPosition.x, lastPosition.y);
  context.lineTo(nowPosition.x, nowPosition.y);
  context.stroke();

  lastDrawPosition.value = nowPosition;
  clearCanvas(0.01);
};

const playHistory = (history: DrawHostory, speed = 0.6, cycle = true) => {
  const play = (historyPart: DrawHostory) => {
    if (isStopPlayHistory.value == false) {
      if (historyPart.length === 0) {
        if (cycle) setTimeout(() => play(history), 2);
        return;
      }

      const [it, ...reset] = historyPart;
      const interval = Math.floor(((it[1].time - it[0].time) / 1000) * speed);

      drawStroke(it);
      setTimeout(() => play(reset), interval);
    }
  };

  play(history);
};

const startPlayHistory = () => {
  if (isStopPlayHistory.value == false) return;
  isStopPlayHistory.value = false;
  playHistory(history.value);
};

const stopPlayHistory = () => {
  if (isStopPlayHistory.value == true) return;
  isStopPlayHistory.value = true;
};

watch(
  () => canvasRef.value,
  () =>{
    if (canvasRef.value == null) {
      stopPlayHistory()
      return
    }

    playHistory(history.value)}
);

watch(
  () => canvasRef.value,
  () => {
    if (canvasRef.value == null) return;
    if (canvasContext.value == null) return;

    autoSetCanvasSize();

    canvasRef.value.addEventListener("mouseup", closeDraw);
    canvasRef.value.addEventListener("mouseout", closeDraw);
    canvasRef.value.addEventListener("mousedown", startDraw);
    canvasRef.value.addEventListener("mouseleave", closeDraw);

    canvasRef.value.addEventListener("mousemove", (event) => {
      event.preventDefault();
      if (isStartDraw.value == false) return;

      const { clientX, clientY } = event;
      const lastPosition = lastDrawPosition.value;
      const nowPosition = relativeCanvasPosition({ x: clientX, y: clientY });

      drawStroke([lastPosition, nowPosition]);
      history.value.push([
        { ...lastPosition, time: lastDrawTime.value },
        { ...nowPosition, time: Date.now() },
      ]);
    });
  }
);

if (window != null) {
  const global = window as any;
  global[controllerSymbol] = {
    clearCanvas,
    clearHistory,
    stopPlayHistory,
    startPlayHistory,
  };
}
</script>
