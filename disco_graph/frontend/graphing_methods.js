import * as d3 from "d3";

export const GenerateLeftAxis = (localStorage) => {
  const years = Object.keys(localStorage).sort();
  const allNumOfReleases = years.map((year) => localStorage[year]);
  const maxNumOfReleases = d3.max(allNumOfReleases);
  const minNumOfReleases = d3.min(allNumOfReleases);
  const releasesScale = d3.scaleLinear()
                    .domain([maxNumOfReleases, minNumOfReleases])
                    .range([0, 450]);
  const leftAxis = d3.axisLeft(releasesScale);
  return leftAxis;
};

export const GenerateBottomAxis = (localStorage) => {
  const Allyears = Object.keys(localStorage).sort();
  const maxYear = Allyears[Allyears.length -1];
  const minYear = Allyears[0];
  const yearsScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, 800]);
  const bottomAxis = d3.axisBottom(yearsScale)
        .tickFormat(d3.timeFormat("%Y").parse);
  return bottomAxis;
};
