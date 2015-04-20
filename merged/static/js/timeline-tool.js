function getIndexInList(obj,list){
	for(var i=0;i<list.length;i++){
		if(list[i]==obj){
			return i;
		}
	}
	return -1;
}
function drawGraph(time){
	var dataToUse;
	if(time==1){
		dataToUse = [];
	}else{
    /*var format = d3.time.format("%Y-%m-%d");
    //console.log(timelineData[0]["values"])
    for(var i=0;i<timelineData[0]["values"].length;i++){
      var curDate = timelineData[0]["values"][i]["date"].split("-")
      timelineData[0]["values"][i]["date"] = format(new Date(curDate[0], curDate[1], curDate[2]));
    }*/
    dataToUse = timelineData;
	}
  var format = d3.time.format("%Y-%m-%d");
  nv.addGraph(function() {
		var chart = nv.models.discreteBarChart()
	      .x(function(d) { return d.date})    //Specify the data accessors.
	      .y(function(d) { return d.count })
	      .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
	      .tooltips(true)        //Don't show tooltips
	      .showValues(false) 
	      .showXAxis(false)     //...instead, show the bar value right on top of each bar.
	      .tooltipContent(function (key, date, e, graph) {
	      	if(dateBarClicked==0){
          var documentsIdsToShow = graph.point.documentList;
	      	var documentsToShow = [];
	      	for(var i=0;i<data.documents.length;i++){
	      		if(getIndexInList(data.documents[i].id,documentsIdsToShow)!=-1){
	      			documentsToShow.push(data.documents[i]);
	      		}
	      	}

	      	var entitiesToShow = [];
	      	for(var i =0; i<data.documents.length;i++){
	      		if(getIndexInList(data.documents[i].id,documentsIdsToShow)!=-1){
	      			for(var j=0;j<data.documents[i].aliasList.length;j++){
	      				entitiesToShow.push(data.documents[i].aliasList[j])
	      			}
	      		}
	      	}
	      	
	      	d3.selectAll(".node").style("opacity",function(d){
	      		if(d instanceof Doc){
	      			if(getIndexInList(d,documentsToShow)!=-1){
	      				return 1;
	      			}
	      		}else if(d instanceof Alias){
	      			if(getIndexInList(d,entitiesToShow)!=-1){
	      				return 1;
	      			}
	      		}
	      		return 0.2;
	      	});

	      	d3.selectAll(".link").style("opacity",function(d){
	      		if((getIndexInList(d.source,entitiesToShow)!=-1 || getIndexInList(d.source,documentsToShow)!=-1) && (getIndexInList(d.target,entitiesToShow)!=-1 || getIndexInList(d.target,documentsToShow)!=-1)) {
	      			return 1;
	      		}else{
	      			return 0.2;
	      		}
	      	});
          }

        return  "<p>" + graph.point.date + "<br>"+ graph.point.count + "<br>" + graph.point.documentList + "</p>";
		   });

chart.xAxis.rotateLabels(-90);
/*
.ticks(d3.time.months)
    .tickSize(16, 0)
    .tickFormat(d3.time.format("%B"));*/

chart.discretebar.dispatch.on("elementMouseout", function (e) {
  if(dateBarClicked==0){
	 d3.selectAll(".node").style("opacity",1);
	 d3.selectAll(".link").style("opacity",1);
  }
});



chart.discretebar.dispatch.on("elementClick", function (e) {
  //console.log(e)  
  if(dateBarClicked==1){
    dateBarClicked = 0;
    d3.selectAll(".discreteBar").style("opacity",1)
    d3.selectAll(".node").style("opacity",1);
  d3.selectAll(".link").style("opacity",1);
  }else{
    dateBarClicked = 1;
    var clickedBarDate = e.point.date;
    d3.selectAll(".discreteBar").style("opacity",function(d){
      //console.log(d)
      if(d.date == clickedBarDate){
        return 1;
      }
      return 0.2;
      //console.log(d)
    })
    var documentsIdsToShow = e.point.documentList;
          var documentsToShow = [];
          for(var i=0;i<data.documents.length;i++){
            if(getIndexInList(data.documents[i].id,documentsIdsToShow)!=-1){
              documentsToShow.push(data.documents[i]);
            }
          }

          var entitiesToShow = [];
          for(var i =0; i<data.documents.length;i++){
            if(getIndexInList(data.documents[i].id,documentsIdsToShow)!=-1){
              for(var j=0;j<data.documents[i].aliasList.length;j++){
                entitiesToShow.push(data.documents[i].aliasList[j])
              }
            }
          }
          
          d3.selectAll(".node").style("opacity",function(d){
            if(d instanceof Doc){
              if(getIndexInList(d,documentsToShow)!=-1){
                return 1;
              }
            }else if(d instanceof Alias){
              if(getIndexInList(d,entitiesToShow)!=-1){
                return 1;
              }
            }
            return 0.1;
          });

          d3.selectAll(".link").style("opacity",function(d){
            if((getIndexInList(d.source,entitiesToShow)!=-1 || getIndexInList(d.source,documentsToShow)!=-1) && (getIndexInList(d.target,entitiesToShow)!=-1 || getIndexInList(d.target,documentsToShow)!=-1)) {
              return 1;
            }else{
              return 0.1;
            }
          });
  }
});
 // chart.xAxis.ticks(d3.time.months, 12)


		  d3.select('#viz-timeline svg')
		      .datum(dataToUse)
	 	      .call(chart);
/*
          d3.select("#viz-timeline svg")
            .append("text")
            .attr("x",50)
            .attr("y",170)
            .text(function(){return "January"})
*/
		  nv.utils.windowResize(chart.update);

		  return chart;
		});
	//chart.discretebar.dispatch.on("elementClick", function (e) {
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
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");

        timeTool.format = format;

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
            //.on('click', unfreezeBrushDate)
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
            .attr("class", function(d){ return "day day-"+format(d);})
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

        svg.selectAll(".month")
            .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("path")
            .attr("class", "month")
            .attr("d", monthPath);


        rect.filter(function(d) { return d in timeTool.data; })
            .attr("class", function(d) {
                return "day val day-"+d+" "+ color(timeTool.data [d].length); })
            .select("title")
            .text(function(d) { return d + ": " + percent(timeTool.data [d]); });

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

        //d3.select(self.frameElement).style("height", "2910px");
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
            });

            d3.selectAll(".link").style('opacity', function (d) {
                if ((getIndexInList(d.source, aliases) != -1 || getIndexInList(d.source, documentsToShow) != -1) && (getIndexInList(d.target, entitiesToShow) != -1 || getIndexInList(d.target, documentsToShow) != -1)) {
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

            d3.selectAll(".node").style("opacity",1);
            d3.selectAll(".link").style("opacity",1);
        }
    }

    function freezeBrushDate(d){
        if(dateBarClicked == 0){
            console.log('Click received');
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

            console.log('Ctrl key pressed '+d3.event.ctrlKey);
            console.log(d3.event);

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
                    dateBarClicked = 0;
                }
            }
        }
    }

    function unfreezeBrushDate(d){
        console.log('unfreeze');
        hideBrushDate(d,true);
        dateBarClicked = 0;
    }
})();