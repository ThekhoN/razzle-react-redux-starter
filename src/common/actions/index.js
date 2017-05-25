import fetchPutCounter from '../modules/fetchPutCounter';

export const SET_COUNTER = 'SET_COUNTER';
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

export const increment = () => ({
  type: INCREMENT_COUNTER
});

export const decrement = () => ({
  type: DECREMENT_COUNTER
});

export const asyncIncrement = () => {
  return (dispatch, getState) => {
    dispatch(increment());
    const value = getState().counter;
    return fetchPutCounter(value);
  };
};

export const asyncDecrement = () => {
  return (dispatch, getState) => {
    dispatch(decrement());
    const value = getState().counter;
    return fetchPutCounter(value);
  };
};

export const asyncIncrementIfOdd = () => {
  return (dispatch, getState) => {
    const {counter} = getState();
    if (counter % 2 === 0) {
      return;
    }
    dispatch(increment());
    const value = getState().counter;
    return fetchPutCounter(value);
  };
};
