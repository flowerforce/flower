import {
  FlowerNavigate,
  FlowerNode,
  FlowerField,
  FlowerAction,
  useFlower,
  useFlowerForm,
  Flower,
  FlowerRule
} from '@flowerforce/flower-react'
import { useEffect } from 'react'
import './styles.css'

export function Example9() {
  const { reset, setCustomErrors, setData, hasFocus } = useFlowerForm({
    flowName: 'example9'
  })
  console.log('🚀 ~ Example9 ~ hasFocus:', hasFocus)
  return (
    <Flower name="example9">
      {/**
       * step 1
       */}
      <FlowerNode id="step" to={{ step1: null }}>
        <div className="page step1">
          <span>1</span>
          <FlowerNavigate action="next">
            <button>Next &#8594;</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 1
       */}
      <FlowerNode
        id="step1"
        to={{
          step2: {
            rules: { '$form.isValid': { $eq: true } }
          }
        }}
        retain
      >
        <div className="page step2">
          <button onClick={() => reset()}>reset form</button>
          <button onClick={() => setCustomErrors('password', ['errr'])}>
            set custom errors
          </button>
          <button onClick={() => setCustomErrors('password', [])}>
            remove custom errors
          </button>
          <button onClick={() => setData('asd', 'password')}>
            set password
          </button>
          <span>2</span>

          <div className="field">
            <label htmlFor="username">Username *</label>
            <FlowerField
              id="username"
              defaultValue={'andrea'}
              validate={[
                {
                  rules: {
                    $and: [
                      {
                        username: {
                          $exists: true
                        }
                      }
                    ]
                  },
                  message: 'Field is required'
                },
                {
                  rules: {
                    $and: [
                      {
                        username: {
                          $strGte: '6'
                        }
                      }
                    ]
                  },
                  message: 'Field length must be greater than or equal to 6.'
                },
                {
                  rules: (data: any) => {
                    return true
                  },
                  message: 'Error custom'
                }
              ]}
            >
              {({
                onChange,
                value = '',
                errors,
                onBlur,
                onFocus,
                hidden,
                dirty,
                touched,
                isSubmitted
              }) => (
                <div className="input-container">
                  <input
                    id="username"
                    type="text"
                    value={value}
                    placeholder="Username"
                    onBlur={onBlur}
                    onFocus={onFocus}
                    disabled={hidden}
                    onChange={(e) => onChange(e.target.value)}
                  />

                  {dirty && errors && errors.length > 0 && (
                    <div className="error">{errors.join(', ')}</div>
                  )}
                  {JSON.stringify({ dirty, touched, errors, isSubmitted })}
                </div>
              )}
            </FlowerField>
          </div>
          <div className="field">
            <label htmlFor="password">Password *</label>
            <FlowerField
              id="password"
              validate={[
                {
                  rules: { $and: [{ $self: { $exists: true } }] },
                  message: 'Field is required'
                }
              ]}
            >
              {({
                onChange,
                value = '',
                errors,
                onBlur,
                onFocus,
                hidden,
                dirty,
                touched,
                isSubmitted,
                hasFocus
              }) => (
                <>
                  {hasFocus ? 'si' : 'no'}
                  <input
                    id="password"
                    type="password"
                    value={value}
                    placeholder="Password"
                    onBlur={onBlur}
                    onFocus={onFocus}
                    disabled={hidden}
                    onChange={(e) => onChange(e.target.value)}
                  />

                  {dirty && errors && (
                    <div className="error">{errors.join(', ')}</div>
                  )}
                  {JSON.stringify({ dirty, touched, errors, isSubmitted })}
                </>
              )}
            </FlowerField>
          </div>
          <div className="navigate">
            <FlowerNavigate action="back">
              <button>&#8592; Go Back </button>
            </FlowerNavigate>
            <FlowerNavigate
              action="next"
              rules={{ $and: [{ '$form.isValid': { $eq: true } }] }}
              alwaysDisplay
            >
              {({ onClick, hidden }) => (
                <button onClick={onClick}>Submit &#8594;</button>
              )}
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerAction id="step2" to={{ success: 'onSuccess', error: 'onError' }}>
        <div className="page step2">
          <ComponentAction />
        </div>
      </FlowerAction>

      {/**
       * step 3
       */}
      <FlowerNode id="success">
        <div className="page step3 success">
          <span>Success</span>
          <FlowerNavigate action="reset">
            <button className="success">Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 4
       */}
      <FlowerNode id="error">
        <div className="page step4 error">
          <span>Error</span>
          <FlowerNavigate action="reset">
            <button className="error">Reset</button>
          </FlowerNavigate>
        </div>
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
