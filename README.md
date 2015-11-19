###An Interactive Exploration of Binomial Confidence Intervals and Hypothesis Testing.


__Introduction__

Confidence intervals (CIs) and hypothesis testing are two often misunderstood statistical techniques. In addition, most efforts to teach confidence intervals and hypothesis testing in introductory statistics classes focus on data coming from normally distributed data. In this interactive online application I am attempting to help educate the user about the behavior and properties of confidence intervals and hypothesis testing and also the underlying properties of binomially distributed data

__Description__

The user is greeted with a split screen. The left side (top on mobile) contains sliders to adjust the probability of success for a Bernoulli trial and a hypothesized value of theta for a hypothesis test. To the right of the screen is a button allowing the user to generate a trial from the Bernoulli distribution with the true probability of success selected by the user on the left.  
	
As the user clicks the trial generation button a Bernoulli trial is run and is visualized  as a discrete entity taking up space in a bar underneath the generation button. A blue trial  indicates a “success” and red, “failure.” As the trials begin to accumulate an interval is displayed below the trials bar showing the 95% confidence interval for the true theta given the observed data. 
	
As the user continues to generate trials they can observe how this interval moves and shrinks. In addition, they can see the updated p-value given the selected hypothesized theta. Information on the number of trials, and successes is also updated on the left side. 
	
If desired, the user can use the application simply for visualization and calculating intervals and p-values for already gathered binomial data. They do this by typing in trial and success numbers into the display boxes. 

__Motivation__

I have pursued an interactive application as it provides an engaged and interactive learning experience that can be run on any device capable of accessing the internet and running javascript code. Principles from cognitive psychology such as the generation effect [1] also provide motivation to allow the user to interact with and observe the data being generated.

__Methods__

The application is entirely coded in client-side javascript using the open-source library d3 and also a custom-built statistics library. By making the visualization a static webpage it drastically eases the setup process and removes any black-box aspects from the client-visible code.

__Future Direction__

I would eventually like to put together a series of interactive visualizations that help illustrate an entire introductory statistics curriculum. I have begun this with other visualizations such as visualizing probability distribution transformations. Excellent resources are available in print for students, but seeing concepts from multiple angles and tangibly interacting with them will hopefully provide a more lasting and thorough understanding of the material.

__Citations__

1. 	Slamecka, Norman J., and Peter Graf. “The generation effect: Delineation of a phenomenon.” Journal of experimental Psychology: Human learning and Memory 4.6 (1978): 592.