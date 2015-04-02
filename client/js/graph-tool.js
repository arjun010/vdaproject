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

function linkExistsInGraph(currentLink){
	if(typeof(currentLink.source)=="number"){
		for(var i=0;i<graphData.links.length;i++){
			if(((graphData.nodes[currentLink.source] == graphData.links[i].source) && (graphData.nodes[currentLink.target] == graphData.links[i].target)) || ((graphData.nodes[currentLink.source] == graphData.links[i].target) && (graphData.nodes[currentLink.target] == graphData.links[i].source))){
				return 1;
			}
		}	
	}else{
		for(var i=0;i<graphData.links.length;i++){
			if(((currentLink.source == graphData.links[i].source) && (currentLink.target == graphData.links[i].target)) || ((currentLink.source == graphData.links[i].target) && (currentLink.target == graphData.links[i].source))){
				return 2;
			}
		}
	}
	return -1;
}

// this is just a temporary function
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

function linkExists(source,target){
	if(typeof(source) instanceof Doc){

	}
}


function addRelatedDocuments(node){
	// add new nodes to graph's node list
	//var newAdditions = [];
	var startLengthOfNodeList = graphData.nodes.length;
	if(node instanceof Alias){ // double clicked node is an alias
		for(var i=0;i<data.documents.length;i++){
			var aliasesInDoc = data.documents[i].aliasList;
			if(getIndexInList(node,aliasesInDoc)!=-1){ // check if current node exists in the document
				if(getIndexInList(data.documents[i],graphData.nodes)==-1){ // check if the document already exists in graph's node list
					//console.log("hi")
					graphData.nodes.push(data.documents[i]); //add new documents to list of graph nodes
					//newAdditions.push(data.documents[i])
				}
			}
		}
		for(var i=startLengthOfNodeList;i<graphData.nodes.length;i++){ // start from new addition index
			for(var j=0;j<i-1;j++){ // check against all nodes before current one
				if(graphData.nodes[j] instanceof Alias){ // if node is a alias (since only new docs are added, only links with aliases can be formed)
					if(getIndexInList(graphData.nodes[j],graphData.nodes[i].aliasList)!=-1){ // if doc contains the current node (i.e. if there should be a link)
						var currentLink = {"source":i,"target":j};
						if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
							//console.log(currentLink)
							graphData.links.push(currentLink);
						}
					}
				}
			}
		}
	}else{ // double clicked node is a document
		//console.log("hi")
		var aliasesInDoc = node.aliasList; // get all aliases in current document
		//console.log(getIndexInList(aliasesInDoc[1],data.aliases));
		//console.log(getIndexInList(data.aliases[166],aliasesInDoc))
		for(var i=0;i<aliasesInDoc.length;i++){
			//console.log(getIndexInList(aliasesInDoc[i],graphData.nodes))
			if(getIndexInList(aliasesInDoc[i],graphData.nodes)==-1){
				//console.log("hi")
				graphData.nodes.push(aliasesInDoc[i]);
			}			
		}

		for(var i=startLengthOfNodeList;i<graphData.nodes.length;i++){
			for(var j=0;j<i-1;j++){
				if(graphData.nodes[j] instanceof Doc){ // if node is a document (since only new aliases are added, only links with docs can be formed)
					if(getIndexInList(graphData.nodes[i],graphData.nodes[j].aliasList)!=-1){ // if there is a link which should be drawn
						var currentLink = {"source":i,"target":j}
						if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
							graphData.links.push(currentLink);
						}
					}
				}
			}
		}
	}
	
}

function removeNodeAndLinks(d){
	for(var i=0;i<graphData.links.length;i++){
		//find and remove based on source and target
	}
	for(var i=0;i<graphData.nodes.length;i++){
		//find and remove
	}
}

function addNode(node){
	var startLengthOfNodeList = graphData.nodes.length;
	if(getIndexInList(node,graphData.nodes)==-1){
			graphData.nodes.push(node);
	}
	if(node instanceof Doc){
		for(var i=startLengthOfNodeList;i<graphData.nodes.length;i++){
			for(var j=0;j<i-1;j++){
				if(graphData.nodes[j] instanceof Doc){ // if node is a document (since only new aliases are added, only links with docs can be formed)
					if(getIndexInList(graphData.nodes[i],graphData.nodes[j].aliasList)!=-1){ // if there is a link which should be drawn
						var currentLink = {"source":i,"target":j}
						if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
							graphData.links.push(currentLink);
						}
					}
				}
			}
		}
	}else{
		for(var i=startLengthOfNodeList;i<graphData.nodes.length;i++){ // start from new addition index
			for(var j=0;j<i-1;j++){ // check against all nodes before current one
				if(graphData.nodes[j] instanceof Alias){ // if node is a alias (since only new docs are added, only links with aliases can be formed)
					if(getIndexInList(graphData.nodes[j],graphData.nodes[i].aliasList)!=-1){ // if doc contains the current node (i.e. if there should be a link)
						var currentLink = {"source":i,"target":j};
						if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
							//console.log(currentLink)
							graphData.links.push(currentLink);
						}
					}
				}
			}
		}
	}
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

	  nodeCircles.on("dblclick",function(d){
	  	doubleClickEvent(d);
	  });

	  function doubleClickEvent(d){
	  	//console.log(graphData.nodes.length)
	  	//console.log(graphData.links.length)
	  	//console.log("-------------------")
	  	addRelatedDocuments(d)
	  	//console.log(graphData.links.length)
	  	link = link.data(graphData.links);
		var newLinks = link.enter();

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});
		var newNodes = node.enter().insert("g").attr("class", "node").call(force.drag);
		
		nodeCircles = newNodes.append("circle").attr("r", 5).style("fill",function(d){ return color(d.type)});
		
		nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .text(function(d) { return d.name ? d.name : d.title; });		
		
		force.start();
		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});
	  }

}

(function () {

    graphTool = {};

    graphTool.init = function (params) {

    };

    graphTool.draw = function (params) {
    	//generateGraphData();//temporary call
    	//console.log(data.aliases[1] instanceof Doc)
    	addNode(data.aliases[1]);
    	addNode(data.documents[1]);
    	//addNode(data.aliases[4]);
    	//addNode(data.documents[0]);
    	drawGraphViz();
    };

})();