var width = parseInt(d3.select("body").style("width").slice(0, -2)),
    height = $(window).height() - 30,
    padding = 20,
    speed = 400;

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height)


// Need to have a bar that when given an array of 0s and 1s will
// represent them on it's face with 1s as blue sections on left
// 0s as red on the right.
var idCounter = 1
var trials = [{"v":1,"id":idCounter}]

var barX = d3.scale.ordinal()
    .domain(d3.range(trials.length))
    .rangeBands([padding*3,width - padding*3]);

//Function for sorting the bars after adding a new trial.
function sortResults(){
    svg.selectAll("rect")
    .sort(function(a, b) { return b.v - a.v; })
    .transition().duration(speed)
    .attr("x", function(d,i){return barX(i)})
    .each("end", function(){
        trials.sort(function compareNumbers(a, b) {return b.v - a.v;})
    })
}

function updateBar(trials, speed){

    barX.domain(d3.range(trials.length)) //update bar scale

    var progressBar = svg.selectAll("rect")
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
        .attr("fill", function(d){ return d.v == 1 ? "steelblue" : "red"})

    progressBar.enter() //new trials
        .append("rect")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("width", 20)
        .transition().duration(speed)
        .attr("x", function(d,i){return barX(i)})
        .attr("y", 300)
        .attr("width", barX.rangeBand())
        .attr("height", 20)
        .attr("fill", function(d){ return d.v == 1 ? "steelblue" : "red"})
        .style("stroke", "black")
}

function addResult(res){
    idCounter += 1 //increment counter
    trials.push({"v":res, "id": idCounter}) //add new trial result
    trials.sort(function compareNumbers(a, b) {return b.v - a.v;})
    updateBar(trials, speed)
}

function reset(){
    idCounter = 1 //reset counter
    trials = [] // empty trials storage
    updateBar(trials, speed)
}

svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", 55)
    .attr("r", 25)
    .attr("fill", "steelblue")
    .on("click", function(){
        addResult(bern(0.7))
    })


updateBar(trials, speed)
