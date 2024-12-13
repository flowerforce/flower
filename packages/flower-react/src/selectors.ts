import { createSelector } from 'reselect'
import {
  Selectors,
  FlowerStateUtils,
  RulesObject,
  FunctionRule,
  REDUCER_NAME
} from '@flowerforce/flower-core'
import _get from 'lodash/get'

const { getAllData: mapData } = FlowerStateUtils

const { selectGlobal, selectGlobalForm } = Selectors

const selectFlower = (name: string) =>
  createSelector(selectGlobal, Selectors.selectFlower(name))

const selectFlowerForm = selectGlobalForm

const selectFlowerFormNode = (name: string) =>
  createSelector(selectFlowerForm, (form) => {
    return form[name]
  })

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
const makeSelectFormData = (name: string) =>
  createSelector(selectFlowerFormNode(name), (form) => _get(form, 'data') ?? {})

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(makeSelectFormData(name), Selectors.getDataFromState(id))
const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerFormNode(name), (form) =>
    Selectors.makeSelectNodeErrors(form)
  )

const makeSelectNodeFieldTouched = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    Selectors.makeSelectNodeFormFieldTouched(fieldId)
  )

const makeSelectNodeFieldFocused = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    Selectors.makeSelectNodeFormFieldFocused(fieldId)
  )

const makeSelectNodeFieldDirty = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    Selectors.makeSelectNodeFormFieldDirty(fieldId)
  )

const makeSelectNodeFormSubmitted = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    Selectors.makeSelectNodeFormSubmitted
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
    Selectors.makeSelectFieldError(name, id, validate)
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
    Selectors.selectorRulesDisabled(id, rules, keys, flowName, value)
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
