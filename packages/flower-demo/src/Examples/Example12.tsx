import {
  FlowerNavigate,
  FlowerNode,
  FlowerField,
  FlowerAction,
  useFlower,
  useFlowerForm,
  Flower,
  FlowerValue,
  FlowerRule
} from '@flowerforce/flower-react'
import { useEffect } from 'react'
import './styles.css'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Here we are using restart action to reset all not initial datas, form state and returns to first node
 */

export function Example12() {
  const dispatch = useDispatch()
  //@ts-ignore
  const value = useSelector((state) => state?.counter?.value)
  return (
    <div>
      <button
        onClick={() => {
          dispatch({ type: 'counter/increment' })
        }}
      >
        INCR {value}
      </button>
      <Flower name="example12">
        {/**
         * step 1
         */}
        <FlowerNode id="step1" to={{ step2: null }} retain>
          <div className="page step2">
            <span>1</span>
            <div className="field">
              <FlowerValue id="^counter.value">
                {({ value }) => `val: ${value}`}
              </FlowerValue>
              <FlowerRule
                rules={{
                  '^counter.value': { $eq: 2 }
                }}
              >
                CIAO
              </FlowerRule>
              <FlowerField
                id="simple"
                validate={[
                  {
                    rules: {
                      $and: [
                        { $self: { $exists: true } },
                        { '^counter.value': { $eq: 2 } }
                      ]
                    },
                    message: 'Field is required'
                  }
                ]}
                destroyOnHide
              >
                {({ onChange, value = '', errors, onBlur, hidden }) => (
                  <div className="input-container">
                    <input
                      id="simple"
                      type="text"
                      value={value}
                      placeholder="simple field"
                      onBlur={onBlur}
                      disabled={hidden}
                      onChange={(e) => onChange(e.target.value)}
                    />

                    {errors && <div className="error">{errors.join(', ')}</div>}
                  </div>
                )}
              </FlowerField>
            </div>

            <div className="navigate">
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
        <FlowerAction
          id="step2"
          to={{ success: 'onSuccess', error: 'onError' }}
        >
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
    </div>
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
