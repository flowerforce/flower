# Flower React Form

<a alt="Flower logo" href="https://flowerjs.it/" target="_blank" rel="noreferrer"><img src="https://flowerjs.it/_next/static/media/flower-logo.bb32f863.svg" width="50"></a>

Flower React Form is a form management library for React.
Built on top of Flower Core, it can be easily integrated with FlowerReact or used independently while preserving Flower’s key features, such as render optimization, automatic data handling, and validation rule management.

For more info [flowerjs.it/](https://flowerjs.it/)

## Features

- **Data handling**: Read and write data to the global Redux store.
- **Form validation**: Built-in functionalities to validate individual inputs and the entire form.

### Installation

Flower React Form can be installed via npm or yarn for use in any JavaScript project.

### Using npm

1. Ensure you have Node.js and npm installed on your system.
2. Run the following command to install the library:

```bash
#NPM
npm install @flowerforce/flower-react-form
```

### Using yarn

1. Ensure you have yarn installed on your system.
2. Run the following command to install the library:

```bash
#YARN
yarn add @flowerforce/flower-react-form
```

## Configuration

The **FormProvider** component wraps the entire application, providing a global context for managing the application flow.

```jsx
import React from 'react'
import { FormProvider } from '@flowerforce/flower-react-form'

function Root() {
  return (
    <FormProvider>
      <App />
    </FormProvider>
  )
}
```
> FormProvider accepts some properties such as `reducers` and `configureStoreOptions` in order to inject custom reducers into redux instance provided by FlowerProvider component.
N.B.: actions and selectors from your custom reducers must use `useSelector` and `useDispatch` provided by flower-react-form 
```jsx
import React from 'react'
import { customReducer, customReducer2 } from 'my-custom-reducers'
import { FormProvider } from '@flowerforce/flower-react-form'

const reducers = {
  customReducer: customReducer.reducer,
  customReducer2: customReducer2.reducer
}

function Root() {
  return (
    <FormProvider reducers={reducers}>
      <App />
    </FormProvider>
  )
}
```

## How to use

### Simple Example

The **FlowerForm** component defines a form with a specific name, which serves as a unique identifier for the form. It is the main component for defining forms, accepting a required "name" property and an initialState field for prepopulating values.

```jsx
import React from 'react'
import { FlowerForm, FlowerField } from '@flowerforce/flower-react-form'

export const Page = () => {
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
        your input component...
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
        your input component...
      </FlowerField>
    </FlowerForm>
  
}
```
Edit on [codesandbox/](add link)

### Hook - useFlowerForm

Here, we are using the useFlower hook to obtain some essential functions for navigation and handling of the application flow.

#### useFlowerForm as child <FlowerForm>...</FlowerForm>

```jsx
import React from 'react'
import { FlowerForm, FlowerField } from '@flowerforce/flower-react-form'

const ViewFormState = () => {
  const { isValid, getData, setData, ...rest } = useFlowerForm()
  return <span>{isValid}</span>
}

export const Page = () => {
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
        your input component...
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
        your input component...
      </FlowerField>
      <ViewFormState />
    </FlowerForm>
  
}
```
Edit on [codesandbox/](add link)

#### External use of useFlowerForm

```jsx
import React from 'react'
import { FlowerForm, FlowerField } from '@flowerforce/flower-react-form'

export const Page = () => {
  const { isValid, getData, setData, ...rest } = useFlowerForm('form-test')

    return  (
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
        your input component...
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
        your input component...
      </FlowerField>
      <ViewFormState />
    </FlowerForm>
    )
  
}
```
Edit on [codesandbox/](add link)

# Documentation

The Flower React docs are published at [flowerjs.it/](https://flowerjs.it)
