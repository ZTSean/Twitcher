function DataProcessing(error, gdata) {
    //final variables 
    document.body.style.backgroundColor = "white";
    //start and end data of general dataset
    var StartTime = new Date("2016/9/8");
    var EndTime = new Date("2017/9/8");

    //var HmapLength = 3 * 366;
    var divHeatmapLength = document.getElementById("heatmap").offsetWidth;

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
                    date: gData[j][i]["Date"],
                    gameUpdates: gData[j][i]["Game Updates"],
                    esportsSchedule: gData[j][i]["Esports Schedule"],
                    game: games[j]
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
        var divInfobox = d3.select("#infobox");

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
            content.append("p").text("Value: " + (infoData.value != undefined && infoData.value > 0 ? infoData.value + "" : "N/A"))
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
            content.append("p").text("Value: " + (infoData.value != undefined && infoData.value > 0 ? infoData.value + "" : "N/A"))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : ""));


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
            content.append("p").text("Value: " + (infoData.value != undefined && infoData.value > 0 ? infoData.value + "" : "N/A"))
            content.append("p").text("Esports Schedule: " + (infoData.esportsSchedule != undefined && infoData.esportsSchedule.length > 0 ? infoData.esportsSchedule : ""));

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

        var heatmapMargin = { top: 50, right: 30, bottom: 30, left: 5 }

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


        console.log(HmapAvg);
        console.log(HmapStd);

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
                .data([gameData[i][0]], function(d) { return d.col + ':' + d.row; })
                .enter()
                .append("line")
                .attr("x1", labelWidth + TandGPadding + heatmapMargin.left)
                .attr("y1", function(d) { return eLh / 2 + d.col * LH + heatmapMargin.top; })
                .attr("x2", labelWidth + TandGPadding + HmapLength)
                .attr("y2", function(d) { return eLh / 2 + d.col * LH + heatmapMargin.top; })
                .attr("stroke-width", eventlineWidth)
                .attr("stroke", colorEventline);


            // create event bubble or rect if not exist ---------------------------------
            var eventlineBubbles = svg.selectAll(".heatmap_event_" + games[i]).data(gameData[i], function(d) { return d.col + ':' + d.row; });

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

                updateInfoBoxHMap(d, 0);
            }

            // remove previous events
            eventlineBubbles.exit().remove();

            // enter: create new bubbles
            eventlineBubbles.enter()
                .append("circle")
                .filter(function(d) { // filter out those data without events
                    return (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) ||
                        (d.gameUpdates != undefined && d.gameUpdates.length > 0);
                })
                .attr("r", function(d) {
                    var count = 0;
                    if (d.gameUpdates != undefined && d.gameUpdates.length > 0) count++;
                    if (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) count++;
                    return count * eventBubbleRadius;
                })
                .attr("cx", function(d) { return labelWidth + TandGPadding + w * d.col + heatmapMargin.left; })
                .attr("cy", function(d) { return eLh / 2 + d.col * LH + heatmapMargin.top; })
                .style("fill", colorEventBubble)

                // handle hover event
                .on("mouseover", handleEventHover)
                .on("mouseout", handleEventOut);


            // update bubbles
            eventlineBubbles.filter(function(d) { // filter out those data without events
                    return (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) ||
                        (d.gameUpdates != undefined && d.gameUpdates.length > 0);
                })
                .attr("r", function(d) {
                    var count = 0;
                    if (d.gameUpdates != undefined && d.gameUpdates.length > 0) count++;
                    if (d.esportsSchedule != undefined && d.esportsSchedule.length > 0) count++;
                    return count * eventBubbleRadius;
                })
                .attr("cx", function(d) { return labelWidth + TandGPadding + w * d.row + heatmapMargin.left; })
                .attr("cy", function(d) { return eLh / 2 + d.col * LH + heatmapMargin.top; })
                .style("fill", colorEventBubble)

                // handle hover event
                .on("mouseover", handleEventHover)
                .on("mouseout", handleEventOut);



            // create heatmap if not exist
            svg.selectAll(".heatmap_rect_" + games[i])
                .data(gameData[i], function(d) { return d.col + ':' + d.row; })
                .enter()
                .append("rect")
                .attr("x", function(d) { return d.row * w + labelWidth + TandGPadding + heatmapMargin.left; })
                .attr("y", function(d) { return eLh + d.col * LH + heatmapMargin.top; })
                .attr("width", function(d) { return w; })
                .attr("height", function(d) { return h; })
                .attr("class", "heatmap_rect_" + games[i])
                .style("fill", function(d) {
                    if ((d.value == -1) || (d.value == 0)) {
                        return colorUnavailable;
                    }
                    return colorScale(d.value);
                })


            // update heatmap
            var heatmapRects = svg.selectAll(".heatmap_rect_" + games[i])
                .data(gameData[i], function(d) { return d.col + ':' + d.row; })
                .attr("x", function(d) { return d.row * w + labelWidth + TandGPadding + heatmapMargin.left; })
                .attr("y", function(d) { return eLh + d.col * LH + heatmapMargin.top; })
                .attr("width", function(d) { return w; })
                .attr("height", function(d) { return h; })
                .style("fill", function(d) {
                    if ((d.value == -1) || (d.value == 0)) {
                        return colorUnavailable;
                    }
                    return colorScale(d.value);
                })

                .on("mouseover", function(d) {
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

    function plotStar(gameData, propertyAry) {}


    prepareDataForStarPlot(gdata[0][1]);
    plotStar();
    var gD = prepareDataForHeatmap(gdata, "Peak Viewers")
    plotHeatmap(gD);
}

data_all_games = []
queue()
    .defer(d3.csv, "data/Overwatch.csv")
    .defer(d3.csv, "data/CSGO.csv")
    .defer(d3.csv, "data/PUBG.csv")
    .defer(d3.csv, "data/Destiny.csv")
    .defer(d3.csv, "data/Destiny2.csv")
    .awaitAll(DataProcessing); //only function name is needed