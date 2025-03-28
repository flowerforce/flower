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

Flower React Form works with redux global state.

If you starts an application with Flower React Form from scratch, you need to wrap your application with ***FormProvider***
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

If your application is already built with redux as global state manager, you can use differents approaches:

- Separates Providers

In this case, you need to wrap your application with the ***FormProvider*** component in addition to the classic Redux provider.
The order of providers is not relevant, since their redux contexts are different.

```jsx
import React from 'react'
import { Provider } from 'react-redux'
import { yourStore } from 'yourStore'
import { FormProvider } from '@flowerforce/flower-react-form'

function Root() {
  return (
    <Provider store={yourStore}>
      <FormProvider>  
        <App />
      </FormProvider>
    </Provider>
  )
}
```
- Single Provider

For this scenario, we provides ***createStoreWithFlowerData***
This functions takes a `configureStoreOptions` object (same as createStore from redux) and an optional `middlewaresBlacklist`, since flower inject automatically some middlewares in its store.
To generate slices fully compatible, you can use ***createSliceWithFlowerData***, a function same as `createSlice` from redux.
Let's see the needed configuration
```jsx
import React from 'react'
import { Provider } from 'react-redux'
import { FormProvider, createStoreWithFlowerData, createSliceWithFlowerData } from '@flowerforce/flower-react-form'

const myStoreWithFlower = createSliceWithFlowerData({
  name: 'myStore',
  initialData: {},
  reducers: {
    add: (state) => {
      state.count += 1
    }
  }
})

const storeWithFlower = createStoreWithFlowerData({
  reducer: {
      myStore: myStoreWithFlower.reducer,
    }
})

function Root() {
  return (
    <Provider store={storeWithFlower}>
      <App />
    </Provider>
  )
}
```

In this scenario, we need a single provider, so we use the default redux provider

### N.B.: If form is used combined with flower-react, take a look to Configuration chapter of flower-react docs.

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
