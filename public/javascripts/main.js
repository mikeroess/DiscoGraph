const d3 = require('d3');
const RateLimiter = require('limiter').RateLimiter;
import { genreQuery, subGenreQuery } from './api.js';
import { clearChart, isButtonClicked,
  genreColors, startYearUpdate, endYearUpdate, addModal, removeModal,
  addTriviaModal, removeTriviaSpinner, allowTriviaClose, removeTriviaModal,
  addTriviaSpinner, addAboutSpinner, removeAboutSpinner } from './dom_methods.js';
import { margin, w, h, xScale, yScale, line, parseDate, GenerateLeftAxis, GenerateBottomAxis,
  getMaxRelease, getLatestData, getEarliestData } from './graph.js';
import { formatData, filterFetch, allGenres, getClickedGenres, getUnclickedGenres, setupLocalStorage } from './data_wrangling.js';

const limiter = new RateLimiter(240, "minute");

const fetchAndUpdateSubgenre = () => {
  const style = $('#genre').val();
  const start = $('#startYear').val();
  const end = $('#endYear').val();
  const subgenre = genre.value;
  const yearRexep = /year=\d\d\d\d/;
  const callback = () => { document.getElementById("triviaModal").style.display = "none"; };
  const currentEntry = JSON.parse(localStorage["subgenre"]);

  for (let i = start; i <= end; i++) {
      let reqData = {'style': style, 'year': i};
      addTriviaModal();
      limiter.removeTokens(1, function(err, remainingRequests) {
        subGenreQuery(reqData).then(
          (response) => {
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
          if (Number(end) === Number(year)) {
            callback();
          }
          removeSubgenre.style.display = "inline-block";
        }
        ,
        (err) => {
          console.log(err);
        }
      );
    });
  }
};

const updateStartYear = (startYear) => {
  if (Object.keys(JSON.parse(localStorage["subgenre"])).length !== 0) {
    fetchAndUpdateSubgenre();
  }
  const genresToUpdate = getClickedGenres().filter( (genre) => getEarliestData(genre, localStorage) > startYear);
  genresToUpdate.forEach( (genre) => {
    const earliestData = getEarliestData(genre, localStorage);
    if (genre === genresToUpdate[genresToUpdate.length - 1]) {
      genreButtonClick(genre, startYear, earliestData, allowTriviaClose);
    } else {
      genreButtonClick(genre, startYear, earliestData);
    }
  });
};

const updateEndYear = (endYear) => {
  if (Object.keys(JSON.parse(localStorage["subgenre"])).length !== 0) {
    fetchAndUpdateSubgenre();
  }
  const genresToUpdate = getClickedGenres().filter( (genre) => getLatestData(genre, localStorage) < endYear);
  genresToUpdate.forEach( (genre) => {
    const latestData = getLatestData(genre, localStorage);
    if (genre === genresToUpdate[genresToUpdate.length - 1]) {
      genreButtonClick(genre, latestData, endYear, allowTriviaClose);
    } else {
      genreButtonClick(genre, latestData, endYear);
    }
  });
};

const genreButtonClick = function (genre, startYear, endYear, cb) {
  const callback = cb;
  writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  const currentRecords = JSON.parse(localStorage[genre]);
  const yearsToFetch = filterFetch(currentRecords, genre, startYear, endYear);
  let finalYear;
  if (yearsToFetch.length > 0) finalYear = yearsToFetch[yearsToFetch.length - 1][1];
  yearsToFetch.forEach( (range) => {
    for (let i = range[0]; i <= range[1]; i++) {
      if (typeof(currentRecords[i]) !== "number") {


        const triviaSpinner = document.getElementById("triviaSpinner");
        triviaSpinner.style.display = "block";


        addTriviaModal();


        let data = {'genre': genre, 'year': i};
        limiter.removeTokens(1, function(err, remainingRequests) {
          genreQuery(data).then((response) => {
            const yearRexep = /year=\d\d\d\d/;
            const reqUrl = response.req["url"];
            const oldData = JSON.parse(localStorage[genre]);
            let itemsPerYear;
            if (JSON.parse(response["text"])["pagination"] !== "undefined") {
              itemsPerYear = JSON.parse(response["text"])["pagination"]["items"];
            }
            let reqYear;
            if (reqUrl.match(yearRexep)) {
              reqYear = reqUrl.match(yearRexep)[0].slice(5,9);
            }
            oldData[i] = itemsPerYear;
            localStorage.setItem(genre, JSON.stringify(oldData));
            writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
            if (typeof(callback) === "function" && Number(finalYear) === Number(reqYear)) {
              callback();
            }
          },
          (error) => {console.log(error);}
        );
      });
      }
    }
  });
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
      genres.push(subgenre);
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
      if (!allGenres.includes(genre)) {
          const formattedDataset = formatData(globalData[genre], minYear, maxYear);
        //
          if (formattedDataset.length === 0) { return; }
          if (genre === "") {
            genre = "unclassified";
          }
        svg.append("path")
          .attr("d", line(formattedDataset))
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("transform", `translate(${margin.left}, ${margin.bottom})`)

        svg.append("text")
        .attr("transform", "translate(" + (w + 3) + "," + yScale(formattedDataset[formattedDataset.length - 1][1]) + ")")
        .attr("dy", "0.71em")
        .attr("class", "genreLabel")
        .style("fill", "white")
        .text(genre);

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
  );
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
  const closeModal = document.getElementById("aboutClose");
  const openModal = document.getElementById("aboutOpen");
  const triviaModal = document.getElementById("triviaModal");
  const triviaSpinner = document.getElementById("triviaSpinner");
  const aboutSpinner = document.getElementById("aboutSpinner");
  const removeSubgenre = document.getElementById("removeSubgenre");
  const subgenreInput = document.getElementById("genre");

  closeModal.onclick = () => { aboutModal.style.display = "none"; };
  openModal.onclick = () => { aboutModal.style.display = "block"; };

  const prefetchCallback = () => {
    debugger
    aboutSpinner.style.display = "none";
    closeModal.style.display = "block";
  };


  const prefetchData = () => {
    aboutSpinner.style.display = "none";
    closeModal.style.display = "block";

    allGenres.forEach( (genre) => {
      if (filterFetch(JSON.parse(localStorage[genre]), genre, 1970, 1990).length > 0) {
        aboutModal.style.display = "block";
        aboutSpinner.style.display = "block";
        closeModal.style.display = "none";
      }

      genreButtonClick (genre, 1970, 1990, prefetchCallback);
    });
  };

  removeSubgenre.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("subgenre", "{}");
    writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
    removeSubgenre.style.display = "none";
    subgenreInput.value = "";

  });

  const removeSpinner = () => {
        triviaModal.style.display = "none";
    };


  rockButton.addEventListener("click", () => genreButtonClick("rock", $('#startYear').val(), removeSpinner ));
  popButton.addEventListener("click", () => genreButtonClick("pop", $('#startYear').val(), $('#endYear').val(), removeSpinner));
  hipHopButton.addEventListener("click", () => genreButtonClick("hip-hop", $('#startYear').val(), $('#endYear').val(), removeSpinner));
  funkSoulButton.addEventListener("click", () => genreButtonClick("funk-soul", $('#startYear').val(), $('#endYear').val(), removeSpinner));
  electronicButton.addEventListener("click", () => genreButtonClick("electronic", $('#startYear').val(), $('#endYear').val(), removeSpinner));
  classicalButton.addEventListener("click", () => genreButtonClick("classical", $('#startYear').val(), $('#endYear').val(), removeSpinner));
  jazzButton.addEventListener("click", () => genreButtonClick("jazz", $('#startYear').val(), $('#endYear').val(), removeSpinner));

  startYear.addEventListener("input", () => {
    startYearUpdate($('#startYear').val());
    writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  });

  startYear.addEventListener("change", () => {
    updateStartYear($('#startYear').val());
  });

  endYear.addEventListener("input", () => {
    endYearUpdate($('#endYear').val());
    writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  });

  endYear.addEventListener("change", () => {
    updateEndYear($('#endYear').val());
  });

  setupLocalStorage();
  prefetchData();
  writeGraph(localStorage, startYear.value, endYear.value);
  removeTriviaModal();

  $("#mainForm").submit( (e) => {
    e.preventDefault();
    fetchAndUpdateSubgenre();
  }
);
});
