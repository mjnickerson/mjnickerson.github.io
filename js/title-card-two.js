class titleCardTwoGraphics {

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

        ////////// CREATE DETAIL TEXT FOR PAGE //////////////////
        vis.detailTextTitleCardTwo = d3.select("body").append('div')
            .attr('class', "detailTextBox")
            .attr('id', 'detailTextBoxTitleCardTwo')


        /////// BUILD BACKGROUND /////////

        let svg_promises_background_two = [
            d3.xml('data/title-card-back-drop-city.svg'),
            d3.xml('data/title-card-back-drop-trees.svg'),
            d3.xml('data/title-card-back-drop-riverbank.svg'),
        ];
        Promise.all(svg_promises_background_two)
            .then(([cityVar2, treesVar2, riverbankVar2]) => {
                d3.select("#backgroundCity2").node().append(cityVar2.documentElement);
                d3.select("#backgroundTrees2").node().append(treesVar2.documentElement);
                d3.select("#backgroundRiverbank2").node().append(riverbankVar2.documentElement);
            });

        //empty layers for background containers
        // layer order here determines draw order!!!!
        vis.svg.append('g')
            .attr('id', 'backgroundCity2')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundTrees2')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundWater2')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWaveCrest2')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWave2')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverbank2')
            .style('opacity', 1.0)

        //the y heights for each anchor of the transitions
        vis.background_transitions_Y =  [ [vis.height-255, vis.height-790], //city
            [vis.height-200, vis.height-715], //trees
            [vis.height+20, vis.height-555],  //water fill
            [vis.height-110, -(vis.height-380)], //animated wave crest
            [vis.height-100, -(vis.height-380)], //animated wave
            [vis.height+20,vis.height-70] //riverbank
        ]
        vis.svg.select('#backgroundCity2')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees2')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale(1.5,1)")

        vis.svg.select('#backgroundWater2')
            .append('rect')
            // .style('fill', 'lightblue')//starting color
            .style('opacity', 1.0)
            .attr("x", 0)
            .attr("y", vis.background_transitions_Y[2][0])
            .attr("height", vis.height - 380)
            .attr("width", vis.width)
            .attr("fill", "url(#titleCardTwoGradient");

        // set the gradient for water fill chart
        let defs = vis.svg.append("defs");
        let gradient = defs.append("linearGradient")
            .attr("id", "titleCardTwoGradient")
            .attr("x1", "100%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%");
        gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "lightgreen")
            .attr("stop-opacity", 1);
        gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#009ed9")
            .attr("stop-opacity", 1);


        //Create river top surface color
        vis.svg.select("#backgroundRiverAnimationWaveCrest2")
            .append('path')
            // .attr('class', 'parallax-single')
            .style('fill', '#1fa41f') //starting color
            .style("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,'+vis.background_transitions_Y[3][0]+') rotate(0), scale(12,1.4)');

        //Create river shape animation
        vis.svg.select("#backgroundRiverAnimationWave2")
            .append('path')
            // .attr('class', 'parallax-single')
            .style('fill', 'lightgreen') //starting color
            .style("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,'+vis.background_transitions_Y[4][0]+') rotate(0), scale(12,1.4)');

        vis.svg.select('#backgroundRiverbank2')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale(1.5,1)");


        ////////// LOAD IN SVG ICONS //////////////////

        //all sea life
        vis.svg.append('g')
            .attr('id', 'seaLifeTitleCard2')
            .style('opacity', 1.0)

        //empty icon containers
        vis.svg.select("#seaLifeTitleCard2").append('g')
            .attr('id', 'bigFishIcon3')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard2").append('g')
            .attr('id', 'bigFishIcon4')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard2").append('g')
            .attr('id', 'smallFishIcon5')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard2").append('g')
            .attr('id', 'smallFishIcon6')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard2").append('g')
            .attr('id', 'smallFishIcon7')
            .style('opacity', 1.0)

        let svg_promises_icons_two = [
            d3.xml("data/icon_bigfish.svg"),
            d3.xml("data/icon_bigfish.svg"),
            d3.xml('data/icon_cyanobacteria.svg'),
            d3.xml("data/icon_ecoli.svg"),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml('data/icon_zooplankton.svg'),
        ];
        Promise.all(svg_promises_icons_two)
            .then(([bigFishVar1, bigFishVar2, cyanoVar, ecoliVar, smallFishVar1, smallFishVar2, smallFishVar3, zooplankVar]) => {
                d3.select("#bigFishIcon3").node().append(bigFishVar1.documentElement);
                d3.select("#bigFishIcon4").node().append(bigFishVar2.documentElement);
                d3.select("#smallFishIcon5").node().append(smallFishVar1.documentElement);
                d3.select("#smallFishIcon6").node().append(smallFishVar2.documentElement);
                d3.select("#smallFishIcon7").node().append(smallFishVar3.documentElement);
            });

        // starting icons in their locations
        vis.svg.select('#bigFishIcon4')
            .attr("transform", "translate(825,400), rotate(0), scale(0.30,0.30)");

        vis.svg.select('#bigFishIcon5')
            .attr("transform", "translate(120,835), rotate(0), scale(0.45,0.45)");

        vis.svg.select('#smallFishIcon5')
            .attr("transform", "translate(510,525), rotate(0), scale(0.50,0.50)");

        vis.svg.select('#smallFishIcon6')
            .attr("transform", "translate(1270,685), rotate(0), scale(0.30,0.30)");

        vis.svg.select('#smallFishIcon7')
            .attr("transform", "translate(1550,820), rotate(0), scale(0.70,0.70)");

        vis.svg.select('#seaLifeTitleCard2')
            // .attr("transform", "translate(0,0)");
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(vis.height)+")");


        ////////// CREATE TEXT BOX //////////////////


        vis.detailTextTitleCardTwo
            .style('opacity', 1.0)
            .html(`
                        <div class="row justify-content-center backgroundTransparentWhiteFill">
                                <img src="img/icon_cyanobacteria.png" style="height:8vh;"><p class="subjectHeading">&nbsp&nbsp&nbsp What is Cyanobacteria? &nbsp&nbsp&nbsp</p><img src="img/icon_cyanobacteria.png" style="height:8vh;">
                                <p class="subjectDetailText" style="margin-top: 20px; font-size: 22px;"></br>Unfortunately, sewage pollution isn’t the only factor limiting the safety of swimming in the Charles River. Cyanobacteria, also known as blue-green algae, is also a major threat.</p>
                                <p class="subjectDetailText" style="margin-top: 20px; font-size: 22px;">Cyanobacteria are microscopic cells that naturally grow in rivers, lakes, and ponds. However, when given access to excess nutrients like phosphorus, they can grow rapidly and form toxic blooms. Exposure to blooms can cause a range of negative health impacts, from mild skin irritation to liver and nervous system damage in extreme cases.</p>
                                <p class="subjectDetailText" style="margin-top: 20px; font-size: 22px;">The Charles River is unsafe for swimming (and boating) during blooms. While E. coli levels have decreased steadily over time, cyanobacteria blooms are a persistent issue in the Charles River.</p>
                        </div>`)
    }


    transitionBackgroundEnter() {
        let vis = this;

        //raise background
        vis.svg.select('#backgroundCity2')
            .transition()
            .duration(2500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][1]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees2')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][1]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest2')
            .transition()
            .duration(2700)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][1]+"), rotate(0), scale(1,1)")

        vis.svg.select('#backgroundRiverAnimationWave2')
            .transition()
            .duration(2800)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][1]+"), rotate(0), scale(1,1)")
            .attr('fill', 'lightgreen')

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(2500)
            .attr("y", vis.background_transitions_Y[2][1]);
        vis.svg.select('#seaLifeTitleCard2')
            .transition()
            .duration(3000)
            .attr("transform", "translate("+(-(vis.width/3)-100)+",0)");

        vis.svg.select('#backgroundRiverbank2')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][1]+"), rotate(0), scale(1.5,1)");

        //select narrator box
        d3.select("#narraratorBalloonBox") //element outside of this d3 vis, selected directly using "d3"
            .transition()
            .duration(2500)
            .style("display", "block")
            .style("top", "-60vh")
            .style("left", "50vw")

        setTimeout(function () {
            vis.detailTextTitleCardTwo
                .style("display", "block");

            vis.svg.select('#seaLifeTitleCard2')
                .transition()
                .duration(20000) //50000
                .attr("transform", "translate("+vis.width*2+",0)");
        }, 2500);

        vis.updateVis();

    }

    transitionBackgroundExit() {
        let vis = this;

        //lower background
        vis.svg.select('#backgroundCity2')
            .transition()
            .duration(2000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees2')
            .transition()
            .duration(2400)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest2')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave2')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(3200)
            .attr("y", vis.background_transitions_Y[2][0]);

        vis.svg.select('#seaLifeTitleCard2')
            .transition()
            .duration(2200)
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(vis.height)+")");

        vis.svg.select('#backgroundRiverbank2')
            .transition()
            .duration(4000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale(1.5,1)");

        vis.detailTextTitleCardTwo
            .style("display", "none");
    }

    updateVis() {


    }


}