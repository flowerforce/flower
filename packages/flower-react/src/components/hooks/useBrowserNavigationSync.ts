import { useEffect } from 'react'
import { useFlowerActions } from '../../types'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'

/**
 * Hook centralizzato per sincronizzare la navigazione browser con Redux
 * @param {function} backAction - Azione Redux da chiamare quando si fa "indietro"
 * @param {function} nextAction - Azione Redux da chiamare quando si fa "avanti"
 */

type UseHistorySyncProps = {
  indexRef: React.MutableRefObject<number>
  backAction: () => ReturnType<useFlowerActions['back']>
  nextAction: () => ReturnType<useFlowerActions['next']>
}
export const useHistorySync = ({
  indexRef,
  backAction,
  nextAction
}: UseHistorySyncProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()

  useEffect(() => {
    // Inizializza lo stato nella history se non esiste
    const initialIndex = window.history.state?.index ?? 0
    indexRef.current = initialIndex
    window.history.replaceState({ index: initialIndex }, '', '')

    const onPopState = (event: PopStateEvent) => {
      const newIndex = window.history.state?.index ?? 0
      if (newIndex > indexRef.current) {
        nextAction()
      }
      if (newIndex < indexRef.current) {
        backAction()
      }
      indexRef.current = newIndex
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [dispatch, backAction, nextAction])
}
