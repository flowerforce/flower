import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from '@flowerforce/flower-react-store'
import { makeSelectStartNodeId } from '../selectors'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import { actions as flowerActions } from '../reducer/flowerReducer'

function FlowerStart() {
  const dispatch = useDispatch()
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

const component = React.memo(FlowerStart)
component.displayName = 'FlowerStart'

export default component
