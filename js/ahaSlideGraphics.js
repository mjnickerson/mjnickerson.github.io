class ahaSlideGraphics {

    constructor(_parentElement, _svgPaths) {
        this.parentElement = _parentElement;
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


        ////////// CREATE TOOLTIP //////////////////
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')

        /////// BUILD BACKGROUND /////////

        let svg_promises_background = [
            d3.xml('data/title-card-back-drop-city.svg'),
            d3.xml('data/title-card-back-drop-trees.svg'),
            d3.xml('data/title-card-back-drop-riverbank.svg'),
        ];
        Promise.all(svg_promises_background)
            .then(([cityVar, treesVar, riverbankVar]) => {
                d3.select("#backgroundCity4").node().append(cityVar.documentElement);
                d3.select("#backgroundTrees4").node().append(treesVar.documentElement);
                d3.select("#backgroundRiverbank4").node().append(riverbankVar.documentElement);
            });

        //empty layers for background containers
        // layer order here determines draw order!!!!
        vis.svg.append('g')
            .attr('id', 'backgroundCity4')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundTrees4')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundWater4')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWaveCrest4')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWave4')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverbank4')
            .style('opacity', 1.0)

        //the y heights for each anchor of the transitions
        vis.background_transitions_Y = [[vis.height - 255, vis.height - 550], //city
            [vis.height - 200, vis.height - 480], //trees
            [vis.height - 30, vis.height - 310], //water fill
            [vis.height - 650, (vis.height - 420)], //animated wave surface crest
            [vis.height - 650, vis.height - 410], //animated river top
            [vis.height + 20, vis.height - 70], //riverbank
        ] // <-- access is [city, trees, water fill, animated wave surface crest, animated river top, riverbank] <-- [bottom X, top X]

        vis.svg.select('#backgroundCity4')
            .attr("transform", "translate(0," + vis.background_transitions_Y[0][1] + "), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees4')
            .attr("transform", "translate(0," + vis.background_transitions_Y[1][1] + "), rotate(0), scale(1.5,1)")

        vis.svg.select('#backgroundWater4')
            .append('rect')
            .attr('fill', 'lightblue')//starting color
            .attr('opacity', 1.0)
            .attr("x", 0)
            .attr("y", vis.background_transitions_Y[2][1])
            .attr("height", vis.height - 200)
            .attr("width", vis.width)

        //Create river top surface color
        vis.svg.select("#backgroundRiverAnimationWaveCrest4")
            .append('path')
            // .attr('class', 'parallax-single')
            .attr('fill', 'blue')//starting color
            .attr("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,' + vis.background_transitions_Y[3][1] + ') rotate(0), scale(12,1.4)');

        //Create river shape animation
        vis.svg.select("#backgroundRiverAnimationWave4")
            .append('path')
            // .attr('class', 'parallax-single')
            .attr('fill', 'lightblue')//starting color
            .attr("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,' + vis.background_transitions_Y[4][1] + ') rotate(0), scale(12,1.4)');

        vis.svg.select('#backgroundRiverbank4')
            .attr("transform", "translate(0," + vis.background_transitions_Y[5][1] + "), rotate(0), scale(1.5,1)");

    }

    ////////// CREATE TEXT BOX //////////////////

    transitionBackgroundEnter() {
        let vis = this;

        //lower background
        vis.svg.select('#backgroundCity4')
            .transition()
            .duration(4000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees4')
            .transition()
            .duration(3500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest4')
            .transition()
            .duration(3200)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave4')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(3500)
            .attr("y", vis.background_transitions_Y[2][0]);

        vis.svg.select('#backgroundRiverbank4')
            .transition()
            .duration(2000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale(1.5,1)");

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


        setTimeout(function () {

            //fade content out
            vis.svg.select('#backgroundCity4')
                .transition()
                .duration(6000)
                .style("opacity", "0");

            vis.svg.select('#backgroundTrees4')
                .transition()
                .duration(6000)
                .style("opacity", "0");

            vis.svg.select('#backgroundRiverAnimationWaveCrest4')
                .transition()
                .duration(6000)
                .style("opacity", "0");

            vis.svg.select('#backgroundRiverAnimationWave4')
                .transition()
                .duration(6000)
                .style("opacity", "0");

            vis.svg.select('rect') // #backgroundWater
                .transition()
                .duration(6000)
                .style("opacity", "0");

            vis.svg.select('#backgroundRiverbank4')
                .transition()
                .duration(6000)
                .style("opacity", "0");

            d3.select('#animatedWavesContainer')
                .transition()
                .duration(6000)
                .style("opacity", "1");

        }, 3800);


        setTimeout(function () {
            document.getElementById("ahaAnimationsContainer").style.height = "0vh";
        }, 10000);


    }

    transitionBackgroundExit () {
        let vis = this;

        //raise background
        vis.svg.select('#backgroundCity4')
            .transition()
            .duration(2500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][1]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees4')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][1]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest4')
            .transition()
            .duration(2700)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][1]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave4')
            .transition()
            .duration(2800)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][1]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(2900)
            .attr("y", vis.background_transitions_Y[2][1]);

        vis.svg.select('#backgroundRiverbank4')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][1]+"), rotate(0), scale(1.5,1)");

        vis.updateVis();

    }

    narraratorExit() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(2000)
            .style("display", "block")
            .style("top", "-40vh")
            .style("left", "88vw")

    }


    updateVis() {
        console.log("Updating Hook Card")

    }


}