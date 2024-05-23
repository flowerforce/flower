import React, { useCallback, useContext } from 'react'
import { context } from '../../context'
import useFlower from '../useFlower'
import { FlowerNavigateProps } from '../types/FlowerNavigate'

type UseFlowerNavigateProps = Pick<
  FlowerNavigateProps,
  'flowName' | 'node' | 'route' | 'action'
>
// {
//   flowName?: string | undefined;
//   action?: 'next' | 'back' | 'reset' | 'jump';
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
  node
}: UseFlowerNavigateProps) => {
  const { flowName: flowNameContext } = useContext(context)
  const name = flowName || flowNameContext
  const { next, jump, back, reset } = useFlower({ flowName: name })

  const onNavigate = useCallback(() => {
    switch (action) {
      case 'next':
        next(route)
        return

      case 'jump':
        jump(node!)
        return

      case 'back':
        back(node)
        return

      case 'reset':
        reset(node)
        return

      default:
        next()
        return
    }
  }, [next, jump, back, reset, node, route])

  return {
    onNavigate,
    flowName
  }
}
