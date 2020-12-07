class Phosphorus {
    constructor(parentElement, phosphorus) {
        this.parentElement = parentElement;
        this.data = phosphorus;

        this.data.forEach(row => {
            row.Averageannualphosphorus = +row.Averageannualphosphorus;
            row.Year = dateParserPhosphorus(row.Year);
            row.FullYear = row.Year.getFullYear();
        });

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 50, right: 0, bottom: 0, left: 0 };
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        vis.padding = 80;

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);



        vis.x = d3.scaleLinear()
            .domain(d3.extent(vis.data, function(d) {
                return d.FullYear;
            }))
            .range([vis.padding, vis.width - vis.padding]);



        vis.y = d3.scaleLinear()
           .domain([0, d3.max(vis.data, d => d.Averageannualphosphorus)])
           .range([vis.height - vis.padding, vis.padding]);


        let linearColor = d3.scaleLinear()
            .domain(d3.extent(vis.data, function(d) {
                return d.Averageannualphosphorus;
            }))
            .range(["#D49C96", "#CB4335"]);


        let xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d => d);


        let yAxis = d3.axisLeft().scale(vis.y);

        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .call(xAxis)
            .attr("opacity", "1");

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .call(yAxis);


        //Tooltip
        let tip = d3.tip()
            .attr("class", "phosphorus-tooltip")
            .offset([-1, 100])
            .html(function(d) {
                return "Avg. Annual Phosphorus:" +" " + d.Averageannualphosphorus + " " + "(ug/L)";
            });

        let minYear = d3.min(vis.data, d => d.FullYear);
        vis.svg.selectAll("circle.dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("class", "dot")
          //  .attr("clip-path","url(#chart)")
            .attr("r", 5)
            .attr("cy", d => vis.y(d.Averageannualphosphorus))
            .attr("cx", d => vis.x(minYear))
            .attr("fill", d=> linearColor(d.Averageannualphosphorus))
            .attr("stroke", "black")
            .attr("strokeWidth",1)
            .on("mouseover", function(e, d) { tip.show(d, this); })
            .on("mouseout", tip.hide)
            .on("click", function(e, d) { showEdition(d); });

     /*   vis.svg.append("clipPath")
            .attr("id", "chart")
            .append("rect")
            .attr("x", vis.padding)
            .attr("y",vis.padding)
            .attr("width", vis.width-vis.padding)
            .attr("height", vis.height-vis.padding);
*/

        vis.key = vis.svg.append("g")
            .attr("transform", "translate("+vis.width*4/5+", 50)")
        vis.key.append("circle")
            .attr("r", 5)
            .attr("fill", "#CB4335")
            .attr("stroke", "black")
            .attr("strokeWidth",1)
        vis.key.append("circle")
            .attr("r", 5)
            .attr("cy", 20)
            .attr("fill", "#D49C96")
            .attr("stroke", "black")
            .attr("strokeWidth",1)
        vis.key.append("text")
            .text("= high phosphorus")
            .attr("x", 10)
            .attr("y", 5)
            .style("font-size", "10px")
            .style("fill", "#393838");
        vis.key.append("text")
            .text("= low phosphorus")
            .attr("x", 10)
            .attr("y", 25)
            .style("font-size", "10px")
            .style("fill", "#393838");


        vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", 50)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style('font-color', 'black')
            .style("text-decoration", "bold")
            .text("Avg. Annual Phosphorous Levels");

        vis.svg.append("text")
            .attr("class", "phosphorous-x-label")
            .attr("x", vis.width/2)
            .attr("y", vis.height-30)
            .text("Year");

        vis.svg.append("text")
            .attr("class", "phosphorus-y-label")
            .attr("y", 20)
            .attr("x", (vis.height / 2) * -1)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Phosphorus (ug/L)");



        vis.svg.call(tip);
    }

    updateVis() {
        let vis = this;

        //new circle transition
        vis.svg.selectAll("circle.dot")
            .transition()
            .delay(function(d, i){ return i * 3 ;})
            .duration(2000)
            .attr("cx", d => vis.x(d.FullYear))
            .attr("cy", d => vis.y(d.Averageannualphosphorus));

        let linearRegression = ss.linearRegression(vis.data.map(d => [d.FullYear, d.Averageannualphosphorus]));
        let linearRegressionLine = ss.linearRegressionLine(linearRegression);
        let xCoordinates = [vis.data[0].FullYear, vis.data.slice(-1)[0].FullYear];
        let regressionPoints = xCoordinates.map(d => ({ x: d, y: linearRegressionLine(d) }));


        //new line transition
        vis.svg.append("line")
            .transition()
            .delay(2000)
            .attr("x1", vis.x(regressionPoints[0].x))
            .attr("x2", vis.x(regressionPoints[1].x))
            .attr("y1", vis.y(regressionPoints[0].y))
            .attr("y2", vis.y(regressionPoints[1].y))
            .attr("stroke", "purple")
            .style("stroke-dasharray", ("3, 3"))
            .attr("stroke-width", 1);
    }

    slideEnter() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "6vh")
            .style("left", "88vw")

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(1)")
    }
}