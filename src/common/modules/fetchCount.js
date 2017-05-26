import {polyfill} from 'es6-promise';
import 'isomorphic-fetch';
polyfill();

const fetchCount = callback => {
  fetch('https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count/1')
  .then(res => res.json())
  .then(count => {
    const result = count.count;
    // console.log('count from fetch request:', result);
    callback(result);
  })
  .catch(err => { console.log('error in fetchCounter: ', err); });
};

export default fetchCount;
