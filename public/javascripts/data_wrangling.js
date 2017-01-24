import { isButtonClicked, genreColors } from './dom_methods.js';
import { parseDate } from './graph.js';

export const allGenres = ["rock", "pop", "hip-hop", "funk-soul", "jazz", "classical", "electronic"];

export const setupLocalStorage = () => {
  localStorage.removeItem("subgenre");
  const genres = Object.keys(genreColors);
  genres.forEach( (genre) => {
    if (typeof(localStorage[genre]) === "undefined")
    localStorage.setItem(genre, JSON.stringify({}));
  });
  localStorage.setItem("subgenre", "{}");
};

export const formatData = (genre, startYear, endYear) => {
  const keys = Object.keys(genre).sort();
  let filteredData = keys.filter((key) => {
    if (key >= startYear && key <= endYear) { return true; }
  });
  let formattedData = filteredData.map( (key) => {
    return [parseDate(key), genre[key]]; }
  );
  return formattedData;
};

export const filterFetch = (oldEntry, genre, startYear, endYear) => {
  const missingYears = [];
  let start = null;
  let end = null;
  for (let i = startYear; i < endYear; i++ ) {
    if ( start === null ) {
      if (oldEntry[i] !== undefined) {
        continue;
      } else {
        start = i;
      }
    } else {
      if (oldEntry[i] === undefined) {
        continue;
      } else {
        end = i - 1;
        missingYears.push([start, end]);
        start = null;
      }
    }
  }
  if ( start !== null ) {
    if (oldEntry[endYear] !== undefined) {
      missingYears.push([start, endYear - 1]);
    } else {
      missingYears.push([start, endYear]);
    }
  } else {
    if (oldEntry[endYear] !== undefined) {
    } else {
      missingYears.push([endYear, endYear]);
    }
  }

  return missingYears;
};

export const getClickedGenres = () => {
  const clickedGenres = [];
  allGenres.forEach( (genre) => {
    if (isButtonClicked(genre)) {
      clickedGenres.push(genre);
    }
  });
  return clickedGenres;
};

export const getUnclickedGenres = () => {
  const clickedGenres = [];
  allGenres.forEach( (genre) => {
    if (!isButtonClicked(genre)) {
      clickedGenres.push(genre);
    }
  });
  return clickedGenres;
};

export const getColorsForPie = (genres) => {
  const colors = [];
  genres.forEach( (genre) => {
    colors.push(genreColors[genre]);
  });
  return colors;
};

export const getPieGenres = (data) => {
  const genres = [];
  data.forEach( (datum) => {
    genres.push(datum["genre"]);
  });
  return genres;
};

export const formatPieData = (year, dataset) => {
  const data = [];
  const genres = getClickedGenres();
  genres.forEach( (genre) => {
    const datum = {};
    const entry = JSON.parse(dataset[genre]);
    datum["genre"] = genre;
    datum["count"] = entry[year];
    data.push(datum);
  });
  return data;
};
