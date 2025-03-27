import React, { useContext, useEffect, useRef } from 'react'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import { flowerActions, makeSelectStartNodeId } from '../features'

function _FlowerStart() {
  const { dispatch, useSelector } = ReduxFlowerProvider.getReduxHooks()
  const one = useRef(false)
  const { name, autostart = true, currentNode } = useContext(FlowerReactContext)
  const startNodeId = useSelector(makeSelectStartNodeId(name ?? ''))

  useEffect(() => {
    if (startNodeId === currentNode && autostart && one.current === false) {
      one.current = true
      dispatch(flowerActions.next({ flowName: name, isStart: true }))

      // if (global.window
      //   // eslint-disable-next-line no-underscore-dangle, no-undef
      //   && global.window.__FLOWER_DEVTOOLS__ && global.window.__FLOWER_DEVTOOLS__AUTO) {
      //   Emitter.emit('flower-devtool-from-client', {
      //     source: 'flower-client',
      //     action: 'START_FLOWER',
      //     name: flowName,
      //   });
      // }
    }
  }, [dispatch, autostart, startNodeId, currentNode, name])

  return null
}

const component = React.memo(_FlowerStart)
component.displayName = 'FlowerStart'

export const FlowerStart = component as unknown as typeof _FlowerStart
