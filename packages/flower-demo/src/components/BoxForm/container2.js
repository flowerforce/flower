import {
  FlowerComponent,
  FlowerField,
  FlowerValue,
  useFlowerForm,
} from '@flowerforce/flower-react'
import { Input } from 'antd'
import { FormStep3 } from './container3'

export const FormStep2 = () => {
  const { setData } = useFlowerForm({ flowName: 'auth' })

  return (
    <div>
      <FlowerComponent name="FormStep2">
        <Input title="asdasdasas dasdasd" />

        <FlowerField
          id="^login.username"
          validate={[
            {
              rules: { $and: [{ '^login.username': { $exists: true } }] },
              message: 'è required',
            },
            {
              rules: { $and: [{ '^login.username': { $strGt: '6' } }] },
              message: '6 caratteri',
            },
          ]}
        >
          {({ onChange, errors = '', value }) => {
            return (
              <>
                {' '}
                <Input onChange={(e) => onChange(e.target.value)} value={value} />{' '}
                {errors && errors.join(', ')}{' '}
              </>
            )
          }}
        </FlowerField>

        <FlowerValue id="^login.username">
          <FormStep3 />
          <FlowerField
            id="username"
            validate={[
              {
                rules: { $and: [{ username: { $exists: true } }] },
                message: 'is required',
              },
              {
                rules: { $and: [{ username: { $strGt: '6' } }] },
                message: '6 caratteri',
              },
            ]}
          >
            {({ onChange, errors, value }) => {
              return (
                <>
                  <Input
                    value={value}
                    onChange={(e) => {
                      setData(e.target.value, 'xxxx')
                      onChange(e.target.value)
                    }}
                  />

                  {errors && errors.join(', ')}
                </>
              )
            }}
          </FlowerField>
        </FlowerValue>
      </FlowerComponent>
    </div>
  )
}
