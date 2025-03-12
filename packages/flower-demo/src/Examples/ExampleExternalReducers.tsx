import {
  FlowerNavigate,
  FlowerNode,
  FlowerAction,
  useFlower,
  Flower,
  useDispatch
} from '@flowerforce/flower-react'
import {
  FlowerForm,
  FlowerField,
  useFlowerForm
} from '@flowerforce/flower-react-form'
import { FlowerValue } from '@flowerforce/flower-react-shared'

import { useCallback, useEffect } from 'react'
import './styles.css'
import { actionsCustom1, actionsCustom2 } from '../AppFlowWithCustomReducer'

const ButtonNext = () => {
  const { next } = useFlower()
  return <button onClick={() => next()}>Next &#8594;</button>
}

const ButtonPrev = () => {
  const { back } = useFlower() // useFlower get the context of the parent Flower
  return <button onClick={() => back()}>&#8592; Back</button>
}

const ButtonCount = ({ id = '' }: any) => {
  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    dispatch(id === 'count' ? actionsCustom1.add(1) : actionsCustom2.add(1))
  }, [dispatch, id])
  return (
    <button data-testid={'btn-next' + id} onClick={onClick}>
      add
    </button>
  )
}

const ViewResult = ({ value, ...rest }: any) => {
  return <span>{value ?? 'null'}</span>
}

const ViewState = () => {
  const { getGlobalData } = useFlowerForm()
  return <span>{JSON.stringify(getGlobalData())}</span>
}

export function ExternalReducers() {
  return (
    <Flower
      name="externalReducers"
      initialData={{ name: 'andrea', surname: 'rossi' }}
    >
      <FlowerNode
        id="node-test"
        to={{
          success: {
            rules: {
              $and: [
                { '^customReducer.count': { $eq: 2 } },
                { '^customReducer2.count2': { $eq: 4 } },
                { name: { $eq: 'andrea' } },
                { surname: { $eq: 'rossi' } }
              ]
            }
          },
          error: {
            rules: null
          }
        }}
      >
        <FlowerValue id="^customReducer.count">
          <ViewResult />
        </FlowerValue>
        <ButtonCount id="count" />

        <FlowerValue id="^customReducer2.count2">
          <ViewResult />
        </FlowerValue>
        <ButtonCount id="count2" />
        <ButtonNext />
      </FlowerNode>
      <FlowerNode id="success">
        <div>success</div>
        <ViewState />
        <ButtonPrev />
      </FlowerNode>
      <FlowerNode id="error">
        <div>error</div>
        <ButtonPrev />
      </FlowerNode>
    </Flower>
  )
}
