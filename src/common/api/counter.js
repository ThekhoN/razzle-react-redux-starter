import {polyfill} from 'es6-promise';
import 'isomorphic-fetch';
polyfill();

const url = 'https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count';

export const fetchCounter = callback => {
  return fetch(url)
    .then(res => res.json())
    .then(count => {
      // return count[0].count;
      callback(count[0].count);
    })
    .catch(err => { console.log('error in fetchCounter: ', err); });
};
