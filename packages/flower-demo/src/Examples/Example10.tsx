import {
  FlowerNavigate,
  FlowerNode,
  FlowerField,
  FlowerAction,
  useFlower,
  useFlowerForm,
  Flower
} from '@flowerforce/flower-react'
import { useEffect } from 'react'
import './styles.css'

/**
 * Here we are using restart action to reset all not initial datas, form state and returns to first node
 */

export function Example9() {
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
      <FlowerNode id="step1" to={{ step2: null }} retain>
        <div className="page step2">
          <span>2</span>
          <div className="field">
            <label htmlFor="username">Username *</label>
            <FlowerField
              id="username"
              validate={[
                {
                  rules: { $and: [{ username: { $exists: true } }] },
                  message: 'Field is required'
                },
                {
                  rules: { $and: [{ username: { $strGte: '6' } }] },
                  message: 'Field length must be greater than or equal to 6.'
                }
              ]}
            >
              {({ onChange, value = '', errors, onBlur, hidden }) => (
                <div className="input-container">
                  <input
                    id="username"
                    type="text"
                    value={value}
                    placeholder="Username"
                    onBlur={onBlur}
                    disabled={hidden}
                    onChange={(e) => onChange(e.target.value)}
                  />

                  {errors && <div className="error">{errors.join(', ')}</div>}
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
                  rules: { $and: [{ password: { $exists: true } }] },
                  message: 'Field is required'
                }
              ]}
            >
              {({ onChange, value = '', errors, onBlur, hidden }) => (
                <>
                  <input
                    id="password"
                    type="password"
                    value={value}
                    placeholder="Password"
                    onBlur={onBlur}
                    disabled={hidden}
                    onChange={(e) => onChange(e.target.value)}
                  />

                  {errors && <div className="error">{errors.join(', ')}</div>}
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
                <button disabled={hidden} onClick={onClick}>
                  Submit &#8594;
                </button>
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
        <div className="page step3">
          <span>Success</span>
          <FlowerNavigate action="restart">
            <button>Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 4
       */}
      <FlowerNode id="error">
        <div className="page step4">
          <span>Error</span>
          <FlowerNavigate action="reset">
            <button>Reset</button>
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
