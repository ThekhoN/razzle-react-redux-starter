import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Counter = ({
  asyncIncrement,
  asyncDecrement,
  asyncIncrementIfOdd,
  counter
}) => (
  <p>
    Clicked: <b>{counter}</b> times
    {' '}
    <button onClick={asyncIncrement}>+</button>
    {' '}
    <button onClick={asyncDecrement}>-</button>
    {' '}
    <button onClick={asyncIncrementIfOdd}>Increment if odd</button>
  </p>
);

Counter.propTypes = {
  asyncIncrement: PropTypes.func.isRequired,
  asyncIncrementIfOdd: PropTypes.func.isRequired,
  asyncDecrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
};

export default Counter;
