// Array Sum.
// For some reason javascript doesn't have a quick conceise method of summing an array. Let's make one
// Input: Array of numerical values (arr)
function sumArray(arr){
    var s = 0
    arr.forEach(function(d){s = s + d})
    return(s)
}


// Bernoulli trial function.
// This function takes the parameter p, which is the probability of success.
// It returns either a 1 (success) or 0 (failure)
function bern(p){ return(Math.random() < p ? 1 : 0)}

// Wald interval function 95%
// Input:
// vector (trials) of successes (1) and failures (0)
// Returns:
// point estimate (pe),
// lower bound of CI (lb),
// upper bound (ub) and
// width of interval (width).
function waldInterval(trials){
    var n = trials.length
    var z = 1.96 //Hard coding this value for now, eventually we will be able to adjust width
    var pe = sumArray(trials)/n //point estimate. Simply success/trials
    var intW = z * Math.sqrt((1/n) * pe*(1 - pe)) //width of the interval
    return({
        "pe": pe,
        "lb": pe - intW,
        "ub": pe + intW,
        "width": intW*2
    })
}

//Wilson Interval 95%
//Same as wald but success = x + 2, trials = n + 4. Improves coverage.
//Input vector (trials) of successes (1) and failures (0)
// Returns:
// point estimate (pe),
// lower bound of CI (lb),
// upper bound (ub) and
// width of interval (width).
function wilsonInterval(trials){
    trials.push(1,1,0,0) //increase successes by 2, trials by 4
    return(waldInterval(trials)) //run the wald interval again.
}
