import dayjs from 'dayjs'
import { createRef, onMounted } from 'airx'
import './bootLoader/use-device.d.ts'
import usbDeviceIcon from './usb-device.png'
import { BootLoader, bootLoader, bootLoaders } from './bootLoader/index.ts'

import styles from './style.module.less'

type PayloadStep = 'unsupported' | 'setup' | 'booting'

export function NsSwitchCFWLoader() {
  const bootFinished = createRef(true)
  const viewStep = createRef<PayloadStep>('setup')
  const selectedDevice = createRef<USBDevice | null>(null)
  const selectedBootLoader = createRef<BootLoader | null>(null)
  const selectedBootLoaderData = createRef<Uint8Array | null>(null)

  const logs = createRef<string[]>([])
  const logsContainer = createRef<HTMLUListElement | null>(null)

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
    if (userAgent.includes('windows')) viewStep.value = 'unsupported' // windows 不支持
    if (!userAgent.includes('chrome')) viewStep.value = 'unsupported' // 非 chrome 不支持
    viewStep.value = 'setup'
  })

  return () => {
    const startButtonDisabled = selectedDevice.value == null || selectedDevice.value == null

    const setupView = (
      (
        <div class={styles.scaffold}>
          <div class={styles.navbar}>
            <span class={styles.title}>setup</span>
            <button class="button start" disabled={startButtonDisabled} onClick={handleStart}>start</button>
          </div>
          <div class={styles.content}>
            <div class={styles.selectBootLoader}>
              {bootLoaders.map(bootLoader => {
                const isSelected = selectedBootLoader.value?.name === bootLoader.name
                const imageClass = [styles.cover, isSelected ? styles.selected : ''].join(' ')
                return (
                  <div class={styles.bootLoader} onClick={() => handleSelectBootLoader(bootLoader)}>
                    <img class={imageClass} src={bootLoader.cover} />
                    <div class={styles.name}>{bootLoader.name}</div>
                  </div>
                )
              })}
            </div>
            <div class={styles.selectDevice}>
              <button class={styles.button} onClick={handleSelectDevice}>
                <img src={usbDeviceIcon} class={styles.usbDeviceIcon} />
                select device
              </button>
              {selectedDevice.value != null && (
                <div class={styles.device}>
                  <span class={styles.productName}>{selectedDevice.value.productName}</span>
                  {selectedDevice.value.manufacturerName && (
                    <span class={styles.manufacturerName}>
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
      <div class={styles.scaffold}>
        <div class={styles.navbar}>
          <span class={styles.title}>booting</span>
          <button class="button restart" disabled={!bootFinished.value} onClick={handleRestart}>Restart</button>
        </div>
        <div class={styles.content}>
          <div class={styles.booting}>
            <ul ref={logsContainer} class={styles.logList}>
              {logs.value.map(log => (
                <li class={styles.log}>{log}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )

    const unsupportedEnvironmentView = (
      <div class={styles.unsupported}>
        <p>本浏览器暂不支持 USB Device 接口，请切换到非 Windows 系统，并且安装/升级到最新的 Chrome 后重试。</p>
        <button class="button restart" onClick={handleRestart}>force start</button>
      </div>
    )

    return (
      <div class={styles.nsSwitch}>
        <div class={styles.leftJoyCon} />
        <div class={styles.centerScreenWrap}>
          <div class={styles.screen}>
            {viewStep.value === 'setup' && setupView}
            {viewStep.value === 'booting' && bootingView}
            {viewStep.value === 'unsupported' && unsupportedEnvironmentView}
          </div>
        </div>
        <div class={styles.rightJoyCon} />
      </div>
    )
  }
}
