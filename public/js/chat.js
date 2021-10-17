const socket = io()

const username = "username"
const room = "room"

let started = false;
let data = [];
function exec(inputdata) {

    inputdata.forEach((element) => {
        data.push(element)
    });

    if (!started) {
        started = true

        var margin = { top: 50, right: 50, bottom: 20, left: 100 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .domain([0, 100])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([d3.min(data), d3.max(data)])
            .range([height, 0]);

        var line = d3.svg.line()
            .x(function (d, i) { return x(i); })
            .y(function (d, i) { return y(d); });


        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        var path = svg.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        tick();

        function tick() {
            // redraw the line, and slide it to the left
            path
                .attr("d", line)
                .attr("transform", null)
                .transition()
                .duration(1)
                .ease("linear")
                .attr("transform", "translate(" + x(-1) + ",0)")
                .each("end", tick);

            // pop the old data point off the front
            data.shift();
            console.log("Data length", data.length)
        }
    }
}

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('message', (inputmessage) => {
    exec(inputmessage);
})
