import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { useEffect } from 'react'
import { flowerActions } from '../../features'
import { UseDestroyFlowProps } from './types'

export const useDestroyFlow = ({
  flowName,
  one,
  persist
}: UseDestroyFlowProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()
  useEffect(
    () => () => {
      if (persist) return
      if (one.current === true) {
        one.current = false
        dispatch(flowerActions.destroy({ name: flowName }))
      }
    },
    [dispatch, flowName, persist]
  )
}
