import {
  Flower,
  FlowerNavigate,
  FlowerNode,
  FlowerRule
} from '@flowerforce/flower-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, toggleRole } from '../store'
import './styles.css'

export function ExampleExternalStore() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  return (
    <Flower name="external-store-demo">
      <FlowerNode
        id="start"
        to={{
          adminStep: {
            rules: { '^user.role': { $eq: 'admin' } }
          },
          memberStep: null
        }}
      >
        <div className="page step1">
          <span>External Store</span>
          <div className="info-panel">
            <p>
              Logged as <strong>{user.name}</strong>
            </p>
            <p>
              Role: <strong>{user.role}</strong>
            </p>
            <button type="button" onClick={() => dispatch(toggleRole())}>
              {user.role === 'admin' ? 'Switch to member' : 'Switch to admin'}
            </button>
          </div>
          <p>
            Flower uses the shared Redux store so <strong>{user.role}</strong>{' '}
            users see the matching node.
          </p>
          <div className="navigate">
            <FlowerNavigate action="next">
              <button type="button">Continue</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>

      <FlowerNode id="adminStep">
        <div className="page step3">
          <span>Admin Step</span>
          <FlowerRule rules={{ '^user.role': { $eq: 'admin' } }}>
            <p>Here is the admin-only confirmation.</p>
          </FlowerRule>
          <div className="navigate">
            <FlowerNavigate action="reset">
              <button type="button">Restart Flow</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>

      <FlowerNode id="memberStep">
        <div className="page step2">
          <span>Member Step</span>
          <FlowerRule rules={{ '^user.role': { $eq: 'member' } }}>
            <p>Members get a different friendly message.</p>
          </FlowerRule>
          <div className="navigate">
            <FlowerNavigate action="reset">
              <button type="button">Restart Flow</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>
    </Flower>
  )
}
