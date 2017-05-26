const url = 'https://59257e8a21cf650011fddc9b.mockapi.io/counter/count/count';

const fetchPutCounter = value => {
  return fetch((`${url}/1`), {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'count': value
    })
  })
  .then(res => res.json())
  .then(res => { console.log('PUT response: ', res); })
  .catch(err => {
    console.log('err in PUT: ', err);
  });
};

export default fetchPutCounter;
