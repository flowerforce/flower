import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch, useSelector, useStore } from '../provider'
import { context } from '../context'
import { makeSelectStartNodeId } from '../selectors'

function FlowerStart() {
  const dispatch = useDispatch()
  const one = useRef(false)
  const { flowName, autostart = true, currentNode } = useContext(context)
  const startNodeId = useSelector(makeSelectStartNodeId(flowName ?? ''))
  const store = useStore()

  useEffect(() => {
    if (startNodeId === currentNode && autostart && one.current === false) {
      one.current = true
      dispatch({
        type: 'flower/next',
        payload: { flowName, isStart: true, rootState: store.getState() }
      })

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
  }, [dispatch, autostart, startNodeId, currentNode, flowName, store])

  return null
}

const component = React.memo(FlowerStart)
component.displayName = 'FlowerStart'

export default component
