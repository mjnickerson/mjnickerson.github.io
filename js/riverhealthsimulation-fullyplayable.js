class RiverHealthSimulation {
    constructor(_parentElement, _elementsvgpaths) {
        this.parentElement = _parentElement;
        this.elementSvgPaths = _elementsvgpaths;
        this.states = [
            {
                state:0, description_nutrient: "A Healthy Food Chain!",
                cyno: "img/cyno-50.png", zoo: "img/zoo-24.png", smallfish: "img/smallfish-12.png" , bigfish: "img/bigfish-5.png",
                river_color:"lightblue", river_surface_color:"blue"
            },
            {
                state:1, description_nutrient: "Excess nutrients triggers the growth of cyanobacteria, which depletes oxygen levels in the water.",
                cyno: "img/cyno-70.png", zoo: "img/zoo-19.png", smallfish: "img/smallfish-18.png" , bigfish: "img/bigfish-4.png",
                river_color:"#9ec6de", river_surface_color:"#a4a2a2"
            },
            {
                state:2, description_nutrient: "Big fish need oxygen to survive, and some die with less oxygen available.",
                cyno: "img/cyno-90.png", zoo: "img/zoo-14.png", smallfish: "img/smallfish-24.png" , bigfish: "img/bigfish-3.png",
                river_color:"#c3d5dd", river_surface_color:"grey",
            },
            {
                state:3, description_nutrient: "With fewer big fish, populations of small fish can increase.",
                cyno: "img/cyno-110.png", zoo: "img/zoo-9.png", smallfish: "img/smallfish-30.png" , bigfish: "img/bigfish-2.png",
                river_color:"#ced7ce", river_surface_color:"#97c697",
            },
            {
                state:4, description_nutrient: "More small fish eat more zooplankton, allowing cyanobacteria populations to grow more freely. A Cyanobacteria bloom is forming.",
                cyno: "img/cyno-130.png", zoo: "img/zoo-4.png", smallfish: "img/smallfish-34.png" , bigfish: "img/bigfish-1.png",
                river_color:"#a5e3a5", river_surface_color:"#5eac5e",
            },
            {
                state:5, description_nutrient: "This triggers a positive feedback loop, allowing cyanobacteria populations to continue to increase. A large Cyanobacteria bloom is now in the river.",
                cyno: "img/cyno-150.png", zoo: "img/zoo-1.png", smallfish: "img/smallfish-40.png" , bigfish: "img/bigfish-0.png",
                river_color:"lightgreen", river_surface_color:"green",
            }
        ];

        //assign state counters for simulation
        this.currentState = 0; //state 1
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
            .attr("height", 400)
            .attr("width", vis.width);


        $("#river-health-description-nutrients").text("Cyanobacteria blooms can also be understood as a symptom of an impaired food chain. Below is a healthy food chain, but in vulnerable ecosystems, excess nutrients can wreak havoc on its balance through a process called eutrophication. Hover over each element to learn about it’s role, and then see what happens when you add nutrients.")

        vis.wrangleData();
    }

    wrangleData(_button_clicked) {
        let vis = this;

        vis.button_clicked = _button_clicked

        if (vis.button_clicked === "Nutrients") {
            if (vis.nutrientsState === 0) {
                vis.nutrientsState = 1;
            } else {
                vis.nutrientsState = 0;
            }
        } else if (vis.button_clicked === "Temp") {
            if (vis.nutrientsState === 0) {
                vis.nutrientsState = 1;
            } else {
                vis.nutrientsState = 0;
            }
        } else if (vis.button_clicked === "Habitat") {
            if (vis.nutrientsState === 0) {
                vis.nutrientsState = 1;
            } else {
                vis.nutrientsState = 0;
            }
        }

        // vis.currentState++;
        // if (vis.currentState === vis.states.length) {
        //     vis.currentState = 0;
        // }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // console.log("CHECK STATE TRANSITIONS:", vis.stateTransitions);
        // console.log("ACCESS STATE TRANSITIONS:", vis.stateTransitions[vis.wetlandState][vis.nutrientsState][vis.temperatureState]);

        //determine current state of the simulation
        vis.currentState = vis.stateTransitions[vis.wetlandState][vis.nutrientsState][vis.temperatureState];

        console.log("River Health Sim: CURRENT STATE:", vis.currentState);

        let images = vis.states[vis.currentState];

        $("#river-health-description-nutrients").text(images.description_nutrient);

        if (vis.currentState === vis.states.length - 1) {
            $("#river-health-button-nutrients").text("Back to Start");
        } else if (vis.currentState === 0) {
            $("#river-health-button-nutrients").text("Add Nutrient Runoff");
        }
        else {
            $("#river-health-button-nutrients").text("Next Phase");
        }

        vis.svg.selectAll('image').remove();
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
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>Phosphorus Runoff Pollution</b></h6>
                                     
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
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>River Temperature</b></h6>
                                     
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
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>River Temperature</b></h6>
                                     
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
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>Floating Wetland Roots Provide Protection for Zooplankton against Small Fish.</b></h6>
                                     
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
                .attr("transform", 'translate (0,0) scale(4,8)')
                .style('opacity', 0.60)
        }

        vis.svg
            .append("image")
            .attr("href", images.bigfish)
            .attr("x", 0 + sealife_left_margin-50)
            .attr("y", sealife_center_height-100)
            .attr("width", "550")
            .attr("height", "550")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>Big Fish</b></h6>
                                     
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

        vis.svg
            .append("image")
            .attr("href", images.smallfish)
            .attr("x", 380 + sealife_left_margin)
            .attr("y", sealife_center_height-40)
            .attr("width", "450")
            .attr("height", "450")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                    d3.select(this)
                    vis.tooltip
                        .style("opacity", 0.89)
                        .style("left", event.pageX + 20 + "px"  )
                        .style("top", event.pageY + "px")
                        .html(`
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>Small Fish</b></h6>
                                     
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

        vis.svg
            .append("image")
            .attr("href", images.zoo)
            .attr("x", 750 + sealife_left_margin)
            .attr("y", sealife_center_height-20)
            .attr("width", "500")
            .attr("height", "420")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>Zooplankton</b></h6>

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

        vis.svg
            .append("image")
            .attr("href", images.cyno)
            .attr("x", 1180 + sealife_left_margin)
            .attr("y", sealife_center_height+22)
            .attr("width", "350")
            .attr("height", "350")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
                                                 <h6><b>Cyanobacteria</b></h6>
                                     
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

        vis.svg.select("#RiverHealthRiverWaterTopLayer")
            .transition()
            .duration(1000)
            .style('fill', images.river_surface_color)

        vis.svg.select("#RiverHealthRiverWaterFill")
            .transition()
            .duration(1000)
            .style('fill', images.river_color)
    }
}