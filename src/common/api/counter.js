import {polyfill} from 'es6-promise';
import 'isomorphic-fetch';
polyfill();

const url = 'https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count';

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const fetchCounter = callback => {
  // Rather than immediately returning, we delay our code with a timeout to simulate asynchronous behavior
  setTimeout(() => {
    callback(getRandomInt(1, 100));
  }, 500);

  // In the case of a real world API call, you'll normally run into a Promise like this:
  // API.getUser().then(user => callback(user))
};

/*
const asyncGetCount = () => {
  return fetch(url)
    .then(res => res.json())
    .then(count => {
    console.log('count: ', count[0].count);
  })
    .catch(err => {
      console.log('error in fetch: ', err);
    });
}
*/
