export const logger = {
  error(...messages: string[]) {
    console.error(`[${Date()}] `, ...messages)
  },

  log(...messages: string[]) {
    console.log(`[${Date()}] `, ...messages)
  }
}
