// Word cloud -- based on code from Jason Davies and Martin Braun
// https://www.jasondavies.com/wordcloud/
// https://jsbin.com/kiwojayoye/1/edit?html,js,output


$(document).ready(function () {
    var width = 500;
    var height = 500;

    var color = d3.scaleSequential()
        .domain([0,30])
        .interpolator(d3.interpolatePlasma);

    var words = [
        // { "text": "graphic(s)", "size": 77 },
        { "text": "visual(ly)", "size": 43 },
        { "text": "easy", "size": 41 },
        { "text": "makes", "size": 39 },
        { "text": "story(telling)", "size": 38 },
        { "text": "understand", "size": 35 },
        { "text": "information", "size": 34 },
        { "text": "animation", "size": 30 },
        { "text": "helpful", "size": 26 },
        { "text": "interesting", "size": 22 },
        { "text": "information", "size": 34 },
        { "text": "shows", "size": 17 },
        { "text": "details", "size": 16 },
        { "text": "point(s)", "size": 14 },
        { "text": "number(s)/data", "size": 13 },
        { "text": "clear(er)", "size": 34 },
        { "text": "follow", "size": 12 },
        { "text": "good/great", "size": 12 },
        { "text": "news", "size": 11 },
        { "text": "(pay) attention", "size": 11 },
        { "text": "statistic(s)/comparison", "size": 9 },
        { "text": "explain", "size": 9 },
        { "text": "map(s)/area", "size": 9 },
        { "text": "give", "size": 8 },
        { "text": "appealing", "size": 7 },
        { "text": "relevant", "size": 7 },
        { "text": "memorable", "size": 6 },
        { "text": "comprehensive", "size": 6 },

        //etc.,
    ];

    var vis = document.getElementById("wordcloud");
    var layout = d3.layout.cloud().size([width, height])
        .words(words)
        .padding(2)
        .rotate(function () { return (~~(Math.random() * 6) - 2) * 20; })
        .font("Open Sans")
        .fontSize(function (d) { return d.size + 10; })
        .spiral("archimedean")
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("#cloud").append("svg")
            .style("width", "100%")
            .style("height", height + "px")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMidYMin meet")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll("text")
            .data(words).enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Open Sans")
            .style("fill", function (d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; })
            ;
    }

});