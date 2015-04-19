(function () {

    provTool = {};

    provTool.init = function (params) {

    };

    provTool.draw = function (params) {
		drawProvenanceView();    	
    };

})();

scoreMap  = {
	"added_to_graph":1,
	"added_to_graph_by_expanding":0.5,
	"removed_from_graph":0,
	"removed_from_graph_by_deletion":-0.5,
	"removed_from_graph_by_collapse":-0.5,
	"collapsed_in_graph":-2,
	"expanded_in_graph":2
}


function drawProvenanceView(){
	d3.select("#viz-provenance").selectAll("svg").remove()
	curTime = parseInt((new Date()-sessionStartTime)/1000);
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
		for(var i=0;i<parallels.length;i++){ // for each parallel line
			curDOI = 0;
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
			tempDOIMap[""+curLimit] = curDOI;			
		}
		pcJson.push(tempDOIMap)		
	}
	drawProvenanceView_actual(pcJson)
}



function drawProvenanceView_actual (cars) {
	//console.log(cars)
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
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
      .attr("d", path);

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