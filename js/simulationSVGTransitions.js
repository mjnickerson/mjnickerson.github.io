class simulationSVGTransitions {

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

        console.log("Initializing SVG Transitions", vis.displayData)


        //Create river shape initial layout
        vis.svg
            .append('path')
            .attr("id", "riverShape")
            .attr('fill', 'blue')//starting color
            .attr("opacity", vis.displayData[0].opacity)
            .attr("d", vis.displayData[0].path)
            .attr("transform", 'translate('+(vis.displayData[0].positionX)+','+(vis.displayData[0].positionY)+') rotate('+(vis.displayData[0].rotation)+') scale('+(vis.displayData[0].scaleX)+','+(vis.displayData[0].scaleY)+')')


        document.getElementById("sim-container").style.height= "100vh";

    }


    //This function was depricated, it is controlled slide by slide now
    // makeRiverLightBlue() {
    //     let vis = this;
    //
    //     vis.svg.select("#riverShape")
    //         .transition()
    //         .duration(4000)
    //         .style('fill', 'lightblue')
    //
    //
    //     setTimeout(function () {
    //         //display river animation svg
    //         document.getElementById("riverShape").style.opacity = "0";
    //         document.getElementById("animatedWavesContainer").style.opacity = "100";
    //     }, 3600);
    //
    // }


    hideBalloonFish() {
        //remove the narrarator from the screen
        let vis = this;
        //select narrator box
        d3.select("#narraratorBalloonBox")
            .transition()
            .duration(2500)
            .style("display", "block")
            .style("top", "-60vh")
            .style("left", "50vw")
    }

    hideFish() {
        d3.select("#narraratorFishBox") //animate fish off the screen to the right
            .transition()
            .duration(3000)
            .style("display", "block")
            .style("top", "80vh")
            .style("left", "120vw")
    }

    hideTitleCards(){
        //remove stray title boxes from the screen
        let vis = this;
        //select narrator box
        d3.select("#detailTextBoxTitleCardOne")
            .style("display", "none")

        d3.select("#detailTextBoxTitleCardTwo")
            .style("display", "none")
    }

    card2Transition(direction) {
        let vis = this;

        document.getElementById("sim-container").style.height= "100vh";
        vis.hideBalloonFish();
        vis.hideTitleCards();

        if (direction === 'down') {
            console.log("Arrived on Slide 2! From Above")

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "100";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            // //transition river shape to new pattern
            vis.svg.select("#riverShape")
                .transition()
                .duration(2500)
                .attr("transform", 'translate(590,90) rotate(0) scale(0.4,-0.4)')
                .style('fill', '#B49C97')
        }


        if (direction === 'up') {
            console.log("Arrived on Slide 1! From Below")

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "100";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            document.getElementById("sim-container").style.height= "100vh";

            // //transition river shape to new pattern
            vis.svg.select("#riverShape")
                .transition()
                .duration(2500)
                .style('fill', 'blue')
                .attr("d", vis.displayData[0].path)
                .attr("transform", 'translate('+(vis.displayData[0].positionX)+','+(vis.displayData[0].positionY)+') rotate('+(vis.displayData[0].rotation)+') scale('+(vis.displayData[0].scaleX)+','+(vis.displayData[0].scaleY)+')')
        }

    }


    card3Transition(direction) {
        let vis = this;

        document.getElementById("sim-container").style.height= "100vh";
        vis.hideBalloonFish();
        vis.hideTitleCards();

        if (direction === 'down') {
            console.log("Arrived on Slide 3! From Above")

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "100";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("slide0background").style.opacity = "0";


            // //transition river shape to new pattern
            vis.svg.select("#riverShape")
                .transition()
                .duration(2500)
                .attr("transform", 'translate(1390,60) rotate(25) scale(0.8,-0.8)')
                .style('fill', 'darkgreen')

            document.getElementById("slide0background").style.opacity = "0";
       }


        if (direction === 'up') {
            console.log("Arrived on Slide 2! From Below")

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "100";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            // //transition river shape to new pattern
            vis.svg.select("#riverShape")
                .transition()
                .duration(2500)
                .attr("transform", 'translate(590,90) rotate(0) scale(0.4,-0.4)')
                .style('fill', '#B49C97')
        }

    }


    card4Transition(direction) {
        let vis = this;

        // transition ONTO horizontal river slides
        vis.hideBalloonFish();
        vis.hideTitleCards();

        if (direction === 'down') {
            console.log("Arrived on Slide 4! From Above")

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "100";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("slide0").style.opacity = "1";

            vis.svg.select("#riverShape")
                .transition()
                .duration(4200)
                .attr("d", vis.displayData[0].path)
                .attr("transform", 'translate(5100, -2725) rotate(38) scale(10.8,-10.8)')
                .style('fill', 'lightblue')

            setTimeout(function () {
                //display the river background underneath and its functionality
                document.getElementById("sim-container").style.height = "100vh";
                document.getElementById("slide0background").style.opacity = "1";
                document.getElementById("swimQuestionaireTitle").style.opacity = "1";
                document.getElementById("swimQuestionaireInteractiveContentBox").style.opacity = "1";
                // document.getElementById("slide0").backgroundImage = "url('../img/title-card-back-drop.jpg')";

                vis.svg.select("#riverShape")
                    .style("opacity", "0")

                afterhookTitleCard.enterHookCard();

            }, 3800); //3800

            setTimeout(function () {
                // Resize the part of screen the svg dom has command over
                document.getElementById("sim-container").style.height = "20vh";

                vis.svg.select("#riverShape")
                    .transition()
                    .duration(1)
                    .attr("d", vis.displayData[1].path)
                    .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                    .attr("opacity","0")

                document.getElementById("slide0background").style.opacity = "1";

            }, 3900);


        }

        if (direction === 'up') {
            console.log("Arrived on Slide 3! From Below")
            // //transition river shape to new pattern

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "100";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            document.getElementById("sim-container").style.height = "100vh";

            document.getElementById("slide0background").style.opacity = "0";


            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .style('fill', 'brown')

            vis.svg.select("#riverShape")
                .attr("d", vis.displayData[0].path)
                .attr("transform", 'translate(3200, -250) rotate(38) scale(3.8,-3.8)')


            vis.svg.select("#riverShape")
                .transition()
                .duration(4000)
                .attr("transform", 'translate(1390,60) rotate(25) scale(0.8,-0.8)')
                .style('fill', 'darkgreen')
        }

        if (direction === 'right') {
            console.log("Arrived on Slide 4! From The Right")

            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .style('fill', 'brown')
        }

    }


    slide1Transition(direction) {
        let vis = this;

        document.getElementById("sim-container").style.height = "0";
        vis.hideBalloonFish();
        vis.hideFish();
        vis.hideTitleCards();

        if (direction === 'right') {
            console.log("Arrived on slide 1 From the Left")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "100";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")

            //transition fish nar
            ecoliWaterQualityChart.slideEnter();

        }

        if (direction === 'left') {
            console.log("Arrived on slide 1 From the Right")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "100";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            //transition fish nar
            ecoliWaterQualityChart.slideEnter();

            console.log("--------")
        }

    }



    slide2Transition(direction) {
        let vis = this;

        document.getElementById("sim-container").style.height = "20vh";
        vis.hideBalloonFish();
        vis.hideFish();
        vis.hideTitleCards();

        if (direction === 'right') {
            console.log("Arrived on slide 2 From the Left")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "100";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";



            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")

            //update nar fish
            cso.slideEnter();

        }

        if (direction === 'left') {
            console.log("Arrived on slide 2 From the Right")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "100";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")

            //update nar fish
            cso.slideEnter();
        }

    }

    standardSlideTransition(direction) {
        let vis = this;
        vis.hideTitleCards();
        vis.hideBalloonFish();
        vis.hideFish();


        document.getElementById("sim-container").style.height = "0vh";

        if (direction === 'right') {
            console.log("Arrived on a typical slide From the Left")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")
        }

        if (direction === 'left') {
            console.log("Arrived on a typical slide From the Right")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")
        }

    }


    afterHookTransitionEnter(direction) {
        let vis = this;

        vis.hideBalloonFish();
        vis.hideFish();

        // called AFTER the slide loads - entering
        if (direction === 'right') {
            console.log("Arrived on title card Two From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            afterhookTitleCard.transitionBackgroundEnter();
        }

        if (direction === 'left') {
            console.log("Arrived on title Card Two From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            afterhookTitleCard.transitionBackgroundEnter();
        }

    }

    afterHookTransitionExit(direction) {
        let vis = this;

        vis.hideFish();

        //called BEFORE the slide exits - exiting!
        if (direction === 'right') {
            console.log("Exiting on title card Two From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "100vh";

            afterhookTitleCard.transitionBackgroundExit();
        }

        if (direction === 'left') {
            console.log("Exiting on title Card Two From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "20vh";

            afterhookTitleCard.transitionBackgroundExit();
        }

    }


    titleCardOneTransitionEnter(direction) {
        let vis = this;

        vis.hideBalloonFish();

        // called AFTER the slide loads - entering
        if (direction === 'right') {
            console.log("Arrived on title card One From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = ".01";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partOneTitleCard.transitionBackgroundEnter();
        }

        if (direction === 'left') {
            console.log("Arrived on title Card One From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = ".01";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partOneTitleCard.transitionBackgroundEnter();
        }

    }

    titleCardOneTransitionExit(direction) {
        let vis = this;

        vis.hideBalloonFish();

        //called BEFORE the slide exits - exiting!
        if (direction === 'right') {
            console.log("Exiting title card One From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partOneTitleCard.transitionBackgroundExit();
        }

        if (direction === 'left') {
            console.log("Exiting title Card One From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partOneTitleCard.transitionBackgroundExit();
        }

    }


    titleCardTwoTransitionEnter(direction) {
        let vis = this;

        // called AFTER the slide loads - entering
        if (direction === 'right') {
            console.log("Arrived on title card Two From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partTwoTitleCard.transitionBackgroundEnter();
        }

        if (direction === 'left') {
            console.log("Arrived on title Card Two From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partTwoTitleCard.transitionBackgroundEnter();
        }

    }

    titleCardTwoTransitionExit(direction) {
        let vis = this;

        //called BEFORE the slide exits - exiting!
        if (direction === 'right') {
            console.log("Exiting on title card Two From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partTwoTitleCard.transitionBackgroundExit();
        }

        if (direction === 'left') {
            console.log("Exiting on title Card Two From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            partTwoTitleCard.transitionBackgroundExit();
        }

    }



    interactiveDiagramTransition(direction) {
        let vis = this;
        vis.hideTitleCards();

        if (direction === 'right') {
            console.log("Arrived on interactive diagram From the Left")

            document.getElementById("sim-container").style.height = "100vh";
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            setTimeout(function () {
                document.getElementById("sim-container").style.height = "0vh";
            }, 1000);

        }

        if (direction === 'left') {
            console.log("Arrived on interactive diagram From the Right")
            document.getElementById("sim-container").style.height = "100vh";
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            setTimeout(function () {
                document.getElementById("sim-container").style.height = "0vh";
            }, 1000);
        }

    }

    interactiveSimulationTransition(direction) {
        let vis = this;
        vis.hideTitleCards();

        if (direction === 'right') {
            console.log("Arrived on interactive diagram From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            document.getElementById("sim-container").style.height = "0vh";
        }

        if (direction === 'left') {
            console.log("Arrived on interactive diagram From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            document.getElementById("sim-container").style.height = "0vh";
        }

    }


    slide5and6Transition(direction) {
        let vis = this;
        vis.hideTitleCards();

        document.getElementById("sim-container").style.height = "10vh";

        if (direction === 'right') {
            console.log("Arrived on slide 5 or 6 From the Left")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "100";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")
        }

        if (direction === 'left') {
            console.log("Arrived on slide 5 or 6 From the Right")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "100";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")
        }

    }



    slide7Transition(direction) {
        let vis = this;
        vis.hideTitleCards();

        if (direction === 'left') {
            console.log("Arrived on Slide 7 From The Right")

            //force element opacity for river animation

            document.getElementById("charlesRiverInteractiveMapContainer").style.opacity = "0";
            document.getElementById("sim-container").style.height = "100vh";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0.50";

            vis.svg.select("#riverShape")
                //display the river shape
                .transition()
                .duration(100)
                .style('opacity', '1')

            setTimeout(function () {
                // transition the river shape
                vis.svg.select("#riverShape")
                    .attr("class", "parallax")
                    .transition()
                    .duration(4200)
                    .attr("d", vis.displayData[0].path)
                    .attr("transform", 'translate(3200, -250) rotate(38) scale(3.8,-3.8)')
                    .style('fill', 'lightblue')
                    .transition(2900)
                    .style("opacity","0")
            }, 150);

            setTimeout(function () {
                //code executed after 4 seconds
                // Resize the part of screen the svg dom has command over
                document.getElementById("sim-container").style.height = "20vh";

                vis.svg.select("#riverShape")
                    .transition()
                    .duration(1)
                    .attr("d", vis.displayData[1].path)
                    .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                    .attr("opacity","1")

            }, 2700);

            setTimeout(function () {
                document.getElementById("riverShape").style.opacity = "0";
                document.getElementById("animatedWavesContainer").style.opacity = "100";
            }, 2800);

        }

        if (direction === 'right') {
            console.log("Arrived on Slide 7 From The Left")

            //force element opacity for river animation
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0.50";

            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

        }


    }

    slide8Transition(direction) {
        let vis = this;
        vis.hideTitleCards();

        //transition to
        //INTERACTIVE RIVER MAP CARD

        console.log("Arrived on Slide 8!")
            // //transition river shape to new pattern

        document.getElementById("sim-container").style.height = "100vh";

        document.getElementById("riverShape").style.opacity = "100";
        document.getElementById("animatedWavesContainer").style.opacity = "0";
        document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
        document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

        vis.svg.select("#riverShape")
            .transition()
            .duration(1000)
            .style('fill', 'lightblue')

        vis.svg.select("#riverShape")
            .attr("d", vis.displayData[0].path)
            .attr("transform", 'translate(3200, -250) rotate(38) scale(3.8,-3.8)')

        vis.svg.select("#riverShape")
            .transition()
            .duration(3500)
            .attr("transform", 'translate(200,275) rotate(2) scale(0.22,-0.22)')
            .style('fill', 'blue')
            .transition()
            .duration(1000)
            .style('opacity', '0')

        setTimeout(function () {
            // Fade in the background map and fade out foreground river
            document.getElementById("charlesRiverInteractiveMapContainer").style.opacity = "100";
        }, 4000);

        setTimeout(function () {
            // shrink the river foreground container
            document.getElementById("sim-container").style.height = "0vh";
        }, 4500);

    }


    slide9Transition(direction) {
        let vis = this;
        vis.hideTitleCards();

        if (direction === 'left') {
            console.log("Arrived on Slide 9 From The Right")

            document.getElementById("fullSimulationVisibilityWrapper").style.opacity = "0";
            document.getElementById("sim-container").style.height = "20vh";
            document.getElementById("charlesRiverInteractiveMapContainer").style.opacity = "0";


            // document.getElementById("sim-container").style.height = "20vh";

            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style("opacity","0.95")
                .style('fill', 'lightblue')


            vis.svg.select("#riverWaterFill").remove()

        }

        if (direction === 'right') {
            console.log("Arrived on Slide 9 From The Left")
            document.getElementById("sim-container").style.height = "100vh";
            document.getElementById("charlesRiverInteractiveMapContainer").style.opacity = "0";

            vis.svg.select("#riverShape")
                //display the river shape
                .transition()
                .duration(100)
                .style('opacity', '1')

            setTimeout(function () {
                // transition the river shape
                vis.svg.select("#riverShape")
                    .attr("class", "parallax")
                    .transition()
                    .duration(4200)
                    .attr("d", vis.displayData[0].path)
                    .attr("transform", 'translate(3200, -250) rotate(38) scale(3.8,-3.8)')
                    .style('fill', 'lightblue')
                    .transition(2900)
                    .style("opacity","0")
            }, 150);

            setTimeout(function () {
                //code executed after 3.9 seconds
                // Resize the part of screen the svg dom has command over
                document.getElementById("sim-container").style.height = "20vh";

                // vis.svg.select("#riverShape")
                //     .transition()
                //     .duration(1)
                //     .attr("d", vis.displayData[1].path)
                //     .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                //     .style('fill', 'lightblue')
                //     .style("opacity","1.0")

                //force element opacity for river animation
                document.getElementById("riverShape").style.opacity = "0";
                document.getElementById("animatedWavesContainer").style.opacity = "100";
                document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
                document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

                document.getElementById("fullSimulationVisibilityWrapper").style.opacity = "0";

            }, 2900);
        }

    }


    slide10Transition(direction) {
        let vis = this;

        vis.hideTitleCards();

        //MAIN SIMULATION

        //force element opacity for river animation
        document.getElementById("animatedWavesContainer").style.opacity = "0";

        document.getElementById("sim-container").style.height = "100vh";

        if (direction === 'left') {

            console.log("Arrived on Slide 12 From The Right")

            document.getElementById("sim-container").style.height = "20vh";

            vis.svg.select("#riverShape")
                .transition()
                .duration(0)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-450) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')
                .style("opacity","0")

            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style("opacity","0")
        }

        if (direction === 'right') {
            console.log("Arrived on Slide 12 From The Left")

            //make simulation invisible
            document.getElementById("fullSimulationVisibilityWrapper").style.opacity = 0;

            document.getElementById("animatedWavesContainer").style.opacity = "0";

            //add water fill
            vis.svg.append("rect")
                .attr("id", "riverWaterFill")
                .attr("x", "0")
                .attr("y", "1050")
                .attr("height", 300)
                .attr("width", 2000)
                .style('fill', 'lightblue');

            vis.svg.append("path")
                .attr("id", "riverCrestSim")
                .transition()
                .duration(1)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(100, 700) rotate(0) scale(12,4)')
                .style("opacity", "1")
                .style('fill', 'blue');

            vis.svg.append("path")
                .attr("id", "riverShapeSim")
                .transition()
                .duration(1)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(100, 710) rotate(0) scale(12,4)')
                .style("opacity", "1")
                .style('fill', 'lightblue');

            vis.svg.select("#riverShape")
                .transition()
                .duration(1)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(100, 710) rotate(0) scale(12,4)')
                .style("opacity", "1")
                .style('fill', 'lightblue');

            setTimeout(function () {
                //move riverbank height
                vis.svg.select("#riverShape")
                    .transition()
                    .transition()
                    .duration(4000)
                    .attr("transform", 'translate(100, 450) rotate(0) scale(12,4)')
                    .style('fill', 'lightblue')
                    .style('opacity', "1")

                vis.svg.select("#riverCrestSim")
                    .transition()
                    .transition()
                    .duration(4000)
                    .attr("transform", 'translate(100, 440) rotate(0) scale(12,4)')
                    .style('fill', 'blue')
                    .style('opacity', "1")

                vis.svg.select("#riverShapeSim")
                    .transition()
                    .transition()
                    .duration(4000)
                    .attr("transform", 'translate(100, 450) rotate(0) scale(12,4)')
                    .style('fill', 'lightblue')
                    .style('opacity', "1")

                vis.svg.select("#riverWaterFill")
                    .transition()
                    .duration(4000)
                    .attr("transform", 'translate(0,-350)') //1050
                    .style('fill', 'lightblue')
                    .style('opacity', "1")
            }, 10);

            setTimeout(function () {
                //make simulation appear
                document.getElementById("fullSimulationVisibilityWrapper").style.opacity = 100;

                //fade riverbank out
                vis.svg.select("#riverShape")
                    .transition()
                    .duration(500)
                    .style('opacity', "0")
                vis.svg.select("#riverCrestSim")
                    .transition()
                    .duration(500)
                    .style('opacity', "0")
                vis.svg.select("#riverShapeSim")
                    .transition()
                    .duration(500)
                    .style('opacity', "0")
                vis.svg.select("#riverWaterFill")
                    .transition()
                    .duration(500)
                    .style('opacity', "0")
                document.getElementById("sim-container").style.height = "20vh";
            }, 3000);
        }
    }


    slide11Transition(direction) {
        let vis = this;

        vis.hideTitleCards();

        document.getElementById("sim-container").style.height = "0vh";

        if (direction === 'right') {
            console.log("Arrived on Slide 11 From the Left")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")
        }
    }

    card5Transition(direction) {
        let vis = this;

        vis.hideTitleCards();

        if (direction === 'up') {
            console.log("Arrived on Slide 11 From Below");

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "100";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            console.log("--------")

            ahaCard.transitionBackgroundEnter()
        }

        if (direction === 'down') {
            console.log("Arrived on Card 5 From Above")

            //display river animation svg
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            //force alignment of hidden rivershape, to be ready for transitions
            vis.svg.select("#riverShape")
                .transition()
                .duration(1000)
                .attr("d", vis.displayData[1].path)
                .attr("transform", 'translate(-300,-50) rotate(0) scale(12,4)')
                .style('fill', 'lightblue')

            ahaCard.transitionBackgroundExit();
            ahaCard.narraratorExit();

            console.log("--------")
        }
    }

    // card5Transition(direction) {
    //     let vis = this;
    //
    //     if (direction === 'down') {
    //         console.log("Arrived on Slide 5! From Above")
    //
    //         document.getElementById("animatedWavesContainer").style.opacity = "0";
    //
    //         document.getElementById("sim-container").style.height = "100vh";
    //
    //         vis.svg.select("#riverShape")
    //             .transition()
    //             .duration(5000)
    //             .attr("d", vis.displayData[0].path)
    //             .attr("transform", 'translate(-40, -500) rotate(20) scale(0.52,-0.52)')
    //             .style('fill', 'blue')
    //             .style('opacity', "0.25")
    //
    //         setTimeout(function () {
    //             //fade river out
    //             vis.svg.select("#riverShape")
    //                 .transition()
    //                 .duration(6000)
    //                 .style('opacity', "0.15")
    //         }, 6000);
    //     }
    //
    //
    //     if (direction === 'up') {
    //         console.log("Arrived on Slide 5! From Below")
    //
    //         document.getElementById("animatedWavesContainer").style.opacity = "0";
    //
    //         document.getElementById("sim-container").style.height= "100vh";
    //
    //         // //transition river shape to new pattern
    //         vis.svg.select("#riverShape")
    //             .transition()
    //             .duration(4000)
    //             .attr("d", vis.displayData[0].path)
    //             .attr("transform", 'translate(-1500, -1300) rotate(20) scale(0.92, -0.92)')
    //             .style('fill', 'blue')
    //             .style('opacity', "0.25")
    //     }
    //
    // }


    ahaCardTransitionExit(direction) {

        //called BEFORE the slide exits - exiting!
        if (direction === 'right') {
            console.log("Exiting on title card Two From the Left")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            ahaCard.transitionBackgroundExit();
        }

        if (direction === 'left') {
            console.log("Exiting on title Card Two From the Right")
            document.getElementById("riverShape").style.opacity = "0";
            document.getElementById("animatedWavesContainer").style.opacity = "0";
            document.getElementById("animatedWavesContainer-BROWN").style.opacity = "0";
            document.getElementById("animatedWavesContainer-GREEN").style.opacity = "0";
            document.getElementById("sim-container").style.height = "0vh";

            ahaCard.transitionBackgroundExit();
        }

    }

    card6Transition(direction) {
        let vis = this;

        vis.hideTitleCards();

        if (direction === 'down') {
            console.log("Arrived on Slide 6! From Above")

            document.getElementById("animatedWavesContainer").style.opacity = "0";

            vis.svg.select("#riverShape")
                .transition()
                .duration(4000)
                .attr("d", vis.displayData[0].path)
                .attr("transform", 'translate(-1500, -1300) rotate(20) scale(0.92, -0.92)')
                .style('fill', 'blue')
                .style('opacity', "0.15")

            setTimeout(function () {
                //fade river out
                vis.svg.select("#riverShape")
                    .transition()
                    .duration(6000)
                    .style('opacity', "0")
            }, 6000);

            setTimeout(function () {
                //fade river out
                document.getElementById("sim-container").style.height= "20vh";
            }, 12500);
        }

        if (direction === 'up') {
            console.log("Arrived on Slide 6! From Below")

            document.getElementById("animatedWavesContainer").style.opacity = "0";

            vis.svg.select("#riverShape")
                .transition()
                .duration(4000)
                .attr("d", vis.displayData[0].path)
                .attr("transform", 'translate(-1500, -1300) rotate(20) scale(0.92, -0.92)')
                .style('fill', 'blue')
                .style('opacity', "0.25")

        }
    }

}
