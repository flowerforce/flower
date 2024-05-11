/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useEffect } from 'react';

// import react-testing methods
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom';

import FlowerNode from '../components/FlowerNode';
import Flower from '../components/Flower';
import FlowerProvider from '../provider';
import useFlower from '../components/useFlower';
import useFlowerForm from '../components/useFlowerForm';

const Text = ({
  text,
  value,
  children,
}: {
  text?: string;
  value?: string;
  children?: any;
}) => <h1 data-testid="h1">{text || value || children}</h1>;
const Input = ({ onChange, value = '', name }) => {
  return (
    <input
      data-testid={name || 'input'}
      name={name}
      value={value}
      onChange={(evt) => onChange(evt.target.value)}
    />
  );
};

const ButtonNext = ({ id = '' }) => {
  const { onNext } = useFlower();
  return (
    <button data-testid={'btn-next' + id} onClick={() => onNext()}>
      NEXT
    </button>
  );
};

const InitState = ({ state }) => {
  const { onNext } = useFlower();
  const { setData, getData } = useFlowerForm();
  useEffect(() => {
    setData(state);
    // console.log(getData())
    onNext();
  }, [onNext, setData, getData, state]);
  return '...';
};

describe('Test Flower component', () => {
  it('Test flow success', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <Text>{'Step 1'}</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    );

    expect(screen.getByTestId('h1')).toHaveTextContent('Step 1');
  });
});
