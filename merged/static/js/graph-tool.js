$("#cleargraphbutton").on("click",function(){
	console.log(graphData.nodes.length)
	while(graphData.nodes.length!=0){
		for(var i=0;i<graphData.nodes.length;i++){
			removeNodeAndLinks(graphData.nodes[i])
		}
	}
	/*for(var i=0;i<graphData.nodes.length;i++){
		removeNodeAndLinks(graphData.nodes[i])
	}
	for(var i=0;i<graphData.nodes.length;i++){
		removeNodeAndLinks(graphData.nodes[i])
	}
	for(var i=0;i<graphData.nodes.length;i++){
		removeNodeAndLinks(graphData.nodes[i])
	}
	for(var i=0;i<graphData.nodes.length;i++){
		removeNodeAndLinks(graphData.nodes[i])
	}
	for(var i=0;i<graphData.nodes.length;i++){
		removeNodeAndLinks(graphData.nodes[i])
	}
	for(var i=0;i<graphData.nodes.length;i++){
		removeNodeAndLinks(graphData.nodes[i])
	}*/
	linkedByIndex = {};
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
		
		nodeCircles = newNodes.append("circle")
						.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length);
	  				   	 }
	  				   	})
						.style("fill",function(d){ 
							if(d instanceof Alias){
		  				   		return d.mainEnt.color;
		  				   	}else{
		  				   		return d.color;
		  				   	}
							//return color(d.type)
						});
		
		d3.selectAll(".node").select("circle").style("stroke",function(d){
							if(d.expanded==true){
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
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
						})
						.style("fill",function(d){
							if(d.expanded==true){
								return "white"
							}else{
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type);
							}
						});
		/*
		var nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(d){
				      	if(d instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeTextScale(d.aliasList.length);
	  				   	 }
				      })
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });							
		*/
		force.start();		
		//console.log("duplication")

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);	  			  
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});		

	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});

	  	d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });
	  	
	  	force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  });

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});
});

function addNewNodeToGraphFromAnotherView(newNodeLabel,newNodeToAdd){
		//alert("I'm here")
		addNode(newNodeLabel,newNodeToAdd);
		link = link.data(graphData.links);
		var newLinks = link.enter();

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});
		var newNodes = node.enter().insert("g").attr("class", "node").call(drag);
		
		nodeCircles = newNodes.append("circle")
							.attr("r",function(d){
			  				   	 if(d instanceof Alias){
			  				   	 	return nodeScale(getDocCountForAlias(d));
			  				   	 }else{
			  				   	 	return nodeScale(d.aliasList.length);
			  				   	 }
		  				   	})
							.style("fill",function(d){ 
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
							});		
		force.start();
		d3.selectAll(".link").style("stroke-width",function(d){
			//console.log(d.source.aliasList)
	      	if(d.source instanceof Doc){
	      	//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      	//	console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });

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

	 nodeCircles.on("contextmenu",function(d){
     	d3.event.preventDefault();
     	rightClickEvent(d)     	
	 });

	  nodeCircles.on("mouseout",function(d){	  	
	  	mouseout(d);
	  });

	  nodeCircles.on("mouseover",function(d){	  	
	  	mouseover(d);
	  });

	  nodeCircles.on("click",function(d){
	  	mouseClick(d);
	  });

	  graphData.links.forEach(function(d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
          linkedByIndex[d.target.index + "," + d.source.index] = 1;
      });

	  d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });


	  function rightClickEvent(d){
	  	removeNodeAndLinks(d);
	  	linkedByIndex = {};
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
		
		nodeCircles = newNodes.append("circle")
						.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length);
	  				   	 }
	  				   	})
						.style("fill",function(d){ 
							if(d instanceof Alias){
		  				   		return d.mainEnt.color;
		  				   	}else{
		  				   		return d.color;
		  				   	}
							//return color(d.type)
						});
		
		d3.selectAll(".node").select("circle").style("stroke",function(d){
							if(d.expanded==true){
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
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
						})
						.style("fill",function(d){
							if(d.expanded==true){
								return "white"
							}else{
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type);
							}
						});
		/*
		var nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(d){
				      	if(d instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeTextScale(d.aliasList.length);
	  				   	 }
				      })
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });							
		*/
		force.start();		
		//console.log("duplication")

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);	  			  
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});		

	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});

	  	d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });
	  	
	  	force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  });

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});
	  }


	  function doubleClickEvent(d){	  	
	  	linkedByIndex = {};
	  	//console.log(graphData.links.length)
	  	if(d.expanded==false){
	  		addRelatedNodes(d);
	  	}else{
	  		collapseNode(d);
	  	}
	  	//console.log(graphData.links.length)
	  	//addRelatedNodes(d);

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
		
		nodeCircles = newNodes.append("circle")
						.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length);
	  				   	 }
	  				   	})
						.style("fill",function(d){ 
							if(d instanceof Alias){
		  				   		return d.mainEnt.color;
		  				   	}else{
		  				   		return d.color;
		  				   	}
							//return color(d.type)
						});
		
		d3.selectAll(".node").select("circle").style("stroke",function(d){
							if(d.expanded==true){
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
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
						})
						.style("fill",function(d){
							if(d.expanded==true){
								return "white"
							}else{
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type);
							}
						});						
				
		force.start();		
		//console.log("duplication")

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});		

	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});

	  	d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)	      		
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });
	  	
	  	force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  });

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});

		d3.selectAll(".node").each(function(i){
			if(i.expanded==true){
//				console.log(i)
				if(i.alreadyExpanded!=true){
					d3.select(this).append("text").attr("dx", 12)
					      .attr("dy", ".35em")
					      .style("font-size",function(){
					      	if(i instanceof Alias){
		  				   	 	return nodeTextScale(getDocCountForAlias(i));
		  				   	 }else{
		  				   	 	return nodeTextScale(i.aliasList.length);
		  				   	 }
					      })
					      .style("font-family","sans-serif")
					      .text(function() { return i.name ? i.name : i.title; });		
				}
			}
		})
		d.alreadyExpanded=true;
	  }
	  
	  $("#addnewnodebutton").on("click",function(){	  	
	  	addNode($("#newNodeInputBox").val());
	  	
	  	link = link.data(graphData.links);
		var newLinks = link.enter();

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});
		var newNodes = node.enter().insert("g").attr("class", "node").call(drag);
		
		nodeCircles = newNodes.append("circle")
							.attr("r",function(d){
			  				   	 if(d instanceof Alias){
			  				   	 	return nodeScale(getDocCountForAlias(d));
			  				   	 }else{
			  				   	 	return nodeScale(d.aliasList.length);
			  				   	 }
		  				   	})
							.style("fill",function(d){ 
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
							});
		
		/*nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(d){
				      	if(d instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeTextScale(d.aliasList.length);
	  				   	 }
				      })
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });		
	*/


		force.start();
		d3.selectAll(".link").style("stroke-width",function(d){
			//console.log(d.source.aliasList)
	      	if(d.source instanceof Doc){
	      	//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      	//	console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});
	  	
	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});	  	

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});

	  	tempIndex+=1;
	  });		
}


function searchNodeInGraph(){
	graphnodes = []
	for(var i=0;i<graphData.nodes.length;i++){
		if(graphData.nodes[i] instanceof Doc){
			graphnodes.push(graphData.nodes[i].title)
		}else{
			graphnodes.push(graphData.nodes[i].name)
		}
	}	
	
	$("#searchNode").autocomplete({
		source: graphnodes
	});
	/*$("#searchNode").autocomplete({
			source: getSortedKeys(finalDOIMap),
			minLength: 0,
		}).focus(function () {
			$(this).autocomplete("searchNode");
		});*/
	var selectedVal = document.getElementById('searchNode').value.toLowerCase();
	if (selectedVal=="") {
		d3.selectAll(".node").style("opacity",1);
		d3.selectAll(".link").style("opacity",1);
	}else{		
		d3.selectAll(".node").style("opacity",function(d){
			if(d instanceof Doc){
				if(d.title.toLowerCase()==selectedVal){
					return 1;
				}else{
					return 0.1;
				}
			}else{
				if((d.name.toLowerCase()==selectedVal)){
					return 1;
				}else{
					return 0.1
				}
			}			
		})
		d3.selectAll(".link").style("opacity",function(d){
			if(d.source instanceof Doc){
				if(d.source.title.toLowerCase()==selectedVal){
					return 1;
				}else{
					return 0.1;
				}
			}else if(d.target instanceof Doc){
				if(d.target.title.toLowerCase()==selectedVal){
					return 1;
				}else{
					return 0.1;
				}
			}else if(d.source instanceof Alias){
				if(d.source.name.toLowerCase()==selectedVal){
					return 1;
				}else{
					return 0.1
				}
			}else if(d.target instanceof Alias){
				if(d.target.name.toLowerCase()==selectedVal){
					return 1;
				}else{
					return 0.1
				}
			}
		})
	}
}



function getOccuranceCount(object,list){
	var count = 0;
	for(var i=0;i<list.length;i++){
		if(object==list[i]){
			count+=1;
		}
	}
	return count;
}

function listsContainCommonElements(list1,list2){
	for(var i=0;i<list1.length;i++){
		for(var j=0;j<list2.length;j++){
			if(list1[i]==list2[j]){
				return 1;
			}
		}
	}
}

var firstTimeOnView = 1;
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
		for(var i=0;i<graphData.links.length;i++){
			if(((graphData.nodes[currentLink.source] == graphData.links[i].source) && (graphData.nodes[currentLink.target] == graphData.links[i].target)) || ((graphData.nodes[currentLink.source] == graphData.links[i].target) && (graphData.nodes[currentLink.target] == graphData.links[i].source)) || ((graphData.nodes[currentLink.target] == graphData.links[i].source) && (graphData.nodes[currentLink.source] == graphData.links[i].target))){				
				return 1;
			}
		}

		for(var i=0;i<graphData.links.length;i++){
			if(((currentLink.source == graphData.links[i].source) && (currentLink.target == graphData.links[i].target)) || ((currentLink.source == graphData.links[i].target) && (currentLink.target == graphData.links[i].source)) || ((currentLink.target == graphData.links[i].source) && (currentLink.source == graphData.links[i].target))){				
				return 1;
			}
		}	
	return -1;
}

function getDocCountForAlias(alias){
	var count = 0;
	for(var i=0;i<data.documents.length;i++){
		if(getIndexInList(alias,data.documents[i].aliasList)!=-1){
			count+=1;
		}
	}
	return count;
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



function addRelatedNodes(node){
	// add new nodes to graph's node list
	//var newAdditions = [];
	if(node instanceof Alias){
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[node.name+"_"+node.id].push({"event":"expanded_in_graph","time":curTime})
	}else{
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[node.title].push({"event":"expanded_in_graph","time":curTime})
	}

	node.expanded = true;
	var startLengthOfNodeList = graphData.nodes.length;
	var alreadyExistingNode = 0;
	if(node instanceof Alias){ // double clicked node is an alias
		for(var i=0;i<data.documents.length;i++){
			var aliasesInDoc = data.documents[i].aliasList;
			if(getIndexInList(node,aliasesInDoc)!=-1){ // check if current node exists in the document
				if(getIndexInList(data.documents[i],graphData.nodes)==-1){ // check if the document already exists in graph's node list
					//console.log("hi")
					var curDoc = data.documents[i];
					curDoc.expanded = false;
					curDoc.isSelected = false;
					graphData.nodes.push(curDoc); //add new documents to list of graph nodes
					docTool.add(curDoc,null)
					if(getIndexInList(curDoc.title,Object.keys(provenanceMap))==-1){
						curTime = (new Date()-sessionStartTime)/1000;
						provenanceMap[curDoc.title] = [{"event":"added_to_graph_by_expanding","time":curTime}];
					}else{
						curTime = (new Date()-sessionStartTime)/1000;
						provenanceMap[curDoc.title].push({"event":"added_to_graph_by_expanding","time":curTime});
					}
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
				aliasesInDoc[i].isSelected = false;
				graphData.nodes.push(aliasesInDoc[i]);
				if(getIndexInList(aliasesInDoc[i].name+"_"+aliasesInDoc[i].id,Object.keys(provenanceMap))==-1){
					curTime = (new Date()-sessionStartTime)/1000;
					provenanceMap[aliasesInDoc[i].name+"_"+aliasesInDoc[i].id] = [{"event":"added_to_graph_by_expanding","time":curTime}];
				}else{
					curTime = (new Date()-sessionStartTime)/1000;
					provenanceMap[aliasesInDoc[i].name+"_"+aliasesInDoc[i].id].push({"event":"added_to_graph_by_expanding","time":curTime});
				}
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

function removeNodeAndLinks(node){
	node.alreadyExpanded = false;
	node.fixed = false;
	if(node instanceof Doc){
		//docTool.removeDoc(node)
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[node.title].push({"event":"removed_from_graph","time":curTime})
	}else{
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[node.name+"_"+node.id].push({"event":"removed_from_graph","time":curTime})
	}
	node.expanded=false;
	var nodesToDelete = [];
	var linksToDelete = [];
	nodesToDelete.push(node)
	for(var i=0; i<graphData.links.length;i++){
		if(graphData.links[i].source==node){
			linksToDelete.push(graphData.links[i]);			
			nodesToDelete.push(graphData.links[i].target);						
			graphData.links[i].target.fixed=false;
			graphData.links[i].target.alreadyExpanded = false;
			if(graphData.links[i].target instanceof Doc){
				/*if(linkCount(graphData.links[i].target)==1){					
					docTool.removeDoc(graphData.links[i].target)
				}*/
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[graphData.links[i].target.title].push({"event":"removed_from_graph_by_deletion","time":curTime})
			}else{
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[graphData.links[i].target.name+"_"+graphData.links[i].target.id].push({"event":"removed_from_graph_by_deletion","time":curTime})
			}
		}else if(graphData.links[i].target==node){			
			linksToDelete.push(graphData.links[i]);
			nodesToDelete.push(graphData.links[i].source);			
			graphData.links[i].source.fixed=false;
			graphData.links[i].source.alreadyExpanded=false;
			if(graphData.links[i].source instanceof Doc){
				/*if(linkCount(graphData.links[i].source)){
					docTool.removeDoc(graphData.links[i].source)
				}*/
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[graphData.links[i].source.title].push({"event":"removed_from_graph_by_deletion","time":curTime})
			}else{
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[graphData.links[i].source.name+"_"+graphData.links[i].source.id].push({"event":"removed_from_graph_by_deletion","time":curTime})
			}
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
			if(nodesToDelete[i] instanceof Doc){
				docTool.removeDoc(nodesToDelete[i])
			}
		}
	}	
}

function linkCount(node){
	var count = 0;	
	for(var i=0;i<graphData.links.length;i++){
		if(graphData.links[i].source==node || graphData.links[i].target==node){
			//console.log(graphData.links[i])
			count += 1;
		}
	}
	//console.log(count)
	return count;
}

function collapseNode(node){
	if(node instanceof Doc){
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[node.title].push({"event":"collapsed_in_graph","time":curTime})
	}else{
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[node.name+"_"+node.id].push({"event":"collapsed_in_graph","time":curTime})
	}
	node.expanded=false;
	var nodesToDelete = [];
	var linksToDelete = [];
	for(var i=0; i<graphData.links.length;i++){
		if(graphData.links[i].source==node){
			if(linkCount(graphData.links[i].target)==1){
				linksToDelete.push(graphData.links[i]);			
				nodesToDelete.push(graphData.links[i].target);
				graphData.links[i].target.fixed = false;
				graphData.links[i].target.alreadyExpanded = false;
				if(graphData.links[i].target instanceof Doc){
					docTool.removeDoc(graphData.links[i].target)
					curTime = (new Date()-sessionStartTime)/1000;
					provenanceMap[graphData.links[i].target.title].push({"event":"removed_from_graph_by_collapse","time":curTime})
				}else{
					curTime = (new Date()-sessionStartTime)/1000;
					provenanceMap[graphData.links[i].target.name+"_"+graphData.links[i].target.id].push({"event":"removed_from_graph_by_collapse","time":curTime})
				}
			}
		}else if(graphData.links[i].target==node){
			if(linkCount(graphData.links[i].source)==1){
				linksToDelete.push(graphData.links[i]);
				nodesToDelete.push(graphData.links[i].source);			
				graphData.links[i].source.fixed= false;
				graphData.links[i].source.alreadyExpanded=false;
				if(graphData.links[i].source instanceof Doc){
					docTool.removeDoc(graphData.links[i].source);
					curTime = (new Date()-sessionStartTime)/1000;
					provenanceMap[graphData.links[i].source.title].push({"event":"removed_from_graph_by_collapse","time":curTime})
				}else{
					curTime = (new Date()-sessionStartTime)/1000;
					provenanceMap[graphData.links[i].source.name+"_"+graphData.links[i].source.id].push({"event":"removed_from_graph_by_collapse","time":curTime})
				}
			}
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

function addNode(nodeName, newNode){
	//console.log(nodeName,node)
	if(!newNode){
        for(var i=0;i<data.documents.length;i++){
            if(nodeName==data.documents[i].title){
                newNode = data.documents[i];
                /*newNode.x=document.getElementById("viz-graph").offsetWidth/2;
	    		newNode.y=document.getElementById("viz-graph").offsetHeight/2;*/
                //console.log(data.documents[i])
                docTool.add(data.documents[i]);
                break;
            }else{
                for(var j=0;j<data.documents[i].aliasList.length;j++){
                    if(nodeName==data.documents[i].aliasList[j].name){
                        newNode = data.documents[i].aliasList[j];
                        //newNode.x=document.getElementById("viz-graph").offsetWidth/2;
	    				//newNode.y=document.getElementById("viz-graph").offsetHeight/2;
                        //console.log(node)
                        break;
                    }
                }
            }
        }
    }//else{
	   // newNode.x=document.getElementById("viz-graph").offsetWidth/2;
	   // newNode.y=document.getElementById("viz-graph").offsetHeight/2;
    //}
	var startLengthOfNodeList = graphData.nodes.length;
	if(getIndexInList(newNode,graphData.nodes)==-1){
			newNode.expanded = false;
			newNode.isSelected = false;
			graphData.nodes.push(newNode);
	}
	if(newNode instanceof Alias){
		for(var j=0;j<startLengthOfNodeList;j++){
			if(graphData.nodes[j] instanceof Doc){ // since links can only be formed with documents
				if(getIndexInList(newNode,graphData.nodes[j].aliasList)!=-1){// alias exists in document
					var sourceIndex = getIndexInList(newNode,graphData.nodes);
					var currentLink = {"source":sourceIndex,"target":j}
					if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
						graphData.links.push(currentLink);
					}
				}
			}
		}
		//console.log((new Date()-sessionStartTime)/1000);
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[newNode.name+"_"+newNode.id] = [{"event":"added_to_graph","time":curTime}];
		//console.log(provenanceMap)

	}else{
		for(var i=0;i<startLengthOfNodeList;i++){
			if(graphData.nodes[i] instanceof Alias){// since links can only be formed with aliases
				if(getIndexInList(graphData.nodes[i],newNode.aliasList)!=-1){
					var sourceIndex = getIndexInList(newNode,graphData.nodes);
					var currentLink = {"source":sourceIndex,"target":i}
					if(linkExistsInGraph(currentLink)==-1){ // check if link doesn't already exist
						graphData.links.push(currentLink);
					}
				}
			}
		}
		curTime = (new Date()-sessionStartTime)/1000;
		provenanceMap[newNode.title] = [{"event":"added_to_graph","time":curTime}];
	}
	//console.log(provenanceMap)
	document.getElementById("newNodeInputBox").value="";	
}

function dragStarted(d) {
  d3.event.sourceEvent.stopPropagation();
}

function dragged(d) {
  d.fixed=false;
  d3.timer(force.resume);
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y); 
}

function pathViewDragended(d) {  
  d.fixed=true;  
}

var force;
var drag;
var link;
var node;
var linkedByIndex = {};
function neighboring(a, b) {
    //return a.index == b.index || linkedByIndex[a.index + "," + b.index];
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}


function mouseover(d) {
	  //console.log(linkCount(d))
	  if(dateBarClicked==0){

	  	if(d instanceof Doc){
			  d3.selectAll(".discreteBar").style("opacity",function(i){
			  	if(getIndexInList(d.id,i.documentList)!=-1){
			  		return 1;
			  	}else{
			  		return 0.2;
			  	}
			  })
	  	}else{
	  		var docList = [];
	  		for(var i=0;i<data.documents.length;i++){
	  			if(getIndexInList(d,data.documents[i].aliasList)!=-1){
	  				docList.push(data.documents[i].id)
	  			}
	  		}
	  		//console.log(docList)
		  	d3.selectAll(".discreteBar").style("opacity",function(j){
		  		if(listsContainCommonElements(j.documentList,docList)){
					return 1;
			  	}else{
			  		return 0.2;
			  	}	
			})
	  	}

      d3.selectAll(".link").transition().duration(500)
        .style("opacity", function(o) {
        return o.source === d || o.target === d ? 1 : 0.2;
      });
      
      d3.selectAll(".node").transition().duration(500)
        .style("opacity", function(o) {
           return neighboring(d, o) ? 1 : 0.2;
        });     

      d3.selectAll(".node")      
      	.append("text")
      	.attr("class","countlabel")
      	.attr("dx", 12)
		.attr("dy", -10)
      	.style("font-size",function(i){
      		if(i==d){
      			return d.name ? nodeTextScale(getDocCountForAlias(i)) : nodeTextScale(i.aliasList.length);
      		}
      	})
		.style("font-family","sans-serif")
      	.text(function(i){
      		if(i==d){
      			return d.name ? "("+getDocCountForAlias(d)+")" : "("+d.aliasList.length+")";
      		}
      	});
      	}      
      	
      	d3.selectAll(".node").append("text")
      				  .attr("class","templabel")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(i){
				      	if(neighboring(d, i)){
				      	if(i instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(i));
	  				   	 }else{
	  				   	 	return nodeTextScale(i.aliasList.length);
	  				   	 }
	  				   	}
				      })
				      .style("font-family","sans-serif")
				      .text(function(i) { 
				      	if(neighboring(d,i)){
				      		return i.name ? i.name : i.title; 
				      	}
				      });				
		
}

function mouseout() {
	if(dateBarClicked==0){
		d3.selectAll(".discreteBar").style("opacity",1)
  d3.selectAll(".link").transition().duration(500)
        .style("opacity", 1);
  d3.selectAll(".node").transition().duration(500)
        .style("opacity", 1);
  d3.selectAll(".templabel").remove();  
  d3.selectAll(".countlabel").remove();
  }
}


function mouseClick(d){
	d.fixed=true;
	if (d3.event.shiftKey) {
        d.isSelected = true;

        d3.selectAll(".node").each(function(i){
			if(i==d && i.isSelected==true){
				if(i instanceof Doc){
					docTool.openDoc(i)
				}				
				d3.select(this)
					.append("circle")
					.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d))+3;
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length)+3;
	  				  	}
					})
					.attr("class","holloweffect")
					.style("fill","none")
					.style("stroke",function(i){
						if(i instanceof Doc){
							return d3.rgb(i.color).brighter(2);	
						}else{
							return d3.rgb(i.mainEnt.color).brighter(2);
						}
						
					})
					.style("stroke-width","2")
					.style("z-index","-1");
			}			
		});

        /*d3.selectAll(".node").select("text")
		  .style("stroke",function(i){
		  	return i.isSelected ? "yellow" : "";
		  })
		  .style("stroke-width",function(i){
		  	return i.isSelected ? "4":"0";
		  });
		*/
		if(dateBarClicked==1){
			if(d instanceof Doc){
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[d.title].push({"event":"clicked_with_time_freeze","time":curTime})
			}else{
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[d.name+"_"+d.id].push({"event":"clicked_with_time_freeze","time":curTime})
			}
		}
    }else{
		for(var i=0;i<graphData.nodes.length;i++){
			graphData.nodes[i].isSelected = false;
			if(graphData.nodes[i] instanceof Doc){
				docTool.collapse(graphData.nodes[i])
			}
		}
		d3.selectAll(".node").select(".holloweffect").remove();
		d.isSelected = true;
		//d3.select(this).style("outline-color","black").style("outline-width","3px");

		/*
		d3.selectAll(".node").select("circle")
		  .style("outline-color",function(i){
		  	return i.isSelected ? "black" : ""})
		  .style("outline-width",function(i){
		  	return i.isSelected ? "3px" : "";
		  });*/
		d3.selectAll(".node").each(function(i){
			if(i==d && i.isSelected==true){
				if(i instanceof Doc){
//					console.log(i)
					docTool.openDoc(i)
				}				
				d3.select(this)
					.append("circle")
					.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d))+3;
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length)+3;
	  				  	}
					})
					.attr("class","holloweffect")
					.style("fill","none")
					.style("stroke",function(i){
						if(i instanceof Doc){
							return d3.rgb(i.color).brighter(2);	
						}else{
							return d3.rgb(i.mainEnt.color).brighter(2);
						}
						
					})
					.style("stroke-width","2")
					.style("z-index","-1");
			}			
		});
		
		if(dateBarClicked==1){
			if(d instanceof Doc){
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[d.title].push({"event":"clicked_with_time_freeze","time":curTime})
			}else{
				curTime = (new Date()-sessionStartTime)/1000;
				provenanceMap[d.name+"_"+d.id].push({"event":"clicked_with_time_freeze","time":curTime})
			}
		}
	}
}

var nodeScale = d3.scale.log().domain([1,70]).range([3,8]);
var nodeTextScale = d3.scale.log().domain([1,70]).range([7,12]);
var linkStrokeScale = d3.scale.log().domain([1,7]).range([1,50]);
var color = d3.scale.category10();


function drawGraphViz(newNodeLabel,newNodeToAdd){
	 function dragstart(d, i) {
        force.stop() // stops the force auto positioning before you start dragging
        d3.event.sourceEvent.stopPropagation();
    }

    function dragmove(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy; 
        tick();
    }

    function dragend(d, i) {
        d.fixed = true;
        tick();
        force.resume();
    }


	var width = document.getElementById("viz-graph").offsetWidth,
    height = document.getElementById("viz-graph").offsetHeight;

	var svg = d3.select("#viz-graph").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .call(zoom).on("dblclick.zoom", null);;

	container = svg.append("g");

	force = d3.layout.force()
	    .gravity(0)
    	.distance(150)
    	.charge(-250)
    	.alpha(-1)
    	.chargeDistance(300)
	    .size([width, height]);

	 force.nodes(graphData.nodes)
	     .links(graphData.links)
	     .start();

	 drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstart)
      .on("drag", dragmove)
      .on("dragend", dragend);

	     /*
	var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragStarted)
      .on("drag", dragged)
      .on("dragend", pathViewDragended);*/


	  link = container.selectAll(".link") //svg.selectAll(".link")
	      .data(graphData.links)
	    .enter().append("line")
	      .attr("class", "link");	      

	  node = container.selectAll(".node") //svg.selectAll(".node")
	      .data(graphData.nodes)
	    	.enter().append("g")
	      .attr("class", "node")
	      .call(drag);

	  var nodeCircles = node.append("circle")
	  				   .attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length);
	  				   	 }
	  				   })
	  				   .style("fill",function(d){ 
	  				   	if(d instanceof Alias){
	  				   		return d.mainEnt.color;
	  				   	}else{
	  				   		return d.color;
	  				   	}
	  				   	//return color(d.type)
	  				   });	  				   
	  /*
	  var nodeLabels = node.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(d){
				      	if(d instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeTextScale(d.aliasList.length);
	  				   	 }
				      })
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });		 
		*/
	 function tick() {
      link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };

    //force.on("tick",tick());
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

	 nodeCircles.on("contextmenu",function(d){
     	d3.event.preventDefault();
     	rightClickEvent(d)     	
	 });

	  nodeCircles.on("mouseout",function(d){	  	
	  	mouseout(d);
	  });

	  nodeCircles.on("mouseover",function(d){	  	
	  	mouseover(d);
	  });

	  nodeCircles.on("click",function(d){
	  	mouseClick(d);
	  });

	  graphData.links.forEach(function(d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
          linkedByIndex[d.target.index + "," + d.source.index] = 1;
      });

	  d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });


	  function rightClickEvent(d){
	  	removeNodeAndLinks(d);
	  	linkedByIndex = {};
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
		
		nodeCircles = newNodes.append("circle")
						.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length);
	  				   	 }
	  				   	})
						.style("fill",function(d){ 
							if(d instanceof Alias){
		  				   		return d.mainEnt.color;
		  				   	}else{
		  				   		return d.color;
		  				   	}
							//return color(d.type)
						});
		
		d3.selectAll(".node").select("circle").style("stroke",function(d){
							if(d.expanded==true){
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
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
						})
						.style("fill",function(d){
							if(d.expanded==true){
								return "white"
							}else{
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type);
							}
						});
		/*
		var nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(d){
				      	if(d instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeTextScale(d.aliasList.length);
	  				   	 }
				      })
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });							
		*/
		force.start();		
		//console.log("duplication")

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);	  			  
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});		

	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});

	  	d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });
	  	
	  	force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  });

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});
	  }


	  function doubleClickEvent(d){	  	
	  	linkedByIndex = {};
	  	//console.log(graphData.links.length)
	  	if(d.expanded==false){
	  		addRelatedNodes(d);
	  	}else{
	  		collapseNode(d);
	  	}
	  	//console.log(graphData.links.length)
	  	//addRelatedNodes(d);

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
		
		nodeCircles = newNodes.append("circle")
						.attr("r",function(d){
	  				   	 if(d instanceof Alias){
	  				   	 	return nodeScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeScale(d.aliasList.length);
	  				   	 }
	  				   	})
						.style("fill",function(d){ 
							if(d instanceof Alias){
		  				   		return d.mainEnt.color;
		  				   	}else{
		  				   		return d.color;
		  				   	}
							//return color(d.type)
						});
		
		d3.selectAll(".node").select("circle").style("stroke",function(d){
							if(d.expanded==true){
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
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
						})
						.style("fill",function(d){
							if(d.expanded==true){
								return "white"
							}else{
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type);
							}
						});						
				
		force.start();		
		//console.log("duplication")

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});		

	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});

	  	d3.selectAll(".link").style("stroke-width",function(d){
	      	if(d.source instanceof Doc){
	      		//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      		//console.log(d.target.mainEnt,d.source.aliasList)	      		
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });
	  	
	  	force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  });

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});

		d3.selectAll(".node").each(function(i){
			if(i.expanded==true){
//				console.log(i)
				if(i.alreadyExpanded!=true){
					d3.select(this).append("text").attr("dx", 12)
					      .attr("dy", ".35em")
					      .style("font-size",function(){
					      	if(i instanceof Alias){
		  				   	 	return nodeTextScale(getDocCountForAlias(i));
		  				   	 }else{
		  				   	 	return nodeTextScale(i.aliasList.length);
		  				   	 }
					      })
					      .style("font-family","sans-serif")
					      .text(function() { return i.name ? i.name : i.title; });		
				}
			}
		})
		d.alreadyExpanded=true;
	  }
	  
	  $("#addnewnodebutton").on("click",function(){	  	
	  	addNode($("#newNodeInputBox").val());
	  	
	  	link = link.data(graphData.links);
		var newLinks = link.enter();

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});
		var newNodes = node.enter().insert("g").attr("class", "node").call(drag);
		
		nodeCircles = newNodes.append("circle")
							.attr("r",function(d){
			  				   	 if(d instanceof Alias){
			  				   	 	return nodeScale(getDocCountForAlias(d));
			  				   	 }else{
			  				   	 	return nodeScale(d.aliasList.length);
			  				   	 }
		  				   	})
							.style("fill",function(d){ 
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
							});
		
		/*nodeLabels = newNodes.append("text")
				      .attr("dx", 12)
				      .attr("dy", ".35em")
				      .style("font-size",function(d){
				      	if(d instanceof Alias){
	  				   	 	return nodeTextScale(getDocCountForAlias(d));
	  				   	 }else{
	  				   	 	return nodeTextScale(d.aliasList.length);
	  				   	 }
				      })
				      .style("font-family","sans-serif")
				      .text(function(d) { return d.name ? d.name : d.title; });		
	*/


		force.start();
		d3.selectAll(".link").style("stroke-width",function(d){
			//console.log(d.source.aliasList)
	      	if(d.source instanceof Doc){
	      	//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      	//	console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});
	  	
	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});	  	

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});

	  	tempIndex+=1;
	  });
	/*
	if(newNodeToAdd){
		alert("I'm here")
		addNode(newNodeLabel,newNodeToAdd);
	  	
	  	link = link.data(graphData.links);
		var newLinks = link.enter();

		newLinks.insert("line", ".node").attr("class", "link");
		
		//console.log(graphData.nodes.length)
		node = node.data(graphData.nodes,function(i){return i.id;});
		var newNodes = node.enter().insert("g").attr("class", "node").call(drag);
		
		nodeCircles = newNodes.append("circle")
							.attr("r",function(d){
			  				   	 if(d instanceof Alias){
			  				   	 	return nodeScale(getDocCountForAlias(d));
			  				   	 }else{
			  				   	 	return nodeScale(d.aliasList.length);
			  				   	 }
		  				   	})
							.style("fill",function(d){ 
								if(d instanceof Alias){
			  				   		return d.mainEnt.color;
			  				   	}else{
			  				   		return d.color;
			  				   	}
								//return color(d.type)
							});		

		force.start();
		d3.selectAll(".link").style("stroke-width",function(d){
			//console.log(d.source.aliasList)
	      	if(d.source instanceof Doc){
	      	//console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.target.mainEnt,d.source.aliasList));
	      	}else{
	      	//	console.log(d.target.mainEnt,d.source.aliasList)
	      		return linkStrokeScale(getOccuranceCount(d.source.mainEnt,d.target.aliasList))
	      	}
	      });

		nodeCircles.on("dblclick",function(i){
	  		doubleClickEvent(i);
	  	});

	  	nodeCircles.on("contextmenu",function(i){
	     	d3.event.preventDefault();
	     	rightClickEvent(i)
	 	});

	  	nodeCircles.on("mouseout",function(d){	  	
	  		mouseout(d);
	  	});

	  	nodeCircles.on("mouseover",function(d){	  	
	  		mouseover(d);
	  	});
	  	
	  	nodeCircles.on("click",function(d){
	  		mouseClick(d);
	  	});	  	

		graphData.links.forEach(function(i) {
          linkedByIndex[i.source.index + "," + i.target.index] = 1;
          linkedByIndex[i.target.index + "," + i.source.index] = 1;
      	});
	}	 
*/
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
    	//console.log(data.documents[0])
    	//allNodes=unique(optArray.sort());
		allNodes = []
		for(var i=0;i<data.documents.length;i++){
		    allNodes.push(data.documents[i].title)
		    for(var j=0;j<data.documents[i].aliasList.length;j++){
		        allNodes.push(data.documents[i].aliasList[j].name)
		    }        
		}
		allNodes=unique(allNodes.sort());
		//console.log(allNodes)		
		$("#newNodeInputBox").autocomplete({
		        source: allNodes
		});
	/*	$("#newNodeInputBox").autocomplete({
			source: allNodes,
			minLength: 0,
		}).focus(function () {
			$(this).autocomplete("newNodeInputBox");
		});*/
    	if(firstTimeOnView==1){
    		firstTimeOnView = 0;
    		drawGraphViz();
    	}    	
    };

})();