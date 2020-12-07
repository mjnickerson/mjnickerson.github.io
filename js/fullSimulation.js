// simulation function

// runoff control: CFOS river turns purple / brown intermittlently

//temperature and rainfall

// habitat intervention: floating wetland

// cyanobacteria make the river green, intermittently
// zooplankton eat cyanobacteria and need wetland roots for refuge to protect them from small fish
// small fish eat zooplankton without the floating wetland

// large fish eat small fish, and don't appear until the river has no cyano bacteria blooms?
// Or do big fish only show up as soon as the water is clean enough to support small fish
// large fish that eat big fish appear as _________________________




/// DISPLAY ELEMENTS:

// cyanobacteria:
// river is green above
// lots of them appear below the water, like green dots
// appear when water quality is C- or higher


// zooplankton:
// appear when river is clean of CFO, when water quality is C or higher
// get eaten by small fish

// floating wetland, has hanging roots, and zooplankton will move over to underneath them if it appears

// small fish
// appear when water quality is B- or higher

// big fish
// appear when water quality is B or higher


// Above waterline, interactive events:
// swimming (and diving): only if the water quality is A- or higher
// boating: only if the water quality is B- or higher
// biking by river : only if the water quality is C+ or higher
// walking by river: only if the water quality is B or higher



// DISPLAY STATES:
// Based on Water quality score (WQS)
// 0 to 100 based on letter grades.
// A: 93-100
// A-: 90-92
// B+: 87-89
// B: 83-86
// B-: 80-82
// C+: 77-79
// C: 73-76
// C-: 70-72
// D+: 67-69
// D: 63-66
// D-: 60-62
// F: Below 60


// when the user changes one of the slider bars or interactive boxes, it calls "updateSimulation()"
// changed WQS based on user inputs is pulled, and the display properties of each element are changed.


class fullSimulation {

    constructor(_parentElement, _data, _eventHandler) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = []
        this.eventHandler = _eventHandler;

        this.displayData = this.data;

        this.initVis();
    }

    initVis() {

        //make the previous river sim below disappear - this is temporary until can merge them!!!!
        // document.getElementById("container").style.opacity = .1;


        let vis = this;

        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right + 350;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        vis.pointerLocationX = 250; //default state of simulation


        ////////// CREATE TOOLTIP //////////////////
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'simToolTip')

        //create all the things
        //make most of them transparent

        let initial_river_state = 1
        console.log("Initial Simulation River Color State:", initial_river_state);


        /// ANY BACKGROUND IMAGES OR BACKGROUND BUILDING SVG GOES HERE

        vis.svg //the sky
            .append('rect') //element id #X
            // .append('path') //element id #X
            .attr("id", "simulationRiverbankEdge") //riverbank
            .style('fill', "skyblue")
            .attr('opacity', 0.20)
            .attr("x", -200)
            .attr("y", 0)
            .attr("height", 300)
            .attr("width", vis.width);


        vis.svg
            .append('rect') //element id #X
            // .append('path') //element id #X
            .attr("id", "simulationRiverbankEdge") //riverbank
            .style('fill', "darkred")
            .attr('opacity', 0.55)
            // .attr("d", vis.displayData[1].path)
            // .attr("transform", 'translate ('+(vis.displayData[1].positionX)+','+(vis.displayData[1].positionY)+')');
            .attr("x", -200)
            .attr("y", 245)
            .attr("height", 60)
            .attr("width", vis.width);




        //// ALL OF THE ANIMATED BACKGROUND/THINGS ON TOP OF RIVER/RIVERBANK GO HERE


        vis.svg
            .append('path')
            .attr("id", "sailboat")
            .style('fill', vis.displayData[6].color)
            .attr("d", vis.displayData[6].path)
            .attr("transform", 'translate (450,310) scale(11,11)')
            .attr("opacity", "0");


        vis.svg
            .append('path') //element id #X
            // .append('path') //element id #X
            .attr("id", "simulationRiverbankEdge") //riverbank
            .style('fill', "grey")
            .attr('opacity', 0.35)
            // .attr("d", vis.displayData[1].path)
            // .attr("transform", 'translate ('+(vis.displayData[1].positionX)+','+(vis.displayData[1].positionY)+')');
            .attr("x", -200)
            .attr("y", 140)
            .attr("height", 50)
            .attr("width", vis.width);



        //// ALL OF THE RIVER WATER ELEMENTS GO HERE
        //upper river layer/cyanobacteria layer on top
        vis.svg
            .append('rect') //element id #1
            // .append('path') //element id #1
            .attr("id", "simulationRiverWaterTopLayer") //animated river foam top/cyanolayer
            .style('fill', vis.displayData[1].color[initial_river_state])
            .attr('opacity', 1.0)
            // .attr("d", vis.displayData[1].path)
            // .attr("transform", 'translate ('+(vis.displayData[1].positionX)+','+(vis.displayData[1].positionY)+')');
            .attr("x", -200)
            .attr("y", 300)
            .attr("height", 50)
            .attr("width", vis.width);

        //River Shape + River Color
        vis.svg
            .append('rect')
            .attr("id", "simulationRiverWaterFill") //screen fill for river
            .style('fill', vis.displayData[0].color[initial_river_state])
            .attr('opacity', 1.0)
            .attr("x", -200)
            .attr("y", 320)
            .attr("height", 700)
            .attr("width", vis.width);

        // vis.svg
        //     .append('path') //element id #0
        //     .attr("id", "simulationRiverWaterWaveCrest") //animated wavecrest
        //     .style('fill', vis.displayData[0].color[initial_river_state])
        //     .attr('opacity', 1.0)
        //     .attr("d", vis.displayData[0].path)
        //     .attr("transform", 'translate ('+(vis.displayData[0].positionX)+','+(vis.displayData[0].positionY)+')');



        //// ALL OF THE UNDERWATER LIFE GOES HERE



        vis.svg.append('g')
            .attr("id", "cyanobacteriaCluster1")
            .attr("transform", 'translate (150,360)')
            .attr("opacity", "0")
        for (let i = 0; i < 155; i++) { //draw a cluster of cyanobacteria
            vis.svg.selectAll("#cyanobacteriaCluster1")
                .append('circle')
                .style('fill', "darkgreen")
                .attr("cx", vis.getRandomInt(180))
                .attr("cy", vis.getRandomInt(180))
                .attr("r", 3);
        }
        vis.svg.append('g')
            .attr("id", "cyanobacteriaCluster2")
            .attr("transform", 'translate (400,360)')
            .attr("opacity", "0")
        for (let i = 0; i < 155; i++) { //draw a cluster of cyanobacteria
            vis.svg.selectAll("#cyanobacteriaCluster2")
                .append('circle')
                .style('fill', "darkgreen")
                .attr("cx", vis.getRandomInt(180))
                .attr("cy", vis.getRandomInt(180))
                .attr("r", 3);
        }
        vis.svg.append('g')
            .attr("id", "cyanobacteriaCluster3")
            .attr("transform", 'translate (650,360)')
            .attr("opacity", "0")
        for (let i = 0; i < 155; i++) { //draw a cluster of cyanobacteria
            vis.svg.selectAll("#cyanobacteriaCluster3")
                .append('circle')
                .style('fill', "darkgreen")
                .attr("cx", vis.getRandomInt(180))
                .attr("cy", vis.getRandomInt(180))
                .attr("r", 3);
        }
        vis.svg.append('g')
            .attr("id", "cyanobacteriaCluster4")
            .attr("transform", 'translate (900,360)')
            .attr("opacity", "0")
        for (let i = 0; i < 155; i++) { //draw a cluster of cyanobacteria
            vis.svg.selectAll("#cyanobacteriaCluster4")
                .append('circle')
                .style('fill', "darkgreen")
                .attr("cx", vis.getRandomInt(180))
                .attr("cy", vis.getRandomInt(180))
                .attr("r", 3);
        }
        vis.svg.append('g')
            .attr("id", "cyanobacteriaCluster5")
            .attr("transform", 'translate (1150,360)')
            .attr("opacity", "0")
        for (let i = 0; i < 155; i++) { //draw a cluster of cyanobacteria
            vis.svg.selectAll("#cyanobacteriaCluster5")
                .append('circle')
                .style('fill', "darkgreen")
                .attr("cx", vis.getRandomInt(180))
                .attr("cy", vis.getRandomInt(180))
                .attr("r", 3);
        }



        vis.svg.append('g')
            .attr("id", "zooplanktonCluster1")
            .attr("transform", 'translate (850,450)')
            .attr("opacity", "0")
        for (let i = 0; i < 45; i++) { //draw a cluster of zooplankton
            vis.svg.selectAll("#zooplanktonCluster1")
                .append('rect')
                .style('fill', "slategrey")
                .attr("x", vis.getRandomInt(70))
                .attr("y", vis.getRandomInt(70))
                .attr("height", 5)
                .attr("width", 10)
                .attr("transform", 'rotate('+vis.getRandomInt(360)+')');
        }
        vis.svg.append('g')
            .attr("id", "zooplanktonCluster2")
            .attr("transform", 'translate (1050,450)')
            .attr("opacity", "0")
        for (let i = 0; i < 45; i++) { //draw a cluster of zooplankton
            vis.svg.selectAll("#zooplanktonCluster2")
                .append('rect')
                .style('fill', "slategrey")
                .attr("x", vis.getRandomInt(70))
                .attr("y", vis.getRandomInt(70))
                .attr("height", 5)
                .attr("width", 10)
                .attr("transform", 'rotate('+vis.getRandomInt(360)+')');
        }


        vis.svg.append('g')
            .attr("id", "smallFishCluster1")
            .attr("transform", 'translate (550,400)')
            .attr("opacity", "0")
        for (let i = 0; i < 8; i++) { //draw a cluster of fish
            vis.svg.selectAll("#smallFishCluster1")
                .append('path')
                .style('fill', vis.displayData[4].color)
                .attr("d", vis.displayData[4].path)
                .attr("transform", 'translate('+vis.getRandomInt(100)+','+vis.getRandomInt(130)+') scale(4, 4)');
        }
        vis.svg.append('g')
            .attr("id", "smallFishCluster2")
            .attr("transform", 'translate (700,400)')
            .attr("opacity", "0")
        for (let i = 0; i < 8; i++) { //draw a cluster of fish
            vis.svg.selectAll("#smallFishCluster2")
                .append('path')
                .style('fill', vis.displayData[4].color)
                .attr("d", vis.displayData[4].path)
                .attr("transform", 'translate('+vis.getRandomInt(100)+','+vis.getRandomInt(130)+') scale(4, 4)');
        }


        vis.svg.append('g')
            .attr("id", "bigFishCluster1")
            .attr("transform", 'translate (300,380)')
            .attr("opacity", "0")
        for (let i = 0; i < 3; i++) { //draw a cluster of big fish
            vis.svg.selectAll("#bigFishCluster1")
                .append('path')
                .style('fill', vis.displayData[5].color)
                .attr("d", vis.displayData[5].path)
                .attr("transform", 'translate('+vis.getRandomInt(150)+','+vis.getRandomInt(180)+') scale(6,6)');
        }


        vis.svg.append('g') //floating wetland
            .attr("id", "floatingWetlandCluster1")
            .attr("transform", 'translate (800,300)')
            .attr("opacity", "0");
        vis.svg.selectAll("#floatingWetlandCluster1")
            .append('path')
            .attr("id", "floatngWetland1")
            .style('fill', vis.displayData[2].color)
            .attr("d", vis.displayData[2].path)
            .attr("transform", 'translate (0,0) scale(3,5)')
        vis.svg.selectAll("#floatingWetlandCluster1")
            .append('path')
            .attr("id", "floatingWetlandRoots1")
            .style('fill', vis.displayData[3].color)
            .attr("d", vis.displayData[3].path)
            .attr("transform", 'translate (0,0) scale(3,6)')

        vis.svg.append('g')
            .attr("id", "floatingWetlandCluster2")
            .attr("transform", 'translate (1060,300)')
            .attr("opacity", "0");
        vis.svg.selectAll("#floatingWetlandCluster2")
            .append('path')
            .attr("id", "floatngWetland2")
            .style('fill', vis.displayData[2].color)
            .attr("d", vis.displayData[2].path)
            .attr("transform", 'translate (0,0) scale(3,5)')
        vis.svg.selectAll("#floatingWetlandCluster2")
            .append('path')
            .attr("id", "floatingWetlandRoots2")
            .style('fill', vis.displayData[3].color)
            .attr("d", vis.displayData[3].path)
            .attr("transform", 'translate (0,0) scale(3,6)')

        vis.svg.append('g')
            .attr("id", "floatingWetlandCluster3")
            .attr("transform", 'translate (1320,300)')
            .attr("opacity", "0");
        vis.svg.selectAll("#floatingWetlandCluster3")
            .append('path')
            .attr("id", "floatngWetland3")
            .style('fill', vis.displayData[2].color)
            .attr("d", vis.displayData[2].path)
            .attr("transform", 'translate (0,0) scale(3,5)')
        vis.svg.selectAll("#floatingWetlandCluster3")
            .append('path')
            .attr("id", "floatingWetlandRoots3")
            .style('fill', vis.displayData[3].color)
            .attr("d", vis.displayData[3].path)
            .attr("transform", 'translate (0,0) scale(3,6)')


        //// RIVER BOTTOM GOES HERE

        vis.heightOfHealthBarCenter = 735; //<- center of the riverbank

        vis.svg
            .append('rect')
            .attr("id", "riverBottom") //river bottom elements
            .style('fill', "black")
            .attr('opacity', 0.65)
            .attr("x", 0)
            .attr("y", vis.heightOfHealthBarCenter-70)
            .attr("height", 100)
            .attr("width", vis.width);



        //// RIVER Status Meter GOES HERE

        vis.svg.append('g')
            .attr("id", "healthBar")

        vis.svg.selectAll("#healthBar")
            .append('text')
            .attr("id", "healthBarTitle")
            .text("River Health")
            .style('fill', "white")
            .style('font-size', "25px")
            .attr("x", 30)
            .attr("y", vis.heightOfHealthBarCenter - 15)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("0")
            .style('fill', "white")
            .attr("x", 200)
            .attr("y", vis.heightOfHealthBarCenter + 10)


        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("100")
            .style('fill', "white")
            .attr("x", 1375)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("A+")
            .style('fill', "white")
            .attr("x", 1275)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("A")
            .style('fill', "white")
            .attr("x", 1200)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("A-")
            .style('fill', "white")
            .attr("x", 1125)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("B+")
            .style('fill', "white")
            .attr("x", 1050)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("B")
            .style('fill', "white")
            .attr("x", 975)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("B-")
            .style('fill', "white")
            .attr("x", 900)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("C+")
            .style('fill', "white")
            .attr("x", 825)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("C")
            .style('fill', "white")
            .attr("x", 750)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("C-")
            .style('fill', "white")
            .attr("x", 675)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("D+")
            .style('fill', "white")
            .attr("x", 600)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("D")
            .style('fill', "white")
            .attr("x", 525)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("D-")
            .style('fill', "white")
            .attr("x", 450)
            .attr("y", vis.heightOfHealthBarCenter + 10)

        vis.svg.selectAll("#healthBar")
            .append('text')
            .text("F")
            .style('fill', "white")
            .attr("x", 375)
            .attr("y", vis.heightOfHealthBarCenter + 10)


        // WATER QUALITY POINTER
        vis.svg
            .append('path')
            .attr("id", "simWaterQualityPointer")
            .style('fill', "white")
            .attr('opacity', 0.80)
            .attr("d", 'M 0 20 l 0 50  l 50 0 z')
            .attr("transform", 'translate ('+vis.pointerLocationX+', '+(vis.heightOfHealthBarCenter-60)+') rotate(-45)');

    }


    updateSimulation() {
        let vis = this;

        // document.getElementById("sim-container").style.opacity = "0.0";

        if (simWaterQualityLevel + simNutrientsLevel + simClimateLevel < 80) {simHabitatLevel = 0}

        combinedRiverQualityLevel = simWaterQualityLevel + simNutrientsLevel + simClimateLevel + simHabitatLevel

        if (combinedRiverQualityLevel < 0) {combinedRiverQualityLevel = 0} else if (combinedRiverQualityLevel > 100) {combinedRiverQualityLevel = 98}



        let display_state_above = ""
        let display_state_below = ""
        let river_color_state = Math.floor(combinedRiverQualityLevel/5)

        //reset all display states




        // Display number of stations in DOM
        let wqsText = "River Water Quality: " + vis.getGrade(combinedRiverQualityLevel) + " ("+ combinedRiverQualityLevel + ")";
        $("#simulationWaterQualityScore").text(wqsText);

        console.log("River Color State", river_color_state)

        //update River color
        vis.svg.select("#simulationRiverWaterWaveCrest")
            .transition()
            .duration(2000)
            .style('fill', vis.displayData[0].color[river_color_state])
        vis.svg.select("#simulationRiverWaterFill")
            .transition()
            .duration(2000)
            .style('fill', vis.displayData[0].color[river_color_state])

        vis.svg.select("#simulationRiverWaterTopLayer")
            .transition()
            .duration(2000)
            .style('fill', vis.displayData[1].color[river_color_state])

        //BELOW River states
        if (combinedRiverQualityLevel <= 69 ) {
            display_state_below = "No Fish"


            //hide
            vis.svg.select("#cyanobacteriaCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
            vis.svg.select("#cyanobacteriaCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3800)
                .attr("opacity", "0")
            vis.svg.select("#cyanobacteriaCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4500)
                .attr("opacity", "0")
            vis.svg.select("#cyanobacteriaCluster4")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(5000)
                .attr("opacity", "0")
            vis.svg.select("#cyanobacteriaCluster5")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(5500)
                .attr("opacity", "0")
            vis.svg.select("#zooplanktonCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#zooplanktonCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
            vis.svg.select("#bigFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(2500)
                .attr("opacity", "0")
            vis.svg.select("#smallFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#smallFishCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(5000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(1000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(1500)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(2000)
                .attr("opacity", "0")
        }

        if (combinedRiverQualityLevel > 70 ) {
            display_state_below = "Cyanobacteria"


            //reveal
            vis.svg.select("#cyanobacteriaCluster1")
                .transition()
                .duration(4000)
                .attr("opacity", "1")
            vis.svg.select("#cyanobacteriaCluster2")
                .transition()
                .duration(3800)
                .attr("opacity", "1")
            vis.svg.select("#cyanobacteriaCluster3")
                .transition()
                .duration(4500)
                .attr("opacity", "1")
            vis.svg.select("#cyanobacteriaCluster4")
                .transition()
                .duration(5000)
                .attr("opacity", "1")
            vis.svg.select("#cyanobacteriaCluster5")
                .transition()
                .duration(5500)
                .attr("opacity", "1")

            //hide
            vis.svg.select("#zooplanktonCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(5000)
                .attr("opacity", "0")
            vis.svg.select("#zooplanktonCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(6000)
                .attr("opacity", "0")
            vis.svg.select("#bigFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#smallFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
            vis.svg.select("#smallFishCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4500)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(2000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
        }

        if (combinedRiverQualityLevel > 75 ) {
            display_state_below += ", Zooplankton"

            //reveal
            vis.svg.select("#zooplanktonCluster1")
                .transition()
                .duration(4000)
                .attr("opacity", "1")
            vis.svg.select("#zooplanktonCluster2")
                .transition()
                .duration(5000)
                .attr("opacity", "1")

            //hide
            vis.svg.select("#cyanobacteriaCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(2000)
                .attr("opacity", "0")
            vis.svg.select("#cyanobacteriaCluster4")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#smallFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#smallFishCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(5000)
                .attr("opacity", "0")
            vis.svg.select("#bigFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3500)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(2000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")

        }

        if (combinedRiverQualityLevel > 80 ) {
            display_state_below += " , and small fish"

            //reveal
            vis.svg.select("#smallFishCluster1")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont">Small fish have appeared in the river ecosystem.</h5>
                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
                .transition()
                .duration(3000)
                .attr("opacity", "1")
            vis.svg.select("#smallFishCluster2")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont">On No! Small fish are eating all the Zooplankton!</h5>
                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
                .transition()
                .duration(5000)
                .attr("opacity", "1")

            //hide
            vis.svg.select("#zooplanktonCluster1")
                .transition()
                .duration(4500)
                .attr("opacity", "0")
            vis.svg.select("#bigFishCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3500)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
        }

        if (combinedRiverQualityLevel > 85 ) {
            display_state_below += " and big fish!"

            //reveal
            vis.svg.select("#bigFishCluster1")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont">Look! Large Fish and Aquatic Life and are swimming in the river!</h5>
                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
                .transition()
                .duration(3500)
                .attr("opacity", "1")
            vis.svg.select("#floatingWetlandCluster1")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont">A Floating Wetland!</h5>
                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
                .transition()
                .duration(3000)
                .attr("opacity", "1")

            //hide
            vis.svg.select("#floatingWetlandCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")

        }

        if (combinedRiverQualityLevel > 90 ) {
            display_state_below = "Zooplankton hiding in the wetland roots, small fish and big fish"

            //reveal
            vis.svg.select("#cyanobacteriaCluster5")
                .transition()
                .duration(3500)
                .attr("transform", 'translate (1100,460)')
                .attr("opacity", "1")
            vis.svg.select("#zooplanktonCluster1")
                .transition()
                .duration(5500)
                .attr("transform", 'translate (1050,420)')
                .attr("opacity", "1")
            vis.svg.select("#zooplanktonCluster2")
                .transition()
                .duration(6500)
                .attr("transform", 'translate (1250,420)')
                .attr("opacity", "1")
            vis.svg.select("#floatingWetlandCluster1")
                .transition()
                .duration(3000)
                .attr("opacity", "1")
            vis.svg.select("#floatingWetlandCluster2")
                .transition()
                .duration(3000)
                .attr("opacity", "1")
            vis.svg.select("#smallFishCluster2")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont">Small Fish Can't Eat All the Zooplankton since they are protected by the wetland's root system!</h5>
                             </div>`);
                })

            //hide
            vis.svg.select("#cyanobacteriaCluster2")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(6000)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(4000)
                .attr("opacity", "0")

        }

        if (combinedRiverQualityLevel > 95 ) {
            console.log("Highest state of simulation!")
            vis.svg.select("#cyanobacteriaCluster1")
                .on('mouseover', function(event, d) {})
                .transition()
                .duration(6500)
                .attr("opacity", "0")
            vis.svg.select("#floatingWetlandCluster3")
                .transition()
                .duration(3000)
                .attr("opacity", "1")
        }


        //ABOVE River States
        if (combinedRiverQualityLevel <= 60 ) {
            display_state_above = "Empty Riverbank / No Events"
            vis.svg.select("#sailboat")
                .on('mouseover', function(event, d){})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
        }

        if (combinedRiverQualityLevel > 60) {
            display_state_above = "Biking Along River"
            vis.svg.select("#sailboat")
                .on('mouseover', function(event, d){})
                .transition()
                .duration(3000)
                .attr("opacity", "0")
        }

        if (combinedRiverQualityLevel > 75) {
            display_state_above += ", Boating on River"
            vis.svg.select("#sailboat")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont">The river is clean enough to be boatable! Jibe-0!</h5>
                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                })
                .transition()
                .duration(3000)
                .attr("opacity", "1")
        }

        if (combinedRiverQualityLevel > 85) {
            display_state_above += ", Walking along River"
        }

        if (combinedRiverQualityLevel > 90) {
            display_state_above += ", River Festival/Events along River"
        }

        if (combinedRiverQualityLevel > 95) {
            display_state_above += ", Swimming in River!"
        }


        // execute current state
        $("#simulationElementsShownAboveRiver").text(display_state_above);
        $("#simulationElementsShownBelowRiver").text(display_state_below);


        // MOVE WATER QUALITY POINTER
        if (combinedRiverQualityLevel < 60) {
            let pixelRange = 365 - 160;
            let rangeDifference = combinedRiverQualityLevel / 60;
            vis.pointerLocationX = 160 + pixelRange * rangeDifference;
        } else {
            let pixelRange =  1320 - 365;
            let rangeDifference = (combinedRiverQualityLevel -  60) / 40;
            vis.pointerLocationX = 365 + pixelRange * rangeDifference;
        }

        vis.svg.select("#simWaterQualityPointer")
            .transition()
            .duration(2000)
            .attr("transform", 'translate ('+vis.pointerLocationX+','+(vis.heightOfHealthBarCenter-60)+') rotate(-45)');

        }





    getGrade(input) {
        let vis = this;

        vis.simGrades = ["F","D-","D","D+","C-","C","C+","B-","B","B+","A-","A","A+"]

        //convenience function

        // Based on Water quality score (WQS)
        // 0 to 100 based on letter grades.
        // A: 93-100
        // A-: 90-92
        // B+: 87-89
        // B: 83-86
        // B-: 80-82
        // C+: 77-79
        // C: 73-76
        // C-: 70-72
        // D+: 67-69
        // D: 63-66
        // D-: 60-62
        // F: Below 60

        let grade = "9999" //error code
        if (input < 60) {
            grade = vis.simGrades[0]
        } else if (input < 63) {
            grade = vis.simGrades[1]
        } else if (input < 67) {
            grade = vis.simGrades[2]
        } else if (input < 67) {
            grade = vis.simGrades[3]
        } else if (input < 70) {
            grade = vis.simGrades[4]
        } else if (input < 73) {
            grade = vis.simGrades[5]
        } else if (input < 77) {
            grade = vis.simGrades[6]
        } else if (input < 80) {
            grade = vis.simGrades[7]
        } else if (input < 83) {
            grade = vis.simGrades[8]
        } else if (input < 87) {
            grade = vis.simGrades[9]
        } else if (input < 90) {
            grade = vis.simGrades[10]
        } else if (input < 95) {
            grade = vis.simGrades[11]
        } else {
            grade = vis.simGrades[12]
        }
            return grade
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


   // DISPLAY STATES;


// cyanobacteria:
// river is green above
// lots of them appear below the water, like green dots
// appear when water quality is C- or higher


// zooplankton:
// appear when river is clean of CFO, when water quality is C or higher
// get eaten by small fish

// floating wetland, has hanging roots, and zooplankton will move over to underneath them if it appears

// small fish
// appear when water quality is B- or higher

// big fish
// appear when water quality is B or higher


// Above waterline, interactive events:
// swimming (and diving): only if the water quality is A- or higher
// boating: only if the water quality is B- or higher
// biking by river : only if the water quality is C+ or higher
// walking by river: only if the water quality is B or higher

    // A: 93-100
// A-: 90-92
// B+: 87-89
// B: 83-86
// B-: 80-82
// C+: 77-79
// C: 73-76
// C-: 70-72
// D+: 67-69
// D: 63-66
// D-: 60-62
// F: Below 60



}