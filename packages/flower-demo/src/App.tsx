import AppFlow from './AppFlow'
import { AppFlowWithCustomReducers } from './AppFlowWithCustomReducer'
import AppForm from './AppForm'

export function MainApp() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* <AppFlow /> */}
      <AppForm />
      <AppFlowWithCustomReducers />
    </div>
  )
}
