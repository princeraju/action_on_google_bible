import os
import json
from pathlib import Path

#variables
distFolder = "script_folderx/dist"
dataFile = "script_folderx/data.json"

#initialization
currentBook=0;

def createDistFolder(folderName):
	if not os.path.exists(folderName):
		os.makedirs(folderName)
		print("Created folder: "+folderName)
	else:
		for the_file in os.listdir(folderName):
			file_path = os.path.join(folderName, the_file)
			if os.path.isfile(file_path):
				os.unlink(file_path)
		print("Cleared the dist folder")


def createContentFile(fileLoc):
	file_path = Path(fileLoc)
	if not file_path.exists():
		f= open(fileLoc,"w+")
		data_json = { "data":[] }
		f.write(json.dumps(data_json));
		print("Created content file: "+fileLoc)
		f.close();

def writeContentToFile(fileLoc,data):
	f= open(fileLoc,"w+")
	f.write(json.dumps(data));
	f.close();

def json_list(list):
    lst = []
    d = {}
    for pn in list:
        d['mpn']=pn
        lst.append(d)
    return json.dumps(lst, separators=(',',':'))

print("dist Folder:"+distFolder)
createDistFolder(distFolder)


with open(dataFile, 'r') as myfile:
    data = json.load(myfile)

dataStore = data['resultset']['row']

fileLoc="";
bookContent=None;
for el in dataStore:
	field = el['field'];
	if(field[1]!=currentBook): #initializing file to write
		if(bookContent is not None):#writing to file the previous book
			writeContentToFile(fileLoc,bookContent); 

		currentBook=field[1];
		fileLoc = distFolder+"/"+str(currentBook)+"_content.json";
		createContentFile(fileLoc)
		with open(fileLoc, 'r') as file1:
			bookContent = json.load(file1)

	#print(json.dumps({ "id" : field[0] , "c" : field[2] , "v" : field[3] , "d" : field[4] } ))	
	bookContent["data"].append({ "id" : field[0] , "c" : field[2] , "v" : field[3] , "d" : field[4] } );

