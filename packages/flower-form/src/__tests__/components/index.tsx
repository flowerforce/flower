import React, { useCallback, useEffect, useState } from 'react'
import FlowerField from '../../components/FlowerField'
import FlowerForm from '../../components/FlowerForm'
import useFlowerForm from '../../components/useFlowerForm'
import FormProvider from '../../provider'

const mockData = {
  name: 'andrea',
  surname: 'rossi',
  age: 18
}

const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>

const Input = ({
  onChange,
  value = '',
  name,
  label,
  hasError,
  dirty,
  errors,
  ...rest
}: any) => {
  return (
    <>
      <Text text={label} />
      <input
        style={hasError && dirty ? { border: '1px solid red' } : {}}
        data-testid={name || 'input'}
        name={name}
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
      />
      {hasError && dirty && <div style={{ color: 'red' }}>{errors[0]}</div>}
    </>
  )
}

const FormUnsetDataButton = ({ path, title }: any) => {
  const { unsetData } = useFlowerForm()
  const action = useCallback(() => unsetData(path), [path, unsetData])
  return <Buttongeneric title={title} action={action} />
}

const FormSetDataButton = ({ path, title, value }: any) => {
  const { setData } = useFlowerForm()
  const action = useCallback(() => {
    setData(value, path)
  }, [path, value, setData])

  return <Buttongeneric title={title} action={action} />
}
const FormSetDataFieldButton = ({ path, title, value }: any) => {
  const { setDataField } = useFlowerForm()
  const action = useCallback(() => {
    setDataField(path, value)
  }, [path, value, setDataField])

  return <Buttongeneric title={title} action={action} />
}
const FormResetDataButton = ({ title }: any) => {
  const { reset } = useFlowerForm()
  return <Buttongeneric title={title} action={reset} />
}

const FormSetCustomErrorsButton = ({ path, title, value }: any) => {
  const { setCustomErrors } = useFlowerForm()
  const action = useCallback(() => {
    setCustomErrors(path, value)
  }, [path, value, setCustomErrors])
  return <Buttongeneric title={title} action={action} />
}

const ShowData = () => {
  const { getData } = useFlowerForm('form-14')
  return <code data-testid="get-data">{JSON.stringify(getData())}</code>
}

const ShowStatus = () => {
  const { getFormStatus } = useFlowerForm('form-14')
  return <code data-testid="get-status">{JSON.stringify(getFormStatus())}</code>
}

const Buttongeneric = ({ action, title, disabled }: any) => {
  return (
    <button data-testid={`btn-${title}`} onClick={action} disabled={disabled}>
      {title}
    </button>
  )
}

const NavigationButton = ({ setStep }: any) => {
  const { isValid } = useFlowerForm()
  const action = useCallback(() => setStep('step2'), [setStep])
  return <Buttongeneric title="NEXT" action={action} disabled={!isValid} />
}

const NextButton = ({ setStep }: any) => {
  const action = useCallback(() => setStep('step2'), [setStep])
  return <Buttongeneric title="FORCE-NEXT" action={action} />
}

const data = {
  name: 'andrea',
  surname: 'rossi',
  age: 19,
  address: 'via roma'
}

const SetStateButton = () => {
  const { setData } = useFlowerForm()
  return <Buttongeneric title="setState" action={() => setData(data)} />
}
const Example14 = () => {
  const [step, setStep] = useState('step1')

  return step === 'step1' ? (
    <FlowerForm name="form-14">
      <FlowerField
        id="name"
        validate={[
          {
            message: 'name must be "andrea"',
            rules: { $and: [{ name: { $eq: 'andrea' } }] }
          }
        ]}
      >
        <Input label="name" />
      </FlowerField>
      <FlowerField id="surname">
        <Input label="surname" name="surname" />
      </FlowerField>
      <FlowerField
        id="age"
        validate={[
          {
            message: 'You have to be 18+',
            rules: { $and: [{ age: { $gte: 18 } }] }
          }
        ]}
      >
        <Input label="age" />
      </FlowerField>
      <FlowerField
        id="address"
        validate={[
          {
            message:
              'address must start with "via ", "Via " or "Viale " and contains at least 3 chars after that',
            rules: {
              $and: [{ address: { $regex: /^(via |Via |Viale )[a-zA-Z]{3,}/ } }]
            }
          }
        ]}
      >
        <Input label="address" />
      </FlowerField>
      <NavigationButton setStep={setStep} enableAll />
      <NextButton setStep={setStep} />
      <SetStateButton />
      <FormUnsetDataButton title="UNSET" path="surname" />
      <FormSetDataButton title="REPLACE" path="surname" value="Rossi" />
      <FormSetDataFieldButton
        title="SET-FIELD"
        path="phone"
        value="34121212312"
      />
      <FormResetDataButton title="RESET" />
      <FormSetCustomErrorsButton
        title="CUSTOM-ERRORS"
        path="surname"
        value={['not-rossi']}
      />
    </FlowerForm>
  ) : (
    <>
      <ShowData />
      <ShowStatus />
      <Buttongeneric title="BACK" action={() => setStep('step1')} />
    </>
  )
}

export const TestCmp = () => (
  <FormProvider>
    <Example14 />
  </FormProvider>
)
