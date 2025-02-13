import { CoreReducersFunctions, FormReducersFunctions } from '../../interfaces'
import { FlowerCoreBaseReducers } from './FlowerCoreStateFunctions'
import { FlowerCoreDataReducers } from './FlowerFormStateFunctions'

export const FlowerCoreReducers: FormReducersFunctions & CoreReducersFunctions =
  { ...FlowerCoreBaseReducers, ...FlowerCoreDataReducers }
