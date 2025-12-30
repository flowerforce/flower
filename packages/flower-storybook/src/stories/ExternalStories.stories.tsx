import React, { useState } from 'react'
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
import { CodeSnippet } from '../components/CodeSnippet'

const externalStore = createFlowerStore({
  reducer: {
    external: (state = { externalMessage: 'attendere...' }) => state
  }
})

const externalCode = `
const store = createFlowerStore({
  reducer: {
    external: (state = { externalMessage: '' }) => state
  }
})

<FlowerField id="^external.externalMessage">…</FlowerField>
setExternalValue(['external', 'externalMessage'], value)
`

const ExternalControls = () => {
  const message = useSelector((state: any) => state.external?.externalMessage ?? 'vuoto')
  return <p>Valore esterno: {message}</p>
}

const ExternalDispatcher = () => {
  const dispatch = useDispatch()
  const [payload, setPayload] = useState('story esterna')

  return (
    <div style={{ marginBottom: 12 }}>
      <input value={payload} onChange={(event) => setPayload(event.target.value)} />
      <button onClick={() => dispatch(setExternalValue(['external', 'externalMessage'], payload))}>
        Scrivi nello store esterno
      </button>
    </div>
  )
}

export default {
  title: 'Flower/External Store'
}

export const ExternalStoreFlow = () => (
  <FlowerProvider store={externalStore}>
    <div style={{ marginBottom: 16 }}>
      <ExternalControls />
      <ExternalDispatcher />
    </div>

    <Flower name="external-story">
      <FlowerNode id="intro" to={{ ok: null }}>
        <h3>Flow che legge da store esterno</h3>
        <FlowerField id="^external.externalMessage">
          {({ value = '', onChange }) => (
            <input
              placeholder="Scrivi direttamente nello store condiviso"
              style={{ width: '100%', marginBottom: 12 }}
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </FlowerField>
        <FlowerNavigate action="next">
          <button>Mostra valore</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="ok">
        <h4>Valore esterno</h4>
        <FlowerValue id="^external.externalMessage">
          {({ value }) => <p>{value}</p>}
        </FlowerValue>
        <FlowerNavigate action="reset">
          <button>Reset Flow</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice store esterno" code={externalCode} />
  </FlowerProvider>
)
