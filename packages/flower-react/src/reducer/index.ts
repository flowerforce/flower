import { reducerFlower as historyReducerFlower } from './flowerReducer'
import { reducerFlowerForm } from './formReducer'

export const reducerFlower = {
  flower: historyReducerFlower,
  form: reducerFlowerForm
}
