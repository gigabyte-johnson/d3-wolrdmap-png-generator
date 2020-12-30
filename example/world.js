const D3Node = require("d3-node");
const output = require("d3node-output");
const fs = require("fs");
const topojson = require("topojson");
const d3 = require("d3"); // v3.5.17
const d3Geo = require("d3-geo");
const d3Projection = require("d3-geo-projection");
const populationCsvString = fs
  .readFileSync("../data/world_population.csv")
  .toString();
const worldJson = JSON.parse(fs.readFileSync("../data/countries-50m.json"));

const worldPopulationData = d3.csv.parse(populationCsvString);

var width = 2560;
var height = 1440;

var year = "2005";

// geo map vars
var projection = d3Projection.geoMiller();
// var projection = d3Geo.geoMercator()

var path = d3Geo.geoPath().projection(projection);
var countries = topojson.feature(worldJson, worldJson.objects.countries);
projection.fitSize([width, height], countries)
var d3n = new D3Node({
  d3,
});
const d3nD3 = d3n.d3;
var colorScale = d3nD3
  .scaleLinear()
  .domain([0, countries.features.length])
  .range(["#C4D6D9", "#277FBC"]);

const svg = d3n.createSVG();
const offsetX = 560
svg
  .style("display", "block")
  .attr("viewBox", [offsetX/2, 150, width-offsetX, 750])
  // .style("background-color", "red");

// const worldG = svg.append("g");
svg
  .selectAll("path")
  .data(countries.features)
  .enter()
  .append("path")
  .attr("d", path) // draw the map
  .attr("data-name", (d) => d.properties.name)
  .attr("fill", function (d, index) {
    const popOneYear = worldPopulationData[index][year];
    if (popOneYear) {
      return colorScale(popOneYear);
    }
    return "#CCC";
  }) // 填入的顏色
  .attr("stroke", "transparent")
  .attr("stroke-linejoin", "round");

output("./world", d3n);
