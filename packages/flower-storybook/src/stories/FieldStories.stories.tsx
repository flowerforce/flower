import React, { useEffect } from 'react'
import {
  Flower,
  FlowerAction,
  FlowerField,
  FlowerNavigate,
  FlowerNode,
  FlowerRule,
  FlowerValue,
  useFlower,
  useFlowerForm
} from '@flowerforce/flower-react'
import { CodeSnippet } from '../components/CodeSnippet'

const fieldFlowCode = `
<Flower name="field-flow">
  <FlowerNode id="form" to={{ summary: null }}>
    <FlowerField id="profile.email">
      {({ value, onChange }) => (
        <input placeholder="Email" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </FlowerField>
    <FlowerRule rules={{ profile: { $exists: true } }}>
      <p>Email inserita</p>
    </FlowerRule>
  </FlowerNode>

  <FlowerNode id="summary">
    <FlowerValue id="profile.email">{({ value }) => <p>Email: {value}</p>}</FlowerValue>
  </FlowerNode>
</Flower>
`

const formValidationCode = `
<Flower name="form-validation">
  <FlowerNode id="details" to={{ submit: null }} retain>
    <FlowerField
      id="username"
      validate={[
        {
          rules: {
            $and: [
              { username: { $exists: true } },
              { username: { $strGte: '6' } }
            ]
          },
          message: 'Minimo 6 caratteri'
        }
      ]}
      alwaysDisplay
    >
      {({ value, onChange }) => <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </FlowerField>
    <FlowerField
      id="password"
      validate={[
        {
          rules: {
            $and: [{ password: { $exists: true } }]
          },
          message: 'Password obbligatoria'
        }
      ]}
      alwaysDisplay
    >
      {({ value, onChange }) => (
        <input
          type="password"
          value={value}
          placeholder="Password"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </FlowerField>

    <FlowerNavigate
      action="next"
      rules={{ '$form.isValid': { $eq: true } }}
      alwaysDisplay
    >
      <button>Invia modulo</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerAction id="submit" to={{ success: 'success', error: 'error' }}>
    <span>Invio in corso...</span>
  </FlowerAction>

  <FlowerNode id="success">
    <p>Successo</p>
  </FlowerNode>

  <FlowerNode id="error">
    <p>Errore</p>
  </FlowerNode>
</Flower>
`

const asyncValidationCode = `
<Flower name="async-validation" initialData={{ showExtra: false }}>
      <FlowerNode id="details" to={{
        final: {
          rules: {
            '$form.isValid': { $eq: true }
          }
        }
      }}>
        <h3>Validazione asincrona e regole</h3>
        <p>Filtri per mostrare campi e validazioni dinamiche.</p>

        <FlowerField id="showExtra" defaultValue={false}>
          {({ value = false, onChange }) => (
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
              />
              Mostra campo aggiuntivo
            </label>
          )}
        </FlowerField>

        <FlowerField
          id="extraField"
          rules={{ showExtra: { $eq: true } }}
          destroyOnHide
        >
          {({ value = '', onChange }) => (
            <input
              placeholder="Campo visibile solo quando attivo"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </FlowerField>

        <FlowerField
          id="asyncField"
          asyncValidate={(value = '') =>
            value.toLowerCase().includes('flower') ? [] : ['Usa la parola "flower"']
          }
          asyncInitialError="Inserisci qualcosa"
          asyncWaitingError="Controllo in corso..."
          asyncDebounce={350}
          alwaysDisplay
        >
          {({ value = '', onChange, errors }) => (
            <div>
              <input
                placeholder="Validazione asincrona"
                value={value}
                onChange={(event) => onChange(event.target.value)}
              />
              {errors && <div style={{ color: '#a00' }}>{errors.join(', ')}</div>}
            </div>
          )}
        </FlowerField>

        <FlowerNavigate action="next">
          <button>Vai al riepilogo</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="final">
        <h4>Riepilogo campi</h4>
        <FlowerValue id="extraField">
          {({ value }) => <p>Campo extra: {value || 'non visibile'}</p>}
        </FlowerValue>
        <FlowerValue id="asyncField">
          {({ value }) => <p>Campo asincrono: {value}</p>}
        </FlowerValue>
        <FlowerNavigate action="reset">
          <button>Reset flow</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
`

const FormSubmitAction = () => {
  const { getData } = useFlowerForm()
  const { next } = useFlower()

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getData()
      if (data.username?.startsWith('err')) {
        next('error')
      } else {
        next('success')
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [getData, next])

  return <p>Invio dati del form...</p>
}

export default {
  title: 'Flower/Fields'
}

export const FieldFlow = () => (
  <div>
    <Flower name="field-flow">
      <FlowerNode id="form" to={{ summary: null }}>
        <h3>Forms e validazione</h3>
        <FlowerField id="profile.email">
          {({ value = '', onChange }) => (
            <input
              style={{ marginBottom: 16, display: 'block' }}
              placeholder="Email"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </FlowerField>
        <FlowerRule rules={{ profile: { $exists: true } }}>
          <p style={{ color: '#0a0' }}>Il campo è compilato.</p>
        </FlowerRule>
        <FlowerNavigate action="next">
          <button>Vai al riepilogo</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="summary">
        <h4>Riepilogo</h4>
        <FlowerValue id="profile.email">
          {({ value }) => <p>Email salvata: {value}</p>}
        </FlowerValue>
        <FlowerNavigate action="reset">
          <button>Reset flow</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice FlowerField e FlowerRule" code={fieldFlowCode} />
  </div>
)

export const FormValidationFlow = () => {
  const { getFormStatus, setCustomErrors, setData } = useFlowerForm({
    flowName: 'form-validation'
  })
  const status = getFormStatus('details')
  const dirtyFields = status?.dirty ? Object.keys(status.dirty).join(', ') : 'nessuno'
  const touchedFields = status?.touches ? Object.keys(status.touches).join(', ') : 'nessuno'

  return (
    <div>
      <Flower name="form-validation">
        <FlowerNode id="details" to={{ submit: null }} retain>
          <h3>Form complesso</h3>
          <p>Validazione su più campi con status e custom error.</p>

          <FlowerField
            id="username"
            validate={[
              {
                rules: {
                  $and: [
                    { username: { $exists: true } },
                    { username: { $strGte: '6' } }
                  ]
                },
                message: 'Lunghezza minima 6 caratteri'
              }
            ]}
            alwaysDisplay
          >
            {({ value = '', onChange, errors }) => (
              <div style={{ marginBottom: 8 }}>
                <label>Username</label>
                <input
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  placeholder="flower-user"
                />
                {errors && <p style={{ color: '#a00' }}>{errors.join(', ')}</p>}
              </div>
            )}
          </FlowerField>

          <FlowerField
            id="password"
            validate={[
              {
                rules: { $and: [{ password: { $exists: true } }] },
                message: 'Password obbligatoria'
              }
            ]}
            alwaysDisplay
          >
            {({ value = '', onChange, errors }) => (
              <div style={{ marginBottom: 8 }}>
                <label>Password</label>
                <input
                  type="password"
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  placeholder="••••••"
                />
                {errors && <p style={{ color: '#a00' }}>{errors.join(', ')}</p>}
              </div>
            )}
          </FlowerField>

          <FlowerRule rules={{ username: { $strGte: '6' } }}>
            <p style={{ color: '#0a574b' }}>Username valido e sufficiente.</p>
          </FlowerRule>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              onClick={() =>
                setCustomErrors('username', ['Connessione scaduta, riprova più tardi'])
              }
            >
              Forza errore username
            </button>
            <button onClick={() => setData('username', 'flower-story')}>
              Compila username
            </button>
          </div>

          <div style={{ fontSize: 12, marginTop: 12 }}>
            <p>Dirty: {dirtyFields}</p>
            <p>Touched: {touchedFields}</p>
          </div>

          <FlowerValue id="username">
            {({ value }) => <p>Username salvato: {value}</p>}
          </FlowerValue>

          <FlowerNavigate
            action="next"
            rules={{ '$form.isValid': { $eq: true } }}
            alwaysDisplay
          >
            {({ onClick, hidden }) => (
              <button onClick={onClick} disabled={hidden}>
                Vai al submit
              </button>
            )}
          </FlowerNavigate>
        </FlowerNode>

        <FlowerAction id="submit" to={{ success: 'success', error: 'error' }}>
          <FormSubmitAction />
        </FlowerAction>

        <FlowerNode id="success">
          <h4>Successo</h4>
          <FlowerNavigate action="reset">
            <button>Reset flow</button>
          </FlowerNavigate>
        </FlowerNode>

        <FlowerNode id="error">
          <h4>Errore</h4>
          <p>L username era prefissato con "err".</p>
          <FlowerNavigate action="reset">
            <button>Reset flow</button>
          </FlowerNavigate>
        </FlowerNode>
      </Flower>
      <CodeSnippet title="Codice form con validazione" code={formValidationCode} />
    </div>
  )
}

export const AsyncFormValidationFlow = () => (
  <div>
    <Flower name="async-validation" initialData={{ showExtra: false }}>
      <FlowerNode id="details" to={{
        final: {
          rules: {
            '$form.isValid': { $eq: true }
          }
        }
      }}>
        <h3>Validazione asincrona e regole</h3>
        <p>Filtri per mostrare campi e validazioni dinamiche.</p>

        <FlowerField id="showExtra" defaultValue={false}>
          {({ value = false, onChange }) => (
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
              />
              Mostra campo aggiuntivo
            </label>
          )}
        </FlowerField>

        <FlowerField
          id="extraField"
          rules={{ showExtra: { $eq: true } }}
          destroyOnHide
        >
          {({ value = '', onChange }) => (
            <input
              placeholder="Campo visibile solo quando attivo"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </FlowerField>

        <FlowerField
          id="asyncField"
          asyncValidate={(value = '') =>
            value.toLowerCase().includes('flower') ? [] : ['Usa la parola "flower"']
          }
          asyncInitialError="Inserisci qualcosa"
          asyncWaitingError="Controllo in corso..."
          asyncDebounce={350}
          alwaysDisplay
        >
          {({ value = '', onChange, errors }) => (
            <div>
              <input
                placeholder="Validazione asincrona"
                value={value}
                onChange={(event) => onChange(event.target.value)}
              />
              {errors && <div style={{ color: '#a00' }}>{errors.join(', ')}</div>}
            </div>
          )}
        </FlowerField>

        <FlowerNavigate action="next">
          <button>Vai al riepilogo</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="final">
        <h4>Riepilogo campi</h4>
        <FlowerValue id="extraField">
          {({ value }) => <p>Campo extra: {value || 'non visibile'}</p>}
        </FlowerValue>
        <FlowerValue id="asyncField">
          {({ value }) => <p>Campo asincrono: {value}</p>}
        </FlowerValue>
        <FlowerNavigate action="reset">
          <button>Reset flow</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Validazione asincrona e regole di campo" code={asyncValidationCode} />
  </div>
)
