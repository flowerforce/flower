import { useEffect } from 'react'
import { useFlowerActions } from '../../types'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { useHistoryContext } from '@flowerforce/flower-react-history-context'

/**
 * Hook centralizzato per sincronizzare la navigazione browser con Redux
 * @param {function} backAction - Azione Redux da chiamare quando si fa "indietro"
 * @param {function} nextAction - Azione Redux da chiamare quando si fa "avanti"
 */

type UseHistorySyncProps = {
  backAction: () => ReturnType<useFlowerActions['back']>
  nextAction: () => ReturnType<useFlowerActions['next']>
}
export const useHistorySync = ({
  backAction,
  nextAction
}: UseHistorySyncProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()
  const { index, isActive, setIndex } = useHistoryContext()

  useEffect(() => {
    if (!isActive) return
    const initialIndex = window.history.state?.index ?? 0
    setIndex(initialIndex)
    window.history.replaceState({ index: initialIndex, stack: [...(window.history.state?.stack ?? [])] }, '', '')

    const onPopState = (event: PopStateEvent) => {
      const newIndex = window.history.state?.index ?? 0
      if (newIndex > index) {
        nextAction()
      }
      if (newIndex < index) {
        backAction()
      }
      setIndex(newIndex)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [dispatch, backAction, nextAction])
}
