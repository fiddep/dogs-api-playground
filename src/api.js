function request(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => json.message);
}

export function createApi() {
  return {
    getAll: () => request("https://dog.ceo/api/breeds/list/all"),
    getBreed: breed =>
      breed ? request(`https://dog.ceo/api/breed/${breed}/images`) : [],
    getRandomBreeds: (amount = 1) =>
      request(`https://dog.ceo/api/breed/hound/images/random/${amount}`)
  };
}
