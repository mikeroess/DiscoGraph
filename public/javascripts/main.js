const d3 = require('d3');
const RateLimiter = require('limiter').RateLimiter;
import { genreQuery, subGenreQuery } from './api.js';
import { clearChart, isButtonClicked,
  genreColors, startYearUpdate, endYearUpdate, addModal, removeModal,
  addTriviaModal, removeTriviaSpinner, allowTriviaClose, removeTriviaModal,
  addTriviaSpinner, addAboutSpinner, removeAboutSpinner } from './dom_methods.js';
import { margin, w, h, xScale, yScale, line, parseDate, GenerateLeftAxis, GenerateBottomAxis,
  getMaxRelease, getLatestDate, getEarliestDate } from './graph.js';
import { formatData, filterFetch, allGenres, getClickedGenres,
  getUnclickedGenres, setupLocalStorage, getColorsForPie,
  getPieGenres, formatPieData } from './data_wrangling.js';
import { writePie, removePie } from './pie.js';

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
      // limiter.removeTokens(1, function(err, remainingRequests) {
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
    // });
  }
};



const updateStartandEndYear = (startYear, endYear) => {
  if (Object.keys(JSON.parse(localStorage["subgenre"])).length !== 0) {
    fetchAndUpdateSubgenre();
  }
  const startGenresToUpdate = getClickedGenres().filter( (genre) => getEarliestDate(genre, localStorage) > startYear);
  startGenresToUpdate.forEach( (genre) => {
    const earliestDate = getEarliestDate(genre, localStorage);
    if (genre === startGenresToUpdate[startGenresToUpdate.length - 1]) {
      genreButtonClick(genre, startYear, earliestDate, removeTriviaModal);
    } else {
      genreButtonClick(genre, startYear, earliestDate);
    }
  });

  const endGenresToUpdate = getClickedGenres().filter( (genre) => getLatestDate(genre, localStorage) < endYear);
  endGenresToUpdate.forEach( (genre) => {
    const latestDate = getLatestDate(genre, localStorage);
    if (genre === endGenresToUpdate[endGenresToUpdate.length - 1]) {
      genreButtonClick(genre, latestDate, endYear, removeTriviaModal);
    } else {
      genreButtonClick(genre, latestDate, endYear);
    }
  });
};

const genreButtonClick = function (genre, startYear, endYear, cb) {
  const callback = cb;
  writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  const pieData = formatPieData(1975, localStorage);
  writePie(pieData, 1975);
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
        // limiter.removeTokens(1, function(err, remainingRequests) {
          genreQuery(data).then((response) => {
            const oldData = JSON.parse(localStorage[genre]);
            Object.assign(oldData, response);
            localStorage.setItem(genre, JSON.stringify(oldData));
            writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
            const reqYear = Object.keys(response)[0];
            if (typeof(callback) === "function" && Number(finalYear) === Number(reqYear)) {
              writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
              callback();
            }
          },
          (error) => {console.log(error);}
        );
      // });
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

      svg.on("mousemove", function() {
        let year = xScale.invert(d3.mouse(this)[0]).getFullYear();
        if (year < $('#startYear').val()) { year = $('#startYear').val(); }
        if (year > $('#endYear').val()) { year = $('#endYear').val(); }

        const pieData = formatPieData(year, localStorage);
        writePie(pieData, year);
      }
      );
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
        writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
    };


  rockButton.addEventListener("click", () => genreButtonClick("rock", $('#startYear').val(), $('#endYear').val(), removeSpinner ));
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
    updateStartandEndYear($('#startYear').val(), $('#endYear').val());
  });

  endYear.addEventListener("input", () => {
    endYearUpdate($('#endYear').val());
    writeGraph(localStorage, $('#startYear').val(), $('#endYear').val());
  });

  endYear.addEventListener("change", () => {
    updateStartandEndYear($('#startYear').val(), $('#endYear').val());
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
