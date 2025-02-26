export type FlowerReactContextProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  name?: string
} & T
