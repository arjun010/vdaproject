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
		dataToUse = timelineData;
	}

	nv.addGraph(function() {
		var chart = nv.models.discreteBarChart()
	      .x(function(d) { return d.date })    //Specify the data accessors.
	      .y(function(d) { return d.count })
	      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	      .tooltips(true)        //Don't show tooltips
	      .showValues(false) 
	      .showXAxis(false)      //...instead, show the bar value right on top of each bar.
	      .tooltipContent(function (key, date, e, graph) {
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

    	 	return  "<p>" + graph.point.date + "<br>"+ graph.point.count + "<br>" + graph.point.documentList + "</p>";
		   });
	
chart.discretebar.dispatch.on("elementMouseout", function (e) {
	d3.selectAll(".node").style("opacity",1);
	d3.selectAll(".link").style("opacity",1);
});


		  d3.select('#viz-timeline svg')
		      .datum(dataToUse)
		      .call(chart);

		  nv.utils.windowResize(chart.update);

		  return chart;
		});
	//chart.discretebar.dispatch.on("elementClick", function (e) {
}

(function () {

    timeTool = {};


    timeTool.init = function (params) {

    };

    timeTool.draw = function (params) {
    	drawGraph(1);
    	drawGraph(2);
    };

})();



var timelineData = [
 {
  "values": [
   {
    "date": "2004-01-01", 
    "count": 1, 
    "documentList": [
     "1101163941115"
    ]
   }, 
   {
    "date": "2004-01-07", 
    "count": 1, 
    "documentList": [
     "1101163889404"
    ]
   }, 
   {
    "date": "2004-01-08", 
    "count": 1, 
    "documentList": [
     "1101163941116"
    ]
   }, 
   {
    "date": "2004-01-12", 
    "count": 2, 
    "documentList": [
     "1101163887201", 
     "1101243446514"
    ]
   }, 
   {
    "date": "2004-01-14", 
    "count": 1, 
    "documentList": [
     "1201243446612"
    ]
   }, 
   {
    "date": "2004-01-15", 
    "count": 1, 
    "documentList": [
     "1101163853185"
    ]
   }, 
   {
    "date": "2004-01-16", 
    "count": 3, 
    "documentList": [
     "1101163852029", 
     "1101242456221", 
     "1101243424483"
    ]
   }, 
   {
    "date": "2004-01-21", 
    "count": 1, 
    "documentList": [
     "1101243402764"
    ]
   }, 
   {
    "date": "2004-01-22", 
    "count": 1, 
    "documentList": [
     "1101163941118"
    ]
   }, 
   {
    "date": "2004-01-23", 
    "count": 1, 
    "documentList": [
     "1101243381717"
    ]
   }, 
   {
    "date": "2004-01-28", 
    "count": 1, 
    "documentList": [
     "1101163793559"
    ]
   }, 
   {
    "date": "2004-02-02", 
    "count": 1, 
    "documentList": [
     "1101163726024"
    ]
   }, 
   {
    "date": "2004-02-05", 
    "count": 1, 
    "documentList": [
     "1101163941120"
    ]
   }, 
   {
    "date": "2004-02-06", 
    "count": 1, 
    "documentList": [
     "1101243315873"
    ]
   }, 
   {
    "date": "2004-02-09", 
    "count": 1, 
    "documentList": [
     "1101163706824"
    ]
   }, 
   {
    "date": "2004-02-10", 
    "count": 1, 
    "documentList": [
     "1101243294357"
    ]
   }, 
   {
    "date": "2004-02-12", 
    "count": 1, 
    "documentList": [
     "1101234275352"
    ]
   }, 
   {
    "date": "2004-02-13", 
    "count": 1, 
    "documentList": [
     "1101243272357"
    ]
   }, 
   {
    "date": "2004-02-18", 
    "count": 1, 
    "documentList": [
     "1101243250482"
    ]
   }, 
   {
    "date": "2004-02-19", 
    "count": 1, 
    "documentList": [
     "1101163941122"
    ]
   }, 
   {
    "date": "2004-02-27", 
    "count": 1, 
    "documentList": [
     "1101163613791"
    ]
   }, 
   {
    "date": "2004-03-02", 
    "count": 1, 
    "documentList": [
     "1101163595600"
    ]
   }, 
   {
    "date": "2004-03-05", 
    "count": 4, 
    "documentList": [
     "1101163572132", 
     "1101163575072", 
     "1101163941124", 
     "1101243226622"
    ]
   }, 
   {
    "date": "2004-03-15", 
    "count": 3, 
    "documentList": [
     "1101163520244", 
     "1101163520510", 
     "1101243183934"
    ]
   }, 
   {
    "date": "2004-03-18", 
    "count": 1, 
    "documentList": [
     "1101243182966"
    ]
   }, 
   {
    "date": "2004-03-19", 
    "count": 2, 
    "documentList": [
     "1101163498744", 
     "1101163941126"
    ]
   }, 
   {
    "date": "2004-03-22", 
    "count": 1, 
    "documentList": [
     "1101163975356"
    ]
   }, 
   {
    "date": "2004-03-25", 
    "count": 1, 
    "documentList": [
     "1101163477635"
    ]
   }, 
   {
    "date": "2004-03-26", 
    "count": 1, 
    "documentList": [
     "1101163461838"
    ]
   }, 
   {
    "date": "2004-03-29", 
    "count": 1, 
    "documentList": [
     "1101243160012"
    ]
   }, 
   {
    "date": "2004-03-31", 
    "count": 1, 
    "documentList": [
     "1101163444463"
    ]
   }, 
   {
    "date": "2004-04-01", 
    "count": 1, 
    "documentList": [
     "1101163443760"
    ]
   }, 
   {
    "date": "2004-04-02", 
    "count": 1, 
    "documentList": [
     "1101163941128"
    ]
   }, 
   {
    "date": "2004-04-16", 
    "count": 2, 
    "documentList": [
     "1101163356500", 
     "1101163941130"
    ]
   }, 
   {
    "date": "2004-04-20", 
    "count": 1, 
    "documentList": [
     "1101243074777"
    ]
   }, 
   {
    "date": "2004-04-21", 
    "count": 1, 
    "documentList": [
     "1101163390822"
    ]
   }, 
   {
    "date": "2004-04-23", 
    "count": 2, 
    "documentList": [
     "1101163375354", 
     "1101163376276"
    ]
   }, 
   {
    "date": "2004-04-29", 
    "count": 1, 
    "documentList": [
     "1101243052340"
    ]
   }, 
   {
    "date": "2004-05-02", 
    "count": 1, 
    "documentList": [
     "1101163456898"
    ]
   }, 
   {
    "date": "2004-05-04", 
    "count": 1, 
    "documentList": [
     "1101163342119"
    ]
   }, 
   {
    "date": "2004-05-06", 
    "count": 1, 
    "documentList": [
     "1101164682719"
    ]
   }, 
   {
    "date": "2004-05-07", 
    "count": 1, 
    "documentList": [
     "1101163941133"
    ]
   }, 
   {
    "date": "2004-05-10", 
    "count": 1, 
    "documentList": [
     "1101163340400"
    ]
   }, 
   {
    "date": "2004-05-11", 
    "count": 1, 
    "documentList": [
     "1101163324807"
    ]
   }, 
   {
    "date": "2004-05-13", 
    "count": 1, 
    "documentList": [
     "1101163308494"
    ]
   }, 
   {
    "date": "2004-05-14", 
    "count": 1, 
    "documentList": [
     "1101163941134"
    ]
   }, 
   {
    "date": "2004-05-17", 
    "count": 1, 
    "documentList": [
     "1101163307182"
    ]
   }, 
   {
    "date": "2004-05-24", 
    "count": 1, 
    "documentList": [
     "1101163288338"
    ]
   }, 
   {
    "date": "2004-05-26", 
    "count": 1, 
    "documentList": [
     "1101163287775"
    ]
   }, 
   {
    "date": "2004-05-28", 
    "count": 1, 
    "documentList": [
     "1101163941136"
    ]
   }, 
   {
    "date": "2004-06-02", 
    "count": 1, 
    "documentList": [
     "1101163253588"
    ]
   }, 
   {
    "date": "2004-06-03", 
    "count": 1, 
    "documentList": [
     "1101163252385"
    ]
   }, 
   {
    "date": "2004-06-04", 
    "count": 1, 
    "documentList": [
     "1101163235119"
    ]
   }, 
   {
    "date": "2004-06-07", 
    "count": 1, 
    "documentList": [
     "1101163233666"
    ]
   }, 
   {
    "date": "2004-06-09", 
    "count": 1, 
    "documentList": [
     "1101242963292"
    ]
   }, 
   {
    "date": "2004-06-10", 
    "count": 1, 
    "documentList": [
     "1101163834618"
    ]
   }, 
   {
    "date": "2004-06-11", 
    "count": 1, 
    "documentList": [
     "1101163941138"
    ]
   }, 
   {
    "date": "2004-06-19", 
    "count": 1, 
    "documentList": [
     "1101163977242"
    ]
   }, 
   {
    "date": "2004-06-21", 
    "count": 1, 
    "documentList": [
     "1101163197619"
    ]
   }, 
   {
    "date": "2004-06-24", 
    "count": 1, 
    "documentList": [
     "1101163179932"
    ]
   }, 
   {
    "date": "2004-06-25", 
    "count": 1, 
    "documentList": [
     "1101163941140"
    ]
   }, 
   {
    "date": "2004-06-28", 
    "count": 1, 
    "documentList": [
     "1101163162978"
    ]
   }, 
   {
    "date": "2004-06-29", 
    "count": 1, 
    "documentList": [
     "1101242898417"
    ]
   }, 
   {
    "date": "2004-07-02", 
    "count": 1, 
    "documentList": [
     "1101163156775"
    ]
   }, 
   {
    "date": "2004-07-03", 
    "count": 1, 
    "documentList": [
     "1101162143775"
    ]
   }, 
   {
    "date": "2004-07-05", 
    "count": 1, 
    "documentList": [
     "1101163144775"
    ]
   }, 
   {
    "date": "2004-07-06", 
    "count": 1, 
    "documentList": [
     "1101242876245"
    ]
   }, 
   {
    "date": "2004-07-07", 
    "count": 1, 
    "documentList": [
     "1101163128915"
    ]
   }, 
   {
    "date": "2004-07-09", 
    "count": 1, 
    "documentList": [
     "1101163941142"
    ]
   }, 
   {
    "date": "2004-07-13", 
    "count": 1, 
    "documentList": [
     "1101162906435"
    ]
   }, 
   {
    "date": "2004-07-14", 
    "count": 1, 
    "documentList": [
     "1201243446611"
    ]
   }, 
   {
    "date": "2004-07-19", 
    "count": 2, 
    "documentList": [
     "1101163061865", 
     "1101163072805"
    ]
   }, 
   {
    "date": "2004-07-21", 
    "count": 1, 
    "documentList": [
     "1101163044539"
    ]
   }, 
   {
    "date": "2004-07-22", 
    "count": 1, 
    "documentList": [
     "1101242810619"
    ]
   }, 
   {
    "date": "2004-07-23", 
    "count": 1, 
    "documentList": [
     "1101163941144"
    ]
   }, 
   {
    "date": "2004-07-26", 
    "count": 1, 
    "documentList": [
     "1101242809916"
    ]
   }, 
   {
    "date": "2004-07-27", 
    "count": 1, 
    "documentList": [
     "1101242809166"
    ]
   }, 
   {
    "date": "2004-07-28", 
    "count": 1, 
    "documentList": [
     "1101242808401"
    ]
   }, 
   {
    "date": "2004-08-05", 
    "count": 3, 
    "documentList": [
     "1101163004554", 
     "1101242786744", 
     "1101242787244"
    ]
   }, 
   {
    "date": "2004-08-06", 
    "count": 3, 
    "documentList": [
     "1101163002039", 
     "1101163002539", 
     "1101163941146"
    ]
   }, 
   {
    "date": "2004-08-09", 
    "count": 1, 
    "documentList": [
     "1101163001554"
    ]
   }, 
   {
    "date": "2004-08-10", 
    "count": 2, 
    "documentList": [
     "1101242766213", 
     "1101242766682"
    ]
   }, 
   {
    "date": "2004-08-11", 
    "count": 2, 
    "documentList": [
     "1101162982898", 
     "1101242765510"
    ]
   }, 
   {
    "date": "2004-08-13", 
    "count": 2, 
    "documentList": [
     "1101162981695", 
     "1101162982195"
    ]
   }, 
   {
    "date": "2004-08-16", 
    "count": 1, 
    "documentList": [
     "1101162966523"
    ]
   }, 
   {
    "date": "2004-08-17", 
    "count": 2, 
    "documentList": [
     "1101162966023", 
     "1101242745182"
    ]
   }, 
   {
    "date": "2004-08-18", 
    "count": 2, 
    "documentList": [
     "1101162965023", 
     "1101162965507"
    ]
   }, 
   {
    "date": "2004-08-20", 
    "count": 5, 
    "documentList": [
     "1101162948101", 
     "1101162948851", 
     "1101162949366", 
     "1101162964241", 
     "1101163941148"
    ]
   }, 
   {
    "date": "2004-08-24", 
    "count": 3, 
    "documentList": [
     "1101162945882", 
     "1101241536631", 
     "1101242743650"
    ]
   }, 
   {
    "date": "2004-08-25", 
    "count": 2, 
    "documentList": [
     "1101162904116", 
     "1101242722744"
    ]
   }, 
   {
    "date": "2004-08-26", 
    "count": 1, 
    "documentList": [
     "1101162903381"
    ]
   }, 
   {
    "date": "2004-08-27", 
    "count": 4, 
    "documentList": [
     "1101162881756", 
     "1101162902397", 
     "1101162902913", 
     "1101242721291"
    ]
   }, 
   {
    "date": "2004-08-28", 
    "count": 1, 
    "documentList": [
     "1201243446614"
    ]
   }, 
   {
    "date": "2004-08-30", 
    "count": 1, 
    "documentList": [
     "1101162881272"
    ]
   }, 
   {
    "date": "2004-09-01", 
    "count": 3, 
    "documentList": [
     "1101162879397", 
     "1101162880756", 
     "1101242700338"
    ]
   }, 
   {
    "date": "2004-09-02", 
    "count": 1, 
    "documentList": [
     "1101162863959"
    ]
   }, 
   {
    "date": "2004-09-03", 
    "count": 3, 
    "documentList": [
     "1101162862771", 
     "1101162863490", 
     "1101163941150"
    ]
   }, 
   {
    "date": "2004-09-07", 
    "count": 1, 
    "documentList": [
     "1101162809567"
    ]
   }, 
   {
    "date": "2004-09-08", 
    "count": 2, 
    "documentList": [
     "1101162807895", 
     "1101242678947"
    ]
   }, 
   {
    "date": "2004-09-09", 
    "count": 1, 
    "documentList": [
     "1101242678228"
    ]
   }, 
   {
    "date": "2004-09-10", 
    "count": 1, 
    "documentList": [
     "1101242657853"
    ]
   }, 
   {
    "date": "2004-09-13", 
    "count": 2, 
    "documentList": [
     "1101162688110", 
     "1101162788910"
    ]
   }, 
   {
    "date": "2004-09-14", 
    "count": 3, 
    "documentList": [
     "1101162787910", 
     "1101163932216", 
     "1101242657134"
    ]
   }, 
   {
    "date": "2004-09-15", 
    "count": 2, 
    "documentList": [
     "1101162787426", 
     "1101242656634"
    ]
   }, 
   {
    "date": "2004-09-16", 
    "count": 1, 
    "documentList": [
     "1101242636712"
    ]
   }, 
   {
    "date": "2004-09-17", 
    "count": 4, 
    "documentList": [
     "1101162786926", 
     "1101163941152", 
     "1101242535666", 
     "1101242635978"
    ]
   }, 
   {
    "date": "2004-09-20", 
    "count": 2, 
    "documentList": [
     "1101162770925", 
     "1101242634728"
    ]
   }, 
   {
    "date": "2004-09-21", 
    "count": 1, 
    "documentList": [
     "1101162769956"
    ]
   }, 
   {
    "date": "2004-09-22", 
    "count": 2, 
    "documentList": [
     "1101242614337", 
     "1101242614806"
    ]
   }, 
   {
    "date": "2004-09-23", 
    "count": 2, 
    "documentList": [
     "1101162769191", 
     "1101242613821"
    ]
   }, 
   {
    "date": "2004-09-24", 
    "count": 2, 
    "documentList": [
     "1101162768659", 
     "1101242612790"
    ]
   }, 
   {
    "date": "2004-09-27", 
    "count": 2, 
    "documentList": [
     "1101162708736", 
     "1101242587149"
    ]
   }, 
   {
    "date": "2004-09-29", 
    "count": 2, 
    "documentList": [
     "1101162707799", 
     "1101162708267"
    ]
   }, 
   {
    "date": "2004-09-30", 
    "count": 1, 
    "documentList": [
     "1101242586149"
    ]
   }, 
   {
    "date": "2004-10-01", 
    "count": 3, 
    "documentList": [
     "1101162691111", 
     "1101162707205", 
     "1101163941154"
    ]
   }, 
   {
    "date": "2004-10-04", 
    "count": 1, 
    "documentList": [
     "1101162688970"
    ]
   }, 
   {
    "date": "2004-10-05", 
    "count": 1, 
    "documentList": [
     "1101242565571"
    ]
   }, 
   {
    "date": "2004-10-06", 
    "count": 1, 
    "documentList": [
     "1101162687439"
    ]
   }, 
   {
    "date": "2004-10-07", 
    "count": 1, 
    "documentList": [
     "1101162686673"
    ]
   }, 
   {
    "date": "2004-10-08", 
    "count": 2, 
    "documentList": [
     "1101162641766", 
     "1101162642891"
    ]
   }, 
   {
    "date": "2004-10-09", 
    "count": 1, 
    "documentList": [
     "1101162589891"
    ]
   }, 
   {
    "date": "2004-10-12", 
    "count": 3, 
    "documentList": [
     "1101162624171", 
     "1101162640781", 
     "1101242563493"
    ]
   }, 
   {
    "date": "2004-10-13", 
    "count": 1, 
    "documentList": [
     "1101162623703"
    ]
   }, 
   {
    "date": "2004-10-15", 
    "count": 4, 
    "documentList": [
     "1101162622968", 
     "1101163941156", 
     "1101242542555", 
     "1101242543258"
    ]
   }, 
   {
    "date": "2004-10-18", 
    "count": 2, 
    "documentList": [
     "1101162607218", 
     "1101162607702"
    ]
   }, 
   {
    "date": "2004-10-19", 
    "count": 2, 
    "documentList": [
     "1101162605999", 
     "1101162606483"
    ]
   }, 
   {
    "date": "2004-10-20", 
    "count": 3, 
    "documentList": [
     "1101162605515", 
     "1101242518821", 
     "1101242519290"
    ]
   }, 
   {
    "date": "2004-10-21", 
    "count": 1, 
    "documentList": [
     "1101162541092"
    ]
   }, 
   {
    "date": "2004-10-22", 
    "count": 4, 
    "documentList": [
     "1101162539420", 
     "1101162539889", 
     "1101162540358", 
     "1101242518040"
    ]
   }, 
   {
    "date": "2004-10-25", 
    "count": 1, 
    "documentList": [
     "1101162524451"
    ]
   }, 
   {
    "date": "2004-10-26", 
    "count": 1, 
    "documentList": [
     "1101242497446"
    ]
   }, 
   {
    "date": "2004-10-27", 
    "count": 4, 
    "documentList": [
     "1101162507155", 
     "1101162522889", 
     "1101162523405", 
     "1101242496946"
    ]
   }, 
   {
    "date": "2004-10-29", 
    "count": 4, 
    "documentList": [
     "1101162504873", 
     "1101162505451", 
     "1101162506170", 
     "1101163941158"
    ]
   }, 
   {
    "date": "2004-11-01", 
    "count": 2, 
    "documentList": [
     "1101162490186", 
     "1101242473945"
    ]
   }, 
   {
    "date": "2004-11-02", 
    "count": 1, 
    "documentList": [
     "1101162488967"
    ]
   }, 
   {
    "date": "2004-11-03", 
    "count": 3, 
    "documentList": [
     "1101162488420", 
     "1101242452461", 
     "1101242453320"
    ]
   }, 
   {
    "date": "2004-11-04", 
    "count": 1, 
    "documentList": [
     "1101242451711"
    ]
   }, 
   {
    "date": "2004-11-05", 
    "count": 6, 
    "documentList": [
     "1101162468967", 
     "1101162469467", 
     "1101162469951", 
     "1101162470451", 
     "1101162470951", 
     "1101242430883"
    ]
   }, 
   {
    "date": "2004-11-08", 
    "count": 3, 
    "documentList": [
     "1101162453655", 
     "1101162454389", 
     "1101242429898"
    ]
   }, 
   {
    "date": "2004-11-09", 
    "count": 1, 
    "documentList": [
     "1101162452967"
    ]
   }, 
   {
    "date": "2004-11-10", 
    "count": 4, 
    "documentList": [
     "1101162433811", 
     "1101162452451", 
     "1101242407492", 
     "1101242407976"
    ]
   }, 
   {
    "date": "2004-11-11", 
    "count": 1, 
    "documentList": [
     "1101242406742"
    ]
   }, 
   {
    "date": "2004-11-12", 
    "count": 2, 
    "documentList": [
     "1101163941160", 
     "1101242406226"
    ]
   }, 
   {
    "date": "2004-11-14", 
    "count": 1, 
    "documentList": [
     "1201243446615"
    ]
   }, 
   {
    "date": "2004-11-16", 
    "count": 1, 
    "documentList": [
     "1101242386320"
    ]
   }, 
   {
    "date": "2004-11-17", 
    "count": 1, 
    "documentList": [
     "1101242385523"
    ]
   }, 
   {
    "date": "2004-11-19", 
    "count": 1, 
    "documentList": [
     "1101242384726"
    ]
   }, 
   {
    "date": "2004-11-26", 
    "count": 1, 
    "documentList": [
     "1101163941162"
    ]
   }, 
   {
    "date": "2004-12-10", 
    "count": 1, 
    "documentList": [
     "1101163941164"
    ]
   }, 
   {
    "date": "2004-12-24", 
    "count": 1, 
    "documentList": [
     "1101163941166"
    ]
   }
  ]
 }
];