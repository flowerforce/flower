import { CoreReducersFunctions, DataReducersFunctions } from '../../interfaces'
import { FlowerCoreBaseReducers } from './FlowerCoreStateFunctions'
import { FlowerCoreDataReducers } from './FlowerDataStateFunctions'

export const FlowerCoreReducers: DataReducersFunctions & CoreReducersFunctions =
  { ...FlowerCoreBaseReducers, ...FlowerCoreDataReducers }
