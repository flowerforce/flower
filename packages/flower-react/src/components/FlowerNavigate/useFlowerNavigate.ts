/* eslint-disable */
import React, { useCallback, useContext } from 'react';
import { FlowerCoreContext } from '../../context';
import useFlower from '../useFlower';
import {
  FlowerNavigateProps,
  Route,
  RouteNode,
  RoutePrev,
  RouteReset,
} from '../types/FlowerNavigate';

type UseFlowerNavigateProps = Pick<
  FlowerNavigateProps,
  'flowName' | 'node' | 'route' | 'action'
>;
// {
//   flowName?: string | undefined;
//   action?: 'onNext' | 'onPrev' | 'onReset' | 'onNode';
// } & (
//   | {
//       node?: undefined;
//       route?: Route;
//     }
//   | {
//       node?: RoutePrev;
//       route?: undefined;
//     }
//   | {
//       node?: RouteReset;
//       route?: undefined;
//     }
//   | {
//       node?: RouteNode;
//       route?: undefined;
//     }
// );

export const useFlowerNavigate = ({
  flowName,
  action,
  route,
  node,
}: UseFlowerNavigateProps) => {
  const { flowName: flowNameContext } = useContext(FlowerCoreContext);
  const name = flowName || flowNameContext;
  const { onNext, onNode, onPrev, onReset } = useFlower({ flowName: name });

  const onNavigate = useCallback(() => {
    switch (action) {
      case 'onNext':
        onNext(route);
        return;

      case 'onNode':
        onNode(node!);
        return;

      case 'onPrev':
        onPrev(node);
        return;

      case 'onReset':
        onReset(node);
        return;

      default:
        onNext();
        return;
    }
  }, [onNext, onNode, onPrev, onReset, node, route]);

  return {
    onNavigate,
    flowName,
  };
};
