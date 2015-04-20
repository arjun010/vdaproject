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

        var timedata = d3.nest()
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
            .attr("class", "day")
            .attr("width", timeTool.dimens.cellSize)
            .attr("height", timeTool.dimens.cellSize)
            .attr("x", function(d) { return week(d) * timeTool.dimens.cellSize; })
            .attr("y", function(d) { return day(d) * timeTool.dimens.cellSize; })
            .datum(format);

        rect.append("title")
            .text(function(d) { return d; });

        svg.selectAll(".month")
            .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("path")
            .attr("class", "month")
            .attr("d", monthPath);


        rect.filter(function(d) { return d in timedata; })
            .attr("class", function(d) {
                return "day " + color(timedata[d].length); })
            .select("title")
            .text(function(d) { return d + ": " + percent(timedata[d]); });

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
})();