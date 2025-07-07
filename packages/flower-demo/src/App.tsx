import { HistoryContextProvider } from '@flowerforce/flower-react-history-context'
import { FlowerNavigateTest } from './Examples/FlowerNavigate'
import AppFlow from './AppFlow'


export function MainApp() {
  return (
    <HistoryContextProvider withUrl>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* <FlowerNavigateTest /> */}
        <AppFlow />
        {/* <AppForm /> */}
        {/* <AppFlowWithCustomReducers /> */}
      </div>
    </HistoryContextProvider>
  )
}
