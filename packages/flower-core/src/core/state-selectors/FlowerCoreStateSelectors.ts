import _get from 'lodash/get'
import { IFlowerSelectors } from '../../interfaces/SelectorsInterface'

export const FlowerCoreStateBaseSelectors: IFlowerSelectors = {
  selectGlobal: (state) => state && state.flower,
  selectFlower: (name) => (state) => _get(state, [name]),
  selectFlowerFormNode: (id) => (state) => _get(state, ['form', id]),
  selectFlowerHistory: (flower) => _get(flower, ['history'], []),
  makeSelectNodesIds: (flower) => _get(flower, ['nodes']),
  makeSelectStartNodeId: (flower) => _get(flower, ['startId']),
  makeSelectCurrentNodeId: (flower, startNodeId) =>
    _get(flower, ['current']) || startNodeId,
  makeSelectCurrentNodeDisabled: (nodes, current) =>
    !!_get(nodes, [current, 'disabled']),
  makeSelectPrevNodeRetain: (nodes, history, current) => {
    if (!nodes) return
    const prevFlowerNode = [...history].reverse().find((el) => {
      const { nodeType, retain } = nodes[el]
      return nodeType === 'FlowerNode' || retain
    })
    // eslint-disable-next-line consistent-return
    if (nodes[current].nodeType === 'FlowerNode' || nodes[current].retain)
      return
    if (!prevFlowerNode) return
    if (nodes[prevFlowerNode] && nodes[prevFlowerNode].disabled) return
    // eslint-disable-next-line consistent-return
    return nodes[prevFlowerNode] && nodes[prevFlowerNode].retain
      ? prevFlowerNode
      : undefined
  }
}
