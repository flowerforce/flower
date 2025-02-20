import { useCallback, useContext } from 'react'
import { makeSelectCurrentNodeId, makeSelectStartNodeId } from '../selectors'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import {
  useDispatch,
  useSelector,
  useStore
} from '@flowerforce/flower-react-store'
import { UseFlower } from './types/FlowerHooks'
import { Emitter, REDUCER_NAME, devtoolState } from '@flowerforce/flower-core'
import _get from 'lodash/get'

type NavigateFunctionParams = string | Record<string, any>

const ACTION_TYPES = {
  back: ['prev', 'prevToNode'],
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

const makeActionPayloadOnPrev = makeActionPayload(
  ACTION_TYPES.back,
  PAYLOAD_KEYS_NEEDED.back
)

const makeActionPayloadOnReset = makeActionPayload(
  ACTION_TYPES.reset,
  PAYLOAD_KEYS_NEEDED.reset
)

const makeActionPayloadOnNode = makeActionPayload(
  ACTION_TYPES.jump,
  PAYLOAD_KEYS_NEEDED.jump
)

const makeActionPayloadOnNext = makeActionPayload(
  ACTION_TYPES.next,
  PAYLOAD_KEYS_NEEDED.next
)

const makeActionPayloadOnRestart = makeActionPayload(
  ACTION_TYPES.restart,
  PAYLOAD_KEYS_NEEDED.restart
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
 * - restart
 *
 * @param {string} flowName - first optional parameter
 *
 * @param {string} name - optional parameter, if flowName exist, name is not used
 */
const useFlower: UseFlower = ({ flowName: customFlowName, name } = {}) => {
  const dispatch = useDispatch()

  const { name: flowNameDefault, initialData } = useContext(FlowerReactContext)
  const store = useStore()

  const flowName = (customFlowName || name || flowNameDefault) as string
  const nodeId = useSelector(makeSelectCurrentNodeId(flowName ?? ''))
  const startId = useSelector(makeSelectStartNodeId(flowName ?? ''))

  const emitNavigateEvent = useCallback(
    //TODO check this function is needed
    (params: any) => {
      /* istanbul ignore next */
      // eslint-disable-next-line no-underscore-dangle, no-undef
      if (_get(devtoolState, '__FLOWER_DEVTOOLS__')) {
        Emitter.emit('flower-devtool-from-client', {
          source: 'flower-client',
          action: 'FLOWER_NAVIGATE',
          nodeId,
          name: flowName,
          time: new Date(),
          params
        })
      }
    },
    [flowName, nodeId]
  )

  const next = useCallback(
    (param?: NavigateFunctionParams) => {
      const params =
        typeof param === 'string' ? { route: param } : { dataIn: param }
      const { type, payload } = makeActionPayloadOnNext(flowName, params)
      dispatch({
        type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`,
        payload: {
          ...payload,
          data: store.getState()
        }
      })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName, store]
  )

  const back = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnPrev(flowName, param)
      dispatch({ type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const restart = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnRestart(flowName, param)
      dispatch({ type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const reset = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnReset(
        flowName,
        typeof param === 'string'
          ? { node: param, initialData }
          : {
              ...param,
              initialData
            }
      )

      dispatch({ type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName, initialData]
  )

  const jump = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnNode(flowName, param)
      dispatch({ type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const getCurrentNodeId = useCallback(
    (customFlowName?: string) => {
      return _get(store.getState(), [
        REDUCER_NAME.FLOWER_FLOW,
        customFlowName || flowName,
        'current'
      ])
    },
    [store, flowName]
  )

  return {
    flowName,
    nodeId,
    getCurrentNodeId,
    startId,
    next,
    jump,
    back,
    reset,
    restart
  }
}

export default useFlower
