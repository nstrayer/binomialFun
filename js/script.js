var width = parseInt(d3.select("#viz").style("width").slice(0, -2)),
    height = $(window).height() - 30,
    padding = 20,
    speed = 400,
    theta = 0.5,
    altHypothesisVal = 0.5,
    currentPVal,
    failColor = "#e41a1c"
    successColor = "#377eb8",
    buttonColor = "#4daf4a";

//counter for giving the trials unique values. This is important as
//if they don't have unique ids the transitions will get all messed up due to sorting not
//behaving well with identical valued data.
var idCounter = 1

var trials = [] //initialize a trial holder

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

//make a g for holding the progressbar and confidence interval.
var trialViz = d3.select("svg").append("g").attr("class", "trialViz")

function updateBar(trials, speed){
    barX.domain(d3.range(trials.length)) //update bar scale

    var progressBar = trialViz.selectAll(".progressBar")
        .data(trials, function(d){return d.id})

    progressBar.exit()
        .transition().duration(800)
        .delay(function(d, i) { return (trials.length - i) * 15; })
        .attr("x", width/2)
        .attr("y", -10)
        .attr("width", 0)
        .attr("height", 0)
        .remove()

    progressBar //existing trials
        .transition().duration(0)
        .attr("x", function(d,i){return barX(i)})
        .attr("width", barX.rangeBand())
        .attr("y", 300)
        .attr("fill", function(d){ return d.v == 1 ? successColor : failColor})

    progressBar.enter() //new trials
        .append("rect")
        .attr("class", "progressBar")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("width", 20)
        .transition().duration(speed)
        .attr("x", function(d,i){return barX(i)})
        .attr("y", 300)
        .attr("width", barX.rangeBand())
        .attr("height", 20)
        .attr("fill", function(d){ return d.v == 1 ? successColor : failColor})
        .style("stroke", "black")
}

//Draws the confidence interval for the current trials.
function confidenceInterval(trials, speed){

    //get our data on the interval by extracting trial results
    var intervalData = [wilsonInterval(trials.map(function(d){return d.v}))];

    var confInt = trialViz.selectAll("line")
        .data(intervalData, function(d,i){return i;})

    confInt.exit()
        .transition().duration(800)
        .attr("x1", width/2)
        .attr("x2", width/2)
        .remove()

    confInt
        .transition().duration(speed)
        .attr("x1", function(d){ return CIScale(d.lb)})
        .attr("x2", function(d){ return CIScale(d.ub)})

    confInt.enter()
        .append("line")
        .attr("class", "confidenceInterval")
        .attr("x1", width/2)
        .attr("x2", width/2)
        .attr("y1", 350)
        .attr("y2", 350)
        .attr("stroke", "black")
        .attr("stroke-width", "2")
        .transition().duration(speed)
        .attr("x1", function(d){ return CIScale(d.lb)})
        .attr("x2", function(d){ return CIScale(d.ub)})
}


//Generate and add a new trial to the viz.
function addResult(res){
    idCounter += 1 //increment counter
    trials.push({"v":res, "id": idCounter}) //add new trial result
    trials.sort(function compareNumbers(a, b) {return b.v - a.v;})
    updateBar(trials, speed)
    confidenceInterval(trials, speed)
    //code will need to go here for updating hypothesis pval
    currentPVal = binomHypothesis(trials.length, numSuccess(trials), altHypothesisVal)
    d3.select("#pValue").text(currentPVal)
}

//this doesn't work. Fix it later.
function addLots(n){
    d3.range(n).forEach(function(){
        console.log("go!")
        setTimeout(addResult(bern(theta)) , 200)
    })
}

//remove all the trials.
function reset(){
    idCounter = 1 //reset counter
    trials = [] // empty trials storage
    updateBar(trials, speed)
    confidenceInterval([], speed)
}

//button for generating a new trial.
var buttonStuff = [{color: buttonColor, text: "Generate Trial"}]

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
    .attr("opacity", 0.5)
    .on("click", function(){ addResult(bern(theta)) })

genButton.append("text")
    .attr("text-anchor", "middle")
    .text("Generate New Trial")
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
        //put function to do here.
        currentPVal = binomHypothesis(trials.length, numSuccess(trials), altHypothesisVal)
        d3.select("#pValue").text(currentPVal)
    })
