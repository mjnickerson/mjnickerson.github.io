console.log("Hello World!")

//Set Master Browser Size
let original_screen_format = {height: 927, width: 1922}; //original format proportions the graphics were designed for
let original_aspect_ratio = original_screen_format.width / original_screen_format.height

console.log("Original Aspect Ratio:", original_aspect_ratio)

// Global Diagnostics feedback
let verbose = false;

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParserA = d3.timeParse("%m/%d/%y %H:%M");
let dateParserCso = d3.timeParse("%Y");
let dateParserPhosphorus = d3.timeParse("%Y");
let dateParserChlorophyll = d3.timeParse("%m/%d/%Y");

//initialize chart variables:
let ecoliWaterQualityChart;
let ecoliwaterQualityBrushMap;
let swimmability;
let svgTransitions;
let phosphorus;
let chlorophyll;
let charlesRiverInteractiveMap;
let cyanoTempScatterChart
let eColiRainChart;
let cso;
let interactiveDiagramPage;
let riverHealthSim;
let hookTitleCard;
let afterhookTitleCard;
let partOneTitleCard;
let partTwoTitleCard;
let ahaCard;

//brushing Variables
let riverSelectionDomain = []
let ecoliBarRadioButtonState = "station"

//simulation State Variables
let currentCardNumber = 0; //0 to max(length of presentation)
let combinedRiverQualityLevel = 0 // from 0 to 100;
let simWaterQualityLevel = 10; //from 0 to 75
let simNutrientsLevel = -20; // from -20 to +20
let simClimateLevel = 0; //from 0 to 10
let simHabitatLevel = 0; //from 0 17;


// Load data with promises
let promises = [
    d3.csv("data/E-coli_allStations.csv"),
    d3.csv("data/waterQualityStationXDistances.csv"),
    d3.csv("data/CSO.csv"),
    d3.json("data/swimmability-corrected.json"),
    d3.json("data/slideSVGAnimations.json"),
    d3.json("data/fullSimulationPathElements.json"),
    d3.csv("data/Annualphosphorus.csv"),
    d3.csv("data/Summer_Chlorophyll.csv"),
    d3.csv("data/ecoli-rain.csv", function (row) {
        row.date = dateParserChlorophyll(row.date);
        row.eColi = +row.eColi
        row.rainfall = +row.rainfall
        row.eColiFiveDayAvg = +row.eColiFiveDayAvg
        row.rainfall3day = +row.rainfall3day
        row.rainfall48hr = +row.rainfall48hr
        return row
    }),
    d3.csv("data/crwa_chlorophyl_a.csv", function(row) {
        row.date = dateParserChlorophyll(row.date)
        if (row.WesternAve !== "na") {row.WesternAve = +row.WesternAve};
        if (row.MassAve !== "na") {row.MassAve = +row.MassAve};
        if (row.NewCharlesRiverDam !== "na") {row.NewCharlesRiverDam = +row.NewCharlesRiverDam};
        return row
    }),
    d3.csv("data/crwa_phaeophytin.csv", function(row) {
        row.date = dateParserChlorophyll(row.date)
        if (row.WesternAve !== "na") {row.WesternAve = +row.WesternAve};
        if (row.MassAve !== "na") {row.MassAve = +row.MassAve};
        if (row.NewCharlesRiverDam !== "na") {row.NewCharlesRiverDam = +row.NewCharlesRiverDam};
        return row
    }),
    d3.csv("data/crwa_Temp.csv", function(row) {
        row.date = dateParserChlorophyll(row.date)
        if (row.WesternAve !== "na") {row.WesternAve = +row.WesternAve};
        if (row.MassAve !== "na") {row.MassAve = +row.MassAve};
        if (row.NewCharlesRiverDam !== "na") {row.NewCharlesRiverDam = +row.NewCharlesRiverDam};
        return row
    })
];

Promise.all(promises)
    .then( function(data){ createVis(data)})
    .catch( function (err){console.log(err)} );

//Initialize all Visualizations (call plots)
function createVis(data){
    let ecoli_station_data = data[0];
    let ecoli_station_distances = data[1];
    let cso_data = data[2];
    let swimmability_data = data[3];
    let cardMiniSimElement_paths = data[4]; //paths for svg river simulation elements
    let fullSimElement_paths = data[5]; //paths for full simulation elements
    let phosphorus_data = data[6];
    let chlorophyll_data = data[7];
    let ecoliSummerData = data[8];
    let chloroData = data[9].map(cyanoTempDataFormater)
    let phaeoData = data[10].map(cyanoTempDataFormater)
    let tempData = data[11].map(cyanoTempDataFormater)

    console.log(ecoli_station_data);
    console.debug("CSO raw data:", cso_data);
    console.debug("Swimmability raw data:", swimmability_data);
    console.debug("Phosphorus raw data:", phosphorus_data);
    console.debug("Chlorophyll raw data:", chlorophyll_data);



    // DATA FUNCTIONS FOR WATER QUALITY BARCHART
    ////////////////////////////////////////////
    distances_by_station = ecoli_station_distances.map( function (d) {
        let result = {
            stationID: +d['Station ID'],
            milesUpriver:  +d['miles_from_river_map_start'],
        }
        return result;
    });

    ecoli_by_station = ecoli_station_data.map( function (d) {

        let swimFlag = 9999;
        let stationDistance = 9999;

        if (d['Swimmable'] === "N") {
            swimFlag = 0; //N - non swimmable day
        } else {
            swimFlag = 1; //Y - swimmable day
        }

        let stationIDnum = +d['Station ID']

        //zip station distances onto dataset
        for (let i = 0; i < distances_by_station.length; i++) {
            if (stationIDnum === distances_by_station[i].stationID) {
                stationDistance = distances_by_station[i].milesUpriver
            }
        }

        let result = {
            date: dateParserA(d['Date/time (EASTERN STANDARD TIME)']),
            ecoliLevel:  +d['E. coli (#/100mL)/Fecal coliform (#/100mL)'],
            stationID: stationIDnum,
            stationDistance: stationDistance,
            swimmable: swimFlag,
            // region: d["Region"],
            // subregion: d["Subregion"],
            // depsegment: d["DEP Segment"],
            // projectID: d["Project ID"]
        }
        return result;
    });

    ////////////////////////////////////////////


    // console.log('Cleaned Data', XXXXXXXXXXXX) //check the data structure

    // (3) Create event handler
    let eventHandler = {};


    ////////////////////////////////////////////
    // Simulation SVG Elements // Always on Top
    svgTransitions = new simulationSVGTransitions("sim-container", cardMiniSimElement_paths);
    ////////////////////////////////////////////

    /////////////////////////////////////////////
    hookTitleCard = afterhookTitleCard;
    /////////////////////////////////////////////

    /////////////////////////////////////////////
    afterhookTitleCard = new titleCardAfterHookGraphics("afterHookTitleCard", fullSimElement_paths, "swimmer-container")
    /////////////////////////////////////////////

    ////////////////////////////////////////////
    // Interactive Factors Diagram
    interactiveDiagramPage = new interactiveDiagram("interactiveDiagram");
    ////////////////////////////////////////////


    /////////////////////////////////////////////
    partOneTitleCard = new titleCardOneGraphics("partOneTitleCard", fullSimElement_paths)
    /////////////////////////////////////////////

    ////////////////////////////////////////////
    // Ecoli Water Quality Bar Chart
    ecoliWaterQualityChart = new waterQualityBarChart("ecoliwaterqualitybarchart", ecoli_by_station, distances_by_station, eventHandler);
    ecoliwaterQualityBrushMap = new waterQualityBrushMap("ecoliwaterqualitybrushmap", ecoli_by_station, distances_by_station, cardMiniSimElement_paths, eventHandler);
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    // CSO stack chart
    cso = new CSO("cfo-stack-chart", cso_data, "cso-cloud-container");
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    // Swimmability Calendar
    swimmability = new Swimmability("swimmability-chart", swimmability_data);
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    // Avg Annual Phosphorus chart
    phosphorus = new Phosphorus("phosphorus-chart", phosphorus_data);
    ////////////////////////////////////////////


    /////////////////////////////////////////////
    partTwoTitleCard = new titleCardTwoGraphics("partTwoTitleCard", fullSimElement_paths)
    /////////////////////////////////////////////

    ////////////////////////////////////////////
    // Summer Chlorophyll chart
    chlorophyll = new Chlorophyll("chlorophyll-chart", chlorophyll_data);
    ////////////////////////////////////////////
    // E. Coli & Rain chart
    eColiRainChart = new eColiSummer("ecoliRainChart", ecoliSummerData)
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    /// Chlorophyll Temperature Chart
    maxChloro = d3.max(chloroData.map(function (d) { return d.avg;}))
    maxPhaeo = d3.max(phaeoData.map(function (d) { return d.avg;}))
    maxTemp = d3.max(tempData.map(function (d) { return d.avg;}))
    cyanoTempScatterChart = new cyanoScatterChart("cyanoScatterChart", chloroData, phaeoData, tempData)
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    // Interactive Charles River Map
    charlesRiverInteractiveMap = new charlesRiverMap("charlesRiverInteractiveMapContainer", cardMiniSimElement_paths, eventHandler);
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    // Interactive Simulation
    riverHealthSim = new RiverHealthSimulation("river-health-chart", fullSimElement_paths, "riverhealth-cloud-container", "fish1-container", "fish2-container");
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    // Interactive Simulation
    ahaCard = new ahaSlideGraphics("ahaAnimationsContainer", fullSimElement_paths);
    ////////////////////////////////////////////

}


// React to 'brushed' event and update water quality bar chart
function waterQualityChartBrushed() {
    // React to 'brushed' event

    // Get the extent of the current brush
    let riverSelectionRange = d3.brushSelection(d3.select(".brush").node()); // X pixel value for the start and end of range
    if (verbose) {
        console.log("Selected Range:", riverSelectionRange)
    }

    // Convert the extent into the corresponding domain values
    riverSelectionDomain = riverSelectionRange.map(ecoliwaterQualityBrushMap.x.invert); //date value for the start and end of range
    if (verbose) {
        console.log("Selected Domain: ", riverSelectionDomain)
    }

    // Update BarChart Data Selection
    ecoliWaterQualityChart.selectionChanged(riverSelectionDomain);
}

function waterQualityChartClicked(selected_station_ID) {
    // React to 'clicked' event
    ecoliWaterQualityChart.selectionChangedStationClicked(selected_station_ID);
}

function ecoliBrushState(desired_state) {
    if (desired_state) {
        ecoliBarRadioButtonState = "river_brush"
    } else {
        ecoliBarRadioButtonState = "station"
    }
    ecoliwaterQualityBrushMap.updateVis();
}



function updateSwimmabilityVis(doTransition) {
    swimmability.updateVis(doTransition);
}



function updateSimulation_CFOLevel() {

    //perform any added water quality score math here;

    simWaterQualityLevel = 75 + (Math.floor(document.getElementById("cfoControl").value) * -1); //get current slider value

    console.log("Swimmability Raw Input:", simWaterQualityLevel)

    // call simulation update
    fullsimulation.updateSimulation();
}


function updateSimulation_NutrientsLevel() {

    simNutrientsLevel = Math.floor(document.getElementById("nutrientControl").value); //get current slider value

    if (simNutrientsLevel < 15) { //if too low
        simNutrientsLevel = -(15 - simNutrientsLevel)

    } else if (simNutrientsLevel > 25 ) { //if too high
        if (combinedRiverQualityLevel > 83) { // if the water isnt too toxic where nutrients can have an impact
            simNutrientsLevel = (30 - simNutrientsLevel); //cause cyanobacteria blooms
        } else {
            simNutrientsLevel = 0; //else nutrients dont change river quality
        }

    } else { //if in middle at right level
    //between 15 and 25
        simNutrientsLevel = simNutrientsLevel - 15;
    }
    console.log("Nutrients Scaled Input:", simNutrientsLevel)

    fullsimulation.updateSimulation();
}


function updateSimulation_Climate() {
    //update the total:
    if (simClimateLevel < 4) {
        simClimateLevel = simClimateLevel + 5
    }

    // call simulation update
    fullsimulation.updateSimulation();
}


function updateSimulation_Habitat() {
    //update the total:

    if ((simWaterQualityLevel + simNutrientsLevel + simClimateLevel) > 84) { //if the river isn't too toxic for a wetland to grow
        if (simHabitatLevel < 15) {
            simHabitatLevel = simHabitatLevel + 5 //allow adding up to 3 floating wetlands
        }
    } else { //if the river is too toxic that wetlands will die (wont grow, or the ones added will die)
        combinedRiverQualityLevel = combinedRiverQualityLevel - simHabitatLevel
        simHabitatLevel = 0; //wetlands die
    }

    // call simulation update
    fullsimulation.updateSimulation();
}

function submitChlorophyllQuiz(element, correctAnswer) {
    if (correctAnswer) {
        $(element).text("Correct!");
        $("#chlorophyll-quiz").fadeOut(1000, () => {
            $("#chlorophyll-chart").fadeIn(500);
            $("#chlorophyll-final-blurb").fadeIn(500);
            chlorophyll.updateVis();
        });
    }
    else {
        $(element).text("Sorry, please try again!").addClass("btn-danger").prop('disabled', true);
    }
}


function updateRiverHealthNutrients(bool) {
    if (bool === true) {
        riverHealthSim.nutrientsState = 1;
    } else {
        riverHealthSim.nutrientsState = 0;
    }
    riverHealthSim.wrangleData();
}

function updateRiverHealthTemp(value) {
    riverHealthSim.temperatureState = value;
    riverHealthSim.wrangleData();
}

function updateRiverHealthHabitat(bool) {
    console.log(bool)
    if (bool === true) {
        riverHealthSim.wetlandState = 1;
        riverHealthSim.demoPartThreeState+= 1;
    } else {
        riverHealthSim.wetlandState = 0;
    }

    riverHealthSim.wrangleData();
}


function slide1Answer(answer) {

    $(".quizButton").remove();
    $("#swimQuestionaireTitle").remove();

    if (answer === 'yes') {
        document.getElementById("questionaire_response").innerHTML = "</br></br><h1>You're not alone!</h1></br><div class=\"row justify-content-center backgroundTransparentWhiteFill\"><div class=\"subjectDetailText\">The Charles has made an incredible comeback since the rock band The Standells referred to the river as that “<a href=\"https://www.youtube.com/watch?v=62XRy-jFCm8\" target=\"_blank\"><b><u>Dirty Water</u></b></a>” in their 1965 hit song of the same name. It is now considered one of the cleanest urban rivers in America and many hope to see the return of swimming. But first, we’ll need to understand if the river is swimmable. Luckily, several state agencies, nonprofits, and researchers have robust water quality monitoring programs. Let’s see what the data tells us!</div></div>"
    } else if (answer === 'no') {
        document.getElementById("questionaire_response").innerHTML = "</br></br><h1>You're not alone...</h1></br><div class=\"row justify-content-center backgroundTransparentWhiteFill\"><div class=\"subjectDetailText\">The Charles River gets a bad rap as that “<a href=\"https://www.youtube.com/watch?v=62XRy-jFCm8\" target=\"_blank\"><b><u>Dirty Water</u></b></a>,” and for many years it deserved that reputation. But over the last several decades, the Charles River’s water quality has made a tremendous comeback. Believe it or not, there is even a movement to return swimming to the river! But to do so safely, we’ll need to know if the Charles River is swimmable. Luckily, several state agencies, nonprofits, and researchers have robust water quality monitoring programs. Let’s see what the data tells us!\n</div></div>"
    }
    // "<div><p style='color:black; width=100%; position:relative; top:100px'></b></br></br></br></br><h1>You're Not Alone!</h1></br></br>The Charles River has made an incredible comeback since being termed “that dirty water” by </br>the rock band “The Sandells” in 1970. It is now considered one of the cleanest urban rivers in </br>America and many hope to see swimming return to the Charles River. But first, we’ll </br>need to know: is the Charles River swimmable? Luckily, several state agencies, </br>nonprofits, and researchers have robust water quality monitoring programs. </br>Let’s see what the data tells us!</p></div>";

    d3.select("#narraratorFishBox") //animate fish off the screen
        .transition()
        .duration(5000)
        .style("display", "block")
        .style("top", "80vh")
        .style("left", "120vw");
}


function moveBalloonOutOfBox() {
    d3.select("#narraratorBalloonBox") //animate fish off the screen
        .transition()
        .duration(3000)
        .style("display", "block")
        .style("top", "2vh")
        .style("left", "90vw");
}


// CHLOROPHYL TEMPERATURE DATA FORMATER
function cyanoTempDataFormater(d) {

    let dataPoints =[]
    if (typeof d.WesternAve === 'number') {dataPoints.push(d.WesternAve)};
    if (typeof d.MassAve === 'number') {dataPoints.push(d.MassAve)};
    if (typeof d.NewCharlesRiverDam === 'number') {dataPoints.push(d.NewCharlesRiverDam)};

    let sum = 0
    dataPoints.forEach(function (d) {
        sum += d
    })

    let avg = sum / dataPoints.length

    let result = {
        date: d.date,
        avg: avg
    }
    return result
}


// CHLOROPHYL TEMP EVENT LISTENER
d3.select("#scatterPlotTransition").on("click", function () {
    console.log("clicked")
    cyanoTempScatterChart.updateVis2()
})



// E COLI RAIN CHART EVENT LISTENERS
d3.select("#rainfall-shower").on("change", function () {
    console.log("changed selection")
    eColiRainChart.drawRain()
})

d3.select("#measure-selector").on("change", function () {
    console.log("changed selection (daily vs. 5-day avg)")
    eColiRainChart.selectionChange()
})

d3.select("#cut-off-selector").on("change", function () {
    console.log("changed selection (show cut off)")
    eColiRainChart.selectionChange()
})


//CREATE THE FULL PAGE CONTAINER FOR ALL THE VIZ
new fullpage('#siteContainer', {
    anchors: ['introduction', 'introduction2', 'introduction3', 'along_the_river', 'more_information', 'sources', 'acknowledgements'],
    // menu: '#menu',
    slidesNavigation: true, // navigation bubbles
    slidesNavPosition: 'top', //where the nav bubbles are
    scrollingSpeed:1200, //700 is default

    licenseKey: '324E8001-25884B3D-A249DB08-5C9EF4E90', //horizontal scrolling
    // sectionsColor: ['white', '#F5FFFA', '#f1f1ff', 'lightblue', 'white', '#f1f1ff', 'lightblue', 'white', '#f1f1ff', 'lightblue', 'lightgrey', "white"],

    v2compatible:false,
    controlArrows:true,
    verticalCentered:true,
    continuousVertical:false, //loop any upper or lower content?
    continuousHorizontal:false, //dont loop the river scroll
    ////////////////////////
    keyboardScrolling:true, //false! //the user cannot scroll keyboard because it will let them skip sections and story will be out of order
    // i.e. if you push down it doesnt move "forward" it moves literally down and bypasses a bunch of content
    autoScrolling:true, //required for "card by card" fixed view
    scrollHorizontally:true, //allow the user to scroll both horizontally and vertically
    scrollHorizontallyKey: '324E8001-25884B3D-A249DB08-5C9EF4E90',
    dragAndMove: 'horizontal',
    parallax: true,
    parallaxKey: 'C1674176-328A4183-81D3F90E-673DB616',
    parallaxOptions: {
        type: 'reveal',
        percentage: 62,
        property: 'translate'
    },
    afterLoad(origin, destination, direction) { //after loading of new VERTICAL sections
        if (origin.index === 1-1 && direction==='down') {
            //transition onto intro card 2 from intro card 1
            svgTransitions.card2Transition(direction);
        }
        if (origin.index === 2-1 && direction==='up') {
            //transition onto intro card 1 from intro card 2
            svgTransitions.card2Transition(direction);
        }

        if (origin.index === 2-1 && direction==='down') {
            //transition onto intro card 3 from intro card 2
            svgTransitions.card3Transition(direction);
        }
        if (origin.index === 3-1 && direction==='up') {
            //transition onto intro card 2 from intro card 3
            svgTransitions.card3Transition(direction);
        }

        if (origin.index === 3-1 && direction==='down') {
            //transition onto swim question card (river slides first card) from intro card 3
            svgTransitions.card4Transition(direction);
        }
        if (origin.index === 4-1 && direction==='up') {
            //transition onto intro card 3 from swim question card (river slides first card)
            svgTransitions.card4Transition(direction);
        }

        if (origin.index === 4-1 && direction==='down') {
            //transition onto ack card from river slides last card
            svgTransitions.card5Transition(direction);
        }
        if (origin.index === 5-1 && direction==='up') {
            //transition onto river slides last card from ack card
            svgTransitions.card5Transition(direction);
        }
    },
    afterSlideLoad(section, origin, destination, direction) { //after loading of new HORIZONTAL sections

        //slide 0 is considered to be card 5

        if (section.anchor === 'along_the_river' && destination.index === 1) {
            //transition onto slide 1
            svgTransitions.afterHookTransitionEnter(direction);
            //titleCardAfterHookGraphics.Enter();

        }
        if (section.anchor === 'along_the_river' && destination.index === 2) {
            //transition onto slide 2
            //interactive diagram
            svgTransitions.interactiveDiagramTransition(direction);
        }
        if (section.anchor === 'along_the_river' && destination.index === 3) {
            //PART ONE TITLE CARD
            //transition onto slide 3
            svgTransitions.titleCardOneTransitionEnter(direction);
        }
        if (section.anchor === 'along_the_river' && destination.index === 4) {
            //transition onto slide 4
            svgTransitions.slide1Transition(direction);
        }
        if (section.anchor === 'along_the_river' && destination.index === 5) {
            //transition onto slide 5
            svgTransitions.slide2Transition(direction);
            cso.transitionBackgroundEnter();
        }
        if (section.anchor === 'along_the_river' && destination.index === 6) {
            //transition onto slide 6
            svgTransitions.standardSlideTransition(direction);
            eColiRainChart.slideEnter();
        }
        if (section.anchor === 'along_the_river' && destination.index === 7) {
            //transition onto slide 7
            svgTransitions.standardSlideTransition(direction);
            swimmability.slideEnter();
        }
        if (section.anchor === 'along_the_river' && destination.index === 8) {
            //PART TWO TITLE CARD
            svgTransitions.titleCardTwoTransitionEnter(direction);
        }
        if (section.anchor === 'along_the_river' && destination.index === 9) {
            //transition onto slide 9
            svgTransitions.slide5and6Transition(direction);
        }
        if (section.anchor === 'along_the_river' && destination.index === 10) {
            //transition onto slide 10
            svgTransitions.slide5and6Transition(direction);
            cyanoTempScatterChart.slideEnter();
        }
        if (section.anchor === 'along_the_river' && destination.index === 11) {
            //transition onto slide 11
            svgTransitions.slide7Transition(direction);
            phosphorus.slideEnter();
            phosphorus.updateVis();
        }
        if (section.anchor === 'along_the_river' && destination.index === 12) {
            //transition onto slide 12
            //interactive river map
            svgTransitions.slide8Transition(direction);
            charlesRiverInteractiveMap.slideEnter();
        }
        if (section.anchor === 'along_the_river' && destination.index === 13) {
            //transition onto slide 13
            svgTransitions.slide9Transition(direction);
            charlesRiverInteractiveMap.slideEnterFloatingWetlandDescription();
        }
        if (section.anchor === 'along_the_river' && destination.index === 14) {
            //transition onto slide 14
            //the river health simulation
            svgTransitions.slide10Transition(direction);
            riverHealthSim.slideEnter();
            riverHealthSim.transitionBackgroundEnter();
        }
        if (section.anchor === 'along_the_river' && destination.index === 15) {
            //transition onto slide 15
            svgTransitions.slide11Transition(direction);
            ahaCard.transitionBackgroundEnter()
        }
    },

    onSlideLeave: function( section, origin, destination, direction){

        //leaving after hook title slide
        if(section.anchor === 'along_the_river' && destination.index === 2 && direction === 'right'){
            svgTransitions.afterHookTransitionExit(direction)
        }

        //leaving after hook title slide
        if(section.anchor === 'along_the_river' && destination.origin === 1  && direction === 'left'){
            svgTransitions.afterHookTransitionExit(direction)
        }

        //leaving interactive diagram slide
        if(section.anchor === 'along_the_river' && destination.index === 1  && direction === 'left'){
            interactiveDiagramPage.interactiveDiagramExit(direction)
        }

        //leaving interactive diagram slide
        if(section.anchor === 'along_the_river' && destination.index === 3  && direction === 'right'){
            interactiveDiagramPage.interactiveDiagramExit(direction)
        }

        //leaving part one title slide
        if(section.anchor === 'along_the_river' && destination.index === 4 && direction === 'right'){
            svgTransitions.titleCardOneTransitionExit(direction)
        }

        //leaving part one title slide
        if(section.anchor === 'along_the_river' && destination.index === 2 && direction === 'left'){
            svgTransitions.titleCardOneTransitionExit(direction)
        }

        // leaving CSO slide
        if (section.anchor === 'along_the_river' && origin.index === 5) {
            cso.transitionBackgroundExit();
        }

        // leaving Sim slide
        if (section.anchor === 'along_the_river' && origin.index === 14) {
            riverHealthSim.transitionBackgroundExit();
        }

        //leaving part two title slide
        if(section.anchor === 'along_the_river' && destination.index === 9 && direction === 'right'){
            svgTransitions.titleCardTwoTransitionExit(direction)
        }

        //leaving part two title slide
        if(section.anchor === 'along_the_river' && destination.index === 7 && direction === 'left'){
            svgTransitions.titleCardTwoTransitionExit(direction)
        }

        //leaving part two title slide
        if(section.anchor === 'along_the_river' && origin.index === 15 && direction === 'down'){
            svgTransitions.ahaCardTransitionExit(direction)
        }

        //leaving part two title slide
        if(section.anchor === 'along_the_river' && destination.index === 14 && direction === 'left'){
            svgTransitions.ahaCardTransitionExit(direction)
        }

    }
});


/// THIS CODE IS NOT WORKING - TO REMOVE THE "LOOP" ARROWS AT START AND END OF SLIDE ROW
// CONCEPT: USER SHOULD HAVE TO RUN THE SITE IN A LINEAR SEQUENCE! GO LEFT ONLY, NOT LOOP
// //Remove Arrows on the first and last page full page function with options.
// $('#along_the_river').fullpage({
//     controlArrows: false,
// });
