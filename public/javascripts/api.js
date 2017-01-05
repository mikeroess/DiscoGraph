// const genreQuery = (data) => {
//   return $.ajax({
//     method: "GET",
//     url: "api/genreQuery",
//     data: data
//   });
// };
//
// const subGenreQuery = (data) => {
//   localStorage.removeItem("subgenre");
//   return $.ajax({
//     method: "GET",
//     url: "api/subGenreQuery",
//     data: data
//   });
// };
//
// const genreColors = {
// "rock": "#8ce196",
// "pop": "steelblue",
// "hip-hop": "purple",
// "funk-soul": "orange",
// "electronic": "green",
// "classical": "brown",
// "jazz": "red",
// "subgenre": "black"
// };
//
// const genreButtonClick = function (genre, clicked, startYear, endYear) {
// writeGraph(localStorage, startYear, endYear);
// let data = {'genre': genre, 'startYear': startYear, 'endYear': endYear};
// genreQuery(data).then(
//   (response) => {
//     localStorage.setItem(genre, JSON.stringify(response[genre]));
//     writeGraph(localStorage, startYear, endYear);
//   },
//   (error) => console.log(error)
// );
// };
//
// const startYearUpdate = (year) => {
// $('#startYearDisplay').val(year);
// if (year >= $('#endYearDisplay').val()) {
// $('#endYear').val(parseInt(year) + 1);
// $('#endYearDisplay').val(parseInt(year) + 1);
// }
// };
//
// const endYearUpdate = (year) => {
// $('#endYearDisplay').val(year);
// if (year <= $('#startYearDisplay').val()) {
// $('#startYear').val(parseInt(year) - 1);
// $('#startYearDisplay').val(parseInt(year) - 1);
// }
// };
//
// const clearChart = () => {
// $(".graph").remove();
// };
//
// const isButtonClicked = (genre) => {
// const buttonId = genre + "-toggle";
// return document.getElementById(buttonId).checked;
// };
//
// const margin = {top: 30, right: 20, bottom: 30, left: 50};
// const w = 1050 - margin.left - margin.right;
// const h = 500 - margin.top - margin.bottom;
//
// const xScale = d3.scaleTime()
//           .rangeRound([0, w - margin.left - margin.right]);
//
// const yScale = d3.scaleLinear()
//           .rangeRound([h - margin.bottom - margin.top, 0]);
//
// const line = d3.line()
//   .x(function(d) { return xScale(d[0]) })
//   .y(function(d) { return yScale(d[1]) });
//
// const parseDate = d3.timeParse("%Y");
//
// const formatData = (genre, startYear, endYear) => {
// const keys = Object.keys(genre).sort();
// let filteredData = keys.filter((key) => {
// if (key >= startYear && key <= endYear) {
//   return true
// } else {
//   return false
// }
// })
// let formattedData = filteredData.map( (key) => {
// return [parseDate(key), genre[key]] }
// );
// return formattedData;
// };
//
// const GenerateLeftAxis = (scale) => {
// const leftAxis = d3.axisLeft(scale);
// return leftAxis;
// };
//
// const GenerateBottomAxis = (scale) => {
// const bottomAxis = d3.axisBottom(scale)
// return bottomAxis;
// };
//
// const getMaxRelease = (genres, storage) => {
// const topReleasesPerGenre = [];
// genres.forEach( (genre) => {
// if (genre === "subgenre") return
// topReleasesPerGenre.push(d3.max(Object.values(storage[genre])));
// })
// return d3.max(topReleasesPerGenre);
// }
//
// const writeGraph = (localData, minYear, maxYear) => {
//   const genres = Object.keys(localData).filter(
//     (genre) => {
//       if (isButtonClicked(genre)) return genre;
//     }
//   );
//   let globalData = {};
//   genres.forEach( (genre) => {
//   globalData[genre] = JSON.parse(localData[genre]).filter(
//   (object) => {
//     if (object.keys[0] > minYear && object.keys[0] < maxYear) {
//       return object;
//     }
//   }
//   );
// });
//
// const maxNumOfReleases = getMaxRelease(genres, globalData);
//
// xScale.domain([parseDate(minYear), parseDate(maxYear)]);
// yScale.domain([0, maxNumOfReleases]);
//
// const leftAxis = GenerateLeftAxis(yScale);
// const bottomAxis = GenerateBottomAxis(xScale);
//
// clearChart();
//
// let svg = d3.select('#d3Graph').append("svg")
//     .attr("class", "graph")
//     .attr("width", w + margin.left + margin.right)
//     .attr("height", h + margin.top + margin.bottom);
//
//   svg.append("g")
//     .attr("class", "axis")
//     .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
//     .call(leftAxis)
//   .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", "0.71em")
//     .attr("fill", "#000")
//     .text("Number of Releases");
//
//   svg.append("g")
//   .attr("class", "axis")
//     .attr("transform", `translate(${margin.left}, ${h - margin.bottom})`)
//     .call(bottomAxis);
//
// genres.forEach( (genre) => {
//   if (genre === 'subgenre') {
//     const subGenreObject = JSON.parse(localStorage[genre])
//     const genreName = Object.keys(subGenreObject)[0]
//     const formattedDataset = formatData(subGenreObject[genreName], minYear, maxYear)
//     if (formattedDataset.length === 0) { return }
//
//     svg.append("path")
//       .attr("d", line(formattedDataset))
//       .attr("stroke", genreColors[genre])
//       .attr("stroke-width", 2)
//       .attr("fill", "none")
//       .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
//
//     svg.append("text")
//     .attr("transform", "translate(" + (w + 3) + "," + yScale(formattedDataset[formattedDataset.length - 1][1]) + ")")
//     .attr("dy", "0.71em")
//     .attr("class", "genreLabel")
//     .style("fill", "black")
//     .text(genreName);
//
//   } else if (!isButtonClicked(genre)) {
//     return
//   } else {
//   const dataset = JSON.parse(localStorage[genre])
//   const formattedDataset = formatData(dataset, minYear, maxYear)
//   if (formattedDataset.length === 0) { return }
//
//   svg.append("path")
//     .attr("d", line(formattedDataset))
//     .attr("stroke", genreColors[genre])
//     .attr("stroke-width", 2)
//     .attr("fill", "none")
//     .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
//
//   svg.append("text")
//     .attr("transform", "translate(" + (w + 3) + "," + yScale(formattedDataset[formattedDataset.length - 1][1]) + ")")
//     .attr("dy", "0.71em")
//     .attr("class", "genreLabel")
//     .style("fill", genreColors[genre])
//     .text(genre);
// }}
// )
// }
//
// const prefetchData1 = function () {
// let data = {'genre': "hip-hop", 'startYear': 1970, 'endYear': 1985};
//     genreQuery(data).then(
//       (response) => {
//         localStorage.setItem("hip-hop", JSON.stringify(response['hip-hop']));
//         let data = {'genre': "electronic", 'startYear': 1960, 'endYear': 2016};
//         genreQuery(data).then(
//           (response) => {
//             localStorage.setItem("electronic", JSON.stringify(response['electronic']));
//           },
//           (error) => console.log(error)
//         );
//       },
//   (error) => console.log(error)
//   );
// };
//
// const prefetchFunk = function () {
// let data = {'genre': "funk-soul", 'startYear': 1970, 'endYear': 1985};
// genreQuery(data).then(
// (response) => {
//   localStorage.setItem("funk-soul", JSON.stringify(response['funk-soul']));
//   writeGraph(localStorage, startYear.value, endYear.value);
// },
// (error) => console.log(error)
// );
// };
//
// const prefetchPop = function () {
// let data = {'genre': "pop", 'startYear': 1970, 'endYear': 1985};
// genreQuery(data).then(
// (response) => {
//   localStorage.setItem("pop", JSON.stringify(response['pop']));
//   writeGraph(localStorage, startYear.value, endYear.value);
// },
// (error) => console.log(error)
// );
// };
//
//
// const prefetchData2 = function () {
// let data = {'genre': "pop", 'startYear': 1970, 'endYear': 1985};
// genreQuery(data).then(
//   (response) => {
//     localStorage.setItem("pop", JSON.stringify(response['pop']));
//     let data = {'genre': "funk-soul", 'startYear': 1970, 'endYear': 1985};
//     genreQuery(data).then(
//       (response) => {
//         localStorage.setItem("funk-soul", JSON.stringify(response['funk-soul']));
//       },
//   (error) => console.log(error)
//   );
//   },
// (error) => console.log(error)
// );
// };
