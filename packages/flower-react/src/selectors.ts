import { createSelector } from 'reselect'
import {
  FlowerCoreStateSelectors,
  FlowerStateUtils,
  RulesObject,
  FunctionRule,
  REDUCER_NAME
} from '@flowerforce/flower-core'
import _get from 'lodash/get'

const { getAllData: mapData } = FlowerStateUtils

const { selectGlobal, selectGlobalForm } = FlowerCoreStateSelectors

const selectFlower = (name: string) =>
  createSelector(selectGlobal, FlowerCoreStateSelectors.selectFlower(name))

const selectFlowerForm = selectGlobalForm

const selectFlowerFormNode = (name: string) =>
  createSelector(selectFlowerForm, (data) => {
    return data[name]
  })

const selectFlowerHistory = (name: string) =>
  createSelector(
    selectFlower(name),
    FlowerCoreStateSelectors.selectFlowerHistory
  )

const makeSelectNodesIds = (name: string) =>
  createSelector(
    selectFlower(name),
    FlowerCoreStateSelectors.makeSelectNodesIds
  )

const makeSelectStartNodeId = (name: string) =>
  createSelector(
    selectFlower(name),
    FlowerCoreStateSelectors.makeSelectStartNodeId
  )

const makeSelectCurrentNodeId = (name: string) =>
  createSelector(
    selectFlower(name),
    makeSelectStartNodeId(name),
    FlowerCoreStateSelectors.makeSelectCurrentNodeId
  )

const makeSelectPrevNodeRetain = (name: string) =>
  createSelector(
    makeSelectNodesIds(name),
    selectFlowerHistory(name),
    makeSelectCurrentNodeId(name),
    FlowerCoreStateSelectors.makeSelectPrevNodeRetain
  )

const makeSelectCurrentNodeDisabled = (name: string) =>
  createSelector(
    makeSelectNodesIds(name),
    makeSelectCurrentNodeId(name),
    FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled
  )

// dati nel flow selezionato
const makeSelectFormData = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) => data?.data ?? {})

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(
    makeSelectFormData(name),
    FlowerCoreStateSelectors.getDataFromState(id)
  )
const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) =>
    FlowerCoreStateSelectors.makeSelectNodeErrors(data)
  )

const makeSelectNodeFieldTouched = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormFieldTouched(fieldId)
  )

const makeSelectNodeFieldFocused = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormFieldFocused(fieldId)
  )

const makeSelectNodeFieldDirty = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormFieldDirty(fieldId)
  )

const makeSelectNodeFormSubmitted = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormSubmitted
  )

const getAllData = createSelector(selectGlobalForm, mapData)

const selectFlowerFormCurrentNode = (name: string) =>
  createSelector(
    selectFlower(name),
    makeSelectCurrentNodeId(name),
    (data, current) => {
      return _get(data, [REDUCER_NAME.FLOWER_FLOW, current])
    }
  )

const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(
    getAllData,
    selectFlowerFormCurrentNode(name),
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

export {
  selectFlowerHistory,
  makeSelectNodesIds,
  makeSelectCurrentNodeId,
  makeSelectStartNodeId,
  makeSelectCurrentNodeDisabled,
  getAllData,
  makeSelectFormData,
  getDataFromState,
  makeSelectNodeErrors,
  makeSelectNodeFieldTouched,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldDirty,
  makeSelectFieldError,
  makeSelectNodeFormSubmitted,
  makeSelectPrevNodeRetain
}
