import { getColorsForPie, getPieGenres } from './data_wrangling';



export const writePie = (data) => {
    $(".pie").remove();
  const dataset = data;
  const genres = getPieGenres(dataset);
  const d3 = require('d3');
  const width = 200;
  const height = 200;
  const radius = 100;

  const color = d3.scaleOrdinal()
    .range(getColorsForPie(genres));

  const pieSvg = d3.select("#d3Pie")
    .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'pie')
    .append('g')
      .attr('transform', `translate( ${width/2}, ${height/2})`);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

  const path = pieSvg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d.data.genre);
    });
  };
