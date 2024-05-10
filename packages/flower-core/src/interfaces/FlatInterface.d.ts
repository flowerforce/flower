export type KeyIdentity = (key: string) => string;

export type GetKey = (key?: string) => string | number | undefined;

interface FlattenOptions {
  maxDepth: number;
  safe?: boolean;
  delimiter?: string;
  transformKey?: (key: string) => string;
}

interface UnflattenOptions extends FlattenOptions {
  overwrite?: boolean;
  object?: boolean;
}

export type Flatten<T = object> = (target: T, opts?: FlattenOptions) => T;

export type FlattenStep = (
  object: { [x: string]: any },
  prev?: string,
  currentDepth?: number
) => void;

export type Unflatten<T = { [x: string]: any }> = (
  target: T,
  opts?: UnflattenOptions
) => T;
