import {
  FlowerForm,
  FlowerField,
  useFlowerForm
} from '@flowerforce/flower-form'

import { useCallback, useState } from 'react'
import './styles.css'

const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>
const Input = ({ onChange, value = '', name, label }: any) => {
  return (
    <>
      <Text text={label} />
      <input
        data-testid={name || 'input'}
        name={name}
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
      />
    </>
  )
}

const Buttongeneric = ({ action, title, disabled }: any) => {
  return (
    <button data-testid={`btn-${title}`} onClick={action} disabled={disabled}>
      {title}
    </button>
  )
}

const FormResetButton = ({ title }: any) => {
  const { reset } = useFlowerForm()
  const action = useCallback(reset, [reset])
  return <Buttongeneric title={title} action={action} />
}

const FormUnsetDataButton = ({ path, title }: any) => {
  const { unsetData } = useFlowerForm()
  const action = useCallback(() => unsetData(path), [path, unsetData])
  return <Buttongeneric title={title} action={action} />
}

const FormSetDataButton = ({ path, title, aishdiuah }: any) => {
  const { setData } = useFlowerForm()
  const action = useCallback(
    () => setData(aishdiuah, path),
    [aishdiuah, path, setData]
  )
  return <Buttongeneric title={title} action={action} />
}

const ShowData = () => {
  const { getData } = useFlowerForm('form-test')
  return <code>{JSON.stringify(getData(), null, 4)}</code>
}

const NavigationButton = ({ setStep }: any) => {
  const { isValid } = useFlowerForm()
  const action = useCallback(() => setStep('step2'), [setStep])
  return <Buttongeneric title="NEXT" action={action} disabled={!isValid} />
}

export function Example13() {
  const [step, setStep] = useState('step1')

  return step === 'step1' ? (
    <FlowerForm
      name="form-test"
      initialState={{ name: 'andrea', surname: 'rossi' }}
    >
      <FlowerField
        id="name"
        validate={[
          {
            message: 'is equal',
            rules: { $and: [{ name: { $eq: 'andrea' } }] }
          }
        ]}
      >
        <Input label="name" />
      </FlowerField>
      <FlowerField
        id="surname"
        validate={[
          {
            message: 'is equal',
            rules: { $and: [{ surname: { $eq: 'rossi' } }] }
          }
        ]}
      >
        <Input label="surname" />
        <FormUnsetDataButton title={'UNSET SURNAME'} path={'surname'} />
        <FormSetDataButton
          title={'REPLACE SURNAME'}
          path="surname"
          aishdiuah={'Rossi'}
        />
      </FlowerField>
      <NavigationButton setStep={setStep} />
      <FormResetButton title={'RESET'} />
    </FlowerForm>
  ) : (
    <>
      <ShowData />
      <Buttongeneric title="BACK" action={() => setStep('step1')} />
    </>
  )
}
