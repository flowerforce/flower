export const FLOWER_EXTERNAL_UPDATE = 'flower/external/update'

export interface FlowerExternalPayload {
  path: string[]
  value: any
}

export const setExternalValue = (
  path: string[],
  value: any
): {
  type: string
  payload: FlowerExternalPayload
} => ({
  type: FLOWER_EXTERNAL_UPDATE,
  payload: { path, value }
})
