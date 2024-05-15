import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import App from './components/BoxForm/index';
import { FlowerProvider } from '@flowerforce/flower-react';
// import { Devtools } from '@flowerforce/devtools';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <FlowerProvider>
    <App />
  </FlowerProvider>
);

/* Devtools({
  // remote: 'asd',
  port: 8774,
  // sourceMap: require('./flower.source-map.json'),
  // enableScreenshot: true,
}); */
