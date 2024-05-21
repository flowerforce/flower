import Flower, {
  FlowerNode,
  useFlower,
  FlowerField,
  useFlowerForm,
  FlowerValue,
  FlowerRule,
  FlowerFlow
} from '@flowerforce/flower-react'
import { useCallback, useState } from 'react'

const abc = { a: 1 }

const PaySimple = () => {
  const { next } = useFlower()

  return (
    <div>
      <input name="cc" />
      <button onClick={() => next('onProcessPaypal')}>PAYPAL</button>
      <button onClick={() => next('onProcessStripe')}>STRIPE</button>
    </div>
  )
}

const Pay = () => {
  const { next } = useFlower()
  const { errors } = useFlowerForm()

  const Action = useCallback(() => {
    next()
  }, [next])

  return (
    <div>
      <button onClick={Action}>NEXT</button>
      <pre>{JSON.stringify(errors, 2, 1)}</pre>
    </div>
  )
}

const NextParent = ({ flowName }) => {
  const { next } = useFlower({ flowName })

  const Action = useCallback(() => {
    next()
  }, [next])

  return (
    <div>
      <button onClick={Action}>NEXT</button>
    </div>
  )
}

const ProcessPaypal = () => {
  const { back } = useFlower()

  return (
    <div>
      <button onClick={() => back()}></button>
    </div>
  )
}

const ProcessStripe = () => {
  const { back } = useFlower()

  return (
    <div>
      <button onClick={() => back()}></button>
    </div>
  )
}

const Back = ({ rules }) => {
  const { back } = useFlower()
  return (
    <div style={{ marginTop: 10 }} onClick={() => back()}>
      PREV PAY
    </div>
  )
}
const Stepper = () => {
  return (
    <FlowerValue id="payment" flowName="payment">
      {({ value }) => <p>-{value}-</p>}
    </FlowerValue>
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { flowName } = useFlower()
  return (
    <div>
      <Flower name="payment">
        <FlowerNode id="pay" to={{ success: null, error: null }}>
          PAGA
          <Pay />
        </FlowerNode>

        <FlowerNode id="success">
          OK
          <Back />
          <NextParent flowName={flowName} />
        </FlowerNode>

        <FlowerNode id="error">
          KO
          <Back />
          <NextParent flowName={flowName} />
        </FlowerNode>
      </Flower>
    </div>
  )
}
