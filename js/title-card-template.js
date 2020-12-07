class titleCard_TEMPLATE {

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
        // append tooltip
        vis.detailText = d3.select("body").append('div')
            .attr('class', "detailTextBox")
            .attr('id', 'detailTextBoxTitleCardOne')


        /////// BUILD BACKGROUND /////////

        let svg_promises_background = [
            d3.xml('data/title-card-back-drop-city.svg'),
            d3.xml('data/title-card-back-drop-trees.svg'),
            d3.xml('data/title-card-back-drop-riverbank.svg'),
        ];
        Promise.all(svg_promises_background)
            .then(([cityVar, treesVar, riverbankVar]) => {
                d3.select("#backgroundCity1").node().append(cityVar.documentElement);
                d3.select("#backgroundTrees1").node().append(treesVar.documentElement);
                d3.select("#backgroundRiverbank1").node().append(riverbankVar.documentElement);
            });

        //empty layers for background containers
        // layer order here determines draw order!!!!
        vis.svg.append('g')
            .attr('id', 'backgroundCity1')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundTrees1')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundWater1')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWaveCrest1')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverAnimationWave1')
            .style('opacity', 1.0)
        vis.svg.append('g')
            .attr('id', 'backgroundRiverbank1')
            .style('opacity', 1.0)

        //the y heights for each anchor of the transitions
        vis.background_transitions_Y =  [ [vis.height-255, vis.height-790], //city
            [vis.height-200, vis.height-715], //trees
            [vis.height+20, vis.height-555],  //water fill
            [vis.height-110, -(vis.height-380)], //animated wave crest
            [vis.height-100, -(vis.height-380)], //animated wave
            [vis.height+20,vis.height-70] //riverbank
        ]
        // <-- access is [city, trees, water fill, animated wave surface crest, animated river top, riverbank] <-- [bottom X, top X]

        vis.svg.select('#backgroundCity1')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees1')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale(1.5,1)")

        vis.svg.select('#backgroundWater1')
            .append('rect')
            .attr('fill', 'lightblue')//starting color
            .attr('opacity', 1.0)
            .attr("x", 0)
            .attr("y", vis.background_transitions_Y[2][0])
            .attr("height", vis.height - 280)
            .attr("width", vis.width)

        //Create river top surface color
        vis.svg.select("#backgroundRiverAnimationWaveCrest1")
            .append('path')
            // .attr('class', 'parallax-single')
            .attr('fill', 'blue')//starting color
            .attr("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,'+vis.background_transitions_Y[3][0]+') rotate(0), scale(12,1.4)');

        //Create river shape animation
        vis.svg.select("#backgroundRiverAnimationWave1")
            .append('path')
            // .attr('class', 'parallax-single')
            .attr('fill', 'lightblue')//starting color
            .attr("opacity", 1.0)
            .attr("d", vis.svgPaths[0].path)
            .attr("transform", 'translate(0,'+vis.background_transitions_Y[4][0]+') rotate(0), scale(12,1.4)');

        vis.svg.select('#backgroundRiverbank1')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale(1.5,1)");


        ////////// LOAD IN SVG ICONS //////////////////

        //all sea life
        vis.svg.append('g')
            .attr('id', 'seaLifeTitleCard1')
            .style('opacity', 1.0)

        //empty icon containers
        vis.svg.select("#seaLifeTitleCard1").append('g')
            .attr('id', 'bigFishIcon2')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard1").append('g')
            .attr('id', 'bigFishIcon3')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard1").append('g')
            .attr('id', 'smallFishIcon2')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard1").append('g')
            .attr('id', 'smallFishIcon3')
            .style('opacity', 1.0)
        vis.svg.select("#seaLifeTitleCard1").append('g')
            .attr('id', 'smallFishIcon4')
            .style('opacity', 1.0)

        let svg_promises_icons = [
            d3.xml("data/icon_bigfish.svg"),
            d3.xml("data/icon_bigfish.svg"),
            d3.xml('data/icon_cyanobacteria.svg'),
            d3.xml("data/icon_ecoli.svg"),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml('data/icon_zooplankton.svg'),
        ];
        Promise.all(svg_promises_icons)
            .then(([bigFishVar1, bigFishVar2, cyanoVar, ecoliVar, smallFishVar1, smallFishVar2, smallFishVar3, zooplankVar]) => {
                d3.select("#bigFishIcon2").node().append(bigFishVar1.documentElement);
                d3.select("#bigFishIcon3").node().append(bigFishVar2.documentElement);
                d3.select("#smallFishIcon2").node().append(smallFishVar1.documentElement);
                d3.select("#smallFishIcon3").node().append(smallFishVar2.documentElement);
                d3.select("#smallFishIcon4").node().append(smallFishVar3.documentElement);
            });

        // starting icons in their locations
        vis.svg.select('#bigFishIcon2')
            .attr("transform", "translate(825,400), rotate(0), scale(0.30,0.30)");

        vis.svg.select('#bigFishIcon3')
            .attr("transform", "translate(120,835), rotate(0), scale(0.45,0.45)");

        vis.svg.select('#smallFishIcon2')
            .attr("transform", "translate(510,525), rotate(0), scale(0.50,0.50)");

        vis.svg.select('#smallFishIcon3')
            .attr("transform", "translate(1270,685), rotate(0), scale(0.30,0.30)");

        vis.svg.select('#smallFishIcon4')
            .attr("transform", "translate(1550,820), rotate(0), scale(0.70,0.70)");

        vis.svg.select('#seaLifeTitleCard1')
            // .attr("transform", "translate(0,0)");
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(vis.height)+")");

        ////////// CREATE TEXT BOX //////////////////


        vis.detailText
            .style('opacity', 1.0)
            .html(`
                        <div class="row justify-content-center backgroundTransparentWhiteFill">
                            <p class="subjectHeading">What is E. coli?</p>
                            <p class="subjectDetailText" style="font-size: 22px">In water bodies like rivers, sewage contamination poses a serious threat to swimability. Fecal matter can carry a variety of pathogens, including Giardia, Salmonella, and Hepatitis, that can make swimmers sick.</p>
                            <p class="subjectDetailText" style="font-size: 22px">Because these pathogens can be challenging to test for individually, scientists often use E. coli as an indicator for sewage contamination. E. coli is a type of bacteria found in the intestines of humans and animals, and though most strains are harmless, some can cause diarrhea, urinary tract infections, respiratory illness and pneumonia.</p>
                            <p class="subjectDetailText" style="font-size: 22px">In Massachusetts, the Department of Public Health sets safety standards for E. coli levels. If a water body exceeds these thresholds, the area is considered unsafe to swim.</p>
                            <p style="color:black;">Exposure to either is harmful or toxic to humans.</p>
                        </div>`)

    }


    transitionBackgroundEnter() {
        let vis = this;

        //raise background
        vis.svg.select('#backgroundCity1')
            .transition()
            .duration(2500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][1]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees1')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][1]+"), rotate(0), scale(1.5,1)");


        vis.svg.select('#backgroundRiverAnimationWaveCrest1')
            .transition()
            .duration(2700)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][1]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave1')
            .transition()
            .duration(2800)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][1]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(2500)
            .attr("y", vis.background_transitions_Y[2][1]);

        vis.svg.select('#seaLifeTitleCard1')
            .transition()
            .duration(3000)
            .attr("transform", "translate("+(-(vis.width/3)-100)+",-50)");

        // vis.svg.select('#backgroundWater')
        //     .transition()
        //     .duration(4200)
        //     .attr("transform", "translate(0,"+vis.background_transitions_Y[2][1]+")");

        vis.svg.select('#backgroundRiverbank1')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][1]+"), rotate(0), scale(1.5,1)");


        setTimeout(function () {
            vis.detailText
                .style("display", "block");

            vis.svg.select('#seaLifeTitleCard1')
                .transition()
                .duration(50000)
                .attr("transform", "translate("+vis.width*2+",0)");
        }, 2500);

        vis.updateVis();

    }

    transitionBackgroundExit() {
        let vis = this;

        //lower background
        vis.svg.select('#backgroundCity1')
            .transition()
            .duration(2000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale(1.5,0.9)");

        vis.svg.select('#backgroundTrees1')
            .transition()
            .duration(2400)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale(1.5,1)");

        vis.svg.select('#backgroundRiverAnimationWaveCrest1')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('#backgroundRiverAnimationWave1')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][0]+"), rotate(0), scale(1,1)");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(3200)
            .attr("y", vis.background_transitions_Y[2][0]);

        vis.svg.select('#seaLifeTitleCard1')
            .transition()
            .duration(2200)
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(vis.height)+")");

        // vis.svg.select('#backgroundWater')
        //     .transition()
        //     .duration(4200)
        //     .attr("transform", "translate(0,"+vis.background_transitions_Y[2][1]+")");

        vis.svg.select('#backgroundRiverbank1')
            .transition()
            .duration(4000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale(1.5,1)");

        vis.detailText
            .style("display", "none");
    }




    updateVis() {



    }



}