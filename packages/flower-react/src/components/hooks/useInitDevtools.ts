import { Emitter } from '@flowerforce/flower-core'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import _get from 'lodash/get'
import { useEffect } from 'react'
import { flowerActions } from '../../features'
import { UseInitDevtoolsProps } from './types'

export const useInitDevtools = ({
  devtoolState,
  setWsDevtools,
  flowName
}: UseInitDevtoolsProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()

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
      //   dispatch(actions.replaceData({ flowName: msg.name, value: msg.data }))
      // }

      // if (msg.action === 'ADD_DATA' && msg.name === flowName) {
      //   dispatch(actions.addData({ flowName: msg.name, value: msg.data }))
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
}
