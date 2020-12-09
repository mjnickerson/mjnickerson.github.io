class CSO {
    constructor(parentElement, cso, cloudContainer) {
        this.parentElement = parentElement;
        this.data = cso;
        this.cloudContainer = cloudContainer;

        this.data.forEach(row => {
            row.annualoverflowvolume = +row.annualoverflowvolume;

            row.date = dateParserCso(row.date);
            row.year = row.date.getFullYear();

        });

        this.riverColors = ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'red', 'red', 'red']

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        vis.padding = 100;

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);


        vis.cloud = d3.select(`#${vis.cloudContainer}`)
            .append("svg")
            .attr("width", $(`#${vis.cloudContainer}`).width())
            .attr("height", $(`#${vis.cloudContainer}`).height())
            .append("g").attr("id", "cso-cloud-bg");

        vis.cloud.append("image").attr("href", "img/cloud-movable.png");


        let bisectDate = d3.bisector(d=>d.date).left;

        let x = d3.scaleTime()
            .domain(d3.extent(vis.data, function(d) {
                return d.date;
            }))
            .range([vis.padding, vis.width - vis.padding]);

        let y = d3.scaleLinear()
            .domain([0, d3.max(vis.data, function(d) {
                return d.annualoverflowvolume;
            })])
            .range([vis.height - vis.padding, vis.padding]);

        let yscale= d3.scaleLinear()
            .domain([0,40])
            .range([0,40]);

        let xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d3.timeFormat("%Y"));

        let yAxis = d3.axisLeft().scale(y);

        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .call(xAxis);

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .call(yAxis)

        /*vis.svg.append("text")
            .attr("x", 600)
            .attr("y", 200)
            .attr("text-anchor", "middle")
            //.attr("class", "cso-chart-text")
            .style("font-size", "16px")
            .style('font-color', 'black')
            .style("text-decoration", "bold")
            .text("Hover over the dots and explore initiatives that led to the decrease in CSO"); */

        let area = d3.area()
            .x(function(d) {
                return x(d.date)
            })
            .y0(y(0))
            .y1(function(d) {
                return y(d.annualoverflowvolume)
            });

        // set the gradient for area chart
        vis.svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(0))
            .attr("x2", 0).attr("y2", y(650000000))
            .selectAll("stop")
            .data([
                    {offset: "0%", color: "#2db8e5"},
                    //{offset: "50%", color: "gray"},
                    {offset: "100%", color: "#935116"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });



        vis.svg.append("path")
            .datum(vis.data)
            .attr("class", "area")
            .attr("d", area);

        vis.svg.selectAll("circle.cso-year")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("class", "cso-year")
            .attr("id", d => "cso-year" + d.year)
            .attr("cy", d => y(d.annualoverflowvolume))
            .attr("cx", d => x(d.date))
            .attr("r", "8")
            /*.attr("r", d => {
                if (d.year === 1995)
                    return "8";
                return "8";
            })*/
            .attr("fill","black")
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            //.on("mouseover", function(e, d) { tip.show(d, this); })
          //  .on("mouseout", tip.hide)
           // .on("click", function(e, d) { showEdition(d); });

        vis.svg.append("rect")
            .attr("width", 15*svgTransitions.master_scale_width)
            .attr("height", 40**svgTransitions.master_scale_height)
            .attr("y", 50*svgTransitions.master_scale_height)
            .attr("x", vis.width*6/7)
            .attr("fill", "url(#rect-gradient");

        // set the gradient for legend chart
        vis.svg.append("linearGradient")
            .attr("id", "rect-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", 100*svgTransitions.master_scale_height)
            .attr("x2", 0).attr("y2", 50*svgTransitions.master_scale_height)
            .selectAll("stop")
            .data([
                {offset: "0%", color: "#2db8e5"},
                //{offset: "50%", color: "gray"},
                {offset: "100%", color: "#935116"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        vis.svg.append("text")
            .attr("class", "cso-legend")
            .attr("y", 60*svgTransitions.master_scale_height)
            .attr("x", vis.width*6/7+20*svgTransitions.master_scale_width)
            .attr("text-anchor", "right")
            .text("High CSO");

        vis.svg.append("text")
            .attr("class", "cso-legend")
            .attr("y", 80*svgTransitions.master_scale_height)
            .attr("x", vis.width*6/7+20*svgTransitions.master_scale_width)
            .attr("text-anchor", "right")
            .text("Low CSO");

        vis.svg.append("text")
            .attr("class", "cfo-y-label")
            .attr("y", 10*svgTransitions.master_scale_height)
            .attr("x", (vis.height / 2) * -1)
            .attr("text-anchor", "middle")
            //.attr("dy", "0.75em")
            .attr("transform", "rotate(-90)")
            .text("Annual overflow volume");


        vis.svg.append("text")
            .attr("class", "cfo-x-label")
            .attr("x", vis.width/2)
            .attr("y", vis.height-50**svgTransitions.master_scale_height)
            .text("Year");


        vis.svg.append("text")
            .attr("transform",
                "translate(" + (vis.width/2) + " ," +
                (vis.height + vis.margin.top + 20**svgTransitions.master_scale_height) + ")")
            .style("text-anchor", "middle")


        let tooltip = vis.svg.append("g")
            .attr("display", "none")
            .attr("class", "tooltip-group");

        tooltip.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("x1", 0)
            .attr("y1", vis.height - vis.padding)
            .attr("x2", 0)
            .attr("y2", vis.padding);

        let text = tooltip.append("text")
            .attr("class", "tooltip-text")
            .attr("y", vis.padding + 20*svgTransitions.master_scale_height)
            .style("fill", "black");


        let text1 = tooltip.append("text")
            .attr("class", "tooltip-text1")
            .attr("y", vis.padding + 50*svgTransitions.master_scale_height)
            .style("fill", "#393838");

        let text2 = tooltip.append("text")
            .attr("class", "tooltip-text2")
            .attr("y", vis.padding + 70*svgTransitions.master_scale_height)
            .style("fill", "#393838");

        let text3 = tooltip.append("text")
            .attr("class", "tooltip-text2")
            .attr("y", vis.padding + 90*svgTransitions.master_scale_height)
            .style("fill", "#393838");

        let overlay = vis.svg.append("rect")
            .attr("width", vis.width - (vis.padding * 2))
            .attr("height", vis.height - vis.padding)
            .attr("x", vis.padding)
            .attr("y", vis.padding)
            .attr("fill", "transparent")
            .on("mouseover", function (event, d) {
                $("#cso-hover-container").fadeOut(500);
                $("#cso-hover-label").fadeOut(500);
                tooltip.attr("display", "null");
            })
            .on("mouseout", function (event, d) {
                $("#cso-hover-container").fadeIn(500);
                $("#cso-hover-label").fadeIn(500);
                tooltip.attr("display", "none");
                vis.svg.selectAll("circle.cso-year").attr("fill", "black");
            })
            .on("mousemove", mousemove);


        /*
        vis.key = vis.svg.append("g")
            .attr("transform", "translate("+vis.width*6/7+", 50)")
        vis.key.append("circle")
            .attr("r", 5)
            .attr("fill", "#1f78b4")
        vis.key.append("circle")
            .attr("r", 5)
            .attr("cy", 20)
            .attr("fill", "#d95f02")
        vis.key.append("text")
            .text("= low level of CSO ")
            .attr("x", 10)
            .attr("y", 5)
            .style("font-size", "12px")
            .style("fill", "#393838");
        vis.key.append("text")
            .text("= high level of CSO")
            .attr("x", 10)
            .attr("y", 25)
            .style("font-size", "12px")
            .style("fill", "#393838");
*/
        vis.svg.append("text")
            .attr("class", "cfo-x-label")
            .attr("x", vis.width*1/3)
            .attr("y", 70*svgTransitions.master_scale_height)
            .style("font-size", "2vh")
            .text("Annual sewage overflow (CSO) over time");

        vis.svg.append("rect")
            .attr("id", "cso-hover-container")
            .attr("width", 110*svgTransitions.master_scale_width)
            .attr("height", 50*svgTransitions.master_scale_height)
            .attr("x", vis.width/2-24*svgTransitions.master_scale_width)
            .attr("y", 220*svgTransitions.master_scale_height)
            .attr("fill", "lightgrey")



        vis.svg.append("text")
            .attr("id", "cso-hover-label")
            .attr("class", "cfo-x-label")
            .attr("x", vis.width/2-15*svgTransitions.master_scale_width)
            .attr("y", 250*svgTransitions.master_scale_height)
            .style("font-size", "1.4vh")
            .text("Hover over me");


        function mousemove(event) {
            let x_coordinate = d3.pointer(event)[0];
            let x_date = x.invert(x_coordinate);
            let index = bisectDate(vis.data, x_date);
            tooltip.attr("transform", "translate(" + x_coordinate + ")");

            vis.svg.selectAll("circle.cso-year").attr("fill", "black");

            let closest = null;
            let right = vis.data[index];
            let x_right = x(right.date);
            if (Math.abs(x_right - x_coordinate) < 10) {
                closest = right;
            } else if (index) {
                let left = vis.data[index-1];
                let x_left = x(left.date);
                if (Math.abs(x_left - x_coordinate) < 10) {
                    closest = left;
                }
            }

            if (closest) {
                $("#cso-year" + closest.year).attr("fill", "green");
            }

            let anchor = (x_coordinate > (vis.width / 2)) ? "end" : "start";
            let x_text = (x_coordinate > (vis.width / 2)) ? -20 : 20;

            text.attr("text-anchor", anchor).attr("x", x_text);
            text1.attr("text-anchor", anchor).attr("x", x_text);
            text2.attr("text-anchor", anchor).attr("x", x_text);
            text3.attr("text-anchor", anchor).attr("x", x_text);

            if (closest && closest.initiativetext) {
                text.text(closest.year);
                text1.text(closest.initiativetext);
                text2.text(closest.initiativetext2);
                text3.text(closest.initiativetext3);
            } else {
                text.text("");
                text1.text("");
                text2.text("");
                text3.text("");
            }

            //change river color based on bisected CFO volume
            let valueMax = d3.max(vis.data, function(d) {
                return d.annualoverflowvolume;
            });
            let valueMin = d3.min(vis.data, function(d) {
                return d.annualoverflowvolume;
            });
            let valueRange = valueMax- valueMin;

            let valuePercentile = ((vis.data[index].annualoverflowvolume / valueRange)*10);
            let opacityValue = (Math.floor(valuePercentile)/10)+0.2;

            //change river color  (change opacity of the brown, showing the blue below)
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = opacityValue;

        }
    }

    transitionBackgroundEnter() {
        let vis = this;

        vis.cloud.transition().duration(30000).attr("transform", "translate(3000, 0)");
    }

    transitionBackgroundExit() {
        let vis = this;

        vis.cloud.transition().duration(0).attr("transform", "translate(0, 0)");
    }

    slideEnter() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "52vh")
            .style("left", "87vw")

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(1)")

    }


}