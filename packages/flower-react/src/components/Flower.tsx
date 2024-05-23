import React, {
  Children,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  PropsWithChildren
} from 'react'
import _keyBy from 'lodash/keyBy'
import { Emitter } from '@flowerforce/flower-core'
import { Provider } from '../context'
import _get from 'lodash/get'
import { convertElements } from '../utils'
import { actions } from '../reducer'
import {
  makeSelectStartNodeId,
  selectFlowerHistory,
  makeSelectCurrentNodeId,
  makeSelectCurrentNodeDisabled,
  makeSelectPrevNodeRetain
} from '../selectors'
import { useDispatch, useSelector, useStore } from '../provider'

type FlowerClientProps = PropsWithChildren & {
  name: string
  destroyOnUnmount?: boolean
  startId?: string | null
  initialData?: any
}

/**
 * FlowerClient
 */
const FlowerClient = ({
  children,
  name,
  destroyOnUnmount = true,
  startId = null,
  initialData = {}
}: FlowerClientProps) => {
  const flowName = name

  const dispatch = useDispatch()
  const one = useRef(false)
  const [wsDevtools, setWsDevtools] = useState<boolean>(
    global.window &&
      _get(global.window, '__FLOWER_DEVTOOLS_INITIALIZED__', false)
  )

  // TODO rivedere il giro, potremmo fare le trasformazioni in CoreUtils.generateNodesForFlowerJson
  // eslint-disable-next-line react-hooks/exhaustive-deps, max-len
  const nodes = useMemo(
    () => convertElements(Children.toArray(children) as any),
    [children]
  )
  const nodeById = useMemo(
    () => _keyBy(Children.toArray(children), 'props.id'),
    [children]
  )
  const isInitialized = useSelector(makeSelectStartNodeId(name))
  const history = useSelector(selectFlowerHistory(name))
  const current = useSelector(makeSelectCurrentNodeId(flowName))
  const isDisabled = useSelector(makeSelectCurrentNodeDisabled(flowName))
  const prevFlowerNodeId = useSelector(makeSelectPrevNodeRetain(flowName))
  const store = useStore()

  useEffect(() => {
    if (nodes.length > 0 && one.current === false) {
      one.current = true
      dispatch(
        actions.initNodes({
          name: flowName,
          // @ts-expect-error FIX ME
          nodes,
          startId: startId ?? '',
          persist: destroyOnUnmount === false,
          initialData
        })
      )
    }
  }, [dispatch, flowName, nodes, startId, initialData, destroyOnUnmount])

  /* c8 ignore start */
  useEffect(() => {
    const eventCb = (msg: any) => {
      if (msg.source !== 'flower-devtool') return

      if (
        msg.action === 'FLOWER_EXTENSION_INIT' ||
        msg.action === 'FLOWER_DEVTOOL_WEB_INIT'
      ) {
        setWsDevtools(true)
      }

      if (msg.action === 'SELECTED_NODE' && msg.name === flowName) {
        dispatch(actions.setCurrentNode({ name: msg.name, node: msg.id }))
      }

      if (msg.action === 'REPLACE_DATA' && msg.name === flowName) {
        dispatch(actions.replaceData({ flowName: msg.name, value: msg.data }))
      }

      if (msg.action === 'ADD_DATA' && msg.name === flowName) {
        dispatch(actions.addData({ flowName: msg.name, value: msg.data }))
      }
    }

    /* c8 ignore next */
    if (global.window && _get(global.window, '__FLOWER_DEVTOOLS__')) {
      Emitter.on('flower-devtool-to-client', eventCb)
    }

    return () => {
      /* c8 ignore next */
      if (global.window && _get(global.window, '__FLOWER_DEVTOOLS__')) {
        Emitter.off('flower-devtool-to-client', eventCb)
      }
    }
  }, [dispatch, flowName])
  /* c8 ignore stop */

  useEffect(
    () => () => {
      // unmount function
      if (destroyOnUnmount && one.current === true) {
        one.current = false
        dispatch(actions.destroy({ name: flowName }))
      }
    },
    [dispatch, flowName, destroyOnUnmount]
  )

  /* c8 ignore start */
  useEffect(() => {
    if (
      isInitialized &&
      wsDevtools &&
      global.window &&
      _get(global.window, '__FLOWER_DEVTOOLS__')
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'FLOWER_CLIENT_INIT',
        name: flowName,
        time: new Date(),
        nodeId: isInitialized
      })
    }
  }, [dispatch, flowName, wsDevtools, isInitialized])
  /* c8 ignore stop */

  /* c8 ignore start */
  useEffect(() => {
    if (
      isInitialized &&
      wsDevtools &&
      global.window &&
      _get(global.window, '__FLOWER_DEVTOOLS__')
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_HISTORY',
        name: flowName,
        history
      })
    }
  }, [dispatch, flowName, history, wsDevtools, isInitialized])
  /* c8 ignore stop */

  /* c8 ignore start */
  useEffect(() => {
    if (!current) return
    if (!isInitialized) return
    if (
      isInitialized &&
      wsDevtools &&
      global.window &&
      _get(global.window, '__FLOWER_DEVTOOLS__')
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_CURRENT',
        name: flowName,
        current
      })
    }
  }, [flowName, current, wsDevtools, isInitialized])
  /* c8 ignore stop */

  useEffect(() => {
    if (!current) return
    /* c8 ignore next */
    if (!isInitialized) return

    if (isDisabled) {
      dispatch({ type: 'flower/next', payload: { flowName, disabled: true } })
      // eslint-disable-next-line no-underscore-dangle, no-undef
      /* c8 ignore start */
      if (
        wsDevtools &&
        global.window &&
        _get(global.window, '__FLOWER_DEVTOOLS__')
      ) {
        Emitter.emit('flower-devtool-from-client', {
          source: 'flower-client',
          action: 'FLOWER_NAVIGATE',
          nodeId: current,
          name: flowName,
          time: new Date(),
          params: { action: 'next', payload: { flowName, disabled: true } }
        })
      }
      /* c8 ignore stop */
      return
    }

    // eslint-disable-next-line no-underscore-dangle, no-undef
    /* c8 ignore start */
    if (
      wsDevtools &&
      global.window &&
      _get(global.window, '__FLOWER_DEVTOOLS__')
    ) {
      if (isInitialized === current) return // salto il primo evento
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_SELECTED',
        nodeId: current,
        name: flowName,
        time: new Date()
      })
    }
    /* c8 ignore stop */
  }, [
    dispatch,
    flowName,
    current,
    isDisabled,
    store,
    wsDevtools,
    isInitialized
  ])

  const contextValues = useMemo(
    () => ({
      flowName,
      currentNode: current
    }),
    [flowName, current]
  )

  return isInitialized ? (
    <Provider value={contextValues}>
      {prevFlowerNodeId !== current &&
        typeof prevFlowerNodeId === 'string' &&
        nodeById[prevFlowerNodeId]}
      {!isDisabled && nodeById[current]}
    </Provider>
  ) : null
}

const component = memo(FlowerClient)

export default component
