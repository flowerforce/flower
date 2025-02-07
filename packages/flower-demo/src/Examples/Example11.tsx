import {
  FlowerNavigate,
  FlowerNode,
  FlowerAction,
  useFlower,
  Flower
} from '@flowerforce/flower-react'
import {
  FlowerForm,
  FlowerField,
  FlowerValue,
  useFlowerForm
} from '@flowerforce/flower-form'

import { useEffect } from 'react'
import './styles.css'

/**
 * Here we are using restart action to reset all not initial datas, form state and returns to first node
 */

const Form = ({ flowName }: any) => {
  const { getData } = useFlowerForm(flowName)
  useEffect(() => {
    getData()
    // console.log("🚀 ~ Form ~ getData:", getData())
  }, [getData])

  return null //errors && errors.join(',')
}
const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>
const Input = ({ onChange, value = '', name, label }: any) => {
  return (
    <>
      <Text text={label} />
      <input
        data-testid={name || 'input'}
        name={name}
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
      />
    </>
  )
}

const ButtonNext = ({ id = '' }: any) => {
  const { next } = useFlower()
  return (
    <button data-testid={'btn-next' + id} onClick={() => next()}>
      NEXT
    </button>
  )
}

const ButtonBack = ({ id = '' }: any) => {
  const { back } = useFlower()
  return (
    <button data-testid={'btn-back' + id} onClick={() => back()}>
      BACK
    </button>
  )
}
const InitState = ({ state, path, flowName }: any) => {
  const { next } = useFlower()
  const { setData, getData } = useFlowerForm(flowName)
  useEffect(() => {
    setData(state, path)
    // console.log(getData())
    next()
  }, [next, setData, getData, state, path])
  return '...'
}

export function Example11() {
  return (
    <Flower name="example11">
      <FlowerNode
        id="node-test"
        to={{
          success: {
            rules: {
              $and: [{ '$form.isValid': { $eq: true } }]
            }
          },
          error: {
            rules: { $and: [{ '^form-test.name': { $exists: false } }] }
          }
        }}
      >
        <FlowerField
          id="name"
          validate={[
            {
              message: 'is equal',
              // rules: { $and: [{ name: { $eq: '$ref:sourceName' } }] }
              rules: { $and: [{ name: { $eq: 'andrea' } }] }
            }
          ]}
        >
          <Input label="name" />
        </FlowerField>
        <FlowerField
          id="surname"
          validate={[
            {
              message: 'is equal',
              rules: { $and: [{ surname: { $eq: 'rossi' } }] }
            }
          ]}
        >
          <Input label="surname" />
        </FlowerField>
        <ButtonNext />
      </FlowerNode>
      <FlowerNode id="success">
        <div style={{ background: 'green' }}>
          <Text text="SUCCESS" />
          <FlowerValue id="name">
            <Text />
            <ButtonBack />
          </FlowerValue>
        </div>
      </FlowerNode>
      <FlowerNode id="error">
        <Form />
        <Text text="error" />
        <ButtonBack />
      </FlowerNode>
    </Flower>
  )
}

const ComponentAction = () => {
  const { next } = useFlower()
  const { getData } = useFlowerForm()

  useEffect(() => {
    // get form data
    const formData = getData()

    try {
      // * do your staff here - api call etc **
      // example setTimout to simulate delay api call
      setTimeout(() => {
        //  navigate to success step
        next('onSuccess')
      }, 500)
    } catch (error) {
      // navigate to error step
      next('onError')
    }
  }, [next, getData])

  return <span className="loader"></span>
}
