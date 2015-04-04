if (!Array.prototype.remove) {
  Array.prototype.remove = function(vals, all) {
    var i, removedItems = [];
    if (!Array.isArray(vals)) vals = [vals];
    for (var j=0;j<vals.length; j++) {
      if (all) {
        for(i = this.length; i--;){
          if (this[i] === vals[j]) removedItems.push(this.splice(i, 1));
        }
      }
      else {
        i = this.indexOf(vals[j]);
        if(i>-1) removedItems.push(this.splice(i, 1));
      }
    }
    return removedItems;
  };
}

var graphData = {
	"nodes":[],
	"links":[]
};
var tempIndex = 0;
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


function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
var container;
var zoom = d3.behavior.zoom()
    .scaleExtent([0.2, 10])
    .on("zoom", zoomed);



function addRelatedDocuments(node){
	// add new nodes to graph's node list
	//var newAdditions = [];
	node.expanded = true;
	var startLengthOfNodeList = graphData.nodes.length;
	var alreadyExistingNode = 0;
	if(node instanceof Alias){ // double clicked node is an alias
		console.log("here")
		for(var i=0;i<data.documents.length;i++){
			var aliasesInDoc = data.documents[i].aliasList;
			if(getIndexInList(node,aliasesInDoc)!=-1){ // check if current node exists in the document
				if(getIndexInList(data.documents[i],graphData.nodes)==-1){ // check if the document already exists in graph's node list
					//console.log("hi")
					var curDoc = data.documents[i];
					curDoc.expanded = false;
					graphData.nodes.push(curDoc); //add new documents to list of graph nodes
					//newAdditions.push(data.documents[i])
				}else{
					alreadyExistingNode = 1;
				}
			}
		}
		for(var i=startLengthOfNodeList;i<graphData.nodes.length;i++){ // start from new addition index
			for(var j=0;j<i;j++){ // check against all nodes before current one
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
		if(alreadyExistingNode==1){
			var sourceIndex = getIndexInList(node,graphData.nodes);
			for(var i=0;i<graphData.nodes.length;i++){
				if(i!=sourceIndex){
					if(graphData.nodes[i] instanceof Doc){
						if(getIndexInList(node,graphData.nodes[i].aliasList)!=-1){
							var currentLink = {"source":sourceIndex,"target":i};
							if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
								//console.log(currentLink)
								graphData.links.push(currentLink);
							}
						}
					}
				}
			}
		}	
	}else{ // double clicked node is a document
		//console.log("hi")
		var aliasesInDoc = node.aliasList; // get all aliases in current document
		var alreadyExistingNodes = [];
		//console.log(getIndexInList(aliasesInDoc[1],data.aliases));
		//console.log(getIndexInList(data.aliases[166],aliasesInDoc))
		for(var i=0;i<aliasesInDoc.length;i++){
			//console.log(getIndexInList(aliasesInDoc[i],graphData.nodes))
			if(getIndexInList(aliasesInDoc[i],graphData.nodes)==-1){
				aliasesInDoc[i].expanded = false;
				graphData.nodes.push(aliasesInDoc[i]);
			}else{
				alreadyExistingNodes.push(aliasesInDoc[i]);
			}	
		}

		for(var i=startLengthOfNodeList;i<graphData.nodes.length;i++){
			for(var j=0;j<i;j++){
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

		if(alreadyExistingNodes.length>0){
			var curDocIndex = getIndexInList(node,graphData.nodes);
			for(var i = 0;i<alreadyExistingNodes.length;i++){
				var curAliasIndex = getIndexInList(alreadyExistingNodes[i],graphData.nodes);
				var currentLink = {"source":curDocIndex,"target":curAliasIndex}
				if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
					graphData.links.push(currentLink);
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

function linkCount(node){
	var count = 0;
	for(var i=0;i<graphData.links.length;i++){
		if(graphData.links[i].source==node || graphData.links[i].target==node){
			count += 1;
		}
	}
	return count;
}

function collapseNode(node){
	node.expanded=false;
	var nodesToDelete = [];
	var linksToDelete = [];
	for(var i=0; i<graphData.links.length;i++){
		if(graphData.links[i].source==node){
			linksToDelete.push(graphData.links[i]);
			nodesToDelete.push(graphData.links[i].target);
		}else if(graphData.links[i].target==node){
			linksToDelete.push(graphData.links[i]);
			nodesToDelete.push(graphData.links[i].source);
		}
	}
	for(var i=0;i<linksToDelete.length;i++){
		var x = graphData.links.indexOf(linksToDelete[i]);
		if(x != -1) {
			graphData.links.splice(x, 1);
		}
	}
	for(var i=0;i<nodesToDelete.length;i++){
		//console.log(linkCount(nodesToDelete[i]))
		if(linkCount(nodesToDelete[i])==0){
			var x = graphData.nodes.indexOf(nodesToDelete[i]);
			if(x != -1) {
				graphData.nodes.splice(x, 1);
			}		
		}
	}
}

function addNode(node){
	//console.log(node)
	var startLengthOfNodeList = graphData.nodes.length;
	if(getIndexInList(node,graphData.nodes)==-1){
			node.expanded = false;
			graphData.nodes.push(node);
	}
	if(node instanceof Alias){
		for(var j=0;j<startLengthOfNodeList;j++){
			if(graphData.nodes[j] instanceof Doc){ // since links can only be formed with documents
				if(getIndexInList(node,graphData.nodes[j].aliasList)!=-1){// alias exists in document
					var sourceIndex = getIndexInList(node,graphData.nodes);
					var currentLink = {"source":sourceIndex,"target":j}
					if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
						graphData.links.push(currentLink);
					}
				}
			}
		}				
	}else{
		for(var i=0;i<startLengthOfNodeList;i++){
			if(graphData.nodes[i] instanceof Alias){// since links can only be formed with aliases
				if(getIndexInList(graphData.nodes[i],node.aliasList)!=-1){
					var sourceIndex = getIndexInList(node,graphData.nodes);
					var currentLink = {"source":sourceIndex,"target":i}
					if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
						graphData.links.push(currentLink);
					}
				}
			}
		}
	}
}

function pathViewDragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
}

function pathViewDragged(d) {
  d.fixed=false;
  d3.timer(force.resume);
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y); 
}

function pathViewDragended(d) {  
  d.fixed=true;  
}
var force;
var linkedByIndex = {};
function neighboring(a, b) {
    //return a.index == b.index || linkedByIndex[a.index + "," + b.index];
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}


function mouseover(d) {
      d3.selectAll(".link").transition().duration(500)
        .style("opacity", function(o) {
        return o.source === d || o.target === d ? 1 : 0.2;
      });
      
      d3.selectAll(".node").transition().duration(500)
        .style("opacity", function(o) {
           return neighboring(d, o) ? 1 : 0.2;
        });
      /*
      d3.selectAll(".node").append("text")
        .attr("class","nodelabel")
        .attr("dx", 12)
		.attr("dy", ".35em")
		.text(function(o) {
			if(d.name){
		 		return neighboring(d, o) ? o.name : "";		 	
		 	}else{
		 		return neighboring(d, o) ? o.title : "";
		 	}
		 });*/
}

function mouseout() {
  d3.selectAll(".link").transition().duration(500)
        .style("opacity", 1);
  d3.selectAll(".node").transition().duration(500)
        .style("opacity", 1);
  d3.selectAll(".nodelabel").remove();
}

function drawGraphViz(){
	var width = document.getElementById("viz-graph").offsetWidth,
    height = document.getElementById("viz-graph").offsetHeight;

	var svg = d3.select("#viz-graph").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .call(zoom).on("dblclick.zoom", null);;

	container = svg.append("g");


	var color = d3.scale.category10();

	force = d3.layout.force()
	    .gravity(0)
    	.distance(150)
    	.charge(-100)
	    .size([width, height]);

	 force.nodes(graphData.nodes)
	     .links(graphData.links)
	     .start();

	var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", pathViewDragstarted)
      .on("drag", pathViewDragged)
      .on("dragend", pathViewDragended);

	  var link = container.selectAll(".link") //svg.selectAll(".link")
	      .data(graphData.links)
	    .enter().append("line")
	      .attr("class", "link");

	  var node = container.selectAll(".node") //svg.selectAll(".node")
	      .data(graphData.nodes)
	    	.enter().append("g")
	      .attr("class", "node")
	      .call(drag);

	  var nodeCircles = node.append("circle")
	  				   .attr("r",5)
	  				   .style("fill",function(d){ return color(d.type)});	  				   
	      
	  var nodeLabels = node.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",10)
				      .style("font-family","sans-serif")
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

	  nodeCircles.on("mouseout",function(d){	  	
	  	mouseout(d);
	  });

	  nodeCircles.on("mouseover",function(d){	  	
	  	mouseover(d);
	  });


	  graphData.links.forEach(function(d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
          linkedByIndex[d.target.index + "," + d.source.index] = 1;
      });

	  function doubleClickEvent(d){
	  	linkedByIndex = {};
	  	//console.log(graphData.links.length)
	  	if(d.expanded==false){
	  		addRelatedDocuments(d);
	  	}else{
	  		collapseNode(d);
	  	}
	  	//console.log(graphData.links.length)
	  	//addRelatedDocuments(d);

	  	link = link.data(graphData.links);
		var exitingLinks = link.exit();
		exitingLinks.remove();
		var newLinks = link.enter();		

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});


		var exitingNodes = node.exit();
		exitingNodes.remove();
		var newNodes = node.enter().insert("g").attr("class", "node").call(drag);
		
		nodeCircles = newNodes.append("circle").attr("r", 5)
						.style("fill",function(d){ return color(d.type)});
		
		d3.selectAll(".node").select("circle").style("stroke",function(d){
							if(d.expanded==true){
								return "black"
							}else{
								return ""
							}
						})
						.style("stroke-width",function(d){
							if(d.expanded==true){
								return 2
							}else{
								return 0
							}
						});

		var nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",10)
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });							

		force.start();
		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});
		
		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});

	  }

	  $("#addnewnodebutton").on("click",function(){
	  	addNode(data.aliases[tempIndex]);
	  	
	  	link = link.data(graphData.links);
		var newLinks = link.enter();

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});
		var newNodes = node.enter().insert("g").attr("class", "node").call(drag);
		
		nodeCircles = newNodes.append("circle").attr("r", 5).style("fill",function(d){ return color(d.type)});
		
		nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",10)
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });		

		force.start();
		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});

	  	tempIndex+=1;
	  });

}

(function () {

    graphTool = {};

    graphTool.init = function (params) {

    };

    graphTool.draw = function (params) {
    	//generateGraphData();//temporary call
    	//console.log(data.aliases[1] instanceof Doc)
    	//addNode(data.aliases[1]);
    	//addNode(data.documents[1]);

    	//addNode(data.aliases[4]);
    	//addNode(data.documents[0]);
    	drawGraphViz();
    };

})();