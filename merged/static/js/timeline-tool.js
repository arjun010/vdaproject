function getIndexInList(obj,list){
	for(var i=0;i<list.length;i++){
		if(list[i]==obj){
			return i;
		}
	}
	return -1;
}
(function () {

    timeTool = {};

    timeTool.init = function(params) {
        timeTool.parentDiv = $('#viz-timeline');
        timeTool.clicked = [];
        timeTool.dimens = {
            width: timeTool.parentDiv.width(),
            height: timeTool.parentDiv.height(),
            cellSize: 17
        };
    };

    timeTool.draw = function (params) {

        var day = d3.time.format("%w"),
            week = d3.time.format("%U"),
            year = d3.time.format("%Y"),
            month = d3.time.format('%m'),
            monthName = d3.time.format('%b'),
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");

        timeTool.format = format;
        timeTool.month = month;

        timeTool.data = d3.nest()
            .key(function(d){return format(d.date)})
            .map(data.documents);

        var maxCount = 0;
        var rangeData = d3.nest()
            .key(function(d){return year(d.date)})
            .key(function(d){return d.date})
            .rollup(function(docs){
                if(docs.length > maxCount) maxCount = docs.length;
                return docs;
            })
            .map(data.documents);


        var color = d3.scale.quantize()
            .domain([0, maxCount])
            .range(d3.range(5).map(function(d) { return "q" + d + "-11"; }));

        var svg = d3.select('#viz-timeline').selectAll("svg")
            .data(d3.range(2004, 2005))
            .enter().append("svg")
            .attr("width", timeTool.dimens.width)
            .attr("height", timeTool.dimens.height)
            .attr("class", "RdYlGn")
            .append("g")
            .attr("transform", "translate(" + timeTool.dimens.cellSize + ","
                + (timeTool.dimens.cellSize * 2) + ")");

        svg.append("text")
            .attr("transform", "translate(-6," + timeTool.dimens.cellSize * 3.5 + ")rotate(-90)")
            .style("text-anchor", "middle")
            .text(function(d) { return d; });

        var rect = svg.selectAll(".day")
            .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("rect")
            .attr("class", function(d){ return "day day-"+format(d)+' month-'+month(d);})
            .attr("width", timeTool.dimens.cellSize)
            .attr("height", timeTool.dimens.cellSize)
            .attr("x", function(d) { return week(d) * timeTool.dimens.cellSize; })
            .attr("y", function(d) { return day(d) * timeTool.dimens.cellSize; })
            .datum(format)
            .on('mouseover', showBrushDate)
            .on('mouseout', hideBrushDate)
            .on('click', freezeBrushDate);

        rect.append("title")
            .text(function(d) { return d; });

        var monthEnter = svg.selectAll(".month")
            .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); }).enter();

        monthEnter.append("path")
            .attr("class", function(d){
                return "month month-path";
            })
            .attr("d", monthPath);

        monthEnter = monthEnter.append('g')
            .attr('class', function(d){
                return 'month month-text month-'+month(d);
            })
            .attr('transform', function(t0){
                var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
                var center = parseFloat(week(t0));
                center += (parseFloat(week(t1)) - parseFloat(week(t0)))/2;
                return 'translate('+ (center * timeTool.dimens.cellSize) + ', -15)';
            });

        monthEnter.append('text')
            .text(function(d){ return monthName(d);});

        monthEnter.append('rect')
            .attr('width', timeTool.dimens.cellSize * 2)
            .attr('height', timeTool.dimens.cellSize)
            .attr('rx', 5)
            .attr('ry', 5)
            .on('click', freezeBrushMonth)
            .on('mouseenter', showBrushMonth)
            .on('mouseout', hideBrushMonth);

        rect.filter(function(d) { return d in timeTool.data; })
            .attr("class", function(d) {
                return 'day val day-'+d+' month-'+month(new Date(d))+' '+ color(timeTool.data [d].length); })
            .select("title")
            .text(function(d) { return d + ": " + percent(timeTool.data [d]);});

        function monthPath(t0) {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                d0 = +day(t0), w0 = +week(t0),
                d1 = +day(t1), w1 = +week(t1);
            return "M" + (w0 + 1) * timeTool.dimens.cellSize + "," + d0 * timeTool.dimens.cellSize
                + "H" + w0 * timeTool.dimens.cellSize + "V" + 7 * timeTool.dimens.cellSize
                + "H" + w1 * timeTool.dimens.cellSize + "V" + (d1 + 1) * timeTool.dimens.cellSize
                + "H" + (w1 + 1) * timeTool.dimens.cellSize + "V" + 0
                + "H" + (w0 + 1) * timeTool.dimens.cellSize + "Z";
        }
    };

    /**
     * Brush the document if it is currently in view
     * @param doc
     * @param docId
     */
    timeTool.brush = function(docs, docIds){
        var dates = [];
        if(!docs){
            docIds.forEach(function(i){
                data.documents.forEach(function(d){
                    if(i == d.id){
                        dates.push(timeTool.format(d.date));
                    }
                });
            });
        } else {
            docs.forEach(function(d){
                dates.push(timeTool.format(d.date));
            });
        }
        dates.mergeUnique([]);

        d3.selectAll('.day.val').style('opacity', 0.2);
        dates.forEach(function(d){
            brushDate(d,1,true);
        });
    };

    function showBrushDate(d, force){
        if((dateBarClicked == 0 || force === true) && $('.val.day-' + d).length > 0) {
            // Only brush if the day we hover over has a value
            d3.selectAll('.day.val').style('opacity', 0.2);

            d3.selectAll(".node").style("opacity", 0.2);
            d3.selectAll(".link").style("opacity", 0.2);

            brushDate(d, 1);
        }
    }

    function brushDate(d, val, ignoreNodes){
        d3.selectAll('.day-' + d).style('opacity', val);

        var documents = timeTool.data[d];

        var aliases = [];
        documents.forEach(function (doc) {
            doc.aliasList.forEach(function (alias) {
                aliases.push(alias);
            });
        });

        if(!ignoreNodes){
            d3.selectAll(".node").style("opacity", function (d) {
                if (d instanceof Doc) {
                    if (getIndexInList(d, documents) != -1) {
                        return val;
                    }
                } else if (d instanceof Alias) {
                    if (getIndexInList(d, aliases) != -1) {
                        return val;
                    }
                }
                return d3.select(this).style('opacity');
            }).append("text")
            .attr("class","templabel")
                      .attr("dx", 12)
                      .attr("dy", ".35em")
                      .style("font-size",function(d){
                        if(d instanceof Doc){
                            if (getIndexInList(d, documents) != -1) {
                                return nodeTextScale(d.aliasList);
                            }
                        }else{
                            if (getIndexInList(d, aliases) != -1) {
                                return nodeTextScale(getDocCountForAlias(d))
                            }
                        }
                      })
                      .style("font-family","sans-serif")
                      .text(function(d) {
                        if(d instanceof Doc){
                        if (getIndexInList(d, documents) != -1) {
                            return d.title;
                        }
                        }else{
                            if (getIndexInList(d, aliases) != -1) {
                                return d.name;
                            }
                        }
                      });

            d3.selectAll(".link").style('opacity', function (d) {
                if ((getIndexInList(d.source, aliases) != -1 || getIndexInList(d.source, documents) != -1) && (getIndexInList(d.target, aliases) != -1 || getIndexInList(d.target, documents) != -1)) {
                    return val;
                } else {
                    return d3.select(this).style('opacity');
                }
            });
        }
    }

    function hideBrushDate(d, force){
        if(dateBarClicked == 0 || force === true){
            d3.selectAll('.day').style('opacity',1);
            d3.selectAll('.templabel').remove();
            d3.selectAll(".node").style("opacity",1);
            d3.selectAll(".link").style("opacity",1);
        }
    }

    function freezeBrushDate(d){
        if(dateBarClicked == 0){
            if ($('.val.day-' + d).length > 0) {
                timeTool.clicked.push(d);
                showBrushDate(d);
                dateBarClicked = 1;
            }
        } else {
            // See if this is already clicked
            var inClicked = false;
            for(var c = 0; c < timeTool.clicked.length; c++){
                if(timeTool.clicked[c] == d){
                    inClicked = true;
                    break;
                }
            }

            // See if we are using the ctrlkey - and if this is a date with a value
            if((d3.event.ctrlKey || d3.event.metaKey) && $('.val.day-' + d).length > 0){
                // Add to clicked if not inClicked or remove from clicked
                if(inClicked){
                    brushDate(d, 0.2);
                } else {
                    timeTool.clicked.push(d);
                    brushDate(d, 1);
                }
            } else {
                // Remove the previously clicked
                timeTool.clicked = [];
                hideBrushDate(d, true);

                // Click the new one if it has a value and wasn't already clicked
                if ($('.val.day-' + d).length > 0 && !inClicked) {
                    timeTool.clicked.push(d);
                    showBrushDate(d, true);
                } else {
                    d3.select('.month-text.selected').classed('selected',false);
                    dateBarClicked = 0;
                }
            }
        }
    }

    function freezeBrushMonth(m){

        if(d3.select('.month-text.month-'+timeTool.month(m)).attr('class').indexOf('selected') == -1){
            // Unselect the old one
            d3.select('.month-text.selected').classed('selected',false);
            // Select this one
            d3.select('.month-text.month-'+timeTool.month(m)).classed('selected',true);
            showBrushMonth(m, true);
            dateBarClicked = 1;
        } else {
            d3.select('.month-text.selected').classed('selected',false);
            hideBrushMonth(m,true);
            dateBarClicked = 0;
        }
    }

    function showBrushMonth(m, force){
        if(dateBarClicked == 0 || force === true) {
            d3.selectAll('.day.val').style('opacity', 0.2);
            d3.selectAll('.node').style('opacity', 0.2);
            d3.selectAll('.link').style('opacity', 0.2);

            d3.selectAll('.day.val.month-' + timeTool.month(m))[0].forEach(function (d) {
                brushDate(d3.select(d).data()[0], 1);
            });
        }
    }
    function hideBrushMonth(m, force) {
        if (dateBarClicked == 0 || force === true) {
            console.log(dateBarClicked);
            d3.selectAll('.day.val').style('opacity', 1);
            d3.selectAll('.node').style('opacity', 1);
            d3.selectAll('.link').style('opacity', 1);
        }
    }

})();