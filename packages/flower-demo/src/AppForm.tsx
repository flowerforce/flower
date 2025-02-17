import { Example1 } from './Examples/Example1' // Simple example navigation
import { Example2 } from './Examples/Example2' // Simple example navigation with external useFlower
import { Example2v1 } from './Examples/Example2_1' // Simple example navigation with useFlower
import { Example3 } from './Examples/Example3' // Simple example navigation with route
import { Example4 } from './Examples/Example4' // SImple example rule with initialData
import { Example5 } from './Examples/Example5' // SImple example edge rule with input checkbox
import { Example6 } from './Examples/Example6' // Simple example action steps
import { Example6v1 } from './Examples/Example6_1' // Simple example action steps with retain
import { Example6v2 } from './Examples/Example6_2' // Simple example action steps with retain position
import { Example7 } from './Examples/Example7' // Simple example alwaysDisplay on btn
import { Example8 } from './Examples/Example8' // Simple example with FlowerRule
import { Example9 } from './Examples/Example9' // Simple example form
import { Example10 } from './Examples/Example10' // Simple example form
import { Example11 } from './Examples/Example11' // Form async error and hidden
import { Example12 } from './Examples/Example12' // Simple use of FlowerForm only
import { Example13 } from './Examples/Example13' // Simple use of FlowerForm only
import { Example14 } from './Examples/Example14' // Simple use of FlowerForm only
import { Example15 } from './Examples/Example15' // Simple use of FlowerForm only

import { FormProvider } from '@flowerforce/flower-form'

function AppLogin() {
  return (
    <div
      className="Form"
      style={{ display: 'flex', flexDirection: 'column', padding: '50px' }}
    >
      FORM
      <FormProvider>
        <Example14 />
      </FormProvider>
    </div>
  )
}
export default AppLogin
