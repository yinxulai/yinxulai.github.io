<script lang="tsx">
import './bootLoader/use-device.d.ts'

import dayjs from 'dayjs'
import { defineComponent } from '@utils/vue'
import { onMounted, ref, computed } from 'vue'
import { BootLoader, bootLoaders, bootLoader } from './bootLoader'

import usbDeviceIcon from './usb-device.png'

type PayloadStep = 'unsupported' | 'setup' | 'booting'

export default defineComponent(() => {
  const bootFinished = ref(true)
  const viewStep = ref<PayloadStep>('setup')
  const selectedDevice = ref<USBDevice | null>(null)
  const selectedBootLoader = ref<BootLoader | null>(null)
  const selectedBootLoaderData = ref<Uint8Array | null>(null)

  const logs = ref<string[]>([])
  const logsContainer = ref<HTMLUListElement | null>(null)

  const startButtonDisabled = computed(() => (
    selectedDevice.value == null
    || selectedDevice.value == null
  ))

  const printLog = (log: string, ...args: any[]) => {
    let logText = `[${dayjs().format('HH:mm:ss')}] ${log}`
    for (const arg of args) {
      if (arg && (arg instanceof Error || typeof arg['message'] === 'string')) {
        logText += `, Error ${arg.name} ${arg.message}`
      }
    }

    logs.value.push(logText)
    console.log(logText, ...args)

    // 滚动日志到最底部
    if (logsContainer.value == null) return
    logsContainer.value.scrollTo({
      top: logsContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }

  const handleSelectBootLoader = async (newBootLoader: BootLoader) => {
    selectedBootLoaderData.value = await newBootLoader.getData()
    selectedBootLoader.value = newBootLoader
  }

  const handleSelectDevice = async () => {
    const device = await navigator.usb.requestDevice({ filters: [] })
    selectedDevice.value = device
  }

  const handleRestart = async () => {
    logs.value = [] // 清除日志
    viewStep.value = 'setup' // 设置状态
  }

  const handleStart = async () => {
    logs.value = [] // 清除日志
    bootFinished.value = false
    if (selectedDevice.value == null) return printLog('Please select a usbDevice first')
    if (selectedBootLoaderData.value == null) return printLog('Please select a bootLoader first')

    viewStep.value = 'booting' // 设置状态
    bootLoader(selectedDevice.value, selectedBootLoaderData.value, printLog)
      .finally(() => bootFinished.value = true)
  }

  onMounted(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('windows')) return viewStep.value = 'unsupported' // windows 不支持
    if (!userAgent.includes('chrome')) return viewStep.value = 'unsupported' // 非 chrome 不支持
    // viewStep.value = 'setup'
  })

  return () => {
    const setupView = (
      (
        <div class="scaffold">
          <div class="navbar">
            <span class="title">setup</span>
            <button class="button start" disabled={startButtonDisabled.value} onClick={handleStart}>start</button>
          </div>
          <div class="content">
            <div class="selectBootLoader">
              {bootLoaders.map(bootLoader => {
                const isSelected = selectedBootLoader.value?.name === bootLoader.name
                return (
                  <div class="bootLoader" onClick={() => handleSelectBootLoader(bootLoader)}>
                    <img class={['cover', { 'selected': isSelected }]} src={bootLoader.cover} />
                    <div class="name">{bootLoader.name}</div>
                  </div>
                )
              })}
            </div>
            <div class="selectDevice">
              <button class="button" onClick={handleSelectDevice}>
                <img src={usbDeviceIcon} class="usbDeviceIcon" />
                select device
              </button>
              {selectedDevice.value != null && (
                <div class="device">
                  <span class="productName">{selectedDevice.value.productName}</span>
                  {selectedDevice.value.manufacturerName && (
                    <span class="manufacturerName">
                      {selectedDevice.value.manufacturerName}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    )

    const bootingView = (
      <div class="scaffold">
        <div class="navbar">
          <span class="title">booting</span>
          <button class="button restart" disabled={!bootFinished.value} onClick={handleRestart}>Restart</button>
        </div>
        <div class="content">
          <div class="booting">
            <ul ref={logsContainer} class="logList">
              {logs.value.map(log => (
                <li class="log">{log}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )

    const unsupportedEnvironmentView = (
      <div class="unsupported">
        <p>本浏览器暂不支持 USB Device 接口，请切换到非 Windows 系统，并且安装/升级到最新的 Chrome 后重试。</p>
        <button class="button restart" onClick={handleRestart}>force start</button>
      </div>
    )

    return (
      <div class="nsSwitch">
        <div class="leftJoyCon" />
        <div class="centerScreenWrap">
          <div class="screen">
            {viewStep.value === 'setup' && setupView}
            {viewStep.value === 'booting' && bootingView}
            {viewStep.value === 'unsupported' && unsupportedEnvironmentView}
          </div>
        </div>
        <div class="rightJoyCon" />
      </div>
    )
  }
})
</script>
<style lang="less" scoped>
.nsSwitch {
  @borderRadius: 30px;

  width: 100%;
  margin: 20px 0;
  aspect-ratio: 239 / 102;
  background-color: black;
  border-radius: @borderRadius;
  box-shadow: 10px 20px 20px -10px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: row;
  align-items: center;

  .joyConBase() {
    flex: 4;
    height: 100%;
    box-shadow: 0 0 0 6px rgba(0, 0, 0, .1) inset;
  }

  .leftJoyCon {
    .joyConBase();
    background-color: #36A8C6;
    border-radius: @borderRadius 0 0 @borderRadius;
  }

  .rightJoyCon {
    .joyConBase();
    background-color: #EC5044;
    border-radius: 0 @borderRadius @borderRadius 0;
  }

  .centerScreenWrap {
    flex: 21;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #242729;
  }

  .screen {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #000000;
  }
}

.clearButton() {
  border: none;
  outline: none;
  border-radius: 0;
}

.scaffold {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .navbar {
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .title {
      width: 100%;
      color: white;
      font-size: 18px;
      text-align: left;
      font-weight: bold;
    }

    .button {
      .clearButton();
      padding: 6px 20px;

      color: white;
      font-size: 16px;
      background-color: #EC5044;

      &:disabled {
        opacity: 0.2;
      }
    }
  }

  .content {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
}

.selectBootLoader {
  display: flex;
  flex-direction: row;
  align-items: center;

  .bootLoader {
    margin: 4px;
    width: 100px;
    aspect-ratio: 1;

    display: flex;
    align-items: center;
    flex-direction: column;

    box-shadow: 0 10px 10px rgba(0, 0, 0, .1);

    &:active {
      transition: .3s;
      transform: scale(0.96);
    }

    .cover {
      width: 100%;
      aspect-ratio: 1;
      outline: 2px solid rgba(255, 255, 255, 0);

      &.selected {
        transition: .2s;
        transform: scale(1.1);
        outline: 2px solid rgba(255, 255, 255, 1);
      }
    }

    .name {
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.selectDevice {
  display: flex;
  align-items: center;
  flex-direction: column;

  margin-top: 1rem;

  .button {
    .clearButton();
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 20px;

    .usbDeviceIcon {
      width: 20px;
      margin-right: 0.5rem;
    }
  }

  .device {
    display: flex;
    align-items: center;
    flex-direction: row;

    margin-top: 0.5rem;

    .productName,
    .manufacturerName {
      font-size: 12px
    }

    .manufacturerName {
      margin-left: 1rem;
    }
  }
}

.booting {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .logList {
    height: 100%;
    overflow: auto;
    list-style: none;
    box-sizing: border-box;

    margin: 0;
    padding: 0 0 50px 10px;

    .log {
      font-size: 12px;
      color: #9fef00;
    }
  }
}

.unsupported {
  height: 100%;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  text-align: center;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .button {
      .clearButton();
      padding: 6px 20px;

      color: white;
      font-size: 16px;
      background-color: #EC5044;
    }
}
</style>
 