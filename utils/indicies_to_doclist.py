import bonsai_utils as bonsai
import json


### Actually puts the output in working.json to avoid any mistakes, so be sure to copy it over later ####


f = open("../data/document_list.json", "r")
text = f.read()
f.close()
j = json.loads(text)

for doc in j:
	for e in doc["list_of_entities_in_doc"]:
		indices = bonsai.get_term_indices(e["entity_name"], doc["doc_title"])
		e["length"] = len(e["entity_name"])
		e["starting_indexes"] = indices

new_text = json.dumps(j,indent=4, separators=(',',':'))

f = open("../data/working.json", "w")
f.write(new_text)
f.close()
