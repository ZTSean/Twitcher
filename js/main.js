function DataProcessing(error, gdata) {
    //final variables
    document.body.style.backgroundColor = "white";

    // start and end data of general dataset
    var StartTime = new Date("2016/9/8");
    var EndTime = new Date("2017/9/8");

    //var HmapLength = 3 * 366;
    var divHeatmapLength = document.getElementById("heatmap").offsetWidth;
    var selectedAttributeMain = "PeakViews";

    var games = ["Overwatch", "CSGO", "PUBG", "Destiny", "Destiny2"]; // corresponding to the order of the file being processed in the queue
    //var gameColors = ["#5F8316", "#98CA32", "#B3BF0D", "#F7D302", "#DAC134"];
    //var gameColors = ["#5F8316", "#5F8316", "#5F8316", "#5F8316", "#5F8316"];
    var gameColors = ["5F40B0", "5F40B0", "5F40B0", "5F40B0", "5F40B0"];

    //can be changed based on user selection
    //selected start time and selected end time
    var SSTime = new Date("2016/9/8");
    var SETime = new Date("2017/9/8");

    var HmapAvg = 0;
    var HmapStd = 0;

    var HMfont = "Helvetica";


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

    function prepareDataForHeatmap(gData, attribute) {
        if (SETime < SSTime) {
            var temp = SSTime;
            SSTime = SETime;
            SETime = temp;
        }
        if (SETime > EndTime) {
            SETime = EndTime;
        }
        if (SSTime < StartTime) {
            SSTime = StartTime
        }


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
                if (temp == undefined || isNaN(temp)) temp = -1;
                if (temp != -1) {
                    numArray.push(temp);
                }
                line.push({
                    value: temp,
                    row: i,
                    col: j,
                    x: startPt + i,
                    date: gData[j][i]["Date"],
                    gameUpdates: gData[j][i]["Game Updates"],
                    esportsSchedule: gData[j][i]["Esports Schedule"],
                    competitiveSeasons: gData[j][i]["Competitive Seasons"],
                    game: games[j],
                    attribute: attribute
                });
            }
            //console.log(line)
            prdData.push(line);

            // update set date
        }

        var temp2 = meanAndStd(numArray);
        HmapAvg = temp2[0];
        HmapStd = temp2[1];

        //console.log(prdData)
        return prdData
    }

    function updateInfoBoxHMap(infoData, settings) {
        var info = null;
        if (infoData != null) info = gdata[infoData.col][infoData.x];
        var divInfobox = d3.selectAll("#infoboxHeatmap");
        var svg = d3.select("#heatmap").select("svg");

        if (settings == -1) {
            // state -1 : mouse out
            // remove all previous data
            divInfobox.selectAll("div.state_0").remove();
        } else if (settings == 0) {
            // state 0 : no clickhold -> show the information of rect that mouse is hovering on

            // if previous div is not the same
            /*
            var divState = divInfobox.selectAll("div.state_0").data([infoData], function(d) { return d.game + "_" + d.col + "_" + d.row + "_state_0"; });

            divState.exit().remove();
            var content = divState.enter()
                .append("div")
                .style("padding", "10px")
                .attr("class", "state_0 mdl-shadow--2dp")

            content.append("p")
                .text(function(d) { return "Game: " + d.game; })
            content.append("p")
                .text(function(d) { return "Date: " + (d.date != undefined && d.date.length > 0 ? d.date : ""); })

            content.append("p")
                .text(function(d) { return "Value: " + (d.value != undefined && d.value > 0 ? d.value + "" : "N/A"); })

            content.append("p")
                .text(function(d) { return "Esports Schedule: " + (d.esportsSchedule != undefined && d.esportsSchedule.length > 0 ? d.esportsSchedule : ""); });
            */

            divInfobox.selectAll("div.state_0").remove();

            divInfobox.append("div")
                .style("padding", "10px")
                .attr("class", "state_0 mdl-shadow--2dp");

            var content = divInfobox.selectAll("div.state_0");
            content.append("p").text("Info:")
            content.append("p").text("Game: " + infoData.game)
            content.append("p").text("Date: " + (infoData.date != undefined && infoData.date.length > 0 ? infoData.date : ""))
            content.append("p").text(infoData.attribute + ": " + (infoData.value != undefined && infoData.value > 0 ? infoData.value + "" : "N/A"))
            content.append("p").text("Game Updates: " + (infoData.gameUpdates != undefined && infoData.gameUpdates.length > 0 ? infoData.gameUpdates + "" : "N/A"))
            content.append("p").text("Competitive Seasons: " + (infoData.competitiveSeasons != undefined && infoData.competitiveSeasons.length > 0 ? infoData.competitiveSeasons + "" : "N/A"))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : "N/A"));

        } else if (settings == 1) {
            // state 1: 1 clickhold -> show the information of the clicked rect
            // if previous div is not the same
            /*
            var divState = divInfobox.selectAll("div.state_1").data([infoData], function(d) { return d.game + "_" + d.col + "_" + d.row + "_state_1"; });

            divState.exit().remove();
            var content = divState.enter()
                .append("div")
                .style("padding", "10px")
                .attr("class", "state_1 mdl-shadow--2dp")

            content.append("p")
                .text(function(d) { return "Game: " + d.game; })
            content.append("p")
                .text(function(d) { return "Date: " + (d.date != undefined && d.date.length > 0 ? d.date : ""); })

            content.append("p")
                .text(function(d) { return "Value: " + (d.value != undefined && d.value > 0 ? d.value + "" : "N/A"); })

            content.append("p")
                .text(function(d) { return "Esports Schedule: " + (d.esportsSchedule != undefined && d.esportsSchedule.length > 0 ? d.esportsSchedule : ""); });
            */
            divInfobox.selectAll("div.state_2").remove();
            divInfobox.selectAll("div.state_1").remove();
            divInfobox.selectAll("div.state_0").remove();

            divInfobox.append("div")
                .style("padding", "10px")
                .attr("class", "state_1 mdl-shadow--2dp");

            var content = divInfobox.selectAll("div.state_1");
            content.append("p").text("First Selection:")
            content.append("p").text("Game: " + infoData.game)
            content.append("p").text("Date: " + (infoData.date != undefined && infoData.date.length > 0 ? infoData.date : ""))
            content.append("p").text(infoData.attribute + ": " + (infoData.value != undefined && infoData.value > 0 ? infoData.value + "" : "N/A"))
            content.append("p").text("Game Updates: " + (infoData.gameUpdates != undefined && infoData.gameUpdates.length > 0 ? infoData.gameUpdates + "" : "N/A"))
            content.append("p").text("Competitive Seasons: " + (infoData.competitiveSeasons != undefined && infoData.competitiveSeasons.length > 0 ? infoData.competitiveSeasons + "" : "N/A"))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : "N/A"));

            // create button for reset

            content.append("button")
                .attr("class", "btn btn-secondary")
                .text("Reset")
                .on("click", function () {
                    svg.select("line.cl").remove();
                    svg.select("line.cl").remove();
                    svg.select("text.click").remove();
                    svg.select("text.click").remove();
                    updateInfoBoxHMap(infoData, 3)
                });
        } else if (settings == 2) {
            // state 2: 1 clickhold -> show the information of the second clicked rect
            // // if previous div is not the same
            /*
            var divState = divInfobox.selectAll("div.state_2").data([infoData], function(d) { return d.game + "_" + d.col + "_" + d.row + "_state_2"; });

            divState.exit().remove();

            if (divState.empty()) {
                var content = divState.enter()
                .append("div")
                .style("padding", "10px")
                .attr("class", "state_2 mdl-shadow--2dp");

            content.append("p")
                .text(function(d) { return "Game: " + d.game; })
            content.append("p")
                .text(function(d) { return "Date: " + (d.date != undefined && d.date.length > 0 ? d.date : ""); })

            content.append("p")
                .text(function(d) { return "Value: " + (d.value != undefined && d.value > 0 ? d.value + "" : "N/A"); })

            content.append("p")
                .text(function(d) { return "Esports Schedule: " + (d.esportsSchedule != undefined && d.esportsSchedule.length > 0 ? d.esportsSchedule : ""); });

            }
            */

            divInfobox.selectAll("div.state_2").remove();

            divInfobox.append("div")
                .style("padding", "10px")
                .attr("class", "state_2 mdl-shadow--2dp");

            var content = divInfobox.selectAll("div.state_2");
            content.append("p").text("Second Selection:")
            content.append("p").text("Game: " + infoData.game)
            content.append("p").text("Date: " + (infoData.date != undefined && infoData.date.length > 0 ? infoData.date : ""))
            content.append("p").text(infoData.attribute + ": " + (infoData.value != undefined && infoData.value > 0 ? infoData.value + "" : "N/A"))
            content.append("p").text("Game Updates: " + (infoData.gameUpdates != undefined && infoData.gameUpdates.length > 0 ? infoData.gameUpdates + "" : "N/A"))
            content.append("p").text("Competitive Seasons: " + (infoData.competitiveSeasons != undefined && infoData.competitiveSeasons.length > 0 ? infoData.competitiveSeasons + "" : "N/A"))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : "N/A"));

            content.append("button")
                .attr("class", "btn btn-secondary")
                .text("Reset")
                .on("click", function () {
                    svg.select("line.cl").remove();
                    svg.select("line.cl").remove();
                    svg.select("text.click").remove();
                    svg.select("text.click").remove();
                    updateInfoBoxHMap(infoData, 3)
                });

        } else if (settings == 3) {
            // state 3: remove all info box
            divInfobox.selectAll("div.state_2").remove();
            divInfobox.selectAll("div.state_1").remove();
            divInfobox.selectAll("div.state_0").remove();
        } else if (settings == 4) {
            // state 4: mouse over event circle
            divInfobox.selectAll("div.state_0").remove();

            divInfobox.append("div")
                .style("padding", "10px")
                .attr("class", "state_0 mdl-shadow--2dp");

            var content = divInfobox.selectAll("div.state_0");
            content.append("p").text("Event Detail:")
            content.append("p").text("Game: " + infoData.game)
            content.append("p").text("Date: " + (infoData.date != undefined && infoData.date.length > 0 ? infoData.date : ""))
            content.append("p").text("Game Updates: " + (infoData.gameUpdates != undefined && infoData.gameUpdates.length > 0 ? infoData.gameUpdates + "" : "N/A"))
            content.append("p").text("Competitive Seasons: " + (infoData.competitiveSeasons != undefined && infoData.competitiveSeasons.length > 0 ? infoData.competitiveSeasons + "" : "N/A"))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : "N/A"));


        }

    }

    function plotHeatmap(gameData) {
        data_all_games = gameData;
        /*var data = [
             { score: 0.5, row: 0, col: 0 },
             { score: 0.7, row: 0, col: 1 },
             { score: 0.2, row: 1, col: 0 },
             { score: 0.4, row: 1, col: 1 }
         ];*/

        // initialization -------------------------------------

        var nBloc = gameData[0].length

        var heatmapMargin = {top: 30, right: 30, bottom: 50, left: 5}

        //height of each row in the heatmap
        //width of each column in the heatmap

        var h = 50, //rect height
            eLh = 20, //event line height
            //LH = h + eLh, //total height for each game's rect
            labelWidth = h, //width of the game label
            width = divHeatmapLength, // width of whole graph
            TandGPadding = 40, //space between text and graph
            HmapLength = Math.max(0, width - labelWidth - TandGPadding - heatmapMargin.left - heatmapMargin.right),
            w = HmapLength / nBloc, //rect width
            gameMargin = 55, // margin after each game's plot
            dateH = 5; //start height for date text
        var totalH = (h + gameMargin) * gameData.length + 9 * eLh; //total height of the map: no margin
        var height = totalH + heatmapMargin.top + heatmapMargin.bottom; // height of whole graph
        var eventlineWidth = 3;
        var eventBubbleRadius = 5;

        // -----------------------------------------------------

        var colorLow = 'green',
            colorMed = 'yellow',
            colorHigh = 'red',
            colorLine = "#9966ff",
            colorUnavailable = "#ebebe0",
            colorEventBubble = "purple";

        var legendRectSize = 18;
        var legendSpacing = 4;

        var eventNames = ["gameUpdates", "competitiveSeasons", "esportsSchedule"];
        var eventNamesForLegend = ["Game Update", "Competitive Season", "Esports Schedule"];
        var eventSymbols = ["triangle-up", "circle", "diamond"];

        //console.log(HmapAvg);
        //console.log(HmapStd);

        var colorScale = d3.scale.linear()
            .domain([HmapAvg - 1.5 * HmapStd, HmapAvg, HmapAvg + 1.5 * HmapStd])
            .range([colorLow, colorMed, colorHigh]);

        // create svg for heatmap if not exist
        d3.select("#heatmap").selectAll("svg")
            .data([1]) // if svg exist, no new append
            .enter()
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        var svg = d3.select("#heatmap").select("svg");

        var clickHold = -1;
        //var savedX1 = -1;

        var cumulativeHeight = heatmapMargin.top;


        // eventName: 0 => updates, 1 => competitive season 2 => esports
        // eventName: 0 => updates, 1 => competitive season 2 => esports
        function drawEventBubbles(data, game, eventNameId, gameColor, height) {

            function handleEventHover(d, i) {
                // Use D3 to select element, change color and size
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                updateInfoBoxHMap(d, 4);
            }

            function handleEventOut(d, i) {
                // Use D3 to select element, change color back to normal

                d3.select(this)
                //.style("stroke", gameColor);
                    .style("stroke", "");

                updateInfoBoxHMap(d, -1);
            }

            // // remove all previous event bubble ---------------------------------
            svg.selectAll(".heatmap_event_" + game).selectAll(".eventid_" + eventNameId).remove();

            // create new bubbles shapes depends on the event type
            svg.selectAll(".heatmap_event_" + game).data([0]).enter().append("g").attr("class", "heatmap_event_" + game);

            var eventlineBubbles = svg.selectAll("g.heatmap_event_" + game).selectAll("path.eventid_" + eventNameId).data(data);
            var minRow = Math.min.apply(Math, data.map(function (o) {
                return o.row;
            }));

            eventlineBubbles.enter()
                .append("path")
                .filter(function (d) { // filter out those data without events
                    return (d[eventNames[eventNameId]] != undefined && d[eventNames[eventNameId]].length > 0);
                })
                .attr("class", "eventid_" + eventNameId)
                .attr("d", d3.svg.symbol().type(function (d) {
                    return eventSymbols[eventNameId];
                }))
                .attr("transform", function (d) {
                    return "translate(" +
                        (labelWidth + TandGPadding + w * (d.row - minRow) + heatmapMargin.left) + "," +
                        (eLh / 2 + cumulativeHeight) + ")";
                })
                .style("fill-opacity", 0.45)
                //.style("stroke", gameColor)
                .style("fill", gameColor)

                // handle hover event
                .on("mouseover", handleEventHover)
                .on("mouseout", handleEventOut)

            /*
            // draw dash line from the symbol center to the rect
            eventlineBubbles.enter()
                .append('line')
                .filter(function (d) { // filter out those data without events
                    return (d[eventNames[eventNameId]] != undefined && d[eventNames[eventNameId]].length > 0);
                })
                .attr("class", "eventid_" + eventNameId)
                .style("stroke-dasharray", "5,5")//dashed array for line
                .style("stroke", gameColor)
                .attr('x1', function (d) {
                    return labelWidth + TandGPadding + w * (d.row - minRow) + heatmapMargin.left;
                })
                .attr('y1', function (d) {
                    return height;
                })
                .attr('x2', function (d) {
                    return labelWidth + TandGPadding + w * (d.row - minRow) + heatmapMargin.left;
                })
                .attr('y2', function (d) {
                    return cumulativeHeight + eLh / 2;
                });
            */


            cumulativeHeight += eLh;

        }

        //Draw heatmap for data of each game
        for (i = 0; i < games.length; i++) {

            // draw heatmap rects first the cumulative height will change

            // create heatmap rects if not exist ------------------------------
            svg.selectAll(".heatmap_rect_" + games[i]).remove();
            var minRow = Math.min.apply(Math, gameData[i].map(function (o) {
                return o.row;
            }));

            var heatmapRects = svg.selectAll(".heatmap_rect_" + games[i])
                .data(gameData[i], function (d) {
                    return d.col + ':' + d.row + ":" + w;
                })
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return (d.row - minRow) * w + labelWidth + TandGPadding + heatmapMargin.left;
                })
                .attr("y", function (d) {
                    return cumulativeHeight;
                })
                .attr("width", function (d) {
                    return w;
                })
                .attr("height", function (d) {
                    return h;
                })
                .attr("class", "heatmap_rect_" + games[i])
                .style("fill", function (d) {
                    if ((d.value == NaN) || (d.value == -1) || (d.value == 0)) {
                        return colorUnavailable;
                    }
                    return colorScale(d.value);
                })

                .on("mouseover", function (d) {
                    svg.append("line")
                        .attr("class", "mol")
                        .attr("x1", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                        .attr("y1", heatmapMargin.top)
                        .attr("x2", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                        .attr("y2", totalH + heatmapMargin.top)
                        .attr("stroke-width", 2)
                        .attr("stroke", "#9966ff")
                        .attr("stroke-opacity", 0.8);
                    svg.append("text")
                        .attr("y", heatmapMargin.top - dateH)
                        .attr("x", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                        .attr("class", "hover")
                        .attr("text-anchor", "middle")
                        .attr("font-family", "Helvetica")
                        .attr("font-size", "15px")
                        .style("fill", colorLine)
                        .text(d.date);

                    //if (clickHold == -1) {
                    updateInfoBoxHMap(d, 0);
                    //}
                })

                .on("mouseout", function (d) {
                    svg.select("line.mol").remove();
                    svg.select("text.hover").remove();
                    //if (clickHold == -1) {
                    updateInfoBoxHMap(d, -1);
                    //}
                })

                .on("click", function (d) {
                    if (clickHold == -1) {
                        svg.append("line")
                            .attr("class", "cl")
                            .attr("x1", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y1", heatmapMargin.top)
                            .attr("x2", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y2", totalH + heatmapMargin.top)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);
                        svg.append("text")
                            .attr("y", heatmapMargin.top - dateH)
                            .attr("x", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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
                            .attr("x1", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y1", heatmapMargin.top)
                            .attr("x2", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y2", totalH + heatmapMargin.top)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);
                        svg.append("text")
                            .attr("y", heatmapMargin.top - dateH)
                            .attr("x", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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
                            .attr("x1", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y1", heatmapMargin.top)
                            .attr("x2", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y2", totalH + heatmapMargin.top)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);

                        svg.append("text")
                            .attr("y", heatmapMargin.top - dateH)
                            .attr("x", (d.row - minRow) * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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

            // draw game name text : same height

            var text = svg.selectAll(".heatmap_text_" + games[i]).data([gameData[i][0]]);

            // create text if the text in svg for each is not created
            text.enter()
                .append("text")
                .attr("text-anchor", "start")
                .attr("font-family", HMfont)
                .attr("class", "gameLabel")
                .attr("dy", ".30em")
                .attr("x", 0)
                //.attr("x", (labelWidth + TandGPadding) / 2)
                .attr("y", h / 2 + cumulativeHeight)
                .attr("fill-opacity", 0.95)
                .attr("class", "heatmap_text_" + games[i])
                .text(games[i])
                .style('fill', gameColors[i])
                .style("font-size", "16px");

            // if the text has been created, update it

            text.attr("text-anchor", "start")
                .attr("font-family", HMfont)
                .attr("class", "gameLabel")
                .attr("dy", ".30em")
                .attr("x", 0)
                //.attr("x", (labelWidth + TandGPadding) / 2)
                .attr("y", h / 2 + cumulativeHeight)
                .attr("fill-opacity", 0.95)
                .text(games[i])
                .style('fill', gameColors[i])
                .style("font-size", "16px");


            // update cumulative height
            cumulativeHeight += h;

            // draw event lines
            var tmpHeight = cumulativeHeight;
            var eventlist = [0];

            drawEventBubbles(gameData[i], games[i], 0, gameColors[i], tmpHeight);
            if (i == 0) { // ovewatch
                /*
                eventlist.push(1);
                eventlist.push(2);
                */
                drawEventBubbles(gameData[i], games[i], 1, gameColors[i], tmpHeight);
                drawEventBubbles(gameData[i], games[i], 2, gameColors[i], tmpHeight);
            } else if (i == 1 || i == 2) {
                // CSGO | PUBG
                /*
                eventlist.push(2);
                */
                drawEventBubbles(gameData[i], games[i], 2, gameColors[i], tmpHeight);
            }


            cumulativeHeight += gameMargin;
        }

        // create legend if not exist ------------------------------------
        var legendHeatmapValue = [HmapAvg - 1.5 * HmapStd, HmapAvg, HmapAvg + 1.5 * HmapStd];
        var colorHeatmap = [colorLow, colorMed, colorHigh];
        svg.selectAll("#legend_heatmap").remove();

        var legend_heatmap = svg.selectAll("#legend_heatmap").data([0]).enter()
            .append("g")
            .attr("id", "legend_heatmap");

        // create legend for game color
        var legend_heatmap_game_color = legend_heatmap.selectAll(".legend-game-color").data([0, 1, 2]).enter()
            .append('g')
            .attr('class', 'legend-game-color')
            .attr('transform', function (d, i) {
                var hor = i * (legendRectSize + legendSpacing + 100) + heatmapMargin.left + 50;
                return 'translate(' + hor + ',' + cumulativeHeight + ')';
            });

        legend_heatmap_game_color.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function (d, i) {
                return colorHeatmap[i];
            })
            .style('stroke', function (d, i) {
                return colorHeatmap[i];
            });

        legend_heatmap_game_color.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d, i) {
                var text = "";
                if (i == 0) {
                    text = nFormatter(legendHeatmapValue[i] > 0 ? legendHeatmapValue[i] : 0, 1) + " ~ " + nFormatter(legendHeatmapValue[i+1], 1);
                } else if (i == 1) {
                    text = "Around " + nFormatter(legendHeatmapValue[i], 1);
                } else if (i == 2) {
                    text = nFormatter(legendHeatmapValue[i-1], 1) + " ~ " + nFormatter(legendHeatmapValue[i], 1);
                }
                return text;
            });

        // create legend for game event shape
        var legend_heatmap_event_type = legend_heatmap.selectAll(".legend-event-type").data([0, 1, 2]).enter()
            .append('g')
            .attr('class', 'legend-event-type')
            .attr('transform', function (d, i) {
                var hor = i * (legendRectSize + legendSpacing + 150) + heatmapMargin.left + 50;
                var ver = legendRectSize + 4 * legendSpacing + cumulativeHeight;
                return 'translate(' + hor + ',' + ver + ')';
            });

        legend_heatmap_event_type.append('path')
            .attr("d", d3.svg.symbol().size(150).type(function (d, i) {
                return eventSymbols[i];
            }))
            .attr("transform", function (d) {
                return "translate(" + legendRectSize / 2 + "," + legendRectSize / 2 + ")";
            })
            .style("fill", "purple");

        legend_heatmap_event_type.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d, i) {
                return eventNamesForLegend[i];
            });
    }

    // opp chart----------------------------------------
    function oppCalculateHelper(gameNumber, i) {

        var x = parseInt(gdata[gameNumber][i]["Peak Viewers"]);
        var y = parseInt(gdata[gameNumber][i]["Peak Channels"]);
        var rt = 0;
        if ((y != 0) && (y != -1) && (x != 0) && (x != -1)) {
            rt = parseInt(x / y);
        }
        return rt;
    }

    function prepareDataForOppChart(start, end) {
        if (SETime < SSTime) {
            var temp = SSTime;
            SSTime = SETime;
            SETime = temp;
        }
        if (SETime > EndTime) {
            SETime = EndTime;
        }
        if (SSTime < StartTime) {
            SSTime = StartTime
        }

        var startPt = parseInt((SSTime - StartTime) / 86400000);
        var endPt = parseInt((SETime - StartTime) / 86400000);
        var opp = [];
        for (i = startPt; i <= endPt; i++) {
            opp.push({
                date: new Date(gdata[0][i]["Date"]),
                OWPV: isNaN(parseInt(gdata[0][i]["Peak Viewers"])) ? 0 : parseInt(gdata[0][i]["Peak Viewers"]),
                OWC: isNaN(parseInt(gdata[0][i]["Peak Channels"])) ? 0 : parseInt(gdata[0][i]["Peak Channels"]),
                OWPVC: oppCalculateHelper(0, i),

                CSGOPV: isNaN(parseInt(gdata[1][i]["Peak Viewers"])) ? 0 : parseInt(gdata[1][i]["Peak Viewers"]),
                CSGOC: isNaN(parseInt(gdata[1][i]["Peak Channels"])) ? 0 : parseInt(gdata[1][i]["Peak Channels"]),
                CSGOPVC: oppCalculateHelper(1, i),

                PUBGPV: isNaN(parseInt(gdata[2][i]["Peak Viewers"])) ? 0 : parseInt(gdata[2][i]["Peak Viewers"]),
                PUBGC: isNaN(parseInt(gdata[2][i]["Peak Channels"])) ? 0 : parseInt(gdata[2][i]["Peak Channels"]),
                PUBGPVC: oppCalculateHelper(2, i),


                DPV: isNaN(parseInt(gdata[3][i]["Peak Viewers"])) ? 0 : parseInt(gdata[3][i]["Peak Viewers"]),
                DC: isNaN(parseInt(gdata[3][i]["Peak Channels"])) ? 0 : parseInt(gdata[3][i]["Peak Channels"]),
                DPVC: oppCalculateHelper(3, i),


                D2PV: isNaN(parseInt(gdata[4][i]["Peak Viewers"])) ? 0 : parseInt(gdata[4][i]["Peak Viewers"]),
                D2C: isNaN(parseInt(gdata[4][i]["Peak Channels"])) ? 0 : parseInt(gdata[4][i]["Peak Channels"]),
                D2PVC: oppCalculateHelper(4, i)
            });
        }
        return opp;
    }

    var oppdata = prepareDataForOppChart(SSTime, SETime);
    var chart = makeLineChart(oppdata, 'date', {
        'Overwatch': {column: 'OWPVC'},
        'CSGO': {column: 'CSGOPVC'},
        'PUBG': {column: 'PUBGPVC'},
        'Destiny': {column: 'DPVC'},
        'Destiny2': {column: 'D2PVC'}
    }, document.getElementById("oppchart").offsetWidth);
    chart.bind("#oppchart");
    chart.render();

    // -----------------------------------------
    // Button onclick functions settings
    d3.select("#mainpage_attributes").selectAll("button")
        .style("margin-right", "4px")
        .on("click", function () {
            selectedAttributeMain = d3.select(this).attr("data-field");
            var d = prepareDataForHeatmap(gdata, selectedAttributeMain);
            plotHeatmap(d);

            // clear the infobox and line selected in the heatmap
            var svg = d3.select("#heatmap").select("svg");
            svg.select("line.cl").remove();
            svg.select("line.cl").remove();
            svg.select("text.click").remove();
            svg.select("text.click").remove();
            updateInfoBoxHMap(null, 3)

            // update opp map
            var suffix = "PVC";
            var tmp = {
                'Overwatch': {column: 'OWPVC'},
                'CSGO': {column: 'CSGOPVC'},
                'PUBG': {column: 'PUBGPVC'},
                'Destiny': {column: 'DPVC'},
                'Destiny2': {column: 'D2PVC'}
            };


            d3.select("#oppchart").selectAll("div").remove();
            chart = makeLineChart(oppdata, 'date', tmp, document.getElementById("oppchart").offsetWidth);
            chart.bind("#oppchart");
            chart.render();
        });

    // ------------------------------------------
    // initial settings
    document.getElementById("button_main_peak_viewers").click();

    // main page datepicker set up
    $('.input-group.date.main-start').datepicker({
        autoclose: true,
        defaultViewDate: {year: StartTime.getFullYear(), month: StartTime.getMonth(), day: StartTime.getDate()}
    });

    $('.input-group.date.main-end').datepicker({
        autoclose: true,
        defaultViewDate: {year: EndTime.getFullYear(), month: EndTime.getMonth(), day: EndTime.getDate()}
    });

    //$('.input-group.date').datepicker('setStartDate', StartTime);
    $('.input-group.date.main-start').datepicker('setDate', StartTime);
    //$('.input-group.date').datepicker('setEndDate', EndTime);
    $('.input-group.date.main-end').datepicker('setDate', EndTime);

    $('.input-group.date.main-start').on("changeDate", function (e) {
        SSTime = e.date;
        /*
        $('.input-group.date.main-end').datepicker('setStartDate', SSTime);*/
        var d = prepareDataForHeatmap(gdata, selectedAttributeMain);
        plotHeatmap(d);

        // update opp map
        d3.select("#oppchart").selectAll("div").remove();
        var oppdata = prepareDataForOppChart(SSTime, SETime);
        var chart = makeLineChart(oppdata, 'date', {
            'Overwatch': {column: 'OWPVC'},
            'CSGO': {column: 'CSGOPVC'},
            'PUBG': {column: 'PUBGPVC'},
            'Destiny': {column: 'DPVC'},
            'Destiny2': {column: 'D2PVC'}
        }, document.getElementById("oppchart").offsetWidth);
        chart.bind("#oppchart");
        chart.render();
    });

    $('.input-group.date.main-end').on("changeDate", function (e) {
        // update selected end date
        SETime = e.date;
        /*
        $('.input-group.date.main-start').datepicker('setEndDate', SETime);*/
        var d = prepareDataForHeatmap(gdata, selectedAttributeMain);
        plotHeatmap(d);

        // update opp map
        d3.select("#oppchart").selectAll("div").remove();
        var oppdata = prepareDataForOppChart(SSTime, SETime);
        var chart = makeLineChart(oppdata, 'date', {
            'Overwatch': {column: 'OWPVC'},
            'CSGO': {column: 'CSGOPVC'},
            'PUBG': {column: 'PUBGPVC'},
            'Destiny': {column: 'DPVC'},
            'Destiny2': {column: 'D2PVC'}
        }, document.getElementById("oppchart").offsetWidth);
        chart.bind("#oppchart");
        chart.render();
    });


    // ########################################################
    // ########################################################
    // ########################################################
    // detail page figures
    // initialization ------------------------------------------
    var SSTimeS = new Date("2016/9/8");
    var SETimeS = new Date("2016/11/8");


    // barchart ------------------------------------------------

    var star1 = d3.starPlot();
    var star2 = d3.starPlot();
    var leftAttribute = "PeakViewers"; // set default left barchart attribute
    var rightAttribute = "PeakViewers"; // set default right barchart attribute
    var leftSelectedGame = 0;
    var rightSelectedGame = 1;
    var isSingleForStarplot = false;

    var byProperty = function (prop) {
        return function (a, b) {
            if (typeof a[prop] == "number") {
                return (a[prop] - b[prop]);
            } else {
                return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
            }
        };
    };

    function scaleHelper(property, gameNumber, number) {
        var toSort = [];
        for (var j = 0; j < gdata[gameNumber].length; j++) {
            toSort.push(parseInt(gdata[gameNumber][j][property]));
        }
        var sorted = toSort.sort(function (a, b) {
            return a - b;
        });
        var start = 0; // the first number in the array with value != 0 or -1
        for (var i = 0; i < sorted.length; i++) {
            if ((sorted[i] != 0) && (sorted[i] != -1)) {
                if (start == 0) {
                    start = i;
                }
                if (number <= sorted[i]) {
                    return (i - start + 1) / (sorted.length - start);
                }
            }
        }
        return 0;
    }


    function starDataHelper(ary, property, gameNum) {
        var sum = 0;
        var nzeron = 0;
        for (var i = 0; i < ary.length; i++) {
            if ((ary[i] != [0]) && (ary[i] != -1)) {
                nzeron = nzeron + 1;
                sum += ary[i];
            }
        }
        var avg = 0;
        if (nzeron != 0) {
            avg = parseInt(sum / nzeron);
        }
        var percent = scaleHelper(property, gameNum, avg);
        return [avg, percent];
    }

    //0-Overwatch, 1-CSGO, 2-PUBG, 3-Destiny, 4-Destiny2
    function prepareDataForDetailPage(gameNumber, star) {
        if (SETimeS < SSTimeS) {
            var temp = SSTimeS;
            SSTimeS = SETimeS;
            SETimeS = temp;
        }
        if (SETimeS > EndTime) {
            SETimeS = EndTime;
        }
        if (SSTimeS < StartTime) {
            SSTimeS = StartTime;
        }

        var startPt = parseInt((SSTimeS - StartTime) / 86400000);
        var endPt = parseInt((SETimeS - StartTime) / 86400000);
        var endPt2 = endPt; //end point for bar chart
        if (startPt == endPt) {
            var dayend = (SETimeS.setMonth(SETimeS.getMonth() + 1));
            if (dayend > EndTime) {
                dayend = EndTime;
            }
            endPt2 = parseInt((dayend - StartTime) / 86400000);
        }

        data = gdata[gameNumber];
        starTempData = []
        barChartData = []

        for (var i = startPt; i <= endPt2; i++) {
            var temp = {
                date: data[i]["Date"],
                AverageViewers: parseInt(data[i]["Average Viewers"]),
                PeakViewers: parseInt(data[i]["Peak Viewers"]),
                PeakChannels: parseInt(data[i]["Peak Channels"]),
                info: {
                    updates: data[i]["Game Updates"],
                }
            };
            barChartData.push(temp);
            if (i <= endPt) {
                starTempData.push(temp);
            }
        }

        var ary1 = starTempData.map(function (o) {
            return o.AverageViewers;
        });
        var dt1 = starDataHelper(ary1, "Average Viewers", gameNumber);
        var ary2 = starTempData.map(function (o) {
            return o.PeakViewers;
        });
        var dt2 = starDataHelper(ary2, "Peak Viewers", gameNumber);
        var ary3 = starTempData.map(function (o) {
            return o.PeakChannels;
        });
        var dt3 = starDataHelper(ary3, "Peak Channels", gameNumber);

        starData = {
            AverageViewers: {avg: dt1[0], percent: dt1[1]},
            PeakViewers: {avg: dt2[0], percent: dt2[1]},
            PeakChannels: {avg: dt3[0], percent: dt3[1]},
        }

        var scale = d3.scale.linear()
            .domain([0, 1])
            .range([0, 100]);

        var scales = [scale];

        star.properties([
            'AverageViewers',
            'PeakViewers',
            'PeakChannels',
        ])
            .scales(scales)
            .labels([
                'Average Viewers',
                'Peak Viewers',
                'Peak Channels',
            ])
            .title(function () {
                return games[gameNumber];
            });
        return [starData, barChartData];
    }

    function updateInfoBoxBar(d, settings, attribute) {
        // d example
        // { date: "2016/9/14",
        // AverageViewers: 28036,
        // PeakViewers: 73234,
        // PeakChannels: 1236,
        // PeakPlayers: 0,
        // ...
        // }
        var divInfobox = d3.selectAll(".infobox_bar");

        if (settings == -1) {
            // state -1 : mouse out
            // remove all previous data
            divInfobox.selectAll("div.state_0").remove();
        } else if (settings == 0) {
            divInfobox.selectAll("div.state_0").remove();

            divInfobox.append("div")
                .style("padding", "10px")
                .attr("class", "state_0 mdl-shadow--2dp");

            var content = divInfobox.selectAll("div.state_0");
            content.append("p").text("Info:");
            content.append("p").text("Game: " + d.game);
            content.append("p").text("Date: " + (d.date != undefined && d.date.length > 0 ? d.date : ""));
            content.append("p").text(attribute + ": " + (d[attribute] != undefined && d[attribute] > 0 ? d[attribute] + "" : "N/A"));

        }

    }

    //attribute1 - left display; attribute2 - right display;
    //data - processed data from prepareData
    function plot2HB(attribute1, attribute2, data1, data2) {
        var margin = {
            top: 32,
            right: 100,
            bottom: 20,
            left: 100
        };

        var divBarchartLength = document.getElementById("barchart").offsetWidth;
        var labelArea = 100;
        var width = (divBarchartLength - margin.left - labelArea - margin.right) / 2;
        bar_height = 20,
            height = bar_height * data1.length;
        var rightOffset = margin.left + width + labelArea;

        var lCol = attribute1;
        var rCol = attribute2;
        var xFrom = d3.scale.linear()
            .range([0, width]);
        var xTo = d3.scale.linear()
            .range([0, width]);
        var y = d3.scale.ordinal()
            .rangeBands([20, height]);

        d3.select("#barchart").selectAll('svg').remove();
        var chart = d3.select("#barchart")
            .append('svg')
            .attr('class', 'chart')
            .attr('width', divBarchartLength)
            .attr('height', height + margin.top + margin.bottom);

        xFrom.domain([0, d3.max(data1, function (d) {
            return d[lCol];
        })]);
        xTo.domain([0, d3.max(data2, function (d) {
            return d[rCol];
        })]);

        y.domain(data1.map(function (d) {
            return d.date;
        }));

        var yPosByIndex = function (d) {
            return y(d.date) + margin.top;
        };

        function handleBarHover(d, attribute) {
            // Use D3 to select element, change color and size
            //console.log(attribute);
            //console.log(d);
            // TODO: change the color of the bar

            updateInfoBoxBar(d, 0, attribute);
        }

        function handleBarOut(d, i) {
            // remove info box
            updateInfoBoxBar(d, -1);
        }

        chart.selectAll("rect.left")
            .data(data1)
            .enter().append("rect")
            .attr("x", function (d) {
                return margin.left + width - xFrom(d[lCol]);
            })
            .attr("y", yPosByIndex)
            .attr("class", "left")
            .attr("width", function (d) {
                return xFrom(d[lCol]);
            })
            .attr("height", y.rangeBand())
            .on("mouseover", function (d) {
                d.game = games[leftSelectedGame]; // !!! game name order inside games matters
                handleBarHover(d, leftAttribute);
            })
            .on("mouseout", handleBarOut);

        chart.selectAll("text.leftscore")
            .data(data1)
            .enter().append("text")
            .attr("x", function (d) {
                return margin.left + width - xFrom(d[lCol]) - 40;
            })
            .attr("y", function (d) {
                return y(d.date) + y.rangeBand() / 2 + margin.top;
            })
            .attr("dx", "20")
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'leftscore')
            .text(function (d) {
                return d[lCol];
            });
        chart.selectAll("text.name")
            .data(data1)
            .enter().append("text")
            .attr("x", (labelArea / 2) + width + margin.left)
            .attr("y", function (d) {
                return y(d.date) + y.rangeBand() / 2 + margin.top;
            })
            .attr("dy", ".20em")
            .attr("text-anchor", "middle")
            .attr('class', 'name')
            .text(function (d) {
                return d.date;
            });

        chart.selectAll("rect.right")
            .data(data2)
            .enter().append("rect")
            .attr("x", rightOffset)
            .attr("y", yPosByIndex)
            .attr("class", "right")
            .attr("width", function (d) {
                return xTo(d[rCol]);
            })
            .attr("height", y.rangeBand())
            .on("mouseover", function (d) {
                d.game = games[rightSelectedGame]; // !!! game name order inside games matters
                handleBarHover(d, rightAttribute);
            })
            .on("mouseout", handleBarOut);

        chart.selectAll("text.score")
            .data(data2)
            .enter().append("text")
            .attr("x", function (d) {
                return xTo(d[rCol]) + rightOffset + 50;
            })
            .attr("y", function (d) {
                return y(d.date) + y.rangeBand() / 2 + margin.top;
            })
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'score')
            .text(function (d) {
                return d[rCol];
            });

    }

    // -------------------------------------------------
    // star plot drawing

    function plotStar(gameData, game, number) {
        var margin = {
            top: 32,
            right: 50,
            bottom: 20,
            left: 50
        };

        var id = number == 1 ? "left" : "right";
        var star = number == 1 ? star1 : star2;
        var divStarplotLength = document.getElementById("starplot_" + id ).offsetWidth;


        var width = divStarplotLength - margin.left - margin.right;
        var height = divStarplotLength - margin.top - margin.bottom;
        var labelMargin = 8;

        star.margin(margin)
            .labelMargin(labelMargin);

        star = star.width(width);

        // remove previous drawing with for the same game
        d3.select('#starplot_' + id).selectAll('.star_' + number).remove();
        d3.select('#starplot_' + id).selectAll('#interaction_' + number).remove();

        d3.select('#starplot_' + id).selectAll("div").data([0]).enter().append('div')
            .attr('class', 'wrapper');

        var wrapper = d3.select('#starplot_' + id).select(".wrapper");

        wrapper.selectAll('svg').data([0]).enter().append('svg')
            .attr('class', 'chart')
            //.attr('id', 'star_'+number)
            .attr('width', width + margin.left + margin.right)
            .attr('height', width + margin.top + margin.bottom);

        var svg = wrapper.select('svg');

        var starG = svg.append('g')
            .attr("class", "star_" + number)
            .datum(gameData)
            .call(star)
            .call(star.interaction);

        var interactionLabel = wrapper.append('div')
            .attr('class', 'interaction label')
            .attr('id', 'interaction_' + number);

        var circle = svg.append('circle')
            .attr('class', 'interaction circle star_' + number)
            .attr('r', 5);

        var interaction = wrapper.selectAll('.interaction')
            .style('display', 'none');

        svg.selectAll('.star-interaction')
            .on('mouseover', function (d) {
                svg.selectAll('.star-label')
                    .style('display', 'none');

                interaction
                    .style('display', 'block');

                circle
                    .attr('cx', d.x)
                    .attr('cy', d.y);

                $interactionLabel = $(interactionLabel.node());

                interactionLabel
                    .text(d.key + ': ' + d.datum[d.key]["avg"])
                    .style('left', d.xExtent - ($interactionLabel.width() / 2))
                    .style('top', d.yExtent - ($interactionLabel.height() / 2));

                updateInfoBoxStar(d, 0);

            })
            .on('mouseout', function (d) {
                interaction
                    .style('display', 'none');

                svg.selectAll('.star-label')
                    .style('display', 'block');

                updateInfoBoxStar(d, -1);
            });
    }

    function updateInfoBoxStar(d, settings) {
        /* d example
            datum:{AverageViewers: {…}, PeakViewers: {…}, PeakChannels: {…}, PeakPlayers: {…}, GameRankTotal: {…}, …}
            key:"PeakViewers"
            x:162.87671232876713
            xExtent:204
            y:154.30311998787323
            yExtent:225.53074360871938
        */
        var divInfobox = d3.selectAll(".infobox_star");

        if (settings == -1) {
            // state -1 : mouse out
            // remove all previous data
            divInfobox.selectAll("div.state_0").remove();
        } else if (settings == 0) {
            divInfobox.selectAll("div.state_0").remove();

            divInfobox.append("div")
                .style("padding", "10px")
                .attr("class", "state_0 mdl-shadow--2dp");

            var content = divInfobox.selectAll("div.state_0");
            content.append("p").text("Info:");
            // TODO: content.append("p").text("Date: " + (d.date != undefined && d.date.length > 0 ? d.date : ""));
            content.append("p").text(d.key + ": " + d.datum[d.key]["avg"]);

        }

    }

    // -------------------------------------------------------
    // Button onclick functions settings

    function handleCompareUpdate() {
        // selectedGame should be updated when you switch to the game detailed page by tabs
        console.log(leftSelectedGame + " " + rightSelectedGame);
        console.log(leftAttribute + " " + rightAttribute);
        var d1 = prepareDataForDetailPage(leftSelectedGame, star1);
        var d2 = prepareDataForDetailPage(rightSelectedGame, star2);
        plot2HB(leftAttribute, rightAttribute, d1[1], d2[1]);

        // plot star
        plotStar(d1[0], leftSelectedGame, 1);
        plotStar(d2[0], rightSelectedGame, 2);
    }

    // detail page: change barchart left side with selected attribute
    d3.select(".left_games").selectAll("button")
        .style("margin-right", "4px")
        .on("click", function () {
            // update left game
            leftSelectedGame = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    d3.select(".left_attributes").selectAll("button")
        .style("margin-right", "4px")
        .on("click", function () {
            // update left attribute
            leftAttribute = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    d3.select(".right_games").selectAll("button")
        .style("margin-right", "4px")
        .on("click", function () {
            // update right game
            rightSelectedGame = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    d3.select(".right_attributes").selectAll("button")
        .style("margin-right", "4px")
        .on("click", function () {
            // update right game
            rightAttribute = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    // change selectedGame when change the detail page of the game by clicking the tab
    d3.select("#tabs").selectAll("a")
        .on("click", function () {
            console.log("Switch to game: " + d3.select(this).attr("data-id"));
            var tab = d3.select(this).attr("data-id");

            if (tab == 0) {
                // draw main page
                //var d = prepareDataForHeatmap(gdata, d3.select(this).attr("data-field"));
                //plotHeatmap(d);

            } else {
                // draw comparison page

                var data1 = prepareDataForDetailPage(leftSelectedGame, star1);
                var data2 = prepareDataForDetailPage(rightSelectedGame, star2);
                // possible data member name: PeakViewers, PeakChannels, AverageViewers, PeakPlayers, GameRankTotal, GameRankEsports
                // set default attributes

                plot2HB(leftAttribute, rightAttribute, data1[1], data2[1]);
                plotStar(data1[0], leftSelectedGame, 1);
                plotStar(data2[0], rightSelectedGame, 2);
            }

        });

    // set initial status for star plot date picker
    if (!document.getElementById("single").checked) {
        $('.input-group.date.detail-star-single input').prop('disabled', true);
    }


    // detail page radio button set up
    $("#single").on("click", function (e) {

        var isSingleForStarplot = document.getElementById("single").checked;
        $('.input-group.date.detail-star-single input').prop('disabled', !isSingleForStarplot);

        if (isSingleForStarplot) {
            SSTimeS = $('.input-group.date.detail-star-single').datepicker("getDate");
            SETimeS = $('.input-group.date.detail-star-single').datepicker("getDate");
        }
        else {
            SSTimeS = $('.input-group.date.detail-bar-start').datepicker("getDate");
            SETimeS = $('.input-group.date.detail-bar-end').datepicker("getDate");
        }

        // re-plot starplot
        var d1 = prepareDataForDetailPage(leftSelectedGame, star1);
        var d2 = prepareDataForDetailPage(rightSelectedGame, star2);
        //console.log(d1[0]);
        //console.log(d2[0]);
        plotStar(d1[0], leftSelectedGame, 1);
        plotStar(d2[0], rightSelectedGame, 2);
    });


    // datepicker set up for comparison page
    $('.input-group.date.detail-star-single').datepicker({
        autoclose: true,
        defaultViewDate: {year: StartTime.getFullYear(), month: StartTime.getMonth(), day: StartTime.getDate()}
    });


    $('.input-group.date.detail-bar-start').datepicker({
        autoclose: true,
        defaultViewDate: {year: StartTime.getFullYear(), month: StartTime.getMonth(), day: StartTime.getDate()}
    });

    $('.input-group.date.detail-bar-end').datepicker({
        autoclose: true,
        defaultViewDate: {year: EndTime.getFullYear(), month: EndTime.getMonth(), day: EndTime.getDate()}
    });

    $('.input-group.date.detail-star-single').datepicker('setDate', SSTimeS);
    $('.input-group.date.detail-bar-start').datepicker('setDate', SSTimeS);
    $('.input-group.date.detail-bar-end').datepicker('setDate', SETimeS);

    $('.input-group.date.detail-star-single').on("changeDate", function (e) {
        // re-plot star plot according to the checkbox
        SSTimeS = e.date;
        var d1 = prepareDataForDetailPage(leftSelectedGame, star1);
        var d2 = prepareDataForDetailPage(rightSelectedGame, star2);
        plot2HB(leftAttribute, rightAttribute, d1[1], d2[1]);
        plotStar(d1[0], leftSelectedGame, 1);
        plotStar(d2[0], rightSelectedGame, 2);
    });

    $('.input-group.date.detail-bar-start').on("changeDate", function (e) {
        // update selected start date
        SSTimeS = e.date;

        // re-draw barchart
        /*
        $('.input-group.date.detail-bar-end').datepicker('setEndDate', SETimeS);
        */
        handleCompareUpdate();

        // re-draw star plot
    });

    $('.input-group.date.detail-bar-end').on("changeDate", function (e) {
        // update selected start date
        SETimeS = e.date;

        /*
        // re-draw barchart
        $('.input-group.date.detail-bar-end').datepicker('setStartDate', SSTimeS);
        */
        handleCompareUpdate();

        // re-draw star plot
    });
}

data_all_games = [];
queue()
    .defer(d3.csv, "data/Overwatch.csv")
    .defer(d3.csv, "data/CSGO.csv")
    .defer(d3.csv, "data/PUBG.csv")
    .defer(d3.csv, "data/Destiny.csv")
    .defer(d3.csv, "data/Destiny2.csv")
    .awaitAll(DataProcessing); //only function name is needed

// ----------------
var explanation = "test";

var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#help');
if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function() {
    document.getElementById("help_dialog").width = document.body.clientWidth;
    dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
});

function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}