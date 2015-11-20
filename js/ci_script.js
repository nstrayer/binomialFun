//start by declaring and initializing a bunch of variables.
var width = parseInt(d3.select("#viz").style("width").slice(0, -2)),
    height = $(window).height() - 30,
    padding = 20,
    speed = 400,
    failColor = "#e41a1c"
    successColor = "#377eb8",
    buttonColor = "#4daf4a",
    numIntervals = 100,
    numTrials = 50,
    theta = 0.5; //global theta.

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height)

//scale for placing the confidence interval/ point estimate.
var CI_x = d3.scale.linear()
    .domain([0,1])
    .range([padding*3,width - padding*3]);

var CI_y = d3.scale.ordinal()
    .domain(d3.range(numIntervals))
    .rangeBands([padding*2 + 50, height - padding]);

//button for generating a new tri
var genButton = d3.select("svg").append("g")
    .attr("class", "genButton")
    .attr("transform", "translate(" + (width/2) + ",50)")

genButton.append("rect")
    .attr("x", -75)
    .attr("y", -25)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", 150)
    .attr("height", 40)
    .attr("fill", buttonColor )
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("opacity", 0.5)
    .on("click", function(){ drawIntervals(makeCIs(numIntervals,numTrials,theta)) })

genButton.append("text")
    .attr("text-anchor", "middle")
    .text("Generate CIs")
    .on("click", function(){ drawIntervals(makeCIs(100,200,theta)) })
    .style("pointer-events", "none")
    .style("user-select", "none")



//Function to generate a bunch of confidence intervals
// Generate m confidence intervals using n trials with success p
// Returns json of the cis.
function makeCIs(m,n,p){
    CIs = []
    for(var i = 0; i < m; i++){
        CIs.push(waldInterval(binomialDraw(n,p)))
    }
    return CIs;
}

var intervalViz = d3.select("svg").append("g")
    .attr("class", "intervalViz")

function drawIntervals(CIs){
    CI_y.domain(d3.range(CIs.length)) //update the domain

    var confInt_lines = intervalViz.selectAll(".intervals")
        .data(CIs)

    confInt_lines.exit()
        .transition().duration(speed)
        .attr("x1", width/2)
        .attr("x2", width/2)
        .remove()

    confInt_lines
        .transition().duration(speed)
        .attr("x1", width/2)
        .attr("x2", width/2)
        .attr("y1", 65)
        .attr("y2", 65)
        .transition().duration(speed)
        .delay(function(d,i){return 10*i;})
        .attr("x1", function(d){ return CI_x(d.lb)})
        .attr("x2", function(d){ return CI_x(d.ub)})
        .attr("y1", function(d,i){return CI_y(i)})
        .attr("y2", function(d,i){return CI_y(i)})
        .attr("stroke", function(d,i){
            if(d.lb < theta && d.ub > theta){
                return successColor;
            } else {
                return failColor;
            }
        })

    confInt_lines.enter()
        .append("line")
        .attr("class", "intervals")
        .attr("x1", width/2)
        .attr("x2", width/2)
        .attr("y1", 65)
        .attr("y2", 65)
        .attr("stroke", function(d,i){
            if(d.lb < theta && d.ub > theta){
                return successColor;
            } else {
                return failColor;
            }
        })
        .attr("stroke-width", "1")
        .transition().duration(speed)
        .delay(function(d,i){return 10*i;})
        .attr("x1", function(d){ return CI_x(d.lb)})
        .attr("x2", function(d){ return CI_x(d.ub)})
        .attr("y1", function(d,i){return CI_y(i)})
        .attr("y2", function(d,i){return CI_y(i)})
}

function reset(){drawIntervals([])} //empty the visualization.


//--------------------------------------------------------------------------------------------
//Slider stuff: ------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

var probOfSuccess = document.getElementById('probOfSuccess');

noUiSlider.create(probOfSuccess, {
	start: 0.5,
	range: { min: 0, max: 1 },
});

var tipHandles = probOfSuccess.getElementsByClassName('noUi-handle'),
	   tooltips = [];

// Add divs to the slider handles.I hate how clunky this is. Maybe submit a pr to the repo?
for ( var i = 0; i < tipHandles.length; i++ ){
	tooltips[i] = document.createElement('div');
	tipHandles[i].appendChild(tooltips[i]);
}

probOfSuccess.noUiSlider.on('update', function(values, handle, unencoded){ //what to do when the slider is moved.
        tooltips[handle].innerHTML = values[handle];
    })

probOfSuccess.noUiSlider.on('change', function(values, handle, unencoded){ //what to do when the slider is dropped.
        p_of_success = +values
        // updatePoints(rawData, confLevel, sizeVal)
        // take the given value, reset all the trials and start new.
        reset() //reset the visualization
        theta = p_of_success //change the theta.
    })
//
// //Alternative hypothesis slider
// var altHypothesis = document.getElementById('altHypothesis');
//
// noUiSlider.create(altHypothesis, {
//     start: 0.5,
// 	range: { min: 0, max: 1 },
// });
//
// var tipHandles2 = altHypothesis.getElementsByClassName('noUi-handle'),
// 	   tooltips2 = [];
//
// // Add divs to the slider handles.I hate how clunky this is. Maybe submit a pr to the repo?
// for ( var i = 0; i < tipHandles2.length; i++ ){
// 	tooltips2[i] = document.createElement('div');
// 	tipHandles2[i].appendChild(tooltips2[i]);
// }
//
// altHypothesis.noUiSlider.on('update', function(values, handle, unencoded){ //what to do when the slider is moved.
//         tooltips2[handle].innerHTML = values[handle];
// })
//
// altHypothesis.noUiSlider.on('change', function(values, handle, unencoded){ //what to do when the slider is dropped.
//         altHypothesisVal = +values
//         currentPVal = binomHypothesis(trials.length, numSuccess(trials), altHypothesisVal)
//         var dispPVal = Math.round(currentPVal*1000)/1000
//         d3.select("#pValue").text(dispPVal == 0? "<0.001": dispPVal)
// })
