class waterQualityBarChart {

    constructor (_parentElement, _data, _distanceData, _eventHandler){
        this.parentElement = _parentElement;
        this.data = _data;
        this.distanceData = _distanceData;
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

        vis.margin = { top: 22, right: 30, bottom: 40, left: 105 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

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

        ////////// CREATE NARRATOR 2 FOR SITE //////////////////
        vis.narratorHotAirBaloonBox = d3.select("body").append('div')
            .attr('id', 'narraratorBalloonBox')


        ///////// Scales and axes ////////////
        vis.x = d3.scaleBand()
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .range([0, vis.height])

        // append axis scales to drawing space
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(5);

        vis.svg.append("g")
            .attr("class", "y-axis bar-axis")

        vis.svg.append("g")
            .attr("class", "x-axis bar-axis")
            .attr("transform", "translate(0," + vis.height + ")");

        // add title
        vis.svg.append('g')
            .append('text')
            .attr('class', 'title bar-label')
            .text("River Bacteria Levels")
            .attr('transform', `translate(${vis.width / 2}, -10)`)
            .attr('text-anchor', 'middle');

        vis.svg.append('g')
            .append('text')
            .attr('class', 'x-axis ecoli-axis-label')
            .text("Year")
            .attr('transform', `translate(${vis.width / 2}, ${vis.height + 35})`)
            .attr('text-anchor', 'middle')
      
        vis.svg.append('g')
            .append('text')
            .attr('class', 'y-axis ecoli-axis-label')
            .text("Average E. coli or Fecal coliform Level (#/100mL)")
            .attr('transform', `translate(-55, ${vis.height / 2}) rotate(-90)`)
            .attr('text-anchor', 'middle');


        // MOVE THIS CODE TO INIT VIS
        // AND UPDATE THE Y HEIGHT OF SWIMMABILITY

        //DRAW SWIMMABILITY CRITERIA

        //NON SWIMMABLE ZONE
        vis.svg
            .append('rect')
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                        .attr('stroke-width', ' 2px')
                        .attr('stroke', 'black')
                        .style('fill', '#ffffff')
                        .style("opacity", '0.60')

                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                 <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                     <h6 style="color:white"><b>Exceeded</b> EPA EColi Guideline for Swimmability > 126 / 100mL </h6>
                                 </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .attr('stroke-width', '0px')
                        .style('fill', '#fffcfc')
                        .style("opacity", '0.20')
                    // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})

                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
            .attr("id", "nonSwimmableBackgroundFill")
            .style('fill', '#ffffff')
            .style("opacity", '0.20')
            .attr("x", 1)
            .attr("y", 0)
            .attr("width", vis.width-1)


        //SWIMMABLE ZONE
        vis.svg
            .append('rect')
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                        .attr('stroke-width', '2px')
                        .attr('stroke', 'black')
                        .style("opacity", '0.60')
                        .style('fill', '#7370e5')

                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                 <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                     <h6 style="color:white"><b>Below</b> EPA EColi Guideline for Swimmability < 126 / 100mL </h6>
                                 </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .attr('stroke-width', '0px')
                        .style('fill', '#add8e6')
                        .style("opacity", '1')
                    // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})

                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
            .attr("id", "SwimmableBackgroundFill")
                .style('fill', '#add8e6')
                .style("opacity", '1')
                .attr("class", "swimmableBackgroundFill")
                .attr("x", 0)
                .attr("width", vis.width-1)


        vis.selectedstationID = 9999;


        vis.narratorHotAirBaloonBox
            .style('opacity', 1.0)
            .html(`
                        <img src="img/narraratorFishInAHotAirBalloon.png" id="narraratorBalloonImage">`)
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                 <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                     <h6 style="color:white"><b>Fishton says 'Help keep my River Clean!'</h6>
                                 </div>`);
            })
            .on('mouseout', function(event, d) {
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData(){
        let vis = this;

        if (verbose) { console.log("Water Quality Bar Chart - Initial Data In:", vis.data) }

        // data aggregation steps for ecoli/fecal combination row:
        // filter by station (distance from start)
        // create a value for each year - the average of all values for that year


        // If the user selected an ID
        if (vis.selectedstationID !== 9999) {

            console.log("Selected ID in filter", vis.selectedstationID)

            //filter by station ID
            function stationIDFilter(value) {
                return ((value.stationID) === vis.selectedstationID)
            }

            vis.filteredData = vis.data.filter(stationIDFilter);

            console.log("AFTER CLICK FILTER", vis.filteredData)

        } else { //if the user selected a brush event
            // if there is no river region selected
            if (riverSelectionDomain.length === 0) {   //Default filtering - only certain stations
                function initialStationsFilter(value) {
                    return ( (value.stationID === 166) || (value.stationID === 11) ) //only show end of river stations
                }
                console.log("Water Quality Bar Chart: Default Filtering")
                vis.filteredData = vis.data.filter(initialStationsFilter);
            } else {
                function filterDataByStationDistance(value) { //filter by brushed mile distances
                    return ( (value.stationDistance < riverSelectionDomain[0]) && (value.stationDistance > riverSelectionDomain[1]) ) //only show end of river stations
                }
                vis.filteredData = vis.data.filter(filterDataByStationDistance);
            }
        }


        vis.waterQualityByYear = Array.from(d3.group(vis.filteredData, d =>d.date.getFullYear()), ([key, value]) => ({key, value}))
        if (verbose) { console.log("Water Quality Bar Chart: Aggregating Data By Year", vis.waterQualityByYear) }

        let qualityByYear = []

        // merge
        vis.waterQualityByYear.forEach( year => {
            let ecoliSamplingCount = 0;
            let ecoliLevels = 0;
            let stationID = 9999; //default error flag

            for(let i = 0; i < year.value.length; i++) {
                ecoliLevels += year.value[i].ecoliLevel;
                ecoliSamplingCount += 1;
            }

            let averageEcoli = ecoliLevels / ecoliSamplingCount;

            let swimCheck = "was NOT"

            if (averageEcoli < 126) {
                swimCheck = "WAS"
            }

            // populate the final data structure
            qualityByYear[year.key] = {
                    year: year.key,
                    averageEcoli: averageEcoli,
                    swimmable: swimCheck,
            }
        })



        //SOME YEARS ARE MISSING DATA FOR EACH STATION - MISSING YEARS WILL BE RECORDED AS OVERALL MEAN OF ALL YEARS
        // THIS IS TO AVOID MERGING DISPLAY ISSUES (BARS REMAINING ON THE SCREEN, THEY DO NOT EXIT())

        // Find overall mean
        let qualityByYearArray = [];
        let mean_averageEcoli = 0;
        qualityByYearArray = Object.keys(qualityByYear).map(function(key) {
            return qualityByYear[key];
        });

        if (qualityByYearArray.length !== 0) { //if the users selection HAS any sites in it (if the mean will not be NaN)
            for (let i = 0; i < qualityByYearArray.length; i++) {
                mean_averageEcoli += qualityByYearArray[i]['averageEcoli']
            }
            mean_averageEcoli = mean_averageEcoli / qualityByYearArray.length //determine the mean ecoli for all values in the selection
        }
        let mean_swimCheck = "was NOT" //set swimmability criteria
        if (mean_averageEcoli < 126) {
            mean_swimCheck = "WAS"
        }

        vis.filteredYears = Object.keys(qualityByYear); //all years present in dataset
        vis.allYears = Array.from({length: 31}, (x, i) => (i + 1989).toString()); //a list of each year to iterate over

        let missing_years = vis.allYears.filter(function(item) { //find years missing in data set
            return !vis.filteredYears.includes(item);
        })

        // console.log("Missing Years", missing_years);

        // console.log("BEFORE, correction:", qualityByYear);

        if (missing_years.length !== 0) { //if there are missing values
            console.log('Selection *HAS* missing values;')

            for (let i = 0; i < missing_years.length; i++) { //go over the missing years
                qualityByYear[missing_years[i]] = {
                        year: parseInt(missing_years[i]),
                        averageEcoli: mean_averageEcoli, //append mean info
                        swimmable: mean_swimCheck //append mean info
                    }
                }
        }



        // CREATE ITEMS ARRAY FROM JAVASCRIPT OBJECT
        vis.displayData = Object.keys(qualityByYear).map(function(key) { // Create items array
            return qualityByYear[key];
        });

        // Update the visualization
        vis.updateVis();
    }


    //* The drawing function *//

    updateVis(){
        let vis = this;

        console.log("Water BarChart: Display Data:", vis.displayData);

        if (verbose) { console.log(vis.displayData[0].year) }

        // Update Axis Domains
        vis.x.domain(vis.displayData.map(d=> d.year));
        vis.y.domain([ ( (d3.max(vis.displayData, d => d.averageEcoli ) + (d3.max(vis.displayData, d => d.averageEcoli ) * 0.08 ))), 0 ]); //add proportional buffer space to head of y axis


        //get color range min max to change river color based on Ecoli CFO volume
        let valueMax = d3.max(vis.displayData, function(d) {
            return d.averageEcoli;
        });
        let valueMin = d3.min(vis.displayData, function(d) {
            return d.averageEcoli;
        });
        let valueRange = valueMax- valueMin;


        //vis.swimmableRect.attr("y", vis.y(126))

        vis.svg.select("#nonSwimmableBackgroundFill")
            .attr("height", (vis.y(126)))

        vis.svg.select("#SwimmableBackgroundFill")
            .attr("y", vis.y(126))
            .attr("height", (vis.height - vis.y(126)-0.2))

        let opacityValue = 0.0 //default state

        ///DRAW ECOLI READINGS
        // Draw rectangles: Bars
        vis.bars = vis.svg.selectAll(".ecoli-bar")
            .data(vis.displayData, function (d) { return d.year })

        //BARS: ENTER
        vis.bars.enter().append("rect")
            .merge(vis.bars) //UPDATE
            .attr("class", "ecoli-bar")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', '#b78953')
                    let valuePercentile = ((d.averageEcoli / valueRange)*10);
                    if (d.averageEcoli < 126){ opacityValue = 0.0}
                    else { opacityValue = (Math.floor(valuePercentile)/10+0.4);}
                    //change river color  (change opacity of the brown, showing the blue below)

                document.getElementById("animatedWavesContainer-BROWN").style.opacity = opacityValue;

                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont" style="color:white">Year: <b>${d.year}</b></h5>
                                 <h6 style="color:white">Average EColi Level: ${d.averageEcoli.toFixed(0)} / 100mL</h6>
                                 <h6 style="color:white">This section of river ${d.swimmable} swimmable on Average.</h6>
                             </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('fill', '#775935')
                    // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })
            .transition()
            .duration(1000)
            .style('fill', '#775935')
            // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})
            .attr("x", d => (vis.x(d.year)) + 4)
            .attr("y", d => vis.y(d.averageEcoli))
            .attr("height", d=> (vis.height - vis.y(d.averageEcoli)))
            .attr("width", vis.x.bandwidth()*0.85);



        // //Mark dividing line for data switch
        // vis.dividingLine = vis.svg.selectAll("ecoliDataDividingLine")
        //
        // vis.dividingLine.enter().append("line")
        //     .attr("class", "ecoliDataDividingLine")
        //     .attr("x1", 20)
        //     .attr("y1", 0)
        //     .attr("x2", 20)
        //     .attr("y2", vis.height)
        //     .style("stroke-width", 2)
        //     .style("stroke", "red")
        //     .style("fill", "red");


        // Update the x-axis
        vis.svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(vis.xAxis);

        // Update the y-axis
        vis.svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(vis.yAxis);

        //BARS Exit
        vis.bars.exit()
        // vis.dividingLine.exit()

        console.log('EColi bar chart loading')


        //update display of swimmability level for that subset
        // add the animation of swimmable water to the bar chart. Ideally animate it moving from the river bed

    }

    selectionChanged(brushRegion) {
        /*
         * Filter data when the user changes the selection
         * Example for brushRegion: 07/16/2016 to 07/28/2016
         */
        let vis = this;

        vis.selectedstationID = 9999;

        // Filter data accordingly without changing the original data
        if (vis.verbose) {
            console.log(brushRegion)
        }

        function distanceBoundFilter(value) {
            return ((value.date) >= brushRegion[0]) && ((value.date) <= brushRegion[1])
        }

        vis.filteredData = vis.data.filter(distanceBoundFilter);

        if (vis.verbose) {
            console.log(vis.filteredData);
        }

        //sort data on update
        vis.filteredData.sort((a, b) => b.key - a.key);

        if (vis.verbose) {
            console.log(vis.filteredData);
            console.log("---------")
        }

        // Update the visualization
        vis.wrangleData();
    }

    selectionChangedStationClicked(stationID) {
        let vis = this;
        console.log("Worked, they clicked", stationID)

        vis.selectedstationID = stationID;

        // Update the visualization
        vis.wrangleData();
    }

    slideEnter() {
        let vis = this;

        vis.narratorHotAirBaloonBox
            .transition()
            .duration(5000)
            .style("display", "block")
            .style("top", "45vh")
            .style("left", "8vw");

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(-1)")
    }

}
