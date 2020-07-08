import "./styles.css";
import { createApi } from "./api";
import { isAlike, isFunction, capitalize } from "./util";

const api = createApi();
let state = { selected: "", filter: "" };

window.setState = function setState(update) {
  const oldState = JSON.stringify(state);
  state = isFunction(update) ? update(state) : { ...state, ...update };

  if (JSON.stringify(state) !== oldState) {
    render();
  }
};

async function render() {
  const [dogList, selectedDogImageList, breedOfTheDay] = await Promise.all([
    dogListCell(),
    selectedDogImageListCell(),
    breedOfTheDayCell()
  ]);

  function onSearch() {
    const value = document.getElementById("filterInput").value;
    window.setState(state => Object.assign(state, { filter: value }));
  }

  document.getElementById("app").innerHTML = `
  <h1>Hello dog lovers!</h1>
  ${breedOfTheDay}
  
  <br />

  ${JSON.stringify(state, undefined, 2)}

  <label>  
    Search for your favorite breed
    <input value="${state.filter}" id="filterInput" />
    <button onclick='(${onSearch})()'>Sök</button>
  </label>

  <div class="row spaceBetween">
    <div class="column">
      ${dogList}
    </div>
    
    <div class="column">
      ${selectedDogImageList}
    </div>
  </div>
  `;
}

async function dogListCell() {
  const dogs = await api.getAll();
  const resolved = await Promise.all(
    Object.entries(dogs)
      .flatMap(([breed, subBreeds]) =>
        subBreeds.length === 0
          ? [breed]
          : subBreeds.map(subBreed => `${breed}/${subBreed}`)
      )
      .filter(isAlike(state.filter))
      .map(dogCell)
  );

  return resolved.join("");
}

async function dogCell(breed) {
  const [image] = await api.getBreed(breed);

  return `
  <div class="desktop row m-2" onclick="setState({ selected: '${breed}' })">
    <img class="thumbnail" src='${image}'>
    <h4>${capitalize(breed)}</h4>
  </div>

  <div class="mobile row m-2" onclick="setState({ selected: '${breed}' })">
    <img class="thumbnail" src='${image}'>
    <h4>${capitalize(breed)}</h4>
  </div>
  `;
}

async function breedOfTheDayCell() {
  const [image] = await api.getRandomBreeds();
  const [, fullBreedName] = image.match(/breeds\/(.+)\//);
  const breed = fullBreedName.replace("-", "/");

  return `
  <div>
    <h2>Here is another majestic breed for you to check out!</h2>
    <img src='${image}' />
    <h3 onclick="setState({selected: '${breed}'})">Show me more from this breed!</h3>
  </div>
  `;
}

async function selectedDogImageListCell() {
  const seleectedImages = await api.getBreed(state.selected);

  const media = window.matchMedia("(max-width: 700px)");

  const imagesList = seleectedImages
    .map(img => `<img class="dogImage m-1" src="${img}"/>`)
    .join("");

  if (media.matches) {
    function closeDialog() {
      window.setState(state => Object.assign(state, { selected: "" }));
    }
    return state.selected
      ? `
      <dialog open={${
        state.selected
      }} style="position: absolut; top: 5px; width: 90%;">
        <button onclick='(${closeDialog})()'>close</button>
        ${imagesList}
      </dialog>
    `
      : "";
  } else {
    return imagesList;
  }
}

render();
