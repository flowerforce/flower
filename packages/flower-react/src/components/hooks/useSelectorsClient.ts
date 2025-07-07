import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import {
  makeSelectCurrentNodeDisabled,
  makeSelectCurrentNodeId,
  makeSelectPrevNodeRetain,
  makeSelectStartNodeId
} from '../../features'

export const useSelectorsClient = (flowName: string) => {
  const { useSelector } = ReduxFlowerProvider.getReduxHooks()
  const isInitialized = useSelector(makeSelectStartNodeId(flowName))
  const current = useSelector(makeSelectCurrentNodeId(flowName))
  const isDisabled = useSelector(makeSelectCurrentNodeDisabled(flowName))
  const prevFlowerNodeId = useSelector(makeSelectPrevNodeRetain(flowName))

  return {
    isInitialized,
    current,
    isDisabled,
    prevFlowerNodeId
  }
}
