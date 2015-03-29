var graphData = {
	"nodes":[],
	"links":[]
};

function getIndexInList(obj,list){
	for(var i=0;i<list.length;i++){
		if(list[i]==obj){
			return i;
		}
	}
	return -1;
}

function generateGraphData(){
	for(var i=0;i<data.aliases.length;i++){
    	graphData.nodes.push(data.aliases[i]);
    }
    for(var i=0;i<data.documents.length;i++){
    	graphData.nodes.push(data.documents[i]);
    }
    graphData.links = [];
    //console.log(graphData.nodes)
    /*for(var i=0;i<data.documents.length;i++){

    }*/
}

function drawGraphViz(){
	var width = document.getElementById("viz-graph").offsetWidth,
    height = document.getElementById("viz-graph").offsetHeight;

	var svg = d3.select("#viz-graph").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var color = d3.scale.category10();

	var force = d3.layout.force()
	    .gravity(.05)
	    .distance(100)
	    .charge(-100)
	    .size([width, height]);

	 force.nodes(graphData.nodes)
	     .links(graphData.links)
	     .start();

	  var link = svg.selectAll(".link")
	      .data(graphData.links)
	    .enter().append("line")
	      .attr("class", "link");

	  var node = svg.selectAll(".node")
	      .data(graphData.nodes)
	    	.enter().append("g")
	      .attr("class", "node")
	      .call(force.drag);

	  var nodeCircles = node.append("circle")
	  				   .attr("r",5)
	  				   .style("fill",function(d){ return color(d.type)});	  				   
	      
	  var nodeLabels = node.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .text(function(d) { return d.name ? d.name : d.title; });				 

	  force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  });	  
}

(function () {

    graphTool = {};

    graphTool.init = function (params) {

    };

    graphTool.draw = function (params) {
    	generateGraphData();
    	drawGraphViz();
    };

})();