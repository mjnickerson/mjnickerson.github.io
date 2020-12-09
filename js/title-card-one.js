class titleCardOneGraphics {

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
        vis.detailTextTitleCardOne = d3.select("body").append('div')
            .attr('class', "detailTextBox")
            .attr('id', 'detailTextBoxTitleCardOne')


        /////// BUILD BACKGROUND /////////

        let svg_promises_background = [
            d3.xml('data/title-card-back-drop-city.svg'),
            d3.xml('data/title-card-back-drop-trees.svg'),
            d3.xml('data/title-card-back-drop-riverbank.svg'),
            d3.xml('data/riverwavecrest-brown.svg'),
            d3.xml('data/riverwavecrest-lightbrown.svg'),
        ];
        Promise.all(svg_promises_background)
            .then(([cityVar, treesVar, riverbankVar, riverCrestVar, riverWaveVar]) => {
                d3.select("#backgroundCity1").node().append(cityVar.documentElement);
                d3.select("#backgroundTrees1").node().append(treesVar.documentElement);
                d3.select("#backgroundRiverbank1").node().append(riverbankVar.documentElement);
                d3.select("#backgroundRiverAnimationWaveCrest1").node().append(riverCrestVar.documentElement);
                d3.select("#backgroundRiverAnimationWave1").node().append(riverWaveVar.documentElement);
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
        vis.background_transitions_Y =  [ [vis.height-(255*svgTransitions.master_scale_height), vis.height-(790*svgTransitions.master_scale_height)], //city
            [vis.height-(200*svgTransitions.master_scale_height), vis.height-(715*svgTransitions.master_scale_height)], //trees
            [vis.height-(30*svgTransitions.master_scale_height), vis.height-(560*svgTransitions.master_scale_height)],  //water fill
            [vis.height-(100*svgTransitions.master_scale_height), (vis.height-(630*svgTransitions.master_scale_height))], //animated wave crest
            [vis.height-(90*svgTransitions.master_scale_height), (vis.height-(620*svgTransitions.master_scale_height))], //animated wave
            [vis.height+(20*svgTransitions.master_scale_height),vis.height-(70*svgTransitions.master_scale_height)] //riverbank
        ]
        // <-- access is [city, trees, water fill, animated wave surface crest, animated river top, riverbank] <-- [bottom X, top X]

        vis.svg.select('#backgroundCity1')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(0.9*svgTransitions.master_scale_height)+")");

        vis.svg.select('#backgroundTrees1')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(1*svgTransitions.master_scale_height)+")")

        vis.svg.select('#backgroundWater1')
            .append('rect')
            .attr('opacity', 1.0)
            .attr("x", 0)
            .attr("y", vis.background_transitions_Y[2][0])
            .attr("height", vis.height - (180 * svgTransitions.master_scale_height))
            .attr("width", vis.width)
            .attr("fill", "url(#titleCardOneGradient");

        // set the gradient for water fill chart
        let defs = vis.svg.append("defs");
        let gradient = defs.append("linearGradient")
            .attr("id", "titleCardOneGradient")
            .attr("x1", "100%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%");
        gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "#935116")
            .attr("stop-opacity", 1);
        gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#1eaade")
            .attr("stop-opacity", 1);


        //Create river top surface color
        vis.svg.select("#backgroundRiverAnimationWaveCrest1")
            .attr("opacity", 1.0)
            .attr("transform", 'translate(0,'+vis.background_transitions_Y[3][0]+'), rotate(0), scale('+(1.5*svgTransitions.master_scale_width)+','+(0.11*svgTransitions.master_scale_height)+')');

        //Create river shape animation
        vis.svg.select("#backgroundRiverAnimationWave1")
            .attr("opacity", 1.0)
            .attr("transform", 'translate(0,'+vis.background_transitions_Y[4][0]+'), rotate(0), scale('+(1.5*svgTransitions.master_scale_width)+','+(0.11*svgTransitions.master_scale_height)+')');

        vis.svg.select('#backgroundRiverbank1')
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(1*svgTransitions.master_scale_height)+")");


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
            .attr("transform", "translate("+(825*svgTransitions.master_scale_width)+","+(400*svgTransitions.master_scale_height)+"), rotate(0), scale("+(0.30*svgTransitions.master_scale_width)+","+(0.30*svgTransitions.master_scale_height)+")");

        vis.svg.select('#bigFishIcon3')
            .attr("transform", "translate("+(120*svgTransitions.master_scale_width)+","+(835*svgTransitions.master_scale_height)+"), rotate(0), scale("+(0.45*svgTransitions.master_scale_width)+","+(0.45*svgTransitions.master_scale_height)+")");

        vis.svg.select('#smallFishIcon2')
            .attr("transform", "translate("+(510*svgTransitions.master_scale_width)+","+(525*svgTransitions.master_scale_height)+"), rotate(0), scale("+(0.50*svgTransitions.master_scale_width)+","+(0.50*svgTransitions.master_scale_height)+")");

        vis.svg.select('#smallFishIcon3')
            .attr("transform", "translate("+(1270*svgTransitions.master_scale_width)+","+(685*svgTransitions.master_scale_height)+"), rotate(0), scale("+(0.30*svgTransitions.master_scale_width)+","+(0.30*svgTransitions.master_scale_height)+")");

        vis.svg.select('#smallFishIcon4')
            .attr("transform", "translate("+(1550*svgTransitions.master_scale_width)+","+(820*svgTransitions.master_scale_height)+"), rotate(0), scale("+(0.70*svgTransitions.master_scale_width)+","+(0.70*svgTransitions.master_scale_height)+")");

        vis.svg.select('#seaLifeTitleCard1')
            // .attr("transform", "translate(0,0)");
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(vis.height)+")");

        ////////// CREATE TEXT BOX //////////////////


        vis.detailTextTitleCardOne
            .style('opacity', 1.0)
            .html(`
                        <div class="row justify-content-center backgroundTransparentWhiteFill">
                            <img src="img/icon_ecoli.png" style="height:10vh;"><p class="subjectHeading">&nbsp&nbsp&nbsp What is E. coli? &nbsp&nbsp&nbsp</p><img src="img/icon_ecoli.png" style="height:10vh;">

                            <p class="subjectDetailText" style="margin-top: 1.9vh; font-size: 2.2vh;"></br>In water bodies like rivers, sewage contamination poses a serious threat to swimability. Fecal matter can carry a variety of pathogens, including Giardia, Salmonella, and Hepatitis, that can make swimmers sick.</p>
                            <p class="subjectDetailText" style="margin-top: 1.9vh; font-size: 2.2vh;">Because these pathogens can be challenging to test for individually, scientists often use E. coli as an indicator for sewage contamination. E. coli is a type of bacteria found in the intestines of humans and animals, and though most strains are harmless, some can cause diarrhea, urinary tract infections, respiratory illness and pneumonia.</p>
                            <p class="subjectDetailText" style="margin-top: 1.9vh; font-size: 2.2vh;">In Massachusetts, the Department of Public Health sets safety standards for E. coli levels. If a water body exceeds these thresholds, the area is considered unsafe to swim.</p>
<!--                            <p style="color:black;">Exposure to either is harmful or toxic to humans.</p>-->
                        </div>`)

    }


    transitionBackgroundEnter() {
        let vis = this;

        //raise background
        vis.svg.select('#backgroundCity1')
            .transition()
            .duration(2500)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][1]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(0.9*svgTransitions.master_scale_height)+")");

        vis.svg.select('#backgroundTrees1')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][1]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(1*svgTransitions.master_scale_height)+")");


        vis.svg.select('#backgroundRiverAnimationWaveCrest1')
            .transition()
            .duration(2700)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][1]+'), rotate(0), scale('+(1.5*svgTransitions.master_scale_width)+','+(0.11*svgTransitions.master_scale_height)+')');

        vis.svg.select('#backgroundRiverAnimationWave1')
            .transition()
            .duration(2800)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][1]+'), rotate(0), scale('+(1.5*svgTransitions.master_scale_width)+','+(0.11*svgTransitions.master_scale_height)+')');

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(2700)
            .attr("y", vis.background_transitions_Y[2][1]);

        vis.svg.select('#seaLifeTitleCard1')
            .transition()
            .duration(3000)
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(-50*svgTransitions.master_scale_height)+")");

        vis.svg.select('#backgroundRiverbank1')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][1]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(1*svgTransitions.master_scale_height)+")");


        setTimeout(function () {
            vis.detailTextTitleCardOne
                .style("display", "block");

            vis.svg.select('#seaLifeTitleCard1')
                .transition()
                .duration(30000) //50000
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
            .attr("transform", "translate(0,"+vis.background_transitions_Y[0][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(0.9*svgTransitions.master_scale_height)+")");

        vis.svg.select('#backgroundTrees1')
            .transition()
            .duration(2400)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[1][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(1*svgTransitions.master_scale_height)+")");

        vis.svg.select('#backgroundRiverAnimationWaveCrest1')
            .transition()
            .duration(2600)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[3][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(0.11*svgTransitions.master_scale_height)+")");

        vis.svg.select('#backgroundRiverAnimationWave1')
            .transition()
            .duration(3000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[4][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(0.11*svgTransitions.master_scale_height)+")");

        vis.svg.select('rect') // #backgroundWater
            .transition()
            .duration(3200)
            .attr("y", vis.background_transitions_Y[2][0]);

        vis.svg.select('#seaLifeTitleCard1')
            .transition()
            .duration(2200)
            .attr("transform", "translate("+(-(vis.width/3)-100)+","+(vis.height)+")");


        vis.svg.select('#backgroundRiverbank1')
            .transition()
            .duration(4000)
            .attr("transform", "translate(0,"+vis.background_transitions_Y[5][0]+"), rotate(0), scale("+(1.5*svgTransitions.master_scale_width)+","+(0.9*svgTransitions.master_scale_height)+")");

        vis.detailTextTitleCardOne
            .style("display", "none");
    }




    updateVis() {


        //     ////////// ADD DIAGRAM BUBBLES //////////////////
        //
        //     vis.hiddenBubs = vis.svg.selectAll(".hiddenBubbles")
        //         .data(vis.interactiveDiagramData)
        //
        //     //Hidden Circle Zones
        //     vis.hiddenBubs.enter()
        //         .append('circle')
        //         .attr("class", "hiddenBubbles")
        //         .attr('fill', 'orange')//starting color
        //         .attr('opacity', 0.40)
        //         .attr("r", d=> d.bubbleRadius)
        //         .attr("cx",d => d.bubblePointX)
        //         .attr("cy",d => d.bubblePointY)
        //         .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
        //             d3.select(this)
        //                 .attr('stroke-width', ' 10px')
        //                 .attr('stroke', 'black')
        //                 .attr('stroke-dasharray', '35')
        //                 .attr('opacity', 0.001)
        //                 .attr('stroke-opacity', 1)
        //
        //             vis.svg.select(d.icon_name) //reveal icon
        //                 .transition()
        //                 .duration(500)
        //                 .style("opacity", 1);
        //
        //             console.log(d.icon_name + 'EatsArrow')
        //
        //             vis.svg.select(d.icon_name + 'EatsArrow') //show eating arrows
        //                 .transition()
        //                 .duration(700)
        //                 .style("opacity", 0.80);
        //
        //             vis.tooltip
        //                 .style("opacity", 0.89)
        //                 .style("left", event.pageX + 20 + "px"  )
        //                 .style("top", event.pageY + "px")
        //                 .html(`
        //                                  <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #ffffff; padding: 10px; text-align: left">
        //                                      <h4><b>${d.bubble_title}</b></h4>
        //                                      <h6>${d.bubble_text}</h6>
        //                                  </div>`);
        //         })
        //         .on('mouseout', function(event, d) {
        //             d3.select(this)
        //                 .attr('stroke-width', '0px')
        //                 .style('fill', 'white')
        //                 .attr('opacity', 0.10)
        //             // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})
        //
        //             vis.tooltip
        //                 .style("opacity", 0)
        //                 .style("left", 0)
        //                 .style("top", 0)
        //                 .html(``)
        //         });
        //



    }




}