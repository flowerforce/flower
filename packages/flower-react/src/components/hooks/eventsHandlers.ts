import { devtoolState, Emitter, REDUCER_NAME } from '@flowerforce/flower-core'
import { useEffect } from 'react'
import _get from 'lodash/get'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { flowerActions, selectFlowerHistory } from '../../features'
import {
  UseClientInitEventProps,
  UseFlowerNavigateEventProps,
  UseSetCurrentEventProps,
  UseSetHistoryEventProps
} from './types'

export const useClientInitEvent = ({
  flowName,
  isInitialized,
  wsDevtools
}: UseClientInitEventProps) => {
  const { store } = ReduxFlowerProvider.getReduxHooks()

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
  }, [flowName, wsDevtools, isInitialized, store])
}

export const useSetHistoryEvent = ({
  flowName,
  isInitialized,
  wsDevtools
}: UseSetHistoryEventProps) => {
  const { useSelector } = ReduxFlowerProvider.getReduxHooks()
  const history = useSelector(selectFlowerHistory(flowName))
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
  }, [flowName, history, wsDevtools, isInitialized])
}

export const useSetCurrentEvent = ({
  current,
  flowName,
  isInitialized,
  wsDevtools
}: UseSetCurrentEventProps) => {
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
}

export const useFlowerNavigateEvent = ({
  current,
  flowName,
  isInitialized,
  wsDevtools,
  isDisabled
}: UseFlowerNavigateEventProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()
  useEffect(() => {
    if (!current) return
    /* istanbul ignore next */
    if (!isInitialized) return

    if (isDisabled) {
      dispatch({
        type: `${REDUCER_NAME.FLOWER_FLOW}/next`,
        payload: { flowName, disabled: true }
      })
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
  }, [dispatch, flowName, current, isDisabled, wsDevtools, isInitialized])
}
