import { DataSelectors } from '@flowerforce/flower-react-store'

export const {
  getAllData,
  getDataFromState,
  makeSelectFieldError,
  makeSelectFormData,
  makeSelectNodeErrors,
  makeSelectNodeFieldDirty,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldTouched,
  makeSelectNodeFormSubmitted
} = DataSelectors
