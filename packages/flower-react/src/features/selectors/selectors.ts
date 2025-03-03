import { createSelector } from 'reselect'
import {
  FlowerCoreStateSelectors,
  FlowerStateUtils,
  RulesObject,
  FunctionRule,
  REDUCER_NAME
} from '@flowerforce/flower-core'
import _get from 'lodash/get'

const { selectGlobal, selectGlobalData } = FlowerCoreStateSelectors

export const selectFlower = (name: string) =>
  createSelector(selectGlobal, FlowerCoreStateSelectors.selectFlower(name))

export const selectFlowerData = selectGlobalData

export const selectFlowerDataNode = (name: string) =>
  createSelector(selectFlowerData, (data) => {
    return data[name]
  })

export const selectFlowerHistory = (name: string) =>
  createSelector(
    selectFlower(name),
    FlowerCoreStateSelectors.selectFlowerHistory
  )

export const makeSelectNodesIds = (name: string) =>
  createSelector(
    selectFlower(name),
    FlowerCoreStateSelectors.makeSelectNodesIds
  )

export const makeSelectStartNodeId = (name: string) =>
  createSelector(
    selectFlower(name),
    FlowerCoreStateSelectors.makeSelectStartNodeId
  )

export const makeSelectCurrentNodeId = (name: string) =>
  createSelector(
    selectFlower(name),
    makeSelectStartNodeId(name),
    FlowerCoreStateSelectors.makeSelectCurrentNodeId
  )

export const makeSelectPrevNodeRetain = (name: string) =>
  createSelector(
    makeSelectNodesIds(name),
    selectFlowerHistory(name),
    makeSelectCurrentNodeId(name),
    FlowerCoreStateSelectors.makeSelectPrevNodeRetain
  )

export const makeSelectCurrentNodeDisabled = (name: string) =>
  createSelector(
    makeSelectNodesIds(name),
    makeSelectCurrentNodeId(name),
    FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled
  )

// dati nel flow selezionato
export const makeSelectData = (name: string) =>
  createSelector(selectFlowerDataNode(name), (data) => data?.data ?? {})

// selettore per recuperare i dati di un flow specifico e id specifico
export const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(
    makeSelectData(name),
    FlowerCoreStateSelectors.getDataFromState(id)
  )
export const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerDataNode(name), (data) =>
    FlowerCoreStateSelectors.makeSelectNodeErrors(data)
  )

export const makeSelectNodeFieldTouched = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerDataNode(name),
    FlowerCoreStateSelectors.makeSelectNodeDataFieldTouched(fieldId)
  )

export const makeSelectNodeFieldFocused = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerDataNode(name),
    FlowerCoreStateSelectors.makeSelectNodeDataFieldFocused(fieldId)
  )

export const makeSelectNodeFieldDirty = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerDataNode(name),
    FlowerCoreStateSelectors.makeSelectNodeDataFieldDirty(fieldId)
  )

export const makeSelectNodeDataSubmitted = (
  name: string,
  currentNodeId: string
) =>
  createSelector(
    selectFlowerDataNode(name),
    FlowerCoreStateSelectors.makeSelectNodeDataSubmitted
  )

export const getAllData = createSelector(
  selectGlobalData,
  FlowerStateUtils.getAllData
)

export const selectFlowerDataCurrentNode = (name: string) =>
  createSelector(
    selectFlower(name),
    makeSelectCurrentNodeId(name),
    (data, current) => {
      return _get(data, [REDUCER_NAME.FLOWER_FLOW, current])
    }
  )

export const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(
    getAllData,
    selectFlowerDataCurrentNode(name),
    FlowerCoreStateSelectors.makeSelectFieldError(name, id, validate)
  )

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
    FlowerCoreStateSelectors.selectorRulesDisabled(
      id,
      rules,
      keys,
      flowName,
      value
    )
  )
