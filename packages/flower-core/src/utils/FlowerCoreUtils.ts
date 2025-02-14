import { CoreUtilitiesFunctions } from '../interfaces/CoreInterface'
import { FlowUtils } from './FlowerFlowUtils'
import { FormUtils } from './FlowerFormCoreUtils'

/**
 * Defines a collection of utility functions for processing rules, nodes and graph-like structures
 */
export const CoreUtils: CoreUtilitiesFunctions = {
  ...FlowUtils,
  ...FormUtils
}
