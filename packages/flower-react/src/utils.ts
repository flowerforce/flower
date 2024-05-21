import { CoreUtils, Node } from '@flowerforce/flower-core'

// eslint-disable-next-line import/prefer-default-export
export const convertElements = (nodes: Node[]) => {
  const res = CoreUtils.generateNodesForFlowerJson(nodes)
  return res
}
