function RadialBar(id, data, options) {

    var config = {
        w: 400,
        h: 400,
        margin: 10, //the radial margin
        levels: 5, //no. of radial levels to display with axis ticks
        maxValue: 1, //maximum value to be displayed
        color: 0, //array or scheme of colors to be used
        formatNumber: d3.format('.0%') //use d3-format to specify how the data will be displayed
    }

    //store chart options above in configuration variable
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { config[i] = options[i]; }
        }
    }

    const barHeight = config.h / 2 - config.margin;

    //clear any existing svgs
    d3.select(id).select('svg').remove();



    var svg = d3.select(id).append('svg')
        .attr('width', config.w)
        .attr('height', config.h)
        .append('g')
        .attr('transform', 'translate(' + config.w / 2 + ',' + config.h / 2 + ')');



    //map function requires an array.
    //these lines worked in d3 v3, referencing factors_sample.json
    var factorsNames = data.map(function (d) { return d.factor; });
    var styleNames = data[0].styles.map(function (d) { return d.name; });

    //let's try restructuring factors_sample.json to give .map an array in v6....
    // "factor","style" is no longer an identifier...

    // var factorsNames = data.map(function (d) { return d; });
    // var styleNames = data[0].styles.map(function (d) { return d.name; });


    // barScale = y = rScale
    var barScale = d3.scaleLinear()
        .domain([0, config.maxValue])
        .range([0, barHeight]);

    var numBarsfactors = factorsNames.length;
    var numBarsstyles = styleNames.length;

    //x = cScale
    var cScale = d3.scaleLinear()
        .domain([0, config.maxValue])
        .range([0, -barHeight]);

    // xAxis -> axisC
    var displayAxis = d3.axisLeft()
        .scale(cScale)
        .ticks(config.levels)
        .tickFormat(config.formatNumber);

    var circles = svg.selectAll('circle')
        .data(cScale.ticks(config.levels))
        .join('circle')
        .attr('r', function (d) { return barScale(d); })
        .style('fill', 'none')
        .style('stroke', '#f8f8ff')
        .style('stroke-dasharray', '2,2')
        .style('stroke-config.w', '.5px');

    var factors = svg.selectAll('.factor')
        .data(data)
        .join('g')
        .attr('class', 'factor')
        .attr('transform', function (d, i) { return 'rotate(' + (i * 360 / numBarsfactors) + ')'; });

    var arc = d3.arc()
        .startAngle(function (d, i) { return (i * 2 * Math.PI) / (numBarsstyles * numBarsfactors); })
        .endAngle(function (d, i) { return ((i + 1) * 2 * Math.PI) / (numBarsstyles * numBarsfactors); })
        .innerRadius(0);

    var segments = factors.selectAll('path')
        .data(function (d) { return d.styles; })
        .join('path')
        .each(function (d) { d.outerRadius = 0; })
        .style('fill', function (d) { return config.color(d.name); })
        .style('opacity', 0.8)
        .attr('d', arc)
    // .classed('anim', true);

    // console.log(segments);

    var customElastic = d3.easeElastic.period(0.4);

    segments.transition()
        .ease(customElastic)
        .duration(1200)
        .delay(0)
        .attrTween('d', function (d, index) {
            var i = d3.interpolate(d.outerRadius, barScale(d.value));
            return function (t) { d.outerRadius = i(t); return arc(d, index); };
        });

    //background grid circumferential
    svg.append('circle')
        .attr('r', barHeight)
        .classed('outer', true)
        .style('fill', 'none')
        .style('stroke', '#f8f8ff')
        .style('stroke-config.w', '1.5px');

    // background grid radial
    factors.selectAll('line')
        .data(function (d) { return d.styles; })
        .join('line')
        .attr('y2', function (d, i) { return i === 0 ? -barHeight - 20 : -barHeight; })
        .style('stroke', '#f8f8ff')
        .style('stroke-config.w', function (d, i) { return i === 0 ? '1px' : '0.2px'; })
        .attr('transform', function (d, i) { return 'rotate(' + (i * 360 / (numBarsstyles * numBarsfactors)) + ')'; });

    svg.append('g')
        .classed('axis', true)
        .call(displayAxis);

    // Labels
    var labelRadius = barHeight * 1.025;


    var labels = svg.append('g')
        .classed('axisLabel', true);

    labels.append('def')
        .append('path')
        .attr('id', 'label-path')
        .attr('d', 'm0 ' + -labelRadius + ' a' + labelRadius + ' ' + labelRadius + ' 0 1,1 -0.01 0');

    labels.selectAll('text')
        .data(factorsNames)
        .join('text')
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .append('textPath')
        .attr('xlink:href', '#label-path')
        .attr('startOffset', function (d, i) { return i * 100 / numBarsfactors + 50 / numBarsfactors + '%'; })
        .text(function (d) { return d.toUpperCase(); });

    // legend
    // var legend = svg.selectAll('.legend')
    //     .data(styleNames.slice().reverse())
    //     .join('g')
    //     .attr('class', 'legend')
    //     .attr('transform', function (d, i) { return 'translate(' + -config.w / 2 + ',' + (-(config.h / 2 - 20) + (i * 20)) + ')'; });

    // legend.append('rect')
    //     .attr('x', config.w - 33)
    //     .attr('width', 18)
    //     .attr('height', 18)
    //     .style('fill', config.color);

    // legend.append('text')
    //     .attr('x', config.w - 39)
    //     .attr('y', 9)
    //     .attr('dy', '.35em')
    //     .style('text-anchor', 'end')
    //     .text(function (d) { return d; });

};