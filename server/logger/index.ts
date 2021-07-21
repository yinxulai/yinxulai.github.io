class Logger {
  constructor(private name: string) {
    this.info = this.info.bind(this)
    this.warn = this.warn.bind(this)
    this.error = this.error.bind(this)
  }

  info(...messages: any[]) {
    console.info(`[${this.name}]`, ...messages)
  }

  warn(...messages: any[]) {
    console.warn(`[${this.name}]`, ...messages)
  }

  error(...error: any[]) {
    console.error(`[${this.name}]`, ...error)
  }
}

export const getLogger = (() => {
  const loggerMap = new Map<string, Logger>()
  return (module: string) => {
    if (loggerMap.get(module) == null) {
      loggerMap.set(module, new Logger(module))
    }

    return loggerMap.get(module)!
  }
})()
