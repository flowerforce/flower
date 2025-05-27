import { CoreUtils, INode, Node } from '@flowerforce/flower-core'

// eslint-disable-next-line import/prefer-default-export
export const convertElements = (nodes: Node[]) => {
  const res = CoreUtils.generateNodesForFlowerJson(nodes)
  return res
}

export const handleHistoryStackChange = (
  currentIndex: number,
  currentNode: INode,
  flowName: string,
  withUrl?: boolean
): number => {
  const historyNode = `/${flowName}/${currentNode.nodeId}`

  if (currentNode.nodeType === 'FlowerAction') return currentIndex
  const nextIndex = currentIndex + 1
  if (history.state?.index !== nextIndex) {
    window.history.pushState(
      {
        index: nextIndex,
        stack: [...(window.history.state.stack ?? []), historyNode]
      },
      '',
      withUrl ? historyNode : ''
    )
  }
  return nextIndex
}
