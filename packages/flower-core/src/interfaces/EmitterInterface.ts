export interface IEmitter {
  on<F extends (...args: unknown[]) => unknown, C>(
    name: string,
    cb: F,
    ctx?: C
  ): this

  once<F extends (...args: unknown[]) => unknown, C>(
    name: string,
    cb: F,
    ctx?: C
  ): this

  emit(name: string, opt?: Record<string, any>): this

  off<F extends (...args: unknown[]) => unknown>(name: string, cb?: F): this
}
