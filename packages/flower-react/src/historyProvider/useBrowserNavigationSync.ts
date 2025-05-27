import { useEffect } from 'react'
import { useDispatch } from '../provider'
import { useHistoryContext } from './HistoryProvider'

/**
 * Hook centralizzato per sincronizzare la navigazione browser con Redux
 * @param {function} backAction - Azione Redux da chiamare quando si fa "indietro"
 * @param {function} nextAction - Azione Redux da chiamare quando si fa "avanti"
 */

type UseHistorySyncProps = {
  backAction: () => void
  nextAction: () => void
}
export const useHistorySync = ({
  backAction,
  nextAction
}: UseHistorySyncProps) => {
  const dispatch = useDispatch()
  const { index, isActive, setIndex, withUrl } = useHistoryContext()

  useEffect(() => {
    if (!isActive) return
    const initialIndex = window.history.state?.index ?? 0
    setIndex(initialIndex)
    window.history.replaceState(
      { index: initialIndex, stack: [...(window.history.state?.stack ?? [])] },
      withUrl ? '/' : '',
      ''
    )

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
