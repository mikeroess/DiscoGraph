const d3 = require('d3');

export const margin = {top: 30, right: 20, bottom: 30, left: 50};
export const w = 950 - margin.left - margin.right;
export const h = 500 - margin.top - margin.bottom;

export const xScale = d3.scaleTime()
              .rangeRound([0, w - margin.left - margin.right]);

export const yScale = d3.scaleLinear()
              .rangeRound([h - margin.bottom - margin.top, 0]);

export const line = d3.line()
      .x(function(d) { return xScale(d[0]) })
      .y(function(d) { return yScale(d[1]) });

export const parseDate = d3.timeParse("%Y");

export const formatData = (genre, startYear, endYear) => {
  const keys = Object.keys(genre).sort();
  let filteredData = keys.filter((key) => {
    if (key >= startYear && key <= endYear) {
      return true;
    } else {
      return false;
    }
  });
  let formattedData = filteredData.map( (key) => {
    return [parseDate(key), genre[key]]; }
  );
  return formattedData;
};

export const GenerateLeftAxis = (scale) => {
  const leftAxis = d3.axisLeft(scale);
  return leftAxis;
};

export const GenerateBottomAxis = (scale) => {
const bottomAxis = d3.axisBottom(scale);
return bottomAxis;
};

export const getMaxRelease = (genres, storage) => {
  const topReleasesPerGenre = [];
  genres.forEach( (genre) => {
    if (genre === "subgenre") return
  topReleasesPerGenre.push(d3.max(Object.values(storage[genre])));
  });
  return d3.max(topReleasesPerGenre);
};


const getEarliestData = (genre, store) => {
  if (store[genre]) {
    return d3.min(Object.keys(JSON.parse(localStorage[genre])));
  }
  else return 2015;
};

const getLatestData = (genre, store) => {
  if (store[genre]) {
    return d3.max(Object.keys(JSON.parse(localStorage[genre])));
  }
  else return 1951;
};
