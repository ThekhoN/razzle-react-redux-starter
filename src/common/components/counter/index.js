import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions';
import getCounterLocalStorage from '../../modules/getCounterLocalStorage';
import fetchCount from '../../modules/fetchCount';
import './style.css';

class Counter extends Component {
  componentDidMount () {
    const {setCounter} = this.props;
    const localStorageCounter = getCounterLocalStorage();
    console.log('getCounterLocalStorage: ', localStorageCounter);
    if (!localStorageCounter) {
      fetchCount(setCounter);
    } else {
      setCounter(localStorageCounter);
      console.log('using locally stored counter. . .');
    }
  }
  render () {
    const {asyncIncrement, asyncDecrement, asyncIncrementIfOdd, counter} = this.props;
    return (
      <div className='counter'>
        Clicked: <b className='special'>{counter}</b> times
        {' '}
        <button onClick={asyncIncrement}>+</button>
        {' '}
        <button onClick={asyncDecrement}>-</button>
        {' '}
        <button onClick={asyncIncrementIfOdd}>Increment if odd</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  counter: state.counter
});
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
