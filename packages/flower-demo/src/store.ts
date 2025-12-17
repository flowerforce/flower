import { configureStore, createSlice } from '@reduxjs/toolkit'
import { reducerFlower } from '@flowerforce/flower-react'

type UserRole = 'admin' | 'member'

interface UserState {
  name: string
  role: UserRole
}

const initialUserState: UserState = {
  name: 'Flower guest',
  role: 'member'
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
  reducer: {
    ...reducerFlower,
    user: userSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
