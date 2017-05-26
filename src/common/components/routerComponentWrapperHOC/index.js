import React, {Component} from 'react';
import './style.css';

const routerComponentWrapperHOC = ComposedComponent => {
  return class HOCcontainer extends Component {
    render () {
      return (
        <div className='router-component-wrapper'>
          <ComposedComponent />
        </div>
      );
    }
  };
};

export default routerComponentWrapperHOC;
