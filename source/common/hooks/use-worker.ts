import { onMounted, onUnmounted } from 'airx'

type WorkerFunction<T, R> = (params: T) => R
type Transfer = Array<Transferable | OffscreenCanvas>
type WorkerExecFunction<T, R> = (params: T, transfer: Transfer) => R

type SimpleWorker<T, R> = {
  exec: WorkerExecFunction<T, Promise<R>>
  terminate: () => void
  uuid: string
}

export function createWorker<T, R>(fun: WorkerFunction<T, R>, onWorking?: (working: boolean) => any): SimpleWorker<T, R> {
  const runner = (internalFunc: Function) => {
    return (event: MessageEvent<any>) => {
      const result = internalFunc.call(undefined, event.data)
      postMessage(result)
    }
  }

  const code = `onmessage=(${runner.toString()})(${fun.toString()})`
  const blob = new Blob([code], { type: 'text/javascript' })
  const objectURL = URL.createObjectURL(blob)
  const worker = new Worker(objectURL) // 优化成 SharedWorker
  let working = false

  const handleWorking = (working: boolean) => {
    onWorking?.call(undefined, working)
    working = working
  }

  const exec = (params: T, transfer?: Transfer): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (working) reject(new Error(`worker is working`))

      worker.onmessage = (result) => {
        resolve(result.data)
        handleWorking(false)
      }
      worker.onerror = (error: any) => {
        reject(error)
        handleWorking(false)
      }
      worker.onmessageerror = (error: any) => {
        reject(error)
        handleWorking(false)
      }

      worker.postMessage(params, transfer)
      handleWorking(true)
    })
  }

  const terminate = () => {
    URL.revokeObjectURL(objectURL)
    worker?.terminate()
  }

  return {
    exec,
    terminate,
    uuid: Math.random().toString(32).slice(2).toUpperCase()
  }
}

/**
 * @param  {(...p:T)=>R} fun
 * @desc 必须保证传进来的函数是纯函数，不应该任何的外部依赖。
 */
export function useWorker<T, R>(fun: WorkerFunction<T, R>): SimpleWorker<T, R> {
  let worker: SimpleWorker<T, R> | null = createWorker(fun)
  onMounted(() => { worker = createWorker(fun) })
  onUnmounted(() => { worker?.terminate() })
  return worker
}

export function createWorkerPool<T, R>(fun: WorkerFunction<T, R>, limit?: number) {
  const pool = new Array<SimpleWorker<T, R>>()
  const workings = new Map<SimpleWorker<T, R>, boolean>()
  const requests = new Array<(worker: SimpleWorker<T, R>) => void>()
  const finalLimit = limit ? limit : Math.max(navigator.hardwareConcurrency || 0, 3)

  return {
    getWorker: async (): Promise<SimpleWorker<T, R>> => {
      return new Promise(resolve => {
        if (pool.length < finalLimit) {
          const worker: SimpleWorker<T, R> = createWorker(fun, (working) => {
            // console.warn(`${worker.uuid} is ${working ? 'working' : 'unWorking'}`)
            if (!working) requests.shift()?.call(undefined, worker)
            workings.set(worker, working)
          })

          pool.push(worker)
          return resolve(worker)
        }

        const unWorkingWorkers = Array.from(workings.entries()).filter(([_, state]) => !state)
        if (unWorkingWorkers.length > 0) {
          const worker = unWorkingWorkers[0][0]
          workings.set(worker, true)
          return resolve(worker)
        }

        requests.push(worker => resolve(worker))
      })

    }
  }
}
