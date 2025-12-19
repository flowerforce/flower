import { configureStore, createSlice } from '@reduxjs/toolkit'
import { createFlowerRootReducer } from '@flowerforce/flower-react'

type UserRole = 'admin' | 'member'

interface UserState {
  name: string
  role: UserRole
  active: boolean
}

const initialUserState: UserState = {
  name: 'Flower guest',
  role: 'member',
  active: false
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    toggleRole(state) {
      state.role = state.role === 'admin' ? 'member' : 'admin'
    }
  }
})

export const { toggleRole } = userSlice.actions

export const store = configureStore({
  reducer: createFlowerRootReducer({
    user: userSlice.reducer
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
