 

/*
author: sitodav@gmail.com

Used when loading data -> to tell the library how to create the tree from the json data (for example from the server)
used when exporting data from tree -> to tell the library what fields from the tree put on the exported json


Example
if this is used for data loading via json data 

treesSchemaForBETasks: SitoTreeNodeSchema = {
    statusproperty: "status", -->tells the library to create the status in the tree node taking the status from the json input
    idproperty: "taskId", --> tells the library that id property on node will come from taskId in the json data
    childrenproperty: "children", ...etc
    textproperty: "text",
  };

if this is used for data exporting
 will tell the library to send the node id in the taskId json property for data element
 ...etc

 NB: on dataobject is applied a JSON.parse when in input (load data) and JSON.stringify when output (export)
*/
export interface SitoTreeNodeSchema {

     statusproperty : string,
     childrenproperty : string  ,
     idproperty : string,
     textproperty : string, 
     dataobject? : string,
     fathersproperty? : string //this is used only in export, because when loading father is something we generate , don't read

}




 



