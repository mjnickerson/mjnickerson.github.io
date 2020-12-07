class RiverHealthSimulation {
    constructor(_parentElement, _elementsvgpaths, cloudContainer, fishContainer1, fishContainer2) {
        this.parentElement = _parentElement;
        this.cloudContainer = cloudContainer;
        this.fishContainer1 = fishContainer1;
        this.fishContainer2 = fishContainer2;
        this.elementSvgPaths = _elementsvgpaths;
        this.demoState = true; //is the user being guided through the use of the simulation? First time seeing it?
        this.demoPartOne = true; // nutrients section
        this.demoPartTwo = false; //temperature section
        this.demoPartThree = false; //habitat section, just before FREEPLAY
        this.demoPartThreeState = 0; //when in habitat section, this counts the text cards
        this.states = [
            {
                state:0, description: "A Healthy Food Chain!",
                cyno: "img/cyno-50.png", zoo: "img/zoo-24.png", smallfish: "img/smallfish-12.png" , bigfish: "img/bigfish-5.png",
                river_color:"lightblue", river_surface_color:"blue"
            },
            {
                state:1, description: "Excess nutrients trigger the growth of cyanobacteria, which depletes oxygen levels in the water.",
                cyno: "img/cyno-70.png", zoo: "img/zoo-19.png", smallfish: "img/smallfish-18.png" , bigfish: "img/bigfish-4.png",
                river_color:"#9ec6de", river_surface_color:"#a4a2a2"
            },
            {
                state:2, description: "Big fish need oxygen to survive, and some die with less oxygen available.",
                cyno: "img/cyno-90.png", zoo: "img/zoo-14.png", smallfish: "img/smallfish-24.png" , bigfish: "img/bigfish-3.png",
                river_color:"#c3d5dd", river_surface_color:"grey",
            },
            {
                state:3, description: "With fewer big fish, populations of small fish can increase.",
                cyno: "img/cyno-110.png", zoo: "img/zoo-9.png", smallfish: "img/smallfish-30.png" , bigfish: "img/bigfish-2.png",
                river_color:"#ced7ce", river_surface_color:"#97c697",
            },
            {
                state:4, description: "More small fish eat more zooplankton, allowing cyanobacteria populations to grow more freely. A Cyanobacteria bloom is forming.",
                cyno: "img/cyno-130.png", zoo: "img/zoo-4.png", smallfish: "img/smallfish-34.png" , bigfish: "img/bigfish-1.png",
                river_color:"#a5e3a5", river_surface_color:"#5eac5e",
            },
            {
                state:5, description: "This triggers a positive feedback loop, allowing cyanobacteria populations to continue to increase. A large Cyanobacteria bloom is now in the river.",
                cyno: "img/cyno-150.png", zoo: "img/zoo-1.png", smallfish: "img/smallfish-40.png" , bigfish: "img/bigfish-0.png",
                river_color:"lightgreen", river_surface_color:"green",
            },
            //here ends the normal states. Everything below is for demo purposes only.
        ];

        this.partThreeStates = [
            {
                state:30, description:"Introducing wetland habitat can help remedy this situation by providing refuge that protects zooplankton from predators. More robust zooplankton populations would lead to more control of cyanobacteria, which zooplankton feed on. Additionally, wetland root systems could absorb some of the excess nutrients that get washed into the river. See what effect the wetland has on the food chain!",
                cyno: "img/cyno-150.png", zoo: "img/zoo-1.png", smallfish: "img/smallfish-40.png" , bigfish: "img/bigfish-0.png",
                river_color:"lightgreen", river_surface_color:"green",
            },
            {
                state:31, description:"The zooplankton can find refuge in the floating wetland root system allowing their populations to grow. With protection from small fish predators, zooplankton populations can increase! Additionally, wetland root systems absorb some of the excess nutrients that get washed into the river.",
                cyno: "img/cyno-130.png", zoo: "img/zoo-4.png", smallfish: "img/smallfish-34.png" , bigfish: "img/bigfish-1.png",
                river_color:"#a5e3a5", river_surface_color:"#5eac5e",
            },
            {
                state:32, description:"Greater zooplankton populations consume more cyanobacteria and better control their population.",
                cyno: "img/cyno-110.png", zoo: "img/zoo-9.png", smallfish: "img/smallfish-30.png" , bigfish: "img/bigfish-2.png",
                river_color:"#ced7ce", river_surface_color:"#97c697",
            },
            {
                state:33, description:"Reductions in cyanobacteria levels increase oxygen availability, and allow more big fish to survive.",
                cyno: "img/cyno-90.png", zoo: "img/zoo-14.png", smallfish: "img/smallfish-24.png" , bigfish: "img/bigfish-3.png",
                river_color:"#c3d5dd", river_surface_color:"grey",
            },
            {
                state:34, description:"Increases in big fish leads to reductions in small fish, which they prey on.",
                cyno: "img/cyno-70.png", zoo: "img/zoo-19.png", smallfish: "img/smallfish-18.png" , bigfish: "img/bigfish-4.png",
                river_color:"#9ec6de", river_surface_color:"#a4a2a2"
            },
            {
                state:35, description:"Zooplankton populations are able to grow even more with fewer small fish in the ecosystem, triggering a restorative feedback loop. Ultimately, such an intervention can help make the river more resilient to the environmental factors that trigger blooms!",
                cyno: "img/cyno-50.png", zoo: "img/zoo-24.png", smallfish: "img/smallfish-12.png" , bigfish: "img/bigfish-5.png",
                river_color:"lightblue", river_surface_color:"blue"
            }
        ]

            //assign state counters for simulation
        this.currentState = -1; //state 1
        this.nutrientsState = 0; // range [0,1], added or not added
        this.temperatureState = 0; //range [0,1,2], low med high
        this.wetlandState = 0; // range [0,1], added or not added

        //how to access this array  >vis.stateTransitions[vis.wetlandState][vis.nutrientsState][vis.temperatureState]
        this.stateTransitions = [ //keyed/accessed by wetlandState, followed by nutrientsState. Returns current state based on Temperature;
            {0:[0,1,2], 1:[3,4,5]}, //wetland not added
            {0:[0,0,0], 1:[0,1,2]} //wetland added
        ];


        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

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

        vis.fish1 = d3.select(`#${vis.fishContainer1}`)
            .append("svg")
            .attr("width", $(`#${vis.fishContainer1}`).width())
            .attr("height", $(`#${vis.fishContainer1}`).height())
            .append("g").attr("id", "cso-cloud-bg");


        vis.fish1.append("image")
            .attr("href", "img/moving-fish.gif")
           .attr("width", 250)
           .attr("height", 250);


        vis.fish2 = d3.select(`#${vis.fishContainer2}`)
            .append("svg")
            .attr("width", $(`#${vis.fishContainer2}`).width())
            .attr("height", $(`#${vis.fishContainer2}`).height())
            .append("g").attr("id", "cso-cloud-bg");


        vis.fish2.append("image")
            .attr("href", "img/icon_smallfish.png")
            .attr("width", 50)
            .attr("height", 50);

        ////////// CREATE TOOLTIP //////////////////
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')

        //// RIVER WATER ELEMENTS
        vis.svg
            .append('rect') //element id #1
            // .append('path') //element id #1
            .attr("id", "RiverHealthRiverWaterTopLayer") //animated river foam top/cyanolayer
            .style('fill', 'blue')
            .attr('opacity', 1.0)
            // .attr("d", vis.displayData[1].path)
            // .attr("transform", 'translate ('+(vis.displayData[1].positionX)+','+(vis.displayData[1].positionY)+')');
            .attr("x", 0)
            .attr("y", 60)
            .attr("height", 11)
            .attr("width", vis.width);

        //River Shape + River Color
        vis.svg
            .append('rect')
            .attr("id", "RiverHealthRiverWaterFill") //screen fill for river
            .style('fill', 'lightblue')
            .attr('opacity', 1.0)
            .attr("x", 0)
            .attr("y", 70)
            .attr("height", 420)
            .attr("width", vis.width);



        //set default display - hide temp and habitat sections
        if (vis.demoPartOne) {
            document.getElementById("river-health-panel-temp").style.opacity = 0;
            document.getElementById("river-health-panel-habitat").style.opacity = 0;
        }


        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;


        // console.log("CHECK STATE TRANSITIONS:", vis.stateTransitions);
        // console.log("ACCESS STATE TRANSITIONS:", vis.stateTransitions[vis.wetlandState][vis.nutrientsState][vis.temperatureState]);

        if (vis.demoState === false) { //if in free play mode
            //determine current state of the simulation
            vis.currentState = vis.stateTransitions[vis.wetlandState][vis.nutrientsState][vis.temperatureState];

            console.log("River Health Sim: CURRENT STATE:", vis.currentState);
        }

        if (vis.demoPartOne === true) { //IN GUIDED DEMO MODE
            vis.currentState++ //increment state
        }

        let images = vis.states[vis.currentState];

        if (vis.demoPartThree === true) { //determine with graphics to display (Sections one, two and free sim have the same sequence)
            images = vis.partThreeStates[vis.demoPartThreeState]; //cues up extra text and sequence for side cards during the habitat section
        }

        //button and text states
        if (vis.demoPartOne) { //demo mode starting state
            if (vis.currentState === 0) {
                $("#river-health-description").text("Cyanobacteria blooms can also be understood as a symptom of an impaired food chain. Below is a healthy food chain, but in vulnerable ecosystems, excess nutrients can wreak havoc on its balance through a process called eutrophication. Hover over each element to learn about it’s role, and then see what happens when you add nutrients.")
                document.getElementById("noNutrients").disabled = true;
                document.getElementById("lowTemp").disabled = true;
                document.getElementById("medTemp").disabled = true;
                document.getElementById("highTemp").disabled = true;
                document.getElementById("noWetland").disabled = true;
                document.getElementById("hasWetland").disabled = true;
            } else if (vis.currentState < 5) {
                $("#river-health-description").text(images.description);
                document.getElementById("healthSimNextButton").style.opacity = 1;
                document.getElementById("noNutrients").disabled = true;
                document.getElementById("hasNutrients").disabled = true;
            } else if (vis.currentState < 6) {
                $("#river-health-description").text(images.description)
                $("#healthSimNextButton").text("Next let's see the effect of Temperature!");
                document.getElementById("healthSimNextButton").classList.remove('btn-danger'); //change button color, by calling new bootstrap class
                document.getElementById("healthSimNextButton").classList.add('btn-warning');
            } else if (vis.currentState < 7) {
                vis.demoState = false; //start actual simulation (not fully guided)
                vis.demoPartOne = false; //change parts
                vis.demoPartTwo = true; //change parts
                vis.currentState = 0;
                document.getElementById("noNutrients").disabled = false;
                document.getElementById("hasNutrients").disabled = false;
                document.getElementById("river-health-panel-temp").style.opacity = 1;
                vis.wrangleData(); //reboot the sim with new settings
            }
        } else if (vis.demoPartTwo) {
            $("#river-health-description").text("High temperature also encourages cyanobacterial growth, and can contribute to the process of eutrophication.\n\nSee what happens when you increase the temperature of the river.")
            $("#healthSimNextButton").text("Now let's see how adding wetland habitat can improve the ecosystem!");
            document.getElementById("lowTemp").disabled = false;
            document.getElementById("medTemp").disabled = false;
            document.getElementById("highTemp").disabled = false;
            document.getElementById("healthSimNextButton").classList.remove('btn-warning'); //change button color, by calling new bootstrap class
            document.getElementById("healthSimNextButton").classList.add('btn-success');
            document.getElementById('healthSimNextButton').onclick = function() { //change the button function to move to next step
                vis.demoPartTwo = false;
                vis.demoPartThree = true;
                vis.demoPartThreeState = 0; //force the counter to zero, as it is influenced by wetland button (prevent error states)
                vis.wrangleData(); //reboot the sim with new settings
            };
        } else if (vis.demoPartThree) {
            if (vis.demoPartThreeState === 0) {
                document.getElementById("healthSimNextButton").style.opacity = 0;
                document.getElementById("noWetland").disabled = false;
                document.getElementById("hasWetland").disabled = false;
            }
            if (vis.wetlandState === 1) {
                document.getElementById("healthSimNextButton").style.opacity = 1;
                document.getElementById("noWetland").disabled = true;
                document.getElementById("hasWetland").disabled = true;
            }

            document.getElementById('healthSimNextButton').onclick = function() {
                vis.demoPartThreeState++
                vis.wrangleData(); //reboot the sim with new settings
            };

            $("#river-health-description").text(images.description);
            document.getElementById("river-health-panel-habitat").style.opacity = 1;

            $("#healthSimNextButton").text("Continue....");

            if (vis.demoPartThreeState > 1) {
                vis.nutrientsState = 0;
            }


            if (vis.demoPartThreeState === 5) {
                $("#healthSimNextButton").text("Now experiment on your own!");
                document.getElementById("healthSimNextButton").classList.remove('btn-success'); //change button color, by calling new bootstrap class
                document.getElementById("healthSimNextButton").classList.add('btn-primary');
                document.getElementById('healthSimNextButton').onclick = function() {
                    vis.demoPartTwo = false;
                    vis.demoPartThree = false;
                    vis.demoState = false;
                    document.getElementById("noWetland").disabled = false;
                    document.getElementById("hasWetland").disabled = false;
                    //delete the text forward button (this button deleting itself)
                    let element = document.getElementById("healthSimNextButton");
                    element.parentNode.removeChild(element);
                    vis.wrangleData(); //reboot the sim with new settings
                };
            }
        } else { //freeplay mode
                //use the simulation at large standard text
                $("#river-health-description").text(images.description);
        }



        // if (vis.currentState === vis.states.length - 1) {
        //     $("#river-health-button-nutrients").text("Back to Start");
        // } else if (vis.currentState === 0) {
        //     $("#river-health-button-nutrients").text("Add Nutrient Runoff");
        // }
        // else {
        //     $("#river-health-button-nutrients").text("Next Phase");
        // }

        const imageTransitionDuration = 4500;

        vis.svg.selectAll("image").transition().duration(imageTransitionDuration).style("opacity", 0);
        vis.svg.selectAll('circle').remove();
        vis.svg.selectAll('path').remove();
        vis.svg.selectAll('g').remove();

        let sealife_left_margin = 380;
        let sealife_center_height = 55;

        if (vis.nutrientsState > 0) { //show nutrients added after that stage
            vis.svg
                .append("circle")
                .style('fill', 'darkred')
                .style('opacity', 0.2)
                .attr("cx", -150 + sealife_left_margin)
                .attr("cy", sealife_center_height+130)
                .attr("r", 110)

            vis.svg
                .append("image")
                .attr("href", "img/icon_phosphorus.png")
                .attr("x", -200 + sealife_left_margin)
                .attr("y", sealife_center_height+80)
                .attr("width", "100")
                .attr("height", "100")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                           <!--  <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                                <div class="sim-tooltip">   
                                                <b>Phosphorus Runoff Pollution</b>
                                     
                                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                });
        }

        if (vis.temperatureState > 0) { //show temperature - medium
            vis.svg
                .append("circle")
                .style('fill', 'gold')
                .style('opacity', 0.2)
                .attr("cx", -250 + sealife_left_margin)
                .attr("cy", sealife_center_height+250)
                .attr("r", 110)

            vis.svg
                .append("image")
                .attr("href", "img/icon_temperature.png")
                .attr("x", -293 + sealife_left_margin)
                .attr("y", sealife_center_height+200)
                .attr("width", "100")
                .attr("height", "100")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                         <!--    <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                              <div class="sim-tooltip">   
                                                 <b>River Temperature</b>
                                     
                                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                });
        }

        if (vis.temperatureState > 1) { //show temperature - high
            vis.svg
                .append("circle")
                .style('fill', 'gold')
                .style('opacity', 0.2)
                .attr("cx", -50 + sealife_left_margin)
                .attr("cy", sealife_center_height+250)
                .attr("r", 110)

            vis.svg
                .append("image")
                .attr("href", "img/icon_temperature.png")
                .attr("x", -93   + sealife_left_margin)
                .attr("y", sealife_center_height+200)
                .attr("width", "100")
                .attr("height", "100")
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                           <!--  <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                                <div class="sim-tooltip">   
                                                <b>River Temperature</b>
                                     
                                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                });
        }


        if (vis.wetlandState > 0) { //show wetland
            vis.svg.append('g') //floating wetland
                .attr("id", "floatingWetlandCluster")
                .attr("transform", 'translate (1200,60)')
                .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                          <!--   <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                              <div class="sim-tooltip">   
                                                 <b>Floating Wetland Roots Provide Protection for Zooplankton against Small Fish.</b>
                                     
                                             </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``)
                });
            vis.svg.selectAll("#floatingWetlandCluster")
                .append('path')
                .attr("id", "floatngWetland")
                .style('fill', vis.elementSvgPaths[2].color)
                .attr("d", vis.elementSvgPaths[2].path)
                .attr("transform", 'translate (0,0) scale(4,4.5)')
            vis.svg.selectAll("#floatingWetlandCluster")
                .append('path')
                .attr("id", "floatingWetlandRoots")
                .style('fill', vis.elementSvgPaths[3].color)
                .attr("d", vis.elementSvgPaths[3].path)
                .attr("transform", 'translate (0,0) scale(4,10)')
                .style('opacity', 0.60)
        }

        vis.svg
            .append("image")
            .attr("href", images.bigfish)
            .attr("x", 0 + sealife_left_margin-50)
            .attr("y", sealife_center_height-100)
            .attr("width", "550")
            .attr("height", "550")
            .style("opacity", 0)
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                          <!--   <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                                <div class="sim-tooltip">   
                                                 <b>Big Fish eat Small Fish</b></br>They need high oxygen levels to survive</b>
                                     
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
         //  .transition().delay(imageTransitionDuration).duration(imageTransitionDuration).style("opacity", 1);
            .transition().duration(imageTransitionDuration).style("opacity", 1);

        vis.svg
            .append("image")
            .attr("href", images.smallfish)
            .attr("x", 380 + sealife_left_margin)
            .attr("y", sealife_center_height-40)
            .attr("width", "450")
            .attr("height", "450")
            .style("opacity", 0)
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                           
                                           <!--  <div style="border: thin solid white; width: 110%; border-radius: 5px; background: black; padding: 12px; text-align: left"> -->
                                             <div class="sim-tooltip">   
                                                 <b>Small Fish eat Zooplankton</b>
                                     
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
            //.transition().delay(imageTransitionDuration).duration(imageTransitionDuration).style("opacity", 1);
            .transition().duration(imageTransitionDuration).style("opacity", 1);

        vis.svg
            .append("image")
            .attr("href", images.zoo)
            .attr("x", 750 + sealife_left_margin)
            .attr("y", sealife_center_height-20)
            .attr("width", "500")
            .attr("height", "420")
            .style("opacity", 0)
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                            <!-- <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                                <div class="sim-tooltip">   
                                                 <b>Zooplankton eat Cyanobacteria</b></br>Their ideal natural habitat is wetland marshes</b>

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
            //.transition().delay(imageTransitionDuration).duration(imageTransitionDuration).style("opacity", 1);
            .transition().duration(imageTransitionDuration).style("opacity", 1);

        vis.svg
            .append("image")
            .attr("href", images.cyno)
            .attr("x", 1180 + sealife_left_margin)
            .attr("y", sealife_center_height+22)
            .attr("width", "350")
            .attr("height", "350")
            .style("opacity", 0)
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                           <!--  <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left"> -->
                                             <div class="sim-tooltip">   
                                                 <b>Cyanobacteria (Blue Green Algae)</b></br>create floating green blooms on the river's surface</b>
                                     
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
        //    .transition().delay(imageTransitionDuration).duration(imageTransitionDuration).style("opacity", 1);
            .transition().duration(imageTransitionDuration).style("opacity", 1);

        vis.svg.select("#RiverHealthRiverWaterTopLayer")
            .transition()
            .duration(1000)
            .style('fill', images.river_surface_color)

        vis.svg.select("#RiverHealthRiverWaterFill")
            .transition()
            .duration(1000)
            .style('fill', images.river_color)
    }



    slideEnter() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "7vh")
            .style("left", "88vw")

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(1)")
    }

    transitionBackgroundEnter() {
        let vis = this;

        vis.cloud.transition().duration(40000).attr("transform", "translate(3000, 0)");
        vis.fish1.transition().duration(15000).attr("transform", "translate(3000, 0)");
        vis.fish2.transition().duration(25000).attr("transform", "translate(3000, 0)");
    }


    transitionBackgroundExit() {
        let vis = this;

        vis.cloud.transition().duration(5000).attr("transform", "translate(0, 0)");
        vis.fish1.transition().duration(5000).attr("transform", "translate(0, 0)");
        vis.fish2.transition().duration(5000).attr("transform", "translate(0, 0)");

    }
}