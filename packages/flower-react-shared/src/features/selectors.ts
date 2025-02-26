import { createSelector } from 'reselect'
import {
  RulesObject,
  FunctionRule,
  FlowerStateUtils,
  FlowerCoreStateDataSelectors
} from '@flowerforce/flower-core'

const { selectGlobalForm } = FlowerCoreStateDataSelectors

const { getAllData: mapData } = FlowerStateUtils

const selectFlowerForm = selectGlobalForm

const selectFlowerFormNode = (name: string) =>
  createSelector(selectFlowerForm, (data) => {
    return data[name]
  })

const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) =>
    FlowerCoreStateDataSelectors.makeSelectNodeErrors(data)
  )

const getAllData = createSelector(selectGlobalForm, mapData)

export const selectorRulesDisabled = (
  id: string,
  rules: RulesObject<any> | FunctionRule,
  keys: string[],
  flowName: string,
  value: any
) =>
  createSelector(
    getAllData,
    makeSelectNodeErrors(flowName),
    FlowerCoreStateDataSelectors.selectorRulesDisabled(
      id,
      rules,
      keys,
      flowName,
      value
    )
  )
