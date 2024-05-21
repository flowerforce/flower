import {
  FlowerComponent,
  FlowerField,
  FlowerValue,
  useFlowerForm
} from '@flowerforce/flower-react'
import { Input } from 'antd'
import { FormStep2 } from './container2'
import { FormStep3 } from './container3'

export const FormStep1 = () => {
  const { setData } = useFlowerForm({ flowName: 'auth' })

  return (
    <div>
      <FlowerComponent name="FormStep1">
        <FlowerField
          id="^login.username"
          validate={[
            {
              rules: { $and: [{ '^login.username': { $exists: true } }] },
              message: 'è required'
            }
          ]}
        >
          {({ onChange, errors = '', value }) => {
            return (
              <>
                {' '}
                <Input
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                />{' '}
                {errors && errors.join(', ')}{' '}
              </>
            )
          }}
        </FlowerField>

        <FlowerValue id="^login.username">
          <FlowerField
            id="username"
            validate={[
              {
                rules: { $and: [{ username: { $exists: true } }] },
                message: 'is required'
              }
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
