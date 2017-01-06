const d3 = require('d3');
// import {genreQuery, subGenreQuery } from './api.js';




const genreQuery = (data) => {
  return $.ajax({
    method: "GET",
    url: 'api',
    data: data
  });
};

const subGenreQuery = (data) => {
  localStorage.removeItem("subgenre");
  return $.ajax({
    method: "GET",
    url: "api/subGenreQuery",
    data: data
  });
};

const genreButtonClick = function (genre, clicked, startYear, endYear) {
  writeGraph(localStorage, startYear, endYear);
  const currentRecords = JSON.parse(localStorage[genre]);
  for (let i = startYear; i <= endYear; i++) {
    if (typeof(currentRecords[i]) !== "number") {
      console.log('fetchingData');
      let data = {'genre': genre, 'year': i};
      genreQuery(data).then((response) => {
        const oldData = JSON.parse(localStorage[genre]);
        const itemsPerYear = JSON.parse(response["text"])["pagination"]["items"];
        const year = parseInt(JSON.parse(response["text"])["results"][0]["year"]);
        oldData[year] = itemsPerYear;
        localStorage.setItem(genre, JSON.stringify(oldData));
        console.log(localStorage);
        writeGraph(localStorage, startYear, endYear);
      },
      (err) => {console.log(err)}
    );
  } else {
    console.log("already got it");
  }
  }
};



const clearChart = () => {
  $(".graph").remove();
};

const isButtonClicked = (genre) => {
  if( genre === "subgenre") return false;
  const buttonId = genre + "-toggle";
  return document.getElementById(buttonId).checked;
};

const margin = {top: 30, right: 20, bottom: 30, left: 50};
const w = 1050 - margin.left - margin.right;
const h = 500 - margin.top - margin.bottom;

const xScale = d3.scaleTime()
              .rangeRound([0, w - margin.left - margin.right]);

const yScale = d3.scaleLinear()
              .rangeRound([h - margin.bottom - margin.top, 0]);

const line = d3.line()
      .x(function(d) { return xScale(d[0]) })
      .y(function(d) { return yScale(d[1]) });

const parseDate = d3.timeParse("%Y");

const formatData = (genre, startYear, endYear) => {
  const keys = Object.keys(genre).sort();
  let filteredData = keys.filter((key) => {
    if (key >= startYear && key <= endYear) {
      return true
    } else {
      return false
    }
  })
  let formattedData = filteredData.map( (key) => {
    return [parseDate(key), genre[key]] }
  );
  return formattedData;
};

const GenerateLeftAxis = (scale) => {
  const leftAxis = d3.axisLeft(scale);
  return leftAxis;
};

const GenerateBottomAxis = (scale) => {
const bottomAxis = d3.axisBottom(scale);
return bottomAxis;
};

const getMaxRelease = (genres, storage) => {
  const topReleasesPerGenre = [];
  genres.forEach( (genre) => {
    if (genre === "subgenre") return
  topReleasesPerGenre.push(d3.max(Object.values(storage[genre])));
  })
  return d3.max(topReleasesPerGenre);
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
      globalData[genre] = JSON.parse(localData[genre]);
    }
  });


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
}




const genreColors = {
  "rock": "#8ce196",
  "pop": "steelblue",
  "hip-hop": "purple",
  "funk-soul": "orange",
  "electronic": "green",
  "classical": "brown",
  "jazz": "red",
  "subgenre": "black"
};

const setupLocalStorage = () => {
  localStorage.removeItem("subgenre");
  const genres = Object.keys(genreColors);
  genres.forEach( (genre) => {
    if (typeof(localStorage[genre]) === "undefined")
    localStorage.setItem(genre, JSON.stringify({}));
  });
};

const startYearUpdate = (year) => {
  $('#startYearDisplay').val(year);
  if (year >= $('#endYearDisplay').val()) {
    $('#endYear').val(parseInt(year) + 1);
    $('#endYearDisplay').val(parseInt(year) + 1);
  }
  writeGraph(localStorage, year, $('#endYear').val());
};

const endYearUpdate = (year) => {
   $('#endYearDisplay').val(year);
   if (year <= $('#startYearDisplay').val()) {
     $('#startYear').val(parseInt(year) - 1);
     $('#startYearDisplay').val(parseInt(year) - 1);
   }
   writeGraph(localStorage, $('#startYear').val(), year);
 };

$(document).ready(() => {




  var t = 1;
  var radius = 50;
  var squareSize = 6.5;
  var prec = 19.55;
  var fuzzy = 0.001;
  var inc = (Math.PI-fuzzy)/prec;
  var discoBall = document.getElementById("discoBall");

  for(var t=fuzzy; t<Math.PI; t+=inc) {
    var z = radius * Math.cos(t);
    var currentRadius = Math.abs((radius * Math.cos(0) * Math.sin(t)) - (radius * Math.cos(Math.PI) * Math.sin(t))) / 2.5;
    var circumference = Math.abs(2 * Math.PI * currentRadius);
    var squaresThatFit = Math.floor(circumference / squareSize);
    var angleInc = (Math.PI*2-fuzzy) / squaresThatFit;
    for(var i=angleInc/2+fuzzy; i<(Math.PI*2); i+=angleInc) {
      var square = document.createElement("div");
      var squareTile = document.createElement("div");
      squareTile.style.width = squareSize + "px";
      squareTile.style.height = squareSize + "px";
      squareTile.style.transformOrigin = "0 0 0";
      squareTile.style.webkitTransformOrigin = "0 0 0";
      squareTile.style.webkitTransform = "rotate(" + i + "rad) rotateY(" + t + "rad)";
      squareTile.style.transform = "rotate(" + i + "rad) rotateY(" + t + "rad)";
      if((t>1.3 && t<1.9) || (t<-1.3 && t>-1.9)) {
        squareTile.style.backgroundColor = randomColor("bright");
      } else {
        squareTile.style.backgroundColor = randomColor("any");
      }
      square.appendChild(squareTile);
      square.className = "square";
      squareTile.style.webkitAnimation = "reflect 2s linear infinite";
      squareTile.style.webkitAnimationDelay = String(randomNumber(0,20)/10) + "s";
      squareTile.style.animation = "reflect 2s linear infinite";
      squareTile.style.animationDelay = String(randomNumber(0,20)/10) + "s";
      squareTile.style.backfaceVisibility = "hidden";
      var x = radius * Math.cos(i) * Math.sin(t);
      var y = radius * Math.sin(i) * Math.sin(t);
      square.style.webkitTransform = "translateX(" + Math.ceil(x) + "px) translateY(" + y + "px) translateZ(" + z + "px)";
      square.style.transform = "translateX(" + x + "px) translateY(" + y + "px) translateZ(" + z + "px)";
      discoBall.appendChild(square);
    }
  }

  function randomColor(type) {
    var c;
    if(type == "bright") {
      c = randomNumber(130, 255);
    } else {
      c = randomNumber(110, 190);
    }
    return "rgb(" + c + "," + c + "," + c + ")";
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const lightSwitch = (state) => {
    if (state === true) {
      $("body").css("background-color", "#333");
    } else {
      $("body").css("background-color", "white");
    }
  };

  const discoSwitch = (state) => {
    if (state === true) {
      $(".disco").css("display", "block");
      lightSwitch(true);
    } else {
      $(".disco").css("display", "none");
      lightSwitch(false);
    }
  };


  const rockButton = document.getElementById("rock-toggle");
  const popButton = document.getElementById("pop-toggle");
  const hipHopButton = document.getElementById("hip-hop-toggle");
  const funkSoulButton = document.getElementById("funk-soul-toggle");
  const electronicButton = document.getElementById("electronic-toggle");
  const classicalButton = document.getElementById("classical-toggle");
  const jazzButton = document.getElementById("jazz-toggle");
  const lightsButton = document.getElementById("lights-toggle");
  const discoButton = document.getElementById("disco-toggle");
  const startYear = document.getElementById("startYear");
  const endYear = document.getElementById("endYear");


  rockButton.addEventListener("click", () => genreButtonClick("rock", rockButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  popButton.addEventListener("click", () => genreButtonClick("pop", popButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  hipHopButton.addEventListener("click", () => genreButtonClick("hip-hop", hipHopButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  funkSoulButton.addEventListener("click", () => genreButtonClick("funk-soul", funkSoulButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  electronicButton.addEventListener("click", () => genreButtonClick("electronic", electronicButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  classicalButton.addEventListener("click", () => genreButtonClick("classical", classicalButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  jazzButton.addEventListener("click", () => genreButtonClick("jazz", jazzButton.clicked, $('#startYear').val(), $('#endYear').val()), false);
  lightsButton.addEventListener("click", () => lightSwitch(lightsButton.checked))
  discoButton.addEventListener("click", () => discoSwitch(discoButton.checked))
  startYear.addEventListener("input", () => startYearUpdate($('#startYear').val()));
  endYear.addEventListener("input", () => endYearUpdate($('#endYear').val()));

  setupLocalStorage();

  $("#mainForm").submit( (e) => {
    e.preventDefault();
    const data = {'sub_genre': $('#genre').val(), 'startYear': $('#startYear').val(), 'endYear': $('#endYear').val() };
    writeGraph(localStorage, data["startYear"], data["endYear"]);
    subGenreQuery(data).then((response) => {
      const genre = Object.keys(response)[0];
      const releases = response[Object.keys(response)[0]];
      const tempObject = {};
      tempObject[genre] = releases;
      localStorage.setItem("subgenre", JSON.stringify(tempObject));
    },
  (err) => console.log(err));;
  });
});
