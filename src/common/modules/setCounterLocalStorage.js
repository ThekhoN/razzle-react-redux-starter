import localStorageSupport from './localStorageSupport';

const setCounterLocalStorage = count => {
  if (!localStorageSupport) {
    return false;
  } else {
    window.localStorage.setItem('__counter__', count);
    console.log('stored in localStorage');
  }
};

export default setCounterLocalStorage;
