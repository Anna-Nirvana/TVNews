// set up canvas by appending svgL (L = lollipop) 
const margin = { top: 50, right: 50, bottom: 15, left: 200 };
const svgL = d3.select('#lollyChart');
const width = svgL.attr('width');
const height = svgL.attr('height');
const innerWidth = width - margin.left - margin.right; //!innerWidth is a length!
const innerHeight = height - margin.top - margin.bottom; //!innerHeight is a length!

//set up groups to append x and y axes
const g = svgL.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);
const yAxisG = g.append('g');

// parse the keyword (kw) data
d3.csv("./keywords.csv")
    .then(function (kw_data) {

        // sort kw_data
        kw_data.sort(function (b, a) {
            return a.Value - b.Value;
        });

        // Add X axis scale
        var xScale = d3.scaleLinear()
            .domain([0, 80])
            .range([margin.left, margin.left + innerWidth]);

        // Add Y axis scale
        var yScale = d3.scaleBand()
            .domain(kw_data.map(function (d) { return d.keyword; }))
            .range([margin.top, margin.top + innerHeight])
            .padding(2);

        svgL.selectAll("myline")
            .data(kw_data)
            .join('line')
            .attr("x1", xScale(0))
            .attr("x2", xScale(80))
            .attr("y1", yScale("graphic(s)"))
            .attr("y2", yScale("graphic(s)"))
            .attr("stroke", "red")

        svgL.selectAll("myline")
            .data(kw_data)
            .join('line')
            .attr("x1", xScale(0))
            .attr("x2", xScale(80))
            .attr("y1", yScale("catch(ing)/caught"))
            .attr("y2", yScale("catch(ing)/caught"))
            .attr("stroke", "red")

        // Draw X axis, add labels
        xAxisG.call(d3.axisBottom(xScale))
            .selectAll('text', 'g')
            .attr('classed', 'axis-label', true)
            // .attr('transform', 'translate(-0,0)')
            .style('text-anchor', 'end');


        // Draw Y axis, add labels (?)
        yAxisG.call(d3.axisLeft(yScale))
        // .attr('transform', 'translate(0,-0)')

        // Lines
        svgL.selectAll("myline")
            .data(kw_data)
            .join('line')
            .attr("x1", function (d) { return xScale(+d.uses); })
            .attr("x2", margin.left)
            .attr("y1", function (d) { return yScale(d.keyword); })
            .attr("y2", function (d) { return yScale(d.keyword); })
            .attr("stroke", "grey")

        // Circles
        svgL.selectAll("mycircle")
            .data(kw_data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(+d.uses); })
            .attr("cy", function (d) { return yScale(d.keyword); })
            .attr("r", "7")
            .style("fill", "#69b3a2")
            .attr("stroke", "black")







    });