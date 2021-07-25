export function ObjectKeys<T extends object>(data: T): Array<keyof T> {
  return Object.keys(data) as Array<keyof T>
}
