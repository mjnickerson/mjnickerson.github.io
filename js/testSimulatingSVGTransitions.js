class simulationSVGTransitions {

    constructor(_parentElement, _data, _eventHandler) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = []
        this.eventHandler = _eventHandler;

        this.displayData = this.data;

        this.initVis();

        this.riverOutlineSVG = d3.xml("data/riveroutline.svg");
        //testing out SVG elements!
        this.mapleSvg = d3.xml('https://s3.amazonaws.com/files.zevross.org/blog/d3_external_svgs/load_svg/leaves/maple_illustration.svg');
        this.oakSvg = d3.xml('https://s3.amazonaws.com/files.zevross.org/blog/d3_external_svgs/load_svg/leaves/oak_illustration.svg')
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 25, right: 30, bottom: 40, left: 100};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //Create river shape initial layout
        vis.svg
            .append('path')
            .attr("id", "riverShape")
            .attr('fill', vis.displayData[0].color)
            .attr("d", vis.displayData[0].path)
            .attr("transform", 'translate ('+(vis.displayData[0].positionX)+','+(vis.displayData[0].positionY)+')');

        //Create walls shape initial layout
        vis.svg
            .append('path')
            .attr("id", "wallsShape")
            .attr('fill', "darkgrey")
            .attr('opacity', '0.0')
            .attr("d", vis.displayData[1].path)
            .attr("transform", 'translate ('+(vis.displayData[1].positionX)+','+(vis.displayData[1].positionY)+')');

    }


    transitionSimulationElements() {
        let vis = this;

        // console.log(vis.displayData[currentCardNumber].color);
        // console.log(vis.displayData[currentCardNumber].path);
        // console.log((vis.displayData[currentCardNumber].positionX),(vis.displayData[currentCardNumber].positionY));

        //transition river shape to new pattern
        vis.svg.select("#riverShape")
            .transition()
            .duration(2000)
            .style('fill', vis.displayData[currentCardNumber].color)
            .attr("d", vis.displayData[currentCardNumber].path)
            .attr("transform", 'translate ('+(vis.displayData[currentCardNumber].positionX)+','+(vis.displayData[currentCardNumber].positionY)+')');

        if (currentCardNumber > 1) {
            //transition walls shape to new pattern
            vis.svg.select("#wallsShape")
                .transition()
                .duration(2000)
                .attr('opacity', '1.0')
                .attr("d", vis.displayData[currentCardNumber-2].path)
                .attr("transform", 'translate (' + (vis.displayData[currentCardNumber-2].positionX) + ',' + (vis.displayData[currentCardNumber-2].positionY) + ')');
        }

    }

}
