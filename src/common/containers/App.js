import React from 'react';
import {Route} from 'react-router-dom';
import CounterContainer from '../components/counter';
import Nav from '../components/nav';
import HomePage from '../components/pageHome';
import routerComponentWrapperHOC from '../components/routerComponentWrapperHOC';
import './style.css';

const App = () => (
  <div className='react-app'>
    <Nav />
    <Route exact path='/' component={routerComponentWrapperHOC(HomePage)} />
    <Route exact path='/counter' component={routerComponentWrapperHOC(CounterContainer)} />
  </div>
);

export default App;
