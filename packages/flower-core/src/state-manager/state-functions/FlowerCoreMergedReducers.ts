import { CoreReducersFunctions, FormReducersFunctions } from '../../interfaces'
import { FlowerCoreBaseReducers } from './FlowerCoreStateFunctions'
import { FlowerCoreDataReducers } from './FlowerDataStateFunctions'

export const FlowerCoreReducers: FormReducersFunctions & CoreReducersFunctions =
  { ...FlowerCoreBaseReducers, ...FlowerCoreDataReducers }
