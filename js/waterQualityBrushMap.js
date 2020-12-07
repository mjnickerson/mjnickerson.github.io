class waterQualityBrushMap {

    constructor (_parentElement, _data, _distanceData, _graphicsPaths, _eventHandler){
        this.parentElement = _parentElement;
        this.data = _data;
        this.distanceData = _distanceData;
        this.graphicsData = _graphicsPaths;
        this.filteredData = this.data;
        this.displayData = []
        this.eventHandler = _eventHandler;


        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");
        this.parseYear = d3.timeParse("%y");

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis(){
        let vis = this;

        vis.margin = { top: 0, right: 30, bottom: 38, left: 0 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = 200 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        ////////// CREATE TOOLTIP //////////////////
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')

        ////// Background River Figure ///////
        //Create river shape initial layout
        vis.svg
            .append('path')
            .attr("id", "backgroundRiverShape")
            .attr('fill', '#7370e5')//starting color
            .style("opacity", "1")
            .attr("d", vis.graphicsData[0].path)
            .attr("transform", 'translate(525,16) rotate(0) scale(0.135,-0.07)')


        ////// ID Circles and ID Numbers //////

        //This data is hard coded into the visualization, since it is identifying data only - is not used for filtering
        vis.stationData = [
            {"station":12, "station_ID":"#012", "stationPointX":48, "stationPointY":72, "fontOffsetX":5, "fontOffsetY":20, "project_id":"BHWQM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":1, "station_ID":"#001", "stationPointX":210, "stationPointY":110, "fontOffsetX":10, "fontOffsetY":15, "project_id":"CSORWM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":144, "station_ID":"#144", "stationPointX":330, "stationPointY":104, "fontOffsetX":10, "fontOffsetY":15, "project_id":"CSORWM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":2, "station_ID":"#002", "stationPointX":415, "stationPointY":85, "fontOffsetX":10, "fontOffsetY":15, "project_id":"CSORWM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":3, "station_ID":"#003", "stationPointX":525, "stationPointY":15, "fontOffsetX":10, "fontOffsetY":-2, "project_id":"CSORWM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":4, "station_ID":"#004", "stationPointX":645, "stationPointY":80, "fontOffsetX":-48, "fontOffsetY":15, "project_id":"CSORWM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":5, "station_ID":"#005", "stationPointX":655, "stationPointY":120, "fontOffsetX":10, "fontOffsetY":-10, "project_id":"CSORWM", "river_region":"UPPER BASIN", "dep_segment":"MA72-36"},
            {"station":206, "station_ID":"#206", "stationPointX":695, "stationPointY":140, "fontOffsetX":-48, "fontOffsetY":12, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-36"},
            {"station":6, "station_ID":"#006", "stationPointX":710, "stationPointY":140, "fontOffsetX":10, "fontOffsetY":12, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-38"},
            {"station":7, "station_ID":"#007", "stationPointX":810, "stationPointY":125, "fontOffsetX":5, "fontOffsetY":-10, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-38"},
            {"station":145, "station_ID":"#145", "stationPointX":850, "stationPointY":145, "fontOffsetX":5, "fontOffsetY":15, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-38"},
            {"station":8, "station_ID":"#008", "stationPointX":870, "stationPointY":130, "fontOffsetX":5, "fontOffsetY":-10, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-38"},
            {"station":9, "station_ID":"#009", "stationPointX":980, "stationPointY":110, "fontOffsetX":10, "fontOffsetY":20, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-38"},
            {"station":210, "station_ID":"#210", "stationPointX":980, "stationPointY":70, "fontOffsetX":-40, "fontOffsetY":-9, "project_id":"CSORWM", "river_region":"MID-BASIN", "dep_segment":"MA72-38"},
            {"station":10, "station_ID":"#010", "stationPointX":990, "stationPointY":75, "fontOffsetX":10, "fontOffsetY":10, "project_id":"CSORWM", "river_region":"MID BASIN", "dep_segment":"MA72-38"},
            {"station":166, "station_ID":"#166", "stationPointX":1030, "stationPointY":60, "fontOffsetX":10, "fontOffsetY":10, "project_id":"BHWQM", "river_region":"LOWER BASIN", "dep_segment":"MA72-38"},
            {"station":11, "station_ID":"#011", "stationPointX":1050, "stationPointY":42, "fontOffsetX":10, "fontOffsetY":-15, "project_id":"CSORWM", "river_region":"LOWER BASIN", "dep_segment":"MA72-38"},
        ]

        console.log("This Data", vis.stationData);

        vis.stationCircles = vis.svg.selectAll(".stationCircle")
            .data(vis.stationData)

        //Circle Marks:
        vis.stationCircles.enter()
            .append('circle')
            .attr("class", "stationCircle")
            .attr('fill', '#F87858')//starting color
            .attr("r", 8)
            .attr("cx",d => d.stationPointX)
            .attr("cy",d => d.stationPointY)
            .on("click", function(event, d){
                waterQualityChartClicked(d.station); //remove the # sign from station ID
            })
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', ' 3px')
                    .attr('stroke', 'black')
                    .style('fill', 'tomato')

                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                     <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                         <h6 style="color:white"><b>Water Quality Monitoring</b></h6>
                                         <h4 style="color:white">Station <b>${d.station_ID}</b></h4>
                                         <h6 style="color:white">DEP Segment: ${d.dep_segment}</h6>
                                         <h6 style="color:white">Station Location: ${d.river_region}, CHARLES RIVER</h6>
                                         <h6 style="color:white">Managing Project Entity: ${d.project_id}</h6>                                       
                                     </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('fill', '#F87858')
                // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            });


        vis.stationCircleLabels = vis.svg.selectAll(".stationCircleLabel")
            .data(vis.stationData)

        //BARS: ENTER
        vis.stationCircleLabels.enter()
            .append('text')
            .attr("class", "stationCircleLabel")
            .attr('fill', 'darkorange')//starting color
            .text(d=> d.station_ID)
            .attr("x",d => (d.stationPointX + d.fontOffsetX))
            .attr("y",d => (d.stationPointY + d.fontOffsetY));

        ///////// Scales and axes ////////////
        vis.x = d3.scaleLinear()
            .range([vis.width,0])

        // append axis scales to drawing space
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.svg.append("g")
            .attr("class", "x-axis bar-axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append('g')
            .attr('class', 'x-axis ecoli-axis-label')
            .append('text')
            .text("Map of Charles River: Water Quality Monitoring Stations")
            // .text("Distance from River Head (miles)")
            .attr('transform', `translate(${vis.width / 2}, ${vis.height + 35})`)
            .attr('text-anchor', 'middle')

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData(){
        let vis = this;

        if (verbose) { console.log(vis.filteredData) }

        // data aggregation steps for ecoli/fecal combination row:
        // filter by station (distance from start)
        // create a value for each year - the average of all values for that year

        vis.waterQualityByStation = Array.from(d3.group(vis.filteredData, d =>d.stationID), ([key, value]) => ({key, value}))
        if (verbose) { console.log(vis.waterQualityByStation) }

        vis.waterQualityByYear = Array.from(d3.group(vis.filteredData, d =>d.date.getFullYear()), ([key, value]) => ({key, value}))
        if (verbose) { console.log(vis.waterQualityByYear) }

        let qualityByYear = []

        // merge
        vis.waterQualityByYear.forEach( year => {
            let ecoliSamplingCount = 0;
            let ecoliLevels = 0;

            for(let i = 0; i < year.value.length; i++) {
                ecoliLevels += year.value[i].ecoliLevel;
                ecoliSamplingCount += 1;
            }
            let averageEcoli = ecoliLevels / ecoliSamplingCount;

            let swimCheck = "is NOT"

            if (averageEcoli < 126) {
                swimCheck = "IS"
            }

            // populate the final data structure
            qualityByYear[year.key] = {
                year: year.key,
                averageEcoli: averageEcoli,
                swimmable: swimCheck
            }
        })

        // Create items array
        vis.displayData = Object.keys(qualityByYear).map(function(key) {
            return qualityByYear[key];
        });


        // Update the visualization
        vis.updateVis();
    }


    //* The drawing function *//

    updateVis(){
        let vis = this;

        // Update Axis Domains
        vis.x.domain([0, (d3.max(vis.distanceData, d => d.milesUpriver ))]);

        //X AXIS WAS REMOVED, AS WAS NOT TRUE DISTANCE
        // Update the x-axis
        // vis.svg.select(".x-axis")
        //     .call(vis.xAxis);

        // Initialize brush component
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", waterQualityChartBrushed);


        if (ecoliBarRadioButtonState !== "station") { //if the user does not have station ID selected
            vis.svg.append("g") // Append brush component
                .attr("class", "x brush")
                .attr("id", "riverMapBrushArea")
                .call(vis.brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", vis.height + 7);
        } else {
            vis.svg.selectAll("#riverMapBrushArea").remove() //remove the brush area. This has to be removed to click stuff underneath.
        }

        console.log('EColi river brush map loading')

    }

}
