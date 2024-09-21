function fetchWithRetry(url, options, retries = 4) {
  return fetch(url, options)
    .then((res) => {
      if (res.ok) return res;
      else if (retries > 0) {
        console.log(`Retrying... attempts left: ${retries}`);
        return fetchWithRetry(url, options, retries - 1);
      } else throw new Error(res);
    })
    .catch((error) => {
      console.error(`Failed to fetch ${url}: `, error);
      // maybe you want to show the error in your app:
      // throw error; 
    });
}

export default fetchWithRetry;

