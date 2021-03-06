//===================================================
// Helper functions
//
// calculate mean and standard deviation of the array
function meanAndStd(array) {
    var num = 0;
    var l = array.length;
    for (var i = 0; i < l; i++) {
        num += array[i];
    }
    var avg = num / l;

    var StdSum = 0;
    for (var i = 0; i < l; i++) {
        StdSum += Math.pow((array[i] - avg), 2);
    }
    var std = Math.sqrt(StdSum / l);
    return [avg, std]
}

function plotAllHeatmap(data, games, data_field) {
    // initialization ---------------------------------------------
    var colorLow = 'green',
        colorMed = 'yellow',
        colorHigh = 'red',
        colorLine = "#9966ff",
        colorUnavailable = "#ebebe0";

    // draw heatmap for each graph
    for (var i = 0; i < data.length; i++) {
        var domainRange = [data[i]["min_" + data_field] == NaN ? -100 : data[i]["min_" + data_field], data[i]["max_" + data_field] == NaN ? 100 : data[i]["max_" + data_field]];
        //console.log("domain:" + data[i]["min_" + data_field] + " " + data[i]["max_" + data_field]);

        var colorScale = d3.scale.linear()
            .domain(domainRange)
            .range([colorLow, colorMed, colorHigh]);

        // calculate single data entry rect width
        div_heatmap = document.getElementById("heatmap");
        heatmap_length = data[i]["data"].length;
        data_height = 50;
        data_width = div_heatmap.offsetWidth / heatmap_length;

        // draw the heatmap data by data
        // create new that does not match with data
        var rects = d3.select("#heatmap").selectAll("svg").filter(".heatmap_figure_" + games[i]).selectAll("rect")

        rects.data(data[i]["data"])
            .enter().append("rect")
            .attr("x", function(d) { return d.col * data_width; })
            .attr("y", 0)
            .attr("width", function(d) { return data_width; })
            .attr("height", function(d) { return data_height; })
            .style("fill", function(d) {
                if (d[data_field] == NaN || d[data_field] == -1) {
                    return colorUnavailable;
                }
                return colorScale(d[data_field]);
            });

        // update those existed rect
        rects.data(data[i]["data"])
            .attr("x", function(d) { return d.col * data_width; })
            .attr("y", 0)
            .attr("width", function(d) { return data_width; })
            .attr("height", function(d) { return data_height; })
            .style("fill", function(d) {
                if (d[data_field] == NaN || d[data_field] == -1) {
                    return colorUnavailable;
                }
                return colorScale(d[data_field]);
            });

        // TODO: add animation
    }

}

// single game data
function plotAllEventline(data, games, data_field) {
    // initialization
    var r = 5;
    var line_width = 3;
    var line_color;
    var circle_color = "black";
    var yPos = 25;
    var isCircle = false;


    // draw eventline for each graph
    for (var i = 0; i < data.length; i++) {

        // Initialization based on each game data ----------------------------
        // calculate single game event
        div_heatmap = document.getElementById("heatmap");
        eventline_length = data[i]["data"].length;
        var data_width = div_heatmap.offsetWidth / eventline_length;

        // Event handler -----------------------------------------------------
        // Create Event Handlers for mouse hover on the single event datum
        function handleMouseOverEventCircle(d, i) {

            // Use D3 to select element, change color and size
            d3.select(this).attr({
                fill: "purple",
                r: r * 4
            });

            // TODO: update info box
        }

        function handleMouseOutEventCircle(d, i) {
            var count = 0;
            if (d["game_updates"] != undefined && d["game_updates"].length != 0) count++;
            if (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) count++;

            // Use D3 to select element, change color back to normal
            d3.select(this).attr({
                fill: circle_color,
                r: r * count
            });
        }

        function handleMouseOverEventRect(d, i) {

            // Use D3 to select element, change color and size
            d3.select(this).attr({
                fill: "purple",
                y: yPos - 2 * r,
                height: r * 4
            });

            // TODO: update info box
        }

        function handleMouseOutEventRect(d, i) {
            var count = 0;
            if (d["game_updates"] != undefined && d["game_updates"].length != 0) count++;
            if (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) count++;

            // Use D3 to select element, change color back to normal
            d3.select(this).attr({
                fill: "black",
                y: yPos - count * r / 2,
                height: count * r
            });
        }

        // ------------------------------------------------------------------

        var svg_eventline = d3.select("#heatmap").selectAll("svg").filter(".eventline_figure_" + games[i])
        svg_eventline.selectAll("line")
            .data([1])
            .enter()
            .append("line")
            .attr("x1", 0)
            .attr("y1", yPos)
            .attr("x2", div_heatmap.offsetWidth)
            .attr("y2", yPos)
            .attr("stroke-width", line_width)
            .attr("stroke", "black");


        if (isCircle) {
            // draw circles for events of each date ---------------------------- Circle version
            var circles = svg_eventline.selectAll("circle")
                .data(data[i]["data"]);

            circles.exit().remove();

            circles.enter()
                .append("circle")
                .filter(function(d) { // filter out those data without events
                    return (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) ||
                        (d["game_updates"] != undefined && d["game_updates"].length != 0);
                })
                .attr("r", function(d) {
                    var count = 0;
                    if (d["game_updates"] != undefined && d["game_updates"].length != 0) count++;
                    if (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) count++;
                    return count * r;
                })
                .attr("cx", function(d) { return data_width * d.col; })
                .attr("cy", function(d) { return yPos; })

                // handle mouse hover & out events
                .on("mouseover", handleMouseOverEventCircle)
                .on("mouseout", handleMouseOutEventCircle);
        } else {
            // draw rectangle for events of each date ---------------------------- Rectangle version
            var rects = svg_eventline.selectAll("rect")
                .data(data[i]["data"]);

            rects.exit().remove();

            rects.enter()
                .append("rect")
                .filter(function(d) { // filter out those data without events
                    return (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) ||
                        (d["game_updates"] != undefined && d["game_updates"].length != 0);
                })

                .attr("x", function(d) { return d.col * data_width; })
                .attr("y", function(d) {
                    var count = 0;
                    if (d["game_updates"] != undefined && d["game_updates"].length != 0) count++;
                    if (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) count++;
                    return yPos - count * r / 2;
                })
                .attr("width", function(d) { return data_width; })
                .attr("height", function(d) {
                    var count = 0;
                    if (d["game_updates"] != undefined && d["game_updates"].length != 0) count++;
                    if (d["esports_schedule"] != undefined && d["esports_schedule"].length != 0) count++;
                    return count * r;
                })

                // handle mouse hover & out events
                .on("mouseover", handleMouseOverEventRect)
                .on("mouseout", handleMouseOutEventRect);


            // TODO: add animation
        }
    }
}

// format data read from csv
function formatData(data) {
    // Data structure
    // Dimension 1: games
    // Dimension 2: data attributes json
    // Dimension 3: single data entry -> json

    // Consistent with header in csv file
    // data entries:
    // 1. date
    // 2. average_viewers
    // 3. peak_viewers
    // 4. peak_channels
    // 5. peak_players
    // 6. game_rank_total
    // 7. game_rank_esports
    // 8. game_updates,esports_schedule
    dataFields = ["date",
        "average_viewers",
        "peak_viewers",
        "peak_channels",
        "peak_players",
        "game_rank_total",
        "game_rank_esports",
        "game_updates",
        "esports_schedule"
    ]

    var prdData = [];

    for (var i = 0; i < data.length; i++) {
        var data_single_game = { "data": [] };
        min_avg_viewers = Number.MAX_VALUE;
        min_peak_viewers = Number.MAX_VALUE;
        min_peak_channels = Number.MAX_VALUE;
        min_peak_players = Number.MAX_VALUE;
        min_game_rank_total = Number.MAX_VALUE;
        min_game_rank_esports = Number.MAX_VALUE;

        max_avg_viewers = Number.MIN_VALUE;
        max_peak_viewers = Number.MIN_VALUE;
        max_peak_channels = Number.MIN_VALUE;
        max_peak_players = Number.MIN_VALUE;
        max_game_rank_total = Number.MIN_VALUE;
        max_game_rank_esports = Number.MIN_VALUE;

        for (var j = 0; j < data[i].length; j++) {
            //try {


            dataEntry = {
                "date": new Date(data[i][j]["date"]),
                "game_updates": data[i][j]['game_updates'],
                "esports_schedule": data[i][j]['esports_schedule'],
                "row": i, // used to locate heatmap pos
                "col": j, // used to locate heatmap pos
            };


            average_viewers = parseInt(data[i][j]['average_viewers']);
            peak_viewers = parseInt(data[i][j]['peak_viewers']);
            peak_channels = parseInt(data[i][j]['peak_channels']);
            peak_players = parseInt(data[i][j]['peak_players']);
            game_rank_total = parseInt(data[i][j]['game_rank_total']);
            game_rank_esports = parseInt(data[i][j]['game_rank_esports']);

            min_avg_viewers = average_viewers == -1 ? min_avg_viewers : Math.min(min_avg_viewers, average_viewers);
            min_peak_viewers = peak_viewers == -1 ? min_peak_viewers : Math.min(min_peak_viewers, peak_viewers);
            min_peak_channels = peak_channels == -1 ? min_peak_channels : Math.min(min_peak_channels, peak_channels);
            min_peak_players = peak_players == -1 ? min_peak_players : Math.min(min_peak_players, peak_players);
            min_game_rank_total = game_rank_total == -1 ? min_game_rank_total : Math.min(min_game_rank_total, game_rank_total);
            min_game_rank_esports = game_rank_total == -1 ? min_game_rank_esports : Math.min(min_game_rank_esports, game_rank_total);

            max_avg_viewers = average_viewers == -1 ? max_avg_viewers : Math.max(max_avg_viewers, average_viewers);
            max_peak_viewers = peak_viewers == -1 ? max_peak_viewers : Math.max(max_peak_viewers, peak_viewers);
            max_peak_channels = peak_channels == -1 ? max_peak_channels : Math.max(max_peak_channels, peak_channels);
            max_peak_players = peak_players == -1 ? max_peak_players : Math.max(max_peak_players, peak_players);
            max_game_rank_total = game_rank_total == -1 ? max_game_rank_total : Math.max(max_game_rank_total, game_rank_total);
            max_game_rank_esports = game_rank_total == -1 ? max_game_rank_esports : Math.max(max_game_rank_esports, game_rank_total);

            dataEntry["average_viewers"] = average_viewers;
            dataEntry["peak_viewers"] = peak_viewers;
            dataEntry["peak_channels"] = peak_channels;
            dataEntry["peak_players"] = peak_players;
            dataEntry["game_rank_total"] = game_rank_total;
            dataEntry["game_rank_esports"] = game_rank_esports;

            data_single_game["data"].push(dataEntry);
            //} catch (e) {
            //    console.log(e);
            //}

        }

        data_single_game["min_avg_viewers"] = min_avg_viewers;
        data_single_game["max_avg_viewers"] = max_avg_viewers;
        data_single_game["min_peak_viewers"] = min_peak_viewers;
        data_single_game["max_peak_viewers"] = max_peak_viewers;
        data_single_game["min_peak_channels"] = min_peak_channels;
        data_single_game["max_peak_channels"] = max_peak_channels;
        data_single_game["min_peak_players"] = min_peak_players;
        data_single_game["max_peak_players"] = max_peak_players;
        data_single_game["min_game_rank_total"] = min_game_rank_total;
        data_single_game["max_game_rank_total"] = max_game_rank_total;
        data_single_game["min_game_rank_esports"] = min_game_rank_esports;
        data_single_game["max_game_rank_esports"] = max_game_rank_esports;

        prdData.push(data_single_game);
    }

    return prdData;
}



function dataProcessing(error, data) {
    // detect whether it reads csv file correctly
    if (error) throw error;

    var gameColors = ["#5F8316", "#98CA32", "#B3BF0D", "#F7D302", "#DAC134"];

    div_heatmap = document.getElementById("heatmap");

    // create svg if they are not existing for each game
    var groups = d3.select("#heatmap").selectAll("div").data(games).enter()
        .append("div") // no matching with groups
        .attr("class", function(d) { return "heatmap_groups_" + d });

    console.log(groups);
    groups.append("svg")
        .attr("width", function() { return div_heatmap.offsetWidth; })
        .attr("height", 50)
        .attr("class", function(d) { return "eventline_figure_" + d; })
    groups.append("svg")
        .attr("width", function() { return div_heatmap.offsetWidth; })
        .attr("height", 50)
        .attr("class", function(d) { return "heatmap_figure_" + d; })


    // parse data from pure string to corresponding data type
    data = formatData(data);
    data_all_games = data;

    dataField = "peak_viewers"; // default field to show
    plotAllEventline(data, games, dataField);
    plotAllHeatmap(data, games, dataField);
}

// Events handler -----------------------------------


// ==================================================
function dataProcessing2(error, gdata) {
    // detect whether it reads csv file correctly
    if (error) throw error;

    data_all_games = gdata;

    //start and end data of general dataset
    var StartTime = new Date("2016/9/8");
    var EndTime = new Date("2017/9/8");

    var HmapLength = 3 * 366;
    var heatMapWidth = document.getElementById("");

    var games = ["Overwatch", "CSGO", "PUBG", "Destiny", "Destiny2"];
    var gameColors = ["#5F8316", "#98CA32", "#B3BF0D", "#F7D302", "#DAC134"];

    //can be changed based on user selection
    //selected start time and selected end time
    var SSTime = new Date("2016/9/8");
    var SETime = new Date("2017/9/8");

    var HmapAvg = 0;
    var HmapStd = 0;

    var HMfont = "Helvetica";

    function prepareDataForHeatmap(gData, attribute) {
        // when the end time is earlier than start time: swap
        if (SETime < SSTime) {
            var temp = SSTime;
            SSTime = SETime;
            SETime = temp;
        }

        // deal with corner case:
        // 1. selected end time is later than overall data end time
        // 2. selected start time is earlier than the overall data star time
        if (SETime > EndTime) { SETime = EndTime; }
        if (SSTime < StartTime) { SSTime = StartTime }


        var startPt = parseInt((SSTime - StartTime) / 86400000);
        var endPt = parseInt((SETime - StartTime) / 86400000);
        var effN = 0;
        var sum = 0;
        var prdData = [];
        var numArray = [];
        for (j = 0; j < 5; j++) {
            var line = [];
            //console.log(gData[j])
            for (i = startPt; i <= endPt; i++) {
                var temp = parseInt(gData[j][i][attribute]);
                if (temp != -1) { numArray.push(temp); }
                line.push({
                    value: temp,
                    row: i,
                    col: j,
                    x: startPt + i,
                    date: gData[j][i]["Date"]
                });
            }
            //console.log(line)
            prdData.push(line);
        }

        var temp2 = meanAndStd(numArray);
        HmapAvg = temp2[0];
        HmapStd = temp2[1];

        //console.log(prdData)
        return prdData
    }

    function prepareDataForStarPlot(gData) {
        var propertyAry = [];
        var valueAry = [];
        for (var pN in gData) {
            if ((pN != "Game Rank (Total)") &&
                (pN != "Game Rank (Esports)") &&
                (pN != "Game Updates") &&
                (pN != "Events") &&
                (pN != "Competitive Seasons") &&
                (pN != "Esports Schedule") &&
                (pN != "Date")) {

                if ((gData[pN] != -1) && (gData[pN] != "Unavailable")) {
                    propertyAry.push(pN);
                    valueAry.push(gData[pN]);
                }
            }
        }
        console.log([propertyAry, valueAry])
        return [propertyAry, valueAry];
    }

    function updateInfoBoxHMap(infoData, settings) {
        var info = gdata[infoData.col][infoData.x];
        console.log(info);
    }

    function plotHeatmap(gameData) {
        /*var data = [
             { score: 0.5, row: 0, col: 0 },
             { score: 0.7, row: 0, col: 1 },
             { score: 0.2, row: 1, col: 0 },
             { score: 0.4, row: 1, col: 1 }
         ];*/

        //var data = gameData[0];

        var nBloc = gameData[0].length

        //height of each row in the heatmap
        //width of each column in the heatmap
        var h = 50, //rect height
            eLh = 50, //event line height
            LH = h + eLh, //total height for each game
            labelWidth = h, //width of the game label
            w = parseInt(HmapLength / nBloc), //rect width
            startH = 10, //first bar height
            totalH = LH * 5 + startH, //total height of the map
            dateH = 0; //start height for date text
        TandGPadding = 70; //space between text and graph

        var colorLow = 'green',
            colorMed = 'yellow',
            colorHigh = 'red',
            colorLine = "#9966ff",
            colorUnavailable = "#ebebe0";

        var margin = { top: 50, right: 80, bottom: 30, left: 5 },
            width = 1500 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom;

        console.log(HmapAvg);
        console.log(HmapStd);

        var colorScale = d3.scale.linear()
            .domain([HmapAvg - 1.5 * HmapStd, HmapAvg, HmapAvg + 1.5 * HmapStd])
            .range([colorLow, colorMed, colorHigh]);

        var svg = d3.select("#heatmap").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var clickHold = -1;
        //var savedX1 = -1;

        //Draw heatmap for data of each game
        for (i = 0; i < 5; i++) {
            var heatMap = svg.selectAll(".heatmap")
                .data(gameData[i], function(d) { return d.col + ':' + d.row; })
                .enter().append("svg:rect")
                .attr("x", function(d) { return d.row * w + labelWidth + TandGPadding; })
                .attr("y", function(d) { return startH + d.col * LH; })
                .attr("width", function(d) { return w; })
                .attr("height", function(d) { return h; })
                .style("fill", function(d) {
                    if (d.value == -1) {
                        return colorUnavailable;
                    }
                    return colorScale(d.value);
                })

                .on("mouseover", function(d) {
                    svg.append("line")
                        .attr("class", "mol")
                        .attr("x1", d.row * w + labelWidth + TandGPadding)
                        .attr("y1", startH)
                        .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2)
                        .attr("y2", totalH)
                        .attr("stroke-width", 2)
                        .attr("stroke", "#9966ff")
                        .attr("stroke-opacity", 0.8);
                    svg.append("text")
                        .attr("y", dateH)
                        .attr("x", d.row * w + labelWidth + TandGPadding + w / 2)
                        .attr("class", "hover")
                        .attr("text-anchor", "middle")
                        .attr("font-family", "Helvetica")
                        .attr("font-size", "15px")
                        .style("fill", colorLine)
                        .text(d.date);

                    if (clickHold == -1) {
                        updateInfoBoxHMap(d, 0);
                    }
                })

                .on("mouseout", function(d) {
                    svg.select("line.mol").remove();
                    svg.select("text.hover").remove();
                    if (clickHold == -1) {
                        updateInfoBoxHMap(d, -1);
                    }
                })

                .on("click", function(d) {
                    if (clickHold == -1) {
                        svg.append("line")
                            .attr("class", "cl")
                            .attr("x1", d.row * w + labelWidth + TandGPadding)
                            .attr("y1", startH)
                            .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2)
                            .attr("y2", totalH)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);
                        svg.append("text")
                            .attr("y", dateH)
                            .attr("x", d.row * w + labelWidth + TandGPadding + w / 2)
                            .attr("class", "click")
                            .attr("text-anchor", "middle")
                            .attr("font-family", HMfont)
                            .attr("font-size", "15px")
                            .style("fill", colorLine)
                            .text(d.date);
                        //savedX1 = d.row * w + labelWidth + TandGPadding;
                        clickHold = 0;
                        updateInfoBoxHMap(d, 1);

                    } else if (clickHold == 0) {
                        svg.append("line")
                            .attr("class", "cl")
                            .attr("x1", d.row * w + labelWidth + TandGPadding)
                            .attr("y1", startH)
                            .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2)
                            .attr("y2", totalH)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);
                        svg.append("text")
                            .attr("y", 0)
                            .attr("x", d.row * w + labelWidth + TandGPadding + w / 2)
                            .attr("class", "click")
                            .attr("text-anchor", "middle")
                            .attr("font-family", HMfont)
                            .attr("font-size", "15px")
                            .style("fill", colorLine)
                            .text(d.date);
                        /* var x2 = d.row * w + labelWidth + TandGPadding + w;
                       var startRect = savedX1;
                       var widthRect = Math.abs(x2-savedX1);
                        if (savedX1 > x2){
                            startRect = x2;
                        }
                        svg.append("rect")
                            .attr("class","selection")
                            .attr("x", startRect)
                            .attr("y", startH)
                            .attr("width", widthRect)
                            .attr("height", totalH-startH)
                            .style("fill",colorLine)
                            .style("fill-opacity",0.1); 
                        */
                        clickHold = 1;
                        updateInfoBoxHMap(d, 2);

                    } else if (clickHold == 1) {
                        svg.select("line.cl").remove();
                        svg.select("line.cl").remove();
                        svg.select("text.click").remove();
                        svg.select("text.click").remove();
                        //svg.select("rect.selection").remove();

                        svg.append("line")
                            .attr("class", "cl")
                            .attr("x1", d.row * w + labelWidth + TandGPadding)
                            .attr("y1", startH)
                            .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2)
                            .attr("y2", totalH)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);

                        svg.append("text")
                            .attr("y", 0)
                            .attr("x", d.row * w + labelWidth + TandGPadding + w / 2)
                            .attr("class", "click")
                            .attr("text-anchor", "middle")
                            .attr("font-family", HMfont)
                            .attr("font-size", "15px")
                            .style("fill", colorLine)
                            .text(d.date);
                        //savedX1 = d.row * w + labelWidth + TandGPadding;    
                        clickHold = 0;
                        updateInfoBoxHMap(d, 1);
                    }
                });
        }

        /*var imgs = svg.selectAll(".heatmap").data([0]);
            imgs.enter()
            .append("svg:image")
            .attr("xlink:href", "Resource/ow_logo.png")
            .attr("x", "10")
            .attr("y", "0")
            .attr("width", h)
            .attr("height", h);

        var imgs2 = svg.selectAll(".heatmap").data([0]);
            imgs2.enter()
            .append("svg:image")
            .attr("xlink:href", "Resource/csgo_logo.jpg")
            .attr("x", "0")
            .attr("y", 2*h)
            .attr("width", h+20)
            .attr("height", h);

        var imgs3 = svg.selectAll(".heatmap").data([0]);
            imgs3.enter()
            .append("svg:image")
            .attr("xlink:href", "Resource/pubg_logo.png")
            .attr("x", "0")
            .attr("y", 4*h)
            .attr("width", h+20)
            .attr("height", h);

        var imgs4 = svg.selectAll(".heatmap").data([0]);
            imgs4.enter()
            .append("svg:image")
            .attr("xlink:href", "Resource/destiny_logo.jpg")
            .attr("x", "0")
            .attr("y", 6*h)
            .attr("width", h)
            .attr("height", h);*/

        for (i = 0; i < 5; i++) {
            var text = svg.selectAll(".heatmap").data([0]);
            text.enter()
                .append("svg:text")
                .attr("text-anchor", "middle")
                .attr("font-family", HMfont)
                .attr("class", "gameLabel")
                .attr("dy", ".30em")
                .attr("x", (labelWidth + TandGPadding) / 2)
                .attr("y", i * LH + h / 2 + startH)
                .attr("fill-opacity", 0.95)
                .text(games[i])
                .style('fill', gameColors[i])
                .style("font-size", "20px");
        }
    }

    function plotStar(gameData, propertyAry) {}


    prepareDataForStarPlot(gdata[0][1]);
    plotStar();
    var gD = prepareDataForHeatmap(gdata, "Peak Viewers")
    plotHeatmap(gD);
}

// ============================================================
// data processing
// 
fileNames = ["overwatch", "csgo", "pubg", "destiny", "destiny2"]
data_all_games = []; // data of all games: initialized by loadData()

function loadData() {
    queue()
        .defer(d3.csv, "../data2/Overwatch.csv")
        .defer(d3.csv, "../data2/CSGO.csv")
        .defer(d3.csv, "../data2/PUBG.csv")
        .defer(d3.csv, "../data2/Destiny.csv")
        .defer(d3.csv, "../data2/Destiny2.csv")
        .awaitAll(dataProcessing); //only function name is needed
}

// initializations -------------------------------------------------
var mainpage_attributes_activebutton;
var games = ["overwatch", "csgo", "pubg", "destiny", "destiny2"];


$("#mainpage_attributes button").click(active);

var d;

function active(e) {
    id = $(e.target.parentElement).attr("id");
    datafield = $(e.target.parentElement).attr("data-field");
    if (mainpage_attributes_activebutton != null) {
        document.getElementById(mainpage_attributes_activebutton).style['background-color'] = '#eee';
        document.getElementById(mainpage_attributes_activebutton).style['color'] = '#000';
    }
    document.getElementById(id).style['background-color'] = 'green';
    document.getElementById(id).style['color'] = 'white';

    mainpage_attributes_activebutton = id;

    // replot all games
    d3.select("#heatmap").selectAll("svg")
        .data(games)
        .enter() // no matching with data
        .append("svg")
        .attr("width", function() { return div_heatmap.offsetWidth; })
        .append('g')
        .attr("width", function() { return div_heatmap.offsetWidth; })
        .attr("class", function(d) { return "heatmap_figure_" + d; })

    var svg_heatmaps = d3.select("#heatmap").selectAll("svg");

    plotAllHeatmap(data_all_games, games, datafield);
}

if (data_all_games.length == 0) {
    // data haven't been loaded yet
    loadData();
} else {
    // call dataProcessing directly
    // data has been loaded
    dataProcessing(null, data_all_games);

    // peak viewers as default in mainpage
    $("button_main_peak_viewers").click();
}