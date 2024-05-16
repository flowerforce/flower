import Flower, {
  FlowerNode,
  FlowerAction,
  FlowerField,
  FlowerRule,
  FlowerRoute,
  FlowerValue,
  useFlower
} from '@flowerforce/flower-react'
import { Input } from './components/Input'
import { Text } from './components/Text'
import { Form } from './components/Form'
import { FlowerFlow } from '@flowerforce/flower-react'
import PaymentFlow from './payment'
import { Example1 } from './Examples/Example1'

const Back = ({ rules }) => {
  const { onPrev } = useFlower()
  return (
    <div style={{ marginTop: 10 }} onClick={() => onPrev()}>
      PREV LOGIN
    </div>
  )
}

const MyButton = ({ rules, flowName }) => {
  const { onNext } = useFlower({ flowName })
  return (
    <FlowerRule rules={rules}>
      <div onClick={() => onNext()}>NEXT</div>
    </FlowerRule>
  )
}

function AppLogin() {
  const { flowName } = useFlower()

  return (
    <div>
      <Flower name="login">
        <FlowerRoute id="start" to={{ step2: null }} />

        <FlowerNode id="step2" to={{ step3: null }}>
          step2
          <MyButton />
          <Back />
        </FlowerNode>

        <FlowerNode id="step3" to={{ payment: null }}>
          step3
          <MyButton />
          <Back />
        </FlowerNode>

        <FlowerFlow id="payment" to={{ exit: null, success: null }}>
          <Back />
          <PaymentFlow />
        </FlowerFlow>

        <FlowerNode id="exit">
          END LOGIN
          <MyButton flowName={flowName} />
          <Back />
        </FlowerNode>

        <FlowerNode id="success">
          END LOGIN
          <MyButton flowName={flowName} />
          <Back />
        </FlowerNode>
      </Flower>
    </div>
  )
}
export default AppLogin
