import { CoreReducersFunctions, FormReducersFunctions } from '../../interfaces'
import { FlowerCoreBaseReducers } from './FlowerCoreStateFunctions'
import { FlowerCoreFormReducers } from './FlowerFormStateFunctions'

export const FlowerCoreReducers: FormReducersFunctions & CoreReducersFunctions =
  { ...FlowerCoreBaseReducers, ...FlowerCoreFormReducers }
