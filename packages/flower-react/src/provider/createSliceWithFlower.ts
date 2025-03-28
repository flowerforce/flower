// createSlice({
//     name: "myStore",
//     initialState: {
//       gino: 1,
//     } as Record<string, number>,
//     reducers: {
//       add: (state) => ({ ...state, gino: state.gino + 1 }),
//     },
//   });

import {
  createSlice,
  CreateSliceOptions,
  Slice,
  SliceCaseReducers,
  SliceSelectors,
  createAction
} from '@reduxjs/toolkit'
import set from 'lodash/set'

const updateAction = (reducerName: string) =>
  createAction<{ path: string; value: any }>(`${reducerName}/flowerUpdateData`)

export const createSliceWithFlower = <
  State extends object,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string,
  Selectors extends SliceSelectors<State>,
  ReducerPath extends string = Name
>(
  createSliceOptions: CreateSliceOptions<
    State,
    CaseReducers,
    Name,
    ReducerPath,
    Selectors
  >
): Slice<State, CaseReducers, Name, ReducerPath, Selectors> => {
  const { name, reducers } = createSliceOptions

  const updateCase = updateAction(name)

  const slice = createSlice({
    ...createSliceOptions,
    reducers: {
      ...reducers,
      flowerUpdateData: (
        state: any,
        { payload }: ReturnType<typeof updateCase>
      ) => {
        const { path, value } = payload
        set(state, path, value)
      }
    }
  }) as any
  return slice
}
