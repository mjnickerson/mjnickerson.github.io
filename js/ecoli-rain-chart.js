class eColiSummer {

    /*
     *  Constructor method
     */
    constructor(parentElement, displayData) {
        this.parentElement = parentElement;
        this.displayData = displayData;

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;
        console.log("a new E. coli class object has been initiated")
        console.log("ecoli data", vis.displayData)

        vis.margin = { top: 120, right: 20, bottom: 60, left: 70 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        console.log("height", vis.height)
        console.log("width", vis.width)
        console.log("parentElement", $('#'+vis.parentElement).width())


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Labels
        vis.svg.append("text")
            .text("Summer 2018")
            .attr("x", vis.width/2)
            .attr("y", vis.height + 40)
            .attr("text-anchor", "middle")

        vis.svg.append("text")
            .text("Concentration MPN/100mL")
            .attr("x", -40)
            .attr("y", vis.height/2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(270,-40,"+vis.height/2+")")


        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(8)
            .tickFormat(d3.timeFormat("%b %d"));

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.yRain = d3.scaleLinear()
            .range([vis.height,0])

        vis.xWet = d3.scaleBand()
            .range([0,vis.width])

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Append a path for the rainfall function
        vis.pathRain = vis.svg.append("path")

        // Append rain rectangles
        vis.wetRectangles = vis.svg.selectAll(".wet-rectangles")
            .data(vis.displayData, d => d.date)
            .enter()
            .append("rect")

        // append line for e. coli cutoff line
        vis.cutOff = vis.svg.append("line")

        // append text for cutoff label
        vis.cutOffLabel = vis.svg.append('text')

        // Append a path for the e.coli function
        vis.path = vis.svg.append("path")

        // define the div for the tooltip
        vis.toolTipDiv = d3.select("body").append("div")
            .attr("class", "ecoli-rain-tooltip")
            .style("opacity", 0);

        // Add Key
        vis.key = vis.svg.append("g")
            .attr("transform", "translate(0,-100)")
        vis.key.append("circle")
            .attr("r", 5*svgTransitions.master_scale_height)
            .attr("fill", "#1A5276")
        vis.key.append("circle")
            .attr("r", 5*svgTransitions.master_scale_height)
            .attr("cy", 20*svgTransitions.master_scale_height)
            .attr("fill", "red")
        // vis.key.append("circle")
        //     .attr("r", 5)
        //     .attr("cx", 15)
        //     .attr("cy", 20)
        //     .attr("fill", "#1A5276")
        //     .attr("stroke", "red")
        vis.key.append("circle")
            .attr("r", 5*svgTransitions.master_scale_height)
            .attr("cy", 40*svgTransitions.master_scale_height)
            .attr("fill", "#f98f8f")
        // vis.key.append("circle")
        //     .attr("r", 5)
        //     .attr("cx", 15)
        //     .attr("cy", 40)
        //     .attr("fill", "#1A5276")
        //     .attr("stroke", "#f98f8f")
        vis.key.append("rect")
            .attr("y", 55*svgTransitions.master_scale_height)
            .attr("x", -5*svgTransitions.master_scale_width)
            .attr("height", 10*svgTransitions.master_scale_height)
            .attr("width", 10*svgTransitions.master_scale_width)
            .attr("fill", "#a2cfe9" )
        vis.key.append("text")
            .text("= E. coli sample")
            .attr("x", 10*svgTransitions.master_scale_width)
            .attr("y", 5*svgTransitions.master_scale_height)
        vis.key.append("text")
            .text("= surpass daily limit for swimming")
            .attr("x", 10*svgTransitions.master_scale_width)
            .attr("y", 25*svgTransitions.master_scale_height)
        vis.key.append("text")
            .text("= surpass 5-day average limit for swimming")
            .attr("x", 10*svgTransitions.master_scale_width)
            .attr("y", 45*svgTransitions.master_scale_height)
        vis.key.append("text")
            .text("= precipitation")
            .attr("x", 10*svgTransitions.master_scale_width)
            .attr("y", 65*svgTransitions.master_scale_height)

        //create date converter
        vis.dateFormater = d3.timeFormat("%B %d, %Y")


        vis.wrangleData();
    }

    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // create values of cut off
        vis.cutOffValues = {
            eColi: {value: 235, color: "red", otherMeasure: "eColiFiveDayAvg", strokeColor: "#f98f8f", label: "daily"},
            eColiFiveDayAvg: {value: 126, color: "#f98f8f", otherMeasure: "eColi", strokeColor: "red", label: "5-day avg"}
        }

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //update domains
        vis.x.domain(d3.extent(vis.displayData.map(function (d) { return d.date; })))
        vis.y.domain([0, d3.max(vis.displayData.map(function (d) { return d.eColi;}))])

        // call axis within axis group
        vis.svg.select(".x-axis")
            .transition()
            .duration(800)
            .call(vis.xAxis);
        vis.svg.select(".y-axis")
            .transition()
            .duration(800)
            .call(vis.yAxis);

        vis.circles = vis.svg.selectAll(".eColiCircle")
            .data(vis.displayData, d => d.date)
            .enter()
            .append("circle")
            .attr("cx", d => vis.x(d.date))
            .attr("cy", d => vis.y(d.eColi))
            .attr("r", 5)
            .attr("class", ".eColiCircle")
            .style("fill", "#1A5276")
            .on("mouseover", function (event, d) {
                console.log("moused over e. coli circle")
                vis.toolTipDiv.style("opacity",1)
                vis.toolTipDiv.html("Date: <b>" + vis.dateFormater(d.date) + "</b>" +
                    "<br>E. coli: <b>" + d.eColi + " MPN/100mL</b>  " +
                    "<br> 5-day Average: <b>" + d.eColiFiveDayAvg + " MPN/100mL</b>" +
                    "</br> Rainfall: <b>"+ d.rainfall + " inches</b>" +
                    "</br> Weather: <b>" + d.wet + "</b>")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px")
            })
            .on("mouseout", function () {
                vis.toolTipDiv.style("opacity", 0)
            })

        vis.cutOff
            .attr("x1", 0)
            .attr("x2", vis.width)

        vis.cutOffLabel
            .attr("x", vis.width)
            .attr("text-anchor", "end")

        //this.measureSelector()
    }

    selectionChange() {
        let vis = this;

        console.log("SHOW CUT OFF SELECTION", d3.select("#cut-off-selector").property("value"))

        if (d3.select("#cut-off-selector").property("value") === "yes") {
            console.log("show cut off")
            let selectedMeasure = d3.select("#measure-selector").property("value")

                // add E. coli threshold line
                vis.cutOff
                    .attr("visibility", "visible")
                    .transition()
                    .duration(800)
                    .attr("y1", vis.y(vis.cutOffValues[selectedMeasure].value))
                    .attr("y2", vis.y(vis.cutOffValues[selectedMeasure].value))
                    .attr("stroke", vis.cutOffValues[selectedMeasure].color)

                vis.cutOffLabel
                    .attr("visibility", "visible")
                    .transition()
                    .duration(800)
                    .text(vis.cutOffValues[selectedMeasure].label + " limit for swimming: " + vis.cutOffValues[selectedMeasure].value + " CFU/100ml")
                    .attr("y", vis.y(vis.cutOffValues[selectedMeasure].value) - 3*svgTransitions.master_scale_height)
                    .attr("stroke", vis.cutOffValues[selectedMeasure].color)
                    .attr("class", "cut-off-text")

                // change circle color and position
                vis.circles
                    .transition()
                    .duration(800)
                    .attr("cy", d => vis.y(d[selectedMeasure]))
                    .style("fill", function(d) {
                        if (d[selectedMeasure] >= vis.cutOffValues[selectedMeasure].value) {return vis.cutOffValues[selectedMeasure].color}
                        else {return "#1A5276"}
                    })
                    .attr("stroke", function (d) {
                        if (d[vis.cutOffValues[selectedMeasure].otherMeasure] >= vis.cutOffValues[vis.cutOffValues[selectedMeasure].otherMeasure].value) {return vis.cutOffValues[selectedMeasure1].strokeColor}
                        else {return "none"}
                    })
        }

        else {
            console.log("remove cut off line")
            let selectedMeasure = d3.select("#measure-selector").property("value")

            // revert color of circles and change position of circles if needed
            vis.circles
                .transition()
                .duration(800)
                .attr("cy", d => vis.y(d[selectedMeasure]))
                .style("fill", "#1A5276")
                .attr("stroke", "none")

            //remove cut-off line
            vis.cutOff
                .transition()
                .duration(800)
                .attr("visibility", "hidden")
            vis.cutOffLabel
                .transition()
                .duration(800)
                .attr("visibility", "hidden")
        }


    }

    drawRain() {
        let vis = this;

        let selectedRain = d3.select("#rainfall-shower").property("value")
        console.log("selectedRain", selectedRain)

        vis.xWet.domain(vis.displayData.map(d => d.date))

        if (selectedRain === "wet") {
            vis.pathRain
                .attr("fill", "none")

            vis.wetRectangles
                .attr("x", d => vis.x(d.date)-5*svgTransitions.master_scale_width)
                .attr("y", 0)
                .attr("width", 10*svgTransitions.master_scale_width)
                .attr("height", function (d) {
                    if (d.wet === "wet") {return vis.height}
                })
                .attr("fill", "#a2cfe9")
        }

        else {
            vis.wetRectangles
                .attr("fill", "none")

            //update domains
            vis.yRain
                .domain([0, d3.max(vis.displayData.map(function (d) { return d[selectedRain];}))])

            vis.pathRain
                .datum(vis.displayData, d => d.date)
                .transition()
                .duration(800)
                .attr("d", d3.line().curve(d3.curveMonotoneX)
                    .x(function(d) { return vis.x(d.date) })
                    .y(function(d) { return vis.yRain(d[selectedRain]) })
                )
                .attr("fill", "#a2cfe9")
                .attr("stroke", "none")
        }

    }

    slideEnter() {

        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "55vh")
            .style("left", "1vw");

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(-1)")

    }

}