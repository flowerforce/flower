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

export function Example11() {
  const { getFormStatus } = useFlowerForm({ flowName: 'example11' })
  const status = getFormStatus('step1')
  const dirties = status?.dirty ? Object.keys(status?.dirty) : []
  const touches = status?.touches ? Object.keys(status?.touches) : []

  return (
    <Flower name="example11">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }} retain>
        <div className="page step2">
          <span>1</span>
          <div className="field">
            <label htmlFor="username">Show field </label>

            <FlowerField id="check" defaultValue={false}>
              {({ onChange, onBlur, value }) => (
                <input
                  type="checkbox"
                  id="disabled"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  onBlur={onBlur}
                />
              )}
            </FlowerField>

            <FlowerField
              id="simple"
              rules={{ $and: [{ check: { $eq: true } }] }}
              validate={[
                {
                  rules: { $and: [{ simple: { $exists: true } }] },
                  message: 'Field is required'
                }
              ]}
              alwaysDisplay
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

            <FlowerField
              id="async"
              rules={{ $and: [{ check: { $eq: true } }] }}
              asyncValidate={() => ['Async field error']}
              asyncInitialError="Async initial error"
              asyncWaitingError="Async waiting error"
              asyncDebounce={500}
              alwaysDisplay
            >
              {({ onChange, value = '', errors, onBlur, hidden }) => (
                <div className="input-container">
                  <input
                    id="async"
                    type="text"
                    value={value}
                    placeholder="async field"
                    onBlur={onBlur}
                    disabled={hidden}
                    onChange={(e) => onChange(e.target.value)}
                  />

                  {errors && <div className="error">{errors.join(', ')}</div>}
                </div>
              )}
            </FlowerField>
          </div>

          {touches && <div>touches: {touches.join(', ')}</div>}
          {dirties && <div>dirty: {dirties.join(', ')}</div>}

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
