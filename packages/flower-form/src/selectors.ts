import { createSelector } from 'reselect'
import {
  RulesObject,
  FunctionRule,
  FlowerStateUtils,
  FlowerCoreStateFormSelectors
} from '@flowerforce/flower-core'
import _get from 'lodash/get'

const { selectGlobalForm } = FlowerCoreStateFormSelectors

const { getAllData: mapData } = FlowerStateUtils

const selectFlowerForm = selectGlobalForm

const selectFlowerFormNode = (name: string) =>
  createSelector(selectFlowerForm, (form) => {
    return form[name]
  })

// dati nel flow selezionato
const makeSelectFormData = (name: string) =>
  createSelector(selectFlowerFormNode(name), (form) => _get(form, 'data') ?? {})

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(
    makeSelectFormData(name),
    FlowerCoreStateFormSelectors.getDataFromState(id)
  )
const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerFormNode(name), (form) =>
    FlowerCoreStateFormSelectors.makeSelectNodeErrors(form)
  )

const makeSelectNodeFieldTouched = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateFormSelectors.makeSelectNodeFormFieldTouched(fieldId)
  )

const makeSelectNodeFieldFocused = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateFormSelectors.makeSelectNodeFormFieldFocused(fieldId)
  )

const makeSelectNodeFieldDirty = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateFormSelectors.makeSelectNodeFormFieldDirty(fieldId)
  )

const makeSelectNodeFormSubmitted = (name: string, currentNodeId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateFormSelectors.makeSelectNodeFormSubmitted
  )

const getAllData = createSelector(selectGlobalForm, mapData)

const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(
    getAllData,
    selectFlowerFormNode(name),
    FlowerCoreStateFormSelectors.makeSelectFieldError(name, id, validate)
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
    FlowerCoreStateFormSelectors.selectorRulesDisabled(
      id,
      rules,
      keys,
      flowName,
      value
    )
  )

export {
  getAllData,
  makeSelectFormData,
  getDataFromState,
  makeSelectNodeErrors,
  makeSelectNodeFieldTouched,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldDirty,
  makeSelectFieldError,
  makeSelectNodeFormSubmitted
}
