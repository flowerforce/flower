import { createSelector } from 'reselect'
import {
  FlowerStateUtils,
  FlowerCoreStateDataSelectors
} from '@flowerforce/flower-core'

const { selectGlobalData, selectGlobalReducerByName } =
  FlowerCoreStateDataSelectors

const { getAllData: mapData } = FlowerStateUtils

const selectFlowerData = selectGlobalData

const selectFlowerFormNode = (name: string) =>
  createSelector(selectFlowerData, (data) => {
    return data[name]
  })

// dati nel flow selezionato
const makeSelectData = (name: string) =>
  createSelector(
    selectFlowerFormNode(name),
    selectGlobalReducerByName(name),
    (form, external) => form?.data ?? external ?? {}
  )

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(
    makeSelectData(name),
    FlowerCoreStateDataSelectors.getDataFromState(id)
  )

const makeSelectNodeErrors = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) =>
    FlowerCoreStateDataSelectors.makeSelectNodeErrors(data)
  )

const makeSelectNodeFieldTouched = (
  name: string,
  currentNodeId: string,
  fieldId: string
) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeDataFieldTouched(fieldId)
  )

const makeSelectNodeFieldFocused = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeDataFieldFocused(fieldId)
  )

const makeSelectNodeFieldDirty = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeDataFieldDirty(fieldId)
  )

const makeSelectNodeFormSubmitted = (name: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeDataSubmitted
  )

const getAllData = createSelector(selectGlobalData, mapData)

const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(
    getAllData,
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectFieldError(name, id, validate)
  )

export {
  getAllData,
  makeSelectData,
  getDataFromState,
  makeSelectNodeErrors,
  makeSelectNodeFieldTouched,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldDirty,
  makeSelectFieldError,
  makeSelectNodeFormSubmitted
}
