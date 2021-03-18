export function isDev(): boolean {
  if (!process || !process.env || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
    return false
  }
  return true
}
