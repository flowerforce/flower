import './styles.css'
import {
  FlowerProvider,
  Flower,
  FlowerNode,
  useFlower
} from '@flowerforce/flower-react'

const Text = ({ text, value, children }: any) => (
  <h1 data-testid="h1">{text || value || children}</h1>
)

const ButtonNext = ({ id = '' }) => {
  const { next } = useFlower()
  return (
    <button data-testid={'btn-next' + id} onClick={() => next()}>
      NEXT
    </button>
  )
}

export function Example15() {
  return (
    <FlowerProvider>
      <Flower
        name="app-test"
        initialData={{ name: 'andrea', surname: 'rossi' }}
      >
        <FlowerNode
          id="step-1"
          to={{
            Success: { rules: { $and: [{ name: { $eq: 'andrea' } }] } },
            Error: { rules: { $and: [{ name: { $eq: 'andrea' } }] } }
          }}
        >
          <div>ciao</div>
          <Text>asdasdasd</Text>
          <ButtonNext />
        </FlowerNode>
        <FlowerNode id="Success">
          <Text>Success</Text>
        </FlowerNode>
        <FlowerNode id="Error">
          <Text>Error</Text>
        </FlowerNode>
      </Flower>
    </FlowerProvider>
  )
}
