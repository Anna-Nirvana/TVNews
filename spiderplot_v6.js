//Nadieh Bremmer's radar chart fn, customized and updated for D3 V6
function RadarChart(id, data, options) {
	var config = {
		w: 400,				//dimensions for the circle
		h: 400,
		margin: {top: 10, right: 10, bottom: 15, left: 15}, //margins for the chart SVG
		levels: 3,				//no. layers of the onion
		maxValue: 1, 			//value the largest circle reps
		labelFactor: 1.25, 	//dist. between outermost circle and  labels
		wrapWidth: 80, 		//where carriage return occurs in a label (also applied in the)
		opacityArea: 0.35, 	//blob area opacity
		dotRadius: 4, 			//radius of the data points
		opacityCircles: 0.1, 	//bg circles bold/faint
		strokeWidth: 5, 		//how fat is the blob outline
		color:	0		//placeholder for a color function
	};
	
    //store options in the config variable above
	if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ config[i] = options[i]; }
	}//for i
	}//if

	//Grab the variable names and set them up as axes (replace 'axis' with whatever should act as the set of radial axes)
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//number of axes
		radius = Math.min(config.w/2, config.h/2), 	//biggest circle radius
		Format = d3.format('.0%'),			 	//number format
		angleSlice = Math.PI * 2 / total;		//how many radians wide is each slice
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0., radius])
		.domain([0, config.maxValue]);

		// console.log(data);

	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  config.w + config.margin.left + config.margin.right)
			.attr("height", config.h + config.margin.top + config.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g") //general graphic group 
			.attr("transform", "translate(" + (config.w/2 + config.margin.left) + "," + (config.h/2 + config.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper"); //grid group
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
        .data(d3.range(1,(config.levels+1)).reverse())
        .join("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/config.levels*d;})
		.style("fill", "#f8f8ff")
		.style("stroke", "#f8f8ff")
		.style("fill-opacity", config.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,(config.levels+1)).reverse())
        .join("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d){return -d*radius/config.levels;})
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#f8f8ff")
		.text(function(d,i) { return Format(config.maxValue * d/config.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.join("g") //radial axis group
		.attr("class", "axis");

	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(config.maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(config.maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "#f8f8ff")
		.style("stroke-width", "2px")
		.style('opacity', 0.5);

	//Append the labels at each axis
	axis.append("text")
		.classed('axisLabel', true)
		.style('fill', '#f8f8ff')
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(config.maxValue * config.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(config.maxValue * config.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, config.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function - !DEPRECATED
	var radarLine = d3.lineRadial()
		.curve(d3.curveLinearClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });

				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.join("g") //group for all blobs
		.attr("class", "radarWrapper")
		;
			
	//Append the backgrounds	
	blobWrapper
		.append("line")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return config.color(i); })
		.style("fill-opacity", config.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition()
				.duration(200)
				.style("fill-opacity", 0.01);
			//as well as their dots
			// d3.selectAll(".radarCircle")
			// 	.transition()
			// 	.duration(100)
			// 	.style("fill-opacity", 0.2); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition()
				.duration(100)
				.style("fill-opacity", 0.7);
			//and its dots??
			// d3.select(this.RadarCircle)
			// 	.transition()
			// 	.duration(100)
			// 	.style("fill-opacity", 1);
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition()
				.duration(100)
				.style("fill-opacity", config.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", config.strokeWidth + "px")
		.style("stroke", function(d,i) { return config.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	// Append the dots
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.join("circle")
		.attr("class", "radarCircle")
		.attr("r", config.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", 'white')
		.style("fill-opacity", 0.9);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.join("g") //group for mouseover zone
		.attr("class", "radarCircleWrapper");

		
	// Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper
	.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.join("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("r", config.dotRadius*2)
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx') +- 10);
			newY =  parseFloat(d3.select(this).attr('cy') +- 10);
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(`${(Format(i.value))} of this demographic watches for this`)
				.transition()
				.duration(100)
				.style('opacity', 1)
				.attr("dy", "1em")
				.call(wrap, config.wrapWidth);

				console.log(i.value);
		})
		.on("mouseout", function(){
			tooltip.transition()
				.duration(200)
				.style("opacity", 0);
		});
		

			//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
	.attr("class", "tooltip")
	.style("opacity", 1)
	.style('color', '#f8f8ff')
	.attr('z-index', 5);

	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
        });
    }//wrap	
	
}//RadarChart

//Thanks to Nadieh Bremer and alangrafu for the code inspiration!