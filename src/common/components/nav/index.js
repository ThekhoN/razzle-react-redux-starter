import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import './style.css';

export default class Nav extends Component {
  render () {
    return (
      <nav>
        <NavLink exact to='/' activeClassName='active'>home</NavLink>
        <NavLink exact to='/counter' activeClassName='active'>counter</NavLink>
      </nav>
    );
  }
}
