const ACTION_TYPES = {
  back: ['back', 'prevToNode'],
  jump: ['node', 'node'],
  next: ['next', 'next'],
  restart: ['restart', 'restart'],
  reset: ['reset', 'initializeFromNode']
}
const PAYLOAD_KEYS_NEEDED = {
  back: ['node'],
  jump: ['node', 'history'],
  next: ['node', 'route', 'data', 'dataIn'],
  restart: ['node'],
  reset: ['node', 'initialData']
}

const makeActionPayload =
  (actions: string[], keys: string[]) =>
  (flowName: string | undefined, params: any) => {
    const rest: Record<string, any> =
      typeof params === 'string' ? { node: params } : params

    const payload: Record<string, any> = {
      flowName: params?.flowName || flowName,
      ...Object.fromEntries(
        Object.entries(rest ?? {}).filter(([k]) => keys.includes(k))
      )
    }
    const type = !params || !payload.node ? actions[0] : actions[1]
    return {
      type,
      payload
    }
  }

export const makeActionPayloadOnBack = makeActionPayload(
  ACTION_TYPES.back,
  PAYLOAD_KEYS_NEEDED.back
)

export const makeActionPayloadOnReset = makeActionPayload(
  ACTION_TYPES.reset,
  PAYLOAD_KEYS_NEEDED.reset
)

export const makeActionPayloadOnNode = makeActionPayload(
  ACTION_TYPES.jump,
  PAYLOAD_KEYS_NEEDED.jump
)

export const makeActionPayloadOnNext = makeActionPayload(
  ACTION_TYPES.next,
  PAYLOAD_KEYS_NEEDED.next
)

export const makeActionPayloadOnRestart = makeActionPayload(
  ACTION_TYPES.restart,
  PAYLOAD_KEYS_NEEDED.restart
)
