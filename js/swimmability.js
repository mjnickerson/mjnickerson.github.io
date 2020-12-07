class Swimmability {
    constructor(parentElement, days) {
        this.parentElement = parentElement;
        this.data = days;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
        vis.cellPadding = 6;
        vis.pillarOffset = { x: 850, y: 160, width: 140, gap: 60 };

        vis.transitionDuration = 1500;

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("transform", `translate (${vis.margin.left}, ${vis.margin.top})`);

        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        vis.svg.selectAll("rect.month")
            .data(months)
            .enter()
            .append("rect")
            .attr("class", "month")
            .attr("width", 154)
            .attr("height", 110)
            .attr("y", (d, i) => 40 + Math.floor(i / 4) * 174)
            .attr("x", (d, i) => (i % 4) * 174);

        vis.svg.selectAll("text.month")
            .data(months)
            .enter()
            .append("text")
            .attr("class", "label-month")
            .text(d => d)
            .attr("y", (_, i) => 20 + Math.floor(i / 4) * 174)
            .attr("x", (_, i) => (i % 4) * 174);

        vis.tip = d3.tip()
            .attr("class", "swimmability-tooltip")
            .offset([-1, 40])
            .html(d => "<h4 style='color: white;'>" + d.date + "</h4><br><strong>E-coli:</strong> " + d.ecoli);


        vis.svg.call(vis.tip);

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData = vis.data;

        let counts = {
            "swimmable": 0,
            "not-swimmable": 0
        };

        let summerMonths = [6, 7, 8];
        vis.displayData.forEach(day => {
            day.duringSummer = summerMonths.includes(day.month);
            if (day.duringSummer) {
                day.categoryIndex = counts[day.category]++;
            }
        });

        console.debug("Swimmability data:", vis.displayData);

        vis.updateVis();
    }

    updateVis(doTransition = false) {
        let vis = this;

        vis.days = vis.svg.selectAll("rect.day").data(vis.displayData);
        vis.days
            .enter()
            .append("rect")
            .attr("class", d => "day " + d.category)
            .merge(vis.days)
            .on("mouseover", function(_, d) { vis.tip.show(d, this); })
            .on("mouseout", vis.tip.hide)
            .transition().duration(vis.transitionDuration)
            .attr("height", d => vis.calculateHeight(d, doTransition))
            .attr("width", d => vis.calculateWidth(d, doTransition))
            .attr("y", d => 40 + vis.calculateY(d, vis.cellPadding, vis.pillarOffset, doTransition))
            .attr("x", d => vis.calculateX(d, vis.cellPadding, vis.pillarOffset, doTransition));

        if (doTransition) {
            vis.svg.append("text")
                .text("Can Swim")
                .transition().duration(vis.transitionDuration)
                .attr("x", vis.pillarOffset.x + (vis.pillarOffset.width / 2) + 20)
                .attr("y", vis.pillarOffset.y + 20)
                .attr("class", "swimmable-text")
                .attr("text-anchor", "middle");

            vis.svg.append("text")
                .text("Can't Swim")
                .transition().duration(vis.transitionDuration)
                .attr("x", vis.pillarOffset.x + vis.pillarOffset.width + vis.pillarOffset.gap + (vis.pillarOffset.width / 2) + 18)
                .attr("y", vis.pillarOffset.y + 20)
                .attr("class", "swimmable-text")
                .attr("text-anchor", "middle");

            $("#swimmability-blurb-01").fadeOut(vis.transitionDuration, () => $("#swimmability-blurb-02").fadeIn(vis.transitionDuration));

            $("#swimmable-legend").fadeOut(vis.transitionDuration);
        } else if ($("#swimmability-blurb-02").is(":visible")) {
            vis.svg.selectAll(".swimmable-text").remove();
            $("#swimmability-blurb-02").fadeOut(vis.transitionDuration, () => {
                $("#swimmability-blurb-01").fadeIn(vis.transitionDuration);
                $("#swimmable-legend").fadeIn(vis.transitionDuration);
            });
        }
    }

    calculateY(d, padding, pillarOffset, doTransition) {
        if (doTransition && d.duringSummer) {
            return pillarOffset.y + (Math.floor(d.categoryIndex / 9) * 20) + padding;
        }

        return (padding + Math.floor((d.month - 1) / 4) * 174) + (Math.floor((d.day - 1) / 7) * 20) + padding;
    }

    calculateX(d, padding, pillarOffset, doTransition) {
        if (doTransition && d.duringSummer && d.category === "swimmable") {
            return pillarOffset.x + ((d.categoryIndex % 9) * 20) + padding;
        }

        if (doTransition && d.duringSummer && d.category === "not-swimmable") {
            return pillarOffset.x + pillarOffset.width + pillarOffset.gap + ((d.categoryIndex % 9) * 20) + padding;
        }

        return (padding + ((d.month - 1) % 4) * 174) + (((d.day - 1) % 7) * 20) + padding;
    }

    calculateHeight(d, doTransition) {
        if (doTransition && d.duringSummer) {
            return 10;
        }
        return 10;
    }

    calculateWidth(d, doTransition) {
        if (doTransition && d.duringSummer) {
            return 10;
        }
        return 10;
    }

    slideEnter() {
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(4000)
            .style("display", "block")
            .style("top", "45vh")
            .style("left", "82vw")

        d3.select("#narraratorBalloonImage")
            .transition()
            .duration(2000)
            .style("transform", "scaleX(1)")

    }

}