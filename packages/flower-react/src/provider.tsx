import React, { PropsWithChildren, Component, createContext } from 'react';
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducerFlower } from './reducer';
import {
  FlowerProviderInterface,
  FlowerProviderProps,
} from './components/types/FlowerProvider';

const reduxContext = createContext(undefined);

export const useDispatch = createDispatchHook(reduxContext);
export const useSelector = createSelectorHook(reduxContext);
export const useStore = createStoreHook(reduxContext);

export const store = configureStore({
  reducer: reducerFlower,
  devTools: {
    name: 'flower',
  },
});

class FlowerProvider extends Component<
  PropsWithChildren,
  FlowerProviderProps
> {
  private store: FlowerProviderProps;
  constructor(props: PropsWithChildren) {
    super(props);
    this.store = store;
  }

  render() {
    const { children } = this.props;
    return (
      <Provider context={reduxContext} store={this.store}>
        {children}
      </Provider>
    );
  }
}

export default FlowerProvider;
