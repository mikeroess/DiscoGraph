const d3 = require('d3');
const Bottleneck = require("bottleneck");
import { genreQuery, subGenreQuery } from './api.js';
import { clearChart, isButtonClicked, setupLocalStorage,
  genreColors, startYearUpdate, endYearUpdate } from './dom_methods.js';
import { margin, w, h, xScale, yScale, line, parseDate,
  formatData, GenerateLeftAxis, GenerateBottomAxis,
  getMaxRelease } from './graph.js';

  const limiter = new Bottleneck(240, 60000);

const allGenres = ["rock", "pop", "hip-hop", "funk-soul", "jazz", "classical", "electronic"];

const updateStartYear = (startYear) => {
  const genresToUpdate = getClickedGenres();
  genresToUpdate.forEach( (genre) => {
    const earliestData = getEarliestData(genre, localStorage);
    // debugger
    if (startYear < earliestData) {
      genreButtonClick(genre, startYear, earliestData);
    }
  });
};

const updateEndYear = (endYear) => {
  const genresToUpdate = getClickedGenres();
  genresToUpdate.forEach( (genre) => {
    const latestData = getLatestData(genre, localStorage);
    if (endYear > latestData) {
      genreButtonClick(genre, latestData, endYear);
    }
  });
}

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

const getClickedGenres = () => {
  const clickedGenres = [];
  allGenres.forEach( (genre) => {
    if (isButtonClicked(genre)) {
      clickedGenres.push(genre);
    }
  });
  return clickedGenres;
};

const getUnclickedGenres = () => {
  const clickedGenres = [];
  allGenres.forEach( (genre) => {
    if (!isButtonClicked(genre)) {
      clickedGenres.push(genre);
    }
  });
  return clickedGenres;
};



const genreButtonClick = function (genre, startYear, endYear) {
  writeGraph(localStorage, startYear, endYear);
  const currentRecords = JSON.parse(localStorage[genre]);
  for (let i = startYear; i <= endYear; i++) {
    if (typeof(currentRecords[i]) !== "number") {
      let data = {'genre': genre, 'year': i};
      genreQuery(data).then((response) => {
        const yearRexep = /year=\d\d\d\d/;
        const reqUrl = response.req["url"];
        const oldData = JSON.parse(localStorage[genre]);
        const itemsPerYear = JSON.parse(response["text"])["pagination"]["items"];
        const year = reqUrl.match(yearRexep)[0].slice(5,9);
        // if (JSON.parse(response["text"])["results"][0] !== undefined) {
        //   year = parseInt(JSON.parse(response["text"])["results"][0]["year"]);
        // }
        oldData[year] = itemsPerYear;
        localStorage.setItem(genre, JSON.stringify(oldData));
        writeGraph(localStorage, startYear, endYear);
      },
      (err) => {console.log(err)}
    );
    }
  }
};

const writeGraph = (localData, minYear, maxYear) => {
  const genres = Object.keys(localData).filter(
    (genre) => {
      if (isButtonClicked(genre)) return genre;
    }
  );


  let globalData = {};
  genres.forEach( (genre) => {
    if (localData[genre]) {
      globalData[genre] = {};
      const minYear = Number(startYear.value);
      const maxYear = Number(endYear.value);
      const parsedData = JSON.parse(localData[genre])
      for (let i = minYear; i <= maxYear; i++) {
        if (parsedData[i]) {
          globalData[genre][i] = parsedData[i];
        };
      }
    }
  });


    if (localStorage["subgenre"] === undefined || localStorage["subgenre"] === "{}") {
    } else {
      const subgenreEntry = JSON.parse(localStorage["subgenre"]);
      const subgenre = Object.keys(subgenreEntry)[0];
      const subgenreData = subgenreEntry[subgenre];
      globalData[subgenre] = subgenreData;
      genres.push("subgenre");
    }





  const maxNumOfReleases = getMaxRelease(genres, globalData);

  xScale.domain([parseDate(minYear), parseDate(maxYear)]);
  yScale.domain([0, maxNumOfReleases]);

  const leftAxis = GenerateLeftAxis(yScale);
  const bottomAxis = GenerateBottomAxis(xScale);

  clearChart();

  let svg = d3.select('#d3Graph').append("svg")
        .attr("class", "graph")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom);

      svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
        .call(leftAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Number of Releases");

      svg.append("g")
      .attr("class", "axis")
        .attr("transform", `translate(${margin.left}, ${h - margin.bottom})`)
        .call(bottomAxis);

    genres.forEach( (genre) => {
      if (genre === 'subgenre') {
        const subGenreObject = JSON.parse(localStorage[genre])
        const genreName = Object.keys(subGenreObject)[0];
        const formattedDataset = formatData(subGenreObject[genreName], minYear, maxYear)
        if (formattedDataset.length === 0) { return; }

        svg.append("path")
          .attr("d", line(formattedDataset))
          .attr("stroke", genreColors[genre])
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("transform", `translate(${margin.left}, ${margin.bottom})`)

        svg.append("text")
        .attr("transform", "translate(" + (w + 3) + "," + yScale(formattedDataset[formattedDataset.length - 1][1]) + ")")
        .attr("dy", "0.71em")
        .attr("class", "genreLabel")
        .style("fill", "white")
        .text(genreName);

      } else {
      const dataset = JSON.parse(localStorage[genre]);
      const formattedDataset = formatData(dataset, minYear, maxYear);
      if (formattedDataset.length === 0) { return }

      svg.append("path")
        .attr("d", line(formattedDataset))
        .attr("stroke", genreColors[genre])
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

      svg.append("text")
        .attr("transform", "translate(" + (w + 3) + "," + yScale(formattedDataset[formattedDataset.length - 1][1]) + ")")
        .attr("dy", "0.71em")
        .attr("class", "genreLabel")
        .style("fill", genreColors[genre])
        .text(genre);
    }}
  )
};

// const prefetchData = () => {
//   console.log("prefetching");
//   console.log(localStorage);
//   allGenres.forEach( (genre) => {
//     genreButtonClick (genre, 1970, 1985);
//   });
//   console.log("done");
//   console.log(localStorage);
// };

const prefetchData = () => {
  console.log("prefetching");
  console.log(localStorage);
    genreButtonClick ("hip-hop", 1970, 1972);
  console.log("done");
  console.log(localStorage);
};

$(document).ready(() => {
  const rockButton = document.getElementById("rock-toggle");
  const popButton = document.getElementById("pop-toggle");
  const hipHopButton = document.getElementById("hip-hop-toggle");
  const funkSoulButton = document.getElementById("funk-soul-toggle");
  const electronicButton = document.getElementById("electronic-toggle");
  const classicalButton = document.getElementById("classical-toggle");
  const jazzButton = document.getElementById("jazz-toggle");
  const startYear = document.getElementById("startYear");
  const endYear = document.getElementById("endYear");
  const aboutModal = document.getElementById("aboutModal");
  const closeModal = document.getElementById("close");
  const openModal = document.getElementById("open");


  closeModal.onclick = () => { aboutModal.style.display = "none"; };
  openModal.onclick = () => { aboutModal.style.display = "block"; };

  rockButton.addEventListener("click", () => genreButtonClick("rock", $('#startYear').val(), $('#endYear').val()), false);
  popButton.addEventListener("click", () => genreButtonClick("pop", $('#startYear').val(), $('#endYear').val()), false);
  hipHopButton.addEventListener("click", () => genreButtonClick("hip-hop", $('#startYear').val(), $('#endYear').val()), false);
  funkSoulButton.addEventListener("click", () => genreButtonClick("funk-soul", $('#startYear').val(), $('#endYear').val()), false);
  electronicButton.addEventListener("click", () => genreButtonClick("electronic", $('#startYear').val(), $('#endYear').val()), false);
  classicalButton.addEventListener("click", () => genreButtonClick("classical", $('#startYear').val(), $('#endYear').val()), false);
  jazzButton.addEventListener("click", () => genreButtonClick("jazz", $('#startYear').val(), $('#endYear').val()), false);

  startYear.addEventListener("input", () => {
    startYearUpdate($('#startYear').val());
    updateStartYear($('#startYear').val());
    writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  });

  endYear.addEventListener("input", () => {
    endYearUpdate($('#endYear').val());
    writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  });

  setupLocalStorage();
  prefetchData();
  writeGraph(localStorage, startYear.value, endYear.value);

  $("#mainForm").submit( (e) => {
    e.preventDefault();
    debugger
    const style = $('#genre').val();
    const start = $('#startYear').val();
    const end = $('#endYear').val();
    for (let i = start; i <= end; i++) {
        let reqData = {'style': style, 'year': i};

        subGenreQuery(reqData).then(
          (response) => {
          const subgenre = genre.value;
          const yearRexep = /year=\d\d\d\d/;
          const reqUrl = response.req["url"];
          const year = reqUrl.match(yearRexep)[0].slice(5,9);
          const itemsPerYear = JSON.parse(response["text"])["pagination"]["items"];
          if (localStorage["subgenre"] === undefined || localStorage["subgenre"] === "{}") {
            const newData = {};
            newData[subgenre] = {};
            const updatingData = newData[subgenre];
            updatingData[year] = itemsPerYear;
            localStorage.setItem("subgenre", JSON.stringify(newData));
          } else {
            const oldEntry = JSON.parse(localStorage["subgenre"]);
            const oldData = oldEntry[subgenre];
            oldData[year] = itemsPerYear;
            localStorage.setItem("subgenre", JSON.stringify(oldEntry));
          }
          writeGraph(localStorage, startYear.value, endYear.value);
        },
        (err) => {
          console.log(err)
        }
      );
    }
  }
);
});
