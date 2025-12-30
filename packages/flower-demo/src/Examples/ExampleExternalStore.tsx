import { useState } from 'react'
import {
  Flower,
  FlowerField,
  FlowerNavigate,
  FlowerNode,
  FlowerProvider,
  FlowerValue,
  createFlowerStore,
  setExternalValue,
  useDispatch,
  useSelector
} from '@flowerforce/flower-react'
import {
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch
} from 'react-redux'
import './styles.css'

type ExternalState = {
  externalMessage: string
}

const externalFlowerStore = createFlowerStore({
  reducer: {
    external: (state: ExternalState = { externalMessage: '' }) => state
  },
  devTools: { name: 'flower-external-store' }
})

const ExternalControls = () => {
  const message = useSelector((state: any) => state.external?.externalMessage ?? '')

  return (
    <div className="external-message">
      <strong>External reducer value:</strong>{' '}
      <span>{message || 'empty'}</span>
    </div>
  )
}

const ExternalDispatcher = () => {
  const dispatch = useDispatch()
  const [externalText, setExternalText] = useState('message from outside')

  const updateExternalMessage = () => {
    dispatch(setExternalValue(['external', 'externalMessage'], externalText))
  }

  const updateWithTimestamp = () => {
    dispatch(
      setExternalValue(
        ['external', 'externalMessage'],
        `updated @ ${new Date().toLocaleTimeString()}`
      )
    )
  }

  return (
    <div className="external-update">
      <label>
        <span>Dispatch esterno:</span>
        <input
          value={externalText}
          onChange={(event) => setExternalText(event.target.value)}
          placeholder="Scrivi qualcosa..."
        />
      </label>
      <div className="external-update__actions">
        <button onClick={updateExternalMessage}>Aggiorna store esterno</button>
        <button onClick={updateWithTimestamp}>Aggiorna con timestamp</button>
      </div>
    </div>
  )
}

const ExternalDispatcherRedux = () => {
  const dispatch = useReduxDispatch()
  const [text, setText] = useState('dispatched da redux')

  const dispatchText = () =>
    dispatch(setExternalValue(['external', 'externalMessage'], text))

  return (
    <div className="external-update">
      <label>
        <span>Dispatch Redux standard:</span>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Scrivi qualcosa..."
        />
      </label>
      <div className="external-update__actions">
        <button onClick={dispatchText}>Aggiorna da redux</button>
      </div>
    </div>
  )
}

export function ExampleExternalStore() {
  return (
    <section className="example external-store">
      <FlowerProvider store={externalFlowerStore}>
        <ExternalControls />
        <ExternalDispatcher />
        <ReduxProvider store={externalFlowerStore}>
          <ExternalDispatcherRedux />
        </ReduxProvider>

        <Flower name="example-external-store">

          <FlowerNode id="intro" to={{
            success: null,
            info: {
              rules: {
                "^external.externalMessage": {
                  $eq: "asd"
                }
              }
            }
          }}>
            <div className="page step1">
              <span>External Store</span>
              <p>Navigation uses the same reducers but a custom store instance.</p>
              <FlowerField id="^external.externalMessage"
                validate={[
                  {
                    rules: { $and: [{ "$self": { $exists: true } }] },
                    message: 'Field is required'
                  }
                ]}>
                {({ value = '', onChange, errors }) => (
                  <>
                    <input
                      type="text"
                      value={value}
                      placeholder="Write something outside of flower"
                      onChange={(event) => onChange(event.target.value)}
                    />
                    {errors && <div className="error">{errors.join(', ')}</div>}
                  </>
                )}
              </FlowerField>
              <FlowerNavigate
                action="next"
                rules={{
                  '^external.externalMessage': {
                    $exists: true
                  }
                }}
              >
                <button>Continue</button>
              </FlowerNavigate>
            </div>
          </FlowerNode>

          <FlowerNode id="success">
            <div className="page step2">
              <span>Success</span>
              <FlowerNavigate action="reset">
                <button>Reset flow</button>
              </FlowerNavigate>
            </div>
          </FlowerNode>

          <FlowerNode id="info">
            <div className="page step2">
              <span>Info</span>
              <FlowerValue id="^external.externalMessage">
                {({ value }) => value}
              </FlowerValue>
              <FlowerNavigate action="reset">
                <button>Reset flow</button>
              </FlowerNavigate>
            </div>
          </FlowerNode>

        </Flower>
      </FlowerProvider>
    </section>
  )
}
