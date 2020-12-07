class cyanoScatterChart {

    /*
     *  Constructor method
     */
    constructor(parentElement, chloroData, phaeoData, tempData) {
        this.parentElement = parentElement;
        this.chloroData = chloroData;
        this.phaeoData = phaeoData;
        this.tempData = tempData;

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;
        console.log("a new cyano/temp class object has been initiated")

        vis.margin = { top: 100, right: 50, bottom: 50, left: 50 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        vis.padding = vis.width/11

        vis.widthSmall = vis.width*(3/11)
        vis.heightSmall = (vis.height -vis.padding)/2

        vis.startingX = {one: 0, two: vis.widthSmall + vis.padding, three: 2*(vis.widthSmall + vis.padding), four: 0, five: vis.widthSmall + vis.padding, six: 2*(vis.widthSmall + vis.padding)}
        vis.startingY = {one: 0, two: 0, three: 0, four: vis.heightSmall + vis.padding, five: vis.heightSmall + vis.padding, six: vis.heightSmall + vis.padding}

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // scales for year graphs
        vis.yTemp = d3.scaleLinear()
            .range([vis.heightSmall, 0]);
        vis.yChloro = d3.scaleLinear()
            .range([vis.heightSmall, 0]);

        // time scales for years
        vis.timeScales = {
            Y2012: vis.x2012,
            Y2013: vis.x2013,
            Y2014: vis.x2014,
            Y2015: vis.x2015,
            Y2016: vis.x2016,
            Y2017: vis.x2017
        }

        //scales for second chart
        vis.yChloroBig = d3.scaleLinear()
            .range([vis.height,0])
        vis.xTemp = d3.scaleLinear()
            .range([0, vis.width]);

        //axis for small charts
        vis.xAxisList = {
            Y2012: vis.xAxis2012,
            Y2013: vis.xAxis2013,
            Y2014: vis.xAxis2014,
            Y2015: vis.xAxis2015,
            Y2016: vis.xAxis2016,
            Y2017: vis.xAxis2017
        }

        vis.yAxisList = {
            Y2012: vis.yAxis2012,
            Y2013: vis.yAxis2013,
            Y2014: vis.yAxis2014,
            Y2015: vis.yAxis2015,
            Y2016: vis.yAxis2016,
            Y2017: vis.yAxis2017
        }

        vis.yAxisTempList = {
            Y2012: vis.yAxisTemp2012,
            Y2013: vis.yAxisTemp2013,
            Y2014: vis.yAxisTemp2014,
            Y2015: vis.yAxisTemp2015,
            Y2016: vis.yAxisTemp2016,
            Y2017: vis.yAxisTemp2017
        }

        // axis for second, bigger chart
        vis.xAxisBig = d3.axisBottom()
            .scale(vis.xTemp);
            //.ticks(3);
        vis.yAxisBig = d3.axisLeft()
            .scale(vis.yChloroBig);

        vis.svg.append("g")
            .attr("class", "x-axis-Big axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis-Big axis");


        // configure paths into object
        vis.tempPaths = {
            Y2012: vis.pathTemp2012,
            Y2013: vis.pathTemp2013,
            Y2014: vis.pathTemp2014,
            Y2015: vis.pathTemp2015,
            Y2016: vis.pathTemp2016,
            Y2017: vis.pathTemp2017
        }

        vis.chloroPaths = {
            Y2012: vis.pathChloro2012,
            Y2013: vis.pathChloro2013,
            Y2014: vis.pathChloro2014,
            Y2015: vis.pathChloro2015,
            Y2016: vis.pathChloro2016,
            Y2017: vis.pathChloro2017
        }

        vis.phaeoPaths = {
            Y2012: vis.pathPhaeo2012,
            Y2013: vis.pathPhaeo2013,
            Y2014: vis.pathPhaeo2014,
            Y2015: vis.pathPhaeo2015,
            Y2016: vis.pathPhaeo2016,
            Y2017: vis.pathPhaeo2017
        }

        // create ellipse, line, & text for highlighted points
        vis.highlightCircle = vis.svg.append("ellipse")
            .attr("class", "highlight-elements yellow-color")
        vis.textHighlightLine = vis.svg.append("line")
            .attr("class", "highlight-elements")
        vis.highlightText = vis.svg.append("g")
            .attr("class", "highlight-elements")


        // create key
        vis.key = vis.svg.append("g")
            .attr("transform", "translate("+vis.width*2/3+",-80)")
        vis.key.append("circle")
            .attr("r", 5)
            .attr("fill", "#0E8B73")
        vis.key.append("circle")
            .attr("cy", 20)
            .attr("r", 5)
            .attr("fill", "#45B39D")
        vis.key.append("rect")
            .attr("y", 35)
            .attr("x",-5)
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "#F4D03F")
            .attr("class", "temp-key yellow-color")
        vis.key.append("text")
            .text("= Chlorophyl A concentration")
            .attr("x", 10)
            .attr("y", 5)
        vis.key.append("text")
            .text("= Phaeophytin concentration")
            .attr("x", 10)
            .attr("y", 25)
        vis.key.append("text")
            .text("= water temperature")
            .attr("x", 10)
            .attr("y", 45)
            .attr("class", "temp-key")

        // define the div for the tooltips
        vis.chloroToolTipDiv = d3.select("body").append("div")
            .attr("class", "cyano-temp-chloro-tooltip")
            .style("opacity", 0);
        vis.phaeoToolTipDiv = d3.select("body").append("div")
            .attr("class", "cyano-temp-phaeo-tooltip")
            .style("opacity", 0);

        //create date converter
        vis.dateFormater = d3.timeFormat("%B %d, %Y")

        //initiate text for revert button
        vis.resetbutton = vis.svg.append("text")

        vis.wrangleData();
    }

    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // transform data arrays to maps
        vis.displayChloroData = d3.group(vis.chloroData,d=>d.date.toString())
        vis.displayPhaeoData = d3.group(vis.phaeoData,d=>d.date.toString())
        vis.displayTempData = d3.group(vis.tempData,d=>d.date.toString())

        // create a new data structure: array combining all 3 input arrays
        vis.newDataStructure = []
        vis.displayChloroData.forEach(function(value, key) {

            let result = {
                date: value[0].date,
                chloro: value[0].avg
            }

            result.phaeo = vis.displayPhaeoData.get(key)[0].avg
            result.temp = vis.displayTempData.get(key)[0].avg

            vis.newDataStructure.push(result)
        })

        console.log ("NEW DATA STRUCTURE", vis.newDataStructure)

        // create sub data sets for each year
        vis.data2012 = vis.newDataStructure.filter(function(d) {
            return d.date.getFullYear() === 2012
        })

        vis.data2013 = vis.newDataStructure.filter(function(d) {
            return d.date.getFullYear() === 2013
        })

        vis.data2014 = vis.newDataStructure.filter(function(d) {
            return d.date.getFullYear() === 2014
        })

        vis.data2015 = vis.newDataStructure.filter(function(d) {
            return d.date.getFullYear() === 2015
        })

        vis.data2016 = vis.newDataStructure.filter(function(d) {
            return d.date.getFullYear() === 2016
        })

        vis.data2017 = vis.newDataStructure.filter(function(d) {
            return d.date.getFullYear() === 2017
        })

        vis.dataSets ={
            Y2012: vis.data2012,
            Y2013: vis.data2013,
            Y2014: vis.data2014,
            Y2015: vis.data2015,
            Y2016: vis.data2016,
            Y2017: vis.data2017
        }

        // Update the visualization
        vis.updateVis1("Y2012", "one");
        vis.updateVis1("Y2013", "two");
        vis.updateVis1("Y2014", "three");
        vis.updateVis1("Y2015", "four");
        vis.updateVis1("Y2016", "five");
        vis.updateVis1("Y2017", "six");
    }

    updateVis1(yearInput, locationInput) {
        let vis = this

        // hide any previous elements
        d3.selectAll(".highlight-elements, .x-axis-Big, .y-axis-Big, .scatter-axis-label")
            .attr("visibility", "hidden")

        // add title
        vis.svg.append("text")
            .text(yearInput.substring(1))
            .attr("x", vis.startingX[locationInput] + (vis.widthSmall/2))
            .attr("y", vis.startingY[locationInput] - 10)
            .attr("class", "year-titles")
            .attr("text-anchor", "middle")

        // create timescale specific to year
        vis.timeScales[yearInput] = d3.scaleTime()
            .range([0, vis.widthSmall])
            .domain(d3.extent(vis.dataSets[yearInput].map(function (d) { return d.date; })))

        // update domains
        vis.yChloro.domain([0,maxChloro])
        vis.yTemp.domain([0, maxTemp])

        // generate values for x-axis ticks
        let tickValues = vis.dataSets[yearInput].map(function(d) {
            return d.date
        })

        // generate axis
        vis.xAxisList[yearInput] = d3.axisBottom().scale(vis.timeScales[yearInput]).tickValues(tickValues).tickFormat(d3.timeFormat("%b"));
        vis.yAxisList[yearInput] = d3.axisLeft().scale(vis.yChloro).ticks(6);
        vis.yAxisTempList[yearInput] = d3.axisRight().scale(vis.yTemp).ticks(6);

        // append paths
        vis.tempPaths[yearInput] = vis.svg.append("path")
        vis.chloroPaths[yearInput] = vis.svg.append("path")
        vis.phaeoPaths[yearInput] = vis.svg.append("path")

        //draw temp component
        vis.tempPaths[yearInput]
            .datum(vis.dataSets[yearInput], d => d.date)
            .attr("d", d3.area().curve(d3.curveMonotoneX)
                .x(function(d) { return vis.startingX[locationInput] + vis.timeScales[yearInput](d.date) })
                .y0(vis.startingY[locationInput] + vis.yTemp(0))
                .y1(function(d) { return vis.startingY[locationInput] + vis.yTemp(d.temp) })
            )
            .attr("fill", "#F4D03F")
            .attr("class", "tempClass")

        //draw chloro data points
        vis.chloroCircles = vis.svg.selectAll(".chloroCircles-"+locationInput.toString())
            .data(vis.dataSets[yearInput], d => d.date)
            .enter()
            .append("circle")
            .attr("cx", d => vis.startingX[locationInput] + vis.timeScales[yearInput](d.date))
            .attr("cy", d => vis.startingY[locationInput] + vis.yChloro(d.chloro))
            .attr("r", 5)
            .attr("fill", "#0E8B73")
            .attr("class", "chloroCircleClass")
            .on("mouseover", function (event, d) {
                console.log("moused over chloro circle")
                vis.chloroToolTipDiv.style("opacity",1)
                vis.chloroToolTipDiv.html("<h4 style='color: white;'>Chlorophyl A</h4> </br> Date: <b>" + vis.dateFormater(d.date)
                    + "</br> Concentration: " + d.chloro.toFixed(2) +" ug/L"
                    + "</br> Temperature: " + d.temp.toFixed(2) + " °C"
                )
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px")
            })
            .on("mouseout", function () {
                vis.chloroToolTipDiv.style("opacity", 0)
            })

        // draw chloro line
        vis.chloroPaths[yearInput]
            .datum(vis.dataSets[yearInput], d => d.date)
            .attr("d", d3.line().curve(d3.curveMonotoneX)
                .x(function(d) { return vis.startingX[locationInput] + vis.timeScales[yearInput](d.date) })
                .y(function(d) { return vis.startingY[locationInput] + vis.yChloro(d.chloro) })
            )
            .attr("fill", "none")
            .attr("stroke", "#0E8B73")
            .attr("class", "chloro-phaeo-lines")

        // draw phaeo data points
        vis.phaeoCircles = vis.svg.selectAll(".phaeoCircles-"+locationInput.toString())
            .data(vis.dataSets[yearInput], d => d.date)
            .enter()
            .append("circle")
            .attr("cx", d => vis.startingX[locationInput] + vis.timeScales[yearInput](d.date))
            .attr("cy", d => vis.startingY[locationInput] + vis.yChloro(d.phaeo))
            .attr("r", 5)
            .attr("fill", "#45B39D")
            .attr("class", "phaeoCircleClass")
            .on("mouseover", function (event, d) {
                console.log("moused over phaeo circle")
                vis.phaeoToolTipDiv.style("opacity",1)
                vis.phaeoToolTipDiv.html("<h4 style='color: white;'>Phaeophytin</h4> </br>Date: <b>" + vis.dateFormater(d.date)
                    + "</br> Concentration: " + d.phaeo.toFixed(2) +" ug/L"
                    + "</br> Temperature: " + d.temp.toFixed(2) + " °C"
                )
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px")
            })
            .on("mouseout", function () {
                vis.phaeoToolTipDiv.style("opacity", 0)
            })

        // draw phaeo line
        vis.phaeoPaths[yearInput]
            .datum(vis.dataSets[yearInput], d => d.date)
            .attr("d", d3.line().curve(d3.curveMonotoneX)
                .x(function(d) { return vis.startingX[locationInput] + vis.timeScales[yearInput](d.date) })
                .y(function(d) { return vis.startingY[locationInput] + vis.yChloro(d.phaeo) })
            )
            .attr("fill", "none")
            .attr("stroke", "#45B39D")
            .attr("class", "chloro-phaeo-lines")

        // create groups to call axis within
        vis.svg.append("g")
            .attr("class", "axis axis-small x-axis-"+locationInput.toString())
            .attr("transform", "translate(" + vis.startingX[locationInput] + "," + (vis.startingY[locationInput] + vis.heightSmall) + ")");

        vis.svg.append("g")
            .attr("class", "axis axis-small y-axis-"+locationInput.toString())
            .attr("transform", "translate(" + vis.startingX[locationInput] + "," + vis.startingY[locationInput] + ")");

        vis.svg.append("g")
            .attr("class", "axis axis-small y-axis-Temp-"+locationInput.toString())
            .attr("transform", "translate(" + (vis.startingX[locationInput] + vis.widthSmall) + "," + vis.startingY[locationInput] + ")");

        // call axis within axis group
        vis.svg.select(".x-axis-" + locationInput.toString())
            .transition()
            .duration(800)
            .attr("visibility", "visible")
            .call(vis.xAxisList[yearInput]);
        vis.svg.select(".y-axis-" + locationInput.toString())
            .transition()
            .duration(800)
            .attr("visibility", "visible")
            .call(vis.yAxisList[yearInput]);
        vis.svg.select(".y-axis-Temp-" + locationInput.toString())
            .transition()
            .duration(800)
            .attr("visibility", "visible")
            .call(vis.yAxisTempList[yearInput]);

        // concentration axis label
        vis.svg.append("text")
            .text("ug/L")
            .attr("x", vis.startingX[locationInput])
            .attr("y", vis.startingY[locationInput] - 10)
            .attr("class", "year-axis-label")
            .attr("text-anchor", "middle")

        // temperature axis label
        vis.svg.append("text")
            .text("°C")
            .attr("x", vis.startingX[locationInput] + vis.widthSmall)
            .attr("y", vis.startingY[locationInput] - 10)
            .attr("class", "year-axis-label")
            .attr("text-anchor", "middle")
    }

    updateVis2() {
        let vis = this;

        console.log("updateVis2 begins!")

        // update domains
        vis.yChloroBig.domain([0, maxChloro])
        vis.xTemp.domain([0, maxTemp])

        d3.selectAll(".chloroCircleClass")
            .transition()
            .duration(1500)
            .attr("cx", d => vis.xTemp(d.temp))
            .attr("cy", d => vis.yChloroBig(d.chloro))

        d3.selectAll(".phaeoCircleClass")
            .transition()
            .duration(1500)
            .attr("cx", d => vis.xTemp(d.temp))
            .attr("cy", d => vis.yChloroBig(d.phaeo))

        d3.selectAll(".axis-small,.year-titles,.tempClass,.chloro-phaeo-lines,.year-axis-label,.temp-key")
            .attr("visibility", "hidden")

        // call axis within axis group
        vis.svg.select(".x-axis-Big")
            .transition()
            .duration(800)
            .attr("visibility", "visible")
            .call(vis.xAxisBig);
        vis.svg.select(".y-axis-Big")
            .transition()
            .duration(800)
            .attr("visibility", "visible")
            .call(vis.yAxisBig);

        //add axis label
        vis.svg.append("text")
            .text("Temperature (°C)")
            .attr("x", vis.width/2)
            .attr("y", vis.height +40)
            .attr("text-anchor", "middle")
            .attr("class", "scatter-axis-label")
            .attr("visibility", "visible")

        vis.svg.append("text")
            .text("Concentration (ug/L)")
            .attr("x", -30)
            .attr("y", vis.height/2)
            .attr("text-anchor", "middle")
            .attr("class", "scatter-axis-label")
            .attr("transform", "rotate(270,-30,"+vis.height/2+")")
            .attr("visibility", "visible")

        vis.resetbutton.text("<<reset")
            .attr("x", -30)
            .attr("y", -vis.margin.top/2)
            .attr("font-weight", "bold")
            .on("click", function (event, d) {
                vis.revertToVis1()
            })

        vis.highlightCircle
            .transition()
            .duration(1600)
            .attr("cx", vis.width*8/9)
            .attr("cy", vis.height/4)
            .attr("rx", vis.width/14)
            .attr("ry", vis.width/8)
            .attr("fill", "#F4D03F")
            .attr("visibility", "visible")

        // create highlight caption
        vis.highlightText
            .attr("transform", "translate("+vis.width/3+","+vis.height/4 +")")
            .attr("id", "highlight-text")
            .attr("visibility", "visible")
        vis.highlightText.append("text")
            .text("These are the highest measured")
        vis.highlightText.append("text")
            .text("concentrations of Chlorophyll A and")
            .attr("y",15)
        vis.highlightText.append("text")
            .text("Phaeophytin. They all occur when")
            .attr("y", 30)
        vis.highlightText.append("text")
            .text("the water temperature is also high.")
            .attr("y", 45)

        //create a line
        vis.textHighlightLine
            .attr("y1", vis.height/4 )
            .attr("x1",vis.width*.81)
            .attr("y2", vis.height/4)
            .attr("x2", (vis.width/3) + $('g#highlight-text').get(0).getBBox().width + 5)
            .attr("stroke", "black")
            .attr("visibility", "visible")

    }

    revertToVis1() {
        let vis = this;

        console.log("revertToVis1 function launched")
        d3.selectAll(".phaeoCircleClass").remove()
        d3.selectAll(".chloroCircleClass").remove()
        vis.wrangleData()
    }

    slideEnter() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "2vh")
            .style("left", "2vw")

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(1)")

    }

}