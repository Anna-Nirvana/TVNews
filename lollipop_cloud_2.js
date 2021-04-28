// Word cloud -- based on code from Jason Davies and Martin Braun
// https://www.jasondavies.com/wordcloud/
// https://jsbin.com/kiwojayoye/1/edit?html,js,output

let kw_data_sorted;

$(document).ready(function () {

    //LOLLIPOP CHART
    // set up canvas by grabbing base SVG: svgL (L = lollipop) 
    const marginL = { top: 0, right: 50, bottom: 50, left: 200 };
    const svgL = d3.select('#lollipop');
    const widthL = svgL.attr('width');
    const heightL = svgL.attr('height');
    const innerwidthL = widthL - marginL.left - marginL.right; //!innerwidthL is a length!
    const innerheightL = heightL - marginL.top - marginL.bottom; //!innerheightL is a length!

    //set up groups to append x and y axes
    const g = svgL.append('g')
        .attr('transform', `translate(${marginL.left},${marginL.top})`);

    const xAxisG = g.append('g')
        .attr('transform', `translate(-200, ${innerheightL})`);
    const yAxisG = g.append('g');

    // parse the keyword (kw) data
    d3.csv('keywords.csv')
        .then(function (kw_data) {

            // sort keyword data and store it in a variable for the intctv bit
            kw_data_sorted = kw_data.sort(function (b, a) {
                return a.Value - b.Value;
            });

            console.log(kw_data_sorted);

            // Add X axis scale
            var xScale = d3.scaleLinear()
                .domain([0, 50])
                .range([marginL.left, marginL.left + innerwidthL]);

            // Add Y axis scale
            var yScale = d3.scaleBand()
                .domain(kw_data_sorted.map(function (d) { return d.keyword; }))
                .range([marginL.top, marginL.top + innerheightL])
                .padding(1);

            // Draw X axis, add labels
            xAxisG.call(d3.axisBottom(xScale))
                .selectAll('text', 'g')
                .attr('classed', 'axis-label', true)
                .attr('transform', 'translate(2,0)')
                .style('text-anchor', 'center');


            // Draw Y axis, add labels
            yAxisG
                .call(d3.axisLeft(yScale))
                .selectAll('text')
                .attr('classed', 'axis-label', true)
                // .attr('transform', 'translate(0,0)')
                .style('text-anchor', 'end');

            // Lines
            svgL.selectAll("myline")
                .data(kw_data_sorted)
                .join('line')
                .attr("x1", function (d) { return xScale(+d.uses); })
                .attr("x2", marginL.left)
                .attr("y1", function (d) { return yScale(d.keyword); })
                .attr("y2", function (d) { return yScale(d.keyword); })
                .attr("stroke", "grey");

            // Circles
            svgL.selectAll("#mycircle")
                .data(kw_data_sorted)
                .join("circle")
                .attr("cx", function (d) { return xScale(+d.uses); })
                .attr("cy", function (d) { return yScale(d.keyword); })
                .attr("r", "6")
                .style("fill", function (d, i) { return color(i); })
                .attr("stroke", "black")
                .classed('hover', true);

        });


    //WORD CLOUD

    var color = d3.scaleSequential()
        .domain([0, 30])
        .interpolator(d3.interpolateViridis);

    var words = [
        // { "text": "graphic(s)", "size": 77 },
        { "text": "visual", "size": 43 },
        { "text": "easily", "size": 41 },
        { "text": "makes", "size": 39 },
        { "text": "storytelling", "size": 38 },
        { "text": "understand", "size": 35 },
        { "text": "information", "size": 34 },
        { "text": "animation", "size": 30 },
        { "text": "helpful", "size": 26 },
        { "text": "interesting", "size": 22 },
        { "text": "shows", "size": 17 },
        { "text": "details", "size": 16 },
        { "text": "points", "size": 14 },
        { "text": "numbers", "size": 13 },
        { "text": "clearer", "size": 34 },
        { "text": "follow", "size": 12 },
        { "text": "great", "size": 12 },
        { "text": "news", "size": 11 },
        { "text": "(pay) attention", "size": 11 },
        { "text": "comparison", "size": 9 },
        { "text": "explain", "size": 9 },
        { "text": "location", "size": 9 },
        { "text": "giving", "size": 8 },
        { "text": "appealing", "size": 7 },
        { "text": "happened", "size": 7 },
        { "text": "relevant", "size": 7 },
        { "text": "feel", "size": 6 },
        { "text": "memorable", "size": 6 },
        { "text": "works", "size": 6 },
        { "text": "comprehensive", "size": 6 },
        { "text": "people", "size": 5 },
        { "text": "time", "size": 5 },
        { "text": "engaging", "size": 5 },
        { "text": "graphs", "size": 5 },
        { "text": "impact", "size": 5 },
        { "text": "important", "size": 5 },
        { "text": "picture", "size": 5 },
        { "text": "cool", "size": 5 },
        { "text": "compelling", "size": 4 },
        { "text": "hear", "size": 4 },
        { "text": "simple", "size": 4 },
        { "text": "subject/topic(s)", "size": 4 },
        { "text": "provides", "size": 4 },
        { "text": "attractive", "size": 4 },
        { "text": "(less) boring", "size": 4 },
        { "text": "broke up (the story)", "size": 3 },
        { "text": "eye", "size": 3 },
        { "text": "fact", "size": 3 },
        { "text": "love", "size": 3 },
        { "text": "illustrate", "size": 3 },
        { "text": "caught", "size": 3 },


        //etc.,
    ];

    widthC = widthL / 1.5;
    heightC = heightL / 2;

    var vis = document.getElementById("cloud");
    var layout = d3.layout.cloud().size([widthC, heightC])
        .words(words)
        .padding(2)
        .rotate(function () { return (~~(Math.random() * 6) - 2) * 20; })
        .font("Open Sans")
        .fontSize(function (d) { return d.size + 10; })
        .spiral("archimedean")
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("#lollipop")
            .append("g")
            .attr("transform", "translate(" + (widthC) + "," + (heightC) + ")")
            .attr('z-index', '2')
            .selectAll("text")
            .data(words)
            .join("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Open Sans")
            .style("fill", function (d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .classed('cloud', true)
            .text(function (d) { return d.text; })
            // .on('mouseover', function(d) {
            //     highlightLolly(this._selection);
            // })
            ;
    }

    // create a 'tooltip' / highlight state
    var tooltip = d3.selectAll('.hover')
        .append('circle')
        .style("opacity", 1);




    var lollipopWrapper = g.selectAll(".lollipopWrapper")
        .data(kw_data_sorted)
        .join('g')
        .attr('class', 'lollipopWrapper')

    lollipopWrapper.selectAll('lollipopGlow')
        .data(function (d, i) { return i; })
        .join('line')
        .attr('class', 'lollipopGlow')
        .attr('r', 10)
        .attr("cx", mycircle.cx)
        .attr("cy", mycircle.cy)
        .style('fill', '#00ff00')
        .style('opacity', '0')
        .on('mouseover', function (d, i) {

            tooltip
                .transition()
                .duration(200)
                .style('opacity', '1');

                console.log(d.Value);
        }
            .on("mouseout", function () {
                tooltip.transition().duration(200)
                    .style("opacity", 0);
            }));


}); //on documentReady


// function highlightLolly(item, i) {

//     console.log(i);

//     }


