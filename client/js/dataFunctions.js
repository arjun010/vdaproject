var sessionEntityList = [
{
"entity_id": 246, 
"entity_name": "Herb Alpert", 
"entity_type": "person", 
"documents_containing": [
"1101162881756.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 247, 
"entity_name": "Jaime Lua", 
"entity_type": "person", 
"documents_containing": [
"1101163308494.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 248, 
"entity_name": "Russell Baker", 
"entity_type": "person", 
"documents_containing": [
"1101163941144.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 249, 
"entity_name": "Josie Moncado", 
"entity_type": "person", 
"documents_containing": [
"1101243446514.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 250, 
"entity_name": "Jim Sarducci.Among", 
"entity_type": "person", 
"documents_containing": [
"1101162903381.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 251, 
"entity_name": "Martha Alicia Vidales", 
"entity_type": "person", 
"documents_containing": [
"1101242586149.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 252, 
"entity_name": "Klein", 
"entity_type": "person", 
"documents_containing": [
"1101242898417.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}, 
{
"entity_id": 253, 
"entity_name": "Kris Gonzalez", 
"entity_type": "person", 
"documents_containing": [
"1101163520510.txt"
], 
"entity_aliases": [], 
"entity_frequency": 1
}
];



function createAlias(entities){
	var entity_name,indexInEntityList;
	for(var i=0;i<entities.length;i++){
		entity_name = entities[i]['entity_name'];
		indexInEntityList = entityNameIsInEntityList(entity_name);
		if(indexInEntityList!=-1){
			for(var j=0; j<entities.length; j++){
				if(entities[i]!=entities[j]){
					sessionEntityList[indexInEntityList]['entity_aliases'].push(entities[j]['entity_name']);
				}
			}
		}
	}
}


//returns index if entity name is present in the entity list else -1
function entityNameIsInEntityList(entityName){
	for(var i =0 ; i<sessionEntityList.length; i++){
		if(sessionEntityList[i]['entity_name']==entityName){
			return i;
		}
	}
	return -1;
}

function hello(){
	console.log("hi")
}