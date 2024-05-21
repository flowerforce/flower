import React from 'react'
import Flower, {
  Devtools,
  FlowerNode,
  FlowerRoute,
  FlowerAction,
  FlowerServer,
  FlowerFlow,
  FlowerRule,
  FlowerField,
  useFlowerForm,
} from '@flowerforce/flower-react'
import { Text } from './components/Text'
import { Button } from './components/Button/index.jsx'
import { Input } from './components/Input'
import Saga from './components/Saga'
import { useFlower } from '@flowerforce/flower-react'
import { memo } from 'react'
import Subflow from './components/BoxForm/index.jsx'
import Api from './components/Server'
import serverFlow from './App.server.json'
import { useState } from 'react'
import { useCallback } from 'react'

// Flower.registerComponents({ Text, Input })

const Gianluca = memo(() => {
  const { next } = useFlower()
  return <div onClick={() => next('onSuccess')}>Componente 1</div>
})

const Gege = memo(() => {
  const { next } = useFlower()
  return <div onClick={() => next({ data: { isValid: true } })}>Componente 2</div>
})

const GianlucaErr = memo(() => {
  const { next } = useFlower()
  return <div onClick={() => next({ data: { error: true } })}>Componente ERROR</div>
})

const Back = memo(() => {
  const { back } = useFlower()
  return <div onClick={() => back('app')}>back</div>
})

const Submit = memo(() => {
  const { isValid, errors, touched } = useFlowerForm()
  const { next } = useFlower()
  return (
    <div onClick={() => next({ isValid })}>
      SUBMIT {String(isValid)} {touched && errors && JSON.stringify(errors)}
    </div>
  )
})

const Component = memo(({ id }) => {
  return (
    <>
      <hr />
      <Gianluca />
    </>
  )
})

function App() {
  const [state, setState] = useState({})
  const handleChange = useCallback((id, val) => {
    setState((p) => ({ ...p, [id]: val }))
  }, [])

  return (
    <div className="App">
      <Flower name="app">
        <FlowerNode
          id="A"
          to={{
            B: 'onError',
            'api-save': { name: 'Err', rules: { $and: [{ error: { $eq: true } }] } },
            'api-log': { rules: { $and: [{ isValid: { $eq: true } }] } },
            paolo: null,
            BB: null,
            momo: null,
          }}
        >
          <Input
            placeholder={'name'}
            onChange={handleChange}
            id="name"
            value={state.name}
          />
          <FlowerField
            id="name"
            validateFunc={(val) => {
              if (val?.indexOf('@') > -1) return
              return [
                {
                  message: 'is not email',
                },
              ]
            }}
            validate={[
              { message: 'is required', rules: { $and: [{ name: { $exists: true } }] } },
              { message: 'is gt 5', rules: { $and: [{ name: { $gt: 5 } }] } },
              {
                rules: { $and: [{ name: { $regex: '[a-z]' } }] },
                message: 'Not contains [a-z]',
              },
            ]}
          >
            <Input />
          </FlowerField>
          <FlowerField
            id="lastname"
            destroyValue={true}
            rules={{ $and: [{ name: { $eq: 'a' } }] }}
            validate={[
              { message: 'is equal a b', rules: { $and: [{ lastname: { $eq: 'b' } }] } },
            ]}
          >
            <Input />
          </FlowerField>
          <FlowerField
            id="age"
            validate={[{ message: 'age gt 2', rules: { age: { $gt: 2 } } }]}
          >
            <Input type="number" min="1" max="100" />
          </FlowerField>
          <FlowerRule isDisabled={true} rules={{ $and: [{ name: { $regex: 'a' } }] }}>
            CIAOOO
          </FlowerRule>
          <div>
            <Gianluca />
            <GianlucaErr />
            <Gege />
            <FlowerRule
              rules={{ $and: [{ '^isValid': { $eq: true } }] }}
              value={{
                isValid: !!state.name,
              }}
            >
              <p>OKKKK</p>
            </FlowerRule>
          </div>
          <Submit />
        </FlowerNode>

        <FlowerNode id="B">
          CIAO B
          <Button />
        </FlowerNode>

        <FlowerNode id="BB" to={{ update: null }}>
          CIAO B
          <Text id="app.lastname" variant="h1" />
          <Button validoSe={{ $and: [{ '^isValid': { $exists: true } }] }} />
          <Back />
        </FlowerNode>

        <FlowerAction id="save" to={{ form: 'onError' }}>
          <Text text="save" />
          <Saga loaderColor="primary" name="LOG" />
        </FlowerAction>

        <FlowerNode id="form" to={{ update: null, paolo2: null }}>
          <Text text="form" />
          <Button />
          <Back />
        </FlowerNode>

        <FlowerAction id="update">
          <Text text="update" />
          <Saga loaderColor="primary" name="adsasdas" />
        </FlowerAction>

        <FlowerRoute id="start" to={{ update: null }} />

        <FlowerNode id="paolo2">
          CIAO
          <Back />
        </FlowerNode>

        <FlowerNode
          id="paolo123123122"
          to={{ sub3: { rules: { $and: [{ name: { $eq: 'aaa' } }] } } }}
        >
          CIAO
          <Back />
        </FlowerNode>

        <FlowerFlow id="sub3" flowName="login" to={{ paolo2: 'ok' }}>
          <Back />
        </FlowerFlow>

        <FlowerFlow id="sub33" to={{ paolo2: 'ok' }}>
          <Subflow />
        </FlowerFlow>

        <FlowerServer
          id="api-save"
          to={{
            'api-log': { rules: { $and: [{ success: { $eq: true } }] } },
            paolo123123122: null,
          }}
        >
          <Api flow={serverFlow.elements} />
        </FlowerServer>

        <FlowerServer id="api-log" action="Api" to={{ paolo: null, sub3: null }}>
          <Api flow={serverFlow.elements} />
        </FlowerServer>

        <FlowerNode id="paolo" to={{ update: null, paolo2: 'ok' }}>
          <Input />
          <Text text="update asda sdfasdf asfasfasdfs" />
          <Text text="testo" />
          <Button />
          {
            // <FlowerList items={[{label: '1123', value: '1'}]} />
          }
        </FlowerNode>

        <FlowerNode id="momo" to={{ B: null }}>
          <FlowerField id="momo">
            <Input />
          </FlowerField>
        </FlowerNode>
      </FlowerXXX>
    </div>
  )
}

export default App
