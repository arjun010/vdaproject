import ner
import os
import json

tagger = ner.SocketNER(host='localhost', port=8080, output_format='slashTags')

def unique(seq):
    seen = set()
    seen_add = seen.add
    return [ x for x in seq if not (x in seen or seen_add(x))]

# create a new dict to hold everything in
# keep a list, a dict, & count of each entity type as we go along
# also create a doc list with a map that gives all the entities
ents =    {
            'location':     {'list': [], 'map': {}, 'count': 0},
            'organization': {'list': [], 'map': {}, 'count': 0},
            'person':       {'list': [], 'map': {}, 'count': 0},
            'time':         {'list': [], 'map': {}, 'count': 0},
            'money':        {'list': [], 'map': {}, 'count': 0},
            'percent':      {'list': [], 'map': {}, 'count': 0},
            'date':         {'list': [], 'map': {}, 'count': 0},
            'doc':          {'list': [], 'map': {}}
            }

cats = ['LOCATION', 'PERSON', 'ORGANIZATION', 'TIME', 'MONEY', 'PERCENT', 'DATE']

# open up the stego dir
allFiles = os.listdir('./data/')
print(allFiles)

# loop through all of the files and run the NER on them
for f in allFiles:
    fPath = os.path.join('./data/', f)

    # check to make sure it is a text file
    if os.path.isfile(fPath) and f.endswith('.txt'):
        doc = open(fPath)
        t   = doc.read()
        e   = tagger.get_entities(t)

        allEntities = []
        # when the NER returns add all of the info for the entities and doc
        for c in cats:
            if c in e:
                ents[c.lower()]['count'] += len(e[c])
                # after we update the count get the unique list of entities
                u = unique(e[c])
                ents[c.lower()]['list'].extend(u)
                allEntities.extend(u)
                for o in u:
                    if o in ents[c.lower()]['map']:
                        ents[c.lower()]['map'][o].append(f)
                    else:
                        ents[c.lower()]['map'][o] = [f]


        ents['doc']['list'].append(f)
        ents['doc']['map'][f] = allEntities

# create a json out of the dict
out = json.dumps(ents)

# print the json or dump to a file if you can figure out how to format it better
print(out)