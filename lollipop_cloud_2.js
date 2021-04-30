function DrawLolly(id, data, options) {

    var config = {
        lollyWidth: 500, //dimensions for the lollipop chart
        lollyHeight: 500,
        lollyMargin: {top: 10, right: 10, bottom: 10, left: 50}, //margins for the chart SVG
        color: d3.interpolateViridis() // placeholder for the color function
    }

    //store options in the config variable above
    if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ config[i] = options[i]; }
	}//for i
	}//if

    //create namespaces for the overlapping charts
    let lolly = {};
    let wc = {};


    //LOLLIPOP CHART

    //grab page element and set up canvas
    lolly.svg = d3.select(id); //append svg here if not on page already
    lolly.margin = config.lollyMargin;
    lolly.width = config.lollyWidth; lolly.height = config.lollyHeight;
    lolly.innerWidth = lolly.width - lolly.margin.left - lolly.margin.right;
    lolly.innerHeight = lolly.height - lolly.margin.top - lolly.margin.bottom;

    //set up group for the drawing
    // lolly.g = lolly.svg.append('g')
    // .attr('transform', `translate(${lolly.margin.left},${lolly.margin.top})`);

    //Create an array for the domain
    lolly.domainArrayLong = data.map(function (d) { return d.longText; });

    // Define X and Y scales
    lolly.xScale = d3.scaleLinear()
        .domain([0, 50])
        .range([lolly.margin.left, (lolly.width - lolly.margin.right)]);

    lolly.yScale = yScale = d3.scaleBand()
        .domain(lolly.domainArrayLong)
        .range([lolly.margin.top, lolly.margin.top + lolly.innerHeight])
        .padding(1);

    // Draw X axis, add labels
    lolly.xAxis = lolly.svg.append('g')
        .classed('axis', true)
        .attr('transform', `translate(-0, ${lolly.height - lolly.margin.bottom})`)
        .call(d3.axisBottom(lolly.xScale)
            //remove x axis tick marks
            .tickSize(0))
        .selectAll('text')
            .attr('classed', 'axisLabel', true)
            .attr('font-family', 'Open Sans')
            .attr("transform", "translate(0,10)")
            .style('text-anchor', 'center');

    // Draw Y axis, add labels
    lolly.yAxis = lolly.svg.append('g')
        .classed('axis', true)
        .attr("transform", `translate(${lolly.margin.left}, 0)`)
        .call(d3.axisLeft(yScale)
            //remove y axis tick marks
            .tickSize(0))
        .attr("x", 4)
        .attr("dy", -4)
        .selectAll('text')
            .attr('x', -10)
            .attr('font-family', 'Open Sans')
            .attr("transform", "translate(-10,0)rotate(-20)")
            .classed('axisLabel', true)
            .style('text-anchor', 'end');

    // axis.tickSize(0);

    // Add lollipop lines
    lolly.lines = lolly.svg.selectAll('lollyLine')
        .data(data)
        .join('line')
        // .attr("transform", `translate(-30, -30)`)
        .attr("x1", lolly.margin.left)
        .attr("x2", function (d) { return lolly.xScale(d.size); })
        .attr("y1", function (d) { return lolly.yScale(d.longText); })
        .attr("y2", function (d) { return lolly.yScale(d.longText); })
        .attr("stroke", function (d, i) { return config.color(i); })
        .attr('opacity', 1)
        .attr('stroke-width', 40)
        //INTCTV LINK
        .on('mouseover', function (e, d) {
            let itemL = d.longText;
            let itemC = d.shortText;

            lolly.lines.attr('opacity', 0.2);
            lolly.pops.attr('opacity', 0.2);
            hoverCloud.attr('opacity', 0.2);

            d3.select(this)
                .attr('opacity', 1);

            lolly.pops.filter(function (dd) {
                return dd.longText === itemL;
            }).attr('opacity', 1);

            hoverCloud.filter(function (dd) {
                return dd.shortText === itemC;
            }).attr('opacity', 1);

        })
        .on('mouseout', function () {

            lolly.pops.attr('opacity', 1);
            lolly.lines.attr('opacity', 1);
            hoverCloud.attr('opacity', 1);

        });

    // Add lollipop circles ("pops")
    lolly.pops = lolly.svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return lolly.xScale(d.size); })
        .attr("cy", function (d) { return lolly.yScale(d.longText); })
        .attr("r", "20")
        .style("fill", function (d, i) { return config.color(i); })
        .attr("stroke", "none")
        //INTCTV LINK
        .on('mouseover', function (e, d) {
            let item = d.shortText;

            lolly.lines.attr('opacity', 0.2);
            lolly.pops.attr('opacity', 0.2);
            hoverCloud.attr('opacity', 0.2);

            lolly.lines.filter(function (dd) {
                return dd.shortText === item;
            })
                .attr('opacity', 1);
                // .attr('stroke-width', 5);

            d3.select(this).attr('opacity', 1);

            hoverCloud.filter(function (dd) {
                return dd.shortText === item;
            }).attr('opacity', 1);
        })
        .on('mouseout', function () {

            lolly.pops.attr('opacity', 1);
            lolly.lines.attr('opacity', 1);
            hoverCloud.attr('opacity', 1);

        });


    //WORD CLOUD

    //dimensions for the cloud; make sure to account for varying rotations of long edge words!
    wc.width = lolly.width / 1.7;
    wc.height = lolly.height / 1.7;

    //filter down the data to just the short word versions and values
    let kw_data_cloudFilt = data.filter(function (d) {
        return d.shortText, d.size;
    })

    //Jason Davies' layout function
    wc.layout = d3.layout.cloud()
        .size([wc.width, wc.height])
        .words(kw_data_cloudFilt)
        .padding(1.2)
        .rotate(function () { return (~~(Math.random() * 6) - 2) * 10; })
        .font("Open Sans")
        .fontSize(function (d) { return d.size + 8; })
        .spiral("archimedean")
        //call draw function
        .on("end", draw);

    //call the layout function
    wc.layout.start();

    //Jason Davies' word cloud drawing function
    function draw() {
        d3.select("#lollipop")
            .append("g")
            .attr("transform", "translate(" + (lolly.xScale(32)) + "," + (lolly.yScale('time')) + ")")
            // .attr('z-index', '2')
            .selectAll("text")
            .data(kw_data_cloudFilt)
            .join("text")
            .style("font-size", function (d) { return d.size + "pt"; })
            .style("font-family", "Open Sans")
            .style("fill", function (d, i) { return config.color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            // add a class to grab elements for interactivity
            .classed('hoverCloud', true)
            .text(function (d) { return d.shortText; })

    }; // wc draw fn end

    // grab cloud elements for the hover intxn
    hoverCloud = d3.selectAll('.hoverCloud');

    hoverCloud
        .on('mouseover', function (e, d) {
            let item = d.longText;

            lolly.lines.attr('opacity', 0.2);
            lolly.pops.attr('opacity', 0.2);
            hoverCloud.attr('opacity', 0.2);

            lolly.lines.filter(function (dd) {
                return dd.longText === item;
            })
                .attr('opacity', 1);

            lolly.pops.filter(function (dd) {
                return dd.longText === item;
            }).attr('opacity', 1);

            d3.select(this)
                .attr('opacity', 1);

        })
        .on('mouseout', function () {

            lolly.pops.attr('opacity', 1);
            lolly.lines.attr('opacity', 1);
            hoverCloud.attr('opacity', 1);

        });
    } //drawLolly() fn end