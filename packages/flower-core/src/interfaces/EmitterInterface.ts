export interface IEmitter {
  on<F extends Function, C>(name: string, cb: F, ctx?: C): this;

  once<F extends Function, C>(name: string, cb: F, ctx?: C): this;

  emit(
    name: string,
    opt?: Record<string, any>
  ): this;

  off<F extends Function>(name: string, cb?: F): this;
}
