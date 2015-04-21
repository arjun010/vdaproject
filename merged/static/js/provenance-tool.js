function getSortedKeys(obj) {
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

(function () {

    provTool = {};

    provTool.init = function (params) {

    };

    provTool.draw = function (params) {
		drawProvenanceView();    	
		/*
		$("#search").autocomplete({
			source: Object.keys(provenanceMap)
		});
		$('#search').on( "focus", function( event, ui ) {
		    $(this).trigger(jQuery.Event("keydown"));
		   // Since I know keydown opens the menu, might as well fire a keydown event to the element
		});
		*/
		/*
		finalDOIMap.sort(function(a, b) {
	    	return b.value - a.value;
		});*/
		$("#search").autocomplete({
			source: getSortedKeys(finalDOIMap),
			minLength: 0,
		}).focus(function () {
			$(this).autocomplete("search");
		});
//		drawACHTable();
		//hot1.render();
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
	"searched_for":0.05
}


function drawProvenanceView(){
	d3.select("#viz-provenance").selectAll("svg").remove()
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
					if(curEvent=="removed_from_graph" || curEvent=="document_deleted"){ // if event is removed, make the provenance object's score 0
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
	console.log(finalDOIMap)
	drawProvenanceView_actual(pcJson)
}

function drawProvenanceView_actual (cars) {
	//console.log(cars)
	var margin = {top: 30, right: 10, bottom: 10, left: 180},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("#viz-provenance").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    return d != "name" && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("class","dataline")
      .attr("d", path);

  foreground.on("mouseover",function(d){
//  	console.log(d)
  })
  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}
}


function searchProvView(){		
	var selectedVal = document.getElementById('search').value.toLowerCase();
	$("#focusentity").html("<p style='font-size:15px;'>"+document.getElementById('search').value+"</p>")
	if (selectedVal=="") {
		d3.selectAll(".dataline").style("opacity",1).style("stroke","steelblue");
		drawDonut([])
		drawTable([])
	}else{		
		d3.selectAll(".dataline").style("opacity",function(d){
			if(d.name.toLowerCase()==selectedVal){
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
				drawTable(provenanceMap[d.name])
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

function drawTable(dataObject){
	console.log(dataObject)
	var rowCount = document.getElementById("event_table").rows.length;
	var table = document.getElementById("event_table");
	for(var i=0;i<rowCount;i++){
		table.deleteRow(0);
	}
	if(dataObject!=[]){
		var headerRow = table.insertRow(document.getElementById("event_table").rows.length);
		var cell1 = headerRow.insertCell(0)
		var cell2 = headerRow.insertCell(1)
		cell1.innerHTML = "Event";
	    cell2.innerHTML = "Time";
    }
	for(var i=0;i<dataObject.length;i++){
		var row = table.insertRow(document.getElementById("event_table").rows.length);	
		var cell1 = row.insertCell(0)
		var cell2 = row.insertCell(1)
		cell1.innerHTML = dataObject[i]["event"];
    	cell2.innerHTML = dataObject[i]["time"];
	}	
}