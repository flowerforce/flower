import { useCallback, useContext } from 'react'
import { FlowerCoreContext } from '../context'
import { makeSelectCurrentNodeId } from '../selectors'
import { useDispatch, useSelector } from '../provider'
import { UseFlower } from './types/FlowerHooks'

type NavigateFunctionParams = string | Record<string, any>

const ACTION_TYPES = {
  onPrev: ['prev', 'prevToNode'],
  onReset: ['reset', 'initializeFromNode'],
  onNode: ['node', 'node'],
  onNext: ['next', 'next']
}
const PAYLAOAD_KEYS_NEEDED = {
  onPrev: ['node'],
  onReset: ['node'],
  onNode: ['node', 'history'],
  onNext: ['node', 'route', 'data']
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
  ACTION_TYPES.onPrev,
  PAYLAOAD_KEYS_NEEDED.onPrev
)

const makeActionPayloadOnReset = makeActionPayload(
  ACTION_TYPES.onReset,
  PAYLAOAD_KEYS_NEEDED.onReset
)

const makeActionPayloadOnNode = makeActionPayload(
  ACTION_TYPES.onNode,
  PAYLAOAD_KEYS_NEEDED.onNode
)

const makeActionPayloadOnNext = makeActionPayload(
  ACTION_TYPES.onNext,
  PAYLAOAD_KEYS_NEEDED.onNext
)
/** This hook allows you to read flow informations, such as the flowName and ID of the current node.
 *
 * It also exposes all the functions to navigate within the flow:
 *
 * - onNext
 *
 * - onPrev
 *
 * - onNode
 *
 * - onReset
 *
 *
 * @param {string} flowName - first optional parameter
 *
 * @param {string} name - optional parameter, if flowName exist, name is not used
 */
const useFlower: UseFlower = ({ flowName: customFlowName, name } = {}) => {
  const dispatch = useDispatch()

  const { flowName: flowNameDefault } = useContext(FlowerCoreContext)

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

  const onNext = useCallback(
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

  const onPrev = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnPrev(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const onReset = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnReset(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const onNode = useCallback(
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
    onNext,
    onNode,
    onPrev,
    onReset
  }
}

export default useFlower
