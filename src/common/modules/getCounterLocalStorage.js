import localStorageSupport from './localStorageSupport';

const getCounterLocalStorage = count => {
  if (!localStorageSupport) {
    return false;
  } else {
    const count = window.localStorage.getItem('__counter__');
    console.log('found in localStorage: ', count);
    return count;
  }
};

export default getCounterLocalStorage;
