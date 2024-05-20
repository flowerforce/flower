import { useCallback, useContext } from 'react'
import FlowerContext from '../context'
import { makeSelectCurrentNodeId } from '../selectors'
import { useDispatch, useSelector } from '../provider'
import { UseFlower } from './types/FlowerHooks'

type NavigateFunctionParams = string | Record<string, any>

const ACTION_TYPES = {
  back: ['prev', 'prevToNode'],
  reset: ['reset', 'initializeFromNode'],
  jump: ['node', 'node'],
  next: ['next', 'next']
}
const PAYLAOAD_KEYS_NEEDED = {
  back: ['node'],
  reset: ['node'],
  jump: ['node', 'history'],
  next: ['node', 'route', 'data']
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

const makeActionPayloadOnPrev = makeActionPayload(
  ACTION_TYPES.back,
  PAYLAOAD_KEYS_NEEDED.back
)

const makeActionPayloadOnReset = makeActionPayload(
  ACTION_TYPES.reset,
  PAYLAOAD_KEYS_NEEDED.reset
)

const makeActionPayloadOnNode = makeActionPayload(
  ACTION_TYPES.jump,
  PAYLAOAD_KEYS_NEEDED.jump
)

const makeActionPayloadOnNext = makeActionPayload(
  ACTION_TYPES.next,
  PAYLAOAD_KEYS_NEEDED.next
)
/** This hook allows you to read flow informations, such as the flowName and ID of the current node.
 *
 * It also exposes all the functions to navigate within the flow:
 *
 * - next
 *
 * - back
 *
 * - jump
 *
 * - reset
 *
 *
 * @param {string} flowName - first optional parameter
 *
 * @param {string} name - optional parameter, if flowName exist, name is not used
 */
const useFlower: UseFlower = ({ flowName: customFlowName, name } = {}) => {
  const dispatch = useDispatch()

  const { flowName: flowNameDefault } = useContext(FlowerContext)

  const flowName = customFlowName || name || flowNameDefault
  const nodeId = useSelector(makeSelectCurrentNodeId(flowName ?? ''))

  const emitNavigateEvent = useCallback(
    //TODO check this function is needed
    (params: any) => {
      /* istanbul ignore next */
      // eslint-disable-next-line no-underscore-dangle, no-undef
      // if (global.window && global.window.__FLOWER_DEVTOOLS__) {
      //   Emitter.emit('flower-devtool-from-client', {
      //     source: 'flower-client',
      //     action: 'FLOWER_NAVIGATE',
      //     nodeId,
      //     name: flowName,
      //     time: new Date(),
      //     params,
      //   });
      // }
    },
    [flowName, nodeId]
  )

  const next = useCallback(
    (param?: NavigateFunctionParams) => {
      const params =
        typeof param === 'string' ? { route: param } : { data: param }
      const { type, payload } = makeActionPayloadOnNext(flowName, params)

      dispatch({
        type: `flower/${type}`,
        payload
      })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const back = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnPrev(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const reset = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnReset(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const jump = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnNode(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  return {
    flowName,
    nodeId,
    next,
    jump,
    back,
    reset
  }
}

export default useFlower
