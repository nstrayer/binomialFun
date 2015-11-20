//start by declaring and initializing a bunch of variables.
var width = parseInt(d3.select("#viz").style("width").slice(0, -2)),
    height = $(window).height() - 30,
    padding = 20,
    speed = 400,
    theta = 0.5,
    altHypothesisVal = 0.5,
    currentPVal,
    trials = [],
    failColor = "#e41a1c"
    successColor = "#377eb8",
    buttonColor = "#4daf4a";

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height)

//scale for the trials bar.
var barX = d3.scale.ordinal()
    .domain(d3.range(trials.length))
    .rangeBands([padding*3,width - padding*3]);

//scale for placing the confidence interval/ point estimate.
var CIScale = d3.scale.linear()
    .domain([0,1])
    .range([padding*3,width - padding*3]);


//button for generating a new tri
var genButton = d3.select("svg").append("g")
    .attr("class", "genButton")
    .attr("transform", "translate(" + (width/2) + ",100)")

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
    .on("click", function(){ addResult(bern(theta)) })

genButton.append("text")
    .attr("text-anchor", "middle")
    .text("Generate CIs")
    .on("click", function(){ addResult(bern(theta)) })
    .style("pointer-events", "none")
    .style("user-select", "none")

//kick it off.
updateBar(trials, speed)

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

//Alternative hypothesis slider
var altHypothesis = document.getElementById('altHypothesis');

noUiSlider.create(altHypothesis, {
    start: 0.5,
	range: { min: 0, max: 1 },
});

var tipHandles2 = altHypothesis.getElementsByClassName('noUi-handle'),
	   tooltips2 = [];

// Add divs to the slider handles.I hate how clunky this is. Maybe submit a pr to the repo?
for ( var i = 0; i < tipHandles2.length; i++ ){
	tooltips2[i] = document.createElement('div');
	tipHandles2[i].appendChild(tooltips2[i]);
}

altHypothesis.noUiSlider.on('update', function(values, handle, unencoded){ //what to do when the slider is moved.
        tooltips2[handle].innerHTML = values[handle];
})

altHypothesis.noUiSlider.on('change', function(values, handle, unencoded){ //what to do when the slider is dropped.
        altHypothesisVal = +values
        currentPVal = binomHypothesis(trials.length, numSuccess(trials), altHypothesisVal)
        var dispPVal = Math.round(currentPVal*1000)/1000
        d3.select("#pValue").text(dispPVal == 0? "<0.001": dispPVal)
})
