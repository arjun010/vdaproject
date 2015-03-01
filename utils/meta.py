# Bradley Thwaites - March 1st 2015 - CS8803VDA

import os
import json

filenameList = os.listdir("../stego_dataset/")
outputJSON = []
for filename in filenameList:
    file = open("../stego_dataset/" + filename, 'r')
    lines = file.readlines()
    metaDataMap = {"title":lines[0].replace("\r\n",''), "date":'', "author":''}
    for line in lines:
        if "Date Published to Web:" in line:
            dateVals = line.split()[-1].split('/')
            tmp = dateVals[2]
            dateVals[2] = dateVals[1]
            dateVals[1] = dateVals[0] + '-'
            dateVals[0] = tmp + '-'
            dateString = ''.join(dateVals)
            metaDataMap["date"] = dateString
        if "Story by:" in line:
            author = ' '.join(line.split()[2:])
            metaDataMap["author"] = author

    outputJSON.append({"filename": filename, "metadata": metaDataMap})


print json.dumps(outputJSON, sort_keys=True, indent=4, separators=(',', ': '))
