function getSortedKeys(obj) {
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

(function () {

    provTool = {};

    provTool.init = function (params) {
        provTool.parentDiv = $('#viz-provenance');
        provTool.dimens = {
            width: provTool.parentDiv.width(),
            height: provTool.parentDiv.height(),
            cellSize: 17
        };
    };

    provTool.draw = function (params) {
        provTool.parentDiv = $('#viz-provenance');
        provTool.dimens = {
            width: provTool.parentDiv.width(),
            height: provTool.parentDiv.height(),
            cellSize: 17
        };
        drawProvenanceView();

        $("#search").autocomplete({
            source: getSortedKeys(finalDOIMap),
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search");
        });

        var grid = provTool.grid();

        d3.select("#prov-grid")
            .datum(provTool.events.slice(0,10))
            .call(grid)
            .selectAll(".row")
            .on({
                "mouseover": function(d) { provTool.createDonut(d)},
                "mouseout": function(d) { provTool.clearDonut(d)}
            });
    };

    provTool.parallel = function(events){

        console.log(provTool.dimens);

        var margin = {top: 60, right: 30, bottom: 30, left: 30},
            width = (provTool.dimens.width * 0.8) - margin.left - margin.right,
            height = (provTool.dimens.height * 0.6) - margin.top - margin.bottom;

        provTool.x = d3.scale.ordinal().rangePoints([0, width], 1);
        provTool.y = {};

        provTool.line = d3.svg.line();
        var axis = d3.svg.axis().orient("left"),
            background;


        var svg = d3.select("#viz-provenance").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Extract the list of dimensions and create a scale for each.
        provTool.x.domain(dimensions = d3.keys(events[0]).filter(function(d) {
            return d != "name" && (provTool.y[d] = d3.scale.linear()
                    .domain(d3.extent(events, function(p) { return +p[d]; }))
                    .range([height, 0]));
        }));

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(events)
            .enter().append("path")
            .attr("d", provTool.parallel.path);

        // Add blue foreground lines for focus.
        provTool.foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(events)
            .enter().append("path")
            .attr("class","dataline")
            .attr("d", provTool.parallelPath);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + provTool.x(d) + ")"; });

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(provTool.y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; });

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(provTool.y[d].brush = d3.svg.brush().y(provTool.y[d]).on("brush", provTool.parallelbrush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);


    };

    // Returns the path for a given data point.
    provTool.parallelPath = function(d) {
        return provTool.line(dimensions.map(function(p) { return [provTool.x(p), provTool.y[p](d[p])]; }));
    };

// Handles a brush event, toggling the display of foreground lines.
    provTool.parallelbrush = function() {
        var actives = dimensions.filter(function(p) { return !provTool.y[p].brush.empty(); }),
            extents = actives.map(function(p) { return provTool.y[p].brush.extent(); });

        var filtered = provTool.events.filter(function(d){
            var ret = true;
            actives.forEach(function(p, i) {
                if(d[p] < extents[i][0] || d[p] > extents[i][1]){
                    ret = false;
                }
            });
            return ret;
        });

        var grid = provTool.grid();

        d3.select("#prov-grid")
            .datum(filtered.slice(0,10))
            .call(grid)
            .selectAll(".row")
            .on({
                "mouseover": function(d) { provTool.createDonut(d)},
                "mouseout": function(d) { provTool.clearDonut(d)}
            });

        provTool.foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    };

    provTool.grid = function(config) {
        var columns = [];

        var dg = function(selection) {
            if (columns.length == 0) columns = d3.keys(selection.data()[0][0]);

            // header
            selection.selectAll(".header")
                .data([true])
                .enter().append("div")
                .attr("class", "header");

            var header = selection.select(".header")
                .selectAll(".cell")
                .data(columns);

            header.enter().append("div")
                .attr("class", function(d,i) { return "col-" + i; })
                .classed("cell", true);

            selection.selectAll(".header .cell")
                .text(function(d) { return d; });

            header.exit().remove();

            // rows
            var rows = selection.selectAll(".row")
                .data(function(d) { return d; });

            rows.enter().append("div")
                .attr("class", "row");

            rows.exit().remove();

            var cells = selection.selectAll(".row").selectAll(".cell")
                .data(function(d) { return columns.map(function(col){return d[col];}) });

            // cells
            cells.enter().append("div")
                .attr("class", function(d,i) { return "col-" + i; })
                .classed("cell", true);

            cells.exit().remove();

            selection.selectAll(".cell")
                .text(function(d) { return d; });

            return dg;
        };

        dg.columns = function(_) {
            if (!arguments.length) return columns;
            columns = _;
            return this;
        };

        return dg;
    };

    provTool.clearDonut = function(d){
        drawDonut([]);
    }

    provTool.createDonut = function(d){
        var provObject = provenanceMap[d.name]
        var tempDonutData = [];
        var countMap  = {
            "added_to_graph":0,
            "added_to_graph_by_expanding":0,
            "removed_from_graph":0,
            "removed_from_graph_by_deletion":0,
            "removed_from_graph_by_collapse":0,
            "collapsed_in_graph":0,
            "expanded_in_graph":0,
            "clicked_with_time_freeze":0,
            "document_opened":0,
            "document_removed_from_doc_view":0,
            "document_deleted":0,
            "searched_for":0
        };
        for(var eIndex=0;eIndex<provObject.length;eIndex++){
            countMap[provObject[eIndex]["event"]] += 1
        }
        //console.log(countMap)
        var events = Object.keys(countMap)
        for(var i=0;i<events.length;i++){
            tempDonutData.push({"label":events[i],"value":countMap[events[i]]})
        }
        drawDonut(tempDonutData)
    };

})();

scoreMap  = {
	"added_to_graph":1,
	"added_to_graph_by_expanding":0.5,
	"removed_from_graph":0,
	"removed_from_graph_by_deletion":-0.5,
	"removed_from_graph_by_collapse":-0.5,
	"collapsed_in_graph":-2,
	"expanded_in_graph":2,
	"clicked_with_time_freeze":2,
    "document_opened":1,
    "document_removed_from_doc_view":-1,
    "document_deleted":0,
    "searched_for":0.1
}


function drawProvenanceView(){
	d3.select("#viz-provenance > svg").remove()
	curTime = parseInt((new Date()-sessionStartTime)/1000)+1;
	//console.log(curTime)
	parallels = [0];
	pcJson = [];
	if(curTime<=60){
		prevIndex = 0;
		do{
			nextLine = parseInt(parallels[prevIndex]+(curTime/2))
			parallels.push(nextLine)	
			prevIndex+=1	
		}while(prevIndex<2);
	}else{
		prevIndex = 0;
		do{
			nextLine = parseInt(parallels[prevIndex]+(curTime/5))
			parallels.push(nextLine)	
			prevIndex+=1	
		}while(prevIndex<5);
	}
	//console.log(parallels)
	var provenanceObjects = Object.keys(provenanceMap);	
	for(var j=0;j<provenanceObjects.length;j++){ // for each provenance object
		curProvObjectEventList = provenanceMap[provenanceObjects[j]];
		tempDOIMap = {};
		tempDOIMap["name"] = provenanceObjects[j];
		for(var i=1;i<parallels.length;i++){ // for each parallel line
			curDOI = 0;
			prevLimit = parallels[i-1];
			curLimit = parallels[i]; // current parallel's limit
			for(var eventIndex=0;eventIndex<curProvObjectEventList.length;eventIndex++){//for each event of the current provenance object
				if(parseInt(curProvObjectEventList[eventIndex]["time"])<curLimit){// if it falls witin the current time parallel
					curEvent = curProvObjectEventList[eventIndex]["event"]; // stores the current event
					if(curEvent=="removed_from_graph"){ // if event is removed, make the provenance object's score 0
						curDOI = 0;
					}else{// else add the current event's score to the current DOI
						curDOI += scoreMap[curEvent];
					}
				}
			}
			tempDOIMap[prevLimit+"-"+curLimit+"sec"] = curDOI;			
		}
		pcJson.push(tempDOIMap)
	}
	for(var i=0;i<pcJson.length;i++){
		finalDOIMap[pcJson[i]["name"]] = pcJson[i][parallels[parallels.length-2]+"-"+parallels[parallels.length-1]+"sec"];
	}
	//console.log(finalDOIMap)
    provTool.events = pcJson;
	provTool.parallel(pcJson)
}


function searchProvView(){		
	var selectedVal = document.getElementById('search').value.toLowerCase();
	if (selectedVal=="") {
		d3.selectAll(".dataline").style("opacity",1).style("stroke","steelblue");
		drawDonut([])
	}else{		
		d3.selectAll(".dataline").style("opacity",function(d){
			if(d.name.toLowerCase()==selectedVal){
                provTool.createDonut(d);
				return 1;
			}else{
				return 0;
			}
		}).style("stroke",function(d){
			if(d.name.toLowerCase()==selectedVal){
				return "steelblue";
			}else{
				return "black";
			}
		});		
	}
}

function  drawDonut(dataToUse) {
    //console.log(dataToUse)
    if(dataToUse.length==0){
        d3.select("#donutchart").selectAll("svg").style("opacity",0)
    }else{
        d3.select("#donutchart").selectAll("svg").style("opacity",1)
    }
    nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .showLabels(true)     //Display pie labels
            .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
            .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
            .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
            .donutRatio(0.35);     //Configure how big you want the donut hole size to be.


        d3.select("#donutchart svg")
            .datum(dataToUse)
            .transition().duration(350)
            .call(chart);
        if(dataToUse.length==0){
            //console.log("ZERO")
            chart.tooltips(false);
        }else{
            chart.tooltips(true);
        }
        return chart;
    });
}
