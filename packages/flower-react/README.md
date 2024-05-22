# Flower React

<a alt="Flower logo" href="https://flower.stackhouse.dev/" target="_blank" rel="noreferrer"><img src="https://flower.stackhouse.dev/_next/static/media/flower-logo.bb32f863.svg" width="50"></a>

Flower React is a front-end development library built on top of Flower Core, specifically designed for React applications. It seamlessly integrates Flower's powerful capabilities into React projects, providing a user-friendly interface for creating, modifying, and monitoring workflows.

For more info [flower.stackhouse.dev/](https://flower.stackhouse.dev/)

<!-- ![Flower react tool](https://flower.stackhouse.dev/static/images/flower-react.gif) -->

## Features

- **Workflow Management**: Comprehensive API for creating, updating, and managing workflows programmatically.
- **Node and Connection Handling**: Functions to manage nodes and connections, including adding, removing, and editing.
- **State Management**: Built-in state management to keep track of workflow changes and updates.
- **Event System**: Customizable event handling to respond to user interactions and changes within the workflow.
- **Serialization**: Convert workflows to and from different formats (e.g., JSON) for easy storage and retrieval.
- **Validation**: Ensure workflows follow predefined rules and constraints to maintain integrity.
- **Form Validation**: Built-in functionalities to validate form inputs within nodes, ensuring data integrity and correctness.
- **History Management**: Internal management of flow history, tracking node traversal and changes for debugging and visualization purposes.

### Installation

Flower React can be installed via npm or yarn for use in any JavaScript project.

### Using npm

1. Ensure you have Node.js and npm installed on your system.
2. Run the following command to install the library:

```bash
#NPM
npm install @flowerforce/flower-core
```

### Using yarn

1. Ensure you have yarn installed on your system.
2. Run the following command to install the library:

```bash
#YARN
yarn add @flowerforce/flower-core
```

## Configuration

The **FlowerProvider** component wraps the entire application, providing a global context for managing the application flow.

```jsx
import React from 'react'
import { Flower, FlowerProvider } from '@flowerforce/flower-react'

function Root() {
  return (
    <FlowerProvider>
      <App />
    </FlowerProvider>
  )
}
```

## How to use

### Simple Example

The **Flower** component defines an application flow with a specific name, which serves as a unique identifier for the flow. It is the main component for defining the application flow, accepting a required "name" property and an initialData field for prepopulating values.

The **FlowerNode** component represents a UI state or a step within the application flow. Transitions between nodes can be specified using the **to** object.

```jsx
import React from 'react'
import { Flower, FlowerNavigate, FlowerNode } from '@flowerforce/flower-react'

export const Page = () => {
  return (
    <Flower name="demo">
      <FlowerNode id="step1" to={{ step2: null }}>
        ...
        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="step2" to={{ step3: null }}>
        ...
        <FlowerNavigate action="back">
          <button>click me to go back</button>
        </FlowerNavigate>
        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="step3">
        ...
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-9wsjv7)

### Navigate with routes

Additionally, it's possible to navigate between nodes by defining specific routes.

```jsx
import React from 'react'
import {
  Flower,
  FlowerRoute,
  FlowerNavigate,
  FlowerNode
} from '@flowerforce/flower-react'

export const Page = () => {
  return (
    <Flower name="demo">
      <FlowerRoute id="start" to={{ step1: null }} /> {/* autonext */}
      <FlowerNode
        id="step1"
        to={{
          stepOK: 'onSuccess',
          stepKO: 'onError',
          default: null
        }}
      >
        ...
        <FlowerNavigate action="next" route="onSuccess">
          <button>click me to go on "stepOK"</button>
        </FlowerNavigate>
        <FlowerNavigate action="next" route="onError">
          <button>click me to go on "stepKO"</button>
        </FlowerNavigate>
        <FlowerNavigate action="next">
          <button>click me to go on "default" </button>
        </FlowerNavigate>
      </FlowerNode>
      <FlowerNode id="stepOK">... </FlowerNode>
      <FlowerNode id="stepKO">... </FlowerNode>
      <FlowerNode id="default">... </FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-forked-9k4kfk)

### Navigation State Rules

Flower has an internal state to control flow paths more advancedly, adding rules that determine one path over another. Below is an example of how a rule works.

In this example, we're passing the initialData object to the Flower component through the initialData prop. You can initialize this object with desired data, such as the value of skipStep2 that we set to true. When the Flower is initiated, it will use this initial data to establish the initial state of the flow.

The FlowerNode step1 connects to both step2 and step3. However, the rule states that if skipStep2 is true, it should go directly to step3.

```jsx
import React from 'react'
import {
  Flower,
  FlowerRoute,
  FlowerNavigate,
  FlowerNode
} from '@flowerforce/flower-react'

export const Page = () => {
  return (
    <Flower name="demo" initialData={{ skipStep2: true }}>
      <FlowerRoute id="start" to={{ step1: null }} />

      <FlowerNode
        id="step1"
        to={{
          step3: {
            rules: { $and: [{ skipStep2: { $eq: true } }] }
          },
          step2: null
        }}
      >
        ...
        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="step2">...</FlowerNode>

      <FlowerNode id="step3">...</FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-forked-5c4rs4)

### Basic WRITE | READ State

To modify the internal state of Flower, besides passing initialData as a prop, we can always modify and read the state through the components **FlowerField** and **FlowerValue**.

_FlowerField_ pass two props, onChange and value, to properly modify and read the value from the state of Flower.
_FlowerValue_ pass value, to properly read the value from the state of Flower.

Here's an example of how it works:

```jsx
import React from 'react'
import { 
  Flower,
  FlowerRoute,
  FlowerNavigate,
  FlowerNode,
  FlowerField,
  FlowerValue
} from '@flowerforce/flower-react'

export const Page = () => {
  return (
    <Flower name="demo">
      <FlowerNode
        id="step1"
        to={{
              step3: {
                rules={{ $and: [{ skipStep2: { $eq: true } }] }}
              },
              step2: null
            }}
        >
        ...

        <FlowerField id="skipStep2">
          {({ onChange, value }) => <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />}
        </FlowerField>

        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="step2">...</FlowerNode>

      <FlowerNode id="step3">
        <FlowerValue id="enableFinal">
          {({ value }) => <span>skipStep2: {String(!!value)}</span>}
        </FlowerValue>
      </FlowerNode>

    </Flower>
  )
}

```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-3-forked-r3hgnj)

### Action Node

The **FlowerAction** component serves as an action entity within the application flow, enabling the definition of specific actions to execute during the progression of the flow.

The distinction between **FlowerNode** and **FlowerAction** lies in how they behave within the flow.
In the context of a **FlowerNode**, if a "back" action is taken but the preceding step is a **FlowerAction**, that particular step is skipped.

```jsx
import {
  Flower,
  FlowerAction,
  FlowerNavigate,
  FlowerNode,
  useFlower
} from '@flowerforce/flower-react'
import { memo, useEffect } from 'react'

const ComponentAction = memo(() => {
  const { next } = useFlower()

  useEffect(() => {
    // * do your staff here - api call etc **

    next()
  }, [next])

  return <span className="loader"></span>
})

export default function App() {
  return (
    <Flower name="demo">
      {/* step 1 */}
      <FlowerNode id="step1" to={{ step2: null }}>
        ...
        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      {/* step 2 */}
      <FlowerAction id="step2" to={{ step3: null }}>
        ...
        <ComponentAction />
      </FlowerAction>

      {/* step 3 */}
      <FlowerNode id="success">
        ...
        <FlowerNavigate action="back">
          <button>click me to go back</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-actionnode-766vhj)

Another difference between **FlowerNode** and **FlowerAction** is that upon mounting a FlowerAction, if the preceding node of type **FlowerNode** has the **retain** property, this node will not be unmounted.

```jsx
import {
  Flower,
  FlowerAction,
  FlowerNavigate,
  FlowerNode,
  useFlower
} from '@flowerforce/flower-react'
import { memo, useEffect } from 'react'

const ComponentAction = memo(() => {
  const { next } = useFlower()

  useEffect(() => {
    // * do your staff here - api call etc **

    next()
  }, [next])

  return <span className="loader"></span>
})

export default function App() {
  return (
    <Flower name="demo">
      {/* step 1 */}
      <FlowerNode id="step1" to={{ step2: null }} retain>
        ...
        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      {/* step 2 */}
      <FlowerAction id="step2" to={{ step3: null }}>
        ...
        <ComponentAction />
      </FlowerAction>

      {/* step 3 */}
      <FlowerNode id="success">
        ...
        <FlowerNavigate action="back">
          <button>click me to go back</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-actionnode-forked-7cd68s)

### Hook - useFlower

Here, we are using the useFlower hook to obtain some essential functions for navigation and handling of the application flow.

#### useFlower as child <Flower>...</Flower>

```jsx
import React from 'react'
import {
  Flower,
  FlowerRoute,
  FlowerNavigate,
  FlowerNode,
  useFlower
} from '@flowerforce/flower-react'

const ButtonNext = () => {
  // useFlower get the context of the parent Flower
  const { next, back, jump } = useFlower()
  return <button onClick={() => next()}>click me to go next</button>
}

export const Page = () => {
  return (
    <Flower name="demo">
      <FlowerRoute id="start" to={{ step1: null }} />

      <FlowerNode id="step1" to={{ step2: null }}>
        ...
        <ButtonNext />
      </FlowerNode>

      <FlowerNode id="step2">...</FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-forked-6wj3l9)

#### External use

```jsx
import React from 'react'
import {
  Flower,
  FlowerRoute,
  FlowerNavigate,
  FlowerNode,
  useFlower
} from '@flowerforce/flower-react'

export const Page = () => {
  // useFlower in external usage need to know context passing flowName
  const { next, back, jump } = useFlower({ flowName: 'demo' })

  return (
    <>
      <button onClick={() => next()}>click me and go next</button>

      <Flower name="demo">...</Flower>
    </>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-forked-jk86mh)

### Utils Callback onEnter - onExit

onEnter (function): A callback function that is executed when entering the node state. It's useful for performing specific operations when the user transitions to this state.

onExit (function): A callback function that is executed when exiting the node state. It's useful for performing specific operations when the user leaves this state.

```jsx
import React from 'react'
import {
  Flower,
  FlowerRoute,
  FlowerNavigate,
  FlowerNode
} from '@flowerforce/flower-react'

export const Page = () => {
  return (
    <Flower name="demo">
      <FlowerRoute id="start" to={{ step1: null }} />

      <FlowerNode
        id="step1"
        to={{ step2: null }}
        // On mount component
        onEnter={() => console.log('enter on step1')}
        // On unmount component
        onExit={() => console.log('exit from step1')}
      >
        ...
        <FlowerNavigate action="next">
          <button>click me to go next</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="step2">...</FlowerNode>
    </Flower>
  )
}
```

## Form

Flower enables the quick creation of forms.

It keeps track of the form's validity status. This status not only facilitates displaying error messages to the user but can also be leveraged for implementing flow rules.

### Basic Usage

```jsx
import {
  Flower,
  FlowerNavigate,
  FlowerNode,
  FlowerField,
  FlowerAction,
  useFlower,
  useFlowerForm
} from '@flowerforce/flower-react'
import { useEffect } from 'react'
import './styles.css'

const ComponentAction = () => {
  const { next } = useFlower()
  const { getData } = useFlowerForm()

  useEffect(() => {
    // get form data
    const formData = getData()

    try {
      // * do your staff here - api call etc **
      // example setTimout to simulate delay api call
      setTimeout(() => {
        //  navigate to success step
        next('onSuccess')
      }, 500)
    } catch (error) {
      // navigate to error step
      next('onError')
    }
  }, [next, getData])

  return <span className="loader"></span>
}

export default function App() {
  return (
    <Flower name="demo">
      {/* step 1 */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>

          <div className="field">
            <label htmlFor="username">Username *</label>
            <FlowerField
              id="username"
              validate={[
                {
                  rules: { $and: [{ username: { $exists: true } }] },
                  message: 'Field is required'
                },
                {
                  rules: { $and: [{ username: { $strGte: '6' } }] },
                  message: 'Field length must be greater than or equal to 6.'
                }
              ]}
            >
              {({ onChange, value, errors }) => (
                <div className="input-container">
                  <input
                    id="username"
                    type="text"
                    value={value}
                    placeholder="Username"
                    onChange={(e) => onChange(e.target.value)}
                  />
                  {errors && <div className="error">{errors.join(', ')}</div>}
                </div>
              )}
            </FlowerField>
          </div>

          <div className="field">
            <label htmlFor="password">Password *</label>
            <FlowerField
              id="password"
              validate={[
                {
                  rules: { $and: [{ password: { $exists: true } }] },
                  message: 'Field is required'
                }
              ]}
            >
              {({ onChange, value, errors }) => (
                <>
                  <input
                    id="password"
                    type="password"
                    value={value}
                    placeholder="Password"
                    onChange={(e) => onChange(e.target.value)}
                  />
                  {errors && <div className="error">{errors.join(', ')}</div>}
                </>
              )}
            </FlowerField>
          </div>

          <FlowerNavigate
            action="next"
            rules={{ $and: [{ '$form.isValid': { $eq: true } }] }}
            alwaysDisplay
          >
            {({ onClick, hidden }) => (
              <button disabled={hidden} onClick={onClick}>
                Submit &#8594;
              </button>
            )}
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/* step 2 */}
      <FlowerAction id="step2" to={{ success: 'onSuccess', error: 'onError' }}>
        <div className="page step2">
          <ComponentAction />
        </div>
      </FlowerAction>

      {/* step 3 */}
      <FlowerNode id="success">
        <div className="page step3">
          <span>Success</span>

          <FlowerNavigate action="reset">
            <button>Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/* step 4 */}
      <FlowerNode id="error">
        <div className="page step4">
          <span>Error</span>
          <FlowerNavigate action="reset">
            <button>Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-forked-2f43gh)

## Operators Rules

The "rules" in Flower are used to define conditions and conditional behaviors within the workflow. These rules allow for dynamically changing the display or behavior of certain fields or components based on specific conditions.

The rules schema follows the MongoDB style, below is the list of available operators:

- $exists: Checks if a value exists or not.
- $eq: Checks if two values are equal.
- $ne: Checks if two values are not equal.
- $gt: Checks if the first value is greater than the second.
- $gte: Checks if the first value is greater than or equal to the second.
- $lt: Checks if the first value is less than the second.
- $lte: Checks if the first value is less than or equal to the second.
- $strGt: Checks if the length of a string is greater than the specified value.
- $strGte: Checks if the length of a string is greater than or equal to the specified value.
- $strLt: Checks if the length of a string is less than the specified value.
- $strLte: Checks if the length of a string is less than or equal to the specified value.
- $in: Checks if a value is present in a given array.
- $nin: Checks if a value is not present in a given array.
- $all: Checks if all values are present in a given array.
- $regex: Checks if a string matches a regular expression.

### Examples

Rules in $and | $or

```jsx
<FlowerNode id="node"
  to={{
    node2: {
      rules: { $and: [
        { myValue: { $exists: true } },
        { myValue: { $strGt: 6 } }

      ]}
    }
    }}>
        ...
</Flower>

<FlowerNode id="node"
  to={{
    node2: {
      rules: { $or: [
        { myValue: { $exists: false } },
        { myValue: { $strGt: 6 } }

      ]}
    }
    }}>
        ...
</Flower>

```

Compare state value, use '$ref:'

```jsx
<Flower name="demo" initialData={{ myValue1: 'test', myValue2: 'test2' }}>
<FlowerNode id="node"
  to={{
    node2: {
      rules: [
        { myValue1: { $eq: '$ref:myValue2' } }
      ]}
    }}>
        ...
</Flower>
```

## Display Rules

Showing or Hiding Fields: You can use rules to show or hide specific fields based on user choices. For example, hiding a "Buttons" unless the user selects a certain option.

We can use the FlowerRule component to hide a part of the UI according to certain rules.

If the "alwaysDisplay" property is passed, however, the component will not be automatically hidden, but a "hidden" property will be provided when the rules are not met.

### Example

```jsx
import React from 'react'
import {
  Flower,
  FlowerRoute,
  FlowerNode,
  FlowerRule,
  FlowerNavigate
} from '@flowerforce/flower-react'

export const Page = () => {
  return (
    <Flower name="demo" initialData={{ enableNav: true }}>
      <FlowerNode id="step1" to={{ step2: null }}>
        ...
        {/* show / hidden based on rule */}
        <FlowerRule rules={{ enableNav: { $eq: true } }}>
          <p>Buttons nav are enabled</p>
        </FlowerRule>
        {/* always visible component, hidden prop is true when rule is not matched */}
        <FlowerNavigate
          action="next"
          rules={{ enableNav: { $eq: true } }}
          alwaysDisplay
        >
          {({ onClick, hidden }) => (
            <button disabled={hidden} onClick={onClick}>
              Next &#8594;
            </button>
          )}
        </FlowerNavigate>
        {/* visible only when rule is matched */}
        <FlowerNavigate action="reset" rules={{ enableNav: { $eq: true } }}>
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
      ...
    </Flower>
  )
}
```

Edit on [codesandbox/](https://codesandbox.io/p/sandbox/flower-react-example-1-forked-sfn6ml)

# Documentation

The Flower React docs are published at [flower.stackhouse.dev/](https://flower.stackhouse.dev)
