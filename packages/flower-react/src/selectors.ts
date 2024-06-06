import { createSelector } from 'reselect'
import {
  Selectors,
  FlowerStateUtils,
  RulesObject,
  FunctionRule
} from '@flowerforce/flower-core'

const { getAllData: mapData } = FlowerStateUtils

const { selectGlobal } = Selectors

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
const getDataByFlow = (name: string) =>
  createSelector(selectFlower(name), Selectors.getDataByFlow)

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(getDataByFlow(name), Selectors.getDataFromState(id))

const makeSelectNodeErrors = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeErrors
  )

const makeSelectNodeFormTouched = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name, currentNodeId),
    Selectors.makeSelectNodeFormTouched
  )

const getAllData = createSelector(selectGlobal, mapData)

const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(getAllData, Selectors.makeSelectFieldError(name, id, validate))

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
  makeSelectFieldError,
  makeSelectNodeFormTouched,
  makeSelectPrevNodeRetain
}
