class titleCardAfterHookGraphics {

    constructor(_parentElement, _svgPaths, swimmerContainer) {
        this.parentElement = _parentElement;
        this.swimmerContainer = swimmerContainer;
        this.svgPaths = _svgPaths

        this.initVis();
    }

    //theres is no data wrangling or updating, since this is a static visualization
    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.swimmer = d3.select(`#${vis.swimmerContainer}`)
            .append("svg")
            .attr("width", $(`#${vis.swimmerContainer}`).width())
            .attr("height", $(`#${vis.swimmerContainer}`).height())
            .append("g").attr("id", "cso-cloud-bg");


        vis.swimmer.append("image")
            .attr("href", "img/swimmer.gif")
             //.attr("width", 300)
             //.attr("height", 300);


        ////////// CREATE TOOLTIP //////////////////
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')


        ////////// CREATE NARRATOR 1 FOR SITE //////////////////
        vis.narrarator = d3.select("body").append('div')
            .attr('id', 'narraratorFishBox')


        /////// BUILD BACKGROUND /////////

        let svg_promises_background = [
            d3.xml('data/title-card-back-drop-city.svg'),
            d3.xml('data/title-card-back-drop-trees.svg'),
            d3.xml('data/title-card-back-drop-riverbank.svg'),

        ];
        Promise.all(svg_promises_background)
            .then(([cityVar, treesVar, riverbankVar]) => {
                d3.select("#backgroundCity3").node().append(cityVar.documentElement);
                d3.select("#backgroundTrees3").node().append(treesVar.documentElement);
                d3.select("#backgroundRiverbank3").node().append(riverbankVar.documentElement);
            });

        //empty layers for background containers
        // layer order here determines draw order!!!!
        vis.svg.append('g')
            .attr('id', 'backgroundCity3')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundTrees3')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundWater3')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWaveCrest3')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWave3')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverbank3')
            .style('opacity', 1.0)

        //the y heights for each anchor of the transitions
        vis.background_transitions_Y = [[vis.height - 255, vis.height - 890], //city
            [vis.height - 200, vis.height - 815], //trees
            [vis.height + 20, vis.height - 655], //water fill
            [vis.height - 300, (vis.height - 760)], //animated wave surface crest
            [vis.height - 300, vis.height - 750], //animated river top
            [vis.height + 20, vis.height - 70], //riverbank
        ] // <-- access is [city, trees, water fill, animated wave surface crest, animated river top, riverbank] <-- [bottom X, top X]

        vis.svg.select('#backgroundCity3')
            .attr("transform", "translate(0," + vis.background_transitions_Y[0][1] + "), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees3')
            .attr("transform", "translate(0," + vis.background_transitions_Y[1][1] + "), rotate(0), scale(1.5,1)")

        vis.svg.select('#backgroundWater3')
            .append('rect')
            .attr('fill', 'lightblue')//starting color
            .attr('opacity', 1.0)
            .attr("x", 0)
            .attr("y", vis.background_transitions_Y[2][1])
            .attr("height", vis.height - 200)
            .attr("width", vis.width)

        //Create river top surface color
        vis.svg.select("#backgroundRiverAnimationWaveCrest3")
            .append('path')
            // .attr('class', 'parallax-single')
            .attr('fill', 'blue')//starting color
            .attr("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,' + vis.background_transitions_Y[3][1] + ') rotate(0), scale(12,1.4)');

        //Create river shape animation
        vis.svg.select("#backgroundRiverAnimationWave3")
            .append('path')
            // .attr('class', 'parallax-single')
            .attr('fill', 'lightblue')//starting color
            .attr("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,' + vis.background_transitions_Y[4][1] + ') rotate(0), scale(12,1.4)');

        vis.svg.select('#backgroundRiverbank3')
            .attr("transform", "translate(0," + vis.background_transitions_Y[5][1] + "), rotate(0), scale(1.5,1)");



        vis.narrarator
            .style('opacity', 1.0)
            .html(`
                        <img src="img/narraratorFish.png" id="narraratorFishImage">`)
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


        vis.narrarator
            .style("top", "80vh")
            .style("left", "-20vw");


    }

        ////////// CREATE TEXT BOX //////////////////

    transitionBackgroundEnter() {
        let vis = this;

        //lower background
        vis.svg.select('#backgroundCity3')
            .transition()
            .duration(4000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees3')
            .transition()
            .duration(3500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest3')
            .transition()
            .duration(3200)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave3')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(3500)
            .attr("y", vis.background_transitions_Y[2][0]);

        vis.svg.select('#backgroundRiverbank3')
            .transition()
            .duration(2000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale(1.5,1)");

        vis.swimmer.transition().duration(20000).attr("transform", "translate(3000, 0)");

    }


    transitionBackgroundExit () {
        let vis = this;

        //raise background
        vis.svg.select('#backgroundCity3')
            .transition()
            .duration(2500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][1]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees3')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][1]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest3')
            .transition()
            .duration(2700)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][1]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave3')
            .transition()
            .duration(2800)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][1]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(2900)
            .attr("y", vis.background_transitions_Y[2][1]);

        vis.svg.select('#backgroundRiverbank3')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][1]+"), rotate(0), scale(1.5,1)");

        vis.swimmer.transition().duration(0).attr("transform", "translate(0, 0)");

        document.getElementById("animatedWavesContainer").style.opacity = "100";
        document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
        document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

        vis.updateVis();

    }

    enterHookCard() {

        d3.select("#narraratorFishBox")
            .transition()
            .duration(5000)
            .style("display", "block")
            .style("top", "80vh")
            .style("left", "43vw");

        d3.select("#narraratorFishImage")
            .transition()
            .duration(1)
            .style("transform", "scaleX(-1)")
    }


    updateVis() {
        console.log("Updating Hook Card")

    }

}