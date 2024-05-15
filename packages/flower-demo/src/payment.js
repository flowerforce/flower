import Flower, {
  FlowerNode,
  useFlower,
  FlowerField,
  useFlowerForm,
  FlowerValue,
  FlowerRule,
  FlowerFlow,
} from '@flowerforce/flower-react'
import { useCallback, useState } from 'react'

const abc = { a: 1 }

const PaySimple = () => {
  const { onNext } = useFlower()

  return (
    <div>
      <input name="cc" />
      <button onClick={() => onNext('onProcessPaypal')}>PAYPAL</button>
      <button onClick={() => onNext('onProcessStripe')}>STRIPE</button>
    </div>
  )
}

const Pay = () => {
  const { onNext } = useFlower()
  const { errors } = useFlowerForm()

  const Action = useCallback(() => {
    onNext()
  }, [onNext])

  return (
    <div>
      <button onClick={Action}>NEXT</button>
      <pre>{JSON.stringify(errors, 2, 1)}</pre>
    </div>
  )
}

const NextParent = ({ flowName }) => {
  const { onNext } = useFlower({ flowName })

  const Action = useCallback(() => {
    onNext()
  }, [onNext])

  return (
    <div>
      <button onClick={Action}>NEXT</button>
    </div>
  )
}

const ProcessPaypal = () => {
  const { onPrev } = useFlower()

  return (
    <div>
      <button onClick={() => onPrev()}></button>
    </div>
  )
}

const ProcessStripe = () => {
  const { onPrev } = useFlower()

  return (
    <div>
      <button onClick={() => onPrev()}></button>
    </div>
  )
}

const Back = ({ rules }) => {
  const { onPrev } = useFlower()
  return (
    <div style={{ marginTop: 10 }} onClick={() => onPrev()}>
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
