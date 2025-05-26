import { HistoryContextProvider } from '@flowerforce/flower-react-history-context'
import AppFlow from './AppFlow'
import { AppFlowWithCustomReducers } from './AppFlowWithCustomReducer'
import AppForm from './AppForm'

export function MainApp() {
  return (
    <HistoryContextProvider withUrl>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <AppFlow />
        {/* <AppForm /> */}
        {/* <AppFlowWithCustomReducers /> */}
      </div>
    </HistoryContextProvider>
  )
}
