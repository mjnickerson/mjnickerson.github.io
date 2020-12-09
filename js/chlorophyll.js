class Chlorophyll{
    constructor(parentElement, chlorophyll) {
        this.parentElement = parentElement;
        this.data = chlorophyll;

        this.data.forEach(row => {
            row.Chlorophyll = +row.Chlorophyll;
            row.Date = dateParserChlorophyll(row.Date);
            row.FullYear = row.Date.getFullYear();

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
            .domain([0, d3.max(vis.data, function(d) {
                return d.Chlorophyll;
            })])
            .range([vis.height - vis.padding, vis.padding]);

        let linearColor = d3.scaleLinear()
            .domain(d3.extent(vis.data, function(d) {
                return d.Chlorophyll
            }))
            .range(["lightgreen", "darkgreen"]);


        let xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d => d);


        let yAxis = d3.axisLeft().scale(vis.y);

        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (vis.height - vis.padding) + ")")
            .call(xAxis);

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + vis.padding + ",0)")
            .call(yAxis)

        //Tooltip
        let tip = d3.tip()
            .attr("class", "chlorophyll-tooltip")
            .offset([-1, 100])
            .html(function(d) {
                return "Summer Mean Chlorophyll:" +" " + d.Chlorophyll + " " + "(ug/L)";
            });

        //average level: 19.72
        /*vis.svg.append("line")
            .attr("fill", "none")
            .attr("x1", vis.padding)
            .attr("x2", vis.width-vis.padding)
            .attr("y1", 450)
            .attr("y2", 450)
            .attr("stroke", "red")
            .style("stroke-dasharray", ("3, 3"))
            .attr("stroke-width", 1);

       //target level: 10
        vis.svg.append("line")
            .attr("fill", "none")
            .attr("x1", vis.padding)
            .attr("x2", vis.width-vis.padding)
            .attr("y1", 483)
            .attr("y2", 483)
            .attr("stroke", "grey")
            //.style("stroke-dasharray", ("3, 3"))
            .attr("stroke-width", 1);*/


        //get color range min max to change river color based on Ecoli CFO volume
        let valueMax = d3.max(vis.data, function(d) {
            return d.Chlorophyll;
        });
        let valueMin = d3.min(vis.data, function(d) {
            return d.Chlorophyll;
        });
        let valueRange = valueMax- valueMin;
        let opacityValue = 0.5 //default state


        //Chlorophyll marks
        let minYear = d3.min(vis.data, d => d.FullYear);
        vis.svg.selectAll("circle.dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("class", "dot")
           // .attr("clip-path","url(#chart1)")
           //.transition(500)
           // .duration(transitionDuration)
            //.attr("clip-path","url(#rect-clip)")
            .attr("r", 5)
            .attr("cy", d => vis.y(d.Chlorophyll))
            .attr("cx", d => vis.x(minYear))
            .attr("fill", d=> linearColor(d.Chlorophyll))
            //.attr("stroke-width", 1)
            .attr("stroke", "black")
            .attr("strokeWidth",1)
            .on("mouseover", function(e, d) {
                tip.show(d, this);
                let valuePercentile = ((d.Chlorophyll / valueRange)*10);
                if (d.Chlorophyll < 10){ opacityValue = 0.0}
                else { opacityValue = (Math.floor(valuePercentile)/10+0.4)};
                //change river color  (change opacity of the green, showing the blue below)
                document.getElementById("animatedWavesContainer-GREEN").style.opacity = opacityValue;
            })
            .on("mouseout", tip.hide)
            .on("click", function(e, d) { showEdition(d); });

       /* vis.svg.append("clipPath")
            .attr("id", "chart1")
            .append("rect")
            .attr("x", vis.padding)
            .attr("y",vis.padding)
            .attr("width", vis.width-vis.padding)
            .attr("height", 340);
*/

        vis.key = vis.svg.append("g")
            .attr("transform", "translate("+vis.width*4/5+", 50)")
        vis.key.append("circle")
            .attr("r", 5)
            .attr("fill", "darkgreen")
            .attr("stroke", "black")
            .attr("strokeWidth",1)
        vis.key.append("circle")
            .attr("r", 5)
            .attr("cy", 20)
            .attr("fill", "lightgreen")
            .attr("stroke", "black")
            .attr("strokeWidth",1)
        vis.key.append("text")
            .text("= high chlorophyll")
            .attr("x", 10)
            .attr("y", 5)
            .style("font-size", "10px")
            .style("fill", "#393838");
        vis.key.append("text")
            .text("= low chlorophyll")
            .attr("x", 10)
            .attr("y", 25)
            .style("font-size", "10px")
            .style("fill", "#393838");



        vis.svg.append("text")
            .attr("x", vis.width/2)
            .attr("y", 50)
            .attr("text-anchor", "middle")
            .style("font-size", "1.8vh")
            .style('font-color', 'black')
            .style("text-decoration", "bold")
            .text("Chlorophyll Levels over Summer");


        /*vis.svg.append("text")
            .attr("x", vis.width - 80)
            .attr("y", 493)
            .attr("text-anchor", "end")
            .style("font-size", "10px")
            .text("Target: 10 (ug/L)");

        vis.svg.append("text")
            .attr("x", vis.width - 80)
            .attr("y", 445)
            .attr("text-anchor", "end")
            .style("font-size", "10px")
            .style("fill", "red")
            .text("Mean: 19.72 (ug/L)");*/


        vis.svg.append("text")
            .attr("class", "chlorophyll-x-label")
            .attr("x", vis.width/2)
            .attr("y", vis.height-30)
            .text("Year");

        vis.svg.append("text")
            .attr("class", "chlorophyll-y-label")
            .attr("y", 20)
            .attr("x", (vis.height / 2) * -1)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Chlorophyll a (ug/L)");


        vis.svg.call(tip);
    }

    updateVis()
    {
        let vis = this;

        //new circle transition
        vis.svg.selectAll("circle.dot")
            .transition()
            .delay(function (d, i) {
                return i * 3;
            })
            .duration(2000)
            .attr("cx", d => vis.x(d.FullYear))
            .attr("cy", d => vis.y(d.Chlorophyll));
    }
}