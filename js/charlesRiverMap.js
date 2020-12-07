class charlesRiverMap {

    constructor(_parentElement, _data, _eventHandler) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = []
        this.eventHandler = _eventHandler;

        this.displayData = this.data;

        this.initVis();
    }

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


        // console.log("Interactive Map Data:", vis.displayData);

        ////////// CREATE TOOLTIP //////////////////
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'simToolTip')


        vis.svg.append('g') //movement of entire map group
            .attr("id", "interactiveMapGroup")
            .attr("transform", 'translate (140,0)')
            .attr("opacity", "1")


        vis.svg.selectAll("#interactiveMapGroup")
            .append('path')
            .attr("id", "interactiveMapWetland")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', '10px')
                    .attr('stroke', 'darkgreen')
                    .style('fill', "#b9eab9")
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont" style="color:white"><img src="img/icon_wetlands.png" style="height:8vh;"><b> &nbsp&nbspWetlands</b> - Tidal Marsh (c.1770)</h5>
                             </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('fill', vis.displayData[2].color)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })
            .style('fill', vis.displayData[2].color)
            .attr('opacity', vis.displayData[2].opacity)
            .attr("d", vis.displayData[2].path)
            .attr("transform", 'translate('+(vis.displayData[2].positionX)+','+(vis.displayData[2].positionY)+') rotate('+(vis.displayData[2].rotation)+') scale('+(vis.displayData[2].scaleX)+','+(vis.displayData[2].scaleY)+')')


        vis.svg.selectAll("#interactiveMapGroup")
            .append('path')
            .attr("id", "interactiveMapTidalWaterSandBankHighTide")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', '10px')
                    .attr('stroke', '#8d7f71')
                    .style('fill', "blanchedalmond")
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont" style="color:white"><b>Tidal Flats</b> - Sandbanks at Low Tide (c.1770)</h5>
                             </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('fill', vis.displayData[3].color)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })
            .style('fill', vis.displayData[3].color)
            .attr('opacity', vis.displayData[3].opacity)
            .attr("d", vis.displayData[3].path)
            .attr("transform", 'translate('+(vis.displayData[3].positionX)+','+(vis.displayData[3].positionY)+') rotate('+(vis.displayData[3].rotation)+') scale('+(vis.displayData[3].scaleX)+','+(vis.displayData[3].scaleY)+')')

        vis.svg.selectAll("#interactiveMapGroup")
            .append('path')
            .attr("id", "interactiveMapTidalWaterLowTide")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', '10px')
                    .attr('stroke', 'blue')
                    .style('fill', "#ffffff")
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont" style="color:white"><b>Water of Tidal Estuary</b> - The Original Charles River (c.1770)</h5>
                             </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('fill', vis.displayData[4].color)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })
            .style('fill', vis.displayData[4].color)
            .attr('opacity', vis.displayData[4].opacity)
            .attr("d", vis.displayData[4].path)
            .attr("transform", 'translate('+(vis.displayData[4].positionX)+','+(vis.displayData[4].positionY)+') rotate('+(vis.displayData[4].rotation)+') scale('+(vis.displayData[4].scaleX)+','+(vis.displayData[4].scaleY)+')')

        vis.svg.selectAll("#interactiveMapGroup")
            .append('path')
            .attr("id", "interactiveMapRiverOutline")
            .on('mouseover', function(event, d){  /// TOOLTIP FUNCTIONALITY
                d3.select(this)
                    .attr('stroke-width', '15px')
                    .attr('stroke', 'black')
                    .attr('stroke-dasharray', '35')
                    .style('fill', 'skyblue')
                    .style('opacity', "1")
                vis.tooltip
                    .style("opacity", 0.89)
                    .style("left", event.pageX + 20 + "px"  )
                    .style("top", event.pageY + "px")
                    .html(`
                             <div style="border: thin solid #c6c6c6; width: 110%; border-radius: 5px; background: #000000; padding: 10px; text-align: left">
                                 <h5 class="toolTipTitleFont" style="color:white"><b>Present Day Charles River</b> (c.2020)</h5>
                             </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style('opacity', vis.displayData[5].opacity)
                    .style('fill', vis.displayData[5].color)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })
            .style('fill', vis.displayData[5].color)
            .attr('opacity', vis.displayData[5].opacity)
            .attr("d", vis.displayData[5].path)
            .attr("transform", 'translate('+(vis.displayData[5].positionX)+','+(vis.displayData[5].positionY)+') rotate('+(vis.displayData[5].rotation)+') scale('+(vis.displayData[5].scaleX)+','+(vis.displayData[5].scaleY)+')')

    }


    updateSimulation() {
        let vis = this;


    }

    slideEnter() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "-5vh")
            .style("left", "90vw")
    }

    //storing a function here for the next page, since it does not have a JS call localized within it
    slideEnterFloatingWetlandDescription() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "4vh")
            .style("left", "2vw")

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(-1)")
    }


}