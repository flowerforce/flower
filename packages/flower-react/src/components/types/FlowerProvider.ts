import { ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Flower } from '@flowerforce/flower-core';
import { AnyAction } from 'redux';

export interface FlowerProviderInterface {
  render(): JSX.Element;
}

export type FlowerProviderProps = ToolkitStore<
  {
    flower: Record<string, Flower<any>>;
  },
  AnyAction,
  [
    ThunkMiddleware<
      {
        flower: Record<string, Flower<any>>;
      },
      AnyAction
    >
  ]
>;
