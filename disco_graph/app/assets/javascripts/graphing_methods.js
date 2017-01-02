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
const bottomAxis = d3.axisBottom(scale)
return bottomAxis;
};

const getMaxRelease = (genres, storage) => {
  const topReleasesPerGenre = [];
  genres.forEach( (genre) => {
    if (genre === "subgenre") return
  topReleasesPerGenre.push(d3.max(Object.values(storage[genre])));
  })
  return d3.max(topReleasesPerGenre);
}

const writeGraph = (localData, minYear, maxYear) => {
  const genres = Object.keys(localData);
  let globalData = {};
  genres.forEach( (genre) => {
    globalData[genre] = JSON.parse(localData[genre]);
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
        const genreName = Object.keys(subGenreObject)[0]
        const formattedDataset = formatData(subGenreObject[genreName], minYear, maxYear)
        if (formattedDataset.length === 0) { return }

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
        .style("fill", "black")
        .text(genreName);

      } else if (!isButtonClicked(genre)) {
        return
      } else {
      const dataset = JSON.parse(localStorage[genre])
      const formattedDataset = formatData(dataset, minYear, maxYear)
      if (formattedDataset.length === 0) { return }

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
        .style("fill", genreColors[genre])
        .text(genre);
    }}
  )
}
