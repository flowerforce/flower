import React, { useEffect, useState } from 'react'
import {
  Flower,
  FlowerAction,
  FlowerField,
  FlowerNavigate,
  FlowerNode,
  FlowerRule,
  useFlower
} from '@flowerforce/flower-react'
import { CodeSnippet } from '../components/CodeSnippet'

const baseFlowCode = `
<Flower name="story-base">
  <FlowerNode id="start" to={{ stepTwo: null }}>
    <FlowerNavigate action="next">
      <button>Avanti</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerNode id="stepTwo" to={{ final: null }}>
    <FlowerNavigate action="back">
      <button>Indietro</button>
    </FlowerNavigate>
    <FlowerNavigate action="next">
      <button>Vai a fine</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerNode id="final">
    <FlowerNavigate action="reset">
      <button>Reset</button>
    </FlowerNavigate>
  </FlowerNode>
</Flower>
`

const rulesFlowCode = `
<Flower name="rules-flow">
  <FlowerNode id="start" to={{
    skip: { rules: { $and: [{ skipStep2: { $eq: true } }] } },
    default: null
  }}>
    <FlowerField id="skipStep2">
      {({ value, onChange }) => (
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
      )}
    </FlowerField>
  </FlowerNode>

  <FlowerNode id="skip">...</FlowerNode>
  <FlowerNode id="default">...</FlowerNode>
</Flower>
`

const actionFlowCode = `
<Flower name="action-flow">
  <FlowerNode id="start" to={{ loading: null }}>
    <FlowerNavigate action="next">
      <button>Avvia azione</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerAction id="loading" to={{ success: 'onSuccess', error: 'onError' }}>
    <span>Chiamata in corso...</span>
  </FlowerAction>

  <FlowerNode id="success">
    <FlowerNavigate action="back">
      <button>Indietro</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerNode id="error">
    <FlowerNavigate action="reset">
      <button>Reset</button>
    </FlowerNavigate>
  </FlowerNode>
</Flower>
`

const conditionalNavCode = `
<Flower name="conditional-nav" initialData={{ enableNav: false }}>
  <FlowerNode id="start" to={{ finale: null }}>
    <FlowerField id="enableNav">
      {({ value, onChange }) => (
        <label>
          <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
          Abilita navigazione
        </label>
      )}
    </FlowerField>
    <FlowerRule rules={{ enableNav: { $eq: true } }}>
      <p>Le azioni sono attive se la regola è soddisfatta.</p>
    </FlowerRule>
    <FlowerNavigate
      action="next"
      rules={{ enableNav: { $eq: true } }}
      alwaysDisplay
    >
      {({ onClick, hidden }) => (
        <button disabled={hidden} onClick={onClick}>
          Avanti (sempre visibile)
        </button>
      )}
    </FlowerNavigate>
    <FlowerNavigate action="next" rules={{ enableNav: { $eq: true } }}>
      <button>Avanti (visibile solo quando attivo)</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerNode id="finale">
    <FlowerNavigate action="reset">
      <button>Reset flow</button>
    </FlowerNavigate>
  </FlowerNode>
</Flower>
`

const AsyncActionStep = ({
  setInvocations
}: {
  setInvocations: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { next } = useFlower()

  useEffect(() => {
    setInvocations((state) => state + 1)
    const timer = setTimeout(() => {
      next('onSuccess')
    }, 800)
    return () => clearTimeout(timer)
  }, [next, setInvocations])

  return <p>Esecuzione in corso...</p>
}

export default {
  title: 'Flower/Flows'
}

export const BaseFlow = () => (
  <div>
    <Flower name="story-base">
      <FlowerNode id="start" to={{ stepTwo: null }}>
        <h3>Base Flow</h3>
        <p>Passaggi sequenziali semplici.</p>
        <FlowerNavigate action="next">
          <button>Avanti</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="stepTwo" to={{ final: null }}>
        <h3>Secondo passaggio</h3>
        <FlowerNavigate action="back">
          <button>Indietro</button>
        </FlowerNavigate>
        <FlowerNavigate action="next">
          <button>Vai avanti</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="final">
        <h3>Fine del flow</h3>
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice base" code={baseFlowCode} />
  </div>
)

export const RulesFlow = () => (
  <div>
    <Flower name="rules-flow">
      <FlowerNode
        id="start"
        to={{
          skip: {
            rules: { $and: [{ skipStep2: { $eq: true } }] }
          },
          default: null
        }}
      >
        <h3>Flow con regole</h3>
        <FlowerField id="skipStep2">
          {({ value = false, onChange }) => (
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
              />
              Salta il nodo secondario
            </label>
          )}
        </FlowerField>
        <FlowerNavigate action="next">
          <button>Valuta regola</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="skip">
        <h4>Nodo skip</h4>
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
      <FlowerNode id="default">
        <h4>Nodo default</h4>
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice flow con regole" code={rulesFlowCode} />
  </div>
)

export const ActionFlow = () => {
  const [executions, setExecutions] = useState(0)

  return (
    <div>
      <Flower name="action-flow">
        <FlowerNode id="start" to={{ loading: null }}>
          <h3>Flow con azioni</h3>
          <p>Ogni invocazione lancia un'azione simulata.</p>
          <div>Azioni eseguite: {executions}</div>
          <FlowerNavigate action="next">
            <button>Avvia chiamata</button>
          </FlowerNavigate>
        </FlowerNode>

        <FlowerAction id="loading" to={{ success: 'onSuccess', error: 'onError' }}>
          <AsyncActionStep setInvocations={setExecutions} />
        </FlowerAction>

        <FlowerNode id="success">
          <h4>Successo</h4>
          <FlowerNavigate action="back">
            <button>Indietro</button>
          </FlowerNavigate>
        </FlowerNode>

        <FlowerNode id="error">
          <h4>Errore</h4>
          <FlowerNavigate action="reset">
            <button>Reset flow</button>
          </FlowerNavigate>
        </FlowerNode>
      </Flower>
      <CodeSnippet title="Codice FlowerAction" code={actionFlowCode} />
    </div>
  )
}

export const ConditionalNavigationFlow = () => (
  <div>
    <Flower name="conditional-nav" initialData={{ enableNav: false }}>
      <FlowerNode id="start" to={{ finale: null }}>
        <h3>Navigazione condizionale</h3>
        <p>Abilita la navigazione solo quando la regola è soddisfatta.</p>
        <FlowerField id="enableNav">
          {({ value = false, onChange }) => (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
              />
              Abilita pulsanti
            </label>
          )}
        </FlowerField>
        <FlowerRule rules={{ enableNav: { $eq: true } }}>
          <p style={{ color: '#0a7f04' }}>La navigazione è attiva.</p>
        </FlowerRule>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <FlowerNavigate
            action="next"
            rules={{ enableNav: { $eq: true } }}
            alwaysDisplay
          >
            {({ onClick, hidden }) => (
              <button disabled={hidden} onClick={onClick}>
                Avanti (sempre visibile)
              </button>
            )}
          </FlowerNavigate>
          <FlowerNavigate action="next" rules={{ enableNav: { $eq: true } }}>
            <button>Avanti (visibile solo se attivo)</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      <FlowerNode id="finale">
        <h4>Passaggio finale</h4>
        <FlowerNavigate action="reset">
          <button>Reset flow</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Navigazione condizionale" code={conditionalNavCode} />
  </div>
)
