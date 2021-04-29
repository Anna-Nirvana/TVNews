$(document).ready(function () {

    //create namespaces for the overlapping charts
    let lolly = {};
    let wc = {};

    //set up color function to apply to both charts
    let color = d3.scaleSequential()
        .domain([0, 50])
        .interpolator(d3.interpolateViridis);

    // store the sorted data, one version for each chart
    const kw_data = [
        { "shortText": "visual", "longText": "visual(s/ly/ize)", "size": 43 },
        { "shortText": "easily", "longText": "easy/easily", "size": 41 },
        { "shortText": "makes", "longText": "made/make(s)", "size": 39 },
        { "shortText": "storytelling", "longText": "story/storytelling", "size": 38 },
        { "shortText": "understand", "longText": "understand(ing/able)/comprehend)", "size": 35 },
        { "shortText": "information", "longText": "information/informative", "size": 34 },
        { "shortText": "animation", "longText": "animation/animated", "size": 30 },
        { "shortText": "helpful", "longText": "help(ful/ing)/aid", "size": 26 },
        { "shortText": "interesting", "longText": "interest(ed/ing)", "size": 22 },
        { "shortText": "shows", "longText": "show(s)", "size": 17 },
        { "shortText": "details", "longText": "detail(s/ed/ing)", "size": 16 },
        { "shortText": "points", "longText": "point(s)", "size": 14 },
        { "shortText": "numbers", "longText": "number(s)/data", "size": 13 },
        { "shortText": "clear", "longText": "clear(er)", "size": 12 },
        { "shortText": "follow", "longText": "follow", "size": 12 },
        { "shortText": "great", "longText": "good/great", "size": 12 },
        { "shortText": "news", "longText": "news", "size": 11 },
        { "shortText": "(pay) attention", "longText": "(pay) attention", "size": 11 },
        { "shortText": "comparison", "longText": "statistic(s)/comparison", "size": 9 },
        { "shortText": "explain", "longText": "explain(ed/ing)/explanation(s)", "size": 9 },
        { "shortText": "location", "longText": "map(s)/area/location", "size": 9 },
        { "shortText": "giving", "longText": "give/giving", "size": 8 },
        { "shortText": "appealing", "longText": "appealing", "size": 7 },
        { "shortText": "happened", "longText": "happened", "size": 7 },
        { "shortText": "relevant", "longText": "relevant", "size": 7 },
        { "shortText": "feel", "longText": "feel", "size": 6 },
        { "shortText": "memorable", "longText": "memorable/remember", "size": 6 },
        { "shortText": "works", "longText": "work(s/ed)", "size": 6 },
        { "shortText": "comprehensive", "longText": "full/entire/comprehensive", "size": 6 },
        { "shortText": "people", "longText": "people", "size": 5 },
        { "shortText": "time", "longText": "time", "size": 5 },
        { "shortText": "engaging", "longText": "engag(ed/ing)", "size": 5 },
        { "shortText": "graphs", "longText": "graph(s)", "size": 5 },
        { "shortText": "impact", "longText": "impact(ful)", "size": 5 },
        { "shortText": "important", "longText": "important", "size": 5 },
        { "shortText": "picture", "longText": "picture/image(s)/depiction", "size": 5 },
        { "shortText": "cool", "longText": "cool(er)", "size": 5 },
        { "shortText": "compelling", "longText": "compelling", "size": 4 },
        { "shortText": "hear", "longText": "hear(ing)", "size": 4 },
        { "shortText": "simple", "longText": "simple", "size": 4 },
        { "shortText": "subject", "longText": "subject/topic(s)", "size": 4 },
        { "shortText": "provide", "longText": "provide(s/d)", "size": 4 },
        { "shortText": "attractive", "longText": "attractive", "size": 4 },
        { "shortText": "boring", "longText": "(less) boring", "size": 4 },
        { "shortText": "broke", "longText": "broke (up the story)", "size": 3 },
        { "shortText": "eye", "longText": "eye", "size": 3 },
        { "shortText": "fact", "longText": "fact", "size": 3 },
        { "shortText": "love", "longText": "love", "size": 3 },
        { "shortText": "illustrate", "longText": "illustrate/illustration", "size": 3 },
        { "shortText": "caught", "longText": "catch(ing)/caught", "size": 3 },
    ];

    // sort here if nec
    // let kw_data_sorted = data.sort(function (b, a) {
    //     return a.Value - b.Value;
    //});

    // console.log(kw_data_sorted);


    //LOLLIPOP CHART

    // set up canvas by grabbing base svg 
    lolly.margin = { top: 0, right: 50, bottom: 50, left: 200 };
    lolly.svg = d3.select('#lollipop');
    lolly.width = lolly.svg.attr('width');
    lolly.height = lolly.svg.attr('height');
    lolly.innerWidth = lolly.width - lolly.margin.left - lolly.margin.right;
    lolly.innerHeight = lolly.height - lolly.margin.top - lolly.margin.bottom;

    //set up group for the drawing
    lolly.g = lolly.svg.append('g')
    // .attr('transform', `translate(${lolly.margin.left},${lolly.margin.top})`);

    //Create an array for the domain
    lolly.domainArrayLong = kw_data.map(function (d) { return d.longText; });

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
        .call(d3.axisBottom(lolly.xScale))
        .selectAll('text', 'g')
        .attr('classed', 'axis-label', true)
        .attr('transform', 'translate(2,0)')
        .style('text-anchor', 'center');

    // Draw Y axis, add labels
    lolly.yAxis = lolly.svg.append('g')
        .classed('axis', true)
        .attr("transform", `translate(${lolly.margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .attr('classed', 'axis-label', true)
        // .attr('transform', 'translate(0,0)')
        .style('text-anchor', 'end');

    // axis.tickSize(0);

    // Add lollipop lines
    lolly.lines = lolly.svg.selectAll('lollyLine')
        .data(kw_data)
        .join('line')
        // .attr("transform", `translate(-30, -30)`)
        .attr("x1", lolly.margin.left)
        .attr("x2", function (d) { return lolly.xScale(d.size); })
        .attr("y1", function (d) { return yScale(d.longText); })
        .attr("y2", function (d) { return yScale(d.longText); })
        .attr("stroke", function (d, i) { return color(i); })
        .attr('opacity', 0.2)
        .attr('stroke-width', 40)
        //INTCTV LINK
        .on('mouseover', function (e, d) {
            let itemL = d.longText;
            let itemC = d.shortText;

            // lolly.lines.attr('opacity', 0.2);
            lolly.pops.attr('opacity', 0.2);
            hoverCloud.attr('opacity', 0.2);

            d3.select(this)
                .attr('opacity', 1);
                // .attr('stroke-width', 5);

            lolly.pops.filter(function (dd) {
                return dd.longText === itemL;
            }).attr('opacity', 1);

            hoverCloud.filter(function (dd) {
                return dd.shortText === itemC;
            }).attr('opacity', 1);

        })
        .on('mouseout', function () {

            hoverCloud.attr('opacity', 1);
            lolly.pops.attr('opacity', 1);
            lolly.lines.attr('opacity', 1);

        });

    // Add lollipop circles
    lolly.pops = lolly.svg.selectAll("circle")
        .data(kw_data)
        .join("circle")
        .attr("cx", function (d) { return lolly.xScale(d.size); })
        .attr("cy", function (d) { return yScale(d.longText); })
        .attr("r", "20")
        .style("fill", function (d, i) { return color(i); })
        .attr("stroke", "none")
        .classed('hoverPops', true)
        //INTCTV LINK
        .on('mouseover', function (e, d) {
            let item = d.shortText;

            lolly.lines.attr('opacity', 0.2);
            // lolly.pops.attr('opacity', 0.2);
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

            lolly.lines
                .attr('opacity', 0.2);
                // .attr('stroke-width', 1);
            lolly.pops.attr('opacity', 1);
            hoverCloud.attr('opacity', 1);

        });


    //WORD CLOUD

    //dimensions for the cloud; make sure to account for varying rotations of long edge words!
    wc.width = lolly.width / 2;
    wc.height = lolly.height / 2;

    //filter down the data to just the short word versions and values
    let kw_data_cloudFilt = kw_data.filter(function (d) {
        return d.shortText, d.size;
    })

    //set up the layout

    wc.layout = d3.layout.cloud()
        .size([wc.width, wc.height])
        .words(kw_data_cloudFilt)
        .padding(2)
        .rotate(function () { return (~~(Math.random() * 6) - 2) * 20; })
        .font("Open Sans")
        .fontSize(function (d) { return d.size + 10; })
        .spiral("archimedean")
        //call draw function
        .on("end", draw);

    wc.layout.start();

    //Draw function
    function draw(data) {
        d3.select("#lollipop")
            .append("g")
            .attr("transform", "translate(" + (wc.width + lolly.xScale(0)) + "," + (wc.height) + ")")
            .attr('z-index', '2')
            .selectAll("text")
            .data(kw_data)
            .join("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Open Sans")
            .style("fill", function (d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .classed('cloud', true)
            .classed('hoverCloud', true)
            .text(function (d) { return d.shortText; })

    }; //draw fn

    //grab cloud elements for the hover intxn
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
                // .attr('stroke-width', 5)
                .attr('opacity', 1);

            lolly.pops.filter(function (dd) {
                return dd.longText === item;
            }).attr('opacity', 1);

            d3.select(this)
                .attr('opacity', 1);

        })
        .on('mouseout', function () {

            lolly.lines
                // .attr('stroke-width', 1)
                .attr('opacity', 0.2)
            lolly.pops.attr('opacity', 1);
            hoverCloud.attr('opacity', 1);

        });

});//on documentReady
