import {
  FlowerField,
  useFlowerForm,
  FlowerValue,
  FlowerForm
} from '@flowerforce/flower-react-form'
import { useCallback, useEffect, useState } from 'react'
import './styles.css'
import mockData from '../mocks/Example14.json'

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
  const { getData } = useFlowerForm('form-14')
  return <code>{JSON.stringify(getData(), null, 4)}</code>
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

const data = {
  name: 'andrea',
  surname: 'rossi',
  age: 19
}

const SetStateButton = ({ setStep }: any) => {
  const { setData } = useFlowerForm()

  return <Buttongeneric title="setState" action={() => setData(data)} />
}

export function Example14() {
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
      <FlowerField
        id="surname"
        validate={[
          {
            message: 'surname must be "rossi"',
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
      <NavigationButton setStep={setStep} />
      <FormResetButton title={'RESET'} />
      <SetStateButton />
    </FlowerForm>
  ) : (
    <>
      <ShowData />
      <Buttongeneric title="BACK" action={() => setStep('step1')} />
    </>
  )
}
