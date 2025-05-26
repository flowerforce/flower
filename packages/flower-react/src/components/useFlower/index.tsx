import { useCallback, useContext, useEffect, useMemo } from 'react'
import {
  makeSelectStartNodeId,
  makeSelectCurrentNodeId,
  makeSelectIsCurrentNode
} from '../../features'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { UseFlower } from '../../types'
import { Emitter, REDUCER_NAME, devtoolState } from '@flowerforce/flower-core'
import _get from 'lodash/get'
import {
  makeActionPayloadOnNext,
  makeActionPayloadOnNode,
  makeActionPayloadOnBack,
  makeActionPayloadOnReset,
  makeActionPayloadOnRestart,
  handleHistoryStackChange
} from './utils'
import { useHistorySync } from '../hooks/useBrowserNavigationSync'
import { useHistoryContext } from '@flowerforce/flower-react-history-context'

type NavigateFunctionParams = string | Record<string, any>

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
export const useFlower: UseFlower = ({
  flowName: customFlowName,
  name
} = {}) => {
  const { name: flowNameDefault, initialData } = useContext(FlowerReactContext)

  const { index, isActive, setIndex, withUrl } = useHistoryContext()

  const { store, dispatch, useSelector } = ReduxFlowerProvider.getReduxHooks()

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
        typeof param === 'string' ? { route: param } : { dataIn: param }
      const { type, payload } = makeActionPayloadOnNext(flowName, params)
      dispatch({
        type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`,
        payload: { ...payload, data: store.getState() }
      })

      if (isActive) {
        setIndex(
          handleHistoryStackChange(index, currentNode, flowName, withUrl)
        )
      }

      emitNavigateEvent({ type, payload })
    },
    [dispatch, emitNavigateEvent, flowName, store]
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
      const { type, payload } = makeActionPayloadOnBack(
        isActive ? (stack?.[stack?.length - 1] ?? flowName) : flowName,
        param
      )
      dispatch({
        type: `${REDUCER_NAME.FLOWER_FLOW}/${type}`,
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
          : { ...param, initialData }
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
    back: isActive ? interceptBack : back,
    reset,
    restart
  }
}
