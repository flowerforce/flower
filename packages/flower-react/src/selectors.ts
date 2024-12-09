import { createSelector } from 'reselect'
import {
  Selectors,
  FlowerStateUtils,
  RulesObject,
  FunctionRule
} from '@flowerforce/flower-core'
import _get from 'lodash/get'

const { getAllData: mapData } = FlowerStateUtils

const { selectGlobal } = Selectors

const selectGlobalFlower = (state: any) => {
  return state.flower
}

const selectFlower = (name: string) =>
  createSelector(selectGlobal, Selectors.selectFlower(name))

const selectFlowerFormNode = (name: string, id: string) =>
  createSelector(selectFlower(name), Selectors.selectFlowerFormNode(id))

const selectFlowerHistory = (name: string) =>
  createSelector(selectFlower(name), Selectors.selectFlowerHistory)

const makeSelectNodesIds = (name: string) =>
  createSelector(selectFlower(name), Selectors.makeSelectNodesIds)

const makeSelectStartNodeId = (name: string) =>
  createSelector(selectFlower(name), Selectors.makeSelectStartNodeId)

const makeSelectCurrentNodeId = (name: string) =>
  createSelector(
    selectFlower(name),
    makeSelectStartNodeId(name),
    Selectors.makeSelectCurrentNodeId
  )

const makeSelectPrevNodeRetain = (name: string) =>
  createSelector(
    makeSelectNodesIds(name),
    selectFlowerHistory(name),
    makeSelectCurrentNodeId(name),
    Selectors.makeSelectPrevNodeRetain
  )

const makeSelectCurrentNodeDisabled = (name: string) =>
  createSelector(
    makeSelectNodesIds(name),
    makeSelectCurrentNodeId(name),
    Selectors.makeSelectCurrentNodeDisabled
  )

// dati nel flow selezionato
const getDataByRoot = (name: string) =>
  createSelector(selectGlobal, (state) => _get(state, name))

const getDataByFlow = (name: string) =>
  createSelector(selectFlower(name), Selectors.getDataByFlow)

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) => {
  return createSelector(
    getDataByRoot(name),
    getDataByFlow(name),
    Selectors.getDataFromState(id)
  )
}

const makeSelectNodeErrors = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeErrors
  )

const makeSelectNodeFieldTouched = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeFormFieldTouched(fieldId)
  )

const makeSelectNodeFieldFocused = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeFormFieldFocused(fieldId)
  )

const makeSelectNodeFieldDirty = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeFormFieldDirty(fieldId)
  )

const makeSelectNodeFormSubmitted = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeFormSubmitted
  )

const getAllData = createSelector(selectGlobalFlower, mapData)

const selectFlowerFormCurrentNode = (name: string) =>
  createSelector(
    selectFlower(name),
    makeSelectCurrentNodeId(name),
    (data, current) => {
      return _get(data, ['form', current])
    }
  )

const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(
    getAllData,
    selectGlobal,
    selectFlowerFormCurrentNode(name),
    Selectors.makeSelectFieldError(name, id, validate)
  )

export const selectorRulesDisabled = (
  id: string,
  rules: RulesObject<any> | FunctionRule,
  keys: string[],
  flowName: string,
  value: any,
  currentNode: string
) =>
  createSelector(
    getAllData,
    selectGlobal,
    makeSelectNodeErrors(flowName, currentNode),
    Selectors.selectorRulesDisabled(id, rules, keys, flowName, value)
  )

export {
  selectFlowerHistory,
  makeSelectNodesIds,
  makeSelectCurrentNodeId,
  makeSelectStartNodeId,
  makeSelectCurrentNodeDisabled,
  getAllData,
  getDataByFlow,
  getDataFromState,
  makeSelectNodeErrors,
  makeSelectNodeFieldTouched,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldDirty,
  makeSelectFieldError,
  makeSelectNodeFormSubmitted,
  makeSelectPrevNodeRetain
}
