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
    var gameColors = ["#5F8316", "#98CA32", "#B3BF0D", "#F7D302", "#DAC134"];

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
        var info = gdata[infoData.col][infoData.x];
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
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : ""));

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
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : ""));

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
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : ""));

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
            content.append("p").text("Game Updates: " + (infoData.gameUpdates != undefined && infoData.gameUpdates.length > 0 ? infoData.gameUpdates : ""))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : ""));


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

        var heatmapMargin = {top: 50, right: 30, bottom: 30, left: 5}

        //height of each row in the heatmap
        //width of each column in the heatmap

        var h = 50, //rect height
            eLh = 50, //event line height
            LH = h + eLh, //total height for each game
            labelWidth = h, //width of the game label
            width = divHeatmapLength, // width of whole graph
            TandGPadding = 70, //space between text and graph
            HmapLength = Math.max(0, width - labelWidth - TandGPadding - heatmapMargin.left - heatmapMargin.right),
            w = HmapLength / nBloc, //rect width
            totalH = LH * gameData.length, //total height of the map
            dateH = 5; //start height for date text
        var height = LH * gameData.length + heatmapMargin.top + heatmapMargin.bottom; // height of whole graph
        var eventlineWidth = 3;
        var eventBubbleRadius = 5;

        // -----------------------------------------------------

        var colorLow = 'green',
            colorMed = 'yellow',
            colorHigh = 'red',
            colorLine = "#9966ff",
            colorUnavailable = "#ebebe0",
            colorEventline = "#9966ff",
            colorEventBubble = "purple";


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

        //Draw heatmap for data of each game
        for (i = 0; i < games.length; i++) {
            // create eventline if not exist -----------
            // create horizontal line for eventline if not exist
            svg.selectAll(".heatmap_eventline_" + games[i])
                .data([gameData[i][0]], function (d) {
                    return d.col + ':' + d.row + ':' + w;
                })
                .enter()
                .append("line")
                .attr("x1", labelWidth + TandGPadding + heatmapMargin.left)
                .attr("y1", function (d) {
                    return eLh / 2 + d.col * LH + heatmapMargin.top;
                })
                .attr("x2", labelWidth + TandGPadding + HmapLength)
                .attr("y2", function (d) {
                    return eLh / 2 + d.col * LH + heatmapMargin.top;
                })
                .attr("stroke-width", eventlineWidth)
                .attr("stroke", colorEventline);


            // create event bubble or rect if not exist ---------------------------------
            var eventlineBubbles = svg.selectAll(".heatmap_event_" + games[i]).data(gameData[i], function (d) {
                return d.col + ':' + d.row + ':' + w;
            });

            function handleEventHover(d, i) {
                // Use D3 to select element, change color and size
                d3.select(this)
                    .attr("r", eventBubbleRadius * 4)
                    .style("fill", "black");

                updateInfoBoxHMap(d, 4);
            }

            function handleEventOut(d, i) {
                var count = 0;
                if (d.gameUpdates != undefined && d.gameUpdates.length > 0) count++;
                if (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) count++;

                // Use D3 to select element, change color back to normal
                d3.select(this)
                    .attr("r", eventBubbleRadius * count)
                    .style("fill", colorEventBubble);

                updateInfoBoxHMap(d, -1);
            }

            // remove previous events
            eventlineBubbles.exit().remove();

            // enter: create new bubbles
            eventlineBubbles.enter()
                .append("circle")
                .filter(function (d) { // filter out those data without events
                    return (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) ||
                        (d.gameUpdates != undefined && d.gameUpdates.length > 0);
                })
                .attr("r", function (d) {
                    var count = 0;
                    if (d.gameUpdates != undefined && d.gameUpdates.length > 0) count++;
                    if (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) count++;
                    return count * eventBubbleRadius;
                })
                .attr("cx", function (d) {
                    return labelWidth + TandGPadding + w * d.col + heatmapMargin.left;
                })
                .attr("cy", function (d) {
                    return eLh / 2 + d.col * LH + heatmapMargin.top;
                })
                .style("fill", colorEventBubble)

                // handle hover event
                .on("mouseover", handleEventHover)
                .on("mouseout", handleEventOut);


            // update bubbles
            eventlineBubbles.filter(function (d) { // filter out those data without events
                return (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) ||
                    (d.gameUpdates != undefined && d.gameUpdates.length > 0);
            })
                .attr("r", function (d) {
                    var count = 0;
                    if (d.gameUpdates != undefined && d.gameUpdates.length > 0) count++;
                    if (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) count++;
                    return count * eventBubbleRadius;
                })
                .attr("cx", function (d) {
                    return labelWidth + TandGPadding + w * d.row + heatmapMargin.left;
                })
                .attr("cy", function (d) {
                    return eLh / 2 + d.col * LH + heatmapMargin.top;
                })
                .style("fill", colorEventBubble)

                // handle hover event
                .on("mouseover", handleEventHover)
                .on("mouseout", handleEventOut);


            // create heatmap if not exist
            svg.selectAll(".heatmap_rect_" + games[i]).remove();

            var heatmapRects = svg.selectAll(".heatmap_rect_" + games[i])
                .data(gameData[i], function (d) {
                    return d.col + ':' + d.row + ":" + w;
                })
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return d.row * w + labelWidth + TandGPadding + heatmapMargin.left;
                })
                .attr("y", function (d) {
                    return eLh + d.col * LH + heatmapMargin.top;
                })
                .attr("width", function (d) {
                    return w;
                })
                .attr("height", function (d) {
                    return h;
                })
                .attr("class", "heatmap_rect_" + games[i])
                .style("fill", function (d) {
                    if ((d.value == -1) || (d.value == 0)) {
                        return colorUnavailable;
                    }
                    return colorScale(d.value);
                })

                .on("mouseover", function (d) {
                    svg.append("line")
                        .attr("class", "mol")
                        .attr("x1", d.row * w + labelWidth + TandGPadding + heatmapMargin.left)
                        .attr("y1", heatmapMargin.top)
                        .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                        .attr("y2", totalH + heatmapMargin.top)
                        .attr("stroke-width", 2)
                        .attr("stroke", "#9966ff")
                        .attr("stroke-opacity", 0.8);
                    svg.append("text")
                        .attr("y", heatmapMargin.top - dateH)
                        .attr("x", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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
                            .attr("x1", d.row * w + labelWidth + TandGPadding + heatmapMargin.left)
                            .attr("y1", heatmapMargin.top)
                            .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y2", totalH + heatmapMargin.top)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);
                        svg.append("text")
                            .attr("y", heatmapMargin.top - dateH)
                            .attr("x", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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
                            .attr("y1", heatmapMargin.top)
                            .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y2", totalH + heatmapMargin.top)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);
                        svg.append("text")
                            .attr("y", heatmapMargin.top - dateH)
                            .attr("x", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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
                            .attr("x1", d.row * w + labelWidth + TandGPadding + heatmapMargin.left)
                            .attr("y1", heatmapMargin.top)
                            .attr("x2", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
                            .attr("y2", totalH + heatmapMargin.top)
                            .attr("stroke-width", 2)
                            .attr("stroke", colorLine)
                            .attr("stroke-opacity", 0.8);

                        svg.append("text")
                            .attr("y", heatmapMargin.top - dateH)
                            .attr("x", d.row * w + labelWidth + TandGPadding + w / 2 + heatmapMargin.left)
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


        for (i = 0; i < gameData.length; i++) {

            var text = svg.selectAll(".heatmap_text_" + games[i]).data([gameData[i][0]]);

            // create text if the text in svg for each is not created
            text.enter()
                .append("text")
                .attr("text-anchor", "middle")
                .attr("font-family", HMfont)
                .attr("class", "gameLabel")
                .attr("dy", ".30em")
                .attr("x", (labelWidth + TandGPadding) / 2)
                .attr("y", i * LH + h / 2 + eLh + heatmapMargin.top)
                .attr("fill-opacity", 0.95)
                .attr("class", "heatmap_text_" + games[i])
                .text(games[i])
                .style('fill', gameColors[i])
                .style("font-size", "20px");

            // if the text has been created, update it

            text.attr("text-anchor", "middle")
                .attr("font-family", HMfont)
                .attr("class", "gameLabel")
                .attr("dy", ".30em")
                .attr("x", (labelWidth + TandGPadding) / 2)
                .attr("y", i * LH + h / 2 + eLh + heatmapMargin.top)
                .attr("fill-opacity", 0.95)
                .text(games[i])
                .style('fill', gameColors[i])
                .style("font-size", "20px");
        }

    }

    // opp chart----------------------------------------
    var SSTimeOC = new Date("2016/9/8");
    var SETimeOC = new Date("2017/9/8");

    function prepareDataForOppChart(start, end) {
        if (SETimeOC < SSTimeOC) {
            var temp = SSTimeOC;
            SSTimeOC = SETimeOC;
            SETimeOC = temp;
        }
        if (SETimeOC > EndTime) {
            SETimeOC = EndTime;
        }
        if (SSTimeOC < StartTime) {
            SSTimeOC = StartTime
        }

        var startPt = parseInt((SSTimeOC - StartTime) / 86400000);
        var endPt = parseInt((SETimeOC - StartTime) / 86400000);
        var opp = [];
        for (i = startPt; i <= endPt; i++) {
            opp.push({
                date: new Date(gdata[0][i]["Date"]),
                OWPV: isNaN(parseInt(gdata[0][i]["Peak Viewers"])) ? 0 : parseInt(gdata[0][i]["Peak Viewers"]),
                OWPC: isNaN(parseInt(gdata[0][i]["Peak Channels"])) ? 0 : parseInt(gdata[0][i]["Peak Channels"]),
                OWAV: isNaN(parseInt(gdata[0][i]["Average Viewers"])) ? 0 : parseInt(gdata[0][i]["Average Viewers"]),
                OWPP: isNaN(parseInt(gdata[0][i]["Peak Players"])) ? 0 : parseInt(gdata[0][i]["Peak Players"]),
                OWGRT: isNaN(parseInt(gdata[0][i]["Game Rank (Total)"])) ? 0 : parseInt(gdata[0][i]["Game Rank (Total)"]),
                OWGRE: isNaN(parseInt(gdata[0][i]["Game Rank (Esports)"])) ? 0 : parseInt(gdata[0][i]["Game Rank (Esports)"]),

                CSGOPV: isNaN(parseInt(gdata[1][i]["Peak Viewers"])) ? 0 : parseInt(gdata[1][i]["Peak Viewers"]),
                CSGOPC: isNaN(parseInt(gdata[1][i]["Peak Channels"])) ? 0 : parseInt(gdata[1][i]["Peak Channels"]),
                CSGOAV: isNaN(parseInt(gdata[1][i]["Average Viewers"])) ? 0 : parseInt(gdata[1][i]["Average Viewers"]),
                CSGOPP: isNaN(parseInt(gdata[1][i]["Peak Players"])) ? 0 : parseInt(gdata[1][i]["Peak Players"]),
                CSGOGRT: isNaN(parseInt(gdata[1][i]["Game Rank (Total)"])) ? 0 : parseInt(gdata[1][i]["Game Rank (Total)"]),
                CSGOGRE: isNaN(parseInt(gdata[1][i]["Game Rank (Esports)"])) ? 0 : parseInt(gdata[1][i]["Game Rank (Esports)"]),

                PUBGPV: isNaN(parseInt(gdata[2][i]["Peak Viewers"])) ? 0 : parseInt(gdata[2][i]["Peak Viewers"]),
                PUBGPC: isNaN(parseInt(gdata[2][i]["Peak Channels"])) ? 0 : parseInt(gdata[2][i]["Peak Channels"]),
                PUBGAV: isNaN(parseInt(gdata[2][i]["Average Viewers"])) ? 0 : parseInt(gdata[2][i]["Average Viewers"]),
                PUBGPP: isNaN(parseInt(gdata[2][i]["Peak Players"])) ? 0 : parseInt(gdata[2][i]["Peak Players"]),
                PUBGGRT: isNaN(parseInt(gdata[2][i]["Game Rank (Total)"])) ? 0 : parseInt(gdata[2][i]["Game Rank (Total)"]),
                PUBGGRE: isNaN(parseInt(gdata[2][i]["Game Rank (Esports)"])) ? 0 : parseInt(gdata[2][i]["Game Rank (Esports)"]),

                DPV: isNaN(parseInt(gdata[3][i]["Peak Viewers"])) ? 0 : parseInt(gdata[3][i]["Peak Viewers"]),
                DPC: isNaN(parseInt(gdata[3][i]["Peak Channels"])) ? 0 : parseInt(gdata[3][i]["Peak Channels"]),
                DAV: isNaN(parseInt(gdata[3][i]["Average Viewers"])) ? 0 : parseInt(gdata[3][i]["Average Viewers"]),
                DPP: isNaN(parseInt(gdata[3][i]["Peak Players"])) ? 0 : parseInt(gdata[3][i]["Peak Players"]),
                DGRT: isNaN(parseInt(gdata[3][i]["Game Rank (Total)"])) ? 0 : parseInt(gdata[3][i]["Game Rank (Total)"]),
                DGRE: isNaN(parseInt(gdata[3][i]["Game Rank (Esports)"])) ? 0 : parseInt(gdata[3][i]["Game Rank (Esports)"]),

                D2PV: isNaN(parseInt(gdata[4][i]["Peak Viewers"])) ? 0 : parseInt(gdata[4][i]["Peak Viewers"]),
                D2PC: isNaN(parseInt(gdata[4][i]["Peak Channels"])) ? 0 : parseInt(gdata[4][i]["Peak Channels"]),
                D2AV: isNaN(parseInt(gdata[4][i]["Average Viewers"])) ? 0 : parseInt(gdata[4][i]["Average Viewers"]),
                D2PP: isNaN(parseInt(gdata[4][i]["Peak Players"])) ? 0 : parseInt(gdata[4][i]["Peak Players"]),
                D2GRT: isNaN(parseInt(gdata[4][i]["Game Rank (Total)"])) ? 0 : parseInt(gdata[4][i]["Game Rank (Total)"]),
                D2GRE: isNaN(parseInt(gdata[4][i]["Game Rank (Esports)"])) ? 0 : parseInt(gdata[4][i]["Game Rank (Esports)"])
            })
            /* opp.push({
                 date: new Date(gdata[0][i]["Date"]),
                 OWPV: parseFloat(gdata[0][i]["Peak Viewers"]),
                 OWC: parseInt(gdata[0][i]["Peak Channels"]),
                 CSGOPV: parseInt(gdata[1][i]["Peak Viewers"]),
                 CSGOC: parseInt(gdata[1][i]["Peak Channels"]),
                 PUBGPV: parseInt(gdata[2][i]["Peak Viewers"]),
                 PUBGC: parseInt(gdata[2][i]["Peak Channels"]),
                 DPV: parseInt(gdata[3][i]["Peak Viewers"]),
                 DC: parseInt(gdata[3][i]["Peak Channels"]),
                 D2PV: parseInt(gdata[4][i]["Peak Viewers"]),
                 D2C: parseInt(gdata[4][i]["Peak Channels"]),
             })*/
            /*opp.push({
                id: games[num],
                x: i,
                values: {
                    date: new Date(gdata[num][i]["Date"]),
                    viewer: nViewers,
                    channel: nChannels
                }
            })*/
            ;
        }
        return opp;
    }

    var oppdata = prepareDataForOppChart(SSTimeOC, SETimeOC);
    var chart = makeLineChart(oppdata, 'date', {
        'Overwatch': {column: 'OWPV'},
        'CSGO': {column: 'CSGOPV'},
        'PUBG': {column: 'PUBGPV'},
        'Destiny': {column: 'DPV'},
        'Destiny2': {column: 'D2PV'}
    });
    chart.bind("#oppchart");
    chart.render();

    // -----------------------------------------
    // Button onclick functions settings
    d3.select("#mainpage_attributes").selectAll("button")
        .on("click", function () {
            selectedAttributeMain = d3.select(this).attr("data-field");
            var d = prepareDataForHeatmap(gdata, selectedAttributeMain);
            plotHeatmap(d);

            var suffix = "PV";
            console.log(selectedAttributeMain);
            switch (selectedAttributeMain) {
                case "Peak Viewers":
                    suffix = "PV";
                    break;
                case "Peak Channels":
                    suffix = "PC";
                    break;
                case "Average Viewers":
                    suffix = "AV";
                    break;
                case "Peak Players":
                    suffix = "PP";
                    break;
                case "Game Rank (Total)":
                    suffix = "GRT";
                    break;
                case "Game Rank (Esports)":
                    suffix = "GRE";
                    break;
                default:
                    suffix = "PV";
                    break;
            }
            var tmp = {
                'Overwatch': {column: 'OW' + suffix},
                'CSGO': {column: 'CSGO' + suffix},
                'PUBG': {column: 'PUBG' + suffix},
                'Destiny': {column: 'D' + suffix},
                'Destiny2': {column: 'D2' + suffix}
            };

            d3.select("#oppchart").selectAll("div").remove();
            console.log(d3.select("#oppchart").selectAll("div"));
            chart = makeLineChart(oppdata, 'date', tmp);
            chart.bind("#oppchart");
            chart.yAxisLable = selectedAttributeMain;
            chart.render();
        });

    // ------------------------------------------
    // initial settings
    document.getElementById("button_main_peak_viewers").click();

    // main page datepicker set up
    $('.input-group.date.main_start').datepicker({
        autoclose: true,
        defaultViewDate: {year: StartTime.getFullYear(), month: StartTime.getMonth(), day: StartTime.getDate()}
    }).on("changeDate", function (e) {
        SSTime = e.date;
        $('.input-group.date.main_end').datepicker('setStartDate', SSTime);
        var d = prepareDataForHeatmap(gdata, selectedAttributeMain);
        console.log(d);
        plotHeatmap(d);
    });


    $('.input-group.date.main_end').datepicker({
        autoclose: true,
        defaultViewDate: {year: EndTime.getFullYear(), month: EndTime.getMonth(), day: EndTime.getDate()}
    }).on("changeDate", function (e) {
        // update selected end date
        SETime = e.date;
        $('.input-group.date.main_start').datepicker('setEndDate', SETime);
        var d = prepareDataForHeatmap(gdata, selectedAttributeMain);
        plotHeatmap(d);
    });
    $('.input-group.date').datepicker('setStartDate', StartTime);
    $('.input-group.date.main-start').datepicker('setDate', StartTime);
    $('.input-group.date').datepicker('setEndDate', EndTime);
    $('.input-group.date.main-end').datepicker('setDate', EndTime);

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
            .title(function (){
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


        var star = number == 1 ? star1 : star2;
        var divStarplotLength = document.getElementById("starplot").offsetWidth;

        var width = divStarplotLength - margin.left - margin.right;
        var height = 275 - margin.top - margin.bottom;
        var labelMargin = 8;

        star.margin(margin)
            .labelMargin(labelMargin);

        // remove previous drawing with for the same game
        d3.select('#starplot').selectAll('.star_'+number).remove();
        d3.select('#sarplot').selectAll('#interaction_'+number).remove();

        d3.select('#starplot').selectAll("div").data([0]).enter().append('div')
            .attr('class', 'wrapper');

        var wrapper = d3.select('#starplot').select(".wrapper");

        wrapper.selectAll('svg').data([0]).enter().append('svg')
            .attr('class', 'chart')
            //.attr('id', 'star_'+number)
            .attr('width', width + margin.left + margin.right)
            .attr('height', width + margin.top + margin.bottom);

        var svg = wrapper.select('svg');

        var starG = svg.append('g')
            .attr("class", "star_"+number)
            .datum(gameData)
            .call(star)
            .call(star.interaction);

        var interactionLabel = wrapper.append('div')
            .attr('class', 'interaction label')
            .attr('id', 'interaction_' + number);

        var circle = svg.append('circle')
            .attr('class', 'interaction circle star_'+number)
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
        .on("click", function () {
            // update left game
            leftSelectedGame = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    d3.select(".left_attributes").selectAll("button")
        .on("click", function () {
            // update left attribute
            leftAttribute = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    d3.select(".right_games").selectAll("button")
        .on("click", function () {
            // update right game
            rightSelectedGame = d3.select(this).attr("data-field");
            handleCompareUpdate();
        });

    d3.select(".right_attributes").selectAll("button")
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
                console.log(data1[0]);

                console.log(data2[0]);
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
        defaultViewDate: {year: EndTime.getFullYear(), month: EndTime.getMonth(), day: EndTime.getDate()}
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
        $('.input-group.date.detail-bar-end').datepicker('setEndDate', SETimeS);
        handleCompareUpdate();

        // re-draw star plot
    });

    $('.input-group.date.detail-bar-end').on("changeDate", function (e) {
        // update selected start date
        SETimeS = e.date;

        // re-draw barchart
        $('.input-group.date.detail-bar-end').datepicker('setStartDate', SSTimeS);
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
