import argparse
import pycurl
import json
import urllib
import re

from io import BytesIO

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

server_url = "https://q52gl5mw7d:k3u1ejwxrm@cs8803vda-search-clu-7980180164.us-east-1.bonsai.io"
status_list  = (("health", "Return the status of each cluster.", "/_cat/health?v"),
			  ("nodes", "List all nodes.", "/_cat/nodes?v"),
			  ("indices", "List all search indices.", "/_cat/indices?v"))


def get_term_indices(term, filename):
	#print bcolors.HEADER + "Showing indices for: \"" + term + "\" within " + filename + bcolors.ENDC

	# Special case caused by formatting issue in money entities from ner
	if(term[0] == "$"):
		term = term.replace(" ", "", 1)

	f = open("../data/dataset/" + filename, "r")
	text = f.read()
	indices = [match.start() for match in re.finditer(re.escape(term), text)]
	
	return indices




def do_search(term):
	print bcolors.HEADER + "Searching for: \"" + term + "\"" + bcolors.ENDC
	
	response_buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.URL, server_url + "/documents/_search?q=" + term)
	c.setopt(c.WRITEDATA, response_buffer)
	c.perform()
	c.close()

	body = response_buffer.getvalue()
	print(body.decode("iso-8859-1"))

	#json_string = json.dumps({"query": {"term":{"body":term}}, "size": 250, "highlight": {"fields": {"body":{"number_of_fragments" : 0}}}}, indent=4, separators=(',',':'),encoding="ISO-8859-1")
	#json_string = json.dumps({"query": {"term":{"body":term}}, "size": 250}, indent=4, separators=(',',':'),encoding="ISO-8859-1")
	#print json_string

	#c.setopt(c.POSTFIELDS, json_string)

def print_status(arg, arg_string):
	print bcolors.HEADER + arg + bcolors.ENDC

	response_buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.URL, server_url + arg_string)
	c.setopt(c.WRITEDATA, response_buffer)
	c.perform()
	c.close()
	body = response_buffer.getvalue()
	print(body.decode("iso-8859-1"))

def add_index(name):
	print bcolors.HEADER + "Attempting to add index: " + name + bcolors.ENDC

	response_buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.CUSTOMREQUEST, "PUT")
	c.setopt(c.URL, server_url + "/" + name + "?pretty")
	c.setopt(c.WRITEDATA, response_buffer)
	c.perform()
	c.close()
	body = response_buffer.getvalue()
	print(body.decode("iso-8859-1"))

def delete_index(name):
	print bcolors.HEADER + "Attempting to delete index: " + name + bcolors.ENDC
	
	response_buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.CUSTOMREQUEST, "DELETE")
	c.setopt(c.URL, server_url + "/" + name + "?pretty")
	c.setopt(c.WRITEDATA, response_buffer)
	c.perform()
	c.close()
	body = response_buffer.getvalue()
	print(body.decode("iso-8859-1"))

def add_document(filepath, index, typename):
	print bcolors.HEADER + "Attempting to insert document at: " + filepath \
		+ " into index: \"" + index + "\" with type: \"" + typename + "\"" +  bcolors.ENDC
	
	f = open(filepath, "r")
	contents = f.read()
	filename = filepath.split("/")[-1]
	json_string = json.dumps({"filename": filename, "body": contents}, indent=4, separators=(',',':'),encoding="ISO-8859-1")
	
	response_buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.URL, server_url + '/' + index + '/' + typename + '/')
	c.setopt(c.POSTFIELDS, json_string)
	c.perform()
	c.close()
	body = response_buffer.getvalue()
	print(body.decode("iso-8859-1"))
	

if __name__ == "__main__":
	parser = argparse.ArgumentParser(description="Use this script to interface with the Bonsai ElasticSearch servers.")

	for a in status_list:
		parser.add_argument("--" + a[0], dest=a[0], action="store_true",  help=a[1])

	parser.add_argument("--add_index", dest="add_name", nargs=1, help="Add a new index.")
	parser.add_argument("--delete_index", dest="delete_name", nargs=1, help="Delete an index.")
	parser.add_argument("--add_document", dest="document_info", nargs=3, help="Add a new document. Specify the document path followed by index name followed by type name.")
	parser.add_argument("--search", dest="term", nargs=1, help="Perform a search.")
	parser.add_argument("--term_indices", dest="term_indices", nargs=2, help="Show the offsets of \"term\" into the document. Specifiy term and then filename.")

	args=parser.parse_args()

	if args.health:
		print_status(status_list[0][0], status_list[0][2])
	if args.nodes:
		print_status(status_list[1][0], status_list[1][2])
	if args.indices:
		print_status(status_list[2][0], status_list[2][2])

	if args.add_name:
		add_index(args.add_name[0])
	if args.delete_name:
		delete_index(args.delete_name[0])
	if args.document_info:
		add_document(args.document_info[0], args.document_info[1], args.document_info[2])

	if args.term:
		do_search(args.term[0])

	if args.term_indices:
		print_term_indices(args.term_indices[0],args.term_indices[1])
