import { useCallback, useContext, useEffect, useMemo } from 'react'
import { context } from '../context'
import {
  makeSelectCurrentNodeId,
  makeSelectIsCurrentNode,
  makeSelectStartNodeId
} from '../selectors'
import { useDispatch, useSelector, useStore } from '../provider'
import { UseFlower } from './types/FlowerHooks'
import { Emitter, devtoolState } from '@flowerforce/flower-core'
import _get from 'lodash/get'
import { useHistoryContext } from '../historyProvider'
import { handleHistoryStackChange } from '../utils'
import { useHistorySync } from '../historyProvider/useBrowserNavigationSync'

type NavigateFunctionParams = string | Record<string, any>

const ACTION_TYPES = {
  back: ['prev', 'prevToNode'],
  jump: ['node', 'node'],
  next: ['next', 'next'],
  restart: ['restart', 'restart'],
  reset: ['reset', 'initializeFromNode']
}
const PAYLAOAD_KEYS_NEEDED = {
  back: ['node'],
  jump: ['node', 'history'],
  next: ['node', 'route', 'data'],
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

const makeActionPayloadOnRestart = makeActionPayload(
  ACTION_TYPES.restart,
  PAYLAOAD_KEYS_NEEDED.restart
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

  const { flowName: flowNameDefault, initialData } = useContext(context)
  const { index, isActive, setIndex, withUrl } = useHistoryContext()

  const store = useStore()

  const flowName = (customFlowName || name || flowNameDefault) as string
  const nodeId = useSelector(makeSelectCurrentNodeId(flowName ?? ''))
  const currentNode = useSelector(makeSelectIsCurrentNode(flowName ?? ''))
  const startId = useSelector(makeSelectStartNodeId(flowName ?? ''))

  useEffect(() => {
    if (currentNode.nodeType === 'FlowerAction') return
    window.history.replaceState(
      { ...window.history.state },
      '',
      withUrl ? `/${flowName}/${nodeId}` : ''
    )
  }, [nodeId, flowName, withUrl, currentNode])

  const stack = useMemo(
    () =>
      window.history.state?.stack?.map((path: string) => path.split('/')[1]),
    [window.history.state?.stack]
  )

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
        typeof param === 'string' ? { route: param } : { data: param }
      const { type, payload } = makeActionPayloadOnNext(flowName, params)

      dispatch({
        type: `flower/${type}`,
        payload
      })

      if (isActive) {
        setIndex(
          handleHistoryStackChange(index, currentNode, flowName, withUrl)
        )
      }

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  /**
   * By doing this, we have a full control over flower navigation from both our buttons and browser back and forward navigation
   * In order to trigger back correctly, trigger a real history back
   * If you use replaceState({ index: 2 }) while at index 3,
   * you visually move to step 2, but the browser still sees you at step 3.
   * As a result:
   *  - The browser's Forward button stays disabled
   *  - No popstate event is triggered
   *  - The history flow is broken
   * Use history.back() instead to preserve proper browser navigation.
   */
  const interceptBack = () => {
    window.history.back()
  }

  const back = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnPrev(
        isActive ? stack?.[stack?.length - 1] ?? flowName : flowName,
        param
      )
      dispatch({
        type: `flower/${type}`,
        payload
      })

      setIndex(index - 1)

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName, stack]
  )

  useHistorySync({ backAction: back, nextAction: next })

  const restart = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnRestart(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

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

      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName, initialData]
  )

  const jump = useCallback(
    (param?: NavigateFunctionParams) => {
      const { type, payload } = makeActionPayloadOnNode(flowName, param)
      dispatch({ type: `flower/${type}`, payload })

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName]
  )

  const getCurrentNodeId = useCallback(
    (customFlowName?: string) => {
      return _get(store.getState(), [
        'flower',
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
    back: isActive ? interceptBack : back,
    reset,
    restart
  }
}

export default useFlower
