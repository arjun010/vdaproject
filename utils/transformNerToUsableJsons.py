import json
from pprint import pprint
import os

#creating entity_list

json_data=open('ner.json')
data = json.load(json_data)

resList = []
uid = 0
for entity_type in data.keys():
	for entity_name in data[entity_type]['map'].keys():	
		resList.append({"entity_name":entity_name,"entity_type":entity_type,"entity_aliases":"","documents_containing":data[entity_type]['map'][entity_name],"entity_frequency":len(data[entity_type]['map'][entity_name]),"entity_id":uid})
		uid+=1

with open('entity_list.json', 'w') as outfile:
    json.dump(resList, outfile,indent=0)

#creating document_list

json_data=open('entity_list.json')
entities = json.load(json_data)
allDocs = os.listdir("dataset")

docId = 0
resList = []
for document in allDocs:
	list_of_entities_in_doc = []
	for entity in entities:
		for doc in entity['documents_containing']:
			if doc == document:
				list_of_entities_in_doc.append({"entity_id":entity['entity_id'],"entity_name":entity['entity_name'],"entity_type":entity['entity_type'],"starting_indexes":[],"length":0})

	resList.append({"doc_id":docId,"doc_title":document,"list_of_entities_in_doc":list_of_entities_in_doc})
	docId+=1

with open('document_list.json', 'w') as outfile:
    json.dump(resList, outfile,indent=0)


#creating date_list

date_file = open('dates.txt',"r")
data = date_file.readlines()
resList = []
dateId = 0
for dateLine in data:
	doc = dateLine.split(":")[0]
	date = dateLine.split(":")[1]
	date = date.rstrip()
	date = date.strip()
	resList.append({"date_id":dateId,"date":date,"document":doc})
	dateId+=1

with open('date_list.json', 'w') as outfile:
    json.dump(resList, outfile,indent=0)

#-----checking stuff------
"""
mysum = 0
for key in data.keys():
	mysum+=len(data[key]['map'].keys())

print mysum
"""