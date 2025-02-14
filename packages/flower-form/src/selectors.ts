import { createSelector } from 'reselect'
import {
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

// dati nel flow selezionato
const makeSelectFormData = (name: string) =>
  createSelector(selectFlowerFormNode(name), (data) => data?.data ?? {})

// selettore per recuperare i dati di un flow specifico e id specifico
const getDataFromState = (name: string, id: string | string[]) =>
  createSelector(
    makeSelectFormData(name),
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
    FlowerCoreStateDataSelectors.makeSelectNodeFormFieldTouched(fieldId)
  )

const makeSelectNodeFieldFocused = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeFormFieldFocused(fieldId)
  )

const makeSelectNodeFieldDirty = (name: string, fieldId: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeFormFieldDirty(fieldId)
  )

const makeSelectNodeFormSubmitted = (name: string) =>
  createSelector(
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectNodeFormSubmitted
  )

const getAllData = createSelector(selectGlobalForm, mapData)

const makeSelectFieldError = (name: string, id: string, validate: any) =>
  createSelector(
    getAllData,
    selectFlowerFormNode(name),
    FlowerCoreStateDataSelectors.makeSelectFieldError(name, id, validate)
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
