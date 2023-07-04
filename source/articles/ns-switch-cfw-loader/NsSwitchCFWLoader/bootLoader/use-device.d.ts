interface RequestDeviceFilter {
  vendorId?: number
  productId?: number
  classCode?: number
  subclassCode?: number
  protocolCode?: number
  serialNumber?: number
}

interface Navigator {
  usb: {
    getDevices(): Promise<USBDevice[]>
    requestDevice(options: { filters: RequestDeviceFilter[] }): Promise<USBDevice>
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface USBConfiguration {
  
}

interface USBInTransferResult {
  data: DataView
  status: 'ok' | 'stall' | 'babble'
}

interface USBOutTransferResult {
  bytesWritten: number
  status: 'ok' | 'stall'
}

interface ControlTransferInSetup {
  requestType: 'standard' | 'class' | 'vendor'
  recipient: 'device' | 'interface' | 'endpoint' | 'other'
  request: number
  value: number
  index: number
}

interface USBDevice {
  open(): Promise<void>
  transferIn(endpoint: number, length: number): Promise<USBInTransferResult>
  transferOut(endpoint: number, data: ArrayBuffer): Promise<USBOutTransferResult>
  controlTransferIn(setup: ControlTransferInSetup, length: number): Promise<USBInTransferResult>
  claimInterface(id: number): Promise<void>
  selectConfiguration(id: number): Promise<void>
  readonly configuration: USBConfiguration
  readonly configurations: USBConfiguration[]
  readonly manufacturerName: string
  readonly productName: string
}
