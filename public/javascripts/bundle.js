/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	var genreQuery = function genreQuery(data) {
	  return $.ajax({
	    method: "GET",
	    url: "api/genreQuery",
	    data: data
	  });
	};
	
	var subGenreQuery = function subGenreQuery(data) {
	  localStorage.removeItem("subgenre");
	  return $.ajax({
	    method: "GET",
	    url: "api/subGenreQuery",
	    data: data
	  });
	};
	
	var genreColors = {
	  "rock": "#8ce196",
	  "pop": "steelblue",
	  "hip-hop": "purple",
	  "funk-soul": "orange",
	  "electronic": "green",
	  "classical": "brown",
	  "jazz": "red",
	  "subgenre": "black"
	};
	
	var genreButtonClick = function genreButtonClick(genre, clicked, startYear, endYear) {
	  writeGraph(localStorage, startYear, endYear);
	  var data = { 'genre': genre, 'startYear': startYear, 'endYear': endYear };
	  genreQuery(data).then(function (response) {
	    localStorage.setItem(genre, JSON.stringify(response[genre]));
	    writeGraph(localStorage, startYear, endYear);
	  }, function (error) {
	    return console.log(error);
	  });
	};
	
	var startYearUpdate = function startYearUpdate(year) {
	  $('#startYearDisplay').val(year);
	  if (year >= $('#endYearDisplay').val()) {
	    $('#endYear').val(parseInt(year) + 1);
	    $('#endYearDisplay').val(parseInt(year) + 1);
	  }
	};
	
	var endYearUpdate = function endYearUpdate(year) {
	  $('#endYearDisplay').val(year);
	  if (year <= $('#startYearDisplay').val()) {
	    $('#startYear').val(parseInt(year) - 1);
	    $('#startYearDisplay').val(parseInt(year) - 1);
	  }
	};
	
	var clearChart = function clearChart() {
	  $(".graph").remove();
	};
	
	var isButtonClicked = function isButtonClicked(genre) {
	  var buttonId = genre + "-toggle";
	  return document.getElementById(buttonId).checked;
	};
	
	var margin = { top: 30, right: 20, bottom: 30, left: 50 };
	var w = 1050 - margin.left - margin.right;
	var h = 500 - margin.top - margin.bottom;
	
	var xScale = d3.scaleTime().rangeRound([0, w - margin.left - margin.right]);
	
	var yScale = d3.scaleLinear().rangeRound([h - margin.bottom - margin.top, 0]);
	
	var line = d3.line().x(function (d) {
	  return xScale(d[0]);
	}).y(function (d) {
	  return yScale(d[1]);
	});
	
	var parseDate = d3.timeParse("%Y");
	
	var formatData = function formatData(genre, startYear, endYear) {
	  var keys = Object.keys(genre).sort();
	  var filteredData = keys.filter(function (key) {
	    if (key >= startYear && key <= endYear) {
	      return true;
	    } else {
	      return false;
	    }
	  });
	  var formattedData = filteredData.map(function (key) {
	    return [parseDate(key), genre[key]];
	  });
	  return formattedData;
	};
	
	var GenerateLeftAxis = function GenerateLeftAxis(scale) {
	  var leftAxis = d3.axisLeft(scale);
	  return leftAxis;
	};
	
	var GenerateBottomAxis = function GenerateBottomAxis(scale) {
	  var bottomAxis = d3.axisBottom(scale);
	  return bottomAxis;
	};
	
	var getMaxRelease = function getMaxRelease(genres, storage) {
	  var topReleasesPerGenre = [];
	  genres.forEach(function (genre) {
	    if (genre === "subgenre") return;
	    topReleasesPerGenre.push(d3.max(Object.values(storage[genre])));
	  });
	  return d3.max(topReleasesPerGenre);
	};
	
	var writeGraph = function writeGraph(localData, minYear, maxYear) {
	  var genres = Object.keys(localData);
	  var globalData = {};
	  genres.forEach(function (genre) {
	    globalData[genre] = JSON.parse(localData[genre]);
	  });
	
	  var maxNumOfReleases = getMaxRelease(genres, globalData);
	
	  xScale.domain([parseDate(minYear), parseDate(maxYear)]);
	  yScale.domain([0, maxNumOfReleases]);
	
	  var leftAxis = GenerateLeftAxis(yScale);
	  var bottomAxis = GenerateBottomAxis(xScale);
	
	  clearChart();
	
	  var svg = d3.select('#d3Graph').append("svg").attr("class", "graph").attr("width", w + margin.left + margin.right).attr("height", h + margin.top + margin.bottom);
	
	  svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + ", " + margin.bottom + ")").call(leftAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("fill", "#000").text("Number of Releases");
	
	  svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + ", " + (h - margin.bottom) + ")").call(bottomAxis);
	
	  genres.forEach(function (genre) {
	    if (genre === 'subgenre') {
	      var subGenreObject = JSON.parse(localStorage[genre]);
	      var genreName = Object.keys(subGenreObject)[0];
	      var formattedDataset = formatData(subGenreObject[genreName], minYear, maxYear);
	      if (formattedDataset.length === 0) {
	        return;
	      }
	
	      svg.append("path").attr("d", line(formattedDataset)).attr("stroke", genreColors[genre]).attr("stroke-width", 2).attr("fill", "none").attr("transform", "translate(" + margin.left + ", " + margin.bottom + ")");
	
	      svg.append("text").attr("transform", "translate(" + (w + 3) + "," + yScale(formattedDataset[formattedDataset.length - 1][1]) + ")").attr("dy", "0.71em").attr("class", "genreLabel").style("fill", "black").text(genreName);
	    } else if (!isButtonClicked(genre)) {
	      return;
	    } else {
	      var dataset = JSON.parse(localStorage[genre]);
	      var _formattedDataset = formatData(dataset, minYear, maxYear);
	      if (_formattedDataset.length === 0) {
	        return;
	      }
	
	      svg.append("path").attr("d", line(_formattedDataset)).attr("stroke", genreColors[genre]).attr("stroke-width", 2).attr("fill", "none").attr("transform", "translate(" + margin.left + ", " + margin.bottom + ")");
	
	      svg.append("text").attr("transform", "translate(" + (w + 3) + "," + yScale(_formattedDataset[_formattedDataset.length - 1][1]) + ")").attr("dy", "0.71em").attr("class", "genreLabel").style("fill", genreColors[genre]).text(genre);
	    }
	  });
	};
	
	var prefetchData1 = function prefetchData1() {
	  var data = { 'genre': "hip-hop", 'startYear': 1970, 'endYear': 1985 };
	  genreQuery(data).then(function (response) {
	    localStorage.setItem("hip-hop", JSON.stringify(response['hip-hop']));
	    var data = { 'genre': "electronic", 'startYear': 1960, 'endYear': 2016 };
	    genreQuery(data).then(function (response) {
	      localStorage.setItem("electronic", JSON.stringify(response['electronic']));
	    }, function (error) {
	      return console.log(error);
	    });
	  }, function (error) {
	    return console.log(error);
	  });
	};
	
	var prefetchFunk = function prefetchFunk() {
	  var data = { 'genre': "funk-soul", 'startYear': 1970, 'endYear': 1985 };
	  genreQuery(data).then(function (response) {
	    localStorage.setItem("funk-soul", JSON.stringify(response['funk-soul']));
	    writeGraph(localStorage, startYear.value, endYear.value);
	  }, function (error) {
	    return console.log(error);
	  });
	};
	
	var prefetchPop = function prefetchPop() {
	  var data = { 'genre': "pop", 'startYear': 1970, 'endYear': 1985 };
	  genreQuery(data).then(function (response) {
	    localStorage.setItem("pop", JSON.stringify(response['pop']));
	    writeGraph(localStorage, startYear.value, endYear.value);
	  }, function (error) {
	    return console.log(error);
	  });
	};
	
	var prefetchData2 = function prefetchData2() {
	  var data = { 'genre': "pop", 'startYear': 1970, 'endYear': 1985 };
	  genreQuery(data).then(function (response) {
	    localStorage.setItem("pop", JSON.stringify(response['pop']));
	    var data = { 'genre': "funk-soul", 'startYear': 1970, 'endYear': 1985 };
	    genreQuery(data).then(function (response) {
	      localStorage.setItem("funk-soul", JSON.stringify(response['funk-soul']));
	    }, function (error) {
	      return console.log(error);
	    });
	  }, function (error) {
	    return console.log(error);
	  });
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map