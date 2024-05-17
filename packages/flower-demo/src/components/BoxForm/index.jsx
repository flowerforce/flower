import React from 'react'
import Flower, {
  FlowerImport,
  FlowerField,
  FlowerNode,
  FlowerValue,
  useFlowerForm,
  useSelector,
  getDataByFlow,
  FlowerRule,
  useFlower
} from '@flowerforce/flower-react'
import { FormStep1 } from './container'
import { FlowerFlow } from '@flowerforce/flower-react'
import Login from '../../App'
import { Button, Result } from 'antd'
import { Calendar } from 'antd'
import { FlowerAction } from '@flowerforce/flower-react'
import { Input } from '../Input'

const Item = ({ value }) => {
  return (
    value && (
      <p>
        {value.label} - {value.value}
      </p>
    )
  )
}

const MyButton = ({ rules }) => {
  const { next } = useFlower()
  return (
    <FlowerRule rules={rules}>
      <div onClick={() => next()}>onOK OKK</div>
    </FlowerRule>
  )
}

const Back = ({ rules }) => {
  const { back } = useFlower()
  return (
    <FlowerRule rules={rules}>
      <div onClick={() => back()}>-PREV</div>
    </FlowerRule>
  )
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function Subflow({ children }) {
  const { setData } = useFlowerForm({ flowName: 'auth' })
  /* 
  const user = useSelector(getDataByFlow("auth"))
  console.log("🚀 ~ file: index.jsx:18 ~ Subflow ~ user:", user)
  */
  return (
    <div className="App">
      <Flower name="app" initialData={{ isLogged: true, a: 11 }}>
        <FlowerNode
          id="start"
          to={{
            form: { rules: { $and: [{ '$form.isValid': { $eq: true } }] } }
          }}
        >
          FORM
          <Input
            id="name"
            asyncDebounce={400}
            asyncWaitingError="..."
            asyncValidate={async (val) => {
              await delay(1000)
              console.log('ok')
              return val !== 'aaa' && ['Error name aaa']
            }}
          ></Input>
          <MyButton />
        </FlowerNode>

        <FlowerNode id="form" to={{ login: null }}>
          FORM
          <MyButton />
          <Back />
          <Input />
        </FlowerNode>

        <FlowerFlow id="login" flowName="login" to={{ END: null }}>
          <Login />
          <Back />
        </FlowerFlow>

        <FlowerAction id="END">
          END
          <Back />
        </FlowerAction>
      </Flower>
    </div>
  )
}
export default Subflow
