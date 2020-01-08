
const width = 920;
const height = 630;

const tooltip = d3.select(".scatterplot")
	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip")
	.style("opacity", 0);

const render = data => {
	const margin = { top: 20, right: 20, bottom: 30, left: 60 };
	const innerWidth = width - margin.left - margin.right;
  	const innerHeight = height - margin.top - margin.bottom;

  	const outerWidth = width + margin.left + margin.right;
  	const outerHeight = height + margin.top + margin.bottom;

  	const x = d3.scaleLinear()
  		.range([0, innerWidth]);
  	const y = d3.scaleTime()
  		.range([0, innerHeight]);

  	const color = d3.scaleOrdinal(d3.schemeCategory10);
  	const timeFormat = d3.timeFormat("%M:%S");
	const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
	const yAxis = d3.axisLeft(y).tickFormat(timeFormat);

  	const svg = d3.select(".scatterplot")
  		.append('svg')
  		.attr("width", outerWidth)
  		.attr("height", outerHeight)
  		.attr("class", "graph")
  		.append("g")
  		.attr("transform", `translate(${margin.left},${margin.top})`);
  	
  	let parsedTime;

  	data.forEach(d => {
  		d.Place = +d.Place;
  		let parsedTime = d.Time.split(':');
    	d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  	});

  	x.domain([d3.min(data, d => d.Year -1), d3.max(data, d => d.Year + 1)]);
  	y.domain(d3.extent(data, d=> d.Time));

  	const xLabel = svg.append("g")
  		.attr("class", "x axis")
  		.attr("id", "x-axis")
  		.attr("transform", `translate(0,${innerHeight})`)
  		.call(xAxis)
  		.append("text")
  		.attr("class", "x-axis-label")
  		.attr("x", innerWidth)
  		.attr("y", -6)
  		.style("text-anchor", "end")
  		.text("Year");

  	const yLabel = svg.append("g")
  		.attr("class", "y axis")
  		.attr("id", "y-axis")
  		.call(yAxis)
  		.append("text")
  		.attr("class", "label")
  		.attr("transform", "rotate(-90)")
  		.attr("y", 6)
  		.attr("dy", ".71em")
  		.style("text-anchor", "end")
  		.text("Best Time (minutes)");


  	const dot = svg.selectAll(".dot")
  					.data(data)
  					.enter()
  					.append("circle")
  					.attr("class", "dot")
  					.attr("r", 6)
  					.attr("cx", d => x(d.Year))
  					.attr("cy", d => y(d.Time))
  					.attr("data-xvalue", d => d.Year)
  					.attr("data-yvalue", d => d.Time.toISOString())
  					.style("fill", d => color(d.Doping != ""));
  	const tooltipEvent = dot.on("mouseover", d => {
  		tooltip.style("opacity", .9);
	    tooltip.attr("data-year", d.Year);
	    tooltip.html(d.Name + ": " + d.Nationality + "<br/>" +
	    "Year: " + d.Year + ", Time: " + timeFormat(d.Time) + (
	    d.Doping ? "<br/><br/>" + d.Doping : "")).
	    style("left", d3.event.pageX + "px").
	    style("top", d3.event.pageY - 28 + "px");
  	}).on("mouseout", d => {
  		tooltip.style("opacity", 0);
  	});
    const lh = i => (innerHeight / 2) - i * 20; 
  	const legend = svg.selectAll(".legend")
  				.data(color.domain())
  				.enter()
  				.append("g")
  				.attr("class", "legend")
  				.attr("id", "legend")
  				.attr("transform", (d,i) => `translate(0, ${lh(i)})`);

  	legend.append("rect")
  		.attr("x", innerWidth - 18)
  		.attr("width", 18)
  		.attr("height", 18)
  		.style("fill", color);

  	legend.append("text")
  		.attr("x", innerWidth - 24)
  		.attr("y", 9)
  		.attr("dy", ".35em")
  		.style("text-anchor", "end")
  		.text(d => {
  			if (d) return "Riders with doping allegations";
  			else {
  				return "No doping allegations";
  			}
  		});
} 

document.addEventListener('DOMContentLoaded', function(){
	const data_source = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

    const req=new XMLHttpRequest();
    req.open("GET",data_source,true);
    req.send();
    req.onload = function(){
    	const json = JSON.parse(req.responseText);
    	render(json);
	};	
});