import kleur from 'kleur'

export class Logger {
  constructor(public name: string) {
    this.info = this.info.bind(this)
    this.warn = this.warn.bind(this)
    this.error = this.error.bind(this)
  }

  info(...messages: any[]) {
    console.info(kleur.bold().cyan(`[${this.name}]`), ...messages)
  }

  warn(...messages: any[]) {
    console.warn(kleur.bold().yellow(`[${this.name}]`), ...messages)
  }

  error(...error: any[]) {
    console.error(kleur.bold().red(`[${this.name}]`), ...error)
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
