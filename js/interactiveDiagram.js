class interactiveDiagram {

    constructor(_parentElement) {
        this.parentElement = _parentElement;

        //static area interactive points
        this.interactiveDiagramData = [
            {"bubble_title":"Sewage Runoff", "icon_name":"#ecoliIcon", "bubble_text":"<b>E-Coli bacteria</br></b>from sewer runoff can pollute the river</br>and are harmful to humans", "bubblePointX":620, "bubblePointY":510, "bubbleRadius":150},
            {"bubble_title":"Nutrient Runoff", "icon_name":"#phosphorusIcon", "bubble_text":"<b>Phosphorus nutrient levels</b></br> can cause the ecosystem to become imbalanced", "bubblePointX":1420, "bubblePointY":510, "bubbleRadius":150},
            {"bubble_title":"Temperature", "icon_name":"#temperatureIcon", "bubble_text":"<b>Higher Temperatures impact river water quality</b>", "bubblePointX":1590, "bubblePointY":100, "bubbleRadius":150},
            {"bubble_title":"Rainfall", "icon_name":"#rainfallIcon", "bubble_text":"<b>Increased levels of rainfall</b></br> allow pollutants to runoff into the river</b>", "bubblePointX":200, "bubblePointY":150, "bubbleRadius":150},
            {"bubble_title":"Habitat", "icon_name":"#wetlandsIcon", "bubblePointX":200, "bubblePointY":520, "bubbleRadius":150, "bubble_text":"<b>Types of Plant life and Habitat</br></b> are limited along the river,</br> but have a great impact on it's health</b>"},
            {"bubble_title":"Cyanobacteria", "icon_name":"#cyanobacteriaIcon", "bubblePointX":1600, "bubblePointY":765, "bubbleRadius":100, "bubble_text":"<b>Cyanobacteria (Blue Green Algae)</b></br>create floating green blooms on the river's surface.</b>"},
            {"bubble_title":"Zooplankton", "icon_name":"#zooplanktonIcon", "bubblePointX":1200, "bubblePointY":765, "bubbleRadius":100, "bubble_text":"<b>Zooplankton eat cyanobacteria.</b></br>Their ideal natural habitat is wetland marshes.</b>"},
            {"bubble_title":"Small Fish", "icon_name":"#smallFishIcon", "bubblePointX":800, "bubblePointY":765, "bubbleRadius":100, "bubble_text":"<b>Small fish eat Zooplankton</br></b>"},
            {"bubble_title":"Big Fish", "icon_name":"#bigFishIcon",  "bubblePointX":400, "bubblePointY":765, "bubbleRadius":100, "bubble_text":"<b>Big Fish eat small fish,</b></br> and need high oxygen levels to survive.</b>"},
        ]

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

        ////////// LOAD IN SVG ICONS //////////////////

        //empty icon containers
        vis.svg.append('g')
            .attr('id', 'bigFishIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'cyanobacteriaIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'ecoliIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'phosphorusIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'rainfallIcon')
            .style('opacity', 0.0)
        // vis.svg.append('g')
        //     .attr('id', 'runoffIcon')
        //     .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'smallFishIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'temperatureIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'wetlandsIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'zooplanktonIcon')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'bigFishIconEatsArrow')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'smallFishIconEatsArrow')
            .style('opacity', 0.0)
        vis.svg.append('g')
            .attr('id', 'zooplanktonIconEatsArrow')
            .style('opacity', 0.0)

        let svg_promises = [
            d3.xml("data/icon_bigfish.svg"),
            d3.xml('data/icon_cyanobacteria.svg'),
            d3.xml("data/icon_ecoli.svg"),
            d3.xml('data/icon_phosphorus.svg'),
            d3.xml("data/icon_rainfall.svg"),
            d3.xml('data/icon_runoff.svg'),
            d3.xml("data/icon_smallfish.svg"),
            d3.xml('data/icon_temperature.svg'),
            d3.xml("data/icon_wetlands.svg"),
            d3.xml('data/icon_zooplankton.svg'),
            d3.xml('data/eats_arrow.svg'),
            d3.xml('data/eats_arrow.svg'),
            d3.xml('data/eats_arrow.svg'),
            d3.xml('data/pointer_arrow.svg')
        ];
        Promise.all(svg_promises)
            .then(([bigFishVar, cyanoVar, ecoliVar, phVar, rainVar, runoffVar, smallFishVar, tempVar, habitatVar, zooplankVar, eatsArrowVar1, eatsArrowVar2, eatsArrowVar3, pointerArrowVar]) => {
                d3.select("#bigFishIcon").node().append(bigFishVar.documentElement);
                d3.select("#cyanobacteriaIcon").node().append(cyanoVar.documentElement);
                d3.select("#ecoliIcon").node().append(ecoliVar.documentElement);
                d3.select("#phosphorusIcon").node().append(phVar.documentElement);
                d3.select("#rainfallIcon").node().append(rainVar.documentElement);
                // d3.select("#runoffIcon").node().append(runoffVar.documentElement);
                d3.select("#smallFishIcon").node().append(smallFishVar.documentElement);
                d3.select("#temperatureIcon").node().append(tempVar.documentElement);
                d3.select("#wetlandsIcon").node().append(habitatVar.documentElement);
                d3.select("#zooplanktonIcon").node().append(zooplankVar.documentElement);
                d3.select("#bigFishIconEatsArrow").node().append(eatsArrowVar1.documentElement);
                d3.select("#smallFishIconEatsArrow").node().append(eatsArrowVar2.documentElement);
                d3.select("#zooplanktonIconEatsArrow").node().append(eatsArrowVar3.documentElement);
            });

        // moving icons to their locations
        vis.svg.select('#ecoliIcon')
            .attr("transform", "translate(600,370), rotate(0), scale(0.30,0.30)");

        vis.svg.select('#phosphorusIcon')
            .attr("transform", "translate(1400,370), rotate(0), scale(0.45,0.45)");

        vis.svg.select('#temperatureIcon')
            .attr("transform", "translate(1560,30), rotate(0), scale(0.20,0.20)");

        vis.svg.select('#rainfallIcon')
            .attr("transform", "translate(270,30), rotate(0), scale(-0.45,0.45)");

        vis.svg.select('#wetlandsIcon')
            .attr("transform", "translate(125,420), rotate(0), scale(0.30,0.30)");

        vis.svg.select('#bigFishIcon')
            .attr("transform", "translate(310,700), rotate(0), scale(0.30,0.45)");

        vis.svg.select('#bigFishIconEatsArrow')
            .attr("transform", "translate(520,730), rotate(0), scale(2,2)");

        vis.svg.select('#smallFishIcon')
            .attr("transform", "translate(750,730), rotate(0), scale(0.50,0.50)");

        vis.svg.select('#smallFishIconEatsArrow')
            .attr("transform", "translate(920,730), rotate(0), scale(2,2)");

        vis.svg.select('#zooplanktonIcon')
            .attr("transform", "translate(1270,685), rotate(70), scale(0.15,0.15)");

        vis.svg.select('#zooplanktonIconEatsArrow')
            .attr("transform", "translate(1320,730), rotate(0), scale(2,2)");

        vis.svg.select('#cyanobacteriaIcon')
            .attr("transform", "translate(1550,705), rotate(0), scale(0.22,0.22)");

        ////////// ADD DIAGRAM BUBBLES //////////////////

        vis.hiddenBubs = vis.svg.selectAll(".hiddenBubbles")
            .data(vis.interactiveDiagramData)

        //Hidden Circle Zones
        vis.hiddenBubs.enter()
            .append('circle')
            .attr("class", "hiddenBubbles")
            .attr('fill', 'orange')//starting color
            .attr('opacity', 0.40)
            .attr("r", d=> d.bubbleRadius)
            .attr("cx",d => d.bubblePointX)
            .attr("cy",d => d.bubblePointY)
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', ' 10px')
                    .attr('stroke', 'black')
                    .attr('stroke-dasharray', '35')
                    .attr('opacity', 0.001)
                    .attr('stroke-opacity', 1)

                vis.svg.select(d.icon_name) //reveal icon
                    .transition()
                    .duration(500)
                    .style("opacity", 1);

                console.log(d.icon_name + 'EatsArrow')

                vis.svg.select(d.icon_name + 'EatsArrow') //show eating arrows
                    .transition()
                    .duration(700)
                    .style("opacity", 0.80);

                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                                     <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                         <h4 style="color:white"><b>${d.bubble_title}</b></h4>
                                         <h6 style="color:white">${d.bubble_text}</h6>                                
                                     </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('fill', 'white')
                    .attr('opacity', 0.10)
                // .style("fill", function(d) {return vis.colorStepped[ d[1].colorScaleGroup ];})

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            });

    }

    interactiveDiagramExit() {
        let vis = this;
        document.getElementById("animatedWavesContainer").style.opacity = "0";
        document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
        document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
    }

}