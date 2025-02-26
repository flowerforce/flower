import { createSelector } from 'reselect'
import {
  FlowerCoreStateSelectors,
  FlowerStateUtils,
  RulesObject,
  FunctionRule,
  REDUCER_NAME
} from '@flowerforce/flower-core'
import _get from 'lodash/get'

const { selectGlobal, selectGlobalForm } = FlowerCoreStateSelectors

export const selectFlower = (name: string) =>
  createSelector(selectGlobal, FlowerCoreStateSelectors.selectFlower(name))

export const selectFlowerForm = selectGlobalForm

export const selectFlowerFormNode = (name: string) =>
  createSelector(selectFlowerForm, (data) => {
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
export const makeSelectFormData = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) => data?.data ?? {})

// selettore per recuperare i dati di un flow specifico e id specifico
export const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(
    makeSelectFormData(name),
    FlowerCoreStateSelectors.getDataFromState(id)
  )
export const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) =>
    FlowerCoreStateSelectors.makeSelectNodeErrors(data)
  )

export const makeSelectNodeFieldTouched = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormFieldTouched(fieldId)
  )

export const makeSelectNodeFieldFocused = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormFieldFocused(fieldId)
  )

export const makeSelectNodeFieldDirty = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormFieldDirty(fieldId)
  )

export const makeSelectNodeFormSubmitted = (
  name: string,
  currentNodeId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateSelectors.makeSelectNodeFormSubmitted
  )

export const getAllData = createSelector(
  selectGlobalForm,
  FlowerStateUtils.getAllData
)

export const selectFlowerFormCurrentNode = (name: string) =>
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
