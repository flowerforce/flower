/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
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
import { Emitter, devtoolState } from '@flowerforce/flower-core'
import { FlowerReactProvider } from '@flowerforce/flower-react-context'
import _get from 'lodash/get'
import { convertElements } from '../utils'
import { actions as flowerActions } from '../reducer/flowerReducer'
import {
  makeSelectStartNodeId,
  selectFlowerHistory,
  makeSelectCurrentNodeId,
  makeSelectCurrentNodeDisabled,
  makeSelectPrevNodeRetain
} from '../selectors'
import {
  useDispatch,
  useSelector,
  useStore
} from '@flowerforce/flower-react-store'

type FlowerInitalState = {
  startId?: string
  current?: string
  history?: string[]
}

type FlowerClientProps = PropsWithChildren & {
  name: string
  destroyOnUnmount?: boolean
  startId?: string | null
  initialState?: FlowerInitalState
}

/**
 * FlowerClient
 */
const FlowerClient = ({
  children,
  name,
  destroyOnUnmount = true,
  startId = null,
  initialState = {}
}: FlowerClientProps) => {
  const flowName = name

  const dispatch = useDispatch()
  const one = useRef(false)
  const [wsDevtools, setWsDevtools] = useState<boolean>(
    devtoolState && _get(devtoolState, '__FLOWER_DEVTOOLS_INITIALIZED__', false)
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
        flowerActions.initNodes({
          name: flowName,
          // @ts-expect-error FIX ME
          nodes,
          startId: startId ?? '',
          persist: destroyOnUnmount === false,
          initialState
        })
      )
    }
  }, [dispatch, flowName, nodes, startId, destroyOnUnmount, initialState])

  useEffect(() => {
    /* istanbul ignore next */
    const eventCb = (msg: any) => {
      if (msg.source !== 'flower-devtool') return

      if (
        msg.action === 'FLOWER_EXTENSION_INIT' ||
        msg.action === 'FLOWER_DEVTOOL_WEB_INIT'
      ) {
        setWsDevtools(true)
      }

      if (msg.action === 'SELECTED_NODE' && msg.name === flowName) {
        dispatch(flowerActions.setCurrentNode({ name: msg.name, node: msg.id }))
      }

      // if (msg.action === 'REPLACE_DATA' && msg.name === flowName) {
      //   dispatch(
      //     formActions.replaceData({ flowName: msg.name, value: msg.data })
      //   )
      // }

      // if (msg.action === 'ADD_DATA' && msg.name === flowName) {
      //   dispatch(formActions.addData({ flowName: msg.name, value: msg.data }))
      // }
    }

    /* istanbul ignore next */
    if (devtoolState && _get(devtoolState, '__FLOWER_DEVTOOLS__')) {
      Emitter.on('flower-devtool-to-client', eventCb)
    }

    return () => {
      /* istanbul ignore next */
      if (devtoolState && _get(devtoolState, '__FLOWER_DEVTOOLS__')) {
        Emitter.off('flower-devtool-to-client', eventCb)
      }
    }
  }, [dispatch, flowName])

  useEffect(
    () => () => {
      // unmount function
      if (destroyOnUnmount && one.current === true) {
        one.current = false
        dispatch(flowerActions.destroy({ name: flowName }))
      }
    },
    [dispatch, flowName, destroyOnUnmount]
  )

  useEffect(() => {
    /* istanbul ignore next */
    if (
      isInitialized &&
      wsDevtools &&
      devtoolState &&
      _get(devtoolState, '__FLOWER_DEVTOOLS__')
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'FLOWER_CLIENT_INIT',
        name: flowName,
        time: new Date(),
        nodeId: isInitialized,
        getState: store.getState
      })
    }
  }, [dispatch, flowName, wsDevtools, isInitialized, store])

  useEffect(() => {
    /* istanbul ignore next */
    if (
      isInitialized &&
      wsDevtools &&
      devtoolState &&
      _get(devtoolState, '__FLOWER_DEVTOOLS__')
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_HISTORY',
        name: flowName,
        history
      })
    }
  }, [dispatch, flowName, history, wsDevtools, isInitialized])

  useEffect(() => {
    if (!current) return
    /* istanbul ignore next */
    if (!isInitialized) return
    /* istanbul ignore next */
    if (
      isInitialized &&
      wsDevtools &&
      devtoolState &&
      _get(devtoolState, '__FLOWER_DEVTOOLS__')
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_CURRENT',
        name: flowName,
        current
      })
    }
  }, [flowName, current, wsDevtools, isInitialized])

  useEffect(() => {
    if (!current) return
    /* istanbul ignore next */
    if (!isInitialized) return

    if (isDisabled) {
      dispatch(flowerActions.next({ flowName }))
      // eslint-disable-next-line no-underscore-dangle, no-undef
      /* istanbul ignore next */
      if (
        wsDevtools &&
        devtoolState &&
        _get(devtoolState, '__FLOWER_DEVTOOLS__')
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
      return
    }

    // eslint-disable-next-line no-underscore-dangle, no-undef
    /* istanbul ignore next */
    if (
      wsDevtools &&
      devtoolState &&
      _get(devtoolState, '__FLOWER_DEVTOOLS__')
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
  }, [
    dispatch,
    flowName,
    current,
    isDisabled,
    store,
    wsDevtools,
    isInitialized
  ])

  const currentNodeId = prevFlowerNodeId || current

  const contextValues = useMemo(
    () => ({
      name: flowName,
      currentNode: current
    }),
    [flowName, current]
  )

  const prevContextValues = useMemo(
    () => ({
      name: flowName,
      currentNode: currentNodeId
    }),
    [flowName, currentNodeId]
  )

  return isInitialized ? (
    <>
      <FlowerReactProvider value={prevContextValues}>
        {nodeById[currentNodeId]}
      </FlowerReactProvider>
      <FlowerReactProvider value={contextValues}>
        {!isDisabled && current !== currentNodeId && nodeById[current]}
      </FlowerReactProvider>
    </>
  ) : null
}

export default memo(FlowerClient)
