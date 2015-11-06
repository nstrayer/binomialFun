var width = parseInt(d3.select("body").style("width").slice(0, -2)),
    height = $(window).height() - 30,
    padding = 20;

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height)


// Need to have a bar that when given an array of 0s and 1s will
// represent them on it's face with 1s as blue sections on left
// 0s as red on the right.
var trials = [1,1,1,0,0,0]

var barX = d3.scale.ordinal()
    .domain(d3.range(trials.length))
    .rangeBands([padding*3,width - padding*3]);

function addResult(res){
    trials.push(res) //add new trial result
    trials.sort() //sort list so it's in good order.
}

function sortResults(){
    svg.selectAll("rect")
    .sort(function(a, b) { return b - a; })
    .transition().duration(1000)
    .attr("x", function(d,i){return barX(i)})
}

function updateBar(trials, speed){

    barX.domain(d3.range(trials.length)) //update bar scale

    var progressBar = svg.selectAll("rect")
        .data(trials)


    progressBar.exit() //get rid of old trials
        .transition().duration(speed)
        .attr("x", 1000)
        .remove()

    progressBar //existing trials
        .transition().duration(speed)
        .attr("x", function(d,i){return barX(i)})
        .attr("width", barX.rangeBand())

    progressBar.enter() //new trials
        .append("rect")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("width", 20)
        .transition().duration(speed)
        .delay(function(d,i){return Math.random()*30*i})
        .attr("x", function(d,i){return barX(i)})
        .attr("y", 300)
        .attr("width", barX.rangeBand())
        .attr("height", 20)
        .attr("fill", function(d){ return d == 1 ? "steelblue" : "red"})
        .style("stroke", "black")
        .each("end", function(d,i){ //sort results on last.
            if(i == trials.length - 1){sortResults()}
        })
}

updateBar(trials, 1000)
