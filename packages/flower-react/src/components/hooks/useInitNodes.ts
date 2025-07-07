import { useEffect } from 'react'
import { flowerDataActions, ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { flowerActions } from '../../features'
import { UseInitNodesProps } from './types'

export const useInitNodes = ({
  one,
  nodes,
  name,
  startId,
  persist = false,
  initialData,
  initialState = {}
}: UseInitNodesProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()

  useEffect(() => {
    if (nodes.length > 0 && one.current === false) {
      one.current = true
      dispatch(
        flowerActions.initNodes({
          name,
          nodes,
          startId: startId ?? '',
          persist,
          initialState
        })
      )
    }
    if (initialData) {
      dispatch(
        flowerDataActions.initData({
          rootName: name,
          initialData: initialData ?? {}
        })
      )
    }
  }, [dispatch, name, nodes, startId, initialData, initialState, persist])
}