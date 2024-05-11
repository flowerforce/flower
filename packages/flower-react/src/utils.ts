import { CoreUtils, Node } from '@flowerforce/flower-core';

export const convertElements = (nodes: Node[]) => {
  const res = CoreUtils.generateNodesForFlowerJson(nodes);
  return res;
};
